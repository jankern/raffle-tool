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

// import '@material/web/button/filled-button';
// import '@material/web/button/outlined-button';
// import '@material/web/checkbox/checkbox';
// import '@material/web/chips/suggestion-chip';
// import '@material/web/field/filled-field';
// import '@material/web/radio/radio';
// import '@material/web/textfield/filled-text-field';
// import '@material/web/textfield/outlined-text-field';

import "../scss/styles.scss";

document.addEventListener("DOMContentLoaded", () => {
    // Input elements
    const numberOfWinnersRadio = document.getElementById('numberOfWinnersRadio') as HTMLInputElement;
    const numberOfWinnersInput = document.getElementById('numberOfWinners') as HTMLInputElement;
    const pricesRadio = document.getElementById('pricesRadio') as HTMLInputElement;
    const addPriceButton = document.getElementById('addPriceButton') as HTMLButtonElement;
    const pricesContainer = document.getElementById('pricesContainer') as HTMLDivElement;

    // Buttond
    const raffleInfo = document.getElementById('raffle-info') as HTMLButtonElement;
    const raffleCreate = document.getElementById('raffle-create') as HTMLButtonElement;
    const raffleCreateReset = document.getElementById('raffle-create-reset') as HTMLButtonElement;
    const raffleSummary = document.getElementById('raffle-summary') as HTMLButtonElement;
    const raffleGoTo = document.getElementById('raffle-goto') as HTMLButtonElement;
    const rafflePerform = document.getElementById('raffle-perform') as HTMLButtonElement;
    const raffleRepeat = document.getElementById('raffle-repeat') as HTMLButtonElement;
    const raffleDeterminationType = document.getElementById('raffle-determination-type') as HTMLButtonElement;
    const raffleWinnerHeadline = document.getElementById('raffle-winner-headline') as HTMLElement;

    const csvText = document.getElementById('csvText') as HTMLTextAreaElement;
    const csvNewsletterText = document.getElementById('csvNewsletterText') as HTMLTextAreaElement;
    const raffleNameInput = document.getElementById('raffleName') as HTMLInputElement;
    //const includeNewsletterCheckbox = document.getElementById('includeNewsletter') as HTMLInputElement; // TODO
    const determinationTypeRadios = document.querySelectorAll<HTMLInputElement>('input[name="determinationType"]');
    const useTestDataCheckbox = document.getElementById('useTestData') as HTMLInputElement;

    // Output / summary elements
    const validationOutput = document.getElementById('validation-output') as HTMLElement;
    const participantsOutput = document.getElementById('participants-output') as HTMLElement;
    const numberOfWinnersOutput = document.getElementById('number-of-winners-output') as HTMLElement;
    const pricesOutput = document.getElementById('prices-output') as HTMLElement;
    const hasNewsletterOutput = document.getElementById('has-newletter-output') as HTMLElement;
    const winnerOutput = document.getElementById('winner-output') as HTMLElement;

    let consecutivelyIterator: number = 0;
    let winnersReverseWithPrice: Winner[] = [];

    raffleInfo.style.display = "inline-block"; // TODO move to a function
    raffleCreate.style.display = "none";
    raffleCreateReset.style.display = "none";
    raffleSummary.style.display = "none";
    raffleGoTo.style.display = "none";
    rafflePerform.style.display = "none";
    raffleRepeat.style.display = "none";
    raffleDeterminationType.style.display = "none";

    // Form input and submit logic and validation
    if (numberOfWinnersRadio && numberOfWinnersInput && pricesRadio && addPriceButton && pricesContainer && raffleCreate && rafflePerform && determinationTypeRadios) {

        // View: Info
        raffleInfo.addEventListener('click', function () {

            raffleInfo.style.display = "none";
            raffleCreate.style.display = "inline-block";
            raffleCreateReset.style.display = "none";
            raffleSummary.style.display = "none";
            raffleGoTo.style.display = "none";
            rafflePerform.style.display = "none";
            raffleRepeat.style.display = "none";
            raffleDeterminationType.style.display = "none";

            raffleStateContainer.setState({ view: "create" });
            orderContentLayer('create'); // TODO use state value
        });

        // View: Raffle reset / edit
        raffleCreateReset.addEventListener('click', function () {

            raffleInfo.style.display = "none";
            raffleCreate.style.display = "inline-block";
            raffleCreateReset.style.display = "none";
            raffleSummary.style.display = "none";
            raffleGoTo.style.display = "none";
            rafflePerform.style.display = "none";
            raffleRepeat.style.display = "none";
            raffleDeterminationType.style.display = "none";

            raffleStateContainer.setState({ view: "create" });
            orderContentLayer('create');
        });

        raffleSummary.addEventListener('click', function () {

            raffleStateContainer.setState({ view: 'summary' });

            raffleInfo.style.display = "none";
            raffleCreate.style.display = "none";
            raffleCreateReset.style.display = "inline-block";
            raffleSummary.style.display = "none";
            raffleGoTo.style.display = "inline-block";
            rafflePerform.style.display = "none";
            raffleRepeat.style.display = "none";
            raffleDeterminationType.style.display = "none";
            orderContentLayer('summary');

            //raffleStateContainer.setState({view: "raffle"});
        });

        // View: Raffle Go To
        raffleGoTo.addEventListener('click', function () {

            // raffleStateContainer.setState({ view: 'raffle', winners: [] });
            raffleStateContainer.setState({ view: 'raffle' });
            //winnerOutput.innerHTML = "";
            consecutivelyIterator = 0;

            raffleInfo.style.display = "none";
            raffleCreate.style.display = "none";
            raffleCreateReset.style.display = "none";
            raffleSummary.style.display = "inline-block";
            raffleGoTo.style.display = "none";
            rafflePerform.style.display = "inline-block";
            raffleRepeat.style.display = "none";
            raffleDeterminationType.style.display = "inline-block";
            orderContentLayer('raffle');

            if (raffleStateContainer.getState().winners.length > 0) {
                rafflePerform.style.display = "none";
                raffleRepeat.style.display = "inline-block";
            }

            //raffleStateContainer.setState({view: "raffle"});
        });

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
            input.name = `price${priceCount}`; // Increment counter for each new price input field
            input.placeholder = `${priceCount}. Preis`;

            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.name = 'price_remove';
            removeButton.className = 'internal';
            removeButton.textContent = 'Entfernen';
            removeButton.addEventListener('click', function () {
                // Remove the input field and the remove button
                pricesContainer.removeChild(input);
                pricesContainer.removeChild(removeButton);
                priceCount--;

                const priceInputs = document.querySelectorAll('input[name^="price"]');
                let i = 1;
                priceInputs.forEach(input => {
                    (input as HTMLInputElement).placeholder = `${i}. Preis`;
                    (input as HTMLInputElement).name = `price${i}`;
                    i++;
                });

            });

            pricesContainer.appendChild(input);
            pricesContainer.appendChild(removeButton);
            priceCount++;
        });

        useTestDataCheckbox.addEventListener('change', (event) => {
            let csvString: string;
            let csvNewsletterString: string;

            if (useTestDataCheckbox.checked) {

                csvString =
                    `first_name;last_name;email;plan_name;plan_monthly_amount_cents;gifted;subscription_period;subscription_state;subscribed_at;trial_ends_at;cancelled_at;expires_at;shipping_first_name;shipping_last_name;shipping_company_name;shipping_street_and_number;shipping_city;shipping_zip_code;shipping_state;shipping_country_code;new_plan_name;new_plan_monthly_amount_cents;price_increase_opt_in_email_sent_at;price_increase_opted_in_at;price_increase_new_plan_monthly_amount_cents
Sophia;Müller;mail-1@example.de;SequencerTalk Supporter (Level: Sinus);300;FALSE;annual;active;21.02.23;;;;;;;;;;;;;;21.08.23;30.08.23;
Lukas;Schmidt;mail-2@example.de;SequencerTalk Supporter (Level: Sägezahn);600;FALSE;monthly;cancelled;16.12.22;;28.02.23;28.02.23;;;;;;;;;;;;;
Hans;Dampf;mail-3@example.de;SequencerTalk Supporter (Level: Sägezahn);600;FALSE;monthly;not_renewing;16.12.22;;28.02.23;28.02.23;;;;;;;;;;;;;
Ben;Hartmann;mail-4@example.de;SequencerTalk Supporter (Level: Sinus);300;FALSE;annual;active;21.02.23;;;;;;;;;;;;;;21.08.23;30.08.23;
Felix;Hoffmann;mail-5@example.de;SequencerTalk Supporter (Level: Sinus);300;FALSE;annual;active;21.02.23;;;;;;;;;;;;;;21.08.23;30.08.23;
Laura ;Schäfer;mail-6@example.de;SequencerTalk Supporter (Level: Sinus);300;FALSE;annual;active;21.02.23;;;;;;;;;;;;;;21.08.23;30.08.23;
Luca ;Lange;mail-7@example.de;SequencerTalk Supporter (Level: Sinus);300;FALSE;annual;active;21.02.23;;;;;;;;;;;;;;21.08.23;30.08.23;
Elena ;Wagner;mail-8@example.de;SequencerTalk Supporter (Level: Sinus);300;FALSE;annual;active;21.02.23;;;;;;;;;;;;;;21.08.23;30.08.23;
Paul ;Schulz;mail-9@example.de;SequencerTalk Supporter (Level: Sinus);300;FALSE;annual;active;21.02.23;;;;;;;;;;;;;;21.08.23;30.08.23;
Timo ;Günther;mail-10@example.de;SequencerTalk Supporter (Level: Sinus);300;FALSE;annual;active;21.02.23;;;;;;;;;;;;;;21.08.23;30.08.23;`;

                csvText.value = csvString;

                csvNewsletterString = `email;opted_in_at
mail-20@example.de;2024-03-20 08:43:10.035321Z
mail-21@example.de;2024-03-20 08:43:10.035321Z
mail-22@example.de;2024-03-20 08:43:10.035321Z
mail-23@example.de;2024-03-20 08:43:10.035321Z
mail-24@example.de;2024-03-20 08:43:10.035321Z
mail-25@example.de;2024-03-20 08:43:10.035321Z
mail-26@example.de;2024-03-20 08:43:10.035321Z
mail-27@example.de;2024-03-20 08:43:10.035321Z
mail-28@example.de;2024-03-20 08:43:10.035321Z
mail-29@example.de;2024-03-20 08:43:10.035321Z`;

                csvNewsletterText.value = csvNewsletterString;

            } else {
                csvText.value = "";
                csvNewsletterText.value = "";
            }

        });

        function raffleCreateEvent(event: any) {

            // prevent form from general submit
            event.preventDefault();

            let validationText: string = "";
            let raffleName: string = "";
            let numberOfWinners: number = 0;
            let priceItems: string[] = [];
            let csvString: string = "";
            let csvNewsletterString: string = "";
            let participantEntries: string[] = [];

            // Form validations
            if (raffleNameInput.value !== "") {
                raffleName = raffleNameInput.value;
            } else {
                validationText += "Du musst einen Raffle-Namen angeben.<br>";
            }

            if (csvText.value !== "") {

                // import participants
                csvString = csvText.value;

                if (validateCSV(csvString)) {
                    // Proceed with importing the CSV string
                    console.log('import Supporter CSV');
                    raffleStateContainer.importCSV(csvString, true);
                } else {
                    // Handle invalid CSV string
                    validationText += "Das CSV-Format ist nicht korrekt.<br>";
                }

            }

            if (csvNewsletterText.value !== "") {

                // import participants
                csvNewsletterString = csvNewsletterText.value;

                let isParticipantsReset: boolean = csvText.value === "" ? true : false;

                if (validateCSV(csvNewsletterString)) {
                    // Proceed with importing the CSV string
                    console.log('import Newsletter CSV');
                    raffleStateContainer.importCSV(csvNewsletterString, isParticipantsReset);
                } else {
                    // Handle invalid CSV string
                    validationText += "Das CSV-Format ist nicht korrekt.<br>";
                }

            }

            if (csvNewsletterText.value === "" && csvText.value === "") {
                validationText += "Du musst CSV-Text in eines der Textfelder kopieren.<br>";
            } else {
                // Check for duplicats
                const uniqueParticipants = raffleStateContainer.removeDuplicates(raffleStateContainer.getState().participants);
                raffleStateContainer.setState({ participants: uniqueParticipants });
                console.log('Teilnehmer nach Leerung doppelter Emailadressen:');
                console.log(uniqueParticipants)
            }

            let i = 0;
            let participantLengthWithSupporterOrNewsletter = 0;
            while (i < raffleStateContainer.getState().participants.length) {

                if (raffleStateContainer.getState().participants[i].isActive) {
                    participantLengthWithSupporterOrNewsletter += 1;
                }

                // Check if newsletter participants are available
                if (raffleStateContainer.getState().participants[i].hasNewsletter) {
                    participantLengthWithSupporterOrNewsletter += 1;
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
                validationOutput.style.display = 'none';

                // Fill state methods with list data for prices
                raffleStateContainer.createPrices(priceItems);

                // Fill state with simple variables
                const state = {
                    name: raffleName,
                    includeNewsletterParticipants: csvNewsletterText.value !== "" ? true : false, //includeNewsletterCheckbox.checked,
                    numberOfWinners: numberOfWinners
                };

                // Set state object
                raffleStateContainer.setState(state);

                console.log('Start rendering list data');
                console.log(raffleStateContainer.getState().participants);
                // Output summary
                const numberOfWinnersTotal = renderRaffleData(raffleStateContainer.getState().prices, raffleStateContainer.getState().numberOfWinners, raffleStateContainer.getState().includeNewsletterParticipants);
                renderParticipantList(raffleStateContainer.getState().participants, numberOfWinnersTotal);

                raffleInfo.style.display = "none";
                raffleCreate.style.display = "none";
                raffleCreateReset.style.display = "inline-block";
                raffleGoTo.style.display = "inline-block";
                rafflePerform.style.display = "none";
                raffleRepeat.style.display = "none";

                // set veiw state
                raffleStateContainer.setState({ view: "summary" });
                orderContentLayer('summary');

            } else {
                validationOutput.innerHTML = validationText;
                validationOutput.style.display = 'block';
            }

        }

        // Eventlistener for create raffle, output summary and fill the state
        raffleCreate.addEventListener('click', raffleCreateEvent);

        determinationTypeRadios.forEach(radio => {
            radio.addEventListener('change', function (event) {
                const checkedValue = (document.querySelector<HTMLInputElement>('input[name="determinationType"]:checked') as HTMLInputElement)?.value;
                raffleStateContainer.setState({ determinationType: checkedValue });
            });
        });

        rafflePerform.addEventListener('click', function (event) {
            event.preventDefault();

            // Set view state
            raffleStateContainer.setState({ view: "raffle" });

            // Determine the winners and optional priceId's
            if (raffleStateContainer.getState().winners.length <= 0) {
                raffleStateContainer.addWinners(raffle.pickWinners());
                updateParticipantListAndPrices();
                // console.log('Winners picked');
                // console.log(raffleStateContainer.getState());
            }

            // Reverse array and add price if needed
            const reversedWinners: Winner[] = [...raffleStateContainer.getState().winners].reverse();

            if (raffleStateContainer.getState().determinationType === "simultaneously") {
                // Print all winners together in reversed order
                winnerOutput.innerHTML = reversedWinners.reverse().map(winner => {
                    let priceText = "";
                    if (raffleStateContainer.getState().prices.length > 0) {
                        const price = raffleStateContainer.getState().prices.find(price => price.id === winner.priceId);
                        if (price) {
                            priceText = "<br>" + price.priceText;
                        }
                    }
                    const winnerName: string = winner.name === "" || winner.name === " " ? winner.email : winner.name;
                    return `<div class="info-box winner"><div class="column-left">${winner.id}.</div><div class="column-right"><b>${winnerName}</b></div>${priceText}</div>`;
                }).join('');

                rafflePerform.textContent = "Raffle";

                raffleInfo.style.display = "none";
                raffleSummary.style.display = "inline-block";
                raffleCreateReset.style.display = "none";
                raffleGoTo.style.display = "none";
                rafflePerform.style.display = "none";
                raffleRepeat.style.display = "inline-block";

                raffleWinnerHeadline.textContent = "Das sind die Gewinner:";

            } else {
                // Print winners consecutively
                if (consecutivelyIterator < reversedWinners.length) {
                    const winner = reversedWinners[consecutivelyIterator];
                    let priceText = "";
                    if (raffleStateContainer.getState().prices.length > 0) {
                        const price = raffleStateContainer.getState().prices.find(price => price.id === winner.priceId);
                        if (price) {
                            priceText = "<br>" + price.priceText;
                        }
                    }
                    let el = document.createElement("div");
                    el.className = "info-box winner";
                    winnerOutput.prepend(el);
                    const winnerName: string = winner.name === "" || winner.name === " " ? winner.email : winner.name;
                    el.innerHTML = `<div class="column-left">${winner.id}.</div><div class="column-right"><b>${winnerName}</b></div>${priceText}`;
                    consecutivelyIterator++;

                    raffleSummary.style.display = "none";
                    raffleCreateReset.style.display = "none";

                    rafflePerform.textContent = "Raffle (" + consecutivelyIterator + "/" + reversedWinners.length + ")";

                    if (consecutivelyIterator === reversedWinners.length) {

                        // raffleCreateReset.style.display = "inline-block";
                        rafflePerform.style.display = "none";
                        raffleSummary.style.display = "inline-block";
                        raffleRepeat.style.display = "inline-block"
                    }
                    raffleWinnerHeadline.textContent = "Das sind die Gewinner:";

                } else {

                    // raffleInfo.style.display = "none";
                    // raffleCreate.style.display = "non";
                    // raffleCreateReset.style.display = "inline-block";
                    // raffleGoTo.style.display = "none";
                    // rafflePerform.style.display = "none";
                    // raffleRepeat.style.display = "inline-block";
                    //consecutivelyIterator = 0; // Reset iterator if reached the end of the array
                }
            }

        });

        raffleRepeat.addEventListener('click', function (event) {

            // Output summary
            const numberOfWinnersTotal = renderRaffleData(raffleStateContainer.getState().prices, raffleStateContainer.getState().numberOfWinners, raffleStateContainer.getState().includeNewsletterParticipants);
            renderParticipantList(raffleStateContainer.getState().participants, numberOfWinnersTotal);

            rafflePerform.textContent = "Raffle";
            raffleStateContainer.setState({ view: 'raffle', winners: [] });
            winnerOutput.innerHTML = "";
            consecutivelyIterator = 0;

            raffleInfo.style.display = "none";
            raffleCreate.style.display = "none";
            raffleCreateReset.style.display = "none";
            raffleSummary.style.display = "nline-block";
            raffleGoTo.style.display = "none";
            rafflePerform.style.display = "inline-block";
            raffleRepeat.style.display = "none";

            raffleWinnerHeadline.textContent = "Raffle GO!!!"

            //raffleStateContainer.setState({view: "raffle"});
        });

        // Call radio selection for winner at page load
        numberOfWinnersRadioChange();
    }

    // Function to render the raffle data on the HTML page except participants
    function renderRaffleData(prices: Price[], numberOfWinners: (number | null | undefined), hasNewsletter: boolean): number {

        let numberOfWinnersTotal: number = 0;

        const hasSupporter: boolean = csvText.value !== "" ? true : false;

        if (hasSupporter && !hasNewsletter) {
            hasNewsletterOutput.innerHTML = "Supporter: <b>ja</b> <br>Newsletter: <b>-</b>";
        } else if (!hasSupporter && hasNewsletter) {
            hasNewsletterOutput.innerHTML = "Supporter: <b>-</b> <br>Newsletter: <b>ja</b>";
        } else {
            hasNewsletterOutput.innerHTML = "Supporter: <b>ja</b> <br>Newsletter: <b>ja</b>";
        }

        if (numberOfWinners && numberOfWinners > 0) {
            numberOfWinnersTotal = numberOfWinners;
        }

        if (prices.length > 0) {
            numberOfWinnersTotal = prices.length;
        }

        numberOfWinnersOutput.innerHTML = "So viele Gewinner werden ausgelost: <b>" + numberOfWinnersTotal + "</b>";

        if (prices.length > 0) {
            pricesOutput.innerHTML = `Diese Preise werden an die Gewinner verteilt:`;
            let table = '<table class="prices-and-winner"><tr><th>Preise</th><th>Gewinner</th>';
            prices.forEach(element => {
                table += `<tr><td>${element.priceText}</td><td id="${element.id}"></td></tr>`;
            });
            table += "</table>";
            pricesOutput.innerHTML += table;
        } else {
            pricesOutput.innerHTML = `Es sind keine gesonderten Preise definiert. Es werden nur Gewinner bestimmt.`;
        }

        return numberOfWinnersTotal;
    }

    // Function to render the participant list on the HTML page
    function renderParticipantList(participants: Participant[], numberOfWinnersTotal: number) {

        participantsOutput.innerHTML = `Die <b>${numberOfWinnersTotal}</b> Gewinner werden aus folgender Liste (${raffleStateContainer.getState().participants.length}) ermittelt:<br>`;
        let table = `<table id="participantTable"><th>Name</th><th>E-Mail</th><th>SequencerTalk Supporter</th><th>isActive</th><th>hasNewsletter</th>`;

        participants.forEach(participant => {

            let willbePrinted: boolean = false;

            if (participant.isActive) {
                willbePrinted = true;
            }

            // if (includeNewsletterCheckbox.checked) {
            if (csvNewsletterText.value !== "") {
                if (participant.hasNewsletter) {
                    willbePrinted = true;
                }
            }

            let className = "excluded-from-raffle";
            if (willbePrinted) {
                className = "";
            }

            let row = `<td>${participant.firstName} ${participant.lastName}</td><td>${participant.email}</td><td>${participant.supporterType}</td><td>${participant.isActive}</td><td>${participant.hasNewsletter}</td>`;
            table += `<tr class="${className}" id="${participant.id}">${row}</tr>`;
        });

        table += "</table>";
        participantsOutput.innerHTML += table;
    }

    function updateParticipantListAndPrices() {

        if (raffleStateContainer.getState().winners.length > 0) {

            const winnerTableRows = document.querySelectorAll('#participantTable tbody tr');

            if (winnerTableRows && winnerTableRows.length > 0) {
                raffleStateContainer.getState().winners.forEach(winner => {
                    const participantId = winner.participantId;
                    winnerTableRows.forEach(row => {
                        if (winner.participantId === +row.id) {
                            row.className = 'winner';
                        }
                    });

                    if (raffleStateContainer.getState().prices.length > 0) {
                        const pricesListItems = document.querySelectorAll('#prices-output td');
                        pricesListItems.forEach(item => {
                            if (winner.priceId === +item.id) {
                                const winnerName: string = winner.name === "" || winner.name === " " ? winner.email : winner.name;
                                item.innerHTML += " <b>" + winnerName + "</b>";
                            }
                        });
                    }
                });
            }
        }

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
        // if (raffleNameInput && includeNewsletterCheckbox && numberOfWinnersInput) { // TODO
        if (raffleNameInput && numberOfWinnersInput) { // TODO
            raffleNameInput.value = state.name;
            //includeNewsletterCheckbox.checked = state.includeNewsletterParticipants;
            numberOfWinnersInput.value = state.numberOfWinners ? state.numberOfWinners.toString() : '';
        }
    }

    function validateCSV(csvString: string): boolean {
        // Split the CSV string into lines
        const lines = csvString.trim().split('\n');

        // Check if there is at least one line in the CSV
        if (lines.length === 0) {
            console.error("CSV string is empty.");
            return false;
        }

        // Assuming each line represents a participant, you can perform further validation on each line if needed
        // For example, you might check if each line has the expected number of fields, if fields are properly formatted, etc.

        // If the CSV string passes all validation checks, return true
        return true;
    }

    function orderContentLayer(state: string): void {
        const contentLayers = document.querySelectorAll<HTMLInputElement>('.content-wrapper');
        let i = 1;
        contentLayers.forEach(content => {
            if (content.id !== state) {
                content.style.zIndex = `${i}`;
                content.style.display = "none";
                i++;
            } else {
                content.style.zIndex = '4';
                content.style.display = "flex";
            }
        });
    }

    // Define initial state
    const initialState: RaffleState = {
        name: "New Raffle",
        includeNewsletterParticipants: false,
        numberOfWinners: null,
        participants: [],
        prices: [],
        winners: [],
        view: "info",
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


