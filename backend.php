<?php
    require_once 'libs/lang.php';
	$params = array(
		'controls' => array('tabs','layout','grid','settings','window','form'),
    		'instances' => array('grid_admins','grid_customers','grid_educ_entities','form_settings','window_greed_tree'),
    		'title' => dlang("browser_tab_backend","Backend setup"),
    		'top_title' => 'SchoollMule Backend'
    	);
    	include_once '__pages.php';

	
	 