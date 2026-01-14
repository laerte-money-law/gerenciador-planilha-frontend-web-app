import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { BaseInputComponent } from "../base-input.component";
import { BaseValidator } from "../../../../validators/base.validator";

export interface SelectOption {
    value: string;
    text: string;
}

@Component({
    selector: "app-select-single-choice",
    templateUrl: "./select-single-choice.component.html",
    styleUrls: [],
})
export class SelectSingleChoiceComponent extends BaseInputComponent implements OnInit {
    @Input() label: string = null;
    @Input() placeholder: string = null;
    @Input() helperText: string = null;
    @Input() options: SelectOption[];
    @Input() initialSelectedValue: string = "";
    @Input() required: boolean = false;
    @Input() validators: BaseValidator[] = [];
    @Input() readOnly: boolean = false;
    @Input() displayInline: boolean = false;
    @Input() fieldName: string;
    @Output() optionChanged = new EventEmitter<string>();
    protected selectedValue: string = "";
    protected isValidated: boolean = false;
    protected valid: boolean = true;
    protected errorMessage: string = "";

    ngOnInit(): void {
        this.setInputId(this.label);
        this.selectedValue = this.initialSelectedValue ?? "";
        this.fieldName = this.fieldName || this.label || this.placeholder;
    }

    getSelectedValue(): string {
        return !this.selectedValue?.trim() ? null : this.selectedValue;
    }

    setValue(value: string): void {
        this.selectedValue = "";
        if (value) {
            this.selectedValue = value;
        }
    }

    validate(): boolean {
        this.isValidated = true;
        this.valid = true;
        if (this.required && !this.getSelectedValue()) {
            this.valid = false;
            this.errorMessage = this.ERROR_MESSAGES.SELECT_FIELD_REQUIRED(this.fieldName);
            console.info(`Componente ${this.label} está inválido por motivos de obrigatoriedade`);
        } else if (this.validators.length) {
            this.validators.forEach((v) => {
                if ((this.getSelectedValue() || v.force) && !v.isValid(this.getSelectedValue())) {
                    this.valid = false;
                    this.errorMessage = v.errorMessage ? v.errorMessage : this.ERROR_MESSAGES.INPUT_FIELD_INVALID(this.fieldName);
                    console.info(`Componente ${this.label} está inválido por motivos de campo inválido`);
                }
            });
        }
        return this.valid;
    }

    isValid(): boolean {
        return this.valid;
    }

    clearValidators(): void {
        this.validators = [];
    }

    protected onChange(event: any): void {
        if (this.isValidated) {
            this.validate();
        }
        this.optionChanged.emit(this.selectedValue);
    }
}
