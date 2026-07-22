<?php
session_start();
include 'db.php';

$user_id = $_SESSION['user_id'];

$user_answer = strtolower($_POST['answer']);

$result = $conn->query("SELECT * FROM round2_questions LIMIT 1");
$row = $result->fetch_assoc();

$keywords = explode(";", strtolower($row['expected_keywords']));

$score = 0;

foreach($keywords as $key){
    if(strpos($user_answer, $key) !== false){
        $score += 10;
    }
}

// Update total score
$conn->query("
    UPDATE scores 
    SET round2_score = $score,
        total_score = total_score + $score
    WHERE participant_id = $user_id
");



// Go to next round
header("Location: round3.php");
?>