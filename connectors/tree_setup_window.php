<?php

 	class tree_setup_window{
		private $db = false;
        protected $user;

		public function __construct(){
            $this->db = Connection::getDB();
            $this->user = new administrator();
            $this->db->query("START TRANSACTION");
			header("content-type:text/xml;charset=UTF-8");
			if(isset($_POST['action']) && $_POST['action']=='savetree'){
				$staff = $_POST['idss'];
                $pupilgroups = $_POST['idsp'];
                $stg = $_POST['studygroup'];

                $this->db->query("DELETE FROM pupil_studygroup WHERE studygroup_id = $stg");
                $this->db->query("DELETE FROM studygroup_pupilgroup WHERE studygroup_id = $stg");
                $exist = array();
                for ($i=0; $i < count($pupilgroups); $i++) {
                    $this->db->query("INSERT INTO studygroup_pupilgroup (studygroup_id, pupilgroup_id) VALUES ($stg,{$pupilgroups[$i]})");
                    $result = $this->db->query("SELECT pupil_pupilgroup.pupil_id FROM pupil_pupilgroup WHERE pupil_pupilgroup.pupilgroup_id={$pupilgroups[$i]}");

                    while($row = mysql_fetch_assoc($result)){
                        if(isset($exist[$row['pupil_id'].'_'.$stg])){
                            continue;
                        }
                        $this->db->query("INSERT INTO studygroup_grades (studygroup_id) VALUES ($stg)");
                        $grade = mysql_insert_id();
                        $this->db->query("INSERT INTO pupil_studygroup (pupil_id,studygroup_id,grades_id) VALUES ({$row['pupil_id']},$stg,$grade)");
                        $this->createPupilSubmissionSlot($row['pupil_id'],$pupilgroups[$i],$stg);
                        $exist[$row['pupil_id'].'_'.$stg] = true;
                    }
                }

                $this->db->query("DELETE FROM studygroup_staff WHERE studygroup_id = $stg");

                for ($i=0; $i < count($staff); $i++) {
                    $id = $staff[$i];
                    $this->db->query("INSERT INTO studygroup_staff (staff_member_id,studygroup_id) VALUES ($id,$stg)");
                }
			}elseif(isset($_POST['action']) && $_POST['action']=='getchecked'){
				$checked = array();
                $studygroup = $_POST['studygroup'];

                $result = $this->db->query("SELECT pupilgroups.pupilgroup_id AS pupilgroup_id FROM pupilgroups,studygroup_pupilgroup WHERE  studygroup_pupilgroup.pupilgroup_id = pupilgroups.pupilgroup_id AND studygroup_pupilgroup.studygroup_id=$studygroup AND pupilgroups.entity_id = {$this->user->entity}");
                while($row = mysql_fetch_assoc($result)){
                    $checked[] = 'pupilgroup_'.$row['pupilgroup_id'];
                }

                $result = $this->db->query("SELECT staff_member_id FROM studygroup_staff WHERE studygroup_id=$studygroup");
                while($row = mysql_fetch_assoc($result)){
                    $checked[] = 'staffmember_'.$row['staff_member_id'];
                }
				echo json_encode($checked);
			}else{
                $xml = '<tree id="0">';
                $xml .= '<item child="1" text="'.dlang("pupup_setup_tree_staff","Staff").'" id="staff" im1="folder_open.png" im2="folder_closed.png">';
                $xml .= $this->getStaff();
                $xml .= '</item>';
                $xml .='<item child="1" text="'.dlang("pupup_setup_tree_pg","Pupilgroups").'" id="pupilgroups" im1="folder_open.png" im2="folder_closed.png">';
                $xml .= $this->getPupilGroup();
                $xml .= '</item>';
                $xml .= '</tree>';
                echo $xml;
			}
            $this->db->query("COMMIT");
		}

        protected function createPupilSubmissionSlot($id,$pg,$stg){
            $result = $this->db->query("SELECT course_rooms_assignments.assignment_id, course_rooms_assignments.studygroup_id  FROM course_rooms_assignments,studygroup_pupilgroup WHERE course_rooms_assignments.studygroup_id = studygroup_pupilgroup.studygroup_id  AND
              studygroup_pupilgroup.pupilgroup_id=$pg AND studygroup_pupilgroup.studygroup_id=$stg");
            while ($row = mysql_fetch_assoc($result)){
                $this->db->query("INSERT INTO pupli_submission_slot (assignment_id,pupil_id,status,content_en,studygroup_id,activation_date) VALUES ({$row['assignment_id']},$id,'Not subm.','',{$row['studygroup_id']},NOW())");
                $slot = mysql_insert_id();
                $sql = "SELECT resultset_id FROM resultsets WHERE assignment_id={$row['assignment_id']}";
                $result2 = $this->db->query($sql);
                while($row2 = mysql_fetch_assoc($result2)){
                    $this->db->query("INSERT INTO pupil_submission_result (submission_slot_id,result_set_id,studygroup_id) VALUES ($slot,{$row2['resultset_id']},{$row['studygroup_id']})");
                }
            }
        }

        protected function getStaff(){
            $entity = $this->user->entity;
            $xml = "";
            $result = $this->db->query("SELECT staff_member_id, fore_name, last_name FROM staff_members WHERE entity_id = $entity");
            while($row = mysql_fetch_assoc($result)){
                $xml.=$this->getStaffXml($row['staff_member_id'],$row['fore_name'],$row['last_name']);
            }
            return $xml;
        }

        protected function getStaffXml($id,$name,$lname){
            $xml = "";
            $xml .= '<item child="1" id="staffmember'.'_'.$id.'" text="'.$name.' '.$lname.'" im0="pupil.png" im1="pupil.png" im2="pupil.png">';
            $xml .= '</item>';
            return $xml;
        }

        protected function getPupilGroup(){
            $xml = "";
            $entity = $this->user->entity;

            $result = $this->db->query("
              SELECT pupilgroup_id AS pid, pupilgroups.title_en AS ptitle, studygroup_id FROM pupilgroups WHERE entity_id = $entity
            ");
            while($row = mysql_fetch_assoc($result)){
                $xml.=$this->getPupilGroupXml($row['pid'],$row['ptitle'],$row['studygroup_id']);
            }
            return $xml;
        }


        protected function getPupilGroupXml($id,$title,$stg){
            $xml = "";
            $xml .= '<item child="1" id="pupilgroup'.'_'.$id.'" text="'.$title.'" im0="studygroup.png" im1="studygroup.png" im2="studygroup.png">';
            $xml .= $this->getPupils($id);
            $xml .= '</item>';
            return $xml;
        }

        protected function getPupils($id){
            $xml = "";
            $result = $this->db->query("SELECT pupil.pupil_id, forename, lastname FROM pupil,pupil_pupilgroup WHERE pupil.pupil_id = pupil_pupilgroup.pupil_id AND pupil_pupilgroup.pupilgroup_id=$id");

            while($row = mysql_fetch_assoc($result)){
                $xml.=$this->getPupilXml($row['pupil_id'],$row['forename'],$row['lastname'], $id);
            }
            return $xml;
        }

        protected function getPupilXml($id,$name,$lname,$pg){
            $xml = "";
            $xml .= '<item nocheckbox="1" child="1" id="pupil'.'_'.$id.'_'.$pg.'" text="'.$name.' '.$lname.'" im0="pupil.png" im1="pupil.png" im2="pupil.png">';
            $xml .= '</item>';
            return $xml;
        }
		
	}
?>