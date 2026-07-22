<?php
include 'db.php';

$user_id = $_POST['user_id'];
$score = intval($_POST['score']);

$conn->query("
    UPDATE scores 
    SET round2_score = $score,
        total_score = total_score + $score
    WHERE participant_id = $user_id
");
?>