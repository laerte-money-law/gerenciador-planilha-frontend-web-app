import { UserInfoDto } from "../../../shared/models/user-info.dto";

export class UserClientInfoDto extends UserInfoDto {
    clientCode: string;
    companyName: string;
    cnpj: string;

    constructor(props: Partial<UserClientInfoDto>) {
        super(props);
        Object.assign(this, props);
    }
}
