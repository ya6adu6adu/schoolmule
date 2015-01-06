<?php
	require("../dhtmlx/dhtmlxConnector/php/codebase/grid_config.php");
	require("../dhtmlx/dhtmlxConnector/php/codebase/grid_connector.php");
	require("../dhtmlx/dhtmlxConnector/php/codebase/options_connector.php");
	
 	class grid_result_annotate{
		private $db = false;
		public function __construct(){
            $this->user = new administrator();
            $this->db = Connection::getDB();
            error_reporting(E_ALL ^ E_NOTICE);
            if(!isset($_POST['action'])){
                $this->getAnnotateGrid($_GET['id'],$_GET['assign']);
                return true;
            }
            switch ($_POST['action']) {
                case 'remove':
                    $this->removePerformance($_POST['id']);
                    break;
                case 'editresult':
                    $this->editResult($_POST['id'],$_POST['value'],$_POST['pass']);
                    break;
                case 'editgrade':
                    $this->editGrade($_POST['id'],$_POST['value']);
                    break;
                default:
                    $this->getAnnotateGrid($_GET['id'],$_GET['assign']);
                    break;
            }
		}
        private function getAnnotateGrid($id,$assign){
            $result = $this->db->query("
					SELECT resultsets.result_max as max, resultsets.result_pass as pass, resultsets.result_unit_id as unit,
					 resultsets.castom_name as name ,pupil_submission_result.result as res,
					 pupil_submission_result.pupil_submission_result_id as res_id,
					 pupil_submission_result.assessment as assessment
					FROM pupil_submission_result, resultsets,pupli_submission_slot
					WHERE pupli_submission_slot.pupil_id = $id
					AND pupil_submission_result.submission_slot_id = pupli_submission_slot.submission_slot_id
					AND pupil_submission_result.result_set_id = resultsets.resultset_id
					AND pupli_submission_slot.assignment_id = $assign

            ");

            header("Content-type:text/xml");
            print('<?xml version="1.0" encoding="UTF-8"?>');
            echo '<rows>';
            while($row = mysql_fetch_assoc($result)){
                $cell = "<cell>".$row['res']."</cell>";
                if($row['unit']==3){
                    $cell = '<cell type="co" xmlcontent="1" bgColor="#FEF5CA">'.$row['res'].'<option value="'."A".'">'."A".'</option>
                        <option value="B">'."B".'</option>
                        <option value="C">'."C".'</option>
                        <option value="D">'."D".'</option>
                        <option value="E">'."E".'</option>
                        <option value="F">'."F".'</option>
                        <option value="Fx">'."Fx".'</option>
                        </cell>
					';
                }
                echo
                    "<row id='a_".$row['res_id']."'>
                        <cell>".$row['name']."</cell>
                        <cell>".$row['max']."</cell>
                        <cell>".$row['pass']."</cell>".$cell."
                        <cell>gfx/annotate_add.png</cell>".
                    "<userdata name='unit'>".$row['unit']."</userdata>".
                    "<userdata name='assess'>".$row['assessment']."</userdata>"."
                    </row>";
            }
            echo '</rows>';

        }
    }
?>