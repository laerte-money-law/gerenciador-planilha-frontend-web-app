import { Component, Input, OnInit } from "@angular/core";
import { BaseInputComponent } from "../base-input.component";

@Component({
    selector: "app-input-readonly",
    templateUrl: "./input-readonly.component.html",
    styles: ``,
})
export class InputReadonlyComponent extends BaseInputComponent implements OnInit {
    @Input() label: string;
    @Input() fieldName: string;
    @Input() value: any;
    @Input() displayValue: string;
    @Input() type: "text" | "date" | "currency" | "link" = "text";

    public get valueText(): string {
        if (this.value) {
            if (this.type === "date") {
                return this.formatDate(this.value);
            } else if (this.type === "currency") {
                return this.formatCurrency(this.value);
            } else {
                return this.value;
            }
        }
        return null;
    }

    ngOnInit(): void {
        this.setInputId(this.label);
        this.fieldName = this.fieldName || this.label;
    }
}
