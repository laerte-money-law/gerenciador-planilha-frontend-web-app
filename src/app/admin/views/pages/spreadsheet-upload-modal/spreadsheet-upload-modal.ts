import {Component, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {TeamDto} from "src/app/admin/models/spreadsheet.dto";
import {
    SelectOption,
    SelectSingleChoiceComponent
} from "../../../../shared/views/components/atoms/select-single-choice/select-single-choice.component";
import {AdminClientService} from "../../../services/admin-client.service";
import {NotificationService} from "../../../../shared/services/notification.service";
import { TeamService } from "src/app/admin/services/team.service";

@Component({
    selector: "app-upload-spreadsheet-modal",
    templateUrl: "./spreadsheet-upload-modal.html",
})
export class UploadSpreadSheetModal implements OnInit {

    @ViewChild("selectClient") selectClient: SelectSingleChoiceComponent;
    @ViewChild("selectService") selectService: SelectSingleChoiceComponent;
    @ViewChild("selectTeam") selectTeam: SelectSingleChoiceComponent;

    clients: SelectOption[] = []
    teams: SelectOption[] = []

    services: SelectOption[] = [
        {value: "CONCILIACAO", text: "Conciliação"},
        {value: "DNI", text: "DNI"},
        {value: "RECUPERACAO", text: "Recuperação"}]

    file: File | null = null;

    constructor(
        public activeModal: NgbActiveModal,
        private readonly clientsService: AdminClientService,
        private readonly notifier: NotificationService,
        private readonly teamService: TeamService,
    ) {
    }

    ngOnInit() {
        this.loadClientsSelectOptions();
        this.loadTeamsSelectOptions();
    }

    onFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files?.length) {
            this.file = input.files[0];
        }
    }

    submit() {
        if (this.isFormValid()) {
            this.activeModal.close({
                client: this.selectClient.getSelectedValue(),
                service: this.selectService.getSelectedValue(),
                file: this.file,
                team: this.selectTeam.getSelectedValue(),
            });
        }

        return;
    }

    public isFormValid(): boolean {
        let isValid = true;
        isValid = this.file && isValid;
        return isValid;
    }

    cancel() {
        this.activeModal.dismiss();
    }

    private loadClientsSelectOptions() {
        this.clientsService.findAllClients().subscribe({
            next: (clients) => {
                this.clients = clients.map(client => ({
                    value: client.id.toString(),
                    text: client.companyName,
                }));
            },
            error: (e) => {
                this.notifier.showError("Erro ao carregar clientes", "Tente novamente mais tarde");
                console.error(e);
            }
        })
    }

    private loadTeamsSelectOptions() {
        this.teamService.findAllTeams().subscribe({
            next: (teams: TeamDto[]) => { 
                this.teams = teams.map(team => ({
                    value: team.id.toString(),
                    text: team.name,
                }));
            },
            error: (e) => {
                this.notifier.showError("Erro ao carregar times", "Tente novamente mais tarde");
                console.error(e);
            }
        });
    };
}
