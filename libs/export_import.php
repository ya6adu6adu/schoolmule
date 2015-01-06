<?php

require_once 'Connection.php';
require_once 'administrator.php';

set_include_path(get_include_path() . PATH_SEPARATOR .'Classes/');

include_once 'PHPExcel.php';
include_once "Writer/Excel5.php";
include_once 'PHPExcel/IOFactory.php';

class ExcelImporter
{
    private $file = "";
    private $aSheet = null;
    private $db = null;
    private $added = array();
    private $not_added = array();
    private $type = null;
    public  $rewrite_duplicate = null;
    private $duplicate = array();
    private $user= array();
    private $has_duplicate = false;
    private $excel = null;

    function __construct($filename, $type) {

        $this->db = Connection::getDB();
        $this->user = new administrator();
        $this->type = $type;
		
        $this->file = $filename;

		
        if(file_exists($filename)){
            $objReader = PHPExcel_IOFactory::load($filename);
            $objReader->setActiveSheetIndex(0);
            $this->aSheet = $objReader->getActiveSheet();
        }
		
		
    }

    public function importUsers()
    {
        $this->db->query("START TRANSACTION");
        $users = $this->getDataArray();
        $this->savePupils($users);
        $this->db->query("COMMIT");
        return $this->added;
    }

    public function importStudyGroups()
    {
        $this->db->query("START TRANSACTION");
        $study_groups = $this->getDataArray();
        $this->saveStudyGroups($study_groups);
        $this->db->query("COMMIT");
        return $this->added;
    }

    public function getImportRowsCount()
    {

    }

    public function getExportRowsCount()
    {

    }

    public function getExists()
    {
        return count($this->duplicate);
    }

    public function getErrors()
    {
        return count($this->not_added);
    }

    public function getFiledCount()
    {
        $count = 0;
        $rows = $this->getDataArray();

        for($i=0; $i<count($rows); $i++)
        {
            if($rows[$i][0]!="")
            {
                $count++;
            }
        }
        if($rows[0][0]=="Studygroup name" || $rows[0][0]=="Forename")
        {
            return --$count;
        }
        else
        {
            return $count;
        }

    }

    private function getDataArray()
    {
        $array = array();
        foreach($this->aSheet->getRowIterator() as $row)
        {
            $cellIterator = $row->getCellIterator();
            $item = array();
            foreach($cellIterator as $cell)
            {
                array_push($item, iconv('utf-8', 'cp1251', $cell->getCalculatedValue()));
            }
            array_push($array, $item);
        }
        return $array;
    }

    private function savePupils($users)
    {
        $fields = array();
        if($users[0][0] == "Forename" && $users[0][1] == "Surname")
        {
            $fields = $users[0];
            unset($users[0]);
        }

        $users = $this->findDuplicatedUsers($users);


        if(count($this->duplicate)==0 || ($this->rewrite_duplicate===true || $this->rewrite_duplicate===false))
        {
/*            if($this->rewrite_duplicate===false)
            {*/

            /*}*/

            if($this->rewrite_duplicate===true)
            {

                foreach($this->duplicate as $user)
                {
                    if($this->checkUserData($user))
                    {

                        $this->updatePupilInDb($user);
                    }
                }
            }else{

                foreach($users as $user)
                {
                    if($this->checkUserData($user))
                    {
                        $this->savePupilInDb($user);
                    }
                }
            }
        }
        else
        {
            if($this->rewrite_duplicate === null)
            {
                $this->has_duplicate = true;
            }
        }
    }

    private function findDuplicatedGroups($groups)
    {
        foreach($groups as $key=>$group)
        {
            if($this->checkStudyGroupData($group))
            {
                $result = $this->db->query("SELECT studygroup_id FROM studygroups WHERE title_en = '{$group[0]}'");

                if(mysql_num_rows($result)!=0)
                {
                    unset($groups[$key]);
                    $row = mysql_fetch_assoc($result);
                    $group['id'] = $row['studygroup_id'];
                    array_push($this->duplicate, $group);
                    //print_r($this->duplicate);
                }
            }
        }
        return $groups;
    }

