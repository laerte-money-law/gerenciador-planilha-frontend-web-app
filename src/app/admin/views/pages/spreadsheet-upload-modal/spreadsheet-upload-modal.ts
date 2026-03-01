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

@Component({
    selector: "app-upload-spreadsheet-modal",
    templateUrl: "./spreadsheet-upload-modal.html",
})
export class UploadSpreadSheetModal implements OnInit {

    @ViewChild("selectClient") selectClient: SelectSingleChoiceComponent;
    @ViewChild("selectService") selectService: SelectSingleChoiceComponent;

    clients: SelectOption[] = []

    services: SelectOption[] = [
        {value: "CONCILIACAO", text: "Conciliação"},
        {value: "DNI", text: "DNI"},
        {value: "RECUPERACAO", text: "Recuperação"}]

    file: File | null = null;

    constructor(
        public activeModal: NgbActiveModal,
        private readonly clientsService: AdminClientService,
        private readonly notifier: NotificationService,
    ) {
    }

    ngOnInit() {
        this.loadClientsSelectOptions();
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
}
