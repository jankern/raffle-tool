export interface Participant {
    firstName: string;
    lastName: string;
    email: string;
    isSupporter: boolean;
}

export interface Price {
    priceText: string;
}

export interface Winner {
    firstName: string;
    lastName: string;
    email: string;
    priceText?: string | null;
    winnerCount?: number | null;
}

export interface Raffle {
    name: string;
    includeNewsletterParticipants: boolean;
    numberOfParticipants?: number | null;
    hasPrizes: boolean;
    participants: Participant[];
    prices: Price[];
    winners: Winner[];

    addParticipant(participant: Participant): void;
    pickWinner(): Participant | null;
    addPrice(price: Price): void;
    removePrice(price: Price): void;
    getPrice(index: number): Price | null;
    addWinner(winner: Winner): void;
    removeWinner(winner: Winner): void;
    importParticipantsFromCSV(csvString: string, delimiter?: string): void;
}