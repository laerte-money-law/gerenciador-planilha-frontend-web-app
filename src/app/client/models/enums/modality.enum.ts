export enum ModalityEnum {
    DEPOSITO_RECURSAL = "DEPOSITO_RECURSAL",
    JUDICIAL_TRABALHISTA = "JUDICIAL_TRABALHISTA",
    JUDICIAL_CIVIL = "JUDICIAL_CIVIL",
    JUDICIAL_FISCAL = "JUDICIAL_FISCAL",
}

export const Modalities = {
    DEPOSITO_RECURSAL: {
        key: ModalityEnum.DEPOSITO_RECURSAL,
        text: "Depósito Recursal",
    },
    JUDICIAL_TRABALHISTA: { key: ModalityEnum.JUDICIAL_TRABALHISTA, text: "Judicial Trabalhista" },
    JUDICIAL_CIVIL: { key: ModalityEnum.JUDICIAL_CIVIL, text: "Judicial Cível" },
    JUDICIAL_FISCAL: { key: ModalityEnum.JUDICIAL_FISCAL, text: "Judicial Fiscal" },
    toList: (): { key: string; text: string }[] => {
        return Object.entries(Modalities)
            .filter((e) => e[1]["text"])
            .map(([key, value]) => ({ key: value["key"], text: value["text"] }));
    },
    getTextFromKey: (key: string): string => {
        return Modalities.toList().find((e) => e.key === key)?.text;
    },
};
