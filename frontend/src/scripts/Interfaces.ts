export interface Participant {
    id: number;
    firstName?: string;
    lastName?: string;
    email: string;
    supporterType?: string | null;
    isActive: boolean;
    hasNewsletter: boolean;
}

export interface Price {
    id: number;
    priceText: string;
    priceType: string; // all, supporter, newsletter
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
    numberOfSupporterWinners?: number | undefined;
    numberOfNewsletterWinners?: number | undefined;
    participants: Participant[];
    numberOfSupporterParticipants?: number;
    numberOfNewsletterParticipants?: number;
    prices: Price[];
    winners: Winner[];
    view: string; // info // create / summary / perform
    determinationType: string; // simultaneously / consecutively
}