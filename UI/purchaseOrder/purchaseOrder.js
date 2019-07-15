import {carService} from "../services/carService.js";
import {ReportAdService} from "../services/reportAdService.js";
import {OrderService} from "../services/orderService.js";


const logout = () => {
    const loggedOut = authService.logout();
    if(loggedOut) {
        return window.location.href = "../signin/sign-in.html";
    }
}
document.getElementById("logout").addEventListener("click", logout)



    let url_string = window.location.href;
    let url = new URL(url_string);
    let id = url.searchParams.get("id");
    document.getElementById("alert").style.display = "none";

    let reportBtn = document.getElementById("report");
    let errorAlert = document.getElementById("alert-danger");
    let successAlert = document.getElementById("alert-success");
    let spinner = document.querySelector(".spinner");

    
    reportBtn.innerHTML = "REPORT THIS AD";
    // When the user clicks the button, open the modal 
    reportBtn.onclick = function() {
        errorAlert.style.display = 'none';
        successAlert.style.display = 'none';
        reportModal.style.display = "block";
    }

    const getReportedAd = async () => {
        let user = JSON.parse(localStorage.getItem("user"));
        document.getElementById("small").innerHTML = user.email;
        const res = await ReportAdService.getReportAD(id);
        if(res.id) {
            reportBtn.style.color = "red";
            reportBtn.onclick = null;
            reportBtn.style.cursor = "none";
            reportBtn.innerHTML = `REPORTED as "${res.reason}"`;
        }
        else if (res.error) {
            console.log(res.error);
        } 
        console.log(res);
    }
    getReportedAd();

    
    const getCarDetails = async (id) => {
        try {
            spinner.style.display = 'block';
            const response = await carService.getCar(id);
            return response;
            } catch (error) {
                return error;
        } 
    }

    const disPlayCar = async () => {
            const res =  await getCarDetails(id);
            if(res.id) {
                spinner.style.display = 'none';
                const div1 = document.createElement('div');
                const img = document.createElement('img');
                const h3 = document.createElement('h3');
                const h2 = document.createElement('h2');
    
                //give each element the needed class attribute
                div1.className = "card";
                img.id = "img";
                img.alt = "Card image cap";
                img.className = "card-img-top";
                h3.className = "text-center";
                h3.className = "upperCase"
    
                document.getElementById("colMdSix").prepend(div1);
                div1.append(img);
                document.querySelector(".card-body").prepend(h3);
                document.querySelector(".card-footer").append(h2);
    
                //bind values to the element
                img.src = res.car_image_url;
                document.getElementById("by").innerHTML = res.seller_name;
                document.getElementById("no").innerHTML = res.phone_no;
                document.getElementById("mode").innerHTML = res.model;
                document.getElementById("manufac").innerHTML = res.manufacturer;
                document.getElementById("type").innerHTML = res.body_type;
                h3.innerHTML = `${res.manufacturer}`;
                h2.innerHTML = `&#8358;${res.price}`;
            }
    }
    disPlayCar();

    const reportAD = async () => {
        
        let car_id = id;
        let reason = document.getElementById('reason').value;
        let description = document.getElementById('description').value;

        const formData = {
            car_id,
            reason,
            description,
        }

        try {
            const response = await ReportAdService.reportAD(formData);
            if(response.id){
                successAlert.style.display = 'block';
                successAlert.innerHTML = response.message;
                location.reload();
            }
            } catch (error) {
                errorAlert.style.display = 'block';
                errorAlert.innerHTML = error;
        } 
    }

    const purchaseOrder = async () => {
        spinner.style.display = "block";
        successAlert.innerHTML = "";
        errorAlert.innerHTML = "";
        let car_id = id;
        let amount = document.getElementById('price').value;
        let buyer_name = document.getElementById('fullname').value;
        let buyer_phone_no = document.getElementById('phone').value;


        const formData = {
            car_id,
            amount,
            buyer_name,
            buyer_phone_no
        }

        try {
            const response = await OrderService.createPurchaseOrder(formData);
            const {data, error} = response;
            if(data && data.id){
                spinner.style.display = "none";
                document.getElementById("alert").style.display = "block";
                errorAlert.style.display = "none";
                successAlert.style.display = 'block';
                successAlert.innerHTML = `${data.message}\n
                ${data.notify}`;
                //window.location.href = "../home/home.html";
            }
            else if (error) {
                spinner.style.display = "none";
                document.getElementById("alert").style.display = "block";
                successAlert.style.display = 'none';
                errorAlert.style.display = 'block';
                errorAlert.innerHTML = error;
            }  
        } catch (error) {
                spinner.style.display = "none";
                document.getElementById("alert").style.display = "block";
                successAlert.style.display = 'none';
                errorAlert.style.display = 'block';
                errorAlert.innerHTML = error;
        } 
    }

    document.getElementById("poBtn").addEventListener("click", purchaseOrder);
    document.getElementById("rptBtn").addEventListener("click", reportAD);


