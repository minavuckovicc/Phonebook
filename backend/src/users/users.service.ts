import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PhoneDto } from 'src/dto/phone.dto';
import { UserDto } from 'src/dto/user.dto';
import { AdditionalInfos } from 'src/entities/additional-infos.entity';
import { Phone } from 'src/entities/phone.entity';
import { User, UserRole } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Phone) private phoneRepository: Repository<Phone>,
        @InjectRepository(AdditionalInfos) private addInfosRepository: Repository<AdditionalInfos>
        ) {}

    public getAll() {
        return this.userRepository.find({
            relations: { additionalInfos: true, phones: true }
        });
    }

    public getById(id: number) {
        return this.userRepository.findOne({
            where: {id},
            relations: { additionalInfos: true, phones: true }
        });
    }
//koristim DTO da bi back mogao da kontrolise koje podatke prihvata sa fronta
    public async create(userDto: UserDto){
        const hashedPassword = userDto.password ? await bcrypt.hash(userDto.password, 12) : null;
        const user = this.userRepository.create({
            ...userDto,
            password: hashedPassword ?? undefined,
            role: UserRole.USER,
            additionalInfos: userDto.additionalInfos ?? {},
            phones: userDto.phones ?? [],
        });
        return await this.userRepository.save(user);
    }

    public async delete(id: number){
        const user = await this.getById(id);
        if (!user) return;

        const phoneIds = (user.phones ?? []).map((p) => p.id);
        const addInfosId = user.additionalInfos?.id;

        if (phoneIds.length) {
            await this.phoneRepository.delete(phoneIds);
        }
        await this.userRepository.delete(id);
        if (addInfosId) {
            await this.addInfosRepository.delete(addInfosId);
        }
        return;
    }

    public async update(userId: number, addInfosId: number, dto: UserDto){
        const userDto = {
            firstName: dto.firstName,
            lastName: dto.lastName
        }
        const addInfosDto = {
            birthDate: dto.additionalInfos.birthDate,
            description: dto.additionalInfos.description
        }
        await this.addInfosRepository.update(addInfosId, addInfosDto);
        await this.userRepository.update(userId, userDto);
        return await this.getById(userId);
    }

    public async addPhoneNumber(userId: number, phoneDto: PhoneDto){
        const phone = this.phoneRepository.create(phoneDto);
        let user = await this.getById(userId);
        user.phones.push(phone);
        return await this.userRepository.save(user);
    }

    public async removePhoneNumber(phoneId: number, userId: number){
        await this.phoneRepository.delete(phoneId);
        return await this.getById(userId);
    }

    public async getUsersByName(string: string) {
        let users2: User[] = [];
        const users: User[] = await this.getAll();
        if (string !== "") {
            users.forEach((user: User) => {
                let name = user.firstName + " " + user.lastName;
                name = name.toLowerCase();
                if (name.indexOf(string) !== -1) users2.push(user);
            });
            return users2;
        }
        else return users;
    }
}
