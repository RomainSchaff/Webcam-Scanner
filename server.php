<?php
// Connect to the database
$conn = new mysqli('localhost', 'root', 'romaindu2612', 'webcam');
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

if ($_POST && $_POST['image_data'] && $_POST['date']) {
  if (file_exists("Mon_image.jpeg")) {
    unlink("Mon_image.jpeg");
  }
  $jpegImage = str_replace('data:image/jpeg;base64,', '', $_POST['image_data']);
  $jpegImage = base64_decode($jpegImage);
  if (file_put_contents("Mon_image.jpeg", $jpegImage)) {
    $base64 = base64_encode($jpegImage);
    $date = $_POST['date'];
    if ($conn->query("INSERT INTO `images` (`id`, `image`, `date`) VALUES (NULL, '$base64', '$date');")) {
      echo "Enregistrement BDD réussi";
    } else {
      echo "Enregistrement failed";
    }
  } else {
    echo "Erreur d'enregistrement";
  }
}

if ($_POST && $_POST['video_data'] && $_POST['date']) {
  $videoData = str_replace('data:video/mp4;base64,', '', $_POST['video_data']);
  $videoData2 = base64_decode(str_replace('data:video/mp4;base64,', '', $_POST['video_data']));
  $file_name = uniqid() . '.mp4';
  $final_path = './' . $file_name;
  $date = $_POST['date'];
  if (file_put_contents($final_path, $videoData2)) {
    if ($conn->query("INSERT INTO `videos` (`id`, `video`, `date`) VALUES (NULL, '$videoData', '$date');")) {
      echo "Enregistrement BDD réussi";
    } else {
      echo "Enregistrement failed";
    }
  } else {
    echo "Erreur d'enregistrement";
  }
}

?>