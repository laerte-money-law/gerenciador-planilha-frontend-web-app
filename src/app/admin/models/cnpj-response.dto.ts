export interface CnpjResponse {
  nome: string;
  fantasia: string;
  email: string;
  cnpj: string;
  nomeSocios: PartnerNameList[];
  telefone: string;
  logradouro: string;
  numero: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
}

export interface PartnerNameList {
  nome: string;
  qual: string;
}
