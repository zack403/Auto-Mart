import {authService} from "../services/authService.js";
import {carService} from "../services/carService.js";

const user = authService.getUserToken();
if(!user) {
    window.location.href = "../signin/sign-in.html"
}

let errorAlert = document.getElementById("alert-danger");
let spinner = document.querySelector(".spinner");
let alertInfo =  document.getElementById("alert-info");

errorAlert.style.display = "none";
alertInfo.style.display = "none";
document.getElementById("showing").style.display = "none";

const logout = () => {
    const loggedOut = authService.logout();
    if(loggedOut) {
        return window.location.href = "../signin/sign-in.html";
    }
}
document.getElementById("logout").addEventListener("click", logout);

const fetchAllUnsoldCars = async () => {
    try {
    const response = await carService.fetchAllUnsoldCars();
    console.log(response);
    workWithResponse(response);
    } catch (error) {
        spinner.style.display = 'none';
        errorAlert.style.display = "block";
        return errorAlert.innerHTML = error;
    }   
}
fetchAllUnsoldCars();

const workWithResponse = res => {
    const {error} = res;
    if(error !== undefined && error === "Invalid token." || error === "Access denied. No token provided.") {
       return window.location.href = "../signin/sign-in.html";
      }
    if(res) {
        if(res.length <= 0 || res.error != undefined) {
            spinner.style.display = "none";
            alertInfo.style.display = "block";
            return alertInfo.innerHTML = "<h5>No Record found</h5>";
        }
        for(const car of res) {
            const {id, car_image_url, manufacturer, state, status, price} = car;
            spinner.style.display = "none";
            document.getElementById("showing").style.display = "block";

            //create necessary element for the UI
            const div1 = document.createElement('div');
            const div2 = document.createElement('div');
            const div3 = document.createElement('div');
            const img = document.createElement('img');
            const h5 = document.createElement('h5');
            // const h6 = document.createElement('h6');
            const p1 = document.createElement('p');
            const p2 = document.createElement('p');
            const p3 = document.createElement('p');
            const a = document.createElement("a");
            const b = document.createElement("button");

            div1.className = "card mr-3 mb-3";
            img.className = "card-img-top";
            img.alt = "Card image cap";
            // img.height = "200";
            // img.width = "500";
            div2.className = "card-body";
            h5.className = "card-title";
            p1.className = "card-text text-right badge badge-warning";
            // h6.className ="card-text";
            p2.className = "badge badge-danger";
            div3.className = "card-footer";
            p3.className = "text-primary";
            b.className = "btn btn-primary";

            document.getElementById("adRpt").append(div1);
            div1.append(img);
            div1.append(div2);
            div2.append(h5);
            div2.append(p1);
            // div2.append(h6);
            div2.append(p2);
            div1.append(div3);
            div3.append(p3);
            a.append(b);
            div3.append(a);

            //bind values to the element
            img.src = car_image_url;
            h5.innerHTML = `${manufacturer} <small class="text-info">${state}<small>`;;
            p1.innerHTML = status;
            // h6.innerHTML = state;
            p3.innerHTML = `Price: &#8358;${price}`;
            b.innerHTML = "BUY"
            

            a.onclick = async () => {
                window.location.href = "../purchaseOrder/make-purchase.html?id="+id; 
             }
            
         }
         return;
    }
    else if(error) {
            spinner.style.display = "none";
            errorAlert.style.display = "block";
            errorAlert.innerHTML = error;
            return;
    }
};

const applyFilters = async () => {
    spinner.style.display = 'block';
    alertInfo.style.display = "none";
    alertInfo.innerHTML = "";
    errorAlert.style.display = "none";
    errorAlert.innerHTML = "";
    
    let div = document.getElementById('adRpt');
    while(div.firstChild){
    div.removeChild(div.firstChild);
    }
    document.getElementById("showing").style.display = "none";

    let state = document.getElementById("car-state").value;
    let minPrice = document.getElementById("min_price").value;
    let maxPrice = document.getElementById("max_price").value;
    let manufacturer = document.getElementById("make").value;

    try {
        const response = await carService.fetchCarsByFilter(state, minPrice, maxPrice, manufacturer);
        console.log(response);
        workWithResponse(response);
        } catch (error) {
            spinner.style.display = 'none';
            errorAlert.style.display = "block";
            return errorAlert.innerHTML = error;
        }  
}

document.getElementById("filters").addEventListener("click", applyFilters)