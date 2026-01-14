export enum StatusEnum {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}

export const getStatusEnumLabel = (type: StatusEnum) => {
    switch (type) {
        case StatusEnum.ACTIVE:
            return "Ativo";
        case StatusEnum.INACTIVE:
            return "Inativo";
    }
};
