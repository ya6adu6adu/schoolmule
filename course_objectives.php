<?php
	    $params = array(
			'controls' => array('tabs','layout','grid','html','accordeon','grid','tree','editor','window','chart','forum','comments'),
			'instances' => array('html_page','grid_development','grid_runit','grid_search','tree_assessments_overview','tree_assessments_by_studygroup','grid_assess_performance','html_assignments','chart_stats','grid_assess_assignments',
			'grid_assignments_progress','grid_assessment','html_pupil','tree_assessments',
			'html_course_objectives','html_assignments_pupil','html_performance_pupil','tree_course_objectives','tree_assignments_by_status',
			'tree_assignments_by_studygroup','tree_performance','html_submissions','grid_assignments',
			'window_greed_tree','grid_performance','html_performance','grid_grades','html_pupil_assessment_by_stg','assign_stgs_window'),
    		'title' => 'browser_tab_assignemnt',
    		'top_title' => '',
			'name' => 'course_objectives'
    	);

    	include_once '__pages.php';