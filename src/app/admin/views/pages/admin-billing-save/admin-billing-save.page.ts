import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { PageRoute } from "../../../../shared/models/page-route";
import { PageService } from "../../../../shared/services/page.service";
import { BaseAppPageFormView } from "../../../../shared/views/base-app-page-form.view";
import { Suggestion } from "../../../../shared/views/components/atoms/input-autocomplete-single-choice/input-autocomplete-single-choice.component";
import { ClientDto } from "../../../models/client.dto";
import { AdminClientService } from "../../../services/admin-client.service";

@Component({
    selector: "admin-billing-save-page",
    templateUrl: "./admin-billing-save.page.html",
    styles: ``,
})
export class AdminBillingSavePage extends BaseAppPageFormView implements OnInit {
    autocompleteClientSuggestions: Suggestion[] = [];
    autocompletePolicySuggestions: Suggestion[] = [
        {
            id: "1",
            text: "4623473947",
        },
        {
            id: "2",
            text: "6819705388",
        },
        {
            id: "3",
            text: "7027345163",
        },
        {
            id: "4",
            text: "9069904939",
        },
        {
            id: "5",
            text: "9384987725",
        },
        {
            id: "6",
            text: "3076846085",
        },
        {
            id: "7",
            text: "3802004896",
        },
    ];
    clientSelected: ClientDto;
    allClientes: ClientDto[];

    pondOptions = {
        server: {
            process: (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
                const formData = new FormData();
                formData.append("files", file);

                const request = new XMLHttpRequest();
                // request.open("POST", this.URLS.API_ENDPOINTS.ECF.UPLOAD());
                // request.setRequestHeader("Authorization", `Bearer ${AuthService.getTokenFromSession()}`);

                // Should call the progress method to update the progress to 100% before calling load
                // Setting computable to false switches the loading indicator to infinite mode
                request.upload.onprogress = (e) => {
                    progress(e.lengthComputable, e.loaded, e.total);
                };

                // Should call the load method when done and pass the returned server file id
                // this server file id is then used later on when reverting or restoring a file
                // so your server knows which file to return without exposing that info to the client
                request.onload = function () {
                    if (request.status >= 200 && request.status < 300) {
                        // the load method accepts either a string (id) or an object
                        load(request.responseText);
                    } else {
                        // Can call the error method if something is wrong, should exit after
                        error("oh no");
                    }
                };

                request.send(formData);

                // Should expose an abort method so the request can be cancelled
                return {
                    abort: () => {
                        // This function is entered if the user has tapped the cancel button
                        request.abort();

                        // Let FilePond know the request has been cancelled
                        abort();
                    },
                };
            },
        },
        class: "my-filepond",
        instantUpload: false,
        allowRevert: false,
        labelFileProcessing: "Enviando...",
        labelFileProcessingComplete: "Arquivo enviado",
        labelFileProcessingAborted: "Envio cancelado",
        labelTapToCancel: "Clique para cancelar",
        labelIdle:
            "Arraste e solte o arquivo nesta área cinza </br> ou <span class='filepond--label-action'>clique aqui para procurar</span>",
    };

    override getBreadcrumbs(): PageRoute[] {
        return [
            new PageRoute(this.URLS.PATHS.ADMIN.BILLING.ROOT(), "Faturamento", "Faturamento"),
            new PageRoute(this.URLS.PATHS.ADMIN.BROKERS.CREATE(), "Cadastrar faturamento", "Cadastrar"),
        ];
    }

    constructor(
        private readonly pageService: PageService,
        private readonly spinner: NgxSpinnerService,
        private readonly adminClientService: AdminClientService
    ) {
        super();
    }
    ngOnInit(): void {
        this.pageService.setToolbar(this.getBreadcrumbs());
        this.loadClientsAsClientAutocompleteSuggestions();
    }

    override onSubmit(): void {
        throw new Error("Method not implemented.");
    }
    override isFormValid(): boolean {
        throw new Error("Method not implemented.");
    }

    onClientSelected(suggestionId: any): void {
        if (suggestionId) {
            this.clientSelected = this.allClientes.find((e) => e.code === suggestionId);
        } else {
            this.clientSelected = null;
        }
    }

    onPolicySelected(suggestionId: any): void {
        // if (suggestionId) {
        //     this.clientSelected = this.allClientes.find((e) => e.code === suggestionId);
        // } else {
        //     this.clientSelected = null;
        // }
    }

    protected onFinishProcessFile(): void {
        // this.uploadFileState = FormStateEnum.SUBMITTED_SUCCESSFULLY;
        // this.onProcessFileSuccessfully.emit();
        // setTimeout(() => {
        //     this.onCloseModal();
        // }, 10000);
    }

    private loadClientsAsClientAutocompleteSuggestions(): void {
        this.spinner.show();
        this.adminClientService.findAllClients().subscribe({
            next: (response) => {
                this.allClientes = response;
                this.autocompleteClientSuggestions = this.allClientes.map((e) => {
                    return {
                        id: e.code,
                        text: e.companyName,
                    };
                });

                this.spinner.hide();
            },
            error: (e) => {
                this.spinner.hide();
                throw e;
            },
        });
    }
}
