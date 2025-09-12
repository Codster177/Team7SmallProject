

function process_signup() {

    let userId = 0;

    let firstName = document.getElementById("signup-fn").value;
    let lastName = document.getElementById("signup-ln").value;
    let email = document.getElementById("signup-email").value;
    let pass = document.getElementById("signup-pass").value;


    var hash = md5(pass);
    console.log(hash);

    let tmp = { firstname: firstName, lastname: lastName, login: email, password: hash }

    let url = Global.URL + '/Register' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

}