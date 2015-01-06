<?php

class grid_assignments_tree {

    private $db = false;
    
    public function __construct() {
        $this->db = Connection::getDB();      
        error_reporting(E_ALL ^ E_NOTICE);
        switch ($_POST['action']) {
            case 'delete_resultset':               
                $this->deleteResultset($_POST['assignment']);
                break;
            case 'add_resultset':
                $this->addResultset($_POST['assignment']);
                break;
            case 'addrunit':
                $this->addResultUnit($_POST['name'],$_POST['rset']);
                break;
            case 'editrunit':
                $this->editResultUnit($_POST['id'],$_POST['value']);
                break;
            case 'editrset':
                $this->editResultSet($_POST['id'],  $_POST['data']);
                break;
            case 'clear_results':
                 $this->ClearResults($_POST['id']);
                break;
            default:
                if ($_GET['id'])
                    $this->getAssignmentsGrid($_GET['id']);
                else echo 'false';
                break;
        }     
    }
    
    private function editResultSet($id, $data){
        if (isset($data['unit'])){
            $this->db->query("UPDATE resultsets SET result_unit_id ='".$data['unit']."' WHERE resultset_id=$id");
        }
        if (isset($data['max'])){
            $this->db->query("UPDATE resultsets SET result_max ='".$data['max']."' WHERE resultset_id=$id");
        }
        if (isset($data['pass'])){
            $this->db->query("UPDATE resultsets SET result_pass ='".$data['pass']."' WHERE resultset_id=$id");
        }
        if (isset($data['mandatory'])){
            echo "asdasdasdasdsad";
            echo $data['mandatory'];
            $dat = '0';
            if ($data['mandatory']=='true') $dat='1';
            $this->db->query("UPDATE resultsets SET mandatory ='".$dat."' WHERE resultset_id=$id");
        }
        if (isset($data['custom_name'])){
            $this->db->query("UPDATE resultsets SET castom_name ='".$data['custom_name']."' WHERE resultset_id=$id");
        }
        
    }
    
    private function getAssignmentsGrid($assignment){
        header("Content-type:text/xml");
        print('<?xml version="1.0" encoding="UTF-8"?>');        
        $result = $this->db->query("SELECT * FROM resultsets WHERE assignment_id=$assignment");        
        echo '<rows>';  
        $rerfs = $this->getAssignmentsArray($result);
        $this->outAssignmentsArray($rerfs);
        echo "<row id='addresultbtn'><cell colspan='2' image='add.png'>".dlang("runit_grid_menu_add", "Add new result unit")."</cell></row>";
        echo '</rows>';
    }   
    
    private function getAssignmentsArray($result){
        $rows = array();      

        while ($row = mysql_fetch_assoc($result)) {
            $id = $row['resultset_id'];
            if ($id && !$rows[$id]){
            $rows[$id]['castom_name'] = $row['castom_name'];
            $rows[$id]['c'] = array(//childs
                'result_unit_id'=> $row['result_unit_id'],
                'result_max'=> $row['result_max'],                
                'result_pass'=> $row['result_pass'],
                'mandatory'=> $row['mandatory'],
                'objectives' => array()
            );           
            
            $sql = "SELECT studygroups.studygroup_id AS id, studygroups.title_en AS title FROM resultsets_studygroups,studygroups WHERE resultsets_studygroups.resultset_id=$id AND studygroups.studygroup_id = resultsets_studygroups.studygroup_id";
            $std_groups = $this->db->query($sql);
            $p_obj = &$rows[$id]['c']['objectives'];
                while ($stg = mysql_fetch_assoc($std_groups)) {
                    $p_obj[$stg['id']]=array(
                        'title_en' => $stg['title'],
                        'objectives' => array()
                    );
                     $sql2 = "SELECT course_objectives.objective_id AS id, course_objectives.title_en as co_title FROM resultset_to_course_objectives, course_objectives 
			 WHERE resultset_to_course_objectives.objective_id=course_objectives.objective_id AND resultset_to_course_objectives.resultset_id=$id AND resultset_to_course_objectives.type='assignment'";
                     $objectives = $this->db->query($sql2);
                     while ($objv = mysql_fetch_assoc($objectives)) {
                        $p_obj[$stg['id']]['objectives'][$objv['id']] = array('title_en' => $objv['co_title']);
                     }
                }                               
            }
        }     
        return $rows;
    }
    
