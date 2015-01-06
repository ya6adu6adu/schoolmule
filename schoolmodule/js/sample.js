$(document).ready(function() {

	// tree content is loading here from XML file (can be loaded from DB) - for Dialog 5
	// this dialogs 5 and dialog 6 was copy in file ajax/ajax.php

	// UI-dialog1 code open window
	$('#dialog1').dialog({
		autoOpen: false,
		modal: true,
		width: 270,
		height: 100,
		resizable: false,
		buttons: {
			"Ok": function() { 
				//alert(1)
				groupId = $("#groupId").val();
				objectiveId = 	$('#objectiveId').val();
				assignPerfId = $('#assignPerfId').val();
				
				//delete group 
				if( $('#ui-dialog-title-dialog1').text() == "Delete this group" ){
					$.post("schoolmodule/ajax/ajax_update.php",{action: "delete_group", groupId: groupId});
					$.post("schoolmodule/dhtmlx/myxml/xml.php",{action:"create_xml", pupilId:pupilId, StudyGroupID: StudyGroupID, name_pupil: name_pupil, studygroup_pupil: studygroup_pupil});
					$.post("schoolmodule/ajax/ajax.php",{action:"select_info", pupilId:pupilId, StudyGroupID: StudyGroupID },function(data){
						$('#objective_progress').html(data);
					});
				}
				//delete objective
				if( $('#ui-dialog-title-dialog1').text() == "Delete this objective" ){
					$.post("schoolmodule/ajax/ajax_update.php",{action: "delete_obj", objectiveId: objectiveId});
					$.post("schoolmodule/dhtmlx/myxml/xml.php",{action:"create_xml", pupilId:pupilId, StudyGroupID: StudyGroupID, name_pupil: name_pupil, studygroup_pupil: studygroup_pupil});
					$.post("schoolmodule/dhtmlx/myxml/xml.php",{action:"create_xml", pupilId:pupilId, StudyGroupID: StudyGroupID, name_pupil: name_pupil, studygroup_pupil: studygroup_pupil});
					$.post("schoolmodule/ajax/ajax.php",{action:"select_info", pupilId:pupilId, StudyGroupID: StudyGroupID },function(data){
						$('#objective_progress').html(data);
					});
				}
				//delete objective assignment/perfomence
				if( $('#ui-dialog-title-dialog1').text() == "Delete this assignment/perfomence" ){
					$.post("schoolmodule/ajax/ajax_update.php",{action: "delete_assign", assignPerfId: assignPerfId});
					$.post("schoolmodule/dhtmlx/myxml/xml.php",{action:"create_xml", pupilId:pupilId, StudyGroupID: StudyGroupID, name_pupil: name_pupil, studygroup_pupil: studygroup_pupil});
					$.post("schoolmodule/ajax/ajax.php",{action:"select_info", pupilId:pupilId, StudyGroupID: StudyGroupID },function(data){
						$('#objective_progress').html(data);
					});
				}
				
				$(this).dialog("close");
			},
			"Cancel": function() { 
				$(this).dialog("close");
			}
		}
	});

	// dialog1 call
	$('#dialog_btn1').click(function(){
		$('#dialog1').dialog('open');			
	});

	// UI-dialog2 code open window add new group or objective
	$('#dialog2').dialog({
		autoOpen: false,
		modal: true,
		width: 300,
		resizable: false,
		buttons: {
			"Add": function() {
				groupName = $('input#groupName').val();
				hidefrom = $(":radio[name=radio-dlg2]").filter(":checked").val();
				idpupil = $('#dialog2').children('input:first').val();
				
				// add new group
				if( $('#ui-dialog-title-dialog2').text() == "Add group"){
					if( hidefrom == 'hideFromPupil' ){
						$.post("schoolmodule/ajax/ajax_update.php",{action:'add_group_pupil', groupName: groupName, idpupil: idpupil, idstudyGroup: idstudyGroup});
					}
					if( hidefrom == 'hideFromStudygroup' ){
						idstudyGroup = $('#dialog2').children('input#idstudyGroup').val();
						$.post("schoolmodule/ajax/ajax_update.php",{action:'add_group_studyGroup', groupName: groupName, idpupil: idpupil, idstudyGroup: idstudyGroup});
					}
					if( hidefrom == 'hideFromCourse' ){
						idcourse = $('#dialog2').children('input#idcourse').val();
						$.post("schoolmodule/ajax/ajax_update.php",{action:'add_group_course', groupName: groupName, idpupil: idpupil, idcourse: idcourse , idstudyGroup: idstudyGroup});
					}
					if( hidefrom == 'dontHide' ){
						$.post("schoolmodule/ajax/ajax_update.php",{action:'add_group_dontHide', groupName: groupName, idpupil: idpupil , idstudyGroup: idstudyGroup});
					}
					$.post("schoolmodule/dhtmlx/myxml/xml.php",{action:"create_xml", pupilId:pupilId, StudyGroupID: StudyGroupID, name_pupil: name_pupil, studygroup_pupil: studygroup_pupil});
					$.post("schoolmodule/ajax/ajax.php",{action:"select_info", pupilId:pupilId, StudyGroupID: StudyGroupID },function(data){
						$('#objective_progress').html(data);
					});
				}
				
				// add new objective
				groupId = $("#groupId").val();
				if( $('#ui-dialog-title-dialog2').text() == "Add objective to this group" ){
					if( hidefrom == 'hideFromPupil' ){
						$.post("schoolmodule/ajax/ajax_update.php",{action:'add_obj_pupil', groupId: groupId, groupName: groupName, idpupil: idpupil});
					}
					if( hidefrom == 'hideFromStudygroup' ){
						idstudyGroup = $('#dialog2').children('input#idstudyGroup').val();
						$.post("schoolmodule/ajax/ajax_update.php",{action:'add_obj_studyGroup', groupId: groupId, groupName: groupName, idstudyGroup: idstudyGroup});
					}
					if( hidefrom == 'hideFromCourse' ){
						idcourse = $('#dialog2').children('input#idcourse').val();
						$.post("schoolmodule/ajax/ajax_update.php",{action:'add_obj_course', groupId: groupId, groupName: groupName, idcourse: idcourse});
					}
					if( hidefrom == 'dontHide' ){
						$.post("schoolmodule/ajax/ajax_update.php",{action:'add_obj_dontHide', groupId: groupId, groupName: groupName});
					}
					$.post("schoolmodule/dhtmlx/myxml/xml.php",{action:"create_xml", pupilId:pupilId, StudyGroupID: StudyGroupID, name_pupil: name_pupil, studygroup_pupil: studygroup_pupil});
					$.post("schoolmodule/ajax/ajax.php",{action:"select_info", pupilId:pupilId, StudyGroupID: StudyGroupID },function(data){
						$('#objective_progress').html(data);
					});
				}
				
				$(this).dialog("close");
			},
			"Cancel": function() { 
				$(this).dialog("close");
			}
		}
	});

	// dialog2 call
	$('#dialog_btn2').click(function(){
		$('#dialog2').dialog('open');			
	});

	// UI-dialog3 code open window Add assignment or perfomence
	$('#dialog3').dialog({
		autoOpen: false,
		modal: true,
		width: 300,
		resizable: false,
		buttons: {
			"Add": function() { 
				assPerfName = $('#assPerfName').val();
				//assignORperf = $(":radio[name=radio_dlg3_1]").filter(":checked").val();
				addto = $(":radio[name=radio-dlg3]").filter(":checked").val();
				hidefrom = $(":radio[name=radio-dlg3_2]").filter(":checked").val();
				idpupil = $('#dialog2').children('input:first').val();
				objectiveId = $('#objectiveId').val();
				
				if( $('#ui-dialog-title-dialog3').text() == "Add assignment" ){
					if( hidefrom == 'hideFromPupil' ){
						$.post("schoolmodule/ajax/ajax_update.php",{action:'add_assignmet_pupil', objectiveId: objectiveId, assPerfName: assPerfName, idpupil: idpupil});
					}
					if( hidefrom == 'hideFromStudygroup' ){
						idstudyGroup = $('#dialog2').children('input#idstudyGroup').val();
						$.post("schoolmodule/ajax/ajax_update.php",{action:'add_assignmet_studyGroup', objectiveId: objectiveId, assPerfName: assPerfName, idpupil: idpupil, idstudyGroup: idstudyGroup});
					}
					if( hidefrom == 'hideFromCourse' ){
						idcourse = $('#dialog2').children('input#idcourse').val();
						$.post("schoolmodule/ajax/ajax_update.php",{action:'add_assignmet_course', objectiveId: objectiveId, assPerfName: assPerfName, idpupil: idpupil, idcourse: idcourse});
					}
					if( hidefrom == 'dontHide' ){
						$.post("schoolmodule/ajax/ajax_update.php",{action:'add_assignmet_donthide', objectiveId: objectiveId, assPerfName: assPerfName, idpupil: idpupil});
					}
					$.post("schoolmodule/dhtmlx/myxml/xml.php",{action:"create_xml", pupilId:pupilId, StudyGroupID: StudyGroupID, name_pupil: name_pupil, studygroup_pupil: studygroup_pupil});
					$.post("schoolmodule/ajax/ajax.php",{action:"select_info", pupilId:pupilId, StudyGroupID: StudyGroupID },function(data){
						$('#objective_progress').html(data);
					});
				}
				if( $('#ui-dialog-title-dialog3').text() == "Add perfomence" ){
					if( hidefrom == 'hideFromPupil' ){
						$.post("schoolmodule/ajax/ajax_update.php",{action:'add_perf_pupil', objectiveId: objectiveId, assPerfName: assPerfName, idpupil: idpupil});
					}
					if( hidefrom == 'hideFromStudygroup' ){
						idstudyGroup = $('#dialog2').children('input#idstudyGroup').val();
						$.post("schoolmodule/ajax/ajax_update.php",{action:'add_perf_studyGroup', objectiveId: objectiveId, assPerfName: assPerfName, idpupil: idpupil, idstudyGroup: idstudyGroup});
					}
					if( hidefrom == 'hideFromCourse' ){
						idcourse = $('#dialog2').children('input#idcourse').val();
						$.post("schoolmodule/ajax/ajax_update.php",{action:'add_perf_course', objectiveId: objectiveId, assPerfName: assPerfName, idpupil: idpupil, idcourse: idcourse});
					}
					if( hidefrom == 'dontHide' ){
						$.post("schoolmodule/ajax/ajax_update.php",{action:'add_perf_donthide', objectiveId: objectiveId, assPerfName: assPerfName, idpupil: idpupil});
					}
					$.post("schoolmodule/dhtmlx/myxml/xml.php",{action:"create_xml", pupilId:pupilId, StudyGroupID: StudyGroupID, name_pupil: name_pupil, studygroup_pupil: studygroup_pupil});
					$.post("schoolmodule/ajax/ajax.php",{action:"select_info", pupilId:pupilId, StudyGroupID: StudyGroupID },function(data){
						$('#objective_progress').html(data);
					});
				}
				$(this).dialog("close");
			},
			"Cancel": function() { 
				$(this).dialog("close");
			}
		}
	});

	// dialog3 call
	$('#dialog_btn3').click(function(){
		$('#dialog3').dialog('open');			
	});

	// UI-dialog4 code open window hide group or objective or assignment or perfomence
	$('#dialog4').dialog({
		autoOpen: false,
		modal: true,
		width: 250,
		resizable: false,
		buttons: {
			"Hide": function() {
				hidefrom = $(":radio[name=r-hide]").filter(":checked").val();
				idpupil = $('#dialog2').children('input:first').val();
				groupId = $("input#groupId").val();
				objectiveId = $("input#objectiveId").val();
				assignPerfId = $("input#assignPerfId").val();
				
				//hide group
				if( $('div#hideFrom').text() == "Group" ){
					if( hidefrom == 'hideFromPupil' ){
						$.post("schoolmodule/ajax/ajax_update.php",{action:'hide_group_pupil', groupId: groupId, idpupil: idpupil});
					}
					if( hidefrom == 'hideFromStudygroup' ){
						idstudyGroup = $('#dialog2').children('input#idstudyGroup').val();
						$.post("schoolmodule/ajax/ajax_update.php",{action:'hide_group_studyGroup', groupId: groupId, idstudyGroup: idstudyGroup});
					}
					if( hidefrom == 'hideFromCourse' ){
						idcourse = $('#dialog2').children('input#idcourse').val();
						$.post("schoolmodule/ajax/ajax_update.php",{action:'hide_group_course', groupId: groupId, idcourse: idcourse});
					}
					/*if( hidefrom == 'dontHide' ){
						$.post("schoolmodule/ajax/ajax_update.php",{action:'group_dontHide', groupId: groupId});
					}*/
					$.post("schoolmodule/dhtmlx/myxml/xml.php",{action:"create_xml", pupilId:pupilId, StudyGroupID: StudyGroupID, name_pupil: name_pupil, studygroup_pupil: studygroup_pupil});
					$.post("schoolmodule/ajax/ajax.php",{action:"select_info", pupilId:pupilId, StudyGroupID: StudyGroupID },function(data){
						$('#objective_progress').html(data);
					});
				}
				
				//hide objective
				if( $('div#hideFrom').text() == "Objective" ){
					if( hidefrom == 'hideFromPupil' ){
						$.post("schoolmodule/ajax/ajax_update.php",{action:'hide_obj_pupil', objectiveId: objectiveId, idpupil: idpupil});
						$('.objname2').next('tr').hide();
						$('.objname2').hide();
					}
					if( hidefrom == 'hideFromStudygroup' ){
						idstudyGroup = $('#dialog2').children('input#idstudyGroup').val();
						$.post("schoolmodule/ajax/ajax_update.php",{action:'hide_obj_studyGroup', objectiveId: objectiveId, idstudyGroup: idstudyGroup});
						$('.objname2').next('tr').hide();
						$('.objname2').hide();
					}
					if( hidefrom == 'hideFromCourse' ){
						idcourse = $('#dialog2').children('input#idcourse').val();
						$.post("schoolmodule/ajax/ajax_update.php",{action:'hide_obj_course', objectiveId: objectiveId, idcourse: idcourse});
						$('.objname2').next('tr').hide();
						$('.objname2').hide();
					}
					/*if( hidefrom == 'dontHide' ){
						$.post("schoolmodule/ajax/ajax_update.php",{action:'obj_dontHide', groupId: groupId});
					}*/
					$.post("schoolmodule/dhtmlx/myxml/xml.php",{action:"create_xml", pupilId:pupilId, StudyGroupID: StudyGroupID, name_pupil: name_pupil, studygroup_pupil: studygroup_pupil});
				}
				
				//hide assignment or perfomence
				if( $('div#hideFrom').text() == "assign/perf" ){
					if( hidefrom == 'hideFromPupil' ){
						$.post("schoolmodule/ajax/ajax_update.php",{action:'hide_assignPerf_pupil', assignPerfId: assignPerfId, idpupil: idpupil});
					}
					if( hidefrom == 'hideFromStudygroup' ){
						idstudyGroup = $('#dialog2').children('input#idstudyGroup').val();
						$.post("schoolmodule/ajax/ajax_update.php",{action:'hide_assignPerf_studyGroup', assignPerfId: assignPerfId, idstudyGroup: idstudyGroup});
					}
					if( hidefrom == 'hideFromCourse' ){
						idcourse = $('#dialog2').children('input#idcourse').val();
						$.post("schoolmodule/ajax/ajax_update.php",{action:'hide_assignPerf_course', assignPerfId: assignPerfId, idcourse: idcourse});
					}
					$.post("schoolmodule/dhtmlx/myxml/xml.php",{action:"create_xml", pupilId:pupilId, StudyGroupID: StudyGroupID, name_pupil: name_pupil, studygroup_pupil: studygroup_pupil});
					$.post("schoolmodule/ajax/ajax.php",{action:"select_info", pupilId:pupilId, StudyGroupID: StudyGroupID },function(data){
						$('#objective_progress').html(data);
					});
				}
				
				$(this).dialog("close");
			},
			"Cancel": function() {
				$(this).dialog("close");
			}
		}
	});

	// dialog4 call
	$('#dialog_btn4').click(function(){
		$('#dialog4').dialog('open');			
	});

	// UI-dialog5 code open window with hidden tree
	$('#dialog5').dialog({
		autoOpen: false,
		modal: true,
		width: 360,
		resizable: false,
		buttons: {
			"Update": function() { 
				idpupil = $('#dialog2').children('input:first').val();
				unchecked = tree1.getAllUnchecked();
				checked = tree1.getAllChecked();
				
				//Check all Unchecked check box in tree
				var temp = new Array();
				temp = unchecked.split(',');
				for( i = 0; i < temp.length; i++ ){
					str = temp[i];
					reg = /\s\w+\s\w+/;
					result = str.match(reg);
					
					result = String(result);
					reg2 = /\w+\s/;
					type = result.match(reg2);
					reg3 = /\s\w+\s/;
					id = result.replace(reg3,'');
					
					//hide uncheked item
					if( type == "pupil " )
						$.post("schoolmodule/ajax/ajax_update.php",{action: "hide_pupil", id: id, studyGroupId: $('#idstudyGroup').val()});
					if( type == "group " )
						$.post("schoolmodule/ajax/ajax_update.php",{action: "hide_group", pupilId: idpupil, groupId: id});
					if( type == "obj " )
						$.post("schoolmodule/ajax/ajax_update.php",{action: "hide_objective", pupilId: idpupil, objectiveId: id});
					if( type == "assign " )
						$.post("schoolmodule/ajax/ajax_update.php",{action: "hide_assignment", pupilId: idpupil, assignmentId: id});
					
					/*if need you can uncomment and show or hide all columns
					if( type == 'groupBox ' ) 		hide_group = '1';
					if( type == 'objectiveBox ' )  	hide_objective = '1';
					if( type == 'assignBox ' )		hide_assign = '1';
					if( type == 'unitBox ' )		hide_unit = '1';
					if( type == 'maxBox ' )			hide_max = '1';
					if( type == 'passBox ' )		hide_pass = '1';
					if( type == 'resultBox ' )		hide_result = '1';
					if( type == 'assesmentBox ' )	hide_assesment = '1';*/
					if( type == 'qualityBox ' )		hide_quality = '1';
				//alert("unchek| type = |" + type + "| id = |" +id+ "|");
				}
				
				
				//Check all checked check box in tree
				var temp2 = new Array();
				temp2 = checked.split(',');
				for( j = 0; j < temp2.length; j++ ){
					str2 = temp2[j];
					reg21 = /\s\w+\s\w+/;
					result2 = str2.match(reg21);
					
					result2 = String(result2);
					reg22 = /\w+\s/;
					type2 = result2.match(reg22);
					reg32 = /\s\w+\s/;
					id2 = result2.replace(reg32,'');
					
					//hide cheked item
					if( type2 == "pupil " )
						$.post("schoolmodule/ajax/ajax_update.php",{action: "show_pupil", id: id2});
					if( type2 == "group " )
						$.post("schoolmodule/ajax/ajax_update.php",{action: "show_group", groupId: id2});
					if( type2 == "obj " )
						$.post("schoolmodule/ajax/ajax_update.php",{action: "show_objective", objectiveId: id2});
					if( type2 == "assign " ){
						$.post("schoolmodule/ajax/ajax_update.php",{action: "show_assignment", assignmentId: id2});
					}
					/*if need you can uncomment and show or hide all columns
					if( type2 == 'groupBox ' )		hide_group = '0';
					if( type2 == 'objectiveBox ' )	hide_objective = '0';
					if( type2 == 'assignBox ' )		hide_assign = '0';
					if( type2 == 'unitBox ' )		hide_unit = '0';
					if( type2 == 'maxBox ' )		hide_max = '0';
					if( type2 == 'passBox ' )		hide_pass = '0';
					if( type2 == 'resultBox ' )		hide_result = '0';
					if( type2 == 'assesmentBox ' )	hide_assesment = '0';*/
					if( type2 == 'qualityBox ' )	hide_quality = '0';  // hide quality box 
				//alert("chek| type2 = |" + type2 + "| id2 = |" +id2+ "|");
				}
				
				$.post("schoolmodule/dhtmlx/myxml/xml.php",{action:"create_xml", pupilId:pupilId, StudyGroupID: StudyGroupID, name_pupil: name_pupil, studygroup_pupil: studygroup_pupil});
				$.post("schoolmodule/ajax/ajax.php",{action:"select_info", /*hide_group: hide_group, hide_objective: hide_objective, hide_assign: hide_assign, hide_unit: hide_unit, hide_max: hide_max, hide_pass: hide_pass, hide_result: hide_result, hide_assesment: hide_assesment,*/ hide_quality: hide_quality,  pupilId:pupilId, StudyGroupID: StudyGroupID },function(data){
					$('#objective_progress').html(data);
				});
				
				$(this).dialog("close");
			},
			"Cancel": function() { 
				$(this).dialog("close");
			}
		}
	});

	// dialog5 call create array select all item in tree (view hidden items)
	$('#dialog_btn5').click(function(){
		alltree = tree1.getAllFatItems();
		alltree += tree1.getAllLeafs();
		var temp = new Array();
		temp = alltree.split(',');
		for( i = 0; i < temp.length; i++ ){
			check = temp[i].charAt(0);
			if( check == '1' )
				tree1.setCheck(temp[i],false);
			else
				tree1.setCheck(temp[i],true);
		}
		$('#dialog5').dialog('open');
	});

	// UI-dialog6 code close and update module
	$('#dialog6').dialog({
		autoOpen: false,
		modal: true,
		width: 360,
        title:dlang("change_weight_dialog_module","Change objective weight"),
		resizable: false,
		buttons: {
			"Update": function(){
                $(this).dialog("close");
                var count = weight_grid.getRowsNum()-1;
                weight_grid.forEachRow(function(id){
                    var cObj = id.split(' ');
                    if(weight_grid.getRowIndex(id)==count){
                        if(cObj[1]){
                            $.post("schoolmodule/ajax/ajax_update.php",{action: "edit_weight", id: cObj[1], newValue: weight_grid.cells(id,1).getValue()},function(){
                                $.post("schoolmodule/ajax/ajax.php",{action:"select_info", pupilId:pupilId, StudyGroupID: StudyGroupID },function(data){
                                    $('#objective_progress').html(data);
                                });
                            });
                        }
                    }else{
                        if(cObj[1]){
                            $.post("schoolmodule/ajax/ajax_update.php",{action: "edit_weight", id: cObj[1], newValue: weight_grid.cells(id,1).getValue()},function(){
                            });
                        }
                    }
                });

                //$.post("schoolmodule/dhtmlx/myxml/xml.php",{action:"create_xml", pupilId: 1, StudyGroupID: stg[1], name_pupil: "", studygroup_pupil: ""});


/*
				weight_grid.forEachRow(function(id){
					var cObj = id.split(' ');
					if(cObj[1]){
						$.post("schoolmodule/ajax/ajax_update.php",{action: "edit_weight", id: cObj[1], newValue: weight_grid.cells(id,1).getValue()});
					}
			    });
				//
				$.post("schoolmodule/dhtmlx/myxml/xml.php",{action:"create_xml", pupilId:pupilId, StudyGroupID: StudyGroupID, name_pupil: name_pupil, studygroup_pupil: studygroup_pupil});*/


			},
			"Cancel": function() { 
				$(this).dialog("close");
			}
		}
	});

	// dialog6 call check cell in "change objective weight"
	$('#dialog_btn6').click(function(){

        var ftr = $('.ftr');
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

		rowId = weight_grid.getSelectedRowId();
		indId = weight_grid.getSelectedCellIndex()
						
		weight_grid.attachEvent("onEditCell", doOnEditCell);

        function doOnEditCell(stage,rowId,cellIndex,newValue,oldValue){

            if( (stage == 2) && (newValue != oldValue) ){
                calculateFooterValues();
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

		$('#dialog6').dialog('open');
	});

	//*********************************************************************************************************
	//GROUP MENU
	// attach menu to objective
	/*$('#objective_progress').live('mouseover',function(){
		if( $(this).find('#menu1').is('.block3') ){
			var groupTopScrolls = $('#objective_progress').scrollTop();
			groupTop = parseInt( $('td.group_hide').offset().top );
			//$(this).find('.block3').css({'display':'block','margin-top':'-'+groupTop+'px','margin-left':'25px'});
			
			if( groupTop > 810 ){
				var groupTopScrolls1 = groupTopScrolls + 100;
				$(this).find('div.block3').css({'display':'block','margin-top':'-'+groupTopScrolls1+'px','margin-left':'25px'});
			}else
				$(this).find('div.block3').css({'display':'block','margin-top':'-'+groupTopScrolls+'px','margin-left':'25px'});
		}
	});*/
	
	$('#objective_progress').scroll(function(){
		$('div#menu1').fadeOut(700);
        $('div#menu').fadeOut(700);
		$('td#tdgroup').removeClass('group_hide').addClass('group');
		$('.block3').removeClass('block3');
	});

	// Display menu on group box
	$('td#tdgroup.group').live('click',function(e){

		$('td#tdgroup').removeClass('group_hide').addClass('group');
		$('td#tdgroup').parent().parent().parent().prev('#menu1').css('display','none');
		
		groupTop = parseInt( $(this).offset().top ); // distance from the top of the page element
		groupTopScroll = $('#objective_progress').scrollTop();
		
		if( groupTop > 685 ){
			groupTopScroll1 = groupTopScroll + 100;
			$(this).parent().parent().parent().prev('#menu1').css({'display':'block','margin-top':'-'+groupTopScroll1+'px','margin-left':'25px'}).addClass('block3');
		}else
			$(this).parent().parent().parent().prev('#menu1').css({'display':'block','margin-top':'-'+groupTopScroll+'px','margin-left':'25px'}).addClass('block3');
		
		//$(this).parent().parent().parent().prev('#menu1').css({'display':'block','margin-top':'55px','margin-left':'25px'});
		$(this).removeClass('group').addClass('group_hide');
	});
	// Highlighted group when mouse over
	$('td#tdgroup').live('mouseover',function(){
		$(this).css('background-color','#f8f8f8');
	});
	// Return color when mouse out
	$('td#tdgroup').live('mouseout',function(){
		$(this).css('background-color','#F2F2F2');
	});
	//Hide menu group box left click
	$('td#tdgroup.group_hide').live('click',function(){

		//alert("dfdf");
		$(this).parent().parent().parent().prev('#menu1').css('display','none');
		$('td#tdgroup').removeClass('group_hide').addClass('group');
	});
	//Hide menu group box if mouseout
	$('div#menu1').live("mouseleave",function(){
		setTimeout(
			function(){
				$('div#menu1').hide();
				$('td#tdgroup').removeClass('group_hide').addClass('group');
				$('.block3').removeClass('block3');
			},
			2500
		);
	});
	//Hide group menu if click on some other element
	$(document + ":not(td#tdgroup)").click(function(){
		$('div#menu1').hide();
		$('td#tdgroup').removeClass('group_hide').addClass('group');
		$('div.block3').removeClass('block3');
	});

	// Each item menu on group box
	// Item menu "add group"
	$('#add_group').live('click',function(){
		$('#ui-dialog-title-dialog2').text("Add group");
		$('#dialog2').dialog('open');
		$(this).parent().css('display','none');
		$('td#tdgroup').removeClass('group_hide').addClass('group');
	});
	// Item menu "add objective"
	$('#add_objective').live('click',function(){
		$('#ui-dialog-title-dialog2').text("Add objective to this group");
		groupId = $(this).parent().prev().val();
		$("#groupId").val( groupId );
		$('#dialog2').dialog('open');
		$(this).parent().css('display','none');
		$('td#tdgroup').removeClass('group_hide').addClass('group');
	});
	// Item menu "hide group"
	$('#hide_group').live('click',function(){
		itemName = $(this).attr('alt');
		$('div#itemName').text("Hide group \"" + itemName + "\" from");
		$('div#hideFrom').text("Group");
		groupId = $(this).parent().prev().val();
		$("#groupId").val( groupId );
		$('#dialog4').dialog('open');
		$(this).parent().css('display','none');
		$('td#tdgroup').removeClass('group_hide').addClass('group');
	});
	// Item menu "view hidden"
	$('#view_hidden').live('click',function(){
		alltree = tree1.getAllFatItems();
		alltree += tree1.getAllLeafs();
		var temp = new Array();
		temp = alltree.split(',');
		for( i = 0; i < temp.length; i++ ){
			check = temp[i].charAt(0);
			if( check == '1' )
				tree1.setCheck(temp[i],false);
			else
				tree1.setCheck(temp[i],true);
		}
		$('#dialog5').dialog('open');
		$(this).parent().css('display','none');
		$('td#tdgroup').removeClass('group_hide').addClass('group');
	});
	// delete group
	$('#delete_group').live('click',function(){
		$('#ui-dialog-title-dialog1').text("Delete this group");
		$('#confirmDelete').text("Are you sure that want delete this group?");
		groupId = $(this).parent().prev().val();
		$("#groupId").val( groupId );
		$('#dialog1').dialog('open');
		$(this).parent().css('display','none');
		$('td#tdgroup').removeClass('group_hide').addClass('group');
	});
	//END MENU
	//*********************************************************************************************************
	
	//OBJECTIVE MENU
	// attach menu to objective
	/*$('#objective_progress').live('mouseover',function(){
		if( $(this).find('#menu2').is('.block2') ){
			var objTopScroll = $('#objective_progress').scrollTop();
			objTop = parseInt( $('td.tdobjective_hide').offset().top );
			
			if( objTop > 810 ){
				var objTopScroll1 = objTopScroll + 100;
				$(this).find('div.block2').css({'display':'block','margin-top':'-'+objTopScroll1+'px','margin-left':'25px'});
			}else
				$(this).find('div.block2').css({'display':'block','margin-top':'-'+objTopScroll+'px','margin-left':'25px'});
		}
	});*/
	
	$("#objective_progress").scroll(function(){
		$('div#menu2').fadeOut(700);
		$('td#tdobjective').removeClass('tdobjective_hide').addClass('tdobjective');
		$('div.block2').removeClass('block2');
	});
	
	// Display menu on objective box
	$('td#tdobjective').live('click',function(){
		//$('td#tdobjective').removeClass('tdobjective_hide').addClass('tdobjective');
		$('td#tdobjective').find('#menu2').css('display','none');

		objTop = parseInt( $(this).offset().top );
		objTopScroll = $('div#objective_progress').scrollTop();
		if( objTop > 810 ){
			objTopScroll1 = objTopScroll + 100;
			$(this).find('#menu2').css({'display':'block','margin-top':'-'+objTopScroll1+'px','margin-left':'25px'}).addClass('block2');
		}else
			$(this).find('#menu2').css({'display':'block','margin-top':'-'+objTopScroll+'px','margin-left':'25px'}).addClass('block2');
		
		//$(this).find('#menu2').css({'display':'block','margin-top':'15px','margin-left':'25px'});
		//$(this).removeClass('tdobjective').addClass('tdobjective_hide');
	});
	//Hide menu objective box if mouseout
	$('div#menu2').live("mouseleave",function(){
		setTimeout(
			function(){
				$('div#menu2').hide();
				$('td#tdobjective').removeClass('tdobjective_hide').addClass('tdobjective');
				$('div.block2').removeClass('block2');
			},
			2500
		);
	});
	//Hide objective menu if click anywhere
	$(document + ":not(.tdobjective)").click(function(){
		$('div#menu2').hide();
		$('div.block2').removeClass('block2');
	});
	// Highlighted objective when mouse over
	$('td#tdobjective').live('mouseover',function(){
		$(this).css('background-color','#f8f8f8');
	});
	// Return color when mouse out
	$('td#tdobjective').live('mouseout',function(){
		$(this).css('background-color','#F2F2F2');
	});
	//Hide menu on objective box
	$('td.tdobjective_hide').live('click',function(){
		$(this).find('div#menu2').css('display','none');
		$('td#tdobjective').removeClass('tdobjective_hide').addClass('tdobjective');
	});

	// Each item menu on objective box
	//Change objective weight
    $('div#go_to_objective').live('click',function(){
        var str = 'course_objectives.php#tab=second-menu_course_objectives/search=1/objective='+$(this).parent().prev().attr('value');

        window.location.href = str;
        //window.location.reload(true);
        //return true;
        setTimeout(function(){
            tabbar.setActiveTab('second-menu_course_objectives');
        },1000);

        //tabbar.setActiveTab('second-menu_course_objectives');
    });

	$('div#obj_weight').live('click',function(){
        $.post("schoolmodule/dhtmlx/myxml/xml.php",{action:"create_xml", pupilId:pupilId, StudyGroupID: StudyGroupID, name_pupil: name_pupil, studygroup_pupil: studygroup_pupil},function(){
        weight_grid.clearAndLoad("schoolmodule/dhtmlx/myxml/dialog_grid.xml?time="+(new Date()).getTime(),function(){
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

            var rowId = weight_grid.getSelectedRowId();
            var indId = weight_grid.getSelectedCellIndex()

            weight_grid.attachEvent("onEditCell", doOnEditCell);
            function doOnEditCell(stage,rowId,cellIndex,newValue,oldValue){
                if( (stage == 2) && (newValue != oldValue) ){
                    calculateFooterValues();
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
            $('#dialog6').dialog('open');
            //$('td#tdobjective').removeClass('tdobjective_hide').addClass('tdobjective');
        });
        });


	});

	// Add new assignment
	$('div#add_assignment').live('click',function(){
		$('#ui-dialog-title-dialog3').text("Add assignment");
		objectiveId = $(this).parent().prev().val();
		$('#objectiveId').val( objectiveId );
		$('div#menu2').hide();
		$('#dialog3').dialog('open');
		$('td#tdobjective').removeClass('tdobjective_hide').addClass('tdobjective');
	});
	// Add new perfomence
	$('div#add_perfomence').live('click',function(){
		$('#ui-dialog-title-dialog3').text("Add perfomence");
		objectiveId = $(this).parent().prev().val();
		$('#objectiveId').val( objectiveId );
		$('div#menu2').hide();
		$('#dialog3').dialog('open');
		$('td#tdobjective').removeClass('tdobjective_hide').addClass('tdobjective');
	});
	//Hide this objective
	$('div#hide_objective').live('click',function(){
		$(this).parent().parent().parent().addClass('objname2');
		itemName = $(this).attr('alt');
		$('div#itemName').text("Hide objective \"" + itemName + "\" from");
		$('div#hideFrom').text("Objective");
		objectiveId = $(this).parent().prev().val();
		$('#objectiveId').val( objectiveId );
		$('div#menu2').hide();
		$('#dialog4').dialog('open');
		$('td#tdobjective').removeClass('tdobjective_hide').addClass('tdobjective');
	});
	// delete objective
	$('#delete_objective').live('click',function(){
		$('#ui-dialog-title-dialog1').text("Delete this objective");
		$('#confirmDelete').text("Are you sure that want delete this objective?");
		objectiveId = $(this).parent().prev().val();
		$('#objectiveId').val( objectiveId );
		$('div#menu2').hide();
		$('#dialog1').dialog('open');
		$('td#tdobjective').removeClass('tdobjective_hide').addClass('tdobjective');
	});
	//END MENU
	//*********************************************************************************************************
	
	//ASSIGNMENT/PERFOMENCE MENU
	// attach menu to assignment
	/*$('#objective_progress').live('mouseover',function(){
		if( $(this).find('#menu3').is('.block') ){
			var assignTopScroll = $('#objective_progress').scrollTop();
			var assignTop = parseInt( $("td.objectiveName_hide").offset().top );
			
			if( assignTop > 860 ){
				var assignTopScroll1 = assignTopScroll + 100;
				$(this).find('td.objectiveName_hide').children('div.block').css({'display':'block','margin-top':'-'+assignTopScroll1+'px','margin-left':'15px'});
			}else
				$(this).find('div.block').css({'display':'block','margin-top':'-'+assignTopScroll+'px','margin-left':'15px'});
		}
	});*/
	$("#objective_progress").scroll(function(){
		$('div#menu3').fadeOut(700);
		$('td#objectiveName').removeClass('objectiveName_hide').addClass('objectiveName');
		$('div.block').removeClass('block');
	});
	// Display menu on assignment/perfomence box
	$('td#objectiveName').live('click',function(){
		//$('td#objectiveName').removeClass('objectiveName_hide').addClass('objectiveName');
		//$('td#objectiveName').find('#menu3').css('display','none');

		assignTop = parseInt( $(this).offset().top );
		assignTopScroll = $('#objective_progress').scrollTop();
        $(this).find('#menu3').css({'display':'block'});
/*		if( assignTop > 860 ){
			var assignTopScroll1 = assignTopScroll + 100;
			$(this).find('#menu3').css({'display':'block','margin-top':'-'+assignTopScroll1+'px','margin-left':'15px'}).addClass('block');
		}else
			$(this).find('#menu3').css({'display':'block','margin-top':'-'+assignTopScroll+'px','margin-left':'15px'}).addClass('block');
		*/
		//$(this).removeClass('objectiveName').addClass('objectiveName_hide');
	});
	//Hide menu assignment/perfomence box if mouseout
	$('div#menu3').live("mouseleave",function(){
		setTimeout(
			function(){
				$('div#menu3').hide();
				$('td#objectiveName').removeClass('objectiveName_hide').addClass('objectiveName');
				$('div.block').removeClass('block');
			},
			2500
		);
	});
	//Hide assignment/perfomence menu if click on some other element
	$(document + ":not(#objectiveName)").click(function(){
		$('div#menu3').hide();
		$('div.block').removeClass('block');
	});
	// Highlighted assignment/perfomence when mouse over
	$('td#objectiveName').live('mouseover',function(){
		$(this).css('background-color','#f8f8f8');
	});
	//return color
	$('td.perfomenceHighlight').live('mouseover',function(){
		$(this).css('background-color','#f8f8f8');
		$(this).parent().find('td#perfomHighlight').css('background-color','#f8f8f8');
	});

	//hifhlighted perfomence on unit max pass result box
	$('.perfomHighlight').live('mouseover',function(){
		$(this).parent().parent().parent().parent().prev().css('background-color','#f8f8f8');
		$(this).css('background-color','#f8f8f8');
	});
	//return color
	$('.perfomHighlight').live('mouseout',function(){
		$(this).parent().parent().parent().parent().prev().css('background-color','#F2F2F2');
		$(this).css('background-color','#F2F2F2');
	});


	// Return color when mouse out
	$('td#objectiveName').live('mouseout',function(){
		o = $(this);
		if( $(o).find('#value').val() == "perfomence" ){
			$(o).css('background-color','#F2F2F2');
			$(this).parent().find('td#perfomHighlight').css('background-color','#F2F2F2');
		}else
			$(o).css('background-color','#F2F2F2');
	});
	//hide menu on assignmen/perfomence box
	$('td.objectiveName_hide').live('click',function(){
		$(this).find('#menu3').css('display','none');
		$('td#objectiveName').removeClass('objectiveName_hide').addClass('objectiveName');
	});

	// hide this assignment/perfomence
	$('div#hide_assin_perf').live('click',function(){
		$('div#itemName').text("Hide this assignment/perfomence from");
		$('div#hideFrom').text("assign/perf");
		assignPerfId = $(this).parent().prev().prev().val();
		$('#assignPerfId').val( assignPerfId );
		$('div#menu3').hide();
		$('#dialog4').dialog('open');
		$('td#objectiveName').removeClass('objectiveName_hide').addClass('objectiveName');
	});
	// delete assignment/perfomence
	$('#delete_assign').live('click',function(){
		$('#ui-dialog-title-dialog1').text("Delete this assignment/perfomence");
		$('#confirmDelete').text("Are you sure that want delete this assignment/perfomence?");
		assignPerfId = $(this).parent().prev().prev().val();
		$('#assignPerfId').val( assignPerfId );
		$('div#menu3').hide();
		$('#dialog1').dialog('open');
		$('td#objectiveName').removeClass('objectiveName_hide').addClass('objectiveName');
	});
	//END MENU
	//*********************************************************************************************************

	// MEBU CHANGE RESULT

	// Highlighted result when mouse over on unit pass ....
	/*$('td.unit').live('mouseover',function(){
		$(this).parent().find('td.unit').css('background-color','#fcfcfc');
		$(this).parent().find('.tdresult').css('background-color','#fcf3cf');
		//$(this).parent().parent().parent().prev().css('background-color','#fcfcfc');
	});
	// Return color when mouse out on unit pass ....
	$('td.unit').live('mouseout',function(){
		$(this).parent().find('td.unit').css('background-color','#F2F2F2');
		$(this).parent().find('.tdresult').css('background-color','#f5e8b3');
		//$(this).parent().parent().parent().prev().css('background-color','#F2F2F2');
	});*/

	// Highlighted result when mouse over on result box
	$('td.tdresult').live('mouseover',function(){
        if(schoolmule.main.user_role=='staff' || schoolmule.main.user_role=='superadmin'){
            $(this).css('background-color','#fcf3cf');
        }
		//$(this).parent().find('td.unit').css('background-color','#fcfcfc');

		//$(this).parent().parent().parent().prev().css('background-color','#fcfcfc');
	});
	// Return color when mouse out on result box
	$('td.tdresult').live('mouseout',function(){
        if(schoolmule.main.user_role=='staff' || schoolmule.main.user_role=='superadmin'){
            $(this).css('background-color','#f5e8b3');
        }
		//$(this).parent().find('td.unit').css('background-color','#F2F2F2');

		//$(this).parent().parent().parent().prev().css('background-color','#F2F2F2');
	});

	// Highlighted box when mouse over on unit pass ....
	/*$('td.unit').live('mouseover',function(){
		//$(this).parent().find('td.unit').css('background-color','#fcfcfc');
		//$(this).parent().find('.tdresult').css('background-color','#fcf3cf');
		//$(this).parent().parent().parent().prev().css('background-color','#fcfcfc');
		$(this).css('background-color','#fcfcfc');
	});
	// Return color when mouse out on unit pass ....
	$('td.unit').live('mouseout',function(){
		//$(this).parent().find('td.unit').css('background-color','#F2F2F2');
		//$(this).parent().find('.tdresult').css('background-color','#f5e8b3');
		//$(this).parent().parent().parent().prev().css('background-color','#F2F2F2');
		$(this).css('background-color','#F2F2F2');
	});

	// Highlighted result box when mouse over on unit pass ....
	$('td.tdresult').live('mouseover',function(){
		$(this).css('background-color','#fcf3cf');
	});
	$('td.tdresult').live('mouseout',function(){
		$(this).css('background-color','#f5e8b3');
	});*/


	//Highlighted no Evalution
	$('td#noEvalution').live('mouseover',function(){
		if( $(this).attr('title') != 'No evaluation' )
			$(this).css('background-color','#fcfcfc');
		//$(this).parent().parent().parent().parent().prev().css('background-color','#fcfcfc');
	});
	// Return color when mouse out
	$('td#noEvalution').live('mouseout',function(){
		$(this).css('background-color','#DDDDDD');
		//$(this).parent().parent().parent().parent().prev().css('background-color','#F2F2F2');
	});

	/*$('td.unit').live('mouseover',function(){
		$(this).css('background-color','#fcfcfc');
	});
	$('td.unit').live('mouseout',function(){
		$(this).css('background-color','#F2F2F2');
	});

	$('td.tdresult').live('mouseover',function(){
		$(this).css('background-color','#fcf3cf');
	});
	$('td.tdresult').live('mouseout',function(){
		$(this).css('background-color','#f5eab2');
	});*/

	// UI-dialog7 code open window change result
	
	function tableUpdate(){
		$.post("schoolmodule/ajax/ajax.php",{action:"select_info", pupilId:pupilId, StudyGroupID: StudyGroupID },function(data){
			$('#objective_progress').html(data);
		});		
	}

	$('#dialog7').dialog({
		autoOpen: false,
		modal: true,
		width: 300,
		resizable: false,
        buttons: [
            {
                text:dlang("progress_result_update_button","Update"),
                click:function(){
                    newValue = $('#new-result').val();
                    resultUnit = $("select#resultUnit :selected").val();

                    maxColum =  $('#max_value').val();
                    passColum = $('#pass_value').val();
                    runit = parseInt($('#runit_type').val());
                    submission_result = parseInt($('#submission_result').val());

                    resultId = $('input#resultId2').val();
                    assignPerfId = $('#assignPerfId').val();
                    assessmentType = $('#assessmentType').val();

                    $('input#resultUnitSelected').val(resultUnit);
                    var self = this;

                    var grades = ['A','B','C','D','E','F','FX'];
                    var pass;
                    var alert_text = dlang("module_invalid_value_alert","Invalid Result");

                    var server_script = "connectors/connector.php?control_id=grid_assess_assignments";

                    switch (runit){
                        case 1:
                            var val = parseInt(newValue);
                            if(!isNaN(val) && val<=parseInt(maxColum)){
                                if(val<parseInt(passColum)){
                                    pass = 0;
                                }else{
                                    pass = 1;
                                }
                                $.post(server_script, {action:"editresult", id:submission_result, value:val+'p', pass:pass}, function(){
                                    $(self).dialog("close");
                                    tableUpdate()
                                });
                                return true;
                            }
                            alert(alert_text);
                            return true;
                            break;
                        case 2:
                            var val = parseInt(newValue);
                            if(!isNaN(val) && val <=100 && val<=parseInt(maxColum)){
                                if(val<parseInt(passColum)){
                                    pass = 0;
                                }else{
                                    pass = 1;
                                }
                                $.post(server_script, {action:"editresult", id:submission_result, value:val+'%', pass:pass}, function(){
                                    $(self).dialog("close");
                                    tableUpdate()
                                });
                                return true;
                            }
                            alert(alert_text);
                            return true;
                            break;
                        case 3:
                            var val = newValue.toUpperCase();
                            if(grades.join().search(val) != -1 && grades.join().search(val)>=grades.join().search(maxColum)){
                                if(grades.join().search(val)>=grades.join().search(passColum)){
                                    pass = 0;
                                }else{
                                    pass = 1;
                                }
                                $.post(server_script, {action:"editresult", id:submission_result, value:val, pass:pass}, function(){
                                    $(self).dialog("close");
                                    tableUpdate()
                                });
                                return true;
                            }
                            alert(alert_text);
                            return true;
                            break;
                        case 4:
                            var val = newValue;
                            if(val == dlang("passvalue","Pass") || val ==dlang("npassvalue","NPass")){
                                if(val!=dlang("passvalue","Pass")){
                                    pass = 0;
                                }else{
                                    pass = 1;
                                }
                                $.post(server_script, {action:"editresult", id:submission_result, value:val, pass:pass}, function(){
                                    $(self).dialog("close");
                                    tableUpdate()
                                });
                                return true;
                            }
                            alert(alert_text);
                            return true;
                            break;
                    }


                    //alert( $('#assessmentType').val() )
                    /*if( $('#evalution').val() == 'Noevalution' ){
                     $.post('ajax/change_result.php',{action: "change_result_noVal", assessmentType: assessmentType, assignPerfId: assignPerfId, resultId: resultId, newValue: newValue, resultUnit: resultUnit, maxColum: maxColum, passColum:passColum});
                     }else*/ /*if( $('#assessmentType').val() == 'No evaluation' && resultUnit != "No evaluation" ){
                     $.post('schoolmodule/ajax/change_result.php',{action: "change_result_assesmentNov_evaluation", assessmentType: assessmentType, assignPerfId: assignPerfId, resultId: resultId, newValue: newValue, resultUnit: resultUnit, maxColum: maxColum, passColum:passColum, pupilId:pupilId}, tableUpdate);
                     }else if( $('#assessmentType').val() == 'No evaluation' ){
                     $.post('schoolmodule/ajax/change_result.php',{action: "change_result_resUnitNov_evaluation", assessmentType: assessmentType, assignPerfId: assignPerfId, resultId: resultId, newValue: newValue, resultUnit: resultUnit, maxColum: maxColum, passColum:passColum ,pupilId:pupilId}, tableUpdate);
                     }else{
                     $.post('schoolmodule/ajax/change_result.php',{action: "change_result", assessmentType: assessmentType, assignPerfId: assignPerfId, resultId: resultId, newValue: newValue, resultUnit: resultUnit, maxColum: maxColum, passColum:passColum ,pupilId:pupilId}, tableUpdate);
                     }*/
                    $(this).dialog("close");
                }
            },
            {
                text:dlang("progress_result_button_cancel","Cancel"),
                click:function(){
                    $(this).dialog("close");
                }
            }
        ]
	});

	//check the new value
	/*$('#new-result').live('keyup',function(){
		newValue = $(this).val();
		selectVal = $("select#resultUnit :selected").val();
		if( selectVal == "Grade" && newValue != 'A' && newValue != 'B' && newValue != 'C' && newValue != 'D' && newValue != 'E' && newValue != 'F' ){
			$(this).css('color','#ababab');
			$(this).parent().parent().next().children().children('button:first').css('color','#ababab');
		}else{
			$(this).css('color','#424242');
			$('button.ui-button').css('color','#424242');
		}
	});*/

	//add new custom resul unit
	$('.button').live('click',function(){
	/*
		idpupil = $('#dialog2').children('input:first').val();
		newUnit = $(this).prev().val();
		if( newUnit == '' ){
			alert('Enter name!');
		}else{
			$.post('ajax/change_result',{action: "add_new_resUnit", pupilId: idpupil, newUnit: newUnit})
			$.post("schoolmodule/ajax/change_result.php",{action: "select", pupilId: idpupil},function(data){
				$('select#resultUnit').html(data);
			});
		}
		*/
	});

    $('.go_to_assignment').live("click",function(){
        //tabbar.setActiveTab('second-menu_assignmrnts_and_performance');
        var str = 'course_objectives.php#tab=second-menu_assignmrnts_and_performance/itemid='+$(this).parent().parent().prevAll('#assignPerfId').val()+'/itemtype=assignment/search=1';
        window.location.href = str;
        //window.location.reload(true);
        setTimeout(function(){
            tabbar.setActiveTab('second-menu_assignmrnts_and_performance');
        },1000);

        return true;
    });

    $('.go_to_performance').live("click",function(){
        //tabbar.setActiveTab('second-menu_assignmrnts_and_performance');
        var str = 'course_objectives.php#tab=second-menu_assignmrnts_and_performance/itemid='+$(this).parent().parent().prevAll('#assignPerfId').val()+'/itemtype=performance/search=1';
        window.location.href = str;
        //window.location.reload(true);
        setTimeout(function(){
            tabbar.setActiveTab('second-menu_assignmrnts_and_performance');
        },1000);

        return true;
    });

	// dialog7 call click on cell
	//$('td#callChangeResult').live("click",function(){


	$('td.tdresult').live("click",function(){

		oldValue = $.trim($(this).parent().find('.tdresult').text());
		unit = $(this).parent().find('.tdunit').text();

		maxColum = $(this).parent().find('.tdmax').text();
		passColum = $(this).parent().find('.tdpass').text();
		resultId = $(this).parent().find('#resultId').text();
		assignPerfId = $(this).parent().parent().parent().prev().val();
		resultUnit = $(this).prev().prev().prev().attr('title');

		$('#assignPerfId').val( assignPerfId );
		$('#resultId2').val( resultId );
		$('#old-result').val( oldValue );


        var type = $(this).parent().find('#runit_id').text()
        $('#max_value').val( maxColum );
        $('#pass_value').val( passColum );
        $('#runit_type').val( type);
        $('#submission_result').val( $(this).parent().find('#submission_result').text() );

        if(type == '3'){
            var item = $('#new-result').parent();
            item.empty();

            item.append('<select id="new-result" class="" value="'+oldValue+'">' +
                '<option  value="A">A</option>' +
                '<option  value="B">B</option>' +
                '<option  value="C">C</option>' +
                '<option  value="D">D</option>' +
                '<option  value="E">E</option>' +
                '<option  value="F">F</option>' +
                '<option  value="Fx">Fx</option>' +
            '</select>');

            item.find('[value='+oldValue+']').attr("selected", "selected");

            item.css({
                height:'auto'
            })

            $('#old-result').height(14);
            $('#old-result').parent().height(14);
            $('#old-result').width(34);
        }

        if(type == '4'){
            var item = $('#new-result').parent();
            item.empty();

            item.append('<select id="new-result" class="">' +
                '<option  value="'+dlang("passvalue","Pass")+'">'+dlang("passvalue","Pass")+'</option>' +
                '<option  value="'+dlang("npassvalue","NPass")+'">'+dlang("npassvalue","NPass")+'</option>' +
                '</select>');

            item.css({
                height:'auto'
            });

            $('#old-result').height(14);
            $('#old-result').parent().height(14);
            $('#old-result').width(65);
        }

        if(type == '1' || type == '2'){
            var item = $('#new-result').parent();
            item.empty();

            item.append('<textarea id="new-result" style="width: 275px; height: 58px;" name="new-result" title="'+dlang("change_res_module_dialog_new","New result")+'" ></textarea>');

            $('#old-result').css({
                width: 275, height: 58, 'text-align': 'left', overflow:'hidden'
            });

            $('#old-result').parent().height(58);

/*            item.css({
                height:'auto'
            });

            $('#old-result').height(14);
            $('#old-result').parent().height(14);
            $('#old-result').width(65);*/
        }
		//$('#max').val( maxColum );
		//$('#pass').val( passColum );
		$('#max').text( maxColum );
		$('#pass').text( passColum );
		$('.resultUnit').text( resultUnit );
		idpupil = $('#dialog2').children('input:first').val();
		$.post("schoolmodule/ajax/change_result.php",{action: "select", pupilId: idpupil},function(data){
			$('select#resultUnit').html(data);
			
			/*$('select#resultUnit option').each(function(){
				pastResult = $('input#resultUnitSelected').val();
				if( $(this).val() == pastResult )
					$(this).attr('selected','selected');
			});*/
			$("select#resultUnit [value='"+unit+"']").attr('selected','selected');
		});
		
		//$("select#resultUnit [value='"+unit+"']").attr('selected','selected');
		$('#dialog7').dialog('open');
	});
	// click on "No evalution" and add result
	$('td#noEvalution').live('click',function(){

		assignPerfId = $(this).parent().parent().parent().prev().val();
		idpupil = $('#dialog2').children('input:first').val();
		//alert(assignPerfId)
		$.post("schoolmodule/ajax/change_result.php",{action: "select", pupilId: idpupil},function(data){
			$('select#resultUnit').html(data);
		});
		$('#evalution').val( "Noevalution" );
		$('#assignPerfId').val( assignPerfId );
		$('#dialog7').dialog('open');
	});
	//click on new assignment and add result
	$('#emptyResult').live('click',function(){

		isornot = $(this).find('table#table_unit').html(); // check or assignment have units
		
		if( !isornot ){
			idpupil = $('#dialog2').children('input:first').val();
			$.post("schoolmodule/ajax/change_result.php",{action: "select", pupilId: idpupil},function(data){
				$('select#resultUnit').html(data);
			});
			assignPerfId = $(this).find('input#assignPerfId').val();
			$('#assignPerfId').val( assignPerfId );
			$('#dialog7').dialog('open');
		}
	});

    $('.not_submitted_unit').live('click',function(){
        var field = $(this).find('.quality_assesment');
        field.css({
            margin:'0 0 0 -6px'
        });
        field.show();
        var itempos = field.offset().top + field.height();
        var mainpos =  $("#objective_progress").offset().top + $("#objective_progress").height();
        if(itempos>mainpos-5){
            field.css('margin-top',-(field.height()+3));
        }
    })

	// dialog7 call button
	$('#dialog_btn7').click(function(){
		$('#selectresultunit').width(158);
		$('#dialog7').dialog('open');
	});
	//END MENU CHENGE RESULT

	//highlight on assesment box when mouse over
	/*$('.tdassesment').live('mouseover',function(){
		$(this).css('opacity','0.8');
	});
	$('.tdassesment').live('mouseout',function(){
		$(this).css('opacity','1');
	});*/

	//highlight on assesment box when mouse over
	$('#highlightAssesment').live('mouseover',function(){
        if(schoolmule.main.user_role=='staff' || schoolmule.main.user_role=='superadmin'){
            if( $(this).text() == "F" || $(this).text() == dlang("npassvaluesmall","N") || $(this).text() == 'np')
                $(this).css('background-color','#f2928e');
            else
                $(this).css('background-color','#519651');
        }
	});
	$('#highlightAssesment').live('mouseout',function(){
        if(schoolmule.main.user_role=='staff' || schoolmule.main.user_role=='superadmin'){
            if( $(this).text() == 'F' || $(this).text() == 'np' || $(this).text() == dlang("npassvaluesmall","N") )
                $(this).css('background-color','#f4726d');
            else
                $(this).css('background-color','green');
        }
	});
	$('#highlightAssesmentYellow').live('mouseover',function(){
        if(schoolmule.main.user_role=='staff' || schoolmule.main.user_role=='superadmin'){
            $(this).parent().find('td#highlightAssesmentYellow').each(function(){
                $(this).css('background-color','#fcf3cf');
            });
        }
	});
	$('#highlightAssesmentYellow').live('mouseout',function(){
        if(schoolmule.main.user_role=='staff' || schoolmule.main.user_role=='superadmin'){
            $(this).parent().find('td#highlightAssesmentYellow').each(function(){
                $(this).css('background-color','#f5e8b3');
            });
        }
	});


	//highlight assesment box for perfomence
	$('td.new_assesment').live('mouseover',function(){
		$(this).css('background-color','#519651');
	});
	$('td.new_assesment').live('mouseout',function(){
		$(this).css('background-color','green');
	});
	
	var a;
	var b;
	var obj_h;
	//hide and show assigns and perfomences
	$('.toggleAssgnPerfHide').live('click',function(){
		$(this).removeClass('toggleAssgnPerfHide').addClass('toggleAssgnPerfShow');
		
		var arrStr = '';
		min = 99999;
		minH = 99999;
		minObj = 0;
		$('.objname').each(function(){
			weight = parseInt($(this).find('span.objWeight').text());
		
			if( weight < min ){
				min = weight;
				minHeight = 78;
				minObj = $(this);
			}
		});
		
		
		$('.tdassignHideShow').hide();
		$('.tdassign').each(function(){
			$(this).hide();
			a=$(this).prev().width();
			b=$('.tdobjective2').width();
			$(this).prev().width('84%');
			$('.tdobjective2').width('84%');
            $('.tdquality').width('26%');
		});
		
		$('.objname').each(function(){
			weight = $(this).find('span.objWeight').text();
			obNewH = weight*(minHeight/min);
			obj_h = $(this).height();
			$(this).find('.obj_height').val(obj_h);
			$(this).height(obNewH);
		});
		
		minObj.height(minHeight);
	});
	
	$('.toggleAssgnPerfShow').live('click',function(){
		$(this).removeClass('toggleAssgnPerfShow').addClass('toggleAssgnPerfHide');
		$('.tdassignHideShow').show();
		$('.tdassign').each(function(){
			//widthTd = $(this).prev().attr('width');
			//$(this).prev().width(widthTd);
			$(this).prev().width(a);
			$('.tdobjective').width("16.1%");
			$(this).show();
		});
		
		$('.objname').each(function(){
			var el = $(this);
			el.height(el.find('.obj_height').val());
		});
			//objectiveWeight();
			//heightAssignment();
	});

});
