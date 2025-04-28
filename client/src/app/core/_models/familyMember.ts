import { Photo } from "./photo";

export interface FamilyMember {
    id: number; 
    fullName: string; 
    email: string; 
    phone: string;
    relationship?: string;
    isParent: boolean;
    photoUrl: string;
    familyMemberPhotos: Photo[];
}