import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { BaseInputComponent } from "../base-input.component";
import { BaseValidator } from "../../../../validators/base.validator";
import { BaseInputTextModifier } from "../input-text/input-text-modifiers";

export interface Suggestion {
    id: string;
    text: string;
}

@Component({
    selector: "app-input-autocomplete-single-choice",
    templateUrl: "./input-autocomplete-single-choice.component.html",
    styleUrls: ["./input-autocomplete-single-choice.component.scss"],
})
export class InputAutocompleteSingleChoiceComponent extends BaseInputComponent implements OnInit {
    @Input() fieldName: string;
    @Input() label: string;
    @Input() placeholder: string = "";
    @Input() required: boolean = false;
    @Input() initialValue: string;
    @Input() helperText: string;
    @Input() showInfoPopover: boolean = false;
    @Input() validators: BaseValidator[] = [];
    @Input() allSuggestions: Suggestion[] = [];
    @Input() modifier: BaseInputTextModifier;
    @Input() maxItemsToShow: number;
    @Input() clearInputIfNoItemIsSelected: boolean = false;

    @Output() suggestionClicked = new EventEmitter<string>();

    protected value = "";
    protected isValidated: boolean = false;
    protected valid: boolean = true;
    protected errorMessage: string = "";
    protected showSuggestions = false;
    protected suggestions: Suggestion[] = [];
    private isValueFromClickedSuggestion = false;

    constructor(private readonly cdr: ChangeDetectorRef) {
        super();
    }

    ngOnInit(): void {
        this.fieldName = this.fieldName || this.label || this.placeholder;
        this.setInputId(this.fieldName);
        this.loadInitialValue();
    }

    getValue(): { id: string; text: string } {
        const selectedSuggestion = this.getSelectedSuggestionBasedOnInputValue();

        return {
            id: selectedSuggestion ? selectedSuggestion.id : null,
            text: this.value,
        };
    }

    isValid(): boolean {
        return this.valid;
    }

    validate(): boolean {
        this.isValidated = true;
        this.valid = true;
        if (this.required && !this.value) {
            this.valid = false;
            this.errorMessage = this.ERROR_MESSAGES.INPUT_FIELD_REQUIRED(this.label);
            console.info(`Componente ${this.label} está inválido por motivos de obrigatoriedade`);
        } else if (this.validators.length) {
            this.validators.forEach((v) => {
                if (!v.isValid(this.value)) {
                    this.valid = false;
                    this.errorMessage = this.ERROR_MESSAGES.INPUT_FIELD_INVALID(this.label);
                    console.info(`Componente ${this.label} está inválido por motivos de campo inválido`);
                }
            });
        }
        return this.valid;
    }

    protected onInput(event: any): void {
        this.value = event.target.value;
        this.getSuggestions();
        if (this.modifier && this.value) {
            this.value = this.modifier.modify(this.value);

            if (event) {
                const htmlInput = event.target as HTMLInputElement;
                htmlInput.value = this.value;
            }
        }
    }

    protected onKeyDown(event: KeyboardEvent): void {
        switch (event.key) {
            case "Escape":
                this.showSuggestions = false;
                event.preventDefault();
                break;
            case " ":
                break;
            case "Backspace":
                if (this.isValueFromClickedSuggestion) {
                    this.value = "";
                    this.getSuggestions();
                }
                this.isValueFromClickedSuggestion = false;
                this.showSuggestions = true;
                break;
            default:
                this.isValueFromClickedSuggestion = false;
                this.showSuggestions = true;
                break;
        }
    }
    protected onFocus(input: any): void {
        this.showSuggestions = !this.isValueFromClickedSuggestion;
        this.getSuggestions();
    }
    protected onBlur(): void {
        setTimeout(() => {
            this.value = this.value.trim();
            this.showSuggestions = false;
            if (this.clearInputIfNoItemIsSelected && !this.isValueFromClickedSuggestion) {
                this.value = "";
            }
            this.cdr.detectChanges();
        }, 250);
    }

    protected onClearInput(): void {
        this.value = "";
        this.isValueFromClickedSuggestion = false;

        this.setFocusToInput();
    }

    protected onSuggestionClick(suggestion: Suggestion): void {
        console.log("clicou na ", suggestion);

        this.value = suggestion.text;
        this.isValueFromClickedSuggestion = true;
        this.suggestionClicked.emit(suggestion.id);
    }

    private getSuggestions(): void {
        this.suggestions = this.allSuggestions.filter(
            (suggestion) => suggestion.text.trim().toLowerCase().indexOf(this.value.trim().toLowerCase()) >= 0
        );
        if (this.maxItemsToShow) {
            this.suggestions = this.suggestions.slice(0, this.maxItemsToShow);
        }
    }

    private getSelectedSuggestionBasedOnInputValue() {
        return this.allSuggestions.find((e) => e.text.trim().toLowerCase() == this.value.trim().toLowerCase());
    }

    private setFocusToInput() {
        setTimeout(() => {
            document.querySelector<HTMLElement>(".form-group input").focus();
        }, 150);
    }

    private loadInitialValue(): void {
        if (this.initialValue && this.initialValue.removeFormat().trim()) {
            const selectedSuggestion = this.allSuggestions.find((e) => e.text.contains(this.initialValue));
            if (selectedSuggestion) {
                this.onSuggestionClick(selectedSuggestion);
            }
        }
    }
}
