<?php
include("../../dbconn.php");
include("../../config.php");

if( $_REQUEST['action'] == 'create_xml' ){
	
	//request value pupil id and study group id
	$pupilId = $_REQUEST['pupilId'];
	$studyGroupID = $_REQUEST['StudyGroupID'];
	$name_pupil = $_REQUEST['name_pupil'];
	$studygroup_pupil = $_REQUEST['studygroup_pupil'];

	//declare an object of class group_pupil
	$_studyGroup_pupil = new studyGroup_pupil();

	//declare an object of class group_pupil
	$_pupil = new Pupil();

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
	
	//declare an object of class hideGroup
	$_hideGroup = new hideGroup();
	
	//declare an object of class HideAssignment
	$_hideAssignment = new HideAssignment();
	$_hidePerformance = new HidePerformance();
	
	//declare an object of class hideObjective
	$_hideObjective = new hideObjective();
	
	//declare an object of class hidePupil
	$_hidePupil = new hidePupil();

	//$group_pupil = $_group_pupil->GetAll("","`pupil_id`='{$pupilId}'");

	$group_pupil = null;
	$res = mysql_query("
	SELECT DISTINCT objectivegroup_id FROM  course_objectives
	");

	
	while($row = mysql_fetch_assoc($res)){
		$group_pupil[] = $row;
	}
	$studyGroup_pupil = $_studyGroup_pupil->GetAll("","`studygroup_id`='{$studyGroupID}'");
	
	// count assignment
	$count = 0;
	
	//declare an object of class hideColumn
	$_hideColumn = new hideColumn();
	$hideColumn = $_hideColumn->GetAll("","`pupil_id`='{$pupilId}'");
	for( $hc = 0; $hc < count($hideColumn); $hc++){	
		/*$hide_group = $hideColumn[$hc]['hide_group'];
		$hide_objective = $hideColumn[$hc]['hide_objective'];
		$hide_assign = $hideColumn[$hc]['hide_assign'];
		$hide_unit = $hideColumn[$hc]['hide_unit'];
		$hide_max = $hideColumn[$hc]['hide_max'];
		$hide_pass = $hideColumn[$hc]['hide_pass'];
		$hide_result = $hideColumn[$hc]['hide_result'];
		$hide_assesment = $hideColumn[$hc]['hide_assesment'];*/
		$hide_quality = $hideColumn[$hc]['hide_quality'];
	}
	
	
	$tree_hidden2 = "<item text=\"All pupils in studygroup ({$studygroup_pupil})\" id=\"lev0_2\">";
	for( $i = 0; $i < count($studyGroup_pupil); $i++ ){
		$pupil = $_pupil->GetAll("","`pupil_id`='{$studyGroup_pupil[$i]['pupil_id']}'");
		for( $j = 0; $j < count($pupil); $j++ ){
			
			$hidePupil = $_hidePupil->GetAll("","`pupil_id`='{$pupil[$j]['pupil_id']}'");
			for( $n = 0; $n < count($hidePupil); $n++ ){
				if( $hidePupil[$n]['hidden'] == '1' ) $flug5 = 1;
			}
			
			$tree_hidden2 .= "
			<item text=\"{$pupil[$j]['forename']} {$pupil[$j]['lastname']}\" id=\"{$flug5}lev0_2_{$i} pupil {$pupil[$j]['pupil_id']}\" />";
		}
	}
	$tree_hidden2 .= "
	</item>";
	
	$dialog_grid = "<?xml version='1.0' encoding='iso-8859-1'?>
	<rows>
	";
	
	$tree_hidden = "<?xml version='1.0' encoding='iso-8859-1'?>
	<tree id=\"0\">
		<item text=\"My view (Staff)\" id=\"lev0_0\">
			<item text=\"Content\" id=\"lev0_0_0\" />
		</item>
		<item text=\"This pupil ({$name_pupil})\" id=\"lev0_1\">
			<item text=\"Columns\" id=\"lev0_1_0\">";
				/*<item text=\"Group column\" id=\"{$hide_group}lev0_1_0_1 groupBox 1\" />
				<item text=\"Objective column\" id=\"{$hide_objective}lev0_1_0_2 objectiveBox 1\" />
				<item text=\"Assignments and performents column\" id=\"{$hide_assign}lev0_1_0_3 assignBox 1\" />
				<item text=\"Unit column\" id=\"{$hide_unit}lev0_1_0_4 unitBox 1\" />
				<item text=\"Max column\" id=\"{$hide_max}lev0_1_0_5 maxBox 1\" />
				<item text=\"Pass column\" id=\"{$hide_pass}lev0_1_0_6 passBox 1\" />
				<item text=\"Result column\" id=\"{$hide_result}lev0_1_0_7 resultBox 1\" />
				<item text=\"Assesment column\" id=\"{$hide_assesment}lev0_1_0_8 assesmentBox 1\" />*/
	$tree_hidden .= "<item text=\"Quality column\" id=\"{$hide_quality}lev0_1_0_9 qualityBox 1\" />
			</item>
		<item text=\"Groups and objectives\" id=\"lev0_1_1\">";
	for( $i = 0; $i < count($group_pupil); $i++ ){
		$group = $_group->GetAll("","`objectivegroup_id`='{$group_pupil[$i]['objectivegroup_id']}'");
		for( $j = 0; $j < count($group); $j++ ){
			
			$hideGroup = $_hideGroup->GetAll("`pupil_id` ASC","`objectivegroup_id`='{$group_pupil[$i]['objectivegroup_id']}'");
			for( $h = 0; $h < count($hideGroup); $h++ ){
				if( $hideGroup[$h]['pupil_id'] == $pupilId ) $flug = 1;
			}
			
			$res = mysql_query("SELECT * FROM `course_objectives` WHERE objectivegroup_id='{$group[$j]['objectivegroup_id']}'")or die(mysql_error());
			while( $row = mysql_fetch_assoc($res) ){
				if( $row['weight'] )
					$sumWeight += $row['weight'];
				else $sumWeight = 0;
			}

				$tree_hidden .= "
			<item text=\"{$group[$j]['title_en']}\" id=\"{$flug}lev0_1_1_{$i} group {$group_pupil[$i]['groupId']}\">";
			
				$dialog_grid .= "
			<row id=\"row{$i}\" call=\"1\" xmlkids=\"1\">
				<cell image=\"blanc.gif\">Group: {$group[$j]['title_en']}</cell>
				";//<cell>({$sumWeight})%</cell>
				
			unset($sumWeight);
			$objectiveName = $_objectiveName->GetAll("","`objectivegroup_id`='{$group[$j]['objectivegroup_id']}'");
			for( $n = 0; $n < count($objectiveName); $n++ ){
				$amount = $objectiveName[$n]['weight'];
				
				unset($flug2);
				$hideObjective = $_hideObjective->GetAll("","`objective_id`='{$objectiveName[$n]['objective_id']}'");
				for( $ho = 0; $ho < count($hideObjective); $ho++ ){
					if( $hideObjective[$ho]['objective_id'] ) $flug2 = 1;
				}
				$tree_hidden .= "
					<item text=\"{$objectiveName[$n]['title_en']}\" id=\"{$flug2}lev0_1_1_{$i}_{$n} obj {$objectiveName[$n]['objective_id']}\" />";
				
				$dialog_grid .= "
					<row id=\"row{$i}_{$n} {$objectiveName[$n]['objective_id']}\">
						<cell image=\"blanc.gif\">{$objectiveName[$n]['title_en']}</cell>
						<cell>{$amount}%</cell>
					</row>";
					
					$assignmentOrPerformance = null;
						$perfIds = mysql_query("
						 SELECT DISTINCT performance.performance_id as performance_id, performance.title_en as title_en, resultset_to_course_objectives.type as type
						 FROM resultset_to_course_objectives,resultsets,performance
						 WHERE resultset_to_course_objectives.objective_id={$objectiveName[$n]['objective_id']} 
						 AND resultset_to_course_objectives.resultset_id=resultsets.resultset_id
						 AND resultset_to_course_objectives.type = 'performance'
						 AND performance.resultset_id=resultsets.resultset_id
						 AND performance.studygroup_id={$studyGroupID}
						 ")or die( mysql_error());
					while($row = mysql_fetch_assoc($perfIds)){
						$assignmentOrPerformance[] = $row;
					}
					
					for( $m = 0; $m < count($assignmentOrPerformance); $m++ ){			
						unset($flug1);
						$hidePerformance = $_hidePerformance->GetAll("","`performance_id`='{$assignmentOrPerformance[$m]['performance_id']}'");
						for( $ha = 0; $ha < count($hidePerformance); $ha++ ){
							if( $hidePerformance[$ha]['hideperformance_id'] ) $flug1 = 1; else $flug1 = 0;
						}
						$count += 1;
						$tree_hidden1 .= "
						 <item text=\"{$assignmentOrPerformance[$m]['title_en']}\" id=\"{$flug1}lev0_1_2_{$count} assign {$assignmentOrPerformance[$m]['performance_id']}\" />";
					}
					
					$assignmentOrPerformance = null;
						$assinIds = mysql_query("SELECT DISTINCT course_rooms_assignments.assignment_id as assignment_id, course_rooms_assignments.title_en as title_en, resultset_to_course_objectives.type as type,
						 DATEDIFF(course_rooms_assignments.deadline_date, CURDATE()) as dl_date
						 FROM resultset_to_course_objectives,resultsets,course_rooms_assignments
						 WHERE resultset_to_course_objectives.objective_id={$objectiveName[$n]['objective_id']} 
						 AND resultset_to_course_objectives.resultset_id=resultsets.resultset_id
						 AND resultset_to_course_objectives.type = 'assignment'
						 AND course_rooms_assignments.assignment_id=resultsets.assignment_id
						 AND course_rooms_assignments.studygroup_id={$studyGroupID}
						 ")or die( mysql_error());
					 
					while($row = mysql_fetch_assoc($assinIds)){
						$assignmentOrPerformance[] = $row;
					}
					
					for( $m = 0; $m < count($assignmentOrPerformance); $m++ ){			
						unset($flug1);
						$hideAssignment = $_hideAssignment->GetAll("","`assignment_id`='{$assignmentOrPerformance[$m]['assignment_id']}'");
						for( $ha = 0; $ha < count($hideAssignment); $ha++ ){
							if( $hideAssignment[$ha]['hideassignment_id'] ) $flug1 = 1; else $flug1 = 0;
						}
						$count += 1;
						$tree_hidden1 .= "
						 <item text=\"{$assignmentOrPerformance[$m]['title_en']}\" id=\"{$flug1}lev0_1_2_{$count} assign {$assignmentOrPerformance[$m]['assignment_id']}\" />";
					}
			}
			$tree_hidden .= "
			</item>
			";
			$dialog_grid .= "
			</row>";
		}
	}
	
	/*$assignmentOrPerformance = $_assignmentOrPerformance->GetAll("","`pupilId`='{$pupilId}'");
	for( $m = 0; $m < count($assignmentOrPerformance); $m++ ){
		
		//unset($flug1);
		$hideAssignment = $_hideAssignment->GetAll("","`assignmentId`='{$assignmentOrPerformance[$m]['id']}'");
		echo"<pre>";
		print_r( $hideAssignment );
		echo"</pre>";
		for( $ha = 0; $ha < count($hideAssignment); $ha++ ){
			if( !$hideAssignment[$ha]['assignmentId'] )
				$flug1 = 1;
			else
				$flug1 = 0;
		}
		$count += 1;
		$tree_hidden1 .= "
		 <item text=\"{$assignmentOrPerformance[$m]['assignPerfName']}\" id=\"{$flug1}lev0_1_2_{$count} assign {$assignmentOrPerformance[$m]['id']}\" />";
	}*/
	
	$tree_hidden .= "
		</item>
		<item text=\"Assignments and performances\" id=\"lev0_1_2\">
			{$tree_hidden1}
		</item>
	</item>

	{$tree_hidden2}

	<item text=\"All pupils in course (English 1)\" id=\"lev0_3\">

		<item text=\"Content\" id=\"lev0_3_0\" />

	</item>
</tree>";
	
	$dialog_grid .= "
	</rows>";
	
	$fp = fopen("tree_hidden.xml", "w");
	fwrite($fp, $tree_hidden);
	fclose($fp);
	
	$fp = fopen("dialog_grid.xml", "w");
	fwrite($fp, $dialog_grid);
	fclose($fp);
}

?>