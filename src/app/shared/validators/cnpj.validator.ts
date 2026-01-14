import { BaseValidator } from "./base.validator";

export class CnpjValidator extends BaseValidator {
    public override isValid(cnpj: string): boolean {
        return CnpjValidator.isValidCnpj(cnpj);
    }

    public static isValidCnpj(cnpj: string): boolean {
        const cleanedCNPJ = this.removeNonDigitsChar(cnpj);

        if (!this.checksIfCnpjLengthIsCorrect(cleanedCNPJ)) {
            return false;
        }

        if (!this.checksIfAllCnpjDigitsAreEquals(cleanedCNPJ)) {
            return false;
        }

        if (!this.checksIfFirstVerificationDigitIsCorrect(cleanedCNPJ)) {
            return false;
        }

        if (!this.checksIfSecondVerificationDigitIsCorrect(cleanedCNPJ)) {
            return false;
        }

        return true;
    }

    private static checksIfFirstVerificationDigitIsCorrect(cnpj: string): boolean {
        let sum = 0;
        const weights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        for (let i = 0; i < 12; i++) {
            sum += parseInt(cnpj[i]) * weights[i];
        }
        let verificationDigit = 11 - (sum % 11);
        verificationDigit = verificationDigit >= 10 ? 0 : verificationDigit;

        return parseInt(cnpj[12]) === verificationDigit;
    }

    private static checksIfSecondVerificationDigitIsCorrect(cnpj: string): boolean {
        let sum = 0;
        const weights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        for (let i = 0; i < 13; i++) {
            sum += parseInt(cnpj[i]) * weights[i];
        }
        let verificationDigit = 11 - (sum % 11);
        verificationDigit = verificationDigit >= 10 ? 0 : verificationDigit;

        return parseInt(cnpj[13]) === verificationDigit;
    }

    private static checksIfAllCnpjDigitsAreEquals(cnpj: string): boolean {
        const digitsAreSame = cnpj.split("").every((digit) => digit === cnpj[0]);
        return !digitsAreSame;
    }

    private static checksIfCnpjLengthIsCorrect(cnpj: string): boolean {
        return cnpj.length === 14;
    }

    private static removeNonDigitsChar(cnpj: string): string {
        if (cnpj) {
            return cnpj.replace(/\D/g, "");
        }
        return "";
    }
}
