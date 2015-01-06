<?php
 	class grid_assess_performance{
		private $db = false;
        private $user;
        private $edit_color = '#FEF5CA';
		public function __construct(){
			$this->db = Connection::getDB();
            $this->user = new administrator();
            if($this->user->role=='pupil' || $this->user->role=='parent'){
                $this->edit_color = '#FFFFFF';
            }
			error_reporting(E_ALL ^ E_NOTICE);
			switch ($_POST['action']) {
				case 'remove':
					$this->removePerformance($_POST['id']);
					break;
				case 'deactive':
					$this->deactivePerformance($_POST['id']);
					break;
				case 'reactive':
					$this->reactivePerformance($_POST['id']);
					break;
				case 'editassessment':
					$this->editAssessment($_POST['id'],$_POST['assessment']);
					break;						
				default:
					$this->getPerformanceGrid();
					break;
			}
		}

		private function editAssessment($id, $assess){
			$result = $this->db->query("UPDATE pupil_performance_assessment SET assessment='$assess' WHERE pupil_performance_assessment_id=$id");			
		}
				
		private function getPerformanceGrid(){
		    header("Content-type:text/xml");
		    print('<?xml version="1.0" encoding="UTF-8"?>');
			$id = $_GET['id'];
            $and = "";
            $addtbl = "";
            if($this->user->role == "pupil"){
                $and = "AND pupil.user_id = {$this->user->id}";
            }elseif($this->user->role == "parent"){
                $addtbl = ", parents";
                $and = "AND parents.user_id = {$this->user->id} AND pupil.pupil_id = parents.pupil_id";
            }
			$result = $this->db->query("
				SELECT performance.performance_id as pid, studygroups.title_en as stg_title, studygroups.studygroup_id as stg_id,  pupil.forename as f_name, pupil.lastname as l_name,
				  pupil.pupil_id as pid, course_objectives.title_en as co_title,course_objectives.objective_id as objective_id, pupil_performance_assessment.assessment as assessment,
				  pupil_performance_assessment.passed as passed, pupil_performance_assessment.pupil_performance_assessment_id as ppa, studygroups.studygroup_id as stg_id,
				   resultsets.studygroup_ids as studygroup_ids, resultsets.resultset_id as resultset_id
				FROM course_rooms,studygroups, performance, pupil, pupil_performance_assessment, resultset_to_course_objectives, course_objectives,resultsets_studygroups, resultsets $addtbl
				WHERE resultsets.performance_id = performance.performance_id
				AND resultsets_studygroups.resultset_id = resultsets.resultset_id
				AND performance.course_room_id = course_rooms.course_room_id
			    AND course_rooms.course_room_id = studygroups.course_room_id
				AND pupil_performance_assessment.performance_id = resultsets.performance_id
				AND pupil_performance_assessment.studygroup_id = studygroups.studygroup_id
				AND pupil.pupil_id = pupil_performance_assessment.pupil_id
				AND resultsets.resultset_id = pupil_performance_assessment.resultset_id
				AND resultset_to_course_objectives.type = 'performance'
				AND resultset_to_course_objectives.resultset_id = resultsets.resultset_id
				AND course_objectives.objective_id = resultset_to_course_objectives.objective_id
				AND performance.performance_id=$id
				$and
			");


			echo '<rows>';
			$rerfs = $this->getPerformanceArray($result);
			$this->outPerformanceArray($rerfs);
			echo '</rows>';			
		}
		
		private function getPerformanceArray($result){
			$rows = array();
			
			while($row = mysql_fetch_assoc($result)){

				if(!isset($rows[$row['stg_id']])){
					$rows[$row['stg_id']][0] = $row['stg_id'];
					$rows[$row['stg_id']][1] = $row['stg_title'];
				}

				$rows[$row['stg_id']][2][$row['pid']][0] = $row['pid'];
				$rows[$row['stg_id']][2][$row['pid']][1] = $row['f_name'].' '.$row['l_name'];
				$rows[$row['stg_id']][2][$row['pid']][2][$row['ppa']][0]= $row['ppa'];
				$rows[$row['stg_id']][2][$row['pid']][2][$row['ppa']][1]= $row['stg_id'];
				$rows[$row['stg_id']][2][$row['pid']][2][$row['ppa']][2]= $row['stg_title'];
				$rows[$row['stg_id']][2][$row['pid']][2][$row['ppa']][3]= $row['assessment'];
				$rows[$row['stg_id']][2][$row['pid']][2][$row['ppa']][5][$row['objective_id']]= $row['co_title'];
				$rows[$row['stg_id']][2][$row['pid']][2][$row['ppa']][6]= $row['c_title'];
				$rows[$row['stg_id']][2][$row['pid']][2][$row['ppa']][7]= $row['studygroup_ids'];

				if($row['assessment']=="p"){
					$rows[$row['stg_id']][2][$row['pid']][2][$row['ppa']][3] = dlang("details_gr_acess_assign_pts","Pass");
				}
				if($row['assessment']=="np"){
					$rows[$row['stg_id']][2][$row['pid']][2][$row['ppa']][3] = dlang("details_gr_acess_assign_npts","NPass");
				}

                if($row['assessment'] == "" || $row['assessment']=='na'){
                    $rows[$row['stg_id']][2][$row['pid']][2][$row['ppa']][4] = $this->edit_color;
                }elseif($row['assessment'] == "F" || $row['assessment'] == "Fx"){
                    $rows[$row['stg_id']][2][$row['pid']][2][$row['ppa']][4] = "#ff8888";
                }else{
                    $rows[$row['stg_id']][2][$row['pid']][2][$row['ppa']][4] = "#88ff88";
                }
			}
			return $rows;
		}
		
		private function outPerformanceArray($rerfs){
	
			foreach ($rerfs as $key => $value){
				echo '<row id="studygroup_'.$value[0].'">
						<cell  style="color:rgb(73, 74, 75);" bgColor="#FFFFFF" image="studygroup.png" >'.$value[1].'</cell>';						
						foreach ($value[2] as $k => $v){
							echo '<row id="pupil_'.$v[0].'_'.$value[0].'" pupil="'.$v[1].'">
								<cell style="color:rgb(73, 74, 75);" bgColor="#FFFFFF" image="pupil.png">'.$v[1].'</cell>';
								foreach ($v[2] as $k2 => $v2){
										
										$sql = "SELECT title_en FROM studygroups WHERE studygroup_id IN (".$v2[7].")";
										$result = $this->db->query($sql);
										$sgids = null;
										while($row = mysql_fetch_assoc($result)){
											$sgids[] = $row['title_en'];
										}										
									echo '
										<row id="p_'.$v2[0].'" pupil="'.$v[1].'">
											<cell style="color:rgb(73, 74, 75);" bgColor="#FFFFFF" image="objective.png">'.implode(', ', $sgids).':'.implode(', ',$v2[5]).'</cell>				
											<cell xmlcontent="1" bgColor="'.$v2[4].'">'.$v2[3].'<option value="'."A".'">'."A".'</option>
														<option value="B">'."B".'</option>
														<option value="C">'."C".'</option>
														<option value="D">'."D".'</option>
														<option value="E">'."E".'</option>
														<option value="F">'."F".'</option>
														<option value="Fx">'."Fx".'</option>
														<option value="">'."".'</option>
											</cell>	
										</row>
									';							
								}
							echo '</row>';								
						}
						echo '</row>';
						/*
						echo '<row id="pupil_'.$value[8].'" pupil="'.$value[6].'">
							<cell image="pupil.png">'.$value[6].'</cell>
							<row id="'.$value[9].'" pupil="'.$value[6].'">
								<cell image="objective.png">'.$value[2].':'.implode(', ',$value[4]).'</cell>						
								<cell xmlcontent="1" bgColor="'.($value[5]?"#8f8":"#f88").'">
									'.$value[3].'
									<option value="A">A</option>
									<option value="B">B</option>
									<option value="C">C</option>
									<option value="D">D</option>
									<option value="E">E</option>
									<option value="F">F</option>
									<option value="Fx">Fx</option>
								</cell>	
							</row>
						</row>
					</row>';
				    */
			}	
		}
		
		private function deactivePerformance($id){
			$result = $this->db->query("UPDATE pupil_performance_assessment SET active=0  WHERE pupil_performance_assessment_id=$id");		
		}

		private function reactivePerformance($id){
			$result = $this->db->query("UPDATE pupil_performance_assessment SET active=1 WHERE pupil_performance_assessment_id=$id");			
		}
					
	}
?>