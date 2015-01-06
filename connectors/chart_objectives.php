<?php
	class chart_objectives{
		private $db = false;
		private $response = array();
        private $day = 0;
		private $grades = array('F' => 'grade2','E' => 'grade3','D' => 'grade4','C' => 'grade5','B' => 'grade6','A' => 'grade7');
		public function __construct(){
			$this->db = Connection::getDB();
            $id = $_POST['id'];
            $result = $this->db->query("
                SELECT course_objectives.objective_id AS objective_id, course_objectives.title_en AS objective, course_objectives.weight AS weight, course_objectives.quality AS quality,
                  studygroups.studygroup_id AS studygroup_id, studygroups.title_en AS studygroup
                FROM course_objectives, studygroups
                WHERE studygroups.studygroup_id = course_objectives.studygroup_id
            ");

            $resp = array();
            while($row = mysql_fetch_assoc($result)){
                $resp['stgs'][$row['studygroup_id']]['name'] = $row['studygroup'];
                $resp['stgs'][$row['studygroup_id']]['id'] = $row['studygroup_id'];
                $result2 = $this->db->query("
                    SELECT goal, prognose, grade, studygroup_grades_id
                    FROM studygroup_grades, pupil_studygroup
                    WHERE pupil_studygroup.grades_id = studygroup_grades.studygroup_grades_id
                    AND pupil_studygroup.pupil_id = $id
                    AND pupil_studygroup.studygroup_id = {$row['studygroup_id']}
                ");
                $row2 = mysql_fetch_assoc($result2);

                $result3 = $this->db->query("
                    SELECT grade_definition_id, title_en
                    FROM grade_definition
                ");

                $ht = array();
                while($row3 = mysql_fetch_assoc($result3)){
                    $ht[$row3['grade_definition_id']] = $row3['title_en'];
                }

                $resp['stgs'][$row['studygroup_id']]['goal'] = $ht[$row2['goal']];
                $resp['stgs'][$row['studygroup_id']]['prognose'] = $ht[$row2['prognose']];
                $resp['stgs'][$row['studygroup_id']]['grade'] = $ht[$row2['grade']];
                $resp['stgs'][$row['studygroup_id']]['grades_id'] = $row2['studygroup_grades_id'];

                $color = "#93c47d";
                switch($row['quality']){
                    case 'F':
                        $color = 'red';
                        break;
                    case '-':
                        $color = 'yellow';
                        break;
                    case 'A':
                        $color = 'green';
                        break;
                    default:
                        $color = '#93c47d';
                }
                $resp['stgs'][$row['studygroup_id']]['objectives'][] = array('grade'=>$row['quality'], 'weight'=>$row['weight'], 'obj'=>$row['objective'], 'color'=>$color);
            }

			echo json_encode($resp);
		}

	}
?>