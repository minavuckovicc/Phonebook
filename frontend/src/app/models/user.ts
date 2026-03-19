import { AdditionalInfos } from "./additional-infos";
import { Phone } from "./phone";

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role?: 'USER' | 'ADMIN';
    additionalInfos: AdditionalInfos;
    phones: Phone[];
}