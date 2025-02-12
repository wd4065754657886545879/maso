<?php
session_start();
require_once 'db.php';

// --- Helper Function to Check Ban Status ---
function isBanned($pdo, $fullname) {
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM banned WHERE fullname = ?");
    $stmt->execute([$fullname]);
    return $stmt->fetchColumn() > 0;
}

// --- Process User Registration ---
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['fullname'], $_POST['grade'])) {
    $fullname = trim($_POST['fullname']);
    $grade = trim($_POST['grade']);
    if (!empty($fullname) && !empty($grade)) {
        // Save in session so we don’t ask again.
        $_SESSION['fullname'] = $fullname;
        $_SESSION['grade'] = $grade;
        // Insert into the entries table.
        $stmt = $pdo->prepare("INSERT INTO entries (fullname, grade) VALUES (?, ?)");
        $stmt->execute([$fullname, $grade]);
    }
}

// --- If User Not Yet Registered, Show Registration Form ---
if (!isset($_SESSION['fullname']) || !isset($_SESSION['grade'])):
?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Enter Your Information</title>
  <style>
    body { font-family: Arial, sans-serif; text-align: center; margin-top: 100px; }
    form { display: inline-block; padding: 20px; border: 1px solid #ccc; }
    label { display: block; margin: 10px 0 5px; }
    input { padding: 8px; width: 250px; }
    button { margin-top: 15px; padding: 10px 20px; }
  </style>
</head>
<body>
  <h1>Welcome! Please enter your information:</h1>
  <form method="post" action="">
    <label for="fullname">Full Name:</label>
    <input type="text" name="fullname" id="fullname" required>
    <label for="grade">Grade:</label>
    <input type="text" name="grade" id="grade" required>
    <button type="submit">Submit</button>
  </form>
</body>
</html>
<?php
exit();
endif;

// --- At This Point, the User’s Info Is in Session ---
$currentUser = $_SESSION['fullname'];
$banned = isBanned($pdo, $currentUser);
?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Custom Search</title>
  <style>
    body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
    .container { margin: 20px auto; max-width: 600px; }
    input[type="text"] { padding: 10px; width: 60%; font-size: 18px; }
    button { padding: 10px 20px; font-size: 18px; margin: 10px; }
    #infoPanel { margin-top: 30px; display: none; text-align: left; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    table, th, td { border: 1px solid #333; }
    th, td { padding: 8px 12px; }
    #bannedMessage { color: red; font-size: 20px; margin: 20px; }
  </style>
</head>
<body>
  <?php if ($banned): ?>
    <div id="bannedMessage">
      <p>You are banned from using the website.</p>
      <p>Please use the Info panel to unban yourself if you have permission.</p>
    </div>
  <?php else: ?>
    <h1>Custom Search</h1>
    <div class="container">
      <form id="searchForm" onsubmit="handleSearch(event)">
        <input type="text" id="searchQuery" placeholder="Search..." required>
        <button type="submit">Search</button>
      </form>
    </div>
  <?php endif; ?>
  <button onclick="showInfo()">Info</button>
  <div id="infoPanel" class="container"></div>
  
  <script>
    // Global variable to store the admin password once entered.
    var adminPassword = null;

    // --- Handle Search Form Submission ---
    function handleSearch(e) {
      e.preventDefault();
      var query = document.getElementById('searchQuery').value;
      // Update the browser's URL with the query parameter.
      history.pushState({}, '', '?q=' + encodeURIComponent(query));
      // Randomly choose one of several search engines.
      var urls = [
        "https://www.google.com/search?q=",
        "https://www.bing.com/search?q=",
        "https://duckduckgo.com/?q="
      ];
      var randomUrl = urls[Math.floor(Math.random() * urls.length)];
      // After a short delay, redirect.
      setTimeout(function(){
        window.location.href = randomUrl + encodeURIComponent(query);
      }, 800);
    }

    // --- Show the Admin Info Panel ---
    function showInfo() {
      if (!adminPassword) {
        adminPassword = prompt("Enter admin password:");
        if (adminPassword === null) return; // canceled
      }
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "getinfo.php", true);
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.onreadystatechange = function(){
        if (xhr.readyState === 4 && xhr.status === 200) {
          document.getElementById("infoPanel").innerHTML = xhr.responseText;
          document.getElementById("infoPanel").style.display = "block";
          // If the returned HTML contains banned-status markers, reload to update the interface.
          if(xhr.responseText.indexOf("BANNED_STATUS:TRUE") !== -1 ||
             xhr.responseText.indexOf("BANNED_STATUS:FALSE") !== -1) {
              location.reload();
          }
        }
      };
      xhr.send("password=" + encodeURIComponent(adminPassword));
    }

    // --- Update Ban Status (Ban or Unban) ---
    function updateBan(action) {
      if (!adminPassword) {
        adminPassword = prompt("Enter admin password:");
        if (adminPassword === null) return;
      }
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "getinfo.php", true);
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.onreadystatechange = function(){
        if (xhr.readyState === 4 && xhr.status === 200) {
          document.getElementById("infoPanel").innerHTML = xhr.responseText;
          if(xhr.responseText.indexOf("BANNED_STATUS:TRUE") !== -1 ||
             xhr.responseText.indexOf("BANNED_STATUS:FALSE") !== -1) {
              location.reload();
          }
        }
      };
      xhr.send("password=" + encodeURIComponent(adminPassword) + "&action=" + action);
    }
  </script>
</body>
</html>
