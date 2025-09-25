function process_login() {
    let userId = 0;
    let firstName = "";
    let lastName = "";

    let login = document.getElementById("login-user").value;
    let pass = document.getElementById("login-pass").value;

    var hash = md5(pass);

    let errorDatabase = document.getElementById("login-error");

    let tmp = { login: login, password: hash };

    let jsonPayload = JSON.stringify(tmp);

    let url = Global.URL + "/Login" + Global.apiExtension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application./json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;

                console.log(userId);

                if (userId < 1) {
                    errorDatabase.innerHTML = "User/Password combination incorrect.";
                    return;
                }
                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                Global.saveCookie(firstName, lastName, userId);
                window.location.href = "main-page.html";
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        errorDatabase.innerHTML = err.message;
    }
}

function check_cookie() {
    try {
        let user = Global.readCookie();
        if (user.userid > 0) {
            window.location.href = "main-page.html";
        }
    } catch (err) {
        console.log(err.message);
    }
}
