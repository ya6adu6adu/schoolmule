<?php
	require("../dhtmlx/dhtmlxConnector/php/codebase/grid_config.php");
	require("../dhtmlx/dhtmlxConnector/php/codebase/grid_connector.php");		
	
	
	class grid_labels{
		private $db = false;
		public function __construct(){
			
			$this->db = Connection::getDB();
			$conn = $this->db->getConn();
			
			if(isset($_GET['lng'])){
				$languages = split(",",$_GET['lng']);
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
			$config->attachHeader("#connector_text_filter,#connector_text_filter,#connector_text_filter");
			$config->setColIds("label_name,$str");
			$config->setColSorting("str,str,str");
			
			$gridConn->set_config($config);
			
			function beforeUpdate($action){
				$action->set_value("label_en",htmlspecialchars_decode($action->get_value("label_en")));
				$action->set_value("label_de",htmlspecialchars_decode($action->get_value("label_de")));
				
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
			function beforeRender($row){
				$row->set_value("label_de",htmlspecialchars($row->get_value("label_de")));
				$row->set_value("label_en",htmlspecialchars($row->get_value("label_en")));
			}
			
			$gridConn->event->attach("beforeRender","beforeRender");
			
			$gridConn->event->attach("beforeUpdate","beforeUpdate");
			$gridConn->render_table("labels","label_id","label_name,$str");
		}		
	}

	class labels_translated_grid{
		public function __construct(){
			if(isset($_GET['translate'])&&($_GET['translate'])){
				if(isset($_GET['s_lng'])&&isset($_GET['t_lng'])){
					header('Content-Type: text/html; charset=utf-8'); 
					require_once ('../libs/labels_translator.php');
					$my_translator = new labels_translator($_GET['s_lng'],$_GET['t_lng']);
					//$my_translator->translateLabels('labels','label_en','label_de',false);
					$my_translator->translateHTML('labels','label_en','label_de',false);
					
				}
			}else {
				$grid = new grid_labels();
			}
		
		}
	
	}
	
?>