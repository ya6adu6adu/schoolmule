var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

var last_defined = "";
schoolmule.instances.grid_setup_database = new schoolmule.controls.grid({		
			id: "grid_setup_database",
			gridImagePath:"dhtmlx/dhtmlxGrid/codebase/imgs/",
			menuIconsPath:"dhtmlx/dhtmlxMenu/codebase/imgs/dhxmenu_dhx_web/",

			dp:false,
			
			addRow: function(rId,cn,dhx){			
			},
			
			selectRow: function(ind,id,dhx,options,f,funcs,pid){

			},
			
			openTree: function(id,dhx,state,pid){		
			},
			
			beforeSelectRow: function(id,dhx,keysel){
				return true;
			},
			setConfig: function(mygrid,script,id){
				mygrid.setHeader(','+dlang('Db item')+','+dlang('Content')+','+dlang('Added')+','+dlang('Login username')+','+dlang('Password')+','+dlang('')+','+dlang('Portrait')+','+dlang('Course')+','+dlang('Points')+','+dlang('Startdate')+','+dlang('Enddate'));
				mygrid.setInitWidthsP("1.7,39,5,6,10.3,10,0,4,6,6,6,6");
				mygrid.setColTypes("ch,tree,ro,ro,ed,ed,ro,img,ed,ed,dhxCalendar,dhxCalendar");
				mygrid.enableTooltips("false,false,false,false,false, false, false, false,false,false,false,false");
                mygrid.setColAlign("left,left,left,left,left,left,left,center,left,left,left,left");
                mygrid.enableAutoHeight(false);
				mygrid.enableTreeCellEdit(true);
                mygrid.setDateFormat("%Y-%m-%d");
				mygrid.enableEditEvents(false, true, true);
				mygrid.kidsXmlFile = script;
				mygrid.loadXML(script);
                $("body").append('<img class="temp_user_image" style="display:none; position:absolute;" />');
			},
			
			showMenu: function(id){
				return true;
			},
			
			load: function(){

			},
            mouseOver: function(rId,cInd){

                if(cInd==7){
                    var grid = schoolmule.instances.grid_setup_database.getGrid().grid;
                    var cell = grid.cells(rId,7);
                    if(cell.getValue()!=""){
                        var td = cell.cell;
                        var img = $(td).find('img');
                        if(!img.hasClass('big_image')){
                            var user = grid.getUserData(rId,'user');
                            $(img).attr("id","big_"+user);
                            $(img).addClass("big_image");
                            $(img).hover(
                                function (e) {
                                    var src =  $(this).attr('src');
                                    setTimeout(function(){
                                        var popim = $(".temp_user_image");

                                        if(!(src.indexOf('default')+1)){
                                            popim.attr("src",src.replace('small','big'));
                                            popim.css({
                                                top:e.pageY+'px',
                                                left:e.pageX+'px'
                                            });
                                            popim.show();
                                        }
                                    },300);
                                },
                                function (e) {
                                    var src =  $(this).attr('src');
                                    setTimeout(function(){
                                        if(!(src.indexOf('default')+1)){
                                          $(".temp_user_image").hide();
                                        }
                                    },300);
                                }
                            );
                        }
                    }
                }
            },
            rowDblClicked: function(rId,cInd){
                var grid = schoolmule.instances.grid_setup_database.getGrid().grid;
                var row = rId.split('_');
                if(cInd == 7 && _.indexOf(["pupil","staffmember","parent"],row[0]) != -1){
                    var upload_form = null;
                    var uploader = null;
                    var upload_dialog = new schoolmule.controls.window_popup(
                        {
                            title: "Upload photo",
                            width: "365px",
                            height: "200px",
                            buttons: {
                                "Upload": function() {
                                    uploader.upload();
                                },
                                "Close": function() {
                                    upload_dialog.win_dialog.dialog("destroy");
                                    upload_dialog.win_dialog.remove();
                                }

                            },

                            onBeforeShow: function(container){
                                formData = [
                                    {
                                        type: "label", label: "Upload portrait of user 49 x 59 pix in size"
                                    },
                                    {
                                    type: "fieldset",
                                    label: "Uploader",
                                    list: [{
                                        type: "upload",
                                        name: "myPhoto",
                                        inputWidth: 330,
                                        width: 300,
                                        titleScreen: true,
                                        _swfLogs: "enabled",
                                        swfPath: "dhtmlx/dhtmlxFrom/codebase/ext/uploader.swf"
                                    }]
                                }];

                                var portrait_uploader = new dhtmlXForm(container,formData);
                                portrait_uploader.setSkin("dhx_terrace");
                                uploader = portrait_uploader.getUploader("myPhoto");
                                var user = grid.getUserData(rId,'user');
                                uploader.setURL("libs/item_upload.php?id="+user);
                                portrait_uploader.attachEvent("onUploadFile",function(realName,serverName){
                                    grid.cells(rId,7).setValue('images/users/small_'+user+'.jpg');
                                    uploader.clear();
                                    upload_dialog.win_dialog.dialog("destroy");
                                    upload_dialog.win_dialog.remove();
                                });
                            }
                        }
                    );

                    upload_dialog.show({
                        container: "massage_box"
                    });
                }
                return true;
            },

			editCell: function(stage,rId,cInd,nValue,oValue,grid,tree_obj,pid){
                var grid = schoolmule.instances.grid_setup_database.getGrid().grid;
                var row = rId.split('_');
                if(stage == 0){
                    switch(cInd){
                        case 4:
                            if(_.indexOf(["pupil","staffmember","parent"],row[0]) == -1)
                                return false;
                            break;
                        case 5:
                            if(_.indexOf(["pupil","staffmember","parent"],row[0]) == -1)
                                return false;
                            break;
                        case 8:
                            if(row[0] != 'studygroup')
                                return false;
                            break;
                        case 9:
                            if(row[0] != 'studygroup')
                                return false;
                            break;
                        case 10:
                            if(row[0] != 'studygroup')
                                return false;
                            break;
                        case 11:
                            if(row[0] != 'studygroup')
                                return false;;
                            break;
                    }
                }
                if(stage == 1){
                    switch(cInd){
                        case 0:
                            if(grid.hasChildren(rId)){
                                grid.openItem(rId);
                                var checked = grid.getAllSubItems(rId).split(',');
                                for(var i = 0; i < checked.length; i++){
                                    grid.openItem(checked[i]);
                                    grid.cells(checked[i], 0).setValue(grid.cells(rId,0).isChecked());
                                }
                            }
                            if(!grid.cells(rId,0).isChecked()){
                                var cuppent_item = grid.getParentId(rId);
                                while(cuppent_item){
                                    grid.cells(cuppent_item, 0).setValue(0);
                                    cuppent_item = grid.getParentId(cuppent_item);
                                }
                            }
                            break;
                        case 1:
                            var cell = grid.cells(rId,1).cell;
                            $(cell).find("input").val($.trim($(cell).find("input").val().split(':')[1]));
                            break;
                    }

                }
                if(stage == 2){
                    switch(cInd){
                        case 1:
                            if(nValue.length > 1 && oValue!=nValue){
                                switch(row[0]){
                                    case "programme":
                                        $.post("connectors/connector.php?control_id=grid_setup_database", {
                                            action:"editprogramme",
                                            name: nValue,
                                            id: row[1]
                                        }, function(res){
                                            grid.cells(rId,1).setValue("Programme: "+nValue);
                                        });
                                        break;
                                    case "studygroup":
                                        $.post("connectors/connector.php?control_id=grid_setup_database", {
                                            action:"editstudygroup",
                                            name: nValue,
                                            id: row[1]
                                        }, function(res){
                                            grid.cells(rId,1).setValue("Studygroup: "+nValue);
                                        });
                                        break;
                                    case "staffmember":
                                        $.post("connectors/connector.php?control_id=grid_setup_database", {
                                            action:"editstaff",
                                            name: nValue,
                                            id: row[1]
                                        }, function(res){
                                            grid.cells(rId,1).setValue(nValue);
                                        });
                                        break;
                                    case "pupil":
                                        $.post("connectors/connector.php?control_id=grid_setup_database", {
                                            action:"editpupil",
                                            name: nValue,
                                            id: row[1]
                                        }, function(res){
                                            grid.cells(rId,1).setValue(nValue);
                                        });
                                        break;
                                    case "parent":
                                        $.post("connectors/connector.php?control_id=grid_setup_database", {
                                            action:"editparent",
                                            name: nValue,
                                            id: row[1]
                                        }, function(res){
                                            grid.cells(rId,1).setValue(nValue);
                                        });
                                        break;
                                    case "pupilgroup":
                                        $.post("connectors/connector.php?control_id=grid_setup_database", {
                                            action:"editpupilgroup",
                                            name: nValue,
                                            id: row[1]
                                        }, function(res){
                                            grid.cells(rId,1).setValue("Pupilgroup: "+nValue);
                                        });
                                        break;
                                }
                            }else{
                                return false;
                            }
                            break;
                        case 4:
                            if(nValue.length > 1 && oValue!=nValue){
                                nValue = nValue.replace(new RegExp(",",'g'),"");
                                nValue = nValue.replace(new RegExp(" ",'g'),"");
                                $.post("connectors/connector.php?control_id=grid_setup_database", {
                                    action:"setusername",
                                    username: nValue,
                                    user: grid.getUserData(rId,'user')
                                }, function(res){
                                    if(res == "1"){
                                        grid.cells(rId,4).setValue(nValue);
                                    }else{
                                        alert("User with name "+nValue+" already exists!");
                                    }
                                });
                            }else{
                                return false;
                            }
                            break;
                        case 5:
                            if(nValue.length > 3 && oValue!=nValue){
                                var pass = nValue;
                                var id = grid.getUserData(rId,'user');
                                $.post("connectors/connector.php?control_id=grid_setup_database", {
                                    action:"setpass",
                                    user: id,
                                    pass: pass
                                }, function(res){
                                    grid.cells(rId,5).setValue(nValue);
                                    //grid.updateFromXML("connectors/connector.php?control_id=grid_setup_database");
                                },'json');
                            }else{
                                return false;
                            }
                            break;
                        case 8:
                            $.post("connectors/connector.php?control_id=grid_setup_database", {
                                action:"editcourse",
                                studygroup: row[1],
                                course: nValue
                            }, function(res){
                                grid.cells(rId,8).setValue(nValue);
                            },'json');
                            break;
                        case 9:
                            $.post("connectors/connector.php?control_id=grid_setup_database", {
                                action:"editpoints",
                                studygroup: row[1],
                                points: nValue
                            }, function(res){
                                grid.cells(rId,9).setValue(nValue);
                            },'json');
                            break;
                        case 10:
                            $.post("connectors/connector.php?control_id=grid_setup_database", {
                                action:"editstartdate",
                                studygroup: row[1],
                                startdate: nValue
                            }, function(res){
                                grid.cells(rId,10).setValue(nValue);
                            },'json');
                            break;
                        case 11:
                            $.post("connectors/connector.php?control_id=grid_setup_database", {
                                action:"editenddate",
                                studygroup: row[1],
                                enddate: nValue
                            }, function(res){
                                grid.cells(rId,11).setValue(nValue);
                            },'json');
                            break;
                    }
                }
				return true;
			},
			
			selectRow: function(ind,id,dhx,options,f,funcs,pid){

			},

			popup: [
						{
							id: "delete",
							label: dlang("Delete"),
							action: function(id, grid, tree_obj, index){
                                deleteItem(id, index, grid);
							}
						},
						{
							id: "add_pupil",
							label: dlang("New Pupils"),
							visible: function(id, tree){
								var _id = id.split("_");
								return (_id[0]=='pupilgroup' || _id[0]=='pupil');
							},					
							action: function(id, grid, grid_obj, index){
                                getUsersNum("pupils",addPupil, id, grid, grid_obj, index, 0);

							}
						},
                        {
                            id: "add_pupil_one_parent",
                            label: dlang("New Pupils with 1 parent each"),
                            visible: function(id, tree){
                                var _id = id.split("_");
                                return (_id[0]=='pupilgroup' || _id[0]=='pupil');
                            },
                            action: function(id, grid, grid_obj, index){
                                getUsersNum("pupils",addPupil, id, grid, grid_obj, index, 1);
                            }
                        },
                        {
                            id: "add_pupil_two_parent",
                            label: dlang("New Pupils with 2 parent each"),
                            visible: function(id, tree){
                                var _id = id.split("_");
                                return (_id[0]=='pupilgroup' || _id[0]=='pupil');
                            },
                            action: function(id, grid, grid_obj, index){
                                getUsersNum("pupils",addPupil, id, grid, grid_obj, index, 2);
                            }
                        },
						{
							id: "add_parent",
							label: dlang("New Parents"),
							visible: function(id, tree){
								var _id = id.split("_");
								return (_id[0]=='parent' || _id[0]=='pupil');
							},					
							action: function(id, grid, grid_obj, index){
                                getUsersNum("pupils",addParent, id, grid, grid_obj, index, 1);
							}
						},
						{
							id: "add_pupilgroup",
							label: dlang("New Pupilgroups"),
							visible: function(id, tree){
								var _id = id.split("_");
								return (_id[0]=='studygroup' || _id[0]=='pupilgroup');
							},					
							action: function(id, grid, grid_obj, index){
                                getUsersNum("pupils",addPupilgroup, id, grid, grid_obj, index, 1);
					 		}
					   },
                       {
                            id: "add_studygroup",
                            label: dlang("New Studygroups"),
                            visible: function(id, tree){
                                var _id = id.split("_");
                                return (_id[0]=='studygroup' || _id[0]=='programme');
                            },
                            action: function(id, grid, grid_obj, index){
                                getUsersNum("pupils",addStudygroup, id, grid, grid_obj, index, 1);
                            }
                       },
                       {
                            id: "add_programme",
                            label: dlang("New Programmes"),
                            visible: function(id, tree){
                                var _id = id.split("_");
                                return (_id[0]=='programme');
                            },
                            action: function(id, grid, grid_obj, index){
                                getUsersNum("pupils",addProgramme, id, grid, grid_obj, index, 1);
                            }
                       },
                       {
                            id: "print_login_pass",
                            label: dlang("Print Login/Pass"),
                            visible: function(id, tree){
                                var _id = id.split("_");
                                return (_id[0]=='pupil' || _id[0]=='parent' || _id[0]=='staffmember');
                            },
                            action: function(id, grid, grid_obj, index){
                            }
                       },
                       {
                            id: "sett_pass",
                            label: dlang("Set New Password"),
                            visible: function(id, tree){
                                var _id = id.split("_");
                                return (_id[0]=='pupil' || _id[0]=='parent' || _id[0]=='staffmember');
                            },
                            action: function(id, grid, grid_obj, index){
                                if(confirm("Reset password?")){
                                    var pass = schoolmule.main.randomPassword(10);
                                    var user = grid.contextID.split('_');
                                    var id = grid.getUserData(user[0]+'_'+user[1]+(user[3]?'_'+user[2]:''),'user');
                                    $.post("connectors/connector.php?control_id=grid_setup_database", {
                                        action:"setpass",
                                        user: id,
                                        pass: pass
                                    }, function(res){
                                        grid.updateFromXML("connectors/connector.php?control_id=grid_setup_database");
                                    },'json');
                                }else{
                                    return false;
                                }
                            }
                       },
                        /*
                       {
                            id: "select_last_defined",
                            label: dlang("Select last defined"),
                            visible: function(id, tree){
                                var _id = id.split("_");
                                return (_id[0]=='pupil' || _id[0]=='parent' || _id[0]=='staffmember');
                            },
                            action: function(id, grid, grid_obj, index){
                            }
                       },
                       */
					   {
							id: "add_staff",
							label: dlang("New Teachers"),
							visible: function(id, tree){
								var _id = id.split("_");
								return (_id[0]=='studygroup' || _id[0]=='staffmember');
							},				
							action: function(id, grid, grid_obj, index){
                                getUsersNum("pupils",addStaff, id, grid, grid_obj, index, 1);
							}
					   }
			]
		
		
});

