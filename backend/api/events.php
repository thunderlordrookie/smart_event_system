<?php
include 'db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if(isset($_GET['event_id'])) {
            $event_id = mysqli_real_escape_string($conn, $_GET['event_id']);
            $query = "SELECT e.*, u.full_name as organizer_name 
                     FROM events e 
                     JOIN users u ON e.organizer_id = u.user_id 
                     WHERE e.event_id = '$event_id'";
        } else if(isset($_GET['organizer_id'])) {
            $organizer_id = mysqli_real_escape_string($conn, $_GET['organizer_id']);
            $query = "SELECT e.*, u.full_name as organizer_name 
                     FROM events e 
                     JOIN users u ON e.organizer_id = u.user_id 
                     WHERE e.organizer_id = '$organizer_id' 
                     ORDER BY e.event_date ASC";
        } else {
            $query = "SELECT e.*, u.full_name as organizer_name 
                     FROM events e 
                     JOIN users u ON e.organizer_id = u.user_id 
                     ORDER BY e.event_date ASC";
        }
        
        $result = mysqli_query($conn, $query);
        $events = [];
        while($row = mysqli_fetch_assoc($result)) {
            // Combine date and time
            if(isset($row['event_date']) && isset($row['event_time'])) {
                $row['event_datetime'] = $row['event_date'] . ' ' . $row['event_time'];
            }
            
            // Get registration count
            $event_id = $row['event_id'];
            $regQuery = "SELECT COUNT(*) as reg_count FROM event_registrations WHERE event_id='$event_id'";
            $regResult = mysqli_query($conn, $regQuery);
            $regData = mysqli_fetch_assoc($regResult);
            $row['current_participants'] = $regData['reg_count'];
            $row['available_spots'] = $row['capacity'] - $regData['reg_count'];
            
            $events[] = $row;
        }
        echo json_encode($events);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        $title = mysqli_real_escape_string($conn, $data['title']);
        $description = mysqli_real_escape_string($conn, $data['description']);
        $event_date = mysqli_real_escape_string($conn, $data['event_date']);
        $event_time = mysqli_real_escape_string($conn, $data['event_time']);
        $location = mysqli_real_escape_string($conn, $data['location']);
        $organizer_id = mysqli_real_escape_string($conn, $data['organizer_id']);
        $capacity = mysqli_real_escape_string($conn, $data['capacity']);
        $category = mysqli_real_escape_string($conn, $data['category']);
        
        $query = "INSERT INTO events (title, description, event_date, event_time, location, organizer_id, capacity, category) 
                 VALUES ('$title', '$description', '$event_date', '$event_time', '$location', '$organizer_id', '$capacity', '$category')";
        
        if(mysqli_query($conn, $query)) {
            echo json_encode(["success" => true, "message" => "Event created successfully", "event_id" => mysqli_insert_id($conn)]);
        } else {
            echo json_encode(["success" => false, "error" => mysqli_error($conn)]);
        }
        break;

    case 'PUT':
        // Update event
        $data = json_decode(file_get_contents("php://input"), true);
        $event_id = mysqli_real_escape_string($conn, $data['event_id']);
        $title = mysqli_real_escape_string($conn, $data['title']);
        $description = mysqli_real_escape_string($conn, $data['description']);
        $event_date = mysqli_real_escape_string($conn, $data['event_date']);
        $event_time = mysqli_real_escape_string($conn, $data['event_time']);
        $location = mysqli_real_escape_string($conn, $data['location']);
        $capacity = mysqli_real_escape_string($conn, $data['capacity']);
        $category = mysqli_real_escape_string($conn, $data['category']);
        
        $query = "UPDATE events SET title='$title', description='$description', 
                 event_date='$event_date', event_time='$event_time', location='$location', 
                 capacity='$capacity', category='$category' 
                 WHERE event_id='$event_id'";
        
        if(mysqli_query($conn, $query)) {
            echo json_encode(["success" => true, "message" => "Event updated successfully"]);
        } else {
            echo json_encode(["success" => false, "error" => mysqli_error($conn)]);
        }
        break;

    case 'DELETE':
        $event_id = mysqli_real_escape_string($conn, $_GET['event_id']);
        $query = "DELETE FROM events WHERE event_id='$event_id'";
        
        if(mysqli_query($conn, $query)) {
            echo json_encode(["success" => true, "message" => "Event deleted successfully"]);
        } else {
            echo json_encode(["success" => false, "error" => mysqli_error($conn)]);
        }
        break;
}
?>