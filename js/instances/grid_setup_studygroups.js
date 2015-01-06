var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

var last_defined = "";
schoolmule.instances.grid_setup_studygroups = new schoolmule.controls.grid({
    id: "grid_setup_studygroups",
    gridImagePath:"dhtmlx/dhtmlxGrid/codebase/imgs/",
    menuIconsPath:"dhtmlx/dhtmlxMenu/codebase/imgs/dhxmenu_dhx_web/",

    dp:false,

    addRow: function(rId,cn,dhx){
    },

    openTree: function(id,dhx,state,pid){
    },

    beforeSelectRow: function(id,dhx,keysel){
        return true;
    },
    setConfig: function(mygrid,script,id){
        mygrid.setHeader('#master_checkbox,'+dlang("grid_stgs_name","Name")+','+dlang("grid_stgs_course_code","Course code")+','+dlang("grid_stgs_points","Points")+','+dlang("grid_stgs_sdate","Startdate")+','+dlang("grid_stgs_edate","Enddate"),null,["text-align:center"]);
        mygrid.setInitWidthsP("3.6,25,25,15,15,16.4");
        mygrid.setColTypes("ch,ed,ed,ed,dhxCalendar,dhxCalendar");
        mygrid.setColSorting("na,str,str,int,date,date")
        mygrid.enableTooltips("false,false,false,false,false, false");
        mygrid.setColAlign("center,left,left,left,left,left");
        mygrid.enableAutoHeight(false);
        mygrid.enableTreeCellEdit(true);
        mygrid.setDateFormat("%Y-%m-%d");

        mygrid.enableEditEvents(false, true, true);
        mygrid.kidsXmlFile = script;
        mygrid.loadXML(script+'&selected='+id);
        $("body").append('<img class="temp_user_image" style="display:none; position:absolute;" />');
    },

    showMenu: function(id){
        return true;
    },

    load: function(grid){
        $('#setup_grid .objbox , body').click(function(){
            disableButton('assign_content');
        });
        var tree = schoolmule.instances.tree_programme_structure.getTree();
        var item = tree.getSelectedItemId().split('_');
        if(item[0]=='staffmember'){
            //grid.selectRowById('staffmember_'+item[1])
        }
        if(item[0]=='studygroup'){
            //grid.selectRowById('studygroup_'+item[1])
        }
    },

    editCell: function(stage,rId,cInd,nValue,oValue,grid,tree_obj,pid){
        var grid = schoolmule.instances.grid_setup_studygroups.getGrid().grid;
        var row = rId.split('_');
        if(stage == 0){
            if(_.indexOf([0,1,2,3,4,5],cInd) == -1){
                return false;
            }
        }
        if(stage == 1){
            switch(cInd){
                case 0:

                    if(grid.cells(rId,0).isChecked()){
                        enableButton('delete_selected');
                    }else{
                        if(grid.getCheckedRows(0)==""){
                            disableButton('delete_selected');
                        }
                    }
                    break;
            }
        }
        if(stage == 2){
            switch(cInd){
                case 1:
                    if(nValue.length > 1 && oValue!=nValue){
                            $.post("connectors/connector.php?control_id=grid_setup_studygroups", {
                                action:"editstudygroup",
                                name: nValue,
                                id: row[1]
                            }, function(res){
                                grid.cells(rId,1).setValue(nValue);
                            });
                            break;
                    }else{
                        return false;
                    }
                    break;
                case 2:
                    $.post("connectors/connector.php?control_id=grid_setup_studygroups", {
                        action:"editcourse",
                        studygroup: row[1],
                        course: nValue
                    }, function(res){
                        grid.cells(rId,2).setValue(nValue);
                    },'json');
                    break;
                case 3:
                    $.post("connectors/connector.php?control_id=grid_setup_studygroups", {
                        action:"editpoints",
                        studygroup: row[1],
                        points: nValue
                    }, function(res){
                        grid.cells(rId,3).setValue(nValue);
                    },'json');
                    break;
                case 4:
                    $.post("connectors/connector.php?control_id=grid_setup_studygroups", {
                        action:"editstartdate",
                        studygroup: row[1],
                        startdate: nValue
                    }, function(res){
                        grid.cells(rId,4).setValue(nValue);
                    },'json');
                    break;
                case 5:
                    $.post("connectors/connector.php?control_id=grid_setup_studygroups", {
                        action:"editenddate",
                        studygroup: row[1],
                        enddate: nValue
                    }, function(res){
                        grid.cells(rId,5).setValue(nValue);
                    },'json');
                    break;
            }
        }
        return true;
    },
    selectRow: function(ind,id,dhx,options,f,funcs,pid){
        enableButton('assign_content');
    },
    popup: []
});