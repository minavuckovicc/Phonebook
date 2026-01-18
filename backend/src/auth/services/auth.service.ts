import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import { Observable, from, map, switchMap } from 'rxjs';
import { User } from 'src/entities/user.entity';
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
            'email', 'password'],
            relations: ['additionalInfos', 'phones']
            })).pipe(
                switchMap((user: User) => 
                    from(bcrypt.compare(password, user.password)).pipe(
                        map((isValidPassword: boolean) => {
                            if(isValidPassword) {
                                delete user.password;
                                return user;
                            }
                        }),
                    ),
                ),
        );
    }

    login(user: User): Observable<string> {
        const { email, password } = user;
        return this.validateUser(email, password).pipe(
            switchMap((user: User) => {
                if (user) {
                    return from(this.jwtService.signAsync({ user }));
                }
            }),
        );
    }

}
