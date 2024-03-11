import { Participant, Price, Winner } from './Interfaces';

// import { ParticipantImplementation } from "./Participant";
// import { PriceImplementation } from "./Price";
// import { WinnerImplementation } from "./Winner";

import { RaffleStateContainer } from './RaffleState';

export class Raffle {
    private stateContainer: RaffleStateContainer;

    constructor(stateContainer: RaffleStateContainer) {
        this.stateContainer = stateContainer;
    }

    // Example method for business logic
    pickWinner(): Participant | null {
        console.log('IN PICK A WINNER');
        
        const participants = this.stateContainer.getState().participants;
        if (participants.length === 0) {
            return null;
        }

        const winnerIndex = Math.floor(Math.random() * participants.length);
        return participants[winnerIndex];
    }

    // Add other business logic methods as needed
}