import { AdditionalInfos } from "src/entities/additional-infos.entity";
import { Phone } from "src/entities/phone.entity";
import { User } from "src/entities/user.entity";
import { ConnectionOptions } from "typeorm";


export const typeOrmConfig: ConnectionOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'mysecretpassword',
    database: 'users',
    entities: [User, AdditionalInfos, Phone],
    synchronize: true
}