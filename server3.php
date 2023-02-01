<?php
// Connect to the database
$conn = new mysqli('localhost', 'root', 'romaindu2612', 'webcam');
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

if (isset($_GET['code'])) {
$code = $_GET['code'];
// Préparez la requête SQL
$sql = "SELECT * FROM codes WHERE code = $code";
// Exécutez la requête
$result = mysqli_query($conn, $sql);
// Récupérez les résultats de la requête sous forme de tableau associatif
$rows = array();
while($row = mysqli_fetch_assoc($result)) {
    $rows[] = $row;
}
// Fermez la connexion à la base de données
mysqli_close($conn);
// Encodez les résultats sous forme de JSON
header('Content-Type: application/json');
echo json_encode($rows);
}

if (isset($_POST['code'])) {
  $code = $_POST['code'];
  $type = $_POST['type'];
  $date = $_POST['date'];
    // Préparez la requête SQL
    $sql = "INSERT INTO 'codes' ('id', 'code', 'type', 'date') VALUES (NULL, '$code', 'code barre' ,'2023-01-30 14:07:47');";
    if ($conn->query("INSERT INTO `codes` (`id`, `code`, `type`, `date`) VALUES (NULL, '$code', '$type', '$date');")) {
      echo "Enregistrement BDD réussi";
    } else {
      echo "Enregistrement failed";
    }
}
?>