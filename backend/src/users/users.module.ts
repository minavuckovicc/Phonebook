import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { AdditionalInfos } from 'src/entities/additional-infos.entity';
import { Phone } from 'src/entities/phone.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, AdditionalInfos, Phone])],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
