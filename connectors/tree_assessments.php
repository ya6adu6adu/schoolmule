<?php
	include_once '../libs/Connection.php';
	include_once '../libs/tree_editor.php';

	class tree_assessments extends tree_editor{
		private $autoload = null;
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
			$xml .= $this->getXmlAssissments($id,$rf,$autoload);
			$xml .= '</tree>';
			return $xml;					
		}
		
		/********* Top level *****************/
		protected function getXmlAssissments($id,$rf,$autoload){
			if($autoload=="false"){
				$this->autoload = false;
				$xml .= $this->getStudyGroups();
			}else{
				$this->autoload = true;
				$real_id = explode('_', $id);
				if($id == "0"){
					$xml .= $this->getStudyGroups();
				}elseif($real_id[0]=="studygroup"){
					$xml .= $this->getPupils($real_id[1]);
				}else{
					$xml .= $this->getProgresses($real_id[1]);
				}				
			}

			return $xml;
		}
		
		protected function getPupils($id){
			$xml = "";
			$result = $this->db->query("
			SELECT pupil.pupil_id as pid,pupil.forename as pfor,pupil.lastname as plas 
			FROM pupil,pupilgroups,studygroups
			WHERE pupil.pupilgroup_id = pupilgroups.pupilgroup_id
			AND pupilgroups.studygroup_id = studygroups.studygroup_id
			AND studygroups.studygroup_id=$id
			");
			while($row = mysql_fetch_assoc($result)){
				$xml.=$this->getPupilXml($row['pid'],$row['pfor'],$row['plas']);
			}
			return $xml;			
		}

		protected function getProgresses($id){
			$xml .= '<item child="0" text="Objectives progress" id="objectivesprogress_'.$id.'"  im0="objectives_progress.png">';
			$xml .= '</item>';
			$xml .= '<item child="0" text="Assignments progress" id="assignmentsprogress_'.$id.'"  im0="assign_progress.png">';
			$xml .= '</item>';
			$xml .= '<item child="0" text="Performance progress" id="performanceprogress_'.$id.'" im0="performance_progress.png">';
			$xml .= '</item>';	
			$xml .= '<item child="0" text="Stats and notes" id="statsandnotes_'.$id.'" im0="statsnotes.png">';
			$xml .= '</item>';		
			return $xml;			
		}
		
		protected function getStudyGroups(){
			$xml = "";
			$result = $this->db->query("SELECT studygroup_id,title_en FROM studygroups");
			while($row = mysql_fetch_assoc($result)){
				$xml.=$this->getStudyGroupXml($row['studygroup_id'],$row['title_en']);
			}
			return $xml;
		}
		
		protected function getPupilXml($id,$name,$lname){
			$xml = "";
			$xml .= '<item child="1" id="pupil'.'_'.$id.'" text="'.$name.' '.$lname.'" im0="pupil.png" im1="pupil.png" im2="pupil.png">';
			if(!$this->autoload){
				$xml .= $this->getProgresses($id);
			}
			$xml .= '</item>';
			return $xml;
		}
		
		
		protected function getStudyGroupXml($id,$title){
			$xml = "";
			$xml .= '<item child="1" id="studygroup'.'_'.$id.'" text="'.$title.'" im0="studygroup.png" im1="studygroup.png" im2="studygroup.png">';
			if(!$this->autoload){
				$xml .= $this->getPupils($id);
			}
			$xml .= '</item>';
			return $xml;
		}

		public function getPupilInfo($id){
			$result = $this->db->query("
				SELECT pupil.pupil_id as pid,pupil.forename as pfor,pupil.lastname as plas,
				pupil.pupil_image as pim, 
				courses.points as cr_points,courses.title_en as cr_title, course_rooms.title_en as cromm_title,
				staff_members.fore_name as memb_fname, staff_members.last_name as memb_lname,
				studygroups.startdate as stg_start, studygroups.enddate as stg_end, studygroups.title_en as stg_title
				FROM pupil,pupilgroups,studygroups,courses,course_rooms,staff_members
				WHERE pupil.pupilgroup_id = pupilgroups.pupilgroup_id
				AND pupilgroups.studygroup_id = studygroups.studygroup_id
				AND studygroups.course_id = courses.course_id
				AND course_rooms.course_room_id = courses.course_room_id
				AND course_rooms.owner_id = staff_members.staff_member_id
				AND studygroups.studygroup_id=$id
			");
			
			while($row = mysql_fetch_assoc($result)){
				$photo = $row['pim'];	
				$pupil_name = $row['pfor']." ".$row['plas'];	
				$course = $row['cr_title'];	
				$in_course_room = $row['cromm_title'];
				$studygroup = $row['stg_title'];	
				$teacher = $row['memb_fname']." ".$row['memb_lname'];	
				$startdate = $row['stg_start'];	
				$enddate = $row['stg_end'];
				$points = $row['cr_points'];
			}
			
			return array( 
				"photo" => $photo,
				"pupil_name" => $pupil_name,
				"course" => $course,
				"in_course_room" => $in_course_room,
				"studygroup" => $studygroup,
				"teacher" => $teacher,
				"points" => $points,
				"startdate" => $startdate,
				"enddate" => $enddate,
				//"prognose" => "not defined",
				//"grade" => "not defined",
				//"goal" => "not defined",
			);
		}
		
		public function getPupilNotes($id){
			$owner_notes = "";
			$notes = "";
			$result = $this->db->query("SELECT notes,owner_notes FROM pupil WHERE pupil_id=$id LIMIT 1");
			while($row = mysql_fetch_assoc($result)){
				$notes = $row['notes'];
				$owner_notes = $row['owner_notes'];
			}
			return array('private_notes' => $notes,'owner_notes' => $owner_notes);		
		}

		public function getPerformanceProgress($id){
			$content = "";
			$result = $this->db->query("SELECT content_en FROM pupli_submission_slot WHERE pupil_id=$id LIMIT 1");
			while($row = mysql_fetch_assoc($result)){
				$content = $row['content_en'];
			}
			return array('content' => $content);		
		}

		public function setPerformanceProgress($id,$content){
			$result = $this->db->query("UPDATE pupli_submission_slot SET content_en='$content' WHERE pupil_id=$id");
			return array('update' => true);			
		}
		
		public function setPupilNotes($id,$private_notes,$owner_notes){
			$result = $this->db->query("UPDATE pupil SET notes='$private_notes', owner_notes='$owner_notes' WHERE pupil_id=$id");
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
					case "getperformanceprogress":
						$response = $this->getPerformanceProgress($id);
						$response["info"] = $this->getPupilInfo($id);
						break;
					case "setperformanceprogress":
						$response = $this->setPerformanceProgress($id,$_POST['content']);
						break;
					case "getpupilinfo":
						$response = $this->getPupilNotes($id);
						$response["info"] = $this->getPupilInfo($id);
						break;
					case "setnotes":
						$response = $this->setPupilNotes($id,$_POST['private_notes'],$_POST['owner_notes']);
						break;
				}
				return $response;
			 }else{
			 	return false;
			 }
		}		
	}
	?>