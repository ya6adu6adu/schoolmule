<?php
//include file with settings connecting to database
include('../dbconn.php');

// select result unit and create drop-down list
if( $_REQUEST['action'] == 'select' ){
	//$res = mysql_query("SELECT * FROM `units_pupuil`,`units` WHERE units_pupuil.pupilId='{$_REQUEST['pupilId']}'
		//			AND units.id=units_pupuil.unitId ORDER BY `order` ASC") or die(mysql_error());
	$res = mysql_query("SELECT * FROM `result_units` WHERE 1") or die(mysql_error());

	$select_opt = '';
	while( $row = mysql_fetch_assoc($res) ){
		if( $row['order'] == 1 )
			//$img = '<img src="..\images\minus.png" alt="minus" />';
			$select_opt .= "<option value='{$row['result_unit_en']}' style=\"background-image: url('../../images/minus.png') no-repeat;\">".$row['result_unit_en']."</option>".$img;
		else
			$select_opt .= "<option value='{$row['result_unit_en']}'>".$row['result_unit_en']."</option>".$img;
	}
	echo $select_opt;
}
//***************************************************************************

//add new result unit
if( $_REQUEST['action'] == 'add_new_resUnit' ){
	$res = mysql_query("SELECT * FROM `result_units` WHERE `result_unit_en`='{$_REQUEST['newUnit']}'")or die(mysql_error());
	$row = mysql_fetch_assoc( $res );
	
	if( !$row['result_unit_id'] ){
		mysql_query("INSERT INTO `result_units` (`result_unit_en`,`order`) VALUE('{$_REQUEST['newUnit']}','0')")or die(mysql_error());
		$unitId = mysql_insert_id();
		mysql_query("INSERT INTO `result_units_pupil` (`pupil_id`,`result_unit_id`) VALUE('{$_REQUEST['pupilId']}','{$unitId}')")or die(mysql_error());
	}
}
//***************************************************************************

