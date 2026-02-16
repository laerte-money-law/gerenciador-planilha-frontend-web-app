import { en } from "@fullcalendar/core/internal-common";
import { environment } from "../environments/environment";
import { DepositGuideFilter } from "./admin/models/admin-deposit-guide-query-params.dto";
import { InsurancePolicyFormDto } from "./admin/models/forms/admin-policy-save.form.dto";
import { SpreadSheetRequestParamsDto } from "./admin/models/spreadsheet.dto";

export class AppUrls {
    public static readonly PATHS = {
        /**
         * ROOT: "/"
         * AUTH: {
         *     ROOT: "/acesso",
         *     LOG_IN: "/acesso/entrar",
         *     SIGN_UP: "/acesso/cadastro",
         *     PASSWORD_FORGOT: "/acesso/senha/esqueci",
         * }
         */
        ROOT: (relative: boolean = false) => (relative ? "" : "/"),
        AUTH: {
            ROOT: (relative: boolean = false) => (relative ? "acesso" : "/acesso"),
            LOG_IN: (relative: boolean = false) => (relative ? "entrar" : `${this.PATHS.AUTH.ROOT(relative)}/entrar`),
            SIGN_UP: (relative: boolean = false) => (relative ? "cadastro" : "/acesso/cadastro"),
            PASSWORD_FORGOT: (relative: boolean = false) => (relative ? "senha/esqueci" : "/acesso/senha/esqueci"),
        },
        ADMIN: {
            ROOT: (relative: boolean = false) => (relative ? "admin" : "/admin"),
            DASHBOARD: (relative: boolean = false) => (relative ? "inicio" : `${this.PATHS.ADMIN.ROOT(relative)}/inicio`),
            DEPOSIT_INVOICE: {
                ROOT: (relative: boolean = false) => (relative ? "guias-deposito" : `${this.PATHS.ADMIN.ROOT(relative)}/guias-deposito`),
            },

            CLIENT: {
                ROOT: (relative: boolean = false) => (relative ? "clientes" : `${this.PATHS.ADMIN.ROOT(relative)}/clientes`),
                CREATE: (relative: boolean = false) => `${this.PATHS.ADMIN.CLIENT.ROOT(relative)}/cadastrar`,
                EDIT: (relative: boolean = false, code?: string) => `${this.PATHS.ADMIN.CLIENT.ROOT(relative)}/editar/${code || ":code"}`,
                USERS_MANAGEMENT: (relative: boolean = false, code?: string) =>
                    `${this.PATHS.ADMIN.CLIENT.ROOT(relative)}/${code || ":code"}/usuarios`,
                INSURANCE_COMPANIES_REGISTRATION: (relative: boolean = false, code?: string) =>
                    `${this.PATHS.ADMIN.CLIENT.ROOT(relative)}/${code || ":code"}/seguradoras/cadastro`,
            },
            POLICY: {
                ROOT: (relative: boolean = false) => (relative ? "apolices" : `${this.PATHS.ADMIN.ROOT(relative)}/apolices`),
                CREATE: (relative: boolean = false) => `${this.PATHS.ADMIN.POLICY.ROOT(relative)}/cadastrar`,
            },
            SPREADSHEET: {
                ROOT: (relative: boolean = false) => (relative ? "spreadsheet" : `${this.PATHS.ADMIN.ROOT(relative)}/spreadsheet`),
                DETAIL: (relative: boolean = false, id?: string) => `${this.PATHS.ADMIN.SPREADSHEET.ROOT(relative)}/detalhes/${id || ":id"}`,
            },
            CONSULTANT: {
                ROOT: (relative: boolean = false) => (relative ? "consultores" : `${this.PATHS.ADMIN.ROOT(relative)}/consultores`),
                CREATE: (relative: boolean = false) => `${this.PATHS.ADMIN.CONSULTANT.ROOT(relative)}/cadastrar`,
                EDIT: (relative: boolean = false, code?: string) =>
                    `${this.PATHS.ADMIN.CONSULTANT.ROOT(relative)}/editar/${code || ":code"}`,
            },
            INSURANCE_COMPANY: {
                ROOT: (relative: boolean = false) => (relative ? "seguradoras" : `${this.PATHS.ADMIN.ROOT(relative)}/seguradoras`),
                CLIENT_CREATE: (relative: boolean = false, depositGuideId?: string) =>
                    `${this.PATHS.ADMIN.INSURANCE_COMPANY.ROOT(relative)}/clientes/${depositGuideId || ":depositGuideId"}/cadastrar`,
                CREATE: (relative: boolean = false) => `${this.PATHS.ADMIN.INSURANCE_COMPANY.ROOT(relative)}/cadastrar`,
                EDIT: (relative: boolean = false, code?: string) =>
                    `${this.PATHS.ADMIN.INSURANCE_COMPANY.ROOT(relative)}/editar/${code || ":code"}`,
            },
            QUOTATIONS: {
                ROOT: (relative: boolean = false) => (relative ? "cotacoes" : `${this.PATHS.ADMIN.ROOT(relative)}/cotacoes`),
                REQUEST: (relative: boolean = false, depositGuideId?: string) =>
                    `${this.PATHS.ADMIN.QUOTATIONS.ROOT(relative)}/${depositGuideId || ":depositGuideId"}/solicitar`,
            },
            BROKERS: {
                ROOT: (relative: boolean = false) => (relative ? "corretoras" : `${this.PATHS.ADMIN.ROOT(relative)}/corretoras`),
                CREATE: (relative: boolean = false) => `${this.PATHS.ADMIN.BROKERS.ROOT(relative)}/cadastrar`,
                EDIT: (relative: boolean = false, code?: string) => `${this.PATHS.ADMIN.BROKERS.ROOT(relative)}/editar/${code || ":code"}`,
            },
            BILLING: {
                ROOT: (relative: boolean = false) => (relative ? "faturamento" : `${this.PATHS.ADMIN.ROOT(relative)}/faturamento`),
                CREATE: (relative: boolean = false) => `${this.PATHS.ADMIN.BILLING.ROOT(relative)}/cadastrar`,
            },
        },
        /**
         *     CLIENT: {
         *         ROOT: "/cliente",
         *         DASHBOARD: "/cliente/inicio",
         *         INSURANCE_COMPANY: {
         *             ROOT: "/cliente/seguradoras",
         *             REGISTRATION: "/cliente/seguradoras/cadastrar",
         *             QUOTATIONS: {
         *                 ROOT: "/cliente/seguradoras/cotacoes",
         *                 REQUEST: "/cliente/seguradoras/cotacoes/solicitar",
         *             },
         *         },
         *     },
         */
        CLIENT: {
            ROOT: (relative: boolean = false) => (relative ? "cliente" : "/cliente"),
            DASHBOARD: (relative: boolean = false) => (relative ? "inicio" : `${this.PATHS.CLIENT.ROOT(relative)}/inicio`),
            INSURANCE_COMPANY: {
                ROOT: (relative: boolean = false) => (relative ? "seguradoras" : `${this.PATHS.CLIENT.ROOT(relative)}/seguradoras`),
                REGISTRATION: (relative: boolean = false) => `${this.PATHS.CLIENT.INSURANCE_COMPANY.ROOT(relative)}/cadastro`,
            },
            QUOTATIONS: {
                ROOT: (relative: boolean = false) => (relative ? "cotacoes" : `${this.PATHS.CLIENT.ROOT(relative)}/cotacoes`),
                // DETAILS: (relative: boolean = false, insuredDocument?: string) =>
                //     `${relative ? "" : "/cliente/"}seguradoras/cotações/detalhes/${insuredDocument || ":insuredDocument"}`,
                DETAILS: (relative: boolean = false, clientCode?: string, insuredCode?: string) =>
                    `${this.PATHS.CLIENT.QUOTATIONS.ROOT(relative)}/detalhes/${clientCode || ":clientCode"}/${insuredCode || ":insuredCode"
                    }`,
                REQUEST: (relative: boolean = false) => `${this.PATHS.CLIENT.QUOTATIONS.ROOT(relative)}/solicitar`,
            },
            POLICY: {
                ROOT: (relative: boolean = false) => (relative ? "apolices" : `${this.PATHS.CLIENT.ROOT(relative)}/apolices`),
                DETAILS: (relative: boolean = false, insuredDocument?: string, policyNumber?: string) =>
                    `${this.PATHS.CLIENT.POLICY.ROOT(relative)}/${insuredDocument || ":insuredDocument"}/${policyNumber || ":policyNumber"
                    }/detalhes`,
            },
            AGENDA: {
                ROOT: (relative: boolean = false) => (relative ? "agenda" : `${this.PATHS.CLIENT.ROOT(relative)}/agenda`),
            },


        },
    };

