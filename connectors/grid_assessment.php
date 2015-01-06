<?php
 	class grid_assessment{
		private $db = false;
		public function __construct(){
			$this->db = Connection::getDB();
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
			$result = $this->db->query("
				SELECT performance.title_en as perf_title, pupil_performance_assessment.pupil_performance_assessment_id as pid,
				 courses.title_en as course_title, course_objectives.title_en as obj_title,pupil_performance_assessment.assessment as ass,
				 pupil_performance_assessment.passed as passed
				FROM pupil_performance_assessment, performance, studygroups,courses,resultsets,course_objectives,resultset_to_course_objectives
				WHERE pupil_performance_assessment.performance_id = performance.performance_id
				AND studygroups.studygroup_id = performance.studygroup_id
				AND studygroups.course_id = courses.course_id
				AND performance.resultset_id = resultsets.resultset_id
				AND resultset_to_course_objectives.resultset_id = resultsets.resultset_id
				AND course_objectives.objective_id = resultset_to_course_objectives.objective_id
				AND pupil_id=$id
			");
			echo '<rows>';
			$rerfs = $this->getPerformanceArray($result);
			$this->outPerformanceArray($rerfs);
				
			echo '</rows>';			
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
				}
				
				$rows['performance_'.$row['pid']][4][] = $row['obj_title'];
			}
			return $rows;
		}
		
		private function outPerformanceArray($rerfs){
			foreach ($rerfs as $key => $value){
				echo '<row id="performance_'.$value[0].'">
						<cell>'.$value[1].'</cell>
						<row id="'.$value[0].'">
							<cell>'.$value[2].':'.implode(', ',$value[4]).'</cell>						
							<cell xmlcontent="1" bgColor="'.($value[5]?"#8f8":"#f88").'">
								'.dlang($value[3]).'
								<option value="A">'.dlang("A").'</option>
								<option value="B">'.dlang("B").'</option>
								<option value="C">'.dlang("C").'</option>
								<option value="D">'.dlang("D").'</option>
								<option value="E">'.dlang("E").'</option>
								<option value="F">'.dlang("F").'</option>
								<option value="Fx">'.dlang("Fx").'</option>
							</cell>	
						</row>
					</row>';		
			}	
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
					
	}
?>