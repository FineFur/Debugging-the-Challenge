<?php
include 'db.php';

$user_id = $_GET['user_id'] ?? '';

$teamName = "UNKNOWN";

if ($user_id) {
    $query = "SELECT team_name FROM participants WHERE id = '$user_id'";
    $result = mysqli_query($conn, $query);

    if ($row = mysqli_fetch_assoc($result)) {
        $teamName = $row['team_name'];
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Thank You</title>

<style>
:root {
    --primary: #0a0f1c;
    --panel: #0f172a;
    --accent: #3b82f6;
    --accent-soft: #60a5fa;
    --text: #e2e8f0;
}

body {
    margin: 0;
    height: 100vh;
    font-family: 'Segoe UI', monospace;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #e2e8f0;
    overflow: hidden;

    background: linear-gradient(
        -45deg,
        #020617,
        #0a0f1c,
        #0f172a,
        #020617
    );
    background-size: 400% 400%;
    animation: gradientMove 12s ease infinite;
}
@keyframes gradientMove {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

/* Subtle grid (clean, not loud) */
body::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(rgba(59,130,246,0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(59,130,246,0.08) 1px, transparent 1px);
    background-size: 80px 80px;
    z-index: 0;
}

/* Main panel */
.panel {
    width: 700px;
    padding: 3rem;
    background: linear-gradient(145deg, #0f172a, #020617);
    border: 1px solid rgba(59,130,246,0.2);
    border-radius: 12px;
    position: relative;
    z-index: 1;
    box-shadow: 0 10px 40px rgba(0,0,0,0.8);
    animation: fadeUp 0.6s ease;
}

/* Entry animation */
@keyframes fadeUp {
    from {
        opacity: 0;
        transform: translateY(40px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Header */
h1 {
    color: var(--accent-soft);
    letter-spacing: 2px;
    margin: 0;
    font-size: 1.8rem;
}

h2 {
    font-size: 1.5rem;
    margin: 0;
}

/* Status line */
.status {
    font-size: 0.8rem;
    color: #94a3b8;
}

/* Divider */
hr {
    border: none;
    border-top: 1px solid rgba(59,130,246,0.2);
    margin: 2rem 0;
}

/* Icon */
.glitch-icon {
    font-size: 3rem;
    color: var(--accent);
    animation: pulse 2s infinite ease-in-out;
}

@keyframes pulse {
    0%,100% { opacity: 0.7; }
    50% { opacity: 1; }
}

/* Content */
.outro-content {
    opacity: 0;
    animation: fadeIn 1s ease forwards;
    animation-delay: 0.3s;
}

@keyframes fadeIn {
    to { opacity: 1; }
}

/* Footer */
.footer {
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
    font-size: 0.75rem;
    color: #64748b;
}

/* Access badge */
.access-box {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    padding: 10px 20px;
    font-weight: bold;
    color: white;
    border-radius: 6px;
    letter-spacing: 1px;
    box-shadow: 0 4px 15px rgba(59,130,246,0.4);
}

/* ===== Animated Cyber Background Layer ===== */
body::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;

    background: linear-gradient(
        120deg,
        transparent 30%,
        rgba(59,130,246,0.08),
        transparent 70%
    );

    animation: lightSweep 6s linear infinite;
}

/* Floating light movement */
@keyframes moveLights {
    0% {
        transform: translate(0, 0) scale(1);
    }
    100% {
        transform: translate(-40px, -30px) scale(1.1);
    }
}

@keyframes lightSweep {
    from {
        transform: translateX(-100%);
    }
    to {
        transform: translateX(100%);
    }
}

/* Optional: subtle floating particles */
body::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 0;

    background-image: radial-gradient(rgba(59,130,246,0.4) 1px, transparent 1px);
    background-size: 60px 60px;

    animation: particleMove 20s linear infinite;
    opacity: 0.2;
}

@keyframes particleMove {
    from {
        transform: translateY(0);
    }
    to {
        transform: translateY(100px);
    }
}
</style>
</head>

<body>

<div class="panel">
    
    <div style="display: flex; align-items: center; gap: 1rem;">
        <div class="glitch-icon">⚡</div>
        <div>
            <h1>M-TECHNOPHILIA</h1>
            <div class="status">STATUS: SESSION_CLOSED</div>
        </div>
    </div>

    <hr>

    <div class="outro-content">
        <h2 style="">
    Challenge completed. Well played, Team
    <span style="color:#3b82f6;">
        <?php echo strtoupper($teamName); ?>
    </span>
</h2>
        <p style="color:#94a3b8;">
            Your debugging session has been completed successfully. Winners will be declared soon.
        </p>
    </div>

    <div class="footer">
        <div>
            >> CONNECTION_SECURE: TRUE<br>
            >> LOGS_SAVED: 100%<br>
            >> EXIT_CODE: 0x00
        </div>

        <div class="access-box">
            ACCESS CLOSED
        </div>
    </div>

</div>

</body>
</html>