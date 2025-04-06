import { Address } from "./address";
import { UserCalendar } from "./userCalendar";
import { FamilyMember } from "./familyMember";
import { Photo } from "./photo";

export interface Member {
    id: number;    
    username: string;
    photoUrl: string;
    age: number;
    knownAs: string;
    created: Date;
    lastActive: Date;
    gender: string;
    introduction: string;    
    interests: string;
    city: string;
    country: string;
    canSendMessages: boolean;
    addresses: Address[];
    userPhotos: Photo[];
    familyMembers: FamilyMember[];
    userCalendars: UserCalendar[];
}