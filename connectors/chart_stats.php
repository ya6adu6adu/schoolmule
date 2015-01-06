<?php
	class chart_stats{
		private $db = false;
		private $response = array();
        private $day = 0;
		private $grades = array('F' => 'grade2','E' => 'grade3','D' => 'grade4','C' => 'grade5','B' => 'grade6','A' => 'grade7');
		public function __construct(){
			$this->db = Connection::getDB();
			 
			$id = $_POST['id'];
			if(isset($_POST['stg'])){
				$sid = $_POST['stg'];
			}else{
				$sid = null;
			}
			
			$stdate = null;
			$actdate = null;

			$cdate = date("Y-m-d");


			if(!$sid){
				$result = $this->db->query("SELECT * FROM pupli_submission_slot, studygroups, course_rooms_assignments WHERE course_rooms_assignments.assignment_id=pupli_submission_slot.assignment_id AND course_rooms_assignments.activation_date IS NOT NULL AND  pupli_submission_slot.pupil_id=$id AND studygroups.studygroup_id = pupli_submission_slot.studygroup_id ORDER BY course_rooms_assignments.activation_date ASC");
			}else{
               $result = $this->db->query("SELECT * FROM pupli_submission_slot, studygroups,course_rooms_assignments WHERE course_rooms_assignments.assignment_id=pupli_submission_slot.assignment_id AND course_rooms_assignments.activation_date IS NOT NULL AND  pupli_submission_slot.pupil_id=$id AND pupli_submission_slot.studygroup_id={$sid} AND studygroups.studygroup_id = pupli_submission_slot.studygroup_id ORDER BY course_rooms_assignments.activation_date ASC");
			}
            $this->day++;
			while($row = mysql_fetch_assoc($result)){
				$this->getChartBarAss($row);
			}


			$result = null;
			foreach ($this->response as $key => $value) {
				foreach ($value[0] as $key2 => $value2) {
					$result[$key][0][] = $value2;
				}
				
				$result[$key][1] = $value[1];
	
			}
			echo json_encode($result);
		}
		
		private	function sort_col($table, $colname) {
			  $tn = $ts = $temp_num = $temp_str = array();
			  foreach ($table as $key => $row) {
			    if(is_numeric(substr($row[$colname], 0, 1))) {
			      $tn[$key] = $row[$colname];
			      $temp_num[$key] = $row;
			    }
			    else {
			      $ts[$key] = $row[$colname];
			      $temp_str[$key] = $row;
			    }
			  }
			  unset($table);
			
			  array_multisort($tn, SORT_ASC, SORT_NUMERIC, $temp_num); 
			  array_multisort($ts, SORT_ASC, SORT_STRING, $temp_str);
			  return array_merge($temp_num, $temp_str);
		}
		
		private function getChartBarPerf($row){
            $this->day++;
			$actdate = $row['activation_date'];
			$this->response[$row['studygroup_id']][0]['performance_'.$row['performance_id']] = array('day' =>  $this->day, 'assig' =>'1.5','day_ts' => $row['activation_date'], 'type' => "perf");
			$this->response[$row['studygroup_id']][1] = $row['title_en']; 
			if($row['assessment']=='np' || $row['assessment']=='NPass' || $row['assessment']=='na' || $row['assessment']=='0'){
				$this->response[$row['studygroup_id']][0]['performance_'.$row['performance_id']]['grade8'] = "2";
			}else{
				foreach ($this->grades as $key => $value){
					$this->response[$row['studygroup_id']][0]['performance_'.$row['performance_id']][$value]= "2";
					if($row['assessment']==$key){
						break;	
					}						
				}
			}
		}		
				
		private function getChartBarAss($row){
            $actdate = strtotime($row['activation_date']);
            $curdate = strtotime("now");

            $ttt = round(($curdate-$actdate)/60/60/24)+$this->day;

            $this->response[$row['studygroup_id']][0]['assignment_'.$row['assignment_id']] = array('day' =>  $ttt, 'assig' =>'1','day_ts' => $row['activation_date']);
            $this->response[$row['studygroup_id']][1] = $row['title_en'];
            if($row['status']!='ns' && $row['status']!='Not subm.'){
                $result = $this->db->query("SELECT course_rooms_assignments.deadline_date, course_rooms_assignments.deadline_passed, course_rooms_assignments.deadline, course_rooms_assignments.activation_date, DATEDIFF(course_rooms_assignments.deadline_date, submission_date) as dl_date FROM course_rooms_assignments,pupli_submission_slot WHERE course_rooms_assignments.assignment_id={$row['assignment_id']} AND pupli_submission_slot.assignment_id={$row['assignment_id']} ORDER BY course_rooms_assignments.activation_date ASC");
                $assignment = mysql_fetch_assoc($result);
                if(((int) $assignment['dl_date'])>0){
                    $this->response[$row['studygroup_id']][0]['assignment_'.$row['assignment_id']]['subm2'] = '1';
                }else{
                    $this->response[$row['studygroup_id']][0]['assignment_'.$row['assignment_id']]['subm1'] = '1';
                }
                $pss = $row['submission_slot_id'];

                $result2 = $this->db->query("SELECT pupil_submission_result.assessment AS assessment,pupil_submission_result.pass AS pass, result_pass FROM pupil_submission_result, resultsets WHERE pupil_submission_result.submission_slot_id=$pss AND resultsets.resultset_id=pupil_submission_result.result_set_id ORDER BY pupil_submission_result.pass DESC ,pupil_submission_result.assessment ASC LIMIT 1 ");

                while($row2 = mysql_fetch_assoc($result2)){
                    if($row2['pass']=='0'){
                        $this->response[$row['studygroup_id']][0]['assignment_'.$row['assignment_id']]['grade8'] = "2";
                    }else{
                        foreach ($this->grades as $key => $value){
                            $this->response[$row['studygroup_id']][0]['assignment_'.$row['assignment_id']][$value]= "2";
                            if($row2['assessment']==$key){
                                break;
                            }
                        }
                    }
                }
            }
        }
	}
?>