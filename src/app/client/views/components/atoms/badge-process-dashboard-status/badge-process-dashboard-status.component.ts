import { Component, Input } from "@angular/core";
import { ProcessDashboardStatusEnum } from "src/app/client/models/enums/process-dashboard-status-enum";

@Component({
    selector: "app-badge-process-dashboard-status",
    templateUrl: "./badge-process-dashboard-status.component.html",
    styles: ``,
})
export class BadgeProcessDashboardStatusComponent {
    @Input() status: string;
    STATUS_ENUM = ProcessDashboardStatusEnum;
}