function addProgramme(id, grid, grid_obj, index, num, col){
    $.post("connectors/connector.php?control_id=grid_setup_database", {
        action:"add_programme",
        name:"new programme",
        col: col
    }, function(res){
        grid.updateFromXML("connectors/connector.php?control_id=grid_setup_database");
        last_defined = res;
    });
}

function addStudygroup(id, grid, grid_obj, index, num, col){
    var programme;
    switch(id){
        case 'programme':
            programme = index;
            break;
        default:
            programme = grid.getParentId(id+'_'+index).split('_')[1];
            break;
    }

    $.post("connectors/connector.php?control_id=grid_setup_database", {
        action:"add_studygroup",
        name:"new studygroup",
        col: col,
        programme:programme
    }, function(res){
        last_defined = res;
        grid.updateFromXML("connectors/connector.php?control_id=grid_setup_database");
    });
}

function addPupilgroup(id, grid, grid_obj, index, num, col){
    var studygroup;
    switch(id){
        case 'studygroup':
            studygroup = index;
            break;
        default:
            studygroup = grid.getParentId(id+'_'+index).split('_')[1];
            break;
    }

    $.post("connectors/connector.php?control_id=grid_setup_database", {
        action:"add_pupilgroup",
        name:"new pupilgroup",
        stg:studygroup,
        col: col
    }, function(res){
        last_defined = res;
        grid.updateFromXML("connectors/connector.php?control_id=grid_setup_database");
    });
}

