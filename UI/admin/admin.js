import {authService} from "../services/authService.js";

const user = authService.getUserToken();
if(!user) {
    window.location.href = "../signin/sign-in.html"
}

const logout = () => {
    const loggedOut = authService.logout();
    if(loggedOut) {
        return window.location.href = "../signin/sign-in.html";
    }
}


document.getElementById("logout").addEventListener("click", logout)