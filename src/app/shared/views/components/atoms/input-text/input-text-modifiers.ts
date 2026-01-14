export abstract class BaseInputTextModifier {
    public abstract modify(inputValue: string): string;
    when: "onKeyUp";
}

export class UpperCaseInputTextModifier extends BaseInputTextModifier {
    public override modify(inputValue: string): string {
        return inputValue.toUpperCase();
    }
}

export class LowerCaseInputTextModifier extends BaseInputTextModifier {
    public override modify(inputValue: string): string {
        return inputValue.toLowerCase();
    }
}

export class NameInputTextModifier extends BaseInputTextModifier {
    public override modify(inputValue: string): string {
        return inputValue?.changeCase("name");
    }
}

export class AlphanumericInputTextModifier extends BaseInputTextModifier {
    constructor(private _exceptions = []) {
        super();
    }
    public override modify(inputValue: string): string {
        const exceptionPattern = this._exceptions.map((exception) => `\\${exception}`).join("");
        const regexPattern = `[^a-zA-Z0-9${exceptionPattern}]`;
        return inputValue.replace(new RegExp(regexPattern, "g"), "");
    }
}

export class NumberInputTextModifier extends BaseInputTextModifier {
    constructor(private _thousandSeparator = ".") {
        super();
    }

    public override modify(inputValue: string): string {
        const inputWithOnlyNumbers = inputValue?.replace(/\D/g, "");
        return this.addThousandSeparator(inputWithOnlyNumbers);
    }

    private addThousandSeparator(str: string): string {
        if (str && this._thousandSeparator) {
            const reversedStr = str.split("").reverse().join(""); // Reverse the string
            const modifiedStr = reversedStr.replace(/(\d{3})(?=\d)/g, `$1${this._thousandSeparator}`); // Add a dot after every three digits except at the end
            const result = modifiedStr.split("").reverse().join(""); // Reverse the string back
            return result;
        }
        return str;
    }

    public get thousandSeparator() {
        return this._thousandSeparator;
    }
}
