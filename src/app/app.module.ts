import { CommonModule, registerLocaleData } from "@angular/common";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import localePt from "@angular/common/locales/pt";
import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { NgbModule, NgbDatepickerI18n } from "@ng-bootstrap/ng-bootstrap";
import * as dayjs from "dayjs";
import "dayjs/locale/pt-br";
import duration from "dayjs/plugin/duration";
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from "ngx-mask";
import { NgxSpinnerModule } from "ngx-spinner";
import { ToastrModule } from "ngx-toastr";

import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { NgApexchartsModule } from "ng-apexcharts";
import { AdminPage } from "./admin/views/admin.page";
import { AdminBillingListPage } from "./admin/views/pages/admin-billing-list/admin-billing-list.page";
import { AdminBrokerListPage } from "./admin/views/pages/admin-broker-list/admin-broker-list.page";
import { AdminBrokerSavePage } from "./admin/views/pages/admin-broker-save/admin-broker-save.page";
import { AdminClientListPage } from "./admin/views/pages/admin-client-list/admin-client-list.page";
import { AdminClientSavePage } from "./admin/views/pages/admin-client-save/admin-client-save.page";
import { AdminDashboardPage } from "./admin/views/pages/admin-dashboard/admin-dashboard.page";
import { AdminDepositInvoiceListPage } from "./admin/views/pages/admin-deposit-invoice-list/admin-deposit-invoice-list.page";
import { AdminInsuranceRequestClientCreationPage } from "./admin/views/pages/admin-insurance-request-client-creation/admin-insurance-request-client-creation.page";
import { AdminPolicySavePage } from "./admin/views/pages/admin-policy-save/admin-policy-save.page";
import { AdminConsultantListPage } from "./admin/views/pages/admin-consultant-list/admin-consultant-list.page";
import { AdminConsultantSavePage } from "./admin/views/pages/admin-consultant-save/admin-consultant-save.page";
import { AdminInsuranceCompanyListPage } from "./admin/views/pages/admin-insurance-company-list/admin-insurance-company-list.page";
import { AdminInsuranceCompanySavePage } from "./admin/views/pages/admin-insurance-company-save/admin-insurance-company-save.page";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AuthBasePage } from "./auth/views/pages/auth-base.page";
import { AuthLoginPage } from "./auth/views/pages/auth-login/auth-login.page";
import "./shared/extensions/array.extension";
import "./shared/extensions/string.extension";
import "./shared/extensions/number.extension";
import { GlobalErrorHandler } from "./shared/services/errors/global-error-handler";
import { BadgeActivationStatusComponent } from "./shared/views/components/atoms/badge-activation-status/badge-activation-status.component";
import { ButtonComponent } from "./shared/views/components/atoms/button/button.component";
import { InputAutocompleteGooglemapsComponent } from "./shared/views/components/atoms/input-autocomplete-googlemaps/input-autocomplete-googlemaps.component";
import { InputAutocompleteSingleChoiceComponent } from "./shared/views/components/atoms/input-autocomplete-single-choice/input-autocomplete-single-choice.component";
import { InputDateComponent } from "./shared/views/components/atoms/input-date/input-date.component";
import { InputRadiogroupComponent } from "./shared/views/components/atoms/input-radiogroup/input-radiogroup.component";
import { InputReadonlyComponent } from "./shared/views/components/atoms/input-readonly/input-readonly.component";
import { InputTextComponent } from "./shared/views/components/atoms/input-text/input-text.component";
import { LabelNotInformedComponent } from "./shared/views/components/atoms/label-not-informed/label-not-informed.component";
import { HeaderComponent } from "./shared/views/components/organisms/header/header.component";
import { ToolbarComponent } from "./shared/views/components/organisms/toolbar/toolbar.component";
import { AdminBillingSavePage } from "./admin/views/pages/admin-billing-save/admin-billing-save.page";
import { FilePondModule } from "ngx-filepond";
import { AdminClientUsersManagementPage } from "./admin/views/pages/admin-client-users-management/admin-client-users-management.page";
import { ClientPage } from "./client/views/client.page";
import { ClientDashboardPage } from "./client/views/pages/client-dashboard/client-dashboard.page";
import { RequestInterceptor } from "./shared/interceptors/request.interceptor";
import { ClientInsuranceCompanyRegistrationPage } from "./client/views/pages/client-insurance-company-registration/client-insurance-company-registration.page";
import { ClientInsuranceCompanyRegistrationListComponent } from "./client/views/components/organisms/client-insurance-company-registration-list/client-insurance-company-registration-list.component";
import { BadgeInsuranceCompanyRegistrationStatusComponent } from "./client/views/components/atoms/badge-insurance-company-registration-status/badge-insurance-company-registration-status.component";
import { AdminClientInsuranceCompaniesRegistrationPage } from "./admin/views/pages/admin-client-insurance-companies-registration/admin-client-insurance-companies-registration.page";
import { ClientInsuranceCompanyQuotationRequestPage } from "./client/views/pages/client-insurance-company-quotation-request/client-insurance-company-quotation-request.page";
import { ClientQuotationRequestComponent } from "./client/views/components/organisms/client-quotation-request/client-quotation-request.component";
import { ClientInsuranceCompanyQuotationListPage } from "./client/views/pages/client-insurance-company-quotation-list/client-insurance-company-quotation-list.page";
import { ClientInsuranceCompanyQuotationDetailsPage } from "./client/views/pages/client-insurance-company-quotation-details/client-insurance-company-quotation-details.page";
import { BadgeQuotationStatusComponent } from "./client/views/components/atoms/badge-quotation-status/badge-quotation-status.component";
import { ClientPolicyDetailsPage } from "./client/views/pages/client-policy-details/client-policy-details.page";
import { ClientPolicyListPage } from "./client/views/pages/client-policy-list/client-policy-list.page";
import { BadgePolicyStatusComponent } from "./client/views/components/atoms/badge-policy-status/badge-policy-status.component";
import { SelectSingleChoiceComponent } from "./shared/views/components/atoms/select-single-choice/select-single-choice.component";
import { FullCalendarModule } from "@fullcalendar/angular";
import { ClientAgendaPage } from "./client/views/pages/client-agenda/client-agenda.page";
import { FileDisplayComponent } from "./shared/views/components/atoms/file-display/file-display.component";
import { BadgeProcessDashboardStatusComponent } from "./client/views/components/atoms/badge-process-dashboard-status/badge-process-dashboard-status.component";
import { SelectCompanyComponent } from "./client/views/components/atoms/select-company/select-company.component";
import { SidebarComponent } from "./shared/views/components/organisms/sidebar/sidebar.component";
import { NgbDatepickerI18nPt } from "./shared/i18n/ngb-datepicker-i18n.service";
import { AdminQuotationRequestPage } from "./admin/views/pages/admin-quotation-request/admin-quotation-request.page";
import { BadgeAppealTypeComponent } from "./client/views/components/atoms/badge-appeal-type/badge-appeal-type.component";
import { SaveInsuredFormComponent } from "./shared/views/components/organisms/forms/save-insured/save-insured.form.component";
import { SaveClientFormComponent } from "./shared/views/components/organisms/forms/save-client/save-client.form.component";
import { ModalButtonComponent } from "./shared/views/components/organisms/modals/save-modal-button/app -save-insured-modal";
import { SaveInsuranceCompanyFormComponent } from "./shared/views/components/organisms/forms/save-insurance-company/save-insurance-company.form.component";
import { UpdatePremiumFormComponent } from "./shared/views/components/organisms/forms/update-premium/update-premium.form.component";
import { PaginationComponent } from "./shared/views/components/organisms/pagination/pagination-component";
import { CompactNumberPipe } from "./shared/pipes/compact-number-pipes";
import { AdminPolicyListPage } from "./admin/views/pages/admin-policy-list/admin-policy-list.page";
import { SpreadSheetListPage } from "./admin/views/pages/spreadsheet-list/spreadsheet-list.page";
import { SpreadSheetDetailsPage } from "./admin/views/pages/spreadsheet-details/spreadsheet-details.page";
registerLocaleData(localePt);

