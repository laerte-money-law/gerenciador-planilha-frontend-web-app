export class ClientPolicyDto {
    policyNumber: string;
    client: {
        cnpj: string; // from client.cnpj
        companyName: string; // from client.companyName
    };
    insured: {
        name: string;
        document: string;
    };
    cost: number;
    appealType: string;
    premiumTotalValue: number;
    bankSlipDueDate: Date; // ISO date string
    status: string;
    bankSlipNumber: string;
    endDate: Date;
}


export class SpreadsheetDto {
    name: string
    servico: string
    client: string
    createdAt: Date
    status: string
}
