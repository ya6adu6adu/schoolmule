

<?php
class grid_development{
    private $db = false;
    private $user;
    private $response = array();
    private $issets = array();
    private $day = 0;
    private $maxday = 0;
    private $line_value = 0;

    private $grades = array('F' => 'grade2','E' => 'grade3','D' => 'grade4','C' => 'grade5','B' => 'grade6','A' => 'grade7');
    public function __construct(){
        $this->db = Connection::getDB();
        $this->user = new administrator();

        error_reporting(E_ALL ^ E_NOTICE);
        switch ($_POST['action']) {
            case 'deactivate':
                $this->deactivateStg($_POST['stg'],$_POST['pupil']);
                break;
            case 'activate':
                $this->activateStg($_POST['stg'],$_POST['pupil']);
                break;
            case 'saveinfo':
                $this->saveInfo($_POST['stg'],$_POST['pupil'],$_POST['eval'],$_POST['goal'],$_POST['plan']);
                break;
            case 'saveplan':
                $this->savePlanInfo($_POST['stg'],$_POST['pupil'],$_POST['support'],$_POST['long_golas'],$_POST['short_goals'],$_POST['account'],$_POST['arrang'],$_POST['evaluate'],$_POST['other'],$_POST['report']);
                break;
            case 'editgoal':
                $this->editGoal($_POST['stg'],$_POST['pupil'],$_POST['val']);
                break;
            case 'editprognose':
                $this->editPrognose($_POST['stg'],$_POST['pupil'],$_POST['val']);
                break;
            case 'editgrade':
                $this->editGrade($_POST['stg'],$_POST['pupil'],$_POST['val']);
                break;
            default:
                $this->getAssignmentsAssessGrid();
                break;
        }
    }

    private function editGoal($stg,$pupil,$val){
        echo "UPDATE pupil_studygroup, studygroup_grades SET studygroup_grades.goal='$val' WHERE pupil_studygroup.studygroup_id=$stg  AND pupil_studygroup.pupil_id=$pupil";
        $this->db->query("UPDATE pupil_studygroup, studygroup_grades SET studygroup_grades.goal=$val WHERE pupil_studygroup.studygroup_id=$stg  AND pupil_studygroup.pupil_id=$pupil");
        echo 1;
    }
    private function editPrognose($stg,$pupil,$val){
        $this->db->query("UPDATE pupil_studygroup, studygroup_grades SET studygroup_grades.prognose='$val' WHERE pupil_studygroup.studygroup_id=$stg  AND pupil_studygroup.pupil_id=$pupil");
        echo 1;
    }
    private function editGrade($stg,$pupil,$val){
        $this->db->query("UPDATE pupil_studygroup, studygroup_grades SET studygroup_grades.grade='$val' WHERE pupil_studygroup.studygroup_id=$stg  AND pupil_studygroup.pupil_id=$pupil");
        echo 1;
    }

    private function saveInfo($id,$pid,$eval,$goal,$plan){
        $this->db->query("UPDATE pupil_studygroup SET evaluation='{$eval}',development_gola='{$goal}',plan='{$plan}' WHERE pupil_id=$pid AND studygroup_id=$id");
        echo 1;
    }

