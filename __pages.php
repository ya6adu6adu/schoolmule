<?php
    include_once('_pageshead.php');
?>
        <link rel="shortcut icon" type="image/ico" href="favicon.png" />
		<?php foreach ($params['controls'] as $param): ?>
		<?php if(file_exists('js/controls/'.$param.'.js')): ?>
		<script type="text/javascript" src="js/controls/<?php echo $param.'.js'?>"></script>
		<?php endif ?>
		<?php if(file_exists('css/controls/'.$param.'.css')): ?>
		<link rel="stylesheet" type="text/css" href="css/controls/<?php echo $param.'.css'?>">
		<?php endif ?>
		<?php endforeach ?>
		<?php foreach ($params['instances'] as $param): ?>
		<script type="text/javascript" src="js/instances/<?php echo $param.'.js'?>"></script>
		<?php endforeach ?>
		<?php $file = explode('.php',basename($_SERVER['SCRIPT_NAME']));?>
		<script type="text/javascript" src="js/pages/<?php echo (isset($params['name']))?$params['name'].'.js': $file[0].'.js';?>"></script>
		<style type="text/css">
			#dialog7 .select { border: 1px solid #ccc4cf; }
		</style>
	</head>
	<body>
		<div id="container">
			<div id="page-wrap">			
				<div id="header">
                    <div id="menu">
                        <ul class="navMenu">
                            <li class="no-padding menuItem" style="background: transparent !important;">
                                <div class="menuBlock">
                                    <div class="menu" style="font-size: 10px !important;font-family: Arial !important;font-weight: bold !important;"><?php echo dlang("MENU","MENU"); ?></div>
                                    <div class="triangle"></div>
                                </div>
                                <ul class="subMenu">
                                    <li><a id="second-menu_move_to_setup"><?php echo dlang("main_menu_db_and_users", "Database and users")?></a></li>
                                    <li class="backImg">
                                        <?php echo dlang("main_menu_db_course_rooms", "Courserooms")?>
                                        <ul>
                                            <li id="second-menu_course_objectives"><?php echo dlang("course_objectives_tab", "Course objectives")?></li>
                                            <li id="second-menu_assignmrnts_and_performance"><?php echo dlang("course_rooms_tab", "Courserooms")?></li>
                                            <li id="second-menu_assessments"><?php echo dlang("assessments_tab", "Assessment")?></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            <li id="mainSub" class="menuItem" style="background: transparent !important; cursor: default !important;"></li>
                            <li id="selectedInTree" class="menuItem" style="background: transparent !important; font-weight: normal !important; cursor: default !important;"></li>
                        </ul>
                    </div>
					<div id="login">
                        <div class="right-header">

                            <div id="teacher-name"><?php echo $admin->full_name?></div>
                            <div class="top-line-breaker">|</div>
                            <div id="school-name"><?php echo $params['top_title']?></div>                            
                        </div>
					</div>
				</div>
<!--				<ul id="first-menu">                                    -->
<!--					<li style="padding-left: 21px;">-->
<!--                                            <div id="top-menu-fold-setup_menu" class="first-menu-fold" >-->
<!--                                                <a id="setup_menu" href="setup.php" onclick="$('#setup_menu').addClass('top_menu_selected'); $('#top-menu-fold-setup_menu').addClass('top_menu_fold_selected')">--><?php //echo $item1_menu?><!--</a>-->
<!--                                            </div>-->
<!--                                        </li>-->
<!--					<li>-->
<!--                                            <div id="top-menu-fold-course_objectives_menu" class="first-menu-fold">-->
<!--                                                <a id="course_objectives_menu" href="course_objectives.php" onclick="$('#course_objectives_menu').addClass('top_menu_selected'); $('#top-menu-fold-course_objectives_menu').addClass('top_menu_fold_selected')">--><?php //echo $item2_menu?><!--</a>-->
<!--                                            </div>-->
<!--                                        </li>-->
<!--                                        <div id="messages_to_sch">-->
<!--                                            <li style="float:right">-->
<!--                                                <div id="top-menu-fold-course_objectives_menu" class="first-menu-links">-->
<!--                                                    <p style="" id="bug_message">--><?php //echo dlang("right_top_report_bug","Report bug"); ?><!--</p>-->
<!--                                                </div>-->
<!--                                            </li>-->
<!--                                            <li style="float:right">-->
<!--                                                <div id="top-menu-fold-course_objectives_menu" class="first-menu-links">-->
<!--                                                    <p id="feature_request">--><?php //echo dlang("right_top_make_request","Make feature request"); ?><!--</p>-->
<!--                                                </div>-->
<!--                                            </li>-->
<!--                                        </div>-->
<!--				</ul>-->
                                
