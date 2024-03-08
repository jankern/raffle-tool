import { Winner } from './Interfaces';

export class WinnerImplementation implements Winner {
    firstName: string;
    lastName: string;
    email: string;
    priceText?: string | null;
    winnerCount?: number | null;

    constructor(firstName: string, lastName: string, email: string, priceText?: string | null, winnerCount?: number | null) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.priceText = priceText;
        this.winnerCount = winnerCount;
    }
}