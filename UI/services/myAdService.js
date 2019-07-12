import {apiUrl} from "../config.js";
import {authService} from "./authService.js";


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
}