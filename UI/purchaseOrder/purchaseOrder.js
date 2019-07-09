import {carService} from "../services/carService.js";
import {ReportAdService} from "../services/reportAdService.js";

    let url_string = window.location.href;
    let url = new URL(url_string);
    let id = url.searchParams.get("id");
    let reported = false;

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
    if (reported){
        reportBtn.style.color = "red";
        reportBtn.onclick = null;
        reportBtn.style.cursor = "none";
        reportBtn.innerHTML = "REPORTED STOLEN";
    }

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
            console.log(res);
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
                h3.innerHTML = `${res.manufacturer} ${res.model} ${res.body_type}`;
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
            console.log(response);
            if(response.id){
                reported = true;
                successAlert.style.display = 'block';
                successAlert.innerHTML = response.message;
                location.reload();
            }
            } catch (error) {
                errorAlert.style.display = 'block';
                errorAlert.innerHTML = error;
        } 
    }
    document.getElementById("rptBtn").addEventListener("click", reportAD);



