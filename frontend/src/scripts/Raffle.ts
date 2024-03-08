import { Participant, Price, Winner, Raffle } from './Interfaces';

import { ParticipantImplementation } from "./Participant";
import { PriceImplementation } from "./Price";
import { WinnerImplementation } from "./Winner";

export class RaffleImplementation implements Raffle {
    name: string;
    includeNewsletterParticipants: boolean;
    numberOfParticipants?: number | null;
    hasPrizes: boolean;
    participants: Participant[];
    prices: Price[];
    winners: Winner[];

    constructor(name: string, includeNewsletterParticipants: boolean, hasPrizes: boolean, numberOfParticipants?: number | null) {
        this.name = name;
        this.includeNewsletterParticipants = includeNewsletterParticipants;
        this.numberOfParticipants = numberOfParticipants;
        this.hasPrizes = hasPrizes;
        this.participants = [];
        this.prices = [];
        this.winners = [];
    }

    addParticipant(participant: Participant) {
        this.participants.push(participant);
    }

    getParticipantList(){
        return this.participants;
    }

    pickWinner(): Participant | null {
        if (this.participants.length === 0) {
            return null;
        }

        const winnerIndex = Math.floor(Math.random() * this.participants.length);
        return this.participants[winnerIndex];
    }

    addPrice(price: Price) {
        this.prices.push(price);
    }

    removePrice(price: Price) {
        const index = this.prices.indexOf(price);
        if (index !== -1) {
            this.prices.splice(index, 1);
        }
    }

    getPrice(index: number): Price | null {
        if (index >= 0 && index < this.prices.length) {
            return this.prices[index];
        }
        return null;
    }

    addWinner(winner: Winner) {
        this.winners.push(winner);
    }

    removeWinner(winner: Winner) {
        const index = this.winners.indexOf(winner);
        if (index !== -1) {
            this.winners.splice(index, 1);
        }
    }

    importParticipantsFromCSV(csvString: string, delimiter: string = ',') {
        const rows = csvString.split('\n');
        for (const row of rows) {
            const columns = row.split(delimiter);
            const firstName = columns[0].trim();
            const lastName = columns[1].trim();
            const email = columns[2].trim();
            const isSupporter = columns[3].trim().toLowerCase() === 'true';
            this.addParticipant({ firstName, lastName, email, isSupporter });
        }
    }
}