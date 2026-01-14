import { FileInfoDto } from "../../shared/models/file-info.dto";

export class InsuranceCompanyDto {
    id: number;
    code: string;
    insuranceCompanyName: string;
    cnpj: string;
    address: string;
    registrationCode: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    status: string;
    createdAt: Date;
}

export class InsuranceCompanyDetailsDto extends InsuranceCompanyDto {
    adminCertificate: FileInfoDto;
    susepCertificate: FileInfoDto;
}
