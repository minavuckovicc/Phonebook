import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import { Observable, from, map, switchMap, throwError } from 'rxjs';
import { User, UserRole } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) 
        private userRepository: Repository<User>,
        private jwtService: JwtService
    ) {}

    hashPassword(password: string): Observable<string> {
        return from(bcrypt.hash(password, 12));
    }

    registerAccount(user: User): Observable<User> {
        const { password } = user;

        return this.hashPassword(password).pipe(
            switchMap((hashedPassword: string) => {
                return from(this.userRepository.save({
                    ...user,
                    password: hashedPassword,
                    role: UserRole.USER,
                    additionalInfos: {
                        
                    }
                })).pipe(
                    map((user: User) => {
                        delete user.password;
                        return user;
                    })
                );
            }),
        );
    }

    validateUser(email: string, password: string): Observable<User> {
        return from(this.userRepository.findOne({ 
            where: { email },
            select: ['id', 'firstName', 'lastName',
            'email', 'password', 'role'],
            relations: ['additionalInfos', 'phones']
            })).pipe(
                switchMap((user: User | null) => {
                    if (!user) {
                        return throwError(() => new UnauthorizedException("Invalid credentials"));
                    }
                    return from(bcrypt.compare(password, user.password)).pipe(
                        map((isValidPassword: boolean) => {
                            if(!isValidPassword) {
                                throw new UnauthorizedException("Invalid credentials");
                            }
                            delete user.password;
                            return user;
                        }),
                    );
                }),
        );
    }

    login(user: User): Observable<string> {
        const { email, password } = user;
        return this.validateUser(email, password).pipe(
            switchMap((user: User) => {
                return from(this.jwtService.signAsync({ user }));
            }),
        );
    }

    async ensureDefaultAdmin(): Promise<void> {
        const adminEmail = process.env.ADMIN_EMAIL ?? "admin@phonebook.local";
        const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin123!";

        const existing = await this.userRepository.findOne({
            where: { email: adminEmail },
            select: ["id", "role"],
        });

        const hashedPassword = await bcrypt.hash(adminPassword, 12);

        if (existing) {
            await this.userRepository.update(existing.id, {
                role: UserRole.ADMIN,
                password: hashedPassword,
            });
            return;
        }

        await this.userRepository.save({
            firstName: "Admin",
            lastName: "User",
            email: adminEmail,
            password: hashedPassword,
            role: UserRole.ADMIN,
            additionalInfos: {},
            phones: [],
        });
    }
}
