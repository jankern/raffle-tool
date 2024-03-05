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

class ApiClient {
    private apiUrl: string;

    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
    }

    async get(endpoint: string) {
        try {
            const response = await fetch(this.apiUrl + endpoint);
            if (response.ok) {
                return await response.json();
            } else {
                throw new Error('GET request failed');
            }
        } catch (error) {
            throw new Error('GET request error: ' + error);
        }
    }

    async post(endpoint: string, contentType: string = 'application/json', data: any) {
        try {
            const response = await fetch(this.apiUrl + endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': contentType,
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                return await response.json();
            } else {
                throw new Error('POST request failed');
            }
        } catch (error) {
            throw new Error('POST request error: ' + error);
        }
    }

    async put(endpoint: string, contentType: string = 'application/json', data: any) {
        try {
            const response = await fetch(this.apiUrl + endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': contentType,
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                return await response.json();
            } else {
                throw new Error('PUT request failed');
            }
        } catch (error) {
            throw new Error('PUT request error: ' + error);
        }
    }

    async delete(endpoint: string, data: any) {
        try {
            const response = await fetch(this.apiUrl + endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                return await response.json();
            } else {
                throw new Error('PUT request failed');
            }
        } catch (error) {
            throw new Error('PUT request error: ' + error);
        }
    }
}

class ClickListener {
    private apiClient: ApiClient;

    constructor() {
        this.apiClient = new ApiClient('http://127.0.0.1:8080/api/v1/');
        this.addClickListeners();
    }

    private addClickListeners() {
        const links = document.querySelectorAll('a');
        links.forEach((link) => {
            link.addEventListener('click', this.linkClickHandler.bind(this));
        });

        const buttons = document.querySelectorAll('button');
        buttons.forEach((button) => {
            button.addEventListener('click', this.buttonClickHandler.bind(this));
        });
    }

    private async linkClickHandler(event: Event) {
        event.preventDefault();
        const link = event.target as HTMLAnchorElement;
        console.log(`Clicked on link: ${link.href}`);
        try {
            const responseData = await this.apiClient.get(link.href);
            console.log('GET response:', responseData);
        } catch (error) {
            console.error(error);
        }
    }

    private async buttonClickHandler(event: Event) {
        const button = event.target as HTMLButtonElement;
        console.log(`Clicked on button: ${button.textContent}`);
        try {
            const responseData = await this.apiClient.post('/endpoint', 'application/json', { data: button.textContent });
            console.log('POST response:', responseData);
        } catch (error) {
            console.error(error);
        }
    }

    // Add methods for PUT and DELETE as needed
}

document.addEventListener('DOMContentLoaded', () => {
    new ClickListener();
});
