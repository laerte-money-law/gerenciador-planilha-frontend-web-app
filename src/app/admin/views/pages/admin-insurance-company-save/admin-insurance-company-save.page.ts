import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from "../../../../auth/services/auth.service";
import { StatusEnum } from "../../../../shared/models/enums/status.enum";
import { PageRoute } from "../../../../shared/models/page-route";
import { NotificationService } from "../../../../shared/services/notification.service";
import { PageService } from "../../../../shared/services/page.service";
import { Constants } from "../../../../shared/utils/constants";
import { BaseValidator } from "../../../../shared/validators/base.validator";
import { CnpjValidator } from "../../../../shared/validators/cnpj.validator";
import { EmailValidator } from "../../../../shared/validators/email.validator";
import { BaseAppPageFormView } from "../../../../shared/views/base-app-page-form.view";
import { FormStateEnum } from "../../../../shared/views/base-form.view";
import { InputAutocompleteGooglemapsComponent } from "../../../../shared/views/components/atoms/input-autocomplete-googlemaps/input-autocomplete-googlemaps.component";
import {
    LowerCaseInputTextModifier,
    NameInputTextModifier,
} from "../../../../shared/views/components/atoms/input-text/input-text-modifiers";
import { InputTextComponent } from "../../../../shared/views/components/atoms/input-text/input-text.component";
import { AdminInsuranceCompanySaveFormDto } from "../../../models/forms/admin-insurance-company-save.form.dto";
import { AdminInsuranceCompanyService } from "../../../services/admin-insurance-company.service";
import { InsuranceCompanyDetailsDto } from "../../../models/insurance-company.dto";

@Component({
    selector: "admin-insurance-company-save-page",
    templateUrl: "./admin-insurance-company-save.page.html",
    styles: ``,
})
export class AdminInsuranceCompanySavePage extends BaseAppPageFormView implements OnInit {
    @ViewChild("inputName") inputName: InputTextComponent;
    @ViewChild("inputRegistrationCode") inputRegistrationCode: InputTextComponent;
    @ViewChild("inputCnpj") inputCnpj: InputTextComponent;
    @ViewChild("inputAddress") inputAddress: InputAutocompleteGooglemapsComponent;
    @ViewChild("inputContactName") inputContactName: InputTextComponent;
    @ViewChild("inputContactPhone") inputContactPhone: InputTextComponent;
    @ViewChild("inputContactEmail") inputContactEmail: InputTextComponent;

    insuranceCompanyCode: string;
    nameInputTextModifier = new NameInputTextModifier();
    emailInputTextValidator = new EmailValidator();
    lowerCaseInputTextModifier = new LowerCaseInputTextModifier();
    cnpjValidator: CnpjValidator = new CnpjValidator();
    STATUS = StatusEnum;
    CNPJ_MASK = BaseValidator.MASKS.CNPJ;
    PHONE_MASK = BaseValidator.MASKS.PHONE;
    editRecord: InsuranceCompanyDetailsDto;

