import {authService} from "../services/authService.js";
import {carService} from "../services/carService.js";



let errorAlert = document.getElementById("alert-danger");
let spinner = document.querySelector(".spinner");
let alertInfo =  document.getElementById("alert-info");
let alertSuc =  document.getElementById("alert-success");


errorAlert.style.display = "none";
alertInfo.style.display = "none";
alertSuc.style.display = "none";


const logout = () => {
    const loggedOut = authService.logout();
    if(loggedOut) {
        return window.location.href = "../signin/sign-in.html";
    }
}
document.getElementById("logout").addEventListener("click", logout);

const fetchCars = async () => {
    let user = JSON.parse(localStorage.getItem("user"));
    document.getElementById("small").innerHTML = user.email;
    try {
    const response = await carService.fetchCars();
    workWithResponse(response);
    } catch (error) {
        spinner.style.display = 'none';
        errorAlert.style.display = "block";
        return errorAlert.innerHTML = error;
    }   
}
fetchCars();

const workWithResponse = res => {
    const {data, error} = res;
    if(data) {
        if(data === "No record found") {
            spinner.style.display = "none";
            alertInfo.style.display = "block";
            return alertInfo.innerHTML = "<h5>No Record found...</h5>";
        }
        for(const car of data) {
            const {id, car_image_url, manufacturer, state, status, price} = car;
            spinner.style.display = "none";
            //create necessary element for the UI
            const div1 = document.createElement('div');
            const div2 = document.createElement('div');
            const div3 = document.createElement('div');
            const a = document.createElement('a');
            const img = document.createElement('img');
            const h5 = document.createElement('h5');
            const p1 = document.createElement('p');
            const p2 = document.createElement('div');
            const b1 = document.createElement('button');
            //give each element the needed class attribute
            div1.className = "card";
            div2.className = "card-body"
            img.id = "img";
            img.height = "200";
            img.width = "500";
            img.className = "card-img-top";
            h5.className = "card-title";
            h5.className = "upperCase"
            p1.className = "card-text text-right badge badge-warning";
            div3.className = "card-footer";
            p2.className = "text-primary";
            b1.className = "btn btn-outline-danger";
            //append element to the UI
            document.getElementById("cardDeck").append(div1);
            div1.append(a);
            a.append(img);
            div1.append(div2);
            div2.append(h5);
            div2.append(p1);
            div1.append(div3);
            div3.append(p2);
            div3.append(b1);
            //bind values to the element
            img.src = car_image_url;
            h5.innerHTML = `${manufacturer} <small class="text-info">${state}<small>`;
            p1.innerHTML = status;
            p2.innerHTML = `Price: &#8358;${price}`;
            b1.innerHTML = "DELETE AD";

            b1.onclick = async () => {
                spinner.style.display = "block";
                errorAlert.style.display = "none";
                errorAlert.innerHTML = "";
                try {
                    const deleted = await carService.deleteCar(id);
                    alertSuc.style.display = "block";
                    alertSuc.innerHTML = deleted.data;
                    spinner.style.display = "none";
                    console.log(deleted);
                } catch (error) {
                    errorAlert.style.display = "block";
                    errorAlert.innerHTML = error;
                }
           
            }
            
         
         }
         return;
    }
    else if(error) {
            spinner.style.display = "none";
            errorAlert.style.display = "block";
            if(error === "Invalid token." || "Access denied. No token provided.") {
              window.location.href = "../signin/sign-in.html";
            }
            errorAlert.innerHTML = error;
            return;
    }
};
