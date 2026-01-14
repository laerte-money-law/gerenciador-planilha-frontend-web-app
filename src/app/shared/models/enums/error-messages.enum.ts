export class ErrorMessages {
    /**
     * Encontramos erros no preenchimento ${formName}. Por favor, corrija e tente novamente
     * @param formName
     * @returns
     */
    public static readonly FORM_HAS_ERRORS = (formName = "do formulário"): string =>
        `Encontramos erros no preenchimento ${formName}. Por favor, corrija e tente novamente`;
    public static readonly INPUT_FIELD_REQUIRED = (fieldName: string): string => `O campo '${fieldName}' é obrigatório.`;
    public static readonly SELECT_FIELD_REQUIRED = (fieldName: string): string =>
        `O campo '${fieldName}' é obrigatório. Por favor, selecione uma das opções disponíveis`;
    public static readonly INPUT_FIELD_INVALID = (fieldName: string): string => `O campo '${fieldName}' está inválido.`;
    public static readonly INPUT_FIELD_MASK_INCOMPLETE = (fieldName: string): string => `O campo '${fieldName}' está incompleto.`;
    /**
     * O endereço está incompleto. é necessário informar ${missingField}.
     * @param missingField
     * @returns
     */
    public static readonly ADDRESS_INCOMPLETE = (missingField): string =>
        `O endereço está incompleto. é necessário informar ${missingField}.`;
    public static readonly CHECKBOX_FIELD_REQUIRED = (isMultipleChoice: boolean): string =>
        `É obrigatório selecionar ${isMultipleChoice ? "pelo menos" : ""} uma opção.`;
    public static readonly DATE_TIMELINE_INVALID = (fieldName: string, shouldBeInFuture: boolean, shouldBeInPast: boolean): string => {
        if (shouldBeInFuture) {
            return `O campo '${fieldName}' precisa ser uma data igual ou posterior a data atual.`;
        }
        if (shouldBeInPast) {
            return `O campo '${fieldName}' precisa ser uma data igual ou anterior a data atual.`;
        }
        return "";
    };
}
