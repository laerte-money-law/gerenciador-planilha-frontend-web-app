export class ClientQuotationsDto {
    code: string;
    name: string;
    document: string;
    phone: string;
    email: string;
    addressRoute: string;
    addressNumber: string;
    addressNeighborhood: string;
    addressCity: string;
    addressState: string;
    addressZipCode: string;
    isProposalSent: boolean;
    caseNumber: string;
    court: string;
    createdAt: Date;
    quotationInsuranceCompanies: ClientQuotationsInsuranceCompanyDto[];
    // Campos adicionados
    clientCnpj: string;
    clientCode: string;
    clientName: string;

    quotations: QuotationInfoDto[];
}

export class QuotationInfoDto {
    insuranceCompany?: string;
    quotationStatus?: string;
    insuredAmount?: number;
    appealType?: string;
}

export class ClientQuotationsInsuranceCompanyDto {
    code: string;
    insuranceCompanyRegistrationCode: string;
    insuranceCompanyName: string;
    proposalNumber: string;
    policyNumber: string;
    certificateNumber: string;
    externalIntegrationExtraId: string;
    expiresAt: Date;
    status: string;
    proposalUrl: string;
    premiumValue: number;
    bankSlipDueDate: Date;
}

export class ClientQuotationContext {
    clientCode: string;
    insuredCode: string;
    quotationCode: string;
}
