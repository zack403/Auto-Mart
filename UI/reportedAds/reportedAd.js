import {authService} from "../services/authService.js";
import {ReportAdService} from "../services/reportAdService.js";


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

const fetchReportedAds = async () => {
    try {
    const response = await ReportAdService.fetchAllReportedAds();
    return console.log(response);
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
            return alertInfo.innerHTML = "<h5>No featured adverts yet...</h5>";
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
            spinner.style.display = "none";
            errorAlert.style.display = "block";
            if(error === "Invalid token." || "Access denied. No token provided.") {
              window.location.href = "../signin/sign-in.html";
            }
            errorAlert.innerHTML = error;
            return;
    }
};