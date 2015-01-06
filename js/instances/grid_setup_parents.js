var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.grid_setup_parents = new schoolmule.controls.grid({
    id: "grid_setup_parents",
    gridImagePath:"dhtmlx/dhtmlxGrid/codebase/imgs/",
    menuIconsPath:"dhtmlx/dhtmlxMenu/codebase/imgs/dhxmenu_dhx_web/",

    dp:false,

    addRow: function(rId,cn,dhx){
    },

    selectRow: function(ind,id,dhx,options,f,funcs,pid){
        if(ind==5){
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
        mygrid.setHeader('#master_checkbox,'+dlang("grid_parents_fname","Forname")+','+dlang("grid_parents_sname","Surname")+','+dlang("grid_parents_uname","Username")+','+dlang("grid_parents_email","Email")+','+dlang("grid_parents_pass","Password"),null,["text-align:center"]);
        mygrid.setInitWidthsP("3.6,26.4,30,20,10,10");
        mygrid.setColTypes("ch,ed,ed,ed,ed,button");
        mygrid.setColValidators([null,null,null,null,"ValidEmail",null]);
        mygrid.enableTooltips("false,false,false,false");
        mygrid.setColAlign("center,left,left,left,left");
        mygrid.enableAutoHeight(false);
        mygrid.enableTreeCellEdit(true);
        mygrid.setDateFormat("%Y-%m-%d");
        mygrid.enableEditEvents(false, true, true);
        mygrid.kidsXmlFile = script;
        mygrid.loadXML(script+'&pupil='+tree.getParentId(tree.getSelectedItemId()).split('_')[1]+'&parent='+tree.getSelectedItemId().split('_')[1]);
    },

    showMenu: function(id){
        return true;
    },

    load: function(grid){
        var tree = schoolmule.instances.tree_users.getTree();
        var item = tree.getSelectedItemId().split('_');
        if(item[0]=='parent'){
            //grid.selectRowById('parent_'+item[1])
        }

    },

    editCell: function(stage,rId,cInd,nValue,oValue,grid,tree_obj,pid){
        var grid = schoolmule.instances.grid_setup_parents.getGrid().grid;
        var row = rId.split('_');
        if(stage == 0){
            if(cInd==5){
                seconfirm(dlang("reset_confirm_pass_text","Reset password?"),function(){
                    var pass = nValue;
                    var id = grid.getUserData(rId,'user');
                    $.post("connectors/connector.php?control_id=grid_setup_pupils", {
                        action:"setpass",
                        user: id,
                        pass: pass
                    }, function(res){
                        alert(dlang("after_pass_reset_alert2","User sent a letter stating that the password is changed"));
                    },'json');
                });
                return false;
            }
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
                            $.post("connectors/connector.php?control_id=grid_setup_parents", {
                                action:"editparentname",
                                name: nValue,
                                id: row[1]
                            }, function(res){
                                grid.cells(rId,1).setValue(nValue);
                                var user = nValue+'.'+grid.cells(rId,2).getValue();
                                grid.cells(rId,3).setValue(res.username);
                                var tree = schoolmule.instances.tree_users.getTree();
                                var itemId = tree.getSelectedItemId();
                                tree.setItemText(itemId,nValue+' '+grid.cells(rId,2).getValue());
                               //tree.smartRefreshBranch('pupils',"connectors/connector.php?control_id=tree_users");
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
                        $.post("connectors/connector.php?control_id=grid_setup_parents", {
                            action:"editparentsurname",
                            name: nValue,
                            id: row[1]
                        }, function(res){
                            grid.cells(rId,2).setValue(nValue);
                            var tree = schoolmule.instances.tree_users.getTree();
                            var user = grid.cells(rId,1).getValue()+'.'+nValue;
                            grid.cells(rId,3).setValue(res.username);
                            var itemId = tree.getSelectedItemId();
                            tree.setItemText(itemId, grid.cells(rId,1).getValue() +' '+nValue);
                            //tree.smartRefreshBranch('pupils',"connectors/connector.php?control_id=tree_users");
                        },'json');
                        break;
                    }else{
                        return false;
                    }
                    break;
                case 3:
                    if(nValue.length > 1 && oValue!=nValue){
                        nValue = nValue.replace(new RegExp(",",'g'),"");
                        nValue = nValue.replace(new RegExp(" ",'g'),"");
                        $.post("connectors/connector.php?control_id=grid_setup_parents", {
                            action:"setusername",
                            username: nValue,
                            user: grid.getUserData(rId,'user')
                        }, function(res){
                            if(res == "1"){
                                grid.cells(rId,3).setValue(nValue);
                            }else{
                                alert(dlang("grids_users_exists_popup1","User with name")+' '+nValue+' '+dlang("grids_users_exists_popup2","already exists!"));
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
                        $.post("connectors/connector.php?control_id=grid_setup_parents", {
                            action:"setpass",
                            user: id,
                            pass: pass
                        }, function(res){
                            grid.cells(rId,4).setValue(nValue);
                        },'json');
                    }else{
                        return false;
                    }
                    break;
                case 4:
                    if(nValue.length > 4 && oValue!=nValue){
                        if(!grid.validateCell(rId,4))
                            return false;
                        var mail = nValue;
                        var id = grid.getUserData(rId,'user');
                        $.post("connectors/connector.php?control_id=grid_setup_pupils", {
                            action:"setemail",
                            user: id,
                            mail: mail
                        }, function(res){
                            grid.cells(rId,4).setValue(nValue);
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