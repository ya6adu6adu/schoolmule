<?php

//declare an object of class Pupil
$_selectPupil = new Pupil();

//select all fields from table pupil in database
$selectPupil = $_selectPupil->GetAll("");

//declare an object of class studyGroup_pupil
$_studyGroup_pupil = new studyGroup_pupil();

//declare an object of class studyGroup
$_studyGroup = new studyGroup();

?>

<div class='select_pupil'>
	<?
		for( $i = 0; $i < count($selectPupil); $i++ ){
			echo "<div id='pupil_StudyGroup'><div class='pupil_name' style='width:160px; float:left;' alt='{$selectPupil[$i][name]}'>{$selectPupil[$i][name]}</div>";
			echo "<input class='pupilId' type='hidden' value='{$selectPupil[$i][id]}' />";
			$studyGroup_pupil = $_studyGroup_pupil->GetAll("","`pupilId`='{$selectPupil[$i][id]}'");
		
			for( $j = 0; $j < count($studyGroup_pupil); $j++ ){
				$studyGroup = $_studyGroup->GetAll("","`id`='{$studyGroup_pupil[$j][stydyGroupId]}'");

				for( $x = 0; $x < count($studyGroup); $x++ )
					echo "<input id='StudyGroupID' type='hidden' value='{$studyGroup[$x][id]}' />
						<span class='StudyGroup' alt='{$studyGroup[$x][name]}'>{$studyGroup[$x][name]}</span></div>";
				}
		}
	?>
</div>