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

const hideOrShowField = () => {
    spinner.style.display = 'block';
    errorAlert.style.display = 'none';
    successAlert.style.display = 'none';
}

const register = async () => {
    hideOrShowField();
    let first_name = document.getElementById('first_name').value;
    let last_name = document.getElementById('last_name').value;
    let email = document.getElementById('email').value;
    let address = document.getElementById('address').value;
    let password = document.getElementById('password').value;
    let confirm_password = document.getElementById('confirm_password').value;

    const formData = {
        first_name,
        last_name,
        email,
        address,
        password,
        confirm_password
    }
    try {
    const response = await authService.register(formData);
    workWithResponse(response);
    } catch (error) {
        errorAlert.style.display = 'block';
        errorAlert.innerHTML = error; 
        spinner.style.display = 'none';
    }   
}

     // fire a click event when the register button is clicked
     document.getElementById("register").addEventListener("click", register);

const workWithResponse = res => {
    const {data, error} = res;
    spinner.style.display = 'none';
    if(data) {
        successAlert.style.display = 'block';
        successAlert.innerHTML = `${data.message} Click <a href="../signin/sign-in.html">Login</a> to sign in.`;
        return;
    }
    else if(error) {
        errorAlert.style.display = 'block';
        errorAlert.innerHTML = error;        
        return;
    }
};