<?php
session_start();
include 'db.php';

$name = $_POST['name'];
$team = $_POST['team'];

$sql = "INSERT INTO participants (name, team_name) VALUES ('$name', '$team')";

if ($conn->query($sql) === TRUE) {
    
    $_SESSION['user_id'] = $conn->insert_id; // store participant id

    // set round = 1
    $conn->query("UPDATE participants SET current_round = 1 WHERE id = ".$_SESSION['user_id']);

    header("Location: round1.php");
} else {
    echo "Error: " . $conn->error;
}
?>