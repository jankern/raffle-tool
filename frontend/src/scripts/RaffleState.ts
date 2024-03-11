import { Participant, Price, Winner, RaffleState } from './Interfaces';

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

    importCSV(csvText: string) {
        // Parse CSV text
        const rows = csvText.split('\n');
        const participants: Participant[] = [];

        for (const row of rows) {
            const [name, email, supporterType, isActiveStr, hasNewsletterStr] = row.split(';').map(item => item.trim());
            const isActive = isActiveStr.toLowerCase() === ('ja' || 'yes' || 'true');
            const hasNewsletter = hasNewsletterStr.toLowerCase() === ('ja' || 'yes' || 'true');
            
            participants.push({ name, email, supporterType, isActive, hasNewsletter });
        }

        // Update state with new participants
        this.setState({ participants });
    }

    createPrices(priceInputs: string[]){

        const prices: Price[] = [];
        
        let i: number = 1;
        for (const row of priceInputs) {
            prices.push({ id: i, priceText: row });
            i += 1;
        }

        this.setState({ prices });
    }

    // Add other state management methods as needed
}