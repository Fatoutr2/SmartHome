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

// Récupération des données du formulaire
$fullname = $_POST['fullname'];
$email = $_POST['email'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);
$confirm_password = $_POST['confirm_password'];

if ($_POST['password'] !== $confirm_password) {
    die("❌ Les mots de passe ne correspondent pas.");
}

// Insertion dans la base de données
$sql = "INSERT INTO users (fullname, email, password) VALUES ('$fullname', '$email', '$password')";

if ($conn->query($sql) === TRUE) {
    echo "✅ Compte créé avec succès. <a href='login.html'>Se connecter</a>";
} else {
    echo "Erreur : " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
