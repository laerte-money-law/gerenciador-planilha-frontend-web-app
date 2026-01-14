import { ErrorMessages } from "../models/enums/error-messages.enum";
import { Address } from "../views/components/atoms/input-autocomplete-googlemaps/input-autocomplete-googlemaps.component";
import { BaseValidator } from "./base.validator";

export class AddressValidator extends BaseValidator {
    public override isValid(address: Address): boolean {
        let response = true;
        if (!address.route) {
            this._errorMessage = ErrorMessages.ADDRESS_INCOMPLETE("o logradouro");
            response = false;
        }
        if (!address.number) {
            this._errorMessage = ErrorMessages.ADDRESS_INCOMPLETE("o número");
            response = false;
        }
        if (!address.neighborhood) {
            this._errorMessage = ErrorMessages.ADDRESS_INCOMPLETE("o bairro");
            response = false;
        }
        if (!address.city) {
            this._errorMessage = ErrorMessages.ADDRESS_INCOMPLETE("a cidade");
            response = false;
        }
        if (!address.state) {
            this._errorMessage = ErrorMessages.ADDRESS_INCOMPLETE("o estado");
            response = false;
        }
        if (!address.postalCode) {
            this._errorMessage = ErrorMessages.ADDRESS_INCOMPLETE("o CEP");
            response = false;
        }
        return response;
    }
}
