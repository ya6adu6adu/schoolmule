<?php
include_once '../libs/Connection.php';
include_once '../libs/tree_editor.php';

class tree_users extends tree_editor{

    public function __construct(){
        parent::__construct();
        if(!isset($_POST['action'])){
            header("content-type:text/xml;charset=UTF-8");
            if(isset($_GET['refresh'])){
                $refresh = $_GET['refresh'];
            }else{
                $refresh = false;
            }
            $this->treeXml = ($this->getXml($_GET['id'],$_GET['autoload'],$refresh));
        }else{
            $this->db->query("START TRANSACTION");
            $response = "";
            $response = $this->parseRequest();
            $this->db->query("COMMIT");
            echo json_encode($response);
        }
    }

    public function getXmlTree($id=0,$rf,$autoload = true){
        $xml = '<?xml version="1.0"?><tree id="'.$id.'">';
        $xml .= $this->getXmlMyCourseRoomsAuto($id,$rf,$autoload);
        $xml .= '</tree>';
        return $xml;
    }

    /********* Top level *****************/
    public  function getXmlMyCourseRoomsAuto($id,$rf,$autoload){
        $xml = '<item child="1" text="'.dlang("tree_users_staff","Staff").'" id="staff" im1="folder_open.png" im0="folder_open.png" im2="folder_closed.png">';
        $xml .= $this->getStaff();
        $xml .= '</item>';
        $xml .='<item child="1" text="'.dlang("tree_users_pupils","Pupils").'" id="pupils" im1="folder_open.png" im0="folder_open.png" im2="folder_closed.png">';
        $xml .= $this->getProgrammes();
        $xml .= '</item>';
        return $xml;
    }

    protected function getStaff(){
        $xml = "";

        $entity = $this->user->entity;
        $result = $this->db->query("SELECT staff_member_id, fore_name, last_name FROM staff_members WHERE entity_id = $entity ORDER BY sort_order");
        while($row = mysql_fetch_assoc($result)){
            $xml.=$this->getStaffXml($row['staff_member_id'],$row['fore_name'],$row['last_name']);
        }
        return $xml;
    }

    protected function getStaffXml($id,$name,$lname){
        $xml = "";
        $xml .= '<item child="1" id="staffmember'.'_'.$id.'" text="'.$name.' '.$lname.'" im0="staff.png" im1="staff.png" im2="staff.png">';
        //$xml .= $this->getProgresses($id);
        $xml .= '</item>';
        return $xml;
    }

