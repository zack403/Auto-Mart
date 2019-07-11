import {authService} from "./UI/services/authService.js";

const user = authService.getUserToken();
if (user) {
    document.getElementById("login").style.display = "none";
    document.getElementById("register").style.display = "none";
    document.getElementById("home").style.display = "block";

}