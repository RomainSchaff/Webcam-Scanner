<?php
// Connect to the database
$conn = new mysqli('localhost', 'root', 'romaindu2612', 'webcam');
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
// Prepare the SELECT statement
$stmt = $conn->prepare("SELECT video FROM videos WHERE id = ?");
// Bind the parameter
$stmt->bind_param("i", $video_id);
// Set the parameter value
$video_id = $_GET['id'];
// Execute the query
$stmt->execute();
// Bind the result
$stmt->bind_result($video_data);
// Fetch the result
$stmt->fetch();
// Return the base64-encoded string
echo $video_data;
// Close the statement and connection
$stmt->close();
$conn->close();
?>