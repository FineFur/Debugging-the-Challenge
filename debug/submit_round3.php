<?php
include 'db.php';

$user_id = $_SESSION['user_id'];
$qids = $_POST['qid'];
$user_answers = $_POST['ans'];
$total_r3_score = 0;

for ($i = 0; $i < count($qids); $i++) {
    $qid = intval($qids[$i]);
    $ans = trim($user_answers[$i]);
    
    $res = $conn->query("SELECT dead_lines, marks FROM round3_questions WHERE id=$qid")->fetch_assoc();
    
    if ($ans === $res['dead_lines']) {
        $total_r3_score += 333; // Approx 1000 divided by 3
    }
}

// Final Score Update
$conn->query("UPDATE scores 
              SET round3_score = $total_r3_score, 
                  total_score = round1_score + round2_score + $total_r3_score 
              WHERE participant_id = $user_id");

header("Location: final_leaderboard.php");
exit();
?>