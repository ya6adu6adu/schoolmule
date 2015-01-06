<?php

	require("./../../dhtmlx/dhtmlxConnector/php/codebase/grid_config.php");
	require("./../../dhtmlx/dhtmlxConnector/php/codebase/grid_connector.php");		
	require("./../../libs/Connection.php");
	
 	class LabelGrid{
		private $db = false;
		public function __construct(){
			
			$this->db = Connection::getDB();
			$conn = $this->db->getConn();
			
			if(isset($_GET['lng'])){
				$languages = split("\,",$_GET['lng']);
				$width = 100/(count($languages)+1);
				for($i=0;$i<count($languages);$i++){
					$languages[$i] = 'label_'.$languages[$i];
					$coltypes .= "ed,";
					$colWidth .= "$width,";
				}
				$str = join(",", $languages);
			}
			$gridConn = new GridConnector($conn);
			
			$config = new GridConfiguration();
			$config->setHeader("label_name,$str");
			$config->setInitWidthsP("$width,$colWidth");
			$config->setColTypes("ed,$coltypes");
			$config->setColIds("label_name,$str");
			
			$gridConn->set_config($config);
			
			function beforeUpdate($action){
				$id = $action->get_id();
				$name = $action->get_value("label_name");
				$insert = true;
				$insert1 = true;
				$result = mysql_query("SELECT label_name FROM labels WHERE label_id = $id ");
				while($row = mysql_fetch_assoc($result)){
					if(($row["label_name"]!=$name)){
						$insert = false;
					}
				}
				if(!$insert){
					$result = mysql_query("SELECT label_name FROM labels ");
					while($row = mysql_fetch_assoc($result)){
						if(($row["label_name"]==$name)){
							$insert1 = false;
						}
					}
				}
				if(!$insert1){
					$action->invalid();
				}
			}
			
			$gridConn->event->attach("beforeUpdate","beforeUpdate");
			$gridConn->render_table("labels","label_id","label_name,$str");
		}		
	}
	$grid = new AssignmentsGrid();	
?>