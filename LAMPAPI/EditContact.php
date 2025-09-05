<?php
    $inData = getRequestInfo();
    $userId = $inData["userId"];
    $contactId = $inData["contactId"];
    $firstName = $inData["firstname"];
    $lastName = $inData["lastname"];
    $phone = $inData["phonenumber"];
    $email = $inData["email"];

    require_once __DIR__ . '/config.php';
	$conn = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);
    if ($conn->connect_error) {
        returnWithError($conn->connect_error);
    }

    else {
        $get_statement = $conn->prepare("SELECT id,createdAt FROM Contacts WHERE UserID=? AND ID=?");
		$get_statement->bind_param("ss", $userId, $contactId);
        $get_statement->execute();
        $result = $get_statement->get_result();
        if ($row = $result->fetch_assoc()){
            $edit_statement = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=? WHERE UserID=? AND ID=?;");
		    $edit_statement->bind_param("ssssss", $firstName, $lastName, $phone, $email, $userId, $contactId);
            $edit_statement->execute();
            $edit_statement->close();
			returnWithInfo($row['id'], $row['createdAt'], $firstName, $lastName, $phone, $email, $userId);
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
		$retValue = '{"contactId":' . $id . ',"createdAt":"' . $createdAt . '","firstName":"' . $firstName . '","lastName":"' . $lastName . '","phone":"' . $phone . '","email":"' . $email . '","userId":' . $userId . ',"error":""}';
		sendResultInfoAsJson($retValue);
	}
    
?>
