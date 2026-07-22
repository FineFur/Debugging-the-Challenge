<?php
session_start();
include 'db.php';

$user_id = $_SESSION['user_id'];
$_SESSION['round1_ids'] = [];
$counter = 1;

// Fetching 4 random questions for each language section
$c_qs = $conn->query("SELECT * FROM questions WHERE language='C' ORDER BY RAND() LIMIT 4");
$cpp_qs = $conn->query("SELECT * FROM questions WHERE language='C++' ORDER BY RAND() LIMIT 4");
$python_qs = $conn->query("SELECT * FROM questions WHERE language='Python' ORDER BY RAND() LIMIT 4");
$java_qs = $conn->query("SELECT * FROM questions WHERE language='Java' ORDER BY RAND() LIMIT 4");

// Store start time to calculate bonus later
if (!isset($_SESSION['start_time'])) {
    $_SESSION['start_time'] = time();
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Round 1 - Debugging</title>
    <link rel="stylesheet" href="main.css">
</head>
<body>

<div class="top-bar">
    <div class="left-section"><h2>DEBUGGING CHALLENGE</h2></div>
    <div class="center-section">
        <h3 class="nav-subtitle">Round 1: BUG OR NO BUG</h3>
        <div class="status-grid">
            <?php for($i = 1; $i <= 16; $i++) { ?>
                <div class="node" id="node-<?php echo $i; ?>"><?php echo $i; ?></div>
            <?php } ?>
        </div>
    </div>
    <div class="right-section">
        <div class="timer">⏱ <span id="timer">10:00</span>s</div>
    </div>
</div>

<div class="container">
    <form id="quizForm" action="submit_round1.php" method="POST">
        <div class="section-title">Section 1: C Language</div>
        <?php while($row = $c_qs->fetch_assoc()) { 
            $_SESSION['round1_ids'][] = $row['id']; 
            renderQuestion($row, $counter++);
        } ?>

        <div class="section-title">Section 2: C++</div>
        <?php while($row = $cpp_qs->fetch_assoc()) { 
            $_SESSION['round1_ids'][] = $row['id']; 
            renderQuestion($row, $counter++);
        } ?>

        <div class="section-title">Section 3: Python</div>
        <?php while($row = $python_qs->fetch_assoc()) { 
            $_SESSION['round1_ids'][] = $row['id']; 
            renderQuestion($row, $counter++);
        } ?>

        <div class="section-title">Section 4: Java</div>
        <?php while($row = $java_qs->fetch_assoc()) { 
            $_SESSION['round1_ids'][] = $row['id']; 
            renderQuestion($row, $counter++);
        } ?>

        <div class="submit-box">
            <button type="submit">Submit Round 1</button>
        </div>
    </form>
</div>

<?php
// Helper function to keep HTML clean
function renderQuestion($row, $idx) { ?>
    <div class="question-card">
        <pre><?php echo htmlspecialchars($row['question_text']); ?></pre>
        <div class="options">
            <label class="btn-opt"><input type="radio" name="q<?php echo $row['id']; ?>" value="Bug" data-idx="<?php echo $idx; ?>" onchange="markComplete(this)"> Bug</label>
            <label class="btn-opt"><input type="radio" name="q<?php echo $row['id']; ?>" value="No Bug" data-idx="<?php echo $idx; ?>" onchange="markComplete(this)"> No Bug</label>
        </div>
    </div>
<?php } ?>

<script>
const userId = "<?php echo $_SESSION['user_id']; ?>";
const ROUND_DURATION = 600; // 10 minutes

function initTimer() {
    // 1. Check if a timer already exists for Round 1
    let endTime = localStorage.getItem('r1_end_timestamp');

    if (!endTime) {
        // First time loading: set the end time
        endTime = Date.now() + (ROUND_DURATION * 1000);
        localStorage.setItem('r1_end_timestamp', endTime);
    }

    // 2. Start the interval
    const timerInterval = setInterval(() => {
        const now = Date.now();
        const timeLeft = Math.max(0, Math.floor((endTime - now) / 1000));

        // Convert seconds to MM:SS
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        // Format with leading zero (e.g., 10:05 instead of 10:5)
        const formattedTime = 
            String(minutes).padStart(2, '0') + ":" + 
            String(seconds).padStart(2, '0');

        // Update Display
        document.getElementById("timer").innerText = formattedTime;

        // Visual warning
        if (timeLeft <= 60) {
            document.getElementById("timer").style.color = "red";
        }

        // Auto-submit on expiry
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            localStorage.removeItem('r1_end_timestamp');
            document.getElementById("quizForm").submit();
        }
    }, 1000);
}

// --- GLOBAL CONFIGURATION ---
const USER_ID = "<?php echo $_SESSION['user_id']; ?>";
const ROUND_NUM = 1;

// --- SILENT SENTRY: VIOLATION REPORTER ---
function reportViolation(type) {
    // 1. Prepare the data
    const formData = new FormData();
    formData.append('user_id', USER_ID);
    formData.append('type', type);
    formData.append('round', ROUND_NUM);

    // 2. Send to PHP Log (Using navigator.sendBeacon for reliability on tab close)
    if (navigator.sendBeacon) {
        navigator.sendBeacon("log_violation.php", formData);
    } else {
        fetch("log_violation.php", { method: "POST", body: formData });
    }

    // 3. Optional: Visual warning to the student
    console.warn(`SECURITY_ALERT: ${type} detected and logged.`);
}

// --- EVENT LISTENERS ---

// A. Detect Tab Switching
let tabSwitchTimer = null;

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        // Start timer when tab becomes hidden
        tabSwitchTimer = setTimeout(() => {
            reportViolation('tab_switch');
        }, 2000); // 2 seconds threshold
    } else {
        // If user comes back quickly → cancel violation
        if (tabSwitchTimer) {
            clearTimeout(tabSwitchTimer);
            tabSwitchTimer = null;
        }
    }
});

// B. Detect Window Minimizing / Task Switching (Alt+Tab)
// window.addEventListener('blur', () => {
//     reportViolation('window_blur');
// });

// C. Block Refresh Keys (F5 and Ctrl+R)
window.addEventListener('keydown', (e) => {
    // F5 key
    if (e.keyCode === 116) {
        e.preventDefault();
        showSecurityWarning("Refresh is disabled.");
    }
    // Ctrl+R or Cmd+R
    if ((e.ctrlKey || e.metaKey) && e.keyCode === 82) {
        e.preventDefault();
        showSecurityWarning("Reloading is unauthorized.");
    }
});

// D. Block Right Click (Prevents "Inspect Element" cheating)
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// --- HELPER: Visual Warning ---
function showSecurityWarning(msg) {
    // You can use your custom alert here
    if (typeof showAlert === "function") {
        showAlert(`⚠️ SECURITY: ${msg}`);
    } else {
        alert(`⚠️ SECURITY: ${msg}`);
    }
}

function markComplete(input) {
    const node = document.getElementById('node-' + input.getAttribute('data-idx'));
    if (node) node.classList.add('completed');
}

// Disable back button
history.pushState(null, null, location.href);
window.onpopstate = function () {
    history.pushState(null, null, location.href);
    showSecurityWarning("Back navigation is disabled.");
};

// Initialize on load
window.onload = initTimer;
</script>
</body>
</html>