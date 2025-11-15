<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include 'db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if(isset($_GET['user_id'])) {
            $user_id = mysqli_real_escape_string($conn, $_GET['user_id']);
            $query = "SELECT user_id, full_name, email, role, phone, created_at FROM users WHERE user_id='$user_id'";
        } else {
            $query = "SELECT user_id, full_name, email, role, phone, created_at FROM users";
        }
        
        $result = mysqli_query($conn, $query);
        $users = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $users[] = $row;
        }
        echo json_encode($users);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        
        if(isset($data['action']) && $data['action'] == 'register') {
            $full_name = mysqli_real_escape_string($conn, $data['full_name']);
            $email = mysqli_real_escape_string($conn, $data['email']);
            $password = password_hash($data['password'], PASSWORD_DEFAULT);
            $role = mysqli_real_escape_string($conn, $data['role'] ?? 'participant');
            $phone = mysqli_real_escape_string($conn, $data['phone'] ?? '');
            
            // Check if email exists
            $checkQuery = "SELECT user_id FROM users WHERE email='$email'";
            $checkResult = mysqli_query($conn, $checkQuery);
            
            if(mysqli_num_rows($checkResult) > 0) {
                echo json_encode(["success" => false, "error" => "Email already exists"]);
            } else {
                $query = "INSERT INTO users (full_name, email, password, role, phone) 
                         VALUES ('$full_name', '$email', '$password', '$role', '$phone')";
                
                if(mysqli_query($conn, $query)) {
                    $user_id = mysqli_insert_id($conn);
                    $userQuery = "SELECT user_id, full_name, email, role, phone, created_at FROM users WHERE user_id='$user_id'";
                    $userResult = mysqli_query($conn, $userQuery);
                    $user = mysqli_fetch_assoc($userResult);
                    
                    echo json_encode(["success" => true, "message" => "User registered successfully", "user" => $user]);
                } else {
                    echo json_encode(["success" => false, "error" => mysqli_error($conn)]);
                }
            }
        } else {
            // Login
            $email = mysqli_real_escape_string($conn, $data['email']);
            $password = $data['password'];
            
            $query = "SELECT * FROM users WHERE email='$email'";
            $result = mysqli_query($conn, $query);
            
            if($user = mysqli_fetch_assoc($result)) {
                // For demo, using simple password check. In production, use password_verify()
                if($password == $user['password'] || password_verify($password, $user['password'])) {
                    unset($user['password']);
                    echo json_encode(["success" => true, "user" => $user]);
                } else {
                    echo json_encode(["success" => false, "error" => "Invalid password"]);
                }
            } else {
                echo json_encode(["success" => false, "error" => "User not found"]);
            }
        }
        break;
}
?>