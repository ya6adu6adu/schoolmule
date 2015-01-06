<?php
	include ('../connector/scheduler_connector.php');
	include ('config.php');
	
	$res=mysql_connect($server, $user, $pass);
	mysql_select_db($db_name);
	
	$scheduler = new schedulerConnector($res);
	$scheduler->enable_log("absence_events_log.txt", true);

	$absence_types = new OptionsConnector($res);
	// query itself should be updated if needed
	$absence_types->render_sql("SELECT id_absence_type as value, color as label FROM schoolmule_com_absence_types","value","value,label");
	$scheduler->set_options("absence_types", $absence_types);


	if ($scheduler->is_select_mode()) { // if SELECT mode (as we don't need to process update/delete queries)
		$select_query = "
			SELECT
				  CONCAT(ae.id,'_a') as id
				, ae.start_date as start_date
				, ae.end_date as end_date
				, ae.text as text
				, ae.event_id as parent_event
				, ae.absence_type as absence_type
			FROM
				schoolmule_com_absence_events ae
			WHERE 1=1
		";
		$scheduler->render_sql($select_query, "id", "start_date,end_date,text,parent_event,absence_type");		
	}
?>