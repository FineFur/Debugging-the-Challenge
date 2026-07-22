<?php


include 'db.php'; 

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get data and sanitize
    $user_id = mysqli_real_escape_string($conn, $_POST['user_id']);
    $type = mysqli_real_escape_string($conn, $_POST['type']);
    $round = isset($_POST['round']) ? intval($_POST['round']) : 2; 
    $now = date("Y-m-d H:i:s");

    // Check if user already has a record for this round
    $check = "SELECT id, total_count FROM cheat_logs WHERE user_id = '$user_id' AND round_number = $round LIMIT 1";
    $result = mysqli_query($conn, $check);

    if (mysqli_num_rows($result) > 0) {
        // UPDATE existing record
        $row = mysqli_fetch_assoc($result);
        $new_count = $row['total_count'] + 1;
        $sql = "UPDATE cheat_logs SET total_count = $new_count, last_detected_at = '$now' WHERE id = " . $row['id'];
    } else {
        // INSERT new record
        $sql = "INSERT INTO cheat_logs (user_id, violation_type, total_count, last_detected_at, round_number) 
                VALUES ('$user_id', '$type', 1, '$now', $round)";
    }

    if (mysqli_query($conn, $sql)) {
        echo "SUCCESS";
    } else {
        echo "SQL ERROR: " . mysqli_error($conn);
    }
    
    mysqli_close($conn);
}
?>