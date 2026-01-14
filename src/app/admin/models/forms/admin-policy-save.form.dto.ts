export interface CompanyDto {
    companyName: string;
    cnpj: string;
    address: string;
}

export interface InsurancePolicyFormDto {
    // Process details
    processNumber: string;
    policyNumber: string;
    insuranceBranch: string;
    proposalNumber: string;

    insuredId: number;
    clientId: number;
    insuranceCompanyId: number;

    // Insurance company data
    susepCode: string;

    modality: string;
    modalityType: string;

    insuredAmount: number;
    coverageStartDate: Date;
    coverageEndDate: Date;

    // Insurance cost
    netPremium: number;
    fractionalAdditional: number;
    policyCost: number;
    iof: number; // Tax on Financial Operations
    totalPremium: number;

    // Payment method
    installmentPlan: string; // e.g., "single", "6x", "10x"
    installmentValue: number;
    dueDate: Date;
}
