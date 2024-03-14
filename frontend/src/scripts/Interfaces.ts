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

export interface RaffleState {
    name: string;
    includeNewsletterParticipants: boolean;
    numberOfWinners?: number | null;
    participants: Participant[];
    prices: Price[];
    winners: Winner[];
    view: string; // config / overview / raffle
    determinationType: string; // simultaneously / consecutively
}