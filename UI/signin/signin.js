import { authService } from '../services/authService.js';

let errorAlert = document.getElementById("alert-danger");
let successAlert = document.getElementById("alert-success");
let spinner = document.querySelector(".spinner");

const hideFields = () => {
    errorAlert.style.display = 'none';
    successAlert.style.display = 'none';
    spinner.style.display = 'none';
    authService.removeUserToken();
}
hideFields();

const hideOrShowField = () => {
    spinner.style.display = 'block';
    errorAlert.style.display = 'none';
    successAlert.style.display = 'none';
}

// method to login the user
const login = async () => {
    hideOrShowField();
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    const formData = {
        email,
        password
    }

    try {
        const response = await authService.login(formData);
        workWithResponse(response);
    } catch (error) {
        errorAlert.style.display = 'block';
        errorAlert.innerHTML = error; 
        spinner.style.display = 'none';
    }   
}

    // fire a click event when the login button is clicked
    document.getElementById("login").addEventListener("click", login);

   // work with server response here...
const workWithResponse = res => {
    const {data, error} = res;
    spinner.style.display = 'none';
    if(data) {
        localStorage.setItem("user", JSON.stringify(data));
        successAlert.style.display = 'block';
        successAlert.innerHTML = "Login Successful, Redirecting...";
        window.location.href = "../home/home.html";
        return;
    }
    else if(error) {
        errorAlert.style.display = 'block';
        errorAlert.innerHTML = error;        
        return;
    }
};