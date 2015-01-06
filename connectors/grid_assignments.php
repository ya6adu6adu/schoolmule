<?php
	require("../dhtmlx/dhtmlxConnector/php/codebase/grid_config.php");
	require("../dhtmlx/dhtmlxConnector/php/codebase/grid_connector.php");
	require("../dhtmlx/dhtmlxConnector/php/codebase/options_connector.php");
	
 	class grid_assignments{
		private $db = false;
		public function __construct(){
			
			$this->db = Connection::getDB();
			if(!isset($_POST['action'])){
					$conn = $this->db->getConn();
					$gridConn = new GridConnector($conn,"MySQL");
					$gridConn->event->attach(new EditData());
					$assignment = $_GET['item_id'];
				if(!isset($_GET['act'])){
					$config = new GridConfiguration();
					//$config->setHeader("Assignment result units,Max,Pass,Mandatory,Studygroup,Course objectives,");
					$config->setHeader(dlang("runit_cname","Custom unit name").','.dlang("runit_grid_runit","Assignment result units").','.dlang("runit_grid_max","Max").','.dlang("runit_grid_pass","Pass").','.dlang("runit_grid_mandat","Mandatory").
                        ','.dlang("runit_grid_stgs","Studygroup").','.dlang("runit_grid_co","Course objectives").' '.dlang("runit_grid_click_info","(click cell to assign objectives)").',');
					$config->setInitWidthsP("14,15,7,7,7,10,35,5");
					$config->setColTypes("ed,co,ed,ed,ch,ro,ro,img");

                    $config->setColAlign("left,left,left,left,left,left,left,center");
					$config->setColIds("castom_name,result_unit_id,result_max,result_pass,mandatory,course,course_objectives,img");
                    $config->setColColor("#FEF5CA,#FEF5CA,white,white,#FEF5CA,#FEF5CA,#FEF5CA,white");
					$gridConn->set_config($config);
					$options = new OptionsConnector($conn);

					$options->render_table("result_units","result_unit_id","result_unit_id(value),result_unit_en(label)");
					//$gridConn->set_options("result_unit_id",$options);
                    $gridConn->set_options("result_unit_id",array("1" => dlang("runit_selectoption1","Points"), "2"=>dlang("runit_selectoption2","Percent"),
                        "3" => dlang("runit_selectoption3","Grade"),"4" => dlang("runit_selectoption4","Pass")));
				}
				$gridConn->render_sql("SELECT * FROM resultsets WHERE assignment_id=$assignment","resultset_id","castom_name,result_unit_id,result_max,result_pass,mandatory,castom_name");
				//$gridConn->render_table("resultsets","resultset_id","result_unit_id,result_max,result_pass,mandatory");
			}elseif($_POST['action']=='delete_resultset'){
				$this->deleteResultset($_POST['assignment']);
			}elseif($_POST['action']=='add_resultset'){
				$this->addResultset($_POST['assignment']);
			}elseif($_POST['action']=='addrunit'){
                $this->addResultUnit($_POST['name'],$_POST['rset']);
            }elseif($_POST['action']=='editrunit'){
                $this->editResultUnit($_POST['id'],$_POST['value']);
            }elseif($_POST['action']=='clear_results'){
                $this->ClearResults($_POST['id']);
            }

		}

        private function ClearResults($id){
            $this->db->query("UPDATE pupil_submission_result SET result = NULL WHERE result_set_id = $id");
            echo 1;
        }

        private function editResultUnit($unit,$val){
            $this->db->query("UPDATE result_units SET result_unit_en='$val' WHERE result_unit_id=$unit");
            //$this->db->query("UPDATE resultsets SET result_unit_id = $val WHERE result_unit_id IN ('$unit')");
            echo 1;
        }

        private function addResultUnit($name,$rset){
            $this->db->query("INSERT INTO result_units (result_unit_en) VALUES ('$name')");
            $runit = mysql_insert_id();
            $this->db->query("UPDATE resultsets SET result_unit_id = $runit WHERE resultset_id=$rset");
            echo $runit;
        }

		private function deleteResultset($id){
			$sql = "DELETE resultsets, pupil_submission_result FROM resultsets,pupil_submission_result WHERE resultset_id=$id AND resultsets.resultset_id = pupil_submission_result.resultset_id";
			$result = $this->db->query($sql);			
		}

		private function addResultset($id){
			$this->db->query("START TRANSACTION");
			$sql = "INSERT INTO resultsets (assignment_id,result_unit_id) VALUES($id,1)";
			$this->db->query($sql);
			$rs = mysql_insert_id();
			$sql = "SELECT submission_slot_id, studygroup_id FROM pupli_submission_slot WHERE assignment_id=$id";
			$result = $this->db->query($sql);
			$stg = null;

			while($row = mysql_fetch_assoc($result)){
				$stg = $row['studygroup_id'];
				$this->db->query("INSERT INTO pupil_submission_result (submission_slot_id,result_set_id,studygroup_id) VALUES ({$row['submission_slot_id']},$rs,{$row['studygroup_id']})");
			}

            if($stg){
                $sql = "SELECT objective_id FROM course_objectives WHERE studygroup_id=$stg";
                $result = $this->db->query($sql);
                while($row = mysql_fetch_assoc($result)){
                    $this->db->query("INSERT INTO resultset_to_course_objectives (resultset_id,objective_id,type) VALUES ($rs,{$row['objective_id']},'assignment')");
                }

                $sql = "UPDATE resultsets SET studygroup_ids = $stg WHERE resultset_id=$rs";

                $this->db->query($sql);
                $this->db->query("INSERT INTO resultsets_studygroups (resultset_id,studygroup_id) VALUES ($rs, $stg)");
            }

			$this->db->query("COMMIT");
		}	
	}
	
	class EditData{
		private $db = false;
		public function __construct(){
			$this->db = Connection::getDB();
		}

		public function beforeRender($data){
            $runit = $data->get_value("result_unit_id");
            if($runit==1){

            }
            switch($runit){
                case 1:
                    $data->set_cell_style('result_max',"background-color:#FEF5CA !important");
                    $data->set_cell_style('result_pass',"background-color:#FEF5CA !important");
                    break;
                case 2:
                    $data->set_cell_style('result_pass',"background-color:#FEF5CA !important");
                    break;
                case 3:
                    break;
                case 4:
                    break;
                default:
                    $data->set_cell_style('result_max',"background-color:#FEF5CA !important");
                    $data->set_cell_style('result_pass',"background-color:#FEF5CA !important");
            }

            $sgids = array();
			$id = $data->get_value("resultset_id");
			$sql = "SELECT studygroups.studygroup_id, studygroups.title_en FROM resultsets_studygroups,studygroups WHERE resultsets_studygroups.resultset_id=$id AND studygroups.studygroup_id = resultsets_studygroups.studygroup_id";
			$result = $this->db->query($sql);
			while($row = mysql_fetch_assoc($result)){
				$sgids[] = $row['title_en'];
			}

			if(count($sgids)>0){
				$data->set_userdata("course",implode(', ', $sgids));
			}

			$id = $data->get_value("resultset_id");
			
			$sql = "SELECT course_objectives.title_en as co_title FROM resultset_to_course_objectives, course_objectives 
			 WHERE resultset_to_course_objectives.objective_id=course_objectives.objective_id AND resultset_to_course_objectives.resultset_id=$id AND resultset_to_course_objectives.type='assignment'";
			$result = $this->db->query($sql);
			while($row = mysql_fetch_assoc($result)){
				$course_obj[] = $row['co_title'];
			}
			$data->set_userdata("course_objectives",implode(', ', $course_obj));
		}


	}
?>