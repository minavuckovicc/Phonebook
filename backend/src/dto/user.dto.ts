import { AdditionalInfosDto } from "./additional-infos.dto";
import { PhoneDto } from "./phone.dto";

export class UserDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    additionalInfos: AdditionalInfosDto;
    phones: PhoneDto[];
}