<?php
	require("../dhtmlx/php_connector/codebase/grid_connector.php");
 
	$res=mysql_connect("localhost","root","");
	mysql_select_db("schoolmule");
	 
	$gridConn = new GridConnector($res,"MySQL");
	
	$gridConn->render_table("submissions"," select * from result_units,result_unit_id,assignment_id, result_max, result_pass, mandatory,  assessement_id");
?>