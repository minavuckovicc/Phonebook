import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AdditionalInfos {
    @PrimaryGeneratedColumn()
    id: number;

    @Column( { default: null } )
    birthDate: Date;

    @Column( { default: "" } )
    description: string;
}