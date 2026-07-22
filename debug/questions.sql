-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Apr 09, 2026 at 02:52 PM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `debug_event`
--

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
CREATE TABLE IF NOT EXISTS `questions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `question_text` text,
  `correct_answer` varchar(10) DEFAULT NULL,
  `marks` int DEFAULT '10',
  `language` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`id`, `question_text`, `correct_answer`, `marks`, `language`) VALUES
(1, 'int a = 5, b;\nb = a++ + ++a;\nprintf(\"%d\", b);', 'No Bug', 10, 'C'),
(2, 'char *p = \"Hello\";\nprintf(\"%c\", p[1]);', 'No Bug', 10, 'C'),
(3, '#define SQUARE(x) (x * x)\nint main() {\n    int result = SQUARE(5);\n    return 0;\n}', 'No Bug', 10, 'C'),
(4, 'int vals[] = {10, 20, 30};\nint *ptr = vals;\nprintf(\"%d\", *(ptr + 2));', 'No Bug', 10, 'C'),
(5, 'int check = 2;\nswitch (check) {\n    case 1: printf(\"One\");\n    case 2: printf(\"Two\");\n    case 3: printf(\"Three\");\n    default: printf(\"Done\");\n}', 'No Bug', 10, 'C'),
(6, 'float f = 0.1;\nif (f == 0.1) {\n    printf(\"Equal\");\n} else {\n    printf(\"Not Equal\");\n}', 'Bug', 10, 'C'),
(7, 'int x = 10;\nif (x = 5);\n{\n    printf(\"X is five\");\n}', 'Bug', 10, 'C'),
(8, 'int arr[5] = {1, 2, 3, 4, 5};\nint sum = 0;\nfor (int i = 1; i <= 5; i++) {\n    sum += arr[i];\n}', 'Bug', 10, 'C'),
(9, 'int a = 10;\nint *p;\nif(a > 5) {\n    int x = 50;\n    p = &x;\n}\nprintf(\"%d\", *p);', 'Bug', 10, 'C'),
(10, 'char str[] = \"Debug\";\nfor (int i = 0; i <= strlen(str); i++) {\n    if (str[i] == \'\\0\') {\n        i = 0; \n    }\n    printf(\"%c\", str[i]);\n}', 'Bug', 10, 'C'),
(11, 'class Player {\npublic:\n    int health;\n    Player(int h) { health = h; }\n};\n\nint main() {\n    Player p1; // Creating player without arguments\n    return 0;\n}', 'Bug', 10, 'C++'),
(12, 'std::string s1 = \"Hello\";\nstd::string s2 = \"World\";\nstd::string s3 = \"Hello\" + \"World\";', 'Bug', 10, 'C++'),
(13, 'int& getVal() {\n    int x = 100;\n    return x;\n}\n\nint main() {\n    int &y = getVal();\n    std::cout << y;\n}', 'Bug', 10, 'C++'),
(14, 'class Box {\npublic:\n    int width, area;\n    Box(int w) : area(width * 10), width(w) {}\n};', 'Bug', 10, 'C++'),
(15, 'std::vector<int> v = {1, 2, 3};\nfor (auto it = v.begin(); it != v.end(); ++it) {\n    if (*it == 2) v.push_back(4);\n}', 'Bug', 10, 'C++'),
(16, 'void print(int i) { std::cout << i; }\nvoid print(double d) { std::cout << d; }\n\nint main() {\n    print(5);\n    print(5.5);\n    return 0;\n}', 'No Bug', 10, 'C++'),
(17, 'int x = 50;\nint main() {\n    int x = 10;\n    std::cout << ::x;\n    return 0;\n}', 'No Bug', 10, 'C++'),
(18, 'int a = 10, b = 20;\nconst int *ptr = &a;\nptr = &b;\nstd::cout << *ptr;', 'No Bug', 10, 'C++'),
(19, 'void greet(std::string name = \"Guest\") {\n    std::cout << \"Hi \" << name;\n}\n\nint main() {\n    greet();\n    return 0;\n}', 'No Bug', 10, 'C++'),
(20, 'namespace MySpace {\n    int val = 100;\n}\nint main() {\n    using namespace MySpace;\n    std::cout << val;\n    return 0;\n}', 'No Bug', 10, 'C++'),
(21, 'def add_item(item, box=[]):\n    box.append(item)\n    return box\n\nprint(add_item(1))\nprint(add_item(2))', 'Bug', 10, 'Python'),
(22, 'data = (1, 2, [3, 4])\ndata[2].append(5)\ndata[0] = 9', 'Bug', 10, 'Python'),
(23, 'funcs = [lambda x: x * i for i in range(3)]\nfor f in funcs:\n    print(f(2))', 'Bug', 10, 'Python'),
(24, 'x = 0.1 + 0.2\nif x == 0.3:\n    print(\"True\")\nelse:\n    print(\"False\")', 'Bug', 10, 'Python'),
(25, 'def check(n):\n    if n > 0:\n	    print(\"Positive\")\n    else:\n        print(\"Zero or Negative\")', 'Bug', 10, 'Python'),
(26, 'val = \"Go\" * 3\nprint(val)', 'No Bug', 10, 'Python'),
(27, 'x = 10\nitems = [x for x in range(5)]\nprint(x)', 'No Bug', 10, 'Python'),
(28, 'd = {1: \"A\", (2, 3): \"B\"}\nprint(d[(2,3)])', 'No Bug', 10, 'Python'),
(29, 'name = \"\"\nuser = name or \"Guest\"\nprint(user)', 'No Bug', 10, 'Python'),
(30, 'a, b = 1, 2\na, b = b, a\nprint(a, b)', 'No Bug', 10, 'Python'),
(31, 'int x = 5;\nint result = x * x;\nSystem.out.println(result);', 'No Bug', 10, 'Java'),
(32, 'static int square(int x) {\n    return x * x;\n}\nSystem.out.println(square(4));', 'No Bug', 10, 'Java'),
(33, 'int a = 3, b = 2;\nint result = a * b + b;\nSystem.out.println(result);', 'No Bug', 10, 'Java'),
(34, 'int x = 2;\nx = x + x * x;\nSystem.out.println(x);', 'No Bug', 10, 'Java'),
(35, 'int x = 5;\nint result = x ^ 2;\nSystem.out.println(result);', 'Bug', 10, 'Java'),
(36, 'static int square(int x) {\n    x * x;\n}\nSystem.out.println(square(5));', 'Bug', 10, 'Java'),
(37, 'int x = 5;\nif(x > 3);\n{\n    System.out.println(\"Hello\");\n}', 'Bug', 10, 'Java'),
(38, 'int result = 5 / 2;\nSystem.out.println(result);', 'Bug', 10, 'Java');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
