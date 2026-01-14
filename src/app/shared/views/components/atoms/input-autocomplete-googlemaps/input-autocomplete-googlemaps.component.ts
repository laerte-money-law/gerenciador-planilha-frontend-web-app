import { Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from "@angular/core";
import { BaseInputComponent } from "../base-input.component";
import { AddressValidator } from "../../../../validators/address.validator";

export type Address = {
    formatted?: string;
    number?: string;
    route?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
};

@Component({
    selector: "app-input-autocomplete-googlemaps",
    templateUrl: "./input-autocomplete-googlemaps.component.html",
    styleUrls: [],
})
export class InputAutocompleteGooglemapsComponent extends BaseInputComponent implements OnInit {
    @ViewChild("inputAutocompleteGooglemaps") inputAutocompleteGooglemapsRef: ElementRef;
    @Input() label: string;
    @Input() placeholder: string;
    @Input() initialValue: string = "";
    @Input() required: boolean = false;
    @Input() validateAddress: boolean = false;
    @Input() readOnly: boolean = false;
    @Input() onlyCepAutocomplete: boolean = false;

    protected value: string = "";
    protected addressValueByGoogleMapsAutocomplete: Address;
    protected isValidated: boolean = false;
    protected valid: boolean = true;
    protected errorMessage: string = "";
    private addressValidator: AddressValidator = new AddressValidator();

    constructor(private readonly ngZone: NgZone) {
        super();
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.initAddressAutocompleteUsingGoogleMaps();
        }, 100);

        this.addressValueByGoogleMapsAutocomplete = {
            formatted: this.initialValue,
            number: null,
            route: null,
            neighborhood: null,
            city: null,
            state: null,
            country: null,
            postalCode: null,
        };
        this.value = this.initialValue;
    }

    getValue(): Address {
        return this.addressValueByGoogleMapsAutocomplete;
    }

    setValue(address: Address): void {
        this.addressValueByGoogleMapsAutocomplete = address;

        const isCepMode = this.onlyCepAutocomplete;
        const formatted = isCepMode
            ? (address.postalCode ?? "")
            : InputAutocompleteGooglemapsComponent.formatAddress(address);

        this.value = formatted;
        this.inputAutocompleteGooglemapsRef.nativeElement.value = formatted;
        this.addressValueByGoogleMapsAutocomplete.formatted = formatted;
    }




    validate(): boolean {
        this.isValidated = true;
        this.valid = true;
        if (this.required && (!this.getValue() || !this.getValue().formatted)) {
            this.valid = false;
            this.errorMessage = this.ERROR_MESSAGES.INPUT_FIELD_REQUIRED(this.label);
            console.info(`Componente ${this.label} está inválido por motivos de obrigatoriedade`);
        } else if (this.validateAddress && !this.addressValidator.isValid(this.getValue())) {
            this.valid = false;
            this.errorMessage = this.addressValidator.errorMessage;
            console.info(`Componente ${this.label} está inválido.`);
        }

        return this.valid;
    }

    isValid(): boolean {
        return this.valid;
    }

    static formatAddress(address: Address, onlyCep: boolean = false): string {
        if (!address) return "";

        if (onlyCep && address.postalCode) {
            return address.postalCode;
        }

        const parts: string[] = [];

        if (address.route) parts.push(address.route);
        if (address.number) parts.push(address.number);
        if (address.neighborhood) parts.push(address.neighborhood);
        if (address.city) parts.push(address.city);
        if (address.state) parts.push(address.state);
        if (address.postalCode) parts.push(address.postalCode);
        if (address.country) parts.push(address.country);

        return parts.join(", ");
    }


    private initAddressAutocompleteUsingGoogleMaps() {
        const types = this.onlyCepAutocomplete ? ["(regions)"] : ["geocode"];

        const autocomplete = new google.maps.places.Autocomplete(
            this.inputAutocompleteGooglemapsRef.nativeElement,
            {
                componentRestrictions: { country: "BR" },
                types,
            }
        );

        autocomplete.addListener("place_changed", () => {
            this.ngZone.run(() => {
                const place: google.maps.places.PlaceResult = autocomplete.getPlace();

                this.decomposeAddress(place);

                const formatted = this.onlyCepAutocomplete
                    ? this.addressValueByGoogleMapsAutocomplete.postalCode ?? ""
                    : place.formatted_address;

                this.inputAutocompleteGooglemapsRef.nativeElement.value = formatted;
                this.value = formatted;
                this.addressValueByGoogleMapsAutocomplete.formatted = formatted;

                if (this.isValidated) {
                    this.validate();
                }
            });
        });
    }




    @Output() addressSelected = new EventEmitter<Address>();
    private decomposeAddress(address: google.maps.places.PlaceResult): void {
        this.addressValueByGoogleMapsAutocomplete = {
            formatted: address.formatted_address,
            number: address.address_components.find((component) => component.types.includes("street_number"))?.long_name || "s/n",
            route: address.address_components.find((component) => component.types.includes("route"))?.long_name,
            neighborhood: address.address_components.find((component) => component.types.includes("sublocality" || "sublocality_level_1"))
                ?.long_name,
            city: address.address_components.find((component) => component.types.includes("administrative_area_level_2"))?.long_name,
            state: address.address_components.find((component) => component.types.includes("administrative_area_level_1"))?.short_name,
            country: address.address_components.find((component) => component.types.includes("country"))?.long_name,
            postalCode: address.address_components.find((component) => component.types.includes("postal_code"))?.long_name,
        };
        this.addressSelected.emit(this.addressValueByGoogleMapsAutocomplete);
    }
    
}
