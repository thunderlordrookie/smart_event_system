<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$conn = mysqli_connect("localhost", "root", "", "smart_event_db");
if (!$conn) {
    die("Database connection failed: ". mysqli_connect_error());
}
?>