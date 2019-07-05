import {carService} from "../services/carService.js";

const hideFields = () => {
    document.querySelector('.spinner').style.display = 'none';
    document.getElementById('alert-danger').style.display = 'none';
    document.getElementById('alert-success').style.display = 'none';
}
hideFields();

const hideOrShowField = () => {
    document.querySelector('.spinner').style.display = 'block';
    document.getElementById('alert-danger').style.display = 'none';
    document.getElementById('alert-success').style.display = 'none';
}
let image;
const postAd = async () => {

    hideOrShowField();
    let state = document.getElementById('car_state').value;
    let price = document.getElementById('price').value;
    let manufacturer = document.getElementById('manufacturer').value;
    let model = document.getElementById('model').value;
    let body_type = document.getElementById('body_type').value;
    let seller_name = document.getElementById('seller_name').value;
    let phone_no = document.getElementById('phone_no').value;

    const formData = new FormData();
    formData.append('image', image);
    formData.append('seller_name', seller_name);
    formData.append('state', state);
    formData.append('price', price);
    formData.append('manufacturer', manufacturer);
    formData.append('model', model);
    formData.append('body_type', body_type);
    formData.append('phone_no', phone_no);

    try {
    const response = await carService.postCar(formData);
    console.log(response);
    workWithResponse(response);
    } catch (error) {
        document.getElementById('alert-danger').style.display = 'block';
        document.getElementById('alert-danger').innerHTML = error; 
        document.querySelector('.spinner').style.display = 'none';
    }   
}


const handleImageChange = event => {
    const files = event.target.files;
    image = files[0];
    const imageType = /image.*/
    if (!image.type.match(imageType)) {
      alert('Sorry, only images are allowed')
      return
    }
  
    if (image.size > (100*1024)) {
      alert('Sorry, the max allowed size for images is 100KB')
      return
    }
}
     // fire a click event when the register button is clicked
     document.getElementById("submitAd").addEventListener("click", postAd);
     document.getElementById("image").addEventListener("change", event => {
        handleImageChange(event);
     } );


const workWithResponse = res => {
    const {data, error} = res;
    document.querySelector('.spinner').style.display = 'none';
    if(data) {
        document.getElementById('alert-success').style.display = 'block';
        document.getElementById('alert-success').innerHTML = data.message;
        return;
    }
    else if(error) {
        document.getElementById('alert-danger').style.display = 'block';
        document.getElementById('alert-danger').innerHTML = error;        
        return;
    }
};