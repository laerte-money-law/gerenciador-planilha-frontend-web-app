import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import dayjs from "dayjs";
import { BaseInputComponent } from "../base-input.component";
import { DateService } from "../../../../services/date.service";
import { InputDateDto } from "src/app/shared/models/input-date.dto";

@Component({
    selector: "app-input-date",
    templateUrl: "./input-date.component.html",
    styleUrls: [],
})
export class InputDateComponent extends BaseInputComponent implements OnInit {
    @Input() fieldName: string;
    @Input() label: string = null;
    @Input() ageCalculationRelativePrefix: string;
    @Input() showAgeCalculation: boolean = false;
    @Input() canBeFutureDate: boolean = true;
    @Input() canBePastDate: boolean = true;
    @Input() required: boolean = false;
    @Input() showTime: boolean = false;
    @Input() initialValue: Date;
    @Input() referenceDate: Date = new Date();
    @Input() readOnly: boolean = false;
    @Input() displayInline: boolean = false;
    @Input() helperText: string;
    @Output() onDateChanges = new EventEmitter<InputDateDto>();
    protected selectedDate = null;
    protected ageToString = null;
    protected isValidated: boolean = false;
    protected valid: boolean = true;
    protected errorMessage: string = "";
    protected isSelectedDateInInvalidTimeline: boolean = false;

    onDateChange() {
        this.onDateChanges.emit(this.selectedDate);
    }

    constructor(private readonly dateService: DateService) {
        super();
    }

    ngOnInit(): void {
        this.fieldName = this.fieldName || this.label;
        this.setInputId(this.fieldName);
        this.setSelectedDate(this.initialValue);
    }

    getSelectedDate(): Date | null {
        if (this.selectedDate) {
            return this.getSelectedDateAsDayjsDate().toDate();
        }
        return null;
    }

    changeDate(date: Date): void {
        this.setSelectedDate(date);
    }

    validate(): boolean {
        this.isValidated = true;
        this.valid = true;
        if (this.required && !this.getSelectedDate()) {
            this.valid = false;
            this.errorMessage = this.ERROR_MESSAGES.INPUT_FIELD_REQUIRED(this.fieldName);
            console.info(`Componente ${this.fieldName} está inválido por motivos de obrigatoriedade`);
        } else if (!!this.getSelectedDate() && this.isSelectedDateInInvalidTimeline) {
            this.errorMessage = this.ERROR_MESSAGES.DATE_TIMELINE_INVALID(this.fieldName, !this.canBePastDate, !this.canBeFutureDate);
            this.valid = false;
            console.info(`Componente ${this.fieldName} está inválido por motivos de data inválida`);
        }

        return this.valid;
    }

    isValid(): boolean {
        return this.valid;
    }

    protected onChangeDate(): void {
        this.calculateIfDateIsInWrongTimeline();
        this.calculateAgeAndShowAsHelper();
        if (this.isValidated) {
            this.validate();
        }

        const inputValueDate = {
            fieldName: this.fieldName,
            selectedDate: this.selectedDate,
        };

        this.onDateChanges.emit(inputValueDate);
    }

    private getSelectedDateAsDayjsDate(): dayjs.Dayjs {
        return dayjs(this.selectedDate);
    }

    private calculateIfDateIsInWrongTimeline(): void {
        const isSelectedDateInPast = this.showTime
            ? this.getSelectedDateAsDayjsDate().isBefore(dayjs(this.referenceDate))
            : this.getSelectedDateAsDayjsDate().isBefore(dayjs(this.referenceDate).startOf("day"));
        const isSelectedDateInFuture = this.showTime
            ? this.getSelectedDateAsDayjsDate().isAfter(dayjs(this.referenceDate))
            : this.getSelectedDateAsDayjsDate().isAfter(dayjs(this.referenceDate).endOf("day"));

        this.isSelectedDateInInvalidTimeline =
            (!this.canBePastDate && isSelectedDateInPast) || (!this.canBeFutureDate && isSelectedDateInFuture);
    }

    private calculateAgeAndShowAsHelper() {
        this.ageToString = "";
        if (this.showAgeCalculation && !!this.getSelectedDateAsDayjsDate() && !this.isSelectedDateInInvalidTimeline) {
            const date = this.getSelectedDateAsDayjsDate().toDate();
            this.ageToString = this.dateService.ageToString(date, this.referenceDate);
        }
    }

    private setSelectedDate(date: Date) {
        if (date && dayjs(date).isValid()) {
            const format = this.showTime ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD";
            this.selectedDate = dayjs(date).format(format);
            this.onChangeDate();
            return;
        }
        this.selectedDate = null;
    }
}
