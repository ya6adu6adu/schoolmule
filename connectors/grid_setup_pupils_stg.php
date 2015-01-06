<?php
require("../dhtmlx/dhtmlxConnector/php/codebase/grid_config.php");
require("../dhtmlx/dhtmlxConnector/php/codebase/grid_connector.php");
require("../dhtmlx/dhtmlxConnector/php/codebase/options_connector.php");

class grid_setup_pupils_stg{
    private $db = false;
    private $user = false;
    private $portret_pass = 'images/users/';
    public function __construct(){
        $this->db = Connection::getDB();
        error_reporting(E_ALL ^ E_NOTICE);
        $this->user = new administrator();
        if(!isset($_POST['action'])){
            echo '<?xml version="1.0" encoding="UTF-8"?>';
            echo '<rows>';
            echo $this->getPupils();
            echo '</rows>';
        }else{
            $this->db->query("START TRANSACTION");
            $response = "";
            $response = $this->parseRequest();
            $this->db->query("COMMIT");
            echo json_encode($response);
        }
    }

    function parseRequest(){
        $action = $_POST['action'];
        $act = explode("_", $action);
        switch($act[0]){
            case "add":
                $response = $this->addItem($act[1]);
                break;
            case "delete":
                $response = $this->deleteItem($act[1]);
                break;
            case "setpass":
                $response = $this->setPassword($_POST['user'], $_POST['pass']);
                break;
            case "setusername":
                $response = $this->editUsername($_POST['user'], $_POST['username']);
                break;
            case "editcourse":
                $response = $this->editCourse($_POST['studygroup'], $_POST['course']);
                break;
            case "editpoints":
                $response = $this->editPoints($_POST['studygroup'], $_POST['points']);
                break;
            case "editstartdate":
                $response = $this->editStartdate($_POST['studygroup'], $_POST['startdate']);
                break;
            case "editenddate":
                $response = $this->editEnddtate($_POST['studygroup'], $_POST['enddate']);
                break;
            case "editprogramme":
                $response = $this->editProgrammeName($_POST['name'], $_POST['id']);
                break;
            case "editstudygroup":
                $response = $this->editStudygroupName($_POST['name'], $_POST['id']);
                break;
            case "editpupilgroup":
                $response = $this->editPupilgroupName($_POST['name'], $_POST['id']);
                break;
            case "editstaff":
                $response = $this->editStaffName($_POST['name'], $_POST['id']);
                break;
            case "editpupilname":
                $response = $this->editPupilName($_POST['name'], $_POST['id']);
                break;
            case "editpupilsurname":
                $response = $this->editPupilSurName($_POST['name'], $_POST['id']);
                break;
            case "editpupilid":
                $response = $this->editPupilId($_POST['name'], $_POST['id']);
                break;
            case "editparent":
                $response = $this->editParentName($_POST['name'], $_POST['id']);
                break;
            case "getlogs":
                $response = $this->getLogs();
                break;
            case "editgoal":
                $response = $this->editGoal($_POST['name'], $_POST['id']);
                break;
            case "editprognose":
                $response = $this->editPrognose($_POST['name'], $_POST['id']);
                break;
            case "editgrade":
                $response = $this->editGrade($_POST['name'], $_POST['id']);
                break;

        }
        return $response;
    }

