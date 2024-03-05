"use strict";
(() => {
  // src/scripts/main.ts
  var ApiClient = class {
    apiUrl;
    constructor(apiUrl) {
      this.apiUrl = apiUrl;
    }
    async get(endpoint) {
      try {
        const response = await fetch(this.apiUrl + endpoint);
        if (response.ok) {
          return await response.json();
        } else {
          throw new Error("GET request failed");
        }
      } catch (error) {
        throw new Error("GET request error: " + error);
      }
    }
    async post(endpoint, contentType = "application/json", data) {
      try {
        const response = await fetch(this.apiUrl + endpoint, {
          method: "POST",
          headers: {
            "Content-Type": contentType
          },
          body: JSON.stringify(data)
        });
        if (response.ok) {
          return await response.json();
        } else {
          throw new Error("POST request failed");
        }
      } catch (error) {
        throw new Error("POST request error: " + error);
      }
    }
    async put(endpoint, contentType = "application/json", data) {
      try {
        const response = await fetch(this.apiUrl + endpoint, {
          method: "PUT",
          headers: {
            "Content-Type": contentType
          },
          body: JSON.stringify(data)
        });
        if (response.ok) {
          return await response.json();
        } else {
          throw new Error("PUT request failed");
        }
      } catch (error) {
        throw new Error("PUT request error: " + error);
      }
    }
    async delete(endpoint, data) {
      try {
        const response = await fetch(this.apiUrl + endpoint, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });
        if (response.ok) {
          return await response.json();
        } else {
          throw new Error("PUT request failed");
        }
      } catch (error) {
        throw new Error("PUT request error: " + error);
      }
    }
  };
  var ClickListener = class {
    apiClient;
    constructor() {
      this.apiClient = new ApiClient("http://127.0.0.1:8080/api/v1/");
      this.addClickListeners();
    }
    addClickListeners() {
      const links = document.querySelectorAll("a");
      links.forEach((link) => {
        link.addEventListener("click", this.linkClickHandler.bind(this));
      });
      const buttons = document.querySelectorAll("button");
      buttons.forEach((button) => {
        button.addEventListener("click", this.buttonClickHandler.bind(this));
      });
    }
    async linkClickHandler(event) {
      event.preventDefault();
      const link = event.target;
      console.log(`Clicked on link: ${link.href}`);
      try {
        const responseData = await this.apiClient.get(link.href);
        console.log("GET response:", responseData);
      } catch (error) {
        console.error(error);
      }
    }
    async buttonClickHandler(event) {
      const button = event.target;
      console.log(`Clicked on button: ${button.textContent}`);
      try {
        const responseData = await this.apiClient.post("/endpoint", "application/json", { data: button.textContent });
        console.log("POST response:", responseData);
      } catch (error) {
        console.error(error);
      }
    }
    // Add methods for PUT and DELETE as needed
  };
  document.addEventListener("DOMContentLoaded", () => {
    new ClickListener();
  });
})();
