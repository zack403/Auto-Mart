import {apiUrl} from "../config.js";
import {fetchService} from "./fetchService.js";
import {authService} from "./authService.js";


export class carService {

    static async postCar(formData) {
        let url = apiUrl("car");
        const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Authorization': authService.getUserToken(),
           },
           body: formData
        });
        return response.json();
    }

    static async fetchCars() {
        let url = apiUrl("car");
        const response = await fetch(url, {
            headers: {
                'Authorization': authService.getUserToken(),
            }
        });
        return response.json();
    }

    static async getCar(id) {
        let url = apiUrl(`car/${id}`);
        const response = await fetch(url, {
            headers: {
                'Authorization': authService.getUserToken(),
            }
        });
        return response.json();
    }

    static async deleteCar(formData) {
        let url = apiUrl("car_id/car");
        const response = await fetch(url, fetchService("DELETE", formData));
        return response.json();
    }
}