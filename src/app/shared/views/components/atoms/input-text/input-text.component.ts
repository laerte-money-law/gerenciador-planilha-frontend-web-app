import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { BaseInputTextModifier } from "./input-text-modifiers";
import { BaseValidator } from "../../../../validators/base.validator";
import { BaseInputComponent } from "../base-input.component";
import { Constants } from "../../../../utils/constants";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

type InputTypes = "email" | "text" | "tel" | "password" | "currency";
export type ValidatorLogicOperator = "AND" | "OR";

@Component({
    selector: "app-input-text",
    templateUrl: "./input-text.component.html",
    styleUrls: [],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: InputTextComponent,
            multi: true,
        },
    ],
})
export class InputTextComponent extends BaseInputComponent implements OnInit, ControlValueAccessor {
    private onChangeFn: (value: any) => void = () => {};
    private onTouchedFn: () => void = () => {};

    constructor(private readonly cdr: ChangeDetectorRef) {
        super();
    }

    registerOnChange(fn: (value: any) => void): void {
        this.onChangeFn = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouchedFn = fn;
    }

    writeValue(value: string): void {
        this.value = value;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.readOnly = isDisabled;
    }

    @Input() label: string;
    @Input() fieldName: string;
    @Input() type: InputTypes = "text";
    @Input() placeholder: string = "";
    @Input() required: boolean = false;
    @Input() mask: string;
    @Input() initialValue: string;
    @Input() helperText: string;
    @Input() showInfoPopover: boolean = false;
    @Input() validators: BaseValidator[] = [];
    @Input() validatorsCombination: ValidatorLogicOperator = "AND";
    @Input() modifier: BaseInputTextModifier;
    @Input() readOnly: boolean = false;
    @Input() showClearButton: boolean = false;
    protected value: string = "";
    protected isValidated: boolean = false;
    protected valid: boolean = true;
    protected errorMessage: string = "";
    protected showPassword: boolean = false;

    ngOnInit(): void {
        this.fieldName = this.fieldName || this.label || this.placeholder;
        this.setInputId(this.fieldName);
        this.value = this.initialValue;
        if (this.type === "currency") {
            this.mask = "separator.2";
        }
    }

    getValue(): string {
        return this.value || null;
    }

    validate(): boolean {
        this.isValidated = true;
        this.valid = true;
        if (this.isValueMandatoryAndInvalid()) {
            this.valid = false;
            this.errorMessage = this.ERROR_MESSAGES.INPUT_FIELD_REQUIRED(this.fieldName);
            console.info(`Componente ${this.fieldName} está inválido por motivos de obrigatoriedade`);
        } else if (!this.isValueValidByMask()) {
            this.valid = false;
            this.errorMessage = this.ERROR_MESSAGES.INPUT_FIELD_MASK_INCOMPLETE(this.fieldName);
            console.info(`Componente ${this.fieldName} está inválido por motivos de erro de máscara`);
        } else if (this.validators.length && this.value) {
            const isInvalidByValidators =
                this.validatorsCombination === "AND"
                    ? this.validators.some((v) => !v.isValid(this.value))
                    : this.validators.every((v) => !v.isValid(this.value));

            if (isInvalidByValidators) {
                this.valid = false;
                const invalidValidator = this.validators.filter((v) => !v.isValid(this.value)).first();
                this.errorMessage = invalidValidator.errorMessage
                    ? invalidValidator.errorMessage
                    : this.ERROR_MESSAGES.INPUT_FIELD_INVALID(this.fieldName);
                console.info(`Componente ${this.label} está inválido por motivos de campo inválido`);
            }
        }
        return this.valid;
    }

    isValid(): boolean {
        return this.valid;
    }

    changeValue(newValue: string): void {
        //TODO: removi uma validação if(newValue), esperar pra ver se causa bugs
        if (this.type === "currency") {
            this.mask = null;
            this.value = newValue;
            setTimeout(() => {
                this.mask = "separator.2";
            }, Constants.DEFAULT_APP_TIMEOUT);
        }
        this.value = newValue;
    }

    reset(): void {
        this.onClearInput();
        this.isValidated = false;
    }

    protected onClearInput(): void {
        this.value = "";
    }

    protected onChange(value: string): void {
        if (this.isValidated) {
            this.validate();
        }
    }
    protected onInputChange(event: any): void {
        this.value = event.target.value;

        if (this.modifier && this.value) {
            this.value = this.modifier.modify(this.value);

            if (event) {
                const htmlInput = event.target as HTMLInputElement;
                htmlInput.value = this.value;
            }
        }

        this.onChangeFn?.(this.value);
        this.onTouchedFn?.();

        if (this.isValidated) {
            this.validate();
        }
    }

    private isValueValidByMask(): boolean {
        if (this.mask && this.value && this.type !== "currency") {
            const digitsOnly = this.cleanValue(this.value);

            if (!this.mask.includes("||")) {
                const expectedLength = this.cleanValue(this.mask).length;
                return digitsOnly.length === expectedLength;
            } else {
                const masks = this.mask.split("||");
                return masks.some((m) => digitsOnly.length === this.cleanValue(m).length);
            }
        }
        return true;
    }

    private isValueMandatoryAndInvalid(): boolean {
        const isTypeCurrencyAndInvalid = this.type === "currency" && this.value && !this.parseCurrency(this.value);
        return this.required && (!this.value || isTypeCurrencyAndInvalid);
    }

    private cleanValue(val: string): string {
        return val.replace(/\D/g, "");
    }
}
