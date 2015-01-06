<?php
	require_once 'Connection.php';
	
	$db = Connection::getDB();

    $db->query("ALTER TABLE `course_rooms_elements` ADD `published_content` TEXT");
	$db->query("ALTER TABLE `performance` ADD `published_content` TEXT");