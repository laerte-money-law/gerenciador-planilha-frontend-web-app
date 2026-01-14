import { BaseValidator } from "./base.validator";

export class PhoneValidator extends BaseValidator {
    constructor(errorMessage: string = null) {
        super(errorMessage);
    }
    public override isValid(phone: string): boolean {
        const regex = new RegExp(/^[0-9 ()-]+$/);
        const phoneLength = phone.toString().removeNonDigits().replace(" ", "").length;
        return (
            regex.test(phone) &&
            phoneLength <= BaseValidator.FIELDS.PHONE.MAX_LENGTH &&
            phoneLength >= BaseValidator.FIELDS.PHONE.MIN_LENGTH
        );
    }
}
