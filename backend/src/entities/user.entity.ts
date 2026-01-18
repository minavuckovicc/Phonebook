import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AdditionalInfos } from "./additional-infos.entity";
import { Phone } from "./phone.entity";

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

    @OneToOne(() => AdditionalInfos, { cascade: true })
    @JoinColumn()
    additionalInfos: AdditionalInfos

    @OneToMany(() => Phone, (phone) => phone.user, { cascade: true })
    phones: Phone[]
}