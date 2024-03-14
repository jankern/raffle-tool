import { Participant, Price, Winner } from './Interfaces';
import { RaffleStateContainer } from './RaffleState';

export class Raffle {
    private stateContainer: RaffleStateContainer;

    constructor(stateContainer: RaffleStateContainer) {
        this.stateContainer = stateContainer;
    }

    // Function to pick winners from the participant list and return them
    pickWinners(): Winner[] {
        const participants: Participant[] = this.stateContainer.getState().participants;
        let numberOfWinners = this.stateContainer.getState().numberOfWinners !== null ? 
                this.stateContainer.getState().numberOfWinners : 0;
        const prices: Price[] = this.stateContainer.getState().prices;
    
        const winners: Winner[] = [];
        const selectedIndexes: Set<number> = new Set(); // To keep track of selected participants

        if (prices.length > 0) {
            numberOfWinners = prices.length;
        }

        if (numberOfWinners && numberOfWinners >= 0) {
            if (numberOfWinners <= participants.length) {
                
                while (winners.length < numberOfWinners) {
                    const randomIndex = Math.floor(Math.random() * participants.length);

                    let isSupporterOrHasNewsletter: boolean = false;
                    if(participants[randomIndex].isActive){
                        isSupporterOrHasNewsletter = true;
                    }

                    if(this.stateContainer.getState().includeNewsletterParticipants){
                        if(participants[randomIndex].hasNewsletter){
                            isSupporterOrHasNewsletter = true;
                        }
                    }

                    if (!selectedIndexes.has(randomIndex) && isSupporterOrHasNewsletter) {

                        let winner: Winner = {
                            id: winners.length + 1,
                            name: participants[randomIndex].name,
                            email: participants[randomIndex].email,
                            isSupporter: participants[randomIndex].isActive,
                            priceId: null,
                            index: randomIndex // Storing the index of the winner in the original participants array
                        }

                        if (prices.length > 0) {
                            winner.priceId = prices[winners.length].id;
                        }

                        winners.push(winner);
                        selectedIndexes.add(randomIndex);   
                    }
                }
            } else {
                // Handle case where numberOfWinners is greater than the number of participants
                console.error("Number of winners exceeds the number of participants.");
            }
        }
        return winners;
    }
}
