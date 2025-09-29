<?php
    $inData = getRequestInfo();
    $userId = $inData["userId"];
    $contactId = $inData["contactId"];
    $firstName = $inData["firstname"];
    $lastName = $inData["lastname"];
    $phone = $inData["phone"];
    $email = $inData["email"];

    require_once __DIR__ . '/config.php';
	$conn = mysqli_init();
    mysqli_ssl_set($conn, $DB_SSL_KEY, $DB_SSL_CERT, $DB_SSL_CA, NULL, NULL);
    mysqli_options($conn, MYSQLI_OPT_SSL_VERIFY_SERVER_CERT, true);
	if(!mysqli_real_connect($conn, $DB_HOST, $DB_USER, $DB_PASS, $DB_NAME, 3306, NULL, MYSQLI_CLIENT_SSL))
	{
		returnWithError("Connection failed: " . mysqli_connect_error());
	}

    else {
        $get_statement = $conn->prepare("SELECT id,createdAt,firstName,lastName,phone,email,userId FROM Contacts WHERE UserID=? AND ID=?");
		$get_statement->bind_param("ss", $userId, $contactId);
        $get_statement->execute();
        $result = $get_statement->get_result();
        if ($row = $result->fetch_assoc()){
            $edit_statement = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=? WHERE UserID=? AND ID=?;");
		    $edit_statement->bind_param("ssssss", $firstName, $lastName, $phone, $email, $userId, $contactId);
            $edit_statement->execute();
            $edit_statement->close();
			returnWithInfo($row['id'], $row['createdAt'], $row['firstName'], $row['lastName'], $row['phone'], $row['email'], $row['userId']);
		} else {
			returnWithError("Contact not found");
		}
        $get_statement->close();
        $conn->close();
    }

    function getRequestInfo() {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj) {
        header('Content-type: application/json');
        echo $obj;
    }
    
    function returnWithError($err){
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithInfo($id, $createdAt, $firstName, $lastName, $phone, $email, $userId) {
		$retValue = '{"contactId":' . $id . ',"createdAt":"' . $createdAt . '","firstname":"' . $firstName . '","lastname":"' . $lastName . '","phone":"' . $phone . '","email":"' . $email . '","userId":' . $userId . ',"error":""}';
		sendResultInfoAsJson($retValue);
	}
    
?>
