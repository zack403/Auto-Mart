import {apiUrl} from "../config.js";
import {authService} from "./authService.js";
import {fetchService} from "./fetchService.js";



export class MyPoService {
    static async fetchMyPos(id) {
        let url = apiUrl(`order/${id}`);
        const response = await fetch(url, {
            headers: {
                'Authorization': authService.getUserToken(),
            }
        });
        return response.json();
    }

    static async UpdatePoStatus(orderID, formData) {
        let url = apiUrl(`order/${orderID}/status`);
        const response = await fetch(url, fetchService("PATCH", formData));
        return response.json();
    }

    static async UpdatePoPrice(formData, orderID) {
        let url = apiUrl(`order/${orderID}/price`);
        const response = await fetch(url, fetchService("PATCH", formData));
        return response.json();
    }
}