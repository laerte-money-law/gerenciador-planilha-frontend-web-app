import { Component, Input } from "@angular/core";
import { QuotationStatusEnum } from "../../../../models/enums/quotation-status.enum";

@Component({
    selector: "app-badge-quotation-status",
    templateUrl: "./badge-quotation-status.component.html",
    styles: ``,
})
export class BadgeQuotationStatusComponent {
    @Input() status: string;
    STATUS_ENUM = QuotationStatusEnum;
}
