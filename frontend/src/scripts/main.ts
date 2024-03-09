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

import { RaffleImplementation } from './Raffle';
import { ParticipantImplementation } from './Participant';
import { RaffleStateContainer } from './States';
import "../scss/styles.scss";
import { PriceImplementation } from './Price';

// Define the parseCSV function
function parseCSV() {
    const csvTextArea = document.getElementById('csvTextArea') as HTMLTextAreaElement;
    const csvData = csvTextArea.value.trim();

    const rows = csvData.split('\n');
    const headers = rows[0].split(';');

    let tableHTML = '<table border="1"><thead><tr>';
    headers.forEach(header => {
        tableHTML += `<th>${header}</th>`;
    });
    tableHTML += '</tr></thead><tbody>';

    for (let i = 1; i < rows.length; i++) {
        const values = rows[i].split(';');
        tableHTML += '<tr>';
        values.forEach(value => {
            tableHTML += `<td>${value}</td>`;
        });
        tableHTML += '</tr>';
    }

    tableHTML += '</tbody></table>';

    const outputDiv = document.getElementById('output');
    if (outputDiv) {
        outputDiv.innerHTML = tableHTML;
    } else {
        console.error("Output div not found!");
    }
}

// Initiate raffle class
const raffle = new RaffleImplementation("New", false, false);
const participant = new ParticipantImplementation("Jan", "Pfillip", "jan@Pfillip.de", true);
const price = new PriceImplementation("BLalbla Pricetext", true);
raffle.addParticipant(participant);
console.log(raffle.getParticipantList());

// Create an instance of the state container
const raffleStateContainer = new RaffleStateContainer({
    name: "Name",
    includeNewsletterParticipants: false,
    numberOfParticipants: null,
    hasPrizes: false,
    participants: [participant],
    prices: [price],
    winners: [],
});

// Example of setting includeNewsletterParticipants
raffleStateContainer.setIncludeNewsletterParticipants(true);
console.log(raffleStateContainer.getState());

// Add a click event listener to a button or any other element
document.addEventListener('DOMContentLoaded', function() {
    const parseButton = document.getElementById('parseButton');
    if (parseButton) {
        parseButton.addEventListener('click', parseCSV);
    } else {
        console.error("Parse button not found!");
    }
});

