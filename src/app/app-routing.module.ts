import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppUrls } from "./app.urls";
import { AdminPage } from "./admin/views/admin.page";
import { AdminDashboardPage } from "./admin/views/pages/admin-dashboard/admin-dashboard.page";
import { AdminConsultantSavePage } from "./admin/views/pages/admin-consultant-save/admin-consultant-save.page";
import { AdminConsultantListPage } from "./admin/views/pages/admin-consultant-list/admin-consultant-list.page";
import { AdminInsuranceCompanyListPage } from "./admin/views/pages/admin-insurance-company-list/admin-insurance-company-list.page";
import { AdminInsuranceCompanySavePage } from "./admin/views/pages/admin-insurance-company-save/admin-insurance-company-save.page";
import { AdminClientListPage } from "./admin/views/pages/admin-client-list/admin-client-list.page";
import { AdminBillingListPage } from "./admin/views/pages/admin-billing-list/admin-billing-list.page";
import { AuthBasePage } from "./auth/views/pages/auth-base.page";
import { AuthLoginPage } from "./auth/views/pages/auth-login/auth-login.page";
import { AdminClientSavePage } from "./admin/views/pages/admin-client-save/admin-client-save.page";
import { AdminPolicySavePage } from "./admin/views/pages/admin-policy-save/admin-policy-save.page";
import { AdminDepositInvoiceListPage } from "./admin/views/pages/admin-deposit-invoice-list/admin-deposit-invoice-list.page";
import { AdminInsuranceRequestClientCreationPage } from "./admin/views/pages/admin-insurance-request-client-creation/admin-insurance-request-client-creation.page";
import { AdminBrokerListPage } from "./admin/views/pages/admin-broker-list/admin-broker-list.page";
import { AdminBrokerSavePage } from "./admin/views/pages/admin-broker-save/admin-broker-save.page";
import { AdminBillingSavePage } from "./admin/views/pages/admin-billing-save/admin-billing-save.page";
import { AdminClientUsersManagementPage } from "./admin/views/pages/admin-client-users-management/admin-client-users-management.page";
import { ClientPage } from "./client/views/client.page";
import { ClientDashboardPage } from "./client/views/pages/client-dashboard/client-dashboard.page";
import { ClientInsuranceCompanyRegistrationPage } from "./client/views/pages/client-insurance-company-registration/client-insurance-company-registration.page";
import { AdminClientInsuranceCompaniesRegistrationPage } from "./admin/views/pages/admin-client-insurance-companies-registration/admin-client-insurance-companies-registration.page";
import { ClientInsuranceCompanyQuotationRequestPage } from "./client/views/pages/client-insurance-company-quotation-request/client-insurance-company-quotation-request.page";
import { ClientInsuranceCompanyQuotationListPage } from "./client/views/pages/client-insurance-company-quotation-list/client-insurance-company-quotation-list.page";
import { ClientInsuranceCompanyQuotationDetailsPage } from "./client/views/pages/client-insurance-company-quotation-details/client-insurance-company-quotation-details.page";
import { ClientPolicyDetailsPage } from "./client/views/pages/client-policy-details/client-policy-details.page";
import { ClientPolicyListPage } from "./client/views/pages/client-policy-list/client-policy-list.page";
import { ClientAgendaPage } from "./client/views/pages/client-agenda/client-agenda.page";
import { AdminQuotationRequestPage } from "./admin/views/pages/admin-quotation-request/admin-quotation-request.page";
import { AdminPolicyListPage } from "./admin/views/pages/admin-policy-list/admin-policy-list.page";
import { SpreadSheetListPage } from "./admin/views/pages/spreadsheet-list/spreadsheet-list.page";
import { SpreadSheetDetailsPage } from "./admin/views/pages/spreadsheet-details/spreadsheet-details.page";

