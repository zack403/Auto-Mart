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

    static async fetchCarsByMake(manufacturer) {
        let url = apiUrl(`car?status=Available&manufacturer=${manufacturer}`);
        const response = await fetch(url, {
            headers: {
                'Authorization': authService.getUserToken(),
            }
        });
        return response.json();
    }

    static async fetchAllUnsoldCars() {
        let url = apiUrl(`car?status=Available`);
        const response = await fetch(url, {
            headers: {
                'Authorization': authService.getUserToken(),
            }
        });
        return response.json();
    }

    static async fetchCarsByFilter(state, minPrice, maxPrice, manufacturer) {
        let url = apiUrl(`car?status=Available&state=${state}&min_price=${minPrice}&max_price=${maxPrice}&manufacturer=${manufacturer}`);
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

    static async deleteCar(id) {
        let url = apiUrl(`/car/${id}`);
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                'Authorization': authService.getUserToken()
            }
        });
        return response.json();
    }
}
