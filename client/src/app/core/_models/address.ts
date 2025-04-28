export interface Address {
    id: number;
    street: string;
    streetNumber: string;
    postalCode: string;
    knownAs: string;    
    city: string;
    country: string;
    isPrimaryResidence: boolean;    
}