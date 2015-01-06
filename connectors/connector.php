<?php
	include_once '../libs/lang.php';

	$langXml = null;
	$appPath = "";

	session_start();
	$appPath = '../';
	$lang = $_SESSION['lng'];

	function __autoload($classname) {	
	    $filename = $classname.".php";
		if(!file_exists($filename)){
			$filename="../libs/".$filename;
		}try{
			if(!file_exists($filename)){
				 throw new Exception("control $classname is not exist!");
			}
			include_once($filename);
		}catch (Exception $e){
		   eval("class $classname{}");
		   echo $e->getMessage();
		}	
	}

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
        case "grid_result_annotate":
            $grid = new grid_result_annotate(); break;
        case "tree_export":
            $grid = new tree_export(); break;
        case "grid_development":
            $grid = new grid_development(); break;
        case "grid_runit":
            $grid = new grid_runit(); break;
        case "chart_objectives":
            $grid = new chart_objectives(); break;
        case "grid_search":
            $grid = new grid_search(); break;
        case "tree_programme_structure":
            $tree = new tree_programme_structure(); break;
        case "tree_users":
            $tree = new tree_users();
            $tree->printTree();
            break;
        case "grid_setup_pupils":
            $tree = new grid_setup_pupils(); break;
        case "grid_setup_parents":
            $tree = new grid_setup_parents(); break;
        case "grid_setup_staff":
            $tree = new grid_setup_staff(); break;
        case "grid_setup_pupils_stg":
            $tree = new grid_setup_pupils_stg(); break;
		case "grid_setup_studygroups":
            $tree = new grid_setup_studygroups(); break;
		case "grid_setup_database":
			$tree = new grid_setup_database(); break;
		case "grid_grades":		
			$tree = new grid_grades(); break;
		case "tree_assessments_overview":		
			$tree = new tree_assessments_overview(); break;
		case "tree_assessments_by_studygroup":		
			$tree = new tree_assessments_by_studygroup(); break;
		case "grid_assess_performance":		
			$tree = new grid_assess_performance(); break;
		case "grid_assess_assignments":		
			$tree = new grid_assess_assignments(); break;
		case "chart_stats":		
			$tree = new chart_stats(); break;
		case "tree_window":		
			$tree = new tree_window(); break;
        case "tree_setup_window":
			$tree = new tree_setup_window(); break;
        case "assign_stgs_window":
			$tree = new assign_stgs_window(); break;
        case "assign_pupils_window":
            $tree = new assign_pupils_window(); break;
		case "tree_assessments":		
			$tree = new tree_assessments(); break;
		case "tree_performance":
			$tree = new tree_performance(); break;
		case "tree_assignments_by_status":		
			$tree = new tree_assignments_by_status(); break;	
		case "tree_course_objectives":		
			$tree = new tree_course_objectives(); break;
		case "tree_assignments_by_studygroup":
			$tree = new tree_assignments_by_studygroup(); break;
		case "tree_course_rooms":
			$rooms = new tree_course_rooms(); break;
		case "form_pupils":
			$fp = new form_pupils(); break;
		case "grid_assignments":
			$grid = new grid_assignments();	break;
                case "grid_assignments_tree":
                    $grid = new grid_assignments_tree();	break;
		case "grid_performance":
			$grid = new grid_performance();	break;
		case "grid_assessment":
			$grid = new grid_assessment(); break;
		case "grid_assignments_progress":
			$grid = new grid_assignments_progress(); break;
		case "grid_customers":
			$grid = new grid_customers(); break;
		case "grid_admins":
			$grid = new grid_admins(); break;
		case "grid_educ_entities":
			$grid = new grid_educ_entities(); break;
		case "administrator":
			$admin = new administrator(); break;
		case "form_settings":
			$sett = new form_settings(); break;
		case "grid_labels":
			$grid = new labels_translated_grid();
			break;
	}