<!--                            <div id="second-menu">-->
<!--                                <div class="pre-second-menu-first-block"></div>-->
<!--                                <div class="pre-second-menu-second-block"></div>-->
<!--                                <div class="second-menu-left-block"> </div>-->
<!--                                <div class="second-menu-left-ang"> </div>-->
<!--                            </div>-->
                                
			<div id="main-content">
				<div class="box-caption no-border need_border needPadding">
					<div class="expand_btn" id="hide-navigation" title="comment_0016"></div>
					<span class="after_expand_btn" id="title_expand"></span>
				</div>
				<div id="overview-body"> </div>
				<div id="overview-footer"> </div>
			</div>
		</div>
		
<input id="staffAdmin" type="hidden" value="" />

<?php
    if($admin->login!=null){
        if($admin->role!='pupil' && $admin->role!='parent'){
            echo '
                <div id="dialog7" title="'.dlang("change_res_module_dialog_title","Change result").'" style="display:none">
                    <input id="resultId2" type="hidden" value="" />
                    <input id="evalution" type="hidden" value="" />
                    <input id="max_value" type="hidden" value="" />
                    <input id="pass_value" type="hidden" value="" />
                    <input id="runit_type" type="hidden" value="" />
                    <input id="submission_result" type="hidden" value="" />
                    <div style="float:left">
                        <div class="label"><label>'.dlang("change_res_module_dialog_runit","Result unit").': <span class="resultUnit"></span>, '.dlang("change_res_module_dialog_max","Max").': <span id="max"></span>, '.dlang("change_res_module_dialog_pass","Pass").': <span id="pass"></span></label></div>
                    </div>
                    <div style="clear:left"></div>
                    <br/>
                    <div class="label" style="margin-top: 0;"><label for="new-result">'.dlang("change_res_module_dialog_new","New result").'</label></div>
                    <div class="field" style="width: 275px; height: 58px;" ><textarea id="new-result" style="width: 275px; height: 58px;" name="new-result" title="'.dlang("change_res_module_dialog_new","New result").'" ></textarea></div>
                    <div class="label"><label for="old-result">'.dlang("change_res_module_dialog_old","Old result").'</label></div>
                    <div class="field" style="width: 275px; height: 58px;"><textarea id="old-result" style="width: 275px; height: 58px; text-align: left;" name="old-result" title="'.dlang("change_res_module_dialog_new","New result").'" readonly ></textarea></div>
                    <input id="resultUnitSelected" name="" type="hidden" value="" />
                </div>
            ';

        }
    }
?>

            <!-- HTML of ui-dialog, should be in the beginning of document, just after body tag -->
            <div id="dialog1" title="Delete" style="display:none;">
                <div id='confirmDelete' style="height: 0"></div>
            </div>

            <div id="dialog2" title="Add (group, course objective)" style="display:none">
                <input id='idpupil' type='hidden' value='' />
                <input id='idstudyGroup' type='hidden' value='' />
                <input id='idcourse' type='hidden' value='1' />
                <input id='groupId' type='hidden' value='' />
                <div class="label" style="margin-top: 0;">Name</div>
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

                <div class="label" style="margin-top: 0;">Name</div>
                <div class="field"><input type="text" id="assPerfName" style="width: 275px;" name="assPerfName" title="comment_0056" /></div>
                <ul style="list-style-type: none;">
                    <!--<li><input id='assignment' type="radio" name="radio_dlg3_1" style="margin-top:8px; margin-right: 3px;" checked="checked" value='Submission'/>Assignment</li>
                    <li><input id='assignment' type="radio" name="radio_dlg3_1" style="margin-top:8px; margin-right: 3px;" value='Performance'/>Performance</li>
                    <div class="hr" style="margin: 8px 1px 4px 0;"></div>-->
                    <li><input type="radio" name="radio-dlg3" style="margin-top:8px; margin-right: 3px;" value='addPupil' checked="checked" />Add to this pupil (<span class='add_pupil_name'></span>)</li>
                    <li><input type="radio" name="radio-dlg3" style="margin-top:4px; margin-right: 3px;" value='addToAllPupilsInStydygroup' />Add to all pupils in this studygroup (<span class='add_stydy_group'></span>)</li>
                    <li><input type="radio" name="radio-dlg3" style="margin-top:4px; margin-right: 3px;" value='addToAllPupilsInCourse' />Add to all pupils in this course (<span class='add_course'>English 1</span>)</li>
                    <div class="hr" style="margin: 8px 1px 4px 0;" > </div>
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
                    <div class="hr" style="margin: 8px 1px 4px 0;" > </div>
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

            <div id="dialog6" title=<?php echo dlang("change_weight_dialog_module","Change objective weight"); ?> style="display:none">
            <div style="height: 340px; border: 1px solid #999;">
                <div id="gridbox"></div>
            </div>
        </div>

        <div id="dialog6_co" title=<?php echo dlang("change_weight_dialog_system","Change objective weight"); ?> style="display:none">
        <div style="height: 340px; border: 1px solid #999;">
            <div id="gridbox_co" style="height: 100%;"></div>
        </div>
        </div>

        </div>
    </body>
</html>