    protected function getProgrammes(){
        $xml = "";
        $entity = $this->user->entity;
        $result = $this->db->query("SELECT programme_id,title_en FROM programmes WHERE entity_id = $entity");

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
        $xml .= $this->getPupilGroup($id);
        $xml .= '</item>';
        return $xml;
    }
    protected function getPupilGroup($id){
        $xml = "";
        $result = $this->db->query("
              SELECT pupilgroup_id AS pid, pupilgroups.title_en AS ptitle, studygroup_id FROM pupilgroups WHERE year_id = $id
            ");
        while($row = mysql_fetch_assoc($result)){
            $xml.=$this->getPupilGroupXml($row['pid'],$row['ptitle'],$id);
        }
        return $xml;
    }


    protected function getPupilGroupXml($id,$title,$year){
        $xml = "";
        $xml .= '<item child="1" id="pupilgroup'.'_'.$id.'_'.$year.'" text="'.$title.'" im0="pupilgroup.png" im1="pupilgroup.png" im2="pupilgroup.png">';
        $xml .= $this->getPupils($id);
        $xml .= '</item>';
        return $xml;
    }

    protected function getPupils($id){
        $xml = "";
        $result = $this->db->query("SELECT pupil.pupil_id, forename, lastname FROM pupil,pupil_pupilgroup WHERE pupil.pupil_id = pupil_pupilgroup.pupil_id AND pupil_pupilgroup.pupilgroup_id=$id");

        while($row = mysql_fetch_assoc($result)){
            $xml.=$this->getPupilXml($row['pupil_id'],$row['forename'],$row['lastname'], $id);
        }
        return $xml;
    }

    protected function getPupilXml($id,$name,$lname,$pg){
        $xml = "";
        $xml .= '<item child="1" id="pupil'.'_'.$id.'_'.$pg.'" text="'.$name.' '.$lname.'" im0="pupil.png" im1="pupil.png" im2="pupil.png">';
        $xml .= $this->getParents($id,$pg);
        $xml .= '</item>';
        return $xml;
    }

    protected function getParents($id,$pg){
        $xml = "";
        $result = $this->db->query("SELECT parent_id, forename, lastname FROM parents WHERE pupil_id=$id");
        while($row = mysql_fetch_assoc($result)){
            $xml .=$this->getParentsXml($row['parent_id'],$row['forename'],$row['lastname'], $pg);
        }
        return $xml;
    }

    protected function getParentsXml($id,$name,$lname,$pg){
        $xml = "";
        $xml .= '<item child="0" id="parent_'.$id.'_'.$pg.'" text="'.$name.' '.$lname.'" im0="parent.png" im1="parent.png" im2="parent.png">';
        $xml .= '</item>';
        return $xml;
    }

    public function moveItem($ids,$item,$sid,$lid,$par){
       switch($item){
           case "pupil":
               $parents = array(
                   'pupilgroup_id' => $par[1]
               );
               $response = $this->setParent($sid,$parents,$lid,'pupil','pupil');
               $this->removePupilFromStgs($sid);
               $this->addPupilToStgs($sid,$par[1]);
               $this->createPupilSubmissionSlot($sid,$par[1]);
               return $response;
       }
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

    protected function addLogItem($type, $name, $action = "Add new "){
        $text = $action.$type.': '.$name;
        $admin = new administrator();
        if($admin->login!=null){
            $user = $admin->login;
        }else{
            $user = "Guest";
        }
        $this->db->query("INSERT INTO setup_logs (time, text, user) VALUES (CURDATE(),'$text','$user')");
        return true;
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
        $this->updateUserName($user[0].'.'.$user[1],$id);
        return array('edit' => 1);
    }

    protected function updateUserName($name,$id){
        $username = $name;
        $result = $this->db->query("SELECT user_id FROM users WHERE username LIKE '%{$name}%'");
        $col = mysql_num_rows($result);
        if($col>0){
            $username = $name.$col;
        }
        $result = $this->db->query("SELECT user_id FROM pupil WHERE pupil_id = {$id}");
        $row = mysql_fetch_assoc($result);
        $this->db->query("UPDATE users SET username = '$username' WHERE user_id = {$row['user_id']}");
        return mysql_insert_id();
    }

    protected function editParentName($name, $id){
        $user = explode(' ', $name, 2);
        $user[0] = $user[0]?trim($user[0]):"";
        $user[1] = $user[1]?trim($user[1]):"";
        $this->db->query("UPDATE parents SET forename = '{$user[0]}', lastname = '{$user[1]}' WHERE parent_id=$id");
        return array('edit' => 1);
    }

    protected function editProgrammeName($name, $id){
        $res = $this->db->query("SELECT title_en FROM programmes WHERE title_en='$name'");
        if(mysql_num_rows($res)!=0){
            return array('edit' => 0);
        }
        $this->db->query("UPDATE programmes SET title_en = '$name' WHERE programme_id=$id");
        return array('edit' => 1);
    }

    protected function editStudygroupName($name, $id){
        $this->db->query("UPDATE studygroups SET title_en = '$name' WHERE studygroup_id=$id");
        return array('edit' => 1);
    }

    protected function editPupilgroupName($name, $id){
        $this->db->query("UPDATE pupilgroups SET title_en = '$name' WHERE pupilgroup_id=$id");
        return array('edit' => 1);
    }

    protected function editYearName($name, $id){
        $this->db->query("UPDATE years SET title_en = '$name' WHERE year_id=$id");
        return array('edit' => 1);
    }

    protected function newItem($type){
        $col = (int) $_POST['col'];
        $added = array();
        switch ($type) {
            case 'pupil':
                for($i=0; $i<$col; $i++){
                    $added[] = $this->addPupil($_POST['pupilgroup'],$i,$_POST['num'],$_POST['stg'],$_POST['forename'],$_POST['surname']);
                    $this->addLogItem('Pupil','forname.lastname');
                }
                break;
            case 'pupilgroup':
                for($i=0; $i<$col; $i++){
                    $added[] = $this->addPupilgroup($_POST['name'], $_POST['year']);
                    $this->addLogItem('Pupilgroup','new pupilgroup');
                }
                break;
            case 'parent':
                for($i=0; $i<$col; $i++){
                    $added[] = $this->addParent($_POST['pupil'],$i,$_POST['forename'],$_POST['surname']);
                    $this->addLogItem('Parent','forename.lastname');
                }
                break;
            case 'staff':
                for($i=0; $i<$col; $i++){
                    $added[] = $this->addStaff($i,$_POST['forename'],$_POST['surname']);
                    $this->addLogItem('Staff Member','forename.lastname','Add new');
                }
                break;
            case 'year':
                for($i=0; $i<$col; $i++){
                    $added[] = $this->addYear($_POST['programme'],$_POST['name']);
                    $this->addLogItem('Year',$_POST['name']);
                }
                break;
            case 'programme':
                for($i=0; $i<$col; $i++){
                    $added[] = $this->addProgramme($_POST['name']);
                    $this->addLogItem('Year',$_POST['name']);
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
                case 'pupil':
                    $response = $this->deletePupil($sid[1]);
                    $this->addLogItem('Pupil','','Delete ');
                    break;
                case 'years':
                    $response = $this->deleteYear($sid[1]);
                    $this->addLogItem('Year','','Delete ');
                    break;
                case 'pupilgroup':
                    $response = $this->deletePupilgroup($sid[1]);
                    $this->addLogItem('Pupilgroup','','Delete ');
                    break;
                case 'parent':
                    $response = $this->deleteParent($sid[1]);
                    $this->addLogItem('Parent','','Delete ');
                    break;
                case 'parents':
                    $response = $this->deleteParents($_POST['pupil']);
                    $this->addLogItem('All Parents','','Delete ');
                    break;
                case 'staffmember':
                    $response = $this->deleteStaff($sid[1]);
                    $this->addLogItem('Staff Member','','Delete ');
                    break;
                case 'programme':
                    $response = $this->deleteProgramme($sid[1]);
                    $this->addLogItem('Programme','','Delete ');
                    break;
                case 'studygroup':
                    $response = $this->deleteStudygroup($sid[1]);
                    $this->addLogItem('Studygroup','','Delete ');
                    break;
                case 'checked':
                    $response = $this->deleteChecked($_POST['checked']);
                    $this->addLogItem('All Checked','','Delete ');
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
                case 'pupil':
                    $response = $this->deletePupil($item[1]);
                    break;
                case 'pupilgroup':
                    $response = $this->deletePupilgroup($item[1]);
                    break;
                case 'parent':
                    $response = $this->deleteParent($item[1]);
                    break;
                case 'staffmember':
                    $response = $this->deleteStaff($item[1]);
                    break;
                case 'programme':
                    $response = $this->deleteProgramme($item[1]);
                    break;
                case 'studygroup':
                    $response = $this->deleteStudygroup($item[1]);
                    break;
                case 'checked':
                    $response = $this->deleteChecked($item[1]);
                    break;
                default:
                    break;
            }
        }
        return $response;
    }

    public function deletePupil($id){
        $this->db->query("
            DELETE pupil, parents,pupli_submission_slot,pupil_submission_result,users, pupil_studygroup, files_comments, files,pupil_pupilgroup FROM pupil
            LEFT JOIN parents ON parents.pupil_id = pupil.pupil_id
            LEFT JOIN pupil_pupilgroup ON pupil_pupilgroup.pupil_id = pupil.pupil_id
            LEFT JOIN users ON users.user_id = parents.user_id AND users.user_id = parents.user_id
            LEFT JOIN pupli_submission_slot ON pupli_submission_slot.pupil_id = pupil.pupil_id
            LEFT JOIN pupil_submission_result ON pupil_submission_result.submission_slot_id = pupli_submission_slot.submission_slot_id
            LEFT JOIN pupil_studygroup ON pupil_studygroup.pupil_id = pupil.pupil_id
            LEFT JOIN files_comments ON files_comments.user_id = users.user_id
            LEFT JOIN files ON files.user_id = users.user_id

            WHERE pupil.pupil_id={$id}
        ");
        return array('delete' => 1);
    }

    protected function deletePupilgroup($id){
        $this->db->query("
                DELETE pupilgroups, pupil, parents,pupli_submission_slot,pupil_submission_result,users, pupil_studygroup, studygroup_pupilgroup,files_comments,files,pupil_pupilgroup FROM pupilgroups
                LEFT JOIN pupil ON pupil.pupilgroup_id = pupilgroups.pupilgroup_id
                LEFT JOIN parents ON parents.pupil_id = pupil.pupil_id
                LEFT JOIN pupil_pupilgroup ON pupil_pupilgroup.pupilgroup_id = pupilgroups.pupilgroup_id
                LEFT JOIN users ON users.user_id = parents.user_id AND users.user_id = parents.user_id
                LEFT JOIN pupli_submission_slot ON pupli_submission_slot.pupil_id = pupil.pupil_id
                LEFT JOIN pupil_submission_result ON pupil_submission_result.submission_slot_id = pupli_submission_slot.submission_slot_id
                LEFT JOIN pupil_studygroup ON pupil_studygroup.pupil_id = pupil.pupil_id
                LEFT JOIN studygroup_pupilgroup ON studygroup_pupilgroup.pupilgroup_id = pupilgroups.pupilgroup_id
                LEFT JOIN files_comments ON files_comments.user_id = users.user_id
                LEFT JOIN files ON files.user_id = users.user_id
                WHERE pupilgroups.pupilgroup_id=$id
		");
        return array('delete' => 1);
    }

    protected function deleteYear($id){
        $this->db->query("
                DELETE years, pupilgroups, pupil, parents,pupli_submission_slot,pupil_submission_result,users, pupil_studygroup, studygroup_pupilgroup,files_comments,files,pupil_pupilgroup FROM years
                LEFT JOIN pupilgroups ON pupilgroups.year_id = years.year_id
                LEFT JOIN pupil ON pupil.pupilgroup_id = pupilgroups.pupilgroup_id
                LEFT JOIN pupil_pupilgroup ON pupil_pupilgroup.pupilgroup_id = pupilgroups.pupilgroup_id
                LEFT JOIN parents ON parents.pupil_id = pupil.pupil_id
                LEFT JOIN users ON users.user_id = parents.user_id AND users.user_id = parents.user_id
                LEFT JOIN pupli_submission_slot ON pupli_submission_slot.pupil_id = pupil.pupil_id
                LEFT JOIN pupil_submission_result ON pupil_submission_result.submission_slot_id = pupli_submission_slot.submission_slot_id
                LEFT JOIN pupil_studygroup ON pupil_studygroup.pupil_id = pupil.pupil_id
                LEFT JOIN studygroup_pupilgroup ON studygroup_pupilgroup.pupilgroup_id = pupilgroups.pupilgroup_id
                LEFT JOIN files_comments ON files_comments.user_id = users.user_id
                LEFT JOIN files ON files.user_id = users.user_id
                WHERE years.year_id={$id}
		");
        return array('delete' => 1);
    }

    protected function deleteParent($id){
        $this->db->query("
				 DELETE parents,users FROM parents,users WHERE parents.parent_id={$id} AND users.user_id = parents.user_id;
			");
        return array('delete' => 1);
    }

    protected function deleteParents($id){
        $this->db->query("
				 DELETE parents,users FROM parents,users WHERE parents.pupil_id={$id} AND users.user_id = parents.user_id;
			");
        return array('delete' => 1);
    }

    protected function deleteStaff($id){
        $this->db->query("
                DELETE staff_members, users, files_comments, studygroup_staff, files FROM staff_members
                LEFT JOIN users ON users.user_id = staff_members.user_id
                LEFT JOIN files_comments ON files_comments.user_id = users.user_id
                LEFT JOIN files ON files.user_id = users.user_id
                LEFT JOIN studygroup_staff ON studygroup_staff.staff_member_id = staff_members.staff_member_id
                WHERE staff_members.staff_member_id={$id}
		");

        return array('delete' => 1);
    }

    protected function deleteProgramme($id){
        $this->db->query("
                DELETE years,pupil_pupilgroup, pupilgroups, pupil, parents,pupli_submission_slot,pupil_submission_result,users ,programmes, pupil_studygroup, studygroup_pupilgroup,files_comments,files FROM programmes
                LEFT JOIN years ON years.programme_id = programmes.programme_id
                LEFT JOIN pupilgroups ON pupilgroups.year_id = years.year_id
                LEFT JOIN pupil ON pupil.pupilgroup_id = pupilgroups.pupilgroup_id
                LEFT JOIN pupil_pupilgroup ON pupil_pupilgroup.pupilgroup_id = pupilgroups.pupilgroup_id
                LEFT JOIN parents ON parents.pupil_id = pupil.pupil_id
                LEFT JOIN users ON users.user_id = parents.user_id AND users.user_id = parents.user_id
                LEFT JOIN pupli_submission_slot ON pupli_submission_slot.pupil_id = pupil.pupil_id
                LEFT JOIN pupil_submission_result ON pupil_submission_result.submission_slot_id = pupli_submission_slot.submission_slot_id
                LEFT JOIN pupil_studygroup ON pupil_studygroup.pupil_id = pupil.pupil_id
                LEFT JOIN studygroup_pupilgroup ON studygroup_pupilgroup.pupilgroup_id = pupilgroups.pupilgroup_id
                LEFT JOIN files_comments ON files_comments.user_id = users.user_id
                LEFT JOIN files ON files.user_id = users.user_id
                WHERE programmes.programme_id=$id
		");
        return array('delete' => 1);
    }

    protected function addYear($id,$name){
        $entity = $this->user->entity;
        $this->db->query("INSERT INTO years (title_en,programme_id,entity_id) VALUES ('$name', $id,$entity)");
        return "years_".mysql_insert_id();
    }

    protected function createUser($role,$username,$pass){
        $entity = $this->user->entity;
        if(!$username){
            $username = 'forename.surname';
        }
        $result = $this->db->query("SELECT user_id FROM users WHERE username LIKE '%".$username."%'");
        $col = mysql_num_rows($result);
        if($col>0){
            $username = $username.'_'.$col;
        }else{
            $username = $username;
        }
        $this->db->query("INSERT INTO users (username, password, role, created_at,entity_id) VALUES ('$username','$pass','$role', CURDATE(),$entity)");
        return mysql_insert_id();
    }
    protected function addPupil($pupilgroup, $number, $pnum, $studygroup,$forename,$surname){
        $user = $this->createUser('pupil',$forename.'.'.($surname?$surname:"_"), $this->generate_password(10));
        $so = $this->getSortOrder('pupil');

        $this->db->query("INSERT INTO pupil (pupilgroup_id,user_id,sort_order,forename,lastname) VALUES ($pupilgroup, $user,$so,'$forename','$surname')");
        $pupil = mysql_insert_id();

        $this->db->query("INSERT INTO pupil_pupilgroup (pupilgroup_id,pupil_id) VALUES ($pupilgroup, $pupil)");

        $this->addPupilToStgs($pupil,$pupilgroup);
        $this->createPupilSubmissionSlot($pupil,$pupilgroup);
        for($i=0; $i<$pnum; $i++){
            $this->addParent($pupil,$i,$forename,$surname);
        }
        return "pupil_".$pupil;
    }

    protected function removePupilFromStgs($pupil){
        $this->db->query("DELETE FROM pupil_studygroup WHERE pupil_id=$pupil");
        $this->db->query("DELETE FROM pupli_submission_slot WHERE pupil_id=$pupil");
    }

    protected function addPupilToStgs($pupil,$pupilgroup){
        $result = $this->db->query("SELECT studygroup_id FROM studygroup_pupilgroup WHERE pupilgroup_id = $pupilgroup");
        while($row = mysql_fetch_assoc($result)){
            $this->db->query("INSERT INTO studygroup_grades (studygroup_id) VALUES ({$row['studygroup_id']})");
            $grade = mysql_insert_id();
            $this->db->query("INSERT INTO pupil_studygroup (pupil_id,studygroup_id,grades_id) VALUES ($pupil,{$row['studygroup_id']},$grade)");
        }
    }

    protected function addStaff($i,$forename,$surname){
        $entity = $this->user->entity;
        $user = $this->createUser('staff',$forename.'.'.($surname?$surname:"_"), $this->generate_password(10));
        $so = $this->getSortOrder('staff_members');
/*        $forename = dlang("forename_title","forename");
        $surname = dlang("surname_title","surname");*/

        $this->db->query("INSERT INTO staff_members (user_id, sort_order,entity_id,fore_name,last_name) VALUES ($user,$so,$entity,'$forename','$surname')");
        $staff = mysql_insert_id();
        return "staffmember_".$staff;
    }

    protected function addParent($pupil, $i,$forename,$surname){
        $user = $this->createUser('parent',$forename.'.'.($surname?$surname:"_"), $this->generate_password(10));

        $this->db->query("INSERT INTO parents (pupil_id, user_id,forename,lastname) VALUES ($pupil,$user,'$forename','$surname')");
        $parent = mysql_insert_id();
        return "parent_".$parent;
    }

    protected function addPupilgroup($name, $year){
        $entity = $this->user->entity;
        $this->db->query("INSERT INTO pupilgroups (title_en, year_id,entity_id) VALUES ('$name',$year,$entity)");
        $pupilgr = mysql_insert_id();
        return "pupilgroup_".$pupilgr;
    }

    protected function addProgramme($name){
        //$this->addLogItem('Programme',$name);
        $entity = $this->user->entity;
        $this->db->query("INSERT INTO programmes (title_en,entity_id) VALUES ('$name',$entity)");
        $programme = mysql_insert_id();
/*        $title = $name.' '.$programme;
        $this->db->query("UPDATE programmes SET title_en='$title' WHERE programme_id=$programme");*/
        return "programme_".$programme;
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
                        case "years":
                            $response = $this->editYearName($name,$id);
                            break;
                    }
                    break;
                case "move":
                    $response = $this->moveItem($ids,$act[1],$sid,$lid,$par);
                    break;
                case "movedupl":
                    $response = $this->moveDublObjectiveItem($ids,$act[1],$sid,$lid,$par);
                    break;

            }
            return $response;
        }else{
            return false;
        }
    }
}
?>