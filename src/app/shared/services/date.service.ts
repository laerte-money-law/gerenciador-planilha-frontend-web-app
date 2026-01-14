import { Injectable } from "@angular/core";
import dayjs from "dayjs";

@Injectable({
    providedIn: "root",
})
export class DateService {
    constructor() {}

    ageToString(
        date: Date,
        onDate: Date = new Date(),
        short: boolean = false,
        includeRelativePrefix?: boolean,
        includeWeeks?: boolean
    ): string {
        try {
            date = dayjs(date).toDate();
            const age = this.calculateAge(date, onDate, includeWeeks);

            let response = "";

            if (age.days == 0 && (!age.weeks || age.weeks == 0) && age.months == 0 && age.years == 0) {
                return "hoje";
            }

            if (includeRelativePrefix) {
                const prefix = date.getTime() < onDate.getTime() ? "faz" : "daqui a";
                response = `${prefix.trim()} ${short ? "± " : ""}${response}`;
            }

            if (age.years > 0) {
                response += `${age.years} ${age.years > 1 ? "anos" : "ano"}`;
                if (short) {
                    return response;
                }
                response += `${age.months && age.days ? ", " : age.months || age.days || (includeWeeks && age.weeks) ? " e " : ""}`;
            }
            if (age.months > 0) {
                response += `${age.months} ${age.months > 1 ? "meses" : "mês"}`;
                if (short) {
                    return response;
                }
                response += `${age.days || (includeWeeks && age.weeks) ? " e " : ""}`;
            }
            if (includeWeeks && age.weeks > 0) {
                response += `${age.weeks} ${age.weeks > 1 ? "semanas" : "semana"}`;
                if (short) {
                    return response;
                }
                response += `${age.days ? " e " : ""}`;
            }
            if (age.days > 0) {
                response += `${age.days} ${age.days > 1 ? "dias" : "dia"}`;
            }

            return response;
        } catch (error) {
            console.error(error);
            return "";
        }
    }

    calculateAge(
        date: Date,
        onDate: Date = new Date(),
        includeWeeks: boolean = false
    ): { years: number; months: number; weeks?: number; days: number } {
        date = dayjs(date).toDate();
        onDate = dayjs(onDate).toDate();
        const afterDate = date.getTime() > onDate.getTime() ? date : onDate;
        const beforeDate = date.getTime() < onDate.getTime() ? date : onDate;

        let years = afterDate.getFullYear() - beforeDate.getFullYear();
        let months = afterDate.getMonth() - beforeDate.getMonth();
        let days = 0;

        if (months < 0 || (months === 0 && afterDate.getDate() < beforeDate.getDate())) {
            years--;
            months += 12;
        }

        if (afterDate.getDate() > beforeDate.getDate()) {
            days = afterDate.getDate() - beforeDate.getDate();
        } else if (afterDate.getDate() < beforeDate.getDate()) {
            days = dayjs(beforeDate).daysInMonth() - beforeDate.getDate() + afterDate.getDate();
            months--;
        }

        if (includeWeeks) {
            const weeks = Math.floor(days / 7);
            days -= weeks * 7;
            return { years, months, weeks, days };
        }

        return { years, months, days };
    }

    formatTwoDates(firstDate: Date, secondDate: Date): string {
        const first = dayjs(firstDate);
        const second = dayjs(secondDate);
        if (firstDate.getMonth() === secondDate.getMonth() && firstDate.getFullYear() === secondDate.getFullYear()) {
            return `${first.format("DD")} e ${second.format("DD")} de ${first.format("MMMM")} de ${firstDate.getFullYear()}`;
        } else if (firstDate.getFullYear() === secondDate.getFullYear()) {
            return `${first.format("DD")} de ${first.format("MMMM")} e ${second.format("DD")} de ${second.format(
                "MMMM"
            )} de ${firstDate.getFullYear()}`;
        } else {
            return `${first.format("DD")} de ${first.format("MMMM")} de ${firstDate.getFullYear()} e ${second.format(
                "DD"
            )} de ${second.format("MMMM")} de ${secondDate.getFullYear()}`;
        }
    }
}
