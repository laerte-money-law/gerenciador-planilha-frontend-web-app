import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { BaseInputComponent } from "../base-input.component";

export interface InputOption {
    value: string;
    label?: string;
    checked?: boolean;
}

interface InternalInputOption extends InputOption {
    id: string;
    value: string;
    label: string;
    checked: boolean;
}

@Component({
    selector: "app-input-radiogroup",
    templateUrl: "./input-radiogroup.component.html",
    styleUrls: [],
})
export class InputRadiogroupComponent extends BaseInputComponent implements OnInit {
    @Input() label: string;
    @Input() options: InputOption[];
    @Input() initialCheckedOption: string;
    @Input() required: boolean = false;
    @Input() enableMultipleChoices: boolean = false;
    @Input() readOnly: boolean = false;
    @Output() optionChanged = new EventEmitter<string>();

    protected isValidated: boolean = false;
    protected valid: boolean = true;
    protected internalOptions: InternalInputOption[] = [];
    protected errorMessage: string = "";

    ngOnInit(): void {
        this.setInputId(this.label);
        this.loadOptionsInHtml();
        this.setSelectedOption();
    }

    validate(): boolean {
        this.isValidated = true;
        this.valid = true;
        if (this.required && (!this.getCheckedOptions() || !this.getCheckedOptions().length)) {
            this.valid = false;
            this.errorMessage = this.ERROR_MESSAGES.CHECKBOX_FIELD_REQUIRED(this.enableMultipleChoices);
            console.info(`Componente ${this.label} está inválido por motivos de obrigatoriedade`);
        }
        return this.valid;
    }

    isValid(): boolean {
        return this.valid;
    }

    getCheckedOptions(): string[] {
        return this.internalOptions.filter((e) => e.checked).map((e) => e.value);
    }

    public changeValue(checkedOption: string[]): void {
        this.internalOptions.forEach((e) => (e.checked = checkedOption.includes(e.value)));
        if (this.isValidated) {
            this.validate();
        }
    }

    protected onCheckboxChange(optionId: string) {
        const checkedOption = this.internalOptions.find((e) => e.id === optionId);
        if (!this.enableMultipleChoices) {
            this.internalOptions.forEach((e) => (e.checked = false));
        }
        checkedOption.checked = !checkedOption.checked;
        if (this.isValidated) {
            this.validate();
        }

        this.optionChanged.emit(optionId);
    }

    private setSelectedOption() {
        if (this.initialCheckedOption) {
            this.internalOptions.forEach((option) => (option.checked = this.initialCheckedOption === option.value));
        }
    }

    private loadOptionsInHtml() {
        for (const option of this.options) {
            this.internalOptions.push({
                id: `radio-${Math.floor(Math.random() * 10000)}-${option.value}`,
                value: option.value,
                label: option.label ?? option.value,
                checked: option.checked ?? false,
            });
        }
    }
}
