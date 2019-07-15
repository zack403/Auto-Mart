import {authService} from "../services/authService.js";
import {MyPoService} from "../services/myPoService.js";

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

const fetchMyPos = async () => {
    let user = JSON.parse(localStorage.getItem("user"));
    document.getElementById("small").innerHTML = user.email;
    try {
    const response = await MyPoService.fetchMyPos(user.id);
    console.log(response);
    workWithResponse(response);
    } catch (error) {
        spinner.style.display = 'none';
        errorAlert.style.display = "block";
        return errorAlert.innerHTML = error;
    }   
}
fetchMyPos();

const workWithResponse = res => {
    const {data, error} = res;
    if(error !== undefined && error === "Invalid token." || error === "Access denied. No token provided.") {
       return window.location.href = "../signin/sign-in.html";
      }
    if(data) {
        if(data === "You have no Orders yet") {
            spinner.style.display = "none";
            alertInfo.style.display = "block";
            return alertInfo.innerHTML = "<h5>No Record found</h5>";
        }
        for(const order of data) {
            const {id, car_image_url, manufacturer, status, amount} = order;
            spinner.style.display = "none";

            //create necessary element for the UI
            const div1 = document.createElement('div');
            const div2 = document.createElement('div');
            const div3 = document.createElement('div');
            const div4 = document.createElement('div');
            const img = document.createElement('img');
            const h5 = document.createElement('h5');
            const h6 = document.createElement('h6');
            const input = document.createElement("input");
            // const h6 = document.createElement('h6');
            const p1 = document.createElement('p');
            const a = document.createElement("a");
            const b1 = document.createElement("button");
            const b2 = document.createElement("button");
            const b3 = document.createElement("button");

            div1.className = "card mr-3 mb-3";
            img.className = "card-img-top";
            img.alt = "Card image cap";
            // img.width = "347";
            // img.height = "260.24";
            div4.className = "row";
            input.type = "text";
            input.placeholder = "Enter New Price";
            input.className = "mr-2";
            input.id = "newPrice";
            h6.className = "badge badge-info";
            if(status === "Rejected") {
                h6.className = "badge badge-danger";
            }
            else if(status === "Accepted") {
                h6.className = "badge badge-success";
            }
            b1.className = "float-right btn btn-outline-danger";
            b2.className = "btn btn-success mr-2";
            b3.className = "btn btn-danger";
            img.height = "200";
            img.width = "500";
            div2.className = "card-body";
            h5.className = "card-title";
            p1.className = "text-primary";
            // h6.className ="card-text";
            div3.className = "card-footer";

            document.getElementById("mypo").append(div1);
            div1.append(img);
            div1.append(div2);
            div2.append(h5);
            div2.append(h6);
            div2.append(div4);
            div1.append(div3);
            div3.append(p1);
            if(status === "Pending") {
                div4.append(input);
                div4.append(b1);
                div3.append(b2);
                div3.append(b3);
            }
           
            //bind values to the element
            img.src = car_image_url;
            // h5.innerHTML = manufacturer;
            h5.innerHTML = "";
            h6.innerHTML = `Status: ${status}`;
            p1.innerHTML = `Amount: &#8358;${amount}`;
            if(status === "Pending") {
                b1.innerHTML = "UPDATE PRICE";
                b2.innerHTML = "UPDATE STATUS TO ACCEPTED";
                b3.innerHTML = "UPDATE STATUS TO REJECTED"
            }
    
            b1.onclick = async () => {
                spinner.style.display = "block";
                errorAlert.style.display = "none";
                errorAlert.innerHTML = "";
                let new_price = document.getElementById("newPrice").value;
                const formData = {
                    new_price
                }
                try {
                    const result = await MyPoService.UpdatePoPrice(formData, id);
                    let {data, error} = result;
                    if(data && data.id) {
                        spinner.style.display = "none";
                        alertSuc.style.display = "block";
                        alertSuc.innerHTML = "Price Successfully updated";
                        p1.innerHTML = `Amount: &#8358;${data.new_price_offered}`;
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
                let status = "Accepted";
                const formData = {
                    status
                }

                try {
                 const res = await MyPoService.UpdatePoStatus(id, formData );
                 const {data} = res;
                 if(data && data.id) {
                    spinner.style.display = "none";
                    alertSuc.style.display = "block";
                    alertSuc.innerHTML = data.message;
                    h6.className = "badge badge-success";
                    h6.innerHTML = `Status: ${data.status}`;
                    b3.style.display = "none";
                    b2.style.display = "none";
                    input.style.display = "none";
                    b1.style.display = "none";
                    return;
                 }
                } catch (error) {
                    spinner.style.display = "none";
                   errorAlert.style.display = "block";
                   errorAlert.innerHTML = error;
                   return;
               }
             }

             b3.onclick = async () => {
                spinner.style.display = "block";
                errorAlert.style.display = "none";
                errorAlert.innerHTML = "";

                let status = "Rejected";
                const formData = {
                    status
                }

                try {
                 const res = await MyPoService.UpdatePoStatus(id, formData);
                 const {data} = res;
                 if(data && data.id) {
                    spinner.style.display = "none";
                    alertSuc.style.display = "block";
                    alertSuc.innerHTML = data.message;
                    h6.className = "badge badge-danger";
                    h6.innerHTML = `Status: ${data.status}`;
                    b3.style.display = "none";
                    b2.style.display = "none";
                    input.style.display = "none";
                    b1.style.display = "none";
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
