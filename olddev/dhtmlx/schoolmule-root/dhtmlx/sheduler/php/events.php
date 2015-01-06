<?php
	include ('../connector/scheduler_connector.php');
	include ('config.php');
	
	$res=mysql_connect($server, $user, $pass);
	mysql_select_db($db_name);
	
	$scheduler = new schedulerConnector($res);
	$scheduler->enable_log("events_log.txt",true);

	if ($scheduler->is_select_mode()) { // if SELECT mode (as we don't need to process update/delete queries)
		$select_query = "
			SELECT
				  e.id as id
				, e.start_date as start_date
				, e.end_date as end_date
				, e.text as text
			FROM
				schoolmule_com_events e
			WHERE 1=1
		";
		$scheduler->render_sql($select_query, "id", "start_date,end_date,text");		
	}
	else {
		$scheduler->render_table("schoolmule_com_events","id","start_date,end_date,text");
	}

?>