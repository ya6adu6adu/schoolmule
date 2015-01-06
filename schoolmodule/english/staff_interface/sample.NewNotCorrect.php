<?php
session_start();
// include file coneccted to database
include ("../../dbconn.php");
// include config file with clsses where  select table and fields
include("../../config.php");

unset( $_SESSION['script'] );
?>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Pupil progress app</title>
	<link rel="stylesheet" type="text/css" href="../../css/jquery-ui-1.8.9.custom.css" />
	<link rel="stylesheet" type="text/css" href="../../css/style.css" />
	<link rel="stylesheet" type="text/css" href="../../css/module.css" />
	<link rel="stylesheet" type="text/css" href="../../css/popup.css" />
	<link rel="stylesheet" type="text/css" href="../../dhtmlx/skins/dhtmlxtree.css" />
	<link rel="stylesheet" type="text/css" href="../../dhtmlx/skins/dhtmlxgrid.css" />
	<link rel="stylesheet" type="text/css" href="../../dhtmlx/skins/dhtmlxgrid_dhx_schoolmule.css" />

	<!--<link rel="stylesheet" type="text/css" href="../../js/jquery-tooltip/jquery.tooltip.css" />-->
	<script type="text/javascript" src="../../js/jquery1.6.4.js"></script>
	
	<script type="text/javascript" src="../../js/script.js"></script>
		
	<!--<script type="text/javascript" src="../../js/sorttable/js/jquery-ui-1.8.16.custom.min.js"></script>-->
	
	<script src="../../dhtmlx/dhtmlxcommon.js"></script>
	<script src="../../dhtmlx/dhtmlxtree.js"></script>
	<script src="../../dhtmlx/dhtmlxgrid.js"></script>
	<script src="../../dhtmlx/dhtmlxgridcell.js"></script>
	<script src="../../dhtmlx/dhtmlxtreegrid.js"></script>
	<script src="../../dhtmlx/dhtmlxtreegrid_filter.js"></script>
	<script src="../../dhtmlx/dhtmlxmenu.js"></script>
	
	<!--<script type="text/javascript" src="../../js/jquery-ui-1.8.9.custom.min.js"></script>
	-->
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js"></script>
	<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.9/jquery-ui.min.js"></script>
	
	<script type="text/javascript">
		$(document).ready(function(){	
			// Select pupil and write them name in dialog box
			$('#pupil_StudyGroup').live("click",function(){
				
				name_pupil = $(this).find('.pupil_name').attr('alt');
				studygroup_pupil = $(this).find('.StudyGroup').attr('alt');
				StudyGroupID = $(this).find('#StudyGroupID').val();
				pupilId = $(this).children("input:first").val();
				staffAdmin = $("input#staffAdmin").val();
				
				$('.name_pupil').val( name_pupil );
				$('.studygroup_pupil').val( studygroup_pupil );
				
				$('.add_pupil_name').text( name_pupil );
				$('.add_stydy_group').text( studygroup_pupil );
				$('.add_stydy_group').text( studygroup_pupil );
				
				$('#idpupil').val( pupilId );
				$('#idstudyGroup').val( StudyGroupID );
				
				$.post("../../dhtmlx/myxml/xml.php",{action:"create_xml", pupilId: pupilId, StudyGroupID: StudyGroupID, name_pupil: name_pupil, studygroup_pupil: studygroup_pupil});		
				$.post("../../ajax/ajax.php",{action:"select_info", staffAdmin: staffAdmin, pupilId: pupilId, StudyGroupID: StudyGroupID },function(data){
					$('.overview-body').html(data);
				});
			});
			
			//select pupil or teacher or staff/admin
			$("select#styled").change(function(){
				//if( $(this).val() )
					//$("input#staffAdmin").val( $(this).val() );
				$.post("../../ajax/ajax_update.php",{action: "staffAdmin", staffAdmin: $(this).val()},function(data){
					if( data == 1 ) window.location='';
				});
			});
			
			//check size browser window
			window.onresize = function(){
				$('span.unitsWidth').each(function(){
					unitWidth = ( $(this).width() ) + 4;
					parentWidth = ( $(this).parent().width() ) - 1;
					
					if( unitWidth >= parentWidth ){
						unitSpan = $(this).text();
						unitLength = unitSpan.length - 1;
						newStr = unitSpan.substr(0, unitLength);
						$(this).text( newStr );
					}else{
						unitSpanOrg = $(this).prev().width();
						if( unitSpanOrg < parentWidth ){
							unitSpanOrgText = $(this).prev().val();
							unitSpan = $(this).text();
							unitLength1 = unitSpan.length + 1;
							newStr = unitSpanOrgText.substr(0, unitLength1);
							$(this).text( newStr );
						}
					}
				});
			}
		});
	</script>
		
	<style type="text/css">
		#dialog7 .select { border: 1px solid #ccc4cf; }
	</style>
	
