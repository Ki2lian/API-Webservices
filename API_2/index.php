<?php 
include('db/user-class.php');

$db = new SQLite3('db/store.db');

$user = new User($db);

// $user->login = "Killian";
// $user->password = "motdepasse";

// $isOK = $user->connect();

$user->token = "111e529e2257432e3b6b22245a3b6a1947e5295c";
print_r($user->getStatut());
