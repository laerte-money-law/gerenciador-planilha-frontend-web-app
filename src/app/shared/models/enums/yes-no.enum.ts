export enum YesNoEnum {
    YES = "YES",
    NO = "NO",
}

export const getYesNoEnumLabel = (type: YesNoEnum) => {
    switch (type) {
        case YesNoEnum.YES:
            return "Sim";
        case YesNoEnum.NO:
            return "Não";
    }
};
