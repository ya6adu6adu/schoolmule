<?php
 	class grid_assignments_progress{
		private $db = false;
		public function __construct(){
			$this->db = Connection::getDB();
			error_reporting(E_ALL ^ E_NOTICE);
			switch ($_POST['action']) {
				case 'editresult':
					$this->editResult($_POST['id'],$_POST['value']);
					break;	
				case 'editgrade':
					$this->editGrade($_POST['id'],$_POST['value']);
					break;
				case 'editassessment':
					$this->editAssessment($_POST['id'],$_POST['assessment']);
					break;
				case 'remove':
					$this->removePerformance($_POST['id']);
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
				default:
					$this->getAssignmentsGrid();
					break;
			}
		}

		private function editStutus($id,$pid,$val){
			$result = $this->db->query("UPDATE pupli_submission_slot SET status='$val' WHERE assignment_id=$id AND pupil_id=$pid");			
		}

		private function makeAsSubmitted($id,$pid){
			$result = $this->db->query("UPDATE pupli_submission_slot SET status='1' WHERE assignment_id=$id AND pupil_id=$pid");			
		}
		
		private function editResult($id,$val){
			$result = $this->db->query("UPDATE pupil_submission_result SET result='$val' WHERE pupil_submission_result_id=$id");			
		}
		
		private function editGrade($id,$val){
			$result = $this->db->query("UPDATE pupil_submission_result SET grade_definition_id=$val WHERE pupil_submission_result_id=$id");			
		}

		private function editAssessment($id, $assess){
			$result = $this->db->query("UPDATE pupil_performance_assessment SET assessment='$assess' WHERE pupil_performance_assessment_id=$id");			
		}

		private function removePerformance($id){
			$result = $this->db->query("DELETE FROM pupil_performance_assessment WHERE pupil_performance_assessment_id=$id");			
		}

		private function deactivePerformance($id){
			$result = $this->db->query("UPDATE pupil_performance_assessment SET active=0  WHERE pupil_performance_assessment_id=$id");		
		}

		private function reactivePerformance($id){
			$result = $this->db->query("UPDATE pupil_performance_assessment SET active=1 WHERE pupil_performance_assessment_id=$id");			
		}
		
		private function getPerformanceArray($result){
			$rows = array();
			while($row = mysql_fetch_assoc($result)){
				if(!isset($rows['performance_'.$row['pid']])){
					$rows['performance_'.$row['pid']][0] = $row['pid'];
					$rows['performance_'.$row['pid']][1] = $row['perf_title'];
					$rows['performance_'.$row['pid']][2] = $row['course_title'];
					$rows['performance_'.$row['pid']][3] = $row['ass'];
					$rows['performance_'.$row['pid']][4] = array();		
					$rows['performance_'.$row['pid']][5] = $row['passed'];
					$rows['performance_'.$row['pid']][6] = $row['subm_result'];	
					$rows['performance_'.$row['pid']][7] = $row['sid'];	
					$rows['performance_'.$row['pid']][8] = $row['s_id'];	
					$rows['performance_'.$row['pid']][9] = $row['psr'];
				}
				
				$rows['performance_'.$row['pid']][4][] = $row['obj_title'];
			}
			return $rows;
		}
		
		private function getAssignmentsGrid(){
		    header("Content-type:text/xml");
		    print('<?xml version="1.0" encoding="UTF-8"?>');
			$id = $_GET['id'];
			$result = $this->db->query("
				SELECT course_rooms_assignments.number as numb, course_rooms_assignments.title_en as title_assignment, 
					course_rooms_assignments.assignment_id as aid, courses.title_en as title_course,
					DATEDIFF(course_rooms_assignments.deadline_date, CURDATE()) as dl_date,
					course_objectives.title_en as title_course_obj,
					course_rooms_assignments.deadline_passed as dp,
					pupli_submission_slot.content_en as pcont,
					pupli_submission_slot.status as status,
					resultsets.result_max as max_rs,
					resultsets.result_pass as pass_rs,
					result_units.result_unit_en as unit_rs,
					pupil_submission_result.result as subm_result,
					pupil_submission_result.assessment as assessment,
					grade_definition.title_en as grade_title,
					pupil_submission_result.pupil_submission_result_id as psr,
					studygroups.title_en as sid,
					studygroups.studygroup_id as s_id
				FROM pupli_submission_slot, course_rooms_assignments, resultsets, studygroups, courses, course_objectives, result_units, pupil_submission_result, grade_definition, resultset_to_course_objectives
				WHERE pupli_submission_slot.assignment_id = course_rooms_assignments.assignment_id
				AND resultsets.assignment_id = course_rooms_assignments.assignment_id
				AND studygroups.resultset_id = resultsets.resultset_id
				AND studygroups.course_id = courses.course_id
				AND resultset_to_course_objectives.resultset_id = resultsets.resultset_id
				AND course_objectives.objective_id = resultset_to_course_objectives.objective_id
				AND result_units.result_unit_id = resultsets.result_unit_id
				AND pupil_submission_result.result_set_id = resultsets.resultset_id
				AND grade_definition.grade_definition_id = pupil_submission_result.grade_definition_id
				AND pupli_submission_slot.pupil_id=$id
			");
			
			$result2 = $this->db->query("
				SELECT performance.title_en as perf_title, pupil_performance_assessment.pupil_performance_assessment_id as pid,
				 courses.title_en as course_title, course_objectives.title_en as obj_title,pupil_performance_assessment.assessment as ass,
				 pupil_performance_assessment.passed as passed, pupil_submission_result.result as subm_result, pupil_submission_result.pupil_submission_result_id as psr,
				 studygroups.title_en as sid, studygroups.studygroup_id as s_id
				FROM pupil_performance_assessment, performance, studygroups,courses,resultsets,course_objectives,resultset_to_course_objectives, pupil_submission_result
				WHERE pupil_performance_assessment.performance_id = performance.performance_id
				AND studygroups.studygroup_id = performance.studygroup_id
				AND studygroups.course_id = courses.course_id
				AND performance.resultset_id = resultsets.resultset_id
				AND pupil_submission_result.result_set_id = resultsets.resultset_id
				AND resultset_to_course_objectives.resultset_id = resultsets.resultset_id
				AND course_objectives.objective_id = resultset_to_course_objectives.objective_id
				AND pupil_id=$id
			");
			
			echo '<rows>';
			$rerfs1 = $this->getPerformanceArray($result2);
			$rt = $this->outPerformanceArray($rerfs1);
			
			$rerfs2 = $this->getAssignmentsArray($result);
			$this->outAssignmentsArray($rerfs2,$rt);
				
			echo '</rows>';
		}

		private function outPerformanceArray($rerfs){
			$rrtr = array();
			foreach ($rerfs as $key => $value){
				/*
				echo '				
				<row id="performance_'.$value[0].'">
						<cell image="performance_progress.png">'.$value[1].'</cell>
						<row id="p_'.$value[0].'">
							<cell image="objective.png">'.$value[7].': '.implode(', ',$value[4]).'</cell>
							<cell></cell>
							<cell></cell>
							<cell></cell>
							<cell></cell>
							<cell bgColor="#FEF5CA">'.$value[6].'</cell>				
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
				</row>';
				 */
				$rrtr[$value[8]][0] = '				
				<row id="performance_'.$value[0].'">
						<cell sid="performance_'.$value[0].'" image="assessment.png">'.$value[1].'</cell>
						<row id="p_'.$value[9].'">
							<cell image="objective.png">'.$value[7].': '.implode(', ',$value[4]).'</cell>
							<cell></cell>
							<cell></cell>
							<cell></cell>
							<cell></cell>
							<cell bgColor="#FEF5CA">'.$value[6].'</cell>				
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
				</row>';
				$rrtr[$value[8]][1] = $value[7];
			}
		return $rrtr;
		}
		
		private function getAssignmentsArray($result){
			$rows = array();
			while($row = mysql_fetch_assoc($result)){
				if(!isset($rows['assignment_'.$row['aid']])){
					$rows['assignment_'.$row['aid']][0] = $row['aid'];
					$rows['assignment_'.$row['aid']][1] = array();
					$rows['assignment_'.$row['aid']][2] = '['.$row['numb'].']:'.$row['title_assignment'];
					$rows['assignment_'.$row['aid']][3] = $row['dp'];
					$rows['assignment_'.$row['aid']][4] = $row['pcont'];
					$rows['assignment_'.$row['aid']][5] = $row['dl_date'];
					$rows['assignment_'.$row['aid']][6] = $row['status'];
					$rows['assignment_'.$row['aid']][7] = $row['title_course'];
					$rows['assignment_'.$row['aid']][8] = $row['unit_rs'];
					$rows['assignment_'.$row['aid']][9] = $row['max_rs'];
					$rows['assignment_'.$row['aid']][10] = $row['pass_rs'];
					$rows['assignment_'.$row['aid']][11] = $row['subm_result'];
					$rows['assignment_'.$row['aid']][12] = $row['assessment']?"#8f8":"#f88";
					$rows['assignment_'.$row['aid']][13] = $row['grade_title'];
					$rows['assignment_'.$row['aid']][14] = $row['psr'];
					$rows['assignment_'.$row['aid']][15] = $row['sid'];
					$rows['assignment_'.$row['aid']][16] = $row['s_id'];
				}
				$rows['assignment_'.$row['aid']][1][] = $row['title_course_obj'];
			}
			return $rows;
		}
		
		private function outAssignmentsArray($rerfs,$rt){
			foreach ($rerfs as $key => $value){
				echo '
				<row  id="stg_'.$value[16].'">
				<cell sid="stg_'.$value[16].'" image="studygroup.png">'.$value[15].'</cell>
				';
				echo '<row id="assignment_'.$value[0].'"><cell image="submission.png">'.$value[2].'</cell>';
				if($value[6]!="1" && $value[6]!="0"){
					echo '<cell bgColor="#FEF5CA" style="color:#006699">'.$value[6].'</cell>';
				}else{
					if(!((bool)$value[3]) && ((bool) $value[4]) && !((bool) $value[6]) ){
					echo '<cell bgColor="#FEF5CA" style="color:grey;">Not subm.</cell>';					
					}elseif(((bool)$value[3]) && ((bool) $value[4]) && !((bool) $value[6])){
						echo '<cell bgColor="#FEF5CA" style="color:red;">Not subm.</cell>';	
					}else{
						if($value[5]>0){
							echo '<cell bgColor="#FEF5CA" style="color:red;">'.abs($value[5]).' day late</cell>';
						}else{
							echo '<cell bgColor="#FEF5CA" style="color:green;">'.abs($value[5]).' day early.</cell>';
						}
					}
				}
					echo '
			        	<row id="a_'.$value[14].'">
			        		<cell image="objective.png">'.$value[15].': '.implode(', ',$value[1]).'</cell>
			        		<cell></cell>
						    <cell bgColor="#F5F5F5">'.$value[8].'</cell>
							<cell bgColor="#F5F5F5">'.$value[9].'</cell>
							<cell bgColor="#F5F5F5">'.$value[10].'</cell>
							<cell bgColor="#FEF5CA">'.$value[11].'</cell>
							<cell xmlcontent="1" bgColor="'.$value[12].'">
								'.$value[13].'
								<option value="1">A</option>
								<option value="2">B</option>
								<option value="3">C</option>
								<option value="4">D</option>
								<option value="5">E</option>
								<option value="6">F</option>
								<option value="7">Fx</option>
							</cell>	
			        	</row>	
					';
				echo '</row>';
				if(isset($rt[$value[16]])){
					echo $rt[$value[16]][0];
					$rt[$value[16]] = null;
				}
				echo '</row>';				
			}

			foreach ($rt as $key => $value){
				if($value){
				echo '<row  id="stg_'.$key.'">
				<cell image="studygroup.png">'.$value[1].'</cell>';					
				echo $value[0];
				echo '</row>';
				}
			}
				
		}
					
	}
?>