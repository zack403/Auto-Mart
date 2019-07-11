import {authService} from "../services/authService.js";

const user = authService.getUserToken();
if(!user) {
    window.location.href = "../signin/sign-in.html"
}