    generalPondOptions = {
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

    adminCertificatePondOptions = {
        ...this.generalPondOptions,
        server: {
            process: (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
                const formData = new FormData();
                formData.append("file", file);

                const request = new XMLHttpRequest();
                request.open("POST", this.URLS.API_ENDPOINTS.ADMIN.INSURANCE_COMPANIES_CERTIFICATE(this.insuranceCompanyCode, "admin"));
                request.setRequestHeader("Authorization", `Bearer ${AuthService.accessToken}`);

                request.upload.onprogress = (e) => {
                    progress(e.lengthComputable, e.loaded, e.total);
                };

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

                return {
                    abort: () => {
                        request.abort();
                        abort();
                    },
                };
            },
        },
    };
    susepCertificatePondOptions = {
        ...this.generalPondOptions,
        server: {
            process: (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
                const formData = new FormData();
                formData.append("file", file);

                const request = new XMLHttpRequest();
                request.open("POST", this.URLS.API_ENDPOINTS.ADMIN.INSURANCE_COMPANIES_CERTIFICATE(this.insuranceCompanyCode, "susep"));
                request.setRequestHeader("Authorization", `Bearer ${AuthService.accessToken}`);

                request.upload.onprogress = (e) => {
                    progress(e.lengthComputable, e.loaded, e.total);
                };

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

                return {
                    abort: () => {
                        request.abort();
                        abort();
                    },
                };
            },
        },
    };

    override getBreadcrumbs(): PageRoute[] {
        return [
            new PageRoute(this.URLS.PATHS.ADMIN.INSURANCE_COMPANY.ROOT(), "Seguradoras", "Seguradoras"),
            new PageRoute(this.URLS.PATHS.ADMIN.INSURANCE_COMPANY.CREATE(), "Editar seguradora", "Editar"),
        ];
    }

    constructor(
        private readonly pageService: PageService,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly spinner: NgxSpinnerService,
        private readonly notifier: NotificationService,
        private readonly adminInsuranceCompanyService: AdminInsuranceCompanyService
    ) {
        super();
    }

    ngOnInit(): void {
        this.pageService.setToolbar(this.getBreadcrumbs());
        this.loadForm();
        this.restrictUploadFileTypesToPdfOnly();
    }

    onReplaceSusepCertificate = () => {
        this.editRecord.susepCertificate = null;
        this.restrictUploadFileTypesToPdfOnly();
    };
    onReplaceAdminCertificate = () => {
        this.editRecord.adminCertificate = null;
        this.restrictUploadFileTypesToPdfOnly();
    };

    onDeleteCertificate(type: "admin" | "susep"): void {
        this.spinner.show();
        this.adminInsuranceCompanyService.deleteCertificate(this.editRecord.registrationCode, type).subscribe({
            next: (response) => {
                this.notifier.showSuccess("Certificado excluido com sucesso!");
                if (type === "susep") {
                    this.onReplaceSusepCertificate();
                } else if (type === "admin") {
                    this.onReplaceAdminCertificate();
                }
                this.spinner.hide();
            },
        });
    }

    onDownloadCertificate(type: "admin" | "susep"): void {
        this.spinner.show();
        this.adminInsuranceCompanyService.downloadCertificate(this.editRecord.registrationCode, type).subscribe({
            next: (response) => {
                this.openPdfInNewTab(response.base64);
                this.spinner.hide();
            },
        });
    }

    override onSubmit(): void {
        if (this.isFormValid()) {
            this.formState = FormStateEnum.SUBMITION_LOADING;

            const dto = this.extractDtoFromForm();

            this.spinner.show();
            this.adminInsuranceCompanyService.save(dto, this.insuranceCompanyCode).subscribe({
                next: (response) => {
                    this.formState = FormStateEnum.SUBMITTED_SUCCESSFULLY;
                    this.notifier.showSuccess("Consultor salvo com sucesso!");
                    this.router.navigate([this.URLS.PATHS.ADMIN.INSURANCE_COMPANY.ROOT()]);
                    this.spinner.hide();
                },
                error: (e) => {
                    this.formState = FormStateEnum.SUBMITION_FAILED;
                    this.spinner.hide();
                    throw e;
                },
            });
        } else {
            this.formState = FormStateEnum.SUBMITION_FAILED;
            this.notifier.showError(this.ERROR_MESSAGES.FORM_HAS_ERRORS());
        }
    }

    override isFormValid(): boolean {
        let isValid = true;
        isValid = this.inputContactName.validate() && isValid;
        isValid = this.inputContactPhone.validate() && isValid;
        isValid = this.inputContactEmail.validate() && isValid;
        return isValid;
    }

    onCancel(): void {
        this.router.navigate([this.URLS.PATHS.ADMIN.INSURANCE_COMPANY.ROOT()]);
    }

    private loadForm(): void {
        this.spinner.show();
        this.route.params.subscribe((params) => {
            this.insuranceCompanyCode = params["code"];

            if (this.insuranceCompanyCode) {
                this.adminInsuranceCompanyService.findByCode(this.insuranceCompanyCode).subscribe({
                    next: (response) => {
                        this.editRecord = response;
                        this.inputName.changeValue(response.insuranceCompanyName);
                        this.inputRegistrationCode.changeValue(response.registrationCode);
                        this.inputCnpj.changeValue(response.cnpj);
                        this.inputAddress.setValue({
                            formatted: response.address,
                        });
                        this.inputContactName.changeValue(response.contactName);
                        this.inputContactPhone.changeValue(response.contactPhone && this.formatPhone(response.contactPhone));
                        this.inputContactEmail.changeValue(response.contactEmail);
                        this.spinner.hide();
                    },
                    error: (e) => {
                        this.router.navigate([this.URLS.PATHS.ADMIN.INSURANCE_COMPANY.ROOT()]);
                        throw e;
                    },
                });
            } else {
                this.router.navigate([this.URLS.PATHS.ADMIN.INSURANCE_COMPANY.ROOT()]);
            }
        });
    }

    private extractDtoFromForm(): AdminInsuranceCompanySaveFormDto {
        return {
            contactName: this.inputContactName.getValue(),
            contactPhone: this.inputContactPhone.getValue(),
            contactEmail: this.inputContactEmail.getValue(),
        };
    }

    private restrictUploadFileTypesToPdfOnly() {
        setTimeout(() => {
            const elements = document.getElementsByName("filepond");
            elements.forEach((element) => {
                const htmlElement = element as HTMLInputElement;
                htmlElement.accept = ".pdf";
            });

            const filePondCredits = document.getElementsByClassName("filepond--credits");
            while (filePondCredits.length > 0) {
                filePondCredits[0].remove();
            }

            // document.querySelector<HTMLElement>(".filepond--credits").style.display = "none";
        }, Constants.DEFAULT_APP_TIMEOUT);
    }

    private openPdfInNewTab(documentBase64: string): void {
        // Convert base64 to Uint8Array
        const byteCharacters = atob(documentBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        // Create a Blob with PDF type
        const fileBlob = new Blob([byteArray], { type: "application/pdf" });

        // Create an Object URL and open in a new tab
        const fileURL = URL.createObjectURL(fileBlob);
        const newTab = window.open(fileURL, "_blank");
        if (!newTab || newTab.closed || typeof newTab.closed === "undefined") {
            this.notifier.showError(
                "O bloqueador de pop-up do seu navegador impediu a abertura do documento. Por favor, desative-o e tente novamente."
            );
        }
    }
}
