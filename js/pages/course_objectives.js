$(function(){
    viewRooms();
/*	schoolmule.main.callback = viewRooms;
	if(schoolmule.main.user_id==null){
		schoolmule.main.showLogin();
	}else{
		viewRooms();
	}*/
});

var content = null;
var acc = null;
var navigation = null;
var tabbar = null;
var objectives_weight_grid = null;

function viewRooms(){
	var hashValues = Hash.get();
	var default_select = true;
	if(hashValues.tab){
		default_select = false;
	}else{
        hashValues.tab = "second-menu_assignmrnts_and_performance";
    }

	tabbar = new schoolmule.controls.tabs(
     //   {
	//	container:"second-menu",
	//	width:'109px',
	//	tabs_left:{
	//			id:'left-tab',
	//			callback: function(){
	//			},
	//			label:dlang("room_menu","Courserooms"),
	//			select: false
	//		},
	//	tabs: [
	//		{
	//			id:'course_objectives',
	//			callback: function(){
	//				showCourseObjectives();
	//			},
	//			label:dlang("course_objectives_tab","Course objectives")
	//		},
	//		{
	//			id:'assignmrnts_and_performance',
	//			callback: function(){
	//				showAssignmetsAndPerformance();
	//			},
     //           select: default_select,
     //           label:dlang("course_rooms_tab","Courserooms")
	//		},
	//		{
	//			id:'assessments',
	//			callback: function(){
    //
	//				showAssessments();
	//			},
	//			label:dlang("assessments_tab","Assessments")
	//		}
	//	]
	//}
    );
    bindMenuEvents();
    tabbar.bindMenuEvents(
        'second-menu',
        [
            {
                id:'course_objectives',
                callback: function(){
                    if(detectMobileDevice()){
                        hideNavMenu();
                    }
                    window.location.hash = "#tab=second-menu_course_objectives";
                    if(window.location.pathname.indexOf("setup.php") > -1){
                        window.location.pathname = "course_objectives.php"
                    }else{
                        showCourseObjectives();
                    }
                    setMainPath(dlang("main_menu_db_course_rooms", "Courserooms")+" > "+ dlang("course_objectives_tab", "Course objectives"));

                }
            },
            {
                id:'assignmrnts_and_performance',
                callback: function(){
                    if(detectMobileDevice()){
                        hideNavMenu();
                    }
                    window.location.hash = "#tab=second-menu_assignmrnts_and_performance";
                    if(window.location.pathname.indexOf("setup.php") > -1){
                        window.location.pathname = "course_objectives.php"
                    }else{
                        showAssignmetsAndPerformance();
                    }
                    setMainPath(dlang("main_menu_db_course_rooms", "Courserooms")+" > "+dlang("course_rooms_tab", "Courserooms"));
                }
            },
            {
                id:'assessments',
                callback: function(){
                    if(detectMobileDevice()){
                        hideNavMenu();
                    }
                    window.location.hash = "#tab=second-menu_assessments";
                    if(window.location.pathname.indexOf("setup.php") > -1){
                        window.location.pathname = "course_objectives.php"
                    }else{
                        showAssessments();
                    }
                    setMainPath(dlang("main_menu_db_course_rooms", "Courserooms")+" > "+dlang("assessments_tab", "Assessment"));
                }
            },
            //{
            //    id: 'move_to_course_room',
            //    callback: function(){
            //        window.location.hash = "#tab=second-menu_assignmrnts_and_performance";
            //        window.location.pathname = "setup.php"
            //    }
            //}
            //,
            {
                id: 'move_to_setup',
                callback: function(){
                    if(detectMobileDevice()){
                        hideNavMenu();
                    }
                    window.location.hash = "";
                    window.location.pathname = "setup.php";
                }
            }
        ]
    );


	if(hashValues.tab){
		tabbar.setActiveTab(hashValues.tab);
	}
}

function cleanArea(){
	if(navigation){
		navigation.destroyNav();
		navigation = null;
	}
	if(content){
		content.setTitle("main-content","");
		content.destroy();
		content = null;
	}
}

function showAssessments(){
	cleanArea();
	navigation = new schoolmule.controls.layout({
	cellsBlock:{
		display_footer_left: true,
		cells_left:[
						{
							id : "nav-header"
													
						},
						{
							id : "nav-body"
						}
			   	   	],
		cells_right:[]
		}
	});



	navigation.setTitle("navigation",dlang("assessment_accord","Assessment navigation"));
    var accord_title = dlang("assessments_by_stg_accord","Assessments by studygroup");
    if(schoolmule.main.user_role == 'pupil' || schoolmule.main.user_role == 'parent'){
        accord_title = dlang("assessments_by_stg_accord_my","My assessments");
    }
	acc = new schoolmule.controls.accordeon("nav-body",{
		cells: [
					{
						id: "assessments_by_stg",
						title: accord_title,
						content: "",
						expanded : true
					},
					{
						id: "assessments_overview",
						title: dlang("assessments_overview_accord","Assessments overview"),
						content: "",
						expanded : true
					}
			 ]		
	});
	
	
	navigation.elements.push(acc);

	schoolmule.instances.tree_assessments_overview.attachTo("assessments_overview",{actions:{
			"assignmentsprogress":getAssignmentProgress,
			"stats":getStats
		}
	});	

	schoolmule.instances.tree_assessments_by_studygroup.attachTo("assessments_by_stg",{actions:{
			"objectivesprogress":getObjectiveProgress,
			"assignmentsprogress":getAssignmentProgress,
			"statsandnotes":getStatsAndNotes
		}
	});
}

function showAssignmetsAndPerformance(){		
	cleanArea();
	navigation = new schoolmule.controls.layout({
	cellsBlock:{
		display_footer_left: true,
		cells_left:[
						{
							id : "nav-header"						
						},
						{
							id : "nav-body"
						}
			   	   	],
		cells_right:[]
		}
	});
		
	navigation.setTitle("navigation",dlang("assign_perf_accord","Courserooms navigation"));

	acc = new schoolmule.controls.accordeon("nav-body",{
		cells: [
					{
						id: "assignments_by_studygroup",
						title: dlang("assignments_by_studygroup_accord","Courserooms"),
						content: "",
						expanded : true
					},
					{
						id: "assignments_by_status",
						title: dlang("assignments_by_status_accord","Assignments by status"),
						content: "",
						expanded : false
					}
			 ]		
	});
	
	var hashValues = Hash.get();
	if(hashValues.itemtype){
		switch(hashValues.itemtype){
			case "assignment":
				//acc.toggleItem('assignments_by_studygroup');
			break;
			case "performance":
				acc.toggleItem('tree_performance');
			break;
			default:break;
		}
	}
	
	navigation.elements.push(acc);
			
	schoolmule.instances.tree_assignments_by_studygroup.attachTo("assignments_by_studygroup",{actions:{
			"assignment": showAssignmentsDetails,
			"submission": showAssessAssignment,
			"performance": showPerformnaceDetails,
            "page": showPageDetails,
			"assessment": showAssessPerformance		
		}
	});
	
	schoolmule.instances.tree_assignments_by_status.attachTo("assignments_by_status",{actions:{
        "assignment": showAssignmentsDetails,
        "submission": showAssessAssignment
	}});
}

/*Code from objectives module...*/
function calculateFooterValuesO() {
    var nrQ = document.getElementById("nr_ss");
    nrQ.innerHTML = sumColumn(1)+'%';
    return true;
}
function sumColumn(ind) {
    var out = 0;
    for (var i = 0; i < objectives_weight_grid.getRowsNum(); i++) {
        out += parseFloat(objectives_weight_grid.cells2(i, ind).getValue());
    }
    return out;
}

function showCourseObjectives(){
	objectives_weight_grid = new dhtmlXGridObject('gridbox_co');
	objectives_weight_grid.selMultiRows = false;
	objectives_weight_grid.imgURL = "schoolmodule/dhtmlx/imgs/icons_greenfolders/";
	objectives_weight_grid.setHeader(dlang("change_weight_objective","Objective")+','+dlang("change_weight_weight","Weight"));
	objectives_weight_grid.setInitWidths("276,60");
	objectives_weight_grid.setColAlign("left,left");
	objectives_weight_grid.setColTypes("ro,co");

    objectives_weight_grid.setSkin("dhx_skyblue");
	objectives_weight_grid.init();



    objectives_weight_grid.attachEvent("onXLE", function(grid_obj,count){
        for(var j=5; j<=100; j+=5){
            objectives_weight_grid.getCombo(1).put(j+'%', j+'%');
        }
        calculateFooterValuesO();
    });

	objectives_weight_grid.attachFooter(dlang("change_weight_footer_sum","Sum (must be 100%):")+',<span id="nr_ss">0</spanWW>%');
	cleanArea();
	navigation = new schoolmule.controls.layout({
	cellsBlock:{
		display_footer_left: true,
		cells_left:[
						{
							id : "nav-header"						
						},
						{
							id : "nav-body"
						}
			   	   	],
		cells_right:[]
		}
	});

	navigation.setTitle("navigation",dlang("course_object_accord","Course objectives navigation"));
    var accord_title = dlang("course_objectives_accord","Course objectives");
    if(schoolmule.main.user_role == 'pupil' || schoolmule.main.user_role == 'parent'){
        accord_title = dlang("course_objectives_accord_my","My objectives");
    }
	acc = new schoolmule.controls.accordeon("nav-body",{
		cells: [
					{
						id: "course_objectives",
						title:accord_title,
						content: "",
						expanded : true
					}
			 ]		
	});
	
	navigation.elements.push(acc);
	schoolmule.instances.tree_course_objectives.attachTo("course_objectives",{actions:{
		"objective": showObjectiveDetais
	}});		
}

function copyExternalLink(text){
	var tree = schoolmule.instances.tree_assignments_by_studygroup.getTree();
	var id = tree.getSelectedItemId();
	var _id = id.split('_');
	Hash.add('itemid',_id[1]);
	Hash.add('itemtype',_id[0]);
    seprompt(text,window.location.toString());
}

function copyExternalLinkAssignment(text){
	var tree = schoolmule.instances.tree_assignments_by_studygroup.getTree();
	var id = tree.getSelectedItemId();
	var _id = id.split('_');
	Hash.add('itemid',_id[1]);
	Hash.add('itemtype',_id[0]);
    seprompt(text,window.location.toString());
}

function showAssessPerformance(performance_id,p_stg){
    $('.no-select-tree-item-message').hide();
	var script = "connectors/connector.php?control_id=tree_assignments_by_studygroup";
	if(content){
		content.destroy();
		content = null;
	}
	content = new schoolmule.controls.layout({
	cellsBlock: {
				display_footer_right: true,
				cells_right:[
								
								{
									cells:[{
										new_count : false,
										id : "main-box-header",
										title: "",
										width: '100%',
										height: '67px',
										border_bottom: true
									}]									
								},
								{
									cells:[
									{
										new_count : true,
										id : "gridbox_performance",
										width: '100%',
										height: '89px',
										border_right: false
									}
									]													
								},
								{													
									cells:[
									{
										new_count : true,
										id : "assess_grid",
										width: '100%',
										title: dlang("details_assess_performance_teachers_private_notes","Teachers private notes"),
										height: '100%'
									},													
									{
										new_count : true,
										id : "comments_tiny",
										title: dlang("details_assess_performance_submissions","Submissions"),
										width: '270px',
										height: '100%',
                                        border_left: true
									}
									]
								}								
						     ]
		  }
	});

	content.showLoader();
	content.setHeaderExpand('assess_grid');
    $("#comments_tiny").append("<div class='submission_box'><div class='no-select-submission'>"+dlang("select_item_box","Select item in grid")+"</div></div>");
	$.post(script, {action:"getassessperformance",id:performance_id}, function(json_response){
		content.hideLoader();
		var tree = schoolmule.instances.tree_assignments_by_studygroup.getTree();
		//json_response.info.studygroup=tree.getItemText(tree.getParentId('performance_'+performance_id+(p_stg?'_'+p_stg:"")));
		schoolmule.instances.html_performance.attachTo("main-box-header",false,json_response.info);
        $('#view_assessments').click(function(){
            var tree = schoolmule.instances.tree_assignments_by_studygroup.getTree();
            tree.selectItem("performance_"+performance_id);
        });

        $('#view_assessments img').attr('src',json_response.info.assessment_image);
		schoolmule.instances.grid_performance.attachTo("gridbox_performance",performance_id);

        $("#assignment_publication").change(function () {
            $("#assignment_publication option:selected").each(function () {
                $.post(script, {action:"setpubliation",id:performance_id,publication:$(this).val(), item:"performance"});
            });
        });

        setHeaderSelectItemsForAssignment(json_response);

        setSelectActions(performance_id,"performance");

		schoolmule.instances.grid_assess_performance.attachTo("assess_grid",performance_id,{actions:{
			"pupil":setPefrormanceContent
			}
		});	
		
		content.elements.push(schoolmule.instances.grid_assess_performance);
		content.elements.push(schoolmule.instances.grid_performance);
        content.elements.push(acc);
		//setPefrormanceContent(performance_id);
	},"json");
	content.setTitle("main-content",dlang("details_assess_performance","Assess performance"));
}

function makeAsSubmitted(id,pid,grid){
    var mas = $("#mark_as_submitted");
    mas.removeAttr("disabled");
    mas.removeClass("disabled-button");
}

function enableMASbutton(){
    var mas = $("#mark_as_submitted");
    mas.removeAttr("disabled");
    mas.removeClass("disabled-button");
    return mas;
}

function checkSubmissionButton(id, tree_item,stg){
    var pupil;
    var mas = enableMASbutton();
	if(tabbar.curtab == 'second-menu_assignmrnts_and_performance'){
		if(schoolmule.instances.grid_assess_assignments.getGrid().grid.getUserData('pupil_'+id+(stg?'_'+stg:""),'submitted')=="1"){
            mas.text(dlang("button_make_as_not_submitted","Mark as not Submitted"));
		}else{
            mas.text(dlang("button_make_as_submitted","Mark as Submitted"));
		}
        pupil = id;
	}

    if(tabbar.curtab == 'second-menu_assessments'){
        if(schoolmule.instances.grid_assignments_progress.getGrid().grid.getUserData('assignment_'+id,'submitted')=="1"){
            mas.text(dlang("button_make_as_not_submitted","Mark as not Submitted"));
        }else{
            mas.text(dlang("button_make_as_submitted","Mark as Submitted"));
        }
        pupil = tree_item;
        tree_item = id;
    }

	AssignmentsContent(tree_item, pupil);
}

