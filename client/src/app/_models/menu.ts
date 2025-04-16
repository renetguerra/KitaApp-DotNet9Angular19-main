export interface Menu {
    id: number;    
    title: string;
    description: string;
    typeFoodId: number;
    dayOfWeek: string;
    date: Date;
    isActive: boolean;  
    imageName: string;   
}