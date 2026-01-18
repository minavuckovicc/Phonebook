import { User } from "./user";

export interface Phone {
    id: number;
    number: string;
    user: User;
}