<?php
include_once '../libs/Connection.php';
include_once '../libs/tree_editor.php';

class tree_programme_structure extends tree_editor{

    public function __construct(){

        parent::__construct();

        if(!isset($_POST['action'])){
            if(!isset($_POST['getstaff'])){
                header("content-type:text/xml;charset=UTF-8");
                if(isset($_GET['refresh'])){
                    $refresh = $_GET['refresh'];
                }else{
                    $refresh = false;
                }
                echo ($this->getXml($_GET['id'],$_GET['autoload'],$refresh));
            }
            return true;
        }else{
            $this->db->query("START TRANSACTION");
            $response = $this->parseRequest();
            $this->db->query("COMMIT");
            echo json_encode($response);
            return true;
        }
    }

    public function getXmlTree($id=0,$rf,$autoload = true){
        $xml = '<?xml version="1.0"?><tree id="'.$id.'">';
        $xml .= $this->getXmlMyCourseRoomsAuto($id,$rf,$autoload);
        $xml .= '</tree>';
        return $xml;
    }

    /********* Top level *****************/
    protected function getXmlMyCourseRoomsAuto($id,$rf,$autoload){
        $xml = '<item child="1" text="'.dlang("tree_pr_str_acc_years","Academic Years").'" id="academicyears" im0="folder_open.png" im1="folder_open.png" im2="folder_closed.png">';
        $xml .= $this->getAcademicYears();
        $xml .= '</item>';
        return $xml;
    }

