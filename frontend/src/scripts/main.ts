/* 
    Main ts file to handle the raffle project
    
    Endpoints for Frontend:
    /raffles
    /raffle/<id>
    /participants
    /participant/<id>
    /beneficiaries
    /beneficiary/<id>

    Endpoints for Backend / REST API:
    /api/v1/raffles
    /api/v1/raffle/<id>
    /api/v1/participants
    /api/v1/participant/<id>
    /api/v1/beneficiaries
    /api/v1/beneficiary/<id>
    /api/v1/import
*/

/**
 * 
 * Status
 * form and state implemented
 * next: 
 * function to pick winner and update state
 * [v] clear state
 * [v] Output summary
 * integrate material
 * raffle animation ()
 * 
 */

import { RaffleState, Participant, Winner, Price } from "./Interfaces";
import { RaffleStateContainer } from "./RaffleState";
import { Raffle } from "./Raffle";

import "../scss/styles.scss";

document.addEventListener("DOMContentLoaded", () => {

    // Input elements
    const numberOfWinnersRadio = document.getElementById('numberOfWinnersRadio') as HTMLInputElement;
    const numberOfWinnersInput = document.getElementById('numberOfWinners') as HTMLInputElement;
    const pricesRadio = document.getElementById('pricesRadio') as HTMLInputElement;
    const addPriceButton = document.getElementById('addPriceButton') as HTMLButtonElement;
    const pricesContainer = document.getElementById('pricesContainer') as HTMLDivElement;
    const raffleCreate = document.getElementById('raffleCreate') as HTMLButtonElement;
    const rafflePerform = document.getElementById('rafflePerform') as HTMLButtonElement;
    const csvText = document.getElementById('csvText') as HTMLTextAreaElement;
    const raffleNameInput = document.getElementById('raffleName') as HTMLInputElement;
    const includeNewsletterCheckbox = document.getElementById('includeNewsletter') as HTMLInputElement;
    const determinationTypeRadios = document.querySelectorAll<HTMLInputElement>('input[name="determinationType"]');

    // Output / summary elements
    const validationOutput = document.getElementById('validation-output') as HTMLElement;
    const participantsOutput = document.getElementById('participants-output') as HTMLElement;
    const numberOfWinnersOutput = document.getElementById('number-of-winners-output') as HTMLElement;
    const pricesOutput = document.getElementById('prices-output') as HTMLElement;
    const hasNewsletterOutput = document.getElementById('has-newletter-output') as HTMLElement;

    // Form input and submit logic and validation
    if (numberOfWinnersRadio && numberOfWinnersInput && pricesRadio && addPriceButton && pricesContainer && raffleCreate && rafflePerform && determinationTypeRadios) {

        // Eventmethod for winner number
        function numberOfWinnersRadioChange() {
            numberOfWinnersRadio.checked = true;
            numberOfWinnersInput.disabled = false;
            addPriceButton.disabled = true;

            // Disable price input fields and clear their values
            const priceInputs = document.querySelectorAll('input[name^="price"]');
            priceInputs.forEach(input => {
                (input as HTMLInputElement).disabled = true;
            });

            const removeButtons = document.querySelectorAll('button[name^="price_remove"]');
            removeButtons.forEach(button => {
                (button as HTMLInputElement).disabled = true;
            });
        }

        // Eventlistener for winner number
        numberOfWinnersRadio.addEventListener('change', numberOfWinnersRadioChange);

        // Eventlistener for add prices
        pricesRadio.addEventListener('change', function () {
            numberOfWinnersInput.disabled = true;
            addPriceButton.disabled = false;

            // Enable price input fields if previously disabled
            const priceInputs = document.querySelectorAll('input[name^="price"]');
            priceInputs.forEach(input => {
                (input as HTMLInputElement).disabled = false;
            });

            const removeButtons = document.querySelectorAll('button[name^="price_remove"]');
            removeButtons.forEach(button => {
                (button as HTMLInputElement).disabled = false;
            });
        });

        // JavaScript code for adding input fields dynamically for prices
        let priceCount = 1; // Counter for naming price input fields
        addPriceButton.addEventListener('click', function () {
            const input = document.createElement('input');
            input.type = 'text';
            input.name = `price${priceCount++}`; // Increment counter for each new price input field
            input.placeholder = 'Price';

            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.name = 'price_remove';
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', function () {
                // Remove the input field and the remove button
                pricesContainer.removeChild(input);
                pricesContainer.removeChild(removeButton);
            });

            pricesContainer.appendChild(input);
            pricesContainer.appendChild(removeButton);
            pricesContainer.appendChild(document.createElement('br'));
        });

        // Eventlistener for create raffle, output summary and fill the state
        raffleCreate.addEventListener('click', function (event) {

            // prevent form from general submit
            event.preventDefault();

            let validationText: string = "";
            let raffleName: string = "";
            let numberOfWinners: number = 0;
            let priceItems: string[] = [];
            let csvString: string = "";
            let participantEntries: string[] = [];

            // Form validations
            if (raffleNameInput.value !== "") {
                raffleName = raffleNameInput.value;
            } else {
                validationText += "Du musst einen Raffle-Namen angeben.<br>";
            }

            if (csvText.value === "") { // TODO !==

                // import participants
                csvString = `Name;Email;SequencerTalk Supporter;Active;Newsletter
                Sophia Müller;user1@example.de;Sinus;ja;nein
                Lukas Schmidt;user2@example.de-;;nein;ja
                Emma Wagner;user3@example.de-;;nein;ja
                Leon Fischer;user4@example.de;Sinus;ja;nein
                Hannah Weber;user5@example.de;Sinus;ja;nein
                Maximilian Becker;user6@example.de;Sinus;ja;nein
                Mia Schneider;user7@example.de-;;nein;ja
                Elias Richter;user8@example.de;Sinus;ja;nein
                Emilia Keller;user9@example.de;Sinus;ja;nein
                Jonas Meier;user10@example.de;Sinus;ja;nein
                Laura Schäfer;user11@example.de---;Sinus;;nein;
                Lars Klingbeil;user12@example.de---;;nein;nein;
                Susanne Herzensangelegenheit;user13@example.de---;;nein;nein;
                Wanda Alhandra;user14@example.de-;;nein;ja`;

                // Validieren
                participantEntries = csvString.split('\n');

                // Fill state methods with list data for participant and prices
                raffleStateContainer.importCSV(csvString);

            } else {
                validationText += "Du musst CSV-Text in das Textfeld kopieren.<br>";
            }

            let i = 0;
            let participantLengthWithSupporterOrNewsletter = 0;
            while (i < raffleStateContainer.getState().participants.length) {

                if(raffleStateContainer.getState().participants[i].isActive ){
                    participantLengthWithSupporterOrNewsletter += 1;
                }

                if(includeNewsletterCheckbox.checked){
                    if(raffleStateContainer.getState().participants[i].hasNewsletter ){
                        participantLengthWithSupporterOrNewsletter += 1;
                    }
                }
                i += 1;
            }

            if (numberOfWinnersRadio.checked) {
                if (numberOfWinnersInput.value !== "" && +numberOfWinnersInput.value > 0) {
                    numberOfWinners = +numberOfWinnersInput.value;
                    if (participantLengthWithSupporterOrNewsletter < numberOfWinners) {
                        validationText += "Du kannst nicht mehr Gewinner als Teilnehmer definieren.<br>";
                    }
                } else {
                    validationText += "Du musst eine gültige Gewinneranzahl eingeben.<br>";
                }
            }

            if (pricesRadio.checked) {
                const priceInputs = document.querySelectorAll('input[name^="price"]');

                priceInputs.forEach(input => {
                    if ((input as HTMLInputElement).value !== "") {
                        priceItems.push((input as HTMLInputElement).value);
                    }
                });

                if (priceItems.length <= 0) {
                    validationText += "Du musst mindestens einen Preis angeben<br>";
                }

                if (participantLengthWithSupporterOrNewsletter < priceItems.length) {
                    validationText += "Du kannst nicht mehr Preise als Teilnehmer definieren.<br>";
                }
            }

            // Submit form only if validation string is empty
            if (validationText === "") {

                validationOutput.innerHTML = "";

                // Fill state methods with list data for participant and prices
                //raffleStateContainer.importCSV(csvString);
                raffleStateContainer.createPrices(priceItems);

                // Fill state with simple variables
                const state = {
                    name: raffleName,
                    includeNewsletterParticipants: includeNewsletterCheckbox.checked,
                    numberOfWinners: numberOfWinners
                };

                // Set state object
                raffleStateContainer.setState(state);
                console.log(raffleStateContainer.getState());

                // Output summary
                const numberOfWinnersTotal = renderRaffleData(raffleStateContainer.getState().prices, raffleStateContainer.getState().numberOfWinners, raffleStateContainer.getState().includeNewsletterParticipants);
                renderParticipantList(raffleStateContainer.getState().participants, numberOfWinnersTotal);

                // set veiw state
                raffleStateContainer.setState({view: "view"});

            } else {
                validationOutput.innerHTML = validationText;
            }

        });

        determinationTypeRadios.forEach(radio => {
            radio.addEventListener('change', function (event) {
                const checkedValue = (document.querySelector<HTMLInputElement>('input[name="determinationType"]:checked') as HTMLInputElement)?.value;
                raffleStateContainer.setState({determinationType: checkedValue});
            });
        });

        rafflePerform.addEventListener('click', function (event) {
            
            event.preventDefault();

            // set veiw state
            raffleStateContainer.setState({view: "perform"});

            // Determining the winners and optional priceId's
            //if(raffleStateContainer.getState().winners.length <= 0){
                raffleStateContainer.addWinners(raffle.pickWinners());
                console.log('Winner picked');
                console.log(raffleStateContainer.getState());
            //}

            // set veiw state
            raffleStateContainer.setState({view: "perform"});

            // check amountofwinner not bigger isactive  / hasnewsletter

            // TODO Get price text from state if prices are assigned
            // TODO reverse winner state to a new varriable to start with last one
            
            // TODO check which determinationType is selected
            // if nacheinander each step has to be confirmed by button
            // if gleichzeitig all will be displayed

            // overview will be udpate for price and list
            // Winners with prices and only first anem will be printed

        });

        // Call radio selection for winner at page load
        numberOfWinnersRadioChange();
    }

    // Function to render the raffle data on the HTML page except participants
    function renderRaffleData(prices: Price[], numberOfWinners: (number | null | undefined), hasNewsletter: boolean): number {

        let numberOfWinnersTotal :number = 0;
        hasNewsletterOutput.innerHTML = "Supporter: V <br>Newsletter: V";
        if (!hasNewsletter) {
            hasNewsletterOutput.innerHTML = "Supporter: V <br>Newsletter: X";
        }

        if (numberOfWinners && numberOfWinners > 0) {
            numberOfWinnersTotal = numberOfWinners;
        }

        if(prices.length > 0){
            numberOfWinnersTotal = prices.length;
        }

        numberOfWinnersOutput.innerHTML = "So viele Gewinner werden ausgelost: "+numberOfWinnersTotal;

        if(prices.length > 0){
            pricesOutput.innerHTML = `Diese Preise werden an die Gewinner verteilt:`;
            let li = "<ul>";
            prices.forEach(element => {
                li += "<li>"+element.priceText+"</li>";
            });
            li += "</ul>";
            pricesOutput.innerHTML += li;
        }else{
            pricesOutput.innerHTML = `Es sind keine gesonderten Preise definiert. Es werden nur Gewinner bestimmt.`;
        }

        return numberOfWinnersTotal;
    }

    // Function to render the participant list on the HTML page
    function renderParticipantList(participants: Participant[], numberOfWinnersTotal: number) {

        participantsOutput.innerHTML = `Die ${numberOfWinnersTotal} Gewinner werden aus folgender Liste ermittelt:<br>`;
        let table = `<table><th>Name</th><th>E-Mail</th><th>SequencerTalk Supporter</th><th>isActive</th><th>hasNewsletter</th>`;

        participants.forEach(participant => {
            let row = `<td>${participant.name}</td><td>${participant.email}</td><td>${participant.supporterType}</td><td>${participant.isActive}</td><td>${participant.hasNewsletter}</td>`;
            table += `<tr>${row}</tr>`;
        });

        table += "</table>";
        participantsOutput.innerHTML += table;
    }

    // Function to update form inputs with state values
    function updateFormWithState(state: {
        name: string;
        includeNewsletterParticipants: boolean;
        numberOfWinners?: number | null;
        participants: Participant[];
        prices: Price[];
        winners: Winner[];
    }) {
        if (raffleNameInput && includeNewsletterCheckbox && numberOfWinnersInput) {
            raffleNameInput.value = state.name;
            includeNewsletterCheckbox.checked = state.includeNewsletterParticipants;
            numberOfWinnersInput.value = state.numberOfWinners ? state.numberOfWinners.toString() : '';
        }
    }

    // Define initial state
    const initialState: RaffleState = {
        name: "New Raffle",
        includeNewsletterParticipants: false,
        numberOfWinners: null,
        participants: [],
        prices: [],
        winners: [],
        view: "create",
        determinationType: "simultaneously"
    };

    // Create an instance of the state container
    const raffleStateContainer = new RaffleStateContainer(initialState);

    // Create an instance of the Raffle class (business logic) with the state container
    const raffle = new Raffle(raffleStateContainer);

    // Example usage of Raffle class
    //const winner = raffle.pickWinner();
    //console.log(winner);

    // Update the form with initial state values
    updateFormWithState(initialState);

});


