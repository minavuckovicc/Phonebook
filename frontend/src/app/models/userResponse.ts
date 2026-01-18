import { User } from "./user";

export interface UserResponse {
    user: User;
    exp: number;
    iat: number;
}