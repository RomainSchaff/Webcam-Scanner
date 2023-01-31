<?php
// Connect to the database
$conn = new mysqli('localhost', 'root', 'romaindu2612', 'webcam');
// Check if the connection was successful
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

if ($_GET) {
// Prepare the SELECT statement
$stmt = $conn->prepare("SELECT * FROM codes WHERE code = ?");

// Bind the parameter
$stmt->bind_param("i", $code);

// Set the parameter value
$code = $_GET['code'];

// Execute the query
$stmt->execute();

// Bind the result
$stmt->bind_result($code_id);

// Fetch the result
$stmt->fetch();

// Return the base64-encoded string
echo $code_id;

// Close the statement and connection
$stmt->close();
$conn->close();
}

?>