function showAssessAssignment(assignment_id,p_stg){

	var script = "connectors/connector.php?control_id=tree_assignments_by_studygroup";
    $('.no-select-tree-item-message').hide();
	if(content){
		content.destroy();
		content = null;
	}
	content = new schoolmule.controls.layout({
	cellsBlock: {
				display_footer_right: true,
				cells_right:[
								{
									cells:[{
										new_count : false,
										id : "main-box-header",
										title: "",
										width: '100%',
										height: '68px',
										border_bottom: true
									}]									
								},
								{													
									cells:[
									{
										new_count : true,
										id : "assignment_garade",
										title: dlang("details_submissions_subm_res_and_assess","Submission result and assessments"),
										width: '100%',
										height: '100%'
									},
									{
										new_count : true,
										id : "comments_tiny",
										title: dlang("details_submissions_submissions","Submissions"),
										width: '270px',
										height: '100%',
                                        border_left: true
									}
									]
								}
						     ]
		  }
	});
	content.showLoader();
	content.setHeaderExpand('assignment_garade');
    $("#comments_tiny").append("<div class='submission_box'><div class='no-select-submission'>"+dlang("select_item_box","Select item in grid")+"</div></div>");
	$.post(script, {action:"getassignmentassess",id:assignment_id}, function(json_response){
		content.hideLoader();
		var tree = schoolmule.instances.tree_assignments_by_studygroup.getTree();
			//json_response.info.assignment_stg = tree.getItemText(tree.getParentId('assignment_'+assignment_id+(p_stg?'_'+p_stg:"")));
			schoolmule.instances.html_assignments.attachTo("main-box-header",false, json_response.info);
            $('#view_submissions').click(function(){
                var tree = schoolmule.instances.tree_assignments_by_studygroup.getTree();
                var id = "assignment_"+assignment_id;
                if(tree.getSelectedItemId()==""){
                    tree = schoolmule.instances.tree_assignments_by_status.getTree();
                    id = "assignment_"+assignment_id+"_"+p_stg;
                }
                tree.selectItem(id,true);
                //var tree = schoolmule.instances.tree_assignments_by_studygroup.getTree();
                //tree.selectItem("assignment_"+assignment_id);
            });
            $('#view_submissions img').attr('src',json_response.info.submission_image);

        $("#assignment_publication").change(function () {
            $("#assignment_publication option:selected").each(function () {
                $.post(script, {action:"setpubliation",id:performance_id,publication:$(this).val(), item:"performance"});
            });
        });

        setHeaderSelectItemsForAssignment(json_response);

        setSelectActions(assignment_id,"assignment");
		    schoolmule.instances.grid_assess_assignments.attachTo("assignment_garade",assignment_id,{actions:{
			"pupil":checkSubmissionButton
			}
		});
		content.elements.push(schoolmule.instances.grid_assess_assignments);
        setHeaderSelectItemsForAssignment(json_response);

        setSelectActions(assignment_id);

        content.elements.push(acc);
		$("#mark_as_submitted").attr("disabled","disabled");
		$("#mark_as_submitted").addClass("disabled-button");
	},"json");
	
	content.attachButtons([
		{	
			label : dlang("button_make_as_submitted","Mark as Submitted"),
			id : "mark_as_submitted",
			callback : function(){
				var grid = schoolmule.instances.grid_assess_assignments.getGrid().grid;
				var _pid = grid.getSelectedRowId().split('_');
				var tree = schoolmule.instances.tree_assignments_by_studygroup.getTree();
				var assid = tree.getSelectedItemId().split('_');
				$("#mark_as_submitted").attr("disabled","disabled");
				var assignment_subm_submitted = $("#assignment_subm_submitted span");
				if(grid.getUserData(grid.getSelectedRowId(),'submitted')=="1"){

					$.post("connectors/connector.php?control_id=grid_assess_assignments", {action:"makeasnotsubmitted", assid:assid[1], pid:_pid[1]}, function(){
						grid.setUserData(grid.getSelectedRowId(),'submitted','0');
						grid.updateFromXML("connectors/connector.php?control_id=grid_assess_assignments&id="+assid[1]);
						$("#mark_as_submitted").removeAttr("disabled");
						$("#mark_as_submitted").text(dlang("button_make_as_submitted","Mark as Submitted"));
                        assignmentHeaderUpdate()
					});
				}else{

					$.post("connectors/connector.php?control_id=grid_assess_assignments", {action:"makeassubmitted", assid:assid[1], pid:_pid[1]}, function(){
						grid.setUserData(grid.getSelectedRowId(),'submitted','1');
						grid.updateFromXML("connectors/connector.php?control_id=grid_assess_assignments&id="+assid[1]);
						$("#mark_as_submitted").removeAttr("disabled");
						$("#mark_as_submitted").text(dlang("button_make_as_not_submitted","Mark as not Submitted"));
                        assignmentHeaderUpdate();
					});
				}
			}
		},

		{	
			label : dlang("download_all_button","Download all submissions"),
			id : "download_all",
			callback : function(){
                location.href = 'libs/forum_content.php?action=getzip&assign='+assignment_id;
			}
		}

    ]);
	
	$("#mark_as_submitted").attr("disabled","disabled");
	$("#mark_as_submitted").addClass("disabled-button");
	
	content.setTitle("main-content",dlang("assess_assignemnt_title","Assess assignment"));
}
function  setGradeSelectActions(){
    var item = schoolmule.instances.tree_assessments_by_studygroup.getTree().getSelectedItemId().split('_');
    var values = {
        "A":1,
        "B":2,
        "C":3,
        "D":4,
        "E":5,
        "F":6,
        "Fx":7,
        "":"NULL"
    };

    $("#prognose").change(function () {
        $.post("connectors/connector.php?control_id=grid_development", {action:'editprognose', stg: item[2], pupil:item[1], val:values[$(this).val()]}, function(response){
        });
    });
    $("#grade").change(function () {
        $.post("connectors/connector.php?control_id=grid_development", {action:'editgrade', stg: item[2], pupil:item[1], val:values[$(this).val()]}, function(response){
        });
    });
    $("#goal").change(function () {
        $.post("connectors/connector.php?control_id=grid_development", {action:'editgoal', stg: item[2], pupil:item[1], val:values[$(this).val()]}, function(response){
        });
    });
}

function getDayInWeek (week,day,year) {
    var w=week||1,n=day||1,y=year||new Date().getFullYear(); //defaults
    var d=new Date(y,0,7*w);
    d.setDate(d.getDate()-(d.getDay()||7)+n);
    return d
}

function getDateOfWeek(w, y) {
    var d = (1 + (w - 1) * 7); // 1st of January + 7 days for each week
    return new Date(y, 0, d);
}

function setSelectActions(assignment_id,type){
	var script = "connectors/connector.php?control_id=tree_assignments_by_studygroup";
    $("#assignment_activation").val("none");
    $("#assignment_publication").val("none");

    $("#assignment_publication").change(function () {
        setPublicationLabel($(this).val());
        $("#assignment_publication").val("none");
    });

	$("#assignment_activation").change(function () {
        var prev_value = $("#selectprognose").text();
		$("#assignment_activation option:selected").each(function () {
			var now = (new Date()).getTime();
			var sel = this;
			switch($(this).val()){
				case "Always":
					$.post(script, {action:"setactivation",id:assignment_id,activation:$(this).val(), item:(type?type:'assignment'), date:act_date});
                    setActivationLabel("Always");
                    $("#assignment_activation").val("none");
				break;
				case "At week nr.":
                        seprompt(dlang("activate_assign_alert_text_4","Assignmnet will be activated at Monday 8 AM at week nr:"),'',function(number){
                        var prev = $("#selectprognose").text();
                        if(!number){
                            $("#assignment_activation").val("Always");
                            $("#selectprognose").text(prev);
                        }else{
                            var curdate = new Date();

                            if(number>52){
                                number = 1;
                            }

                            var res = getDateOfWeek(number,curdate.getFullYear());

                            if(res.getTime() <= curdate.getTime() ){
                                res = getDateOfWeek(number,parseInt(curdate.getFullYear())+1);
                            }
/*                            var curdate = new Date();
                            curdate.setMonth(0);
                            curdate.setHours(0);
                            curdate.setSeconds(0);
                            var year = curdate.getYear();

                            var acttime = curdate.getTime() + (number-1) * 604800000;

                            var res = new Date();
                            var curtime = res.getTime();

                            res.setTime(acttime);*/
                            var act_date = res.format("yyyy-mm-dd");
                            act_date+=" 08:00:00"

                            var NowDate = new Date(act_date);
                            var CurrentDay = NowDate.getDay();
                            var LeftOffset = CurrentDay - 1;
                            var First = new Date(NowDate.getFullYear(), NowDate.getMonth(), NowDate.getDate() - LeftOffset);
                            act_date = First.format("yyyy-mm-dd");
                            act_date+=" 08:00:00";

                            $.post(script, {action:"setactivation",id:assignment_id,activation:"At week nr.", date:act_date, item:(type?type:'assignment')});
                            $("#selectprognose").text((new Date(act_date)).format());
                            $("#assignment_activation").val("none");
                        }
                    });
				break;
				case "A date and time":
					var time = new Date().getTime();
					var id = 'window-dialog'+time;
					var title = "Date Select";
					var html = '<div style="overflow: hidden" id="'+id+'"><div id="'+id+'_calendar"></div><div class="clock_title">'+dlang("details_assess_submiss_header_date_select_text","To set time during the day, click hours or minutes")+'</div></div>';
					var prev = $("#selectprognose").text();
					$('body').append(html);
					
					win_dialog = $('#'+id);
		   			myCalendar = new dhtmlXCalendarObject(id+'_calendar');
		   			myCalendar.setSkin('omega');
                    if(prev_value!=dlang("details_assess_submiss_header_always_select","Always") && dlang("details_assess_submiss_header_not_set_select","Not set"))
                        myCalendar.setDate(new Date(prev_value));

                    myCalendar.showWeekNumbers();
                    if(gl_user_lang!='en' && dhtmlXCalendarObject.prototype.langData[gl_user_lang]){
                        myCalendar.loadUserLanguage(gl_user_lang);
                    }

					win_dialog.dialog({
						title: dlang("details_assess_submiss_header_date_select","Date Select"),
						autoOpen: true,
						modal: true,
						width: 188,
						height: 305,
						resizable: false,
                        buttons: [
                            {
                                text:dlang("details_assess_submiss_header_popup_ok","Ok"),
                                click:function(){
                                    var currentDate = myCalendar.getDate();
                                    var act_date = currentDate.format("yyyy-mm-dd HH:MM");
                                    $( this ).dialog("close");
                                    $.post(script, {action:"setactivation",id:assignment_id,activation:"A date and time", date:act_date+':00', item:(type?type:'assignment')});
                                    act_date = currentDate.format();
                                    $("#selectprognose").text(act_date);
                                    $("#assignment_activation").val("none");
                                }
                            },
                            {
                                text:dlang("details_assess_submiss_header_popup_close","Close"),
                                click:function(){
                                    $( this ).dialog("close");
                                }
                            }
                        ],
						beforeClose: function( event, ui ){
							$("#assignment_activation").val("Always");
							$("#selectprognose").text(prev);
							win_dialog.remove();
						}
					});
					win_dialog.dialog('open');
					myCalendar.show();
				break;
				case "Now":
					var date = new Date();
					var act_date = date.format("yyyy-mm-dd HH:MM");
					$.post(script, {action:"setactivation",id:assignment_id,activation:"Now", date:act_date, item:(type?type:'assignment')});
					$("#selectprognose").text((new Date(act_date)).format());
                    $("#assignment_activation").val("none");
				break;

				case "Not set":
                    $.post(script, {action:"setactivation",id:assignment_id,activation:"Not set", date:'NULL', item:(type?type:'assignment')});
                    $("#assignment_activation").val("none");
                    setActivationLabel("Not set");
				break;
			}
        });
	});

    $("#assignment_deadline").val("none");
	$("#assignment_deadline").change(function () {
        var prev_value = $("#selectgrade").text();
		$("#assignment_deadline option:selected").each(function () {
			var now = (new Date()).getTime();
			var sel = this;
			switch($(this).val()){
				case "No deadline":
					$.post(script, {action:"setdeadline",id:assignment_id,deadline:$(this).val(), date:act_date, item:(type?type:'assignment')});
                    $("#assignment_deadline").val("none");
                    setDeadlineLabel("No deadline");
				break;
				case "After # weeks":
                    seprompt(dlang("details_assess_submiss_header_at_week_nr_prompt","Deadline will be set at # weeks after activation date:"),'',function(number){
                        var prev = $("#selectgrade").text();
                        if(!number){
                            $("#assignment_deadline").val("Always");
                            $("#selectgrade").text(prev);
                        }else{
                            var activation_date = $("#selectprognose").text();
                            var act_obj = Date.parse(activation_date);
                            if(!isNaN(act_obj)){
                                now = act_obj;
                            }
                            var acttime = now+number*604800000;
                            var res = new Date();
                            res.setTime(acttime);

                            act_date = res.format("yyyy-mm-dd HH:MM");
                            $.post(script, {action:"setdeadline",id:assignment_id,deadline:"After # weeks", date:act_date, item:(type?type:'assignment')});
                            $("#selectgrade").text((new Date(act_date)).format());
                            $("#assignment_deadline").val("none");
                        }
                    });
				break;
				case "At date and time":
					var time = new Date().getTime();
					var id = 'window-dialog'+time;
					var title = "Date Select";
					var html = '<div style="overflow: hidden" id="'+id+'"><div id="'+id+'_calendar"></div><div class="clock_title">'+dlang("details_assess_submiss_header_date_select_text","To set time during the day, click hours or minutes")+'</div></div>';
					$('body').append(html);
					var prev = $("#selectgrade").text();
					win_dialog = $('#'+id);
		   			myCalendar = new dhtmlXCalendarObject(id+'_calendar');
		   			myCalendar.setSkin('omega');
                    myCalendar.showWeekNumbers();
                    if(gl_user_lang!='en' && dhtmlXCalendarObject.prototype.langData[gl_user_lang]){
                        myCalendar.loadUserLanguage(gl_user_lang);
                    }
                    if(prev_value!=dlang("details_assess_submiss_header_nodeadline_select","No deadline") && dlang("details_assess_submiss_header_not_set_select","Not set"))
                        myCalendar.setDate(new Date(prev_value));
					win_dialog.dialog({
						title: dlang("details_assess_submiss_header_date_select","Date Select"),
						autoOpen: true,
						modal: true,
						width: 188,
						height: 305,
						resizable: false,
                        buttons: [
                            {
                                text:dlang("details_assess_subm_head_popup_ok","Ok"),
                                click:function(){
                                    var currentDate = myCalendar.getDate();
                                    var act_date = currentDate.format("yyyy-mm-dd  HH:MM");
                                    $( this ).dialog("close");
                                    $.post(script, {action:"setdeadline",id:assignment_id,deadline:"At date and time", date:act_date+':00', item:(type?type:'assignment')});
                                    act_date = currentDate.format();
                                    $("#selectgrade").text(act_date);
                                    $("#assignment_deadline").val("none");
                                }
                            },
                            {
                                text:dlang("details_assess_subm_head_popup_close","Close"),
                                click:function(){
                                    $( this ).dialog("close");
                                }
                            }
                        ],
						beforeClose: function( event, ui ) {
							$("#assignment_deadline").val("Always");
							$("#selectgrade").text(prev);
							win_dialog.remove();
						}
					});
					win_dialog.dialog('open');
					 myCalendar.show();
				break;
				case "Now":
					var date = new Date();
					var act_date = date.format("yyyy-mm-dd HH:MM");
					$.post(script, {action:"setdeadline",id:assignment_id,deadline:"Now", date:act_date, item:(type?type:'assignment')});
                    $("#assignment_deadline").val("none");
					$("#selectgrade").text(act_date);
				break;
                case "Not set":
                    $("#assignment_deadline").val("none");
                    setDeadlineLabel("Not set");
				    break;
			}
            
        });
	});					
}

