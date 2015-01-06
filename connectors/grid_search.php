<?php
 	class grid_search{
		private $db = false;
        private $user = null;

		public function __construct(){
			$this->db = Connection::getDB();
            $this->user = new administrator();
			error_reporting(E_ALL ^ E_NOTICE);
			
			if(!isset($_POST['action'])){
				echo '<?xml version="1.0" encoding="UTF-8"?>';
				echo '<rows>';
                $query = $_GET['query'];
                if(!$query){
                    echo $this->getEmptyGrid($query);
                }else{
                    echo $this->getCourseObjectives($query);
                    if($this->user->role == "staff" || $this->user->role == "superadmin"){
                        echo $this->getPupils($query);
                    }
                    echo $this->getAssignements($query);
                    echo $this->getPerformances($query);
                    echo $this->getSubmissions($query);

                }
				echo '</rows>';					
			}
		}
        protected function getAssignements($query){
            $entity = $this->user->entity;
            switch($this->user->role){
                case "staff":
                    $sql = "SELECT course_rooms_assignments.title_en, course_rooms_assignments.content_en, course_rooms_assignments.assignment_id
                    FROM course_rooms_assignments, staff_members, studygroup_staff
                    WHERE staff_members.user_id = {$this->user->id}
                    AND staff_members.staff_member_id = studygroup_staff.staff_member_id
                    AND course_rooms_assignments.studygroup_id = studygroup_staff.studygroup_id

                    AND (course_rooms_assignments.title_en LIKE '%{$query}%' OR course_rooms_assignments.content_en LIKE '%{$query}%')";
                    break;
                case "pupil":
                    $sql = "SELECT course_rooms_assignments.title_en, course_rooms_assignments.content_en, course_rooms_assignments.assignment_id
                    FROM course_rooms_assignments, pupil, pupil_studygroup
                    WHERE pupil.user_id = {$this->user->id}
                    AND pupil_studygroup.pupil_id = pupil.pupil_id
                    AND course_rooms_assignments.studygroup_id = pupil_studygroup.studygroup_id
                    AND (course_rooms_assignments.title_en LIKE '%{$query}%' OR course_rooms_assignments.content_en LIKE '%{$query}%')";
                    break;
                case "parent":
                    $sql = "SELECT course_rooms_assignments.title_en, course_rooms_assignments.content_en, course_rooms_assignments.assignment_id
                    FROM course_rooms_assignments, pupil, pupil_studygroup, parents
                    WHERE parents.user_id = {$this->user->id}
                    AND pupil_studygroup.pupil_id = parents.pupil_id
                    AND course_rooms_assignments.studygroup_id = pupil_studygroup.studygroup_id
                    AND (course_rooms_assignments.title_en LIKE '%{$query}%' OR course_rooms_assignments.content_en LIKE '%{$query}%')";
                    break;
                default:
                    $sql = "SELECT course_rooms_assignments.title_en, course_rooms_assignments.content_en, course_rooms_assignments.assignment_id FROM course_rooms_assignments,course_rooms,subjects
                    WHERE course_rooms.course_room_id = course_rooms_assignments.course_room_id
                    AND course_rooms.subject_id = subjects.subject_id
                    AND subjects.entity_id = $entity
                    AND (course_rooms_assignments.title_en LIKE '%{$query}%' OR course_rooms_assignments.content_en LIKE '%{$query}%')";
            }


            $xml = "<row ><cell id='assignments' image='assignment.png'>".dlang("assignemnt_search","Assignments")."</cell><cell></cell>";
            $result = $this->db->query($sql);
            while($row = mysql_fetch_assoc($result)){
                $xml.=$this->getAssignementsXml($row['assignment_id'],$row['title_en'],$row['content_en'],$query);
            }
            $xml .= "</row>";
            return $xml;
        }

        protected function getAssignementsXml($id,$name, $cont,$query){
            $xml = "";
/*            if(strpos(strtolower($name),strtolower($query))==-1 || strpos(strtolower($name),strtolower($query))===false){
                $name = trim(strip_tags($cont));
                $name = str_replace('&nbsp;', '',$name);
                if(strlen($name)>160){
                    $name = $this->getContext($name, $query);
                }

            }*/
            $xml .= '<row child="1" id="assignment'.'_'.$id.'">';
            $xml .= '<cell image="assignment.png">'.$name.'</cell><cell>'.dlang("assignemnt_search","Assignments").'</cell>';
            $xml .= '</row>';
            return $xml;
        }

        protected function mysub($str, $length, $minword = 3){
            echo $str;
            $sub = '';
            $len = 0;

            foreach (explode(' ', $str) as $word){
                $part = (($sub != '') ? ' ' : '') . $word;
                $sub .= $part;
                if (strlen($sub) > $minword){
                    break;
                }
            }
            return $sub . (($len < strlen($str)) ? '...' : '');
        }

        protected function getPerformances($query){
            $entity = $this->user->entity;
            switch($this->user->role){
                case "staff":
                    $sql = "SELECT performance.title_en, performance.content_en, performance.performance_id
                    FROM performance, staff_members, studygroup_staff
                    WHERE staff_members.user_id = {$this->user->id}
                    AND staff_members.staff_member_id = studygroup_staff.staff_member_id
                    AND performance.studygroup_id = studygroup_staff.studygroup_id
                    AND (performance.title_en LIKE '%{$query}%' OR content_en LIKE '%{$query}%')";
                    break;
                case "pupil":
                    $sql = "SELECT performance.title_en, performance.content_en, performance.performance_id
                    FROM performance, pupil, pupil_studygroup
                    WHERE pupil.user_id = {$this->user->id}
                    AND pupil_studygroup.pupil_id = pupil.pupil_id
                    AND performance.studygroup_id = pupil_studygroup.studygroup_id
                    AND (performance.title_en LIKE '%{$query}%' OR content_en LIKE '%{$query}%')";
                    break;
                case "parent":
                    $sql = "SELECT performance.title_en, performance.content_en, performance.performance_id
                    FROM performance, pupil, pupil_studygroup, parents
                    WHERE parents.user_id = {$this->user->id}
                    AND pupil_studygroup.pupil_id = parents.pupil_id
                    AND performance.studygroup_id = pupil_studygroup.studygroup_id
                    AND (performance.title_en LIKE '%{$query}%' OR content_en LIKE '%{$query}%')";
                    break;
                default:
                    $sql = "SELECT performance.title_en, performance.content_en, performance.performance_id
                    FROM performance,course_rooms,subjects
                    WHERE course_rooms.course_room_id = performance.course_room_id
                    AND course_rooms.subject_id = subjects.subject_id
                    AND subjects.entity_id = $entity
                    AND (performance.title_en LIKE '%{$query}%' OR performance.content_en LIKE '%{$query}%')";
            }

            $xml = "<row ><cell id='performances' image='performance.png'>".dlang("performance_search","Performance")."</cell><cell></cell>";
            $result = $this->db->query($sql);
            while($row = mysql_fetch_assoc($result)){
                $xml.=$this->getPerformancesXml($row['performance_id'],dlang($row['title_en']),$row['content_en'],$query);
            }
            $xml .= "</row>";
            return $xml;
        }

        protected function getPerformancesXml($id,$name,$cont,$query){
            $xml = "";
/*            if(strpos(strtolower($name),strtolower($query))==-1 || strpos(strtolower($name),strtolower($query))===false){
                $name = trim(strip_tags($cont));
                $name = str_replace('&nbsp;', '',$name);
                if(strlen($name)>170){
                    $name = $this->getContext($name, $query);
                }
            }*/

            $xml .= '<row child="1" id="performance'.'_'.$id.'">';
            $xml .= '<cell image="performance.png">'.$name.'</cell><cell>'.dlang("performance_search","Performance").'</cell>';
            $xml .= '</row>';
            return $xml;
        }

        protected function getSubmissions($query){
            $xml = "<row ><cell id='submissions' image='programme.png'>".dlang("submissions_comments_search","Submissions and comments")."</cell><cell></cell>";
            $entity = $this->user->entity;
            switch($this->user->role){
                case "staff":
                    $sql1 = "SELECT comment_text, type_item, item_id, pupil_id
                    FROM files_comments, staff_members, studygroup_staff, performance, course_rooms_assignments
                    WHERE staff_members.user_id = {$this->user->id}
                    AND staff_members.staff_member_id = studygroup_staff.staff_member_id
                    AND ((performance.studygroup_id = studygroup_staff.studygroup_id AND files_comments.item_id = performance.performance_id)
                    OR (course_rooms_assignments.studygroup_id = studygroup_staff.studygroup_id AND files_comments.item_id = course_rooms_assignments.assignment_id))
                    AND comment_text LIKE '%{$query}%'";

                    $sql2 = "SELECT file_name,files_comments.item_id,files_comments.pupil_id
                    FROM files, files_comments,staff_members, studygroup_staff, performance, course_rooms_assignments
                    WHERE staff_members.user_id = {$this->user->id}
                    AND staff_members.staff_member_id = studygroup_staff.staff_member_id
                    AND ((performance.studygroup_id = studygroup_staff.studygroup_id AND files_comments.item_id = performance.performance_id)
                    OR (course_rooms_assignments.studygroup_id = studygroup_staff.studygroup_id AND files.item_id = course_rooms_assignments.assignment_id))
                    AND file_name LIKE '%{$query}%'
                    AND files_comments.comment_id = files.comment";
                    break;
                case "pupil":
                    $sql1 = "SELECT comment_text, type_item, item_id, files_comments.pupil_id FROM files_comments,pupil
                    WHERE pupil.user_id = {$this->user->id}
                    AND pupil.pupil_id = files_comments.pupil_id
                    AND comment_text LIKE '%{$query}%'";

                    $sql2 = "SELECT file_name, files_comments.item_id, files_comments.pupil_id FROM files, files_comments,pupil
                    WHERE pupil.user_id = {$this->user->id}
                    AND pupil.pupil_id = files_comments.pupil_id
                    AND file_name LIKE '%{$query}%'
                    AND files_comments.comment_id = files.comment";
                    break;
                case "parent":
                    $sql = "SELECT performance.title_en, performance.content_en, performance.performance_id
                    FROM performance, pupil, pupil_studygroup, parents
                    WHERE parents.user_id = {$this->user->id}
                    AND pupil_studygroup.pupil_id = parents.pupil_id
                    AND course_rooms_assignments.studygroup_id = pupil_studygroup.studygroup_id
                    AND (performance.title_en LIKE '%{$query}%' OR content_en LIKE '%{$query}%')";
                    break;
                default:
                    $sql1 = "SELECT comment_text, type_item, item_id, pupil_id FROM files_comments, users
                    WHERE comment_text LIKE '%{$query}%' AND users.user_id = files_comments.user_id AND users.entity_id = $entity";

                    $sql2 = "SELECT file_name,files_comments.item_id,files_comments.pupil_id FROM files, files_comments,users WHERE file_name LIKE '%{$query}%'
                    AND files_comments.comment_id = files.comment AND users.user_id = files_comments.user_id AND users.entity_id = $entity";
            }

            $result = $this->db->query($sql1);
            while($row = mysql_fetch_assoc($result)){
                $xml.=$this->getSubmissionsXml($row['item_id'], $row['type_item'],$row['comment_text'],$row['pupil_id'],$query);
            }
            $result = $this->db->query($sql2);
            while($row = mysql_fetch_assoc($result)){
                $xml.=$this->getSubmissionsXml($row['item_id'],'assignement',$row['file_name'],$row['pupil_id'],$query);
            }
            $xml .= "</row>";
            return $xml;
        }

        protected function getSubmissionsXml($id,$type,$name,$pupil,$query){
            $xml = "";
            $itemtype = "";
            if($type == "performance"){
                $itemtype = "assessment";
            }else{
                $itemtype = "submission";
            }

            $xml .= '<row child="1" id="'.$itemtype.'_'.$id.'_'.$pupil.'">';
            if($type == "performance"){
                $type = dlang("comment_search","Comment");
            }else{
                $type = dlang("submission_search","Submission");
            }
            $name = trim(strip_tags($name));
            $name = str_replace('&nbsp;', '',$name);
            if(strlen($name)>100){
                $name = $this->mysub($name,(strpos(strtolower($name),strtolower($query))),100);
            }
            $xml .= '<cell image="submission.png">'.$name.'</cell><cell>'.$type.'</cell>';
            $xml .= '</row>';
            return $xml;
        }

        protected function getEmptyGrid(){
            $xml = "
                <row ><cell id='objectives' image='objective.png'>".dlang("course_objectives_search","Course objectives")."</cell><cell></cell></row>
                <row ><cell id='objectives' image='pupil.png'>".dlang("pupils_search","Pupils")."</cell><cell></cell></row>
                <row ><cell id='objectives' image='programme.png'>Submissions and comments".dlang("submissions_comments_search","Submissions and comments")."</cell><cell></cell></row>
                <row ><cell id='objectives' image='assignment.png'>".dlang("assignments_search","Assignments")."</cell><cell></cell></row>
                <row ><cell id='objectives' image='performance.png'>".dlang("performance_search","Performance")."</cell><cell></cell></row>
            ";
            return $xml;
        }

        protected function getCourseObjectives($query){
            $entity = $this->user->entity;
            switch($this->user->role){
                case "staff":
                    $sql = "SELECT course_objectives.title_en, course_objectives.objective_id, course_objectives.description, course_objectives.grading
                    FROM course_objectives, staff_members, studygroup_staff
                    WHERE staff_members.user_id = {$this->user->id}
                    AND staff_members.staff_member_id = studygroup_staff.staff_member_id
                    AND course_objectives.studygroup_id = studygroup_staff.studygroup_id
                    AND (course_objectives.title_en LIKE '%{$query}%' OR course_objectives.description LIKE '%{$query}%' OR course_objectives.grading LIKE '%{$query}%')";
                    break;
                case "pupil":
                    $sql = "SELECT course_objectives.title_en, course_objectives.objective_id, course_objectives.description, course_objectives.grading
                    FROM course_objectives, pupil, pupil_studygroup
                    WHERE pupil.user_id = {$this->user->id}
                    AND pupil_studygroup.pupil_id = pupil.pupil_id
                    AND course_objectives.studygroup_id = pupil_studygroup.studygroup_id
                    AND (course_objectives.title_en LIKE '%{$query}%' OR course_objectives.description LIKE '%{$query}%' OR course_objectives.grading LIKE '%{$query}%')";
                    break;
                case "parent":
                    $sql = "SELECT course_objectives.title_en, course_objectives.objective_id , course_objectives.description, course_objectives.grading
                    FROM course_objectives, pupil, pupil_studygroup, parents
                    WHERE parents.user_id = {$this->user->id}
                    AND pupil_studygroup.pupil_id = parents.pupil_id
                    AND course_objectives.studygroup_id = pupil_studygroup.studygroup_id
                    AND (course_objectives.title_en LIKE '%{$query}%' OR course_objectives.description LIKE '%{$query}%' OR course_objectives.grading LIKE '%{$query}%')";
                    break;
                default:
                    $sql = "SELECT course_objectives.title_en, course_objectives.objective_id, course_objectives.description, course_objectives.grading
                    FROM course_objectives,studygroups
                    WHERE course_objectives.studygroup_id = studygroups.studygroup_id
                    AND studygroups.entity_id = $entity
                    AND (course_objectives.title_en LIKE '%{$query}%' OR course_objectives.description LIKE '%{$query}%' OR course_objectives.grading LIKE '%{$query}%')";
            }

            $xml = "<row ><cell id='objectives' image='objective.png'>".dlang("course_objectives_search","Course objectives")."</cell><cell></cell>";
            $result = $this->db->query($sql);
            while($row = mysql_fetch_assoc($result)){
                $xml.=$this->getObjectiveXml($row['objective_id'],$row['title_en'],$row['description'],$row['grading'],$query);
            }
            $xml .= "</row>";
            return $xml;
        }

		protected function getObjectiveXml($id,$name,$description, $grading, $query){
			$xml = "";
/*            if(strpos(strtolower($name),strtolower($query))==-1 || strpos(strtolower($name),strtolower($query))===false){
                if(strpos(strtolower($description),strtolower($query))===false){
                    $name = $grading;
                }else{
                    $name = $description;
                }

                $name = trim(strip_tags($name));
                $name = str_replace('&nbsp;', '',$name);
                $name = $this->getContext($name, $query);
            }*/

			$xml .= '<row child="1" id="objective'.'_'.$id.'">';
			$xml .= '<cell image="objective.png">'.$name.'</cell><cell>'.dlang("objective_search","Objective").'</cell>';
			$xml .= '</row>';
			return $xml;
		}

        protected function getPupils($query){
            $entity = $this->user->entity;
            $xml = "<row ><cell id='pupils' image='pupil.png'>".dlang("pupils_search_title","Pupils")."</cell><cell></cell>";
            $result = $this->db->query("SELECT pupil_id, forename, lastname, users.user_id as user_id, username,pupilgroup_id
			FROM pupil,users WHERE pupil.user_id = users.user_id AND users.entity_id = $entity AND (forename LIKE '%{$query}%' OR lastname LIKE '%{$query}%' OR username LIKE '%{$query}%' OR personal_id LIKE '%{$query}%')");
            while($row = mysql_fetch_assoc($result)){
                $xml.=$this->getPupilXml($row['pupil_id'],$row['forename'],$row['lastname'],$row['username'],$row['pupilgroup_id']);
            }

            $result = $this->db->query("SELECT staff_member_id, fore_name, last_name, users.user_id as user_id, username
			FROM staff_members,users WHERE staff_members.user_id = users.user_id AND users.entity_id = $entity AND (fore_name LIKE '%{$query}%' OR last_name LIKE '%{$query}%' OR username LIKE '%{$query}%' OR personal_id LIKE '%{$query}%')");
            while($row = mysql_fetch_assoc($result)){
                $xml.=$this->getStaffXml($row['staff_member_id'],$row['fore_name'],$row['last_name'],$row['username']);
            }

            $xml .= "</row>";
            return $xml;
        }

        protected function getStaffXml($id,$name,$lname,$user){
            $xml = "";
            $xml .= '<row child="1" id="staffmember'.'_'.$id.'">';
            $xml .= '<cell image="staff.png">'.$name.' '.$lname.' ('.$user.')'.'</cell><cell>Staff member</cell>';
            $xml .= '</row>';
            return $xml;
        }

        protected function getPupilXml($id,$name,$lname,$user,$pg){
            $xml = "";
            $xml .= '<row child="1" id="pupil'.'_'.$id.'_'.$pg.'">';
            $xml .= '<cell  image="pupil.png">'.$name.' '.$lname.' ('.$user.')'.'</cell><cell>Pupil</cell>';
            $xml .= '</row>';
            return $xml;
        }

        protected function getStudyGroup($id){
            $entity = $this->user->entity;
            $xml = "";
            $result = $this->db->query("SELECT studygroup_id, title_en, course, startdate, enddate, points FROM studygroups WHERE programme_id=$id");
            while($row = mysql_fetch_assoc($result)){
                $xml.=$this->getStudyGroupXml($row['studygroup_id'],$row['title_en'],$row['course'],$row['startdate'], $row['enddate'],$row['points']);
            }
            return $xml;
        }

        protected function getStudyGroupXml($id,$title,$course,$startdate,$enddate,$points){
            $xml = "";
            $xml .= '<row child="1" id="studygroup'.'_'.$id.'">';
            $xml .= '<cell></cell><cell image="studygroup.png">'.dlang("stg_search","Studygroup").': '.$title.'</cell><cell>
			</cell><cell></cell><cell></cell><cell></cell><cell></cell><cell></cell><cell>'.$course.'</cell><cell>'.$points.'</cell><cell>'.$startdate.'</cell><cell>'.$enddate.'</cell>';
            $xml .= $this->getStaffMember($id);
            $xml .= $this->getPupilGroups($id);
            $xml .= '</row>';
            return $xml;
        }

        protected function getStaffMember($id){
            $entity = $this->user->entity;
            $xml = "";
            $result = $this->db->query("SELECT fore_name, active_until, last_name, staff_members.staff_member_id as staff_members, users.user_id as user_id, username, password , users.created_at as created_at
			 FROM studygroup_staff, staff_members, users
			 WHERE studygroup_staff.studygroup_id=$id AND users.entity_id = $entity AND studygroup_staff.staff_member_id = staff_members.staff_member_id AND users.user_id = staff_members.user_id");

            while($row = mysql_fetch_assoc($result)){
                $actUnt = $row['active_until']!='0000-00-00'?$row['active_until']:'No set';
                $xml.=$this->getStaffMemberXml($row['fore_name'],$row['last_name'],$row['staff_members'],$id,'no', $row['created_at'], $row['username'], $row['password'], $actUnt,  $row['user_id']);
            }
            return $xml;
        }

        protected function getStaffMemberXml($fname, $lname, $id, $stg, $content, $added, $login, $pass, $aunit, $user){
            $xml = "";
            $xml .= '<row child="0" id="staffmember'.'_'.$id.'_'.$stg.'">';

            $portrait = $this->portret_pass.'default.jpg';

            if(file_exists('../'.$this->portret_pass.'small_'.$user.'.jpg')){
                $portrait = $this->portret_pass.'small_'.$user.'.jpg';
            }

            $xml .= '
					<cell></cell>
					<cell image="pupil.png">'.dlang("staff_member_search","Staff member").': '.$fname.' '.$lname.'</cell>
					<cell>'.$content.'</cell>
					<cell>'.$added.'</cell>
					<cell>'.$login.'</cell>
					<cell>'.$pass.'</cell>
					<cell>'.$aunit.'</cell>
					<cell>'.$portrait.'</cell>
					<userdata name="user">'.$user.'</userdata>
			';
            $xml .= '</row>';
            return $xml;
        }

        protected function getPupilGroups($id){
            $entity = $this->user->entity;
            $xml = "";
            $result = $this->db->query("SELECT pupilgroup_id, title_en
										FROM  pupilgroups
										WHERE  pupilgroups.studygroup_id=$id  AND pupilgroups.entity_id = $entity");
            while($row = mysql_fetch_assoc($result)){
                $xml.=$this->getPupilGroupXml($row['pupilgroup_id'],$row['title_en']);
            }
            return $xml;
        }

        protected function getPupilGroupXml($id,$title){
            $xml = "";
            $xml .= '<row child="1" id="pupilgroup'.'_'.$id.'">';
            $xml .= '<cell></cell><cell image="studygroup.png">'.dlang("Pupilgroup").': '.$title.'</cell>';
            $xml .= $this->getPupils($id);
            $xml .= '</row>';
            return $xml;
        }


        protected function getParents($id){
            $entity = $this->user->entity;
            $xml = "";
            $result = $this->db->query("SELECT parent_id, forename, lastname, users.user_id as user_id, username, password , users.created_at as created_at, active_until
			FROM parents, users WHERE pupil_id=$id AND users.user_id = parents.user_id  AND users.entity_id = $entity ");
            while($row = mysql_fetch_assoc($result)){
                $actUnt = $row['active_until']!='0000-00-00'?$row['active_until']:'No set';
                $xml.=$this->getParentsXml($row['parent_id'],$row['forename'],$row['lastname'], 'no', $row['created_at'], $row['username'], $row['password'], $actUnt,  $row['user_id']);
            }
            return $xml;
        }

        protected function getParentsXml($id,$name,$lname, $content, $added, $login, $pass, $aunit, $user){
            $xml = "";
            $xml .= '<row child="0" id="parent'.'_'.$id.'">';
            $portrait = $this->portret_pass.'default.jpg';
            if(file_exists('../'.$this->portret_pass.'small_'.$user.'.jpg')){
                $portrait = $this->portret_pass.'small_'.$user.'.jpg';
            }
            $xml .= '<cell></cell><cell image="pupil.png">'.dlang("Parent").': '.$name.' '.$lname.'</cell>
                <cell>'.$content.'</cell>
                <cell>'.$added.'</cell>
                <cell>'.$login.'</cell>
                <cell>'.$pass.'</cell>
                <cell>'.$aunit.'</cell>
                <cell>'.$portrait.'</cell>
                <userdata name="user">'.$user.'</userdata>
			';
            $xml .= '</row>';
            return $xml;
        }

        protected function getContext($name,$query){
            $len = strlen($name);
            $limit = 160;
            if($len>$limit){
                $text = explode(strtolower($query),strtolower($name),2);
                $left = explode(' ',$text[0]);
                $right = explode(' ',$text[1]);
                $res = "";
                $i=count($left);

                while((strlen($res) < $limit/2) && $i>=0){
                    $res = $left[$i].' '.$res;
                    $i--;
                }
                if($i!=0){
                    $res = '... '.$res;
                }
                $res.=' '.$query.' ';

                $i=0;
                while((strlen($res) < $limit) && $i<=count($right)){
                    $res.=$right[$i].' ';
                    $i++;
                }
                if($i!=count($right)){
                    $res.= '...';
                }
                $name = $res;
                return $name;
            }else{
                return $name;
            }

        }
	}
?>