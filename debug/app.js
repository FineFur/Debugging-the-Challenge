const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('user_id'); 
console.log("Tracking User:", userId); // If this is null, the PHP will fail.
let gameStarted = false;
let isEvaluating = false;
let r1Questions = [];

const questionPool = {
    c_pure: [
        { 
            target: "PURE C", 
            desc: "Sum of First N and Check Even/Odd", 
            code: "#include <iostream>\nint n=5;\nint sum=0;\nint i=1;\nfor i in range(1,n+1):\n    sum+=i\nif(sum%2==0)\n    printf(\"Even\");\nelse\n    printf(\"Odd\");\nprintf(sum);",
            mustContain: ["for(", "int", "printf(\"%d\",sum);", "stdio.h", "main("], 
            forbidden: ["i in range", "printf(sum);"] 
        },
        { 
            target: "PURE C", 
            desc: "Find Smallest Digit and Count", 
            code: "#include<iostream>\nn=5721;\nmin=9;\ncount=0;\nwhile(n>0){\n    int d=n%10\n    if(d<min)\n        min=d\n    count+=1\n    n//=10;\n}\nprintf(min);\nprintf(count);", 
            mustContain: ["int", "printf(\"%d\",min);", "printf(\"%d\",count);", "stdio.h", "main("], 
            forbidden: ["i in range", "printf(count);", "n//=10;"] 
        },
        { 
            target: "PURE C", 
            desc: "Count Numbers Greater than Average", 
            code: "#include<iostream>\narr[5]={2,4,6,8,10}\nsum=0;\ncount=0;\nfor i in range(5):\n    sum+=arr[i]\n avg=sum/5;\nfor i in range(5):\n    if(arr[i]>avg)\n        count+=1\nprintf(count);", 
            mustContain: ["for(", "int", "printf(\"%d\",count);", "stdio.h", "main("], 
            forbidden: ["i in range", "printf(count);"] 
        },
        { 
            target: "PURE C", 
            desc: "Product of Digits and Check Zero", 
            code: "#include<iostream>\nn=205;\nprod=1;\nflag=0;\nwhile(n>0){\n    d=n%10\n    if(d==0)\n        flag=1\n    prod*=d\n    n//=10;\n}\nprintf(prod);\nprintf(flag);", 
            mustContain: ["int", "printf(\"%d\",flag);", "printf(\"%d\",prod);", "stdio.h", "main("], 
            forbidden: ["i in range", "printf(prod);", "n//=10;"] 
        },
        { 
            target: "PURE C", 
            desc: "Sum of Multiples of 4 and Count", 
            code: "#include<iostream>\nn=12;\nsum=0;\ncount=0;\nfor i in range(1,n+1):\n    if(i%4==0)\n        sum+=i\n        count+=1\nprintf(sum);\nprintf(count);", 
            mustContain: ["for(", "int", "printf(\"%d\",sum);", "printf(\"%d\",count);", "stdio.h", "main("], 
            forbidden: ["i in range", "printf(sum);"] 
        }
    ],
    
    java_pure: [
        { 
            target: "PURE JAVA", 
            desc: "Sum of Digits and Check Odd", 
            code: "#include<stdio.h>\nint n=135;\nint sum=0;\nwhile(n>0){\n    sum+=n%10\n    n//=10;\n}\nif(sum%2!=0)\n    print(\"Odd\")\nelse\n    printf(\"Even\");\nprintf(sum);", 
            mustContain: ["public class", "public static void main", "System.out.println"], 
            forbidden: ["#include", "std", "cin", "cout", "%d", "n//=10"] 
            },
        { 
            target: "PURE JAVA", 
            desc: "Count Elements Less Than 5 and Sum", 
            code: "#include<stdio.h>\n\nint arr[5]={1,6,3,8,2}\nint count=0;\nint sum=0;\nfor i in range(5):\n    if(arr[i]<5):\n        count++\n        sum+=arr[i]\n\nprintln(count);\nprintf(sum);", 
            mustContain: ["public class", "public static void main", "System.out.println", "i="], 
            forbidden: ["#include", "std", "cin", "cout", "%d", "n//=10", "i in range", ":"] 
            },
        { 
            target: "PURE JAVA", 
            desc: "Reverse Number and Check < 50", 
            code: "#include<stdio.h>\n\nint n=42;\nint rev=0;\nwhile(n>0){\n    rev=rev*10+n%10\n    n//=10;\n}\nif(rev<50)\n    cout<<\"Small\";\nelse\n   println(\"Big\");\nprintf(rev);", 
            mustContain: ["public class", "public static void main", "System.out.println"], 
            forbidden: ["#include", "std", "cin", "cout", "%d", "n//=10"] 
            },
        { 
            target: "PURE JAVA", 
            desc: "Sum of Array and Check > 20", 
            code: "#include<stdio.h>\n\nint arr[]={5,7,4,6};\nint sum=0;\nfor i in range(4):\n    sum+=arr[i]\nif(sum>20):\n    print(\"High\")\nelse\n    println(\"Low\");\nprintf(sum);", 
            mustContain: ["public class", "public static void main", "System.out.println", "i="], 
            forbidden: ["#include", "std", "cin", "cout", "%d", "n//=10", "i in range", ":"] 
        }
    ],
    python_pure: [
        { 
            target: "PURE PYTHON", 
            desc: "Sum of First 5 and Count", 
            code: "int sum=0;\nint count=0;\nfor(int i=1;i<=5;i++){\n    sum+=i;\n    count++;\n}\nSystem.out.println(sum);\nSystem.out.println(count);", 
            mustContain: ["print",":", "i in range"], 
            forbidden: [";", "System.out","int", "{"] 
            },
        { 
            target: "PURE PYTHON", 
            desc: "Largest Digit and Sum", 
            code: "public class Large{\nint n=483;\nint max=0;\nint sum=0;\nwhile(n>0){\n    int d=n%10;\n    if(d>max)\n        max=d;\n    sum+=d;\n    n/=10;\n}\nprintf(max);\nprintf(sum);\n}", 
            mustContain: ["print",":"], 
            forbidden: [";", "System.out","int", "public class", "{"]  
            },
        { 
            target: "PURE PYTHON", 
            desc: "Reverse and Count Digits", 
            code: "Public class Reverse{\nint n=321;\nint rev=0;\nint count=0;\nwhile(n>0){\n    rev=rev*10+n%10;\n    count++;\n    n/=10;\n}\nprintf(rev);\nprintf(count);\n}", 
            mustContain: ["print",":"], 
            forbidden: [";", "System.out","int", "public class", "{"]  
            },
        { 
            target: "PURE PYTHON", 
            desc: "Count Positive and Negative", 
            code: "public class Count{\nint arr[]={-2,3,-1,4}\nint pos=0;\nint neg=0;\nfor(int i=0;i<4;i++){\n    if(arr[i]>0)\n        pos++;\n    else\n        neg++;\n}\nSystem.out.println(pos);\nprintf(neg);\n}", 
            mustContain: ["print",":", "for i in"], 
            forbidden: [";", "System.out","int", "public class", "{"] 
        }
    ]
};

