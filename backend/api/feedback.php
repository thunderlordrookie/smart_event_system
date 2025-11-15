<?php
include 'db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if(isset($_GET['event_id'])) {
            $event_id = mysqli_real_escape_string($conn, $_GET['event_id']);
            $query = "SELECT f.*, u.full_name, e.title as event_title 
                     FROM feedback f 
                     JOIN users u ON f.user_id = u.user_id 
                     JOIN events e ON f.event_id = e.event_id 
                     WHERE f.event_id = '$event_id'";
        } else {
            $query = "SELECT f.*, u.full_name, e.title as event_title 
                     FROM feedback f 
                     JOIN users u ON f.user_id = u.user_id 
                     JOIN events e ON f.event_id = e.event_id";
        }
        
        $result = mysqli_query($conn, $query);
        $feedback = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $feedback[] = $row;
        }
        echo json_encode($feedback);
        break;

    case 'POST':
        // Submit feedback
        $data = json_decode(file_get_contents("php://input"), true);
        $event_id = mysqli_real_escape_string($conn, $data['event_id']);
        $user_id = mysqli_real_escape_string($conn, $data['user_id']);
        $rating = mysqli_real_escape_string($conn, $data['rating']);
        $comment = mysqli_real_escape_string($conn, $data['comment']);
        
        $query = "INSERT INTO feedback (event_id, user_id, rating, comment) 
                 VALUES ('$event_id', '$user_id', '$rating', '$comment')";
        
        if(mysqli_query($conn, $query)) {
            echo json_encode(["success" => true, "message" => "Feedback submitted successfully"]);
        } else {
            echo json_encode(["success" => false, "error" => mysqli_error($conn)]);
        }
        break;
}
?>