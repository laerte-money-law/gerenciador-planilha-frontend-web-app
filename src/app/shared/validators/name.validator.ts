import { BaseValidator } from "./base.validator";

export class NameValidator extends BaseValidator {
    constructor(errorMessage: string = null) {
        super(errorMessage);
    }
    override isValid(text: string, minQty: number = 2): boolean {
        const names: string[] = text.trim().replace(/\s+/g, " ").split(" ");

        return (
            names.filter(
                (text) =>
                    text.length >= 3 &&
                    text.toLowerCase() !== "e" &&
                    text.toLowerCase() !== "de" &&
                    text.toLowerCase() !== "da" &&
                    text.toLowerCase() !== "das" &&
                    text.toLowerCase() !== "do" &&
                    text.toLowerCase() !== "dos"
            ).length >= minQty
        );
    }
}
