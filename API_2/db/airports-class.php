<?php

class Airports {
	private $db;
    private $table = "airports";

    // object properties
    public $id;
    public $name;
    public $latitude;
    public $longitude;

    /**
     * Constructor with $db
     *
     * @param $db
     */
    public function __construct($db){
        $this->db = $db;
    }


    /**
     * Create airport
     *
     * @return void
     */
	public function create (): void {
        $req = $this->db->prepare("INSERT INTO ".$this->table."(name, latitude, longitude)
                                   VALUES (:name, :latitude, :longitude)
                                ");
        $req->bindValue(':name', $this->name);
        $req->bindValue(':latitude', $this->latitude);
        $req->bindValue(':longitude', $this->longitude);
        $req->execute();
	}

    /**
     * Read all airports
     *
     * @return array
     */
	public function read(): array {
        $query = $this->db->query('SELECT * FROM '.$this->table);
        $jsonArray = [];

        while ( $row = $query->fetchArray(SQLITE3_ASSOC)) {
            $jsonArray[] = $row;
        }
        
        return $jsonArray;
	}

    /**
     * Update airport
     *
     * @return void
     */
	public function update(): void {
        $req = $this->db->prepare("UPDATE ".$this->table."
                                   SET name = :name, latitude = :latitude, longitude = :longitude 
                                   WHERE id = :id");
        $req->bindValue(':id', $this->id);
        $req->bindValue(':name', $this->name);
        $req->bindValue(':latitude', $this->latitude);
        $req->bindValue(':longitude', $this->longitude);
        $req->execute();
	}

    /**
     * Delete airport
     *
     * @return void
     */
	public function delete (): void {
        $req = $this->db->prepare("DELETE FROM ".$this->table." WHERE id = :id");
        $req->bindValue(':id', $this->id);
        $req->execute();
	}
}

?>
