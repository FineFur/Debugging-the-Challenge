<?php
session_start();
include 'db.php';

if(!isset($_SESSION['round1_ids'])){
    header("Location: round1.php");
    exit();
}

$user_id = $_SESSION['user_id'];
$base_score = 0;
$ids = $_SESSION['round1_ids'];

// 1. Calculate Base Score
foreach($ids as $qid){
    $qid = intval($qid);
    $res = $conn->query("SELECT correct_answer, marks FROM questions WHERE id=$qid");
    $row = $res->fetch_assoc();
    
    if(isset($_POST["q$qid"])){
        // Ensure comparison matches your DB values exactly
        if($_POST["q$qid"] == $row['correct_answer']){
            $base_score += (int)$row['marks'];
        }
    }
}

// 2. Calculate Time Bonus
$total_time_allowed = 600; 
$time_taken = time() - $_SESSION['start_time'];
$time_remaining = $total_time_allowed - $time_taken;

$time_bonus = 0;
if ($time_remaining > 10 && $base_score > 90) {
    $time_bonus = floor($time_remaining / 10); 
}

$total_round_score = $base_score + $time_bonus;

// 3. Save Score (Using Prepared Statements is safer, but keeping your logic style)
$sql = "INSERT INTO scores (participant_id, round1_score, total_score) 
        VALUES ('$user_id', '$total_round_score', '$total_round_score')
        ON DUPLICATE KEY UPDATE 
        round1_score = $total_round_score,
        total_score = $total_round_score";

$conn->query($sql);

// 4. Update Participant Progress
$conn->query("UPDATE participants SET current_round = 2 WHERE id = '$user_id'");

// 5. Clear Session variables
unset($_SESSION['start_time']);
unset($_SESSION['round1_ids']);

// --- THE CRITICAL CHANGE ---
// We use JavaScript to clear LocalStorage and then Redirect.
?>
<!DOCTYPE html>
<html>
<head>
    <title>Processing...</title>
    <style>
        body { background: #0a0a0a; color: #00ffcc; font-family: 'Courier New', monospace; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .loader { border: 2px solid #1a1a1a; border-top: 2px solid #00ffcc; border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div style="text-align: center;">
        <div class="loader" style="margin: 0 auto 20px;"></div>
        <p>SYNCHRONIZING SCORES...</p>
        <p style="font-size: 0.8rem; color: #555;">Cleaning local cache...</p>
    </div>

    <script>
        // 1. Force remove the Round 1 timer
        localStorage.removeItem('r1_end_timestamp');
        
        // 2. Optional: Log to console for debugging
        console.log("Round 1 Handled. Redirecting to Round 2.");

        // 3. Redirect to Round 2 after a tiny delay to ensure storage is cleared
        setTimeout(() => {
            window.location.href = "round2.html?user_id=<?php echo $user_id; ?>";
        }, 1200);
    </script>
</body>
</html>