<?php

class Core{
	
	function Core($table){
		$this->table = $table;
	}
	
	function addField($field){
		$this->fields[] = $field;
	}
	
	function GetAll($order = "`id` ASC", $where = false, $limit = false){
		$sql = "SELECT * FROM `{$this->table}` WHERE ";
		if( $where ) $sql .= "$where";
		else 		 $sql .= "1";
		
		if( $order ) $sql .= "ORDER BY $order";
		
		if( $limit ) $sql .= "LIMIT $limit";
		
		$res = mysql_query( $sql )or die( mysql_error());
		while( $row = mysql_fetch_assoc( $res ) ){
			$result[] = $row;
		}
		
		//echo $sql."<br />";
		return $result;
	}
	
	function Save(){
		for( $i = 0; $i < count($this->fields); $i++){
			if( $fields ) $fields .= ",";
			$fields .= "`{$this->fields[$i]}`";
			if( $values ) $values .= ",";
			$values .= "'{$_REQUEST[$this->fields[$i]]}'";
		}
		$sql = "INSERT INTO `{$this->table}`($fields) VALUES($values)";
		mysql_query($sql);
		$this->Last = mysql_insert_id();
		$this->LastError = mysql_error();
		$this->LastSQL = $sql;
	}
	
	function Debug( $var ){
		echo "<pre>";
		print_r($var);
		echo "</pre>";
	}
}

?>