    public static readonly API_ENDPOINTS = {
        AUTH: {
            SIGN_UP: () => `${environment.apiUrl}/api/auth/signup`,
            LOG_IN: () => `${environment.apiUrl}/api/auth/login`,
            PASSWORD_FORGOT: () => `${environment.apiUrl}/api/auth/password/forgot`,
            REFRESH_TOKEN: () => `${environment.apiUrl}/api/auth/token/refresh`,
        },

        ADMIN: {
            CLIENT: (code?: string) => `${environment.apiUrl}/api/admin/clients${code ? `/${code}` : ""}`,
            CLIENT_INSURANCE_COMPANIES: (code?: string, insuranceCompanyRegistrationCode?: string) =>
                `${environment.apiUrl}/api/admin/clients${code ? `/${code}` : ""}/insurance-companies${insuranceCompanyRegistrationCode ? `/${insuranceCompanyRegistrationCode}` : ""
                }`,
            CLIENT_STATUS: (code: string) => `${environment.apiUrl}/api/admin/clients/${code}/status`,
            CONSULTANT: (code?: string) => `${environment.apiUrl}/api/admin/consultants${code ? `/${code}` : ""}`,
            CONSULTANT_STATUS: (code: string) => `${environment.apiUrl}/api/admin/consultants/${code}/status`,
            INSURANCE_COMPANIES: (code?: string) => `${environment.apiUrl}/api/admin/insurance-companies${code ? `/${code}` : ""}`,
            INSURANCE_COMPANIES_STATUS: (code?: string) => `${environment.apiUrl}/api/admin/insurance-companies/${code}/status`,
            INSURANCE_COMPANIES_CERTIFICATE: (code: string, type: "admin" | "susep") =>
                `${environment.apiUrl}/api/admin/insurance-companies/${code}/certificates/${type}`,
            CLIENT_USERS_MANAGEMENT: (code: string, userCode?: string) =>
                `${environment.apiUrl}/api/admin/clients/${code}/users${userCode ? `/${userCode}` : ""}`,
            CLIENT_USER_STATUS: (code: string, userCode: string) =>
                `${environment.apiUrl}/api/admin/clients/${code}/users/${userCode}/status`,
            DASHBOARD: (code: string, userCode: string) => `${environment.apiUrl}/api/admin/dashboard${code ? `/${code}` : ""}`,
            COMPANY_INFORMATION_BY_EXTERNAL_SERVICE: () => `${environment.apiUrl}/api/admin/external-service/company-information`,
            DEPOSIT_GUIDE: (filter: DepositGuideFilter) =>
                `${environment.apiUrl}/api/admin/deposit-guide${DepositGuideFilter.buildQueryString(filter)}`,
            DEPOSIT_GUIDE_ADD_CLIENT: (depositGuideId: string) =>
                `${environment.apiUrl}/api/admin/deposit-guide/${depositGuideId}/add-client`,
            EXPORT_REPORT_DEPOSIT_GUIDE: (filter: DepositGuideFilter) =>
                `${environment.apiUrl}/api/admin/deposit-guide/export${DepositGuideFilter.buildQueryString(filter)}`,
            QUOTATIONS: () => `${environment.apiUrl}/api/admin/quotations`,
            QUOTATION_UPDATE_INFO: (quotationCode: string) => `${environment.apiUrl}/api/admin/quotations/${quotationCode}/info`,
            QUOTATION_UPDATE_PREMIUM: (quotationCode: string) => `${environment.apiUrl}/api/admin/quotations/${quotationCode}/premium`,
            ADD_POLICY: () => `${environment.apiUrl}/api/admin/policies`,
            GET_POLICIES: () => `${environment.apiUrl}/api/admin/policies`,
            SPREADSHEET_LIST: () =>
                `${environment.apiUrl}/api/spreadsheets`,

            SPREADSHEET_LIST_DETAIL: (id: string, relative: boolean = false) =>
                `${environment.apiUrl}/api/spreadsheets/${id}`,

            SPREADSHEET_ADD_COLUMN: (id: string) =>
                `${environment.apiUrl}/api/spreadsheets/${id}/column`,

            SPREADSHEET_DELETE_COLUMN: (id: string) =>
                `${environment.apiUrl}/api/spreadsheets/${id}/column`,

            IMPORT: () => `${environment.apiUrl}/api/import`,
            ATTACHMENT: {
                LIST:(spreadsheetMetadataId: string, rowId: number) => `${environment.apiUrl}/api/attachments?spreadsheetMetadataId=${spreadsheetMetadataId}&rowId=${rowId}`,
                UPLOAD: () => `${environment.apiUrl}/api/attachments`
            },

            },
        CLIENT: {
            UPDATE_INSURANCE_COMPANY_REGISTRATIONS: (insuranceCompanyRegistrationCode, clientCode: string) =>
                `${environment.apiUrl}/api/client/insurance-companies/${insuranceCompanyRegistrationCode}?clientCode=${clientCode}`,
            GET_INSURANCE_COMPANY_REGISTRATIONS: (clientCode) =>
                `${environment.apiUrl}/api/client/insurance-companies?clientCode=${clientCode}`,
            INSURANCE_COMPANIES_CERTIFICATE: (code: string, type: "admin" | "susep") =>
                `${environment.apiUrl}/api/client/insurance-companies/${code}/certificates/${type}`,
            GET_ALL_INSURANCE_COMPANIES: () => `${environment.apiUrl}/api/client/insurance-companies/all`,
            ADD_QUOTATIONS: () => `${environment.apiUrl}/api/client/quotations`,
            QUOTATIONS: (clientCode?: string) =>
                `${environment.apiUrl}/api/client/quotations${clientCode != null ? "?clientCode=" + clientCode : ""}`,
            QUOTATION_DETAIL: (insuredCode?: string) =>
                `${environment.apiUrl}/api/client/quotations${insuredCode ? `/${insuredCode}` : ""}`,
            QUOTATION_DOCUMENT: (insuredCode: string, insuranceCompanyRegistrationCode: string) =>
                `${environment.apiUrl}/api/client/quotations/${insuredCode}/${insuranceCompanyRegistrationCode}/document/`,
            QUOTATION_PROPOSAL_ACCEPT: (clientCode: string, insuredCode: string, insuranceCompanyRegistrationCode: string) =>
                `${environment.apiUrl}/api/client/quotations/${clientCode}/${insuredCode}/${insuranceCompanyRegistrationCode}/accept`,
            PROPOSAL_BANK_SLIP: (insuredDocument: string) => `${environment.apiUrl}/api/client/proposal/${insuredDocument}/bank-slip`,
            POLICY_DETAILS: (insuredDocument?: string, policyNumber?: string) =>
                `${environment.apiUrl}/api/client/policies${insuredDocument ? `/${insuredDocument}` : ""}${policyNumber ? `/${policyNumber}` : ""
                }`,
            POLICIES: (clientCode: string) => `${environment.apiUrl}/api/client/policies?clientCode=${clientCode}`,
            POLICY_BANK_SLIP_DOCUMENT: (insuredDocument: string, policyNumber: string) =>
                `${environment.apiUrl}/api/client/policies/${insuredDocument}/${policyNumber}/bank-slip/document`,
            POLICY_DOCUMENT: (insuredDocument: string, policyNumber: string) =>
                `${environment.apiUrl}/api/client/policies/${insuredDocument}/${policyNumber}/document`,
            AGENDA: (clientCode: string) => `${environment.apiUrl}/api/client/${clientCode}/agenda/`,
            AGENDA_RANGE: (clientCode: string) => `${environment.apiUrl}/api/client/${clientCode}/agenda/range`,
            DASHBOARD: {
                PROCESS: () => `${environment.apiUrl}/api/client/dashboards/process`,
                OVERVIEW: () => `${environment.apiUrl}/api/client/dashboards/overview`,
                CARDSINFO: () => `${environment.apiUrl}/api/client/dashboards/policy-cards-info`,
            },
            SUBSIDIARIES: (clientCode: string) => `${environment.apiUrl}/api/client/${clientCode}/subsidiaries`,
            INSURED: () => `${environment.apiUrl}/api/client/insured`,
            COURT_NAMES: (processNumber: string) => `${environment.apiUrl}/api/client/process/search?processNumber=${processNumber}`,
        },

        RECEITAWS: {
            COMPANY_INFORMATION: (cnpj: string) => `${environment.receitawsApiUrl}${cnpj}`,
        },
    };

    public static readonly EXTERNAL = {};
}