function showAssignmentsDetailsPupil(assignment_id,p_stg){
    var script = "connectors/connector.php?control_id=tree_assignments_by_studygroup";
    var tinyContent = null;
    var oldContent = null;

    content = new schoolmule.controls.layout({
        cellsBlock: {
            display_footer_right: true,
            cells_right:[
                {
                    cells:[{
                        new_count : false,
                        id : "main-box-header",
                        title: "",
                        width: '100%',
                        height: '50px',
                        border_bottom: true
                    }]
                },
                {
                    cells:[
                        {
                            new_count : true,
                            id : "assignment_garade",
                            title: "",
                            width: '100%',
                            height: '111px'
                        }
                    ]
                },
                {
                    cells:[
                        {
                            new_count : true,
                            id : "content_assignments",
                            title: dlang("assignemnt_descr_header2","Assignment description"),
                            content: "Present view 2",
                            width: '100%',
                            height: '100%'
                        },
                        {
                            new_count : true,
                            id : "comments_tiny",
                            title: dlang("Submissions"),
                            content: "Present view",
                            width: '270px',
                            height: '100%',
                            border_left: true
                        }
                    ]
                }
            ]
        }
    });
    content.showLoader();
    content.elements.push(acc);
    $("#comments_tiny").append("<div class='submission_box'><div class='no-select-submission'>"+dlang("select_item_box","Select item in grid")+"</div></div>");
    $.post(script, {action:"getassignment",id:assignment_id}, function(json_response){
        content.hideLoader();

        $("#content_assignments").append('<div class="pupil_contant_container">'+json_response.published_content+'</div>');

        schoolmule.instances.html_assignments_pupil.attachTo("main-box-header",false, json_response.info);
        $('#view_submissions').click(function(){
            var tree = schoolmule.instances.tree_assignments_by_studygroup.getTree();
            tree.selectItem("submission_"+assignment_id);
        });

        $('#view_submissions img').attr('src',json_response.info.submission_image);

        setDropdownInfoForPupils(json_response);
        schoolmule.instances.grid_assess_assignments.attachTo("assignment_garade",assignment_id,{actions:{
            "pupil":checkSubmissionButton
        }});

        schoolmule.instances.grid_assess_assignments.getGrid().grid.setEditable(false);
        content.elements.push(schoolmule.instances.grid_assess_assignments);

    },"json");

    content.attachButtons([
        {
            label : dlang("copy_link_button","Copy link"),
            id : "copy_link",
            callback : function(){
                copyExternalLinkAssignment(dlang("details_copy_link","External link to this Assignment is copied to clipboard"));
            }
        }

    ],'buttons-right');

    $("#edit").attr("disabled","disabled");
    $("#save").attr("disabled","disabled");
    $("#edit").addClass("disabled-button");
    $("#save").addClass("disabled-button");

    content.setTitle("main-content",dlang("details_assignemnt_assign_details","Assignment details"));
}

function checkPerformancePublication(json_response){
    var actd = json_response.info.activation_date, acrivation_date = null, curdate = new Date();;

    if(actd){
        actd = actd.split(' ');
        var actd_date = actd[0].split('-');
        var actd_time = actd[1].split(':');
        acrivation_date = new Date(actd_date[0],parseInt(actd_date[1])-1,parseInt(actd_date[2]),parseInt(actd_time[0]),parseInt(actd_time[1]),0);
    }

    if(curdate.valueOf() < acrivation_date.valueOf()){
        var text = dlang("performance_not_publ_label0","Performance is not published");
        $("#overview-body").empty();
        if(json_response.info.activation_date!='0000-00-00 00:00:00'){
            text = dlang("performance_not_publ_label","This Performance is not published yet. Publication date and time: ")+acrivation_date.format('mmmm, yyyy, dd, hh TT')
        }
        $("#overview-body").append("<div class='no-select-tree-item-message'><div>"+text+"</div><div>");
        $("#overview-body").css('background-color','rgb(145, 144, 144)');
        return false;
    }
}

function setDropdownInfoForPupils(json_response){
    var actd = json_response.info.activation_date;
    var deadd = json_response.info.deadline_date;
    var acrivation_date = null;
    var deadline_date = null;
    if(actd){
        actd = actd.split(' ');
        var actd_date = actd[0].split('-');
        var actd_time = actd[1].split(':');
        var acrivation_date = new Date(actd_date[0],parseInt(actd_date[1])-1,parseInt(actd_date[2]),parseInt(actd_time[0]),parseInt(actd_time[1]),0);
    }
    if(deadd){
        deadd = deadd.split(' ');
        var deadd_date = deadd[0].split('-');
        var deadd_time = deadd[1].split(':');
        var deadline_date = new Date(deadd_date[0],parseInt(deadd_date[1])-1,parseInt(deadd_date[2]),parseInt(deadd_time[0]),parseInt(deadd_time[1]),0);
    }

    var curdate = new Date();

    switch(json_response.info.assignment_publication){
        case "Untill deadline":
            if(curdate.valueOf() > deadline_date.valueOf()){
                var text = dlang("assignment_is_not published_text","Assignment is not published");
                $("#overview-body").empty();
                $("#overview-body").append("<div class='no-select-tree-item-message'><div>"+text+"</div><div>");
                $("#overview-body").css('background-color','rgb(145, 144, 144)');
                return false;
            }
            break;
        case "Forward from activation":
            if(curdate.valueOf() < acrivation_date.valueOf()){
                var text = "Assignment is not published";
                $("#overview-body").empty();
                if(json_response.info.activation_date!='0000-00-00 00:00:00'){
                    text = dlang("not_published_box_text_pupil","This Assignment is not published yet. Publication date and time: ")+acrivation_date.format('mmmm, yyyy,dd, hh TT')
                }
                $("#overview-body").append("<div class='no-select-tree-item-message'><div>"+text+"</div><div>");
                $("#overview-body").css('background-color','rgb(145, 144, 144)');
                return false;
            }
            break;
        case "Activation to deadline":
            if(curdate.valueOf() < acrivation_date.valueOf() && curdate.valueOf() > deadline_date.valueOf()){
                var text = dlang("not_published_box_text_pupil2","Assignment is not published");
                $("#overview-body").empty();
                if(json_response.info.deadline_date!='0000-00-00 00:00:00' && curdate.valueOf() < deadline_date.valueOf()){
                    text = "This Assignment is not published yet. Publication date and time: "+acrivation_date.format('mmmm, yyyy,dd, hh TT')
                }
                $("#overview-body").append("<div class='no-select-tree-item-message'><div>"+text+"</div><div>");
                $("#overview-body").css('background-color','rgb(145, 144, 144)');
                return false;
            }
            break;
        case "Not set":
            break;
    }

    if(json_response.info.assignment_publication){
        $("#assignment_publication span").text(setPublicationLabel(json_response.info.assignment_publication));
    }

    if(acrivation_date){

        if(json_response.info.activation_date){
            switch(json_response.info.assignment_activation){
                case "At week nr.":
                    var weeks = Math.round((acrivation_date.getTime()-curdate.getTime())/1000/60/60/24/7);
                    $("#selectprognose").text(acrivation_date.format());
                    break;
                case "A date and time":
                    $("#selectprognose").text(acrivation_date.format());
                    break;
                case "Now":
                    $("#selectprognose").text(acrivation_date.format());
                    break;
                case "Always":
                    $("#activation_date span").text(dlang("details_assess_submiss_header_always_select","Always"));
                    break;
                case "Not set":
                    $("#activation_date span").text(dlang("details_assess_submiss_header_not_set_select","Not set"));
                    break;
                default:
                    break
            }
        }
    }else{
        $("#activation_date span").text(dlang("details_assess_submiss_header_always_select","Always"));
    }

    if(deadline_date){
        if(json_response.info.deadline_date){
            switch(json_response.info.assignment_deadline){
                case dlang("details_assess_submiss_header_afterweeks_select","After # weeks"):
                    $("#selectgrade").text(deadline_date.format());
                    break;
                case dlang("details_assess_submiss_header_atdate_select","At date and time"):
                    $("#selectgrade").text(deadline_date.format());
                    break;
                case dlang("details_assess_submiss_header_now_select","Now"):
                    $("#selectgrade").text(deadline_date.format());
                    break;
                case dlang("details_assess_submiss_header_not_set_select","Not set"):
                    $("#deadline_date").text(dlang("details_assess_submiss_header_not_set_select","Not set"));
                    break;
                case  dlang("details_assess_submiss_header_nodeadline_select","No deadline"):
                    $("#deadline_date").text(dlang("details_assess_submiss_header_nodeadline_select","No deadline"));
                    break;

                default:
                    break
            }
        }
    }else{
        $("#deadline_date span").text(dlang("details_assess_submiss_header_nodeadline_select","No deadline"));
    }


    $("#assignment_publication").hide();
    $("#assignment_activation").hide();
    $("#assignment_deadline").hide();

    $("#assignment_publication, #assignment_activation, #assignment_deadline").prev().removeClass("select").parent().css('margin-top','2px');
}

function createEditPublishHeader(container,header,text){
    var item = "<span class='edit_publish_buttons'>"+
            "<span id='edit_button' class='transparent_back'>"+
                '<div class="edit_publish_buttons_block">'+dlang("edit_assignment_tabbar","Edit")+"</div>"+
                "<div class='edit_publish_buttons_ang'></div>"+
                "<div class='edit_publish_buttons_bord'></div></span>"+
            "<span id='published_button' class='transparent_back'>"+
                '<div class="edit_publish_buttons_block">'+dlang("published_assignment_tabbar","Published")+"</div>"+
                "<div class='edit_publish_buttons_ang'></div>"+
                "<div class='edit_publish_buttons_bord'></div></span>"+
        "</span>";
    $('#'+container+' .box-caption').append(item);
    $('#'+container+' .box-caption').append("<span class='tabbar_header'></span>");
    $('#edit_button').click(function(){
        setEditAssignmentMode(header);
    });
    $('#published_button').click(function(){
        setPublishAssignmentMode(header,text);       
    });
}

function createNoteResultHeader(container){
    var item = "<span class='edit_publish_buttons'>"+
        "<span id='result_objectives_button' class='transparent_back'>"+
        '<div class="edit_publish_buttons_block">'+dlang("result_assesments_res_tabbar","Result units and objectives")+"</div>"+
        "<div class='edit_publish_buttons_ang'></div>"+
        "<div class='edit_publish_buttons_bord'></div></span>"+
        "<span id='teacher_notes_button' class='transparent_back'>"+
        '<div class="edit_publish_buttons_block">'+dlang("result_assesments_notes_tabbar","Notes")+"</div>"+
         "<div class='edit_publish_buttons_ang'></div>"+
         "<div class='edit_publish_buttons_bord'></div></span>"+
        "</span>";
    $('#'+container+' .box-caption').append(item);
    $('#'+container+' .box-caption').append("<span class='tabbar_header'></span>");
    $('#teacher_notes_button').click(function(){
      setNotesAssignmentMode(container);
    });
    $('#result_objectives_button').click(function(){
      setResultAssignmentMode(container);
    });
}


function setNotesAssignmentMode(container){
  $('#teacher_notes_button').addClass('active');
  $('#result_objectives_button').removeClass('active');  
  if (container == 'notes_performance_container'){
     $('#'+ container+' #result_unit_area_perf').hide();
  }else{
    $('#'+ container+' #result_unit_area').hide();
  }
  $('#'+ container+' .mce-container').show();
}

