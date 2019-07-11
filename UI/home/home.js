import {carService} from "../services/carService.js";
import {authService} from "../services/authService.js";

const user = authService.getUserToken();
if(user && !user.is_admin) {
    document.getElementById("admin").style.display = "none"
}

document.getElementById("alert-danger").style.display = "none";
document.getElementById("alert-info").style.display = "none";


const fetchCars = async () => {
    try {
    const response = await carService.fetchCars();
    console.log(response);
    workWithResponse(response);
    } catch (error) {
        document.querySelector('.spinner').style.display = 'none';
        document.getElementById("alert-danger").style.display = "block";
        return document.getElementById("alert-danger").innerHTML = error;
    }   
}
fetchCars();


const workWithResponse = res => {
    const {data, error} = res;
    if(data) {
        if(data === "No record found") {
            document.querySelector(".spinner").style.display = "none";
            document.getElementById("alert-info").style.display = "block";
            return document.getElementById("alert-info").innerHTML = "<h5>No featured adverts yet...</h5>";
        }
        for(const car of data) {
            const {id, car_image_url, manufacturer, state, status, price} = car;
            document.querySelector(".spinner").style.display = "none";
            //create necessary element for the UI
            const div1 = document.createElement('div');
            const div2 = document.createElement('div');
            const div3 = document.createElement('div');
            const a = document.createElement('a');
            const img = document.createElement('img');
            const h5 = document.createElement('h5');
            const p1 = document.createElement('p');
            const p2 = document.createElement('div');
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
            //append element to the UI
            document.getElementById("cardDeck").append(div1);
            div1.append(a);
            a.append(img);
            div1.append(div2);
            div2.append(h5);
            div2.append(p1);
            div1.append(div3);
            div3.append(p2);
            //bind values to the element
            img.src = car_image_url;
            h5.innerHTML = `${manufacturer} <small class="text-info">${state}<small>`;
            p1.innerHTML = status;
            p2.innerHTML = `Price: &#8358;${price}`
            
            a.onclick = async () => {
               window.location.href = "../purchaseOrder/make-purchase.html?id="+id; 
            }
         }
         return;
    }
    else if(error) {
            document.querySelector(".spinner").style.display = "none";
            document.getElementById("alert-danger").style.display = "block";
            if(error === "Invalid token." || "Access denied. No token provided.") {
              window.location.href = "../signin/sign-in.html";
            }
            document.getElementById("alert-danger").innerHTML = error;
            return;
    }
};