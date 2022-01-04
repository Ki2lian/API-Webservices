<?php

class User {
	private $db;
    private $table = "user";

    // object properties
    public $id;
    public $login;
    public $password;
    public $statut;
    public $token;

    /**
     * Constructor with $db
     *
     * @param $db
     */
    public function __construct($db){
        $this->db = $db;
    }
    /**
     * Connection
     *
     * @return boolean
     */
    public function connect(): bool{
        $req = $this->db->prepare('SELECT statut, token FROM '.$this->table .' WHERE login = :login AND password = :password');

        $req->bindValue(':login', $this->login);
        $req->bindValue(':password', hash("sha512", $this->password));

        $res = $req->execute();
        $res = $res->fetchArray(SQLITE3_ASSOC);

        $res = $req->execute();
        if ($result = $res->fetchArray(SQLITE3_ASSOC)){
            $this->statut = $result["statut"];
            $this->token = $result["token"];
            return true;
        }
        return $res;
    }

    /**
     * Get the statut of the user by the key
     *
     * @return string|null
     */
    public function getStatut() {
        $req = $this->db->prepare('SELECT statut FROM '.$this->table .' WHERE token = :token');
        $req->bindValue(':token', $this->token);
        $res = $req->execute();

        return ($result = $res->fetchArray(SQLITE3_ASSOC)) ? $result["statut"] : null;
    }    
}

?>