function setResultAssignmentMode(container){
    $('#result_objectives_button').addClass('active');
    $('#teacher_notes_button').removeClass('active');
    if (container == 'notes_performance_container'){
     $('#'+ container+' #result_unit_area_perf').show();
  }else{
    $('#'+ container+' #result_unit_area').show();
  }  
    $('#'+ container+' .mce-container').hide();
}
function clickTheCustom(data){
    var container = data.container; 
    var neighbour = data.neighbour; 
    var id = data.id; 
    var isMCE = data.isMCE;
    var ceContainer = $(container);   
    var nghContainer = $(neighbour);   
   // var mceBox = $("#content_assignments .mce-container");
   // var mcePrev = $("#content_assignments #description_for_pupils_field");
        
    var ceControl = $("#"+id+".custom_editor_control");
    var ceFlag = $("#"+id+" .custom_editor_flag");
    var ceUrl = $("#"+id+" .custom_editor_url");
    var ceFrame = $("#"+id+"_frame");
    var ceReload = $("#"+id+" .custom_editor_reload_btn");
    var boxHeight = ceContainer.outerHeight();
    var boxTopInput = ceControl.outerHeight();
        
        var ceContainer = $(container);   
        var nghContainer = $(neighbour);
        //var mceBox = $("#"+id+" .mce-container");
        //var mcePrev = $("#"+id+" #description_for_pupils_field");
        if(ceFlag.is(':checked')){
        ceFrame.attr('src',ceUrl.val());
        ceFrame.height(boxHeight - boxTopInput - 8); // -3 for fix css
        ceFrame.show();
        ceContainer.addClass("overflow-hidden-imp");
        nghContainer.hide();
        //mceBox.addClass("display_none");
        //mcePrev.addClass("display_none");
        
        $('#'+id).css({
                'width':'100%'
            });
        }else{
            ceFrame.hide();
            if (isMCE){
                ceContainer.css("overflow", "hidden");
            }else{
                ceContainer.css("overflow", "auto");
            }
      
            $('#content_assignments_field ').css({
                'margin':'10px',
                'width':'100%',
                'display':'block',
                'height':(boxHeight - boxTopInput)+''
            });
            $('#content_assignments_field').parent().css({
                'overflow':'hidden'
            });
            
            
            setEditbold();
            if(window.tinyContent){
     //           window.tinyContent.show();
            }else{
     //           window.tinyDescription.show();
            }
            nghContainer.show();
            $('#'+id).css({
                'width':'100%'
            });
            console.log('Heighbour ', neighbour, nghContainer)
            //mceBox.removeClass("display_none");
            //mcePrev.removeClass("display_none");
        }    
    //---end of custom editor
}
function setPublishAssignmentMode(container,notice){
    var style;
    var editionArea = $('#'+container), height;
    if(tinyContent){
        window.assignment_content = tinyContent.getContent();
    }
    $('#published_button').addClass('active');
    $('#edit_button').removeClass('active');
    $('#save_publish').hide();
    $('#revert').hide();
    $('#copy_link').hide();

    //$(".custom_editor_flag").prop('checked', false);
    $(".custom_editor_frame").hide();
    
    if (container == "description_for_pupils_field"){
        $('#perfomance_custom_editor_for_published_tab').show();
        $('#perfomance_custom_editor_for_edit_tab_frame').hide();
        $('#perfomance_custom_editor_for_edit_tab').hide();
    }else{
        if(container == "page_content_field"){
            $('#page_content_custom_editor_for_published_tab').show();
            $('#page_content_custom_editor_for_edit_tab_frame').hide();
            $('#page_content_custom_editor_for_edit_tab').hide();
        }else{
            $('#assignments_custom_editor_for_published_tab').show();
            $('#assignments_custom_editor_for_edit_tab_frame').hide();
            $('#assignments_custom_editor_for_edit_tab').hide();
        }
    }
    if(window.tinyContent){
        window.tinyContent.hide();
        if(editionArea.outerHeight() > editionArea.parent().outerHeight()){
            height  = "100%";
        }else{
            height = "auto";
        }
    }

	$('#'+container).css({
		'padding':'8px',
		'width':'100%',
		'display':'inline-block',
		'height': height,
		'box-sizing': 'border-box',
		'margin': '0'
	});
	$('#'+container).parent().css({
	    'overflow':'hidden'
	});

    $('#'+container).html(window.published_assignment_content);

    setEditbold();
    if($('#'+notice +' .helper_tiny_message').size()==0 && !window.published_assignment_content){
        if(!$("#perfomance_custom_editor_for_published_tab").is(":visible")) {
            if($("#"+notice).find(".custom_editor_control").length > 0){
                style = "top: 25px !important;"
            }else{
                style = "";
            }
            $('#' + notice).append('<span class="helper_tiny_message" style="'+style+'">' + dlang("help_tiny_mce_message", "To edit content click 'Edit' tab in description header") + '</span>');
        }
    }
    if (container == "description_for_pupils_field"){
        var data = {
            container:"#description_for_pupils.internal_container",
            neighbour: "#description_for_pupils #description_for_pupils_field", 
            id: 'perfomance_custom_editor_for_published_tab'
        }
    }else{
        if(container == "page_content_field"){
           var data = {
            container: "#page_content.internal_container", 
            neighbour: "#page_content #page_content_field",
            id: 'page_content_custom_editor_for_published_tab'
        }
        }else{
            var data = {
            container: "#content_assignments.internal_container",
            neighbour: "#content_assignments #content_assignments_field", 
            id: 'assignments_custom_editor_for_published_tab'
        }
        }
    }
    clickTheCustom(data);
}

function setEditAssignmentMode(container){
    $('#'+container).parent().find(".helper_tiny_message").remove();

    $('#edit_button').addClass('active');
    $('#published_button').removeClass('active');
    $('#save_publish').show();
    $('#revert').show();
    $('#copy_link').show();
    $('#'+container).html(window.assignment_content);
    console.log('casaasdsadsa',container )
    if (container == "description_for_pupils_field"){
        $('#perfomance_custom_editor_for_edit_tab').show();
        $('#perfomance_custom_editor_for_published_tab_frame').hide();
        $('#perfomance_custom_editor_for_published_tab').hide();
    }else{
        if(container == "page_content_field"){
            $('#page_content_custom_editor_for_edit_tab').show();
            $('#page_content_custom_editor_for_published_tab_frame').hide();
            $('#page_content_custom_editor_for_published_tab').hide();
        }else{
            $('#assignments_custom_editor_for_edit_tab').show();
            $('#assignments_custom_editor_for_published_tab_frame').hide();
            $('#assignments_custom_editor_for_published_tab').hide();
        }
        
    }
 
   //$(".custom_editor_flag").prop('checked', false);
    $(".custom_editor_frame").hide();
    

    $('#'+container).css({
        'margin':'0px',
        'width':'100%',
        'display':'block',
        'height':'100%'
    });

    $('#'+container).parent().css({
        'overflow':'hidden'
    });

    setEditbold();
    if(window.tinyContent){
        window.tinyContent.show();
    }else{
        window.tinyDescription.show();
    }
    
    
    if (container == "description_for_pupils_field"){
        var data = {
            container: "#description_for_pupils.internal_container",
            neighbour: "#description_for_pupils .mce-container",
            id: 'perfomance_custom_editor_for_edit_tab'
        }
    }else{
        if(container == "page_content_field"){
           var data = {
            container: "#page_content.internal_container", 
            neighbour: 'page_content_custom_editor_for_edit_tab',
            id: 'page_content_custom_editor_for_edit_tab'
        }        
        
        }else{
            var data = {
            container: "#content_assignments.internal_container",
            neighbour: "#content_assignments .mce-container",
            id: 'assignments_custom_editor_for_edit_tab'        
        }
        }
    }
    
    data.isMCE = true;
    clickTheCustom(data);
}

function setEditbold(){
    if(window.published_assignment_content != window.assignment_content){
        $('#edit_button').addClass('bold_tabbar_text');
    }else{
        $('#edit_button').removeClass('bold_tabbar_text');
    }
}


function createEditPublishHeaderObjective(container,header,text){     
    var item = "<span class='edit_publish_buttons'>"+
            "<span id='edit_button_o' class='transparent_back'>"+
                '<div class="edit_publish_buttons_block">'+dlang("edit_assignment_tabbar","Edit")+"</div>"+
                "<div class='edit_publish_buttons_ang'></div>"+
                "<div class='edit_publish_buttons_bord'></div></span>"+
            "<span id='published_button_o' class='transparent_back'>"+
                '<div class="edit_publish_buttons_block">'+dlang("published_assignment_tabbar","Published")+"</div>"+
                "<div class='edit_publish_buttons_ang'></div>"+
                "<div class='edit_publish_buttons_bord'></div></span>"+
        "</span>";
    $('#'+container+' .box-caption').append(item);
    $('#'+container+' .box-caption').append("<span class='tabbar_header'></span>");
    $('#edit_button_o').click(function(){setEditObjectiveMode(header)});
    $('#published_button_o').click(function(){setPublishObjectiveMode(header,text)});
}

function setPublishObjectiveMode(container,notice){
    var style;
    if(tinyGrading){
        window.grading_content = tinyGrading.getContent();
    }
    $('#published_button_o').addClass('active');
    $('#edit_button_o').removeClass('active');
    $('#save_publish').hide();
    $('#revert').hide();
    $('#copy_link').hide();    

    if(window.tinyGrading){
        window.tinyGrading.hide();



        //$('#'+container).parent().css({
        //    'overflow':'auto'
        //});
    }

	$('#'+container).css({
		'padding':'8px',
		'width':'100%',
		'display':'inline-block',
		'height':'100%',
		'box-sizing': 'border-box',
		'margin': '0'
	});

	$('#'+container).parent().css({
	    'overflow':'hidden'
	});

    $('#'+container).html(window.published_grading_content);

    setEditboldObjective();
    if($('#'+notice +' .helper_tiny_message').size()==0 && !window.published_grading_content){
        if(!$("#perfomance_custom_editor_for_published_tab").is(":visible")) {
            if($("#"+notice).find(".custom_editor_control").length > 0){
                style = "top: 25px !important;"
            }else{
                style = "";
            }
            $('#' + notice).append('<span class="helper_tiny_message" style="'+style+'">' + dlang("help_tiny_mce_message", "To edit content click 'Edit' tab in description header") + '</span>');
        }
    }
}

function setEditObjectiveMode(container){

    $('#'+container).parent().find(".helper_tiny_message").remove();

    $('#edit_button_o').addClass('active');
    $('#published_button_o').removeClass('active');
    $('#save_publish').show();
    $('#revert').show();
    $('#copy_link').show();   

    $('#'+container).html(window.grading_content);

    $('#'+container).css({
        'margin':'0px',
        'width':'100%',
        'display':'block',
        'height':'100%'
    });

    $('#'+container).parent().css({
        'overflow':'hidden'
    });

    setEditboldObjective();
    if(window.tinyGrading){
        window.tinyGrading.show();
    }

}

function setEditboldObjective(){

    if(window.grading_content != window.published_grading_content){

        $('#edit_button_o').addClass('bold_tabbar_text');
    }else{
        $('#edit_button_o').removeClass('bold_tabbar_text');
    }
}

function showAssignmentsDetailsStaff(assignment_id,p_stg){
    var script = "connectors/connector.php?control_id=tree_assignments_by_studygroup";
    window.assignment_content = "";
    window.published_assignment_content = "";

    content = new schoolmule.controls.layout({
        cellsBlock: {
            display_footer_right: true,
            cells_right:[
                {
                    cells:[{
                        new_count : false,
                        id : "main-box-header",
                        title: "",
                        width: '100%',
                        height: '65px',
                        border_bottom: true
                    }]
                },
                
                {
                    cells:[
                        {
                            new_count : true,
                            id : "content_assignments",
                            title: dlang("details_assignemnt_assign_descr","Assignment description for pupils"),
                            content: "Present view 2",
                            width: '100%',
                            height: '100%',
                            border_right: true
                        },
                        {
                            new_count : true,
                            id : "notes_assignments",
                            title: ' ',
                            content: "Present view",
                            width: '270px',
                            height: '100%'
                        }
                    ]
                }
            ]
        }
    });

    window.tinyContent = null;
    window.tinyNotes = null;
    window.oldContent = null;
    window.oldNotes = null;
    content.showLoader();
    content.elements.push(acc);
    content_assignments
    
    createEditPublishHeader('content_assignments_container','content_assignments_field','content_assignments');
    createNoteResultHeader ('notes_assignments_container');   
    //custom editor
    
    addCustomEditor(
            "#content_assignments.internal_container", 
            'assignments_custom_editor_for_edit_tab_',
            "#content_assignments .mce-container",
            true, 
            dlang("activate_custom_editor","Activate custom editor"),
            true,
            assignment_id
    );
    addCustomEditor(
            "#content_assignments.internal_container", 
            'assignments_custom_editor_for_published_tab', 
            "#content_assignments #content_assignments_field", 
            false, 
            dlang("activate_custom_published","Activate custom published"),
            false,
            assignment_id
    );
    //---end of custom editor
    $("#notes_assignments").append('<div id="result_unit_area"></div>');
    
    //schoolmule.instances.tree_result_units.attachTo("result_unit_area");  
    $.post(script, {action:"getassignment",id:assignment_id}, function(json_response){
        content.hideLoader();
        window.assignment_content = json_response.content;
        window.published_assignment_content = !json_response.published_content?'':json_response.published_content;

        setPublishAssignmentMode('content_assignments_field','content_assignments');

        tinyContent = new schoolmule.controls.editor(["content"],{
            container : "content_assignments",
            type: "assignment",
            active_item:"assignment",
            hide:true,
            active_area: "content_assignments_content",
            content:window.published_assignment_content
        });

        tinyNotes = new schoolmule.controls.editor(["notes"],{
            container : "notes_assignments",
            type: "assignment_small",
            hide:true,
            active_area: "notes_assignments_content",
            content:json_response.notes
        });



        oldContent = json_response.content;
        oldNotes = json_response.notes;

        schoolmule.instances.html_assignments.attachTo("main-box-header",false, json_response.info);
        
        $('#view_submissions').click(function(){
            var tree = schoolmule.instances.tree_assignments_by_studygroup.getTree();
            var id = "submission_"+assignment_id;
            if(tree.getSelectedItemId()==""){
                tree = schoolmule.instances.tree_assignments_by_status.getTree();
                id = "submission_"+assignment_id+"_"+p_stg;
            }
            tree.selectItem(id,true);

        });
        $('#view_submissions img').attr('src',json_response.info.submission_image);

        $("#assignment_publication").change(function () {
            $("#assignment_publication option:selected").each(function () {
                $.post(script, {action:"setpubliation",id:assignment_id,publication:$(this).val()});
            });
        });

        setHeaderSelectItemsForAssignment(json_response);
        
        setSelectActions(assignment_id);

        schoolmule.instances.grid_assignments.attachTo("result_unit_area",assignment_id);
        content.elements.push(schoolmule.instances.grid_assignments);
        content.elements.push(tinyNotes);
        content.elements.push(tinyContent);
        tabbar.checkTinyContent = {'content':[tinyContent,oldContent],'notes':[tinyNotes,oldNotes]};
        $('#notes_assignments_container .mce-container').hide();        
        setResultAssignmentMode('notes_assignments_container');      
        setPublishAssignmentMode('content_assignments_field','content_assignments');
    },"json");


    content.attachButtons([
        {
            label : dlang("draft_save_button","Save"),
            id : "save",
            callback : function(){
                content.showLoader();
                tabbar.checkTinyContent = true;
                var assignment_content = tinyContent.getContent();
                var assignment_notes = tinyNotes.getContent();
                $("#save").attr("disabled","disabled");
                $("#save").addClass("disabled-button");
                $.post(script,
                    {
                        action:"putassignment",
                        id:assignment_id,
                        content:assignment_content,
                        notes:assignment_notes
                    },
                    function(){
                        window.save_notification = false;
                        oldContent = assignment_content;
                        oldNotes = assignment_notes;
                        window.assignment_content = assignment_content;
                        content.hideLoader();
                    }
                );
            }
        },
        {
            label : dlang("draft_save_p_button","Save and publish"),
            id : "save_publish",
            callback : function(){
                if(!window.no_publish_confirm){
                    seconfirm(dlang("se_assign_publish_confirm","Do you want publish this content?"),function(){
                        publishAssingmentsContent(script,assignment_id)
                    });
                }else{
                    window.no_publish_confirm = false;
                    publishAssingmentsContent(script,assignment_id)
                }

            }
        },
        {
            label : dlang("draft_revert","Revert to published"),
            id : "revert",
            callback : function(){
                seconfirm(dlang("se_assign_revert_confirm","Do you want revert content to published?"),function(){
                    window.assignment_content = window.published_assignment_content;
                    $("#save_publish").attr("disabled","disabled");
                    $("#save_publish").addClass("disabled-button");
                    $("#revert").attr("disabled","disabled");
                    $("#revert").addClass("disabled-button");

                    $("#save").removeAttr("disabled");
                    $("#save").removeClass("disabled-button");

                    setEditAssignmentMode('content_assignments_field');
                });
            }
        }
    ]);

    content.attachButtons([
        {
            label : dlang("cerate_link_button","Create link"),
            id : "copy_link",
            callback : function(){
                copyExternalLinkAssignment(dlang("details_copy_link","External link to this Assignment is copied to clipboard"));
            }
        }

    ],'buttons-right');
    content.elements.push(acc);
    content.setTitle("main-content",dlang("details_assignemnt_assign_details","Assignment details"));
}


