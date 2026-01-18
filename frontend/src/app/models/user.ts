import { AdditionalInfos } from "./additional-infos";
import { Phone } from "./phone";

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    additionalInfos: AdditionalInfos;
    phones: Phone[];
}