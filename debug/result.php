<?php
session_start();
include 'db.php';

$user_id = $_SESSION['user_id'];

$result = $conn->query("
    SELECT * FROM scores 
    WHERE participant_id = $user_id
");

$row = $result->fetch_assoc();
?>

<!DOCTYPE html>
<html>
<head>
    <title>Final Result</title>
</head>
<body>

<h2>🎉 Debugging Challenge Completed!</h2>

<h3>Wait for leaderboard results...</h3>

<h3>Your Scores:</h3>

<p>Round 1: <?php echo $row['round1_score']; ?></p>
<p>Round 2: <?php echo $row['round2_score']; ?></p>
<p>Round 3: <?php echo $row['round3_score']; ?></p>

<h2>Total Score: <?php echo $row['total_score']; ?></h2>

</body>
</html>