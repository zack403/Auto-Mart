const url = "http://localhost:3000/api/v1/auth/signup";

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
        const res = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type' : 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });
    const response = await res.json();
    workWithResponse(response);
    console.log(response);
    } catch (error) {
        console.log(error);
        document.querySelector('.spinner').style.display = 'none';
    }   
}

const workWithResponse = res => {
    const {data, error} = res;
    document.querySelector('.spinner').style.display = 'none';
    if(data) {
        document.getElementById('alert-success').style.display = 'block';
        document.getElementById('alert-success').innerHTML = data.message;
        window.location.href = "index.html"
        return;
    }
    else if(error) {
        for (let err of error) {
            console.log(err.message);
            document.getElementById('alert-danger').style.display = 'block';
            document.getElementById('alert-danger').innerHTML = err.message
        }
        return;
    }
};