function addParent(id, grid, grid_obj, index, num, col){
    var pupil;
    switch(id){
        case 'pupil':
            pupil = index;
            break;
        case 'parent':
            var pupil_full = grid.getParentId(id+'_'+index);
            pupil = pupil_full.split('_')[1];
            break;
    }

    $.post("connectors/connector.php?control_id=grid_setup_database", {
        action:"add_parent",
        pupil: pupil,
        col: col
    }, function(res){
        last_defined = res;
        grid.updateFromXML("connectors/connector.php?control_id=grid_setup_database");
    });
}

function addPupil(id, grid, grid_obj, index, num, col){
    var pupilgroup;
    var studygroup;
    switch(id){
        case 'pupilgroup':
            pupilgroup = index;
            studygroup = grid.getParentId(id+'_'+index).split('_')[1];
            break;
        case 'pupil':
            var pupilgroup_full = grid.getParentId(id+'_'+index);
            pupilgroup = pupilgroup_full.split('_')[1];
            studygroup = grid.getParentId(pupilgroup_full).split('_')[1];
            break;
    }
    $.post("connectors/connector.php?control_id=grid_setup_database", {
        action:"add_pupil",
        pupilgroup:pupilgroup,
        studygroup:studygroup,
        parentnum: num,
        col: col
    }, function(res){
        last_defined = res;
        grid.updateFromXML("connectors/connector.php?control_id=grid_setup_database");
    });
}


