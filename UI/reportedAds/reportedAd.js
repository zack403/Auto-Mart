import {authService} from "../services/authService.js";
import {ReportAdService} from "../services/reportAdService.js";


let errorAlert = document.getElementById("alert-danger");
let spinner = document.querySelector(".spinner");
let alertInfo =  document.getElementById("alert-info");

const user = authService.getUserToken();
if(!user) {
    window.location.href = "../signin/sign-in.html"
}

errorAlert.style.display = "none";
alertInfo.style.display = "none";

const logout = () => {
    const loggedOut = authService.logout();
    if(loggedOut) {
        return window.location.href = "../signin/sign-in.html";
    }
}
document.getElementById("logout").addEventListener("click", logout)

const fetchReportedAds = async () => {
    let user = JSON.parse(localStorage.getItem("user"));
    document.getElementById("small").innerHTML = user.email;
    try {
    const response = await ReportAdService.fetchAllReportedAds();
    console.log(response);
    workWithResponse(response);
    } catch (error) {
        spinner.style.display = 'none';
        errorAlert.style.display = "block";
        return errorAlert.innerHTML = error;
    }   
}
fetchReportedAds();

const workWithResponse = res => {
    const {data, error} = res;
    if(data) {
        if(data === "No record found") {
            spinner.style.display = "none";
            alertInfo.style.display = "block";
            return alertInfo.innerHTML = "<h5>No Reported Ads yet...</h5>";
        }
        for(const flag of data) {
            const {description, manufacturer, price, car_image_url, reason } = flag;
            spinner.style.display = "none";
            //create necessary element for the UI
            const div1 = document.createElement('div');
            const div2 = document.createElement('div');
            const div3 = document.createElement('div');
            const img = document.createElement('img');
            const h5 = document.createElement('h5');
            const h6 = document.createElement('h6');
            const p1 = document.createElement('p');
            const p2 = document.createElement('p');
            const p3 = document.createElement('p');

            div1.className = "card mr-3 mb-3";
            img.className = "card-img-top";
            img.alt = "Card image cap";
            // img.height = "200";
            // img.width = "500";
            div2.className = "card-body";
            h5.className = "card-title";
            p1.className = "card-text text-right badge badge-warning";
            h6.className ="card-text";
            p2.className = "badge badge-danger";
            div3.className = "card-footer";
            p3.className = "text-primary";

            document.getElementById("adRpt").append(div1);
            div1.append(img);
            div1.append(div2);
            div2.append(h5);
            div2.append(p1);
            div2.append(h6);
            div2.append(p2);
            div1.append(div3);
            div3.append(p3);

            //bind values to the element
            img.src = car_image_url;
            h5.innerHTML = manufacturer;
            p1.innerHTML = `Reported ${reason}`;
            h6.innerHTML = description;
            p2.innerHTML = reason;
            p3.innerHTML = price;
            
            
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