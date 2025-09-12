

function process_signup() {

    let userId = 0;

    let firstName = document.getElementById("signup-fn").value;
    let lastName = document.getElementById("signup-ln").value;
    let email = document.getElementById("signup-email").value;
    let pass = document.getElementById("signup-pass").value;


    var hash = md5(pass);
    console.log(hash);

    let errorDatabase = document.getElementById("signup-error");

    let tmp = { firstname: firstName, lastname: lastName, login: email, password: hash }

    let jsonPayload = JSON.stringify(tmp);

    let url = Global.URL + '/Register' + Global.apiExtension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState != 4) {
                return;
            }

            if (this.status == 409) {
                errorDatabase.innerHTML = "User already exists";
                return;
            }

            if (this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;

                saveCookie(firstName, lastName, userId);
            }
        };

        xhr.send(jsonPayload);
    } catch (err) {
        errorDatabase.innerHTML = err.message;
    }

}