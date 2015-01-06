<?php
 	class tree_window{
		private $db = false;
        protected $user;

		public function __construct(){
			$this->db = Connection::getDB();
            $this->user = new administrator();
            $this->db->query("START TRANSACTION");
			header("content-type:text/xml;charset=UTF-8");
			if(isset($_POST['action']) && $_POST['action']=='savetree'){
				$ids = $_POST['ids'];
                $result_set = $_POST['resultset'];

                $stgs = $_POST['stgs'];
                $strstg = $stgs;
                $type = $_POST['type'];
                $aid = $_POST['aid']?$_POST['aid']:null;
                $pid = $_POST['pid']?$_POST['pid']:null;

                $this->db->query("UPDATE resultsets SET studygroup_ids = '$stgs' WHERE resultset_id = $result_set");
                $stgs = explode(',',$stgs);

                $this->db->query("DELETE FROM resultsets_studygroups WHERE resultset_id = $result_set");
                if($aid){
                    $this->db->query("DELETE pupli_submission_slot,pupil_submission_result FROM pupli_submission_slot, pupil_submission_result WHERE pupli_submission_slot.assignment_id = $aid AND pupli_submission_slot.studygroup_id NOT IN ($strstg)
                    AND pupil_submission_result.submission_slot_id = pupli_submission_slot.submission_slot_id");
                }elseif($pid){
                    $this->db->query("DELETE pupil_performance_assessment FROM pupil_performance_assessment
                      WHERE pupil_performance_assessment.performance_id = $pid AND pupil_performance_assessment.studygroup_id NOT IN ($strstg)");
                }
                for($i=0; $i<count($stgs); $i++){
                    $this->db->query("INSERT INTO resultsets_studygroups (resultset_id,studygroup_id) VALUES ($result_set, {$stgs[$i]})");

                    $result = $this->db->query("SELECT pupil.pupil_id as pupil_id FROM pupil, pupil_studygroup WHERE pupil_studygroup.studygroup_id={$stgs[$i]} AND pupil_studygroup.pupil_id=pupil.pupil_id");

                    while ($row = mysql_fetch_assoc($result)){
                        if($aid){
                            $res = $this->db->query("SELECT submission_slot_id FROM pupli_submission_slot WHERE assignment_id=$aid AND pupil_id={$row['pupil_id']}");
                            if(mysql_num_rows($res)!=0){
                                continue;
                            }
                            $this->db->query("INSERT INTO pupli_submission_slot (assignment_id,pupil_id,status,content_en,studygroup_id,activation_date) VALUES ($aid,{$row['pupil_id']},'Not subm.','','{$stgs[$i]}',NOW())");
                            $slot = mysql_insert_id();
                            $result2 = $this->db->query("SELECT resultset_id FROM resultsets WHERE assignment_id=$aid");
                            while($row2 = mysql_fetch_assoc($result2)){
                                $this->db->query("INSERT INTO pupil_submission_result (submission_slot_id,result_set_id,studygroup_id) VALUES ({$slot},{$row2['resultset_id']},{$stgs[$i]})");
                            }
                        }elseif($pid){
                            $res = $this->db->query("SELECT pupil_performance_assessment_id FROM pupil_performance_assessment WHERE performance_id=$pid AND pupil_id={$row['pupil_id']}");
                            if(mysql_num_rows($res)!=0){
                                continue;
                            }
                            $result2 = $this->db->query("SELECT resultset_id FROM resultsets WHERE performance_id=$pid");
                            while($row2 = mysql_fetch_assoc($result2)){
                                $this->db->query("INSERT INTO pupil_performance_assessment (performance_id,pupil_id,studygroup_id,activation_date, resultset_id) VALUES ($pid,{$row['pupil_id']},'{$stgs[$i]}',NOW(),{$row2['resultset_id']})");
                            }
                        }

                    }
                }

                $this->db->query("DELETE FROM resultset_to_course_objectives WHERE resultset_id = $result_set AND type='$type'");

                for ($i=0; $i < count($ids); $i++) {
                    $id = $ids[$i];
                    $this->db->query("INSERT INTO resultset_to_course_objectives (resultset_id,objective_id,type) VALUES ($result_set,$id,'$type')");
                }

                //$res = $this->db->query("SELECT assignment_id FROM resultsets WHERE resultset_id = $result_set");
                //$row = mysql_fetch_assoc($res);
                //$ass = $row['assignment_id'];
                /*
                for($i=1; $i<count($stgs); $i++){
                    $result = $this->db->query("SELECT pupil.pupil_id as pupil_id FROM pupil, pupil_studygroup WHERE pupil_studygroup.studygroup_id={$stgs[$i]} AND pupil_studygroup.pupil_id=pupil.pupil_id");
                    $this->db->query("DELETE FROM pupli_submission_slot WHERE assignment_id = $ass");
                    while ($row = mysql_fetch_assoc($result)) {
                        $this->db->query("INSERT INTO pupli_submission_slot (assignment_id,pupil_id,status,content_en,studygroup_id,activation_date) VALUES ($ass,{$row['pupil_id']},'Not subm.','','{$stgs[$i]}',NOW())");
                    }


                    $sql = "SELECT submission_slot_id, studygroup_id FROM pupli_submission_slot WHERE assignment_id=$ass";
                    $result = $this->db->query($sql);

                    while($row = mysql_fetch_assoc($result)){
                        $this->db->query("INSERT INTO pupil_submission_result (submission_slot_id,result_set_id,studygroup_id) VALUES ({$row['submission_slot_id']},$result_set,{$stgs[$i]})");
                    }

                }
                */


			}elseif(isset($_POST['action']) && $_POST['action']=='getchecked'){
				$checked = array();
                $type = $_POST['type'];
                $resultset = $_POST['resultset'];
                $result = $this->db->query("SELECT objective_id FROM resultset_to_course_objectives WHERE resultset_id=$resultset AND type='$type'");
                while($row = mysql_fetch_assoc($result)){
                    $checked[] = 'courseobjective_'.$row['objective_id'];
                }
				echo json_encode($checked);
			}else{
                $entity = $this->user->entity;
                $result = null;
				if(isset($_GET['performance'])){
					$performance = $_GET['performance'];
					$result = $this->db->query("
                        SELECT co.title_en as co_title,
                        co.objective_id as co_id, stg.title_en as stgt, stg.studygroup_id as studygroup_id
                        FROM studygroups stg
                        inner join performance perf on stg.course_room_id=perf.course_room_id
                        inner join course_objectives co on stg.studygroup_id=co.studygroup_id WHERE stg.entity_id = $entity AND perf.performance_id = $performance
					");	
				}elseif(isset($_GET['assignment'])){
					$assignment = $_GET['assignment'];
					$result = $this->db->query("
                        SELECT co.title_en as co_title,
                        co.objective_id as co_id, stg.title_en as stgt, stg.studygroup_id as studygroup_id
                        FROM studygroups stg
                        inner join course_rooms_assignments assign on stg.course_room_id=assign.course_room_id
                        inner join course_objectives co on stg.studygroup_id=co.studygroup_id WHERE stg.entity_id = $entity AND assign.assignment_id = $assignment
					");
					//FROM course_rooms_assignments cra
					//inner join studygroups stg on stg.studygroup_id=cra.studygroup_id
					//where cra.assignment_id=$assignment	
				}



/*				$result = $this->db->query("
					SELECT co.title_en as co_title,
					co.objective_id as co_id, stg.title_en as stgt, stg.studygroup_id as studygroup_id
					FROM studygroups stg
					inner join course_objectives co on stg.studygroup_id=co.studygroup_id WHERE stg.entity_id = $entity
				");*/
					
				$tree = $this->getTreeArray($result);
				$this->outXML($tree);
						
			}
            $this->db->query("COMMIT");
		}
		
		private function outXML($tree){
			echo '<tree id="0">';
				foreach ($tree as $stgk => $stg) {
					echo '<item text="'.$stg["title"].'" id="stg_'.$stg["id"].'">';
                        for ($i=0; $i < count($stg['co']); $i++) {
                            echo '<item text="'.$stg['co'][$i]['title'].'" id="courseobjective_'.$stg['co'][$i]['id'].'" />';
                        }
					echo '</item>';
				}
			echo '</tree>';			
		}
		
		private function getTreeArray($result){
			$arr = array();
			while($row = mysql_fetch_assoc($result)){
				$arr[$row['studygroup_id']]['title'] = $row['stgt'];
				$arr[$row['studygroup_id']]['id'] = $row['studygroup_id'];
				$arr[$row['studygroup_id']]['co'][] = array('id' => $row['co_id'], 'title' => $row['co_title']);
			}
			//print_r($arr);
			return $arr;			
		}
				
		/*
		private function outXML($tree){
			echo '<tree id="0">';
				echo '<item text="'.$tree["title"].'" id="stg_'.$tree["id"].'">';
				foreach ($tree[$tree["id"]] as $key => $value) {
					echo '<item text="'.$value['title'].'" id="courseobjectivegroup_'.$value['id'].'">';
						for ($i=0; $i < count($value['co']); $i++) { 
							echo '<item text="'.$value['co'][$i]['title'].'" id="courseobjective_'.$value['co'][$i]['id'].'" />';
						}
					echo '</item>';								
				}					
				echo '</item>';
			echo '</tree>';			
		}
		
		private function getTreeArray($result){
			$arr = array();
			while($row = mysql_fetch_assoc($result)){
				if(!isset($arr[$row['studygroup_id']])){
					$arr[$row['studygroup_id']] = array();
					$arr['title'] = $row['stgt'];
					$arr['id'] = $row['studygroup_id'];
				}
				
				if(!isset($arr[$row['studygroup_id']][$row['cog_id']])){
					$arr[$row['studygroup_id']][$row['cog_id']]['title'] = $row['cog_title'];
					$arr[$row['studygroup_id']][$row['cog_id']]['id'] = $row['cog_id'];
					$arr[$row['studygroup_id']][$row['cog_id']]['co'] = array();						
				}
				
				$arr[$row['studygroup_id']][$row['cog_id']]['co'][] = array('id' => $row['co_id'], 'title' => $row['co_title']);	
			}
			print_r($arr);
			return $arr;			
		}
		*/
		
	}
?>