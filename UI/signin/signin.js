import { authService } from '../services/authService.js';

const hideFields = () => {
    document.querySelector('.spinner').style.display = 'none';
    document.getElementById('alert-danger').style.display = 'none';
    document.getElementById('alert-success').style.display = 'none';
    const user = localStorage.getItem("user");
    if(user) localStorage.removeItem("user");
}
hideFields();

const hideOrShowField = () => {
    document.querySelector('.spinner').style.display = 'block';
    document.getElementById('alert-danger').style.display = 'none';
    document.getElementById('alert-success').style.display = 'none';
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
        document.getElementById('alert-danger').style.display = 'block';
        document.getElementById('alert-danger').innerHTML = error; 
        document.querySelector('.spinner').style.display = 'none';
    }   
}

    // fire a click event when the login button is clicked
    document.getElementById("login").addEventListener("click", login);

   // work with server response here...
const workWithResponse = res => {
    const {data, error} = res;
    document.querySelector('.spinner').style.display = 'none';
    if(data) {
        localStorage.setItem("user", JSON.stringify(data));
        document.getElementById('alert-success').style.display = 'block';
        document.getElementById('alert-success').innerHTML = "Login Successful, Redirecting...";
        window.location.href = "../home/home.html";
        return;
    }
    else if(error) {
        document.getElementById('alert-danger').style.display = 'block';
        document.getElementById('alert-danger').innerHTML = error;        
        return;
    }
};