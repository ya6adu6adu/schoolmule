<?php
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

if( $_REQUEST['action'] == 'select_info' ){
	/*
	$resSelect = mysql_query("SELECT * FROM `checkpupil` WHERE 1")or die( mysql_error() );
	$rowSelect = mysql_fetch_assoc( $resSelect );
	if( $rowSelect['check'] == 'Staff/Admin' AND $_SESSION['script'] != 1 ){
		$_SESSION['script'] = 1;
	}
	*/
	
	//Request pupilid and studygroupId
	$pupilId = $_REQUEST['pupilId'];
	$studyGroupId = $_REQUEST['StudyGroupID'];
	
	//check or pupil un blocked in system
	//$res = mysql_query("SELECT * FROM `hidegroup` WHERE `pupil_id`='{$pupilId}'")or die(mysql_error());
	//$row = mysql_fetch_assoc( $res );
	if( /*$row['hidden'] == '1'*/ !1 ){
		echo "Sorry but this pupil in this study group is blocked!";
	}else{	
		/*if need you can uncomment this rows for hide columns	
		$hide_group = $_REQUEST['hide_group'];
		$hide_objective = $_REQUEST['hide_objective'];
		$hide_assign = $_REQUEST['hide_assign'];
		$hide_unit = $_REQUEST['hide_unit'];
		$hide_max = $_REQUEST['hide_max'];
		$hide_pass = $_REQUEST['hide_pass'];
		$hide_result = $_REQUEST['hide_result'];
		$hide_assesment = $_REQUEST['hide_assesment'];*/
		$hide_quality = $_REQUEST['hide_quality'];
		
		//declare an object of class hideColumn
		$_hideColumn = new hideColumn();
		
		
		//check which columns hide or show
		//$res = mysql_query("SELECT * FROM `hidecolumn` WHERE `pupil_id`='{$pupilId}'") or  die(mysql_error());
		//$row = mysql_fetch_assoc( $res );
		/*
        if( $hide_quality != '' $hide_group != '' OR $hide_group != '' OR $hide_objective != '' OR $hide_assign != '' OR $hide_unit != '' OR $hide_max != '' OR $hide_pass != '' OR $hide_result != '' OR $hide_assesment != '' OR ){
			if( $row['pupilId'] != $pupilId ){
				mysql_query("INSERT INTO `hidecolumn` (`hide_group`,`hide_objective`,`hide_assign`,`hide_unit`,`hide_max`,`hide_pass`,`hide_result`,`hide_assesment`,`hide_quality`,`pupil_id`)
						VALUE('{$hide_group}','{$hide_objective}','{$hide_assign}','{$hide_unit}','{$hide_max}','{$hide_pass}','{$hide_result}','{$hide_assesment}','{$hide_quality}','{$pupilId}')") or die(mysql_error());
			}else{
				mysql_query("UPDATE `hidecolumn` SET `hide_group`='{$hide_group}', `hide_objective`='{$hide_objective}', `hide_assign`='{$hide_assign}', `hide_unit`='{$hide_unit}', `hide_max`='{$hide_max}', `hide_pass`='{$hide_pass}', `hide_result`='{$hide_result}', `hide_assesment`='{$hide_assesment}', `hide_quality`='{$hide_quality}'
						WHERE `pupil_id`={$pupilId} ") or die(mysql_error());
			}
		}
		*/
		// tree content is loading here from XML file (xml file create from DB) - for Dialog 5 and 6
		echo "<script type=\"text/javascript\" src=\"schoolmodule/js/jsAjax.js\"></script>";
		
		//declare an object of class group_pupil
		$_group_pupil = new group_pupil();

		//declare an object of class group
		$_group = new group();
		
		//declare an object of class objective_pupil
		$_objective_pupil = new objective_pupil();
		
		//declare an object of class objectiveName
		$_objectiveName = new objectiveName();
		
		//declare an object of class objectiveWeight
		$_objectiveWeight = new objectiveWeight();
		
		//declare an object of class assignmentOrPerformance
		$_assignmentOrPerformance = new assignmentOrPerformance();
		
		//declare an object of class assignPerfUnits
		$_assignPerfUnits = new assignPerfUnits();
		
		//declare an object of class perfUnits
		$_perfUnits = new perfUnits();
		
		//declare an object of class system_settings_table
		$_system_settings_table = new system_settings_table();
		
		//select from database grade settings
		$system_settings_table = $_system_settings_table->GetAll("","1");
		
		
		/* Create context menu for quality and assesment box */
		$grade .= "<div id='quality_assesment' class='quality_assesment'>";
		$grade1 .= "<div id='quality_assesment' class='quality_assesment'>";
		//$countsystem_settings_table = count($system_settings_table);
		for( $gr = 0; $gr < count($system_settings_table); $gr++){
			if( $system_settings_table[$gr]['title_en'] == 'Fx' )
				$grade .= "<div id='liFx' onmouseover=\"this.style.background='#DDDDDD';\" onmouseout=\"this.style.background='#EEEEEE';\">--</div>";
			else
				$grade .= "<div id='li{$system_settings_table[$gr]['title_en']}' onmouseover=\"this.style.background='#DDDDDD';\" onmouseout=\"this.style.background='#EEEEEE';\">{$system_settings_table[$gr]['title_en']}</div>";
				
			if( $system_settings_table[$gr]['title_en'] == 'Fx' )
				$grade1 .= "<div class='assesmentliFx' onmouseover=\"this.style.background='#DDDDDD';\" onmouseout=\"this.style.background='#EEEEEE';\" >--</div>";
			else
				$grade1 .= "<div class='assesmentli{$system_settings_table[$gr]['title_en']}' onmouseover=\"this.style.background='#DDDDDD';\" onmouseout=\"this.style.background='#EEEEEE';\" >{$system_settings_table[$gr]['title_en']}</div>";
		}$grade .= "</div>";
		$grade1 .= "</div>";

        $grade2 = "
            <div id='quality_assesment' class='quality_assesment' style='width: 50px;'>
                <div class='pass' onmouseover=\"this.style.background='#DDDDDD';\" onmouseout=\"this.style.background='#EEEEEE';\">".dlang("passvalue","Pass")."</div>
                <div class='notpass' onmouseover=\"this.style.background='#DDDDDD';\" onmouseout=\"this.style.background='#EEEEEE';\">".dlang("npassvalue","NPass")."</div>
            </div>
        ";
		
		//header table
		echo $echo1 ="
		<div style='width:97%; margin: 5px 14px 0 14px;'>
			<table border='0' class='headerTable' style='' cellspacing='0' cellpadding='0'>
				<tr>
					<td style='background-color:#c9c7c7;'>
						<table border='0' style='width: 98%; border:mintCream; background-color:#f2f2f2; margin-left:1%;' cellspacing='0' cellpadding='0'>
							<tr style='width:73%;'>
								<input id='hidden_pupil_id' type='hidden' value='$pupilId' />
								<td class='tdobjective tdobjective2' style='text-align:left; width: 16%; padding-left:6px; padding-top:4px; padding-bottom:4px;'>".dlang("module_objective","Objective")."</td>
								<td class='tdassign tdassignHideShow' style='text-align:left; width: 34%; padding-left:6px; padding-top:4px; padding-bottom:4px;'>".dlang("module_ass_perf","Assignments and performents")."</td>
								<td class='tdunit tdassignHideShow' style='text-align:left; width: 7%; padding-left:6px; padding-top:4px; padding-bottom:4px;'>".dlang("module_unit","Unit")."</td>
								<td class='tdmax tdassignHideShow' style='text-align:left; width: 6%; padding-left: 6px; padding-top:4px; padding-bottom:4px;'>".dlang("module_max","Max")."</td>
								<td class='tdpass tdassignHideShow' style='text-align:left; width: 6%; padding-left: 6px; padding-top:4px; padding-bottom:4px;' >".dlang("module_pass","Pass")."</td>
								<td class='tdresult2 tdassignHideShow' style='text-align:left; width: 6%; padding-left: 6px; padding-top:4px; padding-bottom:4px;'>".dlang("module_result","Result")."</td>
								<td class='tdassesment tdassignHideShow' style='text-align:left; width: 15%; padding-left:6px; padding-top:4px; padding-bottom:4px;'>".dlang("module_assesment","Assesment")."</td>
								<td class='tdquality' style='text-align:left; width: 10%; padding-left:6px; padding-top:4px; padding-bottom:4px;'>".dlang("module_quality","Quality")."</td>
							</tr>
						</table>
					</td>
				</tr>
			</table><br/>
		";
		
		//check hide or show group
		function isGroupHidden( $groupId, $pupilId/*, $studyGroupId, $courseId */){
            /*
			//declare an object of class hideGroup
			$_hideGroup = new hideGroup();
			
			$hideGroup = $_hideGroup->GetAll("`pupil_id` ASC","`objectivegroup_id`='{$groupId}'");
			
			//$counthideGroup = count($hideGroup);
			for( $i = 0; $i < count($hideGroup); $i++ ){
					return true;
			}
            */
		}
		//check hide or show objective
		function isObjectiveHidden( $objectiveId, $pupilId ){
			//declare an object of class HideAssignment
			$_hideObjective = new hideObjective();
			
			$hideObjective = $_hideObjective->GetAll("`pupil_id` ASC","`objective_id`='{$objectiveId}'");
			
			//$counthideObjective = count($hideObjective);
			for( $i = 0; $i < count($hideObjective); $i++ ){
				if( $hideObjective[$i]['pupil_id'] == $pupilId /*OR $hideGroup[$i]['studygroup_id'] == $studyGroupId*/ )
					return true;
				/*if( $hideGroup[$i]['studyGroupId'] == $studyGroupId )
					return true;
				if( $hideGroup[$i]['courseId'] == $courseId )
					return true;*/
			}
		}
		//check hide or show assignment
		function isAssignmentHidden( $assignmentId ){
			//declare an object of class HideAssignment
			$_hideAssignment = new HideAssignment();
			$hideAssignment = $_hideAssignment->GetAll("`hide_from` ASC","`assignment_id`='{$assignmentId}'");
			//$counthideAssignment = count($hideAssignment);
			for( $i = 0; $i < count($hideAssignment); $i++ ){
				if( $hideAssignment[$i]['hide_from'] == 'pupil' OR $hideAssignment[$i]['hide_from'] == 'studyGroup' OR $hideAssignment[$i]['hide_from'] == 'course' )
					return true;
			}
		}


		//select all fields from table group_pupil
		//$group_pupil = $_group_pupil->GetAll("","`pupil_id`='{$pupilId}'");
		$group_pupil = null;

				$echo = "
						<div id='menu1'>
							<div id='goupdiv' style='margin-top: 1px; cursor: default; padding-top: 1px; padding-bottom: 1px;' onmouseover=\"this.style.background='#DDDDDD';\" onmouseout=\"this.style.background='#EEEEEE';\"><span class='goupspan' style='margin-left:4px;'><a href='https://www.google.com.ua'> Go to group </a></span></div>
							<!--<div id='add_group' style='margin-top: 4px; cursor: default; padding-top: 1px; padding-bottom: 1px;' onmouseover=\"this.style.background='#DDDDDD';\" onmouseout=\"this.style.background='#EEEEEE';\"><span class='goupspan' style='margin-left:4px;'>Add group</span></div>
							<div id='add_objective' style='margin-top: 4px; cursor: default; padding-top: 1px; padding-bottom: 1px;' onmouseover=\"this.style.background='#DDDDDD';\" onmouseout=\"this.style.background='#EEEEEE';\"><span class='goupspan' style='margin-left:4px;'>Add objective to this group</span></div>
							<div id='hide_group' alt='{$group[$j]['title_en']}' style='margin-top: 4px; cursor: default; padding-top: 1px; padding-bottom: 1px;' onmouseover=\"this.style.background='#DDDDDD';\" onmouseout=\"this.style.background='#EEEEEE';\"><span class='goupspan' style='margin-left:4px;'>Hide this group</span></div>
							<div id='view_hidden' style='margin-top: 4px; cursor: default; padding-top: 1px; padding-bottom: 1px;' onmouseover=\"this.style.background='#DDDDDD';\" onmouseout=\"this.style.background='#EEEEEE';\"><span class='goupspan' style='margin-left:4px;'>View hidde items</span></div>
							<div id='delete_group' style='margin-top: 4px; cursor: default; padding-top: 1px; padding-bottom: 1px;' onmouseover=\"this.style.background='#DDDDDD';\" onmouseout=\"this.style.background='#EEEEEE';\"><span class='goupspan' style='margin-left:4px;'>Delete this group</span></div>-->
						</div>
						<table class='mainTable' style='' cellspacing='0' cellpadding='0' border='0'>
							<tr>
								<td style='background-color:#c9c7c7; border-right:1px solid rgb(179, 179, 179);'>
									<table border='0' class='tableGroup' style='' cellspacing='0' cellpadding='0'>";
									
				$objectiveName = null;

				
				$res = mysql_query("
				SELECT DISTINCT course_objectives.objective_id as objective_id, course_objectives.title_en as title_en,
				course_objectives.weight as weight, course_objectives.quality as quality
				FROM  course_objectives
				WHERE course_objectives.studygroup_id={$studyGroupId}
				");

                /*WHERE pupli_submission_slot.pupil_id={$pupilId}
                AND pupli_submission_slot.assignment_id=resultsets.assignment_id
                AND resultsets.resultset_id=resultset_to_course_objectives.resultset_id
                AND resultset_to_course_objectives.objective_id = course_objectives.objective_id*/

				while($row = mysql_fetch_assoc($res)){
					$objectiveName[] = $row;
				}

				$res = mysql_query("
				SELECT DISTINCT course_objectives.objective_id as objective_id, course_objectives.title_en as title_en,
				course_objectives.weight as weight, course_objectives.quality as quality
				FROM pupil_performance_assessment, resultsets, resultset_to_course_objectives, course_objectives, performance
				WHERE pupil_performance_assessment.pupil_id={$pupilId}
				AND pupil_performance_assessment.performance_id=performance.performance_id
				AND pupil_performance_assessment.resultset_id=resultsets.resultset_id
				AND resultsets.resultset_id=resultset_to_course_objectives.resultset_id
				AND resultset_to_course_objectives.objective_id = course_objectives.objective_id
				AND course_objectives.studygroup_id={$studyGroupId}
				");
				
				while($row = mysql_fetch_assoc($res)){
					$iss_falg = false;
					for ($m=0; $m < count($objectiveName); $m++) { 
						if($objectiveName[$m]['objective_id']==$row['objective_id']){
							$iss_falg = true;
						}
					}
					if(!$iss_falg)
						$objectiveName[] = $row;
				}
				//select all objective from database
				//$objectiveName = $_objectiveName->GetAll("`title_en` ASC","`objectivegroup_id`='{$group[$j]['objectivegroup_id']}'");
				
				//show all objective
				// id="menu2" first item it's "Go to" you can add link here
				for( $x = 0; $x < count($objectiveName); $x++){
					$assignmentOrPerformance = null;
					//check which objective is hidden
					//if( isObjectiveHidden( $objectiveName[$x]['objective_id'], $pupilId ) )
						//continue;
					
					$echo .= "<tr class='objname'>
								<input class='obj_height' type='hidden' value='' />
								<td id='tdobjective' class='tdobjective' style='padding: 6px 0px 0px 6px; width: 16%; vertical-align: top;'>".dlang("module_objective_int","Objective")."<br />
									<input id='objectiveId' type='hidden' value='{$objectiveName[$x]['objective_id']}' />
									<div id='menu2'>
									    <input id='objectiveId' type='hidden' value='{$objectiveName[$x]['objective_id']}' />
										<div id='go_to_objective' style='margin-top: 1px; cursor: default; padding-top: 1px; padding-bottom: 1px;' onmouseover=\"this.style.background='#DDDDDD';\" onmouseout=\"this.style.background='#EEEEEE';\"><span style='margin-left:4px;'>".dlang("modeule_menu_objective_view","View Objective description and Grading")."</span></div>
										".($user->role=='pupil' || $user->role=='parent'? '': "<div id='obj_weight' style='margin-top: 4px; cursor: default; padding-top: 1px; padding-bottom: 1px;' onmouseover=\"this.style.background='#DDDDDD';\" onmouseout=\"this.style.background='#EEEEEE';\"><span style='margin-left:4px;'>".dlang("modeule_menu_objective_weight","Change objective weight")."</span></div>")."
										<!--<div id='add_objective' style='margin-top: 4px; cursor: default; padding-top: 1px; padding-bottom: 1px;' onmouseover=\"this.style.background='#DDDDDD';\" onmouseout=\"this.style.background='#EEEEEE';\"><span style='margin-left:4px;'>Add objective</span></div>
										<div id='add_assignment' style='margin-top: 4px; cursor: default; padding-top: 1px; padding-bottom: 1px;' onmouseover=\"this.style.background='#DDDDDD';\" onmouseout=\"this.style.background='#EEEEEE';\"><span style='margin-left:4px;'>Add assignment to this objective</span></div>
										<div id='add_perfomence' style='margin-top: 4px; cursor: default; padding-top: 1px; padding-bottom: 1px;' onmouseover=\"this.style.background='#DDDDDD';\" onmouseout=\"this.style.background='#EEEEEE';\"><span style='margin-left:4px;'>Add performance to this objective</span></div>
										<div id='hide_objective' alt='{$objectiveName[$x]['title_en']}' style='margin-top: 4px; cursor: default; padding-top: 1px; padding-bottom: 1px;' onmouseover=\"this.style.background='#DDDDDD';\" onmouseout=\"this.style.background='#EEEEEE';\"><span style='margin-left:4px;'>Hide this objective</span></div>
										<div id='view_hidden' style='margin-top: 4px; cursor: default; padding-top: 1px; padding-bottom: 1px;' onmouseover=\"this.style.background='#DDDDDD';\" onmouseout=\"this.style.background='#EEEEEE';\"><span style='margin-left:4px;'>View hidden items</span></div>
										<div id='delete_objective' style='margin-top: 4px; cursor: default; padding-top: 1px; padding-bottom: 1px;' onmouseover=\"this.style.background='#DDDDDD';\" onmouseout=\"this.style.background='#EEEEEE';\"><span class='goupspan' style='margin-left:4px;'>Delete this objective</span></div>-->
									</div>
									<div class='heightObjective' style='font-weight:bold;float:left;'><div class='objective_name'>".$objectiveName[$x]['title_en']."</div>";


					//select objective weight for each objective

					//$objectiveWeight = $_objectiveWeight->GetAll("","`objective_id`='{$objectiveName[$x]['objective_id']}'");

					//show objective weight
					//for( $z = 0; $z < count($objectiveWeight); $z++ )
					$echo .= "<br /><span class='objWeight'>". $objectiveName[$x]['weight'] ."</span>%</div></td>";
					
					$echo .= "<td class='tdassign' style='width:74%;'>
								<table border='0' style='width: 100%; border:mintCream;' cellspacing='0' cellpadding='0'>";
						
						// select assignment/perfomence for each objective

						$perfIds = mysql_query("
						 SELECT DISTINCT performance.performance_id as performance_id, performance.title_en as title_en, resultset_to_course_objectives.type as type
						 FROM resultset_to_course_objectives,resultsets,performance,pupil_performance_assessment
						 WHERE resultset_to_course_objectives.objective_id={$objectiveName[$x]['objective_id']}
						 AND resultset_to_course_objectives.resultset_id=resultsets.resultset_id
						 AND resultset_to_course_objectives.type = 'performance'
						 AND performance.performance_id=resultsets.performance_id
						 AND pupil_performance_assessment.performance_id = performance.performance_id
						 AND pupil_performance_assessment.pupil_id = {$pupilId}
						 AND pupil_performance_assessment.active = 1
						 ")or die( mysql_error());
						while($row = mysql_fetch_assoc($perfIds)){
							$assignmentOrPerformance[] = $row;
						}
						
						$assinIds = mysql_query("SELECT DISTINCT course_rooms_assignments.assignment_id as assignment_id, course_rooms_assignments.title_en as title_en, resultset_to_course_objectives.type as type,
						 DATEDIFF(course_rooms_assignments.deadline_date, CURDATE()) as dl_date
						 FROM resultset_to_course_objectives,resultsets,course_rooms_assignments, pupli_submission_slot
						 WHERE resultset_to_course_objectives.objective_id={$objectiveName[$x]['objective_id']} 
						 AND resultset_to_course_objectives.resultset_id=resultsets.resultset_id
						 AND resultset_to_course_objectives.type = 'assignment'
						 AND course_rooms_assignments.assignment_id=resultsets.assignment_id
						 AND pupli_submission_slot.assignment_id = course_rooms_assignments.assignment_id
						 AND pupli_submission_slot.pupil_id = {$pupilId}
						 AND pupli_submission_slot.active = 1
						 ")or die( mysql_error());
						 
						while($row = mysql_fetch_assoc($assinIds)){
							$assignmentOrPerformance[] = $row;
						}

						//$assignmentOrPerformance = $_assignmentOrPerformance->GetAll("`assignPerfType`,`order` ASC","`objectiveId`='{$objectiveName[$x]['objective_id']}' AND `public`='1' AND `invisible`='1' ");
						//$_assignmentOrPerformance->Debug($assignmentOrPerformance);
						
						//show assignment/perfomence
						for( $c = 0; $c < count($assignmentOrPerformance); $c++ ){
					
							//check which assignment/perfomence is hidden
							
							//if( isAssignmentHidden( $assignmentOrPerformance[$c]['assignment_id']  ) )
								//continue;
							
							$assignPerfType = $assignmentOrPerformance[$c]['type'];
							// show cells for perfomense
							// id="menu3" first item it's "Go to" you can add link here
							if( $assignPerfType == 'performance' ){
								$echo .= "<tr class='amountAssign Performance' >
											<td id='objectiveName' class='objectiveName perfomenceHighlight' style='width: 46%; border: none;'>
												<input id='value' type='hidden' value='perfomence' />
												<input id='assignPerfId' type='hidden' value='{$assignmentOrPerformance[$c]['performance_id']}' />
												<input id='objectiveId' type='hidden' value='{$objectiveName[$x]['objective_id']}' />
												<div id='menu3'>
													<div style='margin-top: 1px; cursor: default; padding-top: 1px; padding-bottom: 1px;' onmouseover=\"this.style.background='#DDDDDD';\" onmouseout=\"this.style.background='#EEEEEE';\"><span class='go_to_performance' style='margin-left:4px;'>".dlang("go_to_performance_module","Go to performance")."</span></div>
													<!--<div id='add_assignment' style='margin-top: 4px; cursor: default; padding-top: 1px; padding-bottom: 1px;' onmouseover=\"this.style.background='#DDDDDD';\" onmouseout=\"this.style.background='#EEEEEE';\"><span style='margin-left:4px;'>Add assignment to this objective</span></div>
													<div id='add_perfomence' style='margin-top: 4px; cursor: default; padding-top: 1px; padding-bottom: 1px;' onmouseover=\"this.style.background='#DDDDDD';\" onmouseout=\"this.style.background='#EEEEEE';\"><span style='margin-left:4px;'>Add performance to this objective</span></div>
													<div id='hide_assin_perf' style='margin-top: 4px; cursor: default; padding-top: 1px; padding-bottom: 1px;' onmouseover=\"this.style.background='#DDDDDD';\" onmouseout=\"this.style.background='#EEEEEE';\"><span style='margin-left:4px;'>Hide this assignment/performance</span></div>
													<div id='view_hidden' style='margin-top: 4px; cursor: default; padding-top: 1px; padding-bottom: 1px;' onmouseover=\"this.style.background='#DDDDDD';\" onmouseout=\"this.style.background='#EEEEEE';\"><span style='margin-left:4px;'>View hidden items</span></div>
													<div id='delete_assign' style='margin-top: 4px; cursor: default; padding-top: 1px; padding-bottom: 1px;' onmouseover=\"this.style.background='#DDDDDD';\" onmouseout=\"this.style.background='#EEEEEE';\"><span class='goupspan' style='margin-left:4px;'>Delete this performance</span></div>-->
												</div>
												<img style='/*position:absolute;*/ top:1px; left: 3px;'  src='dhtmlx/dhtmlxTree/codebase/imgs/csh_schoolmule/assessment.png' /><span style='position:relative; top:-4px; left: 5px;'>". $assignmentOrPerformance[$c]['title_en'] ."</span>

											</td>
											<td id='emptyResult' style='border: none; width: 54%;'>
												<input id='assignPerfId' type='hidden' value='{$assignmentOrPerformance[$c]['performance_id']}' />
												<table id='table_unit' class='table_unit' border='0' cellspacing='0' cellpadding='0'>";
									
									$assignPerfUnits = $_perfUnits->GetAll("","`performance_id`='{$assignmentOrPerformance[$c]['performance_id']}' AND `pupil_id`='{$pupilId}'");
									//show units
									
									for( $v = 0; $v < count($assignPerfUnits); $v++ ){
									
										if( $assignPerfUnits[$v]['assessment'] == 'F' OR $assignPerfUnits[$v]['assessment'] == 'np' )
											$style = 'color: red;';
										else
											$style = 'color: green;';
										
										include('validation.php');
										
									}$echo .= "</table></td></tr>";	
								
								}else{
								// show cells for assignemnt
								$echo .= "<tr class='amountAssign Assignment'>
											<td id='objectiveName' class='objectiveName' style='width: 46%;'>
												<input id='assignPerfId' type='hidden' value='{$assignmentOrPerformance[$c]['assignment_id']}' />
												<input id='objectiveId' type='hidden' value='{$objectiveName[$x]['objective_id']}' />
												<div id='menu3'>
													<div style='margin-top: 1px; cursor: default; padding-top: 1px; padding-bottom: 1px;' onmouseover=\"this.style.background='#DDDDDD';\" onmouseout=\"this.style.background='#EEEEEE';\"><span class='go_to_assignment' style='margin-left:4px;'>".dlang("go_to_assign_module","Go to assignment")."</span></div>
													<!--<div id='add_assignment' style='margin-top: 4px; cursor: default; padding-top: 1px; padding-bottom: 1px;' onmouseover=\"this.style.background='#DDDDDD';\" onmouseout=\"this.style.background='#EEEEEE';\"><span style='margin-left:4px;'>Add assignment to this objective</span></span></div>
													<div id='add_perfomence' style='margin-top: 4px; cursor: default; padding-top: 1px; padding-bottom: 1px;' onmouseover=\"this.style.background='#DDDDDD';\" onmouseout=\"this.style.background='#EEEEEE';\"><span style='margin-left:4px;'>Add performance to this objective</span></span></div>
													<div id='hide_assin_perf' style='margin-top: 4px; cursor: default; padding-top: 1px; padding-bottom: 1px;' onmouseover=\"this.style.background='#DDDDDD';\" onmouseout=\"this.style.background='#EEEEEE';\"><span style='margin-left:4px;'>Hide this assignment/performance</span></span></div>
													<div id='view_hidden' style='margin-top: 4px; cursor: default; padding-top: 1px; padding-bottom: 1px;' onmouseover=\"this.style.background='#DDDDDD';\" onmouseout=\"this.style.background='#EEEEEE';\"><span style='margin-left:4px;'>View hidden items</span></span></div>
													<div id='delete_assign' style='margin-top: 4px; cursor: default; padding-top: 1px; padding-bottom: 1px;' onmouseover=\"this.style.background='#DDDDDD';\" onmouseout=\"this.style.background='#EEEEEE';\"><span class='goupspan' style='margin-left:4px;'>Delete this assignment</span></div>-->
												</div>
												<img style='/*position:absolute;*/ top:1px; left: 3px;' src='dhtmlx/dhtmlxTree/codebase/imgs/csh_schoolmule/submission.png' /><span style='position:relative; top:-4px; left: 5px;'>". $assignmentOrPerformance[$c]['title_en'] ."</span>
											</td>
											<td id='emptyResult' style='border: none; width: 54%;'>
												<input id='assignPerfId' type='hidden' value='{$assignmentOrPerformance[$c]['assignment_id']}' />
												<table id='table_unit' class='table_unit' border='0' cellspacing='0' cellpadding='0'>";
								
								$res = mysql_query("SELECT pupli_submission_slot.status as status,course_rooms_assignments.deadline_date as deadline
								FROM pupli_submission_slot,course_rooms_assignments WHERE pupli_submission_slot.pupil_id = {$pupilId} AND pupli_submission_slot.assignment_id={$assignmentOrPerformance[$c]['assignment_id']}
								AND course_rooms_assignments.assignment_id=pupli_submission_slot.assignment_id");	
								$row = mysql_fetch_assoc($res);
								//$row['deadline'] == '0'	;						
								//select units for each assignment/perfomence
								$status = $row['status'];
								if($row['status'] == 'Not subm. ewfwefewfwefewf' ){
									if(((int) $assignmentOrPerformance[$c]['dl_date']) > 0 || $assignmentOrPerformance[$c]['dl_date']==''){
										$styleColor = 'background-color: #56aaff;';
									}else
										$styleColor = 'background-color:rgb(255, 187, 184);';
									$echo .= "<tr class='heightresult'>
									            <td  style='display: none;' id='runit_id' >". $assignPerfUnits[$v]['result_unit_id'] ."</td>
                                                <td id='resultId' style='display: none;'>". $assignPerfUnits[$v]['resultset_id'] ."</td>
                                                <td id='submission_result' style='display: none;'>". $assignPerfUnits[$v]['submission_result'] ."</td>
                                                <td title='{$assignPerfUnits[$v]['result_unit']}' id='callChangeResult' class='tdunit unit' style='width: 17%; text-align:left; padding-left:6px;'><input class='unitsWidthOrg' type='hidden' value='$units' /><span class='unitsWidth'>". $units ."</span></td>
                                                <td title='{$assignPerfUnits[$v]['result_max']}' id='callChangeResult' class='tdmax unit' style='width: 15%;'><span>". $assignPerfUnits[$v]['result_max'] ."</span></td>
                                                <td title='{$assignPerfUnits[$v]['result_pass']}' id='callChangeResult' class='tdpass unit' style='width: 15%;'><span>". $assignPerfUnits[$v]['result_pass'] ."</span></td>
                                                <td title='{$assignPerfUnits[$v]['result']}' id='callChangeResult' class='tdresult' style='width: 15%; background-color:#f5eab2;'><div style='{$style}'>". $assignPerfUnits[$v]['result'] ."</div></td>
												<td title='Not submitted' class='unit1 not_submitted_unit' style='width: 38%; text-align:left; padding-left:6px; {$styleColor}'><span>".dlang("module_ns","Not submitted")."</span></td>
											  </tr>";
								}else{
                                    $res = mysql_query("SELECT * FROM resultsets, resultset_to_course_objectives
										WHERE resultsets.assignment_id={$assignmentOrPerformance[$c]['assignment_id']}
										AND resultset_to_course_objectives.resultset_id = resultsets.resultset_id
										AND resultset_to_course_objectives.objective_id = {$objectiveName[$x]['objective_id']}
									");

                                    $assignPerfUnits = null;
                                    while($row = mysql_fetch_assoc($res)){
                                        $assignPerfUnits[] = $row;
                                    }

									//$assignPerfUnits = $_assignPerfUnits->GetAll("","`assignment_id`='{$assignmentOrPerformance[$c]['assignment_id']}'");
									
									//show units
									for( $v = 0; $v < count($assignPerfUnits); $v++ ){
										$resultUnit = $assignPerfUnits[$v]['castom_name'];
                                        $resultUnitId = $assignPerfUnits[$v]['result_unit_id'];

										$strLen = strlen($resultUnit);
										if( $strLen > 7 )
											$units = substr($resultUnit, 0, 7);
										else
											$units = $resultUnit;
										
										//if($resultUnitId == '2')
										//	$units = '%';

                                        $res = mysql_query("SELECT pupil_submission_result.pupil_submission_result_id as submission_result, pupil_submission_result.result as result, pupil_submission_result.assessment as assessment FROM pupil_submission_result, resultsets, pupli_submission_slot, resultset_to_course_objectives
										WHERE resultsets.resultset_id={$assignPerfUnits[$v]['resultset_id']}
										AND resultset_to_course_objectives.resultset_id = resultsets.resultset_id
										AND resultset_to_course_objectives.objective_id = {$objectiveName[$x]['objective_id']}
										AND resultsets.resultset_id = pupil_submission_result.result_set_id
										AND pupli_submission_slot.submission_slot_id = pupil_submission_result.submission_slot_id
										AND pupli_submission_slot.pupil_id = {$pupilId}
										");
										
										while($row = mysql_fetch_assoc($res)){
											$assignPerfUnits[$v]['result_unit'] = $units;
											$assignPerfUnits[$v]['result'] = $row['result'];
											$assignPerfUnits[$v]['assessment'] = $row['assessment'];
                                            $assignPerfUnits[$v]['submission_result'] = $row['submission_result'];
											$assignPerfUnits[$v]['deadline'] = $assignmentOrPerformance[$c]['dl_date']>0?"0":"1";
										}

                                        if($status == dlang("grids_not_subm_text","Not subm.")){
                                            if(((int) $assignmentOrPerformance[$c]['dl_date']) > 0 || $assignmentOrPerformance[$c]['dl_date']==''){
                                                $styleColor = 'background-color: #56aaff;';
                                            }else
                                                $styleColor = 'background-color:rgb(255, 187, 184);';
                                            $echo .= "<tr class='heightresult'>
                                                <td  style='display: none;' id='runit_id' >". $assignPerfUnits[$v]['result_unit_id'] ."</td>
                                                <td id='resultId' style='display: none;' >". $assignPerfUnits[$v]['resultset_id'] ."</td>
                                                <td id='submission_result' style='display: none;'>". $assignPerfUnits[$v]['submission_result'] ."</td>
                                                <td title='{$assignPerfUnits[$v]['result_unit']}' id='callChangeResult' class='tdunit unit' style='width: 17%; text-align:left; padding-left:6px;'><input class='unitsWidthOrg' type='hidden' value='$units' /><span class='unitsWidth'>". $units ."</span></td>
                                                <td title='{$assignPerfUnits[$v]['result_max']}' id='callChangeResult' class='tdmax unit' style='width: 15%;'><span>". $assignPerfUnits[$v]['result_max'] ."</span></td>
                                                <td title='{$assignPerfUnits[$v]['result_pass']}' id='callChangeResult' class='tdpass unit' style='width: 15%;'><span>". $assignPerfUnits[$v]['result_pass'] ."</span></td>
                                                <td title='{$assignPerfUnits[$v]['result']}' id='callChangeResult' class='tdresult' style='width: 15%; background-color:#f5eab2;'><div style='{$style}'>". $assignPerfUnits[$v]['result'] ."</div></td>";
                                            if($v==0){
                                                $echo .= "<td rowspan='".count($assignPerfUnits)."' title='Not submitted' class='unit1 not_submitted_unit' style='width: 38%; text-align:left; padding-left:6px; {$styleColor}'>".($user->role=='pupil' || $user->role=='parent'? '': ($resultUnitId=='4'?$grade2:$grade1)).
                                                    "<table id='heightAssesment' border='0' style='display:none; width:100%; border: mintCream;' cellspacing='0' cellpadding='0'>
                                                        <input id='assPerfId' type='hidden' value='{$assignPerfUnits[$v]['resultset_id']}' />
                                                        <input id='assPerfType' type='hidden' value='{$assignPerfType}' />
                                                        <tr class='noAssesment' id='new_assesment' class='new_assesment'>
                                                            <td class='assesment_F2' style='width:22%; background-color: #F5EAB2; color: #C4C2A9;'><span style=''>F</span></td>
                                                            <td class='assesment_E2' style='width:16%; background-color: #F5EAB2; color: #C4C2A9;'><span style=''>E</span></td>
                                                            <td class='assesment_D2' style='width:16%; background-color: #F5EAB2; color: #C4C2A9;'><span style=''>D</span></td>
                                                            <td class='assesment_C2' style='width:16%; background-color: #F5EAB2; color: #C4C2A9;'><span style=''>C</span></td>
                                                            <td class='assesment_B2' style='width:16%; background-color: #F5EAB2; color: #C4C2A9;'><span style=''>B</span></td>
                                                            <td class='assesment_A2' style='width:16%; background-color: #F5EAB2; color: #C4C2A9;'><span style=''>A</span></td>
                                                        </tr>
					                                </table>".
                                                    "<span>".dlang("module_ns","Not submitted")."</span></td>";
                                            }

                                            $echo .= "</tr>";
                                        }else{
                                            switch($assignPerfUnits[$v]['result_unit_id']){
                                                case "1":
                                                case "2":
                                                if( (int) $assignPerfUnits[$v]['result_pass'] > (int) $assignPerfUnits[$v]['result'])
                                                    $style = 'color: red;';
                                                else
                                                    $style = 'color: green;';
                                                break;
                                                case "3":
                                                    if( $assignPerfUnits[$v]['result_pass'] <  $assignPerfUnits[$v]['result'])
                                                        $style = 'color: red;';
                                                    else
                                                        $style = 'color: green;';
                                                    break;
                                                case "4":
                                                    if( $assignPerfUnits[$v]['result'] == dlang("npassvalue","NPass"))
                                                        $style = 'color: red;';
                                                    else
                                                        $style = 'color: green;';
                                                    break;
                                            }
                                            include('validation.php');
                                        }
										
										

									}								
								}
								

								$echo .= "</table></td></tr>";												
								
							}

						}
						
					// check value for each group and show it
					if( $objectiveName[$x]['quality'] == 'A' or $objectiveName[$x]['quality'] == 'B' or $objectiveName[$x]['quality'] == 'C' or $objectiveName[$x]['quality'] == 'D' or $objectiveName[$x]['quality'] == 'E' ){
						$echo .= "</table><td id='tdquality' class='tdquality' style='width: 16%; padding-left:6px; text-align:center; background-color:#cbe6bd;'>
										<input id='objId' type='hidden' value='{$objectiveName[$x]['objective_id']}' />
										".($user->role=='pupil' || $user->role=='parent'? '': $grade)."
										<span class='quality'>".$objectiveName[$x]['quality']."</span>
									</td></td></tr>
									<tr><td style='border:none; height: 4px; background-color:#c9c7c7' colspan=3;></td></tr>";
					}elseif( $objectiveName[$x]['quality'] == 'F'){
						$echo .= "</table><td id='tdquality' class='tdquality' style='width: 14%; padding-left:6px; text-align:center; background-color:rgb(244, 114, 109);'>
										<input id='objId' type='hidden' value='{$objectiveName[$x]['objective_id']}' />
										".($user->role=='pupil' || $user->role=='parent'? '': $grade)."
										<span class='quality' style='color:white;'>".$objectiveName[$x]['quality']."</span>
									</td></td></tr>
									<tr><td style='border:none; height: 8px; background-color:#c9c7c7' colspan=3;></td></tr>";
					}else{
						$echo .= "</table><td id='tdquality' class='tdquality' style='width: 14%; padding-left:6px; text-align:center; background-color:#f5e8b3;'>
										<input id='objId' type='hidden' value='{$objectiveName[$x]['objective_id']}' />
										".($user->role=='pupil' || $user->role=='parent'? '': $grade)."
										<span class='quality' style='color:black;'>".$objectiveName[$x]['quality']."</span>
									</td></td></tr>
									<tr><td style='border:none; height: 8px; background-color:#c9c7c7' colspan=3;></td></tr>";//f4726d - red
					}
				} $echo .= "</table></td></tr></table><br />";

			echo $echo;

		
		//select which column hide or show
		//$hideColumn = $_hideColumn->GetAll("","`pupil_id`='{$pupilId}'");
        /*
		for( $hc = 0; $hc < count($hideColumn); $hc++){
			if( $hideColumn[$hc]['hide_quality'] == '1' ){
				echo "
					<script type='text/javascript'>
						$('.tdquality').css('display','none');
					</script>
				";
			}
			if( $hideColumn[$hc]['hide_group'] == '1' ){
				echo "
					<script type='text/javascript'>
						$('#tdgroup').css('display','none');
						$('.group').css('display','none');
					</script>
				";
			}
			if( $hideColumn[$hc]['hide_objective'] == '1' ){
				echo "
					<script type='text/javascript'>
						$('.tdobjective').css('display','none');
					</script>
				";
			}
			if( $hideColumn[$hc]['hide_assign'] == '1' ){
				echo "
					<script type='text/javascript'>
						$('.tdassign').css('display','none');
						$('.objectiveName').css('display','none');
					</script>
				";
			}
			if( $hideColumn[$hc]['hide_unit'] == '1' ){
				echo "
					<script type='text/javascript'>
						$('.tdunit').css('display','none');
					</script>
				";
			}
			if( $hideColumn[$hc]['hide_max'] == '1' ){
				echo "
					<script type='text/javascript'>
						$('.tdmax').css('display','none');
					</script>
				";
			}
			if( $hideColumn[$hc]['hide_pass'] == '1' ){
				echo "
					<script type='text/javascript'>
						$('.tdpass').css('display','none');
					</script>
				";
			}
			if( $hideColumn[$hc]['hide_result'] == '1' ){
				echo "
					<script type='text/javascript'>
						$('.tdresult').css('display','none');
					</script>
				";
			}
			if( $hideColumn[$hc]['hide_assesment'] == '1' ){
				echo "
					<script type='text/javascript'>
						$('.tdassesment').css('display','none');
					</script>
				";
			}

		}
        */
	} //echo "<br/>time = {$_SERVER['REQUEST_TIME']}";
	echo '</div>';
}
?>
