<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Vérifier si l'utilisateur est connecté
if (!isset($_SESSION['user'])) {
    header('Location: login.php');
    exit;
}

$sql = "INSERT INTO pays (code, nom, capitale, population, superficie)
VALUES (UPPER(TRIM(:code)), :nom, :capitale, :popu, :super)";

$dbh = new PDO('mysql:host=127.0.0.1;dbname=geographie;port=3306;charset=utf8mb4', 'root', '');
$stmt = $dbh->prepare($sql);
$stmt->execute([
    ':code' => $_POST['code'],
    ':nom' => $_POST['nom'],
    ':capitale' => $_POST['capitale'],
    ':popu' => $_POST['popu'],
    ':super' => $_POST['super']
]);
$dbh = null;

$message = "Réussite de l'ajout de : " . htmlspecialchars($_POST['nom']);
?>
<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Ajouter un pays - Résultat</title>
        <link href="./styles/bootstrap.min.css" rel="stylesheet" type="text/css">
        <link href="./styles/geo.css" rel="stylesheet" type="text/css">
    </head>
    <body>
        <div class="jumbotron text-center">
            <h1>Résultat de l'ajout du pays</h1>
            <p><a href="logout.php">Déconnexion</a></p>
        </div>
        <div class="container-fluid">
            <div class="alert alert-info">
                <?= $message; ?>
            </div>
            <p><a href="./index.php" class="btn btn-outline-info">Accueil</a></p>
        </div>
        <script src="./js/bootstrap.bundle.min.js"></script>
    </body>
</html>