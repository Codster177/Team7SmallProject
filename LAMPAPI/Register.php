
<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = "";
	$lastName = "";
	
	$searchCount = 0;

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
		if ($inData["login"] === "") {
			returnWithError("Enter a valid Username");
		}
		else {
			
			// Search the database for any instance of the input username.
			$stmt = $conn->prepare("select Login from Users where Login=?"); // Creates a SQL command to find a Login in the Users database that matches the input username value.
			$stmt->bind_param("s", $inData["login"]); // Binds the input username value to the command
			
			$stmt->execute(); // Executes the SQL command in the database
			
			$result = $stmt->get_result();
			
			// Check if the result was a success and there is an instance of the username in the database.
			if($row = $result->fetch_assoc())
			{
				$searchCount++;
			}
			
			// If the username doesn't appear in the database already
			if( $searchCount == 0 )
			{
				// Inserts a new User into the database
				$stmt = $conn->prepare("Insert into Users (FirstName,LastName,Login,Password) Values(?,?,?,?)"); // Creates an SQL command to insert into user database
				$stmt->bind_param("ssss", $inData["firstname"], $inData["lastname"], $inData["login"], $inData["password"]); // Binds json input to the SQL command
				$stmt->execute(); // Executes the SQL command
				
				
				
				
				// Retrieves the ID value for the created account
				$stmt = $conn->prepare("Select ID from Users where Login=?"); // Creates an SQL command to retrieve ID from the created account
				$stmt->bind_param("s", $inData["login"]); // Binds the login value to the input username
				$stmt->execute(); // Executes the SQL command
				$result = $stmt->get_result(); // Retrieves the result
				
				// If the result was a success
				if($row = $result->fetch_assoc())
				{
					// Return the FirstName, LastName, and ID of the new account to allow for login.
					returnWithInfo($inData["firstname"], $inData["lastname"], $row["ID"]);
				}
					
				
				
			}
			else
			{
				returnWithError("Username already exists");
			}
		}
		

		$stmt->close();
		$conn->close();
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
