import { BaseValidator } from "./base.validator";

export class EmailValidator extends BaseValidator {
    constructor(errorMessage: string = null) {
        super(errorMessage);
    }
    override isValid(email: string): boolean {
        const regex = new RegExp(
            /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/
        );
        email = email.trim();
        let isValid = regex.test(email);
        if (isValid) {
            isValid =
                email.length >= BaseValidator.FIELDS.TEXT.MIN_LENGTH &&
                email.length <= BaseValidator.FIELDS.TEXT.MAX_LENGTH &&
                email.split("@")[0].length <= BaseValidator.FIELDS.EMAIL.USERNAME.MAX_LENGTH &&
                email.split("@")[0].length >= BaseValidator.FIELDS.EMAIL.USERNAME.MIN_LENGTH &&
                email.split("@")[1].substringUntilLast(".").length <=
                    BaseValidator.FIELDS.EMAIL.DOMAIN.HOST.MAX_LENGTH &&
                email.split("@")[1].substringUntilLast(".").length >=
                    BaseValidator.FIELDS.EMAIL.DOMAIN.HOST.MIN_LENGTH &&
                email.split(".").last().length >= BaseValidator.FIELDS.EMAIL.DOMAIN.TOP_LEVEL.MIN_LENGTH &&
                email.split(".").last().length <= BaseValidator.FIELDS.EMAIL.DOMAIN.TOP_LEVEL.MAX_LENGTH;
        }
        return isValid;
    }
}