//change result unit
if( $_REQUEST['action'] == 'change_result' ){
	//echo 11111111111111111;
	//$res = mysql_query("SELECT * FROM `assignPerfUnits` WHERE `id`='{$_REQUEST['assignPerfId']}'")or die(mysql_error());
	$res = mysql_query("SELECT * FROM `pupli_submission_slot` WHERE `assignment_id`='{$_REQUEST['assignPerfId']}' AND pupil_id={$_REQUEST['pupilId']}")or die(mysql_error());
	$row = mysql_fetch_assoc( $res );
	
	if( $row['submission_slot_id'] ){
		
		//mysql_query("UPDATE `assignPerfUnits` SET `assignUnit`='{$_REQUEST['resultUnit']}', `assignMax`='{$_REQUEST['maxColum']}', `assignPass`='{$_REQUEST['passColum']}', `subResult`='{$_REQUEST['newValue']}' WHERE `assPerfId`='{$_REQUEST['assignPerfId']}'")or die(mysql_error());
		
		//if( $_REQUEST['assessmentType'] == 'p' ){
			//mysql_query("UPDATE `assignPerfUnits` SET `assignUnit`='{$_REQUEST['resultUnit']}', `assignMax`='{$_REQUEST['maxColum']}', `assignPass`='{$_REQUEST['passColum']}', `subResult`='{$_REQUEST['newValue']}', `subAssessment`='np', `passOrNot`='1' WHERE `id`='{$row['id']}'")or die(mysql_error());
			//mysql_query("UPDATE `pupilprogress_assignPerfUnits` SET `assignUnit`='{$_REQUEST['resultUnit']}', `assignMax`='{$_REQUEST['maxColum']}', `assignPass`='{$_REQUEST['passColum']}', `subResult`='{$_REQUEST['newValue']}', `subAssessment`='{$_REQUEST['assessmentType']}', `passOrNot`='1' WHERE `id`='{$row['id']}'")or die(mysql_error());
			
			mysql_query("UPDATE `pupil_submission_result` SET `result`='{$_REQUEST['newValue']}' WHERE `submission_slot_id`='{$row['submission_slot_id']}' AND `result_set_id`='{$_REQUEST['resultId']}' ")or die(mysql_error());
			//echo "UPDATE `assignPerfUnits` SET `assignUnit`='{$_REQUEST['resultUnit']}', `assignMax`='{$_REQUEST['maxColum']}', `assignPass`='{$_REQUEST['passColum']}', `subResult`='{$_REQUEST['newValue']}', `subAssessment`='np', `passOrNot`='1' WHERE `id`='{$row['id']}'";
		//}else{
			//mysql_query("UPDATE `assignPerfUnits` SET `assignUnit`='{$_REQUEST['resultUnit']}', `assignMax`='{$_REQUEST['maxColum']}', `assignPass`='{$_REQUEST['passColum']}', `subResult`='{$_REQUEST['newValue']}', `subAssessment`='na', `passOrNot`='0' WHERE `id`='{$row['id']}'")or die(mysql_error());
			//echo "UPDATE `assignPerfUnits` SET `assignUnit`='{$_REQUEST['resultUnit']}', `assignMax`='{$_REQUEST['maxColum']}', `assignPass`='{$_REQUEST['passColum']}', `subResult`='{$_REQUEST['newValue']}', `subAssessment`='na' WHERE `id`='{$row['id']}'";
		//}
		
	}else{
		
		$result = mysql_query("SELECT * FROM `submission_slot_id` WHERE `assignment_id`='{$_REQUEST['assignPerfId']}' AND pupil_id={$_REQUEST['pupilId']}")or die(mysql_error());
		$row2 = mysql_fetch_assoc( $result );
		if( $row['submission_slot_id'] ){
			mysql_query("INSERT INTO `resultsets` (`assignment_id`,`result_unit_id`,`result_max`,`result_pass`,`assessment`) VALUE('{$_REQUEST['assignPerfId']}','{$_REQUEST['resultUnit']}','{$_REQUEST['maxColum']}','{$_REQUEST['passColum']}','na')")or die(mysql_error());
			$rsid = mysql_insert_id();
			mysql_query("INSERT INTO `pupil_submission_result` (`submission_slot_id`,`result_set_id`,`result`) VALUE ('{$row['submission_slot_id']}','{$rsid}','{$_REQUEST['newValue']}') ")or die(mysql_error());
		}	
	}
}
//change result unit for no Evalution
if( $_REQUEST['action'] == 'change_result_noVal' ){
	$res = mysql_query("SELECT * FROM `resultsets` WHERE `resultset_id`='{$_REQUEST['resultId']}'")or die(mysql_error());
	$row = mysql_fetch_assoc( $res );
	
	if( $row['resultset_id'] ){
		//mysql_query("UPDATE `assignPerfUnits` SET `assignUnit`='{$_REQUEST['resultUnit']}', `assignMax`='{$_REQUEST['maxColum']}', `assignPass`='{$_REQUEST['passColum']}', `subResult`='{$_REQUEST['newValue']}', `subAssessment`='na' WHERE `assPerfId`='{$_REQUEST['assignPerfId']}'")or die(mysql_error());
		//echo "UPDATE `assignPerfUnits` SET `assignUnit`='{$_REQUEST['resultUnit']}', `assignMax`='{$_REQUEST['maxColum']}', `assignPass`='{$_REQUEST['passColum']}', `subResult`='{$_REQUEST['newValue']}' WHERE `assPerfId`='{$_REQUEST['assignPerfId']}'";
		
		if( $_REQUEST['assessmentType'] == 'p' ){
			mysql_query("UPDATE `pupilprogress_assignPerfUnits` SET `assignUnit`='{$_REQUEST['resultUnit']}', `assignMax`='{$_REQUEST['maxColum']}', `assignPass`='{$_REQUEST['passColum']}', `subResult`='{$_REQUEST['newValue']}', `subAssessment`='p', `passOrNot`='1' WHERE `id`='{$row['id']}'")or die(mysql_error());
			//echo "UPDATE `assignPerfUnits` SET `assignUnit`='{$_REQUEST['resultUnit']}', `assignMax`='{$_REQUEST['maxColum']}', `assignPass`='{$_REQUEST['passColum']}', `subResult`='{$_REQUEST['newValue']}', `subAssessment`='np', `passOrNot`='1' WHERE `id`='{$row['id']}'";
			echo $_REQUEST['assessmentType'];
		}elseif( $_REQUEST['assessmentType'] == 'No evaluation' ){
			mysql_query("UPDATE `pupilprogress_assignPerfUnits` SET `assignUnit`='{$_REQUEST['assessmentType']}', `assignMax`='{$_REQUEST['maxColum']}', `assignPass`='{$_REQUEST['passColum']}', `subResult`='{$_REQUEST['newValue']}', `subAssessment`='np', `passOrNot`='1' WHERE `id`='{$row['id']}'")or die(mysql_error());
		}else{
			mysql_query("UPDATE `pupilprogress_assignPerfUnits` SET `assignUnit`='{$_REQUEST['resultUnit']}', `assignMax`='{$_REQUEST['maxColum']}', `assignPass`='{$_REQUEST['passColum']}', `subResult`='{$_REQUEST['newValue']}', `subAssessment`='na', `passOrNot`='0' WHERE `id`='{$row['id']}'")or die(mysql_error());
			//echo "UPDATE `assignPerfUnits` SET `assignUnit`='{$_REQUEST['resultUnit']}', `assignMax`='{$_REQUEST['maxColum']}', `assignPass`='{$_REQUEST['passColum']}', `subResult`='{$_REQUEST['newValue']}', `subAssessment`='na' WHERE `id`='{$row['id']}'";
			echo $_REQUEST['assessmentType'];
		}
		
	}else{
		mysql_query("INSERT INTO `pupilprogress_assignPerfUnits` (`assPerfId`,`assignUnit`,`assignMax`,`assignPass`,`subResult`,`subAssessment`,`countUnit`) VALUE('{$_REQUEST['assignPerfId']}','{$_REQUEST['resultUnit']}','{$_REQUEST['maxColum']}','{$_REQUEST['passColum']}','{$_REQUEST['newValue']}','na','0')")or die(mysql_error());		
	}
}
//***************************************************************************
//change result unit for no Evalution in assesment type
if( $_REQUEST['action'] == 'change_result_resUnitNov_evaluation' ){
	$res = mysql_query("SELECT * FROM `resultsets` WHERE `resultset_id`='{$_REQUEST['resultId']}'")or die(mysql_error());
	$row = mysql_fetch_assoc( $res );
	
	if( $row['resultset_id'] ){
		//mysql_query("UPDATE `assignPerfUnits` SET `assignUnit`='{$_REQUEST['resultUnit']}', `assignMax`='{$_REQUEST['maxColum']}', `assignPass`='{$_REQUEST['passColum']}', `subResult`='{$_REQUEST['newValue']}', `subAssessment`='na' WHERE `assPerfId`='{$_REQUEST['assignPerfId']}'")or die(mysql_error());
		//echo "UPDATE `assignPerfUnits` SET `assignUnit`='{$_REQUEST['resultUnit']}', `assignMax`='{$_REQUEST['maxColum']}', `assignPass`='{$_REQUEST['passColum']}', `subResult`='{$_REQUEST['newValue']}' WHERE `assPerfId`='{$_REQUEST['assignPerfId']}'";
		
		//if( $_REQUEST['assessmentType'] ){
			mysql_query("UPDATE `pupilprogress_assignPerfUnits` SET `assignUnit`='{$_REQUEST['assessmentType']}', `assignMax`='{$_REQUEST['maxColum']}', `assignPass`='{$_REQUEST['passColum']}', `subResult`='{$_REQUEST['newValue']}', `subAssessment`='np', `passOrNot`='1' WHERE `id`='{$row['id']}'")or die(mysql_error());
			echo $_REQUEST['assessmentType'];
			//echo "UPDATE `assignPerfUnits` SET `assignUnit`='{$_REQUEST['resultUnit']}', `assignMax`='{$_REQUEST['maxColum']}', `assignPass`='{$_REQUEST['passColum']}', `subResult`='{$_REQUEST['newValue']}', `subAssessment`='np', `passOrNot`='1' WHERE `id`='{$row['id']}'";
		/*}else{
			mysql_query("UPDATE `assignPerfUnits` SET `assignUnit`='{$_REQUEST['resultUnit']}', `assignMax`='{$_REQUEST['maxColum']}', `assignPass`='{$_REQUEST['passColum']}', `subResult`='{$_REQUEST['newValue']}', `subAssessment`='na', `passOrNot`='0' WHERE `id`='{$row['id']}'")or die(mysql_error());
			//echo "UPDATE `assignPerfUnits` SET `assignUnit`='{$_REQUEST['resultUnit']}', `assignMax`='{$_REQUEST['maxColum']}', `assignPass`='{$_REQUEST['passColum']}', `subResult`='{$_REQUEST['newValue']}', `subAssessment`='na' WHERE `id`='{$row['id']}'";
		}*/
		
	}else{
		mysql_query("INSERT INTO `pupilprogress_assignPerfUnits` (`assPerfId`,`assignUnit`,`assignMax`,`assignPass`,`subResult`,`subAssessment`,`countUnit`) VALUE('{$_REQUEST['assignPerfId']}','{$_REQUEST['resultUnit']}','{$_REQUEST['maxColum']}','{$_REQUEST['passColum']}','{$_REQUEST['newValue']}','na','0')")or die(mysql_error());		
	}
}