</head>

<body>

<input id="staffAdmin" type="hidden" value="" />

<!-- HTML of ui-dialog, should be in the beginning of document, just after body tag -->
<div id="dialog1" title="Delete" style="display:none;">
	<div id='confirmDelete' style="height: 0"></div>
</div>

<div id="dialog2" title="Add (group, course objective)" style="display:none">
	<input id='idpupil' type='hidden' value='' />
	<input id='idstudyGroup' type='hidden' value='' />
	<input id='idcourse' type='hidden' value='1' />
	<input id='groupId' type='hidden' value='' />
	<div class="label" style="margin-top: 0;"><label for="f-name">Name</label></div>
	<div class="field"><input type="text" id="groupName" style="width: 275px;" name="groupName" title="comment_0056" /></div>
	<ul style="list-style-type: none;">		
		<li><input type="radio" name="radio-dlg2" style="margin-top:8px; margin-right: 3px;" value='hideFromPupil'  checked="checked" />Hide addition from this pupil (<span class='add_pupil_name'></span>)</li>
		<li><input type="radio" name="radio-dlg2" style="margin-top:4px; margin-right: 3px;" value='hideFromStudygroup' />Hide addition from this studygroup (<span class='add_stydy_group'></span>)</li>
		<li><input type="radio" name="radio-dlg2" style="margin-top:4px; margin-right: 3px;" value='hideFromCourse' />Hide addition from this course (<span class='add_course'>English 1</span>)</li>
		<li><input type="radio" name="radio-dlg2" style="margin-top:4px; margin-right: 3px;" value='dontHide' />Don't hide</li>
	</ul>
</div>

<div id="dialog3" title="Add (assignment, performance)" style="display:none">
	
	<input class='name_pupil' type='hidden' name='' value='' />
	<input class='studygroup_pupil' type='hidden' name='' value='' />

	<div class="label" style="margin-top: 0;"><label for="f-name">Name</label></div>
	<div class="field"><input type="text" id="assPerfName" style="width: 275px;" name="assPerfName" title="comment_0056" /></div>
	<ul style="list-style-type: none;">
		<!--<li><input id='assignment' type="radio" name="radio_dlg3_1" style="margin-top:8px; margin-right: 3px;" checked="checked" value='Submission'/>Assignment</li>
		<li><input id='assignment' type="radio" name="radio_dlg3_1" style="margin-top:8px; margin-right: 3px;" value='Performance'/>Performance</li>
		<div class="hr" style="margin: 8px 1px 4px 0;"></div>-->
		<li><input type="radio" name="radio-dlg3" style="margin-top:8px; margin-right: 3px;" value='addPupil' checked="checked" />Add to this pupil (<span class='add_pupil_name'></span>)</li>
		<li><input type="radio" name="radio-dlg3" style="margin-top:4px; margin-right: 3px;" value='addToAllPupilsInStydygroup' />Add to all pupils in this studygroup (<span class='add_stydy_group'></span>)</li>
		<li><input type="radio" name="radio-dlg3" style="margin-top:4px; margin-right: 3px;" value='addToAllPupilsInCourse' />Add to all pupils in this course (<span class='add_course'>English 1</span>)</li>
		<div class="hr" style="margin: 8px 1px 4px 0;"></div>
		<li><input type="radio" name="radio-dlg3_2" style="margin-top:4px; margin-right: 3px;" value='hideFromPupil' checked="checked" />Hide addition from this pupil (<span class='add_pupil_name'></span>)</li>
		<li><input type="radio" name="radio-dlg3_2" style="margin-top:4px; margin-right: 3px;" value='hideFromStudygroup' />Hide addition from this studygroup (<span class='add_stydy_group'></span>)</li>
		<li><input type="radio" name="radio-dlg3_2" style="margin-top:4px; margin-right: 3px;" value='hideFromCourse' />Hide addition from this course (<span class='add_course'>English 1</span>)</li>
		<li><input type="radio" name="radio-dlg3_2" style="margin-top:4px; margin-right: 3px;" value='dontHide' />Don't hide</li>
	</ul>
