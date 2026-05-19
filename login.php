<?php
require_once 'db.php';

$inputJson = file_get_contents("php://input");
$request = json_decode($inputJson, true);

if (!$request || !isset($request['email']) || !isset($request['password'])) {
    echo json_encode(["success" => false, "error" => "Email-i dhe fjalëkalimi kërkohen!"]);
    exit();
}

$email = $conn->real_escape_string($request['email']);
$password = $request['password'];

// Lexojmë të dhënat nga tabela 'user'
$sql = "SELECT * FROM user WHERE email = '$email'";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $user = $result->fetch_assoc();
    
    // Verifikimi i fjalëkalimit të enkriptuar
    if (password_verify($password, $user['password'])) {
        echo json_encode([
            "success" => true,
            "message" => "Mirëseerdhët përsëri!",
            "user" => [
                "name" => $user['fullname'], // RREGULLIMI: Marrim vlerën nga 'fullname' dhe ia kalojmë JS-it si 'name'
                "email" => $user['email']
            ]
        ]);
    } else {
        echo json_encode(["success" => false, "error" => "Fjalëkalimi është i gabuar!"]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Ky përdorues nuk ekziston!"]);
}

$conn->close();
?>