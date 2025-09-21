// JavaScript for mainpage.html

let userId = 0;
let ids = [];
let firstName = "";
let lastName = "";


function onMainpageLoad() {
    let userInfo = Global.readCookie();
    firstName = userInfo.firstname;
    lastName = userInfo.lastname;
    userId = userInfo.userid;

    if (userId < 1) {
        window.location.href = "index.html";
        return;
    }

    let welcomeLabel = document.getElementById("welcomeLabel");
    welcomeLabel.innerHTML = "Welcome " + firstName + " " + lastName;

}

function addContact(){
    let firsname = document.getElementById("firstname").value;
    let lastname = document.getElementById("lastname").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;

    // validate input
    if (!validInput(firsname, lastname, email, phone)){
        return;
    }

    // create JSON payload
    let tmp = {
        userId: userId,
        firstname: firsname,
        lastname: lastname,
        email: email,
        phone: phone
    };

    // send to server
    let jsonPayload = JSON.stringify(tmp);
    // API URL
    let url = Global.URL + '/AddContact' + Global.apiExtension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    // array to hold contact IDs for editing and deleting
    try {
        xhr.onreadystatechange = function () {
            //  Check if request is complete and was successful
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    console.log(jsonObject.error);
                    return;
                }
                // clear input fields
                document.getElementById("firstname").value = "";
                document.getElementById("lastname").value = "";
                document.getElementById("email").value = "";
                document.getElementById("phone").value = "";
                // refresh contact list
                showContacts();
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

function showContacts(){
    let tmp = {
        searchString: "",
        userId: userId
    };

    // send to server
    let jsonPayload = JSON.stringify(tmp);
    let url = Global.URL + '/SearchContacts' + Global.apiExtension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                // parse JSON response
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    console.log(jsonObject.error);
                    return;
                }

                // Build table
                document.getElementById("table-body").innerHTML = "";
                let contacts = jsonObject.results[0];
                ids = [];
                let text = "";
                for (let key in contacts) {
                    if (contacts.hasOwnProperty(key)) {
                        let contact = contacts[key];
                        let i = ids.length;
                        ids.push(contact.ContactId);

                        text += "<tr id='row" + i + "'>";
                        text += "<td id='first_Name" + i + "'><span>" + contact.FirstName + "</span></td>";
                        text += "<td id='last_Name" + i + "'><span>" + contact.LastName + "</span></td>";
                        text += "<td id='email" + i + "'><span>" + contact.Email + "</span></td>";
                        text += "<td id='phone" + i + "'><span>" + contact.PhoneNumber + "</span></td>";
                        text += "<td>" +
                            "<input type='button' value='Edit' onclick='editContact(" + i + ")'/>" +
                            "<input type='button' value='Save' onclick='saveContact(" + i + ")' style='display:none;'/>" +
                            "<input type='button' value='Delete' onclick='deleteContact(" + contact.ContactId + "," + i + ")'/>"
                            + "</td>";
                        text += "</tr>";
                    }
                }
                document.getElementById("table-body").innerHTML = text;
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

function editContact(index){
    // get current values
    let firstNameTd = document.getElementById("first_Name" + index);
    let lastNameTd = document.getElementById("last_Name" + index);
    let emailTd = document.getElementById("email" + index);
    let phoneTd = document.getElementById("phone" + index);
    let row = document.getElementById("row" + index);
    // extract text values
    let firstName = firstNameTd.innerText;
    let lastName = lastNameTd.innerText;
    let email = emailTd.innerText;
    let phone = phoneTd.innerText;
    // replace text with input fields
    firstNameTd.innerHTML = "<input type='text' id='firstNameInput" + index + "' value='" + firstName + "'/>";
    lastNameTd.innerHTML = "<input type='text' id='lastNameInput" + index + "' value='" + lastName + "'/>";
    emailTd.innerHTML = "<input type='text' id='emailInput" + index + "' value='" + email + "'/>";
    phoneTd.innerHTML = "<input type='text' id='phoneInput" + index + "' value='" + phone + "'/>";
    // toggle buttons
    let actionTd = row.lastElementChild;
    let actionButtons = actionTd.getElementsByTagName("input");
    actionButtons[0].style.display = "none"; // Hide Edit button
    actionButtons[1].style.display = ""; // Show Save button
}

function saveContact(index){
    // get updated values
    let firstName = document.getElementById("firstNameInput" + index).value;
    let lastName = document.getElementById("lastNameInput" + index).value;
    let email = document.getElementById("emailInput" + index).value;
    let phone = document.getElementById("phoneInput" + index).value;

    // validate input
    if (!validInput(firstName, lastName, email, phone)){
        return;
    }

    // create JSON payload
    let tmp = {
        contactId: ids[index],
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone
    };
    // send to server
    let jsonPayload = JSON.stringify(tmp);
    let url = Global.URL + '/UpdateContact' + Global.apiExtension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    // array to hold contact IDs for editing and deleting
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    console.log(jsonObject.error);
                    return;
                }
                showContacts();
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

function deleteContact(contactId, index){
    // get contact name for confirmation dialog
    let namef_val = document.getElementById("first_Name" + index).innerText;
    let namel_val = document.getElementById("last_Name" + index).innerText;
    let nameOne = namef_val.trim();
    let nameTwo = namel_val.trim();

    // confirmation dialog
    let confirmation = confirm("Are you sure you want to delete " + nameOne + " " + nameTwo + "?");
    if (!confirmation) return;

    // create JSON payload
    let tmp = { contactId: contactId, userId: userId };
    let jsonPayload = JSON.stringify(tmp);
    let url = Global.URL + '/DeleteContact' + Global.apiExtension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    console.log(jsonObject.error);
                    return;
                }
                showContacts();
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

function searchContacts() {
    // Get the search input and convert to uppercase for case-insensitive comparison
    const content = document.getElementById("search");
    const selections = content.value.toUpperCase().split(' ');
    const table = document.getElementById("table-body");
    const rows = table.getElementsByTagName("tr");
    // Loop through all table rows and hide those that don't match the search query
    for (let i = 0; i < rows.length; i++) {
        let firstName = rows[i].cells[0].innerText.toUpperCase();
        let lastName = rows[i].cells[1].innerText.toUpperCase();
        let email = rows[i].cells[2].innerText.toUpperCase();
        let phone = rows[i].cells[3].innerText.toUpperCase();
        let rowMatches = selections.every(selection =>
            firstName.includes(selection) ||
            lastName.includes(selection) ||
            email.includes(selection) ||
            phone.includes(selection)
        );
        rows[i].style.display = rowMatches ? "" : "none";
    }
}

function validInput(firstname, lastname, email, phone){
    if (firstname.length < 1 || lastname.length < 1 || email.length < 1 || phone.length < 1){
        alert("All fields are required");
        return false;
    }
    // validate email
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)){
        alert("Invalid email format");
        return false;
    }
    // validate phone number
    let phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)){
        alert("Invalid phone number format. Must be 10 digits.");
        return false;
    }
    return true;
}

function clearSearch() {
    document.getElementById("search").value = "";
    showContacts();
}
