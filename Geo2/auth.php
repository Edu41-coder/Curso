<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    if (strlen($password) < 6) {
        $_SESSION['error'] = 'Le mot de passe doit contenir au moins 6 caractères';
        header('Location: login.php');
        exit;
    }

    $dbh = new PDO('mysql:host=127.0.0.1;dbname=geographie;port=3306;charset=utf8mb4', 'root', '');
    $stmt = $dbh->prepare('SELECT * FROM user WHERE username = ?');
    $stmt->execute([$username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && $password === $user['password']) {
        $_SESSION['user'] = $user['username']; // Stocke uniquement le nom d'utilisateur
        header('Location: index.php');
        exit;
    } else {
        $_SESSION['error'] = 'Nom d\'utilisateur ou mot de passe incorrect';
        header('Location: login.php');
        exit;
    }
}

header('Location: login.php');
exit;