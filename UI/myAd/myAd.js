import {authService} from "../services/authService.js";
import {MyAdService} from "../services/myAdService.js";

const user = authService.getUserToken();
if(!user) {
    window.location.href = "../signin/sign-in.html"
}

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

const fetchMyAds = async () => {
    let user = authService.getUserInfo();
    document.getElementById("small").innerHTML = user.email;
    try {
    const response = await MyAdService.fetchMyAds(user.id);
    workWithResponse(response);
    } catch (error) {
        spinner.style.display = 'none';
        errorAlert.style.display = "block";
        return errorAlert.innerHTML = error;
    }   
}
fetchMyAds();

const workWithResponse = res => {
    const {data, error} = res;
    if(error !== undefined && error === "Invalid token." || error === "Access denied. No token provided.") {
       return window.location.href = "../signin/sign-in.html";
      }
    if(data) {
        if(data === "You have not Ads") {
            spinner.style.display = "none";
            alertInfo.style.display = "block";
            return alertInfo.innerHTML = "<h5>No Record found</h5>";
        }
        for(const car of data) {
            const {id, car_image_url, manufacturer, state, status, price} = car;
            spinner.style.display = "none";

            //create necessary element for the UI
            const div1 = document.createElement('div');
            const div2 = document.createElement('div');
            const div3 = document.createElement('div');
            const div4 = document.createElement('div');
            const img = document.createElement('img');
            const h5 = document.createElement('h5');
            const input = document.createElement("input");
            // const h6 = document.createElement('h6');
            const p1 = document.createElement('p');
            const a = document.createElement("a");
            const b1 = document.createElement("button");
            const b2 = document.createElement("button");


            div1.className = "card mr-3 mb-3";
            img.className = "card-img-top";
            img.alt = "Card image cap";
            img.width = "347";
            img.height = "260.24";
            div4.className = "row";
            input.type = "text";
            input.placeholder = "Enter New Price";
            input.className = "mr-2";
            input.id = "newPrice";
            b1.className = "float-right btn btn-outline-danger";
            b2.className = "btn btn-success"
            // img.height = "200";
            // img.width = "500";
            div2.className = "card-body";
            h5.className = "card-title";
            p1.className = "text-primary";
            // h6.className ="card-text";
            div3.className = "card-footer";

            document.getElementById("myad").append(div1);
            div1.append(img);
            div1.append(div2);
            div2.append(h5);
            div2.append(div4);
            div4.append(input);
            div4.append(b1)
            div1.append(div3);
            div3.append(p1);
            div3.append(b2);

            //bind values to the element
            img.src = car_image_url;
            h5.innerHTML = `${manufacturer} <small class="text-info">${state}<small>`;;
            // h6.innerHTML = state;
            p1.innerHTML = `Price: &#8358;${price}`;
            b1.innerHTML = "UPDATE PRICE";
            if(car.status === "Sold") {
                b2.className = "badge badge-warning";
                b2.onclick = null;
                b2.style.cursor = "none";
                b2.innerHTML = car.status;
            }
            else {
                b2.innerHTML = `MARK AS SOLD`;
            }

            b1.onclick = async () => {
                spinner.style.display = "block";
                errorAlert.style.display = "none";
                errorAlert.innerHTML = "";
                let price = document.getElementById("newPrice").value;
                const formData = {
                    price
                }
                try {
                    const result = await MyAdService.UpdateAdPrice(formData, id);
                    let {data, error} = result;
                    if(data && data.id) {
                        spinner.style.display = "none";
                        alertSuc.style.display = "block";
                        alertSuc.innerHTML = "Price Successfully updated";
                        return;
                    }
                    else if (error){
                        spinner.style.display = "none";
                        errorAlert.style.display = "block";
                        errorAlert.innerHTML = error;
                        return;
                    }
                } catch (error) {
                     spinner.style.display = "none";
                    errorAlert.style.display = "block";
                    errorAlert.innerHTML = error;
                    return;
                }
            }

            b2.onclick = async () => {
                spinner.style.display = "block";
                errorAlert.style.display = "none";
                errorAlert.innerHTML = "";
                try {
                 const res = await MyAdService.UpdateAdStatus(id);
                 if(res.data.id) {
                    spinner.style.display = "none";
                    alertSuc.style.display = "block";
                    alertSuc.innerHTML = "Successfully marked as sold";
                    b2.className = "badge badge-warning";
                    b2.onclick = null;
                    b2.style.cursor = "none";
                    b2.innerHTML = res.data.status;
                    return;
                 }
                } catch (error) {
                    spinner.style.display = "none";
                   errorAlert.style.display = "block";
                   errorAlert.innerHTML = error;
                   return;
               }
             }
            
         }
         return;
    }
    else if(error) {
            spinner.style.display = "none";
            alertInfo.style.display = "block";
            alertInfo.innerHTML = error;
            return;
    }
};