    private function outAssignmentsArray($rerfs){
        //var_dump($rerfs);die;
        $u_type =array(
            "1" => dlang("runit_selectoption1","Points"), 
            "2" => dlang("runit_selectoption2","Percent"),
            "3" => dlang("runit_selectoption3","Grade"),
            "4" => dlang("runit_selectoption4","Pass")
        );
        $titles =
                dlang("runit_cname", "Custom unit name") . ',' 
                . dlang("runit_grid_runit", "Assignment result units") . ',' 
                . dlang("runit_grid_max", "Max") . ',' 
                . dlang("runit_grid_pass", "Pass") . ',' 
                . dlang("runit_grid_mandat", "Mandatory") .',' 
                . dlang("runit_grid_stgs", "Studygroup") . ',' 
                . dlang("runit_grid_co", "Course objectives") . ' ' 
                . dlang("runit_grid_click_info", "(click cell to assign objectives)") . ',';

        foreach ($rerfs as $key => $row) {
            echo '<row id="runit_'.$key.'">';
            echo '<cell colspan="2" style="color:rgb(73, 74, 75);" bgColor="#FFFFFF"  image="result_unit.png">'.$row['castom_name'].'</cell>';           
            echo '<row id="runit_'.$key.'_attr_unit">';
            echo '<cell style="color:rgb(73, 74, 75);" bgColor="#FFFFFF" image="result_unit_type.png" >' 
                . dlang("runit_grid_runit", "Assignment result units") 
            . '</cell>';
            echo '<cell type="co" xmlcontent="1">'.$u_type[$row['c']['result_unit_id']].
                '<option value="1">'.$u_type[1].'</option>
                <option value="2">'.$u_type[2].'</option>
                <option value="3">'.$u_type[3].'</option>
                <option value="4">'.$u_type[4].'</option>              
            </cell>	';
            echo '</row>';
            $max_style = "";
            $pass_style = "";
            $res_un_id = $row['c']['result_unit_id'];
            if ($res_un_id==1 || $res_un_id==2|| $res_un_id==3){
                $max_style = 'background-color: rgb(240, 240, 238)';
                if ($res_un_id==3 || $res_un_id ==4){
                    $pass_style = 'background-color: rgb(240, 240, 238)';
                }
            }
            echo '<row id="runit_'.$key.'_attr_max">';
            echo '<cell  style="color:rgb(73, 74, 75);" bgColor="#FFFFFF"  image="max.png" >' 
                . dlang("runit_grid_max", "Max")
            . '</cell>';
             echo '<cell  style="color:rgb(73, 74, 75);'.$max_style.'" bgColor="#FFFFFF"  >' 
                . $row['c']['result_max']
            . '</cell>';
            echo '</row>';
            
            echo '<row id="runit_'.$key.'_attr_pass">';
            echo '<cell  style="color:rgb(73, 74, 75);" bgColor="#FFFFFF"  image="pass.png" >' 
                . dlang("runit_grid_pass", "Pass")
            . '</cell>';
             echo '<cell  style="color:rgb(73, 74, 75);'.$pass_style.'" bgColor="#FFFFFF"  >' 
                . $row['c']['result_pass']
            . '</cell>';
            echo '</row>';
            
            echo '<row  id="runit_'.$key.'_attr_mandatory">';
            echo '<cell  style="color:rgb(73, 74, 75);" bgColor="#FFFFFF"  image="mandatory.png" >' 
                . dlang("runit_grid_mandat", "Mandatory")
            . '</cell>';
             echo '<cell type="ch" style="color:rgb(73, 74, 75);" bgColor="#FFFFFF">' 
                . $row['c']['mandatory']
            . '</cell>';
            echo '</row>';
            
            echo '<row  id="runit_'.$key.'_attr_obj">';
            echo '<cell  colspan="2" style="color:rgb(73, 74, 75);" bgColor="#FFFFFF"  image="objective.png" >' 
                . dlang("runit_grid_co", "Course objectives")
            . '</cell>';     
            foreach ($row['c']['objectives'] as $stg_key => $stg_val){ //studygroup iteration
                echo '<row  id="runit_'.$key.'_c_stg_'.$stg_key.'">';
                echo '<cell colspan="2" style="color:rgb(73, 74, 75);" bgColor="#FFFFFF" image="studygroup.png">' 
                    .$stg_val['title_en']
                . '</cell>';
                foreach ($stg_val['objectives'] as $o_key => $o_val){ //objectives iteration
                    echo '<row id="runit_'.$key.'_c_obj_'.$o_key.'">';
                    echo '<cell colspan="2" style="color:rgb(73, 74, 75);" bgColor="#FFFFFF"  image="objective.png" >' 
                        .$o_val['title_en']
                    . '</cell><cell></cell>';
                    echo '</row>';
                }
                echo '<row id="addresobjbtn_'.$key.'"><cell colspan="2" image="add.png">'.dlang("runit_grid_assign_object", "Assign objectives").'</cell><cell ></cell></row>';
                echo '</row>';
            }               
            echo '</row>';
            echo '</row>';
        }
    }

