import {authService} from "./UI/services/authService.js";
import {carService} from "../UI/services/carService.js";

const user = authService.getUserToken();
if (user) {
    document.getElementById("login").style.display = "none";
    document.getElementById("register").style.display = "none";
    document.getElementById("home").style.display = "block";

}

const fetchCarsByMake = async () => {
    let searchValue = document.getElementById("searchValue").value;
    try {
    const response = await carService.fetchCarsByMake(searchValue);
    console.log(response);
    } catch (error) {
        document.querySelector('.spinner').style.display = 'none';
        document.getElementById("alert-danger").style.display = "block";
        return document.getElementById("alert-danger").innerHTML = error;
    }   
}
// document.getElementById("search").addEventListener("click", fetchCarsByMake);