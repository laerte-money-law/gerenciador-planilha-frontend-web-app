export class AdminInsuranceCompanySaveFormDto {
    contactName: string;
    contactPhone: string;
    contactEmail: string;
}

export class AdminInsuranceCompanytCreateFormDto {
    insuranceCompanyName: string;
    cnpj: string;
    status: string;
    registrationCode: string;
    address: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
}
