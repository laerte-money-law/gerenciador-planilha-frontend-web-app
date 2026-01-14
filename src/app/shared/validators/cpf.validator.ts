import { BaseValidator } from "./base.validator";

export class CpfValidator extends BaseValidator {
    public override isValid(cpf: string): boolean {
        return CpfValidator.isValidCpf(cpf);
    }

    public static isValidCpf(cpf: string): boolean {
        const cleanedCPF = this.removeNonDigitsChar(cpf);

        if (!this.checksIfCpfLengthIsCorrect(cleanedCPF)) {
            return false;
        }

        if (!this.checksIfAllCpfDigitsAreEquals(cleanedCPF)) {
            return false;
        }

        if (!this.checksIfFirstVerificationDigitIsCorrect(cleanedCPF)) {
            return false;
        }

        if (!this.checksIfSecondVerificationDigitIsCorrect(cleanedCPF)) {
            return false;
        }

        return true;
    }

    private static checksIfSecondVerificationDigitIsCorrect(cpf: string) {
        // Validates the second verification digit
        let sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf[i]) * (11 - i);
        }
        let verificationDigit = 11 - (sum % 11);
        if (verificationDigit >= 10) {
            verificationDigit = 0;
        }
        if (parseInt(cpf[10]) !== verificationDigit) {
            return false;
        }
        return true;
    }

    private static checksIfFirstVerificationDigitIsCorrect(cpf: string): boolean {
        // Validates the first verification digit
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf[i]) * (10 - i);
        }
        let verificationDigit = 11 - (sum % 11);
        if (verificationDigit >= 10) {
            verificationDigit = 0;
        }
        if (parseInt(cpf[9]) !== verificationDigit) {
            return false;
        }
        return true;
    }

    private static checksIfAllCpfDigitsAreEquals(cpf: string): boolean {
        const digitsAreSame = cpf.split("").every((digit) => digit === cpf[0]);
        if (digitsAreSame) {
            return false;
        }
        return true;
    }

    private static checksIfCpfLengthIsCorrect(cpf: string): boolean {
        if (cpf.length !== 11) {
            return false;
        }
        return true;
    }

    private static removeNonDigitsChar(cpf: string): string {
        if (cpf) {
            return cpf.replace(/\D/g, "");
        }
        return "";
    }
}
