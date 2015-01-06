<?php
	require("../dhtmlx/dhtmlxConnector/php/codebase/grid_config.php");
	require("../dhtmlx/dhtmlxConnector/php/codebase/grid_connector.php");
	require("../dhtmlx/dhtmlxConnector/php/codebase/options_connector.php");
	
 	class grid_grades{
		private $db = false;
		public function __construct(){
			$this->db = Connection::getDB();
			$conn = $this->db->getConn();
            $pupil = $_GET['item_id'];
			$gridConn = new GridConnector($conn,"MySQL");
			$gridConn->event->attach(new EditData());
			$config = new GridConfiguration();
			
			$config->setColIds("studygroup_id,goal,prognose,grade");
			$config->setInitWidthsP("40,20,20,20");
			$config->setColTypes("ro,co,co,co");
			$config->setColSorting("str,str,str,str");

			$config->setHeader(dlang("Studygroup").','.dlang("Goal").','.dlang("Prognose").','.dlang("Grade"));
			
			$gridConn->set_config($config);
			$options = new OptionsConnector($conn); 
			$options->render_table("grade_definition","grade_definition_id","grade_definition_id(value),title_en(label)");
			$gridConn->set_options("goal",$options);
			$gridConn->set_options("prognose",$options);
			$gridConn->set_options("grade",$options);
            if($_GET['editing']){
                $gridConn->render_table("studygroup_grades","studygroup_grades_id","goal,prognose,grade");
            }else{
                $gridConn->render_sql("SELECT studygroups.title_en as studygroup_id,goal,prognose,grade,studygroup_grades_id
                FROM studygroups,studygroup_grades,pupil_studygroup
                WHERE studygroups.studygroup_id = studygroup_grades.studygroup_id
                AND pupil_studygroup.grades_id = studygroup_grades.studygroup_grades_id
                AND pupil_studygroup.pupil_id = $pupil",
                "studygroup_grades_id","studygroup_id,goal,prognose,grade");
            }

		}			
	}

	class EditData{
		private $db = false;
		public function __construct(){
			$this->db = Connection::getDB();
		}
        /*
		public function beforeRender($data){
			$id = $data->get_value("studygroup_id");
			$sql = "SELECT title_en FROM studygroups WHERE studygroup_id=$id";
			$result = $this->db->query($sql);
			while ($row = mysql_fetch_assoc($result)) {
				$data->set_value("studygroup_id",$row['title_en']);
			}
		}
        */
	}
?>