    private function ClearResults($id) {
        $this->db->query("UPDATE pupil_submission_result SET result = NULL WHERE result_set_id = $id");
        echo 1;
    }

    private function editResultUnit($unit, $val) {
        $this->db->query("UPDATE result_units SET result_unit_en='$val' WHERE result_unit_id=$unit");
        //$this->db->query("UPDATE resultsets SET result_unit_id = $val WHERE result_unit_id IN ('$unit')");
        echo 1;
    }

    private function addResultUnit($name, $rset) {
        $this->db->query("INSERT INTO result_units (result_unit_en) VALUES ('$name')");
        $runit = mysql_insert_id();
        $this->db->query("UPDATE resultsets SET result_unit_id = $runit WHERE resultset_id=$rset");
        echo $runit;
    }

    private function deleteResultset($id) {
        $sql = "DELETE resultsets, pupil_submission_result FROM resultsets,pupil_submission_result WHERE resultsets.resultset_id=$id AND pupil_submission_result.result_set_id=$id AND resultsets.resultset_id = pupil_submission_result.result_set_id";
        $result = $this->db->query($sql);
    }

    private function addResultset($id) {
        $this->db->query("START TRANSACTION");
        $sql = "INSERT INTO resultsets (assignment_id,result_unit_id) VALUES($id,1)";
        $this->db->query($sql);
        $rs = mysql_insert_id();
        $sql = "SELECT submission_slot_id, studygroup_id FROM pupli_submission_slot WHERE assignment_id=$id";
        $result = $this->db->query($sql);
        $stg = null;

        while ($row = mysql_fetch_assoc($result)) {
            $stg = $row['studygroup_id'];
            $this->db->query("INSERT INTO pupil_submission_result (submission_slot_id,result_set_id,studygroup_id) VALUES ({$row['submission_slot_id']},$rs,{$row['studygroup_id']})");
        }

        if ($stg) {
            $sql = "SELECT objective_id FROM course_objectives WHERE studygroup_id=$stg";
            $result = $this->db->query($sql);
            while ($row = mysql_fetch_assoc($result)) {
                $this->db->query("INSERT INTO resultset_to_course_objectives (resultset_id,objective_id,type) VALUES ($rs,{$row['objective_id']},'assignment')");
            }

            $sql = "UPDATE resultsets SET studygroup_ids = $stg WHERE resultset_id=$rs";

            $this->db->query($sql);
            $this->db->query("INSERT INTO resultsets_studygroups (resultset_id,studygroup_id) VALUES ($rs, $stg)");
        }

        $this->db->query("COMMIT");
    }
}

?>