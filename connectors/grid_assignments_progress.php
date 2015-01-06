<?php
 	class grid_assignments_progress{
		private $db = false;
        private $user;
        private $edit_color = '#FFFFFF';
		public function __construct(){
			$this->db = Connection::getDB();
            $this->user = new administrator();
            if($this->user->role=='pupil' || $this->user->role=='parent'){
                $this->edit_color = '#AAAAAA';
            }
			$this->db->query("START TRANSACTION");
			error_reporting(E_ALL ^ E_NOTICE);
			switch ($_POST['action']) {
				case 'editresult':
					$this->editResult($_POST['id'],$_POST['value'],$_POST['pass']);
					break;	
				case 'editgrade':
					$this->editGrade($_POST['id'],$_POST['value'],$_POST['pass']);
					break;
				case 'editassessment':
					$this->editAssessment($_POST['id'],$_POST['assessment']);
					break;
				case 'deactive':
					$this->deactivePerformance($_POST['id']);
					break;
				case 'reactive':
					$this->reactivePerformance($_POST['id']);
					break;	
				case 'editstatus':
					$this->editStutus($_POST['assid'],$_POST['pid'],$_POST['value']);
					break;		
				case 'makeassubmitted':
					$this->makeAsSubmitted($_POST['assid'],$_POST['pid']);
					break;
				case 'makeasnotsubmitted':
					$this->makeAsNotSubmitted($_POST['assid'],$_POST['pid']);
					break;
				case 'activate':
					$this->activate($_POST['assid'],$_POST['pid'],$_POST['type']);
					break;
				case 'remove':
					$this->remove($_POST['assid'],$_POST['pid'],$_POST['type']);
					break;	
				case 'deactivate':
					$this->deactivate($_POST['assid'],$_POST['pid'],$_POST['type']);
					break;							
				default:
					$this->getAssignmentsGrid();
					break;
			}
			$this->db->query("COMMIT");
		}

		private function editStutus($id,$pid,$val){
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


            $this->db->query("UPDATE pupil_submission_result SET result='$val', pass='$pass' WHERE pupil_submission_result_id=$id");
            if($val=='A' || $val=='B'|| $val=='C'||$val=='D'||$val=='E'||$val=='F'||$val=='Fx'||$val==dlang("passvalue","Pass")||$val==dlang("npassvalue","NPass")){
                $result = $this->db->query("UPDATE pupil_submission_result SET assessment='$val' WHERE pupil_submission_result_id=$id");
            }
            $this->db->query("UPDATE pupli_submission_slot,pupil_submission_result SET pupli_submission_slot.status='1' WHERE pupli_submission_slot.submission_slot_id = pupil_submission_result.submission_slot_id
            AND pupil_submission_result.pupil_submission_result_id = $id");

            echo 1;
        }
		
		private function editGrade($id,$val,$pass){
            $result = $this->db->query("UPDATE pupil_submission_result SET assessment='$assess', pass=$val WHERE pupil_submission_result_id=$id");
		}

		private function editAssessment($id, $assess){
			$result = $this->db->query("UPDATE pupil_performance_assessment SET assessment='$assess' WHERE pupil_performance_assessment_id=$id");			
		}

		private function remove($id,$pid,$type){
			if($type=="performance"){
				$result = $this->db->query("DELETE FROM pupil_performance_assessment WHERE pupil_id=$pid AND performance_id=$id");
			}else{
				$result = $this->db->query("DELETE FROM pupli_submission_slot WHERE pupil_id=$pid AND assignment_id=$id");
			}
		}

		private function activate($id,$pid,$type){
			if($type=="performance"){
				$this->db->query("UPDATE pupil_performance_assessment SET active=1, activation_date=NOW()  WHERE pupil_id=$pid AND performance_id=$id");
			}else{
				$this->db->query("UPDATE pupli_submission_slot SET active=1, activation_date=NOW()  WHERE pupil_id=$pid AND assignment_id=$id");
			}
					
		}
		
		private function deactivate($id,$pid,$type){
			if($type=="performance"){
				$this->db->query("UPDATE pupil_performance_assessment SET active=0  WHERE pupil_id=$pid AND performance_id=$id");
			}else{
				$this->db->query("UPDATE pupli_submission_slot SET active=0  WHERE pupil_id=$pid AND assignment_id=$id");
			}		
		}
				
		private function getPerformanceArray($result,$rows){
			//$rows = array();
			while($row = mysql_fetch_assoc($result)){
				$rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['performancep_'.$row['performance_id']][12] = $row['performance_id'];
				$rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['performancep_'.$row['performance_id']][1] = $row['perf_title'];
				$rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['performancep_'.$row['performance_id']][7] = $row['sid'];
				$rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['performancep_'.$row['performance_id']][8] = $row['s_id'];
                $rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['performancep_'.$row['performance_id']][11] = $row['active']?"1":"0.5";
                $rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['performancep_'.$row['performance_id']][13] = $row['active'];
                $rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['performancep_'.$row['performance_id']][10] = $row['active']?"#FFFFFF":"#F5F5F5";

                $rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['performancep_'.$row['performance_id']][14][$row['pid']][0] = $row['pid'];
                $rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['performancep_'.$row['performance_id']][14][$row['pid']][3]= $row['ass'];
                $rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['performancep_'.$row['performance_id']][14][$row['pid']][13] = $row['active'];
                $rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['performancep_'.$row['performance_id']][14][$row['pid']][10] = $row['active']?"#FFFFFF":"#F5F5F5";
                $rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['performancep_'.$row['performance_id']][14][$row['pid']][11] = $row['active']?"1":"0.5";
                $rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['performancep_'.$row['performance_id']][14][$row['pid']][4][] = $row['obj_title'];

                if($row['ass'] == "" || $row['ass'] == "na"){
                    $rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['performancep_'.$row['performance_id']][14][$row['pid']][5] = $this->edit_color;
                }elseif($row['ass'] == "F" || $row['ass'] == "Fx"){
                    $rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['performancep_'.$row['performance_id']][14][$row['pid']][5] = "#ff8888";
                }else{
                    $rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['performancep_'.$row['performance_id']][14][$row['pid']][5] = "#88ff88";
                }
			}
            //print_r($rows);
			return $rows;
		}
		
		private function getAssignmentsGrid(){
		    header("Content-type:text/xml");
		    print('<?xml version="1.0" encoding="UTF-8"?>');
			$id = $_GET['id'];
            $and = "";
            if(isset($_GET['stg']) && $_GET['stg']!=""){
                $and = "AND studygroups.studygroup_id = ".$_GET['stg'];
            }

			$result = $this->db->query("
				SELECT course_rooms_assignments.number as numb, course_rooms_assignments.title_en as title_assignment, 
					course_rooms_assignments.assignment_id as aid,
					DATEDIFF(course_rooms_assignments.deadline_date, CURDATE()) as dl_date,
					DATEDIFF(course_rooms_assignments.deadline_date, pupli_submission_slot.submission_date) as submission_date,
                    course_rooms_assignments.deadline_date as deadline_date2,
					pupli_submission_slot.submission_date as submission_date2,
					course_objectives.title_en as title_course_obj,
					course_rooms_assignments.deadline as deadline,
					course_rooms_assignments.deadline_passed as dp,
					pupli_submission_slot.content_en as pcont,
					pupli_submission_slot.status as status,
					pupli_submission_slot.active as active,
					resultsets.result_max as max_rs,
					resultsets.result_pass as pass_rs,
					resultsets.studygroup_ids as studygroup_ids,
					result_units.result_unit_en as unit_rs,
					pupil_submission_result.result as subm_result,
					pupil_submission_result.assessment as assessment,
					pupil_submission_result.pupil_submission_result_id as psr,
					studygroups.title_en as sid,
					studygroups.studygroup_id as s_id,
					result_units.result_unit_id as result_unit_id,
					academic_years.title_en as acyear,
					subjects.title_en as subject,
					academic_years.academic_year_id as acyear_id,
					subjects.subject_id as subject_id,
					resultsets.castom_name as castom_name
				FROM course_rooms,pupli_submission_slot, course_rooms_assignments, resultsets,
				 studygroups, course_objectives, result_units, pupil_submission_result, resultset_to_course_objectives, academic_years, subjects
				WHERE pupli_submission_slot.assignment_id = course_rooms_assignments.assignment_id
				AND course_rooms_assignments.course_room_id = course_rooms.course_room_id
				AND course_rooms.course_room_id = studygroups.course_room_id
				AND resultsets.assignment_id = pupli_submission_slot.assignment_id
				AND resultset_to_course_objectives.resultset_id = resultsets.resultset_id
				AND course_objectives.objective_id = resultset_to_course_objectives.objective_id
				AND result_units.result_unit_id = resultsets.result_unit_id
				AND pupil_submission_result.result_set_id = resultsets.resultset_id
				AND pupil_submission_result.submission_slot_id = pupli_submission_slot.submission_slot_id
				AND pupli_submission_slot.pupil_id=$id
				AND studygroups.subject_id=subjects.subject_id
				AND subjects.academic_year_id = academic_years.academic_year_id
				AND resultset_to_course_objectives.type = 'assignment'
				{$and}
			");

			$result_perf = $this->db->query("
				SELECT performance.title_en as perf_title, pupil_performance_assessment.pupil_performance_assessment_id as pid,
				 course_objectives.title_en as obj_title,pupil_performance_assessment.assessment as ass,
				 pupil_performance_assessment.passed as passed,
				 pupil_performance_assessment.active as active,
				 studygroups.title_en as sid, studygroups.studygroup_id as s_id,
				 pupil_performance_assessment.performance_id as performance_id,
				 resultsets.resultset_id as resultset_id,
                 academic_years.title_en as acyear,
                 subjects.title_en as subject,
                 academic_years.academic_year_id as acyear_id,
                 subjects.subject_id as subject_id
				FROM course_rooms, pupil_performance_assessment, performance, studygroups,resultsets,course_objectives,resultset_to_course_objectives, academic_years, subjects
				WHERE pupil_performance_assessment.performance_id = performance.performance_id

				AND performance.course_room_id = course_rooms.course_room_id
				AND course_rooms.course_room_id = studygroups.course_room_id

				AND resultsets.resultset_id = pupil_performance_assessment.resultset_id
				AND resultset_to_course_objectives.resultset_id = resultsets.resultset_id
				AND course_objectives.objective_id = resultset_to_course_objectives.objective_id
				AND pupil_performance_assessment.pupil_id = $id
				AND studygroups.subject_id=subjects.subject_id
				AND subjects.academic_year_id = academic_years.academic_year_id
				AND resultset_to_course_objectives.type = 'performance'
			");
			
			echo '<rows>';
            $assarr = $this->getAssignmentsArray($result);
            $perfarr = $this->getPerformanceArray($result_perf,$assarr);


			//$perform = $this->outPerformanceArray($this->getPerformanceArray($result_perf));

			$this->outAssignmentsArray($perfarr);
				
			echo '</rows>';
		}

		private function outPerformanceArray($value2){
            $perf_xml = '
            <row id="performance_'.$value2[12].'">
                <cell bgColor="'.$value2[10].'" style="opacity: '.$value2[11].';" sid="performance_'.$value2[12].'" image="assessment.png">'.$value2[1].'</cell>
                <cell bgColor="'.$value2[10].'" style="opacity: '.$value2[11].';"/><cell style="opacity: '.$value2[11].';" bgColor="'.$value2[10].'"/>
                <cell style="opacity: '.$value2[11].';" bgColor="'.$value2[10].'"/><cell style="opacity: '.$value2[11].';" bgColor="'.$value2[10].'"/>
                <cell style="opacity: '.$value2[11].';" bgColor="'.$value2[10].'"/><cell bgColor="'.$value2[10].'"/>';

                foreach ($value2[14] as $value3) {
                    $perf_xml.= '
                        <row id="p_'.$value3[0].'" style="opacity: '.$value3[11].';">
                            <cell bgColor="#FFFFFF" style="color:rgb(73, 74, 75); opacity: '.$value3[11].';" image="objective.png" >'.$value2[7].': '.implode(', ',$value3[4]).'</cell>
                            <cell bgColor="#FFFFFF" style="opacity: '.$value3[11].';"></cell>
                            <cell bgColor="#FFFFFF" style="opacity: '.$value3[11].';"></cell>
                            <cell bgColor="#FFFFFF" style="opacity: '.$value3[11].';"></cell>
                            <cell bgColor="#FFFFFF" style="opacity: '.$value3[11].';"></cell>
                            <cell bgColor="#FFFFFF" style="opacity: '.$value3[11].';">'.$value3[6].'</cell>
                            <cell style="opacity: '.$value3[11].';" xmlcontent="1" bgColor="'.$value3[5].'">'.$value3[3].'<option value="A">'."A".'</option>
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
            $perf_xml.= '<userdata name="activate">'.$value2[13].'</userdata></row>';

			return $perf_xml;
		}
		
		private function getAssignmentsArray($result){
			$rows = array();
			$graeds = array('A','B','C','D','E','F');

			while($row = mysql_fetch_assoc($result)){
					$rows[$row['acyear_id']][$row['subject_id']][$row['s_id']][0] = $row['sid'];
                    $rows[$row['acyear_id']][0] = $row['acyear'];
                    $rows[$row['acyear_id']][$row['subject_id']][0] = $row['subject'];
					$rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][0] = $row['aid'];
					$rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][2] = $row['title_assignment'];
					$rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][3] = $row['dp'];
					$rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][4] = $row['pcont'];
					$rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][5] = $row['dl_date'];
                    $rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][20] = $row['deadline_date2'];
                    $rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][21] = $row['submission_date2'];
                    $rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][16] = $row['deadline'];

					$rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][6] = $row['status'];
					$rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][7] = $row['title_course'];
					$rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][9] = $row['sid'];
					$rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][10] = $row['active']?"#FFFFFF":"#F5F5F5";
					$rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][11] = $row['active']?"1":"0.5";
					$rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][12] = $row['active'];
                    $rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][15] = $row['submission_date'];
					
					$rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][8][$row['psr']][0] = $row['psr'];
					$rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][8][$row['psr']][1] = $row['castom_name'];
					$rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][8][$row['psr']][2] = $row['max_rs'];
					$rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][8][$row['psr']][3] = $row['pass_rs'];
					$rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][8][$row['psr']][4] = $row['subm_result'];
					$rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][8][$row['psr']][6] = $row['dl_date'];


					$rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][8][$row['psr']][7] = $row['sid'];
					$rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][8][$row['psr']][8] = $row['s_id'];
					$rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][8][$row['psr']][9] = $row['assessment'];
					$rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][8][$row['psr']][12] = $row['result_unit_id'];
					$rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][8][$row['psr']][14] = $row['studygroup_ids'];
					
					if($row['assessment']=="p"){
						$rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][8][$row['psr']][9] = dlang("passvalue","Pass");
					}
					if($row['assessment']=="np"){
						$rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][8][$row['psr']][9] = dlang("npassvalue","NPass");
					}
					$rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][8][$row['psr']][10] = $row['title_course'];
					
					$pass = $row['pass_rs'];
					$res = $row['subm_result'];
					
					switch ($row['result_unit_id']) {
						case '1':
							if((int)$pass <= (int)$res){
								$rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][8][$row['psr']][11] = "#88ff88";
							}else{
								$rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][8][$row['psr']][11] = "#ff8888";
							}
							break;
						case '2':
							if((int)$pass <= (int)$res){
								$rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][8][$row['psr']][11] = "#88ff88";
							}else{
								$rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][8][$row['psr']][11] = "#ff8888";
							}							
							break;
						
						case '3':
							if(array_search($pass,$graeds)>=array_search($res,$graeds)){
								$rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][8][$row['psr']][11] = "#88ff88";
							}else{
								$rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][8][$row['psr']][11] = "#ff8888";
							}
							break;
						case '4':
								if(strtolower($res)==dlang("passvalue","Pass")){
									$rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][8][$row['psr']][11] = "#88ff88";
								}else{
									$rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][8][$row['psr']][11] = "#ff8888";
								}							
							break;							
					}

					if($res==""){
						$rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][8][$row['psr']][11] = $this->edit_color;
					}

                    if($row['assessment']!=""){
                        if($row['assessment']=='F' || $row['assessment']=="Fx" || $row['assessment']==dlang("npassvalue","NPass")){
                            $rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][8][$row['psr']][11] = "#ff8888";
                        }else{
                            $rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][8][$row['psr']][11] = "#88ff88";
                        }
                    }
					$rows[$row['acyear_id']][$row['subject_id']][$row['s_id']]['assignment_'.$row['aid']][8][$row['psr']][5][] = $row['title_course_obj'];
			}
           // print_r($rows);
			return $rows;
		}
        private function outStgsArray($stg){
            foreach ($stg as $key => $group){
                if($key=="0")
                    continue;
                echo '
				<row  id="stg_'.$key.'">
				<cell style="color:rgb(73, 74, 75);" sid="stg_'.$key.'" image="studygroup.png">'.$group[0].'</cell>';

                foreach ($group as $key2 => $assignment){
                    if($key2=="0"){
                        continue;
                    }


                    $tkey2 = explode('_',$key2);
                    if($tkey2[0] == 'performancep'){
                        echo $this->outPerformanceArray($assignment);
                        continue;
                    }

                    echo '<row style="color:rgb(73, 74, 75); opacity: '.$assignment[11].';" bgColor="'.$assignment[10].'" id="assignment_'.$assignment[0].'"><cell bgColor="'.$assignment[10].'" style="color:rgb(73, 74, 75); opacity: '.$assignment[11].';" image="submission.png">'.$assignment[2].'</cell>';
                    if($assignment[6]!="1" && $assignment[6]!=dlang("grids_not_subm_text","Not subm.") && $assignment[6]!="Not subm."){
                        echo '<cell bgColor="'.$this->edit_color.'" style="color:#006699; opacity: '.$assignment[11].';">'.$assignment[6].'</cell>';
                    }else{
                        if($assignment[5]>=0 && ($assignment[6]==dlang("grids_not_subm_text","Not subm.") || $assignment[6]=="Not subm.") ){
                            echo '<cell bgColor="'.$this->edit_color.'" style="color:#6495ED; opacity: '.$assignment[11].';">'.dlang("grids_not_subm_text","Not subm.").'</cell>';
                        }elseif($assignment[5]<0 && ($assignment[6]==dlang("grids_not_subm_text","Not subm."))){
                            echo '<cell bgColor="'.$this->edit_color.'" style="color:#EE6A50; opacity: '.$assignment[11].';">'.dlang("grids_not_subm_text","Not subm.").'</cell>';
                        }else{
                            if($assignment[16]=='No deadline'){
                                echo '<cell bgColor="'.$this->edit_color.'" style="color:green; opacity: '.$assignment[9].';">'.dlang("grids_subm_text","Subm.").'</cell>';
                            }else{
                                if($assignment[15]>=0){
                                    if($assignment[21]<=$assignment[20]){
                                        echo '<cell bgColor="'.$this->edit_color.'" style="color:green; opacity: '.$assignment[13].';">'.abs($assignment[15]).' '.dlang("grids_not_subm_daye","day early").'</cell>';
                                    }else{
                                        echo '<cell bgColor="'.$this->edit_color.'" style="color:red; opacity: '.$assignment[13].';">'.abs($assignment[15]).' '.dlang("grids_not_subm_dayl","day late").'</cell>';
                                    }

                                }else{
                                    echo '<cell bgColor="'.$this->edit_color.'" style="color:red; opacity: '.$assignment[13].';">'.abs($assignment[15]).' '.dlang("grids_not_subm_dayl","day late").'</cell>';
                                }
                            }
                        }
                    }
                    echo '<cell bgColor="'.$assignment[10].'"/><cell bgColor="'.$assignment[10].'"/><cell bgColor="'.$assignment[10].'"/><cell bgColor="'.$assignment[10].'"/><cell bgColor="'.$assignment[10].'"/>';


                    foreach ($assignment[8] as $key3 => $rset) {
                        $sql = "SELECT title_en FROM studygroups WHERE studygroup_id IN (".$rset[14].")";
                        $result = $this->db->query($sql);
                        $sgids = null;
                        while($row = mysql_fetch_assoc($result)){
                            $sgids[] = $row['title_en'];
                        }
                        echo '
					        	<row id="a_'.$rset[0].'" style="opacity: '.$assignment[11].';">
					        		<cell  image="objective.png" bgColor="#FFFFFF" style="opacity: '.$assignment[11].'; color:rgb(73, 74, 75);">'.implode(', ', $sgids).': '.implode(', ',$rset[5]).'</cell>
					        		<cell bgColor="#FFFFFF" style="color:rgb(73, 74, 75); opacity: '.$assignment[11].';"></cell>
								    <cell bgColor="#FFFFFF" style="color:rgb(73, 74, 75); opacity: '.$assignment[11].';">'.$rset[1].'</cell>
									<cell bgColor="#FFFFFF" style="color:rgb(73, 74, 75); opacity: '.$assignment[11].';">'.$rset[2].'</cell>
									<cell bgColor="#FFFFFF" style="color:rgb(73, 74, 75); opacity: '.$assignment[11].';">'.$rset[3].'</cell>
									';
                        switch ($rset[12]) {
                            case '1':
                                echo '<cell type="ed" bgColor="'.$this->edit_color.'" style="color:rgb(73, 74, 75); opacity: '.$assignment[11].';">'.$rset[4].'</cell>';
                                break;
                            case '2':
                                echo '<cell type="ed" bgColor="'.$this->edit_color.'" style="color:rgb(73, 74, 75); opacity: '.$assignment[11].';">'.$rset[4].'</cell>';
                                break;
                            case '3':
                                echo '<cell type="co" xmlcontent="1" bgColor="'.$this->edit_color.'" style="color:rgb(73, 74, 75); opacity: '.$assignment[11].';">'.$rset[4].'<option value="'."A".'">'."A".'</option>
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
                                echo '<cell  type="co" xmlcontent="1" bgColor="'.$this->edit_color.'" style="color:rgb(73, 74, 75); opacity: '.$assignment[11].';">'.dlang($rset[4]).'<option value="'.dlang("passvalue","Pass").'">'.dlang("passvalue","Pass").'</option>
															<option value="'.dlang("npassvalue","NPass").'">'.dlang("npassvalue","NPass").'</option>
															<option value="">'."".'</option>
														</cell>';
                                break;
                            default:

                                break;
                        }
                        if($rset[12]=='4'){
                            echo '<cell xmlcontent="1" bgColor="'.$rset[11].'" style="color:rgb(73, 74, 75); opacity: '.$assignment[11].';">'.$rset[9].'<option value="'.dlang("passvalue","Pass").'">'.dlang("passvalue","Pass").'</option>
                                <option value="'.dlang("npassvalue","NPass").'">'.dlang("npassvalue","NPass").'</option>
                                <option value="">'."".'</option>
                                </cell><userdata name="unit">'.$rset[12].'</userdata></row>';
                        }else{
                            echo '<cell xmlcontent="1" bgColor="'.$rset[11].'" style="color:rgb(73, 74, 75); opacity: '.$assignment[11].';">'.$rset[9].'<option value="'."A".'">'."A".'</option>
                                <option value="B">'."B".'</option>
                                <option value="C">'."C".'</option>
                                <option value="D">'."D".'</option>
                                <option value="E">'."E".'</option>
                                <option value="F">'."F".'</option>
                                <option value="Fx">'."Fx".'</option>
                                <option value="">'."".'</option>
                                </cell><userdata name="unit">'.$rset[12].'</userdata></row>';
                        }
                    }
                    echo "<userdata name='submitted'>".($assignment[6]=="1"?1:0)."</userdata>";
                    echo "<userdata name='activate'>".$assignment[12]."</userdata>";
                    echo '</row>';
                }
                echo '</row>';
            }
        }

		private function outAssignmentsArray($acyears){
            foreach($acyears as $yid => $year){
                if($yid=="0")
                    continue;
                echo '<row  id="year_'.$yid.'">
                        <cell style="color:rgb(73, 74, 75);" sid="year_'.$yid.'" image="folder_closed.png">'.$year[0].'</cell>';
                        foreach($year as $subid => $subject){
                            if($subid=="0" || !$subject[0])
                                continue;
                            echo '<row  id="subject_'.$subid.'">
                                <cell style="color:rgb(73, 74, 75);" sid="subject_'.$subid.'" image="folder_closed.png">'.$subject[0].'</cell>';
                                $this->outStgsArray($subject);
                            echo '</row>';
                        }
                echo '</row>';

            }
        }
					
	}
?>