import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { v1 as uuidv1 } from "uuid";
import { AppUrls } from "../../app.urls";
import { ErrorMessages } from "../models/enums/error-messages.enum";
import { environment } from "../../../environments/environment";

dayjs.extend(utc);

export class BaseView {
    URLS = AppUrls;
    ERROR_MESSAGES = ErrorMessages;
    locale: string = "pt-br";
    now = new Date();
    env = environment;
    featureFlags = {};

    generateRandomCode(): string {
        const uuid: string = uuidv1();
        return uuid.substring(0, 8);
    }

    formatBoolean(value: boolean): string {
        return value ? "Sim" : "Não";
    }

    formatNumber(value: number): string {
        if (value != null && value != undefined) {
            return value.toLocaleString("pt-BR");
        }
        return `-`;
    }

    formatPercentage(value: number): string {
        if (value != null && value != undefined) {
            return (value / 100).toLocaleString("pt-BR", { style: "percent", minimumFractionDigits: 2 });
        }
        return `-`;
    }

    formatCurrency(value: number): string {
        if (value != null && value != undefined) {
            if (typeof value === "string") value = parseFloat(value);
            return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
        }
        return `-`;
    }

    parseCurrency(value: string): number {
        if (value != null && value != undefined) {
            return parseFloat(value.replace("R$", "").replaceAll(".", "").replaceAll(",", "."));
        }
        return 0;
    }

    formatDate(value: Date, format: string = "DD/MM/YYYY"): string {
        return this.formatDateTime(value, format);
    }

    formatDateTime(value: Date, format: string = "DD/MM/YYYY HH:mm"): string {
        if (value != null && value != undefined) {
            return dayjs(value).locale(this.locale).format(format);
        }
        return `-`;
    }

    formatDateUTC(value: Date | string | null | undefined, format: string = "DD/MM/YYYY"): string {
        if (value == null) return "-";
        const d = dayjs.utc(value);
        return d.isValid() ? d.locale(this.locale).format(format) : "-";
    }

    formatFileSize(size: number): string {
        if (size < 0) return "0 B"; // Handle negative numbers safely

        const units = ["B", "KB", "MB", "GB", "TB", "PB"];
        let unitIndex = 0;
        let fileSize = size;

        while (fileSize >= 1000 && unitIndex < units.length - 1) {
            fileSize /= 1000;
            unitIndex++;
        }

        return fileSize >= 10 || unitIndex === 0
            ? `${Math.round(fileSize)} ${units[unitIndex]}`
            : `${fileSize.toFixed(1)} ${units[unitIndex]}`;
    }

    formatDocument(value: string, format?: "CNPJ" | "CPF" | null): string {
        if (value != null && value != undefined) {
            if (format == "CNPJ" || value.removeNonDigits().length === 14) {
                return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, `$1.$2.$3/$4-$5`);
            } else if (format == "CPF" || value.removeNonDigits().length === 11) {
                return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, `$1.$2.$3-$4`);
            }
        }
        return `-`;
    }

    isValidProcessNumber(value) {
        const regex = /^\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}$/;
        return regex.test(value);
    }

    formatPhone(value: string): string {
        if (value) {
            let brazilianNumber = value.removeNonDigits();
            if (brazilianNumber.length > 11) {
                brazilianNumber = brazilianNumber.substring(2);
            }

            const areaCode = brazilianNumber.substring(0, 2);
            const parts = brazilianNumber.length < 11 ? [4, 6, 8, 10] : [5, 7, 9, 11];
            const formattedParts = parts.map((part, index) => brazilianNumber.substring(index === 0 ? 2 : parts[index - 1], part));
            return `(${areaCode}) ${formattedParts.join(" ")}`;
        }
        return "-";
    }

    cropText(text: string, maxLength: number, keepLastChars?: number): string {
        keepLastChars = keepLastChars || 0;
        if (text && text.length > maxLength) {
            return text.substring(0, maxLength - keepLastChars) + "..." + text.substring(text.length - keepLastChars);
        }
        return text;
    }

    setFocusToFirstInputOrSelectElementInDiv(divId: string, scrollToDiv: boolean = false): void {
        setTimeout(() => {
            const divElement = document.getElementById(divId);
            if (divElement) {
                if (scrollToDiv) {
                    divElement.scrollIntoView({ behavior: "smooth" });
                }

                const selectElement = divElement.querySelector("select");
                const inputElement = divElement.querySelector("input");

                if (selectElement && inputElement) {
                    if (selectElement.compareDocumentPosition(inputElement) & Node.DOCUMENT_POSITION_FOLLOWING) {
                        selectElement.focus();
                    } else {
                        inputElement.focus();
                    }
                } else {
                    (selectElement || inputElement)?.focus();
                }
            }
        }, 150);
    }
}
