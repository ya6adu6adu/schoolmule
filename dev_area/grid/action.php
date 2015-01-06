<?php    
	require("libs/Connection.php");
	require("libs/CourseRooms.php");
	if (!isset($_GET["control_id"])){
		$status = array(
			"error" => 1,
			"message" => "Incorrect control id"
		);
		header("content-type:application/json;charset=UTF-8");
		echo(json_encode($status));
		die();
	}

	switch($_GET["control_id"]){
		case "nav_course_rooms":
			render();
		break;
		case "form_pupils":	
			header("content-type:text/xml;charset=UTF-8");
			require_once('libs/FormPupils.php');
			$fp = new FormPupils();
		case "update":
			require_once('libs/AssignmentsGrid.php');
			$grid = new AssignmentsGrid();	
		case "combo":
			require_once('libs/combo.php');
		break;
	}