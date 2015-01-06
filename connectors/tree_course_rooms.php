<?php
	include_once '../libs/Connection.php';
	include_once '../libs/tree_editor.php';

	class tree_course_rooms extends tree_editor{
		
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
			$xml .= $this->getXmlMyCourseRoomsAuto($id,$rf,$autoload);
			//$xml .= $this->getXmlSharedCourseRooms();
			$xml .= '</tree>';
			return $xml;					
		}
		
		/********* Top level *****************/
		protected function getXmlMyCourseRoomsAuto($id,$rf,$autoload){
			//if($id == "0"){
				$xml = '<item child="1" text="My course rooms" id="my" im1="folder_open.png" im2="folder_closed.png">';
				$xml .= $this->getItemLoad(0,"my",$rf,false);
				$xml .= '</item>';
			//}else{
				
			//}
			return $xml;
		}
					
		protected function getXmlSharedCourseRooms(){
			$xml = '<item text="Shared course rooms" id="shared">';
			//$xml .= $this->getCourseRooms(1);
			$xml .= '</item>';
			return $xml;
		}
				

		protected function getChildItems($type){
			$items = array();
			switch ($type) {
				case 'course_room':
					$items[] = array('table' => 'course_rooms_elements',
									 'id' => 'element',
									 'pid' => 'course_room_id', 
									);
					$items[] = array('table' => 'course_room_folders',
									 'id' => 'folder',
									 'pid' => 'course_room_id', 
									);
					break;
				case 'my':
					$items[] = array('table' => 'course_rooms',
									 'id' => 'course_room',
									 'pid' => 'my', 
									);
					break;
				case 'folder':
					$items[] = array('table' => 'course_rooms_elements',
									 'id' => 'element',
									 'pid' => 'folder_id', 
									);
					$items[] = array('table' => 'course_room_folders',
									 'id' => 'folder',
									 'pid' => 'folder_parent_id', 
									);
					break;
				case 'element':
					$items[] = array('table' => 'course_rooms_assignments',
									 'id' => 'assignment',
									 'pid' => 'element_id', 
									);
					$items[] = array('table' => 'course_room_elements_sections',
									 'id' => 'section',
									 'pid' => 'element_id', 
									);
					break;													
				default:
					break;	
			}
			return $items;
		}
		
		public function getTableInfoFromType($type){
			switch ($type) {
				case 'room':
					$table = "course_rooms";
					$id_name = "course_room";
					break;
				case 'course_room':
					$table = "course_rooms";
					$id_name = "course_room";
					break;
				case 'my':
					$table = "my";
					$id_name = "my";
					break;
				case 'assignment':
					$table = "course_rooms_assignments";
					$id_name = "assignment";
					break;
				case 'section':
					$table = "course_room_elements_sections";
					$id_name = "section";
					break;
				case 'folder':
					$table = "course_room_folders";
					$id_name = "folder";
					break;
				case 'element':
					$table = "course_rooms_elements";
					$id_name = "element";
					break;					
				default:
					break;
			}
			return array('table' => $table, 'id_name' => $id_name); 			
		}		

		
		public function getRoomDescroption($id){
			$descr = "";
			$result = $this->db->query("SELECT description FROM course_rooms WHERE course_room_id=$id LIMIT 1");
			while($row = mysql_fetch_assoc($result)){
				$descr = $row['description'];
			}
			return array('description' => $descr);
		}
		
		public function putRoomDescroption($id,$description){
			$result = $this->db->query("UPDATE course_rooms SET description='$description' WHERE course_room_id=$id");
			return array('update' => true);
		}
		
		public function getAssignmentContent($id){
			$content = "";
			$notes = "";
			$result = $this->db->query("SELECT content_en,owner_notes_en FROM course_rooms_assignments WHERE assignment_id=$id LIMIT 1");
			while($row = mysql_fetch_assoc($result)){
				$content = $row['content_en'];
				$notes = $row['owner_notes_en'];
			}
			return array('content' => $content,'notes' => $notes);
		}		
		
		public function putAssignmentContent($id,$content,$notes){
			$result = $this->db->query("UPDATE course_rooms_assignments SET content_en='$content',owner_notes_en='$notes' WHERE assignment_id=$id");
			return array('update' => true);			
		}
		
		public function getRoomInfo($id){
			$result = $this->db->query("SELECT course_rooms_elements.element_id,course_rooms.title_en FROM course_rooms_elements JOIN course_rooms WHERE course_rooms_elements.course_room_id =course_rooms.course_room_id && course_rooms.course_room_id=$id");
			$elements = mysql_num_rows($result); 
			while($row = mysql_fetch_assoc($result)){
				$name = $row['title_en'];	
			}
			return array(
				'course_room_name' => $name,
				'course_room_elements' => $elements,
				'course_room_courses' => "not defined",
				'course_room_assignments' =>  "not defined",
				'course_room_teachers' =>  "not defined",
				'course_room_new_submissions' =>  "not defined"
			);
		}
		
		public function getAssignmentInfo($id){
			$result = $this->db->query("SELECT cr.title_en as room, cre.title_en as element, cra.title_en as name, cra.number as number
			FROM course_rooms_assignments cra
			inner join course_rooms_elements cre on cra.element_id=cre.element_id
			inner join course_rooms cr on cr.course_room_id=cre.course_room_id 
			where cra.assignment_id=$id");
			while($row = mysql_fetch_assoc($result)){
				$name = $row['name'];	
				$room = $row['room'];	
				$element = $row['element'];	
				$number = $row['number'];	
			}
			return array( 
				"assignment_name" => $name,
				"assignment_id" => $number,
				"assignment_courseroom" => $room,
				"assignment_element" => $element,
				"assignment_subm_total" => "not defined",
				"assignment_subm_submitted" => "not defined",
				"assignment_subm_not_assesed" => "not defined",
				"assignment_subm_not_passed" => "not defined",
				"assignment_publication" => "not defined",
				"assignment_activation" => "not defined",
				"assignment_deadline" => "not defined"
			);
		}				
		
		public function addCourseRoomItem($item){
			switch($item){
				case "room":
					$values = array(
								'owner_id' => 0,
								'shared'=> 0,
								'description' => "new description",
								);
					break;
				case "folder":		
					$values = array(
									'course_room_id' => $_POST["room_id"],
									'folder_parent_id'=> $_POST["p_folder"]
									);
					break;
				case "element":
					$values = array(
									'course_room_id' =>  $_POST["room_id"],
									'folder_id'=> $_POST["p_folder"]
									);
					break;
				case "section":
					$values = array(
									'element_id' => $_POST["id"]
									);
					break;
				case "assignment":
					$values = array(
									'element_id' => $_POST["id"]
									);
					break;		
			}
			$itemInfo = $this->getTableInfoFromType($item);
			$response = $this->addItem($itemInfo['table'],$values,$item);
			return $response;
		}
		
		public function deleteCourseRoomItem($id,$item){
			$itemInfo = $this->getTableInfoFromType($item);
			$response = $this->removeItem($id,$itemInfo['table'],$itemInfo['id_name']);
			return $response;
		}

		public function duplicateCourseRoomItem($id,$item){
			$itemInfo = $this->getTableInfoFromType($item);
			$response = $this->duplicateItem($id,$itemInfo['table'],$itemInfo['id_name']);
			return $response;
		}
		
		public function mergeCourseRoomItem($ids,$item){
			$itemInfo = $this->getTableInfoFromType($item);
			$response = $this->mergeItem($ids,$itemInfo['table'],$itemInfo['id_name']);
			return $response;
		}

		public function moveCourseRoomItem($ids,$item,$sid,$lid,$par){
			$itemInfo = $this->getTableInfoFromType($item);
			switch($item){
				case "element":
					if($par[0]=='room'){
						$folder_id = 0;
					}else{
						$folder_id = $par[1];
					}
					$parents = array(
									'folder_id' => $folder_id,
									'course_room_id' => $_POST['room']
									);
					break;
				case "folder":
					if($par[0]=='room'){
						$folder_id = 0;
					}else{
						$folder_id = $par[1];
					}				
					$parents = array(
									'folder_parent_id' => $folder_id,
									'course_room_id' => $_POST['room']
									);
					break;
				case "section":
					$element_id = $par[1];				
					$parents = array(
									'element_id' => $element_id
									);
					break;
				case "assignment":			
					$element_id = $par[1];
					$parents = array(
									'element_id' => $element_id
									);
					break;
			}

			$response = $this->setParent($sid,$parents,$lid,$itemInfo['id_name'],$itemInfo['table']);
			return $response;
		}

		public function moveDublCourseRoomItem($ids,$item,$sid,$lid,$par){
			$itemInfo = $this->getTableInfoFromType($item);
			switch($item){
				case "element":
					if($par[0]=='room'){
						$folder_id = 0;
					}else{
						$folder_id = $par[1];
					}
					$parents = array(
									'folder_id' => $folder_id,
									'course_room_id' => $_POST['room']
									);
					break;
				case "folder":
					if($par[0]=='room'){
						$folder_id = 0;
					}else{
						$folder_id = $par[1];
					}				
					$parents = array(
									'folder_parent_id' => $folder_id,
									'course_room_id' => $_POST['room']
									);
					break;
				case "section":
					$element_id = $par[1];				
					$parents = array(
									'element_id' => $element_id
									);
					break;
				case "assignment":			
					$element_id = $par[1];
					$parents = array(
									'element_id' => $element_id
									);
					break;
			}
			$response = $this->duplicateCourseRoomItem($sid,$item);
			$response = $this->setParent($response['id'],$parents,$lid,$itemInfo['id_name'],$itemInfo['table']);
			return $response;
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
						$response = $this->addCourseRoomItem($act[1]);
						break;
					case "delete":
						$response = $this->deleteCourseRoomItem($id,$act[1]);
						break;
					case "duplicate":
						$response = $this->duplicateCourseRoomItem($id,$act[1]);
						break;
					case "merge":
						$response = $this->mergeCourseRoomItem($ids,$act[1]);
						break;
					case "rename":
						$table = $this->getTableInfoFromType($type);
						$response = $this->rename($id,$name,$table['table'],$table['id_name']);
					break;
					case "move":
						$response = $this->moveCourseRoomItem($ids,$act[1],$sid,$lid,$par);
						break;
					case "movedupl":
						$response = $this->moveDublCourseRoomItem($ids,$act[1],$sid,$lid,$par);
						break;
					case "getroom":
						$response = $this->getRoomDescroption($id);
						$response["info"] = $this->getRoomInfo($id);
						break;
					case "putroom":
						$response = $this->putRoomDescroption($id,$description);
						break;
					case "getassignment":
						$response = $this->getAssignmentContent($id);
						$response["info"] = $this->getAssignmentInfo($id);
						break;
					case "putassignment":
						$response = $this->putAssignmentContent($id,$content,$notes);			
						break;
				}
				return $response;
			 }else{
			 	return false;
			 }
		}		
	}
	?>