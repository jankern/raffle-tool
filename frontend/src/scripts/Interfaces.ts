export interface Participant {
    id: number;
    name: string;
    email: string;
    supporterType: string | null;
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
    isSupporter: boolean;
    participantId: number;
    priceId?: number | null;
    priceText?: string;
    index?: number | null;
}

export interface RaffleState {
    name: string;
    includeNewsletterParticipants: boolean;
    numberOfWinners?: number | null;
    participants: Participant[];
    prices: Price[];
    winners: Winner[];
    view: string; // info // create / summary / perform
    determinationType: string; // simultaneously / consecutively
}