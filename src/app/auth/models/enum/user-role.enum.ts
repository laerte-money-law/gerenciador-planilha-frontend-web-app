export enum UserRoleEnum {
    ADMIN = "ADMIN",
    CONSULTANT = "CONSULTANT",
    CLIENT = "CLIENT",
}

export const getUserRoleEnumLabel = (type: UserRoleEnum) => {
    switch (type) {
        case UserRoleEnum.ADMIN:
            return "Administrador";
        case UserRoleEnum.CONSULTANT:
            return "Consultor";
        case UserRoleEnum.CLIENT:
            return "Cliente";
    }
};
