<?php
session_start();
include 'db.php';

$user_id = $_SESSION['user_id'];

$result = $conn->query("SELECT * FROM round2_questions LIMIT 1");
$row = $result->fetch_assoc();
?>

<!DOCTYPE html>
<html>
<head>
    <title>Round 2</title>
</head>
<body>

<h2>Round 2: Mixed Syntax Challenge</h2>

<h3>Time Left: <span id="timer">300</span> seconds</h3>
<p id="message" style="color:red;"></p>

<form id="quizForm" action="submit_round2.php" method="POST" onsubmit="isSubmitting = true;">

<p><b>Fix the following code:</b></p>

<pre><?php echo $row['question_text']; ?></pre>

<textarea name="answer" rows="10" cols="50" required></textarea>

<br><br>
<button type="submit">Submit Round 2</button>

</form>

<script>

let isSubmitting = false;

window.onbeforeunload = function() {
    if (!isSubmitting) {
        return "If you refresh, your progress may be affected!";
    }
};


history.pushState(null, null, location.href);
window.onpopstate = function () {
    history.go(1);
};

let timeLeft = 300;

let timer = setInterval(() => {
    timeLeft--;

    document.getElementById("timer").innerText = timeLeft;

    if(timeLeft <= 0){
        clearInterval(timer);

        document.getElementById("message").innerText = "Time's up! Submitting...";

        setTimeout(() => {
            isSubmitting = true;
            document.getElementById("quizForm").submit();
        }, 1000);
    }

}, 1000);
</script>

</body>
</html>