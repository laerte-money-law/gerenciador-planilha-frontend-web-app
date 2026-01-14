export class ClientQuotationRequestFormDto {
    caseNumber: string;
    court: string;
    insuredName: string;
    insuredDocument: string;
    insuredAddressRoute: string;
    insuredAddressNumber: string;
    insuredAddressNeighborhood: string;
    insuredAddressCity: string;
    insuredAddressState: string;
    insuredAddressZipCode: string;
    insuredPhone: string;
    insuredEmail: string;
    insuranceCompanies: ClientQuotationRequestInsuranceCompanyDataFormDto[];
    clientCodes?: string[];
}

export class ClientQuotationRequestInsuranceCompanyDataFormDto {
    insuranceCompanyRegistrationCode: string;
    appealType: string;
    insuredAmount: number;
    startDate: Date;
    duration: number;
    tax?: number; // Only for admin user
}
