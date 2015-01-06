<?php
 	class grid_assess_assignments{
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
				case 'editresult':
					$this->editResult($_POST['id'],$_POST['value'],$_POST['pass']);
					break;
				case 'editgrade':
					$this->editGrade($_POST['id'],$_POST['value'],$_POST['pass']);
					break;
				case 'makeassubmitted':
					$this->makeAsSubmitted($_POST['assid'],$_POST['pid']);
					break;
				case 'makeasnotsubmitted':
					$this->makeAsNotSubmitted($_POST['assid'],$_POST['pid']);
					break;
				case 'editstatus':
					$this->editStutus($_POST['assid'],$_POST['pid'],$_POST['value']);
					break;
                case 'activate':
                    $this->activate($_POST['assid']);
                    break;
                case 'deactivate':
                    $this->deactivate($_POST['assid']);
                    break;
                default:
					$this->getAssignmentsAssessGrid();
					break;
			}
		}


        private function deactivate($id){
            $this->db->query("UPDATE pupli_submission_slot SET active=0  WHERE submission_slot_id=$id");
        }

        private function activate($id){
            $this->db->query("UPDATE pupli_submission_slot SET active=1  WHERE submission_slot_id=$id");
        }

		private function editStutus($pid,$id,$val){
			$result = $this->db->query("UPDATE pupli_submission_slot SET status='$val' WHERE assignment_id=$id AND pupil_id=$pid");
		}

		private function makeAsSubmitted($id,$pid){
			$result = $this->db->query("UPDATE pupli_submission_slot SET status='1', submission_date = NOW() WHERE assignment_id=$id AND pupil_id=$pid");
		}

		private function makeAsNotSubmitted($id,$pid){
            $ns = dlang("grids_not_subm_text","Not subm.");
			$result = $this->db->query("UPDATE pupli_submission_slot SET status='$ns' WHERE assignment_id=$id AND pupil_id=$pid");
		}

		private function editResult($id,$val,$pass){
            @session_start();
            $_SESSION['submissions_update']=$this->user->id;
            session_write_close();

            if($val == "FX"){
                $val = "Fx";
            }
			$this->db->query("UPDATE pupil_submission_result SET result='$val', pass='$pass' WHERE pupil_submission_result_id=$id");
            if($val=='A' || $val=='B'|| $val=='C'||$val=='D'||$val=='E'||$val=='F'||$val=='Fx'||$val==dlang("passvalue","Pass")||$val==dlang("npassvalue","NPass")){
                if($val == "Fx"){
                    $val = "F";
                }
                $result = $this->db->query("UPDATE pupil_submission_result SET assessment='$val' WHERE pupil_submission_result_id=$id");
            }
            $this->db->query("UPDATE pupli_submission_slot,pupil_submission_result SET pupli_submission_slot.status='1' WHERE pupli_submission_slot.submission_slot_id = pupil_submission_result.submission_slot_id
            AND pupil_submission_result.pupil_submission_result_id = $id");

            echo 1;
		}

		private function editGrade($id,$assess,$pass){
			$result = $this->db->query("UPDATE pupil_submission_result SET assessment='$assess', pass=$pass WHERE pupil_submission_result_id=$id");
            @session_start();
            $_SESSION['annotation']=1;
            $_SESSION['submissions_update']=$this->user->id;
            session_write_close();
		}

	private function getAssignmentsAssessGrid(){
		    header("Content-type:text/xml");
		    print('<?xml version="1.0" encoding="UTF-8"?>');

			$id = $_GET['id'];
            $and = "";
            $addtbl = "";

            if($this->user->role == "pupil"){
                $and = "AND pupil.user_id = ".$this->user->id;
            }elseif($this->user->role == "parent"){
                $addtbl = ", parents";
                $and = "AND parents.user_id = {$this->user->id} AND pupil.pupil_id = parents.pupil_id";
            }

			$result1 = $this->db->query("
				SELECT studygroups.title_en as stg_title,
					studygroups.studygroup_id as stg_id,
					pupli_submission_slot.content_en as pcont,
					pupli_submission_slot.submission_slot_id as slot,
					pupli_submission_slot.status as status,
					pupli_submission_slot.active as active,
					pupil.forename as fname,
					pupil.lastname as lname,
					pupil.pupil_id as pid,
					course_rooms_assignments.deadline as deadline,
					course_rooms_assignments.deadline_date as deadline_date2,
					pupli_submission_slot.submission_date as submission_date2,
					DATEDIFF(course_rooms_assignments.deadline_date, CURDATE()) as dl_date,
					DATEDIFF(course_rooms_assignments.deadline_date, pupli_submission_slot.submission_date) as submission_date,
					course_rooms_assignments.deadline_passed as dp
				FROM pupli_submission_slot, course_rooms_assignments, studygroups,resultsets_studygroups,resultsets, pupil $addtbl
				WHERE course_rooms_assignments.assignment_id = resultsets.assignment_id
				AND resultsets_studygroups.resultset_id = resultsets.resultset_id
				AND studygroups.studygroup_id = resultsets_studygroups.studygroup_id
				AND pupli_submission_slot.assignment_id = course_rooms_assignments.assignment_id
				AND pupli_submission_slot.studygroup_id = studygroups.studygroup_id
				AND pupil.pupil_id = pupli_submission_slot.pupil_id
				AND course_rooms_assignments.assignment_id=$id
				$and
			");


			echo '<rows>';

			$rerfs = $this->getAssignmentsAssessArray($result1,$id);
			$this->outAssignmentsAssessArray($rerfs);

			echo '</rows>';
		}

		private function getAssignmentsAssessArray($result1,$id){
			$graeds = array('A','B','C','D','E','F');
			$rows = array();
			while($row = mysql_fetch_assoc($result1)){
				if(!isset($rows[$row['stg_id']])){
					$rows[$row['stg_id']][0] = $row['stg_id'];
					$rows[$row['stg_id']][1] = $row['stg_title'];
					$rows[$row['stg_id']][2] = array();
				}

				$rows[$row['stg_id']][2][$row['pid']][0] = $row['fname'].' '.$row['lname'];
				$rows[$row['stg_id']][2][$row['pid']][1] = $row['pid'];
				$rows[$row['stg_id']][2][$row['pid']][3] = $row['pcont'];
				$rows[$row['stg_id']][2][$row['pid']][4] = $row['status'];
				$rows[$row['stg_id']][2][$row['pid']][5] = $row['dl_date'];

                $rows[$row['stg_id']][2][$row['pid']][12] = $row['deadline_date2'];
                $rows[$row['stg_id']][2][$row['pid']][13] = $row['submission_date2'];

				$rows[$row['stg_id']][2][$row['pid']][6] = $row['dp'];
                $rows[$row['stg_id']][2][$row['pid']][7] = $row['submission_date'];
                $rows[$row['stg_id']][2][$row['pid']][11] = $row['deadline'];

                $rows[$row['stg_id']][2][$row['pid']][8] = $row['active']?"#FFFFFF":"#F5F5F5";
                $rows[$row['stg_id']][2][$row['pid']][9] = $row['active']?"1":"0.5";
                $rows[$row['stg_id']][2][$row['pid']][10] = $row['active'];

				$slot = $row['slot'];

				$result2 = $this->db->query("
					SELECT studygroups.title_en as stg_title,
						course_objectives.title_en as co_title,
						studygroups.studygroup_id as stg_id,
						resultsets.result_max as max_rs,
						resultsets.result_pass as pass_rs,
						resultsets.castom_name as castom_name,
						resultsets.studygroup_ids as studygroup_ids,
						pupil_submission_result.result as subm_result,
						pupil_submission_result.assessment as assessment,
						pupil_submission_result.pupil_submission_result_id as psr,
						result_units.result_unit_en as unit_rs,
						result_units.result_unit_id as result_unit_id
					FROM course_rooms,course_rooms_assignments, resultsets, studygroups, course_objectives, result_units, pupil_submission_result, resultset_to_course_objectives, pupli_submission_slot
					WHERE pupli_submission_slot.assignment_id = course_rooms_assignments.assignment_id

					AND course_rooms_assignments.course_room_id = course_rooms.course_room_id
					AND course_rooms.course_room_id = studygroups.course_room_id

					AND resultsets.assignment_id = pupli_submission_slot.assignment_id
					AND resultset_to_course_objectives.resultset_id = resultsets.resultset_id
					AND course_objectives.objective_id = resultset_to_course_objectives.objective_id
					AND result_units.result_unit_id = resultsets.result_unit_id
					AND pupil_submission_result.result_set_id = resultsets.resultset_id
					AND pupil_submission_result.submission_slot_id = pupli_submission_slot.submission_slot_id
					AND course_rooms_assignments.assignment_id=$id
					AND pupli_submission_slot.submission_slot_id=$slot
					AND resultset_to_course_objectives.type = 'assignment'
				");

				while($row2 = mysql_fetch_assoc($result2)){

					$rows[$row['stg_id']][2][$row['pid']][2][$row2['psr']][0] = $row2['cr_title'];
					$rows[$row['stg_id']][2][$row['pid']][2][$row2['psr']][1] = $row2['cr_id'];
					$rows[$row['stg_id']][2][$row['pid']][2][$row2['psr']][3] = $row2['castom_name'];
					$rows[$row['stg_id']][2][$row['pid']][2][$row2['psr']][4] = $row2['max_rs'];
					$rows[$row['stg_id']][2][$row['pid']][2][$row2['psr']][5] = $row2['pass_rs'];
					$rows[$row['stg_id']][2][$row['pid']][2][$row2['psr']][6] = $row2['subm_result'];
					$rows[$row['stg_id']][2][$row['pid']][2][$row2['psr']][14] = $row2['studygroup_ids'];

					$pass = $row2['pass_rs'];
					$res = $row2['subm_result'];

					switch ($row2['result_unit_id']){
						case '1':
							if((int)$pass <= (int)$res){
								$rows[$row['stg_id']][2][$row['pid']][2][$row2['psr']][7] = "#88ff88";
							}else{
								$rows[$row['stg_id']][2][$row['pid']][2][$row2['psr']][7] = "#ff8888";
							}
							break;
						case '2':
							if((int)$pass <= (int)$res){
								$rows[$row['stg_id']][2][$row['pid']][2][$row2['psr']][7] = "#88ff88";
							}else{
								$rows[$row['stg_id']][2][$row['pid']][2][$row2['psr']][7] = "#ff8888";
							}
							break;

						case '3':
							if(array_search($pass,$graeds)>=array_search($res,$graeds)){
								$rows[$row['stg_id']][2][$row['pid']][2][$row2['psr']][7] = "#88ff88";
							}else{
								$rows[$row['stg_id']][2][$row['pid']][2][$row2['psr']][7] = "#ff8888";
							}
							break;
						case '4':
								if($res==dlang("passvalue","Pass")){
									$rows[$row['stg_id']][2][$row['pid']][2][$row2['psr']][7] = "#88ff88";
								}else{
									$rows[$row['stg_id']][2][$row['pid']][2][$row2['psr']][7] = "#ff8888";
								}
							break;
					}

					if($res==""){
						$rows[$row['stg_id']][2][$row['pid']][2][$row2['psr']][7] = $this->edit_color;
					}

                    if($row2['assessment']!=""){
                        if($row2['assessment']=='F' || $row2['assessment']=="Fx" || $row2['assessment']==dlang("npassvalue","NPass")){
                            $rows[$row['stg_id']][2][$row['pid']][2][$row2['psr']][7] = "#ff8888";
                        }else{
                            $rows[$row['stg_id']][2][$row['pid']][2][$row2['psr']][7] = "#88ff88";
                        }

                        if($row2['assessment']=='na' ){
                            $rows[$row['stg_id']][2][$row['pid']][2][$row2['psr']][7] = $this->edit_color;
                        }
                    }
                    if($row2['assessment']=='' ){
                        $rows[$row['stg_id']][2][$row['pid']][2][$row2['psr']][7] = $this->edit_color;
                    }
					$rows[$row['stg_id']][2][$row['pid']][2][$row2['psr']][9] = $row2['psr'];
					$rows[$row['stg_id']][2][$row['pid']][2][$row2['psr']][11] = $row2['assessment'];
					$rows[$row['stg_id']][2][$row['pid']][2][$row2['psr']][12] = $row2['result_unit_id'];

					if($row2['assessment']==dlang("passvalue","Pass") || $row2['assessment']=="Pass"){
						$rows[$row['stg_id']][2][$row['pid']][2][$row2['psr']][11] = dlang("passvalue","Pass");
					}
					if($row2['assessment']==dlang("npassvalue","NPass" || $row2['assessment']=="NPass")){
						$rows[$row['stg_id']][2][$row['pid']][2][$row2['psr']][11] = dlang("npassvalue","NPass");
					}
					$rows[$row['stg_id']][2][$row['pid']][2][$row2['psr']][2][] = $row2['co_title'];
				}


			}

			return $rows;
		}

		private function outAssignmentsAssessArray($rerfs){

			foreach ($rerfs as $key => $value){
				echo '<row id="studygroup_'.$value[0].'">
							<cell style="color:rgb(73, 74, 75);" image="studygroup.png">'.$value[1].'</cell>';
							foreach ($value[2] as $key2 => $value2){
								echo '<row style="opacity: '.$value2[9].';"  id="pupil_'.$value2[1].'_'.$value[0].'" pupil="'.$value2[0].'">
									<cell style="color:rgb(73, 74, 75); opacity: '.$value2[9].';" image="pupil.png">'.$value2[0].'</cell>
									';
									if($value2[4]!="1" && $value2[4]!="0" && $value2[4]!=dlang("grids_not_subm_text","Not subm.") && $value2[4]!="Not subm."){
										echo '<cell bgColor="'. $this->edit_color.'" style="color:#006699; opacity: '.$value2[9].';">'.$value2[4].'</cell>';
									}else{
										if($value2[5]>=0 && ($value2[4]==dlang("grids_not_subm_text","Not subm.") || $value2[4]=="Not subm.")){
											echo '<cell bgColor="'.$this->edit_color.'" style="color:#6495ED; opacity: '.$value2[9].';">'.dlang("grids_not_subm_text","Not subm.").'</cell>';
										}elseif($value2[5]<0 && $value2[4]==dlang("grids_not_subm_text","Not subm.")){
											echo '<cell bgColor="'.$this->edit_color.'" style="color:#EE6A50; opacity: '.$value2[9].';">'.dlang("grids_not_subm_text","Not subm.").'</cell>';
										}else{
                                            if($value2[11]=='No deadline'){
                                                echo '<cell bgColor="'.$this->edit_color.'" style="color:green; opacity: '.$value2[9].';">'.dlang("grids_subm_text","Subm.").'</cell>';
                                            }else{
                                                if($value2[7]>=0){
                                                        if($value2[12] > $value2[13]){
                                                            echo '<cell bgColor="'.$this->edit_color.'" style="color:green; opacity: '.$value2[9].';">'.abs($value2[7]).' '.dlang("grids_not_subm_daye","day early").'</cell>';
                                                        }else{
                                                            echo '<cell bgColor="'.$this->edit_color.'" style="color:red; opacity: '.$value2[9].';">'.abs($value2[7]).' '.dlang("grids_not_subm_dayl","day late").'</cell>';
                                                        }
                                                   // echo '<cell bgColor="'.$this->edit_color.'" style="color:green; opacity: '.$value2[9].';">'.abs($value2[7]).' '.dlang("grids_not_subm_daye","day early").'</cell>';
                                                }else{
                                                    echo '<cell bgColor="'.$this->edit_color.'" style="color:red; opacity: '.$value2[9].';">'.abs($value2[7]).' '.dlang("grids_not_subm_dayl","day late").'</cell>';
                                                }
                                            }

										}
									}
									echo '<cell></cell><cell />';

									foreach ($value2[2] as $k => $v){
										$sql = "SELECT title_en FROM studygroups WHERE studygroup_id IN (".$v[14].")";
										$result = $this->db->query($sql);
										$sgids = null;
										while($row = mysql_fetch_assoc($result)){
											$sgids[] = $row['title_en'];
										}

										echo '<row id="a_'.$v[9].'" style="opacity: '.$value2[9].';" bgColor="'.$value2[8].'" pupil="'.$value2[0].'">
												<cell style="color:rgb(73, 74, 75); opacity: '.$value2[9].';" bgColor="#FFFFFF" image="objective.png">'.implode(', ', $sgids).': '.implode(', ',$v[2]).'</cell>
												<cell bgColor="#FFFFFF"></cell>
												<cell style="color:rgb(73, 74, 75); opacity: '.$value2[9].';" bgColor="#FFFFFF">'.$v[3].'</cell>
												<cell style="color:rgb(73, 74, 75); opacity: '.$value2[9].';" bgColor="#FFFFFF">'.$v[4].'</cell>
												<cell style="color:rgb(73, 74, 75); opacity: '.$value2[9].';" bgColor="#FFFFFF">'.$v[5].'</cell>';

												switch ($v[12]) {
													case '1':
														echo '<cell style="opacity: '.$value2[9].';" type="ed" bgColor="'.$this->edit_color.'">'.$v[6].'</cell>';
														break;
													case '2':
														echo '<cell style="opacity: '.$value2[9].';"  type="ed" bgColor="'.$this->edit_color.'">'.$v[6].'</cell>';
														break;
													case '3':
														echo '<cell style="opacity: '.$value2[9].';" type="co" xmlcontent="1" bgColor="'.$this->edit_color.'">'.$v[6].'<option value="'."A".'">'."A".'</option>
														<option value="B">'."B".'</option>
														<option value="C">'."C".'</option>
														<option value="D">'."D".'</option>
														<option value="E">'."E".'</option>
														<option value="F">'."F".'</option>
														<option value="Fx">'."Fx".'</option>
														</cell>
														';
														break;
													case '4':
														echo '<cell style="opacity: '.$value2[9].';" type="co" xmlcontent="1" bgColor="'.$this->edit_color.'">'.$v[6].'<option value="'.dlang("passvalue","Pass").'">'.dlang("passvalue","Pass").'</option>
															<option value="'.dlang("npassvalue","NPass").'">'.dlang("npassvalue","NPass").'</option>
															<option value="">'."".'</option>
														</cell>';
														break;																																									
													default:
														
														break;
												}
                                                if($v[12]=='4'){
                                                    echo '<cell style="opacity: '.$value2[9].';" xmlcontent="1" bgColor="'.$v[7].'">'.$v[11].'<option value="'.dlang("passvalue","Pass").'">'.dlang("passvalue","Pass").'</option>
                                                    <option value="'.dlang("npassvalue","NPass").'">'.dlang("npassvalue","NPass").'</option>
                                                    <option value="">'."".'</option>
                                                    </cell>
                                                    <userdata name="unit">'.$v[12].'</userdata>
                                                    <userdata name="activate">'.($value2[10]=="1"?1:0).'</userdata>
                                                    </row>';
                                                }else{
                                                    echo '<cell style="opacity: '.$value2[9].';" xmlcontent="1" bgColor="'.$v[7].'">'.$v[11].'<option value="'."A".'">'."A".'</option>
                                                    <option value="B">'."B".'</option>
                                                    <option value="C">'."C".'</option>
                                                    <option value="D">'."D".'</option>
                                                    <option value="E">'."E".'</option>
                                                    <option value="F">'."F".'</option>
                                                    <option value="Fx">'."Fx".'</option>
                                                    <option value="">'."".'</option>
                                                    </cell>
                                                    <userdata name="unit">'.$v[12].'</userdata>
                                                    <userdata name="activate">'.($value2[10]=="1"?1:0).'</userdata>
                                                    </row>';
                                                }



									}
									echo "<userdata name='submitted'>".($value2[4]=="1"?1:0)."</userdata>";
                                    echo "<userdata name='activate'>".($value2[10]=="1"?1:0)."</userdata>";
									echo '</row>'; 
							}				
							echo '</row>';			
			}
			
		}

		private function removeAssignment($id,$pupil_id){
			$result = $this->db->query("DELETE FROM pupil_performance_assessment WHERE pupil_performance_assessment_id=$id");			
		}
		private function deactivePerformance($id){
			$result = $this->db->query("UPDATE pupil_performance_assessment SET active=0  WHERE pupil_performance_assessment_id=$id");		
		}

		private function reactivePerformance($id){
			$result = $this->db->query("UPDATE pupil_performance_assessment SET active=1 WHERE pupil_performance_assessment_id=$id");			
		}
					
	}
?>