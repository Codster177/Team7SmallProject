function onMainpageLoad() {
    let userInfo = Global.readCookie();
    let firstName = userInfo.firstname;
    let lastName = userInfo.lastname;
    let userId = userInfo.userId;

    let welcomeLabel = document.getElementById("welcomeLabel");
    welcomeLabel.innerHTML = "Welcome " + firstName + " " + lastName + ", ID: " + userId;

}