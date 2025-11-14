    
<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
error_reporting(0); // hides warnings from breaking JSON

include 'db_connect.php';
$query = "SELECT * FROM attendance";
$result = mysqli_query($conn, $query);
$users = [];

while ($row = mysqli_fetch_assoc($result)) {
    $users[] = $row;
}

echo json_encode($users);
?>