//***************************************************************************
//change result unit for no Evalution in assesment type
if( $_REQUEST['action'] == 'change_result_assesmentNov_evaluation' ){
	$res = mysql_query("SELECT * FROM `resultsets` WHERE `resultset_id`='{$_REQUEST['resultId']}'")or die(mysql_error());
	$row = mysql_fetch_assoc( $res );
	
	if( $row['resultset_id'] ){
		//mysql_query("UPDATE `assignPerfUnits` SET `assignUnit`='{$_REQUEST['resultUnit']}', `assignMax`='{$_REQUEST['maxColum']}', `assignPass`='{$_REQUEST['passColum']}', `subResult`='{$_REQUEST['newValue']}', `subAssessment`='na' WHERE `assPerfId`='{$_REQUEST['assignPerfId']}'")or die(mysql_error());
		//echo "UPDATE `assignPerfUnits` SET `assignUnit`='{$_REQUEST['resultUnit']}', `assignMax`='{$_REQUEST['maxColum']}', `assignPass`='{$_REQUEST['passColum']}', `subResult`='{$_REQUEST['newValue']}' WHERE `assPerfId`='{$_REQUEST['assignPerfId']}'";
		
		//if( $_REQUEST['assessmentType'] ){
			mysql_query("UPDATE `pupilprogress_assignPerfUnits` SET `assignUnit`='{$_REQUEST['resultUnit']}', `assignMax`='{$_REQUEST['maxColum']}', `assignPass`='{$_REQUEST['passColum']}', `subResult`='{$_REQUEST['newValue']}', `subAssessment`='{$_REQUEST['assessmentType']}', `passOrNot`='1' WHERE `id`='{$row['id']}'")or die(mysql_error());
			echo $_REQUEST['assessmentType'];
			//echo "UPDATE `assignPerfUnits` SET `assignUnit`='{$_REQUEST['resultUnit']}', `assignMax`='{$_REQUEST['maxColum']}', `assignPass`='{$_REQUEST['passColum']}', `subResult`='{$_REQUEST['newValue']}', `subAssessment`='np', `passOrNot`='1' WHERE `id`='{$row['id']}'";
		/*}else{
			mysql_query("UPDATE `assignPerfUnits` SET `assignUnit`='{$_REQUEST['resultUnit']}', `assignMax`='{$_REQUEST['maxColum']}', `assignPass`='{$_REQUEST['passColum']}', `subResult`='{$_REQUEST['newValue']}', `subAssessment`='na', `passOrNot`='0' WHERE `id`='{$row['id']}'")or die(mysql_error());
			//echo "UPDATE `assignPerfUnits` SET `assignUnit`='{$_REQUEST['resultUnit']}', `assignMax`='{$_REQUEST['maxColum']}', `assignPass`='{$_REQUEST['passColum']}', `subResult`='{$_REQUEST['newValue']}', `subAssessment`='na' WHERE `id`='{$row['id']}'";
		}*/
		
	}else{
		mysql_query("INSERT INTO `pupilprogress_assignPerfUnits` (`assPerfId`,`assignUnit`,`assignMax`,`assignPass`,`subResult`,`subAssessment`,`countUnit`) VALUE('{$_REQUEST['assignPerfId']}','{$_REQUEST['resultUnit']}','{$_REQUEST['maxColum']}','{$_REQUEST['passColum']}','{$_REQUEST['newValue']}','na','0')")or die(mysql_error());		
	}
}
?>
