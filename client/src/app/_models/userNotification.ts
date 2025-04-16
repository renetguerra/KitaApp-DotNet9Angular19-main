import { Notification } from "./notification";

export interface UserNotification {    
    notification: Notification; 
    dateRead: Date;
    notificationSent: Date;
    isDone: boolean;
    userId: number;   
}