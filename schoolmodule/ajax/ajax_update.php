<?php
//include file with settings connecting to database
include ("../config.php");
include ("../dbconn.php");
include ("../../libs/lang.php");
include ("../../libs/Connection.php");
include ("../../libs/administrator.php");

session_start();
$langXml = null;
$appPath = '../../';
$lang = $_SESSION['lng'];
$user = new administrator();

//***************************************************************************************
//select wich pupil hide in treehidden
if( $_REQUEST['action'] == 'hide_pupil' ){
	$res = mysql_query("SELECT * FROM `hidepupil` WHERE `pupil_id`='{$_REQUEST['id']}'")or die(mysql_error());
	$row = mysql_fetch_assoc($res);
	
	if( !$row['hidepupil_id'] )
		mysql_query("INSERT INTO `hidepupil`(`pupil_id`,`studygroup_id`,`hidden`) VALUE('{$_REQUEST['id']}','{$_REQUEST['studyGroupId']}','1')")or die(mysql_error());
}
//select wich pupil show in treehidden
if( $_REQUEST['action'] == 'show_pupil' ){
	$res = mysql_query("SELECT * FROM `hidepupil` WHERE `pupil_id`='{$_REQUEST['id']}'")or die(mysql_error());
	$row = mysql_fetch_assoc($res);
	
	if( $row['hidepupil_id'] )
		mysql_query("DELETE FROM `hidepupil` WHERE `hidepupil_id`='{$row['hidepupil_id']}'")or die(mysql_error());
}
//***************************************************************************************
//select wich group(s) hide in treehidden
if( $_REQUEST['action'] == 'hide_group' ){
	$res = mysql_query("SELECT * FROM `hidegroup` WHERE `objectivegroup_id`='{$_REQUEST['groupId']}'")or die(mysql_error());
	$row = mysql_fetch_assoc($res);
	
	if( !$row['hidegroup_id'] )
		mysql_query("INSERT INTO `hidegroup`(`objectivegroup_id`,`pupil_id`,`studygroup_id`,`course_id`) VALUE('{$_REQUEST['groupId']}','{$_REQUEST['pupilId']}','0','0')")or die(mysql_error());
}
//select wich group(s) show in treehidden
if( $_REQUEST['action'] == 'show_group' ){
	$res = mysql_query("SELECT * FROM `hidegroup` WHERE `studygroup_id`='{$_REQUEST['groupId']}'")or die(mysql_error());
	$row = mysql_fetch_assoc($res);
	
	if( $row['hidegroup_id'] )
		mysql_query("DELETE FROM `hidegroup` WHERE `hidegroup_id`='{$row['hidegroup_id']}'")or die(mysql_error());
}

//***************************************************************************************
//select wich objective(s) hide in treehidden
if( $_REQUEST['action'] == 'hide_objective' ){
	$res = mysql_query("SELECT * FROM `hideobjective` WHERE `objective_id`='{$_REQUEST['objectiveId']}'")or die(mysql_error());
	$row = mysql_fetch_assoc($res);
	
	if( !$row['hideobjective_id'] )
		mysql_query("INSERT INTO `hideobjective`(`objective_id`,`pupil_id`,`studygroup_id`,`course_id`) VALUE('{$_REQUEST['objectiveId']}','{$_REQUEST['pupilId']}','0','0')")or die(mysql_error());
}
//select wich objective(s) show in treehidden
if( $_REQUEST['action'] == 'show_objective' ){
	$res = mysql_query("SELECT * FROM `hideobjective` WHERE `objective_id`='{$_REQUEST['objectiveId']}'")or die(mysql_error());
	$row = mysql_fetch_assoc($res);
	
	if( $row['hideobjective_id'] )
		mysql_query("DELETE FROM `hideobjective` WHERE `hideobjective_id`='{$row['id']}'")or die(mysql_error());
}

//***************************************************************************************
//select wich assignment(s) hide in treehidden
if( $_REQUEST['action'] == 'hide_assignment' ){
	$res = mysql_query("SELECT * FROM `hideassignment` WHERE `assignment_id`='{$_REQUEST['assignmentId']}'")or die(mysql_error());
	$row = mysql_fetch_assoc($res);
	
	if( !$row['hideassignment_id'] )
		mysql_query("INSERT INTO `hideassignment`(`assignment_id`,`hide_from`,`hide_from_id`) VALUE('{$_REQUEST['assignmentId']}','pupil','{$_REQUEST['pupilId']}')")or die(mysql_error());
}
//select wich assignment(s) show in treehidden
if( $_REQUEST['action'] == 'show_assignment' ){
	$res = mysql_query("SELECT * FROM `hideassignment` WHERE `assignment_id`='{$_REQUEST['assignmentId']}'")or die(mysql_error());
	$row = mysql_fetch_assoc($res);
	
	if( $row['hideassignment_id'] )
		mysql_query("DELETE FROM `hideassignment` WHERE `hideassignment_id`='{$row['id']}'")or die(mysql_error());
}

//***************************************************************************************
// insert new weight for objective
if( $_REQUEST['action'] == 'edit_weight' ){
	//mysql_query("UPDATE `pupilprogress_objqctiveWeight` SET `amount`='{$_REQUEST['newValue']}' WHERE `objectiveId`='{$_REQUEST['id']}'")or die(mysql_error());
	$res = mysql_query("SELECT * FROM `course_objectives` WHERE `objective_id`='{$_REQUEST['id']}'")or die(mysql_error());
	$row = mysql_fetch_assoc($res);
        $value = preg_replace("/[^\d]/", "", $_REQUEST['newValue']);     
	if( $row['objective_id'] )
		mysql_query("UPDATE `course_objectives` SET `weight`='{$value}' WHERE `objective_id`='{$_REQUEST['id']}'")or die(mysql_error());
	//else
	//	mysql_query("INSERT INTO `course_objectives`(`objective_id`,`weight`) VALUE('{$_REQUEST['id']}','{$_REQUEST['newValue']}') ")or die(mysql_error());
}

