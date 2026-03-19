import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AdditionalInfos } from "./additional-infos.entity";
import { Phone } from "./phone.entity";

export enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN",
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column( { unique: true })
    email: string;

    @Column({ nullable: true, select: false })
    password: string;

    @Column({
        type: "varchar",
        default: UserRole.USER,
    })
    role: UserRole;

    @OneToOne(() => AdditionalInfos, { cascade: true })
    @JoinColumn()
    additionalInfos: AdditionalInfos

    @OneToMany(() => Phone, (phone) => phone.user, { cascade: true })
    phones: Phone[]
}