function addCustomEditor(container, id, neighbour, isHidden, label, isMCE, element_id){
    
    //custom editor
    
    var ceContainer = $(container);   
    var nghContainer = $(neighbour);   
   // var mceBox = $("#content_assignments .mce-container");
   // var mcePrev = $("#content_assignments #description_for_pupils_field");
    
    ceContainer.append('<table id="'+id+'"class="custom_editor_control">'
            +'<tr><td class="url_td"><input class="custom_editor_url" type="text">'+
            '<img class="custom_editor_reload_btn" src="/images/reload.png"></td>'+
            '<td class="control_td"><span class="custom_checkbox"></span><input class="custom_editor_flag" type="checkbox">'+
            '<span>'+label+'</span></td></tr></table>');
    ceContainer.append('<iframe id="'+id+'_frame" class="custom_editor_frame" hidden></iframe>');
    if (isHidden){
        $('#'+id).hide();
        $('#'+id+'_frame').hide();
    }
    var ceControl = $("#"+id+".custom_editor_control");
    var ceFlag = $("#"+id+" .custom_editor_flag");
    var ceUrl = $("#"+id+" .custom_editor_url");
    var ceFrame = $("#"+id+"_frame");
    var ceReload = $("#"+id+" .custom_editor_reload_btn");
    if (getCookie(id+'_'+element_id+'_checked') || getCookie(id+'_'+element_id+'_checked')===false){
        ceFlag.prop("checked", (getCookie(id+'_'+element_id+'_checked')==='false')?false:true);
        if(getCookie(id+'_'+element_id+'_checked')!=='false'){
            $(".custom_checkbox").css("background","url(../images/icons/chx_check.png)");
        }
    }
    if (getCookie(id+'_'+element_id+'_url')){
        ceUrl.val(getCookie(id+'_'+element_id+'_url'))
    }
    var boxHeight = ceContainer.height();
    var boxTopInput = ceControl.outerHeight();
    ceReload.on('click', function(e){
        ceFrame.attr('src',ceUrl.val());
    });
    ceUrl.keyup(function(event){
    setCookie(id+'_'+element_id+'_url', ceUrl.val());
    if(event.keyCode == 13 && ceFlag.is(':checked')){
        ceFrame.attr('src',ceUrl.val());
    }
});
    ceFlag.on('click', function(e){
        var ceContainer = $(container);   
        var nghContainer = $(neighbour);   
        //var mceBox = $("#"+id+" .mce-container");
        //var mcePrev = $("#"+id+" #description_for_pupils_field");
        setCookie(id+'_'+element_id+'_checked', ceFlag.is(':checked'));
        setCookie(id+'_'+element_id+'_url', ceUrl.val());
        if(ceFlag.is(':checked')){
        $(".custom_checkbox").css("background","url(../images/icons/chx_check.png)");
        ceFrame.attr('src',ceUrl.val());
        ceFrame.height(boxHeight - boxTopInput);
        ceFrame.show();
        ceContainer.css("overflow", "hidden");
        nghContainer.hide();
        //mceBox.addClass("display_none");
        //mcePrev.addClass("display_none");
        }else{
            $(".custom_checkbox").css("background","url(../images/icons/chx_uncheck.png)");
            ceFrame.hide();
            if (isMCE){
                ceContainer.css("overflow", "hidden");
            }else{
                ceContainer.css("overflow", "auto");
            }
            
            $('#content_assignments_field ').css({
                'margin':'10px',
                'width':'100%',
                'display':'block',
                'height':(boxHeight - boxTopInput)+''
            });
            $('#content_assignments_field').parent().css({
                'overflow':'hidden'
            });

            setEditbold();
            if(window.tinyContent){
     //           window.tinyContent.show();
            }else{
     //           window.tinyDescription.show();
            }
            nghContainer.show();
            console.log('Heighbour ', neighbour, nghContainer)
            //mceBox.removeClass("display_none");
            //mcePrev.removeClass("display_none");
        }
    });
    //---end of custom editor
}
function publishAssingmentsContent(script,assignment_id){
    content.showLoader();
    tabbar.checkTinyContent = true;
    var assignment_content = tinyContent.getContent();
    var assignment_notes = tinyNotes.getContent();
    $.post(script,
        {
            action:"putassignment",
            publish:"1",
            id:assignment_id,
            content:assignment_content,
            notes:assignment_notes
        },
        function(){
            window.save_notification = false;
            oldContent = assignment_content;
            oldNotes = assignment_notes;
            window.assignment_content = assignment_content;
            window.published_assignment_content = assignment_content;
            content.hideLoader();
            setPublishAssignmentMode('content_assignments_field','content_assignments');

            $("#save_publish").attr("disabled","disabled");
            $("#save_publish").addClass("disabled-button");

            $("#save").attr("disabled","disabled");
            $("#save").addClass("disabled-button");
            $("#revert").attr("disabled","disabled");
            $("#revert").addClass("disabled-button");
        }
    );
}

function setPublicationLabel(label){
    var text = "";
    switch(label){
        case "Always":
            text = dlang("details_assess_submiss_header_always_select","Always");
            $("#selectgoal").text(text);
            break;
        case "Untill deadline":
            text = dlang("details_assess_submiss_header_untill_deadline","Untill deadline");
            $("#selectgoal").text(text);
            break;
        case "Forward from activation":
            text = dlang("details_assess_submiss_header_ffa","Forward from activation");
            $("#selectgoal").text(text);
            break;
        case "Activation to deadline":
            text = dlang("details_assess_submiss_header_act_to_dl","Activation to deadline");
            $("#selectgoal").text(text);
            break;
        case "Not set":
            text = dlang("details_assess_submiss_header_notset","Not set");
            $("#selectgoal").text(text);
            break;
        default:
            break
    }
    return text;
}

function setActivationLabel(label,acrivation_date){
    switch(label){
        case "Not set":
            $("#selectprognose").text(dlang("details_assess_submiss_header_not_set_select","Not set"));
            break;
        case "Always":
            $("#selectprognose").text(dlang("details_assess_submiss_header_always_select","Always"));
            break;
        case "At week nr.":
            $("#selectprognose").text(acrivation_date.format());
            break;
        case "A date and time":
            $("#selectprognose").text(acrivation_date.format());
            break;
        case "Now":
            $("#selectprognose").text(acrivation_date.format());
            break;
        default:
            break
    }
}

function setDeadlineLabel(label,acrivation_date){
    switch(label){
        case "No deadline":
            $("#selectgrade").text(dlang("details_assess_submiss_header_nodeadline_select","No deadline"));
            break;
        case "After # weeks":
        case "At date and time":
        case "Now":
            $("#selectgrade").text(acrivation_date.format());
            break;
        default:
            break
    }
}

function setHeaderSelectItemsForAssignment(json_response){
    var actd = json_response.info.activation_date;
    var deadd = json_response.info.deadline_date;
    var acrivation_date = null;
    var deadline_date = null;
    if(actd){
        actd = actd.split(' ');
        var actd_date = actd[0].split('-');
        var actd_time = actd[1].split(':');
        var acrivation_date = new Date(actd_date[0],parseInt(actd_date[1])-1,parseInt(actd_date[2]),parseInt(actd_time[0]),parseInt(actd_time[1]),0);
    }
    if(deadd){
        deadd = deadd.split(' ');
        var deadd_date = deadd[0].split('-');
        var deadd_time = deadd[1].split(':');
        var deadline_date = new Date(deadd_date[0],parseInt(deadd_date[1])-1,parseInt(deadd_date[2]),parseInt(deadd_time[0]),parseInt(deadd_time[1]),0);
    }

    if(json_response.info.assignment_publication){
        setPublicationLabel(json_response.info.assignment_publication);
    }

    if(acrivation_date){
        if(json_response.info.activation_date){
            setActivationLabel(json_response.info.assignment_activation,acrivation_date);
        }
    }else{
        setActivationLabel("Not set");
    }

    if(deadline_date){
        if(json_response.info.deadline_date){
            setDeadlineLabel(json_response.info.assignment_deadline,deadline_date);
        }
    }else{
        setDeadlineLabel("No deadline");
    }
}

function showPageDetails(page_id){
    $('.no-select-tree-item-message').hide();
    if(content){
        content.destroy();
        content = null;
    }

    switch(schoolmule.main.user_role){
        case "superadmin":
            showPageDetailsStaff(page_id)
            break;
        case "staff":
            showPageDetailsStaff(page_id)
            break;
        case "pupil":
            showPageDetailsPupil(page_id)
            break;
        case "parent":
            showPageDetailsPupil(page_id)
            break;
    }
}

function showPageDetailsPupil(page_id){
    var script = "connectors/connector.php?control_id=tree_assignments_by_studygroup";
    content = new schoolmule.controls.layout({
        cellsBlock: {
            display_footer_right: true,
            cells_right:[
                {
                    cells:[{
                        new_count : false,
                        id : "main-box-header",
                        title: "",
                        width: '100%',
                        height: '53px',
                        border_bottom: true
                    }]
                },
                {
                    cells:[
                        {
                            new_count : true,
                            id : "page_content",
                            title: dlang("details_page_descr2","Page description"),
                            width: '100%',
                            height: '100%',
                            border_right: true
                        }
                    ]
                }
            ]
        }
    });

    content.showLoader();
    content.elements.push(acc);

    $.post(script, {action:"getpage",id:page_id}, function(json_response){
        content.hideLoader();
        schoolmule.instances.html_page.attachTo("main-box-header",false, json_response.info);
        $('#page_content').html('<div class="pupil_contant_container">'+json_response.published_content+'</div>');
    },"json");

    content.elements.push(acc);

    content.attachButtons([
        {
            label : dlang("copy_link_button","Copy link"),
            id : "copy_link",
            callback : function(){
                copyExternalLinkAssignment(dlang("details_copy_link_page","External link to this Page is copied to clipboard"));
            }
        }

    ],'buttons-right');

    content.setTitle("main-content",dlang("details_assignemnt_page_details","Page details"));
}

function showPageDetailsStaff(page_id){
    var script = "connectors/connector.php?control_id=tree_assignments_by_studygroup";

    window.assignment_content = "";
    window.published_assignment_content = "";

    content = new schoolmule.controls.layout({
        cellsBlock: {
            display_footer_right: true,
            cells_right:[
                {
                    cells:[{
                        new_count : false,
                        id : "main-box-header",
                        title: "",
                        width: '100%',
                        height: '53px',
                        border_bottom: true
                    }]
                },
                {
                    cells:[
                        {
                            new_count : true,
                            id : "page_content",
                            title: dlang("details_page_descr","Page description for pupils"),
                            width: '100%',
                            height: '100%',
                            border_right: true
                        },
                        {
                            new_count : true,
                            id : "page_content_notes",
                            title: dlang("details_page_teacher_private_notes","Teachers private notes"),
                            width: '270px',
                            height: '100%'
                        }
                    ]
                }
            ]
        }
    });

    window.tinyContent = null;
    window.tinyNotes = null;
    window.oldContent = null;
    window.oldNotes = null;

    content.showLoader();
    content.elements.push(acc);

    createEditPublishHeader('page_content_container','page_content_field','page_content');

    addCustomEditor(
            "#page_content.internal_container", 
            'page_content_custom_editor_for_edit_tab',
            "#page_content .mce-container",
            true, 
            dlang("activate_custom_editor","Activate custom editor"),
            true,
            page_id
    );
    addCustomEditor(
            "#page_content.internal_container", 
            'page_content_custom_editor_for_published_tab', 
            "#page_content #page_content_field", 
            false, 
            dlang("activate_custom_published","Activate custom published"),
            false,
            page_id
    );
    $.post(script, {action:"getpage",id:page_id}, function(json_response){
        content.hideLoader();

        window.assignment_content = json_response.content;
        window.published_assignment_content = !json_response.published_content?'':json_response.published_content;
        setPublishAssignmentMode('page_content_field','page_content');
        tinyContent = new schoolmule.controls.editor(["content"],{
            container : "page_content",
            type: "assignment",
            active_item:"assignment",
            hide:true,
            active_area: "page_content_content",
            content:window.published_assignment_content
        });

        tinyNotes = new schoolmule.controls.editor(["notes"],{
            container : "page_content_notes",
            type: "assignment_small",
            active_area: "page_content_notes_content",
            content:json_response.notes
        });
        oldContent = json_response.content;
        oldNotes = json_response.notes;

        var tree = schoolmule.instances.tree_assignments_by_studygroup.getTree();
        schoolmule.instances.html_page.attachTo("main-box-header",false, json_response.info);

        content.elements.push(tinyNotes);
        content.elements.push(tinyContent);

        tabbar.checkTinyContent = {'content':[tinyContent,oldContent],'notes':[tinyNotes,oldNotes]};

    },"json");


    content.attachButtons([
        {
            label : dlang("draft_save_button","Save"),
            id : "save",
            callback : function(){
                content.showLoader();
                tabbar.checkTinyContent = true;
                var page_content = tinyContent.getContent();
                var page_notes = tinyNotes.getContent();
                $("#save").attr("disabled","disabled");
                $("#save").addClass("disabled-button");
                $.post(script,
                    {
                        action:"putpage",
                        id:page_id,
                        content:page_content,
                        notes:page_notes
                    },
                    function(){
                        window.save_notification = false;
                        oldContent = page_content;
                        oldNotes = page_notes;
                        window.assignment_content = assignment_content;
                        content.hideLoader();
                    }
                );
            }
        },
        {
            label : dlang("draft_save_p_button","Save and publish"),
            id : "save_publish",
            callback : function(){
                if(!window.no_publish_confirm){
                    seconfirm(dlang("se_assign_publish_confirm","Do you want publish this content?"),function(){
                        publishPageContent(script,page_id)
                    });
                }else{
                    window.no_publish_confirm = false;
                    publishPageContent(script,page_id)
                }
            }
        },
        {
            label : dlang("draft_revert","Revert to published"),
            id : "revert",
            callback : function(){
                seconfirm(dlang("se_assign_revert_confirm","Do you want revert content to published?"),function(){
                    window.assignment_content = window.published_assignment_content;
                    $("#save_publish").attr("disabled","disabled");
                    $("#save_publish").addClass("disabled-button");
                    $("#revert").attr("disabled","disabled");
                    $("#revert").addClass("disabled-button");

                    $("#save").removeAttr("disabled");
                    $("#save").removeClass("disabled-button");

                    setEditAssignmentMode('page_content_field');
                });
            }
        }
    ]);


    content.elements.push(acc);

    content.attachButtons([
        {
            label : dlang("cerate_link_button","Create link"),
            id : "copy_link",
            callback : function(){
                copyExternalLinkAssignment(dlang("details_copy_link_page","External link to this Page is copied to clipboard"));
            }
        }

    ],'buttons-right');

    $("#save").attr("disabled","disabled");
    $("#edit").addClass("disabled-button");
    $("#save").addClass("disabled-button");

    content.setTitle("main-content",dlang("details_assignemnt_page_details","Page details"));
}

