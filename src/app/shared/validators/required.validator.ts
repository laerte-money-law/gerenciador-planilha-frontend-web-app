import { BaseValidator } from "./base.validator";

export class RequiredValidator extends BaseValidator {
    constructor(errorMessage: string = null) {
        super(errorMessage, true);
    }
    override isValid(text: string): boolean {
        return text !== null && text !== undefined && text.trim().length > 0;
    }
}
