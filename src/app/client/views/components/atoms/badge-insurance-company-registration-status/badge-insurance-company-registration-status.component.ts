import { Component, Input } from "@angular/core";
import { InsuranceCompanyClientRegistrationStatusEnum } from "../../../../models/enums/insurance-company-client-registration-status.enum";

@Component({
    selector: "app-badge-insurance-company-registration-status",
    templateUrl: "./badge-insurance-company-registration-status.component.html",
    styles: ``,
})
export class BadgeInsuranceCompanyRegistrationStatusComponent {
    @Input() insuranceCompanyRegistrationStatus: string;
    STATUS_ENUM = InsuranceCompanyClientRegistrationStatusEnum;
}