function addStaff(id, grid, grid_obj, index, num, col){
    var studygroup;
    switch(id){
        case 'studygroup':
            studygroup = index;
            break;
        default:
            studygroup = grid.getParentId(id+'_'+index).split('_')[1];
            break;
    }

    $.post("connectors/connector.php?control_id=grid_setup_database", {
        action:"add_staff",
        col: col,
        stg:studygroup
    }, function(res){
        last_defined = res;
        grid.updateFromXML("connectors/connector.php?control_id=grid_setup_database", true,true, function(){
            var index = grid.getRowIndex('staffmember_'+res.id+'_'+studygroup);
            while(grid.getRowId(index-1).split('_')[0] != 'staffmember'){
                if(grid.getRowId(index-1).split('_')[0]=='studygroup'){
                    break;
                }
                grid.moveRowUp('staffmember_'+res.id+'_'+studygroup);
                index--;
            }
        });
    },'json');
}

function getUsersNum(name, callback, id, grid, grid_obj, index, num){
    var upload_form = null;
    var uploader = null;
    var dialog = new schoolmule.controls.window_popup(
        {
            title: "How many "+name+" do you want to create ?",
            width: "300px",
            height: "40px",
            buttons: {
                "Ok": function() {
                    callback(id, grid, grid_obj, index, num, $("#users_num").val());
                    dialog.win_dialog.dialog("destroy");
                    dialog.win_dialog.remove();
                },
                "Close": function() {
                    dialog.win_dialog.dialog("destroy");
                    dialog.win_dialog.remove();
                }

            },
            onBeforeShow: function(container){
                var cont = $("#"+container);
                cont.parent().addClass('min_height_none');
                cont.removeClass('add-box');
                cont.append('<div><input type="text" id="users_num" value="1" style="width: 100%"/></div>');

            }
        });
    dialog.show({
        container: "massage_box"
    });

}

function deleteItem(id, index, grid){
    $.post("connectors/connector.php?control_id=grid_setup_database", {
        action:"delete"+'_'+id,
        id: index
    }, function(res){
        grid.updateFromXML("connectors/connector.php?control_id=grid_setup_database",true,true);
    });
}