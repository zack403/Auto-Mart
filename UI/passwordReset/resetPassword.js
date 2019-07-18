import {authService} from "../services/authService.js";


let errorAlert = document.getElementById("alert-danger");
let spinner = document.querySelector(".spinner");
let alertSuc =  document.getElementById("alert-success");


errorAlert.style.display = "none";
alertSuc.style.display = "none";
spinner.style.display = "none";

const domDo = () => {
    errorAlert.style.display = "none";
    alertSuc.style.display = "none";
    errorAlert.innerHTML = "";
    alertSuc.innerHTML = "";
}

const resetPassword = async () => {
    domDo();
    spinner.style.display = "block";
    let password = document.getElementById("newPassword").value;
    let confirm_password = document.getElementById("confirmPassword").value;
    let email = document.getElementById("email").value;

    const formData = {
        email,
        password,
        confirm_password
    }
    try {
        const result = await authService.resetPassword(email, formData);
        console.log(result);
        const {error, data} = result;
        if(data) {
            spinner.style.display = "none";
            alertSuc.style.display = "block";
            alertSuc.innerHTML = `${data} Click <a href="../signin/sign-in.html">Login</a> to sign in.`;

            return 
        }
        else if(error){
            spinner.style.display = "none";
            errorAlert.style.display = "block";
            errorAlert.innerHTML = error;
        }
    } catch (error) {
        spinner.style.display = "none";
        errorAlert.style.display = "block";
        errorAlert.innerHTML = error.message;
    }
}

document.getElementById("resetP").addEventListener("click", resetPassword)