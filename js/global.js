class Global {
    static URL = "http://christianwagenknecht.com/LAMPAPI";
    static apiExtension = ".php";

    static saveCookie(firstName, lastName, userId) {
        let minutes = 20;
        let date = new Date();
        date.setTime(date.getTime() + (minutes * 60 * 1000));

        document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=", + userId + ";expires=" + date.toGMTString();
        console.log(firstName + ", " + lastName + ", " + userId);
    }

    static readCookie() {
        let firstName = "";
        let lastName = "";
        let userId = -1;
        let data = document.cookie;
        let splits = data.split(",");

        for (var i = 0; i < splits.length; i++) {
            let thisOne = splits[i].trim();
            let tokens = thisOne.split("=");

            if (tokens[0] == "firstName") {
                firstName = tokens[1];
            }
            else if (tokens[0] == "lastName") {
                lastName = tokens[1];
            }
            else if (tokens[0] == "userId") {
                userId = parseInt(tokens[1].trim());
            }
        }
        let returnVal = { firstname: firstName, lastname: lastName, userid: userId };
        return returnVal;
    }
}