export class AdminClientSaveFormDto {
    companyName: string;
    cnpj: string;
    address: string;
    neighborhood?: string;
    city: string;
    state: string;
    cep: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    subsidiaries: Array<{
        companyName: string;
        cnpj: string;
    }>;
}
