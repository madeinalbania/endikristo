<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

$host = "localhost";
$user = "root";
$password = "";
$dbname = "voyage_db"; // Emri i saktë i databazës së re

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "Lidhja me databazën dështoi: " . $conn->connect_error]);
    exit();
}
?>