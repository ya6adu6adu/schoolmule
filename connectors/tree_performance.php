<?php
	include_once '../libs/Connection.php';
	include_once '../libs/tree_editor.php';

	class tree_performance extends tree_editor{
		
		public function __construct(){
			parent::__construct();
			if(!isset($_POST['action'])){
				
			 	header("content-type:text/xml;charset=UTF-8");
				 if(isset($_GET['refresh'])){
				 	$refresh = $_GET['refresh'];
				 }else{
				 	$refresh = false;
				 }
			 	echo ($this->getXml($_GET['id'],$_GET['autoload'],$refresh));
			}else{
				$this->db->query("START TRANSACTION");
				$response = "";
				$response = $this->parseRequest();
				$this->db->query("COMMIT");
				echo json_encode($response);
			 }
		}
		
		public function getXmlTree($id=0,$rf,$autoload = true){
			$xml = '<tree id="'.$id.'">';
			$xml .= $this->getXmlMyPerformanceAuto($id,$rf,$autoload);
			$xml .= '</tree>';
			return $xml;					
		}
		
		/********* Top level *****************/
		protected function getXmlMyPerformanceAuto($id,$rf,$autoload){
			if($autoload=='false'){
				$xml = '<item child="1" text="My Studygroups" id="mystg" im1="folder_open.png" im2="folder_closed.png">';
				$xml .= $this->getItemLoad(0,"mystg",$rf,false);
				$xml .= '</item>';	
			}else{
				if($id == "0"){
					$xml = '<item child="1" text="My Studygroups" id="mystg" im1="folder_open.png" im2="folder_closed.png">';
				}else{
					$xml .= $this->getItemLoad(0,$id,$rf,true);
					$xml .= '</item>';
				}				
			}
			return $xml;
		}
		
		protected function getChildItems($type){
			$items = array();
			switch ($type) {
				case 'studygroup':
					$items[] = array('table' => 'performance',
									 'id' => 'performance',
									 'pid' => 'studygroup_id', 
									);
					break;
				case 'mystg':
					$items[] = array('table' => 'studygroups',
									 'id' => 'studygroup',
									 'pid' => 'mystg', 
									);
					break;												
				default:
					break;	
			}
			return $items;
		}
		
		public function getTableInfoFromType($type){
			switch ($type) {
				case 'studygroup':
					$table = "studygroups";
					$id_name = "studygroup";
					break;
				case 'mystg':
					$table = "mystg";
					$id_name = "mystg";
					break;
				case 'performance':
					$table = "performance";
					$id_name = "performance";
					break;			
				default:
					break;
			}
			return array('table' => $table, 'id_name' => $id_name); 			
		}


		
		public function addPerformanceItem($item){
			switch($item){
				case "performance":
					$values = array(
								'studygroup_id' => $_POST["id"],
								'public' => 1
								);
					break;
			}
			$itemInfo = $this->getTableInfoFromType($item);
			$response = $this->addItem($itemInfo['table'],$values,$item);
			return $response;
		}
		
		public function addNotPublicPerformanceItem($item){
			switch($item){
				case "performance":
					$values = array(
								'studygroup_id' => $_POST["id"],
								'public' => 0
								);
					break;
			}
			$itemInfo = $this->getTableInfoFromType($item);
			$response = $this->addItem($itemInfo['table'],$values,$item);
			return $response;
		}
		
		public function deletePerformanceItem($id,$item){
			$itemInfo = $this->getTableInfoFromType($item);
			$response = $this->removeItem($id,$itemInfo['table'],$itemInfo['id_name']);
			return $response;
		}
		
		public function sharePerformanceItem($id,$item){
			$itemInfo = $this->getTableInfoFromType($item);
			$response = $this->shareItem($id,$itemInfo['table'],$itemInfo['id_name']);
			return $response;
		}

		public function privatePerformanceItem($id,$item){
			$itemInfo = $this->getTableInfoFromType($item);
			$response = $this->privateItem($id,$itemInfo['table'],$itemInfo['id_name']);
			return $response;
		}
		
		public function duplicatePerformanceItem($id,$item){
			$itemInfo = $this->getTableInfoFromType($item);
			$response = $this->duplicateItem($id,$itemInfo['table'],$itemInfo['id_name']);
			return $response;
		}

		public function movePerformanceItem($ids,$item,$sid,$lid,$par){
			$itemInfo = $this->getTableInfoFromType($item);
			switch($item){
				case "performance":
					$parents = array(
									'studygroup_id' => $_POST['studygroup']
									);
					break;
			}

			$response = $this->setParent($sid,$parents,$lid,$itemInfo['id_name'],$itemInfo['table']);
			return $response;
		}

		public function moveDublPerformanceItem($ids,$item,$sid,$lid,$par){
			$itemInfo = $this->getTableInfoFromType($item);
			switch($item){
				case "assignment":
					$parents = array(
									'studygroup_id' => $_POST['studygroup']
									);
					break;
			}
			$response = $this->duplicatePerformanceItem($sid,$item);
			$response = $this->setParent($response['id'],$parents,$lid,$itemInfo['id_name'],$itemInfo['table']);
			return $response;
		}

		public function getPerformanceInfo($id){
			$result = $this->db->query("
			SELECT perf.title_en as title_p, stg.title_en as title_g
			FROM performance perf
			inner join studygroups stg on perf.studygroup_id=stg.studygroup_id
			where perf.performance_id=$id
										");

			while($row = mysql_fetch_assoc($result)){
				$name = $row['title_p'];
				$studygroup = $row['title_g'];
			}
									
			return array( 
				"name" => $name,
				"studygroup" => $studygroup
			);			
		}

		public function getPerformanceDescroption($id){
			$description = "";
			$notes = "";
			$result = $this->db->query("SELECT content_en,owner_notes FROM performance WHERE performance_id=$id LIMIT 1");
			while($row = mysql_fetch_assoc($result)){
				$description = $row['content_en'];
				$notes = $row['owner_notes'];
			}
			return array('content' => $description,'notes' => $notes);			
		}		
		
		public function putPerformanceDescription($id,$content,$notes){
			$result = $this->db->query("UPDATE performance SET content_en='$content',owner_notes='$notes' WHERE performance_id=$id");
			return array('update' => true);				
		}
		
		function parseRequest(){
			 if(isset($_POST['action'])){
			 	$action = $_POST['action'];
				$act = explode("_", $action);
				$id = $_POST['id'];
				$response = "";
				$id = $_POST['id'];
				$name = $_POST['name'];
				$type = $_POST['node'];
				$ids = explode(",", $_POST['ids']);
				$par = explode('_', $_POST['tid']);
				$sid = $_POST['sid'];
				$lid = $_POST['lid'];
				$content = $_POST['content'];
				$notes = $_POST['notes'];
				$description = $_POST['description'];
				switch($act[0]){
					case "new":
						$response = $this->addPerformanceItem($act[1]);
						break;
					case "delete":
						$response = $this->deletePerformanceItem($id,$act[1]);
						break;
					case "duplicate":
						$response = $this->duplicatePerformanceItem($id,$act[1]);
						break;
					case "rename":
						$table = $this->getTableInfoFromType($type);
						$response = $this->rename($id,$name,$table['table'],$table['id_name']);
					break;
					case "move":
						$response = $this->movePerformanceItem($ids,$act[1],$sid,$lid,$par);
						break;
					case "movedupl":
						$response = $this->moveDublPerformanceItem($ids,$act[1],$sid,$lid,$par);
						break;
					case "getassignment":
						$response = $this->getAssignmentContent($id);
						$response["info"] = $this->getAssignmentInfo($id);
						break;
					case "putassignment":
						$response = $this->putAssignmentContent($id,$content,$notes);			
						break;
					case "share":
						$response = $this->sharePerformanceItem($id,$act[1]);			
						break;
					case "private":
						$response = $this->privatePerformanceItem($id,$act[1]);			
						break;
                    case "getassessperformance":
                        $response = $this->getPerformanceDescroption($id);
                        $response["info"] = $this->getPerformanceInfo($id);
                        $response["info"]["view_assessments"] = dlang("header_asignment_view_performance","View Performance");
                        $response["info"]["assessment_image"] = "dhtmlx/dhtmlxTree/codebase/imgs/csh_schoolmule/performance.png";
                        break;
                    case "getperformance":
                        $response = $this->getPerformanceDescroption($id);
                        $response["info"] = $this->getPerformanceInfo($id);
                        $response["info"]["view_assessments"] = "View Assessments";
                        $response["info"]["assessment_image"] = "dhtmlx/dhtmlxTree/codebase/imgs/csh_schoolmule/assessment.png";
                        break;
					case "putperformance":
						$response = $this->putPerformanceDescription($id,$_POST['content'],$_POST['notes']);
						break;
					case "newnotpublic":
						$response = $this->addNotPublicPerformanceItem($act[1]);	
				}
				return $response;
			 }else{
			 	return false;
			 }
		}		
	}
	?>