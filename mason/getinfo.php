<?php
session_start();
header('Content-Type: text/html; charset=utf-8');
require_once 'db.php';

// --- Verify That a Password Was Provided ---
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_POST['password'])) {
    echo "No password provided.";
    exit();
}
$adminPassword = $_POST['password'];
if ($adminPassword !== 'Mason1966') {
    echo "Invalid password.";
    exit();
}

// --- Ensure the Current User Is Identified ---
if (!isset($_SESSION['fullname'])) {
    echo "User not identified.";
    exit();
}
$currentUser = $_SESSION['fullname'];

// --- Functions to Manage Banned Users Using the Database ---
function isBanned($pdo, $user) {
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM banned WHERE fullname = ?");
    $stmt->execute([$user]);
    return $stmt->fetchColumn() > 0;
}
function banUser($pdo, $user) {
    if (!isBanned($pdo, $user)) {
        $stmt = $pdo->prepare("INSERT INTO banned (fullname) VALUES (?)");
        $stmt->execute([$user]);
    }
}
function unbanUser($pdo, $user) {
    $stmt = $pdo->prepare("DELETE FROM banned WHERE fullname = ?");
    $stmt->execute([$user]);
}

// --- Process Ban/Unban Action if Requested ---
if (isset($_POST['action'])) {
    $action = $_POST['action'];
    if ($action === 'ban') {
        banUser($pdo, $currentUser);
    } elseif ($action === 'unban') {
        unbanUser($pdo, $currentUser);
    }
}

// --- Retrieve All User Entries from the Database ---
$stmt = $pdo->query("SELECT fullname, grade FROM entries ORDER BY id DESC");
$entries = $stmt->fetchAll();

// --- Build the HTML Output ---
$output = "";
$output .= "<h2>All Entries</h2>";
$output .= "<table>";
$output .= "<tr><th>Full Name</th><th>Grade</th></tr>";
foreach ($entries as $entry) {
    $name = htmlspecialchars($entry['fullname']);
    $grade = htmlspecialchars($entry['grade']);
    $output .= "<tr><td>$name</td><td>$grade</td></tr>";
}
$output .= "</table>";

// --- Show Ban/Unban Options for the Current User ---
if (isBanned($pdo, $currentUser)) {
    $output .= "<p style='color:red;'>Current user (<strong>" . htmlspecialchars($currentUser) . "</strong>) is banned.</p>";
    $output .= "<button onclick=\"updateBan('unban')\" style='background:green;color:white;'>Unban</button>";
    $output .= "<p style='display:none;'>BANNED_STATUS:TRUE</p>";
} else {
    $output .= "<p style='color:green;'>Current user (<strong>" . htmlspecialchars($currentUser) . "</strong>) is not banned.</p>";
    $output .= "<button onclick=\"updateBan('ban')\" style='background:red;color:white;'>Ban</button>";
    $output .= "<p style='display:none;'>BANNED_STATUS:FALSE</p>";
}

echo $output;
?>
