import { ClientSubsidiaryDto } from "src/app/client/models/dto/client-subsidiaries.dto";

export class ClientDto {
    id: number;
    code: string;
    companyName: string;
    cnpj: string;
    address: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    status: string;
    createdAt: Date;
    subsidiaries?: ClientSubsidiaryDto[];
}
