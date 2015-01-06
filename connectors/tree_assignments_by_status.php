<?php
	include_once '../libs/Connection.php';
	include_once '../libs/tree_editor.php';

	class tree_assignments_by_status extends tree_editor{
		
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
			$xml .= $this->getXmlAssignmentsByStatusAuto($id,$rf,$autoload);
			$xml .= '</tree>';
			return $xml;					
		}
		
		/********* Top level *****************/
		protected function getXmlAssignmentsByStatusAuto($id,$rf,$autoload){
			if($id == "0"){

				$xml = '<item child="1" text="'.dlang("stats_tree_ongoing","Ongoing").'" id="ongoing" im1="folder_open.png" im2="folder_closed.png" im0="folder_open.png">';
				$xml .= $this->getAssignments("ongoing");
				$xml .= '</item>';
				
				$xml .= '<item child="1" text="'.dlang("stats_tree_past","Past").'" id="past" im1="folder_open.png" im2="folder_closed.png" im0="folder_open.png">';
				$xml .= $this->getAssignments("past");
				$xml .= '</item>';

                if($this->user->role != 'pupil' && $this->user->role != 'parent'){
                    $xml .= '<item child="1" text="'.dlang("stats_tree_not_yet_cative","Not yet active").'" id="notactive" im1="folder_open.png" im2="folder_closed.png" im0="folder_open.png">';
                    $xml .= $this->getAssignments("notactive");
                    $xml .= '</item>';
                }

                if($this->user->role != 'pupil' && $this->user->role != 'parent'){
                    $xml .= '<item child="1" text="'.dlang("stats_tree_w_not_yes_subm","With not submitted").'" id="notsubmited" im1="folder_open.png" im2="folder_closed.png" im0="folder_open.png">';
                    $xml .= $this->getAssignments("notsubmited");
                    $xml .= '</item>';
                }else{
                    $xml .= '<item child="1" text="'.dlang("stats_tree_not_yetsubm","Not yet submitted").'" id="notsubmited" im1="folder_open.png" im2="folder_closed.png" im0="folder_open.png">';
                    $xml .= $this->getAssignments("notsubmited");
                    $xml .= '</item>';
                }

                if($this->user->role != 'pupil' && $this->user->role != 'parent'){
                    $xml .= '<item child="1" text="'.dlang("stats_tree_with_lase_subm","With late submissions").'" id="latesubmiss" im1="folder_open.png" im2="folder_closed.png" im0="folder_open.png">';
                    $xml .= $this->getAssignments("latesubmiss");
                    $xml .= '</item>';
                }else{
                    $xml .= '<item child="1" text="'.dlang("stats_tree_","Late submissions").'" id="latesubmiss" im1="folder_open.png" im2="folder_closed.png" im0="folder_open.png">';
                    $xml .= $this->getAssignments("latesubmiss");
                    $xml .= '</item>';
                }

                if($this->user->role != 'pupil' && $this->user->role != 'parent'){
                    $xml .= '<item child="1" text="'.dlang("stats_tree_w_not_assess","With not assessed submittions").'" id="notassesedd" im1="folder_open.png" im2="folder_closed.png" im0="folder_open.png">';
                    $xml .= $this->getAssignments("notassesedd");
                    $xml .= '</item>';
                }else{
                    $xml .= '<item child="1" text="'.dlang("stats_tree_not_assess","Not assessed submissions").'" id="notassesedd" im1="folder_open.png" im2="folder_closed.png" im0="folder_open.png">';
                    $xml .= $this->getAssignments("notassesedd");
                    $xml .= '</item>';
                }

                if($this->user->role != 'pupil' && $this->user->role != 'parent'){
                    $xml .= '<item child="1" text="'.dlang("stats_tree_wnot_pass","With Not passed submittions").'" id="notpassed" im1="folder_open.png" im2="folder_closed.png" im0="folder_open.png">';
                    $xml .= $this->getAssignments("notpassed");
                    $xml .= '</item>';
                }else{
                    $xml .= '<item child="1" text="'.dlang("stats_tree_npass","Not passed submissions").'" id="notpassed" im1="folder_open.png" im2="folder_closed.png" im0="folder_open.png">';
                    $xml .= $this->getAssignments("notpassed");
                    $xml .= '</item>';
                }


			}else{
				//$xml .= $this->getAssignments($id);
			}
			return $xml;
		}
		
		protected function getAssignments($id){
			$xml = "";
			switch ($id) {
				case 'ongoing':
					$xml = $this->getOngoing();
					break;
				case 'past':
					$xml = $this->getPast();
					break;
				case 'notactive':
					$xml = $this->getNotActive();
					break;
				case 'notsubmited':
					$xml = $this->getNotSubmited();
					break;	
				case 'latesubmiss':
					$xml = $this->getLateSubmission();
					break;	
				case 'notassesedd':
					$xml = $this->getNotAssesed();
					break;	
				case 'notpassed':
					$xml = $this->getNotPassed();
					break;			
				default:
					break;
			}
			return $xml;	
		}
		
		function getAssignmentXML($id,$title,$lb){
			$xml = "";
			$xml .= '<item chaild="1" id="assignment'.'_'.$id.'_'.$lb.'" text="'.$title.'" im0="assignment.png" im1="assignment.png" im2="assignment.png">';
			$xml .= '<item id="submission_'.$id.'_'.$lb.'" text="Submission" im1="submission.png" im2="submission.png" im0="submission.png">';
			$xml .= '</item>';
			$xml .= '</item>';
			return $xml;	
		}
		
		private function getOngoing(){
			$xml = "";
            $entity = $this->user->entity;
            if($this->user->role == 'pupil'){
                $result = $this->db->query(
                "SELECT DISTINCT course_rooms_assignments.assignment_id,course_rooms_assignments.title_en,course_rooms_assignments.shared FROM course_rooms_assignments,pupil, pupil_studygroup, studygroups
                WHERE pupil.user_id = {$this->user->id}
                AND pupil.pupil_id = pupil_studygroup.pupil_id AND course_rooms_assignments.studygroup_id = pupil_studygroup.studygroup_id
                AND course_rooms_assignments.deadline_date > CURDATE() AND course_rooms_assignments.activation_date < CURDATE()
			  ");
            }elseif($this->user->role == 'parent'){
                $result = $this->db->query(
                "SELECT DISTINCT course_rooms_assignments.assignment_id,course_rooms_assignments.title_en,course_rooms_assignments.shared FROM course_rooms_assignments, pupil_studygroup, studygroups,parents
                WHERE parents.user_id = {$this->user->id} AND parents.pupil_id = pupil_studygroup.pupil_id AND course_rooms_assignments.studygroup_id = pupil_studygroup.studygroup_id
                AND course_rooms_assignments.deadline_date > CURDATE() AND course_rooms_assignments.activation_date < CURDATE()
			    ");
            }else{
                $result = $this->db->query(
                "SELECT DISTINCT course_rooms_assignments.assignment_id,course_rooms_assignments.title_en,course_rooms_assignments.shared FROM course_rooms_assignments, course_rooms, subjects
                WHERE course_rooms_assignments.deadline_date > CURDATE() AND course_rooms_assignments.activation_date < CURDATE()
                AND course_rooms.course_room_id = course_rooms_assignments.course_room_id AND course_rooms.subject_id  = subjects.subject_id AND subjects.entity_id = $entity
			    ");
            }

			while($row = mysql_fetch_assoc($result)){
				$xml.=$this->getAssignmentXML($row['assignment_id'],$row['title_en'],"ong");
			}
			return $xml;
		}
		
		function getPast(){
			$xml = "";
            $entity = $this->user->entity;
            if($this->user->role == 'pupil'){
                $result = $this->db->query(
                "SELECT DISTINCT course_rooms_assignments.assignment_id,course_rooms_assignments.title_en,course_rooms_assignments.shared FROM course_rooms_assignments,pupil, pupil_studygroup, studygroups
                WHERE pupil.user_id = {$this->user->id}
                AND pupil.pupil_id = pupil_studygroup.pupil_id AND course_rooms_assignments.studygroup_id = pupil_studygroup.studygroup_id
                AND course_rooms_assignments.deadline_date < CURDATE()"
                );
            }elseif($this->user->role == 'parent'){
                $result = $this->db->query(
                "SELECT DISTINCT course_rooms_assignments.assignment_id,course_rooms_assignments.title_en,course_rooms_assignments.shared FROM course_rooms_assignments, pupil_studygroup, studygroups, parents
                WHERE parents.user_id = {$this->user->id} AND parents.pupil_id = pupil_studygroup.pupil_id AND course_rooms_assignments.studygroup_id = pupil_studygroup.studygroup_id
                AND course_rooms_assignments.deadline_date < CURDATE() AND course_rooms_assignments.activation_date < CURDATE()
			    ");
            }else{
                $result = $this->db->query(
                   "SELECT DISTINCT course_rooms_assignments.assignment_id,course_rooms_assignments.title_en,course_rooms_assignments.shared FROM course_rooms_assignments, course_rooms, subjects
                    WHERE course_rooms_assignments.deadline_date < CURDATE() AND course_rooms.course_room_id = course_rooms_assignments.course_room_id AND course_rooms.subject_id  = subjects.subject_id AND subjects.entity_id = $entity
                ");
            }


			while($row = mysql_fetch_assoc($result)){
				$xml.=$this->getAssignmentXML($row['assignment_id'],$row['title_en'],"past");
			}
			return $xml;			
		}

		function getNotActive(){
			$xml = "";
            $entity = $this->user->entity;
            if($this->user->role == 'pupil'){
                $result = $this->db->query(
                    "SELECT DISTINCT course_rooms_assignments.assignment_id,course_rooms_assignments.title_en,course_rooms_assignments.shared FROM course_rooms_assignments,pupil, pupil_studygroup, studygroups
                WHERE pupil.user_id = {$this->user->id}
                AND pupil.pupil_id = pupil_studygroup.pupil_id AND course_rooms_assignments.studygroup_id = pupil_studygroup.studygroup_id
                AND course_rooms_assignments.activation_date > NOW()"
                );
            }elseif($this->user->role == 'parent'){
                $result = $this->db->query(
                    "SELECT DISTINCT course_rooms_assignments.assignment_id,course_rooms_assignments.title_en,course_rooms_assignments.shared FROM course_rooms_assignments, pupil_studygroup, studygroups, parents
                WHERE parents.user_id = {$this->user->id} AND parents.pupil_id = pupil_studygroup.pupil_id AND course_rooms_assignments.studygroup_id = pupil_studygroup.studygroup_id
                AND course_rooms_assignments.activation_date > NOW()
			    ");
            }else{
                $result = $this->db->query(
                    "SELECT DISTINCT course_rooms_assignments.assignment_id,course_rooms_assignments.title_en,course_rooms_assignments.shared FROM course_rooms_assignments, course_rooms, subjects
                     WHERE course_rooms_assignments.activation_date > NOW() AND course_rooms.course_room_id = course_rooms_assignments.course_room_id AND course_rooms.subject_id  = subjects.subject_id AND subjects.entity_id = $entity
                 ");
            }

			while($row = mysql_fetch_assoc($result)){
				$xml.=$this->getAssignmentXML($row['assignment_id'],$row['title_en'],"na");
			}
			return $xml;			
		}
		
		
		function getNotSubmited(){
			$xml = "";
            $entity = $this->user->entity;
            if($this->user->role == 'pupil'){
                $result = $this->db->query(
                "SELECT DISTINCT course_rooms_assignments.assignment_id,course_rooms_assignments.title_en,course_rooms_assignments.shared FROM course_rooms_assignments,pupil, pupil_studygroup, studygroups
                WHERE pupil.user_id = {$this->user->id}
                AND pupil.pupil_id = pupil_studygroup.pupil_id AND course_rooms_assignments.studygroup_id = pupil_studygroup.studygroup_id"
                );
            }elseif($this->user->role == 'parent'){
                $result = $this->db->query(
                "SELECT DISTINCT course_rooms_assignments.assignment_id,course_rooms_assignments.title_en,course_rooms_assignments.shared FROM course_rooms_assignments, pupil_studygroup, studygroups,parents
                 WHERE parents.user_id = {$this->user->id} AND parents.pupil_id = pupil_studygroup.pupil_id AND course_rooms_assignments.studygroup_id = pupil_studygroup.studygroup_id
			    ");
            }else{
                $result = $this->db->query(
                    "SELECT DISTINCT course_rooms_assignments.assignment_id,course_rooms_assignments.title_en,course_rooms_assignments.shared FROM course_rooms_assignments, course_rooms, subjects WHERE
                      course_rooms.course_room_id = course_rooms_assignments.course_room_id AND course_rooms.subject_id  = subjects.subject_id AND subjects.entity_id = $entity
                 ");
            }

			//$result = $this->db->query("SELECT DISTINCT assignment_id,title_en,shared FROM course_rooms_assignments");
			while($row = mysql_fetch_assoc($result)){
				$assid = $row['assignment_id'];

				$result2 = $this->db->query("SELECT assignment_id FROM pupli_submission_slot WHERE assignment_id=$assid AND status='".dlang("grids_not_subm_text","Not subm.")."'");
				if(mysql_num_rows($result2)>0){
					$xml.=$this->getAssignmentXML($row['assignment_id'],$row['title_en'],"ns");				
				}
			}
			return $xml;			
		}


		
		function getLateSubmission(){
			$xml = "";
            $entity = $this->user->entity;
            if($this->user->role == 'pupil'){
                $result = $this->db->query("
                SELECT DISTINCT cra.assignment_id as aid, cra.title_en as ten, cra.shared as shr
				FROM course_rooms_assignments cra
				inner join pupli_submission_slot pss on cra.assignment_id=pss.assignment_id
				inner join pupil_studygroup pstg on pstg.studygroup_id=pss.studygroup_id
				inner join pupil pupil on pupil.pupil_id=pstg.pupil_id
                WHERE cra.deadline_date < pss.submission_date AND pupil.user_id = {$this->user->id}
                ");
            }elseif($this->user->role == 'parent'){
                $result = $this->db->query("
                SELECT DISTINCT cra.assignment_id as aid, cra.title_en as ten, cra.shared as shr
				FROM course_rooms_assignments cra
				inner join pupli_submission_slot pss on cra.assignment_id=pss.assignment_id
				inner join pupil_studygroup pstg on pstg.studygroup_id=pss.studygroup_id
				inner join parents parents on parents.pupil_id=pstg.pupil_id
                WHERE cra.deadline_date < pss.submission_date AND parents.user_id = {$this->user->id}
			  ");
            }else{
                $result = $this->db->query("
                SELECT DISTINCT cra.assignment_id as aid, cra.title_en as ten, cra.shared as shr
				FROM course_rooms_assignments cra
				inner join pupli_submission_slot pss on cra.assignment_id=pss.assignment_id
				inner join studygroups studygroups on studygroups.studygroup_id=pss.studygroup_id
                WHERE cra.deadline_date < pss.submission_date AND studygroups.entity_id = $entity
			  ");
            }

			while($row = mysql_fetch_assoc($result)){
				$xml.=$this->getAssignmentXML($row['aid'],$row['ten'],"ls");
			}
			return $xml;			
		}
		
		function getNotAssesed(){
			$xml = "";
            $entity = $this->user->entity;
            if($this->user->role == 'pupil'){
                $result = $this->db->query("
                    SELECT DISTINCT cra.assignment_id as aid, cra.title_en as ten, cra.shared as shr
                    FROM course_rooms_assignments cra
                    inner join pupli_submission_slot pss on cra.assignment_id=pss.assignment_id
                    inner join pupil_submission_result psr on psr.submission_slot_id=pss.submission_slot_id
                    inner join pupil_studygroup pstg on pstg.studygroup_id=pss.studygroup_id
                    inner join pupil pupil on pupil.pupil_id=pstg.pupil_id
                    WHERE psr.assessment = '' AND pupil.user_id = {$this->user->id} AND status!='".dlang("grids_not_subm_text","Not subm.")."'
                ");
            }elseif($this->user->role == 'parent'){
                $result = $this->db->query("
                SELECT DISTINCT cra.assignment_id as aid, cra.title_en as ten, cra.shared as shr
				FROM course_rooms_assignments cra
				inner join pupli_submission_slot pss on cra.assignment_id=pss.assignment_id
                inner join pupil_submission_result psr on psr.submission_slot_id=pss.submission_slot_id
				inner join pupil_studygroup pstg on pstg.studygroup_id=pss.studygroup_id
				inner join parents parents on parents.pupil_id=pstg.pupil_id
                WHERE psr.assessment = '' AND parents.user_id = {$this->user->id}  AND status!='".dlang("grids_not_subm_text","Not subm.")."'
			  ");
            }else{
                $result = $this->db->query("
                SELECT DISTINCT cra.assignment_id as aid, cra.title_en as ten, cra.shared as shr
				FROM course_rooms_assignments cra
				inner join pupli_submission_slot pss on cra.assignment_id=pss.assignment_id
                inner join pupil_submission_result psr on psr.submission_slot_id=pss.submission_slot_id
                left join studygroups studygroups on studygroups.studygroup_id=pss.studygroup_id
                WHERE psr.assessment = '' AND status!='".dlang("grids_not_subm_text","Not subm.")."' AND studygroups.entity_id = $entity
			  ");
            }

			while($row = mysql_fetch_assoc($result)){
				$xml.=$this->getAssignmentXML($row['aid'],$row['ten'],"nass");
			}
			return $xml;			
		}
		
		function getNotPassed(){
            $xml = "";
            $entity = $this->user->entity;
            if($this->user->role == 'pupil'){
                $result = $this->db->query("
				SELECT DISTINCT cra.assignment_id as aid, cra.title_en as ten, cra.shared as shr
				FROM course_rooms_assignments cra
				inner join pupli_submission_slot pss on cra.assignment_id=pss.assignment_id
				inner join pupil_submission_result psr on psr.submission_slot_id=pss.submission_slot_id
                inner join pupil_studygroup pstg on pstg.studygroup_id=pss.studygroup_id
				inner join pupil pupil on pupil.pupil_id=pstg.pupil_id
				where pupil.user_id = {$this->user->id}
                AND psr.pass = 0 AND psr.assessment != ''
                ");
            }elseif($this->user->role == 'parent'){
                $result = $this->db->query("
				SELECT DISTINCT cra.assignment_id as aid, cra.title_en as ten, cra.shared as shr
				FROM course_rooms_assignments cra
				inner join pupli_submission_slot pss on cra.assignment_id=pss.assignment_id
				inner join pupil_submission_result psr on psr.submission_slot_id=pss.submission_slot_id
                inner join pupil_studygroup pstg on pstg.studygroup_id=pss.studygroup_id
				inner join parents parents on parents.pupil_id=pstg.pupil_id
				where parents.user_id = {$this->user->id}
                AND psr.pass = 0 AND psr.assessment != ''
			  ");
            }else{
                $result = $this->db->query("
				SELECT DISTINCT cra.assignment_id as aid, cra.title_en as ten, cra.shared as shr
				FROM course_rooms_assignments cra
				inner join pupli_submission_slot pss on cra.assignment_id=pss.assignment_id
				inner join pupil_submission_result psr on psr.submission_slot_id=pss.submission_slot_id
				left join studygroups studygroups on studygroups.studygroup_id=pss.studygroup_id
				where psr.pass = 0 AND psr.assessment != '' AND studygroups.entity_id = $entity
			  ");
            }

            while($row = mysql_fetch_assoc($result)){
                $xml.=$this->getAssignmentXML($row['aid'],$row['ten'],"npass");
            }
            return $xml;
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

		public function getAssignmentInfo($id){
			$result = $this->db->query("
			SELECT studygroups.title_en as stg, course_rooms_assignments.title_en as name, course_rooms_assignments.number as number
			FROM course_rooms_assignments, studygroups
			WHERE course_rooms_assignments.studygroup_id=studygroups.studygroup_id 
			AND course_rooms_assignments.assignment_id=$id
			");
			
			while($row = mysql_fetch_assoc($result)){
				$name = $row['name'];	
				$stg = $row['stg'];	
				$number = $row['number'];	
			}
			
			return array( 
				"assignment_name" => $name,
				"assignment_id" => $number,
				"assignment_stg" => $stg,
				"assignment_subm_total" => "not defined",
				"assignment_subm_submitted" => "not defined",
				"assignment_subm_not_assesed" => "not defined",
				"assignment_subm_not_passed" => "not defined",
				"assignment_publication" => "not defined",
				"assignment_activation" => "not defined",
				"assignment_deadline" => "not defined"
			);
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