</div>

<div id="dialog4" title="Hide" style="display:none">
	<div id='itemName'>Hide (item name) from</div>
	<div id='hideFrom' style='display:none'></div>
	<ul style="list-style-type: none;">
		<li><input type="checkbox" name="r-hide-cb" style="margin-top:8px;" checked="checked" />My view</li>
		<div class="hr" style="margin: 8px 1px 4px 0;"></div>
		<li><input type="radio" name="r-hide" style="margin-top:4px; margin-right: 3px;" value='hideFromPupil' checked="checked" />Current pupil (<span class='add_pupil_name'></span>)</li>
		<li><input type="radio" name="r-hide" style="margin-top:4px; margin-right: 3px;" value='hideFromStudygroup' />All pupils in studygroup (<span class='add_stydy_group'></span>)</li>
		<li><input type="radio" name="r-hide" style="margin-top:4px; margin-right: 3px;" value='hideFromCourse' />All pupils in course (<span class='add_course'>English 1</span>)</li>
		<li><input type="radio" name="r-hide" style="margin-top:4px; margin-right: 3px;" value='dontHide' />Don't hide</li>
	</ul>	
</div>

<div id="dialog5" title="Hidden items" style="display:none">
	<div style="height: 340px; border: 1px solid #999; overflow: auto; background: #f7f7f7;">
		<div id="tree-box1" style="background: #f7f7f7;"></div>
	</div>
</div>

<div id="dialog6" title="Change objective weight" style="display:none">
	<div style="height: 340px; border: 1px solid #999;">
		<div id="gridbox"></div>
	</div>
</div>

