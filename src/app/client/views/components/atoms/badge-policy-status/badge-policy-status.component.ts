import { Component, Input } from "@angular/core";
import { PolicyStatusEnum } from "../../../../models/enums/policy-status.enum";

@Component({
    selector: "app-badge-policy-status",
    templateUrl: "./badge-policy-status.component.html",
    styles: ``,
})
export class BadgePolicyStatusComponent {
    @Input() status: string;
    STATUS_ENUM = PolicyStatusEnum;
}
