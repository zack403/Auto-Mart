import {apiUrl} from "../config.js";
import {fetchService} from "./fetchService.js";

export class authService {

    async login(formData) {
        let url = apiUrl("auth/signin");
        const response = await fetch(url, fetchService("POST", formData));
        return response.json();
    }

    async register(formData) {
        let url = apiUrl("auth/signup");
        const response = await fetch(url, fetchService("POST", formData));
        return response.json();
    }
}