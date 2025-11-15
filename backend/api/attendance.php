<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include 'db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if(isset($_GET['event_id'])) {
            $event_id = mysqli_real_escape_string($conn, $_GET['event_id']);
            $query = "SELECT a.*, u.full_name, u.email, e.title as event_title 
                     FROM attendance a 
                     JOIN users u ON a.user_id = u.user_id 
                     JOIN events e ON a.event_id = e.event_id 
                     WHERE a.event_id = '$event_id'";
        } else {
            $query = "SELECT a.*, u.full_name, u.email, e.title as event_title 
                     FROM attendance a 
                     JOIN users u ON a.user_id = u.user_id 
                     JOIN events e ON a.event_id = e.event_id";
        }
        
        $result = mysqli_query($conn, $query);
        $attendance = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $attendance[] = $row;
        }
        echo json_encode($attendance);
        break;

    case 'POST':
        // Mark attendance
        $data = json_decode(file_get_contents("php://input"), true);
        $event_id = mysqli_real_escape_string($conn, $data['event_id']);
        $user_id = mysqli_real_escape_string($conn, $data['user_id']);
        $status = mysqli_real_escape_string($conn, $data['status'] ?? 'present');
        
        // Check if already marked
        $checkQuery = "SELECT attendance_id FROM attendance WHERE event_id='$event_id' AND user_id='$user_id'";
        $checkResult = mysqli_query($conn, $checkQuery);
        
        if(mysqli_num_rows($checkResult) > 0) {
            // Update existing
            $query = "UPDATE attendance SET status='$status', check_in_time=NOW() 
                     WHERE event_id='$event_id' AND user_id='$user_id'";
        } else {
            // Create new
            $query = "INSERT INTO attendance (event_id, user_id, status, check_in_time) 
                     VALUES ('$event_id', '$user_id', '$status', NOW())";
        }
        
        if(mysqli_query($conn, $query)) {
            echo json_encode(["success" => true, "message" => "Attendance recorded successfully"]);
        } else {
            echo json_encode(["success" => false, "error" => mysqli_error($conn)]);
        }
        break;
}
?>