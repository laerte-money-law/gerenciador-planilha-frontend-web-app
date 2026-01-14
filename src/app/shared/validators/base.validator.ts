export abstract class BaseValidator {
    public static readonly MASKS = {
        PHONE: "(00) 0000-0000||(00) 00000-0000",
        CPF: "000.000.000-00",
        CNPJ: "00.000.000/0000-00",
        CODIGO_SUSEP: "000000000000000000000000",
        CEP: "00000-000",
        NUMERO_PROCESSO: "0000000-00.0000.0.00.0000",
    };
    public static readonly FIELDS = {
        TEXT: {
            MIN_LENGTH: 2,
            MAX_LENGTH: 256,
        },
        PHONE: {
            MIN_LENGTH: 10,
            MAX_LENGTH: 11,
        },
        INSURANCE_COMPANY_REGISTRATION_NUMBER: {
            MIN_LENGTH: 1,
            MAX_LENGTH: 5,
        },
        EMAIL: {
            USERNAME: {
                MIN_LENGTH: 2,
                MAX_LENGTH: 64,
            },
            DOMAIN: {
                HOST: {
                    MIN_LENGTH: 1,
                    MAX_LENGTH: 64,
                },
                TOP_LEVEL: {
                    MIN_LENGTH: 2,
                    MAX_LENGTH: 64,
                },
            },
        },
    };

    protected _errorMessage: string;
    private readonly _force: boolean;

    public get errorMessage(): string {
        return this._errorMessage;
    }

    public get force(): boolean {
        return this._force;
    }

    constructor(errorMessage: string = null, force: boolean = false) {
        this._errorMessage = errorMessage;
        this._force = force;
    }

    public abstract isValid(text: any): boolean;
}