//***************************************************************************************
// add group and hide from pupil
if( $_REQUEST['action'] == 'add_group_pupil' ){
	mysql_query("INSERT INTO `course_objective_groups`(`title_en`,`studygroup_id`) VALUE('{$_REQUEST['groupName']}','{$_REQUEST['idstudyGroup']}') ")or die(mysql_error());
	$groupId = mysql_insert_id();
	
	mysql_query("INSERT INTO `hidegroup`(`objectivegroup_id`,`pupil_id`,`studygroup_id`,`course_id`) VALUE('{$groupId}','{$_REQUEST['idpupil']}','','') ")or die(mysql_error());
	mysql_query("INSERT INTO `group_pupil`(`pupil_id`,`objectivegroup_id`) VALUE('{$_REQUEST['idpupil']}','{$groupId}') ")or die(mysql_error());
}
// add group and hide from study group
if( $_REQUEST['action'] == 'add_group_studyGroup' ){
	mysql_query("INSERT INTO `course_objective_groups`(`title_en`,`studygroup_id`) VALUE('{$_REQUEST['groupName']}','{$_REQUEST['idstudyGroup']}') ")or die(mysql_error());
	$groupId = mysql_insert_id();
	
	mysql_query("INSERT INTO `hidegroup`(`objectivegroup_id`,`pupil_id`,`studygroup_id`,`course_id`) VALUE('{$groupId}','','{$_REQUEST['idstudyGroup']}','') ")or die(mysql_error());
	mysql_query("INSERT INTO `group_pupil`(`pupil_id`,`objectivegroup_id`) VALUE('{$_REQUEST['idpupil']}','{$groupId}') ")or die(mysql_error());
}
// add group and hide from course
if( $_REQUEST['action'] == 'add_group_course' ){
	mysql_query("INSERT INTO `course_objective_groups`(`title_en`,`studygroup_id`) VALUE('{$_REQUEST['groupName']}','{$_REQUEST['idstudyGroup']}') ")or die(mysql_error());
	$groupId = mysql_insert_id();
	
	mysql_query("INSERT INTO `hidegroup`(`objectivegroup_id`,`pupil_id`,`studygroup_id`,`course_id`) VALUE('{$groupId}','','','{$_REQUEST['idcourse']}') ")or die(mysql_error());
	mysql_query("INSERT INTO `group_pupil`(`pupil_id`,`objectivegroup_id`) VALUE('{$_REQUEST['idpupil']}','{$groupId}') ")or die(mysql_error());
}
// add group and dont hide
if( $_REQUEST['action'] == 'add_group_dontHide' ){
	mysql_query("INSERT INTO `course_objective_groups`(`title_en`,`studygroup_id`) VALUE('{$_REQUEST['groupName']}','{$_REQUEST['idstudyGroup']}') ")or die(mysql_error());
	$groupId = mysql_insert_id();
	
	//mysql_query("INSERT INTO `hideGroup`(`groupId`,`pupilId`,`studyGroupId`,`courseId`) VALUE('{$groupId}','','','') ")or die(mysql_error());
	mysql_query("INSERT INTO `group_pupil`(`pupil_id`,`objectivegroup_id`) VALUE('{$_REQUEST['idpupil']}','{$groupId}') ")or die(mysql_error());
}
//***************************************************************************************

//hide group from pupil
if( $_REQUEST['action'] == 'hide_group_pupil' ){
	mysql_query("INSERT INTO `hidegroup`(`objectivegroup_id`,`pupil_id`,`studygroup_id`,`course_id`) VALUE('{$_REQUEST['groupId']}','{$_REQUEST['idpupil']}','','') ")or die(mysql_error());
}
//hide group from studyGroup
if( $_REQUEST['action'] == 'hide_group_studyGroup' ){
	mysql_query("INSERT INTO `hidegroup`(`objectivegroup_id`,`pupil_id`,`studygroup_id`,`course_id`) VALUE('{$_REQUEST['groupId']}','','{$_REQUEST['idstudyGroup']}','') ")or die(mysql_error());
}
//hide group from course
if( $_REQUEST['action'] == 'hide_group_course' ){
	mysql_query("INSERT INTO `hidegroup`(`objectivegroup_id`,`pupil_id`,`studygroup_id`,`course_id`) VALUE('{$_REQUEST['groupId']}','','','{$_REQUEST['idcourse']}') ")or die(mysql_error());
}
//Don't hide group
/*if( $_REQUEST['action'] == 'group_dontHide' ){
	mysql_query("INSERT INTO `hideGroup`(`groupId`,`pupilId`,`studyGroupId`,`courseId`) VALUE('{$_REQUEST['groupId']}','','','') ")or die(mysql_error());
}*/
//***************************************************************************************

