<?php
	include_once 'connection.php';
	class CourseRooms{
		private $db = false;
		
		public function __construct(){
			$this->db = Connection::getDB();
			error_reporting(E_ALL ^ E_NOTICE);
		}
		
		public function getXml($id=0,$autoload = "false"){
			if($autoload == "false"){
				$xml = '<tree id="'.$id.'">';
				$xml .= $this->getXmlMyCourseRooms();
				$xml .= $this->getXmlSharedCourseRooms();
				$xml .= '</tree>';				
			}else{
				$xml = '<tree id="'.$id.'">';
				$xml .= $this->getXmlMyCourseRoomsAuto($id);
				if($id=="0"){
					$xml .= $this->getXmlSharedCourseRooms();
				}
				$xml .= '</tree>';				
			}
			return $xml;
		}	
		
		/********* Top level *****************/
		private function getXmlMyCourseRoomsAuto($id){
			if($id == "0"){
				$xml = '<item child="1" text="My course rooms" id="my">';
				$xml .= '</item>';
			}else{
				$xml .= $this->getCourseRoomsAuto(0,$id);
			}
			return $xml;
		}
		
		private function getXmlMyCourseRooms(){
			$xml = '<item text="My course rooms" id="my">';
			$xml .= $this->getCourseRooms(0);
			$xml .= '</item>';
			return $xml;
		}
				
		private function getXmlSharedCourseRooms(){
			$xml = '<item text="Shared course rooms" id="shared">';
			//$xml .= $this->getCourseRooms(1);
			$xml .= '</item>';
			return $xml;
		}
		
		/********* Rooms level *****************/
		private function getCourseRoomsAuto($shared=0, $id){

			if($id == "my"){
				$result = $this->db->query("SELECT * FROM course_rooms WHERE 1=1 " . ($shared? " AND 1=0" : ""). " ORDER BY sort_order ASC");
				$xml = '';
				while($row = mysql_fetch_assoc($result)){
					$crid = $row["course_room_id"];
					$folders = $this->getRoomFolders($crid);
					$elements = $this->getRoomElements($crid);
					if(count($folders)>0 || count($elements)>0){
						$child = 'child="1"';
					}
					$xml .= '<item '.$child.' id="room_'.$row["course_room_id"].'" text="'.$row["title_en"].'">';
					$xml .= '</item>';
					$child = '';
				}
			}else{
				$real_id = explode('_', $id);
				$xml .= $this->getCourseRoomFoldersAuto($real_id[1],0,$id);
				$xml .= $this->getCourseRoomElementsAuto($real_id[1],0,$id);
			}
			return $xml;
		}
		
		private function getCourseRooms($shared=0){
			$result = $this->db->query("SELECT * FROM course_rooms WHERE 1=1 " . ($shared? " AND 1=0" : ""). " ORDER BY sort_order ASC");
			$xml = '';
			while($row = mysql_fetch_assoc($result)){
				$xml .= '<item id="room_'.$row["course_room_id"].'" text="'.$row["title_en"].'">';
				$xml .= $this->getCourseRoomFolders($row["course_room_id"], 0);
				$xml .= $this->getCourseRoomElements($row["course_room_id"], 0);
				$xml .= '</item>';
			}
			return $xml;
		}
		
		/********* Elements level *****************/
		private function getCourseRoomElementsAuto($id=0, $folder_id=0, $idr,$flag=false){
			$real_id = explode('_', $idr);
			$where = "";
			if(!$flag){
				$where = "course_room_id = $id AND";
			}
			if($real_id[0] == "room" || $flag){
				$result = $this->db->query("SELECT * FROM course_rooms_elements WHERE $where folder_id='$folder_id' ORDER BY sort_order ASC");
				$xml = '';
				while($row = mysql_fetch_assoc($result)){
					$element = $row["element_id"];
					$folders = $this->getElementAssignments($element);
					$elements = $this->getElementSection($element);
					if(count($folders)>0 || count($elements)>0){
						$child = 'child="1"';
					}
					$xml .= '<item '.$child.' id="element_'.$row["element_id"].'" text="'.$row["title_en"].'">';
					$xml .= '</item>';
					$child = '';
				}
			}else{
				$real_id = explode('_', $idr);
				if($real_id[0] == 'element' || $real_id[0] =='assignment' || $real_id[0] =='section'){
					$xml .= $this->getAssignmentsAuto($real_id[1],$idr);
					$xml .= $this->getSectionsAuto($real_id[1],$idr);
				}				
			}
			return $xml;
		}
		
		private function getCourseRoomFoldersAuto($id=0, $folder_parent_id=0,$idr,$flag=false){
			$real_id = explode('_', $idr);
			$where = "";
			if(!$flag){
				$where = "course_room_id = $id AND";
			}
			if($real_id[0] == "room" || $flag){
				$result = $this->db->query("SELECT * FROM course_room_folders WHERE $where folder_parent_id='$folder_parent_id' ORDER BY sort_order ASC");
				$xml = '';
				while($row = mysql_fetch_assoc($result)){
					$folder = $row["folder_id"];
					
					$folders = $this->getFolderElements($folder);
					$elements = $this->getFolderFolders($folder);
					
					if(count($folders)>0 || count($elements)>0){
						
						$child = 'child="1"';
					}
					
					$aaaa.="-----".$child;
										
					$xml .= '<item '.$child.' id="folder_'.$row["folder_id"].'" text="'.$row["title_en"].'">';
					$xml .= '</item>';
					$child = '';
				}				
			}else{
				$real_id = explode('_', $idr);
				if($real_id[0] == "folder"){
					$xml .= $this->getCourseRoomFoldersAuto($id,$real_id[1],$idr,true);
					$xml .= $this->getCourseRoomElementsAuto($id,$real_id[1],$idr,true);
				}	
			}
			if($flag){
				
			}
			return $xml;
		}
		
		private function getCourseRoomElements($id=0, $folder_id=0){
			$result = $this->db->query("SELECT * FROM course_rooms_elements WHERE course_room_id = '$id' AND folder_id='$folder_id' ORDER BY sort_order ASC");
			$xml = '';
			while($row = mysql_fetch_assoc($result)){
				$xml .= '<item id="element_'.$row["element_id"].'" text="'.$row["title_en"].'">';
				$xml .= $this->getAssignments($row["element_id"]);
				$xml .= $this->getSections($row["element_id"]);
				$xml .= '</item>';
			}
			return $xml;
		}
		private function getCourseRoomFolders($id=0, $folder_parent_id=0){
			$result = $this->db->query("SELECT * FROM course_room_folders WHERE course_room_id = '$id' ANd folder_parent_id='$folder_parent_id' ORDER BY sort_order ASC");
			$xml = '';
			while($row = mysql_fetch_assoc($result)){
				$xml .= '<item id="folder_'.$row["folder_id"].'" text="'.$row["title_en"].'">';
				$xml .= $this->getCourseRoomFolders($id,$row["folder_id"]);
				$xml .= $this->getCourseRoomElements($id, $row["folder_id"]);
				$xml .= '</item>';
			}
			return $xml;
		}		
		
		/********* Assignment level *****************/
		private function getAssignmentsAuto($id,$idr){
			$real_id = explode('_', $idr);
			if($real_id[0] == "element"){
				$result = $this->db->query("SELECT * FROM course_rooms_assignments WHERE element_id = '$id' ORDER BY sort_order ASC");
				$xml = '';
				while($row = mysql_fetch_assoc($result)){
					$xml .= '<item child="1" id="assignment_'.$row["assignment_id"].'" text="'.$row["title_en"].'">';
					$xml .= '</item>';
				}
			}else{
				$xml .= '<item id="submission_'.$row["assignment_id"].'" text="Submissions">';
				$xml .= '</item>';			
			}
			return $xml;
		}
		
		private function getSectionsAuto($id,$idr){
			$real_id = explode('_', $idr);
			if($real_id[0] == "element"){
				$result = $this->db->query("SELECT * FROM course_room_elements_sections WHERE course_room_element_id = '$id' ORDER BY sort_order ASC");
				$xml = '';
				while($row = mysql_fetch_assoc($result)){
					$xml .= '<item id="section_'.$row["section_id"].'" text="'.$row["title_en"].'">';
					$xml .= '</item>';
				}
			}else{
				
			}
			return $xml;
		}
		
		private function getAssignments($id){
			$result = $this->db->query("SELECT * FROM course_rooms_assignments WHERE element_id = '$id' ORDER BY sort_order ASC");
			$xml = '';
			while($row = mysql_fetch_assoc($result)){
				$xml .= '<item id="assignment_'.$row["assignment_id"].'" text="'.$row["title_en"].'">';
					$xml .= '<item id="submission_'.$row["assignment_id"].'" text="Submissions">';
					$xml .= '</item>';
				$xml .= '</item>';
			}
			return $xml;
		}
		
		private function getSections($id){
			$result = $this->db->query("SELECT * FROM course_room_elements_sections WHERE course_room_element_id = '$id' ORDER BY sort_order ASC");
			$xml = '';
			while($row = mysql_fetch_assoc($result)){
				$xml .= '<item id="section_'.$row["section_id"].'" text="'.$row["title_en"].'">';
				$xml .= '</item>';
			}
			return $xml;
		}
				
		/********* Get sort order *****************/ 
		private function getSortOrder($table){
			$result = $this->db->query("SELECT sort_order FROM $table ORDER BY sort_order DESC LIMIT 1");
			$row = mysql_fetch_assoc($result);
			$sort_order = $row['sort_order']+1;
			return $sort_order;			
		}
		
		/********* Add new *****************/ 
		public function addRoom(){
			$title_en = "new room";
			$sort_order = $this->getSortOrder("course_rooms");
			$this->db->query("INSERT INTO course_rooms (title_en,sort_order,owner_id,shared,description) VALUES ('$title_en',$sort_order,0,0,0)");
			$dup_id = mysql_insert_id();
			return array("id" => 'room_'.$dup_id,"parent_id" => "my");
		}
		
		public function addFolder($course_room_id, $folder_parent_id = 0){
			$title_en = "new folder";
			$sort_order = $this->getSortOrder("course_room_folders");
			$this->db->query("INSERT INTO course_room_folders (title_en,sort_order,course_room_id,folder_parent_id) VALUES ('$title_en',$sort_order,$course_room_id,$folder_parent_id)");
			$dup_id = mysql_insert_id();
			$parent = "";
			if($folder_parent_id == 0){
				$parent = "room_".$course_room_id;
			}else{
				$parent = "folder_".$folder_parent_id;
			}
			return array("id" => 'folder_'.$dup_id, "parent_id" => $parent);
		}

		public function addElement($course_room_id, $folder_id){
			$title_en = "new element";
			$sort_order = $this->getSortOrder("course_rooms_elements");
			$this->db->query("INSERT INTO course_rooms_elements (title_en,sort_order,course_room_id,folder_id) VALUES ('$title_en',$sort_order,$course_room_id,$folder_id)");
			$dup_id = mysql_insert_id();
			$parent = "";
			if($folder_id == 0){
				$parent = "room_".$course_room_id;
			}else{
				$parent = "folder_".$folder_id;
			}
			return array("id" => 'element_'.$dup_id, "parent_id" => $parent);
		}

		public function addElementSection($course_room_element_id){
			$title_en = "new section";
			$sort_order = $this->getSortOrder("course_room_elements_sections");
			$this->db->query("INSERT INTO course_room_elements_sections (title_en,sort_order,course_room_element_id) VALUES ('$title_en',$sort_order,$course_room_element_id)");
			$dup_id = mysql_insert_id();
			return array("id" => 'section_'.$dup_id, "parent_id" =>"element_".$course_room_element_id);
		}

		public function addAssignment($element_id){
			$title_en = "new assignment";
			$sort_order = $this->getSortOrder("course_rooms_assignments");
			$this->db->query("INSERT INTO course_rooms_assignments (title_en,sort_order,element_id) VALUES ('$title_en',$sort_order,$element_id)");
			$dup_id = mysql_insert_id();
			return array("id" => 'assignment_'.$dup_id, "parent_id" =>"element_".$element_id);
		}
					
		/********* Get child *****************/ 
		private function getRoomFolders($room){
			$folders = array();
			$result = $this->db->query("SELECT folder_id FROM course_room_folders WHERE course_room_id=$room");
			
			while($row = mysql_fetch_assoc($result)){
				$folders[] = $row['folder_id'];
			}
			return $folders;
		}

		private function getRoomElements($room){
			$elements = array();
			
			$result = $this->db->query("SELECT element_id FROM course_rooms_elements WHERE course_room_id=$room");
			while($row = mysql_fetch_assoc($result)){
				$elements[] = $row['element_id'];
			}
			return $elements;
		}

		private function getFolderElements($folder){
			
			$elements = array();
			$result = $this->db->query("SELECT element_id FROM course_rooms_elements WHERE folder_id=$folder");
			while($row = mysql_fetch_assoc($result)){
				$elements[] = $row['element_id'];
			}
			return $elements;
		}

		private function getFolderFolders($folder){
			$elements = array();
			$result = $this->db->query("SELECT folder_id FROM course_room_folders WHERE folder_parent_id=$folder");
			while($row = mysql_fetch_assoc($result)){
				$elements[] = $row['folder_id'];
			}
			return $elements;
		}
		
		private function getElementAssignments($element){
			$assignments = array();
			$result = $this->db->query("SELECT assignment_id FROM course_rooms_assignments WHERE element_id=$element");
			while($row = mysql_fetch_assoc($result)){
				$assignments[] = $row['assignment_id'];
			}
			return $assignments;
		}

		private function getElementSection($element){
			$folders = array();
			$result = $this->db->query("SELECT section_id FROM course_room_elements_sections WHERE course_room_element_id=$element");
			while($row = mysql_fetch_assoc($result)){
				$folders[] = $row['section_id'];
			}
			return $folders;
		}
		
		/********* Remove *****************/ 				
		public function removeRoom($id){
			
			$this->db->query("DELETE FROM course_rooms WHERE course_room_id=$id");
			$folders = $this->getRoomFolders($id);
			$elements = $this->getRoomElements($id);
			for($i=0; $i<count($folders); $i++){
				$this->removeFolder($folders[$i]);
			}
			
			for($i=0;$i<count($elements);$i++){
				$this->removeElement($elements[$i]);
			}
			
			return array("delete" => "true");
		}

		public function removeFolder($id){
			
			$this->db->query("DELETE FROM course_room_folders WHERE folder_id=$id");
			$elements = $this->getFolderElements($id);
			
			for($i=0;$i<count($elements);$i++){
				$this->removeElement($elements[$i]);
			}
			return array("delete" => "true");
		}
		
		public function removeElement($id){
			$this->db->query("DELETE FROM course_rooms_elements WHERE element_id=$id");
			$assignments = $this->getElementAssignments($id);
			$sections = $this->getElementSection($id);
			for($i=0;$i<count($assignments);$i++){
				$this->removeAssignment($assignments[$i]);
			}
			for($i=0;$i<count($sections);$i++){
				$this->removeSection($sections[$i]);
			}
			return array("delete" => "true");
		}
		
		public function removeAssignment($id){
			$this->db->query("DELETE FROM course_rooms_assignments WHERE assignment_id=$id");
			return array("delete" => "true");
		}

		public function removeSection($id){
			$this->db->query("DELETE FROM course_room_elements_sections WHERE section_id=$id");
			return array("delete" => "true");
		}
		
		/********* Duplicate *****************/ 
		public function duplicateAssignment($id,$dup_id = null,$title_en = null){	
			$sort_order = $this->getSortOrder("course_rooms_assignments");
			$result = $this->db->query("SELECT * FROM course_rooms_assignments WHERE assignment_id=$id LIMIT 1");
			while($row = mysql_fetch_assoc($result)){
				$assignment_id = $row['assignment_id'];
				$element_id = $row['element_id'];
				$number = $row['number'];
				$content_en = $row['content_en'];
				$owner_notes_en = $row['owner_notes_en'];
				$published_date = $row['published_date'];
				$published_passed = $row['published_passed'];
				$activation_date = $row['activation_date'];
				$deadline_date = $row['deadline_date'];
				$deadline_passed = 	$row['deadline_passed'];
				if(!$title_en){
					if($dup_id != null){
						$title_en = $row['title_en'];
					}else{
						$title_en = "duplicate assignment";
					}
				}	
			}
			
			if(isset($dup_id)){
				$element_id = $dup_id;
			}			
						 	
			$this->db->query("INSERT INTO course_rooms_assignments (title_en,sort_order,element_id,number,content_en,owner_notes_en,published_date,published_passed,activation_date,deadline_date,deadline_passed) 
							VALUES ('$title_en',$sort_order,$element_id,'$number','$content_en','$owner_notes_en','$published_date',$published_passed,'$activation_date','$deadline_date',$deadline_passed)");
			$dup_id = mysql_insert_id();
			return array("idc" => "assignment_".$id,"id" => $dup_id);
 		}

		public function duplicateSection($id,$dup_id = null,$title_en = null){
			$sort_order = $this->getSortOrder("course_room_elements_sections");
			$result = $this->db->query("SELECT * FROM course_room_elements_sections WHERE section_id=$id LIMIT 1");
			while($row = mysql_fetch_assoc($result)){
				$section_id = $row['section_id'];
				$course_room_element_id = $row['course_room_element_id'];
				$edit_content_en = $row['edit_content_en'];
				$published_content_en = $row['published_content_en'];
				if(!$title_en){
					if($dup_id != null){
						$title_en = $row['title_en'];
					}else{
						$title_en = "duplicate section";
					}
				}				
			}
			
			if(isset($dup_id)){
				$course_room_element_id = $dup_id;
			}

			$this->db->query("INSERT INTO course_room_elements_sections (title_en,sort_order,course_room_element_id,edit_content_en,published_content_en)
													VALUES ('$title_en',$sort_order,$course_room_element_id,'$edit_content_en','$published_content_en')");
			$dup_id = mysql_insert_id();
			
			return array("idc" => "section_".$id,"id" => $dup_id);
		}
		
		public function duplicateElement($id,$dup_id = null,$fold = false, $course_room=0,$title_en = null){
			$sort_order = $this->getSortOrder("course_rooms_elements");
			$result = $this->db->query("SELECT * FROM course_rooms_elements WHERE element_id=$id LIMIT 1");
			while($row = mysql_fetch_assoc($result)){
				$element_id = $row['element_id'];
				$course_room_id = $row['course_room_id'];
				$folder_id = $row['folder_id'];
				$edit_content_en = $row['edit_content_en'];
				$published_content_en = $row['published_content_en'];
				if(!$title_en){
					if($dup_id != null){
						$title_en = $row['title_en'];
					}else{
						$title_en = "duplicate element";
					}
				}		
			}
			
			if($dup_id!=null && !$fold){
				$course_room_id = $dup_id;
			}
			if($fold){
				$folder_id = $dup_id;
				$course_room_id = $course_room;
			}
						
			$this->db->query("INSERT INTO course_rooms_elements (title_en,sort_order,course_room_id,folder_id,edit_content_en,published_content_en)
								VALUES ('$title_en',$sort_order,$course_room_id,$folder_id,'$edit_content_en','$published_content_en')");
								
			$dup_id = mysql_insert_id();
			
			$result = $this->db->query("SELECT section_id FROM course_room_elements_sections WHERE course_room_element_id=$element_id");
			while($row = mysql_fetch_assoc($result)){
				$this->duplicateSection($row['section_id'],$dup_id);
			}
			
			$result = $this->db->query("SELECT assignment_id FROM course_rooms_assignments WHERE element_id=$element_id");
			while($row = mysql_fetch_assoc($result)){
				$this->duplicateAssignment($row['assignment_id'],$dup_id);
			}
			
			return array("idc" => "element_".$id,"id" => $dup_id);
		}
						
		public function duplicateFolder($id, $dup_id = null, $fold = false, $course_room=0,$title_en = null){
			$sort_order = $this->getSortOrder("course_room_folders");
			$result = $this->db->query("SELECT * FROM course_room_folders WHERE folder_id=$id LIMIT 1");
			while($row = mysql_fetch_assoc($result)){ 	
				$folder_id = $row['folder_id'];
				$folder_parent_id = $row['folder_parent_id'];
				$course_room_id = $row['course_room_id'];
				if(!$title_en){
					if($dup_id != null){
						$title_en = $row['title_en'];
					}else{
						$title_en = "duplicate folder";
					}
				}
			}

			if($dup_id!=null && !$fold){
				$course_room_id = $dup_id;
			}
			if($fold){
				$folder_parent_id = $dup_id;
				$course_room_id = $course_room;
			}
			
			$this->db->query("INSERT INTO course_room_folders (title_en,sort_order,course_room_id,folder_parent_id)
								VALUES ('$title_en',$sort_order,$course_room_id,$folder_parent_id)");
										
			$dup_id = mysql_insert_id();

			$result = $this->db->query("SELECT element_id FROM course_rooms_elements WHERE folder_id=$folder_id");
			
			while($row = mysql_fetch_assoc($result)){
				$this->duplicateElement($row['element_id'],$dup_id,true,$course_room_id,null);
			}
			
			$result = $this->db->query("SELECT folder_id FROM course_room_folders WHERE folder_parent_id=$folder_id");
			
			while($row = mysql_fetch_assoc($result)){
				$this->duplicateFolder($row['folder_id'],$dup_id,true,$course_room_id,null);
			}
			
			return array("idc" => "folder_".$id,"id" => $dup_id);
		}

		public function duplicateRoom($id,$dup_id = null,$title_en=null){
			$sort_order = $this->getSortOrder("course_rooms");
			$result = $this->db->query("SELECT * FROM course_rooms WHERE course_room_id=$id LIMIT 1");
			while($row = mysql_fetch_assoc($result)){
				$course_room_id = $row['course_room_id'];
				$owner_id = $row['owner_id'];
				$shared = $row['shared'];
				$description = $row['description'];
				if(!$title_en){
					if($dup_id != null){
						$title_en = $row['title_en'];
					}else{
						$title_en = "duplicate room";
					}
				}				 
			}
			$this->db->query("INSERT INTO course_rooms (title_en,sort_order,owner_id,shared,description)
								VALUES ('$title_en',$sort_order,$owner_id,$shared,'$description')");
								
			$dup_id = mysql_insert_id();

			$result = $this->db->query("SELECT folder_id FROM course_room_folders WHERE course_room_id=$course_room_id AND folder_parent_id=0");
			while($row = mysql_fetch_assoc($result)){
				$this->duplicateFolder($row['folder_id'],$dup_id,false);
			}
			
			$result = $this->db->query("SELECT element_id FROM course_rooms_elements WHERE course_room_id=$course_room_id AND folder_id=0");
			while($row = mysql_fetch_assoc($result)){
				$this->duplicateElement($row['element_id'],$dup_id,false);
			}
			
			return array("idc" => "room_".$id,"id" => $dup_id);
		}
		
		/********* Merge *****************/ 
		public function mergeAssignment($elements,$dup_id = null){
			$title_en = "";
			$result = $this->db->query("SELECT * FROM course_rooms_assignments WHERE assignment_id = ".implode(' OR assignment_id =',$elements));
			while($row = mysql_fetch_assoc($result)){
				$title_en.= $row['title_en'].' ';		 
			}
			$title_en.=" merged";
			
			$ids = $this->duplicateAssignment($elements[0],null,$title_en);
			
			return $ids;				
 		}

		public function mergeSection($elements,$dup_id = null,$fold = false,$course_room=0){
			$title_en = "";
			$result = $this->db->query("SELECT * FROM course_room_elements_sections WHERE section_id = ".implode(' OR section_id =',$elements));
			while($row = mysql_fetch_assoc($result)){
				$title_en.= $row['title_en'].' ';		 
			}
			$title_en.=" merged";
			$ids  = $this->duplicateSection($elements[0],null,$title_en);
			
			return $ids;
		}

		public function mergeElement($elements){
			$title_en = "";
			$result = $this->db->query("SELECT * FROM course_rooms_elements WHERE element_id = ".implode(' OR element_id =',$elements));
			while($row = mysql_fetch_assoc($result)){
				$title_en.= $row['title_en'].' ';		 
			}
			
			$title_en.=" merged";
			$ids = $this->duplicateElement($elements[0],null,false,null,$title_en);
			$dup_id = $ids['id'];
			
			for($i=1;$i<count($elements);$i++){
				$element_id = $elements[$i];
				$result = $this->db->query("SELECT section_id FROM course_room_elements_sections WHERE course_room_element_id=$element_id");
				while($row = mysql_fetch_assoc($result)){
					$this->duplicateSection($row['section_id'],$dup_id);
				}
				
				$result = $this->db->query("SELECT assignment_id FROM course_rooms_assignments WHERE element_id=$element_id");
				while($row = mysql_fetch_assoc($result)){
					$this->duplicateAssignment($row['assignment_id'],$dup_id);
				}
			}
			
			
			return array("idc" => "element_".$elements[0],"id" => $dup_id);
		}
		
		public function mergeFolder($elements){
			$title_en = "";
			$result = $this->db->query("SELECT * FROM course_room_folders WHERE folder_id = ".implode(' OR folder_id =',$elements));
			while($row = mysql_fetch_assoc($result)){
				$title_en.= $row['title_en'].' ';		 
			}
			
			$title_en.=" merged";
			
			$ids = $this->duplicateFolder($elements[0],null,false,null,$title_en);
			$dup_id = $ids['id'];	
			for($i=1;$i<count($elements);$i++){
				$folder_id = $elements[$i];
				$result = $this->db->query("SELECT element_id FROM course_rooms_elements WHERE folder_id=$folder_id");
				while($row = mysql_fetch_assoc($result)){
					$this->duplicateElement($row['element_id'],$dup_id,true,0);
				}
				$result = $this->db->query("SELECT folder_id FROM course_room_folders WHERE folder_parent_id=$folder_id");
				while($row = mysql_fetch_assoc($result)){
					$this->duplicateFolder($row['folder_id'],$dup_id,true,false);
				}
			}
			
			return array("idc" => "folder_".$elements[0],"id" => $dup_id);			
		}
			
		public function mergeRoom($elements){
			$result = $this->db->query("SELECT * FROM course_rooms WHERE course_room_id = ".implode(' OR course_room_id =',$elements));
			$title_en = "";
			while($row = mysql_fetch_assoc($result)){
				$title_en.= $row['title_en'].' ';		 
			}
			
			$title_en.=" merged";
			
			$ids = $this->duplicateRoom($elements[0],null,$title_en);
			$id = $ids['id'];	
			
			for($i=1;$i<count($elements);$i++){
				$course_room_id = $elements[$i];
				$result = $this->db->query("SELECT folder_id FROM course_room_folders WHERE course_room_id=$course_room_id AND folder_parent_id=0");
				while($row = mysql_fetch_assoc($result)){
					$this->duplicateFolder($row['folder_id'],$id,false,0);
				}
				
				$result = $this->db->query("SELECT element_id FROM course_rooms_elements WHERE course_room_id=$course_room_id AND folder_id=0");
				while($row = mysql_fetch_assoc($result)){
					$this->duplicateElement($row['element_id'],$id,false,0);
				}
			}
			
			return array("idc" => "room_".$elements[0],"id" => $dup_id);
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
		
		public function rename($id,$value,$type){
			$table = "";
			$id_name = "";
			switch ($type) {
				case 'room':
					$table = "course_rooms";
					$id_name = "course_room_id";
					break;
				case 'assignment':
					$table = "course_rooms_assignments";
					$id_name = "assignment_id";
					break;
				case 'section':
					$table = "course_room_elements_sections";
					$id_name = "section_id";
					break;
				case 'folder':
					$table = "course_room_folders";
					$id_name = "folder_id";
					break;
				case 'element':
					$table = "course_rooms_elements";
					$id_name = "element_id";
					break;					
				default:
					break;
			}
			
			$result = $this->db->query("UPDATE $table SET title_en='$value' WHERE $id_name=$id");
		}
		
	}
	
	function render(){
		$id = null;
		$action = null;
		 $rooms = new CourseRooms();
		 //$action = parseRequest();
		 if(!isset($_POST['action'])){
		 	header("content-type:text/xml;charset=UTF-8");
		 	echo ($rooms->getXml($_GET['id'],$_GET['autoload']));
		 }else{
		 	$db = Connection::getDB();
		 	$db->query("START TRANSACTION");
			$id = $_POST['id'];
			$action = $_POST['action'];
			
			$response = "";
		 	switch($action){
			case "new_room":
				$response = $rooms->addRoom();
				break;
			case "new_folder":
				$room_id = $_POST["room_id"];
				$p_folder = $_POST["p_folder"];
				$response = $rooms->addFolder($room_id,$p_folder);
				break;
			case "new_element":
				$course_room_id = $_POST["room_id"];
				$folder_id = $_POST["p_folder"]; 
				$response = $rooms->addElement($course_room_id, $folder_id);
				break;
			case "new_section":
				$response = $rooms->addElementSection($id);
				break;
			case "new_assignment":
				$response = $rooms->addAssignment($id);
				break;
			case "delete_room":
				$response = $rooms->removeRoom($id);
				break;
			case "delete_folder":
				$response = $rooms->removeFolder($id);
				break;
			case "delete_element":
				$response = $rooms->removeElement($id);
				break;
			case "delete_section":
				$response = $rooms->removeSection($id);
				break;
			case "delete_assignment":
				$response = $rooms->removeAssignment($id);
				break;
			case "duplicate_room":
				$response = $rooms->duplicateRoom($id);
				break;
			case "duplicate_folder":
				$response = $rooms->duplicateFolder($id);
				break;
			case "duplicate_element":
				$response = $rooms->duplicateElement($id);
				break;
			case "duplicate_section":
				$response = $rooms->duplicateSection($id);
				break;
			case "duplicate_assignment":
				$response = $rooms->duplicateAssignment($id);
				break;
			case "merge_room":
				$ids = explode(",", $_POST['ids']);
				$response = $rooms->mergeRoom($ids);
				break;
			case "merge_folder":
				$response = $rooms->mergeFolder($ids);
				break;
			case "merge_element":
				$response = $rooms->mergeElement($ids);
				break;
			case "merge_section":
				$response = $rooms->mergeSection($ids);
				break;
			case "merge_assignment":
				$response = $rooms->mergeAssignment($ids);
				break;
			case "getroom":
				$response = $rooms->getRoomDescroption($id);
				$response["info"] = $rooms->getRoomInfo($id);
				break;
			case "putroom":
				$description = $_POST['description'];
				$response = $rooms->putRoomDescroption($id,$description);
				break;
			case "getassignment":
				$response = $rooms->getAssignmentContent($id);
				$response["info"] = $rooms->getAssignmentInfo($id);
				break;
			case "putassignment":
				$content = $_POST['content'];
				$notes = $_POST['notes'];	
				$response = $rooms->putAssignmentContent($id,$content,$notes);			
				break;
			case "rename":
				$id = $_POST['id'];
				$name = $_POST['name'];
				$type = $_POST['node'];
				$response = $rooms->rename($id,$name,$type);
			default: 
				break;
			}
			$db->query("COMMIT");
			echo json_encode($response);
		 }

	}