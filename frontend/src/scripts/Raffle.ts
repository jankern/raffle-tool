import { forEachChild } from 'typescript';
import { Participant, Price, Winner } from './Interfaces';
import { RaffleStateContainer } from './RaffleState';

export class Raffle {
    private stateContainer: RaffleStateContainer;

    constructor(stateContainer: RaffleStateContainer) {
        this.stateContainer = stateContainer;
    }


    pickWinners(): Winner[] {
        const state = this.stateContainer.getState();
        const participants: Participant[] = state.participants;

        let numberOfSupporterWinners: number = state.numberOfSupporterWinners !== undefined ? state.numberOfSupporterWinners : 0;
        let numberOfNewsletterWinners: number = state.numberOfNewsletterWinners !== undefined ? state.numberOfNewsletterWinners : 0;

        const prices: Price[] = state.prices;

        const winners: Winner[] = [];
        const selectedIndexes: Set<number> = new Set(); // To keep track of selected participants

        // Function to pick winners from a specific group of participants 
        function pickWinnersFromGroup(group: Participant[], numberOfWinners: number, isSupporter: boolean, handleAllIndex: number): number {

            // filter only support or newsletter participants
            let eligibleParticipants: Participant[] = [];

            eligibleParticipants = group.filter(participant => (isSupporter && participant.isActive && !participant.hasNewsletter) || (!isSupporter && !participant.isActive && participant.hasNewsletter));

            while (winners.length < numberOfWinners && eligibleParticipants.length > 0) {
                const randomIndex = Math.floor(Math.random() * eligibleParticipants.length);
                const winnerIndex = participants.findIndex(participant => participant === eligibleParticipants[randomIndex]);
                //console.log(winnerIndex);

                const winner: Winner = {
                    id: winners.length + 1,
                    name: eligibleParticipants[randomIndex].firstName + " " + eligibleParticipants[randomIndex].lastName,
                    email: eligibleParticipants[randomIndex].email,
                    isSupporter: isSupporter,
                    participantId: eligibleParticipants[randomIndex].id,
                    priceId: null,
                    index: winnerIndex // Storing the index of the winner in the original participants array
                };

                if (prices.length > 0) {
                    // Find the price type for the current winner
                    const priceType = prices[winners.length].priceType;
                    console.log('priceType');
                    console.log(priceType);

                    // Check if the price type matches the winner's eligibility
                    if (priceType === 'supporter' && isSupporter) {
                        winner.priceId = prices[winners.length].id;
                    } else if (priceType === 'newsletter' && !isSupporter) {
                        winner.priceId = prices[winners.length].id;
                    }
                    else if (priceType === 'all') {
                        winner.priceId = prices[winners.length].id;
                    }
                }

                winners.push(winner);
                selectedIndexes.add(winnerIndex);
                // Remove winner from eligible participants to prevent duplicate winners
                eligibleParticipants.splice(randomIndex, 1);
            }

            return winners.length;
        }


        // Pick supporter winners
        let supporterWinner: number = 0;
        let newsletterWinner: number = 0;

        // check if more prices are defined as supporter oder newsletter participants, if so, short it to that  
        let handleAllIndex: number = -1;
        if (prices.length > 0) {
            let i: number = 0;
            prices.forEach(price => {
                if (price.priceType === "supporter") {
                    numberOfSupporterWinners++;
                } else if (price.priceType === "all") {
                    handleAllIndex = i;
                } else {
                    numberOfNewsletterWinners++;
                }
                i++;
            });
        }

        // check if more numberOfSupporterWinners / numberOfNewsletterWinners are defined as supporter oder newsletter participants, if so, short it to that
        if (state.numberOfSupporterParticipants !== undefined && state.numberOfSupporterParticipants < numberOfSupporterWinners) {
            numberOfSupporterWinners = state.numberOfSupporterParticipants;
        }

        if (state.numberOfNewsletterParticipants !== undefined && state.numberOfNewsletterParticipants < numberOfNewsletterWinners) {
            numberOfNewsletterWinners = state.numberOfNewsletterParticipants;
        }

        // Call pickWinnersFromGroup for Supporter
        supporterWinner = pickWinnersFromGroup(participants, numberOfSupporterWinners + newsletterWinner, true, handleAllIndex);

        // Call pickWinnersFromGroup for Newsletter
        newsletterWinner = pickWinnersFromGroup(participants, numberOfNewsletterWinners + supporterWinner, false, handleAllIndex);



        console.log(winners);
        return winners;
    }