<!--
<div id="dialog7" title="Change result" style="display:none">
	<input id='resultId2' type='hidden' value='' />
	<input id='evalution' type='hidden' value='' />
	<div class="label" style="margin-top: 0;"><label for="new-result">New result</label></div>
	<div class="field"><input type="text" id="new-result" style="width: 275px;" name="new-result" title="comment_0056" /></div>
	<div class="label"><label for="old-result">Old result</label></div>
	<div class="field"><input type="text" id="old-result" style="width: 275px;" name="old-result" title="comment_0056" readonly /></div>


	<input id="resultUnitSelected" name="" type="hidden" value="" />
	<div style="float:left">
		<div class="label"><label>Result unit</label></div>
		<div class="field">
			<select id='resultUnit' class="styled" name="resultunit" style="width:181px;opacity: 1;" title="comment_0047">
				<!--<option>Grade</option>
				<option>Points</option>
				<option>Pass</option>
				<option>Percent</option>
				<option>Freetext with assessment</option>
				<option>Freetext without assessment</option>
				<option>No evaluation</option>
				<option>E</option>
				<option>C-D</option>
				<option>A-B</option> original-->
		<!--	</select>
		</div>
	</div>
	<div style="float:left; margin-left:5px;">
		<div class="label"><label for="max">Max</label></div>
		<div class="field"><input type="text" id="max" name="max" style="width: 40px;" value="100" title="comment_0048" /></div>
	</div>
	<div style="float:left; margin-left:5px;">
		<div class="label"><label for="pass">Pass</label></div>
		<div class="field"><input type="text" id="pass" name="pass" style="width: 40px;" title="comment_0048" /></div>
	</div>
	<div style="clear:left"></div>
	
	<div class="label"><label>Assessment type</label></div>
	<select id='assessmentType' class="styled" name="resultunit" style="width:181px;opacity: 1;" title="comment_0047">
		<option value='na'>Graded</option>
		<option value='p'>Pass</option>
		<option value='No evaluation'>No evaluation</option>
	</select>
	
	<div class="hr" style="margin-right: 1px; margin-top: 14px;"></div>
	
	<div class="label"><label for="new-custom-result">New custom result unit</label></div>
	<div class="field">
		<input type="text" id="new-custom-result" style="width:229px; margin-right:5px;" name="new-custom-result" title="comment_0056" />
		<a class="button" title="comment_0024">Add</a>
	</div>
</div>-->

<div id="dialog7" title="Change result" style="display:none">
	<input id='resultId2' type='hidden' value='' />
	<input id='evalution' type='hidden' value='' />
	
	<div style="float:left">
		<div class="label"><label>Result unit:</label></div>
		<div class="field">
			Points
		</div>
	</div>
	<div style="clear:left"></div>
	<div style="float:left;">
		<div class="label"><label for="max">Max</label></div>
		<div class="field"><input type="text" id="max" name="max" style="width: 40px;" value="100" title="comment_0048" /></div>
	</div>
	<div style="float:left; margin-left:5px;">
		<div class="label"><label for="pass">Pass</label></div>
		<div class="field"><input type="text" id="pass" name="pass" style="width: 40px;" title="comment_0048" /></div>
	</div>
	<div style="clear:left"></div><br/>
	
	<div class="label" style="margin-top: 0;"><label for="new-result">New result</label></div>
	<div class="field"><input type="text" id="new-result" style="width: 275px;" name="new-result" title="comment_0056" /></div>
	<div class="label"><label for="old-result">Old result</label></div>
	<div class="field"><input type="text" id="old-result" style="width: 275px;" name="old-result" title="comment_0056" readonly /></div>


	<input id="resultUnitSelected" name="" type="hidden" value="" />
	
</div>

