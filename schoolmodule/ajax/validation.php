<?php

//check on perfomence
if( $assignPerfType == 'performance' ){
	$echo .= "<tr class='heightresult'>
				<td id='perfomHighlight' class='perfomHighlight' colspan=4; style='width: 62%; border: none; text-align:left; padding-left:6px;'>&nbsp</td>";
	
	//check on each assesment and show this assesment
	if( $assignPerfUnits[$v]['assessment'] == 'A'){
		$echo .= "	<td class='tdassesment' class='unit' style='width: 38%;'>
						<input class='new_assesment_before' type='hidden' value='' />
						".($user->role=='pupil' || $user->role=='parent'? '': $grade1)."
						<table id='heightAssesment' border='0' style='width:100%; border: mintCream;' cellspacing='0' cellpadding='0'>
							<input id='assPerfId' type='hidden' value='{$assignPerfUnits[$v]['pupil_performance_assessment_id']}' />
							<input id='assPerfType' type='hidden' value='{$assignPerfType}' />
							<tr id='new_assesment' class='new_assesment'>
								<td id='highlightAssesment' style='background-color: green; width: 100%; text-align:center;'><span style='color:white; margin-right: 3px;'>A</span></td>
							</tr>
						</table>
					</td>
				</tr>";
	}elseif( $assignPerfUnits[$v]['assessment'] == 'B'){
		$echo .= "	<td class='tdassesment unit' style='width: 38%;'>
						<input class='new_assesment_before' type='hidden' value='' />
						".($user->role=='pupil' || $user->role=='parent'? '': $grade1)."
						<table id='heightAssesment' border='0' style='width:100%; border: mintCream;' cellspacing='0' cellpadding='0'>
							<input id='assPerfId' type='hidden' value='{$assignPerfUnits[$v]['pupil_performance_assessment_id']}' />
							<input id='assPerfType' type='hidden' value='{$assignPerfType}' />
							<tr id='new_assesment' class='new_assesment'>
								<td id='highlightAssesment' style='background-color:green; width: 80%; text-align:right;'><span style='color:white; margin-right: 3px;'>". $assignPerfUnits[$v]['assessment'] ."</span></td>
								<td id='highlightAssesmentYellow' style='background-color:#f5eab2; width: 16%; text-align:center;'><span style='color:#c4c2a9;'>A</span></td>
							</tr>
						</table>
					</td>
				</tr>";
	}elseif( $assignPerfUnits[$v]['assessment'] == 'C'){
		$echo .= "	<td class='tdassesment' class='unit' style='width: 38%;'>
						<input class='new_assesment_before' type='hidden' value='' />
						".($user->role=='pupil' || $user->role=='parent'? '': $grade1)."
						<table id='heightAssesment' border='0' style='width:100%; border: mintCream;' cellspacing='0' cellpadding='0'>
							<input id='assPerfId' type='hidden' value='{$assignPerfUnits[$v]['pupil_performance_assessment_id']}' />
							<input id='assPerfType' type='hidden' value='{$assignPerfType}' />
							<tr id='new_assesment' class='new_assesment'>
								<td id='highlightAssesment' style='background-color:green; width: 64%;text-align:right;'><span style='color:white; margin-right: 3px;'>". $assignPerfUnits[$v]['assessment'] ."</span></td>
								<td id='highlightAssesmentYellow' style='background-color:#f5eab2; width: 16%; text-align:center;'><span style='color:#c4c2a9;'>B</span></td>
								<td id='highlightAssesmentYellow' style='background-color:#f5eab2; width: 16%; text-align:center;'><span style='color:#c4c2a9;'>A</span></td>
							</tr>
						</table>
					</td>
				</tr>";
	}elseif( $assignPerfUnits[$v]['assessment'] == 'D'){
		$echo .= "	<td class='tdassesment' class='unit' style='width: 38%;'>
						<input class='new_assesment_before' type='hidden' value='' />
						".($user->role=='pupil' || $user->role=='parent'? '': $grade1)."
						<table id='heightAssesment' border='0' style='width:100%; border: mintCream;' cellspacing='0' cellpadding='0'>
							<input id='assPerfId' type='hidden' value='{$assignPerfUnits[$v]['pupil_performance_assessment_id']}' />
							<input id='assPerfType' type='hidden' value='{$assignPerfType}' />
							<tr id='new_assesment' class='new_assesment'>
								<td id='highlightAssesment' style='background-color:green; width: 48%; text-align:right;'><span style='color:white; margin-right: 3px;'>". $assignPerfUnits[$v]['assessment'] ."</span></td>
								<td id='highlightAssesmentYellow' style='background-color:#f5eab2; width: 16%; text-align:center;'><span style='color:#c4c2a9;'>C</span></td>
								<td id='highlightAssesmentYellow' style='background-color:#f5eab2; width: 16%; text-align:center;'><span style='color:#c4c2a9;'>B</span></td>
								<td id='highlightAssesmentYellow' style='background-color:#f5eab2; width: 16%; text-align:center;'><span style='color:#c4c2a9;'>A</span></td>
							</tr>
						</table> 
					</td>
				</tr>";
	}elseif( $assignPerfUnits[$v]['assessment'] == 'E'){
		$echo .= "	<td class='tdassesment' class='unit' style='width: 38%;'>
						<input class='new_assesment_before' type='hidden' value='' />
						".($user->role=='pupil' || $user->role=='parent'? '': $grade1)."
						<table id='heightAssesment' border='0' style='width:100%; border: mintCream;' cellspacing='0' cellpadding='0'>
							<input id='assPerfId' type='hidden' value='{$assignPerfUnits[$v]['pupil_performance_assessment_id']}' />
							<input id='assPerfType' type='hidden' value='{$assignPerfType}' />
							<tr id='new_assesment' class='new_assesment'>
								<td id='highlightAssesment' style='background-color:green; width: 32%; text-align:right;'><span style='color:white; margin-right: 3px;'>". $assignPerfUnits[$v]['assessment'] ."</span></td>
								<td id='highlightAssesmentYellow' style='background-color:#f5eab2; width: 16%; text-align:center;'><span style='color:#c4c2a9;'>D</span></td>
								<td id='highlightAssesmentYellow' style='background-color:#f5eab2; width: 16%; text-align:center;'><span style='color:#c4c2a9;'>C</span></td>
								<td id='highlightAssesmentYellow' style='background-color:#f5eab2; width: 16%; text-align:center;'><span style='color:#c4c2a9;'>B</span></td>
								<td id='highlightAssesmentYellow' style='background-color:#f5eab2; width: 16%; text-align:center;'><span style='color:#c4c2a9;'>A</span></td>
							</tr>
						</table>
					</td>
				</tr>";
	}elseif( $assignPerfUnits[$v]['assessment'] == 'F'){
		$echo .= "	<td class='tdassesment' class='unit' style='width: 38%;'>
						<input class='new_assesment_before' type='hidden' value='' />
						".($user->role=='pupil' || $user->role=='parent'? '': $grade1)."
						<table id='heightAssesment' id='hz' border='0' style='width:100%; border: mintCream;' cellspacing='0' cellpadding='0'>
							<input id='assPerfId' type='hidden' value='{$assignPerfUnits[$v]['pupil_performance_assessment_id']}' />
							<input id='assPerfType' type='hidden' value='{$assignPerfType}' />
							<tr id='new_assesment' class='new_assesment'>
								<td id='highlightAssesment' style='background-color:#f4726d; width: 16%; text-align:right;'><span style='color:white; margin-right: 3px;'>". $assignPerfUnits[$v]['assessment'] ."</span></td>
								<td id='highlightAssesmentYellow' style='background-color:#f5eab2; width: 16%; text-align:center;'><span style='color:#c4c2a9;'>E</span></td>
								<td id='highlightAssesmentYellow' style='background-color:#f5eab2; width: 16%; text-align:center;'><span style='color:#c4c2a9;'>D</span></td>
								<td id='highlightAssesmentYellow' style='background-color:#f5eab2; width: 16%; text-align:center;'><span style='color:#c4c2a9;'>C</span></td>
								<td id='highlightAssesmentYellow' style='background-color:#f5eab2; width: 16%; text-align:center;'><span style='color:#c4c2a9;'>B</span></td>
								<td id='highlightAssesmentYellow' style='background-color:#f5eab2; width: 16%; text-align:center;'><span style='color:#c4c2a9;'>A</span></td>
							</tr>
						</table>
					</td>
				</tr>";
	}elseif( $assignPerfUnits[$v]['assessment'] == dlang("npassvalue","NPass")){
		$echo .= "	<td class='tdassesment' class='unit' style='width: 38%;'>
						<div id='quality_assesment' class='quality_assesment' style='width: 50px;'>
							<div class='pass' onmouseover=\"this.style.background='#DDDDDD';\" onmouseout=\"this.style.background='#EEEEEE';\">".dlang("passvalue","Pass")."</div>
							<div class='notpass' onmouseover=\"this.style.background='#DDDDDD';\" onmouseout=\"this.style.background='#EEEEEE';\">".dlang("npassvalue","NPass")."</div>
						</div>
						<table id='heightAssesment' border='0' style='width:100%; border: mintCream;' cellspacing='0' cellpadding='0'>
							<input id='assPerfId' type='hidden' value='{$assignPerfUnits[$v]['pupil_performance_assessment_id']}' />
							<input id='assPerfType' type='hidden' value='{$assignPerfType}' />
                            <tr id='new_assesment' class='new_assesment'>
                                <td id='highlightAssesment' style='background-color:#F4726D; width: 17%; text-align:right;'><span style='color:white; font-weight:bold; margin-right: 3px;'>".dlang("npassvaluesmall","N")."</span></td>
                                <td id='highlightAssesmentYellow' style='background-color:#f5eab2; width: 17%; text-align:center;'><span style='color:#c4c2a9; font-weight:bold;'>"./*dlang("passvalue","Pass")*/''."P</span></td>
                                <td id='highlightAssesmentYellow' style='background-color:#f5eab2; text-align:center;'><span style='color:#c4c2a9; font-weight:bold;'>&nbsp</span></td>
                            </tr>
						</table>
					</td>
				</tr>";
	}elseif( $assignPerfUnits[$v]['assessment'] == dlang("passvalue","Pass")){
		$echo .= "	<td class='tdassesment' class='unit' style='width: 38%;'>
						<div id='quality_assesment' class='quality_assesment' style='width: 50px;'>
							<div class='pass' onmouseover=\"this.style.background='#DDDDDD';\" onmouseout=\"this.style.background='#EEEEEE';\">".dlang("passvalue","Pass")."</div>
							<div class='notpass' onmouseover=\"this.style.background='#DDDDDD';\" onmouseout=\"this.style.background='#EEEEEE';\">".dlang("npassvalue","NPass")."</div>
						</div>
						<table id='heightAssesment' border='0' style='width:100%; border: mintCream;' cellspacing='0' cellpadding='0'>
							<input id='assPerfId' type='hidden' value='{$assignPerfUnits[$v]['pupil_performance_assessment_id']}' />
							<input id='assPerfType' type='hidden' value='{$assignPerfType}' />
                            <tr id='new_assesment' class='new_assesment'>
                                <td id='highlightAssesment' style='background-color:green; width: 33%; text-align:right ;'><span style='color:white; font-weight:bold; margin-right:3px; '>".dlang("passvaluesmall","P")."</span></td>
                                <td id='highlightAssesmentYellow' style='background-color:#f5eab2; '><span style='color:white; font-weight:bold;'>&nbsp</span></td>
                            </tr>
						</table>
					</td>
				</tr>";
	}elseif( $assignPerfUnits[$v]['assessment'] == 'na' || $assignPerfUnits[$v]['assessment'] == ''){
		$echo .= "	<td class='tdassesment' class='unit' style='width: 38%;'>
						<input class='new_assesment_before' type='hidden' value='' />
						".($user->role=='pupil' || $user->role=='parent'? '': $grade1)."
						<table id='heightAssesment' id='hz' border='0' style='width:100%; border: mintCream;' cellspacing='0' cellpadding='0'>
							<input id='assPerfId' type='hidden' value='{$assignPerfUnits[$v]['pupil_performance_assessment_id']}' />
							<input id='assPerfType' type='hidden' value='{$assignPerfType}' />
							<tr id='new_assesment' class='new_assesment'>								
								<td id='highlightAssesmentYellow' style='background-color:#f5eab2; width: 16%; text-align:center;'><span style='color:#c4c2a9;'>F</span></td>
								<td id='highlightAssesmentYellow' style='background-color:#f5eab2; width: 16%; text-align:center;'><span style='color:#c4c2a9;'>E</span></td>
								<td id='highlightAssesmentYellow' style='background-color:#f5eab2; width: 16%; text-align:center;'><span style='color:#c4c2a9;'>D</span></td>
								<td id='highlightAssesmentYellow' style='background-color:#f5eab2; width: 16%; text-align:center;'><span style='color:#c4c2a9;'>C</span></td>
								<td id='highlightAssesmentYellow' style='background-color:#f5eab2; width: 16%; text-align:center;'><span style='color:#c4c2a9;'>B</span></td>
								<td id='highlightAssesmentYellow' style='background-color:#f5eab2; width: 16%; text-align:center;'><span style='color:#c4c2a9;'>A</span></td>
							</tr>
						</table>
					</td>
				</tr>";//<td style='background-color:#f5eab2; width: 55%;'><span style='color:#c4c2a9; font-weight:bold;'>not assessed</span></td>
	}

//check type on each assignment and show this value

}elseif( $assignPerfUnits[$v]['result_unit'] == 'No evaluation'){
	$echo .= "<tr class='heightresult'>
				<td title='{$assignPerfUnits[$v]['result_unit']}' id='noEvalution' class='unit' colspan='4' style='text-align:left; padding-left:6px; background-color:#DDDDDD;'><span>". $assignPerfUnits[$v]['result_unit'] ."</span></td>
				<td title='{$assignPerfUnits[$v]['result_unit']}' class='unit1' style='width: 38%; text-align:left; padding-left:6px; background-color:#dddddd;'><span>". $assignPerfUnits[$v]['result_unit'] ."</span></td>
			</tr>";

}elseif( $assignPerfUnits[$v]['result_unit'] != 'No evaluation' AND $assignPerfUnits[$v]['assessment'] == 'No evaluation' ){
	$echo .= "<tr class='heightresult'>
	            <td  style='display: none;' id='runit_id' >". $assignPerfUnits[$v]['result_unit_id'] ."</td>
				<td id='resultId' style='display: none;'>". $assignPerfUnits[$v]['resultset_id'] ."</td>
				<td id='submission_result' style='display: none;'>". $assignPerfUnits[$v]['submission_result'] ."</td>
				<td title='{$assignPerfUnits[$v]['result_unit']}' id='callChangeResult' class='tdunit unit' style='width: 18%; text-align:left; padding-left:6px;'><input class='unitsWidthOrg' type='hidden' value='$units' /><span class='unitsWidth'>". $units ."</span></td>
				<td title='{$assignPerfUnits[$v]['result_max']}' id='callChangeResult' class='tdmax unit' style='width: 14%;'><span>". $assignPerfUnits[$v]['result_max'] ."</span></td>
				<td title='{$assignPerfUnits[$v]['result_pass']}' id='callChangeResult' class='tdpass unit' style='width: 14%;'><span>". $assignPerfUnits[$v]['result_pass'] ."</span></td>
				<td title='{$assignPerfUnits[$v]['result']}' id='callChangeResult' class='tdresult' style='width: 16%; background-color:#f5eab2;'><div style='color:green;'>". $assignPerfUnits[$v]['result'] ."</div></td>
				<td title='{$assignPerfUnits[$v]['assessment']}' class='unit1' style='width: 38%; text-align:left; padding-left:6px; background-color:#dddddd;'><span>". $assignPerfUnits[$v]['assessment'] ."</span></td>
			</tr>";//#f5eab2;

//}elseif( ($assignPerfUnits[$v]['result_unit'] == 'Freetext with assessment' or $assignPerfUnits[$v]['result_unit'] == 'Freetext without assessment') and ($assignPerfUnits[$v]['assessment'] == 'A' or $assignPerfUnits[$v]['assessment'] == 'B' or $assignPerfUnits[$v]['assessment'] == 'C' or $assignPerfUnits[$v]['assessment'] == 'D' or $assignPerfUnits[$v]['assessment'] == 'E' or $assignPerfUnits[$v]['assessment'] == 'F' or $assignPerfUnits[$v]['assessment'] == 'Amazing es') ){
}elseif( $assignPerfUnits[$v]['result_unit'] == 'Free text' ){
	$echo .= "<tr class='heightresult'>
				<!--<td title='Test text' id='noEvalution' class='unit' colspan='4' style='text-align:left; padding-left:6px; background-color:#F2F2F2;'><span>Test text</span></td>-->
				<td title='Test text' id='noEvalution' class='unit' colspan='4' style='text-align:left; padding-left:6px; background-color:#dddddd;'><span>Test text</span></td>
				<td title='No evaluation' class='unit1' colspan='4' style='text-align:left; width: 38%; padding-left:6px; background-color:#dddddd;'><span>No evaluation</span></td>";//#DDDDDD
	$echo .= "</tr>";
}elseif( $assignPerfUnits[$v]['assessment'] == dlang("grids_not_subm_text","Not subm.") ){
	if(((int) $assignmentOrPerformance[$c]['dl_date']) > 0 || $assignmentOrPerformance[$c]['dl_date']==''){
		$styleColor = 'background-color: #56aaff;';
	}else
		$styleColor = 'background-color:#f4726d;';
	$echo .= "<tr class='heightresult'>
				<td title='Not submitted' class='unit1 not_submitted_unit' colspan='4' style=' text-align:left; padding-left:6px; {$styleColor}'><span>".dlang("module_ns","Not submitted")."</span></td>
				<td title='Not submitted' class='unit1 not_submitted_unit' style='width: 38%; text-align:left; padding-left:6px; {$styleColor}'><span".dlang("module_ns","Not submitted")."</span></td>
			</tr>";
}elseif( $assignPerfUnits[$v]['assessment'] == 'A'){
	$echo .= "<tr id='callChangeResult' class='heightresult'>
	            <td  style='display: none;' id='runit_id' >". $assignPerfUnits[$v]['result_unit_id'] ."</td>
				<td id='resultId' style='display: none;'>". $assignPerfUnits[$v]['resultset_id'] ."</td>
				<td id='submission_result' style='display: none;'>". $assignPerfUnits[$v]['submission_result'] ."</td>
				<td title='{$assignPerfUnits[$v]['result_unit']}' id='callChangeResult' class='tdunit unit' style='width: 18%; text-align:left; padding-left:6px;'><input class='unitsWidthOrg' type='hidden' value='$units' /><span class='unitsWidth'>". $units ."</span></td>
				<td title='{$assignPerfUnits[$v]['result_max']}' id='callChangeResult' class='tdmax unit' style='width: 14%;'><span>". $assignPerfUnits[$v]['result_max'] ."</span></td>
				<td title='{$assignPerfUnits[$v]['result_pass']}' id='callChangeResult' class='tdpass unit' style='width: 14%;'><span>". $assignPerfUnits[$v]['result_pass'] ."</span></td>
				<td title='{$assignPerfUnits[$v]['result']}' id='callChangeResult' class='tdresult' style='width: 16%; background-color:#f5eab2;'><div style='{$style}'>". $assignPerfUnits[$v]['result'] ."</div></td>
				<td class='tdassesment' class='unit' style='width: 38%;'>
					<input class='new_assesment_before' type='hidden' value='' />
					".($user->role=='pupil' || $user->role=='parent'? '': $grade1)."
					<table id='heightAssesment' border='0' style='width:100%; border: mintCream;' cellspacing='0' cellpadding='0'>
						<input id='assPerfId' type='hidden' value='{$assignPerfUnits[$v]['resultset_id']}' />
						<input id='assPerfType' type='hidden' value='{$assignPerfType}' />
						<tr id='new_assesment' class='new_assesment'>
							<td id='highlightAssesment' style='background-color: green; width: 100%; text-align:right;'><span style='color:white; margin-right: 3px;'>A</span></td>
						</tr>
					</table>
				</td>
			</tr>";
}elseif( $assignPerfUnits[$v]['assessment'] == 'B'){
	$echo .= "<tr id='callChangeResult' class='heightresult'>
	            <td  style='display: none;' id='runit_id' >". $assignPerfUnits[$v]['result_unit_id'] ."</td>
				<td id='resultId' style='display: none;'>". $assignPerfUnits[$v]['resultset_id'] ."</td>
				<td id='submission_result' style='display: none;'>". $assignPerfUnits[$v]['submission_result'] ."</td>
				<td title='{$assignPerfUnits[$v]['result_unit']}' id='callChangeResult' class='tdunit unit' style='width: 17%; text-align:left; padding-left:6px;'><input class='unitsWidthOrg' type='hidden' value='$units' /><span class='unitsWidth'>". $units ."</span></td>
				<td title='{$assignPerfUnits[$v]['result_max']}' id='callChangeResult' class='tdmax unit' style='width: 15%;'><span>". $assignPerfUnits[$v]['result_max'] ."</span></td>
				<td title='{$assignPerfUnits[$v]['result_pass']}' id='callChangeResult' class='tdpass unit' style='width: 15%;'><span>". $assignPerfUnits[$v]['result_pass'] ."</span></td>
				<td title='{$assignPerfUnits[$v]['result']}' id='callChangeResult' class='tdresult' style='width: 15%; background-color:#f5eab2;'><div style='{$style}'>". $assignPerfUnits[$v]['result'] ."</div></td>
				<td class='tdassesment' style='width: 38%;'>
					<input class='new_assesment_before' type='hidden' value='' />
					".($user->role=='pupil' || $user->role=='parent'? '': $grade1)."
					<table id='heightAssesment' border='0' style='width:100%; border: mintCream;' cellspacing='0' cellpadding='0'>
						<input id='assPerfId' type='hidden' value='{$assignPerfUnits[$v]['resultset_id']}' />
						<input id='assPerfType' type='hidden' value='{$assignPerfType}' />
						<tr id='new_assesment' class='new_assesment'>
							<td id='highlightAssesment' style='background-color:green; width: 80%; text-align:right;'><span style='color:white; margin-right: 3px;'>". $assignPerfUnits[$v]['assessment'] ."</span></td>
							<td id='highlightAssesmentYellow' style='background-color:#f5eab2; width: 16%; text-align:center;'><span style='color:#c4c2a9;'>A</span></td>
						</tr>
					</table>
				</td>
			</tr>";
}elseif( $assignPerfUnits[$v]['assessment'] == 'C'){
	$echo .= "<tr id='callChangeResult' class='heightresult'>
	            <td  style='display: none;' id='runit_id' >". $assignPerfUnits[$v]['result_unit_id'] ."</td>
				<td id='resultId' style='display: none;'>". $assignPerfUnits[$v]['resultset_id'] ."</td>
				<td id='submission_result' style='display: none;'>". $assignPerfUnits[$v]['submission_result'] ."</td>
				<td title='{$assignPerfUnits[$v]['result_unit']}' id='callChangeResult' class='tdunit unit' style='width: 18%; text-align:left; padding-left:6px;'><input class='unitsWidthOrg' type='hidden' value='$units' /><span class='unitsWidth'>". $units ."</span></td>
				<td title='{$assignPerfUnits[$v]['result_max']}' id='callChangeResult' class='tdmax unit' style='width: 14%;'><span>". $assignPerfUnits[$v]['result_max'] ."</span></td>
				<td title='{$assignPerfUnits[$v]['result_pass']}' id='callChangeResult' class='tdpass unit' style='width: 14%;'><span>". $assignPerfUnits[$v]['result_pass'] ."</span></td>
				<td title='{$assignPerfUnits[$v]['result']}' id='callChangeResult' class='tdresult' style='width: 16%; background-color:#f5eab2;'><div style='{$style}'>". $assignPerfUnits[$v]['result'] ."</div></td>
				<td class='tdassesment' class='unit' style='width: 38%;'>
					<input class='new_assesment_before' type='hidden' value='' />
					".($user->role=='pupil' || $user->role=='parent'? '': $grade1)."
					<table id='heightAssesment' border='0' style='width:100%; border: mintCream;' cellspacing='0' cellpadding='0'>
						<input id='assPerfId' type='hidden' value='{$assignPerfUnits[$v]['resultset_id']}' />
						<input id='assPerfType' type='hidden' value='{$assignPerfType}' />
						<tr id='new_assesment' class='new_assesment'>
							<td id='highlightAssesment' style='background-color:green; width: 64%;text-align:right;'><span style='color:white; margin-right: 3px;'>". $assignPerfUnits[$v]['assessment'] ."</span></td>
							<td id='highlightAssesmentYellow' style='background-color:#f5eab2; width: 16%; text-align:center;'><span style='color:#c4c2a9;'>B</span></td>
							<td id='highlightAssesmentYellow' style='background-color:#f5eab2; width: 16%; text-align:center;'><span style='color:#c4c2a9;'>A</span></td>
						</tr>
					</table>
				</td>
			</tr>";
}elseif( $assignPerfUnits[$v]['assessment'] == 'D'){
	$echo .= "<tr id='callChangeResult' class='heightresult'>
	            <td  style='display: none;' id='runit_id' >". $assignPerfUnits[$v]['result_unit_id'] ."</td>
				<td id='resultId' style='display: none;'>{$assignPerfUnits[$v]['resultset_id']}</td>
				<td id='submission_result' style='display: none;'>". $assignPerfUnits[$v]['submission_result'] ."</td>
				<td title='{$assignPerfUnits[$v]['result_unit']}' id='callChangeResult' class='tdunit unit' style='width: 18%; text-align:left; padding-left:6px;'><input class='unitsWidthOrg' type='hidden' value='$units' /><span class='unitsWidth'>". $units ."</span></td>
				<td title='{$assignPerfUnits[$v]['result_max']}' id='callChangeResult' class='tdmax unit' style='width: 14%;'><span>". $assignPerfUnits[$v]['result_max'] ."</span></td>
				<td title='{$assignPerfUnits[$v]['result_pass']}' id='callChangeResult' class='tdpass unit' style='width: 14%;'><span>". $assignPerfUnits[$v]['result_pass'] ."</span></td>
				<td title='{$assignPerfUnits[$v]['result']}' id='callChangeResult' class='tdresult' style='width: 16%; background-color:#f5eab2;'>
					<div style='{$style}'>{$assignPerfUnits[$v]['result']}</div>
				</td>
				<td class='tdassesment' class='unit' style='width: 38%;'>
					<input class='new_assesment_before' type='hidden' value='' />
					".($user->role=='pupil' || $user->role=='parent'? '': $grade1)."
					<table id='heightAssesment' border='0' style='width:100%; border: mintCream;' cellspacing='0' cellpadding='0'>
						<input id='assPerfId' type='hidden' value='{$assignPerfUnits[$v]['resultset_id']}' />
						<input id='assPerfType' type='hidden' value='{$assignPerfType}' />
						<tr id='new_assesment' class='new_assesment'>
							<td id='highlightAssesment' style='background-color:green; width: 48%; text-align:right;'><span style='color:white; margin-right: 3px;'>". $assignPerfUnits[$v]['assessment'] ."</span></td>
							<td id='highlightAssesmentYellow' style='background-color:#f5eab2; width: 16%; text-align:center;'><span style='color:#c4c2a9;'>C</span></td>
							<td id='highlightAssesmentYellow' style='background-color:#f5eab2; width: 16%; text-align:center;'><span style='color:#c4c2a9;'>B</span></td>
							<td id='highlightAssesmentYellow' style='background-color:#f5eab2; width: 16%; text-align:center;'><span style='color:#c4c2a9;'>A</span></td>
						</tr>
					</table> 
				</td>
			</tr>";
}elseif( $assignPerfUnits[$v]['assessment'] == 'E'){
	$echo .= "<tr id='callChangeResult' class='heightresult'>
	            <td  style='display: none;' id='runit_id' >". $assignPerfUnits[$v]['result_unit_id'] ."</td>
				<td id='resultId' style='display: none;'>". $assignPerfUnits[$v]['resultset_id'] ."</td>
				<td id='submission_result' style='display: none;'>". $assignPerfUnits[$v]['submission_result'] ."</td>
				<td title='{$assignPerfUnits[$v]['result_unit']}' id='callChangeResult' class='tdunit unit' style='width: 18%; text-align:left; padding-left:6px;'><input class='unitsWidthOrg' type='hidden' value='$units' /><span class='unitsWidth'>". $units ."</span></td>
				<td title='{$assignPerfUnits[$v]['result_max']}' id='callChangeResult' class='tdmax unit' style='width: 14%;'><span>". $assignPerfUnits[$v]['result_max'] ."</span></td>
				<td title='{$assignPerfUnits[$v]['result_pass']}' id='callChangeResult' class='tdpass unit' style='width: 14%;'><span>". $assignPerfUnits[$v]['result_pass'] ."</span></td>
				<td title='{$assignPerfUnits[$v]['result']}' id='callChangeResult' class='tdresult' style='width: 16%; background-color:#f5eab2;'><div style='{$style}'>". $assignPerfUnits[$v]['result'] ."</div></td>
				<td class='tdassesment' class='unit' style='width: 38%;'>
					<input class='new_assesment_before' type='hidden' value='' />
					".($user->role=='pupil' || $user->role=='parent'? '': $grade1)."
					<table id='heightAssesment' border='0' style='width:100%; border: mintCream;' cellspacing='0' cellpadding='0'>
						<input id='assPerfId' type='hidden' value='{$assignPerfUnits[$v]['resultset_id']}' />
						<input id='assPerfType' type='hidden' value='{$assignPerfType}' />
						<tr id='new_assesment' class='new_assesment'>
							<td id='highlightAssesment' style='background-color:green; width: 32%; text-align:right;'><span style='color:white; margin-right: 3px;'>". $assignPerfUnits[$v]['assessment'] ."</span></td>
							<td id='highlightAssesmentYellow' style='background-color:#f5eab2; width: 16%; text-align:center;'><span style='color:#c4c2a9;'>D</span></td>
							<td id='highlightAssesmentYellow' style='background-color:#f5eab2; width: 16%; text-align:center;'><span style='color:#c4c2a9;'>C</span></td>
							<td id='highlightAssesmentYellow' style='background-color:#f5eab2; width: 16%; text-align:center;'><span style='color:#c4c2a9;'>B</span></td>
							<td id='highlightAssesmentYellow' style='background-color:#f5eab2; width: 16%; text-align:center;'><span style='color:#c4c2a9;'>A</span></td>
						</tr>
					</table>
				</td>
			</tr>";
}elseif( $assignPerfUnits[$v]['assessment'] == 'F' ){
	$echo .= "<tr id='callChangeResult' class='heightresult'>
	            <td  style='display: none;' id='runit_id' >". $assignPerfUnits[$v]['result_unit_id'] ."</td>
				<td id='resultId' style='display: none;'>". $assignPerfUnits[$v]['resultset_id'] ."</td>
				<td id='submission_result' style='display: none;'>". $assignPerfUnits[$v]['submission_result'] ."</td>
				<td title='{$assignPerfUnits[$v]['result_unit']}' id='callChangeResult' class='tdunit unit' style='width: 18%; text-align:left; padding-left:6px;'><input class='unitsWidthOrg' type='hidden' value='$units' /><span class='unitsWidth'>". $units ."</span></td>
				<td title='{$assignPerfUnits[$v]['result_max']}' id='callChangeResult' class='tdmax unit' style='width: 14%;'><span>". $assignPerfUnits[$v]['result_max'] ."</span></td>
				<td title='{$assignPerfUnits[$v]['result_pass']}' id='callChangeResult' class='tdpass unit' style='width: 14%;'><span>". $assignPerfUnits[$v]['result_pass'] ."</span></td>
				<td title='{$assignPerfUnits[$v]['result']}' id='callChangeResult' class='tdresult' style='width: 16%; background-color:#f5eab2;'><div style='{$style}'>". $assignPerfUnits[$v]['result'] ."</div></td>
				<td class='tdassesment' class='unit' style='width: 38%;'>
					<input class='new_assesment_before' type='hidden' value='' />
					".($user->role=='pupil' || $user->role=='parent'? '': $grade1)."
					<table id='heightAssesment' id='hz' border='0' style='width:100%; border: mintCream;' cellspacing='0' cellpadding='0'>
						<input id='assPerfId' type='hidden' value='{$assignPerfUnits[$v]['resultset_id']}' />
						<input id='assPerfType' type='hidden' value='{$assignPerfType}' />
						<tr id='new_assesment' class='new_assesment'>
							<td id='highlightAssesment' style='background-color:#f4726d; width: 16%; text-align:right;'><span style='color:white; margin-right:3px;'>". $assignPerfUnits[$v]['assessment'] ."</span></td>
							<td id='highlightAssesmentYellow' style='background-color:#f5eab2; width: 16%; text-align:center;'><span style='color:#c4c2a9;'>E</span></td>
							<td id='highlightAssesmentYellow' style='background-color:#f5eab2; width: 16%; text-align:center;'><span style='color:#c4c2a9;'>D</span></td>
							<td id='highlightAssesmentYellow' style='background-color:#f5eab2; width: 16%; text-align:center;'><span style='color:#c4c2a9;'>C</span></td>
							<td id='highlightAssesmentYellow' style='background-color:#f5eab2; width: 16%; text-align:center;'><span style='color:#c4c2a9;'>B</span></td>
							<td id='highlightAssesmentYellow' style='background-color:#f5eab2; width: 16%; text-align:center;'><span style='color:#c4c2a9;'>A</span></td>
						</tr>
					</table>
				</td>
			</tr>";
}
elseif( ($assignPerfUnits[$v]['assessment'] == dlang("npassvalue","NPass") || ($assignPerfUnits[$v]['assessment'] == '' ||  $assignPerfUnits[$v]['assessment'] == "IG" || $assignPerfUnits[$v]['assessment'] == "NPass") && $assignPerfUnits[$v]['result_unit_id'] == '4')){
	$echo .= "<tr id='callChangeResult' class='heightresult'>
	            <td style='display: none;' id='runit_id' >". $assignPerfUnits[$v]['result_unit_id'] ."</td>
				<td id='resultId' style='display: none;'>". $assignPerfUnits[$v]['resultset_id'] ."</td>
				<td id='submission_result' style='display: none;'>". $assignPerfUnits[$v]['submission_result'] ."</td>
				<td title='{$assignPerfUnits[$v]['result_unit']}' id='callChangeResult' class='tdunit unit' style='width: 18%; text-align:left; padding-left:6px;'><input class='unitsWidthOrg' type='hidden' value='$units' /><span class='unitsWidth'>". $units ."</span></td>
				<td title='{$assignPerfUnits[$v]['result_max']}' id='callChangeResult' class='tdmax unit' style='width: 14%;'><span>". $assignPerfUnits[$v]['result_max'] ."</span></td>
				<td title='{$assignPerfUnits[$v]['result_pass']}' id='callChangeResult' class='tdpass unit' style='width: 14%;'><span>". $assignPerfUnits[$v]['result_pass'] ."</span></td>
				<td title='{$assignPerfUnits[$v]['result']}' id='callChangeResult' class='tdresult' style='width: 16%; background-color:#f5eab2;'>
					<div style='{$style}'>". $assignPerfUnits[$v]['result'] ."</div>
				</td>
				<td class='tdassesment' class='unit' style='width: 38%;'>
					<div id='quality_assesment' class='quality_assesment' style='width: 50px;'>
						<div class='pass' onmouseover=\"this.style.background='#DDDDDD';\" onmouseout=\"this.style.background='#EEEEEE';\">".dlang("passvalue","Pass")."</div>
						<div class='notpass' onmouseover=\"this.style.background='#DDDDDD';\" onmouseout=\"this.style.background='#EEEEEE';\">".dlang("npassvalue","NPass")."</div>
					</div>
					<table id='heightAssesment' border='0' style='width:100%; border: mintCream;' cellspacing='0' cellpadding='0'>
						<input id='assPerfId' type='hidden' value='{$assignPerfUnits[$v]['resultset_id']}' />
						<input id='assPerfType' type='hidden' value='{$assignPerfType}' />
						<tr id='new_assesment' class='new_assesment'>
							<td id='highlightAssesment' style='background-color:#F4726D; width: 17%; text-align:right;'><span style='color:white; font-weight:bold; margin-right: 3px;'>".dlang("npassvaluesmall","N")."</span></td>
							<td id='highlightAssesmentYellow' style='background-color:#f5eab2; width: 17%; text-align:center;'><span style='color:#c4c2a9; font-weight:bold;'>".dlang("passvaluesmall","P")."</span></td>
							<td id='highlightAssesmentYellow' style='background-color:#f5eab2; text-align:center;'><span style='color:#c4c2a9; font-weight:bold;'>&nbsp</span></td>
						</tr>
					</table>
				</td>
			</tr>";
}elseif( $assignPerfUnits[$v]['assessment'] == dlang("passvalue","Pass") ||  $assignPerfUnits[$v]['assessment'] == "Pass" ||  $assignPerfUnits[$v]['assessment'] == "G" ){
	$echo .= "<tr id='callChangeResult' class='heightresult'>
	            <td  style='display: none;' id='runit_id' >". $assignPerfUnits[$v]['result_unit_id'] ."</td>
				<td id='resultId' style='display: none;'>". $assignPerfUnits[$v]['resultset_id'] ."</td>
				<td id='submission_result' style='display: none;'>". $assignPerfUnits[$v]['submission_result'] ."</td>
				<td title='{$assignPerfUnits[$v]['result_unit']}' id='callChangeResult' class='tdunit unit' style='width: 18%; text-align:left; padding-left:6px;'><input class='unitsWidthOrg' type='hidden' value='$units' /><span class='unitsWidth'>". $units ."</span></td>
				<td title='{$assignPerfUnits[$v]['result_max']}' id='callChangeResult' class='tdmax unit' style='width: 14%;'><span>". $assignPerfUnits[$v]['result_max'] ."</span></td>
				<td title='{$assignPerfUnits[$v]['result_pass']}' id='callChangeResult' class='tdpass unit' style='width: 14%;'><span>". $assignPerfUnits[$v]['result_pass'] ."</span></td>
				<td title='{$assignPerfUnits[$v]['result']}' id='callChangeResult' class='tdresult' style='width: 16%; background-color:#f5eab2;'><div style='{$style}'>". $assignPerfUnits[$v]['result'] ."</div></td>
				<td class='tdassesment' class='unit' style='width: 38%;'>
					<div id='quality_assesment' class='quality_assesment' style='width: 50px;'>
						<div class='pass' onmouseover=\"this.style.background='#DDDDDD';\" onmouseout=\"this.style.background='#EEEEEE';\">".dlang("passvalue","Pass")."</div>
						<div class='notpass' onmouseover=\"this.style.background='#DDDDDD';\" onmouseout=\"this.style.background='#EEEEEE';\">".dlang("npassvalue","NPass")."</div>
					</div>
					<table id='heightAssesment' border='0' style='width:100%; border: mintCream;' cellspacing='0' cellpadding='0'>
						<input id='assPerfId' type='hidden' value='{$assignPerfUnits[$v]['resultset_id']}' />
						<input id='assPerfType' type='hidden' value='{$assignPerfType}' />
						<tr id='new_assesment' class='new_assesment'>
							<td id='highlightAssesment' style='background-color:green; width: 33%; text-align:right ;'><span style='color:white; font-weight:bold; margin-right:3px; '>".dlang("passvaluesmall","P")."</span></td>
						    <td id='highlightAssesmentYellow' style='background-color:#f5eab2; '><span style='color:white; font-weight:bold;'>&nbsp</span></td>
						</tr>
					</table>
				</td>
			</tr>";
}elseif( $assignPerfUnits[$v]['assessment'] == '' || $assignPerfUnits[$v]['assessment'] == 'na'){
	$echo .= "<tr id='callChangeResult' class='heightresult'>
	            <td  style='display: none;' id='runit_id' >". $assignPerfUnits[$v]['result_unit_id'] ."</td>
				<td id='resultId' style='display: none;'>". $assignPerfUnits[$v]['resultset_id'] ."</td>
				<td id='submission_result' style='display: none;'>". $assignPerfUnits[$v]['submission_result'] ."</td>
				<td title='{$assignPerfUnits[$v]['result_unit']}' id='callChangeResult' class='tdunit unit' style='width: 18%; text-align:left; padding-left:6px;'><input class='unitsWidthOrg' type='hidden' value='$units' /><span class='unitsWidth'>". $units ."</span></td>
				<td title='{$assignPerfUnits[$v]['result_max']}' id='callChangeResult' class='tdmax unit' style='width: 14%;'><span>". $assignPerfUnits[$v]['result_max'] ."</span></td>
				<td title='{$assignPerfUnits[$v]['result_pass']}' id='callChangeResult' class='tdpass unit' style='width: 14%;'><span>". $assignPerfUnits[$v]['result_pass'] ."</span></td>
				<td title='{$assignPerfUnits[$v]['result']}' id='callChangeResult' class='tdresult' alt='1' style='width: 16%; background-color:#f5eab2;'><div style='{$style}'>". $assignPerfUnits[$v]['result'] ."</div></td>
				<td class='tdassesment' class='unit' style='width: 38%;'>
					".($user->role=='pupil' || $user->role=='parent'? '': $grade1)."
					<table id='heightAssesment' border='0' style='width:100%; border: mintCream;' cellspacing='0' cellpadding='0'>
						<input id='assPerfId' type='hidden' value='{$assignPerfUnits[$v]['resultset_id']}' />
						<input id='assPerfType' type='hidden' value='{$assignPerfType}' />
						<tr class='noAssesment' id='new_assesment' class='new_assesment'>
							<td class='assesment_F2' style='width:17%; background-color: #F5EAB2; color: #C4C2A9;'><span style=''>F</span></td>
							<td class='assesment_E2' style='width:16%; background-color: #F5EAB2; color: #C4C2A9;'><span style=''>E</span></td>
							<td class='assesment_D2' style='width:16%; background-color: #F5EAB2; color: #C4C2A9;'><span style=''>D</span></td>
							<td class='assesment_C2' style='width:16%; background-color: #F5EAB2; color: #C4C2A9;'><span style=''>C</span></td>
							<td class='assesment_B2' style='width:16%; background-color: #F5EAB2; color: #C4C2A9;'><span style=''>B</span></td>
							<td class='assesment_A2' style='width:16%; background-color: #F5EAB2; color: #C4C2A9;'><span style=''>A</span></td>
						</tr>
					</table>
				</td>
			</tr>";//assesment_A-F above need delete 2
			//<td style='background-color:#f5eab2; width: 55%;'><span style='color:#c4c2a9; font-weight:bold;'>not assessed</span></td>
}
?>
