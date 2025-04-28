export interface Calendar {
    id: number;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    isVacation: boolean;
    isHolidays: boolean;
    isSickLeave: boolean;
    isOther: boolean;    
}