<div id="container">
<div id="page-wrap">

	<div id="header">
		<div id="logo"></div> <!-- School logo. Image filename is in CSS as background -->
		<div id="login">
			<!-- Admin image -->
			<img src="../../images/noimage.png" alt="schooladmin teachers interface" />
			<div id="login-content">
				<div id="login-caption">Teachers interface</div>
				<div id="teacher-name">Edmund Edmundsson</div>
				<!-- School name field -->
				<select class="styled" name="school" title="comment_0001" style="opacity: 1;">
					<option>School 1</option>
					<option>School 2</option>
				</select><br />
				<a id="acc-set" href="#">Account settings</a><span id="acc-divider"> | </span><a id="sign" href="#">Sign out</a>
			</div>
		</div>
	</div>
	
	<!-- First top menu -->
	<ul id="first-menu">
	</ul>
	
	<!-- Second top menu -->
	<div id="second-menu">
		<div id="left-tab"></div>
	</div>
	
	<div id="navigation">
		<div class="box-caption">
			Navigation
		</div>
		
		<!-- Select pupil from database include file pupil/selectPupil.php-->
		<div class='pupil'>
			<?php include ("pupil/selectPupil.php");?>
		</div>		
		
		<!-- Buttons at the bottom of the Details (or accord) box -->
		<div id="details-footer">
			
		</div>
	</div> <!-- END accord -->
	
	<div id="main-content">
		<div class="box-caption" style="text-indent:20px">
			<img class="pointer" id="hide-navigation" src="../../images/collapse.png" alt="Hide details" onclick="hideNavigation()" title="comment_0016" />
			<img src="../../images/expand.png" alt="collapse" style="display:none" />
			Pupil progress application
			<div style="position: absolute; right: 8px; top: 4px; text-indent: 0;">
				<div class="field">
					<?
					$resSelect = mysql_query("SELECT * FROM `pupilprogress_checkPupil` WHERE 1")or die( mysql_error() );
					$rowSelect = mysql_fetch_assoc( $resSelect );
					?>
					<select id="styled" class="styled" style="width: 100px; opacity: 1;" name="weight" title="comment_0030">
						<option <?if($rowSelect['check']=='Staff/Admin')echo "selected";?> value="Staff/Admin">Staff/Admin</option>
						<option <?if($rowSelect['check']=='Teacher')echo "selected";?> value="Teacher">Teacher</option>
						<option <?if($rowSelect['check']=='Pupil/Parent')echo "selected";?> value="Pupil/Parent">Pupil/Parent</option>
					</select>
				</div>
			</div>
		</div>
		
		<!-- Here is content div of Overview box -->
		<div id="overview-body" style="padding: 4px 16px; top: 24px; background-color:white;"><!--#afafaf-->
			<div style='width:100%; height: 100%; overflow: auto;'class='overview-body'>

			</div>
		
		</div> <!-- END overview-body -->
		
		<div id="overview-footer">
			<!-- Buttons at the bottom of Overview box -->
			<div id="buttons-left" style="left: 8px">
				<a class="toggleAssgnPerfHide button" title="Toggle assgnm./perform.">Toggle assgnm./perform.</a>
				<!--<a class="button" title="comment_0036">Save</a>
				<a class="button" title="comment_0037">Cancel</a>
				<span>&nbsp;&nbsp;Dialogs:</span>
				<a class="button" id="dialog_btn1" title="comment_0037">Ok (Empty)</a>
				<a class="button" id="dialog_btn2" title="comment_0037">Add (group ...)</a>
				<a class="button" id="dialog_btn3" title="comment_0037">Add (assignment ...)</a>
				<a class="button" id="dialog_btn4" title="comment_0037">Hide</a>
				<a class="button" id="dialog_btn5" title="comment_0037">Hidden items</a>
				<a class="button" id="dialog_btn6" title="comment_0037">Change objective weight</a>
				<a class="button" id="dialog_btn7" title="comment_0037">Change result</a>-->
			</div>
		</div>
	</div> <!-- END overview -->
	
</div> <!-- END page-wrap -->
</div> <!-- END container -->

<div id="footer">
	<div id="footer-left"> <!-- Left part of footer -->
		<img src="../../images/schoolmule_logo_small.png" alt="schooladmin" />
		<a class="inverted-link" href="#">Schoolmule learningsystems</a> &nbsp;|&nbsp;
		<a class="inverted-link" href="#">About</a> &nbsp;|&nbsp;
		<a class="inverted-link" href="#">Tutorials and Help</a> &nbsp;|&nbsp;
		<a class="inverted-link" href="#">Privacy policy</a> &nbsp;|&nbsp;
		<a class="inverted-link" href="#">Terms</a> &nbsp;|&nbsp;
		<a class="inverted-link" href="#">Jobs</a>
	</div>
	<div id="footer-right"> <!-- Right part of footer -->
		Unique user logins today Staff 16 / 22 &nbsp;|&nbsp; Pupils 123 / 189 &nbsp;|&nbsp; Parents 200 / 400
	</div>
</div> <!-- END footer -->
</body>
</html>
