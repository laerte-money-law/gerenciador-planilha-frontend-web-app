import { Injectable } from "@angular/core";
import { NgbDatepickerI18n, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { TranslationWidth } from "@angular/common";

const I18N_VALUES = {
    weekdays: ["D", "S", "T", "Q", "Q", "S", "S"],
    months: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
};

@Injectable()
export class NgbDatepickerI18nPt extends NgbDatepickerI18n {
    getWeekdayShortName(weekday: number): string {
        return I18N_VALUES.weekdays[weekday - 1].substring(0, 1); // 'D', 'S', etc.
    }

    getMonthShortName(month: number): string {
        return I18N_VALUES.months[month - 1]; //.substring(0, 3); // 'Jan', 'Fev', etc.
    }

    getMonthFullName(month: number): string {
        return I18N_VALUES.months[month - 1];
    }

    getDayAriaLabel(date: NgbDateStruct): string {
        return `${date.day}-${date.month}-${date.year}`;
    }

    getWeekdayLabel(weekday: number, width?: TranslationWidth): string {
        return I18N_VALUES.weekdays[weekday - 1];
    }
}
