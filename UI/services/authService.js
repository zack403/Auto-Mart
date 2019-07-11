import {apiUrl} from "../config.js";

export class authService {

    static async login(formData) {
        let url = apiUrl("auth/signin");
        const response = await fetch(url, authFetchService("POST", formData));
        return response.json();
    }

    static async register(formData) {
        let url = apiUrl("auth/signup");
        const response = await fetch(url, authFetchService("POST", formData));
        return response.json();
    }

    static getUserToken() {
        const user = JSON.parse(localStorage.getItem("user"));
        if(user){
            const token = user.token;
            return token;
        }
        
    }

    static removeUserToken() {
        const user = localStorage.getItem("user");
        if(user) return localStorage.removeItem("user");
    }

    static logout() {
        localStorage.removeItem("user");
        return true;
    }
}

     const authFetchService = (method, body) => {
        return {
         method,
         mode: 'cors',
         headers: {
            'Accept': 'application/json',
             'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
  }
}
