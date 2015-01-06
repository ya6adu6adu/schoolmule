<?php
	require("dhtmlx/dhtmlxConnector/php/codebase/combo_connector.php");
 
	$res=mysql_connect("localhost","Chehow","1");
	mysql_select_db("schoolmule");
	
	$data = new ComboConnector($res, "MySQL");
	
	$data->render_table("result_units","result_unit_id","result_unit_id, result_unit_en"); 
	
?>