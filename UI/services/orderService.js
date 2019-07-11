import {apiUrl} from "../config.js";
import {fetchService} from "./fetchService.js";


export class OrderService {
    static async createPurchaseOrder(formData) {
        let url = apiUrl("order");
        const response = await fetch(url, fetchService("POST", formData));
        return response.json();
    }
}