const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('user_id');



// ==========================================
// Round 3: Hidden Bug Hunt - Unified Implementation
// ==========================================

// --- Game State ---
const GAME_STATE = {
    teamName: 'Participant',
    currentRound: 3,
    score: 0,
    timeRemaining: 0,
    timerInterval: null,
    totalTimeTaken: 0,
    isGameOver: false,
    isGameActive: false,
    // Round 3 specific state
    currentQuestionIdx: 0,
    activeQuestions: [],
    attempts: 0,
    accScore: 0,
    currentUserCode: null, // New: track user progress between attempts
    editorFontSize: 14
};

// --- Configuration ---
const CONFIG = {
    ROUND_DURATION: 10 * 60, // 10 minutes in seconds
    TOTAL_ROUNDS: 3,
    POINTS_PER_ROUND: 400, // Normalized for scaling
    TIME_MULTIPLIER: 1     // Points per second remaining
};

// --- Questions Data ---

const r3JavaQuestions = [
    {
        level: "Easy",
        lang: "Java",
        langColor: "#f89820",
        desc: "Arrays & Iteration - Employee Salary Processor",
        title: "Q1.java",
        problem: "Calculate total salary after bonus (10% if salary > 5000).",
        buggyCode:
            `public class Q1 {
    public void main(String[] args) {
        int salaries[] = {4000, 6000, 7000};
        int total = 0;

        for(int i = 0; i <= salaries.length; i++){
            if(salaries[i] > 5000);
                salaries[i] = salaries[i] + (int)(salaries[i] * 0.1);

            total += salaries[i];
        }

        int avg = total / salaries.length;

        if(avg > 6000) 
            System.out.println("High Payroll");
            System.out.println("Average: " + avg);
   
        if(total = 0){
            System.out.println("No Data");
        }
    }
}`,
        checks: [
            { desc: "Missing static in main method", pass: (c) => /public\s+static\s+void\s+main/.test(c) },
            { desc: "Loop out of bounds", pass: (c) => /i\s*<\s*salaries\.length/.test(c) },
            { desc: "Semicolon after if breaks logic", pass: (c) => !/if\s*\(\s*salaries\s*\[\s*i\s*\]\s*>\s*5000\s*\)\s*;/.test(c) },
            { desc: "Missing braces in second if", pass: (c) => /if\s*\(\s*avg\s*>\s*6000\s*\)\s*\{[\s\S]*System\.out\.println\s*\(\s*"Average:\s*"\s*\+\s*avg\s*\)\s*;[\s\S]*\}/.test(c) },
            { desc: "Assignment in if(total = 0)", pass: (c) => /if\s*\(\s*total\s*==\s*0\s*\)/.test(c) }
        ]
    },
    {
        level: "Moderate",
        lang: "Java",
        langColor: "#f89820",
        desc: "Logic - Online Quiz Score Analyzer",
        title: "Q2.java",
        problem: "Count correct answers and display result.\nBugs:\nâ€¢ Missing class, static and String is string\nâ€¢ Loop out of bounds\nâ€¢ Assignment in condition if(answers[i] = 1)\nâ€¢ if(...); ignored\nâ€¢ Assignment in last condition",
        buggyCode:
            `public Q2 {
    public void main(string[] args) {
        int answers[] = {1,0,1,1,0};
        int correct = 0;	
        for(int i = 0; i <= answers.length; i++){
            if(answers[i] = 1){
                correct++;
            }
        }
        if(correct >= 3);
            System.out.println("Passed");
        System.out.println("Score: " + correct);
        if(correct = 0){
            System.out.println("No correct answers");
        }
    }
}`,
        checks: [
            { desc: "Fix class and main method signature", pass: (c) => /public\s+class\s+Q2/.test(c) && /public\s+static\s+void\s+main\s*\(\s*String\s*\[\s*\]\s*args\s*\)/.test(c) },
            { desc: "Loop out of bounds", pass: (c) => /i\s*<\s*answers\.length/.test(c) },
            { desc: "Equality check (answers[i] == 1)", pass: (c) => /if\s*\(\s*answers\s*\[\s*i\s*\]\s*==\s*1\s*\)/.test(c) },
            { desc: "Remove semicolon after if(correct >= 3)", pass: (c) => !/if\s*\(\s*correct\s*>=\s*3\s*\)\s*;/.test(c) },
            { desc: "Equality check (correct == 0)", pass: (c) => /if\s*\(\s*correct\s*==\s*0\s*\)/.test(c) }
        ]
    },
    {
        level: "Moderate",
        lang: "Java",
        langColor: "#f89820",
        desc: "I/O & Logic - Grocery Bill Calculator",
        title: "GroceryBill.java",
        problem: "A shopkeeper wants to calculate total bill after discount. If bill > ₹1000 → 10% discount.",
        buggyCode:
            `import java.util.;

public class GroceryBill {
    public static main(string[] args) {
        Scanner sc = new Scanner(System.in);

        double price = sc.nextInt();  
        int quantity = sc.nextDouble();     

        double total = price * quantity;

        if(total > 1000);
            total = total - (total * 0.1);

        System.out.println("Total Bill: " + total);
        sc.close();
    }
}`,
        checks: [
            { desc: "Fix import statement", pass: (c) => /import\s+java\.util\.\*\s*;/.test(c) },
            { desc: "Fix main method signature (void, String)", pass: (c) => /public\s+static\s+void\s+main\s*\(\s*String\s*\[\s*\]\s*args\s*\)/.test(c) },
            { desc: "Correct Scanner input for price", pass: (c) => /double\s+price\s*=\s*sc\.nextDouble\(\)/.test(c) },
            { desc: "Correct Scanner input for quantity", pass: (c) => /int\s+quantity\s*=\s*sc\.nextInt\(\)/.test(c) },
            { desc: "Remove semicolon after if", pass: (c) => !/if\s*\(\s*total\s*>\s*1000\s*\)\s*;/.test(c) }
        ]
    },
    {
        level: "Moderate",
        lang: "Java",
        langColor: "#f89820",
        desc: "Logic - Library Fine System",
        title: "LibraryFine.java",
        problem: "Fine ₹5/day. If days > 10 → ₹100 flat fine.",
        buggyCode:
            `import java.util.

public class LibraryFine {
    public static void main(string[] args) {
        Scanner sc = new Scanner(System.out);

        int days = sc.nextDouble();

        if(days < 0) {
            System.out.println("Invalid input");
            return;
        }

        int fine;

        if(days > 10)
            fine = 100;
        else
            fine = days * 5;

        System.out.println("Fine: " + fine);
        sc.close();
    }
}`,
        checks: [
            { desc: "Fix import statement", pass: (c) => /import\s+java\.util\.\*\s*;/.test(c) },
            { desc: "Capitalize String in main array", pass: (c) => /String\s*\[\s*\]\s*args/.test(c) },
            { desc: "Scanner reads from System.in", pass: (c) => /new\s+Scanner\s*\(\s*System\.in\s*\)/.test(c) },
            { desc: "Scanner reads integer (nextInt)", pass: (c) => /sc\.nextInt\(\)/.test(c) },
            { desc: "Retain fine calculation (days * 5)", pass: (c) => /fine\s*=\s*days\s*\*\s*5/.test(c) }
        ]
    },
    {
        level: "Moderate",
        lang: "Java",
        langColor: "#f89820",
        desc: "Logic - Gym Membership Fee",
        title: "GymFee.java",
        problem: "Monthly fee ₹1000. If membership > 6 months → 20% discount.",
        buggyCode:
            `import java.util.;

public GymFee {
   static void main(string[] args) {
        Scanner sc = new Scanner(System.in);

        int months = sc.nextInt();

        if(months <= 0) {
            System.out.println("Invalid input");
            return;
        }

        double fee = months * 1000;

        if(months > 6);
            fee = fee - (fee * 20);

        System.out.println("Fee: " + fee);
        sc.close();
    }
}`,
        checks: [
            { desc: "Fix import and class declaration", pass: (c) => /import\s+java\.util\.\*\s*;/.test(c) && /public\s+class\s+GymFee/.test(c) },
            { desc: "Fix main method signature", pass: (c) => /public\s+static\s+void\s+main\s*\(\s*String\s*\[\s*\]\s*args\s*\)/.test(c) },
            { desc: "Remove semicolon after if", pass: (c) => !/if\s*\(\s*months\s*>\s*6\s*\)\s*;/.test(c) },
            { desc: "Correct 20% discount calculation", pass: (c) => /fee\s*-\s*\(\s*fee\s*\*\s*0\.2\s*\)/.test(c) || /fee\s*\*=\s*0\.8/.test(c) || /fee\s*-\s*\(\s*fee\s*\*\s*20\s*\/\s*100(\.0)?\s*\)/.test(c) },
            { desc: "Ensure Scanner closes", pass: (c) => /sc\.close\(\)/.test(c) }
        ]
    }
];

