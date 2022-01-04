<?php

$db = new SQLite3('store.db');

$db->exec("CREATE TABLE airports(id INTEGER PRIMARY KEY, name TEXT, latitude TEXT, longitude TEXT)");
$db->exec("INSERT INTO airports(name, latitude, longitude) VALUES('Aéroport Charles de Gaulle - Roissy', '49.0066334', '2.5220051')");
$db->exec("INSERT INTO airports(name, latitude, longitude) VALUES('Hartsfield Airport - Atlanta', '33.6407282', '-84.4277001')");
$db->exec("INSERT INTO airports(name, latitude, longitude) VALUES('Hongqiao Airport - Shanghai', '31.1925243', '121.3309125')");

$db->exec("CREATE TABLE user(id INTEGER PRIMARY KEY, login TEXT, password TEXT, statut TEXT, token TEXT)");
$db->exec("INSERT INTO user(login, password, statut, token) VALUES('Killian', '".hash('sha512', "motdepasse")."', 'administrateur', '5898fc860300e228dcd54c0b1045b5fa0dcda502')");
$db->exec("INSERT INTO user(login, password, statut, token) VALUES('Pierre', '".hash('sha512', "motdepasse")."', 'administrateur', 'f98a885778837ce164d17e79036080b5d1e093e1')");
$db->exec("INSERT INTO user(login, password, statut, token) VALUES('NicolasP', '".hash('sha512', "motdepasse")."', 'administrateur', '940c0f26fd5a30775bb1cbd1f6840398d39bb813')");
$db->exec("INSERT INTO user(login, password, statut, token) VALUES('Laurent', '".hash('sha512', "motdepasse")."', 'editeur', '111e529e2257432e3b6b22245a3b6a1947e5295c')");

echo "airports table created\n user table created\n";