    private function savePlanInfo($id,$pid,$support,$long_golas,$short_goals,$account,$arrang,$evaluate,$other,$report){
        $this->db->query("UPDATE pupil_studygroup SET
         support='{$support}',long_goals='{$long_golas}',short_golas='{$short_goals}',
         account='{$account}',arrang='{$arrang}',evaluate='{$evaluate}',
         other='{$other}',report='{$report}'
         WHERE pupil_id=$pid AND studygroup_id=$id");
        echo 1;
    }

    private function activateStg($id,$pid){
        $this->db->query("UPDATE pupil_studygroup SET active=1 WHERE pupil_id=$pid AND studygroup_id=$id");
        //$this->db->query("UPDATE pupli_submission_slot SET active=1 WHERE pupil_id=$pid AND studygroup_id=$id");
        echo 1;
    }

    private function deactivateStg($id,$pid){
        $this->db->query("UPDATE pupil_studygroup SET active=0 WHERE pupil_id=$pid AND studygroup_id=$id");
        //$this->db->query("UPDATE pupli_submission_slot SET active=0 WHERE pupil_id=$pid AND studygroup_id=$id");
        echo 1;
    }


    private function getAssignmentsAssessGrid(){
        header("Content-type:text/xml");
        print('<?xml version="1.0" encoding="UTF-8"?>');

        $id = $_GET['id'];
        $and = "";
        $addtbl = "";

        $result = $this->db->query("
        SELECT
				  course_objectives.objective_id AS objective_id,
				  course_objectives.quality AS quality,
				  staff_members.staff_member_id AS staff_member_id,
				  academic_years.academic_year_id AS year_id,
				  academic_years.title_en AS academic_year,
				  subjects.subject_id AS subject_id,
				  subjects.title_en AS subject,
				  studygroups.studygroup_id AS studygroup_id,
				  studygroups.title_en AS studygroup,
				  concat( staff_members.fore_name,' ', staff_members.last_name) AS teacher,
				  studygroup_grades.goal AS goal,
				  studygroup_grades.prognose AS prognose,
				  studygroup_grades.grade AS grade,
                  pupil_submission_result.assessment AS assessment,
                  pupli_submission_slot.submission_slot_id  AS slot_id,
                  resultsets.resultset_id  AS resultset_id,
                  course_objectives.title_en AS objective,
                  pupil_studygroup.evaluation AS evaluation,
                  pupil_studygroup.development_gola AS development_gola,
                  pupil_studygroup.plan AS plan,
                  pupil_studygroup.active AS active,

                  pupil_studygroup.support AS support,
                  pupil_studygroup.long_goals AS long_goals,
                  pupil_studygroup.short_golas AS short_golas,

                  pupil_studygroup.other AS other,
                  pupil_studygroup.account AS account,
                  pupil_studygroup.arrang AS arrang,

                  pupil_studygroup.evaluate AS evaluate,
                  pupil_studygroup.report AS report,

                  resultsets.assignment_id AS assignment_id

				FROM academic_years

				LEFT JOIN subjects ON academic_years.academic_year_id = subjects.academic_year_id
				LEFT JOIN studygroups ON subjects.subject_id = studygroups.subject_id
				LEFT JOIN pupil_studygroup ON pupil_studygroup.pupil_id = {$id} AND  studygroups.studygroup_id = pupil_studygroup.studygroup_id
				LEFT JOIN studygroup_grades ON studygroup_grades.studygroup_grades_id = pupil_studygroup.grades_id
				LEFT JOIN pupli_submission_slot ON pupli_submission_slot.pupil_id = {$id} AND pupli_submission_slot.studygroup_id = pupil_studygroup.studygroup_id
				LEFT JOIN resultsets ON resultsets.assignment_id = pupli_submission_slot.assignment_id
        INNER JOIN pupil_submission_result ON pupil_submission_result.result_set_id = resultsets.resultset_id AND pupil_submission_result.submission_slot_id = pupli_submission_slot.submission_slot_id
				LEFT JOIN resultset_to_course_objectives ON resultsets.resultset_id = resultset_to_course_objectives.resultset_id
				LEFT JOIN course_objectives ON course_objectives.studygroup_id = studygroups.studygroup_id
				LEFT JOIN studygroup_staff ON studygroup_staff.studygroup_id = studygroups.studygroup_id
				LEFT JOIN staff_members ON studygroup_staff.staff_member_id = staff_members.staff_member_id
			");

        $rows = $this->getResultArray($result);

        echo '<rows>';
        $this->outArray($rows,$id);
        echo '</rows>';
    }

    private function getResultArray($result){
        $rows = array();
        while($row = mysql_fetch_assoc($result)){
            $rows[$row['year_id']]['year'] = $row['academic_year'];
            $rows[$row['year_id']]['year_id'] = $row['year_id'];
            $rows[$row['year_id']]['subjects'][$row['subject_id']]['subject_id'] = $row['subject_id'];
            $rows[$row['year_id']]['subjects'][$row['subject_id']]['subject'] = $row['subject'];
            $rows[$row['year_id']]['subjects'][$row['subject_id']]['studygroups'][$row['studygroup_id']]['studygroup_id'] = $row['studygroup_id'];
            $rows[$row['year_id']]['subjects'][$row['subject_id']]['studygroups'][$row['studygroup_id']]['studygroup'] = $row['studygroup'];
            $rows[$row['year_id']]['subjects'][$row['subject_id']]['studygroups'][$row['studygroup_id']]['teachers'][$row['staff_member_id']] = $row['teacher'];
            $rows[$row['year_id']]['subjects'][$row['subject_id']]['studygroups'][$row['studygroup_id']]['goal'] = $row['goal'];
            $rows[$row['year_id']]['subjects'][$row['subject_id']]['studygroups'][$row['studygroup_id']]['prognose'] = $row['prognose'];
            $rows[$row['year_id']]['subjects'][$row['subject_id']]['studygroups'][$row['studygroup_id']]['grade'] = $row['grade'];
            $rows[$row['year_id']]['subjects'][$row['subject_id']]['studygroups'][$row['studygroup_id']]['active'] = $row['active'];
            $rows[$row['year_id']]['subjects'][$row['subject_id']]['studygroups'][$row['studygroup_id']]['development_gola'] = $row['development_gola'];
            $rows[$row['year_id']]['subjects'][$row['subject_id']]['studygroups'][$row['studygroup_id']]['evaluation'] = $row['evaluation'];
            $rows[$row['year_id']]['subjects'][$row['subject_id']]['studygroups'][$row['studygroup_id']]['plan'] = $row['plan'];

            $rows[$row['year_id']]['subjects'][$row['subject_id']]['studygroups'][$row['studygroup_id']]['long_goals'] = $row['long_goals'];
            $rows[$row['year_id']]['subjects'][$row['subject_id']]['studygroups'][$row['studygroup_id']]['support'] = $row['support'];
            $rows[$row['year_id']]['subjects'][$row['subject_id']]['studygroups'][$row['studygroup_id']]['short_golas'] = $row['short_golas'];
            $rows[$row['year_id']]['subjects'][$row['subject_id']]['studygroups'][$row['studygroup_id']]['other'] = $row['other'];
            $rows[$row['year_id']]['subjects'][$row['subject_id']]['studygroups'][$row['studygroup_id']]['account'] = $row['account'];
            $rows[$row['year_id']]['subjects'][$row['subject_id']]['studygroups'][$row['studygroup_id']]['arrang'] = $row['arrang'];
            $rows[$row['year_id']]['subjects'][$row['subject_id']]['studygroups'][$row['studygroup_id']]['evaluate'] = $row['evaluate'];
            $rows[$row['year_id']]['subjects'][$row['subject_id']]['studygroups'][$row['studygroup_id']]['report'] = $row['report'];

            $rows[$row['year_id']]['subjects'][$row['subject_id']]['studygroups'][$row['studygroup_id']]['objectives'][$row['objective_id']] = $row['quality'];
            $assess = $rows[$row['year_id']]['subjects'][$row['subject_id']]['studygroups'][$row['studygroup_id']]['assignments'][$row['assignment_id']];
            $rows[$row['year_id']]['subjects'][$row['subject_id']]['studygroups'][$row['studygroup_id']]['assignments'][$row['assignment_id']] = ($row['assessment']>$assess?$row['assessment']:$assess);
        }
        return $rows;
    }

    private function outArray($rows,$id){
        $xml = "";
        foreach($rows as $year){
            $xml .= "<row id='academicyear_{$year['year_id']}'  >";
                $xml .= "<cell image='folder_closed.png'>{$year['year']}</cell>";
                foreach($year['subjects'] as $subject){
                    $xml .= "<row id='subject_{$subject['subject_id']}' >";
                    $xml .= "<cell image='folder_closed.png'>{$subject['subject']}</cell>";
                        foreach($subject['studygroups'] as $sudygroup){
                            $teachers = implode(', ',$sudygroup['teachers']);
                            $objectives = implode('/',$sudygroup['objectives']);
                            $na = 0;
                            $nac = count($sudygroup['assignments']);

                            foreach($sudygroup['assignments'] as $assessment){
                                if($assessment!='' && $assessment!='na' && $assessment!='Fx'){
                                    $na++;
                                }
                            }
                            $result3 = $this->db->query("
                                  SELECT grade_definition_id, title_en
                                  FROM grade_definition
                             ");

                            $ht = array();
                            while($row3 = mysql_fetch_assoc($result3)){
                                $ht[$row3['grade_definition_id']] = $row3['title_en'];
                            }
                            $options = '<option value="0">'."".'</option>
                                        <option value="1">'."A".'</option>
                                        <option value="2">'."B".'</option>
                                        <option value="3">'."C".'</option>
                                        <option value="4">'."D".'</option>
                                        <option value="5">'."E".'</option>
                                        <option value="6">'."F".'</option>
                                        <option value="7">'."Fx".'</option>';
                            $active = $sudygroup['active']=='0'?'gfx/flagred.png':'gfx/flag.png';
                            $xml .= "<row id='studygroup_{$sudygroup['studygroup_id']}_{$id}' >";
                            $xml .= "<cell image='studygroup.png'>{$sudygroup['studygroup']}</cell>";
                            $xml .= "<cell >{$teachers}</cell>";
                            $xml .= "<cell xmlcontent='1' bgColor='#FEF5CA'>".$sudygroup['goal'].$options."</cell>";
                            $xml .= "<cell >{$na}/{$nac}</cell>";
                            $xml .= "<cell >{$objectives}</cell>";
                            $xml .= "<cell  xmlcontent='1' bgColor='#FEF5CA'>".$sudygroup['prognose'].$options."</cell>";
                            $xml .= "<cell  xmlcontent='1' bgColor='#FEF5CA'>".$sudygroup['grade'].$options."</cell>";
                            $xml .= "<cell >{$active}</cell>";

                            $ips = array("eval" => $sudygroup['evaluation'],"devel" => $sudygroup['development_gola'],"plan" => $sudygroup['plan']);

                            $plan = array(
                                "support" => $sudygroup['support'],
                                "long_goals" => $sudygroup['long_goals'],
                                "short_golas" => $sudygroup['short_golas'],
                                "other" => $sudygroup['other'],
                                "account" => $sudygroup['account'],
                                "arrang" => $sudygroup['arrang'],
                                "evaluate" => $sudygroup['evaluate'],
                                "report" => $sudygroup['report'],
                            );

                            $xml .= "<row  id='statistics_{$id}_{$sudygroup['studygroup_id']}'>";
                                $xml .= "<cell image='statistics.png' colspan='8'>".dlang("grid_develop_stats","Statistics")."</cell>";
                                $xml .= "<row id='charts_{$id}_{$sudygroup['studygroup_id']}'>";
                                    $xml .= "<cell colspan='8'>".$this->getChartsJson($id,$sudygroup['studygroup_id'])."</cell>";
                                $xml .= "</row>";
                            $xml .= "</row>";

                            $xml .= "<row  id='iup_{$id}_{$sudygroup['studygroup_id']}'>";
                                $xml .= "<cell image='iup.png' colspan='8'>".dlang("grid_develop_iup","IUP")."</cell>";
                                $xml .= "<row id='iupinput_{$id}_{$sudygroup['studygroup_id']}'>";
                                    $xml .= "<cell colspan='8'>".json_encode($ips)."</cell>";
                                $xml .= "</row>";
                            $xml .= "</row>";

                            $xml .= "<row  id='plan_{$id}_{$sudygroup['studygroup_id']}'>";
                                $xml .= "<cell image='action_plan.png' colspan='8'>".dlang("grid_develop_plan","Action plan")."</cell>";
                                $xml .= "<row id='planinput_{$id}_{$sudygroup['studygroup_id']}'>";
                                    $xml .= "<cell colspan='8'>".json_encode($plan)."</cell>";
                                $xml .= "</row>";
                            $xml .= "</row>";

                            $xml .= "</row>";
                        }
                    $xml .= "</row>";
                }
            $xml .= "</row>";
        }
        echo $xml;
    }

    private function getChartsJson($id,$stg){
        $objc = $this->getObjectiveChart($id,$stg);
        $obja = $this->getAssignmentChart($id,$stg);
        return json_encode(array('ochart'=>$objc, 'obja'=>$obja));
    }

    private function getObjectiveChart($id,$stg){
        $result = $this->db->query("
                SELECT course_objectives.objective_id AS objective_id, course_objectives.title_en AS objective, course_objectives.weight AS weight, course_objectives.quality AS quality,
                  studygroups.studygroup_id AS studygroup_id, studygroups.title_en AS studygroup
                FROM course_objectives, studygroups
                WHERE studygroups.studygroup_id = course_objectives.studygroup_id AND studygroups.studygroup_id=$stg
            ");

        $resp = array();
        while($row = mysql_fetch_assoc($result)){
            $resp['stgs'][$row['studygroup_id']]['name'] = $row['studygroup'];
            $resp['stgs'][$row['studygroup_id']]['id'] = $row['studygroup_id'];
            switch($row['quality']){
                case 'F':
                    $color = '#F08080';
                    break;
                case '-':
                    $color = '#FAFAD2';
                    break;
                case 'A':
                    $color = '#005300';
                    break;
                default:
                    $color = '#33CC33';
            }
            $resp['stgs'][$row['studygroup_id']]['objectives'][] = array('grade'=>$row['quality'], 'weight'=>$row['weight'], 'obj'=>$row['objective'], 'color'=>$color);
        }
        return  $resp['stgs'][$stg];
    }

    private function getAssignmentChart($id,$sid){
        $stdate = null;
        $actdate = null;
        $stg = null;
        $cdate = date("Y-m-d");

        $result = $this->db->query("SELECT *, performance.title_en as performance FROM pupil_performance_assessment, studygroups, performance WHERE pupil_performance_assessment.pupil_id=$id AND pupil_performance_assessment.studygroup_id={$sid} AND performance.performance_id=pupil_performance_assessment.performance_id AND studygroups.studygroup_id = pupil_performance_assessment.studygroup_id ");

        while($row = mysql_fetch_assoc($result)){
            $stg = $row['studygroup_id'];
            $this->getChartBarPerf($row);
        }

        $result = $this->db->query("SELECT * FROM pupli_submission_slot, studygroups,course_rooms_assignments
        WHERE course_rooms_assignments.assignment_id=pupli_submission_slot.assignment_id AND (course_rooms_assignments.activation_date IS NOT NULL) AND  pupli_submission_slot.pupil_id={$id}
        AND pupli_submission_slot.studygroup_id={$sid} AND studygroups.studygroup_id = pupli_submission_slot.studygroup_id ORDER BY course_rooms_assignments.activation_date ASC");


        $lineday = ++$this->day;

        $this->line_value = $lineday;

        $this->response[$stg][0]['line']['vert_bar']= "14";
        $this->response[$stg][0]['line']['type']= "line";
        $this->response[$stg][0]['line']['day']= $lineday;

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

        $result[$sid]['maxday'] =  $this->maxday;
        return $result[$sid];
    }

    private function getChartBarPerf($row){
        $this->day++;
        $actdate = $row['activation_date'];
        $this->response[$row['studygroup_id']][0]['performance_'.$row['performance_id']] = array('day' =>  $this->day, 'assig' =>'1.5','day_ts' => $row['performance'], 'type' => "perf",'pupup'=>$row['title_en']);
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
        $startdate = strtotime($row['startdate']);
        $enddate = strtotime($row['enddate']);

        $actdate = strtotime($row['activation_date']);

        $span =  round(($enddate-$startdate)/60/60/24);
        $activation_date = round(($actdate-$startdate)/60/60/24)+$this->line_value;

        $this->maxday = $span;

        if($actdate == 0){
            $this->day++;
            $activation_date = $this->day;
        }

        if(!$startdate || !$enddate){
            $this->maxday = 30;
            $this->day++;
            $activation_date = $this->day;
        }

        $norm = $this->maxday/40;
        $this->maxday = 40;
        $final_value =  round($activation_date/$norm);
        if($this->issets[$final_value]){
            $final_value++;
        }
        $this->response[$row['studygroup_id']][0]['assignment_'.$row['assignment_id']] = array('day' => $final_value, 'assig' =>'1','day_ts' => $row['title_en'], 'pupup'=>$row['title_en']);
        $this->response[$row['studygroup_id']][1] = $row['title_en'];
        $this->issets[$final_value] = 1;

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