//hide objective from pupil
if( $_REQUEST['action'] == 'hide_obj_pupil' ){
	mysql_query("INSERT INTO `hideobjective`(`objectivegroup_id`,`pupil_id`,`studygroup_id`,`course_id`) VALUE('{$_REQUEST['objectiveId']}','{$_REQUEST['idpupil']}','','') ")or die(mysql_error());
}
//hide objective from studyGroup
if( $_REQUEST['action'] == 'hide_obj_studyGroup' ){
	mysql_query("INSERT INTO `hideobjective`(`objectivegroup_id`,`pupil_id`,`studygroup_id`,`course_id`) VALUE('{$_REQUEST['objectiveId']}','','{$_REQUEST['idstudyGroup']}','') ")or die(mysql_error());
}
//hide objective from course
if( $_REQUEST['action'] == 'hide_obj_course' ){
	mysql_query("INSERT INTO `hideobjective`(`objectivegroup_id`,`pupil_id`,`studygroup_id`,`course_id`) VALUE('{$_REQUEST['objectiveId']}','','','{$_REQUEST['idcourse']}') ")or die(mysql_error());
}
//Don't hide objective
/*if( $_REQUEST['action'] == 'obj_dontHide' ){
	mysql_query("INSERT INTO `hideObjective`(`objectivegroup_id`,`pupil_id`,`studygroup_id`,`course_id`) VALUE('{$_REQUEST['groupId']}','','','') ")or die(mysql_error());
}*/
//***************************************************************************************

//hide asignment/perfomence from pupil
if( $_REQUEST['action'] == 'hide_assignPerf_pupil' ){
	mysql_query("INSERT INTO `hideassignment`(`assignment_id`,`hide_from`,`hide_from_id`) VALUE('{$_REQUEST['assignPerfId']}','pupil','{$_REQUEST['idpupil']}') ")or die(mysql_error());
}
//hide asignment/perfomence from studyGroup
if( $_REQUEST['action'] == 'hide_assignPerf_studyGroup' ){
	mysql_query("INSERT INTO `hideassignment`(`assignment_id`,`hide_from`,`hide_from_id`) VALUE('{$_REQUEST['assignPerfId']}','studyGroup','{$_REQUEST['idstudyGroup']}') ")or die(mysql_error());
}
//hide asignment/perfomence from course
if( $_REQUEST['action'] == 'hide_assignPerf_course' ){
	mysql_query("INSERT INTO `hideassignment`(`assignment_id`,`hide_from`,`hide_from_id`) VALUE('{$_REQUEST['assignPerfId']}','course','{$_REQUEST['idcourse']}') ")or die(mysql_error());
}

//***************************************************************************************
// add objective and hide from pupil
if( $_REQUEST['action'] == 'add_obj_pupil' ){
	mysql_query("INSERT INTO `course_objectives`(`objectivegroup_id`,`title_en`,`quality`) VALUE('{$_REQUEST['groupId']}','{$_REQUEST['groupName']}','-') ")or die(mysql_error());
	$objectiveId = mysql_insert_id();
	
	mysql_query("INSERT INTO `hideobjective`(`objectivegroup_id`,`pupil_id`,`studygroup_id`,`course_id`) VALUE('{$objectiveId}','{$_REQUEST['idpupil']}','','') ")or die(mysql_error());
	//mysql_query("INSERT INTO `assignmentOrPerformance`(`pupilId`,`objectiveId`,`assignPerfType`,`mandatory`,`assignPerfName`,`order`)
		//	VALUE('{$_REQUEST['idpupil']}','{$objectiveId}','Submission','yes','') ")or die(mysql_error());
}
// add objective and hide from study group
if( $_REQUEST['action'] == 'add_obj_studyGroup' ){
	mysql_query("INSERT INTO `course_objectives`(`objectivegroup_id`,`title_en`,`quality`) VALUE('{$_REQUEST['groupId']}','{$_REQUEST['groupName']}','-') ")or die(mysql_error());
	$objectiveId = mysql_insert_id();
	
	mysql_query("INSERT INTO `hideobjective`(`objectivegroup_id`,`pupil_id`,`studygroup_id`,`course_id`) VALUE('{$objectiveId}','','{$_REQUEST['idstudyGroup']}','') ")or die(mysql_error());
}
// add objective and hide from course
if( $_REQUEST['action'] == 'add_obj_course' ){
	mysql_query("INSERT INTO `course_objectives`(`objectivegroup_id`,`title_en`,`quality`) VALUE('{$_REQUEST['groupId']}','{$_REQUEST['groupName']}','-') ")or die(mysql_error());
	$objectiveId = mysql_insert_id();
	
	mysql_query("INSERT INTO `hideobjective`(`objectivegroup_id`,`pupil_id`,`studygroup_id`,`course_id`) VALUE('{$objectiveId}','','','{$_REQUEST['idcourse']}') ")or die(mysql_error());
}
// add objective and don't hide
if( $_REQUEST['action'] == 'add_obj_dontHide' ){
	mysql_query("INSERT INTO `course_objectives`(`objectivegroup_id`,`title_en`,`quality`) VALUE('{$_REQUEST['groupId']}','{$_REQUEST['groupName']}','-') ")or die(mysql_error());
	//$objectiveId = mysql_insert_id();
	
	//mysql_query("INSERT INTO `hideObjective`(`objectivegroup_id`,`pupil_id`,`studygroup_id`,`course_id`) VALUE('{$objectiveId}','','','') ")or die(mysql_error());
}