    private function findDuplicatedUsers($users)
    {
        foreach($users as $key=>$user)
        {
            if($this->checkUserData($user))
            {
                $result = $this->db->query("SELECT pupil_id, user_id FROM pupil WHERE (forename = '{$user[0]}' AND lastname = '{$user[1]}') OR personal_id='{$user[2]}'");

                if(mysql_num_rows($result)!=0)
                {
                    unset($users[$key]);
                    $row = mysql_fetch_assoc($result);
                    $user['id'] = $row['pupil_id'];
                    $user['uid'] = $row['user_id'];
                    array_push($this->duplicate,$user);
                }
            }
        }
        return $users;
    }

    private function saveStudyGroups($study_groups)
    {

        $fields = array();
        if($study_groups[0][0] == "Studygroup name" && $study_groups[0][1] == "Subject")
        {
            $fields = $study_groups[0];
            unset($study_groups[0]);
        }

        $study_groups = $this->findDuplicatedGroups($study_groups);

        if(count($this->duplicate)==0 || ($this->rewrite_duplicate===true || $this->rewrite_duplicate===false))
        {
            if($this->rewrite_duplicate===true)
            {
                foreach($this->duplicate as $group)
                {
                    $this->updateGroupInDb($group);
                }
            }else{
                foreach($study_groups as $study_group)
                {
                    if($this->checkStudyGroupData($study_group))
                    {
                        $this->saveGroupInDb($study_group);
                    }
                }
            }
        }
        else
        {
            if($this->rewrite_duplicate === null)
            {
                $this->has_duplicate = true;
            }
        }
    }

    private function checkStudyGroupData($study_group)
    {
        if($study_group[0]=="" || $study_group[1]=="" || $study_group[2]==""){
            return false;
        }
        return true;
    }

    private function checkUserData($user)
    {
        if($user[0]=="" || $user[1]=="" || $user[3]==""|| $user[4]==""|| $user[5]==""|| $user[7]==""|| $user[9]==""){
            return false;
        }

        return true;
    }

    private function saveGroupInDb($group)
    {
        $name = $group[0];
        $subject = $group[1];
        $academic_year = $group[2];
        $teacher = $group[3];
        $pg = $group[4];
        $course = $group[5];
        $points = $group[6];
        $start = $group[7];
        $end = $group[8];

        $teacher_ids = $this->getTeacherIds($teacher);
        $pg_ids = $this->getPupilGroupIds($pg);
        $subject_id = $this->getSubjectId($subject,$academic_year);

        if($subject_id)
        {
            if($this->saveStudyGroup($name, $course, $points, $start, $end, $teacher_ids ,$pg_ids, $subject_id))
            {
                array_push($this->added,$group);
            }
            else
            {
                array_push($this->not_added,$group);
            }
        }
        else
        {
            array_push($this->not_added,$group);
        }
    }

    private function updateGroupInDb($group)
    {

        $subject = $group[1];
        $academic_year = $group[2];
        $teacher = $group[3];
        $pg = $group[4];
        $course = $group[5];
        $points = $group[6];
        $start = $group[7];
        $end = $group[8];

        $id = $group['id'];

        $teacher_ids = $this->getTeacherIds($teacher);
        $pg_ids = $this->getPupilGroupIds($pg);
        $subject_id = $this->getSubjectId($subject,$academic_year);

        if($subject_id)
        {
            if($this->updateStudyGroup($course, $points, $start, $end, $teacher_ids ,$pg_ids, $subject_id, $id))
            {
                array_push($this->added,$group);
            }
            else
            {
                array_push($this->not_added,$group);
            }
        }
    }

    private function updateStudyGroup($course, $points, $start, $end, $teacher_ids ,$pg_ids, $subject_id, $id)
    {
        $this->db->query("UPDATE studygroups SET course = '$course', startdate = '$start', enddate = '$end', subject_id = $subject_id, points = '$points' WHERE studygroup_id = $id");

        $this->db->query("DELETE FROM studygroup_pupilgroup WHERE studygroup_id=$id");
        $this->db->query("DELETE FROM studygroup_grades WHERE studygroup_id=$id");
        $this->db->query("DELETE FROM pupil_studygroup WHERE studygroup_id=$id");
        $this->db->query("DELETE FROM studygroup_staff WHERE studygroup_id=$id");

        $this->createStudyGroupLinks($id,$pg_ids,$teacher_ids);

        return true;
    }

