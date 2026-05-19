<?php
require_once 'db.php';

// Leximi i saktë i të dhënave JSON që vijnë nga JS fetch()
$inputJson = file_get_contents("php://input");
$request = json_decode($inputJson, true);

if (!$request || !isset($request['name']) || !isset($request['email']) || !isset($request['password'])) {
    echo json_encode(["success" => false, "error" => "Ju lutem plotësoni të gjitha fushat."]);
    exit();
}

$name = $conn->real_escape_string($request['name']); // Ky është emri që vjen nga JS
$email = $conn->real_escape_string($request['email']);
$password_hashed = password_hash($request['password'], PASSWORD_BCRYPT);

// Kontrollojmë nëse ky email ekziston tashmë në tabelën 'user'
$checkEmail = $conn->query("SELECT id FROM user WHERE email = '$email'");
if ($checkEmail && $checkEmail->num_rows > 0) {
    echo json_encode(["success" => false, "error" => "Ky email është i regjistruar një herë!"]);
    exit();
}

// RREGULLIMI: Ndryshuar nga 'name' në 'fullname' që të përshtatet me databazën tënde
$sql = "INSERT INTO user (fullname, email, password) VALUES ('$name', '$email', '$password_hashed')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["success" => true, "message" => "Llogaria u krijua me sukses!"]);
} else {
    echo json_encode(["success" => false, "error" => "Gabim gjatë ruajtjes në server: " . $conn->error]);
}

$conn->close();
?>