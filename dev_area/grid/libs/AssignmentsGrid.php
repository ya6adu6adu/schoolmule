<?php
	require("./../../dhtmlx/dhtmlxConnector/php/codebase/grid_connector.php");
	require("./../../dhtmlx/dhtmlxConnector/php/codebase/options_connector.php");
	
 	class AssignmentsGrid{
		private $db = false;
		public function __construct(){
			$this->db = Connection::getDB();
			$conn = $this->db->getConn();
			$gridConn = new GridConnector($conn,"MySQL");
			
			$options = new OptionsConnector($conn); 
			$options->render_table("result_units","result_unit_id","result_unit_id(value),result_unit_en(label)");
			$gridConn->set_options("result_unit_id",$options);
			
			$gridConn->render_table("resultsets","resultset_id","result_unit_id,result_max,result_pass,mandatory,assignment_id,assessement_id");
		}			
	}
?>