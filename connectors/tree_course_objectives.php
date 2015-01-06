<?php
	include_once '../libs/Connection.php';
	include_once '../libs/tree_editor.php';

	class tree_course_objectives extends tree_editor{
		
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
			$xml = '<?xml version="1.0"?><tree id="'.$id.'">';
			$xml .= $this->getXmlMyCourseRoomsAuto($id,$rf,$autoload);
			//$xml .= $this->getXmlSharedCourseRooms();
			$xml .= '</tree>';
			return $xml;					
		}
		
		/********* Top level *****************/
		protected function getXmlMyCourseRoomsAuto($id,$rf,$autoload){
			if(1){
                $rf = '0';
				//$xml = '<item child="1" text="'.dlang("tree_obj_myco","My ongoing course objectives").'" id="myobj" im1="folder_open.png" im2="folder_closed.png">';
				$xml = $this->getItemLoad(0,"myobj",$rf,false);
				//$xml .= '</item>';
			}else{
				if($id == "0"){
					$xml = '<item child="1" text="'.dlang("tree_obj_myco","My ongoing course objectives").'" id="myobj" im1="folder_open.png" im2="folder_closed.png">';
				}else{
                    $rf = '0';
					$xml = $this->getItemLoad(0,$id,$rf,true);
					if($rf!='1'){
						//$xml .= '</item>';
					}
				}				
			}

			return $xml;
		}
					
		protected function getXmlSharedCourseRooms(){
			$xml = '<item text="'.dlang("Shared course rooms").'" id="shared">';
			//$xml .= $this->getCourseRooms(1);
			$xml .= '</item>';
			return $xml;
		}

		protected function getChildItems($type){
			$items = array();
			switch ($type) {
				case 'programme':
					$items[] = array('table' => 'years',
									 'id' => 'year',
									 'pid' => 'programme_id',
									);
					break;
                case 'year':
                    $items[] = array('table' => 'studygroups',
                        'id' => 'studygroup',
                        'pid' => 'year_id',
                    );
                    break;
                case 'academicyear':
                    $items[] = array('table' => 'subjects',
                        'id' => 'subject',
                        'pid' => 'academic_year_id',
                    );
                    break;
                case 'subject':
                    $items[] = array('table' => 'studygroups',
                        'id' => 'studygroup',
                        'pid' => 'subject_id',
                    );
                    break;
				case 'myobj':
					$items[] = array('table' => 'academic_years',
									 'id' => 'academicyear',
									 'pid' => 'myobj', 
									);
					break;
				case 'studygroup':
					$items[] = array('table' => 'course_objectives',
									 'id' => 'objective',
									 'pid' => 'studygroup_id', 
									);
					break;
				case 'objectivegroup':
					$items[] = array('table' => 'course_objectives',
									 'id' => 'objective',
									 'pid' => 'objectivegroup_id', 
									);
					break;													
				default:
					break;	
			}
			return $items;
		}
		
		public function getTableInfoFromType($type){
			switch ($type) {
                case 'academicyear':
                    $table = "academic_years";
                    $id_name = "academicyear";
                    break;
                case 'subject':
                    $table = "subjects";
                    $id_name = "subject";
                    break;
				case 'programme':
					$table = "programmes";
					$id_name = "programme";
					break;

                case 'year':
                    $table = "years";
                    $id_name = "year";
                    break;
				case 'studygroup':
					$table = "studygroups";
					$id_name = "studygroup";
					break;
				case 'myobj':
					$table = "myobj";
					$id_name = "myobj";
					break;
				case 'objectivegroup':
					$table = "course_objective_groups";
					$id_name = "objectivegroup";
					break;
				case 'objective':
					$table = "course_objectives";
					$id_name = "objective";
					break;				
				default:
					break;
			}
			return array('table' => $table, 'id_name' => $id_name); 			
		}


		
		public function addObjectiveItem($item){
			switch($item){
                            case "objective":
                $values = array(
                    'studygroup_id' => $_POST["s_id"],
                    'title_en' => $_POST["item_name"],
                    'description' => " " ,
                    'grading' =>  ' '
                );
					break;
			}
			$itemInfo = $this->getTableInfoFromType($item);

            if($values['title_en']){
                $response = $this->addItem($itemInfo['table'],$values,$item,$values['title_en']);
            }else{
                $response = $this->addItem($itemInfo['table'],$values,$item);
            }

			//$response = $this->addItem($itemInfo['table'],$values,$item);
			if($item=="objective"){
				$sql = "SELECT objective_id FROM course_objectives WHERE studygroup_id={$_POST["s_id"]}";
				$result = $this->db->query($sql);
				$objs = mysql_num_rows($result);
				$weight = floor(100/$objs);
				$ost = 100%$objs;
				$sql = "UPDATE course_objectives SET weight='$weight' WHERE studygroup_id={$_POST["s_id"]}";
				$this->db->query($sql);
				if($ost!=0){
					$weight_m = $weight+$ost;	
					$sql = "UPDATE course_objectives SET weight='{$weight_m}' WHERE studygroup_id={$_POST["s_id"]} LIMIT 1";
					$this->db->query($sql);						
				}
			}
			return $response;
		}
		
		public function deleteObjectiveItem($id,$item){
			$itemInfo = $this->getTableInfoFromType($item);
			$items = explode(',',$id);
			for ($i=0; $i < count($items); $i++){
				$item = explode('_',$items[$i]);
				$response = $this->removeItem($item[1],$itemInfo['table'],$itemInfo['id_name']);
			}
			
			if($item=="objective"){
				$sql = "SELECT objective_id FROM course_objectives WHERE studygroup_id={$_POST["s_id"]}";
				$result = $this->db->query($sql);
				$objs = mysql_num_rows($result);
				$weight = floor(100/$objs);
				$ost = 100%$objs;
				$sql = "UPDATE course_objectives SET weight='$weight' WHERE studygroup_id={$_POST["s_id"]}";
				$this->db->query($sql);
				if($ost!=0){
					$weight_m = $weight+$ost;	
					$sql = "UPDATE course_objectives SET weight='{$weight_m}' WHERE studygroup_id={$_POST["s_id"]} LIMIT 1";
					$this->db->query($sql);						
				}
			}
			
			return $response;
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

		public function duplicateObjectiveItem($id,$item){
			$itemInfo = $this->getTableInfoFromType($item);
			$response = $this->duplicateItem($id,$itemInfo['table'],$itemInfo['id_name']);
			return $response;
		}

		public function moveObjectiveItem($ids,$item,$sid,$lid,$par){
			$itemInfo = $this->getTableInfoFromType($item);
			switch($item){
				case "objectivegroup":
					$parents = array(
									'studygroup_id' => $_POST['studygroup']
									);
					break;
				case "objective":
					if($par[0]=='studygroup'){
						$objectivegroup_id = 0;
					}else{
						$objectivegroup_id = $par[1];
					}
					$parents = array(
									'objectivegroup_id' => $objectivegroup_id,
									'studygroup_id' => $_POST['studygroup']
									);
					break;
			}

			$response = $this->setParent($sid,$parents,$lid,$itemInfo['id_name'],$itemInfo['table']);
			if($item=="objective"){
				$sql = "SELECT objective_id FROM course_objectives WHERE studygroup_id={$_POST["studygroup"]}";
				$result = $this->db->query($sql);
				$objs = mysql_num_rows($result);
				$weight = floor(100/$objs);
				$ost = 100%$objs;
				$sql = "UPDATE course_objectives SET weight='$weight' WHERE studygroup_id={$_POST["studygroup"]}";
				$this->db->query($sql);
				if($ost!=0){
					$weight_m = $weight+$ost;	
					$sql = "UPDATE course_objectives SET weight='{$weight_m}' WHERE studygroup_id={$_POST["studygroup"]} LIMIT 1";
					$this->db->query($sql);						
				}
			}
			return $response;
		}

		public function moveDublObjectiveItem($ids,$item,$sid,$lid,$par){
			$itemInfo = $this->getTableInfoFromType($item);
			switch($item){
				case "objectivegroup":
					$parents = array(
									'studygroup_id' => $_POST['studygroup']
									);
					break;
				case "objective":
					if($par[0]=='studygroup'){
						$objectivegroup_id = 0;
					}else{
						$objectivegroup_id = $par[1];
					}
					$parents = array(
									'objectivegroup_id' => $objectivegroup_id,
									'studygroup_id' => $_POST['studygroup']
									);
					break;
			}
			$response = $this->duplicateObjectiveItem($sid,$item);
			$response = $this->setParent($response['id'],$parents,$lid,$itemInfo['id_name'],$itemInfo['table']);
			
			if($item=="objective"){
				$sql = "SELECT objective_id FROM course_objectives WHERE studygroup_id={$_POST["studygroup"]}";
				$result = $this->db->query($sql);
				$objs = mysql_num_rows($result);
				$weight = floor(100/$objs);
				$ost = 100%$objs;
				$sql = "UPDATE course_objectives SET weight='$weight' WHERE studygroup_id={$_POST["studygroup"]}";
				$this->db->query($sql);
				if($ost!=0){
					$weight_m = $weight+$ost;	
					$sql = "UPDATE course_objectives SET weight='{$weight_m}' WHERE studygroup_id={$_POST["studygroup"]} LIMIT 1";
					$this->db->query($sql);						
				}
			}
			
			return $response;
		}

		public function getObjectiveInfo($id){

			$result = $this->db->query("SELECT subj.title_en AS pgtitle, co.title_en AS crtitle,
          co.weight AS coweight, stg.title_en AS stgtitle, staff.fore_name AS fore_name, staff.last_name AS last_name, stg.course AS course
				FROM course_objectives co
				inner join studygroups stg on stg.studygroup_id=co.studygroup_id
				inner join subjects subj on stg.subject_id=subj.subject_id
				left join studygroup_staff st_staff on stg.studygroup_id=st_staff.studygroup_id
				left join staff_members staff on staff.staff_member_id=st_staff.staff_member_id
				where co.objective_id=$id
			 ");
			 			
			$elements = mysql_num_rows($result);
            $staff = array();
			while($row = mysql_fetch_assoc($result)){
				$crtitle = $row['crtitle'];
				$coweight = $row['coweight'];
				$stgtitle = $row['stgtitle'];	
				$pgtitle = $row['pgtitle'];
                $course = $row['course'];

                $staff[] = $row['fore_name']." ".$row['last_name'];
			}

			return array( 
				"course_objectives_objective" => $crtitle,
				"course_objectives_course" => "not defined",
				"course_objectives_subject" => "not defined",
				"course_objectives_programme" => $stgtitle,
                "course_objectives_course" => $course,

				"course_objectives_teachers" => implode(', ',$staff),
				"course_objectives_weight" => $coweight.'%',
			);
		}

		public function getObjectiveDescroption($id){
			$description = "";
			$grading = "";
			$result = $this->db->query("SELECT description,grading,description_public,grading_public FROM course_objectives WHERE objective_id=$id LIMIT 1");
			while($row = mysql_fetch_assoc($result)){
				$description = $row['description'];
				$grading = $row['grading'];
                $description_public = $row['description_public'];
                $grading_public = $row['grading_public'];
			}
			return array('description' => $description,'grading' => $grading,'description_public' => $description_public,'grading_public' => $grading_public);
		}		
		
		public function putObjectiveDescription($id,$description,$grading,$published){
            $publish = "";
            if($published){
                $publish = ",description_public = '".$description."', grading_public = '".$grading."'";
            }
			$result = $this->db->query("UPDATE course_objectives SET description='$description',grading='$grading' ".$publish." WHERE objective_id=$id");
			return array('update' => true);			
		}

		public function changeWeight($id,$weight){
			$result = $this->db->query("UPDATE course_objectives SET weight='$weight' WHERE objective_id=$id");
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
					case "new":
						$response = $this->addObjectiveItem($act[1]);
						break;
					case "delete":
						$response = $this->deleteObjectiveItem($id,$act[1]);
						break;
					case "deletecontent":
						$response = $this->deleteContentObjectiveItem($id,$act[1]);
						break;
					case "duplicate":
						$response = $this->duplicateObjectiveItem($id,$act[1]);
						break;
					case "merge":
						$response = $this->mergeCourseRoomItem($ids,$act[1]);
						break;
					case "rename":
						$table = $this->getTableInfoFromType($type);
						$response = $this->rename($id,$name,$table['table'],$table['id_name']);
					break;
					case "move":
						$response = $this->moveObjectiveItem($ids,$act[1],$sid,$lid,$par);
						break;
					case "movedupl":
						$response = $this->moveDublObjectiveItem($ids,$act[1],$sid,$lid,$par);
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
					case "share":
						$response = $this->shareObjectiveItem($id,$act[1]);			
						break;
					case "private":
						$response = $this->privateObjectiveItem($id,$act[1]);			
						break;
					case "getobjective":
						$response = $this->getObjectiveDescroption($id);
						$response["info"] = $this->getObjectiveInfo($id);
						break;
					case "putobjective":
						$response = $this->putObjectiveDescription($id,$_POST['description'],$_POST['grades'], isset($_POST['publish']));
						break;
					case "changeweight":
						$this->changeWeight($id,$_POST['weight']);
						break;
						
				}
				return $response;
			 }else{
			 	return false;
			 }
		}		
	}
	?>