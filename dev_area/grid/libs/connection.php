<?php 
error_reporting(E_ALL);
class Connection{
		static private $host = "localhost";
		static private $user = "root";
		static private $pwd = "";
		static private $dbname = "schoolmule";
		
		/* schoolmule.se
		static private $host = "schoolmuledb.cscerafveymd.eu-west-1.rds.amazonaws.com";
		static private $user = "JayKay_666";
		static private $pwd = "##_ScoobyDooby";
		static private $dbname = "schoolmuledb";
		*/
		static private $conn = "";
		static private $instance = NULL;
		private $params = array();
		/**
		*	Creates DB connection based on params defined above and returns a link to it.
		*/
		public static function getDB(){
			if(self::$instance == NULL){
				self::$conn = mysql_connect(self::$host,self::$user,self::$pwd);
				if (!self::$conn) {
				    die('Error: ' . mysql_error());
				}
				mysql_select_db(self::$dbname);
				//mysql_set_charset('utf8',$this->dbname); 
				//SET TO UTF-8
				mysql_query("SET character_set_results = 'utf8', character_set_client = 'utf8', character_set_connection = 'utf8', character_set_database = 'utf8', character_set_server = 'utf8'");
				self::$instance = new Connection();

			}
			return self::$instance;
			
		}
		
		private function __construct() {
		}
		
		public function getConn(){
			return  self::$conn;
		}
		/**
		*	get host value
		*/
		public function getHost(){
			return $this->host;
		}

		/**
		*	get user value
		*/
		public function getUser(){
			return $this->user;
		}
		/**
		*	get password value
		*/
		public function getPwd(){
			return $this->pwd;
		}
		/**
		*	get DBname value
		*/
		public function getDBname(){
			return $this->dbname;
		}
		/**
		*	get DBname value
		*/
		public function query($sql){
			$res = mysql_query($sql) or $this->show_query_error();
			return $res;
		}
		
		public function show_query_error(){
			mysql_query("ROLLBACK");
			$trace = debug_backtrace();
			$line;
			$file;
			foreach($trace as $value){
				if($value['function'] == 'query'){
					$line = $value['line'];
					$file = $value['file'];
				}
			}
			die('MYSQL ERROR ON LINE:'.$line.'. FILE - "'.$file.'"'.'. QUERY ERROR :'.mysql_error());
		}
}
Connection::getDB();	
?>