    pickWinnersByNumber(): Winner[] {

        const state = this.stateContainer.getState();
        const participants: Participant[] = state.participants;
        const prices: Price[] = state.prices;
        const winners: Winner[] = [];
        const selectedIndexes: Set<number> = new Set(); // To keep track of selected participants

        let numberOfSupporterWinners: number = state.numberOfSupporterWinners !== undefined ? state.numberOfSupporterWinners : 0;
        let numberOfNewsletterWinners: number = state.numberOfNewsletterWinners !== undefined ? state.numberOfNewsletterWinners : 0;

        // check if more numberOfSupporterWinners / numberOfNewsletterWinners are defined as supporter oder newsletter participants, if so, short it to that
        if (state.numberOfSupporterParticipants !== undefined && state.numberOfSupporterParticipants < numberOfSupporterWinners) {
            numberOfSupporterWinners = state.numberOfSupporterParticipants;
        }

        if (state.numberOfNewsletterParticipants !== undefined && state.numberOfNewsletterParticipants < numberOfNewsletterWinners) {
            numberOfNewsletterWinners = state.numberOfNewsletterParticipants;
        }




        // Als Basis muss 

        return winners;
    }

    // Function to pick winners by price type
    pickWinnersByPrice(): Winner[] {
        const state = this.stateContainer.getState();
        const participants: Participant[] = state.participants;
        const prices: Price[] = state.prices;
        const winners: Winner[] = [];
        const selectedIndexes: Set<number> = new Set(); // To keep track of selected participants

        const numberOfWinners = state.numberOfWinners || 0;
        let numberOfSupporterWinners: number = state.numberOfSupporterWinners !== undefined ? state.numberOfSupporterWinners : 0;
        let numberOfNewsletterWinners: number = state.numberOfNewsletterWinners !== undefined ? state.numberOfNewsletterWinners : 0;

        // check if more prices are defined as supporter 0r newsletter participants, if so, short it to that  
        // if (prices.length > 0) {
        //     prices.forEach(price => {
        //         if (price.priceType === "supporter") {
        //             numberOfSupporterWinners++;
        //         } else {
        //             numberOfNewsletterWinners++;
        //         }
        //     });
        // }

        prices.forEach(price => {
            let eligibleParticipants: Participant[] = [];
            //const numberOfWinners = price.numberOfWinners || 0;

            if (price.priceType === 'all') {
                eligibleParticipants = [...participants];
            } else {
                eligibleParticipants = participants.filter(participant =>
                    (price.priceType === 'supporter' && participant.isActive && !participant.hasNewsletter) ||
                    (price.priceType === 'newsletter' && !participant.isActive && participant.hasNewsletter)
                );
            }

            //const isSupporter = price.priceType === ""

            this.pickWinnersFromGroup(eligibleParticipants, numberOfWinners, selectedIndexes, participants, winners);
        });

        return winners;
    }

    // Function to pick winners from a specific group of participants
    pickWinnersFromGroup(group: Participant[], numberOfWinners: number, selectedIndexes: Set<number>, participants: Participant[], winners: Winner[]): void {
        while (winners.length < numberOfWinners && group.length > 0) {
            const randomIndex = Math.floor(Math.random() * group.length);
            const winnerIndex = participants.findIndex(participant => participant === group[randomIndex]);
    
            if (!selectedIndexes.has(winnerIndex)) {
                const winner: Winner = {
                    id: winners.length + 1,
                    name: group[randomIndex].firstName + " " + group[randomIndex].lastName,
                    email: group[randomIndex].email,
                    isSupporter: group[randomIndex].isActive,
                    participantId: group[randomIndex].id,
                    priceId: null,
                    index: winnerIndex // Storing the index of the winner in the original participants array
                };
    
                winners.push(winner);
                selectedIndexes.add(winnerIndex);
            }
            // Remove winner from eligible participants to prevent duplicate winners
            group.splice(randomIndex, 1);
        }
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

        return firstName + " " + lastNameInitial;
    }
}