// Game State
const GAME_STATE = {
    teamName: '',
    currentRound: 0,
    round1SubLevel: 0,
    round1Attempts: 0,
    round1AccScore: 0,
    score: 0,
    timeRemaining: 0,
    timerInterval: null,
    totalTimeTaken: 0,
    round1TotalAttempts: 0,
    invalidSkip: false,
    isGameOver: false
};

// Configuration
const CONFIG = {
    ROUND_DURATION: 10 * 60,
    TOTAL_ROUNDS: 1,
    POINTS_PER_ROUND: 300,
    TIME_MULTIPLIER: 1
};

// DOM Elements
const appContainer = document.getElementById('app-container');
const topBar = document.getElementById('top-bar');
const timerDisplay = document.getElementById('timer-display');
const scoreDisplay = document.getElementById('score-display');
const roundIndicator = document.getElementById('round-indicator');

// Initialize Application
function init() {
    // Check if user_id exists, then start game directly
    if (userId) {
        startGame();
    } else {
        appContainer.innerHTML = `<div class="panel"><h1>Error: No User ID found</h1></div>`;
    }
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function renderRound1(userDraft = null) {
    const qIndex = GAME_STATE.round1SubLevel;
    const currentQ = r1Questions[qIndex];
    const attemptsLeft = 3 - GAME_STATE.round1Attempts;

    const displayCode = (userDraft !== null) ? userDraft : currentQ.code;

    appContainer.innerHTML = `
    <div class="panel">
        <div class="flex-between" style="border-bottom: 1px solid var(--border-color); padding-bottom: 0.8rem; margin-bottom: 1rem;">
            <div>
                <h2 style="color: var(--accent); margin:0; font-size: 1.5rem; letter-spacing: 1px;">QUESTION ${qIndex + 1} OF 3</h2>
                <div style="margin-top: 5px; font-family: var(--font-mono); font-size: 0.85rem;">
                    <span style="color: var(--text-muted);">CATEGORY:</span> ${currentQ.desc} 
                    <span style="color: var(--text-muted); margin: 0 10px;">|</span>
                    <span style="color: #fff;">TASK:</span> <span style="color: var(--accent); font-weight: bold;">FIX TO ${currentQ.target}</span>
                </div>
            </div>
            <div style="color: var(--error); font-family: var(--font-mono); font-weight: bold; border: 1px solid var(--error); padding: 4px 12px; border-radius: 4px; font-size: 0.9rem;">
                ATTEMPTS LEFT: ${attemptsLeft}
            </div>
        </div>
        
        <div class="editor-container" style="margin-top: 0.5rem;">
            <div class="editor-column">
                <h4 style="color: var(--text-muted); margin-bottom: 6px; font-size: 0.75rem; letter-spacing: 1px;">ORIGINAL FRAGMENT</h4>
                <div class="code-block-display" style="height: 350px;">${escapeHtml(currentQ.code)}</div>
            </div>
            <div class="editor-column">
                <h4 style="color: var(--accent); margin-bottom: 6px; font-size: 0.75rem; letter-spacing: 1px;">YOUR CORRECTION</h4>
                <textarea id="r1-code" spellcheck="false" autocomplete="off" style="height: 350px;">${displayCode}</textarea>
            </div>
        </div>
        
        <div style="display: flex; justify-content: center; gap: 1rem;">
            <button class="btn btn-primary" onclick="evaluateRound1()">SUBMIT_FIX</button>
            <button class="btn" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff;" onclick="skipQuestion()">SKIP_TASK</button>
        </div>
    </div>`;
}

function getRandomSet() {
    // This ensures exactly one question from C, C++, Java, and Python
    const categories = ['c_pure', 'java_pure', 'python_pure']; 
    return categories.map(cat => {
        const list = questionPool[cat];
        return list[Math.floor(Math.random() * list.length)];
    });
}

function startGame() {
    gameStarted = true;
    r1Questions = getRandomSet();
    topBar.classList.remove('hidden');
    scoreDisplay.style.display = 'none'; // HIDDEN SCORE AS REQUESTED

    // --- PERSISTENCE LOGIC ---
    // Calculate the end time (Now + 10 Minutes) and save it
    if (!localStorage.getItem('round_end_timestamp')) {
        const endTime = Date.now() + (CONFIG.ROUND_DURATION * 1000);
        localStorage.setItem('round_end_timestamp', endTime);
    }
    
    GAME_STATE.currentRound = 2;
    GAME_STATE.round1SubLevel = 0;
    GAME_STATE.round1Attempts = 0;
    GAME_STATE.round1TotalAttempts = 0;
    GAME_STATE.invalidSkip = false;
    GAME_STATE.score = 0;
    startRound();
}

function startRound() {
    // Sync the local state with the stored timestamp
    const endTime = parseInt(localStorage.getItem('round_end_timestamp'));
    const now = Date.now();
    GAME_STATE.timeRemaining = Math.max(0, Math.floor((endTime - now) / 1000));

    roundIndicator.textContent = `ROUND ${GAME_STATE.currentRound} - MIXED SYNTAX CHALLENGE`;
    
    clearInterval(GAME_STATE.timerInterval);
    GAME_STATE.timerInterval = setInterval(tick, 1000);
    renderRound1();
}

function tick() {
    // Calculate actual time remaining based on the real clock, not just a counter
    const endTime = parseInt(localStorage.getItem('round_end_timestamp'));
    const now = Date.now();
    // Calculate remaining time based on the fixed end timestamp
    GAME_STATE.timeRemaining = Math.max(0, Math.floor((endTime - now) / 1000));
    GAME_STATE.totalTimeTaken = CONFIG.ROUND_DURATION - GAME_STATE.timeRemaining;

    updateTimerDisplay();

    // If time is up
    if (GAME_STATE.timeRemaining <= 0) {
        clearInterval(GAME_STATE.timerInterval);
        localStorage.removeItem('round_end_timestamp'); // Clear for next round/user
        endGame();
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(GAME_STATE.timeRemaining / 60);
    const seconds = GAME_STATE.timeRemaining % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    if (GAME_STATE.timeRemaining <= 60 && GAME_STATE.timeRemaining > 0) {
        timerDisplay.style.color = 'var(--error)';
        timerDisplay.style.textShadow = '0 0 10px var(--error)';
    } else {
        timerDisplay.style.color = 'var(--accent)';
        timerDisplay.style.textShadow = 'var(--accent-glow)';
    }
}

function updateScoreDisplay() {
    scoreDisplay.textContent = `Score: ${GAME_STATE.score}`;
}

function handleRoundTimeout() {
    showAlert('Time limits reached for this round! Challenge Complete.', () => {
        GAME_STATE.currentRound++;
        startRound();
    });
}

function submitRound(isCorrect, customScore = null) {
    clearInterval(GAME_STATE.timerInterval);

    if (!isCorrect) {
        showAlert(`Failed to pass the challenges. 0 points for this round.\nChallenge Complete.`, () => {
            endGame();
        });
    } else {

        let timeBonus = 0;

        // ✅ Apply skip rule
        if (!GAME_STATE.invalidSkip) {
            timeBonus = GAME_STATE.timeRemaining * CONFIG.TIME_MULTIPLIER;
        }

        let targetScore = 0;
        
        if (customScore !== null) {
            const completionRatio = customScore / CONFIG.POINTS_PER_ROUND;
            timeBonus = Math.floor(timeBonus * completionRatio);
            targetScore = customScore + timeBonus;
        } else {
            targetScore = CONFIG.POINTS_PER_ROUND + timeBonus;
        }

        GAME_STATE.score += targetScore;
        updateScoreDisplay();

        showAlert(`Success! Challenge passed.`, () => {
            endGame();
        });
    }
}


function evaluateRound1() {
    if (isEvaluating) return;
    isEvaluating = true;

    const textarea = document.getElementById('r1-code');
    const userCode = textarea.value; 
    const currentQ = r1Questions[GAME_STATE.round1SubLevel];

    let isCorrect = true;

    console.log("--- EVALUATION START ---");

    // ✅ Your regex logic (unchanged)
    function buildFlexibleRegex(word) {
        let escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        escaped = escaped
            .replace(/\\\(/g, '\\s*\\(\\s*')
            .replace(/\\\)/g, '\\s*\\)')
            .replace(/,/g, '\\s*,\\s*')
            .replace(/:/g, '\\s*:\\s*')
            .replace(/;/g, '\\s*;\\s*');

        return escaped;
    }

    function isPureWord(word) {
        return /^[a-zA-Z0-9_]+$/.test(word);
    }

    // checks...
    currentQ.forbidden.forEach(word => {
        let regex = isPureWord(word)
            ? new RegExp(`\\b${word}\\b`)
            : new RegExp(buildFlexibleRegex(word));

        if (regex.test(userCode)) isCorrect = false;
    });

    currentQ.mustContain.forEach(word => {
        let regex = isPureWord(word)
            ? new RegExp(`\\b${word}\\b`)
            : new RegExp(buildFlexibleRegex(word));

        if (!regex.test(userCode)) isCorrect = false;
    });

    if (currentQ.target !== "PURE PYTHON") {
        const openBraces = (userCode.match(/{/g) || []).length;
        const closeBraces = (userCode.match(/}/g) || []).length;
        if (openBraces !== closeBraces) isCorrect = false;
    }

    // ✅ COUNT ATTEMPT ONLY ONCE
    GAME_STATE.round1Attempts++;
    GAME_STATE.round1TotalAttempts++;

    // 4. FINAL VERDICT
    if (isCorrect) {
        const pointsTable = [100, 90, 80];
        const earned = pointsTable[GAME_STATE.round1Attempts - 1] || 0; // ⚠️ fix index
        GAME_STATE.round1AccScore += earned;

        showAlert("CORRECT!", () => {
            isEvaluating = false;
            progressRound1();
        });

    } else {
        const attemptsLeft = 3 - GAME_STATE.round1Attempts;

        if (attemptsLeft <= 0) {
            showAlert("INCORRECT. Moving to next question.", () => {
                isEvaluating = false;
                progressRound1();
            });
        } else {
            showAlert(`INCORRECT. ${attemptsLeft} attempt(s) remaining.`, () => {
                isEvaluating = false;
                renderRound1(userCode); 
            });
        }
    }
}

function skipQuestion() {

    // ❗ Check attempts before skipping
    if (GAME_STATE.round1Attempts < 2) {
        GAME_STATE.invalidSkip = true;
    }

    showAlert("Question skipped. Moving to the next one (0 points for this task).", () => {
        progressRound1();
    });
}

function progressRound1() {
    GAME_STATE.round1SubLevel++;
    GAME_STATE.round1Attempts = 0;

    if (GAME_STATE.round1SubLevel >= r1Questions.length) {
        submitRound(GAME_STATE.round1AccScore > 0, GAME_STATE.round1AccScore);
    } else {
        renderRound1();
    }
}

// --- Tab Key Support (Add this function) ---
function handleTab(e) {
    if (e.key == 'Tab') {
        e.preventDefault();
        var start = e.target.selectionStart;
        var end = e.target.selectionEnd;

        // Set textarea value to: text before caret + tab + text after caret
        e.target.value = e.target.value.substring(0, start) +
            "    " + e.target.value.substring(end);

        // Put caret at right position
        e.target.selectionStart = e.target.selectionEnd = start + 4;
    }
}

// ==========================================
// End Screen
// ==========================================

function endGame() {
    clearInterval(GAME_STATE.timerInterval);
    localStorage.removeItem('round_end_timestamp'); // CLEAR THE TIMER STORAGE
    GAME_STATE.isGameOver = true;
    
    // Minimalistic overlay to prevent further input during sync
    appContainer.innerHTML = `<div class="panel" style="text-align:center;">
        <h1 style="color:var(--accent);">SYNCHRONIZING...</h1>
    </div>`;

    // 1. Save to DB
    // 2. Redirect immediately with user_id in the URL
    fetch("save_round2_score.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `user_id=${userId}&score=${GAME_STATE.score}`
    })
    .then(() => {
        // Direct redirect to Round 3 with the ID
        window.location.href = `round3.html?user_id=${userId}`;
    })
    .catch(err => {
        console.error("Sync failed:", err);
        // Fallback redirect even if fetch fails to keep the flow moving
        window.location.href = `round3.html?user_id=${userId}`;
    });
}
 

// ==========================================
// Fullscreen & Admin Controls
// ==========================================

function enforceFullscreen() {
    const docElm = document.documentElement;
    let req;
    if (docElm.requestFullscreen) {
        req = docElm.requestFullscreen();
    } else if (docElm.mozRequestFullScreen) {
        req = docElm.mozRequestFullScreen();
    } else if (docElm.webkitRequestFullScreen) {
        req = docElm.webkitRequestFullScreen();
    } else if (docElm.msRequestFullscreen) {
        req = docElm.msRequestFullscreen();
    } else {
        req = Promise.resolve();
    }
    
    return req.then(() => {
        if ('keyboard' in navigator && navigator.keyboard && navigator.keyboard.lock) {
            navigator.keyboard.lock(['Escape', 'F11']).catch(err => console.warn("Keyboard lock failed:", err));
        }
    });
}

function recoverFullscreen() {
    enforceFullscreen().then(() => {
        document.getElementById('fullscreen-warning').classList.add('d-none');
    }).catch(err => {
        showAlert("Please allow fullscreen to continue the challenge.");
    });
}

document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);

