<?php
    $inData = getRequestInfo();
    
    $firstName = $inData["firstname"];
    $lastName = $inData["lastname"];
    $phone = $inData["phone"];
    $email = $inData["email"];
    $userID = $inData["userId"];

    require_once __DIR__ . '/config.php';
	$conn = mysqli_init();
    mysqli_ssl_set($conn, $DB_SSL_KEY, $DB_SSL_CERT, $DB_SSL_CA, NULL, NULL);
    mysqli_options($conn, MYSQLI_OPT_SSL_VERIFY_SERVER_CERT, true);
	if(!mysqli_real_connect($conn, $DB_HOST, $DB_USER, $DB_PASS, $DB_NAME, 3306, NULL, MYSQLI_CLIENT_SSL))
	{
		returnWithError("Connection failed: " . mysqli_connect_error());
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
