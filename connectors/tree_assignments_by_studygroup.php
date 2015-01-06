<?php
	include_once '../libs/Connection.php';
	include_once '../libs/tree_editor.php';


	class tree_assignments_by_studygroup extends tree_editor{
		public function __construct($no_creating = false){
            parent::__construct();
            if($no_creating){
                return true;
            }

			if(!isset($_POST['action'])){
                $id = null;
                header("content-type:text/xml;charset=UTF-8");
                if(isset($_GET['refresh'])){
                    $refresh = $_GET['refresh'];
                }else{
                    $refresh = false;
                }
                if(isset($_GET['id'])){
                    $id = $_GET['id'];
                }else{
                    $id = $_GET['ids'];
                }
                echo ($this->getXml($id,$_GET['autoload'],$refresh));
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
            if(1){
                $rf = '0';
                $xml = $this->getItemLoad(0,"mystg",$rf,false);
            }else{
                if($id == "0"){
                    $xml = '<item child="1" text="'.dlang("tree_obj_myco","My ongoing course objectives").'" id="myobj" im1="folder_open.png" im2="folder_closed.png">';
                }else{
                    $rf = '0';
                    $xml = $this->getItemLoad(0,$id,$rf,true);
                }
            }
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
                    $items[] = array('table' => 'course_rooms_assignments',
                        'id' => 'assignment',
                        'pid' => 'course_room_id',
                    );
                    $items[] = array('table' => 'performance',
                        'id' => 'performance',
                        'pid' => 'course_room_id',
                    );
                    $items[] = array('table' => 'course_room_folders',
                        'id' => 'folder',
                        'pid' => 'course_room_id',
                    );
                    $items[] = array('table' => 'course_rooms_elements',
                        'id' => 'page',
                        'pid' => 'course_room_id',
                    );
                    if($this->user->role != "pupil" && $this->user->role != "parent"){
                        $items[] = array('table' => 'course_room_members',
                            'id' => 'member',
                            'pid' => 'course_room_id',
                        );
                    }
                    break;
                case 'folder':
                    $items[] = array('table' => 'course_rooms_elements',
                        'id' => 'page',
                        'pid' => 'folder_id',
                    );
                    $items[] = array('table' => 'course_room_folders',
                        'id' => 'folder',
                        'pid' => 'folder_parent_id',
                    );
                    $items[] = array('table' => 'course_rooms_assignments',
                        'id' => 'assignment',
                        'pid' => 'folder_id',
                    );
                    $items[] = array('table' => 'performance',
                        'id' => 'performance',
                        'pid' => 'folder_id',
                    );
                    break;
                case 'page':
                    $items[] = array('table' => 'course_rooms_assignments',
                        'id' => 'assignment',
                        'pid' => 'page_id',
                    );
                    $items[] = array('table' => 'performance',
                        'id' => 'performance',
                        'pid' => 'page_id',
                    );
                    break;
                case 'member':
/*                    $items[] = array('table' => 'course_rooms_assignments',
                        'id' => 'assignment',
                        'pid' => 'page_id',
                    );
                    $items[] = array('table' => 'performance',
                        'id' => 'performance',
                        'pid' => 'studygroup_id',
                    );*/
                    break;
                case 'studygroup':
/*					$items[] = array('table' => 'course_rooms_assignments',
									 'id' => 'assignment',
									 'pid' => 'studygroup_id', 
									);
					$items[] = array('table' => 'performance',
									 'id' => 'performance',
									 'pid' => 'studygroup_id', 
									);*/
					break;
                case 'academicyear':
                    $items[] = array('table' => 'subjects',
                        'id' => 'subject',
                        'pid' => 'academic_year_id',
                    );
                    break;

                case 'subject':
                    $items[] = array('table' => 'course_rooms',
                        'id' => 'course_room',
                        'pid' => 'subject_id',
                    );
                    break;
				case 'mystg':
                    $items[] = array('table' => 'academic_years',
                        'id' => 'academicyear',
                        'pid' => 'mystg',
                    );
					break;

                case 'year':
                    $items[] = array('table' => 'studygroups',
                        'id' => 'studygroup',
                        'pid' => 'year_id',
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
                case 'page':
                    $table = "course_rooms_elements";
                    $id_name = "page";
                    break;
                case 'members':
                    $table = "course_room_members";
                    $id_name = "member_id";
                    break;
                case 'folder':
                    $table = "course_room_folders";
                    $id_name = "folder";
                    break;
                case 'academicyear':
                    $table = "academic_years";
                    $id_name = "academicyear";
                    break;
                case 'subject':
                    $table = "subjects";
                    $id_name = "subject";
                    break;
                case 'year':
                    $table = "years";
                    $id_name = "year";
                    break;
				case 'studygroup':
					$table = "studygroups";
					$id_name = "studygroup";
					break;
				case 'mystg':
					$table = "mystg";
					$id_name = "mystg";
					break;
				case 'assignment':
					$table = "course_rooms_assignments";
					$id_name = "assignment";
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

        public function createAssignmentItems($room, $ass){
            $result = $this->db->query("
                SELECT pupil.pupil_id as pupil_id, pupil_studygroup.studygroup_id
                FROM pupil, pupil_studygroup, studygroups
                WHERE studygroups.course_room_id={$_POST['id']}
                AND pupil_studygroup.studygroup_id=studygroups.studygroup_id
                AND pupil_studygroup.pupil_id=pupil.pupil_id
            ");

            while ($row = mysql_fetch_assoc($result)) {
                $this->db->query("INSERT INTO pupli_submission_slot (assignment_id,pupil_id,status,content_en,studygroup_id,activation_date) VALUES ($ass,{$row['pupil_id']},'Not subm.','','{$row['studygroup_id']}',NOW())");
            }

            $sql = "INSERT INTO resultsets (assignment_id,result_unit_id) VALUES($ass,1)";
            $this->db->query($sql);
            $rs = mysql_insert_id();
            $sql = "SELECT submission_slot_id, studygroup_id FROM pupli_submission_slot WHERE assignment_id=$ass";
            $result = $this->db->query($sql);

            while($row = mysql_fetch_assoc($result)){
                $this->db->query("INSERT INTO pupil_submission_result (submission_slot_id,result_set_id,studygroup_id) VALUES ({$row['submission_slot_id']},$rs,{$row['studygroup_id']})");
            }

            if($room){
                $sql = "
                    SELECT objective_id,studygroups.studygroup_id FROM course_objectives,studygroups
                    WHERE studygroups.course_room_id={$room}
                    AND studygroups.studygroup_id=course_objectives.studygroup_id
                ";

                $result = $this->db->query($sql);

                $stgs = array();
                while($row = mysql_fetch_assoc($result)){
                    $this->db->query("INSERT INTO resultset_to_course_objectives (resultset_id,objective_id,type) VALUES ($rs,{$row['objective_id']},'assignment')");
                    $stgs[$row['studygroup_id']] = $row['studygroup_id'];
                }

                $stgs_str = implode(',',$stgs);

                $sql = "UPDATE resultsets SET studygroup_ids = '$stgs_str' WHERE resultset_id=$rs";
                $this->db->query($sql);

                foreach($stgs as $value){
                    $this->db->query("INSERT INTO resultsets_studygroups (resultset_id,studygroup_id) VALUES ($rs, {$value})");
                }
            }
        }

        public function createPerformanceItems($room,$per){
            $this->db->query("INSERT INTO resultsets (performance_id) VALUES($per)");
            $rset = mysql_insert_id();

            $sql = "SELECT objective_id,studygroups.studygroup_id FROM course_objectives,studygroups
                    WHERE studygroups.course_room_id={$room}
                    AND studygroups.studygroup_id=course_objectives.studygroup_id";

            $stgs = array();
            $result = $this->db->query($sql);
            while($row = mysql_fetch_assoc($result)){
                $this->db->query("INSERT INTO resultset_to_course_objectives (resultset_id, objective_id, type) VALUES ($rset,{$row['objective_id']},'performance')");
                $stgs[$row['studygroup_id']] = $row['studygroup_id'];
            }
            $stgs_str = implode(',',$stgs);

            $sql = "UPDATE resultsets SET studygroup_ids = '$stgs_str' WHERE resultset_id=$rset";

            $this->db->query($sql);

            foreach($stgs as $value){
                $this->db->query("INSERT INTO resultsets_studygroups (resultset_id,studygroup_id) VALUES ($rset, {$value})");
            }

            $result = $this->db->query("
                    SELECT pupil.pupil_id as pupil_id, pupil_studygroup.studygroup_id
                    FROM pupil, pupil_studygroup, studygroups
                    WHERE studygroups.course_room_id={$_POST['id']}
                    AND pupil_studygroup.studygroup_id=studygroups.studygroup_id
                    AND pupil_studygroup.pupil_id=pupil.pupil_id");

            while ($row = mysql_fetch_assoc($result)) {
                $this->db->query("INSERT INTO pupil_performance_assessment (performance_id,pupil_id,studygroup_id,activation_date, resultset_id) VALUES ($per,{$row['pupil_id']},{$row['studygroup_id']},NOW(),$rset)");
            }
        }

		public function addObjectiveItem($item){
			switch($item){
                case "room":
                    $values = array(
                        'owner_id' => 0,
                        'shared'=> 0,
                        'subject_id'=>  $_POST["subject_id"],
                        'description' => "new description",
                    );
                    break;
                case "folder":
                    $values = array(
                        'course_room_id' => $_POST["room_id"],
                        'folder_parent_id'=> $_POST["p_folder"]
                    );
                    break;
                case "page":
                    $values = array(
                        'course_room_id' =>  $_POST["room_id"],
                        'title_en' => $_POST["item_name"],
                        'folder_id'=> $_POST["p_folder"]
                    );
                    break;
				case "assignment":
					$values = array(
                                'course_room_id' => $_POST["id"],
                                'title_en' => $_POST["item_name"],
                                'studygroup_id' => $this->getCourseRoomStgs(),
                                'page_id' => $_POST["page"],
                                'folder_id' => $_POST["folder"]
								);			
					break;
				case "performance":
					$values = array(
                                'course_room_id' => $_POST["id"],
                                'studygroup_id' => $this->getCourseRoomStgs(),
                                'page_id' => $_POST["page"],
                                'title_en' => $_POST["item_name"],
                                'folder_id' => $_POST["folder"],
								'public' => 1
								);
					break;
				case "performancenp":
					$item = "performance";
					$values = array(
                                'course_room_id' => $_POST["id"],
                                'page_id' => $_POST["page"],
                                'title_en' => $_POST["item_name"],
                                'folder_id' => $_POST["folder"],
								'public' => 0
								);
					break;
			}

			$itemInfo = $this->getTableInfoFromType($item);
            if($values['title_en']){
			    $response = $this->addItem($itemInfo['table'],$values,$item,$values['title_en']);
            }else{
                $response = $this->addItem($itemInfo['table'],$values,$item);
            }


            if($item == "room"){
                $room = $response['idf'];
                $title = dlang("course_room_member","Course room members");
                $this->db->query("INSERT INTO course_room_members (title_en, sort_order, course_room_id) VALUES ('$title',1, $room)");
            }
			if($item == "assignment"){
                $this->createAssignmentItems($_POST["id"],$response['idf']);
			}
			
			if($item == "performance" || $item == "performancenp"){
                $this->createPerformanceItems($_POST["id"],$response['idf']);
			}
			return $response;
		}

        public function getCourseRoomStgs(){
            $result = $this->db->query("
						SELECT studygroup_id FROM studygroups
						WHERE course_room_id={$_POST["id"]}
					");

            $stg = 0;
            if(mysql_num_rows($result)==1){
                $row = mysql_fetch_assoc($result);
                $stg =  $row['studygroup_id'];
            }
            return $stg;
        }
		
		public function deleteObjectiveItem($id,$item){
			$itemInfo = $this->getTableInfoFromType($item);
			$items = explode(',',$id);
			for ($i=0; $i < count($items); $i++){
					$item = explode('_',$items[$i]);
					if($item[0]==="performance" || $item[0]==="performancenp"){
                        $this->deletePerformance($item[1]);
					}
					
					$response = $this->removeItem($item[1],$itemInfo['table'],$itemInfo['id_name']);
					if($item[0]=="assignment"){
                        $this->deleteAssignment($item[1]);
				    }
			}
			
			return $response;
		}

        public function deleteAssignment($id){
            $this->db->query("
                            DELETE resultsets,resultsets_studygroups, resultset_to_course_objectives,pupil_submission_result,pupli_submission_slot,files_comments,files
                            FROM resultsets
                            LEFT JOIN resultsets_studygroups ON resultsets_studygroups.resultset_id = resultsets.resultset_id
                            LEFT JOIN resultset_to_course_objectives ON resultset_to_course_objectives.resultset_id = resultsets.resultset_id
                            LEFT JOIN pupli_submission_slot ON pupli_submission_slot.assignment_id = {$id}
                            LEFT JOIN pupil_submission_result ON pupil_submission_result.submission_slot_id = pupli_submission_slot.submission_slot_id
                            LEFT JOIN files_comments ON files_comments.item_id = resultsets.assignment_id AND files_comments.type_item = 'assignment'
                            LEFT JOIN files ON files.item_id = resultsets.assignment_id AND files.item_type = 'assignment'
                            WHERE resultsets.assignment_id = {$id}
						 ");
        }

        public function deletePerformance($id){
            $this->db->query("
                            DELETE resultsets,resultsets_studygroups, resultset_to_course_objectives,pupil_performance_assessment, files_comments, files
                            FROM resultsets
                            LEFT JOIN resultsets_studygroups ON resultsets_studygroups.resultset_id = resultsets.resultset_id
                            LEFT JOIN resultset_to_course_objectives ON resultset_to_course_objectives.resultset_id = resultsets.resultset_id
                            LEFT JOIN pupil_performance_assessment ON pupil_performance_assessment.performance_id = resultsets.performance_id
                            LEFT JOIN files_comments ON files_comments.item_id = resultsets.performance_id AND files_comments.type_item = 'performance'
                            LEFT JOIN files ON files.item_id = resultsets.performance_id AND files.item_type = 'performance'
                            WHERE resultsets.performance_id = {$id}
						 ");
        }
		
		public function shareObjectiveItem($id,$item){
			$itemInfo = $this->getTableInfoFromType($item);
			$response = $this->shareItem($id,$itemInfo['table'],$itemInfo['id_name']);
			return $response;
		}

		public function privateObjectiveItem($id,$item){
			$itemInfo = $this->getTableInfoFromType($item);
			$response = $this->privateItem($id,$itemInfo['table'],$itemInfo['id_name']);
			return $response;
		}

		public function deleteContentObjectiveItem($id,$item){
			$itemInfo = $this->getTableInfoFromType($item);
			$response = $this->removeItemContent($id,$itemInfo['table'],$itemInfo['id_name']);
			return $response;
		}


        public function duplicatePerformace($id,$per,$room,$study_groups){
            $study_groups = array();
            $room = "";
            $result_assignment = $this->db->query("SELECT performance.course_room_id, studygroups.studygroup_id  FROM performance,studygroups WHERE performance_id={$per} AND performance.course_room_id = studygroups.course_room_id");
            while($assignment_info =  mysql_fetch_assoc($result_assignment)){
                $room = $assignment_info['course_room_id'];
                $study_groups[] = $assignment_info['studygroup_id'];
            }

            $study_groups_string = implode(',',$study_groups);

            $result_set = $this->db->query("SELECT * FROM resultsets WHERE performance_id={$id}");
            while ($result_set_info = mysql_fetch_assoc($result_set)){
                $this->db->query("
                    INSERT INTO resultsets (deadline,performance_id,studygroup_ids)
                    VALUES (0,$per,'{$study_groups_string}')
                ");

                $rs = mysql_insert_id();

                $result_objectives = $this->db->query("SELECT * FROM course_objectives WHERE studygroup_id IN ('$study_groups_string')");

                while ($row_co = mysql_fetch_assoc($result_objectives)){
                    $this->db->query("INSERT INTO resultset_to_course_objectives (resultset_id,objective_id,type) VALUES ($rs,{$row_co['objective_id']},'performance')");
                }

                for($i=0; $i<count($study_groups); $i++){
                    $this->db->query("INSERT INTO resultsets_studygroups (resultset_id,studygroup_id) VALUES ($rs,{$study_groups[$i]})");
                }
                if($room){
                    $pupils_info = $this->db->query("
                    SELECT pupil.pupil_id as pupil_id, pupil_studygroup.studygroup_id as studygroup_id FROM pupil, pupil_studygroup, studygroups
                    WHERE studygroups.course_room_id = {$room}
                    AND studygroups.studygroup_id = pupil_studygroup.studygroup_id
                    AND pupil_studygroup.pupil_id = pupil.pupil_id
                ");

                    while ($pupil = mysql_fetch_assoc($pupils_info)) {
                        $this->db->query("INSERT INTO pupil_performance_assessment (performance_id,pupil_id,studygroup_id,activation_date,resultset_id) VALUES ($per,{$pupil['pupil_id']},'{$pupil['studygroup_id']}',NOW(),$rs)");
                    }
                }

            }
        }

        public function duplicateAssignment($id,$assignemnt,$room,$study_groups){
            $study_groups_string = implode(',',$study_groups);
            $slots = Array();
            $result_set = $this->db->query("SELECT * FROM resultsets WHERE assignment_id={$id}");
            while ($result_set_info = mysql_fetch_assoc($result_set)){
                $this->db->query("INSERT INTO resultsets (assignment_id,result_unit_id,result_max,result_pass,mandatory,studygroup_ids)
                VALUES ($assignemnt,{$result_set_info['result_unit_id']},'{$result_set_info['result_max']}','{$result_set_info['result_pass']}',{$result_set_info['mandatory']},'$study_groups_string')");

                $rs = mysql_insert_id();

                $result_objectives = $this->db->query("SELECT * FROM course_objectives WHERE studygroup_id IN ('$study_groups_string')");

                while ($row_co = mysql_fetch_assoc($result_objectives)){
                    $this->db->query("INSERT INTO resultset_to_course_objectives (resultset_id,objective_id,type) VALUES ($rs,{$row_co['objective_id']},'assignment')");
                }

                for($i=0; $i<count($study_groups); $i++){
                    $this->db->query("INSERT INTO resultsets_studygroups (resultset_id,studygroup_id) VALUES ($rs,{$study_groups[$i]})");
                }
                if($room){
                    $pupils_info = $this->db->query("
                    SELECT pupil.pupil_id as pupil_id, pupil_studygroup.studygroup_id as studygroup_id FROM pupil, pupil_studygroup, studygroups
                    WHERE studygroups.course_room_id = {$room}
                    AND studygroups.studygroup_id = pupil_studygroup.studygroup_id
                    AND pupil_studygroup.pupil_id = pupil.pupil_id
                ");
                    while ($pupil = mysql_fetch_assoc($pupils_info)) {
                        $slot = null;
                        if($slots[$pupil['pupil_id']]){
                            $slot = $slots[$pupil['pupil_id']];
                        }else{
                            $this->db->query("INSERT INTO pupli_submission_slot (assignment_id,pupil_id,status,content_en,studygroup_id,activation_date) VALUES ($assignemnt,{$pupil['pupil_id']},'Not subm.','','{$pupil['studygroup_id']}',NOW())");
                            $slot = mysql_insert_id();
                            $slots[$pupil['pupil_id']] = $slot;
                        }
                        $this->db->query("INSERT INTO pupil_submission_result (submission_slot_id,result_set_id,studygroup_id) VALUES ({$slot},$rs,{$pupil['studygroup_id']})");
                    }
                }

            }
        }

		public function duplicateObjectiveItem($id,$item,$flag = true,$room){
			$itemInfo = $this->getTableInfoFromType($item);
			$response = $this->duplicateItem($id,$itemInfo['table'],$itemInfo['id_name'], null, null,null, false,null,$room);
            $item_id = $response["id"];
/*            if($flag){
                if($item=="assignment" || $item=="performance"){
                    $this->duplicateItemsMan($id,$item_id,$item);
                }
            }*/
            return $response;
		}

		public function moveObjectiveItem($ids,$item,$sid,$lid,$par){
			$itemInfo = $this->getTableInfoFromType($item);
            $crom = "";
            $oldcr = "";
            $parents = $this->getMoveConfig($item,$par);

            if($item ==="studygroup"){
                $result2 = $this->db->query("
						SELECT course_room_id FROM studygroups
						WHERE studygroup_id={$sid}
					");

                $row = mysql_fetch_assoc($result2);
                $oldcr = $row['course_room_id'];

                $result = $this->db->query("
						SELECT course_room_id FROM course_room_members
						WHERE member_id={$par[1]}
					");
                $row = mysql_fetch_assoc($result);
                $crom =  $row['course_room_id'];

                $parents = array(
                    'course_room_id' => $row['course_room_id']
                );
            }

            if($item==="assignment"){
                $result2 = $this->db->query("
						SELECT course_room_id FROM course_rooms_assignments
						WHERE assignment_id={$sid}
					");

                $row = mysql_fetch_assoc($result2);
                $oldcr = $row['course_room_id'];
            }

            if($item==="performance"){
                $result2 = $this->db->query("
						SELECT course_room_id FROM performance
						WHERE performance_id={$sid}
					");

                $row = mysql_fetch_assoc($result2);
                $oldcr = $row['course_room_id'];
            }

			$response = $this->setParent($sid,$parents,$lid,$itemInfo['id_name'],$itemInfo['table'],$_POST['studygroup']);


            if($item==="studygroup"){
                $this->moveStudygroupItems($crom,$sid,$oldcr);
            }

			return $response;
		}

        public function moveAssignmentItems($crom,$sid,$type){

            $result = $this->db->query("
                SELECT resultset_id FROM resultsets
                WHERE {$type}_id={$sid}
            ");

            while($row = mysql_fetch_assoc($result)){
                $this->db->query("
                    DELETE FROM resultset_to_course_objectives WHERE resultset_id={$row['resultset_id']}
                ");

                $result2 = $this->db->query("
                    SELECT objective_id FROM studygroups
                    JOIN course_objectives ON studygroups.studygroup_id = course_objectives.studygroup_id
                    WHERE studygroups.course_room_id={$crom}
                ");

                while($row2 = mysql_fetch_assoc($result2)){
                    $this->db->query("
                      INSERT INTO resultset_to_course_objectives (resultset_id,objective_id,type) VALUES ({$row['resultset_id']},{$row2['objective_id']},'$type')
                    ");
                }
            }
        }

        public function removeStudygroupFromRoom($id,$remove_assignments){
            $result = $this->db->query("
                SELECT assignment_id,course_room_id FROM course_rooms_assignments WHERE studygroup_id = $id
            ");
            $num = mysql_num_rows($result);

            $room = mysql_fetch_assoc($result);
            $room = $room['course_room_id'];


            if($num>0 && $remove_assignments == 'false'){
                return "{'num':'$num'}";
            }else{

                $this->db->query("
					 UPDATE studygroups
					 SET course_room_id=0
					 WHERE studygroup_id=$id
				");

                $this->db->query("DELETE FROM pupli_submission_slot WHERE studygroup_id=$id");
                $this->db->query("DELETE FROM pupil_submission_result WHERE studygroup_id=$id");
                $this->db->query("DELETE FROM pupil_performance_assessment WHERE studygroup_id=$id");
                $this->db->query("DELETE FROM resultsets_studygroups WHERE studygroup_id=$id");

                if($room){
                    $result = $this->db->query("
                      SELECT studygroup_id FROM studygroups WHERE course_room_id = $room
                    ");

                    $row = mysql_fetch_assoc($result);
                    if($row['studygroup_id']){
                        $this->db->query("
                             UPDATE course_rooms_assignments
                             SET studygroup_id={$row['studygroup_id']}
                             WHERE studygroup_id=$id
				      ");
                    }else{
                        $this->db->query("ROLLBACK");
                        return "{'remove':'false'}";
                    }
                }


                return "{'remove':'true'}";
            }
        }

        public function moveStudygroupItems($crom,$sid,$oldcr ){
            $result = $this->db->query("
                SELECT assignment_id FROM course_rooms_assignments
                WHERE course_room_id={$crom}
            ");

            while($row = mysql_fetch_assoc($result)){
                $this->db->query("
                    DELETE FROM course_rooms_assignments WHERE link={$row['assignment_id']}
			    ");
            }

            $this->db->query("
                 UPDATE course_rooms_assignments
                 SET course_room_id={$crom}, folder_id=0, page_id=0
                 WHERE studygroup_id={$sid}
            ");

            $result = $this->db->query("
                SELECT title_en,assignment_id FROM course_rooms_assignments
                WHERE course_room_id={$oldcr} AND  studygroup_id=0
            ");

            while($row = mysql_fetch_assoc($result)){
                $this->db->query("
                    INSERT INTO course_rooms_assignments (title_en,link,course_room_id,studygroup_id) VALUES('{$row['title_en']}',{$row['assignment_id']},{$crom},{$sid})
			    ");
            }

            $result = $this->db->query("
                SELECT performance_id FROM performance
                WHERE course_room_id={$crom}
            ");

            while($row = mysql_fetch_assoc($result)){
                $this->db->query("
                    DELETE FROM performance WHERE link={$row['performance_id']}
			    ");
            }

            $this->db->query("
                 UPDATE performance
                 SET course_room_id={$crom}, folder_id=0, page_id=0
                 WHERE studygroup_id={$sid}
            ");

            $result = $this->db->query("
                SELECT title_en,performance_id FROM performance
                WHERE course_room_id={$oldcr} AND  studygroup_id=0
            ");

            while($row = mysql_fetch_assoc($result)){
                $this->db->query("
                    INSERT INTO performance (title_en,link,course_room_id,studygroup_id) VALUES('{$row['title_en']}',{$row['performance_id']},{$crom},{$sid})
			    ");
            }

            $this->setRoomForAll($crom,'course_room','course_rooms',$crom);
        }

        private function getMoveConfig($item,$par){
            $parents = array();
            switch($item){
                case "assignment":
                    if($par[0]=='page'){
                        $page_id = $par[1];
                        $folder_id = 0;
                    }elseif($par[0]=='folder'){
                        $folder_id = $par[1];
                        $page_id = 0;
                    }else{
                        $page_id = 0;
                        $folder_id = 0;
                    }
                    $parents = array(
                        'course_room_id' => $_POST['studygroup'],
                        'page_id' => $page_id,
                        'folder_id' => $folder_id
                    );
                    break;

                case "performance":
                    if($par[0]=='page'){
                        $page_id = $par[1];
                        $folder_id = 0;
                    }elseif($par[0]=='folder'){
                        $folder_id = $par[1];
                        $page_id = 0;
                    }else{
                        $page_id = 0;
                        $folder_id = 0;
                    }
                    $parents = array(
                        'course_room_id' => $_POST['studygroup'],
                        'page_id' => $page_id,
                        'folder_id' => $folder_id
                    );
                    break;
                case "page":

                    if($par[0]=='room'){
                        $folder_id = 0;
                    }else{
                        $folder_id = $par[1];
                    }
                    $parents = array(
                        'folder_id' => $folder_id,
                        'course_room_id' => $_POST['studygroup']
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
                        'course_room_id' => $_POST['studygroup']
                    );
                    break;

            }
            return $parents;
        }

		public function moveDublObjectiveItem($ids,$item,$sid,$lid,$par){
			$itemInfo = $this->getTableInfoFromType($item);
            $parents = $this->getMoveConfig($item,$par);
			$response = $this->duplicateObjectiveItem($sid,$item,false,$_POST['studygroup']);
			$item_id = $response["id"];
			$this->setParent($response['id'],$parents,$lid,$itemInfo['id_name'],$itemInfo['table']);

/*            if($item=="assignment" || $item=="performance"){
                $this->duplicateItemsMan($sid,$item_id,$item);
            }*/

/*			if($item=="assignment"){
				$this->db->query("
					 UPDATE pupli_submission_slot, pupil_submission_result SET pupli_submission_slot.studygroup_id={$_POST['studygroup']} ,
					 pupil_submission_result.studygroup_id={$_POST['studygroup']}
					 WHERE pupli_submission_slot.assignment_id={$item_id} AND
					 pupli_submission_slot.submission_slot_id=pupil_submission_result.submission_slot_id
				");
			}*/
			return $response;
		}

        public function duplicateItemsMan($sid,$dup_id,$item){
            $study_groups = array();
            $room = "";

            if($item=="assignment"){
                $sql = "
                    SELECT course_rooms_assignments.course_room_id, studygroups.studygroup_id
                    FROM course_rooms_assignments, studygroups
                    WHERE course_rooms_assignments.assignment_id={$sid} AND studygroups.course_room_id = course_rooms_assignments.course_room_id
              ";
            }

            if($item=="performance"){
                $sql = "
                    SELECT performance.course_room_id, studygroups.studygroup_id
                    FROM performance, studygroups
                    WHERE performance.performance_id={$sid} AND studygroups.course_room_id = performance.course_room_id
                ";
            }

/*            if(!$room){
                return false;
            }*/

            $result_groups = $this->db->query($sql);

            while($info = mysql_fetch_assoc($result_groups)){
                $room = $info['course_room_id'];
                $study_groups[] = $info['studygroup_id'];
            }

            if($item=="assignment"){
                $this->duplicateAssignment($dup_id,$sid,$room,$study_groups);
            }

            if($item=="performance"){
                $this->duplicatePerformace($dup_id,$sid,$room,$study_groups);
            }
        }

        public function moveItemsMan($sid,$item){
            $study_groups = array();

            if($item=="assignment"){
                $sql = "
                    SELECT course_rooms_assignments.course_room_id, studygroups.studygroup_id
                    FROM course_rooms_assignments, studygroups
                    WHERE course_rooms_assignments.assignment_id={$sid} AND studygroups.course_room_id = course_rooms_assignments.course_room_id
              ";
            }

            if($item=="performance"){
                $sql = "
                    SELECT performance.course_room_id, studygroups.studygroup_id
                    FROM performance, studygroups
                    WHERE performance.performance_id={$sid} AND studygroups.course_room_id = performance.course_room_id
                ";
            }

            $result_groups = $this->db->query($sql);

            while($info = mysql_fetch_assoc($result_groups)){
                $study_groups[] = $info['studygroup_id'];
                $room = $info['course_room_id'];
            }


            if($item=="assignment"){
                $this->moveAssignmentMan($sid,$room,$study_groups);
            }

            if($item=="performance"){
                $this->movePerformanceMan($sid,$room,$study_groups);
            }
        }

        public function movePerformanceMan($id,$room,$study_groups){
            /*claer old pupil slots*/
            $this->db->query("
                    DELETE FROM  pupil_performance_assessment
                    WHERE performance_id={$id}
            ");

            /*move item*/
            $study_groups_string = implode(',',$study_groups);

            $result_set = $this->db->query("SELECT * FROM resultsets WHERE performance_id={$id}");

            while ($result_set_info = mysql_fetch_assoc($result_set)){
                $rs = $result_set_info['resultset_id'];
                $this->db->query("UPDATE resultsets SET performance_id = $id, studygroup_ids = '$study_groups_string' WHERE resultset_id = $rs");

                $this->db->query("
                    DELETE FROM resultset_to_course_objectives WHERE resultset_id=$rs
                ");

                $result_objectives = $this->db->query("SELECT * FROM course_objectives WHERE studygroup_id IN ('$study_groups_string')");

                while ($row_co = mysql_fetch_assoc($result_objectives)){
                    $this->db->query("INSERT INTO resultset_to_course_objectives (resultset_id,objective_id,type) VALUES ($rs,{$row_co['objective_id']},'performance')");
                }

                $this->db->query("
                    DELETE FROM resultsets_studygroups WHERE resultset_id=$rs
                ");

                for($i=0; $i<count($study_groups); $i++){
                    $this->db->query("INSERT INTO resultsets_studygroups (resultset_id,studygroup_id) VALUES ($rs,{$study_groups[$i]})");
                }

                $pupils_info = $this->db->query("
                    SELECT pupil.pupil_id as pupil_id, pupil_studygroup.studygroup_id as studygroup_id FROM pupil, pupil_studygroup, studygroups
                    WHERE studygroups.course_room_id = {$room}
                    AND studygroups.studygroup_id = pupil_studygroup.studygroup_id
                    AND pupil_studygroup.pupil_id = pupil.pupil_id
                ");

                while ($pupil = mysql_fetch_assoc($pupils_info)) {
                    $this->db->query("INSERT INTO pupil_performance_assessment (performance_id,pupil_id,studygroup_id,activation_date,resultset_id) VALUES ($id,{$pupil['pupil_id']},'{$pupil['studygroup_id']}',NOW(),$rs)");
                }
            }
        }

        public function moveAssignmentMan($id,$room,$study_groups){
            /*claer old pupil slots*/
            $this->db->query("
                    DELETE pupli_submission_slot,pupil_submission_result
                    FROM  pupli_submission_slot
                    LEFT JOIN  pupil_submission_result ON pupil_submission_result.submission_slot_id = pupli_submission_slot.submission_slot_id
                    WHERE pupli_submission_slot.assignment_id={$id}
            ");

            /*move item*/
            $study_groups_string = implode(',',$study_groups);

            $result_set = $this->db->query("SELECT * FROM resultsets WHERE assignment_id={$id}");

            while ($result_set_info = mysql_fetch_assoc($result_set)){
                $rs = $result_set_info['resultset_id'];
                $this->db->query("UPDATE resultsets SET assignment_id = $id, studygroup_ids = '$study_groups_string' WHERE resultset_id = $rs");

                $this->db->query("
                    DELETE FROM resultset_to_course_objectives WHERE resultset_id=$rs
                ");

                $result_objectives = $this->db->query("SELECT * FROM course_objectives WHERE studygroup_id IN ('$study_groups_string')");

                while ($row_co = mysql_fetch_assoc($result_objectives)){
                    $this->db->query("INSERT INTO resultset_to_course_objectives (resultset_id,objective_id,type) VALUES ($rs,{$row_co['objective_id']},'assignment')");
                }

                $this->db->query("
                    DELETE FROM resultsets_studygroups WHERE resultset_id=$rs
                ");

                for($i=0; $i<count($study_groups); $i++){
                    $this->db->query("INSERT INTO resultsets_studygroups (resultset_id,studygroup_id) VALUES ($rs,{$study_groups[$i]})");
                }

                $pupils_info = $this->db->query("
                    SELECT pupil.pupil_id as pupil_id, pupil_studygroup.studygroup_id as studygroup_id FROM pupil, pupil_studygroup, studygroups
                    WHERE studygroups.course_room_id = {$room}
                    AND studygroups.studygroup_id = pupil_studygroup.studygroup_id
                    AND pupil_studygroup.pupil_id = pupil.pupil_id
                ");

                while ($pupil = mysql_fetch_assoc($pupils_info)) {
                    $this->db->query("INSERT INTO pupli_submission_slot (assignment_id,pupil_id,status,content_en,studygroup_id,activation_date) VALUES ($id,{$pupil['pupil_id']},'Not subm.','','{$pupil['studygroup_id']}',NOW())");
                    $slot = mysql_insert_id();
                    $this->db->query("INSERT INTO pupil_submission_result (submission_slot_id,result_set_id,studygroup_id) VALUES ({$slot},$rs,{$pupil['studygroup_id']})");
                }
            }
        }

		
		public function getAssignmentContent($id){
			$content = "";
			$notes = "";
			$result = $this->db->query("SELECT content_en,owner_notes_en,published_content FROM course_rooms_assignments WHERE assignment_id=$id LIMIT 1");
			while($row = mysql_fetch_assoc($result)){
				$content = $row['content_en'];
				$notes = $row['owner_notes_en'];
                $published_content = $row['published_content'];
			}
			return array('content' => $content,'notes' => $notes, 'published_content' => $published_content);
		}

        public function getPageContent($id){
            $content = "";
            $notes = "";
            $pc = "";
            $result = $this->db->query("SELECT edit_content_en,published_content_en,published_content FROM course_rooms_elements WHERE page_id=$id LIMIT 1");
            while($row = mysql_fetch_assoc($result)){
                $content = $row['edit_content_en'];
                $notes = $row['published_content_en'];
                $pc = $row['published_content'];
            }
            return array('content' => $content,'published_content' => $pc,'notes' => $notes);
        }

        public function getAssignmentAssessContent($id){
			$content = "";
			$notes = "";
			$result = $this->db->query("SELECT content_en FROM pupli_submission_slot WHERE assignment_id=$id LIMIT 1");
			while($row = mysql_fetch_assoc($result)){
				$content = $row['content_en'];
			}
			return array('content' => $content);
		}	
		
		public function setAssignmentAssessContent($id,$content){
			$this->db->query("UPDATE pupli_submission_slot SET content_en='$content' WHERE assignment_id=$id");
			return array('update' => true);			
		}
				
		public function putAssignmentContent($id,$content,$notes, $published = false){
            $publish = "";
            if($published){
                $publish = ",published_content = '".$content."'";
            }
			$this->db->query("UPDATE course_rooms_assignments SET content_en='$content',owner_notes_en='$notes' ".$publish." WHERE assignment_id=$id");
			return array('update' => true);			
		}

        public function putPageContent($id,$content,$notes,$published){
            $publish = "";
            if($published){
                $publish = ",published_content = '".$content."'";
            }
            $this->db->query("UPDATE course_rooms_elements SET edit_content_en='$content',published_content_en='$notes' ".$publish." WHERE page_id=$id");
            return array('update' => true);
        }

        public function getPageInfo($id){
            $result = $this->db->query("
			SELECT course_rooms_elements.title_en AS page, course_rooms.title_en AS room, studygroups.title_en AS stg
			FROM course_rooms_elements, studygroups, course_rooms
			WHERE course_rooms_elements.course_room_id=course_rooms.course_room_id
			AND course_rooms.course_room_id=studygroups.course_room_id
			AND course_rooms_elements.page_id=$id
			");
            $study_groups = array();
            while($row = mysql_fetch_assoc($result)){
                $page_name = $row['page'];
                $course_room = $row['room'];
                $study_groups[] = $row['stg'];
            }

            return array(
                "page_name" => $page_name,
                "course_room" => $course_room,
                "study_groups" => implode(',',$study_groups)

            );
        }

		public function getAssignmentInfo($id){
			$result = $this->db->query("
			SELECT studygroups.title_en as stg, course_rooms_assignments.title_en as name, course_rooms_assignments.number as number, course_rooms_assignments.publication as publication,
			 course_rooms_assignments.activation as activation, course_rooms_assignments.activation_date as activation_date,
			 course_rooms_assignments.deadline_date as deadline_date, course_rooms_assignments.deadline as deadline, course_rooms.title_en as room
			FROM course_rooms_assignments, studygroups, course_rooms
			WHERE studygroups.course_room_id=course_rooms_assignments.course_room_id
			AND course_rooms_assignments.assignment_id=$id
			AND course_rooms.course_room_id=course_rooms_assignments.course_room_id
			");
            $stg = array();
			while($row = mysql_fetch_assoc($result)){
				$name = $row['name'];	
				$stg[] = $row['stg'];
				$number = $row['number'];
				$publication = $row['publication'];
				$activation = $row['activation'];
				$activation_date = $row['activation_date'];
				$deadline_date = $row['deadline_date'];
				$deadline = $row['deadline'];
                $room = $row['room'];
			}
			
			$result = $this->db->query("
				SELECT * FROM pupli_submission_slot	WHERE assignment_id = $id
			");
			
			$subm_total = mysql_num_rows($result);

			$result = $this->db->query("
				SELECT * FROM pupli_submission_slot	WHERE assignment_id = $id AND status != 'ns' AND status!='Not subm.' AND status != '".dlang("grids_not_subm_text","Not subm.")."'
			");
			
			$subm_sumitted = mysql_num_rows($result);
			
			$result = $this->db->query("
				SELECT * FROM pupli_submission_slot	WHERE assignment_id = $id AND status!='Not subm.' AND status != '".dlang("grids_not_subm_text","Not subm.")."'
			");
			
			$subm_not_assessd = 0;
			$subm_not_passed = 0;
			
			while ($row = mysql_fetch_assoc($result)){	
				$result2 = $this->db->query("
					SELECT * FROM pupil_submission_result WHERE pupil_submission_result.submission_slot_id = {$row['submission_slot_id']}
				");
                $temp = 0;
                while($row2 = mysql_fetch_assoc($result2)){
                    if($row2['assessment']==''){
                        $temp++;
                    }
                }

                if($temp == mysql_num_rows($result2)){
                    $subm_not_assessd++;
                }
			}	
					
			$result = $this->db->query("
				SELECT * FROM pupli_submission_slot	WHERE assignment_id = $id AND status!='Not subm.' AND status != '".dlang("grids_not_subm_text","Not subm.")."'
			");
			
			while ($row = mysql_fetch_assoc($result)){	
				$result2 = $this->db->query("
					SELECT * FROM pupil_submission_result WHERE pupil_submission_result.submission_slot_id = {$row['submission_slot_id']}
				");
                $temp = 0;
                while($row2 = mysql_fetch_assoc($result2)){
                    if($row2['pass']=='0' &&( $row2['assessment']=='F' || $row2['assessment']=='Fx' || $row2['assessment']==dlang("npassvalue","NPass"))){
                        $temp++;
                    }
                }
                if($temp>0){
                    $subm_not_passed++;
                }

			}				
						
			return array( 
				"assignment_name" => $name,
				"assignment_id" => $number,
				"assignment_stg" => implode(',',$stg),
				"assignment_subm_total" => $subm_total,
				"assignment_subm_submitted" => $subm_sumitted,
				"assignment_subm_not_assesed" => $subm_not_assessd,
				"assignment_subm_not_passed" => $subm_not_passed,
				"assignment_publication" => $publication,
				"assignment_activation" => $activation,
				"assignment_deadline" => $deadline,
				"activation_date" => $activation_date,
				"deadline_date" => $deadline_date,
                "deadline_date" => $deadline_date,
                "room" => $room


			);
		}
		
		public function getPerformanceInfo($id){
			$result = $this->db->query("
			SELECT perf.title_en as title_p, stg.title_en as title_g,perf.publication as publication,perf.activation as activation,perf.deadline as deadline
			,perf.activation_date as activation_date,perf.deadline_date as deadline_date
			FROM performance perf
			inner join studygroups stg on perf.studygroup_id=stg.studygroup_id
			where perf.performance_id=$id
										");

			while($row = mysql_fetch_assoc($result)){
				$name = $row['title_p'];
				$studygroup = $row['title_g'];
                $publication = $row['publication'];
                $activation = $row['activation'];
                $activation_date = $row['activation_date'];
                $deadline_date = $row['deadline_date'];
                $deadline = $row['deadline'];
			}
									

			return array(
				"name" => $name,
				"studygroup" => $studygroup,
                "assignment_publication" => $publication,
                "assignment_activation" => $activation,
                "assignment_deadline" => $deadline,
                "activation_date" => $activation_date,
                "deadline_date" => $deadline_date,
			);
		}

		public function getPerformanceDescroption($id){
			$description = "";
			$notes = "";
			$result = $this->db->query("SELECT content_en,owner_notes,published_content FROM performance WHERE performance_id=$id LIMIT 1");
			while($row = mysql_fetch_assoc($result)){
				$description = $row['content_en'];
				$notes = $row['published_content'];
                $owner_notes = $row['owner_notes'];

			}
			return array('content' => $description,'published_content' => $notes, 'notes' => $owner_notes);
		}		
		
		public function putPerformanceDescription($id,$content,$notes,$published){
            $publish = "";
            if($published){
                $publish = ",published_content = '".$content."'";
            }
			$result = $this->db->query("UPDATE performance SET content_en='$content',owner_notes='$notes' ".$publish." WHERE performance_id=$id");
			return array('update' => true);				
		}			
		
		public function setPublication($id,$publication,$item){
            $table = "";
            $id_name = "";

            switch($item){
                case "performance":
                    $table = "performance";
                    $id_name = "performance_id";
                    break;
                case "assignments":
                    $table = "course_rooms_assignments";
                    $id_name = "assignment_id";
                    break;

            }
			$result = $this->db->query("UPDATE ".$table." SET publication='$publication' WHERE ".$id_name."=$id");
			return array('update' => true);				
		}

		public function setActivation($id,$activation,$date,$item = 'assignment'){
            $table = "";
            $id_name = "";

            switch($item){
                case "performance":
                    $table = "performance";
                    $id_name = "performance_id";
                    break;
                case "assignment":
                    $table = "course_rooms_assignments";
                    $id_name = "assignment_id";
                    break;
            }

            if($date=='NULL'){
                $this->db->query("UPDATE ".$table." SET activation='$activation',activation_date=NULL WHERE ".$id_name."=$id");
            }else{
                $this->db->query("UPDATE ".$table." SET activation='$activation',activation_date='$date' WHERE ".$id_name."=$id");
            }

			return array('update' => true);				
		}
		
		public function setDeadline($id,$deadline,$date,$item = 'assignment'){
            $table = "";
            $id_name = "";

            switch($item){
                case "performance":
                    $table = "performance";
                    $id_name = "performance_id";
                    break;
                case "assignment":
                    $table = "course_rooms_assignments";
                    $id_name = "assignment_id";
                    break;
            }

            $result = $this->db->query("UPDATE ".$table." SET deadline='$deadline',deadline_date='$date' WHERE ".$id_name."=$id");
			return array('update' => true);				
		}
		
		public function getRUnitRows($id){
			$result = $this->db->query("SELECT * FROM resultsets WHERE assignment_id=$id");
			return array('numrows' => mysql_num_rows($result));			
		}

		public function getCopiedAssignments(){

			$result = $this->db->query("SELECT studygroup_ids, assignment_id FROM resultsets");
			while($row = mysql_fetch_assoc($result)){
				$srgs = explode(',',$row['studygroup_ids']);
				$result2 = $this->db->query("SELECT studygroup_id FROM course_rooms_assignments WHERE assignment_id={$row['assignment_id']}");
				$row2 = mysql_fetch_assoc($result2);
				for ($i=0; $i < count($srgs); $i++){
					if($row2['studygroup_id']!=$srgs[$i])
						$items[$row['assignment_id']][$srgs[$i]] = $srgs[$i];
				}
			}
			
			return $items;
		}				

		public function editAssignmentSlot($stg, $assign){
			$this->db->query("
				 UPDATE pupli_submission_slot, pupil_submission_result SET pupli_submission_slot.studygroup_id={$stg} ,
				 pupil_submission_result.studygroup_id={$stg}
				 WHERE pupli_submission_slot.assignment_id={$assign} AND
				 pupli_submission_slot.submission_slot_id=pupil_submission_result.submission_slot_id
			");
		}
        public function deleteAssignmentFromStg($ass, $stg, $type){
            if($type=='assignment'){
                $result = $this->db->query("SELECT resultset_id FROM resultsets WHERE assignment_id=$ass");

                $this->db->query("DELETE pupli_submission_slot, pupil_submission_result FROM pupli_submission_slot, pupil_submission_result
                WHERE pupli_submission_slot.studygroup_id={$stg} AND pupli_submission_slot.assignment_id=$ass AND pupli_submission_slot.submission_slot_id=pupil_submission_result.submission_slot_id");
            }else{
                $result = $this->db->query("SELECT resultset_id FROM resultsets WHERE performance_id=$ass");
                $this->db->query("DELETE FROM pupil_performance_assessment WHERE studygroup_id={$stg} AND performance_id=$ass");
            }

            while($row = mysql_fetch_assoc($result)){
                $this->db->query("DELETE FROM resultsets_studygroups WHERE resultset_id={$row['resultset_id']} AND studygroup_id=$stg");
                $this->db->query("DELETE resultset_to_course_objectives FROM resultset_to_course_objectives, course_objectives WHERE resultset_to_course_objectives.resultset_id={$row['resultset_id']} AND course_objectives.studygroup_id=$stg AND course_objectives.objective_id = resultset_to_course_objectives.objective_id");
            }

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
						$response = $this->addObjectiveItem($act[1]);
						break;
					case "delete":
						$response = $this->deleteObjectiveItem($id,$act[1]);
						break;
					case "duplicate":
						$response = $this->duplicateObjectiveItem($id,$act[1]);
						break;
					case "rename":
						$table = $this->getTableInfoFromType($type);
						$response = $this->rename($id,$name,$table['table'],$table['id_name']);
					    break;
                    case "deletefromstg":
						$response = $this->deleteAssignmentFromStg($_POST['assignment'],$_POST['stg'],$_POST['type']);
					    break;
					case "move":
						$response = $this->moveObjectiveItem($ids,$act[1],$sid,$lid,$par,$tid);
						break;
					case "moveslot":
						$response = $this->moveObjectiveItem($ids,$act[1],$sid,$lid,$par);
						$this->editAssignmentSlot($_POST['studygroup'],$sid);
						break;						
					case "movedupl":
						$response = $this->moveDublObjectiveItem($ids,$act[1],$sid,$lid,$par);
						break;
					case "getassignment":
						$response = $this->getAssignmentContent($id);
						$response["info"] = $this->getAssignmentInfo($id);
                        $response["info"]["view_submissions"] = dlang("header_asignment_view_submissions","View Submissions");
                        $response["info"]["submission_image"] = "dhtmlx/dhtmlxTree/codebase/imgs/csh_schoolmule/submission.png";
						break;
                    case "getpage":
                        $response = $this->getPageContent($id);
                        $response["info"] = $this->getPageInfo($id);
                        break;
					case "getassignmentassess":
						$response = $this->getAssignmentAssessContent($id);
						$response["info"] = $this->getAssignmentInfo($id);
                        $response["info"]["view_submissions"] = dlang("header_asignment_view_assignment","View Assignment");
                        $response["info"]["submission_image"] = "dhtmlx/dhtmlxTree/codebase/imgs/csh_schoolmule/assignment.png";
						break;
					case "setassessassignment":
						$response = $this->setAssignmentAssessContent($id,$content);
						break;
					case "putpage":
						$response = $this->putPageContent($id,$content,$notes, isset($_POST['publish']));
						break;
                    case "putassignment":
                        $response = $this->putAssignmentContent($id,$content,$notes, isset($_POST['publish']));
                        break;
					case "share":
						$response = $this->shareObjectiveItem($id,$act[1]);			
						break;
					case "private":
						$response = $this->privateObjectiveItem($id,$act[1]);			
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
                        $response["info"]["view_assessments"] = dlang("header_asignment_view_assessments","View Assessments");
                        $response["info"]["assessment_image"] = "dhtmlx/dhtmlxTree/codebase/imgs/csh_schoolmule/assessment.png";
						break;
					case "putperformance":
						$response = $this->putPerformanceDescription($id,$_POST['content'],$_POST['notes'], isset($_POST['publish']));
						break;
					case "setpubliation":
						$response = $this->setPublication($id,$_POST['publication'],($_POST['item']?$_POST['item']:"assignments"));
						break;
					case "setactivation":
						$response = $this->setActivation($id,$_POST['activation'],$_POST['date'],($_POST['item']?$_POST['item']:"assignments"));
						break;
					case "setdeadline":
						$response = $this->setDeadline($id,$_POST['deadline'],$_POST['date'],($_POST['item']?$_POST['item']:"assignments"));
						break;
					case "getrurows":
						$response = $this->getRUnitRows($id);
						break;
					case "getcopiedassignments":
						$response = $this->getCopiedAssignments();
						break;
                    case "removestg":
						$response = $this->removeStudygroupFromRoom($_POST['stg'],$_POST['remove']);
						break;
				}
				return $response;
			 }else{
			 	return false;
			 }
		}		
	}
	?>