const routes: Routes = [
    {
        path: AppUrls.PATHS.AUTH.ROOT(true),
        component: AuthBasePage,
        children: [
            { path: "", redirectTo: AppUrls.PATHS.AUTH.LOG_IN(true), pathMatch: "full" }, // Default route
            { path: AppUrls.PATHS.AUTH.LOG_IN(true), component: AuthLoginPage },
        ],
    },
    {
        path: AppUrls.PATHS.ADMIN.ROOT(true),
        component: AdminPage,
        children: [
            { path: "", redirectTo: AppUrls.PATHS.ADMIN.DASHBOARD(true), pathMatch: "full" }, // Default route
            { path: AppUrls.PATHS.ADMIN.DASHBOARD(true), component: AdminDashboardPage },
            { path: AppUrls.PATHS.ADMIN.DEPOSIT_INVOICE.ROOT(true), component: AdminDepositInvoiceListPage },
            { path: AppUrls.PATHS.ADMIN.CLIENT.ROOT(true), component: AdminClientListPage },
            { path: AppUrls.PATHS.ADMIN.CLIENT.CREATE(true), component: AdminClientSavePage },
            { path: AppUrls.PATHS.ADMIN.CLIENT.EDIT(true), component: AdminClientSavePage },
            { path: AppUrls.PATHS.ADMIN.CLIENT.USERS_MANAGEMENT(true), component: AdminClientUsersManagementPage },
            {
                path: AppUrls.PATHS.ADMIN.CLIENT.INSURANCE_COMPANIES_REGISTRATION(true),
                component: AdminClientInsuranceCompaniesRegistrationPage,
            },
            {
                path: AppUrls.PATHS.ADMIN.CLIENT.INSURANCE_COMPANIES_REGISTRATION(true),
                component: AdminClientInsuranceCompaniesRegistrationPage,
            },
            { path: AppUrls.PATHS.ADMIN.POLICY.ROOT(true), component: AdminPolicyListPage },
            { path: AppUrls.PATHS.ADMIN.SPREADSHEET.ROOT(true), component: SpreadSheetListPage },
            { path: AppUrls.PATHS.ADMIN.SPREADSHEET.DETAIL(true), component: SpreadSheetDetailsPage },
            { path: AppUrls.PATHS.ADMIN.POLICY.CREATE(true), component: AdminPolicySavePage },
            { path: AppUrls.PATHS.ADMIN.CONSULTANT.ROOT(true), component: AdminConsultantListPage },
            { path: AppUrls.PATHS.ADMIN.CONSULTANT.CREATE(true), component: AdminConsultantSavePage },
            { path: AppUrls.PATHS.ADMIN.CONSULTANT.EDIT(true), component: AdminConsultantSavePage },
            { path: AppUrls.PATHS.ADMIN.BROKERS.ROOT(true), component: AdminBrokerListPage },
            { path: AppUrls.PATHS.ADMIN.BROKERS.CREATE(true), component: AdminBrokerSavePage },
            { path: AppUrls.PATHS.ADMIN.INSURANCE_COMPANY.ROOT(true), component: AdminInsuranceCompanyListPage },
            { path: AppUrls.PATHS.ADMIN.INSURANCE_COMPANY.CREATE(true), component: AdminInsuranceCompanySavePage },
            { path: AppUrls.PATHS.ADMIN.INSURANCE_COMPANY.EDIT(true), component: AdminInsuranceCompanySavePage },
            { path: AppUrls.PATHS.ADMIN.INSURANCE_COMPANY.CLIENT_CREATE(true), component: AdminInsuranceRequestClientCreationPage },
            { path: AppUrls.PATHS.ADMIN.BILLING.ROOT(true), component: AdminBillingListPage },
            { path: AppUrls.PATHS.ADMIN.BILLING.CREATE(true), component: AdminBillingSavePage },
            { path: AppUrls.PATHS.ADMIN.QUOTATIONS.ROOT(true), component: ClientInsuranceCompanyQuotationListPage },
            { path: AppUrls.PATHS.ADMIN.QUOTATIONS.REQUEST(true), component: AdminQuotationRequestPage },
        ],
    },
    {
        path: AppUrls.PATHS.CLIENT.ROOT(true),
        component: ClientPage,
        children: [
            { path: "", redirectTo: AppUrls.PATHS.CLIENT.DASHBOARD(true), pathMatch: "full" }, // Default route
            { path: AppUrls.PATHS.CLIENT.DASHBOARD(true), component: ClientDashboardPage },
            { path: AppUrls.PATHS.CLIENT.INSURANCE_COMPANY.REGISTRATION(true), component: ClientInsuranceCompanyRegistrationPage },
            {
                path: AppUrls.PATHS.CLIENT.QUOTATIONS.ROOT(true),
                component: ClientInsuranceCompanyQuotationListPage,
            },
            {
                path: AppUrls.PATHS.CLIENT.QUOTATIONS.REQUEST(true),
                component: ClientInsuranceCompanyQuotationRequestPage,
            },
            {
                path: AppUrls.PATHS.CLIENT.QUOTATIONS.DETAILS(true),
                // path: "seguradoras/cotações/detalhes/:insuredDocument",
                component: ClientInsuranceCompanyQuotationDetailsPage,
            },
            {
                path: AppUrls.PATHS.CLIENT.POLICY.ROOT(true),
                component: ClientPolicyListPage,
            },
            {
                path: AppUrls.PATHS.CLIENT.POLICY.DETAILS(true),
                component: ClientPolicyDetailsPage,
            },
            {
                path: AppUrls.PATHS.CLIENT.AGENDA.ROOT(true),
                component: ClientAgendaPage,
            },
        ],
    },
    { path: "", redirectTo: AppUrls.PATHS.AUTH.ROOT(true), pathMatch: "full" }, // Default route for the entire application
    { path: "**", redirectTo: AppUrls.PATHS.AUTH.ROOT(true) }, // Fallback route
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: "enabled" })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
