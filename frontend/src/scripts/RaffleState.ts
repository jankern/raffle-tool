import { Participant, Price, Winner, RaffleState } from './Interfaces';

export class RaffleStateContainer {
    private state: RaffleState;
    private participantAmount: number = 1;

    constructor(initialState: RaffleState) {
        this.state = initialState;
    }

    getState(): RaffleState {
        return this.state;
    }

    setState(newState: Partial<RaffleState>) {
        this.state = { ...this.state, ...newState };
    }

    importCSV(csvText: string, isParticipantsReset: boolean) {
        // Parse CSV text
        const rows = csvText.split('\n');
        const participants: Participant[] = [];
        let fileInputType: string = "supporter";

        if (isParticipantsReset) {
            this.participantAmount = 1;
        }

        for (let i = 0; i < rows.length; i++) { // Start from index 1 to skip header row
            const row = rows[i];
            const columns = row.split(';').map(item => item.trim());

            // First title row 
            if (i <= 0) {
                // Check file type (supporter / newsletter)
                if (columns[0] === "email") {
                    fileInputType = "newsletter";
                }

            } else {

                if (fileInputType === "supporter") {
                    console.log('in Supporter');
                    // Extract required columns
                    // Extract first 4 columns
                    const [firstName, lastName, email, supporterType] = columns.slice(0, 4);
                    const hasNewsletter: boolean = false;
                    // Search for subscription_state
                    const subscriptionStateIndex: number = 7; //columns.findIndex((col, index) => index >= 4 && col === 'subscription_state');
                    // Add the index of subscription_state
                    const subscriptionState: string = subscriptionStateIndex !== -1 ? columns[subscriptionStateIndex] : '';

                    if (subscriptionState !== "" && email !== "") {
                        const isActive = subscriptionState.toLowerCase() === 'active' ? true : false;
                        const supporterTypeReplaced = supporterType.replace("SequencerTalk Supporter ", "");

                        // Create participant object and add it to the list
                        participants.push({ id: this.participantAmount, firstName, lastName, email, supporterType: supporterTypeReplaced, isActive, hasNewsletter });
                    }
                } else {
                    console.log('in Newsletter');
                    const [email] = columns.slice(0, 1);
                    // Create participant object and add it to the list
                    if (email !== "") {
                        participants.push({ id: this.participantAmount, firstName: "", lastName: "", email, supporterType: "", isActive: false, hasNewsletter: true });
                    }
                }

                this.participantAmount++;
            }

        }



        // Update state with new participants
        if (isParticipantsReset) {
            this.setState({ participants });
        } else {
            // Add new participants to existing list
            this.addParticipants(participants);
        }
        
        console.log(this.getState());
    }

    // TODO: Function to make list unique by email

    addParticipants(participants: Participant[]): void {

        if (participants.length > 0) {
            for (let i = 0; i < participants.length; i++) {
                this.state.participants.push(participants[i]);
            }
        }

    }

    createPrices(priceInputs: string[]): void {

        const prices: Price[] = [];

        let i: number = 1;
        for (const row of priceInputs) {
            prices.push({ id: i, priceText: row });
            i += 1;
        }

        this.setState({ prices });
    }

    addWinners(winners: Winner[]): void {
        this.setState({ winners });
    }

    removeDuplicates(participants: Participant[]): Participant[] {
        const uniqueParticipants: Participant[] = [];
        const seenEmails = new Set<string>(); // Set to track seen email addresses

        let newId = 1;
        for (const participant of participants) {

            if (!seenEmails.has(participant.email)) {
                // Add email to set
                if (participant.isActive && participant.supporterType !== "") {
                    seenEmails.add(participant.email);
                    
                }
                participant.id = newId++;
                // Add participant to unique list
                uniqueParticipants.push(participant);
            }
        }
        
        return uniqueParticipants;
    }

    // Add other state management methods as needed
}