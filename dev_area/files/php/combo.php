<?php
	require("../dhtmlx/php_connector/codebase/combo_connector.php");
 
	$res=mysql_connect("localhost","root","");
	mysql_select_db("schoolmule");
	
	$data = new ComboConnector($res, "MySQL");
	
	$data->render_table("result_units","result_unit_id","result_unit_id, result_unit_en"); 
	
?>