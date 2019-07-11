import {apiUrl} from "../config.js";
import {fetchService} from "./fetchService.js";
import {authService} from "./authService.js";


export class ReportAdService {
    static async reportAD(formData) {
        let url = apiUrl("flag");
        const response = await fetch(url, fetchService("POST", formData));
        return response.json();
    }

    static async fetchAllReportedAds() {
        let url = apiUrl('flag');
        const response = await fetch(url, {
            headers: {
                'Authorization': authService.getUserToken(),
            }
        });
        return response.json();
    }

    static async getReportAD(id) {
        let url = apiUrl(`flag/${id}`);
        const response = await fetch(url, {
            headers: {
                'Authorization': authService.getUserToken(),
            }
        });
        return response.json();
    }
}