import { User } from "./user";

export class UserParams {
    gender: string;
    minAge = 0;
    maxAge = 5;
    pageNumber = 1;
    pageSize = 15;
    orderBy = 'lastActive';

    constructor(user: User) {
        this.gender  = user.gender === 'female' ? 'male' : 'female'
    }
}