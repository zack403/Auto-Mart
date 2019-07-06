import {carService} from "../services/carService.js";


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
        document.getElementById("alert-danger").innerHTML = error;
        console.log(error);
    }   
}

fetchCars();


const workWithResponse = res => {
    const {data, error} = res;
    if(data) {
        if(data.length === 0) {
            return document.getElementById("alert-info").innerHTML = "No featured adverts yet...";
        }
        for(const car of data) {
            document.querySelector(".spinner").style.display = "none";
            const div1 = document.createElement('div');
            const div2 = document.createElement('div');
            const div3 = document.createElement('div');
            const a = document.createElement('a');
            const img = document.createElement('img');
            const h5 = document.createElement('h5');
            const p1 = document.createElement('p');
            const p2 = document.createElement('div');

            div1.className = "card";
            a.href = "UI/make-purchase.html";
            div2.className = "card-body"
            img.id = "img";
            img.className = "card-img-top";
            h5.className = "card-title";
            p1.className = "card-text text-right badge badge-warning";
            div3.className = "card-footer";
            p2.className = "text-primary";

            document.getElementById("cardDeck").append(div1);
            div1.append(a);
            a.append(img);
            div1.append(div2);
            div2.append(h5);
            div2.append(p1);
            div1.append(div3);
            div3.append(p2);

            img.src = car.car_image_url;
            h5.innerHTML = `${car.manufacturer} <small class="text-info">${car.state}<small>`;
            p1.innerHTML = car.status;
            p2.innerHTML = `Price: &#8358;${car.price}`


        }
        return;
    }
    else if(error) {
            document.getElementById("alert-danger").style.display = "block";
            document.getElementById("alert-danger").innerHTML = error;
            return;
    }
};