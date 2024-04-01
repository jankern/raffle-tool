/* 
    Author: Jan Kern, 2024
    Main ts file to handle the raffle project and controll the UI
*/

// Import classes
import { RaffleState, Participant, Winner, Price } from "./Interfaces";
import { RaffleStateContainer } from "./RaffleState";
import { Raffle } from "./Raffle";

// Import third party
import { gsap } from "gsap";

// Import styles and fonts
import '@material-design-icons/font';
import "../scss/styles.scss";

document.addEventListener("DOMContentLoaded", () => {

    // Input / radio elements
    const numberOfWinnersRadio = document.getElementById('numberOfWinnersRadio') as HTMLInputElement;
    const numberOfSupporterWinnersInput = document.getElementById('numberOfSupporterWinners') as HTMLInputElement;
    const numberOfNewsletterWinnersInput = document.getElementById('numberOfNewsletterWinners') as HTMLInputElement;
    const pricesRadio = document.getElementById('pricesRadio') as HTMLInputElement;
    const addPriceButton = document.getElementById('addPriceButton') as HTMLButtonElement;
    const pricesContainer = document.getElementById('pricesContainer') as HTMLDivElement;

    // Buttons
    const raffleInfo = document.getElementById('raffle-info') as HTMLButtonElement;
    const raffleCreate = document.getElementById('raffle-create') as HTMLButtonElement;
    const raffleCreateReset = document.getElementById('raffle-create-reset') as HTMLButtonElement;
    const raffleSummary = document.getElementById('raffle-summary') as HTMLButtonElement;
    const raffleGoTo = document.getElementById('raffle-goto') as HTMLButtonElement;
    const rafflePerform = document.getElementById('raffle-perform') as HTMLButtonElement;
    const raffleRepeat = document.getElementById('raffle-repeat') as HTMLButtonElement;
    const raffleDeterminationType = document.getElementById('raffle-determination-type') as HTMLButtonElement;
    const raffleWinnerHeadline = document.getElementById('raffle-winner-headline') as HTMLElement;
    const navRafflePerform = document.getElementById('nav-raffle-perform') as HTMLElement;

    // Textfields / Selects
    const csvText = document.getElementById('csvText') as HTMLTextAreaElement;
    const csvNewsletterText = document.getElementById('csvNewsletterText') as HTMLTextAreaElement;
    const raffleNameInput = document.getElementById('raffleName') as HTMLInputElement;
    const determinationTypeRadios = document.querySelectorAll<HTMLInputElement>('input[name="determinationType"]');
    const useTestDataCheckbox = document.getElementById('useTestData') as HTMLInputElement;

    // Output / summary elements
    const validationOutput = document.getElementById('validation-output') as HTMLElement;
    const participantsTableOutput = document.getElementById('participants-table-output') as HTMLElement;
    const winnersTableOutput = document.getElementById('winners-table-output') as HTMLElement;
    const numberOfWinnersOutput = document.getElementById('number-of-winners-output') as HTMLElement;
    const pricesOutput = document.getElementById('prices-output') as HTMLElement;
    const hasNewsletterOutput = document.getElementById('has-newsletter-output') as HTMLElement;
    const winnerOutput = document.getElementById('winner-output') as HTMLElement;

    let consecutivelyIterator: number = 0;
    let isAnimatingWinner = false;

    // Menu buttons initial states
    raffleInfo.style.display = "inline-block";
    raffleCreate.style.display = "none";
    raffleCreateReset.style.display = "none";
    raffleSummary.style.display = "none";
    raffleGoTo.style.display = "none";
    rafflePerform.style.display = "none";
    raffleRepeat.style.display = "none";
    raffleDeterminationType.style.display = "none";

    // Function to enable and disable menu buttons
    function stateDisplayForMenuAndPages(
        raffleInfoDisplay: string,
        raffleCreateDisplay: string,
        raffleCreateResetDisplay: string,
        raffleSummaryDisplay: string,
        raffleGoToDisplay: string,
        rafflePerformDisplay: string,
        raffleRepeatDisplay: string,
        raffleDeterminationTypeDisplay: string
    ): void {
        raffleInfo.style.display = raffleInfoDisplay;
        raffleCreate.style.display = raffleCreateDisplay;
        raffleCreateReset.style.display = raffleCreateResetDisplay;
        raffleSummary.style.display = raffleSummaryDisplay;
        raffleGoTo.style.display = raffleGoToDisplay;
        rafflePerform.style.display = rafflePerformDisplay;
        raffleRepeat.style.display = raffleRepeatDisplay;
        raffleDeterminationType.style.display = raffleDeterminationTypeDisplay;
    }

    // Raffle create and perform UI with form validation
    if (numberOfWinnersRadio && numberOfSupporterWinnersInput && numberOfNewsletterWinnersInput && pricesRadio && addPriceButton && pricesContainer && raffleCreate && rafflePerform && determinationTypeRadios) {

        function raffleInfoEvent(): void {
            raffleStateContainer.setState({ view: "create" });
            stateDisplayForMenuAndPages("none", "inline-block", "none", "none", "none", "none", "none", "none");
            stateOrderContentLayer('create'); // TODO use getState value
        }

        // View: Info
        raffleInfo.addEventListener('click', raffleInfoEvent);

        // View: Raffle reset / edit
        raffleCreateReset.addEventListener('click', raffleInfoEvent);

        function raffleSummaryEvent(): void {
            raffleStateContainer.setState({ view: "summary" });
            stateDisplayForMenuAndPages("none", "none", "inline-block", "none", "inline-block", "none", "none", "none");
            stateOrderContentLayer('summary');
        }

        // View: Summary
        raffleSummary.addEventListener('click', raffleSummaryEvent);

        // View: Raffle Go To
        raffleGoTo.addEventListener('click', (event: Event): void => {
            consecutivelyIterator = 0;
            raffleStateContainer.setState({ view: "raffle" });
            stateDisplayForMenuAndPages("none", "none", "none", "inline-block", "none", "inline-block", "none", "inline-block");

            // If winners alreday exist and the screen gets accessed again, it indicates the old results with an overlay
            if (raffleStateContainer.getState().winners.length > 0) {
                rafflePerform.style.display = "none";
                raffleRepeat.style.display = "inline-block";

                // Overlay 
                // It exists
                const overlayOldWinners = document.getElementById('overlay-old-winners');
                if (overlayOldWinners) {
                    overlayOldWinners.style.display = "block";
                } else {
                    // It has to be created
                    const overlayOldWiners = document.createElement('div');
                    overlayOldWiners.id = "overlay-old-winners";
                    const raffleContainer = document.getElementById('raffle');
                    if (raffleContainer) {
                        raffleContainer.appendChild(overlayOldWiners);
                    }
                }
            }

            stateOrderContentLayer('raffle');
        });

        // Eventmethod for winner number
        function numberOfWinnersRadioChange(): void {
            numberOfWinnersRadio.checked = true;
            numberOfSupporterWinnersInput.disabled = false;
            numberOfNewsletterWinnersInput.disabled = false;
            addPriceButton.disabled = true;

            // Disable price inputs fields and clear their values
            const priceInputs = document.querySelectorAll('input[name^="price"]');
            priceInputs.forEach(input => {
                (input as HTMLInputElement).disabled = true;
            });

            const priceSelects = document.querySelectorAll('select[name^="price"]');
            priceSelects.forEach(select => {
                (select as HTMLSelectElement).disabled = true;
            });

            const removeButtons = document.querySelectorAll('button[name^="price_remove"]');
            removeButtons.forEach(button => {
                (button as HTMLInputElement).disabled = true;
            });
        }

        // Eventlistener for winner number
        numberOfWinnersRadio.addEventListener('change', numberOfWinnersRadioChange);

        // Eventlistener for add prices
        pricesRadio.addEventListener('change', (event: Event): void => {
            numberOfSupporterWinnersInput.disabled = true;
            numberOfNewsletterWinnersInput.disabled = true;
            addPriceButton.disabled = false;

            // Enable price input fields if previously disabled
            const priceInputs = document.querySelectorAll('input[name^="price"]');
            priceInputs.forEach(input => {
                (input as HTMLInputElement).disabled = false;
            });

            const priceSelects = document.querySelectorAll('select[name^="price"]');
            priceSelects.forEach(select => {
                (select as HTMLSelectElement).disabled = false;
            });

            const removeButtons = document.querySelectorAll('button[name^="price_remove"]');
            removeButtons.forEach(button => {
                (button as HTMLInputElement).disabled = false;
            });
        });

        // Adding input fields dynamically for prices
        let priceCount = 1; // Counter for naming price input fields
        addPriceButton.addEventListener('click', (event: Event): void => {
            const input = document.createElement('input');
            input.type = 'text';
            input.name = `price${priceCount}`; // Increment counter for each new price input field
            input.placeholder = `${priceCount}. Preis`;

            const select = document.createElement('select');
            select.name = `priceType${priceCount}`;
            select.name = `price${priceCount}`;

            const supporterOption = document.createElement('option');
            supporterOption.value = 'supporter';
            supporterOption.text = 'Supporter';

            const newsletterOption = document.createElement('option');
            newsletterOption.value = 'newsletter';
            newsletterOption.text = 'Newsletter';

            const allOption = document.createElement('option');
            allOption.value = 'all';
            allOption.text = 'Alle';

            select.appendChild(supporterOption);
            select.appendChild(newsletterOption);
            select.appendChild(allOption);

            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.name = 'price_remove';
            removeButton.className = 'internal';
            removeButton.textContent = 'Entfernen';

            // Adding dynamically event listerns for remove buttons for each price row
            removeButton.addEventListener('click', function () {
                // Remove the input field, select, and the remove button
                pricesContainer.removeChild(input);
                pricesContainer.removeChild(select);
                pricesContainer.removeChild(removeButton);
                priceCount--;

                const priceInputs = document.querySelectorAll('input[name^="price"]');
                let i = 1;
                priceInputs.forEach(input => {
                    (input as HTMLInputElement).placeholder = `${i}. Preis`;
                    (input as HTMLInputElement).name = `price${i}`;
                    i++;
                });

                const priceTypeSelects = document.querySelectorAll('select[name^="priceType"]');
                priceTypeSelects.forEach(select => {
                    (select as HTMLSelectElement).name = `priceType${i}`;
                    i++;
                });

            });

            pricesContainer.appendChild(input);
            pricesContainer.appendChild(select);
            pricesContainer.appendChild(removeButton);
            priceCount++;
        });

        // Checkbox to generate test content for supporter and nwesletter participants
        useTestDataCheckbox.addEventListener('change', (event: Event): void => {
            let csvString: string;
            let csvNewsletterString: string;

            if (useTestDataCheckbox.checked) {

                csvString =
                    `first_name,last_name,email,plan_name,plan_monthly_amount_cents,gifted,subscription_period,subscription_state,subscribed_at,trial_ends_at,cancelled_at,expires_at,shipping_first_name,shipping_last_name,shipping_company_name,shipping_street_and_number,shipping_city,shipping_zip_code,shipping_state,shipping_country_code,new_plan_name,new_plan_monthly_amount_cents,price_increase_opt_in_email_sent_at,price_increase_opted_in_at,price_increase_new_plan_monthly_amount_cents
Sophia,Müller,mail-1@example.de,SequencerTalk Supporter (Level: Sinus),300,FALSE,annual,active,21.02.23,,,,,,,,,,,,,,21.08.23,30.08.23,
Lukas,Schmidt,mail-2@example.de,SequencerTalk Supporter (Level: Sägezahn),600,FALSE,monthly,cancelled,16.12.22,,28.02.23,28.02.23,,,,,,,,,,,,,
Hans,Dampf,mail-3@example.de,SequencerTalk Supporter (Level: Sägezahn),600,FALSE,monthly,not_renewing,16.12.22,,28.02.23,28.02.23,,,,,,,,,,,,,
Ben,Hartmann,mail-4@example.de,SequencerTalk Supporter (Level: Sinus),300,FALSE,annual,active,21.02.23,,,,,,,,,,,,,,21.08.23,30.08.23,
Felix,Hoffmann,mail-5@example.de,SequencerTalk Supporter (Level: Sinus),300,FALSE,annual,active,21.02.23,,,,,,,,,,,,,,21.08.23,30.08.23,
Laura ,Schäfer,mail-6@example.de,SequencerTalk Supporter (Level: Sinus),300,FALSE,annual,active,21.02.23,,,,,,,,,,,,,,21.08.23,30.08.23,
Luca ,Lange,mail-7@example.de,SequencerTalk Supporter (Level: Sinus),300,FALSE,annual,active,21.02.23,,,,,,,,,,,,,,21.08.23,30.08.23,
Elena ,Wagner,mail-8@example.de,SequencerTalk Supporter (Level: Sinus),300,FALSE,annual,active,21.02.23,,,,,,,,,,,,,,21.08.23,30.08.23,
Paul ,Schulz,mail-9@example.de,SequencerTalk Supporter (Level: Sinus),300,FALSE,annual,active,21.02.23,,,,,,,,,,,,,,21.08.23,30.08.23,
Timo ,Günther,mail-10@example.de,SequencerTalk Supporter (Level: Sinus),300,FALSE,annual,active,21.02.23,,,,,,,,,,,,,,21.08.23,30.08.23,`;

                csvText.value = csvString;

                csvNewsletterString = `email,opted_in_at
mail-20@example.de,2024-03-20 08:43:10.035321Z
mail-21@example.de,2024-03-20 08:43:10.035321Z
mail-22@example.de,2024-03-20 08:43:10.035321Z
mail-23@example.de,2024-03-20 08:43:10.035321Z
mail-24@example.de,2024-03-20 08:43:10.035321Z
mail-25@example.de,2024-03-20 08:43:10.035321Z
mail-26@example.de,2024-03-20 08:43:10.035321Z
mail-27@example.de,2024-03-20 08:43:10.035321Z
mail-28@example.de,2024-03-20 08:43:10.035321Z
mail-28@example.de,2024-03-20 08:43:10.035321Z
mail-29@example.de,2024-03-20 08:43:10.035321Z`;


                csvNewsletterText.value = csvNewsletterString;

            } else {
                csvText.value = "";
                csvNewsletterText.value = "";
            }

        });

        // Function to create the raffle, output summary and fill the state
        raffleCreate.addEventListener('click', (event: Event): void => {

            // prevent form from general submit
            // event.preventDefault();

            let validationText: string = "";
            let raffleName: string = "";
            let numberOfWinners: number = 0;
            let numberOfSupporterWinners: number = 0;
            let numberOfNewsletterWinners: number = 0;
            let priceItems: { priceText: string, priceType: string }[] = [];
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
                // import supporter participants
                csvString = csvText.value;

                if (raffleStateContainer.validateCSV(csvString)) {
                    // Proceed with importing the CSV string
                    console.log('import Supporter CSV');
                    raffleStateContainer.importCSV(csvString, true);
                } else {
                    // Handle invalid CSV string
                    validationText += "Das CSV-Format ist nicht korrekt.<br>";
                }
            }

            if (csvNewsletterText.value !== "") {
                // import newsletter participants
                csvNewsletterString = csvNewsletterText.value;
                let isParticipantsReset: boolean = csvText.value === "" ? true : false;

                if (raffleStateContainer.validateCSV(csvNewsletterString)) {
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
                console.log('Participants after removing duplicated email ids:', uniqueParticipants);
            }

            let inactiveParticipants = 0;
            for (let i = 0; i < raffleStateContainer.getState().participants.length; i++) {
                if (raffleStateContainer.getState().participants[i].supporterType !== "" && !raffleStateContainer.getState().participants[i].isActive) {
                    inactiveParticipants++;
                }
            }

            // Validate if supporter and newsletter participants are filled and if they don't exceed the participant amount
            if (numberOfWinnersRadio.checked) {
                const state = raffleStateContainer.getState();
                // Supporter
                if (numberOfSupporterWinnersInput.value !== "" && +numberOfSupporterWinnersInput.value > 0) {

                    if (state && state.numberOfSupporterParticipants !== undefined) {
                        if (state.numberOfSupporterParticipants - inactiveParticipants < +numberOfSupporterWinnersInput.value) {
                            validationText += "Du musst eine gültige Gewinneranzahl von Supportern eingeben (max. " + (state.numberOfSupporterParticipants - inactiveParticipants) + ").<br>";
                        } else {
                            numberOfSupporterWinners = +numberOfSupporterWinnersInput.value;
                        }
                    }

                } else {
                    if (csvText.value !== "") {
                        validationText += "Du musst eine Gewinneranzahl von Supportern eingeben.<br>";
                    }
                }
                // Newsletter
                if (numberOfNewsletterWinnersInput.value !== "" && +numberOfNewsletterWinnersInput.value > 0) {

                    if (state && state.numberOfNewsletterParticipants !== undefined) {
                        if (state.numberOfNewsletterParticipants < +numberOfNewsletterWinnersInput.value) {
                            validationText += "Du musst eine gültige Gewinneranzahl von Newsletter-Abonnenten eingeben (max. " + state.numberOfNewsletterParticipants + ").<br>";
                        } else {
                            numberOfNewsletterWinners = +numberOfNewsletterWinnersInput.value;
                        }
                    }
                } else {
                    if (csvNewsletterText.value !== "") {
                        validationText += "Du musst eine Gewinneranzahl von Newsletter-Abonnenten eingeben.<br>";
                    }
                }

                // Check if the overall participant list length matches the filled entries
                if (state && state.numberOfSupporterParticipants !== undefined && state && state.numberOfNewsletterParticipants !== undefined) {
                    if (raffleStateContainer.getState().participants.length - inactiveParticipants < ((+numberOfSupporterWinnersInput.value) + (+numberOfNewsletterWinnersInput.value))) {
                        validationText += "Du kannst nicht mehr Gewinner als Teilnehmer definieren (max. " + (raffleStateContainer.getState().participants.length - inactiveParticipants) + ").<br>";
                    }
                }

                numberOfWinners = numberOfSupporterWinners + numberOfNewsletterWinners;
            }

            // Validate if prices values are correct and create the prices
            if (pricesRadio.checked) {
                const priceInputs = document.querySelectorAll('input[name^="price"], select[name^="price"]');

                let htmlName: string;
                let priceText: string;
                let priceType: string;
                let numberOfSupporterSelect: number = 0;
                let numberOfNewsletterSelect: number = 0;
                let hasSupporterInputFailed = false;
                let hasNewsletterInputFailed = false;

                // Collect priceText and priceType from html input / select elements and pass them to the priceItems array
                priceInputs.forEach(input => {

                    if ((input as HTMLInputElement).value !== "") {

                        if (htmlName === (input as HTMLInputElement).name) {
                            priceType = (input as HTMLInputElement).value;
                            // Regexp for str
                            const hasContentRegExp = /\S/;
                            // Check if no priceType is selected for supporter or newsletter when they are empty
                            if (!hasContentRegExp.test(csvText.value) && priceType === "supporter") {
                                hasSupporterInputFailed = true;
                            }

                            if (!hasContentRegExp.test(csvNewsletterText.value) && priceType === "newsletter") {
                                hasNewsletterInputFailed = true;
                            }
                            // Count how much prices are assigned to supporters
                            if (priceType === "supporter") {
                                numberOfSupporterSelect++;
                            }
                            // Count how much prices are assigned to nesletter participants
                            if (priceType === "newsletter") {
                                numberOfNewsletterSelect++;
                            }
                            // add price text and type
                            priceItems.push({ priceText, priceType });
                        } else {
                            priceText = (input as HTMLInputElement).value;
                        }
                        htmlName = (input as HTMLInputElement).name;
                    }
                });


                if (priceItems.length <= 0) {
                    validationText += "Du musst mindestens einen Preis angeben<br>";
                }

                if (hasSupporterInputFailed) {
                    validationText += "Es sind keine Supporter vorhanden zur Preiszuordnung.<br>";
                }

                if (hasNewsletterInputFailed) {
                    validationText += "Es sind keine Newsletter-Abonnenten vorhanden zur Preiszuordnung.<br>";
                }

                // Check if less / equal supporters or newsletters are targeted via priceType
                let state = raffleStateContainer.getState();
                if (state && state.numberOfSupporterParticipants !== undefined) {
                    if (state.numberOfSupporterParticipants > 0 && state.numberOfSupporterParticipants - inactiveParticipants < numberOfSupporterSelect) {
                        validationText += "Du musst eine gültige Preisanzahl von Supportern definieren (max. " + (state.numberOfSupporterParticipants - inactiveParticipants) + ").<br>";
                    }
                }

                if (state && state.numberOfNewsletterParticipants !== undefined) {
                    if (state.numberOfNewsletterParticipants > 0 && state.numberOfNewsletterParticipants < numberOfNewsletterSelect) {
                        validationText += "Du musst eine gültige Preisanzahl von Newsletter-Abonnenten definieren (max. " + state.numberOfNewsletterParticipants + ").<br>";
                    }
                }

                // Check if the overall participant list length matches 
                if (state && state.numberOfSupporterParticipants !== undefined && state && state.numberOfNewsletterParticipants !== undefined) {
                    if (raffleStateContainer.getState().participants.length - inactiveParticipants < priceItems.length) {
                        validationText += "Du kannst nicht mehr Preise als Teilnehmer definieren (max. " + (raffleStateContainer.getState().participants.length - inactiveParticipants) + ").<br>";
                    }
                }
            }

            // Submit form only if validation string is empty, hence all fields are correctly filled
            if (validationText === "") {

                validationOutput.innerHTML = "";
                validationOutput.style.display = 'none';

                // Fill state methods with list data for prices
                raffleStateContainer.createPrices(priceItems);

                // Fill state with simple variables
                const state = {
                    name: raffleName,
                    includeNewsletterParticipants: csvNewsletterText.value !== "" ? true : false, //includeNewsletterCheckbox.checked,
                    numberOfWinners: numberOfWinners,
                    numberOfSupporterWinners: numberOfSupporterWinners,
                    numberOfNewsletterWinners: numberOfNewsletterWinners
                };

                // Set state object
                raffleStateContainer.setState(state);

                console.log('Start rendering participant list data', raffleStateContainer.getState().participants);
                console.log('Show raffle', raffleStateContainer.getState());

                // Output summary data
                const numberOfWinnersTotal = renderRaffleData(raffleStateContainer.getState().prices, raffleStateContainer.getState().numberOfWinners, raffleStateContainer.getState().includeNewsletterParticipants);
                renderParticipantList(raffleStateContainer.getState().participants, numberOfWinnersTotal);

                // Close winner table if open
                winnersTableOutput.style.display = "none";
                hideSummary(false);

                // Set view and state for summary
                raffleSummaryEvent();
                raffleWinnerHeadline.textContent = raffleStateContainer.getState().name;
                // Display raffle button

            } else {
                // Show validation container and scroll to top
                validationOutput.innerHTML = validationText;
                validationOutput.style.display = 'block';

                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });

        // Radio to check if the raffle winners should be displayed at once or after each other by pushed used user button
        determinationTypeRadios.forEach(radio => {
            radio.addEventListener('change', (evenet: Event): void => {
                const checkedValue = (document.querySelector<HTMLInputElement>('input[name="determinationType"]:checked') as HTMLInputElement)?.value;
                raffleStateContainer.setState({ determinationType: checkedValue });
            });
        });

        // Function to perform the raffle game
        async function rafflePerformEvent(): Promise<void> {

            // prevent form from general submit
            // event.preventDefault();

            if (isAnimatingWinner) {
                return;
            }

            // Start raffle button animation if it's simultaneously or teh first consecutively loop
            if (consecutivelyIterator <= 0) {

                gsap.to(navRafflePerform, {opacity: 1, display: 'block', duration: 0.3});

                const dice1 = document.getElementById('r');
                const dice2 = document.getElementById('m');
                const dice3 = document.getElementById('l');
                if (dice1 && dice2 && dice3) {
                    dice1.className = "material-icons r";
                    dice2.className = "material-icons m";
                    dice3.className = "material-icons l";
                }

                isAnimatingWinner = true;

                await new Promise<void>((resolve) => {
                    setTimeout(() => {
                        // Stop raffle button animation
                        if (dice1 && dice2 && dice3) {
                            dice1.className = "material-icons";
                            dice2.className = "material-icons";
                            dice3.className = "material-icons";
                        }
                        // Hide raffle button
                        gsap.to(navRafflePerform, {opacity: 0, display: 'none', duration: 0.3});
                        isAnimatingWinner = false;
                        resolve();
                    }, 3500);
                });
            }

            // Set view state
            raffleStateContainer.setState({ view: "raffle" });

            // Determine the winners and optional priceId's
            if (raffleStateContainer.getState().winners.length <= 0) {
                raffleStateContainer.addWinners(raffle.pickWinners());
                updateParticipantListAndPrices();
            }

            // Reverse array and add price if available
            const reversedWinners: Winner[] = [...raffleStateContainer.getState().winners].reverse();

            if (raffleStateContainer.getState().determinationType === "simultaneously") {

                // Clear the winner output before adding new winners
                winnerOutput.innerHTML = "";

                // Check if animateWinner is already running
                if (!isAnimatingWinner) {
                    isAnimatingWinner = true;
                    // Loop through each winner and animate them sequentially
                    let promiseChain: Promise<void> = Promise.resolve();
                    let i = 0;
                    raffleStateContainer.getState().winners.forEach((winner, i) => {
                        promiseChain = promiseChain.then(() => animateWinner(winner, i));
                        i += 1;
                    });
                    // Reset the flag to indicate animation end when promise is resolved
                    promiseChain.finally(() => {
                        isAnimatingWinner = false;
                    });
                }

                raffleWinnerHeadline.textContent = "Das sind die Gewinner:";

                stateDisplayForMenuAndPages("none", "none", "none", "inline-block", "none", "none", "inline-block", "inline-block");
            } else {
                // Print winners consecutively
                if (consecutivelyIterator < reversedWinners.length) {
                    const winner = reversedWinners[consecutivelyIterator];

                    // Check if animateWinner is already running
                    if (!isAnimatingWinner) {
                        // Animate the winner only if the previous animation has finished
                        isAnimatingWinner = true; // Set the flag to indicate animation start
                        try {
                            await animateWinner(reversedWinners[consecutivelyIterator], consecutivelyIterator,);
                        } catch (error) {
                            console.error("Animation error:", error);
                        } finally {
                            isAnimatingWinner = false; // Reset the flag to indicate animation end
                        }
                    }

                    consecutivelyIterator++;

                    // Set menu display
                    stateDisplayForMenuAndPages("none", "none", "none", "none", "none", "inline-block", "none", "inline-block");
                    rafflePerform.textContent = "Raffle (" + consecutivelyIterator + "/" + reversedWinners.length + ")";

                    if (consecutivelyIterator === reversedWinners.length) {
                        // Set menu display when stepped raffle is done
                        stateDisplayForMenuAndPages("none", "none", "none", "inline-block", "none", "none", "inline-block", "inline-block");
                    }
                    raffleWinnerHeadline.textContent = "Das sind die Gewinner:";

                }
            }
        }

        // Function to animate each winner
        function animateWinner(winner: Winner, i: number): Promise<void> {
            return new Promise<void>((resolve) => {
                // Create HTML for the winner
                let priceText = "";
                if (raffleStateContainer.getState().prices.length > 0) {
                    const price = raffleStateContainer.getState().prices.find(price => price.id === winner.priceId);
                    if (price) {
                        priceText = "<br>" + price.priceText;
                    }
                }
                const winnerName = winner.name === "" || winner.name === " " ? raffle.shortenEmailUsername(winner.email, 50, false) : raffle.shortenName(winner.name);
                const winnerHTML = `<div class="info-box winner" id="winner-${i}"><div class="column-left">${winner.id}.</div><div class="column-right"><b>${winnerName}</b></div>${priceText}</div>`;

                // Append the winner HTML to the winnerOutput
                winnerOutput.innerHTML += winnerHTML;

                // Animate the opacity of the newly added winner
                // gsap.fromTo(`#winner-${i}`, { opacity: 0, duration: 0.2, width: '200px', minHeight: '100px'}, { opacity: 1, duration: 1, width: '250px', minHeight: '130px', ease: "elastic.out(1,0.3)", onComplete: resolve }); // Resolve the promise when the animation is complete
                gsap.fromTo(".info-box.winner:last-child", { opacity: 0, width: '250px', minHeight: '130px'}, { opacity: 1, duration: 1, width: '250px', minHeight: '130px', ease: "power3.out", onComplete: resolve }); // Resolve the promise when the animation is complete
                //gsap.from(".info-box.winner:last-child", { duration: 1, opacity: 0, ease: "elastic.out(1,0.3)", onComplete: resolve });
            });
        };

        // Event listener to call raffle perform function
        rafflePerform.addEventListener('click', rafflePerformEvent);
        navRafflePerform.addEventListener('click', rafflePerformEvent);

        raffleRepeat.addEventListener('click', function (event) {

            if (isAnimatingWinner) {
                return;
            }

            // Output summary
            const numberOfWinnersTotal = renderRaffleData(raffleStateContainer.getState().prices, raffleStateContainer.getState().numberOfWinners, raffleStateContainer.getState().includeNewsletterParticipants);
            renderParticipantList(raffleStateContainer.getState().participants, numberOfWinnersTotal);

            rafflePerform.textContent = "Raffle";
            raffleWinnerHeadline.textContent = raffleStateContainer.getState().name;
            // Display raffle button
            gsap.to(navRafflePerform, {opacity: 1, display: 'block', duration: 0.3});

            raffleStateContainer.setState({ view: 'raffle', winners: [] });
            winnerOutput.innerHTML = "";
            consecutivelyIterator = 0;

            // Set menu display when stepped raffle is done
            stateDisplayForMenuAndPages("none", "none", "none", "inline-block", "none", "inline-block", "none", "inline-block");

            // Remove overlay
            const overlayOldWinners = document.getElementById('overlay-old-winners');
            if (overlayOldWinners) {
                overlayOldWinners.style.display = "none";
            }

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

        numberOfWinnersOutput.innerHTML = "So viele Gewinner werden ausgelost: <b>" + numberOfWinnersTotal + "</b><br>&nbsp;";

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

        participantsTableOutput.innerHTML = `Die <b>${numberOfWinnersTotal}</b> Gewinner werden aus folgender Liste (${raffleStateContainer.getState().participants.length}) ermittelt:<br>`;
        let table = `<table id="participantTable"><tr><th>Name</th><th>E-Mail</th><th>SequencerTalk Supporter</th><th>isActive</th><th>hasNewsletter</th></tr>`;

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
        participantsTableOutput.innerHTML += table;
    }

    // Function to update the participant table after the raffle
    function updateParticipantListAndPrices(): void {

        if (raffleStateContainer.getState().winners.length > 0) {

            // Generate additionally winners table if winners are available
            renderWinnerList(raffleStateContainer.getState().winners, raffleStateContainer.getState().prices);

            // Update values in participnat table
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

    function renderWinnerList(winners: Winner[], prices: Price[]): void {

        let priceHeadColumn: string = "";
        if (raffleStateContainer.getState().prices.length > 0) {
            priceHeadColumn = "<th>Preis</th>";
        }

        winnersTableOutput.style.display = "block";
        winnersTableOutput.innerHTML = `<div class="row submenu"><div class="column column-1-3">
        <button type="type" class="internal" id="hideWinnersTable" name="hideWinnersTable">Gewinnertabelle ausblenden</buuton>
        <button type="button" class="internal icon right" id="copy-table-to-clipboard" title="Tabelle in Clipboard kopieren."><span class="material-icons">
        content_paste</span></button></div></div>`;

        let table = `<table id="winnersTable"></thead><tr><th width="30">Spot</th><th>Name</th><th>E-Mail</th><th>Typ</th>${priceHeadColumn}</tr></thead></body>`;

        // Reverse array and add price if available
        const reversedWinners: Winner[] = [...winners].reverse();

        // Print all winners together in reversed order
        table += reversedWinners.reverse().map(winner => {
            let priceText: string = "";
            let participiantType: string = "";

            if (raffleStateContainer.getState().prices.length > 0) {
                const price = raffleStateContainer.getState().prices.find(price => price.id === winner.priceId);
                if (price) {
                    priceText = `<td>${price.priceText}</td>`;
                }
            }

            if (winner.isSupporter) {
                participiantType = "Supporter";
            } else {
                participiantType = "Newsletter";
            }

            return `<tr class="winner"><td style="text-align:right">${winner.id}</td><td>${winner.name}</td><td>${winner.email}</td><td>${participiantType}</td>${priceText}</tr>`;
        }).join('');

        table += "</tbody></table>";
        winnersTableOutput.innerHTML += table;

        // Function to manage the summary view
        const hideWinnersTable = document.getElementById('hideWinnersTable') as HTMLInputElement;
        const copyTableToClicpboard = document.getElementById('copy-table-to-clipboard') as HTMLInputElement;

        let toggle: boolean = false;

        hideWinnersTable.addEventListener('click', (event: Event): void => {
            if (!toggle) {
                hideSummary(false);
                hideWinnersTable.innerHTML = "Gewinnertabelle einblenden";
                copyTableToClicpboard.style.display = "none";
            } else {
                hideSummary(true);
                hideWinnersTable.innerHTML = "Zurück zur Übersicht";
                copyTableToClicpboard.style.display = "inline-block";
            }
            toggle = !toggle;
        });

        copyTableToClicpboard.addEventListener('click', (event: Event): void => {
            copyTableToClipboard('winnersTable');
        });

        hideSummary(true);
    }

    // Function to toggle visibility of summary elements
    function hideSummary(hide: boolean): void {

        const winnersTable = document.getElementById('winnersTable') as HTMLElement;
        if (!winnersTable) {
            return;
        }

        if (!hide) {
            participantsTableOutput.style.display = "inline-table";
            pricesOutput.style.display = "inline-table";
            winnersTable.style.display = "none";
        } else {
            participantsTableOutput.style.display = "none";
            pricesOutput.style.display = "none";
            winnersTable.style.display = "inline-table";
        }

    }

    // Clipboard copy
    function copyTableToClipboard(tableId: string) {
        const table = document.getElementById(tableId);
        if (!table) {
            console.error("Table not found.");
            return;
        }

        const range = document.createRange();
        range.selectNode(table);

        try {
            navigator.clipboard.writeText(table.innerText);
            console.log("Table copied to clipboard.");
        } catch (error) {
            console.error("Failed to copy table to clipboard:", error);
        }
    }

    // Function to update form inputs with state values
    function updateFormWithState(state: {
        name: string;
        includeNewsletterParticipants: boolean;
        numberOfWinners?: number | null;
        numberOfSupporterWinners?: number;
        numberOfNewsletterWinners?: number;
        participants: Participant[];
        prices: Price[];
        winners: Winner[];
    }) {
        if (raffleNameInput && numberOfSupporterWinnersInput) {
            raffleNameInput.value = state.name;
            numberOfSupporterWinnersInput.value = state.numberOfSupporterWinners ? state.numberOfSupporterWinners.toString() : '';
            numberOfNewsletterWinnersInput.value = state.numberOfNewsletterWinners ? state.numberOfNewsletterWinners.toString() : '';
        }
    }

    function stateOrderContentLayer(state: string): void {
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
        numberOfSupporterWinners: 0,
        numberOfNewsletterWinners: 0,
        participants: [],
        numberOfSupporterParticipants: 0,
        numberOfNewsletterParticipants: 0,
        prices: [],
        winners: [],
        view: "info",
        determinationType: "simultaneously"
    };

    // Create an instance of the state container
    const raffleStateContainer = new RaffleStateContainer(initialState);

    // Create an instance of the Raffle class (business logic) with the state container
    const raffle = new Raffle(raffleStateContainer);

    // Update the form with initial state values
    updateFormWithState(initialState);

});


