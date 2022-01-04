<?php

include('headers.php');
include('../db/airports-class.php');
include('../db/user-class.php');

$db = new SQLite3('../db/store.db');
$airports = new Airports($db);
$user = new User($db);

/**
 * Get the method then perform an action according to method
 */

$token = getallheaders()["authorization"];
$user->token = $token;
$statut = $user->getStatut();

switch ( $_SERVER['REQUEST_METHOD'] ) {
    case 'GET':
        $allAirports = $airports->read();
        http_response_code(200);
        echo json_encode( array(
            "info" => array(
                "code" => 200,
                "count" => sizeof($allAirports)
            ),
            "data" => $allAirports
        ) );
        break;
    case 'POST':
        if(!in_array($statut, ["editeur", "administrateur"])){
            http_response_code(403);
            echo json_encode( array(
                "info" => array(
                    "code" => 403,
                    "message" => "Forbidden"
                )
            ));
            return;
        }
        $data = json_decode(file_get_contents("php://input"), true);
        if( isset($data["name"], $data["latitude"], $data["longitude"]) && !empty($data["name"]) && !empty($data["latitude"]) && !empty($data["longitude"]) ){
            $airports->name = $data["name"];
            $airports->latitude = $data["latitude"];
            $airports->longitude = $data["longitude"];

            $airports->create();
            http_response_code(200);
            echo json_encode( array(
                "info" => array(
                    "code" => 200,
                    "message" => "Airport added"
                )
            ) );
            return;
        }
        http_response_code(400);
        echo json_encode( array(
            "info" => array(
                "code" => 400,
                "message" => "Bad request, you need to send: name, latitude and longitude"
            )
        ) );

        break;
    case 'PUT':
        if(!in_array($statut, ["editeur", "administrateur"])){
            http_response_code(403);
            echo json_encode( array(
                "info" => array(
                    "code" => 403,
                    "message" => "Forbidden"
                )
            ));
            return;
        }
        $data = json_decode(file_get_contents("php://input"), true);
        if( isset($data["id"], $data["name"], $data["latitude"], $data["longitude"]) && !empty($data["name"]) && !empty($data["latitude"]) && !empty($data["longitude"]) && !empty($data["id"]) && intval($data["id"]) != 0 ){
            $airports->id = $data["id"];
            $airports->name = $data["name"];
            $airports->latitude = $data["latitude"];
            $airports->longitude = $data["longitude"];
            $airports->update();
            http_response_code(200);
            echo json_encode( array(
                "info" => array(
                    "code" => 200,
                    "message" => "Airport updated"
                )
            ) );
            return;
        }

        http_response_code(400);
        echo json_encode( array(
            "info" => array(
                "code" => 400,
                "message" => "Bad request, you need to send: id, name, latitude and longitude"
            )
        ) );
        break;
    case 'DELETE':
        if(!in_array($statut, ["administrateur"])){
            http_response_code(403);
            echo json_encode( array(
                "info" => array(
                    "code" => 403,
                    "message" => "Forbidden"
                )
            ));
            return;
        }
        if(isset($_GET["id"]) && !empty($_GET["id"]) && intval($_GET["id"]) != 0){
            $airports->id  = $_GET["id"];
            $airports->delete();
            http_response_code(200);
            echo json_encode( array(
                "info" => array(
                    "code" => 200,
                    "message" => "Airport deleted"
                )
            ) );
            return;
        }

        http_response_code(400);
        echo json_encode( array(
            "info" => array(
                "code" => 400,
                "message" => "Bad request, you need to send: id"
            )
        ) );
        break;
    
    default:
        http_response_code(405);
        echo json_encode( array(
            "code" => 405,
            "message" => "method not allowed (".$_SERVER['REQUEST_METHOD'].")"
        ) );
        break;
}