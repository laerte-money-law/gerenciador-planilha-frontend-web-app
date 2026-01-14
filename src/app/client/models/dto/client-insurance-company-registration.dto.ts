export class ClientInsuranceCompanyRegistrationDto {
    clientCode: string;
    clientCnpj: string;
    insuranceCompanyRegistrationCode: string;
    insuranceCompanyName: string;
    statusInInsuranceCompany: string;
    creditLimit: number;
    annualInterest: number;
    notes: string;
    synchronizedAt: Date;
    expiresAt: Date;

    constructor(props: Partial<ClientInsuranceCompanyRegistrationDto>) {
        Object.assign(this, props);
    }
}
