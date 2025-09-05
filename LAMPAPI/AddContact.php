<?php
    $inData = getRequestInfo();
    
    $firstName = $inData["firstname"];
    $lastName = $inData["lastname"];
    $phone = $inData["phone"];
    $email = $inData["email"];
    $userID = $inData["userId"];

    require_once __DIR__ . '/config.php';
	$conn = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);
    if ($conn->connect_error) 
    {
        returnWithError( $conn->connect_error );
    } 
    else
    {
        $stmt = $conn->prepare("INSERT into Contacts (UserId,firstName, lastName, phone, email) VALUES(?,?,?,?,?)");
        $stmt->bind_param("sssss", $userID, $firstName, $lastName, $phone, $email);
        $stmt->execute();
        $stmt->close();
        $conn->close();
        returnWithError("");
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson( $obj )
    {
        header('Content-type: application/json');
        echo $obj;
    }
    
    function returnWithError( $err )
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }
    
?>
