import { Component, Input } from "@angular/core";
import { BaseView } from "../../../base.view";

@Component({
    selector: "app-button",
    templateUrl: "./button.component.html",
    styles: ``,
})
export class ButtonComponent extends BaseView {
    @Input() classes: string = "btn-primary";
    @Input() type: "submit" | "button" = "submit";
    @Input() text: string = "";
    @Input() loadingText: string = null;
    @Input() submittedText: string = null;
    @Input() isDisabled: boolean = false;
    @Input() isSubmitted: boolean = false;
    @Input() isLoading: boolean = false;
}
