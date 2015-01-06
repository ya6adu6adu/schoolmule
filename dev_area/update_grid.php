<?php
	require("../dhtmlx/php_connector/codebase/grid_connector.php");
 
	$res=mysql_connect("localhost","root","");
	mysql_select_db("grid");
	 
	$gridConn = new GridConnector($res,"MySQL");
	
	$gridConn->render_table("assignment","id, unit, max, pass, mandatory, course, objective");
?>