function handleFullscreenChange() {
    const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement;
    
    if (!isFullscreen && gameStarted && !GAME_STATE.isGameOver && !GAME_STATE.isAdminUnlocked) {
        // Show a "Security Violation" overlay
        appContainer.innerHTML = `
            <div class="panel text-center" style="border-color: var(--error);">
                <h1 style="color: var(--error);">SECURITY ALERT</h1>
                <p>Fullscreen mode exited. This is a violation of challenge rules.</p>
                <button class="btn btn-primary mt-2" onclick="recoverFullscreen()">RE-ENTER FULLSCREEN</button>
            </div>
        `;
        clearInterval(GAME_STATE.timerInterval); // Pause visual timer until they return
    } else if (isFullscreen && gameStarted) {
        // Resume the game
        if (!GAME_STATE.timerInterval) {
            GAME_STATE.timerInterval = setInterval(tick, 1000);
        }
        renderRound1(); 
    }
}

function lockHotkeys(e) {
    if ((e.key === 'F11' || e.code === 'F11' || e.keyCode === 122 || e.key === 'Escape' || e.code === 'Escape' || e.keyCode === 27) && 
        GAME_STATE.currentRound > 0 && !GAME_STATE.isAdminUnlocked && !GAME_STATE.isGameOver) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
}

