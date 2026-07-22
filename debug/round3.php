<?php
session_start();
include 'db.php';
$user_id = $_GET['user_id'] ?? $_SESSION['user_id'];

// Fetch one random question for each language
$languages = ['C', 'CPP', 'Python'];
$selected_questions = [];

foreach ($languages as $lang) {
    $res = $conn->query("SELECT * FROM round3_questions WHERE language='$lang' ORDER BY RAND() LIMIT 1");
    if ($res) $selected_questions[] = $res->fetch_assoc();
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>mPulse Round 3</title>
    <link rel="stylesheet" href="main.css">
</head>
<body>
    <div class="container">
        <h2>ROUND 3: THE MEMORY TRACE</h2>
        <form action="submit_round3.php" method="POST">
            <input type="hidden" name="user_id" value="<?php echo $user_id; ?>">

            <?php foreach ($selected_questions as $index => $q) { ?>
                <div class="question-card">
                    <h3>Problem <?php echo $index + 1; ?> [<?php echo $q['language']; ?>]</h3>
                    <pre><code><?php echo htmlspecialchars($q['question_text']); ?></code></pre>
                    <input type="hidden" name="qid[]" value="<?php echo $q['id']; ?>">
                    <input type="text" name="ans[]" placeholder="Enter output..." required>
                </div>
            <?php } ?>

            <button type="submit" class="btn-primary">SUBMIT ALL ANSWERS</button>
        </form>
    </div>
</body>
</html>