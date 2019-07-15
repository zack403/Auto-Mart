import {carService} from "../services/carService.js";
import {authService} from "../services/authService.js";

let errorAlert = document.getElementById("alert-danger");
let successAlert = document.getElementById("alert-success");
let spinner = document.querySelector(".spinner");

const hideFields = () => {
    spinner.style.display = 'none';
    errorAlert.style.display = 'none';
    successAlert.style.display = 'none';
}
hideFields();

const logout = () => {
    const loggedOut = authService.logout();
    if(loggedOut) {
        return window.location.href = "../signin/sign-in.html";
    }
}
document.getElementById("logout").addEventListener("click", logout)

const hideOrShowField = () => {
    spinner.style.display = 'block';
    errorAlert.style.display = 'none';
    successAlert.style.display = 'none';
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
    workWithResponse(response);
    } catch (error) {
        errorAlert.style.display = 'block';
        errorAlert.innerHTML = error; 
        spinner.style.display = 'none';
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
    spinner.style.display = 'none';
    if(data) {
        successAlert.style.display = 'block';
        successAlert.innerHTML = data.message;
        return;
    }
    else if(error) {
        errorAlert.style.display = 'block';
        errorAlert.innerHTML = error;        
        return;
    }
};