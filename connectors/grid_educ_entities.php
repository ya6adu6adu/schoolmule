<?php
	require("../dhtmlx/dhtmlxConnector/php/codebase/grid_config.php");
	require("../dhtmlx/dhtmlxConnector/php/codebase/grid_connector.php");
	require("../dhtmlx/dhtmlxConnector/php/codebase/options_connector.php");
	
 	class grid_educ_entities{
		private $db = false;
        private $entity = null;
        private $old_entity = null;
        private $staff = array();
        private $pupilgroup = array();
        private $pupil = array();
        private $grades = array();
        private $objectives = array();
        private $studygroups = array();
        private $members = array();
        private $assignments = array();
        private $performances = array();
        private $folders = array();
        private $pages = array();
        private $rooms = array();
        private $rsets = array();
        private $slots = array();
        private $result = false;


		public function __construct(){
			$this->db = Connection::getDB();

            if(isset($_POST['action'])){
                if($_POST['action'] == 'duplicate'){
                    $this->duplicateEntity($_POST['id']);
                }
                return true;
            }

			$conn = $this->db->getConn();
			$gridConn = new GridConnector($conn,"MySQL");
			$gridConn->event->attach(new EditData());
			$config = new GridConfiguration();
			
			$config->setColIds("entity_name,customer_id,users_now,mb_now,address,zip,city,country_id,contact_person,phone,email");
			$config->setInitWidths("120,120,100,100,120,100,100,100,100,100,*");
			$config->setColTypes("ed,co,ro,ro,ed,ed,ed,co,ed,ed,ed");
			$config->setColSorting("str,int,int,int,str,str,str,int,str,str,str");

			$config->attachHeader("#connector_text_filter,#connector_select_filter,,,,,,,,,,");
			$config->setHeader("Entity name,Customer,Users now,MB now,Address,Zip code,City,Country,Contact person,Phone,Email");
			$gridConn->set_config($config);
			$options = new OptionsConnector($conn); 
			$options->render_table("customers","customer_id","customer_id(value),customer_name(label)");
			$gridConn->set_options("customer_id",$options);
			$gridConn->render_table("educational_entities","entity_id","entity_name,customer_id,users_now,mb_now,address,zip,city,country_id,contact_person,phone,email");
		}

        public function duplicateEntity($id){
            $oldent = $id;

            $this->old_entity = $oldent;

            $this->db->query("START TRANSACTION");
            $this->db->query("CREATE TEMPORARY TABLE temp AS SELECT * FROM educational_entities WHERE entity_id = $oldent");
            $this->db->query("UPDATE temp SET entity_id=NULL");
            $this->db->query("INSERT INTO educational_entities SELECT * FROM temp");
            $this->entity = mysql_insert_id();
            $this->db->query("DROP TABLE temp");
            $result = $this->db->query("SELECT * FROM staff_members,users WHERE staff_members.entity_id = $id AND users.user_id = staff_members.user_id");

            while($row = mysql_fetch_assoc($result)){
                $user = $this->createUser($this->entity,$row['username'],$row['password'],$row['role'],$row['email']);
                $this->db->query("INSERT INTO staff_members (fore_name,last_name,user_id,personal_id,entity_id)
                VALUES('{$row['fore_name']}','{$row['last_name']}',$user,'{$row['personal_id']}',{$this->entity})");
                $this->staff[$row['staff_member_id']] = mysql_insert_id();
            }


            $this->getProgrammes($oldent);

            $this->getAcademicYears($oldent);
            $this->db->query("COMMIT");

            /*$this->db->query("CREATE TEMPORARY TABLE temp AS SELECT * FROM programmes WHERE entity_id = $oldent");
            $this->db->query("UPDATE temp SET programme_id = NULL, entity_id=$entity");
            $this->db->query("INSERT INTO programmes SELECT * FROM temp");
            $affected = mysql_affected_rows();
            $programme = mysql_insert_id();
            for($i=0; $i<$affected; $i++){
                $prog = $programme+$i;
                $this->db->query("START TRANSACTION");
                $this->db->query("CREATE TEMPORARY TABLE temp AS SELECT * FROM years WHERE entity_id = $oldent AND programme_id");
                $this->db->query("UPDATE temp SET entity_id=NULL");
                $this->db->query("INSERT INTO educational_entities SELECT * FROM temp");
                $this->db->query("DROP TABLE temp");
            }
            $this->db->query("DROP TABLE temp");
            */

            //$this->db->query("ROLLBACK");
        }

        public function getProgrammes($oldent){
            $result = $this->db->query("SELECT * FROM programmes WHERE entity_id = $oldent");
            while($row = mysql_fetch_assoc($result)){
                $programme_old = $row['programme_id'];
                $this->db->query("INSERT INTO programmes (title_en,sort_order,entity_id) VALUES ('{$row['title_en']}','{$row['sort_order']}',$this->entity)");
                $programme = mysql_insert_id();
                $this->getYears($programme_old,$programme);
            }
        }

        public function getAcademicYears($oldent){
            $result = $this->db->query("SELECT * FROM academic_years WHERE entity_id = $oldent");
            while($row = mysql_fetch_assoc($result)){
                $year_old = $row['academic_year_id'];
                $this->db->query("INSERT INTO academic_years (title_en,entity_id) VALUES ('{$row['title_en']}',$this->entity)");
                $year = mysql_insert_id();
                $this->getSubjects($year_old,$year);
            }
        }

        public function getSubjects($year_old,$year){
            $result = $this->db->query("SELECT * FROM subjects WHERE academic_year_id = $year_old");
            while($row = mysql_fetch_assoc($result)){
                $subject_old = $row['subject_id'];
                $this->db->query("INSERT INTO subjects (title_en,academic_year_id,entity_id) VALUES ('{$row['title_en']}','{$year}','{$this->entity}')");
                $subject = mysql_insert_id();
                $this->createRooms($subject_old,$subject);
            }
        }

        public function getStudygroups($room_old,$room,$subject){
            $result = $this->db->query("SELECT * FROM studygroups WHERE course_room_id = $room_old");
            while($row = mysql_fetch_assoc($result)){
                $studygroup_old = $row['studygroup_id'];

                //$this->createRoom($studygroup_old);

                $this->db->query("INSERT INTO studygroups (title_en,startdate,enddate,course,points,subject_id, entity_id, course_room_id)
                VALUES ('{$row['title_en']}','{$row['startdate']}','{$row['enddate']}','{$row['course']}','{$row['points']}','{$subject}','{$this->entity}',$room)");

                $studygroup = mysql_insert_id();

                $this->studygroups[$studygroup_old] = $studygroup;

                $this->staffToSTG($studygroup_old,$studygroup);
                $this->pgsToSTG($studygroup_old,$studygroup);

                $this->getObjectives($studygroup_old,$studygroup);
            }
        }

        public function getObjectives($studygroup_old,$studygroup){
            $result = $this->db->query("SELECT * FROM course_objectives WHERE studygroup_id = $studygroup_old");
            while($row = mysql_fetch_assoc($result)){
                $objective_old = $row['objective_id'];
                $this->db->query("INSERT INTO course_objectives (title_en,studygroup_id,weight,sort_order,description,grading,pupil_performance_assessment_id,quality)
                VALUES ('{$row['title_en']}','{$studygroup}','{$row['weight']}','{$row['sort_order']}','{$row['description']}','{$row['grading']}','{$row['pupil_performance_assessment_id']}','{$row['quality']}')");
                $objective= mysql_insert_id();
                $this->objectives[$objective_old] = $objective;
            }
        }

        public function staffToSTG($studygroup_old,$studygroup){
            $result = $this->db->query("SELECT * FROM studygroup_staff WHERE studygroup_id = $studygroup_old");
            while($row = mysql_fetch_assoc($result)){
                $this->db->query("INSERT INTO studygroup_staff (studygroup_id,staff_member_id)
                VALUES ($studygroup,{$this->staff[$row['staff_member_id']]})");
            }
        }

        public function pgsToSTG($studygroup_old,$studygroup){
            $result = $this->db->query("SELECT * FROM studygroup_pupilgroup WHERE studygroup_id = $studygroup_old");
            while($row = mysql_fetch_assoc($result)){
                $this->db->query("INSERT INTO studygroup_pupilgroup (studygroup_id,pupilgroup_id)
                VALUES ($studygroup,{$this->pupilgroup[$row['pupilgroup_id']]})");
            }

            $result = $this->db->query("SELECT * FROM studygroup_grades WHERE studygroup_id = $studygroup_old");
            while($row = mysql_fetch_assoc($result)){
                $this->db->query("INSERT INTO studygroup_grades (studygroup_id,goal,prognose,grade)
                VALUES ($studygroup,{$row['goal']},{$row['prognose']},{$row['grade']})");
                $this->grades[$row['studygroup_grades_id']] = mysql_insert_id();
            }

            $result = $this->db->query("SELECT * FROM pupil_studygroup WHERE studygroup_id = $studygroup_old");

            while($row = mysql_fetch_assoc($result)){
               $this->db->query("INSERT INTO pupil_studygroup (pupil_id,studygroup_id,grades_id,evaluation,development_gola,plan,active,support,long_goals,short_golas,account,arrang,evaluate,other,report)
                VALUES ({$this->pupil[$row['pupil_id']]},{$studygroup},{$this->grades[$row['grades_id']]},'{$row['evaluation']}','{$row['development_gola']}','{$row['plan']}','{$row['active']}','{$row['support']}','{$row['long_goals']}','{$row['short_golas']}','{$row['account']}','{$row['arrang']}','{$row['evaluate']}','{$row['other']}','{$row['report']}')");
            }
        }

        public function createRooms($subject_old,$subject){
            $result = $this->db->query("SELECT * FROM course_rooms WHERE subject_id = $subject_old");
            while($row = mysql_fetch_assoc($result)){
                $room_old = $row['course_room_id'];
                $this->db->query("INSERT INTO course_rooms (title_en,sort_order,subject_id) VALUES ('{$row['title_en']}','{$row['sort_order']}','{$subject}')");
                $room = mysql_insert_id();
                $this->rooms[$room_old] = $room;

                $this->getStudygroups($room_old,$room,$subject);
                $this->getMembers($room_old,$room);
                $this->getFolders($room_old);
                $this->getPages($room_old);
                $this->getAssignments($room_old);
                $this->getPerformances($room_old);
            }
        }


        public function getSlots($assignment_old){
            $result = $this->db->query("SELECT * FROM pupli_submission_slot WHERE assignment_id = $assignment_old");
            while($row = mysql_fetch_assoc($result)){
                $slot_old = $row['submission_slot_id'];

                $this->db->query("INSERT INTO pupli_submission_slot (assignment_id,activation_date,pupil_id,status,active,content_en,studygroup_id,submission_date)
                VALUES ('{$this->assignments[$row['assignment_id']]}','{$row['activation_date']}',
                '{$this->pupil[$row['pupil_id']]}','{$row['status']}','{$row['active']}','{$row['content_en']}',
                '{$this->studygroups[$row['studygroup_id']]}','{$row['submission_date']}')");

                $slot = mysql_insert_id();
                $this->slots[$slot_old] = $slot;

                $this->getResults($slot_old);
            }
        }

        public function getResults($old_slot){
            $result = $this->db->query("SELECT * FROM pupil_submission_result WHERE submission_slot_id = $old_slot");
            while($row = mysql_fetch_assoc($result)){

                $this->db->query("INSERT INTO pupil_submission_result (submission_slot_id,result_set_id,result,assessment,studygroup_id,grade_definition_id,pass)
                VALUES ('{$this->slots[$row['submission_slot_id']]}','{$this->rsets[$row['result_set_id']]}',
                '{$row['result']}','{$row['assessment']}','{$this->studygroups[$row['studygroup_id']]}','{$row['grade_definition_id']}','{$row['pass']}')");

            }
        }

        public function getPerfAssess($old_rest){
            $result = $this->db->query("SELECT * FROM pupil_performance_assessment WHERE resultset_id = $old_rest");

            while($row = mysql_fetch_assoc($result)){
                $this->db->query("INSERT INTO pupil_performance_assessment (pupil_id,performance_id,assessment,studygroup_id,active,passed,content_en,resultset_id)
                VALUES ('{$this->pupil[$row['pupil_id']]}','{$this->performances[$row['performance_id']]}',
                '{$row['assessment']}','{$this->studygroups[$row['studygroup_id']]}','{$row['active']}','{$row['passed']}','{$row['content_en']}','{$this->rsets[$row['resultset_id']]}')");
            }

        }

        public function getResultSetsAss($assignment_old){
            $result = $this->db->query("SELECT * FROM resultsets WHERE assignment_id = $assignment_old");
            while($row = mysql_fetch_assoc($result)){
                $rset_old = $row['resultset_id'];

                $this->db->query("INSERT INTO resultsets (assignment_id,result_unit_id,result_max,result_pass,mandatory,castom_name)
                VALUES ('{$this->assignments[$row['assignment_id']]}','{$row['result_unit_id']}','{$row['result_max']}','{$row['result_pass']}','{$row['mandatory']}','{$row['castom_name']}')");

                $rset = mysql_insert_id();
                $this->rsets[$rset_old] = $rset;

                $stgs = $this->getResultSetsStg($rset_old);

                $this->db->query("UPDATE resultsets SET studygroup_ids = '$stgs' WHERE resultset_id = $rset");

                $this->getResultSetsObjs($rset_old,'assignment');

                $this->getSlots($assignment_old);
            }
        }

        public function getResultSetsPerf($perf_old){
            $result = $this->db->query("SELECT * FROM resultsets WHERE performance_id = $perf_old");
            while($row = mysql_fetch_assoc($result)){
                $rset_old = $row['resultset_id'];

                $this->db->query("INSERT INTO resultsets (performance_id,result_unit_id,result_max,result_pass,mandatory,castom_name)
                VALUES ('{$this->performances[$row['performance_id']]}','{$row['result_unit_id']}','{$row['result_max']}','{$row['result_pass']}','{$row['mandatory']}','{$row['castom_name']}')");

                $rset = mysql_insert_id();
                $this->rsets[$rset_old] = $rset;

                $stgs = $this->getResultSetsStg($rset_old);

                $this->db->query("UPDATE resultsets SET studygroup_ids = '$stgs' WHERE resultset_id = $rset");

                $this->getResultSetsObjs($rset_old,'performance');

                $this->getPerfAssess($rset_old);
            }
        }

        public function getResultSetsObjs($rset,$type){
            $result = $this->db->query("SELECT * FROM resultset_to_course_objectives WHERE resultset_id = $rset");

            while($row = mysql_fetch_assoc($result)){
                $this->db->query("INSERT INTO resultset_to_course_objectives (resultset_id,objective_id,type)
                VALUES ('{$this->rsets[$row['resultset_id']]}','{$this->objectives[$row['objective_id']]}','$type')");
            }

        }

        public function getResultSetsStg($rset){
            $result = $this->db->query("SELECT * FROM resultsets_studygroups WHERE resultset_id = $rset");
            $stgs = array();
            while($row = mysql_fetch_assoc($result)){

                $this->db->query("INSERT INTO resultsets_studygroups
                (resultset_id,studygroup_id)
                VALUES ('{$this->rsets[$row['resultset_id']]}','{$this->studygroups[$row['studygroup_id']]}')");
                $stgs[] = $this->studygroups[$row['studygroup_id']];
            }
            return implode(',',$stgs);
        }

        public function getPages($room_old){
            $result = $this->db->query("SELECT * FROM course_rooms_elements WHERE course_room_id = $room_old");
            while($row = mysql_fetch_assoc($result)){
                $page_old = $row['page_id'];
                $pfolder = isset($this->folders[$row['folder_id']])?$this->folders[$row['folder_id']]:0;
                $this->db->query("INSERT INTO course_rooms_elements
                (title_en,sort_order,published_content_en,edit_content_en,course_room_id,folder_id)
                VALUES ('{$row['title_en']}','{$row['sort_order']}','{$row['published_content_en']}','{$row['edit_content_en']}','{$this->rooms[$row['course_room_id']]}','{$pfolder}')");
                $page = mysql_insert_id();
                $this->pages[$page_old] = $page;
            }
        }

        public function getFolders($room_old){
            $result = $this->db->query("SELECT * FROM course_room_folders WHERE course_room_id = $room_old");
            while($row = mysql_fetch_assoc($result)){
                $folder_old = $row['folder_id'];
                $pfolder = isset($this->folders[$row['folder_id']])?$this->folders[$row['folder_id']]:0;
                $this->db->query("INSERT INTO course_room_folders
                (title_en,sort_order,course_room_id,folder_parent_id)
                VALUES ('{$row['title_en']}','{$row['sort_order']}','{$this->rooms[$row['course_room_id']]}','{$pfolder}')");
                $folder = mysql_insert_id();
                $this->folders[$folder_old] = $folder;
            }
        }

        public function getAssignments($room_old){
            $result = $this->db->query("SELECT * FROM course_rooms_assignments WHERE course_room_id = $room_old");
            while($row = mysql_fetch_assoc($result)){
                $assignment_old = $row['assignment_id'];

                $ppage =  isset($this->pages[$row['page_id']])?$this->pages[$row['page_id']]:0;
                $pfolder =  isset($this->folders[$row['folder_id']])?$this->folders[$row['folder_id']]:0;
                $plink = isset($this->assignments[$row['link']])?$this->assignments[$row['link']]:0;

                $this->db->query("INSERT INTO course_rooms_assignments
                (title_en,page_id,sort_order,content_en,owner_notes_en,published_date,published_passed,activation_date,deadline_date,deadline_passed,studygroup_id,publication,activation,deadline,course_room_id,link,folder_id)
                VALUES ('{$row['title_en']}','{$ppage}','{$row['sort_order']}','{$row['content_en']}','{$row['owner_notes_en']}','{$row['published_date']}','{$row['published_passed']}','{$row['activation_date']}'
                ,'{$row['deadline_date']}','{$row['deadline_passed']}','{$this->studygroups[$row['studygroup_id']]}','{$row['publication']}','{$row['activation']}','{$row['deadline']}','{$this->rooms[$row['course_room_id']]}','{$plink}','{$pfolder}')");
                $assignement = mysql_insert_id();
                $this->assignments[$assignment_old] = $assignement;

                $this->getResultSetsAss($assignment_old);

            }
        }

        public function getPerformances($room_old){
            $result = $this->db->query("SELECT * FROM performance WHERE course_room_id = $room_old");
            while($row = mysql_fetch_assoc($result)){
                $performance_old = $row['performance_id'];

                $ppage =  isset($this->pages[$row['page_id']])?$this->pages[$row['page_id']]:0;
                $pfolder =  isset($this->folders[$row['folder_id']])?$this->folders[$row['folder_id']]:0;
                $plink = isset($this->assignments[$row['link']])?$this->assignments[$row['link']]:0;

                $this->db->query("INSERT INTO performance
                (title_en,page_id,sort_order,content_en,owner_notes,studygroup_id,course_room_id,link,folder_id)
                VALUES ('{$row['title_en']}','{$ppage}','{$row['sort_order']}','{$row['content_en']}','{$row['owner_notes']}',
                '{$this->studygroups[$row['studygroup_id']]}','{$this->rooms[$row['course_room_id']]}','{$plink}','{$pfolder}')");

                $performance = mysql_insert_id();
                $this->performances[$performance_old] = $performance;

                $this->getResultSetsPerf($performance_old);
            }
        }

        public function getMembers($room_old,$room){
            $result = $this->db->query("SELECT * FROM course_room_members WHERE course_room_id = $room_old");
            while($row = mysql_fetch_assoc($result)){
                $member_old = $row['member_id'];
                $this->db->query("INSERT INTO course_room_members (title_en,course_room_id,sort_order) VALUES ('{$row['title_en']}','{$room}','{$row['sort_order']}')");
                $member = mysql_insert_id();
                $this->members[$member_old] = $member;
            }
        }

        public function getYears($programme_old,$programme){
            $result = $this->db->query("SELECT * FROM years WHERE programme_id = $programme_old");
            while($row = mysql_fetch_assoc($result)){
                $year_old = $row['year_id'];
                $this->db->query("INSERT INTO years (title_en,programme_id,sort_order,entity_id) VALUES ('{$row['title_en']}','{$programme}','{$row['sort_order']}','{$this->entity}')");
                $year = mysql_insert_id();
                $this->getPupilgroups($year_old,$year);
            }
        }

        public function getPupilgroups($year_old,$year){
            $result = $this->db->query("SELECT * FROM pupilgroups WHERE year_id = $year_old");
            while($row = mysql_fetch_assoc($result)){
                $pg_old = $row['pupilgroup_id'];
                $this->db->query("INSERT INTO pupilgroups (title_en,year_id,sort_order,entity_id) VALUES ('{$row['title_en']}','{$year}','{$row['sort_order']}','{$this->entity}')");
                $pg = mysql_insert_id();
                $this->pupilgroup[$pg_old] = $pg;
            }

            $this->getPupils($pg_old,$pg);
        }

        public function getPupils(){
            $result = $this->db->query("SELECT * FROM pupil, users WHERE users.entity_id = $this->old_entity AND pupil.user_id = users.user_id");

            while($row = mysql_fetch_assoc($result)){
                $user = $this->createUser($this->entity,$row['username'],$row['password'],$row['role'],$row['email']);
                $pupil_old = $row['pupil_id'];
                $this->db->query("INSERT INTO pupil (forename,lastname,pupil_image,personal_id,user_id) VALUES ('{$row['forename']}','{$row['lastname']}','{$row['pupil_image']}','{$row['personal_id']}','{$user}')");
                $pupil = mysql_insert_id();
                $this->pupil[$pupil_old] = $pupil;
                $this->getParents($pupil_old,$pupil);
            }

            $this->getPgsLinks();
        }

        public function getPgsLinks(){
            $result = $this->db->query("SELECT * FROM pupil_pupilgroup");
            while($row = mysql_fetch_assoc($result)){
                $new_pg = $this->pupilgroup[$row['pupilgroup_id']];
                $new_p = $this->pupil[$row['pupil_id']];
                if($new_pg && $new_p){
                    $this->db->query("INSERT INTO pupil_pupilgroup (pupil_id,pupilgroup_id) VALUES ({$new_p},{$new_pg})");
                }
            }
        }

        public function getParents($pupil_old,$pupil){
            $result = $this->db->query("SELECT * FROM parents,users WHERE pupil_id = $pupil_old AND users.user_id = parents.user_id");
            while($row = mysql_fetch_assoc($result)){
                $user = $this->createUser($this->entity,$row['username'],$row['password'],$row['role'],$row['email']);
                $this->db->query("INSERT INTO parents (forename,lastname,pupil_id,user_id) VALUES ('{$row['forename']}','{$row['lastname']}',$pupil,'{$user}')");
            }
        }

        public function createUser($entity,$username,$password,$role,$email){
            $result = $this->db->query("SELECT user_id FROM users WHERE username LIKE '%$username%'");
            $col = mysql_num_rows($result);
            $fsur = $username;
            if($col>0){
                $username = $fsur.$col;
            }else{
                $username = $fsur;
            }

            $this->db->query("INSERT INTO users (username, password, role, created_at,entity_id,email) VALUES ('$username','$password','$role', CURDATE(),$entity,'$email')");
            return mysql_insert_id();
        }
	}

	class EditData{
		private $db = false;
		public function __construct(){
			$this->db = Connection::getDB();
		}
		public function beforeRender($data){
			$id = $data->get_value("entity_id");
			$sql = "SELECT admininstrator_id FROM administrators WHERE entity_id=$id";
			$result = $this->db->query($sql);
			$data->set_value("cnt_admins",mysql_num_rows($result));
		}
	}

?>