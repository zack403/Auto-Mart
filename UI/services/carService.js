import {apiUrl} from "../config.js";
import {fetchService} from "./fetchService.js";

export class carService {

    async postCar(formData) {
        let url = apiUrl("car");
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user.token;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Authorization': token,
           },
           body: formData
        });
        return response.json();
    }

    async deleteCar(formData) {
        let url = apiUrl("car_id/car");
        const response = await fetch(url, fetchService("DELETE", formData));
        return response.json();
    }
}