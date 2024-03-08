import { Participant} from './Interfaces';

export class ParticipantImplementation implements Participant {
    firstName: string;
    lastName: string;
    email: string;
    isSupporter: boolean;

    constructor(firstName: string, lastName: string, email: string, isSupporter: boolean) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.isSupporter = isSupporter;
    }
}