/*
    Author: Jan Kern, 2024
    Class to keep the raffle business logic
*/

import { forEachChild } from 'typescript';
import { Participant, Price, Winner } from './Interfaces';
import { RaffleStateContainer } from './RaffleState';

export class Raffle {
    private stateContainer: RaffleStateContainer;

    constructor(stateContainer: RaffleStateContainer) {
        this.stateContainer = stateContainer;
    }

    // Function to pick winners by price or winner amount type
    pickWinners(): Winner[] {
        const state = this.stateContainer.getState();
        const participants: Participant[] = state.participants;
        const prices: Price[] = state.prices;
        const winners: Winner[] = [];
        const selectedIndexes: Set<string> = new Set(); // To keep track of selected participants

        const numberOfWinners = state.numberOfWinners || 0;
        let numberOfSupporterWinners: number = state.numberOfSupporterWinners !== undefined ? state.numberOfSupporterWinners : 0;
        let numberOfNewsletterWinners: number = state.numberOfNewsletterWinners !== undefined ? state.numberOfNewsletterWinners : 0;

        // Case if having prices defined
        if (prices.length > 0) {
            prices.forEach(price => {
                let eligibleParticipants: Participant[] = [];

                if (price.priceType === 'all') {
                    eligibleParticipants = [...participants];
                } else {
                    eligibleParticipants = participants.filter(participant =>
                        (price.priceType === 'supporter' && participant.isActive && !participant.hasNewsletter) ||
                        (price.priceType === 'newsletter' && !participant.isActive && participant.hasNewsletter)
                    );
                }

                // Pick winners from the current group of eligible participants
                this.pickWinnersFromGroup(eligibleParticipants, 1/*eligibleParticipants.length*/, selectedIndexes, winners, price);
            });
        } else {
            // Case if having only winner number defined
            let eligibleSupporterParticipants: Participant[] = [];
            let eligibleNewsletterParticipants: Participant[] = [];

            if (state.numberOfSupporterParticipants && state.numberOfSupporterParticipants > 0) {
                eligibleSupporterParticipants = participants.filter(participant => (participant.isActive && !participant.hasNewsletter));
                this.pickWinnersFromGroup(eligibleSupporterParticipants, winners.length+numberOfSupporterWinners, selectedIndexes, winners);
            }

            if (state.numberOfNewsletterParticipants && state.numberOfNewsletterParticipants > 0) {
                eligibleNewsletterParticipants = participants.filter(participant => (!participant.isActive && participant.hasNewsletter));
                this.pickWinnersFromGroup(eligibleNewsletterParticipants, winners.length+numberOfNewsletterWinners, selectedIndexes, winners);
            }
        }
        return winners;
    }

    // Function to pick winners from a specific group of participants
    pickWinnersFromGroup(group: Participant[], numberOfWinners: number, selectedIndexes: Set<string>, winners: Winner[], price?: Price): void {

        let i = 0;

        // Looping either for winner number twice (supporter / newsleter) or looping for each price (supporter / newsletter / all)
        while ((winners.length < numberOfWinners && group.length > 0 && !price) || (price && i < numberOfWinners)) {
            const randomIndex = Math.floor(Math.random() * group.length);
            const winnerIndex = group.findIndex(participant => participant === group[randomIndex]);

            if (!selectedIndexes.has(group[randomIndex].email)) {
                const winner: Winner = {
                    id: winners.length + 1,
                    name: group[randomIndex].firstName + " " + group[randomIndex].lastName,
                    email: group[randomIndex].email,
                    isSupporter: group[randomIndex].isActive,
                    participantId: group[randomIndex].id,
                    priceId: price ? price.id : null,
                    index: winnerIndex // Storing the index of the winner in the original participants array
                };

                winners.push(winner);
                // selectedIndexes.add(winnerIndex);
                selectedIndexes.add(group[randomIndex].email);
                // Iterate only if no dupliate has been found, otherwise loop again
                i++;
            }
            // Remove winner from eligible participants to prevent duplicate winners
            group.splice(randomIndex, 1);
        }
    }

    shortenEmailUsername(email: string, percentage: number, withTld: boolean): string {
        // Extract username from email using regex
        const match = email.match(/^(.+)@(.+)$/);
        if (!match || match.length < 3) {
            throw new Error('Invalid email address format');
        }
        const username = match[1];
        const domainParts = match[2].split('.');
        const topLevelDomain = withTld ? domainParts[domainParts.length - 1] : "";

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