const r3HtmlQuestions = [
    {
        level: "Moderate",
        lang: "HTML/JS",
        langColor: "#f06529",
        desc: "DOM & Logic - Cart Total",
        title: "cart.html",
        problem: "Calculate the total price of items entered as comma-separated values and apply a 10% discount if total exceeds ₹500.",
        buggyCode: `<!DOCTYPE html>
<html>
<head>
    <title>Cart Total</title>
<body>

<input id="prices" placeholder="Enter prices (e.g. 100,200,300)">
<button onbuttonclick ="calcTotal">Calculate<button>
<p id="output"></p>

<script>
function calcTotal {
    let prices = document.getElementByName("prices").value;
    let arr = prices.split(",");
    let total = 0;

    for (let i = 0, i < arr.lengt, i++) {
        total += Number(arr[j]);
    }

    if (total > 500) {
        total -= total * 0.1;
    };

    document. getElementByName ("output").innerHTML = total;
}
</script>

</body>
</html>`,
        checks: [
            { desc: "Close head tag", pass: (c) => /<\/head>/.test(c) },
            { desc: "Close button tag", pass: (c) => /<\/button>/.test(c) },
            { desc: "Fix button onclick and function call", pass: (c) => /onclick\s*=\s*(['"])calcTotal\(\)\1/.test(c) },
            { desc: "Fix getElementById for prices", pass: (c) => /document\.getElementById\s*\(\s*(['"])prices\1\s*\)/.test(c) },
            { desc: "Fix array length access and semicolon in loop", pass: (c) => /for\s*\(\s*let\s+i\s*=\s*0\s*;\s*i\s*<\s*arr\.length\s*;\s*i\+\+\s*\)\s*\{/i.test(c) },
            { desc: "Use correct array index arr[i]", pass: (c) => /Number\s*\(\s*arr\s*\[\s*i\s*\]\s*\)/.test(c) },
            { desc: "Add parentheses to function declaration", pass: (c) => /function\s+calcTotal\(\)/.test(c) },
            { desc: "Remove semicolon after if block", pass: (c) => !/if\s*\(\s*total\s*>\s*500\s*\)\s*\{[\s\S]*\}\s*;/.test(c) }
        ]
    },
    {
        level: "Moderate",
        lang: "HTML/JS",
        langColor: "#f06529",
        desc: "DOM & Logic - Grade Checker",
        title: "grade.html",
        problem: "Calculate the average of marks entered and display \"Pass\" if average is at least 40.",
        buggyCode: `<!DOCSTYPE html>
<html>
<head>
    <title>Grade Checker<title>
</head>
<body>

<input id=marks placeholder="Enter marks (e.g. 50 60 70)">
<button onbuttonclick="checkGrade">Check</button>
<p id="result"></p>

<script>
function checkGrade() {
    int marks = document.getElementById("marks").value;
    String  arr = marks.split(" ");
    int sum = 0;

    for (let i = 0, i < arr.length, i++) {
        sum += Number(arr[j]);
    }

    let avg = sum / arr.length;

    if (avg >= 40) {
        document.getElementByName("result").innerHTML = "Pass";
    } else {
        document.getElementByName("result").innerHTML = "Fail";
    }
}
</script>

</body>
</html>`,
        checks: [
            { desc: "Fix DOCTYPE declaration", pass: (c) => /<!DOCTYPE\s+html>/.test(c) },
            { desc: "Close title tag properly", pass: (c) => /<\/title>/.test(c) },
            { desc: "Fix button onclick and function call", pass: (c) => /onclick\s*=\s*(['"])checkGrade\(\)\1/.test(c) },
            { desc: "Use let/const instead of int/String", pass: (c) => /(let|const)\s+marks\s*=/.test(c) && /(let|const)\s+arr\s*=/.test(c) },
            { desc: "Fix loop definition semicolons", pass: (c) => /for\s*\(\s*let\s+i\s*=\s*0\s*;\s*i\s*<\s*arr\.length\s*;\s*i\+\+\s*\)\s*\{/.test(c) },
            { desc: "Use getElementById instead of getElementByName", pass: (c) => !/getElementByName/.test(c) && /document\.getElementById\s*\(\s*(['"])result\1\s*\)/.test(c) },
            { desc: "Use arr[i] instead of arr[j]", pass: (c) => /Number\s*\(\s*arr\s*\[\s*i\s*\]\s*\)/.test(c) },
            { desc: "Add quotes to input id", pass: (c) => /id\s*=\s*(['"])marks\1/.test(c) }
        ]
    },
    {
        level: "Moderate",
        lang: "HTML/JS",
        langColor: "#f06529",
        desc: "DOM & Logic - Login Validation",
        title: "login.html",
        problem: "Validate login credentials by checking if username is \"admin\" and password is \"1234\".",
        buggyCode: `<!DOSTYPE html>
<html>
<head>
    <title>Login</title>
</head>
<body>

<input id="user" placeholder="Username" src=â€â€>
<input id="pass" placeholder="Password">
<button onclick="login()">Login</button>
<p id="msg"></p>

<script>
function login() {
    let u = document.getElementById("user").value;
    let p = document.getElementById("pass").value;

    if (u === "admin" && q === "1234") {
        document.getElementByClassName("msg").innerText = "Login Success";
    } else {
        document.getElementByClassName("msg").innerHTML = "Login Failed";
    }
}

<body>
</script>`,
        checks: [
            { desc: "Fix DOCTYPE declaration", pass: (c) => /<!DOCTYPE\s+html>/.test(c) },
            { desc: "Remove src attribute from input", pass: (c) => !/<input[^>]+src=[^>]*>/.test(c) && /<input\s+id="user"\s+placeholder="Username"\s*>/.test(c) },
            { desc: "Fix comparison variable q to p", pass: (c) => /p\s*===\s*['"]1234['"]/.test(c) },
            { desc: "Use getElementById for msg", pass: (c) => /document\.getElementById\s*\(\s*['"]msg['"]\s*\)/.test(c) && !/getElementByClassName/.test(c) },
            { desc: "Use innerHTML for Success msg", pass: (c) => /\.innerHTML\s*=\s*['"]Login Success['"]/.test(c) },
            { desc: "Close body tag correctly", pass: (c) => /<\/body>/.test(c) && !/<body>\s*<\/script>/.test(c) },
            { desc: "Close html tag correctly", pass: (c) => /<\/html>/.test(c) },
            { desc: "Close script tag properly at the end", pass: (c) => /<\/script>\s*[\s\S]*<\/body>\s*[\s\S]*<\/html>/.test(c) }
        ]
    },
    {
        level: "Moderate",
        lang: "HTML/JS",
        langColor: "#f06529",
        desc: "DOM & Logic - Electricity Bill",
        title: "bill.html",
        problem: "Calculate electricity bill at ₹5 per unit and add 20% surcharge if units exceed 100.",
        buggyCode: `<!DOCTYPE html>
<xml>
<head>
    <title>Electricity Bill</title>
</head>
<body>

<input id="units" placeholder="Enter units">
<button onclick="calcBill()">Calculate</button>
<pid="bill"></p>

<script>
function calcBill {
    int units = document.getElementById("unit").value;
    bill = units * 5;

    if (units > 100) {
        bill += bill * 0.2;
    }

    document.getElementByClass("bill").innerHTML = "Bill:  + (bill + 10)â€;
}
</script>

</body>
</xml>`,
        checks: [
            { desc: "Use html tag instead of xml", pass: (c) => /<html>/.test(c) && /<\/html>/.test(c) && !/<xml>/.test(c) && !/<\/xml>/.test(c) },
            { desc: "Fix paragraph tag format", pass: (c) => /<p\s+id\s*=\s*['"]bill['"]>[\s\S]*<\/p>/.test(c) },
            { desc: "Add parentheses to function declaration", pass: (c) => /function\s+calcBill\(\)/.test(c) },
            { desc: "Use let/const and correct Number parsing for units", pass: (c) => /(let|const)\s+units\s*=\s*Number\s*\(\s*document\.getElementById\s*\(\s*['"]units['"]\s*\)\.value\)/.test(c) || /(let|const)\s+units\s*=\s*document\.getElementById\s*\(\s*['"]units['"]\s*\)\.value;?/.test(c) && /Number/.test(c) },
            { desc: "Declare bill with let", pass: (c) => /let\s+bill\s*=\s*units\s*\*\s*5/.test(c) },
            { desc: "Use getElementById instead of getElementByClass", pass: (c) => /document\.getElementById\s*\(\s*['"]bill['"]\s*\)/.test(c) && !/getElementByClass/.test(c) },
            { desc: "Fix string concatenation", pass: (c) => /\.innerHTML\s*=\s*['"]Bill:\s*['"]\s*\+\s*\(\s*bill\s*\+\s*10\s*\)/.test(c) }
        ]
    },
    {
        level: "Moderate",
        lang: "HTML/JS",
        langColor: "#f06529",
        desc: "Logic - Password Checker",
        title: "pwd.html",
        problem: "Check if a password is at least 6 characters long and contains at least one number.",
        buggyCode: `<DOCTYPE html>
<html>
<head>
    <title>Password Check<title>
<head>
<body>

<input id="pwd" placeholder="Enter password">
<button onclick="check()">Check<button>
<p id="res"><p>

<script>
function check() {
    let p = document.getElementById("pwd").value;

    if (p.length >= 6) {
        if (/\\d/.test(q)) {
            document.getElementById("res").innerHTML = "Strong";
        } else {
            document.getElementByClass("res").innerHTML = Weak;
        }
    } else 
        document.getElementById("res").innerHTML = "Too Short";
}
<script>

<body>
<html>`,
        checks: [
            { desc: "Fix DOCTYPE tag", pass: (c) => /<!DOCTYPE\s+html>/.test(c) && !/<DOCTYPE html>/.test(c) },
            { desc: "Close head and title tags properly", pass: (c) => /<\/title>/.test(c) && /<\/head>/.test(c) },
            { desc: "Close button and p tags properly", pass: (c) => /<\/button>/.test(c) && /<\/p>/.test(c) },
            { desc: "Fix regex target to 'p'", pass: (c) => /\/\\d\/\.test\s*\(\s*p\s*\)/.test(c) },
            { desc: "Use getElementById and 'Weak' as string", pass: (c) => /document\.getElementById\s*\(\s*['"]res['"]\s*\)\.innerHTML\s*=\s*['"]Weak['"]/.test(c) },
            { desc: "Close script tag properly", pass: (c) => /<\/script>/.test(c) },
            { desc: "Close body and html tags properly", pass: (c) => /<\/body>\s*<\/html>/.test(c) },
            { desc: "Add brackets to else condition", pass: (c) => /else\s*\{\s*document\.getElementById\s*\(\s*(['"])res\1\s*\)\.innerHTML\s*=\s*(['"])Too Short\2\s*;\s*\}/.test(c) }
        ]
    }
];

const r3CQuestions = [
    {
        level: "Moderate",
        lang: "C",
        langColor: "#00599C",
        desc: "Memory - String Reverser",
        title: "reverse.c",
        problem: "A function is supposed to take a string, dynamically allocate memory for a reversed copy, and return it. However, it's corrupted or leaking memory. Find the bugs.",
        buggyCode:
            `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char* reverseString(char* str) {
    if (str == NULL) return NULL;
    
    int len = sizeof(str); 
    char* reversed = (char*)malloc(len); 

    for (int i = 0; i < len; i++) {
        reversed[i] = str[len - i]; 
    }
    
    return reversed;
}

int main() {
    char* original = "Hello World";
    char* rev = reverseString(original);
    
    if (rev != NULL) {
        printf("Original: %s\\n", original);
        printf("Reversed: %s\\n", rev);
    }
    
    return 0;
}`,
        checks: [
            { desc: "Use strlen() for length", pass: (c) => /int\s+len\s*=\s*strlen\s*\(\s*str\s*\)\s*;/.test(c) },
            { desc: "Allocate space for null terminator (+1)", pass: (c) => /malloc\s*\(\s*len\s*\+\s*1\s*\)/.test(c) },
            { desc: "Fix loop off-by-one (len - 1 - i)", pass: (c) => /reversed\s*\[\s*i\s*\]\s*=\s*str\s*\[\s*len\s*-\s*1\s*-\s*i\s*\]/.test(c) },
            { desc: "Add manual null terminator (\\0)", pass: (c) => /reversed\s*\[\s*len\s*\]\s*=\s*['"]\\0['"]\s*;/.test(c) },
            { desc: "Free memory in main", pass: (c) => /free\s*\(\s*rev\s*\)\s*;/.test(c) }
        ]
    },
    {
        level: "Moderate",
        lang: "C",
        langColor: "#00599C",
        desc: "Structs - Student Roster",
        title: "students.c",
        problem: "A program manages student records using a struct. It attempts to initialize a student and calculate an average, but has errors. Find the bugs.",
        buggyCode:
            `#include <stdio.h>
#include <string.h>

typedef struct {
    char name[50];
    int grades[3];
    float average;
} Student;

void calculateAverage(Student* s) {
    int sum = 0;
    for (int i = 0; i <= 3; i++) {
        sum += s.grades[i]; 
    }
    s->average = sum / 3; 
}

int main() {
    Student s1;
    s1.name = "Alice"; 
    s1.grades[0] = 85;
    s1.grades[1] = 90;
    s1.grades[2] = 92;

    calculateAverage(&s1);
    
    int age;
    printf("Enter student age: ");
    scanf("%d", age); 

    printf("Student: %s, Average: %.2f\\n", s1.name, s1.average);
    return 0;
}`,
        checks: [
            { desc: "Pointer access operator (s->grades)", pass: (c) => /s\s*->\s*grades\s*\[\s*i\s*\]/.test(c) },
            { desc: "Correct loop bounds (i < 3)", pass: (c) => /i\s*<\s*3/.test(c) },
            { desc: "Float division (3.0)", pass: (c) => /sum\s*\/\s*3\.0/.test(c) || /\(float\)\s*sum\s*\/\s*3/.test(c) },
            { desc: "String copy (strcpy)", pass: (c) => /strcpy\s*\(\s*s1\.name\s*,\s*['"]Alice['"]\s*\)\s*;/.test(c) },
            { desc: "Scanf address-of (&age)", pass: (c) => /scanf\s*\(\s*['"]%d['"]\s*,\s*&age\s*\)\s*;/.test(c) }
        ]
    },
    {
        level: "Hard",
        lang: "C",
        langColor: "#00599C",
        desc: "Files - System Logger",
        title: "logger.c",
        problem: "A utility function is meant to append log messages to a file. It clears the file and crashes on errors. Find the bugs.",
        buggyCode:
            `#include <stdio.h>
#include <stdlib.h>

#define MAX_BUFFER 50

void appendLog(char* msg) {
    FILE *fp = fopen("app.log", "w"); 
    
    char buffer[MAX_BUFFER];
    sprintf(buffer, "LOG: %s\\n", msg); 

    fputs(buffer, fp);
}

int main() {
    char* messages[] = {
        "System Started", 
        "Loading Modules...", 
        "Initialization complete without any errors"
    };
    
    for(int i = 0; i < 4; i++) { 
        appendLog(messages[i]);
    }
    
    return 0;
}`,
        checks: [
            { desc: "Append mode (fopen 'a')", pass: (c) => /fopen\s*\(\s*['"]app\.log['"]\s*,\s*['"]a['"]\s*\)/.test(c) },
            { desc: "NULL check for file pointer", pass: (c) => /if\s*\(\s*fp\s*==\s*NULL\s*\)\s*return\s*;/.test(c) },
            { desc: "Buffer protection (snprintf)", pass: (c) => /snprintf\s*\(\s*buffer\s*,\s*MAX_BUFFER\s*,/.test(c) },
            { desc: "Close file (fclose)", pass: (c) => /fclose\s*\(\s*fp\s*\)\s*;/.test(c) },
            { desc: "Loop bounds in main (i < 3)", pass: (c) => /i\s*<\s*3/.test(c) && /for\s*\(int\s+i\s*=\s*0/.test(c) }
        ]
    },
    {
        level: "Hard",
        lang: "C",
        langColor: "#00599C",
        desc: "Pointers - Linked List Initializer",
        title: "linked_list.c",
        problem: "A program attempts to build a singly linked list by inserting nodes at the head, but the logic is broken. Find the bugs.",
        buggyCode:
            `#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    Node* next; 
} Node;

void push(Node* head, int newData) { 
    Node* newNode = (Node*)malloc(sizeof(Node*)); 
    
    newNode->data = newData;
    newNode->next = head;
    head = newNode; 
}

void printList(Node* head) {
    Node* temp = head;
    while (temp != NULL) {
        printf("%d -> ", temp->data);
        temp++; 
    }
    printf("NULL\\n");
}

int main() {
    Node* head = NULL;
    push(head, 10);
    push(head, 20);
    
    printList(head);
    
    free(head); 
    return 0;
}`,
        checks: [
            { desc: "Struct self-reference (struct Node*)", pass: (c) => /struct\s+Node\s*\*\s*next\s*;/.test(c) },
            { desc: "Correct malloc size (sizeof(Node))", pass: (c) => /malloc\s*\(\s*sizeof\s*\(\s*Node\s*\)\s*\)/.test(c) },
            { desc: "Pass by reference (Node** head_ref)", pass: (c) => /void\s+push\s*\(\s*Node\s*\*\*\s*\w+/.test(c) && /push\s*\(\s*&head\s*,/.test(c) },
            { desc: "List traversal logic (temp->next)", pass: (c) => /temp\s*=\s*temp\s*->\s*next\s*;/.test(c) },
            { desc: "Comprehensive free() loop", pass: (c) => /while\s*\(.*!=\s*NULL\s*\)[\s\S]*free/.test(c) }
        ]
    },
    {
        level: "Moderate",
        lang: "C",
        langColor: "#00599C",
        desc: "Logic - Bubble Sorter",
        title: "bubble_sort.c",
        problem: "A bubble sort implementation compiles but doesn't sort and has out-of-bounds risks. Find the bugs.",
        buggyCode:
            `#include <stdio.h>

void swap(int a, int b) { 
    int temp = a;
    a = b;
    b = temp;
}

void sortArray(int* arr, int size) {
    for (int i = 0; i < size; i++) {
        for (int j = 0; j < size; j++) { 
            if (arr[j] > arr[j+1]) { 
                swap(arr[j], arr[j+1]); 
            }
        }
    }
}

int main() {
    int data[] = {5, 2, 9, 1, 5, 6};
    int size = sizeof(data); 
    
    sortArray(&data, size); 
    
    for(int i = 0; i < 6; i++) {
        printf("%d ", data[i]);
    }
    printf("\\n");
    return 0;
}`,
        checks: [
            { desc: "Array element count (sizeof/sizeof)", pass: (c) => /sizeof\s*\(\s*data\s*\)\s*\/\s*sizeof\s*\(\s*data\s*\[\s*0\s*\]\s*\)/.test(c) },
            { desc: "Pass array pointer correctly", pass: (c) => /sortArray\s*\(\s*data\s*,\s*size\s*\)\s*;/.test(c) },
            { desc: "Swap by reference (int* a, int* b)", pass: (c) => /void\s+swap\s*\(\s*int\s*\*\s*a\s*,\s*int\s*\*\s*b\s*\)/.test(c) && /swap\s*\(\s*&arr\s*\[\s*j\s*\]\s*,\s*&arr\s*\[\s*j\s*\+\s*1\s*\]\s*\)/.test(c) },
            { desc: "Fix inner loop bounds (size - i - 1 or size - 1)", pass: (c) => /j\s*<\s*size\s*-\s*([i1]\s*-\s*[i1]|1)/.test(c) },
            { desc: "Remove array address operator (&data)", pass: (c) => !/sortArray\s*\(\s*&data/.test(c) && /sortArray\s*\(\s*data\s*,/.test(c) }
        ]
    }
];

const r3PythonQuestions = [
    {
        level: "Easy",
        lang: "Python",
        langColor: "#306998",
        desc: "Logic - Count Even Numbers",
        title: "q1.py",
        problem: "Count Even Numbers",
        buggyCode: `def count_even(nums):
    count = 0
    for i in range(len(nums)):
        if nums % 2 == 0:
            count = count + 1
        elif nums[i] % 0 == 2:
            count += 0
        else:
            count =+ 0
    return count

data = [2,4,5,6,7,8]
print(count_even(data))`,
        checks: [
            { desc: "Fix condition to use nums[i] % 2 == 0", pass: (c) => /nums\s*\[\s*i\s*\]\s*%\s*2\s*==\s*0/.test(c) },
            { desc: "Increment count correctly", pass: (c) => /count\s*\+=\s*1|count\s*=\s*count\s*\+\s*1/.test(c) },
            { desc: "Remove erroneous modulo by zero", pass: (c) => !/%\s*0/.test(c) },
            { desc: "Remove count =+ 0", pass: (c) => !/count\s*=\+\s*0/.test(c) }
        ]
    },
    {
        level: "Easy",
        lang: "Python",
        langColor: "#306998",
        desc: "Logic - Sum of List",
        title: "q2.py",
        problem: "Sum of List",
        buggyCode: `def sum_list(nums):
    total = 0
    for i in range(len(nums)):
        total += nums[i]
        if i == len(nums):
            break
        total = total + nums
    return total

print(sum_list([1,2,3,4]))`,
        checks: [
            { desc: "Accumulate total properly", pass: (c) => /total\s*\+=\s*nums\s*\[\s*i\s*\]|total\s*=\s*total\s*\+\s*nums\s*\[\s*i\s*\]/.test(c) },
            { desc: "Remove unreachable break condition", pass: (c) => !/if\s+i\s*==\s*len/.test(c) && !/break/.test(c) },
            { desc: "Remove invalid addition of list", pass: (c) => !/total\s*\+\s*nums(?!\[)/.test(c) }
        ]
    },
    {
        level: "Easy",
        lang: "Python",
        langColor: "#306998",
        desc: "Logic - Check Positive Numbers",
        title: "q3.py",
        problem: "Check Positive Numbers",
        buggyCode: `def check_positive(nums):
    result = True
    for i in range(len(nums)):
        if nums[i] < 0:
            result == False
        if nums[i] == 0:
            result = result or False
    return result

print(check_positive([1,2,0,3]))`,
        checks: [
            { desc: "Check for nums[i] <= 0", pass: (c) => /if\s+nums\s*\[\s*i\s*\]\s*<=\s*0\s*:/.test(c) || /if\s*nums\s*\[\s*i\s*\]\s*<=\s*0\s*:/.test(c) || /if\s+nums\s*\[\s*i\s*\]\s*<\s*0\s*or\s*nums\s*\[\s*i\s*\]\s*==\s*0/.test(c) },
            { desc: "Assign False to result properly", pass: (c) => /result\s*=\s*False/.test(c) },
            { desc: "Remove result == False", pass: (c) => !/result\s*==\s*False/.test(c) },
            { desc: "Remove result = result or False", pass: (c) => !/result\s*=\s*result\s*or\s*False/.test(c) }
        ]
    },
    {
        level: "Easy",
        lang: "Python",
        langColor: "#306998",
        desc: "Logic - Find Maximum",
        title: "q4.py",
        problem: "Find Maximum",
        buggyCode: `def find_max(nums):
    maximum = nums[0]
    for i in range(1, len(nums)):
        if nums[i] > maximum:
            maximum == nums[i]
        elif nums[i] < maximum:
            maximum = maximum
    return maximum

print(find_max([3,7,2,9,5]))`,
        checks: [
            { desc: "Assign correctly maximum = nums[i]", pass: (c) => /maximum\s*=\s*nums\s*\[\s*i\s*\]/.test(c) },
            { desc: "Remove maximum == nums[i]", pass: (c) => !/maximum\s*==\s*nums/.test(c) },
            { desc: "Remove useless maximum = maximum", pass: (c) => !/elif\s*nums\s*\[\s*i\s*\]\s*<\s*maximum\s*:[\s\S]*maximum\s*=\s*maximum/.test(c) }
        ]
    },
    {
        level: "Easy",
        lang: "Python",
        langColor: "#306998",
        desc: "Logic - Count Occurrences",
        title: "q5.py",
        problem: "Count Occurrences",
        buggyCode: `def count_occ(lst, key):
    count = 0
    for i in range(len(lst)):
        if lst[i] = key:
            count += 1
        if lst[i] == key:
            count =+ 1
    return count

print(count_occ([1,2,2,3,2], 2))`,
        checks: [
            { desc: "Use == for comparison", pass: (c) => /if\s+lst\s*\[\s*i\s*\]\s*==\s*key\s*:/.test(c) },
            { desc: "Remove invalid lst[i] = key", pass: (c) => !/if\s+lst\s*\[\s*i\s*\]\s*=\s*key\s*:/.test(c) },
            { desc: "Increment correctly count += 1", pass: (c) => /count\s*\+=\s*1|count\s*=\s*count\s*\+\s*1/.test(c) },
            { desc: "Remove count =+ 1", pass: (c) => !/count\s*=\+\s*1/.test(c) }
        ]
    }
];

// --- DOM Elements ---
const appContainer = document.getElementById('app-container');
const topBar = document.getElementById('top-bar');
const timerDisplay = document.getElementById('timer-display');
const roundIndicator = document.getElementById('round-indicator');

// --- Initialization ---
function init() {
    // Check if user_id exists, then start game directly
    if (userId) {
        startGame();
    } else {
        appContainer.innerHTML = `<div class="panel"><h1>Error: No User ID found</h1></div>`;
    }
}

function startGame() {
    topBar.classList.remove('hidden');
    GAME_STATE.currentRound = 3;
    GAME_STATE.score = 0;
    GAME_STATE.totalTimeTaken = 0;
    GAME_STATE.isGameActive = true;

    // --- PERSISTENCE LOGIC ---
    // Calculate the end time (Now + 10 Minutes) and save it
    if (!localStorage.getItem('round_end_timestamp')) {
        const endTime = Date.now() + (CONFIG.ROUND_DURATION * 1000);
        localStorage.setItem('round_end_timestamp', endTime);
    }

    requestFullscreen();
    startRound();
}

function startRound() {
    // Sync the local state with the stored timestamp
    const endTime = parseInt(localStorage.getItem('round_end_timestamp'));
    const now = Date.now();
    GAME_STATE.timeRemaining = Math.max(0, Math.floor((endTime - now) / 1000));

    roundIndicator.textContent = `ROUND ${GAME_STATE.currentRound} - HIDDEN BUG CHALLENGE`;

    clearInterval(GAME_STATE.timerInterval);
    GAME_STATE.timerInterval = setInterval(tick, 1000);
    renderRound3();
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

// --- Round 3 Logic ---
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function renderRound3() {
    // Pick 1 random from each pool
    const javaQ = shuffleArray([...r3JavaQuestions])[0];
    const htmlQ = shuffleArray([...r3HtmlQuestions])[0];
    const cQ = shuffleArray([...r3CQuestions])[0];
    const pythonQ = shuffleArray([...r3PythonQuestions])[0];

    GAME_STATE.activeQuestions = shuffleArray([javaQ, htmlQ, cQ, pythonQ]);
    GAME_STATE.currentQuestionIdx = 0;
    GAME_STATE.attempts = 0;
    GAME_STATE.accScore = 0;
    GAME_STATE.currentUserCode = null; // Clear on load
    renderRound3Question();
}

function renderRound3Question() {
    const q = GAME_STATE.activeQuestions[GAME_STATE.currentQuestionIdx];
    const attemptsLeft = 3 - GAME_STATE.attempts;
    const currentCode = GAME_STATE.currentUserCode !== null ? GAME_STATE.currentUserCode : q.buggyCode;

    appContainer.innerHTML = `
    <div class="panel" style="max-width: 800px; width: 100%; padding: 1.8rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <div style="display:flex; align-items:center; gap:0.6rem;">
                <p style="margin:0; color:var(--accent); font-size:0.95rem; font-weight:600;">Question ${GAME_STATE.currentQuestionIdx + 1} of 4 <span style="visibility:hidden;">&nbsp;[${q.level}] Ã¢â‚¬â€ ${q.desc}</span></p>
                <span style="background: ${q.langColor}; color: #fff; font-size: 0.7rem; font-weight: bold; padding: 2px 9px; border-radius: 10px; visibility: hidden;">${q.lang}</span>
            </div>
            <span id="r3-attempts-badge" style="background: rgba(255,51,102,0.15); color: var(--error); border: 1px solid var(--error); padding: 4px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: bold; white-space: nowrap;">Attempts Left: ${attemptsLeft}</span>
        </div>
        <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1.2rem; line-height:1.5;"><strong style="color:#fff;">TASK:</strong> ${q.problem}</p>
        <div style="margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                <h4 style="color:var(--accent); font-size:0.85rem; margin:0;">Source Code (${q.title})</h4>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn" style="padding: 2px 10px; font-size: 0.8rem; font-weight: bold;" onclick="zoomEditor(1)">+</button>
                    <button class="btn" style="padding: 2px 10px; font-size: 0.8rem; font-weight: bold;" onclick="zoomEditor(-1)">-</button>
                </div>
            </div>
            <textarea id="r3-code" class="round3-editor" style="font-size: ${GAME_STATE.editorFontSize}px;" oncopy="return true" onpaste="return true" oncut="return true" ondrop="return true" oncontextmenu="return false" spellcheck="false">${currentCode}</textarea>
        </div>
        <div style="display: flex; justify-content: center; gap: 1rem;">
            <button class="btn btn-primary" onclick="evaluateRound3Question()">SUBMIT_FIX</button>
            <button class="btn" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff;" onclick="skipQuestion()">SKIP_TASK</button>
        </div>    </div>`;

}

function evaluateRound3Question() {
    const code = document.getElementById('r3-code').value;
    GAME_STATE.currentUserCode = code; // Save current state
    const q = GAME_STATE.activeQuestions[GAME_STATE.currentQuestionIdx];
    const results = q.checks.map(c => { try { return c.pass(code); } catch (e) { return false; } });
    const allPassed = results.every(r => r === true);

    if (allPassed) {
        let pts = 0;
        if (GAME_STATE.attempts === 0) pts = 100;
        else if (GAME_STATE.attempts === 1) pts = 90;
        else if (GAME_STATE.attempts === 2) pts = 80;
        GAME_STATE.accScore += pts;

        // Check if it is the final question (Index 3 is the 4th question)
        if (GAME_STATE.currentQuestionIdx >= 3) {
            showAlert(`Correct!\nChallenge Complete!`, () => { progressRound3(); });
        } else {
            showAlert(`Correct!\nMoving to next question...`, () => { progressRound3(); });
        }
    } else {
        GAME_STATE.attempts++;
        const left = 3 - GAME_STATE.attempts;
        if (left <= 0) {
            showAlert('Incorrect. Out of attempts!\nMoving to next question.', () => { progressRound3(); });
        } else {
            showAlert(`Not all checks passed. ${left} attempt(s) left.`, () => {
                const badge = document.getElementById('r3-attempts-badge');
                if (badge) badge.textContent = `Attempts Left: ${left}`;
            });
        }
    }
}

function skipQuestion() {
    // Optional: Log the skip to your database if you want to track it
    // logCheat("QUESTION_SKIPPED"); 

    showAlert("Question skipped. Moving to the next one (0 points for this task).", () => {
        progressRound3();
    });
}

function progressRound3() {
    GAME_STATE.currentQuestionIdx++;
    GAME_STATE.attempts = 0;
    GAME_STATE.currentUserCode = null; // Reset for next challenge
    if (GAME_STATE.currentQuestionIdx < 4) {
        renderRound3Question();
    } else {
        submitRound(GAME_STATE.accScore > 0, GAME_STATE.accScore);
    }
}

function submitRound(isCorrect, customScore = null) {
    clearInterval(GAME_STATE.timerInterval);

    if (!isCorrect) {
        endGame();
    } else {
        // ❌ Removed time bonus
        GAME_STATE.score = customScore;
        endGame();
    }
}

function zoomEditor(delta) {
    const minSize = 10;
    const maxSize = 24;
    GAME_STATE.editorFontSize = Math.max(minSize, Math.min(maxSize, GAME_STATE.editorFontSize + (delta * 2)));
    const editor = document.getElementById('r3-code');
    if (editor) {
        editor.style.fontSize = GAME_STATE.editorFontSize + 'px';
    }
}

// --- Security & Utilities ---
function requestFullscreen() {
    const docElm = document.documentElement;
    if (docElm.requestFullscreen) docElm.requestFullscreen().catch(() => { });
}

function reEnterFullscreen() {
    document.getElementById('fullscreen-lockout').classList.add('d-none');
    requestFullscreen();
}

function setupFullscreenListeners() {
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement && GAME_STATE.isGameActive && !GAME_STATE.isGameOver) {
            document.getElementById('fullscreen-lockout').classList.remove('d-none');
        }
    });
}

function escapeHtml(unsafe) {
    return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function endGame() {
    clearInterval(GAME_STATE.timerInterval);
    localStorage.removeItem('round_end_timestamp');
    GAME_STATE.isGameOver = true;

    fetch("save_round3_score.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `user_id=${userId}&score=${GAME_STATE.score}`
    })
        .then(() => {
            // Ã¢Å“â€¦ Redirect to thank page
            window.location.href = `thank.php?user_id=${userId}`;
        })
        .catch(() => {
            // even if DB fails, still redirect
            window.location.href = `thank.php?user_id=${userId}`;
        });
}

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
window.onbeforeunload = function () {
    if (gameStarted && !GAME_STATE.isGameOver) {
        return "Warning: Your progress will be lost and the timer will continue to run!";
    }
};

// Block standard refresh hotkeys (F5, Ctrl+R)
window.addEventListener('keydown', function (e) {
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
    formData.append('round', 3);


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
        // If user comes back quickly Ã¢â€ â€™ cancel violation
        if (tabSwitchTimer) {
            clearTimeout(tabSwitchTimer);
            tabSwitchTimer = null;
        }
    }
});

window.onload = init;