dayjs.extend(duration);
dayjs.locale("pt-br");

@NgModule({
    declarations: [
        AppComponent,
        InputTextComponent,
        InputDateComponent,
        InputAutocompleteGooglemapsComponent,
        InputAutocompleteSingleChoiceComponent,
        InputRadiogroupComponent,
        InputReadonlyComponent,
        ButtonComponent,
        SelectSingleChoiceComponent,
        HeaderComponent,
        PaginationComponent,
        ToolbarComponent,
        LabelNotInformedComponent,
        BadgeActivationStatusComponent,
        BadgeInsuranceCompanyRegistrationStatusComponent,
        AdminPage,
        AdminBillingListPage,
        AdminBillingSavePage,
        AdminBrokerListPage,
        AdminBrokerSavePage,
        AdminClientInsuranceCompaniesRegistrationPage,
        AdminClientListPage,
        AdminClientSavePage,
        AdminClientUsersManagementPage,
        AdminConsultantSavePage,
        AdminConsultantListPage,
        AdminDashboardPage,
        AdminDepositInvoiceListPage,
        AdminInsuranceCompanySavePage,
        AdminInsuranceCompanyListPage,
        AdminInsuranceRequestClientCreationPage,
        AdminPolicyListPage,
        AdminPolicySavePage,
        SpreadSheetListPage,
        SpreadSheetDetailsPage,
        AdminQuotationRequestPage,
        AuthBasePage,
        AuthLoginPage,
        ClientPage,
        ClientDashboardPage,
        ClientInsuranceCompanyRegistrationPage,
        ClientInsuranceCompanyRegistrationListComponent,
        ClientInsuranceCompanyQuotationRequestPage,
        ClientQuotationRequestComponent,
        ClientInsuranceCompanyQuotationListPage,
        ClientInsuranceCompanyQuotationDetailsPage,
        BadgeQuotationStatusComponent,
        BadgeAppealTypeComponent,
        ClientPolicyDetailsPage,
        ClientPolicyListPage,
        ClientAgendaPage,
        BadgePolicyStatusComponent,
        BadgeProcessDashboardStatusComponent,
        FileDisplayComponent,
        SelectCompanyComponent,
        SidebarComponent,
        ModalButtonComponent,
        SaveInsuredFormComponent,
        SaveClientFormComponent,
        SaveInsuranceCompanyFormComponent,
        UpdatePremiumFormComponent,
        CompactNumberPipe,
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        AppRoutingModule,
        NgbModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        AppRoutingModule,
        NgbModule,
        NgxMaskDirective,
        NgxMaskPipe,
        NgxSpinnerModule,
        NgApexchartsModule,
        FilePondModule,
        SweetAlert2Module.forRoot(),
        ToastrModule.forRoot({
            timeOut: 5000,
            positionClass: "toast-top-center",
            preventDuplicates: true,
            progressBar: true,
        }),
        FullCalendarModule,
        CommonModule
    ],
    providers: [
        provideNgxMask(),
        {
            provide: ErrorHandler,
            useClass: GlobalErrorHandler,
        },
        { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
        { provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nPt },
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
