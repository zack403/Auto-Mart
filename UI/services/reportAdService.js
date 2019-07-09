import {apiUrl} from "../config.js";
import {fetchService} from "./fetchService.js";


export class ReportAdService {
    static async reportAD(formData) {
        let url = apiUrl("flag");
        const response = await fetch(url, fetchService("POST", formData));
        return response.json();
    }
}