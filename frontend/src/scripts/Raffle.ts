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
                    if (participants[randomIndex].isActive) {
                        isSupporterOrHasNewsletter = true;
                    }

                    if (this.stateContainer.getState().includeNewsletterParticipants) {
                        if (participants[randomIndex].hasNewsletter) {
                            isSupporterOrHasNewsletter = true;
                        }
                    }

                    if (!selectedIndexes.has(randomIndex) && isSupporterOrHasNewsletter) {

                        let winner: Winner = {
                            id: winners.length + 1,
                            name: participants[randomIndex].firstName + " " + participants[randomIndex].lastName,
                            email: participants[randomIndex].email,
                            isSupporter: participants[randomIndex].isActive,
                            participantId: participants[randomIndex].id,
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

    shortenEmailUsername(email: string, percentage: number): string {
        // Extract username from email using regex
        const match = email.match(/^(.+)@(.+)$/);
        if (!match || match.length < 3) {
            throw new Error('Invalid email address format');
        }
        const username = match[1];
        const domainParts = match[2].split('.');
        const topLevelDomain = domainParts[domainParts.length - 1];

        // Calculate number of characters to keep
        const keepCharacters = Math.ceil(username.length * (percentage / 100));
        
        // Shorten username by replacing characters beyond keepCharacters with dots
        const shortenedUsername = username.slice(0, keepCharacters) + '.'.repeat(username.length - keepCharacters);

        // Concatenate shortened username with dots and top-level domain
        const shortenedEmail = shortenedUsername + '@......' + topLevelDomain;

        return shortenedEmail;
    }

    shortenName(fullName: string): string {
        // Extract first name and first letter of last name using regex
        const match = fullName.match(/^(\S+)\s+(\S)/);
        if (!match || match.length < 3) {
            throw new Error('Invalid full name format');
        }
        const firstName = match[1];
        const lastNameInitial = match[2];

        return firstName + " " + lastNameInitial ;
    }
}