    protected function getStaff($id){
        $xml = "";
        $result = $this->db->query("SELECT staff_members.staff_member_id AS staff_member_id, staff_members.fore_name AS fore_name, staff_members.last_name AS last_name
        FROM staff_members, studygroup_staff
        WHERE studygroup_staff.studygroup_id = $id AND studygroup_staff.staff_member_id = staff_members.staff_member_id");

        while($row = mysql_fetch_assoc($result)){
            $xml.=$this->getStaffXml($row['staff_member_id'],$row['fore_name'],$row['last_name'],$id);
        }
        return $xml;
    }

    protected function getStaffXml($id,$name,$lname,$stg){
        $xml = "";
        $xml .= '<item child="1" tooltip="'.dlang("staff_member_tooltip","Staff").'" id="staffmember'.'_'.$id.'_'.$stg.'" text="'.$name.' '.$lname.'" im0="staff.png" im1="staff.png" im2="staff.png">';
        $xml .= '</item>';
        return $xml;
    }


    protected function getAcademicYears(){
        $xml = "";
        $entity = $this->user->entity;
        $result = $this->db->query("SELECT academic_year_id,title_en FROM academic_years  WHERE entity_id = $entity");

        while($row = mysql_fetch_assoc($result)){
            $xml.=$this->getAcademicYearsXml($row['academic_year_id'],$row['title_en']);
        }
        return $xml;
    }

    protected function getAcademicYearsXml($id,$name){
        $xml = "";
        $xml .= '<item child="1" id="academicyear'.'_'.$id.'" text="'.$name.'" im1="folder_open.png" im2="folder_closed.png" im0="folder_open.png">';
        $xml .= $this->getSubjects($id);
        $xml .= '</item>';
        return $xml;
    }

    protected function getSubjects($id){
        $xml = "";
        $result = $this->db->query("SELECT subject_id,title_en FROM subjects WHERE academic_year_id=$id");

        while($row = mysql_fetch_assoc($result)){
            $xml.=$this->getSubjectsXml($row['subject_id'],$row['title_en']);
        }
        return $xml;
    }

    protected function getSubjectsXml($id,$name){
        $xml = "";
        $xml .= '<item child="1" id="subject'.'_'.$id.'" text="'.$name.'" im1="subject_opened.png" im2="subject_closed.png" im0="subject_opened.png">';
        $xml .= $this->getStudyGroup($id);
        $xml .= '</item>';
        return $xml;
    }

    protected function getProgrammes(){
        $xml = "";
        $result = $this->db->query("SELECT programme_id,title_en FROM programmes");

        while($row = mysql_fetch_assoc($result)){
            $xml.=$this->getProgrammesXml($row['programme_id'],$row['title_en']);
        }
        return $xml;
    }

    protected function getProgrammesXml($id,$name){
        $xml = "";
        $xml .= '<item child="1" id="programme'.'_'.$id.'" text="'.$name.'" im0="programme.png" im1="programme.png" im2="programme.png">';
        $xml .= $this->getYears($id);
        $xml .= '</item>';
        return $xml;
    }

    protected function getYears($id){
        $xml = "";
        $result = $this->db->query("SELECT year_id,title_en FROM years WHERE programme_id=$id");
        while($row = mysql_fetch_assoc($result)){
            $xml.=$this->getYearsXml($row['year_id'],$row['title_en']);
        }
        return $xml;
    }

    protected function getYearsXml($id,$name){
        $xml = "";
        $xml .= '<item child="1" id="years'.'_'.$id.'" text="'.$name.'" im1="folder_open.png" im2="folder_closed.png" im0="folder_open.png">';
        $xml .= $this->getStudyGroup($id);
        $xml .= '</item>';
        return $xml;
    }

    public function getStudyGroup($id){
        $xml = "";
        $result = $this->db->query("SELECT studygroups.studygroup_id as studygroup_id, studygroups.title_en as title_en
         FROM studygroups WHERE studygroups.subject_id=$id ");

        while($row = mysql_fetch_assoc($result)){
            $xml.=$this->getStudyGroupXml($row['studygroup_id'],$row['title_en']);
        }
        return $xml;
    }

    public function getStudyGroupByRoom($id){
        $xml = "";
        $result = $this->db->query("SELECT studygroups.studygroup_id as studygroup_id, studygroups.title_en as title_en
         FROM studygroups,course_room_members WHERE course_room_members.member_id=$id AND course_room_members.course_room_id = studygroups.course_room_id");

        while($row = mysql_fetch_assoc($result)){
            $xml.=$this->getStudyGroupXml($row['studygroup_id'],$row['title_en']);
        }
        return $xml;
    }

    public function getStudyGroupXml($id,$title){
        $xml = "";
        $xml .= '<item child="1" id="studygroup'.'_'.$id.'" text="'.$title.'" im0="studygroup.png" im1="studygroup.png" im2="studygroup.png">';

        //$xml .= '<item child="1" id="teachers_'.$id.'" text="'.dlang("tree_pr_str_acc_teachers","Teachers").'" im1="folder_open.png" im2="folder_closed.png" im0="folder_open.png">';
        $xml .= $this->getStaff($id);
        //$xml .= '</item>';

        //$xml .= '<item child="1" id="pupils_'.$id.'" text="'.dlang("tree_pr_str_acc_pgs","Pupilgroups").'" im1="folder_open.png" im0="folder_open.png" im2="folder_closed.png">';
        $xml .= $this->getPupilGroup($id);
        //$xml .= '</item>';

        $xml .= '</item>';
        return $xml;
    }

    public function getPupilGroup($id){
        $xml = "";
        $result = $this->db->query("
              SELECT pupilgroups.pupilgroup_id AS pid, pupilgroups.title_en AS ptitle FROM pupilgroups, studygroup_pupilgroup WHERE studygroup_pupilgroup.pupilgroup_id = pupilgroups.pupilgroup_id
              AND studygroup_pupilgroup.studygroup_id = $id
            ");
        while($row = mysql_fetch_assoc($result)){
            $xml.=$this->getPupilGroupXml($row['pid'],$row['ptitle'],$id);
        }
        return $xml;
    }


    protected function getPupilGroupXml($id,$title,$stg){
        $xml = "";
        $xml .= '<item child="1" tooltip="'.dlang("pupilgroup_tooltip","Pupilgroup").'" id="pupilgroup'.'_'.$id.'_'.$stg.'" text="'.$title.'" im0="pupilgroup.png" im1="pupilgroup.png" im2="pupilgroup.png">';
        $xml .= $this->getPupils($id,$stg);
        $xml .= '</item>';
        return $xml;
    }

    protected function getPupils($id,$stg){
        $xml = "";
        $result = $this->db->query("SELECT pupil.pupil_id, forename, lastname FROM pupil,pupil_pupilgroup WHERE pupil.pupil_id = pupil_pupilgroup.pupil_id AND pupil_pupilgroup.pupilgroup_id=$id");

        while($row = mysql_fetch_assoc($result)){
            $xml.=$this->getPupilXml($row['pupil_id'],$row['forename'],$row['lastname'],$id,$stg);
        }
        return $xml;
    }

    protected function getPupilXml($id,$name,$lname,$pg,$stg){
        $xml = "";
        $xml .= '<item child="1" tooltip="'.dlang("pupil_tooltip","Pupil").'" id="pupil'.'_'.$id.'_'.$pg.'_'.$stg.'" text="'.$name.' '.$lname.'" im0="pupil.png" im1="pupil.png" im2="pupil.png">';
        $xml .= '</item>';
        return $xml;
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

    protected function editStaffName($name, $id){
        $user = explode(' ', $name ,2);
        $user[0] = $user[0]?trim($user[0]):"";
        $user[1] = $user[1]?trim($user[1]):"";
        $this->db->query("UPDATE staff_members SET fore_name = '{$user[0]}', last_name = '{$user[1]}' WHERE staff_member_id=$id");
        return array('edit' => 1);
    }

    protected function editPupilName($name, $id){
        $user = explode(' ', $name ,2);
        $user[0] = $user[0]?trim($user[0]):"";
        $user[1] = $user[1]?trim($user[1]):"";
        $this->db->query("UPDATE pupil SET forename = '{$user[0]}', lastname = '{$user[1]}' WHERE pupil_id=$id");
        return array('edit' => 1);
    }

    protected function editParentName($name, $id){
        $user = explode(' ', $name, 2);
        $user[0] = $user[0]?trim($user[0]):"";
        $user[1] = $user[1]?trim($user[1]):"";
        $this->db->query("UPDATE parents SET fore_name = '{$user[0]}', last_name = '{$user[1]}' WHERE parent_id=$id");
        return array('edit' => 1);
    }

    protected function editProgrammeName($name, $id){
        $res = $this->db->query("SELECT title_en FROM programmes WHERE programme_id=$id");
        if(mysql_num_rows($res)!=0){
            return array('edit' => 0);
        }
        $this->db->query("UPDATE programmes SET title_en = '$name' WHERE programme_id=$id");
        return array('edit' => 1);
    }

    protected function editAcademicYearName($name, $id){
        $this->db->query("UPDATE academic_years SET title_en = '$name' WHERE academic_year_id=$id");
        return array('edit' => 1);
    }

    protected function editSubjectName($name, $id){
        $this->db->query("UPDATE subjects SET title_en = '$name' WHERE subject_id=$id");
        return array('edit' => 1);
    }

    protected function editStudygroupName($name, $id){
        $result = $this->db->query("SELECT course_room_id, title_en FROM studygroups WHERE studygroup_id=$id");
        $group = mysql_fetch_assoc($result);

        $this->db->query("UPDATE studygroups SET title_en = '$name' WHERE studygroup_id=$id");

        if($group['title_en']=='new studygroup'){
            $this->db->query("UPDATE course_rooms SET title_en = '$name' WHERE course_room_id={$group['course_room_id']}");
        }

        return array('edit' => 1);
    }

    protected function editPupilgroupName($name, $id){
        $this->db->query("UPDATE pupilgroups SET title_en = '$name' WHERE pupilgroup_id=$id");
        return array('edit' => 1);
    }

    protected function newItem($type){
        $col = (int) $_POST['col'];
        $added = array();
        switch ($type) {
            case 'academicyear':
                for($i=0; $i<$col; $i++){
                    $added[] = $this->addAcademicYear($_POST['name']);
                }
                break;
            case 'subject':
                for($i=0; $i<$col; $i++){
                    $added[] = $this->addSubject($_POST['academicyear'],$_POST['name']);
                }
                break;
            case 'pupil':
                for($i=0; $i<$col; $i++){
                    $added[] = $this->addPupil($_POST['pupilgroup'],$i,$_POST['num'],$_POST['stg']);
                }
                break;
            case 'pupilgroup':
                for($i=0; $i<$col; $i++){
                    $added[] = $this->addPupilgroup($_POST['name'], $_POST['year']);
                }
                break;
            case 'parent':
                for($i=0; $i<$col; $i++){
                    $added[] = $this->addParent($_POST['pupil'],$i);
                }
                break;
            case 'staff':
                for($i=0; $i<$col; $i++){
                    $added[] = $this->addStaff($i);
                }
                break;
            case 'studygroup':
                for($i=0; $i<$col; $i++){
                    $added[] = $this->addStudygroup($_POST['name'], $_POST['subject']);
                }
                break;
            case 'year':
                for($i=0; $i<$col; $i++){
                    $added[] = $this->addYear($_POST['programme'],$_POST['name']);
                }
                break;
            case 'programme':
                for($i=0; $i<$col; $i++){
                    $added[] = $this->addProgramme($_POST['name']);
                }

                break;
            default:
                break;
        }
        return implode(',',$added);
    }

    protected function deleteItem($type){
        $ids = explode(',',$_POST['id']);
        for($i=0; $i<count($ids); $i++){
            $sid = explode('_',$ids[$i]);
            switch ($type) {
                case 'subject':
                    $response = $this->deleteSubject($sid[1]);
                    break;
                case 'academicyear':
                    $response = $this->deleteAcademicYear($sid[1]);
                    break;
                case 'studygroup':
                    $response = $this->deleteStudygroup($sid[1]);
                    break;
                case 'checked':
                    $response = $this->deleteChecked($_POST['checked']);
                    break;
                default:
                    break;
            }
        }
        return $response;
    }

    protected function deleteChecked($checked){
        $che = explode(',' , $checked);

        for($i=0; $i<count($che); $i++){
            $item = explode('_',$che[$i]);
            switch($item[0]){
                case 'studygroup':
                    $response = $this->deleteStudygroup($item[1]);
                    break;
                default:
                    break;
            }
        }
        return $response;
    }

    protected function deleteSubject($id){

            $res = $this->db->query("
            SELECT course_room_id,studygroup_id FROM studygroups WHERE subject_id=$id
		    ");

            while($st = mysql_fetch_assoc($res)){
                $this->db->query("
               DELETE FROM subjects WHERE subject_id=$id;
		      ");
                $room = $st['course_room_id'];
                $stg = $st['studygroup_id'];
                $this->db->query("DELETE FROM studygroups WHERE studygroup_id=$id");
                $this->db->query("DELETE FROM pupil_studygroup WHERE studygroup_id=$id");
                $this->db->query("DELETE FROM pupil_submission_result WHERE studygroup_id=$id");
                $this->db->query("DELETE FROM pupli_submission_slot WHERE studygroup_id=$id");
                $this->db->query("DELETE FROM resultsets_studygroups WHERE studygroup_id=$id");
                $this->db->query("DELETE FROM studygroup_grades WHERE studygroup_id=$id");
                $this->db->query("DELETE FROM studygroup_pupilgroup WHERE studygroup_id=$id");
                $this->db->query("DELETE FROM studygroup_staff WHERE studygroup_id=$id");
                $this->db->query("DELETE FROM course_rooms_assignments WHERE course_room_id=$room");
                $this->db->query("DELETE FROM course_rooms_elements WHERE course_room_id=$room");
                $this->db->query("DELETE FROM course_room_folders WHERE course_room_id=$room");
                $this->db->query("DELETE FROM course_room_members WHERE course_room_id=$room");
            }

/*        $this->db->query("
            DELETE subjects,pupil_studygroup, studygroup_pupilgroup, studygroup_staff, studygroups, resultsets,
             resultsets_studygroups, resultset_to_course_objectives,pupli_submission_slot,
             pupil_performance_assessment, pupil_submission_result,course_rooms_assignments,
             performance,studygroup_grades,course_objective_groups,course_objectives,files_comments,files
            FROM subjects
            LEFT JOIN studygroups ON studygroups.subject_id = subjects.subject_id
            LEFT JOIN pupil_studygroup ON studygroups.studygroup_id = pupil_studygroup.studygroup_id
            LEFT JOIN studygroup_pupilgroup ON studygroups.studygroup_id = studygroup_pupilgroup.studygroup_id
            LEFT JOIN studygroup_staff ON studygroups.studygroup_id = studygroup_staff.studygroup_id
            LEFT JOIN studygroup_grades ON studygroups.studygroup_id = studygroup_grades.studygroup_id
            LEFT JOIN resultsets_studygroups ON studygroups.studygroup_id = resultsets_studygroups.studygroup_id
            LEFT JOIN course_rooms_assignments ON studygroups.studygroup_id = course_rooms_assignments.studygroup_id
            LEFT JOIN performance ON studygroups.studygroup_id = performance.studygroup_id
            LEFT JOIN resultsets ON resultsets.assignment_id = course_rooms_assignments.assignment_id OR resultsets.performance_id = performance.performance_id
            LEFT JOIN resultset_to_course_objectives ON resultset_to_course_objectives.resultset_id = resultsets.resultset_id
            LEFT JOIN pupil_submission_result ON pupil_submission_result.result_set_id = resultsets.resultset_id
            LEFT JOIN pupil_performance_assessment ON pupil_performance_assessment.resultset_id = resultsets.resultset_id
            LEFT JOIN pupli_submission_slot ON pupli_submission_slot.assignment_id = course_rooms_assignments.assignment_id
            LEFT JOIN course_objective_groups ON studygroups.studygroup_id = course_objective_groups.studygroup_id
            LEFT JOIN course_objectives ON studygroups.studygroup_id = course_objectives.studygroup_id
            LEFT JOIN files_comments ON files_comments.item_id = course_rooms_assignments.assignment_id OR files_comments.item_id = performance.performance_id
            LEFT JOIN files ON files.item_id = course_rooms_assignments.assignment_id AND files.item_id = performance.performance_id
            WHERE subjects.subject_id={$id}
			");*/
        return array('delete' => 1);
    }

    protected function deleteAcademicYear($id){
        $res1 = $this->db->query("
            SELECT subject_id FROM subjects WHERE academic_year_id=$id
		");

        while($sub = mysql_fetch_assoc($res1)){
            $res = $this->db->query("
            SELECT course_room_id,studygroup_id FROM studygroups WHERE subject_id={$sub['subject_id']}
		    ");

            $this->db->query("
              DELETE FROM academic_years WHERE academic_year_id=$id;
		    ");

            while($st = mysql_fetch_assoc($res)){
                $this->db->query("
               DELETE FROM subjects WHERE subject_id=$id;
		      ");
                $room = $st['course_room_id'];
                $stg = $st['studygroup_id'];
                $this->db->query("DELETE FROM studygroups WHERE studygroup_id=$id");
                $this->db->query("DELETE FROM pupil_studygroup WHERE studygroup_id=$id");
                $this->db->query("DELETE FROM pupil_submission_result WHERE studygroup_id=$id");
                $this->db->query("DELETE FROM pupli_submission_slot WHERE studygroup_id=$id");
                $this->db->query("DELETE FROM resultsets_studygroups WHERE studygroup_id=$id");
                $this->db->query("DELETE FROM studygroup_grades WHERE studygroup_id=$id");
                $this->db->query("DELETE FROM studygroup_pupilgroup WHERE studygroup_id=$id");
                $this->db->query("DELETE FROM studygroup_staff WHERE studygroup_id=$id");
                $this->db->query("DELETE FROM course_rooms_assignments WHERE course_room_id=$room");
                $this->db->query("DELETE FROM course_rooms_elements WHERE course_room_id=$room");
                $this->db->query("DELETE FROM course_room_folders WHERE course_room_id=$room");
                $this->db->query("DELETE FROM course_room_members WHERE course_room_id=$room");
            }
        }



/*        $this->db->query("
                DELETE academic_years,subjects,pupil_studygroup, studygroup_pupilgroup, studygroup_staff, studygroups, resultsets,
                 resultsets_studygroups, resultset_to_course_objectives,pupli_submission_slot,
                 pupil_performance_assessment, pupil_submission_result,course_rooms_assignments,
                 performance,studygroup_grades,course_objective_groups,course_objectives,files_comments,files
                FROM academic_years
                LEFT JOIN subjects ON subjects.academic_year_id = academic_years.academic_year_id
                LEFT JOIN studygroups ON studygroups.subject_id = subjects.subject_id
                LEFT JOIN pupil_studygroup ON studygroups.studygroup_id = pupil_studygroup.studygroup_id
                LEFT JOIN studygroup_pupilgroup ON studygroups.studygroup_id = studygroup_pupilgroup.studygroup_id
                LEFT JOIN studygroup_staff ON studygroups.studygroup_id = studygroup_staff.studygroup_id
                LEFT JOIN studygroup_grades ON studygroups.studygroup_id = studygroup_grades.studygroup_id
                LEFT JOIN resultsets_studygroups ON studygroups.studygroup_id = resultsets_studygroups.studygroup_id
                LEFT JOIN course_rooms_assignments ON studygroups.studygroup_id = course_rooms_assignments.studygroup_id
                LEFT JOIN performance ON studygroups.studygroup_id = performance.studygroup_id
                LEFT JOIN resultsets ON resultsets.assignment_id = course_rooms_assignments.assignment_id OR resultsets.performance_id = performance.performance_id
                LEFT JOIN resultset_to_course_objectives ON resultset_to_course_objectives.resultset_id = resultsets.resultset_id
                LEFT JOIN pupil_submission_result ON pupil_submission_result.result_set_id = resultsets.resultset_id
                LEFT JOIN pupil_performance_assessment ON pupil_performance_assessment.resultset_id = resultsets.resultset_id
                LEFT JOIN pupli_submission_slot ON pupli_submission_slot.assignment_id = course_rooms_assignments.assignment_id
                LEFT JOIN course_objective_groups ON studygroups.studygroup_id = course_objective_groups.studygroup_id
                LEFT JOIN course_objectives ON studygroups.studygroup_id = course_objectives.studygroup_id
                LEFT JOIN files_comments ON files_comments.item_id = course_rooms_assignments.assignment_id OR files_comments.item_id = performance.performance_id
                LEFT JOIN files ON files.item_id = course_rooms_assignments.assignment_id AND files.item_id = performance.performance_id
                WHERE academic_years.academic_year_id={$id}
			");*/
        return array('delete' => 1);
    }

    protected function deleteStudygroup($id){

        $res = $this->db->query("
            SELECT course_room_id FROM studygroups WHERE studygroup_id=$id
		");

        $room = mysql_fetch_assoc($res);
        $room = $room['course_room_id'];

        $rooms = $this->db->query("SELECT studygroup_id FROM studygroups WHERE course_room_id=$room");
        if(mysql_num_rows($rooms) == 1){
            $this->db->query("DELETE FROM course_rooms WHERE course_room_id=$room");
        }

        $this->db->query("DELETE FROM studygroups WHERE studygroup_id=$id");
        $this->db->query("DELETE FROM pupil_studygroup WHERE studygroup_id=$id");
        $this->db->query("DELETE FROM pupil_submission_result WHERE studygroup_id=$id");
        $this->db->query("DELETE FROM pupli_submission_slot WHERE studygroup_id=$id");
        $this->db->query("DELETE FROM resultsets_studygroups WHERE studygroup_id=$id");
        $this->db->query("DELETE FROM studygroup_grades WHERE studygroup_id=$id");
        $this->db->query("DELETE FROM studygroup_pupilgroup WHERE studygroup_id=$id");
        $this->db->query("DELETE FROM studygroup_staff WHERE studygroup_id=$id");
        $this->db->query("DELETE FROM course_rooms_assignments WHERE course_room_id=$room");
        $this->db->query("DELETE FROM course_rooms_elements WHERE course_room_id=$room");
        $this->db->query("DELETE FROM course_room_folders WHERE course_room_id=$room");
        $this->db->query("DELETE FROM course_room_members WHERE course_room_id=$room");

        return array('delete' => 1);
    }


    protected function addAcademicYear($name){
        $entity = $this->user->entity;
        $this->db->query("INSERT INTO academic_years (title_en,entity_id) VALUES ('$name',$entity)");
        return "academicyear_".mysql_insert_id();
    }

    protected function addSubject($id,$name){
        $entity = $this->user->entity;
        $this->db->query("INSERT INTO subjects (title_en, academic_year_id,entity_id) VALUES ('$name', $id,$entity)");
        return "subject_".mysql_insert_id();
    }

    protected function addStudygroup($name, $subject){
        $entity = $this->user->entity;

        $order = $this->getSortOrder('course_rooms');
        $this->db->query("INSERT INTO course_rooms (title_en, subject_id, sort_order) VALUES ('$name', $subject, $order)");
        $cr = mysql_insert_id();

        $this->db->query("INSERT INTO course_room_members (title_en, sort_order, course_room_id) VALUES ('Course room members', $order, $cr)");

        $this->db->query("INSERT INTO studygroups (title_en, subject_id, entity_id, course_room_id) VALUES ('$name', $subject,$entity,$cr)");
        $stg = mysql_insert_id();

        return "studygroup_".$stg;
    }


    public function generate_password($number){
        $arr = array('a','b','c','d','e','f',
            'g','h','i','j','k','l',
            'm','n','o','p','r','s',
            't','u','v','x','y','z',
            'A','B','C','D','E','F',
            'G','H','I','J','K','L',
            'M','N','O','P','R','S',
            'T','U','V','X','Y','Z',
            '1','2','3','4','5','6',
            '7','8','9','0');
        $pass = "";
        for($i = 0; $i < $number; $i++)
        {
            $index = rand(0, count($arr) - 1);
            $pass .= $arr[$index];
        }
        return $pass;
    }
    protected function moveIn($item,$stg,$id){
        switch($item){
            case 'teachers':
                $res = $this->db->query("
				  SELECT staff_member_id FROM studygroup_staff WHERE staff_member_id=$id AND studygroup_id=$stg
		        ");
                if(mysql_num_rows($res)==0){
                    $this->db->query("INSERT INTO studygroup_staff (staff_member_id,studygroup_id) VALUES ($id,$stg)");
                }
                break;
            case 'pupils':
                $this->db->query("INSERT INTO studygroup_pupilgroup (studygroup_id, pupilgroup_id) VALUES ($stg,$id)");
                $result = $this->db->query("SELECT pupil_id FROM pupil WHERE pupilgroup_id=$id");
                while($row = mysql_fetch_assoc($result)){
                    $this->db->query("INSERT INTO studygroup_grades (studygroup_id) VALUES ($stg)");
                    $grade = mysql_insert_id();
                    $this->db->query("INSERT INTO pupil_studygroup (pupil_id,studygroup_id,grades_id) VALUES ({$row['pupil_id']},$stg,$grade)");
                    $this->createPupilSubmissionSlot($row['pupil_id'],$id);
                }
                break;
        }
        return true;
    }

    protected function createPupilSubmissionSlot($id,$pg){
        $result = $this->db->query("SELECT course_rooms_assignments.assignment_id, course_rooms_assignments.studygroup_id  FROM course_rooms_assignments,studygroup_pupilgroup WHERE course_rooms_assignments.studygroup_id = studygroup_pupilgroup.studygroup_id  AND  studygroup_pupilgroup.pupilgroup_id=$pg");
        while ($row = mysql_fetch_assoc($result)){
            $this->db->query("INSERT INTO pupli_submission_slot (assignment_id,pupil_id,status,content_en,studygroup_id,activation_date) VALUES ({$row['assignment_id']},$id,'Not subm.','',{$row['studygroup_id']},NOW())");
            $slot = mysql_insert_id();
            $sql = "SELECT resultset_id FROM resultsets WHERE assignment_id={$row['assignment_id']}";
            $result2 = $this->db->query($sql);
            while($row2 = mysql_fetch_assoc($result2)){
                $this->db->query("INSERT INTO pupil_submission_result (submission_slot_id,result_set_id,studygroup_id) VALUES ($slot,{$row2['resultset_id']},{$row['studygroup_id']})");
            }
        }
    }


    function parseRequest(){
        if(isset($_POST['action'])){
            $action = $_POST['action'];
            $act = explode("_", $action);
            $response = "";
            $id = $_POST['id'];
            $name = $_POST['name'];
            $type = $_POST['node'];
            $ids = explode(",", $_POST['ids']);
            $par = explode('_', $_POST['tid']);
            $sid = $_POST['sid'];
            $lid = $_POST['lid'];
            switch($act[0]){
                case "add":
                    $response = $this->newItem($act[1]);
                    break;
                case "delete":
                    $response = $this->deleteItem($act[1]);
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
                    switch($type){
                        case "academicyear":
                            $response = $this->editAcademicYearName($name,$id);
                            break;
                        case "subject":
                            $response = $this->editSubjectName($name,$id);
                            break;
                        case "staffmember":
                            $response = $this->editStaffName($name,$id);
                            break;
                        case "pupil":
                            $response = $this->editPupilName($name,$id);
                            break;
                        case "parent":
                            $response = $this->editParentName($name,$id);
                            break;
                        case "programme":
                            $response = $this->editProgrammeName($name,$id);
                            break;
                        case "studygroup":
                            $response = $this->editStudygroupName($name,$id);
                            break;
                        case "pupilgroup":
                            $response = $this->editPupilgroupName($name,$id);
                            break;
                    }
                    break;
                case "movein":
                    $response = $this->moveIn($act[1],$_POST['studygroup'],$_POST['item']);
                    break;
            }
            return $response;
        }else{
            return false;
        }
    }
}
?>