<?php
	include_once '../libs/Connection.php';
	include_once '../libs/tree_editor.php';

	class tree_assessments_by_studygroup extends tree_editor{
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
				 $this->db->query("START TRANSACTION");
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
			$xml .= $this->getXmlAssissments();
			$xml .= '</tree>';
			return $xml;					
		}
		
		protected function getXmlAssissments(){
			$this->autoload = false;
			$xml = $this->getAcademicYears();
			return $xml;
		}

        protected function getAcademicYears(){
            $xml = "";
            $entity = $this->user->entity;

            $result = $this->db->query("SELECT academic_year_id,title_en FROM academic_years WHERE entity_id = $entity");

            while($row = mysql_fetch_assoc($result)){
                $xml.=$this->getAcademicYearsXml($row['academic_year_id'],$row['title_en']);
            }
            return $xml;
        }

        protected function getAcademicYearsXml($id,$name){
            $xml = "";
            $xml .= '<item child="1" id="academicyear'.'_'.$id.'" text="'.$name.'" im1="folder_open.png" im2="folder_closed.png" im0="folder_open.png">';
            $xml .= $this->getSubjects($id);
            $xml .= '</item>';
            return $xml;
        }

        protected function getSubjects($id){
            $xml = "";

            if($this->user->role == "pupil"){
                $result = $this->db->query("SELECT subjects.subject_id,subjects.title_en FROM subjects,pupil_studygroup,pupil,studygroups WHERE subjects.academic_year_id=$id AND pupil.user_id = {$this->user->id} AND
                 pupil.pupil_id = pupil_studygroup.pupil_id AND pupil_studygroup.studygroup_id = studygroups.studygroup_id AND studygroups.subject_id = subjects.subject_id
            ");
            } elseif($this->user->role == "staff"){
                    $result = $this->db->query("SELECT subjects.subject_id,subjects.title_en FROM subjects,studygroup_staff,staff_members,studygroups WHERE subjects.academic_year_id=$id AND staff_members.user_id = {$this->user->id} AND
                 staff_members.staff_member_id = studygroup_staff.staff_member_id AND studygroup_staff.studygroup_id = studygroups.studygroup_id AND studygroups.subject_id = subjects.subject_id
            ");
            }elseif($this->user->role == "parent"){
                $result = $this->db->query("SELECT subjects.subject_id,subjects.title_en FROM subjects,pupil_studygroup,parents,studygroups WHERE subjects.academic_year_id=$id AND parents.user_id = {$this->user->id} AND
                 parents.pupil_id = pupil_studygroup.pupil_id AND pupil_studygroup.studygroup_id = studygroups.studygroup_id AND studygroups.subject_id = subjects.subject_id
                ");
             }else{
                $result = $this->db->query("SELECT subject_id,title_en FROM subjects WHERE academic_year_id=$id");
            }

            while($row = mysql_fetch_assoc($result)){
                $xml.=$this->getSubjectsXml($row['subject_id'],$row['title_en']);
            }
            return $xml;
        }

        protected function getSubjectsXml($id,$name){
            $xml = "";
            $xml .= '<item child="1" id="subject'.'_'.$id.'" text="'.$name.'" im1="subject_opened.png" im2="subject_closed.png" im0="subject_opened.png">';
            $xml .= $this->getStudyGroup($id);
            $xml .= '</item>';
            return $xml;
        }

		protected function getProgrammes(){
			$xml = "";
            if($this->user->role == "staff000"){
                $result = $this->db->query("SELECT programmes.programme_id,programmes.title_en FROM programmes, studygroups, studygroup_staff,staff_members
                    WHERE staff_members.user_id = {$this->user->id}
                    AND staff_members.staff_member_id = studygroup_staff.staff_member_id
                    AND studygroup_staff.studygroup_id = studygroups.studygroup_id
                    AND studygroups.programme_id = programmes.programme_id
                ");
            }elseif($this->user->role == "pupil"){
                $result = $this->db->query("SELECT DISTINCT programmes.programme_id,programmes.title_en FROM programmes, studygroups, pupil_studygroup, pupil
                    WHERE pupil.user_id = {$this->user->id}
                    AND pupil.pupil_id = pupil_studygroup.pupil_id
                    AND pupil_studygroup.studygroup_id = studygroups.studygroup_id
                    AND studygroups.programme_id = programmes.programme_id
                ");
            }elseif($this->user->role == "parent"){
                $result = $this->db->query("SELECT DISTINCT programmes.programme_id,programmes.title_en FROM programmes, studygroups, pupil_studygroup, parents
                    WHERE parents.user_id = {$this->user->id}
                    AND parents.pupil_id = pupil_studygroup.pupil_id
                    AND pupil_studygroup.studygroup_id = studygroups.studygroup_id
                    AND studygroups.programme_id = programmes.programme_id
                ");
            }else{
                $result = $this->db->query("SELECT programme_id,title_en FROM programmes");
            }
			while($row = mysql_fetch_assoc($result)){
				$xml.=$this->getProgrammesXml($row['programme_id'],dlang($row['title_en']));
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
            $xml .= $this->getStudyGroup($id);
            $xml .= '</item>';
            return $xml;
        }
		
		protected function getStudyGroup($id){
			$xml = "";
            if($this->user->role == "staff"){
                $result = $this->db->query("SELECT DISTINCT studygroups.studygroup_id, studygroups.title_en FROM studygroups, studygroup_staff, staff_members
                    WHERE staff_members.user_id = {$this->user->id}
                    AND staff_members.staff_member_id = studygroup_staff.staff_member_id
                    AND studygroup_staff.studygroup_id = studygroups.studygroup_id
                    AND studygroups.subject_id = $id
                ");
            }elseif($this->user->role == "pupil"){
                $result = $this->db->query("SELECT DISTINCT studygroups.studygroup_id, studygroups.title_en FROM studygroups, pupil_studygroup, pupil
                    WHERE pupil.user_id = {$this->user->id}
                    AND pupil.pupil_id = pupil_studygroup.pupil_id
                    AND pupil_studygroup.studygroup_id = studygroups.studygroup_id
                    AND studygroups.subject_id = $id
                ");
            }elseif($this->user->role == "parent"){
                $result = $this->db->query("SELECT DISTINCT studygroups.studygroup_id, studygroups.title_en FROM studygroups, pupil_studygroup, parents
                    WHERE parents.user_id = {$this->user->id}
                    AND parents.pupil_id = pupil_studygroup.pupil_id
                    AND pupil_studygroup.studygroup_id = studygroups.studygroup_id
                    AND studygroups.subject_id = $id
                ");
            }else{
                $result = $this->db->query("SELECT DISTINCT studygroup_id, title_en FROM studygroups WHERE subject_id=$id");
            }
			while($row = mysql_fetch_assoc($result)){
				$xml.=$this->getStudyGroupXml($row['studygroup_id'],$row['title_en']);
			}
			return $xml;
		}		
		
		
		protected function getStudyGroupXml($id,$title){
			$xml = "";
			$xml .= '<item child="1" id="studygroup'.'_'.$id.'" text="'.$title.'" im0="studygroup.png" im1="studygroup.png" im2="studygroup.png">';
			$xml .= $this->getPupils($id);
			$xml .= '</item>';
			return $xml;
		}

		protected function getPupils($id){

			$xml = "";
            if($this->user->role == "pupil"){
                $result = $this->db->query("
                    SELECT pupil.pupil_id as pid,pupil.forename as pfor,pupil.lastname as plas
                    FROM pupil,pupil_studygroup
                    WHERE pupil_studygroup.studygroup_id = $id
                    AND pupil_studygroup.pupil_id=pupil.pupil_id
                    AND pupil.user_id = {$this->user->id}
			    ");
            }elseif($this->user->role == "parent"){
                $result = $this->db->query("
                    SELECT pupil.pupil_id as pid,pupil.forename as pfor,pupil.lastname as plas
                    FROM pupil,pupil_studygroup, parents
                    WHERE pupil_studygroup.studygroup_id = $id
                    AND pupil_studygroup.pupil_id=pupil.pupil_id
                    AND pupil.pupil_id=parents.pupil_id
                    AND parents.user_id = {$this->user->id}
			    ");
            }else{
                $result = $this->db->query("
                    SELECT pupil.pupil_id as pid,pupil.forename as pfor,pupil.lastname as plas
                    FROM pupil,pupil_studygroup
                    WHERE pupil_studygroup.studygroup_id = $id
                    AND pupil_studygroup.pupil_id=pupil.pupil_id
			    ");
            }


			while($row = mysql_fetch_assoc($result)){
				$xml.=$this->getPupilXml($row['pid'],$row['pfor'],$row['plas'],$id);
			}
			return $xml;		
		}
		
		protected function getPupilXml($id,$name,$lname,$stg){
			$xml = "";
			$xml .= '<item child="1" id="pupil_'.$id.'_'.$stg.'" text="'.$name.' '.$lname.'" im0="pupil.png" im1="pupil.png" im2="pupil.png">';
			$xml .= $this->getProgresses($id,$stg);
			$xml .= '</item>';
			return $xml;
		}

		protected function getProgresses($id,$stg){
            $xml = "";
			$xml .= '<item child="0" text="'.dlang("tree_assess_bystg_opr","Objectives progress").'" id="objectivesprogress_'.$id.'_'.$stg.'"  im0="objectives_progress.png">';
			$xml .= '</item>';
			$xml .= '<item child="0" text="'.dlang("tree_assess_bystg_approgr","Assignm / Perform progress").'" id="assignmentsprogress_'.$id.'_'.$stg.'"  im0="assign_progress.png">';
			$xml .= '</item>';
			return $xml;			
		}
		
		public function getPupilInfo($id){
            $result3 = $this->db->query("
                                  SELECT grade_definition_id, title_en
                                  FROM grade_definition
                             ");

            $ht = array();
            while($row3 = mysql_fetch_assoc($result3)){
                $ht[$row3['grade_definition_id']] = $row3['title_en'];
            }

			$result = $this->db->query("
				SELECT pupil.pupil_id as pid, pupil.forename as pfor, pupil.lastname as plas,
				pupil.pupil_image as pim, pupil.pupil_id as pupil_id, pupil.user_id as user_id,
				studygroups.startdate as stg_start, studygroups.studygroup_id as studygroup_id,
				studygroups.enddate as stg_end, studygroups.title_en as stg_title, studygroups.points as points,
				studygroups.course as course, staff_members.fore_name as stafff, staff_members.last_name as staffl,
				studygroup_grades.goal as goal, studygroup_grades.prognose as prognose, studygroup_grades.grade as grade
				FROM pupil,pupilgroups,studygroups,staff_members, studygroup_staff, studygroup_pupilgroup,pupil_studygroup,studygroup_grades
				WHERE pupil.pupilgroup_id = pupilgroups.pupilgroup_id
				AND studygroup_pupilgroup.pupilgroup_id = pupilgroups.pupilgroup_id
				AND studygroup_pupilgroup.studygroup_id = studygroups.studygroup_id
				AND studygroup_staff.studygroup_id = studygroups.studygroup_id
				AND studygroup_staff.staff_member_id = staff_members.staff_member_id
				AND pupil.pupil_id=$id
				AND studygroups.studygroup_id={$_POST['stg']}
                AND pupil_studygroup.studygroup_id = studygroups.studygroup_id
                AND pupil_studygroup.pupil_id = $id
				AND studygroup_grades.studygroup_grades_id = pupil_studygroup.grades_id
			");

			while($row = mysql_fetch_assoc($result)){
                if(file_exists('../'."images/users/big_".$row['pim'])){
                    $photo = "images/users/big_".$row['pim'];
                }else{
                    $photo = "images/pupil.png";
                }
				$pupil_name = $row['pfor']." ".$row['plas'];	
				$course = $row['course'];
				$in_course_room = $row['cromm_title'];
				$studygroup = $row['stg_title'];	
				$teacher[] = $row['stafff']." ".$row['staffl'];
				$startdate = $row['stg_start'];	
				$enddate = $row['stg_end'];
				$points = $row['points'];
				$studygroup_id = $row['studygroup_id'];
                $goal = $ht[$row['goal']];
                $prognose = $ht[$row['prognose']];
                $grade = $ht[$row['grade']];
			}
			
			return array( 
				"photo" => $photo,
				"pupil_name" => $pupil_name,
				"course" => $course,
				"in_course_room" => $in_course_room,
				"studygroup" => $studygroup,
				"teacher" => implode(', ',$teacher),
				"points" => $points,
				"startdate" => $startdate,
				"enddate" => $enddate,
				"studygroup_id" => $studygroup_id,
				"pupil_id" => $id,
                "goal" => $goal,
                "prognose" => $prognose,
                "grade" => $grade,
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
			$this->db->query("UPDATE pupli_submission_slot SET content_en='$content' WHERE pupil_id=$id");
			return array('update' => true);			
		}
		
		public function setPupilNotes($id,$private_notes,$owner_notes){
			$this->db->query("UPDATE pupil SET notes='$private_notes', owner_notes='$owner_notes' WHERE pupil_id=$id");
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