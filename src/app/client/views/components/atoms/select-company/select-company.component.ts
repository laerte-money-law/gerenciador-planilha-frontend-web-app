import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { AuthService } from "src/app/auth/services/auth.service";
import { ClientSubsidiaryService } from "src/app/client/services/client-subsidiary.service";
import { BaseView } from "src/app/shared/views/base.view";

@Component({
    selector: "app-select-company",
    templateUrl: "./select-company.html",
    styles: ``,
})
export class SelectCompanyComponent extends BaseView implements OnInit {
    @Output() subsidiarySelected = new EventEmitter<string>();

    subsidiaries = [];

    constructor(private readonly authService: AuthService, private readonly clientSubsidiaryService: ClientSubsidiaryService) {
        super();
    }

    ngOnInit(): void {
        this.findAllSubsidiaries(this.authService.userClientInfo.clientCode);
    }

    onSubsidiaryChange(event: Event): void {
        const selectedValue = (event.target as HTMLSelectElement).value;
        console.log("Selected subsidiary:", selectedValue);
        this.subsidiarySelected.emit(selectedValue);
    }

    private findAllSubsidiaries(clientCode: string): void {
        if (clientCode) {
            this.clientSubsidiaryService.findAllSubsidiaries(clientCode).subscribe({
                next: (response) => {
                    this.subsidiaries = response;
                    this.subsidiarySelected.emit(this.subsidiaries[0]?.code);
                },
                error: (e) => {
                    console.error(e);
                },
            });
        }
    }
}
