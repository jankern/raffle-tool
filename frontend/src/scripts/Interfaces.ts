export interface Participant {
    name: string;
    email: string;
    supporterType: string;
    isActive: boolean;
    hasNewsletter: boolean;
}

export interface Price {
    id: number;
    priceText: string;
}

export interface Winner {
    id: number;
    name: string;
    email: string;
    priceId?: number | null;
    index?: number | null;
}

// export interface Raffle {
//     name: string;
//     includeNewsletterParticipants: boolean;
//     numberOfWinners?: number | null;
//     hasPrizes: boolean;
//     participants: Participant[];
//     prices: Price[];
//     winners: Winner[];

//     addParticipant(participant: Participant): void;
//     pickWinner(): Participant | null;
//     addPrice(price: Price): void;
//     removePrice(price: Price): void;
//     getPrice(index: number): Price | null;
//     addWinner(winner: Winner): void;
//     removeWinner(winner: Winner): void;
//     importParticipantsFromCSV(csvString: string, delimiter?: string): void;
// }

export interface RaffleState {
    name: string;
    includeNewsletterParticipants: boolean;
    numberOfWinners?: number | null;
    //hasPrizes: boolean;
    participants: Participant[];
    prices: Price[];
    winners: Winner[];
}