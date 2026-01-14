import { Component, Input } from "@angular/core";
import { StatusEnum } from "../../../../models/enums/status.enum";

@Component({
    selector: "app-badge-activation-status",
    templateUrl: "./badge-activation-status.component.html",
    styles: ``,
})
export class BadgeActivationStatusComponent {
    @Input() status: string;
    STATUS_ENUM = StatusEnum;
}
