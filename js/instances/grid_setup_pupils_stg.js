var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.grid_setup_pupils_stg = new schoolmule.controls.grid({
    id: "grid_setup_pupils_stg",
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
        mygrid.setHeader('#master_checkbox,'+dlang("grud_pupils_stg_fname","Forname")+','+dlang("grud_pupils_stg_sname","Surname")+','+dlang("grud_pupils_stg_id","ID")+','+dlang("grud_pupils_stg_pg","Pupilgroup")+','+dlang("grud_pupils_stg_port","Portrait")+','+dlang("grud_pupils_stg_goal","Goal")+','+dlang("grud_pupils_stg_progn","Prognose")+','+dlang("grud_pupils_stg_grade","Grade"),null,["text-align:center"]);
        mygrid.setInitWidthsP("3.6,18,18,10,15,6,10.4,10,9");
        mygrid.setColTypes("ch,ed,ed,ed,ro,img,co,co,co");
        mygrid.setColSorting("na,str,str,na,str");
        mygrid.enableTooltips("false,false,false,false,false, false, false,false,false");
        mygrid.setColAlign("center,left,left,left,left,center,left,left,left");
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
        var tree = schoolmule.instances.tree_programme_structure.getTree();
        var item = tree.getSelectedItemId().split('_');
        if(item[0]=='pupil'){
           // grid.selectRowById('pupil_'+item[1])
           // grid.selectRowById('pupil_'+item[1])
        }

    },
    mouseOver: function(rId,cInd){
        if(cInd==5){
            var grid = schoolmule.instances.grid_setup_pupils_stg.getGrid().grid;
            var cell = grid.cells(rId,5);
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
        var grid = schoolmule.instances.grid_setup_pupils_stg.getGrid().grid;
        var row = rId.split('_');
        if(cInd == 5 && _.indexOf(["pupil","staffmember","parent"],row[0]) != -1){
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
                            grid.cells(rId,5).setValue('images/users/small_'+user+'.jpg');
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
        var grid = schoolmule.instances.grid_setup_pupils_stg.getGrid().grid;
        var row = rId.split('_');
        if(stage == 0){
            if(_.indexOf([0,1,2,3,6,7,8],cInd) == -1){
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
                            $.post("connectors/connector.php?control_id=grid_setup_pupils_stg", {
                                action:"editpupilname",
                                name: nValue,
                                id: row[1]
                            }, function(res){
                                grid.cells(rId,1).setValue(nValue);
                                var tree = schoolmule.instances.tree_programme_structure.getTree();
                                tree.smartRefreshBranch('programmes',"connectors/connector.php?control_id=tree_programme_structure");
                            });
                            break;
                    }else{
                        return false;
                    }
                    break;
                case 2:
                    if(nValue.length > 1 && oValue!=nValue){
                        $.post("connectors/connector.php?control_id=grid_setup_pupils_stg", {
                            action:"editpupilsurname",
                            name: nValue,
                            id: row[1]
                        }, function(res){
                            grid.cells(rId,2).setValue(nValue);
                            var tree = schoolmule.instances.tree_programme_structure.getTree();
                            tree.smartRefreshBranch('programmes',"connectors/connector.php?control_id=tree_programme_structure");
                        });
                        break;
                    }else{
                        return false;
                    }
                    break;
                case 3:
                    if(nValue.length > 1 && oValue!=nValue){
                        $.post("connectors/connector.php?control_id=grid_setup_pupils_stg", {
                            action:"editpupilid",
                            name: nValue,
                            id: row[1]
                        }, function(res){
                            grid.cells(rId,3).setValue(nValue);
                        });
                        break;
                    }else{
                        return false;
                    }
                    break;
                case 6:

                if(oValue!=nValue){
                    $.post("connectors/connector.php?control_id=grid_setup_pupils_stg", {
                        action:"editgoal",
                        name: nValue,
                        id: grid.getUserData(rId,'gid')
                    }, function(res){
                        grid.cells(rId,6).setValue(nValue);
                    });
                    break;
                }else{
                    return false;
                }
                break;
                case 7:

                    if(oValue!=nValue){
                        $.post("connectors/connector.php?control_id=grid_setup_pupils_stg", {
                            action:"editprognose",
                            name: nValue,
                            id: grid.getUserData(rId,'gid')
                        }, function(res){
                            grid.cells(rId,7).setValue(nValue);
                        });
                        break;
                    }else{
                        return false;
                    }
                    break;
                case 8:

                    if(oValue!=nValue){
                        $.post("connectors/connector.php?control_id=grid_setup_pupils_stg", {
                            action:"editgrade",
                            name: nValue,
                            id: grid.getUserData(rId,'gid')
                        }, function(res){
                            grid.cells(rId,8).setValue(nValue);
                        });
                        break;
                    }else{
                        return false;
                    }
                    break;
            }
        }
        return true;
    },

    selectRow: function(ind,id,dhx,options,f,funcs,pid){

    },

    popup: []
});