//***************************************************************************************
// add assignment and hide from pupil
if( $_REQUEST['action'] == 'add_assignmet_pupil'){
	mysql_query("INSERT INTO `course_rooms_assignments`(`studygroup_id`, `title_en`)
				VALUE('{$_REQUEST['idstudyGroup']}','{$_REQUEST['assPerfName']}') ")or die(mysql_error());
				
	//mysql_query("INSERT INTO `course_rooms_assignments`(`pupilId`, `objectiveId`, `assignPerfType`, `mandatory`, `assignPerfName`, `order`)
	//			VALUE('{$_REQUEST['idpupil']}','{$_REQUEST['objectiveId']}','Submission','yes','{$_REQUEST['assPerfName']}','0') ")or die(mysql_error());
	$assPerfId = mysql_insert_id();
	
	mysql_query("INSERT INTO `hideassignment`(`assignment_id`,`hide_from`,`hide_from_id`) VALUE('{$assPerfId}','pupil','{$_REQUEST['idpupil']}') ")or die(mysql_error());
	
	mysql_query("INSERT INTO `assignmentperformance_pupil`(`pupil_id`,`assignment_id`) VALUE('{$_REQUEST['idpupil']}','{$assPerfId}') ")or die(mysql_error());
	//mysql_query("INSERT INTO `pupli_submission_slot`(`pupil_id`,`assignment_id`) VALUE('{$_REQUEST['idpupil']}','{$assPerfId}') ")or die(mysql_error());
}
// add assignment and hide from study group
if( $_REQUEST['action'] == 'add_assignmet_studyGroup' ){
	mysql_query("INSERT INTO `course_rooms_assignments`(`studygroup_id`, `title_en`)
				VALUE('{$_REQUEST['idstudyGroup']}','{$_REQUEST['assPerfName']}') ")or die(mysql_error());
	$assPerfId = mysql_insert_id();
	
	mysql_query("INSERT INTO `hideassignment`(`assignment_id`,`hide_from`,`hide_from_id`) VALUE('{$assPerfId}','studyGroup','{$_REQUEST['idstudyGroup']}') ")or die(mysql_error());
	
	mysql_query("INSERT INTO `assignmentperformance_pupil`(`pupil_id`,`assignment_id`) VALUE('{$_REQUEST['idpupil']}','{$assPerfId}') ")or die(mysql_error());
}
// add assignment and hide from course
if( $_REQUEST['action'] == 'add_assignmet_course' ){
	mysql_query("INSERT INTO `course_rooms_assignments`(`studygroup_id`, `title_en`)
				VALUE('{$_REQUEST['idstudyGroup']}','{$_REQUEST['assPerfName']}') ")or die(mysql_error());
	$assPerfId = mysql_insert_id();
	
	mysql_query("INSERT INTO `hideassignment`(`assignment_id`,`hide_from`,`hide_from_id`) VALUE('{$assPerfId}','course','{$_REQUEST['idcourse']}') ")or die(mysql_error());
	
	mysql_query("INSERT INTO `assignmentperformance_pupil`(`pupil_id`,`assignment_id`) VALUE('{$_REQUEST['idpupil']}','{$assPerfId}') ")or die(mysql_error());
}
// add assignment and don't hide
if( $_REQUEST['action'] == 'add_assignmet_donthide' ){
	mysql_query("INSERT INTO `course_rooms_assignments`(`studygroup_id`, `title_en`)
				VALUE('{$_REQUEST['idstudyGroup']}','{$_REQUEST['assPerfName']}') ")or die(mysql_error());
	$assPerfId = mysql_insert_id();
	
	mysql_query("INSERT INTO `assignmentperformance_pupil`(`pupil_id`,`assignment_id`) VALUE('{$_REQUEST['idpupil']}','{$assPerfId}') ")or die(mysql_error());
}
// add perfomece and hide from pupil
if( $_REQUEST['action'] == 'add_perf_pupil' ){
	mysql_query("INSERT INTO `performance`(`studygroup_id`, `title_en`)
				VALUE('{$_REQUEST['idstudyGroup']}','{$_REQUEST['assPerfName']}') ")or die(mysql_error());
	$assPerfId = mysql_insert_id();
	
	mysql_query("INSERT INTO `pupil_performance_assessment`(`performance_id`,`pupil_id`,`assessment`,`studygroup_id`) VALUE('{$assPerfId}','{$_REQUEST['idpupil']}','na','{$_REQUEST['idstudyGroup']}') ")or die(mysql_error());
	
	mysql_query("INSERT INTO `hideassignment`(`assignment_id`,`hide_from`,`hide_from_id`) VALUE('{$assPerfId}','pupil','{$_REQUEST['idpupil']}') ")or die(mysql_error());
	
	mysql_query("INSERT INTO `assignmentperformance_pupil`(`pupil_id`,`performance_id`) VALUE('{$_REQUEST['idpupil']}','{$assPerfId}') ")or die(mysql_error());
}
// add perfomece and hide from study group
if( $_REQUEST['action'] == 'add_perf_studyGroup' ){
	mysql_query("INSERT INTO `performance`(`studygroup_id`, `title_en`)
				VALUE('{$_REQUEST['idstudyGroup']}','{$_REQUEST['assPerfName']}') ")or die(mysql_error());
				
	$assPerfId = mysql_insert_id();
	
	mysql_query("INSERT INTO `pupil_performance_assessment`(`performance_id`,`pupil_id`,`assessment`,`studygroup_id`) VALUE('{$assPerfId}','{$_REQUEST['idpupil']}','na','{$_REQUEST['idstudyGroup']}') ")or die(mysql_error());
	
	mysql_query("INSERT INTO `hideassignment`(`assignment_id`,`hide_from`,`hide_from_id`) VALUE('{$assPerfId}','studyGroup','{$_REQUEST['idstudyGroup']}') ")or die(mysql_error());
	
	mysql_query("INSERT INTO `assignmentperformance_pupil`(`pupil_id`,`performance_id`) VALUE('{$_REQUEST['idpupil']}','{$assPerfId}') ")or die(mysql_error());
}
// add perfomece and hide from course
if( $_REQUEST['action'] == 'add_perf_course' ){
	mysql_query("INSERT INTO `performance`(`studygroup_id`, `title_en`)
				VALUE('{$_REQUEST['idstudyGroup']}','{$_REQUEST['assPerfName']}') ")or die(mysql_error());
	$assPerfId = mysql_insert_id();
	
	mysql_query("INSERT INTO `pupil_performance_assessment`(`performance_id`,`pupil_id`,`assessment`,`studygroup_id`) VALUE('{$assPerfId}','{$_REQUEST['idpupil']}','na','{$_REQUEST['idstudyGroup']}') ")or die(mysql_error());
	
	mysql_query("INSERT INTO `hideassignment`(`assignment_id`,`hide_from`,`hide_from_id`) VALUE('{$assPerfId}','course','{$_REQUEST['idcourse']}') ")or die(mysql_error());
	
	mysql_query("INSERT INTO `assignmentperformance_pupil`(`pupil_id`,`performance_id`) VALUE('{$_REQUEST['idpupil']}','{$assPerfId}') ")or die(mysql_error());
}
// add perfomence and don't hide
if( $_REQUEST['action'] == 'add_perf_donthide' ){
	mysql_query("INSERT INTO `performance`(`studygroup_id`, `title_en`)
				VALUE('{$_REQUEST['idstudyGroup']}','{$_REQUEST['assPerfName']}') ")or die(mysql_error());
	$assPerfId = mysql_insert_id();
	
	mysql_query("INSERT INTO `pupil_performance_assessment`(`performance_id`,`pupil_id`,`assessment`,`studygroup_id`) VALUE('{$assPerfId}','{$_REQUEST['idpupil']}','na','{$_REQUEST['idstudyGroup']}') ")or die(mysql_error());
	
	mysql_query("INSERT INTO `assignmentperformance_pupil`(`pupil_id`,`performance_id`) VALUE('{$_REQUEST['idpupil']}','{$assPerfId}') ")or die(mysql_error());
}
//***************************************************************************************

//delete group
if( $_REQUEST['action'] == 'delete_group' ){
	mysql_query("DELETE FROM `course_objective_groups` WHERE `objectivegroup_id`='{$_REQUEST['groupId']}'")or die(mysql_error());
	mysql_query("DELETE FROM `group_pupil` WHERE `objectivegroup_id`='{$_REQUEST['groupId']}'")or die(mysql_error());
}
//delete objective
if( $_REQUEST['action'] == 'delete_obj' ){
	mysql_query("DELETE FROM `course_objectives` WHERE `objective_id`='{$_REQUEST['objectiveId']}'")or die(mysql_error());
}
//delete assignment
if( $_REQUEST['action'] == 'delete_assign' ){
	mysql_query("DELETE FROM `course_rooms_assignments` WHERE `assignment_id`='{$_REQUEST['assignPerfId']}'")or die(mysql_error());
	mysql_query("DELETE FROM `resultsets` WHERE `assignment_id`='{$_REQUEST['assignPerfId']}'")or die(mysql_error());
}
//***************************************************************************************

// change pass or no pass
if( $_REQUEST['action'] == 'pass' ){
		$res = mysql_query("SELECT pupli_submission_slot.submission_slot_id as submission_slot_id, resultsets.result_unit_id as result_unit_id FROM pupli_submission_slot,resultsets WHERE resultsets.resultset_id='{$_REQUEST['id']}' AND resultsets.assignment_id=pupli_submission_slot.assignment_id
		AND pupli_submission_slot.pupil_id={$_REQUEST['pupilId']}")or die(mysql_error());
		$row = mysql_fetch_assoc($res);
        $update_result= "";
        if($row['result_unit_id']=='3' || $row['result_unit_id']=='4'){
            $update_result = ", `result` = '".($_REQUEST['assessment']!='na'?$_REQUEST['assessment']:'')."'";
        }
		mysql_query("UPDATE `pupil_submission_result` SET `assessment`='{$_REQUEST['assessment']}'".$update_result." WHERE `result_set_id`='{$_REQUEST['id']}' AND submission_slot_id={$row['submission_slot_id']}")or die(mysql_error());
        mysql_query("UPDATE `pupli_submission_slot` SET `status`='1' WHERE submission_slot_id={$row['submission_slot_id']}")or die(mysql_error());
    echo "
        <td id='highlightAssesment' style='background-color:green; width: 38%; text-align:center;'><span style='color:white; font-weight:bold; margin-right:3px;'>".dlang("passvalue","Pass")."</span></td>
    ";
}
if( $_REQUEST['action'] == 'notpass' ){
		$res = mysql_query("SELECT pupli_submission_slot.submission_slot_id as submission_slot_id, resultsets.result_unit_id as result_unit_id FROM pupli_submission_slot,resultsets WHERE resultsets.resultset_id='{$_REQUEST['id']}' AND resultsets.assignment_id=pupli_submission_slot.assignment_id
		AND pupli_submission_slot.pupil_id={$_REQUEST['pupilId']}")or die(mysql_error());
		$row = mysql_fetch_assoc($res);
        $update_result= "";
        if($row['result_unit_id']=='3' || $row['result_unit_id']=='4'){
            $update_result = ", `result` = '".($_REQUEST['assessment']!='na'?$_REQUEST['assessment']:'')."'";
        }
		mysql_query("UPDATE `pupil_submission_result` SET `assessment`='{$_REQUEST['assessment']}'".$update_result." WHERE `result_set_id`='{$_REQUEST['id']}' AND submission_slot_id={$row['submission_slot_id']}")or die(mysql_error());
        mysql_query("UPDATE `pupli_submission_slot` SET `status`='1' WHERE submission_slot_id={$row['submission_slot_id']}")or die(mysql_error());
	echo "
        <td id='highlightAssesment' style='background-color:#F4726D; width: 23%; text-align:center;'><span style='color:white; font-weight:bold;'>".dlang("npassvalue","NPass")."</span></td>
        <td id='highlightAssesmentYellow' style='background-color:#f5eab2; width: 18%; text-align:center;'><span style='color:#c4c2a9; font-weight:bold;'>".dlang("passvalue","Pass")."</span></td>
	";
}

//***************************************************************************************

//update assesment value
if( $_REQUEST['action'] == 'insert_Fx' ){
	if($_REQUEST['type'] == 'performance'){	
		mysql_query("UPDATE `pupil_performance_assessment` SET `assessment`='{$_REQUEST['assessment']}' WHERE `pupil_performance_assessment_id`='{$_REQUEST['id']}'")or die(mysql_error());
	}else{
		$res = mysql_query("SELECT pupli_submission_slot.submission_slot_id as submission_slot_id, resultsets.result_unit_id as result_unit_id FROM pupli_submission_slot,resultsets WHERE resultsets.resultset_id='{$_REQUEST['id']}' AND resultsets.assignment_id=pupli_submission_slot.assignment_id
		AND pupli_submission_slot.pupil_id={$_REQUEST['pupilId']}")or die(mysql_error());
		$row = mysql_fetch_assoc($res);
        $update_result= "";
        if($row['result_unit_id']=='3' || $row['result_unit_id']=='4'){
            $update_result = ", `result` = '".($_REQUEST['assessment']!='na'?$_REQUEST['assessment']:'')."'";
        }
		mysql_query("UPDATE `pupil_submission_result` SET `assessment`='{$_REQUEST['assessment']}'".$update_result." WHERE `result_set_id`='{$_REQUEST['id']}' AND submission_slot_id={$row['submission_slot_id']}")or die(mysql_error());
        mysql_query("UPDATE `pupli_submission_slot` SET `status`='1' WHERE submission_slot_id={$row['submission_slot_id']}")or die(mysql_error());
    }
	
	echo"
		<td class='assesment_F' style='width:22%;'><span style=''>F</span></td>
		<td class='assesment_E' style='width:16%'><span style=''>E</span></td>
		<td class='assesment_D' style='width:16%'><span style=''>D</span></td>
		<td class='assesment_C' style='width:16%'><span style=''>C</span></td>
		<td class='assesment_B' style='width:16%'><span style=''>B</span></td>
		<td class='assesment_A' style='width:16%'><span style=''>A</span></td>
	";
}
if( $_REQUEST['action'] == 'insert_F' ){
	if($_REQUEST['type'] == 'performance'){	
		mysql_query("UPDATE `pupil_performance_assessment` SET `assessment`='{$_REQUEST['assessment']}' WHERE `pupil_performance_assessment_id`='{$_REQUEST['id']}'")or die(mysql_error());
	}else{
		$res = mysql_query("SELECT pupli_submission_slot.submission_slot_id as submission_slot_id, resultsets.result_unit_id as result_unit_id  FROM pupli_submission_slot,resultsets WHERE resultsets.resultset_id='{$_REQUEST['id']}' AND resultsets.assignment_id=pupli_submission_slot.assignment_id
		AND pupli_submission_slot.pupil_id={$_REQUEST['pupilId']}")or die(mysql_error());
		$row = mysql_fetch_assoc($res);
        $update_result= "";
        if($row['result_unit_id']=='3' || $row['result_unit_id']=='4'){
            $update_result = ", `result` = '".($_REQUEST['assessment']!='na'?$_REQUEST['assessment']:'')."'";
        }
        mysql_query("UPDATE `pupil_submission_result` SET `assessment`='{$_REQUEST['assessment']}'".$update_result." ".$update_result." WHERE `result_set_id`='{$_REQUEST['id']}' AND submission_slot_id={$row['submission_slot_id']}")or die(mysql_error());

        mysql_query("UPDATE `pupli_submission_slot` SET `status`='1' WHERE submission_slot_id={$row['submission_slot_id']}")or die(mysql_error());
    }
	echo"
		<td style='background-color:#F4726D; width: 16%; text-align:right;'><span class='' style='margin-right: 3px; color:white'>F</span></td>
		<td style='background-color:#f5eab2; width: 16%; text-align:center;'><span class='' style='color: #c4c2a9'>E</span></td>
		<td style='background-color:#f5eab2; width: 16%; text-align:center;'><span class='' style='color: #c4c2a9'>D</span></td>
		<td style='background-color:#f5eab2; width: 16%; text-align:center;'><span class='' style='color: #c4c2a9'>C</span></td>
		<td style='background-color:#f5eab2; width: 16%; text-align:center;'><span class='' style='color: #c4c2a9'>B</span></td>
		<td style='background-color:#f5eab2; width: 16%; text-align:center;'><span class='' style='color: #c4c2a9'>A</span></td>
	";
}
if( $_REQUEST['action'] == 'insert_E' ){
	if($_REQUEST['type'] == 'performance'){	
		mysql_query("UPDATE `pupil_performance_assessment` SET `assessment`='{$_REQUEST['assessment']}' WHERE `pupil_performance_assessment_id`='{$_REQUEST['id']}'")or die(mysql_error());
	}else{
		$res = mysql_query("SELECT pupli_submission_slot.submission_slot_id as submission_slot_id, resultsets.result_unit_id as result_unit_id FROM pupli_submission_slot,resultsets WHERE resultsets.resultset_id='{$_REQUEST['id']}' AND resultsets.assignment_id=pupli_submission_slot.assignment_id
		AND pupli_submission_slot.pupil_id={$_REQUEST['pupilId']}")or die(mysql_error());
		$row = mysql_fetch_assoc($res);
        $update_result= "";
        if($row['result_unit_id']=='3' || $row['result_unit_id']=='4'){
            $update_result = ", `result` = '".($_REQUEST['assessment']!='na'?$_REQUEST['assessment']:'')."'";
        }
		mysql_query("UPDATE `pupil_submission_result` SET `assessment`='{$_REQUEST['assessment']}'".$update_result." WHERE `result_set_id`='{$_REQUEST['id']}' AND submission_slot_id={$row['submission_slot_id']}")or die(mysql_error());
        mysql_query("UPDATE `pupli_submission_slot` SET `status`='1' WHERE submission_slot_id={$row['submission_slot_id']}")or die(mysql_error());
    }
	echo"
		<td style='background-color:green; width: 32%; text-align:right;'><span class='' style='margin-right: 3px; color: white'>E</span></td>
		<td style='background-color:#f5eab2; width: 16%; text-align:center;'><span class='' style='color: #c4c2a9'>D</span></td>
		<td style='background-color:#f5eab2; width: 16%; text-align:center;'><span class='' style='color: #c4c2a9'>C</span></td>
		<td style='background-color:#f5eab2; width: 16%; text-align:center;'><span class='' style='color: #c4c2a9'>B</span></td>
		<td style='background-color:#f5eab2; width: 16%; text-align:center;'><span class='' style='color: #c4c2a9'>A</span></td>
	";
}
if( $_REQUEST['action'] == 'insert_D' ){
	if($_REQUEST['type'] == 'performance'){	
		mysql_query("UPDATE `pupil_performance_assessment` SET `assessment`='{$_REQUEST['assessment']}' WHERE `pupil_performance_assessment_id`='{$_REQUEST['id']}'")or die(mysql_error());
	}else{
		$res = mysql_query("SELECT pupli_submission_slot.submission_slot_id as submission_slot_id, resultsets.result_unit_id as result_unit_id FROM pupli_submission_slot,resultsets WHERE resultsets.resultset_id='{$_REQUEST['id']}' AND resultsets.assignment_id=pupli_submission_slot.assignment_id
		AND pupli_submission_slot.pupil_id={$_REQUEST['pupilId']}")or die(mysql_error());
		$row = mysql_fetch_assoc($res);
        $update_result= "";
        if($row['result_unit_id']=='3' || $row['result_unit_id']=='4'){
            $update_result = ", `result` = '".($_REQUEST['assessment']!='na'?$_REQUEST['assessment']:'')."'";
        }
		mysql_query("UPDATE `pupil_submission_result` SET `assessment`='{$_REQUEST['assessment']}'".$update_result." WHERE `result_set_id`='{$_REQUEST['id']}' AND submission_slot_id={$row['submission_slot_id']}")or die(mysql_error());
        mysql_query("UPDATE `pupli_submission_slot` SET `status`='1' WHERE submission_slot_id={$row['submission_slot_id']}")or die(mysql_error());
    }
	echo"
		<td style='background-color:green; width: 48%; text-align:right;'><span class='' style='margin-right: 3px; color: white'>D</span></td>
		<td style='background-color:#f5eab2; width: 16%; text-align:center;'><span class='' style='color: #c4c2a9'>C</span></td>
		<td style='background-color:#f5eab2; width: 16%; text-align:center;'><span class='' style='color: #c4c2a9'>B</span></td>
		<td style='background-color:#f5eab2; width: 16%; text-align:center;'><span class='' style='color: #c4c2a9'>A</span></td>
	";
}
if( $_REQUEST['action'] == 'insert_C' ){
	if($_REQUEST['type'] == 'performance'){	
		mysql_query("UPDATE `pupil_performance_assessment` SET `assessment`='{$_REQUEST['assessment']}' WHERE `pupil_performance_assessment_id`='{$_REQUEST['id']}'")or die(mysql_error());
	}else{
		$res = mysql_query("SELECT pupli_submission_slot.submission_slot_id as submission_slot_id, resultsets.result_unit_id as result_unit_id FROM pupli_submission_slot,resultsets WHERE resultsets.resultset_id='{$_REQUEST['id']}' AND resultsets.assignment_id=pupli_submission_slot.assignment_id
		AND pupli_submission_slot.pupil_id={$_REQUEST['pupilId']}")or die(mysql_error());
		$row = mysql_fetch_assoc($res);
        $update_result= "";
        if($row['result_unit_id']=='3' || $row['result_unit_id']=='4'){
            $update_result = ", `result` = '".($_REQUEST['assessment']!='na'?$_REQUEST['assessment']:'')."'";
        }
		mysql_query("UPDATE `pupil_submission_result` SET `assessment`='{$_REQUEST['assessment']}'".$update_result." WHERE `result_set_id`='{$_REQUEST['id']}' AND submission_slot_id={$row['submission_slot_id']}")or die(mysql_error());
        mysql_query("UPDATE `pupli_submission_slot` SET `status`='1' WHERE submission_slot_id={$row['submission_slot_id']}")or die(mysql_error());
    }
	echo"
		<td style='background-color:green; width: 64%;; text-align:right;'><span class='' style='margin-right: 3px; color: white'>C</span></td>
		<td style='background-color:#f5eab2; width: 16%; text-align:center;'><span class='' style='color: #c4c2a9'>B</span></td>
		<td style='background-color:#f5eab2; width: 16%; text-align:center;'><span class='' style='color: #c4c2a9'>A</span></td>
	";
}
if( $_REQUEST['action'] == 'insert_B' ){
	if($_REQUEST['type'] == 'performance'){	
		mysql_query("UPDATE `pupil_performance_assessment` SET `assessment`='{$_REQUEST['assessment']}' WHERE `pupil_performance_assessment_id`='{$_REQUEST['id']}'")or die(mysql_error());
	}else{
		$res = mysql_query("SELECT pupli_submission_slot.submission_slot_id as submission_slot_id, resultsets.result_unit_id as result_unit_id FROM pupli_submission_slot,resultsets WHERE resultsets.resultset_id='{$_REQUEST['id']}' AND resultsets.assignment_id=pupli_submission_slot.assignment_id
		AND pupli_submission_slot.pupil_id={$_REQUEST['pupilId']}")or die(mysql_error());
		$row = mysql_fetch_assoc($res);
        $update_result= "";
        if($row['result_unit_id']=='3' || $row['result_unit_id']=='4'){
            $update_result = ", `result` = '".($_REQUEST['assessment']!='na'?$_REQUEST['assessment']:'')."'";
        }
		mysql_query("UPDATE `pupil_submission_result` SET `assessment`='{$_REQUEST['assessment']}'".$update_result." WHERE `result_set_id`='{$_REQUEST['id']}' AND submission_slot_id={$row['submission_slot_id']}")or die(mysql_error());
        mysql_query("UPDATE `pupli_submission_slot` SET `status`='1' WHERE submission_slot_id={$row['submission_slot_id']}")or die(mysql_error());
    }
	echo"
		<td style='background-color:green; width: 80%; text-align:right;'><span class='' style='margin-right: 3px; color: white'>B</span></td>
		<td style='background-color:#f5eab2; width: 16%; text-align:center;'><span class='' style='color: #c4c2a9'>A</span></td>
	";
}
if( $_REQUEST['action'] == 'insert_A' ){
	if($_REQUEST['type'] == 'performance'){	
		mysql_query("UPDATE `pupil_performance_assessment` SET `assessment`='{$_REQUEST['assessment']}' WHERE `pupil_performance_assessment_id`='{$_REQUEST['id']}'")or die(mysql_error());
	}else{
		$res = mysql_query("SELECT pupli_submission_slot.submission_slot_id as submission_slot_id, resultsets.result_unit_id as result_unit_id FROM pupli_submission_slot,resultsets WHERE resultsets.resultset_id='{$_REQUEST['id']}' AND resultsets.assignment_id=pupli_submission_slot.assignment_id
		AND pupli_submission_slot.pupil_id={$_REQUEST['pupilId']}")or die(mysql_error());
		$row = mysql_fetch_assoc($res);
        $update_result= "";
        if($row['result_unit_id']=='3' || $row['result_unit_id']=='4'){
            $update_result = ", `result` = '".($_REQUEST['assessment']!='na'?$_REQUEST['assessment']:'')."'";
        }
		mysql_query("UPDATE `pupil_submission_result` SET `assessment`='{$_REQUEST['assessment']}'".$update_result." WHERE `result_set_id`='{$_REQUEST['id']}' AND submission_slot_id={$row['submission_slot_id']}")or die(mysql_error());
        mysql_query("UPDATE `pupli_submission_slot` SET `status`='1' WHERE submission_slot_id={$row['submission_slot_id']}")or die(mysql_error());
    }
	echo"
		<td style='background-color:green; text-align:right;'><span class='' style='margin-right: 3px; color: white'>A</span></td>
	";
}
//***************************************************************************************

//update quality value
if( $_REQUEST['action'] == 'insert_quality_A' ){
	mysql_query("UPDATE `course_objectives` SET `quality`='{$_REQUEST['assessment']}' WHERE `objective_id`='{$_REQUEST['id']}'")or die(mysql_error());
	echo "A";
}
if( $_REQUEST['action'] == 'insert_quality_B' ){
	mysql_query("UPDATE `course_objectives` SET `quality`='{$_REQUEST['assessment']}' WHERE `objective_id`='{$_REQUEST['id']}'")or die(mysql_error());
	echo "B";
}
if( $_REQUEST['action'] == 'insert_quality_C' ){
	mysql_query("UPDATE `course_objectives` SET `quality`='{$_REQUEST['assessment']}' WHERE `objective_id`='{$_REQUEST['id']}'")or die(mysql_error());
	echo "C";
}
if( $_REQUEST['action'] == 'insert_quality_D' ){
	mysql_query("UPDATE `course_objectives` SET `quality`='{$_REQUEST['assessment']}' WHERE `objective_id`='{$_REQUEST['id']}'")or die(mysql_error());
	echo "D";
}
if( $_REQUEST['action'] == 'insert_quality_E' ){
	mysql_query("UPDATE `course_objectives` SET `quality`='{$_REQUEST['assessment']}' WHERE `objective_id`='{$_REQUEST['id']}'")or die(mysql_error());
	echo "E";
}
if( $_REQUEST['action'] == 'insert_quality_F' ){
	mysql_query("UPDATE `course_objectives` SET `quality`='{$_REQUEST['assessment']}' WHERE `objective_id`='{$_REQUEST['id']}'")or die(mysql_error());
	echo "F";
}
if( $_REQUEST['action'] == 'insert_quality_' ){
	mysql_query("UPDATE `course_objectives` SET `quality`='{$_REQUEST['assessment']}' WHERE `objective_id`='{$_REQUEST['id']}'")or die(mysql_error());
	echo "-";
}

//****************************************************************************************
//select who on site (pupil or teacher or staff/admin)
if( $_REQUEST['action'] == 'staffAdmin' ){
	mysql_query("UPDATE `checkpupil` SET `check`='{$_REQUEST['staffAdmin']}'")or die( mysql_error() );
	echo 1;
}
?>