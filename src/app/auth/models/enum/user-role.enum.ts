export enum UserRoleEnum {
    ADMIN = "ADMIN",
    CONSULTANT = "CONSULTANT",
    CLIENT = "CLIENT",
    USER = "USER",
}

export const getUserRoleEnumLabel = (type: UserRoleEnum) => {
    switch (type) {
        case UserRoleEnum.ADMIN:
            return "Administrador";
        case UserRoleEnum.CONSULTANT:
            return "Consultor";
        case UserRoleEnum.CLIENT:
            return "Cliente";
        case UserRoleEnum.USER:
            return "Usuário";
    }
};
