import { Component, Input } from "@angular/core";
import { AppealTypeEnum } from "src/app/client/models/enums/appeal-type.enum";

@Component({
    selector: "app-badge-appeal-type",
    templateUrl: "./badge-appeal-type.component.html",
    styles: ``,
})
export class BadgeAppealTypeComponent {
    @Input() status: string;
    STATUS_ENUM = AppealTypeEnum;
}
