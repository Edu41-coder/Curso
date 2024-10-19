<?php
// Démarrer la session si elle n'est pas déjà active
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Vérifier si l'utilisateur est connecté
// Si $_SESSION['user'] n'existe pas, l'utilisateur n'est pas connecté
if (!isset($_SESSION['user'])) {
    // Rediriger vers la page de connexion
    header('Location: login.php');
    // Arrêter l'exécution du script
    exit;
}

// Récupérer le nom d'utilisateur
// Vérifier si $_SESSION['user'] est un tableau ou une chaîne
$username = is_array($_SESSION['user']) 
    ? ($_SESSION['user']['username'] ?? 'Utilisateur') // Si c'est un tableau, utiliser la clé 'username' ou 'Utilisateur' par défaut
    : $_SESSION['user']; // Si c'est une chaîne, l'utiliser directement

try {
    // Établir une connexion à la base de données
    $dbh = new PDO('mysql:host=127.0.0.1;dbname=geographie;port=3306;charset=utf8mb4', 'root', '');
    // Configurer PDO pour lancer des exceptions en cas d'erreur
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Exécuter une requête pour récupérer tous les pays, triés par nom
    $stmt = $dbh->query('SELECT * FROM pays ORDER BY nom ASC');
    // Récupérer tous les résultats dans un tableau associatif
    $les_pays = $stmt->fetchAll(PDO::FETCH_ASSOC);
    // Compter le nombre de pays
    $nb_pays = count($les_pays);
} catch (PDOException $e) {
    // En cas d'erreur de connexion à la base de données, afficher un message et arrêter le script
    die("Erreur de connexion à la base de données : " . $e->getMessage());
} finally {
    // Fermer la connexion à la base de données
    $dbh = null;
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Géographie - Liste des pays</title>
    <!-- Inclure les fichiers CSS de Bootstrap et le CSS personnalisé -->
    <link href="./styles/bootstrap.min.css" rel="stylesheet" type="text/css">
    <link href="./styles/geo.css" rel="stylesheet" type="text/css">
</head>
<body>
    <!-- Barre de navigation -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">Base Géographie</a>
            <div class="navbar-nav ms-auto">
                <!-- Afficher le nom d'utilisateur -->
                <span class="nav-item nav-link">Bienvenue, <?= htmlspecialchars($username) ?></span>
                <!-- Lien de déconnexion -->
                <a class="nav-item nav-link" href="logout.php">Déconnexion</a>
            </div>
        </div>
    </nav>

    <!-- Contenu principal -->
    <div class="container mt-4">
        <h1 class="mb-4">Liste des pays</h1>
        <!-- Bouton pour ajouter un nouveau pays -->
        <a href="./ajouter-pays.php" class="btn btn-primary mb-3">Ajouter un pays</a>
        
        <?php if ($nb_pays > 0): ?>
            <!-- Afficher le tableau des pays s'il y en a -->
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th scope="col">Code</th>
                            <th scope="col">Nom</th>
                            <th scope="col">Capitale</th>
                            <th scope="col">Population</th>
                            <th scope="col">Superficie (km²)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($les_pays as $un_pays): ?>
                            <tr>
                                <!-- Afficher les détails de chaque pays -->
                                <td><?= htmlspecialchars($un_pays["code"]) ?></td>
                                <td><?= htmlspecialchars($un_pays["nom"]) ?></td>
                                <td><?= htmlspecialchars($un_pays["capitale"]) ?></td>
                                <!-- Formater les nombres pour une meilleure lisibilité -->
                                <td class="text-end"><?= number_format($un_pays["population"], 0, ',', ' ') ?></td>
                                <td class="text-end"><?= number_format($un_pays["superficie"], 0, ',', ' ') ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
            <!-- Afficher le nombre total de pays -->
            <p class="text-muted">Nombre total de pays : <?= $nb_pays ?></p>
        <?php else: ?>
            <!-- Message à afficher s'il n'y a pas de pays dans la base de données -->
            <div class="alert alert-info" role="alert">
                Aucun pays n'a été enregistré pour le moment.
            </div>
        <?php endif; ?>
    </div>

    <!-- Inclure le fichier JavaScript de Bootstrap -->
    <script src="./js/bootstrap.bundle.min.js"></script>
</body>
</html>