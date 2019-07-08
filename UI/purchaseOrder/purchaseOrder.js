import {carService} from "../services/carService.js";

    let url_string = window.location.href;
    let url = new URL(url_string);
    let id = url.searchParams.get("id");

    const getCarDetails = async (id) => {
        try {
            const response = await carService.getCar(id);
            return response;
            } catch (error) {
                return error;
        } 
    }


    // const reportAD = () => {

    // }

    const disPlayCar = async () => {
            const res =  await getCarDetails(id);
            console.log(res);

            const div1 = document.createElement('div');
            const img = document.createElement('img');
            const h3 = document.createElement('h3');
            const h2 = document.createElement('h2');
            const p1 = document.createElement('p');

            //give each element the needed class attribute
            div1.className = "card";
            img.id = "img";
            img.alt = "Card image cap";
            img.className = "card-img-top";
            p1.className = "text-muted";

            document.getElementById("colMdSix").prepend(div1);
            div1.append(img);
            document.querySelector(".card-body").prepend(h3);
            document.getElementById("list").prepend(p1);
            document.querySelector(".card-footer").append(h2);

            //bind values to the element
            img.src = res.car_image_url;
            h3.innerHTML = `${res.manufacturer} <br> Model: ${res.model}`;
            p1.innerHTML = `> ${res.body_type}`;
            h2.innerHTML = `&#8358;${res.price}`;
    }
    disPlayCar();


