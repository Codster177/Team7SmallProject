<?php

	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;

	require_once __DIR__ . '/config.php';
	$conn = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// Select all contact information that is connected to the passed in UserID
		$stmt = $conn->prepare("select FirstName, LastName, Phone, Email, UserID, ID, CreatedAt from Contacts where (FirstName like ? OR LastName like ? OR Email like ? OR Phone like ?) and UserID=?
		 ORDER BY LastName
		"); // LIMIT the number of contacts retrieved by the passed in limit from JSON
		
		// Need to make it so it grabs based on letters of contacts since ID will be shuffled since it is sorted by firstname
		
		$contactInfo = "%" . $inData["search"] . "%";
		
		// Bind the passed in UserID to the command
		$stmt->bind_param("sssss", $contactInfo, $contactInfo, $contactInfo, $contactInfo, $inData["userId"]);
		$stmt->execute(); // Execute the command
		
		$result = $stmt->get_result();
		
		// Create an array that will store the User information that will be sent back
		$array = [];
		
		// Loop through the results up to a total of 30 contacts
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			
			
			// Create a new object to store Contact Information
			$obj = new stdClass();
			// Add each element necessary for the object
			$obj->UserID = $row["UserID"];
			$obj->ContactId = $row["ID"];
			$obj->FirstName = $row["FirstName"];
			$obj->LastName = $row["LastName"];
			$obj->PhoneNumber = $row["Phone"];
			$obj->Email = $row["Email"];
			$obj->CreatedAt = $row["CreatedAt"];
			// Add the Contact object to the array
			$array[$searchCount] = $obj;
		}
		
		// Convert the Contact array into JSON
		$myJSON = json_encode($array);
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Contacts Found" );
		}
		else
		{
			returnWithInfo( $myJSON );
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
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>