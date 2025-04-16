import { User } from "./user";

export class UserParams {
    gender: string;
    minAge = 0;
    maxAge = 5;
    pageNumber = 1;
    pageSize = 20;
    orderBy = 'lastActive';

    constructor(user: User) {
        if (user.roles.includes('Admin'))
            this.gender = '';
        else    
            this.gender = user.gender === 'female' ? 'male' : 'female'
    }
}