function publishPageContent(script,page_id){
    content.showLoader();
    tabbar.checkTinyContent = true;
    var page_content = tinyContent.getContent();
    var page_notes = tinyNotes.getContent();
    $.post(script,
        {
            publish:"1",
            action:"putpage",
            id:page_id,
            content:page_content,
            notes:page_notes
        },
        function(){
            window.save_notification = false;
            oldContent = page_content;
            oldNotes = page_notes;
            window.assignment_content = page_content;
            window.published_assignment_content = page_content;
            content.hideLoader();
            setPublishAssignmentMode('page_content_field','page_content');

            $("#save_publish").attr("disabled","disabled");
            $("#save_publish").addClass("disabled-button");

            $("#save").attr("disabled","disabled");
            $("#save").addClass("disabled-button");

            $("#revert").attr("disabled","disabled");
            $("#revert").addClass("disabled-button");
        }
    );
}

function showAssignmentsDetails(assignment_id,p_stg){
    $('.no-select-tree-item-message').hide();
    if(content){
        content.destroy();
        content = null;
    }

    switch(schoolmule.main.user_role){
        case "superadmin":
            showAssignmentsDetailsStaff(assignment_id,p_stg)
            break;
        case "staff":
            showAssignmentsDetailsStaff(assignment_id,p_stg)
            break;
        case "pupil":
            showAssignmentsDetailsPupil(assignment_id,p_stg)
            break;
        case "parent":
            showAssignmentsDetailsPupil(assignment_id,p_stg)
            break;
    }
}

function showObjectiveDetais(objective_id){
    $('.no-select-tree-item-message').hide();
	var script = "connectors/connector.php?control_id=tree_course_objectives";
	if(content){
		content.destroy();
		content = null;
	}

    window.assignment_content = "";
    window.published_assignment_content = "";

    window.grading_content = "";
    window.published_grading_content = "";
	
	content = new schoolmule.controls.layout({
	cellsBlock: {
				display_footer_right: true,
				cells_right:[
								{
									cells:[{
										new_count : false,
										id : "main-box-header",
										title: "",
										width: '100%',
										height: '50px',
										border_bottom: true
									}]									
								},
								{													
									cells:[
									{
										new_count : true,
										id : "objective_description",
										title: dlang("details_objective_description","Objective description"),
										content: "Present view 2",
										width: '50%',
										height: '100%',
										border_right: true
									},													
									{
										new_count : true,
										id : "grading",
										title: dlang("details_objective_grading","Grading"),
										content: "Present view",
										width: '50%',
										height: '100%'
									}
									]
								}
						     ]
		  }
	});
	
	window.tinyContent = null;
    window.tinyGrading = null;

	var oldDescription = null;
	var oldGrades = null;
	var gradeA="Grade A";
	var gradeB="Grade B";

	content.showLoader();
    content.elements.push(acc);

    if(schoolmule.main.user_role== "staff" || schoolmule.main.user_role== "superadmin"){
        createEditPublishHeader('objective_description_container','objective_description_field','objective_description');
        createEditPublishHeaderObjective('grading_container','grading_field','grading');
    }

	$.post(script, {action:"getobjective",id:objective_id}, function(json_response){
		oldDescription = json_response.description_public;
		oldGrades = json_response.grading_public;
		schoolmule.instances.html_course_objectives.attachTo("main-box-header",false,json_response.info);
		var tree = schoolmule.instances.tree_course_objectives.getTree();
		var stg = tree.getParentId(tree.getSelectedItemId()).split('_');



		$.post("schoolmodule/dhtmlx/myxml/xml.php",{action:"create_xml", pupilId: 1, StudyGroupID: stg[1], name_pupil: "", studygroup_pupil: ""},function(){
		objectives_weight_grid.clearAndLoad("schoolmodule/dhtmlx/myxml/dialog_grid.xml",function(){
			$('#dialog6_co').dialog({
				autoOpen: false,
                title:dlang("change_weight_dialog_system","Change objective weight"),
				modal: true,
				width: 360,
				resizable: false,
                buttons:[
                    {
                        text:dlang("weight_dialog_butt_update","Update"),
                        click:function(){
                            var count = objectives_weight_grid.getRowsNum()-1;
                            objectives_weight_grid.forEachRow(function(id){
                                var cObj = id.split(' ');
                                if(objectives_weight_grid.getRowIndex(id)==count){
                                    if(cObj[1]){
                                        $.post("schoolmodule/ajax/ajax_update.php",{action: "edit_weight", id: cObj[1], newValue: objectives_weight_grid.cells(id,1).getValue()},function(){
                                            tree.smartRefreshBranch(0,script);
                                        });
                                    }
                                }else{
                                    if(cObj[1]){
                                        $.post("schoolmodule/ajax/ajax_update.php",{action: "edit_weight", id: cObj[1], newValue: objectives_weight_grid.cells(id,1).getValue()},function(){
                                        });
                                    }
                                }

                            });
                            $.post("schoolmodule/dhtmlx/myxml/xml.php",{action:"create_xml", pupilId: 1, StudyGroupID: stg[1], name_pupil: "", studygroup_pupil: ""});
                            var tree = schoolmule.instances.tree_course_objectives.getTree();
                            tree.selectItem(tree.getSelectedItemId(), true);
                            $(this).dialog("close");
                        }
                    },
                    {
                        text:dlang("weight_dialog_butt_cancel","Cancel"),
                        click:function(){
                            $(this).dialog("close");
                        }
                    }
                ]
		});


		$("#change_course_objectives_weight").click(function(event){

            if(schoolmule.main.user_role == 'pupil' || schoolmule.main.user_role == 'parent'){
                return false;
            }
            objectives_weight_grid.clearAndLoad("schoolmodule/dhtmlx/myxml/dialog_grid.xml",function(){
                $('#dialog6_co').dialog('open');
                calculateFooterValuesO();
                var ftr = $('.ftr');
                //$('#gridbox_co').empty();
                var totalgrid = ftr.children('table').children('tbody').children('tr').next().children('td').next().text();
                var reg = /\d+/;
                var res = totalgrid.match(reg);
                res = parseInt(res[0]);
                if( res < 100 || res > 100 ){
                    ftr.children('table').children('tbody').children('tr').next().children('td').next().css('color','red');
                    ftr.children('table').children('tbody').children('tr').next().children('td').next().css('color','red');
                    ftr.parent().parent().parent().next().find('button:first').css('color','grey');
                    ftr.parent().parent().parent().next().find('button:first').attr('disabled','disabled');
                }else{
                    ftr.children('table').children('tbody').children('tr').next().children('td').next().css('color','#666666');
                    ftr.parent().parent().parent().next().find('button:first').css('color','#424242');
                    ftr.parent().parent().parent().next().find('button:first').removeAttr('disabled');
                }

                var rowId = objectives_weight_grid.getSelectedRowId();
                var indId = objectives_weight_grid.getSelectedCellIndex()

                objectives_weight_grid.attachEvent("onEditCell", doOnEditCell);
                function doOnEditCell(stage,rowId,cellIndex,newValue,oldValue){

                    if( (stage == 2) && (newValue != oldValue) ){
                        calculateFooterValuesO();
                        reg = /\w+\s/;
                        id = rowId.replace(reg,'');
                        newValue = parseInt( newValue );
                        if( isNaN(newValue) == true )
                            alert(dlang("details_objective_alert_wrong_number","Wrong number!"));
                        //else
                        //	$.post("schoolmodule/ajax/ajax_update.php",{action: "edit_weight", id: id, newValue: newValue});

                        totalgrid =ftr.children('table').children('tbody').children('tr').next().children('td').next().text();
                        reg = /\d+/;
                        res = totalgrid.match(reg);
                        res = parseInt( res[0] );

                        if( res < 100 || res > 100 ){
                            ftr.children('table').children('tbody').children('tr').next().children('td').next().css('color','red');
                            ftr.parent().parent().parent().next().find('button:first').css('color','grey');
                            ftr.parent().parent().parent().next().find('button:first').attr('disable','disable');
                            ftr.parent().parent().parent().next().find('button:first').attr('disabled','disabled');
                        }else{
                            ftr.children('table').children('tbody').children('tr').next().children('td').next().css('color','#666666');
                            ftr.parent().parent().parent().next().find('button:first').css('color','#424242');
                            ftr.parent().parent().parent().next().find('button:first').removeAttr('disabled');
                        }

                        return true;
                    }
                    return true;
                }
                //hide group cell in change weight dialog
                $('tr.ev_dhx_skyblue').each(function(){
                    //$(this).find('td:last').hide();
                });
                $('div.treegrid_cell').find('img').click(function(){
                    $(this).parent().parent().parent().next().find('td:last').css('border-top','1px solid #CCC4CF');
                });
            });
		});
		});

		
	});
		/*
		$("#course_objectives_weight_input").click(function(event){
			//event.stopPropagation();
		});
		
		$("#course_objectives_weight_input").keyup(function(event){

			if(event.keyCode==13){
				event.stopPropagation();
				var co_input = $("#course_objectives_weight_input");
				co_input.hide();
				var weight = co_input.val();
				var co_weight = $("#course_objectives_weight");
				co_weight.children('span').html(weight);
				$.post(script, {action:"changeweight",id:objective_id, weight:weight.substring(0, weight.length - 1)});
				co_weight.show();
			}


		});
				
		$('.template').click(function(event){

			//event.stopPropagation();
			var co_input = $("#course_objectives_weight_input");
			if($("#course_objectives_weight_input").is(":visible")){
				co_input.hide();
				var weight = co_input.val();
				var co_weight = $("#course_objectives_weight");
				co_weight.children('span').html(weight);
				$.post(script, {action:"changeweight",id:objective_id, weight:weight.substring(0, weight.length - 1)});
				co_weight.show();				
			}

		});
		*/
		content.hideLoader();

        if(schoolmule.main.user_role== "staff" || schoolmule.main.user_role== "superadmin"){

            window.assignment_content = json_response.description;
            window.published_assignment_content = !json_response.description_public?'':json_response.description_public;

            window.grading_content = json_response.grading;
            window.published_grading_content = !json_response.grading_public?'':json_response.grading_public;

            setPublishAssignmentMode('objective_description_field','objective_description');
            setPublishObjectiveMode('grading_field','grading');

            tinyContent = new schoolmule.controls.editor(["description"],{
                container : "objective_description",
                type: "small",
                hide:true,
                active_item:"assignment",
                active_area: "objective_description_content",
                content: window.published_assignment_content
            });

            oldDescription = json_response.description_public;
            oldGrades = json_response.grading_public;

            tinyGrading = new schoolmule.controls.editor([gradeA,gradeB],{
                container : "grading",
                type: "small",
                active_item:"assignment",
                hide:true,
                active_area: "grading_content",
                active_select : gradeA,
                content : window.published_grading_content
            });

            tinyGrading.setContent(
                {gradeA : json_response.grading},
                {gradeB : 'content 2'}
            );

            content.elements.push(tinyContent);
            content.elements.push(tinyGrading);
            tabbar.checkTinyContent = {'content':[tinyGrading,oldGrades],'notes':[tinyContent,oldDescription]};

            content.attachButtons([
                {
                    label : dlang("draft_save_button","Save"),
                    id : "save",
                    callback : function(){
                        content.showLoader();
                        tabbar.checkTinyContent = true;
                        var objective_description = tinyContent.getContent();
                        var objective_grade = tinyGrading.getContent();
                        $("#save").attr("disabled","disabled");
                        $("#save").addClass("disabled-button");
                        $.post(script,
                            {
                                action:"putobjective",
                                id:objective_id,
                                description:objective_description,
                                grades:objective_grade
                            },
                            function(){
                                window.save_notification = false;
                                window.assignment_content = objective_description;
                                window.grading_content = objective_grade;
                                content.hideLoader();
                            }
                        );
                    }
                },
                {
                    label : dlang("draft_save_p_button","Save and publish"),
                    id : "save_publish",
                    callback : function(){
                        if(!window.no_publish_confirm){
                            seconfirm(dlang("se_assign_publish_confirm","Do you want publish this content?"),function(){
                                publishObjectiveContent(script,objective_id)
                            });
                        }else{
                            window.no_publish_confirm = false;
                            publishObjectiveContent(script,objective_id)
                        }
                    }
                },
                {
                    label : dlang("draft_revert","Revert to published"),
                    id : "revert",
                    callback : function(){
                        seconfirm(dlang("se_assign_revert_confirm","Do you want revert content to published?"),function(){
                            window.assignment_content = window.published_assignment_content;
                            window.grading_content = window.published_grading_content;
                            $("#save_publish").attr("disabled","disabled");
                            $("#save_publish").addClass("disabled-button");
                            $("#revert").attr("disabled","disabled");
                            $("#revert").addClass("disabled-button");
                            $("#save").removeAttr("disabled");
                            $("#save").removeClass("disabled-button");
                            setEditAssignmentMode('objective_description_field');
                            setEditObjectiveMode('grading_field');
                        });
                    }
                }
            ]);

            $("#save").attr("disabled","disabled");
            $("#edit").attr("disabled","disabled");
            $("#edit").addClass("disabled-button");
            $("#save").addClass("disabled-button");
            $("#revert").attr("disabled","disabled");
            $("#revert").addClass("disabled-button");

        }else{
            $("#objective_description").append('<div class="pupil_contant_container">'+json_response.description_public+'</div>');
            $("#grading").append('<div class="pupil_contant_container">'+json_response.grading_public+'</div>');
            $("#change_course_objectives_weight").remove();
        }
	},"json");
					

	content.setTitle("main-content",dlang("details_objective_objective_details","Objective details"));
}

function publishObjectiveContent(script,objective_id){
    content.showLoader();
    tabbar.checkTinyContent = true;
    var objective_description = tinyContent.getContent();
    var objective_grade = tinyGrading.getContent();
    $.post(script,
        {
            publish:"1",
            action:"putobjective",
            id:objective_id,
            description:objective_description,
            grades:objective_grade
        },
        function(){
            window.save_notification = false;

            window.assignment_content = objective_description;
            window.published_assignment_content = objective_description;
            window.grading_content = objective_grade;
            window.published_grading_content = objective_grade;
            content.hideLoader();

            setPublishAssignmentMode('objective_description_field','objective_description');
            setPublishObjectiveMode('grading_field','grading');

            $("#save_publish").attr("disabled","disabled");
            $("#save_publish").addClass("disabled-button");

            $("#save").attr("disabled","disabled");
            $("#save").addClass("disabled-button");

            $("#revert").attr("disabled","disabled");
            $("#revert").addClass("disabled-button");
        }
    );
}