    protected function editGoal($name,$id){
        $this->db->query("UPDATE studygroup_grades SET goal = '$name' WHERE studygroup_grades_id=$id");
        return array('edit' => 1);
    }
    protected function editPrognose($name,$id){
        $this->db->query("UPDATE studygroup_grades SET prognose = '$name' WHERE studygroup_grades_id=$id");
        return array('edit' => 1);
    }
    protected function editGrade($name,$id){
        $this->db->query("UPDATE studygroup_grades SET grade = '$name' WHERE studygroup_grades_id=$id");
        return array('edit' => 1);
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

    protected function getLogs(){
        $logs = array();
        $result = $this->db->query("SELECT * FROM setup_logs");
        while($row = mysql_fetch_assoc($result)){
            $logs[] = array(
                'time' => $row['time'],
                'text' => $row['text'],
                'user' => $row['user']
            );
        }
        return $logs;
    }

    protected function editStaffName($name, $id){
        $user = explode(' ', $name ,2);
        $user[0] = $user[0]?trim($user[0]):"";
        $user[1] = $user[1]?trim($user[1]):"";
        $this->db->query("UPDATE staff_members SET fore_name = '{$user[0]}', last_name = '{$user[1]}' WHERE staff_member_id=$id");
        return array('edit' => 1);
    }

    protected function editPupilName($name, $id){
        $this->db->query("UPDATE pupil SET forename = '$name' WHERE pupil_id=$id");
        return array('edit' => 1);
    }
    protected function editPupilSurName($name, $id){
        $this->db->query("UPDATE pupil SET lastname = '$name' WHERE pupil_id=$id");
        return array('edit' => 1);
    }
    protected function editPupilId($name, $id){
        $this->db->query("UPDATE pupil SET personal_id = '$name' WHERE pupil_id=$id");
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

    protected function editCourse($stg, $course){
        $this->db->query("UPDATE studygroups SET course = '$course' WHERE studygroup_id=$stg");
        return array('edit' => 1);
    }

    protected function editPoints($stg, $points){
        $this->db->query("UPDATE studygroups SET points = '$points' WHERE studygroup_id=$stg");
        return array('edit' => 1);
    }

    protected function editStartdate($stg, $stdate){
        $this->db->query("UPDATE studygroups SET startdate = '$stdate' WHERE studygroup_id=$stg");
        return array('edit' => 1);
    }

    protected function editEnddtate($stg, $edate){
        $this->db->query("UPDATE studygroups SET enddate = '$edate' WHERE studygroup_id=$stg");
        return array('edit' => 1);
    }

    protected function setPassword($user, $pass){
        $this->db->query("UPDATE users SET password = '$pass' WHERE user_id=$user");
        return array('newpass' => 1);
    }

    protected function getProgrammes(){
        $xml = "";
        $result = $this->db->query("SELECT programme_id,title_en FROM programmes");
        while($row = mysql_fetch_assoc($result)){
            $xml.=$this->getProgrammesXml($row['programme_id'],dlang($row['title_en']));
        }
        return $xml;
    }

    protected function getProgrammesXml($id,$name){
        $xml = "";
        $xml .= '<row child="1" id="programme'.'_'.$id.'">';
        $xml .= '<cell></cell><cell image="programme.png">'.dlang("Programme").': '.$name.'</cell>';
        $xml .= $this->getStudyGroup($id);
        $xml .= '</row>';
        return $xml;
    }

    protected function getStudyGroup($id){
        $xml = "";
        $result = $this->db->query("SELECT studygroup_id, title_en, course, startdate, enddate, points FROM studygroups WHERE programme_id=$id");
        while($row = mysql_fetch_assoc($result)){
            $xml.=$this->getStudyGroupXml($row['studygroup_id'],$row['title_en'],$row['course'],$row['startdate'], $row['enddate'],$row['points']);
        }
        return $xml;
    }

    protected function getStudyGroupXml($id,$title,$course,$startdate,$enddate,$points){
        $xml = "";
        $xml .= '<row child="1" id="studygroup'.'_'.$id.'">';
        $xml .= '<cell></cell><cell image="studygroup.png">'.dlang("Studygroup").': '.$title.'</cell><cell>
			</cell><cell></cell><cell></cell><cell></cell><cell></cell><cell></cell><cell>'.$course.'</cell><cell>'.$points.'</cell><cell>'.$startdate.'</cell><cell>'.$enddate.'</cell>';
        $xml .= $this->getStaffMember($id);
        $xml .= $this->getPupilGroups($id);
        $xml .= '</row>';
        return $xml;
    }

    protected function getStaffMember($id){
        $xml = "";
        $result = $this->db->query("SELECT fore_name, active_until, last_name, staff_members.staff_member_id as staff_members, users.user_id as user_id, username, password , users.created_at as created_at
			 FROM studygroup_staff, staff_members, users
			 WHERE studygroup_staff.studygroup_id=$id AND studygroup_staff.staff_member_id = staff_members.staff_member_id AND users.user_id = staff_members.user_id");

        while($row = mysql_fetch_assoc($result)){
            $actUnt = $row['active_until']!='0000-00-00'?$row['active_until']:'No set';
            $xml.=$this->getStaffMemberXml($row['fore_name'],$row['last_name'],$row['staff_members'],$id,'no', $row['created_at'], $row['username'], $row['password'], $actUnt,  $row['user_id']);
        }
        return $xml;
    }

    protected function getStaffMemberXml($fname, $lname, $id, $stg, $content, $added, $login, $pass, $aunit, $user){
        $xml = "";
        $xml .= '<row child="0" id="staffmember'.'_'.$id.'_'.$stg.'">';

        $portrait = $this->portret_pass.'default.jpg';

        if(file_exists('../'.$this->portret_pass.'small_'.$user.'.jpg')){
            $portrait = $this->portret_pass.'small_'.$user.'.jpg';
        }

        $xml .= '
					<cell></cell>
					<cell image="pupil.png">'.dlang("Staff member").': '.$fname.' '.$lname.'</cell>
					<cell>'.$content.'</cell>
					<cell>'.$added.'</cell>
					<cell>'.$login.'</cell>
					<cell>'.$pass.'</cell>
					<cell>'.$aunit.'</cell>
					<cell>'.$portrait.'</cell>
					<userdata name="user">'.$user.'</userdata>
			';
        $xml .= '</row>';
        return $xml;
    }

    protected function getPupilGroups($id){
        $xml = "";
        $result = $this->db->query("
            SELECT pupilgroup_id, title_en
			FROM  pupilgroups
			WHERE  pupilgroups.studygroup_id=$id
        ");

        while($row = mysql_fetch_assoc($result)){
            $xml.=$this->getPupilGroupXml($row['pupilgroup_id'],$row['title_en']);
        }
        return $xml;
    }

    protected function getPupilGroupXml($id,$title){
        $xml = "";
        $xml .= '<row child="1" id="pupilgroup'.'_'.$id.'">';
        $xml .= '<cell></cell><cell image="studygroup.png">'.dlang("Pupilgroup").': '.$title.'</cell>';
        $xml .= $this->getPupils($id);
        $xml .= '</row>';
        return $xml;
    }
    protected function getPupils(){
        $xml = "";
        $item = explode('_',$_GET['selected']);
        $result = null;
        $and = "";
        $entity =  $this->user->entity;

        switch($item[0]){
            case 'pupils':
                $result = $this->db->query("
                    SELECT goal, prognose, grade, grades_id, pupil.pupil_id, forename, lastname,pupil.pupil_image, users.user_id as user_id, username, password , users.created_at as created_at, active_until, personal_id, pupilgroups.title_en as title_en
                    FROM pupil ,users, pupilgroups, studygroup_pupilgroup,studygroup_grades,pupil_studygroup,pupil_pupilgroup
                    WHERE studygroup_grades.studygroup_grades_id = pupil_studygroup.grades_id AND pupil_studygroup.pupil_id = pupil.pupil_id
                    AND users.user_id = pupil.user_id AND pupilgroups.pupilgroup_id = pupil.pupilgroup_id
                    AND pupilgroups.pupilgroup_id = studygroup_pupilgroup.pupilgroup_id AND studygroup_pupilgroup.studygroup_id = {$item[1]} AND pupilgroups.entity_id = $entity
                ");
                break;
            case 'pupilgroup':
                $and = "AND pupil_pupilgroup.pupilgroup_id=".$item[1];
                $result = $this->db->query("
                    SELECT goal, prognose, grade, grades_id, pupil.pupil_id,pupil.pupil_image, forename, lastname, users.user_id as user_id, username, password , users.created_at as created_at, active_until, personal_id, pupilgroups.title_en as title_en
                    FROM pupil ,users, pupilgroups, studygroup_grades,pupil_studygroup,pupil_pupilgroup WHERE studygroup_grades.studygroup_grades_id = pupil_studygroup.grades_id
                    AND pupil_studygroup.pupil_id = pupil.pupil_id
                    AND users.user_id = pupil.user_id AND pupilgroups.entity_id = $entity AND pupil.pupil_id = pupil_pupilgroup.pupil_id  AND pupilgroups.pupilgroup_id = pupil_pupilgroup.pupilgroup_id
                ".$and);
                break;
            case 'pupil':
                $and = "";
                $result = $this->db->query("
                    SELECT GROUP_CONCAT(`pupilgroups`.`title_en` SEPARATOR ',') as title_en, goal, grades_id, prognose, grade, pupil.pupil_id,pupil.pupil_image, forename, lastname, users.user_id as user_id, username, password , users.created_at as created_at, active_until, personal_id
                    FROM pupil ,users, pupilgroups, studygroup_grades,pupil_studygroup,pupil_pupilgroup WHERE studygroup_grades.studygroup_grades_id = pupil_studygroup.grades_id
                    AND pupil_studygroup.pupil_id = pupil.pupil_id
                    AND users.user_id = pupil.user_id AND pupilgroups.entity_id = $entity  AND pupil.pupil_id = pupil_pupilgroup.pupil_id AND pupilgroups.pupilgroup_id = pupil_pupilgroup.pupilgroup_id  AND pupil.pupil_id={$item[1]}
                ".$and." GROUP BY pupil.pupil_id");

                break;
        }

        while($row = mysql_fetch_assoc($result)){
            $xml.=$this->getPupilXml($row['pupil_id'],$row['forename'],$row['lastname'], $row['goal'], $row['prognose'], $row['grade'], $row['user_id'],$row['personal_id'],$row['title_en'],$row['grades_id'],$row['pupil_image']);
        }
        return $xml;
    }

    protected function getPupilXml($id,$name,$lname, $goal, $prognose, $grade, $user,$pid,$pupilgroup,$gid,$image){
        $xml = "";
        $xml .= '<row child="1" id="pupil'.'_'.$id.'">';
/*        $portrait = $this->portret_pass.'default.jpg';
        if(file_exists('../'.$this->portret_pass.'small_'.$user.'.jpg')){
            $portrait = $this->portret_pass.'small_'.$user.'.jpg';
        }*/

        $portrait = $this->portret_pass.'default.jpg';
        $image_size = "small";

        if($image){
            $portrait = $this->portret_pass.$image_size.'_'.$image;
        }


        $xml .= '<cell></cell>
			        <cell>'.$name.'</cell>
			        <cell>'.$lname.'</cell>
			        <cell>'.$pid.'</cell>
			        <cell>'.$pupilgroup.'</cell>
					<cell>'.$portrait.'</cell>
                    <cell type="co" xmlcontent="1">'.$goal.'<option value="'.dlang("1").'">'.dlang("A").'</option>
                        <option value="2">'.dlang("B").'</option>
                        <option value="3">'.dlang("C").'</option>
                        <option value="4">'.dlang("D").'</option>
                        <option value="5">'.dlang("E").'</option>
                        <option value="6">'.dlang("F").'</option>
                        <option value="7">'.dlang("Fx").'</option>
					</cell>
                    <cell type="co" xmlcontent="1">'.$prognose.'<option value="'.dlang("1").'">'.dlang("A").'</option>
                        <option value="2">'.dlang("B").'</option>
                        <option value="3">'.dlang("C").'</option>
                        <option value="4">'.dlang("D").'</option>
                        <option value="5">'.dlang("E").'</option>
                        <option value="6">'.dlang("F").'</option>
                        <option value="7">'.dlang("Fx").'</option>
					</cell>
                    <cell type="co" xmlcontent="1">'.$grade.'<option value="'.dlang("1").'">'.dlang("A").'</option>
                        <option value="2">'.dlang("B").'</option>
                        <option value="3">'.dlang("C").'</option>
                        <option value="4">'.dlang("D").'</option>
                        <option value="5">'.dlang("E").'</option>
                        <option value="6">'.dlang("F").'</option>
                        <option value="7">'.dlang("Fx").'</option>
					</cell>
					<userdata name="user">'.$user.'</userdata>
					<userdata name="gid">'.$gid.'</userdata>
		    ';
        $xml .= '</row>';
        return $xml;
    }

    protected function addItem($type){
        $col = (int) $_POST['col'];
        $added = array();
        switch ($type) {
            case 'pupil':
                for($i=0; $i<$col; $i++){
                    $added[] = $this->addPupil($_POST['pupilgroup'],$_POST['studygroup'], $_POST['parentnum'],$i);
                }
                break;
            case 'pupilgroup':
                for($i=0; $i<$col; $i++){
                    $added[] = $this->addPupilgroup($_POST['name'], $_POST['stg']);
                }
                break;
            case 'parent':
                for($i=0; $i<$col; $i++){
                    $added[] = $this->addParent($_POST['pupil'],$i);
                }
                break;
            case 'staff':
                for($i=0; $i<$col; $i++){
                    $added[] = $this->addStaff($_POST['stg'],$i);
                }
                break;
            case 'studygroup':
                for($i=0; $i<$col; $i++){
                    $added[] = $this->addStudygroup($_POST['name'], $_POST['programme']);
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
        switch ($type) {
            case 'pupil':
                $response = $this->deletePupil($_POST['id']);
                break;
            case 'pupilgroup':
                $response = $this->deletePupilgroup($_POST['id']);
                break;
            case 'parent':
                $response = $this->deleteParent($_POST['id']);
                break;
            case 'staffmember':
                $response = $this->deleteStaff($_POST['id']);
                break;
            case 'programme':
                $response = $this->deleteProgramme($_POST['id']);
                break;
            case 'studygroup':
                $response = $this->deleteStudygroup($_POST['id']);
                break;
            case 'checked':
                $response = $this->deleteChecked($_POST['checked']);
                break;
            default:
                break;
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

    protected function editUsername($user, $username){
        $sql = "SELECT user_id FROM users WHERE username = '$username'";
        $result = $this->db->query($sql);
        if(mysql_num_rows($result) == 0){
            $sql = "UPDATE users SET username = '$username'  WHERE user_id = $user";
            $this->db->query($sql);
            return 1;
        }else{
            return 0;
        }
    }

    protected function deletePupil($id){
        $this->db->query("
			 DELETE pupil, users, pupil_studygroup
				 FROM pupil, users, pupil_studygroup
				 WHERE pupil.pupil_id={$id}
				 AND pupil.user_id = users.user_id
				 AND pupil_studygroup.pupil_id = {$id}
			");

        $this->db->query("
			    DELETE FROM parents WHERE pupil_id=$id
			");

        return array('delete' => 1);
    }

    protected function deletePupilgroup($id){
        $this->db->query("
                DELETE pupilgroups FROM pupilgroups WHERE pupilgroups.pupilgroup_id={$id}
			");
        return array('delete' => 1);
    }

    protected function deleteParent($id){
        $this->db->query("
				 DELETE parents,users FROM parents,users WHERE parents.parent_id={$id} AND users.user_id = parents.user_id;
			");
        return array('delete' => 1);
    }

    protected function deleteStaff($id){
        $this->db->query("
				 DELETE staff_members, users FROM staff_members, users WHERE staff_members.staff_member_id={$id} AND users.user_id = staff_members.user_id;
			");
        return array('delete' => 1);
    }

    protected function deleteProgramme($id){
        $this->db->query("
				DELETE FROM programmes WHERE programme_id=$id
			");

        /*
        $this->db->query("
            DELETE programmes,studygroups,parents,users,pupilgroups, pupil FROM programmes,studygroups,parents,users,pupilgroups, pupil WHERE programmes.programme_id=$id
             AND studygroups.programme_id = programmes.programme_id
             AND pupilgroups.studygroup_id = studygroups.studygroup_id
             AND pupil.pupilgroup_id = pupilgroups.pupilgroup_id
             AND users.user_id = pupil.user_id
        ");
        */
        return array('delete' => 1);
    }

    protected function deleteStudygroup($id){
        $this->db->query("
				 DELETE FROM studygroups WHERE studygroup_id=$id
			");
        return array('delete' => 1);
    }

    protected function createUser($role,$username,$pass){
        $this->db->query("INSERT INTO users (username, password, role, created_at) VALUES ('$username','$pass','$role', CURDATE())");
        return mysql_insert_id();
    }

    protected function addPupil($pupilgroup, $studygroup, $pnum, $number){
        $user = $this->createUser('pupil', 'pupil'.time().$number, $this->generate_password(10));
        $this->db->query("INSERT INTO pupil (pupilgroup_id, studygroup_id,user_id) VALUES ($pupilgroup, $studygroup, $user)");
        $pupil = mysql_insert_id();
        $this->db->query("INSERT INTO pupil_studygroup (pupil_id, studygroup_id) VALUES ($pupil,$studygroup)");
        for($i=0; $i<$pnum; $i++){
            $this->addParent($pupil,$i);
        }
        return "pupil_".$pupil;
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

    protected function addStaff($stg, $i){
        $user = $this->createUser('staff','staff'.time().$i, $this->generate_password(10));
        $this->db->query("INSERT INTO staff_members (user_id) VALUES ($user)");
        $staff = mysql_insert_id();
        $this->db->query("INSERT INTO studygroup_staff (studygroup_id, staff_member_id) VALUES ($stg, $staff)");
        return "staffmember_".$staff;
    }

    protected function addParent($pupil, $i){
        $user = $this->createUser('parent','parent'.time().$i, $this->generate_password(10));
        $this->db->query("INSERT INTO parents (pupil_id, user_id) VALUES ($pupil,$user)");
        $parent = mysql_insert_id();
        return "parent_".$parent;
    }

    protected function addPupilgroup($name, $stg){
        $this->db->query("INSERT INTO pupilgroups (title_en, studygroup_id) VALUES ('$name',$stg)");
        $pupilgr = mysql_insert_id();
        return "pupilgroup_".$pupilgr;
    }

    protected function addStudygroup($name, $programme){
        $this->db->query("INSERT INTO studygroups (title_en, programme_id) VALUES ('$name', $programme)");
        $pupilgr = mysql_insert_id();
        return "studygroup_".$pupilgr;
    }

    protected function addProgramme($name){
        $this->addLogItem('Programme',$name);
        $this->db->query("INSERT INTO programmes (title_en) VALUES ('$name')");
        $programme = mysql_insert_id();
        return "programme_".$programme;
    }

}
?>