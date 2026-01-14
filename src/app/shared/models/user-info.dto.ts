import { UserRoleEnum } from "../../auth/models/enum/user-role.enum";

export class UserInfoDto {
    code: number;
    name: string;
    email: string;
    phone: string;
    role: UserRoleEnum;

    constructor(props: Partial<UserInfoDto>) {
        Object.assign(this, props);
    }

    isAdmin(): boolean {
        return this.role === UserRoleEnum.ADMIN;
    }
}