function showPerformnaceDetails(performance_id,p_stg){
    if(content){
        content.destroy();
        content = null;
    }
    $('.no-select-tree-item-message').hide();
    switch(schoolmule.main.user_role){
        case "superadmin":
            showPerformnaceDetailsStaff(performance_id,p_stg)
            break;
        case "staff":
            showPerformnaceDetailsStaff(performance_id,p_stg)
            break;
        case "pupil":
            showPerformnaceDetailsPupil(performance_id,p_stg)
            break;
        case "parent":
            showPerformnaceDetailsPupil(performance_id,p_stg)
            break;
    }
}

function showPerformnaceDetailsPupil(performance_id,p_stg){
    var script = "connectors/connector.php?control_id=tree_assignments_by_studygroup";

    content = new schoolmule.controls.layout({
        cellsBlock: {
            display_footer_right: true,
            cells_right:[
                {
                    cells:[{
                        new_count : false,
                        id : "main-box-header",
                        title: "",
                        width: '100%',
                        height: '50px',
                        border_bottom: true
                    }]
                },
                {
                    cells:[
                        {
                            new_count : true,
                            id : "assess_grid",
                            title: dlang("details_performance_comments","Teachers private notes"),
                            width: '100%',
                            height: '100px'
                        }
                    ]
                },
                {
                    cells:[
                        {
                            new_count : true,
                            id : "description_for_pupils",
                            title: dlang("details_performance_description2","Performance description"),
                            content: "Present view 2",
                            width: '100%',
                            height: '100%'
                        },
                        {
                            new_count : true,
                            id : "comments_tiny",
                            title: dlang("details_performance_comments2","Comments"),
                            content: "Present view",
                            width: '270px',
                            height: '100%',
                            border_left: true
                        }
                    ]
                }
            ]
        }
    });
    content.elements.push(acc);
    content.showLoader();
    $("#comments_tiny").append("<div class='submission_box'><div class='no-select-submission'>"+dlang("select_item_box","Select item in grid")+"</div></div>");
    $.post(script, {action:"getperformance",id:performance_id}, function(json_response){
        content.hideLoader();
        $("#description_for_pupils").append('<div id="custom_editor_control"></div>');
        $("#description_for_pupils").append('<div class="pupil_contant_container">'+json_response.published_content+'</div>');

        var tree = schoolmule.instances.tree_assignments_by_studygroup.getTree();
        json_response.info.studygroup=tree.getItemText(tree.getParentId('performance_'+performance_id+(p_stg?'_'+p_stg:"")));
        schoolmule.instances.html_performance_pupil.attachTo("main-box-header",false,json_response.info);
        $('#view_assessments').click(function(){
            var tree = schoolmule.instances.tree_assignments_by_studygroup.getTree();
            tree.selectItem("assessment_"+performance_id);
        });

        $('#view_assessments img').attr('src',json_response.info.assessment_image);
        $("#copy_external_link").click(function(){
            copyExternalLink(dlang("details_copy_lin_perf","External link to this Performance is copied to clipboard"));
        });

        setDropdownInfoForPupils(json_response);
        checkPerformancePublication(json_response);

        schoolmule.instances.grid_assess_performance.attachTo("assess_grid",performance_id,{actions:{
            "pupil":setPefrormanceContent
        }});

        schoolmule.instances.grid_assess_performance.getGrid().grid.setEditable(false);
        content.elements.push(schoolmule.instances.grid_assess_performance);
        //Hash.add('performance',performance_id);
    },"json");

    content.attachButtons([
        {
            label : dlang("copy_link_button","Copy link"),
            id : "copy_link",
            callback : function(){
                copyExternalLink(dlang("details_copy_link_perf","External link to this Performance is copied to clipboard"));
            }
        }
    ],'buttons-right');

    content.setTitle("main-content",dlang("details_performance","Performance details"));
}

function showPerformnaceDetailsStaff(performance_id,p_stg){
    var script = "connectors/connector.php?control_id=tree_assignments_by_studygroup";
    window.assignment_content = "";
    window.published_assignment_content = "";

    content = new schoolmule.controls.layout({
        cellsBlock: {
            display_footer_right: true,
            cells_right:[
            {
                cells:[{
                    new_count : false,
                    id : "main-box-header",
                    title: "",
                    width: '100%',
                    height: '65px',
                    border_bottom: true
                }]									
            },
            
            {													
                cells:[
                {
                    new_count : true,
                    id : "description_for_pupils",
                    title: dlang("details_performance_description","Performance description for pupils"),
                    content: "Present view 2",
                    width: '100%',
                    height: '100%',
                    border_right: true
                },
                
                {
                    new_count : true,
                    id : "notes_performance",
                    title: ' ',
                    content: "Present view",
                    width: '270px',
                    height: '100%'
                }
                ]
            }
            ]
        }
    });

    window.tinyContent = null;
    window.tinyNotes = null;
    window.oldContent = null;
    window.oldNotes = null;

	content.showLoader();
    content.elements.push(acc);
    $("#notes_performance").append('<div id="result_unit_area_perf"></div>');
     
    createEditPublishHeader('description_for_pupils_container','description_for_pupils_field','description_for_pupils');
    createNoteResultHeader ('notes_performance_container');
	$.post(script, {action:"getperformance",id:performance_id}, function(json_response){
		content.hideLoader();
        window.assignment_content = json_response.content;
        window.published_assignment_content = !json_response.published_content?'':json_response.published_content;

        setPublishAssignmentMode('description_for_pupils_field','description_for_pupils');

		tinyContent = new schoolmule.controls.editor(["content"],{
			container : "description_for_pupils",
			type: "assignment",
            active_item:"assignment",
            hide:true,
			active_area: "description_for_pupils_content",
			content:window.published_assignment_content
		});

		tinyNotes = new schoolmule.controls.editor(["notes"],{
			container : "notes_performance",
			type: "assignment_small",
			active_area: "notes_performance_content",
                        hide:true,
			content:json_response.notes
		});

    
		oldContent = json_response.content;
		oldNotes = json_response.notes;
		var tree = schoolmule.instances.tree_assignments_by_studygroup.getTree();
		json_response.info.studygroup=tree.getItemText(tree.getParentId('performance_'+performance_id+(p_stg?'_'+p_stg:"")));

		schoolmule.instances.html_performance.attachTo("main-box-header",false,json_response.info);

        $('#view_assessments').click(function(){
            var tree = schoolmule.instances.tree_assignments_by_studygroup.getTree();
            tree.selectItem("assessment_"+performance_id);
        });

        $('#view_assessments img').attr('src',json_response.info.assessment_image);

		$("#copy_external_link").click(function(){
			copyExternalLink(dlang("details_copy_link_perf","External link to this Performance is copied to clipboard"));
		});

        $("#assignment_publication").change(function () {
            $("#assignment_publication option:selected").each(function () {
                $.post(script, {action:"setpubliation",id:performance_id,publication:$(this).val(), item:"performance"});
            });
        });

        setHeaderSelectItemsForAssignment(json_response);

        setSelectActions(performance_id,"performance");
                console.log(schoolmule.instances)
		schoolmule.instances.grid_performance.attachTo("result_unit_area_perf",performance_id);
		
		content.elements.push(schoolmule.instances.grid_performance);
		content.elements.push(tinyNotes);
		content.elements.push(tinyContent);

		tabbar.checkTinyContent = {'content':[tinyContent,oldContent],'notes':[tinyNotes,oldNotes]};
	},"json");

     setResultAssignmentMode('notes_performance_container');
    addCustomEditor(
            "#description_for_pupils.internal_container", 
            'perfomance_custom_editor_for_edit_tab',
            "#description_for_pupils .mce-container",
            true, 
            dlang("activate_custom_editor","Activate custom editor"),
            true,
            performance_id
    );
    addCustomEditor(
            "#description_for_pupils.internal_container", 
            'perfomance_custom_editor_for_published_tab', 
            "#description_for_pupils #description_for_pupils_field", 
            false, 
            dlang("activate_custom_published","Activate custom published"),
            false,
            performance_id
            
    );
   
    content.attachButtons([
        {
            label : dlang("draft_save_button","Save"),
            id : "save",
            callback : function(){
                content.showLoader();
                tabbar.checkTinyContent = true;
                var performance_content = tinyContent.getContent();
                var performance_notes = tinyNotes.getContent();
                $("#save").attr("disabled","disabled");
                $("#save").addClass("disabled-button");
                $.post(script,
                    {
                        action:"putperformance",
                        id:performance_id,
                        content:performance_content,
                        notes:performance_notes
                    },
                    function(){
                        window.save_notification = false;
                        oldContent = performance_content;
                        oldNotes = performance_notes;
                        window.assignment_content = performance_content;
                        content.hideLoader();
                    }
                );
            }
        },
        {
            label : dlang("draft_save_p_button","Save and publish"),
            id : "save_publish",
            callback : function(){
                if(!window.no_publish_confirm){
                    seconfirm(dlang("se_assign_publish_confirm","Do you want publish this content?"),function(){
                        saveAndPublishPerformance(script,performance_id);
                    });
                }else{
                    window.no_publish_confirm = false;
                    saveAndPublishPerformance(script,performance_id);
                }
            }
        },
        {
            label : dlang("draft_revert","Revert to published"),
            id : "revert",
            callback : function(){
                seconfirm(dlang("se_assign_revert_confirm","Do you want revert content to published?"),function(){
                    window.assignment_content = window.published_assignment_content;
                    $("#save_publish").attr("disabled","disabled");
                    $("#save_publish").addClass("disabled-button");
                    $("#revert").attr("disabled","disabled");
                    $("#revert").addClass("disabled-button");

                    $("#save").removeAttr("disabled");
                    $("#save").removeClass("disabled-button");

                    setEditAssignmentMode('description_for_pupils_field');
                });
            }
        }]);

    content.attachButtons([
        {
            label : dlang("cerate_link_button","Create link"),
            id : "copy_link",
            callback : function(){
                copyExternalLink(dlang("details_copy_link_perf","External link to this Performance is copied to clipboard"));
            }
        }
    ],'buttons-right');
    content.setTitle("main-content",dlang("details_performance","Performance details"));
}

function saveAndPublishPerformance(script,performance_id){
    content.showLoader();
    tabbar.checkTinyContent = true;
    var performance_content = tinyContent.getContent();
    var performance_notes = tinyNotes.getContent();
    $.post(script,
        {

            action:"putperformance",
            publish:"1",
            id:performance_id,
            content:performance_content,
            notes:performance_notes
        },
        function(){
            window.save_notification = false;
            oldContent = performance_content;
            oldNotes = performance_notes;
            window.assignment_content = performance_notes;
            window.published_assignment_content = performance_content;
            content.hideLoader();
            setPublishAssignmentMode('description_for_pupils_field','description_for_pupils');

            $("#save_publish").attr("disabled","disabled");
            $("#save_publish").addClass("disabled-button");
            $("#save").attr("disabled","disabled");
            $("#save").addClass("disabled-button");
            $("#revert").attr("disabled","disabled");
            $("#revert").addClass("disabled-button");
        }
    );
}

function getObjectiveProgress(id,stg){
    $('.no-select-tree-item-message').hide();
	var script = "connectors/connector.php?control_id=tree_assessments_by_studygroup";
	if(content){
		content.destroy();
		content = null;
	}
	content = new schoolmule.controls.layout({
	cellsBlock: {
				display_footer_right: true,
				cells_right:[
								{
									cells:[{
										new_count : false,
										id : "main-box-header",
										title: "",
										width: '100%',
										height: '68px',
										border_bottom: true
									}]									
								},
								{													
									cells:[
									{
										new_count : true,
										id : "objective_progress",
										title: dlang("objective_progress_title","Pupil progress application"),
										width: '100%',
										height: '100%',
										border_right: false
									}
									]
								}
						     ]
		  }
	});	
	content.showLoader();
    content.elements.push(acc);
	$.post(script, {action:"getpupilinfo",id:id, stg:stg}, function(json_response){

        var tree = schoolmule.instances.tree_assessments_by_studygroup.getTree();
        json_response.info.studygroup=tree.getItemText(tree.getParentId('pupil_'+id+(stg?'_'+stg:"")));

		schoolmule.instances.html_pupil_assessment_by_stg.attachTo("main-box-header",false,json_response.info);
		name_pupil = json_response.info.pupil_name;
		studygroup_pupil = json_response.info.studygroup;
		StudyGroupID = stg;
		pupilId = json_response.info.pupil_id;

        setGradeSelectActions();
		//staffAdmin = $("input#staffAdmin").val();
		
		$('.name_pupil').val(name_pupil);
		$('.studygroup_pupil').val(studygroup_pupil);
		
		$('.add_pupil_name').text(name_pupil);
		$('.add_stydy_group').text(studygroup_pupil);
		$('.add_stydy_group').text(studygroup_pupil);
		
		$('#idpupil').val(pupilId);
		$('#idstudyGroup').val(StudyGroupID);

		$.post("schoolmodule/dhtmlx/myxml/xml.php",{action:"create_xml", pupilId: pupilId, StudyGroupID: StudyGroupID, name_pupil: name_pupil, studygroup_pupil: studygroup_pupil});		
		$.post("schoolmodule/ajax/ajax.php",{action:"select_info", staffAdmin: "", pupilId: pupilId, StudyGroupID: StudyGroupID},function(data){
			content.hideLoader();	
			$('#objective_progress').html(data)
			
			//$(".mainTable tr:last").css({backgroundColor: 'yellow', fontWeight: 'bolder'});
			//objectiveWeight();
			//heightAssignment();
		});
	},"json");
	
	content.attachButtons([
		{	
			label : dlang("objective_progress_toogle_button","Toggle assgnm./perform."),
			id : "toogle_ass_perf",
			callback : function(){
			}
		}
	
	]);
	
	$("#toogle_ass_perf").addClass('toggleAssgnPerfHide');

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

	content.setTitle("main-content",dlang("objective_progress","Objective progress"));
}