    private function saveStudyGroup($name, $course, $points, $start, $end, $teacher_ids ,$pg_ids, $subject_id)
    {
        $this->db->query("INSERT INTO course_rooms (title_en, subject_id, sort_order) VALUES ('$name', $subject_id, 1)");
        $room = mysql_insert_id();
        $this->db->query("INSERT INTO course_room_members (title_en, sort_order, course_room_id) VALUES ('Course room members', 1, $room)");

        $this->db->query("INSERT INTO studygroups (title_en, course, startdate, enddate, subject_id, entity_id, course_room_id, points)
        VALUES ('$name','$course','$start','$end', $subject_id, {$this->user->entity}, $room, '$points')");

        $id = mysql_insert_id();

        $this->createStudyGroupLinks($id,$pg_ids,$teacher_ids);

        return true;
    }

    private function createStudyGroupLinks($id, $pg_ids,$teacher_ids)
    {
        for($i=0; $i<count($pg_ids); $i++)
        {
            $this->db->query("INSERT INTO studygroup_pupilgroup (studygroup_id, pupilgroup_id) VALUES ($id, {$pg_ids[$i]})");
            $result = $this->db->query("SELECT pupil_id FROM pupil WHERE pupilgroup_id = $pg_ids[$i]");
            while($row = mysql_fetch_assoc($result))
            {
                $this->db->query("INSERT INTO studygroup_grades (studygroup_id) VALUES ($id)");
                $grade = mysql_insert_id();
                $this->db->query("INSERT INTO pupil_studygroup (pupil_id, studygroup_id, grades_id) VALUES ({$row['pupil_id']},$id,$grade)");
            }

        }
        if($teacher_ids){
            for($i=0; $i<count($teacher_ids); $i++)
            {

                $this->db->query("INSERT INTO studygroup_staff (studygroup_id, staff_member_id) VALUES ($id, {$teacher_ids[$i]})");
            }
        }

    }

    private function getSubjectId($subject,$academic_year)
    {

        $result = $this->db->query("SELECT subjects.subject_id FROM subjects, academic_years
            WHERE subjects.title_en = '$subject'
            AND academic_years.title_en = '$academic_year'
            AND academic_years.academic_year_id = subjects.academic_year_id
        ");

        if(mysql_num_rows($result)==0){
            return false;
        }else{
            $subject = mysql_fetch_assoc($result);
            return $subject['subject_id'];
        }
        return true;
    }

    private function getPupilGroupIds($pg)
    {
        $pgs = explode(',',$pg);
        $ids = array();

        for($i=0; $i<=count($pgs); $i++)
        {
            if($pgs[$i])
            {
                $result = $this->db->query("SELECT pupilgroup_id FROM pupilgroups
                  WHERE title_en = '$pgs[$i]' AND entity_id = {$this->user->entity}");
                if(mysql_num_rows($result)==1)
                {
                    $group = mysql_fetch_assoc($result);
                    array_push($ids,$group['pupilgroup_id']);
                }
                else
                {
                    return false;
                }
            }
        }
        return $ids;
    }

    private function getTeacherIds($teacher)
    {
        $teachers = explode(',',$teacher);

        $ids = array();
        for($i=0; $i<=count($teachers); $i++)
        {
            $member = explode(' ',$teachers[$i]);
            if($member[0] && $member[1])
            {
                $result = $this->db->query("SELECT staff_member_id FROM staff_members
                WHERE (fore_name = '$member[0]' AND last_name = '$member[1]') OR (fore_name = '$member[1]' AND last_name = '$member[0]') AND entity_id = {$this->user->entity}");

                if(mysql_num_rows($result)==1)
                {
                    $staff = mysql_fetch_assoc($result);
                    array_push($ids,$staff['staff_member_id']);
                }
                else
                {
                    return false;
                }
            }
        }
        return $ids;
    }

    private function updatePupilInDb($pupil)
    {
        $pid = $pupil[2];
        $pg = $pupil[3];
        $start = $pupil[4];
        $programme = $pupil[5];
        $added = $pupil[6];
        $username = $pupil[7];
        $email = $pupil[8];
        $password = $pupil[9];
        $id = $pupil['id'];
        $uid = $pupil['uid'];

        $pupil_group_id = $this->getPupilGroup($pg,$programme,$start);

        if($pupil_group_id){
            $user = $this->updateUser($username, $password, $email,$added,$uid);
            if($user){
                if($this->updatePupil($pid, $pupil_group_id, $id, $pupil[0], $pupil[1])){
                    array_push($this->added,$pupil);
                }
                else
                {
                    array_push($this->not_added,$pupil);
                }
            }
            else
            {
                array_push($this->not_added,$pupil);
            }
        }
        else
        {
            array_push($this->not_added,$pupil);
        }
    }

    private function savePupilInDb($pupil)
    {
        $name = $pupil[0];
        $surname = $pupil[1];
        $pid = $pupil[2];
        $pg = $pupil[3];
        $start = $pupil[4];
        $programme = $pupil[5];
        $added = $pupil[6];
        $username = $pupil[7];
        $email = $pupil[8];
        $password = $pupil[9];

        $pupil_group_id = $this->getPupilGroup($pg,$programme,$start);
        if($pupil_group_id){
            $user = $this->saveUser($username, $password, $email,$added);
            if($user){
                if($this->savePupil($user, $name, $surname, $pid, $pupil_group_id)){
                    array_push($this->added,$pupil);
                }
            }
            else
            {
                array_push($this->not_added,$pupil);
            }
        }
        else
        {
            array_push($this->not_added,$pupil);
        }
    }

    private function updateUser($name, $pass, $email, $added, $id)
    {
        $this->db->query("UPDATE users SET username = '$name', password = '$pass', email = '$email', created_at = '$added', entity_id = {$this->user->entity} WHERE user_id = $id");
        return true;
    }

    private function updatePupil($pid, $pupil_group_id, $id, $forename, $lastname){
        $this->db->query(
            "UPDATE pupil
             SET
                personal_id = '$pid',
                pupilgroup_id = '$pupil_group_id',
                forename = '$forename',
                lastname = '$lastname'
            WHERE pupil_id = $id"
        );

        $this->db->query("DELETE FROM pupil_pupilgroup WHERE pupil_id=$id");
        $this->db->query("INSERT INTO pupil_pupilgroup (pupilgroup_id, pupil_id) VALUES ('$pupil_group_id','$id')");
        return true;
    }

    private function saveUser($name, $pass, $email,$added)
    {
        $this->db->query("INSERT INTO users (username, password, role, first_login, email, created_at, entity_id) VALUES ('$name','$pass','pupil','1','$email','$added',{$this->user->entity})");
        if($id = mysql_insert_id())
        {
            return $id;
        }
        else
        {
            return false;
        }
    }

    private function savePupil($user, $name, $surname, $pid, $pupil_group_id)
    {
        $this->db->query("INSERT INTO pupil (forename, lastname, personal_id, pupilgroup_id, user_id) VALUES ('$name','$surname','$pid','$pupil_group_id', $user)");
        if($id = mysql_insert_id())
        {
            $this->db->query("INSERT INTO pupil_pupilgroup (pupilgroup_id, pupil_id) VALUES ('$pupil_group_id','$id')");
            return $id;
        }
        else
        {
            return false;
        }
    }

    private function getPupilGroup($pg,$programme,$start)
    {
        $result = $this->db->query("SELECT pupilgroups.pupilgroup_id FROM pupilgroups,years,programmes
            WHERE pupilgroups.title_en = '$pg'
            AND years.title_en = '$start'
            AND programmes.title_en = '$programme'
            AND pupilgroups.year_id = years.year_id
            AND years.programme_id = programmes.programme_id
        ");

        if(mysql_num_rows($result)==0){
            return false;
        }else{
            $pupilgroup = mysql_fetch_assoc($result);
            return $pupilgroup['pupilgroup_id'];
        }

        return true;
    }

    public function exportUsers()
    {
	
        $this->excel = new PHPExcel();
        $this->excel->setActiveSheetIndex(0);
        $this->aSheet = $this->excel->getActiveSheet();

        $this->setColumnAutoWidth();
		
        $fields = $this->getExportFields();

        $header = $this->getExportHeader();
		
        $this->printRow($header,1);

        $index = 2;
        foreach($fields as $field)
        {
            $this->printRow($field,$index);
            $index++;
        }

        $this->outExell();
    }

    private function outExell()
    {
        $objWriter = new PHPExcel_Writer_Excel5($this->excel);
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="'.$this->file.'.xls"');
        header('Cache-Control: max-age=0');
        $objWriter->save('php://output');
    }

    private function printRow($row,$index)
    {
        $i=0;
        foreach($row as $col)
        {
            $this->aSheet->setCellValueByColumnAndRow($i, $index, $col);
            $i++;
        }
    }

    private function setColumnAutoWidth()
    {
        $str = "ABCDEFGHIJKLMNOP";
        for($i=0; $i<strlen($str); $i++)
        {
            $this->aSheet->getColumnDimension($str[$i])->setAutoSize(true);
        }
    }

    private function getExportHeader()
    {
        return array(
            'name' => 'Pupil name',
            'pg' => 'Pupilgroup',
            'goal' => 'Goal',
            'prognose' => 'Prognose',
            'grade' => 'Grade',
            'stg' => 'Studygroup',
            'id' => 'ID',
            'active' => 'Flag',
            'programme' => 'Programme',
            'year' => 'Startyear',
            'staffs' => 'Teacher(s)',
            'assign' => 'Assignm.',
            'objective_progress' => 'Objectives progress'

        );
    }

    private function getExportFields()
    {
        $ht = array();
        $na = 0;

        $result = $this->db->query("
            SELECT  pupil.forename as name, pupil.lastname as surname,  pupil.personal_id as  pid,
				 pg.title_en AS pupilgroup,
				 grades_stg.goal AS goal,
				 grades_stg.prognose AS prognose,
				 grades_stg.grade AS grade,
				 stg.title_en AS stg,
				 pupil_stg.active AS active,
				 pupil_stg.pupil_studygroup_id AS id,
				 years.title_en AS year,
				 result.assessment AS assessment,
				 prog.title_en AS programme,
				 staff.fore_name AS staff_name,
				 staff.last_name AS staff_surname,
				 staff.staff_member_id AS sid,
				 assign.assignment_id AS aid,
				 objectives.quality AS quality,
				 objectives.objective_id AS oid
FROM pupil
	INNER JOIN pupilgroups pg ON pupil.pupilgroup_id = pg.pupilgroup_id
	INNER JOIN pupil_studygroup pupil_stg ON pupil_stg.pupil_id = pupil.pupil_id
	INNER JOIN studygroup_grades grades_stg ON grades_stg.studygroup_grades_id = pupil_stg.grades_id
	INNER JOIN studygroups stg ON grades_stg.studygroup_id = stg.studygroup_id
	INNER JOIN studygroup_staff stg_staff ON grades_stg.studygroup_id = stg_staff.studygroup_id
	INNER JOIN subjects subj ON subj.subject_id = stg.subject_id
	INNER JOIN years years ON years.year_id = pg.year_id
	INNER JOIN programmes prog ON prog.programme_id = years.programme_id
	INNER JOIN staff_members staff ON stg_staff.staff_member_id = staff.staff_member_id
	INNER JOIN pupli_submission_slot slot ON slot.pupil_id = pupil.pupil_id
	INNER JOIN pupil_submission_result result ON result.submission_slot_id = slot.submission_slot_id
	INNER JOIN course_rooms_assignments assign ON assign.assignment_id = slot.assignment_id
	INNER JOIN course_objectives objectives ON objectives.studygroup_id = stg_staff.studygroup_id
WHERE pg.entity_id = {$this->user->entity}
        ");

		
        $result2 = $this->db->query("
              SELECT grade_definition_id, title_en
              FROM grade_definition
         ");


        while($row2 = mysql_fetch_assoc($result2)){
            $ht[$row2['grade_definition_id']] = $row2['title_en'];
        }
		

        $pupil_stgs = array();
        while($row = mysql_fetch_assoc($result))
        {
            $pupil_stgs[$row['id']]['name'] = $row['name'].' '.$row['surname'];
            $pupil_stgs[$row['id']]['pg'] = $row['pupilgroup'];
            $pupil_stgs[$row['id']]['goal'] = $ht[$row['goal']];
            $pupil_stgs[$row['id']]['prognose'] = $ht[$row['prognose']];
            $pupil_stgs[$row['id']]['grade'] = $ht[$row['grade']];
            $pupil_stgs[$row['id']]['stg'] = $row['stg'];
            $pupil_stgs[$row['id']]['pid'] = $row['pid'];
            $pupil_stgs[$row['id']]['active'] = $row['active']=="0"?"not active":"active";
            $pupil_stgs[$row['id']]['programme'] = $row['programme'];
            $pupil_stgs[$row['id']]['year'] = $row['year'];
            $pupil_stgs[$row['id']]['staffs'][$row['sid']] = $row['staff_name'].' '.$row['staff_surname'];
            $assess = $pupil_stgs[$row['id']]['assigns'][$row['aid']];
            $pupil_stgs[$row['id']]['assigns'][$row['aid']] = ($row['assessment']>$assess?$row['assessment']:$assess);
            $pupil_stgs[$row['id']]['objective_progress'][$row['oid']] = $row['quality'];

        }

        foreach($pupil_stgs as $key=>$pupil)
        {
            $nac = count($pupil_stgs[$key]['assigns']);
            foreach($pupil_stgs[$key]['assigns'] as $assessment)
            {
                if($assessment!='' && $assessment!='na' && $assessment!='Fx'){
                    $na++;
                }
            }
            $pupil_stgs[$key]['objective_progress'] = implode('/',$pupil_stgs[$key]['objective_progress']);
            $pupil_stgs[$key]['assigns'] = $na.'/'.$nac;
            $na = 0;
            $pupil_stgs[$key]['staffs'] = implode(',',$pupil_stgs[$key]['staffs']);
        }

        return $pupil_stgs;
    }
}

$file_pass = "../user_files/";
if(isset($_GET['type']))
{
    switch($_GET['type'])
    {
        case 'export':
            $exporter = new ExcelImporter('pupil_studygroup', "users");
            $exporter->exportUsers();
            break;
        case 'import':
            if(isset($_GET['users']))
            {
                $file = $file_pass.$_GET['users'];
                if(file_exists($file)){
                    $importer = new ExcelImporter($file, "users");

                    if(isset($_GET['update'])){
                        if($_GET['update']=='1'){
                            $importer->rewrite_duplicate = true;
                        }
                        else
                        {
                            $importer->rewrite_duplicate = false;
                        }
                    }
                    $users = count($importer->importUsers());

                    if($users==0)
                    {

                        if($importer->rewrite_duplicate===null){
                            if($importer->getExists() !== 0){
                                $array_resp = array('duplicate'=>$importer->getExists());
                                echo json_encode($array_resp);
                            }else{
                                $array_resp = array('imported'=>$users, 'errors'=>$importer->getErrors());
                                echo json_encode($array_resp);
                            }
                        }else{

                            $array_resp = array('imported'=>$users, 'errors'=>$importer->getErrors());
                            echo json_encode($array_resp);
                        }
                    }
                    else
                    {
                        $array_resp = array('imported'=>$users, 'errors'=>$importer->getErrors());
                        echo json_encode($array_resp);

                    }

                }
            }

            if(isset($_GET['programme']))
            {
                $file = $file_pass.$_GET['programme'];
                if(file_exists($file)){
                    $importer = new ExcelImporter($file, "studygroups");
                    if(isset($_GET['update'])){
                        if($_GET['update']=='1'){
                            $importer->rewrite_duplicate = true;
                        }
                        else
                        {
                            $importer->rewrite_duplicate = false;
                        }
                    }

                    $programmes = count($importer->importStudyGroups());

                    if($programmes==0)
                    {
                        if($importer->rewrite_duplicate===null){
                            if($importer->getExists() !== 0){
                                $array_resp = array('duplicate'=>$importer->getExists());
                                echo json_encode($array_resp);
                            }else{
                                $array_resp = array('imported'=>$programmes, 'errors'=>$importer->getErrors());
                                echo json_encode($array_resp);
                            }
                        }else{
                            $array_resp = array('imported'=>$programmes, 'errors'=>$importer->getErrors());
                            echo json_encode($array_resp);
                        }
                    }
                    else
                    {
                        $array_resp = array('imported'=>$programmes, 'errors'=>$importer->getErrors());
                        echo json_encode($array_resp);
                    }
                }
            }
            break;
    }
}


if(isset($_GET['action']))
{
    if($_GET['action']=='remove_files'){
        if(isset($_POST['file'])){
            $file = $file_pass.$_POST['file'];
            echo $file;
            unlink($file);
        }
    }
    if($_GET['action']=='upload_user_data'){
        if(isset($_GET['file'])){
            $file = $file_pass.$_GET['file'];
            $importer = new ExcelImporter($file, "users");
            echo $importer->getFiledCount();
        }
    }

    if($_GET['action']=='upload_programme_struct'){
        if(isset($_GET['file'])){
            $file = $file_pass.$_GET['file'];
            $importer = new ExcelImporter($file, "studygroups");
            echo $importer->getFiledCount();
        }
    }

    if($_GET['action']=='upload'){
        $filename = $_FILES["file"]["name"];
        $file = $file_pass.$filename;
        move_uploaded_file($_FILES["file"]["tmp_name"],$file);
        print_r("{state: true, name:'".str_replace("'","\\'",$file)."'}");
    }
}
?>