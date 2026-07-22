<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>M-Pulse | Debugging Challenge</title>
    <link rel="stylesheet" href="login.css">
</head>
<body>

    <img src="pes_logo.png" class="logo left-logo" alt="PES Logo">
    <img src="mpulse_logo.png" class="logo right-logo" alt="MPulse Logo">

    <div class="main-wrapper">
        
        <div class="rules-container neon-border">
            <h3>RULES & WARNINGS</h3>
            <ul class="rules-list">
                <li class="crit">Do not refresh or minimize the browser.</li>
                <li class="crit">Do not press the 'Back' button.</li>
                <li class="crit">Do not change variables name anywhere.</li>
                <li>The event has 3 rounds (10 minutes each).</li>
                <li>Participants will be given code snippets with bugs.</li>
                <li>Identify and fix syntax, runtime, or logical errors.</li>
                <li>Internet or external help is strictly prohibited.</li>
                <li>Evaluation based on correctness and efficiency.</li>
                <li>Tie-breaker: Fastest completion time.</li>
                <li>Any misconduct leads to disqualification.</li>
                <li class="info">Judges’ decision will be final.</li>
            </ul>
        </div>

        <div class="login-container">
            <div class="brand-header">
                <p>PES Modern College of Engineering</p>
                <h2 class="neon-text">M-PULSE 2026</h2>
                <div class="badge">DEBUGGING CHALLENGE</div>
            </div>

            <div class="login-card neon-border">
                <form action="save_user.php" method="POST">
                    <input type="text" name="name" placeholder="Enter Your Name" required>
                    <input type="text" name="team" placeholder="Enter Team Name" required>
                    <button type="submit">START CHALLENGE</button>
                </form>
            </div>
        </div>

    </div>

</body>
</html>