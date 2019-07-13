import {apiUrl} from "../config.js";
import {authService} from "./authService.js";
import {fetchService} from "./fetchService.js";



export class MyAdService {
    static async fetchMyAds(id) {
        let url = apiUrl(`car/myad/${id}`);
        const response = await fetch(url, {
            headers: {
                'Authorization': authService.getUserToken(),
            }
        });
        return response.json();
    }

    static async UpdateAdStatus(carID) {
        let url = apiUrl(`car/${carID}/status`);
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
              'Authorization': authService.getUserToken(),
           }
        });
        return response.json();
    }

    static async UpdateAdPrice(formData, carID) {
        let url = apiUrl(`car/${carID}/price`);
        const response = await fetch(url, fetchService("PATCH", formData));
        return response.json();
    }
}