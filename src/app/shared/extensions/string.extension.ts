declare global {
    interface String {
        changeCase(caseName: "name" | "title" | "camelCase" | "constant" | "capitalize"): string;
        parseInt(): number;
        parseFloat(locale?: string): number;
        parseBoolean(): boolean;
        contains(str: string): boolean;
        removeNonDigits(): string;
        removeAccents(): string;
        removeFormat(): string;
        substringUntilLast(str: string): string;
    }
}

String.prototype.changeCase = function (caseName: "name" | "title" | "camelCase" | "constant" | "capitalize"): string {
    switch (caseName) {
        case "name":
            return this.replace(/\w\S*/g, (txt) =>
                txt
                    .trim()
                    .replace(/\s+/g, " ")
                    .split(" ")
                    .map((word, index) => {
                        if (word) {
                            if (
                                word.toLowerCase() === "e" ||
                                word.toLowerCase() === "de" ||
                                word.toLowerCase() === "da" ||
                                word.toLowerCase() === "das" ||
                                word.toLowerCase() === "do" ||
                                word.toLowerCase() === "dos"
                            ) {
                                return word.toLowerCase();
                            }
                            return word[0].toUpperCase().concat(word.slice(1).toLowerCase());
                        }
                        return "";
                    })
                    .join(" ")
            );
        case "title":
            return this.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        case "camelCase":
            return this.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase())).replace(
                /\s+/g,
                ""
            );
        case "constant":
            return this.replace(/\s+/g, "_").toUpperCase();
        case "capitalize":
            return this.charAt(0).toUpperCase() + this.slice(1);
        default:
            throw new Error("Invalid case name.");
    }
};

String.prototype.removeAccents = function (): string {
    const accents = "ÀÁÂÃÄÅĄĀāàáâãäåąßÒÓÔÕÕÖØŐòóôőõöøĎďDŽdžÈÉÊËĘèéêëęðÇçČčĆćÐÌÍÎÏĪìíîïīÙÚÛÜŰùűúûüĽĹŁľĺłÑŇŃňñńŔŕŠŚŞšśşŤťŸÝÿýŽŻŹžżźđĢĞģğ";
    const accentsOut = "AAAAAAAAaaaaaaaaBOOOOOOOOoooooooDdDZdzEEEEEeeeeeeCcCcCcDIIIIIiiiiiUUUUUuuuuuLLLlllNNNnnnRrSSSsssTtYYyyZZZzzzdGGgg";
    return this.split("")
        .map((letter, index) => {
            const accentIndex = accents.indexOf(letter);
            return accentIndex !== -1 ? accentsOut[accentIndex] : letter;
        })
        .join("");
};

String.prototype.parseInt = function (): number | null {
    const str = this.toString();
    if (str) {
        const parsedInt = parseInt(str, 10);
        if (!isNaN(parsedInt)) {
            return parsedInt;
        }
    }
    return null;
};

String.prototype.parseFloat = function (locale: string = "BRL"): number | null {
    const str = this.toString();
    if (str) {
        if (locale == "BRL") {
            return parseFloat(str.replaceAll(".", "").replaceAll(",", "."));
        }
        const parsedFloat = parseFloat(str);
        if (!isNaN(parsedFloat)) {
            return parsedFloat;
        }
    }
    return null;
};

String.prototype.parseBoolean = function (): boolean {
    switch (this?.toLowerCase()?.trim()) {
        case "true":
        case "yes":
        case "1":
            return true;

        case "false":
        case "no":
        case "0":
        case null:
        case undefined:
            return false;

        default:
            return JSON.parse(this);
    }
};

String.prototype.contains = function (str): boolean {
    return this.indexOf(str) > -1;
};

String.prototype.removeNonDigits = function (): string {
    return this.replace(/\D/g, "");
};

String.prototype.removeFormat = function () {
    return this.replace(/(\.|\/|-| |[(]|[)]|_)/g, "");
};

String.prototype.substringUntilLast = function (str: string): string {
    const elements = this.split(str);
    delete elements[elements.length - 1];
    return elements.join("");
};

export {};
