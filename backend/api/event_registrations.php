<?php
include 'db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if(isset($_GET['event_id'])) {
            $event_id = mysqli_real_escape_string($conn, $_GET['event_id']);
            $query = "SELECT er.*, u.full_name, u.email 
                     FROM event_registrations er 
                     JOIN users u ON er.user_id = u.user_id 
                     WHERE er.event_id = '$event_id'";
        } else if(isset($_GET['user_id'])) {
            $user_id = mysqli_real_escape_string($conn, $_GET['user_id']);
            $query = "SELECT er.*, e.title, e.event_date, e.event_time, e.location 
                     FROM event_registrations er 
                     JOIN events e ON er.event_id = e.event_id 
                     WHERE er.user_id = '$user_id'";
        } else {
            $query = "SELECT er.*, u.full_name, u.email, e.title 
                     FROM event_registrations er 
                     JOIN users u ON er.user_id = u.user_id 
                     JOIN events e ON er.event_id = e.event_id";
        }
        
        $result = mysqli_query($conn, $query);
        $registrations = [];
        while($row = mysqli_fetch_assoc($result)) {
            $registrations[] = $row;
        }
        echo json_encode($registrations);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        $event_id = mysqli_real_escape_string($conn, $data['event_id']);
        $user_id = mysqli_real_escape_string($conn, $data['user_id']);
        
        // Check if already registered
        $checkQuery = "SELECT registration_id FROM event_registrations WHERE event_id='$event_id' AND user_id='$user_id'";
        $checkResult = mysqli_query($conn, $checkQuery);
        
        if(mysqli_num_rows($checkResult) > 0) {
            echo json_encode(["success" => false, "error" => "Already registered for this event"]);
        } else {
            // Check capacity
            $capacityQuery = "SELECT capacity, (SELECT COUNT(*) FROM event_registrations WHERE event_id='$event_id') as current_count 
                            FROM events WHERE event_id='$event_id'";
            $capacityResult = mysqli_query($conn, $capacityQuery);
            $capacityData = mysqli_fetch_assoc($capacityResult);
            
            if($capacityData['current_count'] >= $capacityData['capacity']) {
                echo json_encode(["success" => false, "error" => "Event is full"]);
            } else {
                $query = "INSERT INTO event_registrations (event_id, user_id, registration_date) 
                         VALUES ('$event_id', '$user_id', NOW())";
                
                if(mysqli_query($conn, $query)) {
                    echo json_encode(["success" => true, "message" => "Successfully registered for event"]);
                } else {
                    echo json_encode(["success" => false, "error" => mysqli_error($conn)]);
                }
            }
        }
        break;

    case 'DELETE':
        // Cancel registration
        $registration_id = mysqli_real_escape_string($conn, $_GET['registration_id']);
        $query = "DELETE FROM event_registrations WHERE registration_id='$registration_id'";
        
        if(mysqli_query($conn, $query)) {
            echo json_encode(["success" => true, "message" => "Registration cancelled successfully"]);
        } else {
            echo json_encode(["success" => false, "error" => mysqli_error($conn)]);
        }
        break;
}
?>