function getAssignmentProgress(id){
    $('.no-select-tree-item-message').hide();
	var script = "connectors/connector.php?control_id=tree_assessments_overview";
	if(content){
		content.destroy();
		content = null;
	}
	content = new schoolmule.controls.layout({
	cellsBlock: {
				display_footer_right: true,
				cells_right:[
								{
									cells:[{
										new_count : false,
										id : "main-box-header",
										title: "",
										width: '100%',
										height: '68px',
										border_bottom: true
									}]									
								},
								{													
									cells:[
									{
										new_count : true,
										id : "assessment_garade",
										title: dlang("assign_progress_subm_and_perf_comments","Submissions and Performance comments"),
										width: '100%',
										height: '100%'
									},
									{
										new_count : true,
										id : "comments_tiny",
										title: dlang("assign_progress_submissions","Submissions"),
										width: '270px',
										height: '100%',
                                        border_left: true
									}
									]
								}
						     ]
		  }
	});
	
	content.setHeaderExpand('assessment_garade');
	content.showLoader();
    content.elements.push(acc);
    $("#comments_tiny").append("<div class='submission_box'><div class='no-select-submission'>"+dlang("select_item_box","Select item in grid")+"</div></div>");
	$.post(script, {action:"getperformanceprogress",id:id}, function(json_response){
		content.hideLoader();
		schoolmule.instances.html_pupil.attachTo("main-box-header",false,json_response.info);
		schoolmule.instances.grid_assignments_progress.attachTo("assessment_garade",id,{actions:{
			"performance":setPefrormanceContent,
			"assignment":checkSubmissionButton
		}
	});
		content.elements.push(schoolmule.instances.grid_assignments_progress);
	},"json");

    if(schoolmule.main.user_role=='staff' || schoolmule.main.user_role=='superadmin'){
        content.attachButtons([
            {
                label : dlang("button_make_as_submitted","Mark as Submitted"),
                id : "mark_as_submitted",
                callback : function(){
                    var gridOb = schoolmule.instances.grid_assignments_progress.getGrid();
                    var aid = gridOb.grid.getSelectedRowId();
                    var _aid = aid.split('_');
                    $("#mark_as_submitted").attr("disabled","disabled");
                    if(gridOb.grid.getUserData(aid,'submitted')=="1"){
                        $.post("connectors/connector.php?control_id=grid_assignments_progress", {action:"makeasnotsubmitted", assid:_aid[1], pid:id}, function(){
                            var tree_assess = schoolmule.instances.tree_assessments_by_studygroup.getTree();
                            var stg = tree_assess.getSelectedItemId().split('_')[2];
                            gridOb.grid.updateFromXML("connectors/connector.php?control_id=grid_assignments_progress&id="+id+'&stg='+(stg?stg:""));

                            $("#mark_as_submitted").removeAttr("disabled");
                            $("#mark_as_submitted").text(dlang("button_make_as_submitted","Mark as Submitted"));
                            gridOb.grid.setUserData(aid,'submitted','0');
                        });
                    }else{
                        $.post("connectors/connector.php?control_id=grid_assignments_progress", {action:"makeassubmitted", assid:_aid[1], pid:id}, function(){
                            var tree_assess = schoolmule.instances.tree_assessments_by_studygroup.getTree();
                            var stg = tree_assess.getSelectedItemId().split('_')[2];
                            gridOb.grid.updateFromXML("connectors/connector.php?control_id=grid_assignments_progress&id="+id+'&stg='+(stg?stg:""));
                            $("#mark_as_submitted").text(dlang("button_make_as_not_submitted","Mark as not Submitted"));
                            $("#mark_as_submitted").removeAttr("disabled");
                            gridOb.grid.setUserData(aid,'submitted','1');
                        });
                    }
                }
            }
        ]);

        $("#mark_as_submitted").attr("disabled","disabled");
        $("#mark_as_submitted").addClass("disabled-button");
    }
	
	content.setTitle("comments_tiny",dlang("assignment_progress_comments","Comments"));
}

function diasbleMASbutton(){
    var mas = $("#mark_as_submitted");
    mas.attr("disabled","disabled");
    mas.addClass("disabled-button");
    return mas;
}

function getForumEdit(){
    switch(schoolmule.main.user_role){
        case "superadmin":
            return true;
        case "staff":
            return true;
        case "pupil":
            return true;
        case "parent":
            return false;
        default :return false;
    }
}

function setPefrormanceContent(id,pupil){

	$("#comments_tiny").empty();
    diasbleMASbutton();

	var forum = new schoolmule.controls.forum({
		id: id,
        pupil:pupil,
		type: "performance",
		files:false,
        edit:getForumEdit,
        conteiner:"comments_tiny"
	});

    setCommentsHeader(dlang("performance_comment_title","Comments"), id, "performance", "comments_tiny" , forum);
    return forum;
}

function setCommentsHeader(title, id, type, container, forum){
    var box_caption = $("#"+container+"_container .box-caption");
    box_caption.html(title);
    var reload = $('<div class="pointer" id="reload_comments" title="reload"></div>');
    reload.click(function(){
        forum.reload(id, type);
    });
    box_caption.append(reload);
    forum.attachTo(container);
}

function setNotesContent(type, conteiner){
    var title = dlang("public_notes_comment_title","Pupil notes (pupils and parents)");
	$("#"+conteiner).empty();

	var forum = new schoolmule.controls.comments({
		id: 0,
		type: type,
		files:false,
        edit:getForumEdit,
        conteiner:conteiner
	});

    if(type!='pupil_note'){
        title = dlang("private_notes_comment_title","Private notes (staff)");
    }

    setCommentsHeader(title, 0, "performance", conteiner, forum);
    return forum;
}

function AssignmentsContent(id, pupil){
    $("#comments_tiny").empty();
    var mas = enableMASbutton();

	var forum = new schoolmule.controls.forum({
		id: id,
        pupil:pupil,
		type: "assignment",
        edit:getForumEdit,
        conteiner:"comments_tiny"
	});

    setCommentsHeader(dlang("comment_cubmissions_title","Submissions"), id, "assignment", "comments_tiny", forum);
    return forum;
}

function getPerformanceProgress(id){
    $('.no-select-tree-item-message').hide();
	var script = "connectors/connector.php?control_id=tree_assessments";
	if(content){
		content.destroy();
		content = null;
	}
	content = new schoolmule.controls.layout({
	cellsBlock: {
				display_footer_right: true,
				cells_right:[
								{
									cells:[{
										new_count : false,
										id : "main-box-header",
										title: "",
										width: '100%',
										height: '68px',
										border_bottom: true
									}]									
								},
								{													
									cells:[
									{
										new_count : true,
										id : "performance_progress",
										title: "Performance and assessments",
										width: '100%',
										height: '100%',
										border_right: false
									}
									]
								}
						     ]
		  }
	});
    content.elements.push(acc);
	$.post(script, {action:"getpupilinfo",id:id}, function(json_response){
		schoolmule.instances.html_pupil.attachTo("main-box-header",false,json_response.info);
		schoolmule.instances.grid_assessment.attachTo("performance_progress",id);
	},"json");

	content.attachButtons([
		{	
			label : "Save",
			id : "save",
			callback : function(){			
			}
		}
	]);
	
	content.setTitle("main-content",dlang("Performance progress"));
}

function getStatsAndNotes(id,stg){
    $('.no-select-tree-item-message').hide();
	var script = "connectors/connector.php?control_id=tree_assessments_by_studygroup";
	if(content){
		content.destroy();
		content = null;
	}

    var cellsBlock = {
        display_footer_right: true,
        cells_right:[
            {
                cells:[{
                    new_count : false,
                    id : "main-box-header",
                    title: "",
                    width: '100%',
                    height: '68px',
                    border_bottom: true
                }]
            },
            {
                cells:[
                    {
                        new_count : true,
                        id : "pupil_assessment_stat",
                        title: "Pupil Assessments statistic",
                        width: '30%',
                        height: '100%',
                        border_right: true
                    },
                    {
                        new_count : true,
                        id : "pupil_notes",
                        title: "Pupil notes (pupils and parents)",
                        width: '70%',
                        height: '50%'
                    },

                    {
                        new_count : false,
                        id : "private_notes",
                        title: "Private notes (staff)",
                        width: '70%',
                        height: '100%'
                    }
                ]
            }
        ]
    }

    if(schoolmule.main.user_role=='pupil' || schoolmule.main.user_role=='parent'){
        cellsBlock = {
            display_footer_right: true,
            cells_right:[
                {
                    cells:[{
                        new_count : false,
                        id : "main-box-header",
                        title: "",
                        width: '100%',
                        height: '68px',
                        border_bottom: true
                    }]
                },
                {
                    cells:[
                        {
                            new_count : true,
                            id : "pupil_assessment_stat",
                            title: "Pupil Assessments statistic",
                            width: '30%',
                            height: '100%',
                            border_right: true
                        },
                        {
                            new_count : true,
                            id : "pupil_notes",
                            title: "Pupil notes (pupils and parents)",
                            width: '70%',
                            height: '100%'
                        }
                    ]
                }
            ]
        }
    }

	content = new schoolmule.controls.layout({
	    cellsBlock: cellsBlock
	});
	content.showLoader();
    content.elements.push(acc);
	$.post(script, {action:"getpupilinfo",id:id, stg:stg}, function(json_response){
        var tree = schoolmule.instances.tree_assessments_by_studygroup.getTree();
        json_response.info.studygroup=tree.getItemText(tree.getParentId('pupil_'+id+(stg?'_'+stg:"")));
		schoolmule.instances.html_pupil_assessment_by_stg.attachTo("main-box-header",true,json_response.info);
		content.hideLoader();

		$.post("connectors/connector.php?control_id=chart_stats", {id:id, stg:stg}, function(json_response){
			if(json_response){
				var chart = new schoolmule.controls.chart(schoolmule.instances.chart_stats);
				chart.appendTo('pupil_assessment_stat',"100%","80%","stg_"+stg,"");
                chart.setData(json_response[stg][0],'json');
				content.elements.push(chart);				
			}
		},"json");

		var forum = setNotesContent('pupil_note','pupil_notes');

        content.elements.push(forum);
        if(schoolmule.main.user_role=='staff' || schoolmule.main.user_role=='superadmin'){
            var forumpr = setNotesContent('private_note','private_notes');
            content.elements.push(forumpr);
        }
        console.log(content.elements);
		//oldPupilNotes = json_response.private_notes;
		//oldPrivateNotes = json_response.owner_notes;

		
		
		//tabbar.checkTinyContent = {'content':[tinyPupilNotes,oldPupilNotes],'notes':[tinyPrivateNotes,oldPrivateNotes]};		
		//content.elements.push(tinyPupilNotes);
		//content.elements.push(tinyPrivateNotes);		
	},"json");

	content.attachButtons([
        /*
		{	
			label : dlang("Publish pupil and staff notes"),
			id : "save",
			callback : function(){
				content.showLoader();
				tinyPupilNotes.hide();
				tinyPrivateNotes.hide();
				var private_notes = tinyPupilNotes.getContent();
				var owner_notes = tinyPrivateNotes.getContent();
				$("#edit").removeAttr("disabled");
				$("#edit").removeClass("disabled-button");
				$("#save").attr("disabled","disabled");
				$("#save").addClass("disabled-button");
				tabbar.checkTinyContent = true;
				$.post(script,
					{
						action:"setnotes",
						id:id,
						private_notes:private_notes,
						owner_notes:owner_notes
					},
					function(data){
						content.hideLoader();
					}
				);					
			}
		},

		{	
			label : dlang("Edit"),
			id : "edit",
			callback : function(){
				$("#edit").attr("disabled","disabled");
				$("#edit").addClass("disabled-button");
				tinyPupilNotes.show();
				tinyPrivateNotes.show();										
			}
		},
		{	
			label : dlang("Revert"),
			id : "revert",
			callback : function(){
				tinyPupilNotes.setContent({"pupil_notes" : oldPupilNotes});	
				tinyPrivateNotes.setContent({"private_snotes" : oldPrivateNotes});
				tinyPupilNotes.show();
				tinyPrivateNotes.show();										
			}
		}
         */
	]);
    /*
	$("#edit").attr("disabled","disabled");
	$("#save").attr("disabled","disabled");
	$("#edit").addClass("disabled-button");
	$("#save").addClass("disabled-button");
	*/
	content.setTitle("main-content","Statistic and notes");
}

function getStats(id,pid){
	var script = "connectors/connector.php?control_id=tree_assessments_overview";
	if(content){
		content.destroy();
		content = null;
	}
    $('.no-select-tree-item-message').hide();
		
	content = new schoolmule.controls.layout({
	cellsBlock: {
				display_footer_right: true,
				cells_right:[
									{
										cells:[{
											new_count : false,
											id : "main-box-header",
											title: "",
											width: '100%',
											height: '68px',
											border_bottom: true
										}]									
									},
									{													
										cells:[
                                            {
                                                new_count : true,
                                                border_bottom: false,
                                                id : "stg_grades",
                                                title: dlang("development_grid","Pupil development"),
                                                width: '100%',
                                                height: '100%'
                                            }
										]
									}
						     ]
		  }
	});
	content.showLoader();
    content.elements.push(acc);
	$.post(script, {action:"getpupilinfo", id:id}, function(json_response){
		schoolmule.instances.html_pupil.attachTo("main-box-header",false,json_response.info);
		content.hideLoader();

        schoolmule.instances.grid_development.attachTo('stg_grades',id);

        content.attachButtons([
            {
                label : dlang("Save"),
                id : "save",
                callback : function(){
                }
            },
            {
                label : dlang("Cancel"),
                id : "cancel",
                callback : function(){
                }
            },
            {
                label : dlang("print_full_studyplan","Print full Studyplan"),
                id : "print_full",
                callback : function(){
                    var grid =  schoolmule.instances.grid_development.getGrid().grid;
                    var pupil = $('#main-box-header').html();

                    grid.saveOpenStates("printstate");
                    grid.forEachRow(function(id){
                        var _id = id.split('_');
                        if((_.indexOf(["academicyear","subject"],_id[0]) != -1)){
                            grid.openItem(id);
                        }else if((_.indexOf(["studygroup"],_id[0]) != -1)){
                            grid.closeItem(id);
                        }
                    });

                    var htmlp = grid.printView();


                    grid.loadOpenStates("printstate");

                    var printWindow = window.open('','printWindow','Location=0,Toolbar=0,Location=0,Directories=0,Status=0,Menubar=0,Scrollbars=0,Resizable=0');
                    printWindow.document.open();
                    printWindow.document.write(htmlp);
                    $(printWindow.document.body).find('tbody tr').find('td:eq(7)').remove();
                    $(printWindow.document.body).prepend(pupil);
                    $(printWindow.document.body).find('*').css('font-size','12px');
                    printWindow.print();
                    printWindow.close();

                }
            }
        ]);
		//schoolmule.instances.grid_grades.attachTo("stg_grades",id);
        content.elements.push(schoolmule.instances.grid_development);
	},"json");

	content.setTitle("main-content",dlang("development_details_title","Pupil development"));
}



function parseGetParams() {
    var $_GET = {};
    var __GET = window.location.search.substring(1).split("&");
    for(var i=0; i<__GET.length; i++) {
        var getVar = __GET[i].split("=");
        $_GET[getVar[0]] = typeof(getVar[1])=="undefined" ? "" : getVar[1];
    }
    return $_GET;
}

