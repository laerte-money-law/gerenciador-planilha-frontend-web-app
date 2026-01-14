export class JwtTokenDecodedDto {
    sub: string;
    name: string;
    phone_number: string;
    email: string;
    role: string;
    clientCode?: string;
    clientName?: string;
    clientCnpj?: string;
}
