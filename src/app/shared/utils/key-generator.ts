import { CryptoWordList } from "./crypto-word-list";

export class KeyGenerator {
    public static generateCryptoBasedPassword(): string {
        const wordQty = 2;
        const separators = ["-", "_", "&", "*", "#", ".", "@"];
        const separator = separators[Number.randomInt(0, separators.length - 1)];
        const number = Number.randomInt(100, 999);
        const wordList = CryptoWordList.WORDS_BR.filter((e) => e.length > 3);

        let password = "";
        for (let i = 0; i < wordQty; i++) {
            const wordIndex = Number.randomInt(0, wordList.length - 1);
            const word = wordList[wordIndex];
            password += word.changeCase("capitalize") + separator;
        }
        password += number;

        return password;
    }
}
