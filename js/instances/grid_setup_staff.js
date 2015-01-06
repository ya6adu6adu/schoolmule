var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.grid_setup_staff = new schoolmule.controls.grid({
    id: "grid_setup_staff",
    gridImagePath:"dhtmlx/dhtmlxGrid/codebase/imgs/",
    menuIconsPath:"dhtmlx/dhtmlxMenu/codebase/imgs/dhxmenu_dhx_web/",

    dp:false,

    addRow: function(rId,cn,dhx){
    },

    selectRow: function(ind,id,dhx,options,f,funcs,pid){
        if(ind==8){

            seconfirm(dlang("reset_confirm_pass_text","Reset password?"),function(){
                var uid = dhx.grid.getUserData(id,'user');
                $.post("connectors/connector.php?control_id=grid_setup_pupils", {
                    action:"setpass",
                    user: uid
                }, function(res){
                    alert(dlang("after_pass_reset_alert2","User sent a letter stating that the password is changed"));
                },'json');
            });
            return false;
        }
    },

    openTree: function(id,dhx,state,pid){
    },

    beforeSelectRow: function(id,dhx,keysel){
        return true;
    },
    setConfig: function(mygrid,script,id){
        var tree = schoolmule.instances.tree_users.getTree();
        mygrid.setHeader('#master_checkbox,'+dlang("grud_staff_stg_fname","Forname")+","+dlang("grud_staff_stg_sname","Surname")+','+dlang("grud_staff_stg_id","ID")+',,'+dlang("grud_staff_stg_added","Added")+','+dlang("grud_staff_stg_uname","Username")+','+dlang("grud_staff_email","Email")+','+dlang("grud_staff_stg_pass","Password"),null,["text-align:center"]);
        mygrid.setInitWidthsP("3.6,18,18,14,0,12,10.4,14,10");
        mygrid.setColTypes("ch,ed,ed,ed,ro,ro,ed,ed,button");
        mygrid.setColSorting("na,str,str,na,dbContentSort,date");
        mygrid.setColValidators([null,null,null,null,null,null,null,"ValidEmail",null]);
        mygrid.enableTooltips("false,false,false,false,false, false,false,false");
        mygrid.setColAlign("center,left,left,left,left,left,left,left");
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
        var tree = schoolmule.instances.tree_users.getTree();
        var item = tree.getSelectedItemId().split('_');
        if(item[0]=='staffmember'){
            //grid.selectRowById('staffmember_'+item[1])
        }

    },

    editCell: function(stage,rId,cInd,nValue,oValue,grid,tree_obj,pid){
        var grid = schoolmule.instances.grid_setup_staff.getGrid().grid;
        var row = rId.split('_');
        if(stage == 0){
            if(cInd==8){
                /*
                seconfirm(dlang("reset_confirm_pass_text","Reset password?"),function(){
                    var pass = nValue;
                    var id = grid.getUserData(rId,'user');
                    $.post("connectors/connector.php?control_id=grid_setup_pupils", {
                        action:"setpass",
                        user: id,
                        pass: pass
                    }, function(res){
                        alert("after_pass_reset_alert","User sent a letter stating that the password is changed");
                    },'json');
                });
                 */
                return false;

            }
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

                case 1:
                    $(grid.cells(rId,1).cell).find('input').val("");
                    break;
                case 2:
                    $(grid.cells(rId,2).cell).find('input').val("");
                    break;
            }
        }
        if(stage == 2){
            switch(cInd){
                case 1:
                    if(nValue==""){
                        grid.cells(rId,1).setValue(oValue);
                    }

                    if(nValue.length > 1 && oValue!=nValue){
                            $.post("connectors/connector.php?control_id=grid_setup_staff", {
                                action:"editstaffname",
                                name: nValue,
                                id: row[1]
                            }, function(res){
                                grid.cells(rId,1).setValue(nValue);
                                var user = nValue+'.'+grid.cells(rId,2).getValue();
                                grid.cells(rId,6).setValue(res.username);
                                var tree = schoolmule.instances.tree_users.getTree();
                                tree.smartRefreshBranch('staff',"connectors/connector.php?control_id=tree_users");
                                tree = schoolmule.instances.tree_programme_structure.getTree();
                                tree.smartRefreshBranch('programmes',"connectors/connector.php?control_id=tree_programme_structure");
                            },'json');
                            break;
                    }else{
                        return false;
                    }
                    break;
                case 2:
                    if(nValue==""){
                        grid.cells(rId,1).setValue(oValue);
                    }
                    if(nValue.length > 1 && oValue!=nValue){
                        $.post("connectors/connector.php?control_id=grid_setup_staff", {
                            action:"editstaffsurname",
                            name: nValue,
                            id: row[1]
                        }, function(res){
                            var tree = schoolmule.instances.tree_users.getTree();
                            tree.smartRefreshBranch('staff',"connectors/connector.php?control_id=tree_users");
                            grid.cells(rId,2).setValue(nValue);
                            var user = grid.cells(rId,1).getValue()+'.'+nValue;
                            grid.cells(rId,6).setValue(res.username);
                            tree = schoolmule.instances.tree_programme_structure.getTree();
                            tree.smartRefreshBranch('programmes',"connectors/connector.php?control_id=tree_programme_structure");
                        },'json');
                        break;
                    }else{
                        return false;
                    }
                    break;
                case 3:
                    if(nValue.length > 1 && oValue!=nValue){
                        $.post("connectors/connector.php?control_id=grid_setup_staff", {
                            action:"editstaffid",
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
                    if(nValue.length > 1 && oValue!=nValue){
                        nValue = nValue.replace(new RegExp(",",'g'),"");
                        nValue = nValue.replace(new RegExp(" ",'g'),"");
                        $.post("connectors/connector.php?control_id=grid_setup_staff", {
                            action:"setusername",
                            username: nValue,
                            user: grid.getUserData(rId,'user')
                        }, function(res){
                            if(res == "1"){
                                grid.cells(rId,6).setValue(nValue);
                            }else{
                                alert(dlang("grids_users_exists_popup1","User with name")+' '+nValue+' '+dlang("grids_users_exists_popup2","already exists!"));
                            }
                        });
                    }else{
                        return false;
                    }
                    break;
                case 8:
                    if(nValue.length > 3 && oValue!=nValue){
                        var pass = nValue;
                        var id = grid.getUserData(rId,'user');
                        $.post("connectors/connector.php?control_id=grid_setup_staff", {
                            action:"setpass",
                            user: id,
                            pass: pass
                        }, function(res){
                            grid.cells(rId,8).setValue(nValue);
                            //grid.updateFromXML("connectors/connector.php?control_id=grid_setup_staff");
                        },'json');
                    }else{
                        return false;
                    }
                    break;
                case 7:
                    if(nValue.length > 3 && oValue!=nValue || nValue==""){
                        if(!grid.validateCell(rId,7) && nValue!=""){
                            return false;
                        }
                        var mail = nValue;
                        var id = grid.getUserData(rId,'user');
                        $.post("connectors/connector.php?control_id=grid_setup_pupils", {
                            action:"setemail",
                            user: id,
                            mail: mail
                        }, function(res){
                            grid.cells(rId,7).setValue(nValue);
                        },'json');
                    }else{
                        return false;
                    }
                    break;
            }
        }
        return true;
    },

    popup: []
});