window.addEventListener('keydown', lockHotkeys, true);
window.addEventListener('keyup', lockHotkeys, true);
window.addEventListener('keypress', lockHotkeys, true);

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
        if (!GAME_STATE.isGameOver && !GAME_STATE.isAdminUnlocked && GAME_STATE.currentRound > 0) {
            document.getElementById('admin-modal').classList.remove('d-none');
            document.getElementById('admin-user').focus();
        }
    }
});

function verifyAdmin() {
    const user = document.getElementById('admin-user').value;
    const pass = document.getElementById('admin-pass').value;
    
    if (user === 'admin' && pass === 'admin123') { 
        GAME_STATE.isAdminUnlocked = true;
        closeAdminModal();
        document.getElementById('fullscreen-warning').classList.add('d-none');
        
        if (navigator.keyboard && navigator.keyboard.unlock) {
            navigator.keyboard.unlock();
        }
        
        const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
        if (isFullscreen) {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(() => {});
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
        showAlert("Admin unlocking successful. Fullscreen constraints removed.");
    } else {
        showAlert("Invalid Admin Credentials!");
    }
}

function closeAdminModal() {
    document.getElementById('admin-modal').classList.add('d-none');
    document.getElementById('admin-user').value = '';
    document.getElementById('admin-pass').value = '';
}

['copy', 'cut', 'paste', 'contextmenu', 'drop'].forEach(evt => {
    document.addEventListener(evt, (e) => {
        if (GAME_STATE.currentRound > 0 && !GAME_STATE.isGameOver && !GAME_STATE.isAdminUnlocked) {
            e.preventDefault();
        }
    });
});

function showAlert(message, onCloseCallback = null) {
    const alertEl = document.getElementById('custom-alert');
    const msgEl = document.getElementById('custom-alert-message');
    msgEl.textContent = message;
    alertEl.classList.remove('d-none');
    window.currentAlertCallback = onCloseCallback;
}

function closeCustomAlert() {
    document.getElementById('custom-alert').classList.add('d-none');
    if (typeof window.currentAlertCallback === 'function') {
        const cb = window.currentAlertCallback;
        window.currentAlertCallback = null;
        cb();
    }
}

// Prevent accidental refresh/closing
window.onbeforeunload = function() {
    if (gameStarted && !GAME_STATE.isGameOver) {
        return "Warning: Your progress will be lost and the timer will continue to run!";
    }
};

// Block standard refresh hotkeys (F5, Ctrl+R)
window.addEventListener('keydown', function(e) {
    if ((e.which || e.keyCode) == 116 || (e.ctrlKey && (e.which || e.keyCode) == 82)) {
        if (!GAME_STATE.isAdminUnlocked) {
            e.preventDefault();
            showAlert("Refresh is disabled during the challenge!");
        }
    }
});

// --- ANTI-CHEAT SILENT MONITOR ---
let violationCount = 0;

function reportViolation(type) {
    // 1. Prepare Data
    const formData = new FormData();
    formData.append('user_id', userId); // Make sure 'userId' variable is defined globally
    formData.append('type', type);
    

    // 2. SILENT REPORT
    fetch("log_violation.php", {
        method: "POST",
        body: formData // Use FormData instead of URLSearchParams
    })
    .then(response => response.text())
    .then(data => console.log("Server Response:", data)) // Check console for "SUCCESS"
    .catch(err => console.error("Network Error:", err));

    // 3. UI LOCKOUT
    pauseGameForSecurity();
}

function pauseGameForSecurity() {
    clearInterval(GAME_STATE.timerInterval);
    GAME_STATE.timerInterval = null;

    appContainer.innerHTML = `
        <div class="panel" style="border: 2px solid var(--error); text-align: center;">
            <h1 style="color: var(--error);">SYSTEM LOCKED</h1>
            <p style="color: #fff; margin: 20px 0;">
                Unauthorized window/tab switch detected. 
                <br><b>This incident has been logged.</b>
            </p>
            <div style="background: rgba(255, 51, 102, 0.1); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <span style="color: var(--error); font-weight: bold;">TIMER IS RUNNING. CONTINUE IMMEDIATELY.</span>
            </div>
            <button class="btn btn-primary" onclick="resumeAfterViolation()">RESUME_CHALLENGE</button>
        </div>
    `;
}

function resumeAfterViolation() {
    // Just restart the timer and re-render the question
    startRound(); 
}

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

// window.addEventListener('blur', () => {
//     reportViolation('window_blur');
// });

window.onload = init;
console.log("INIT RUNNING");
