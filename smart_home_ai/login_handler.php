<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "smart_home";

// Connexion MySQL
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Erreur de connexion : " . $conn->connect_error);
}

// Récupération des données
$email = $_POST['email'];
$password = $_POST['password'];

// Vérification utilisateur
$sql = "SELECT * FROM users WHERE email='$email'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();

    if (password_verify($password, $user['password'])) {
        session_start();
        $_SESSION['user'] = $user;
        echo "✅ Connexion réussie. <a href='dashboard.php'>Accéder au tableau de bord</a>";
    } else {
        echo "❌ Mot de passe incorrect.";
    }
} else {
    echo "❌ Aucun compte trouvé avec cet e-mail.";
}

$conn->close();
?>
