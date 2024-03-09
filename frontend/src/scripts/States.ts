import { Participant, Price, Winner, Raffle } from './Interfaces';

export interface RaffleState {
    name: string;
    includeNewsletterParticipants: boolean;
    numberOfParticipants?: number | null;
    hasPrizes: boolean;
    participants: Participant[];
    prices: Price[];
    winners: Winner[];
}

export class RaffleStateContainer {
    private state: RaffleState;

    constructor(initialState: RaffleState) {
        this.state = initialState;
    }

    getState(): RaffleState {
        return this.state;
    }

    setState(newState: Partial<RaffleState>) {
        this.state = { ...this.state, ...newState };
    }

    setIncludeNewsletterParticipants(value: boolean) {
        this.setState({ includeNewsletterParticipants: value });
    }
}