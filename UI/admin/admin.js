import {authService} from "../services/authService.js";

const user = authService.getUserToken();
if(!user) {
    window.location.href = "../signin/sign-in.html";
}
if (user && !user.is_admin) {
    window.location.href = "../home/home.html";
}


const logout = () => {
    const loggedOut = authService.logout();
    if(loggedOut) {
        return window.location.href = "../signin/sign-in.html";
    }
}


document.getElementById("logout").addEventListener("click", logout);

let userEmail = JSON.parse(localStorage.getItem("user"));
document.getElementById("small").innerHTML = userEmail.email;