<?php
	include_once '../libs/Connection.php';
	include_once '../libs/tree_editor.php';

	class tree_assessments_overview extends tree_editor{
		private $autoload = null;
		public function __construct(){
			parent::__construct();
			if(!isset($_POST['action'])){
				$this->db->query("START TRANSACTION");
			 	header("content-type:text/xml;charset=UTF-8");
				 if(isset($_GET['refresh'])){
				 	$refresh = $_GET['refresh'];
				 }else{
				 	$refresh = false;
				 }
				 $xml = $this->getXml($_GET['id'],$_GET['autoload'],$refresh);
				 $this->db->query("COMMIT");
			 	echo $xml;
				
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
		
		protected function getXmlAssissments($id,$rf,$autoload){
			$this->autoload = false;
			$xml = $this->getProgrammes();
			return $xml;
		}
		
		protected function getPupils($id){
			$xml = "";

            if($this->user->role == "pupil"){
                $result = $this->db->query("SELECT pupil_id, forename, lastname FROM pupil WHERE pupilgroup_id=$id AND pupil.user_id = {$this->user->id}");
            }elseif($this->user->role == "parent"){
                $result = $this->db->query("SELECT pupil.pupil_id, pupil.forename, pupil.lastname FROM pupil, parents  WHERE pupilgroup_id=$id AND pupil.pupil_id=parents.pupil_id AND parents.user_id = {$this->user->id}");
            }else{
                $result = $this->db->query("SELECT pupil_id, forename, lastname FROM pupil WHERE pupilgroup_id=$id");
            }

			while($row = mysql_fetch_assoc($result)){
				$xml.=$this->getPupilXml($row['pupil_id'],$row['forename'],$row['lastname']);
			}
			return $xml;			
		}
		
		protected function getPupilXml($id,$name,$lname){
			$xml = "";
			$xml .= '<item child="1" id="pupil'.'_'.$id.'" text="'.$name.' '.$lname.'" im0="pupil.png" im1="pupil.png" im2="pupil.png">';
			$xml .= $this->getProgresses($id);
			$xml .= '</item>';
			return $xml;
		}

		protected function getProgresses($id){
            $xml = '<item child="0" text="'.dlang("tree_assess_over_develpo","Pupil development").'" id="stats_'.$id.'" im0="statsnotes.png">';
            $xml .= '</item>';
			$xml .= '<item child="0" text="'.dlang("tree_assess_over_assig_progr","Assignm / Perform progress").'" id="assignmentsprogress_'.$id.'"  im0="assign_progress.png">';
			$xml .= '</item>';
			return $xml;			
		}
		
		protected function getProgrammes(){
			$xml = "";
            $entity = $this->user->entity;
            if($this->user->role == "staff000"){
                $result = $this->db->query("SELECT DISTINCT programmes.programme_id,programmes.title_en FROM programmes, studygroups, studygroup_staff,staff_members
                    WHERE staff_members.user_id = {$this->user->id}
                    AND staff_members.staff_member_id = studygroup_staff.staff_member_id
                    AND studygroup_staff.studygroup_id = studygroups.studygroup_id
                    AND studygroups.programme_id = programmes.programme_id AND programmes.entity_id = $entity
                ");
            }elseif($this->user->role == "pupil"){
                $result = $this->db->query("SELECT DISTINCT programmes.programme_id,programmes.title_en FROM programmes, pupil, pupilgroups, years
                    WHERE pupil.user_id = {$this->user->id}
                    AND pupil.pupilgroup_id = pupilgroups.pupilgroup_id
                    AND pupilgroups.year_id = years.year_id
                    AND years.programme_id = programmes.programme_id AND programmes.entity_id = $entity
                ");
            }elseif($this->user->role == "parent"){
                $result = $this->db->query("SELECT DISTINCT programmes.programme_id,programmes.title_en FROM programmes, parents, pupilgroups, years,pupil
                    WHERE parents.user_id = {$this->user->id}
                    AND parents.pupil_id = pupil.pupil_id
                    AND pupil.pupilgroup_id = pupilgroups.pupilgroup_id
                    AND pupilgroups.year_id = years.year_id
                    AND years.programme_id = programmes.programme_id AND programmes.entity_id = $entity
                ");
            }else{
                $result = $this->db->query("SELECT programme_id,title_en FROM programmes WHERE programmes.entity_id = $entity");
            }
			while($row = mysql_fetch_assoc($result)){
				$xml.=$this->getProgrammesXml($row['programme_id'],$row['title_en']);
			}
			return $xml;
		}
		
		protected function getProgrammesXml($id,$name){
			$xml = "";
			$xml .= '<item child="1" id="programme'.'_'.$id.'" text="'.$name.'" im0="programme.png" im1="programme.png" im2="programme.png">';
			$xml .= $this->getYears($id);
			$xml .= '</item>';
			return $xml;
		}


        protected function getYears($id){
            $xml = "";
            $result = $this->db->query("SELECT year_id,title_en FROM years WHERE programme_id=$id");
            while($row = mysql_fetch_assoc($result)){
                $xml.=$this->getYearsXml($row['year_id'],$row['title_en']);
            }
            return $xml;
        }

        protected function getYearsXml($id,$name){
            $xml = "";
            $xml .= '<item child="1" id="years'.'_'.$id.'" text="'.$name.'" im1="folder_open.png" im2="folder_closed.png" im0="folder_open.png">';
            $xml .= $this->getPupilGroup($id);
            $xml .= '</item>';
            return $xml;
        }


		protected function getPupilGroup($id){
			$xml = "";
            if($this->user->role == "pupil"){
                $result = $this->db->query("
                  SELECT DISTINCT pupilgroups.pupilgroup_id AS pid, pupilgroups.title_en AS ptitle
                    FROM studygroups, pupilgroups, studygroup_pupilgroup,pupil
                    WHERE studygroups.studygroup_id = studygroup_pupilgroup.studygroup_id
                    AND pupilgroups.pupilgroup_id = studygroup_pupilgroup.pupilgroup_id
                    AND pupilgroups.year_id = $id
                    AND pupil.user_id = {$this->user->id}
                    AND pupil.pupilgroup_id = pupilgroups.pupilgroup_id
			");
            }elseif($this->user->role == "parent"){
                $result = $this->db->query("
                  SELECT DISTINCT pupilgroups.pupilgroup_id AS pid, pupilgroups.title_en AS ptitle
                    FROM studygroups, pupilgroups, studygroup_pupilgroup, pupil, parents
                    WHERE studygroups.studygroup_id = studygroup_pupilgroup.studygroup_id
                    AND pupilgroups.pupilgroup_id = studygroup_pupilgroup.pupilgroup_id
                    AND pupilgroups.year_id = $id
                    AND parents.user_id = {$this->user->id}
                    AND parents.pupil_id = pupil.pupil_id
                    AND pupil.pupilgroup_id = pupilgroups.pupilgroup_id
			    ");
            }else{
                $result = $this->db->query("
                  SELECT DISTINCT pupilgroups.pupilgroup_id AS pid, pupilgroups.title_en AS ptitle
                    FROM  pupilgroups, years
                    WHERE pupilgroups.year_id = $id
				");
            }

			while($row = mysql_fetch_assoc($result)){
				$xml.=$this->getPupilGroupXml($row['pid'],$row['ptitle']);
			}
			return $xml;
		}		
		
		
		protected function getPupilGroupXml($id,$title){
			$xml = "";
			$xml .= '<item child="1" id="pupilgroup'.'_'.$id.'" text="'.$title.'" im0="pupilgroup.png" im1="pupilgroup.png" im2="pupilgroup.png">';
			$xml .= $this->getPupils($id);
			$xml .= '</item>';
			return $xml;
		}

		public function getPupilInfo($id){
			$result = $this->db->query("
				SELECT pupil.pupil_id as pid, pupil.forename as pfor, pupil.lastname as plas,
				pupil.pupil_image as pim,
				pupil.personal_id as idp,
				pupil.user_id as user_id,
				programmes.title_en as programme,
				pupilgroups.title_en as pupilgroup
				FROM pupil, programmes, pupilgroups, years
				WHERE pupil.pupil_id = $id
				AND pupilgroups.pupilgroup_id = pupil.pupilgroup_id
				AND pupilgroups.year_id = years.year_id
				AND years.programme_id = programmes.programme_id
			");

			while($row = mysql_fetch_assoc($result)){
                if(file_exists('../'."images/users/big_".$row['pim'])){
                    $photo = "images/users/big_".$row['pim'];
                }else{
                    $photo = "images/pupil.png";
                }
				$pupil_name = $row['pfor']." ".$row['plas'];
				$programme = $row['programme'];
                $pupilgroup = $row['pupilgroup'];
                $idp = $row['idp'];
            }

			return array(
				"photo" => $photo,
				"pupil_name" => $pupil_name,
                "programme_head" => $programme,
                "pupilgroup_head" => $pupilgroup,
				"id" => $idp,
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
			$result = $this->db->query("SELECT content_en FROM pupil_performance_assessment WHERE pupil_performance_assessment_id=$id LIMIT 1");
			while($row = mysql_fetch_assoc($result)){
				$content = $row['content_en'];
			}
			return array('content' => $content);		
		}
		
		public function getAssignmentProgress($id){
			$content = "";
			$result = $this->db->query("SELECT content_en FROM pupli_submission_slot WHERE assignment_id=$id LIMIT 1");
			while($row = mysql_fetch_assoc($result)){
				$content = $row['content_en'];
			}
			return array('content' => $content);		
		}
		
		public function setAssignmentProgress($id,$content){
			$result = $this->db->query("UPDATE pupli_submission_slot SET content_en='$content' WHERE assignment_id=$id");
			return array('update' => true);			
		}

		public function setPerformanceProgress($id,$content){
			$result = $this->db->query("UPDATE pupil_performance_assessment SET content_en='$content' WHERE pupil_performance_assessment_id=$id");
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
				$response = "";
				$id = $_POST['id'];
				switch($act[0]){
					case "getperformanceprogress":
						$response = $this->getPerformanceProgress($id);
						$response["info"] = $this->getPupilInfo($id);
						break;
					case "getassignmentprogress":
						$response = $this->getAssignmentProgress($id);
						break;
					case "setassignmentprogress":
						$response = $this->setAssignmentProgress($id,$_POST['content']);
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