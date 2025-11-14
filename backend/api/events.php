<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include_once __DIR__ . '/db_connect.php';


$query = "SELECT * FROM events ORDER BY event_date ASC";
$result = mysqli_query($conn, $query);

$events = [];
while($row = mysqli_fetch_assoc($result)) {
  $events[] = $row;
}

echo json_encode($events);
