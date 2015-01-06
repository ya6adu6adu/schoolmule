var schoolmule = window.schoolmule || {};
schoolmule.controls = schoolmule.controls || {};
schoolmule.instances = schoolmule.instances || {};

schoolmule.instances.grid_assignments = new schoolmule.controls.grid({
    id: "grid_assignments_tree",
    gridImagePath: "dhtmlx/dhtmlxGrid/codebase/imgs/",
    menuIconsPath: "dhtmlx/dhtmlxMenu/codebase/imgs/dhxmenu_dhx_web/",
    load: function(grid, perf) {
        var i, object = {}, combo, value;
        if (grid.expandAll)
                grid.expandAll();
                grid.setSizes();
        grid.loadOpenStates('test');

        grid.forEachRow(function(id){
            grid.forEachCell(id,function(cellObj,ind){
                combo = grid.getCustomCombo(id,ind);
                if(combo.values.length > 0){
                    object = {};
                    value = grid.cells(id,ind).getValue();
                        for(i = 0; i < combo.values.length; i++){
                            object[combo.values[i]] = combo.keys[i];
                        }
                    if(object.hasOwnProperty(value)){
                        grid.cells(id,ind).setValue(object[value]);
                    }
                }
            });
        })
        
               
    },
    isNumber: function(n)  {
        return !isNaN(parseFloat(n)) && isFinite(n);
    },
    setConfig: function(mygrid,script,id){
				mygrid.setHeader(dlang("grid_result_unit_r_u_title","Result units")+','+dlang("grid_result_unit_values_title","Values"));
				mygrid.setInitWidthsP("70,30");
				mygrid.setColAlign("left,left");
				mygrid.setColTypes("tree,ed,ro");
				mygrid.kidsXmlFile = script;
				mygrid.loadXML(script+'&id='+id);
                mygrid.enableColSpan(true);
                mygrid.attachEvent
                         
			},
    openTree: function(id, dhx, state) {/*

        $(".ev_dhx_skyblue").next(".odd_dhx_skyblue").next(".ev_dhx_skyblue").removeClass('norowselected');
        var nsel = $(".ev_dhx_skyblue").next(".odd_dhx_skyblue").next(".ev_dhx_skyblue");
        while (nsel.next(".ev_dhx_skyblue").size() > 0) {
            nsel = nsel.next(".ev_dhx_skyblue")
            nsel.removeClass('norowselected');
        }

        var ids = dhx.grid.getSelectedRowId();
        if (ids) {
            var _id = ids.split("_");
            if ((_id[0] == "p" || _id[0] == "a")) {
                dhx.grid.clearSelection();
            }
        }*/
    },
    beforeSelectRow:  function(new_row,dhx,keysel, row_id){
       var that = this;      
         var _id = new_row.split("_");     

        if (_id[0] == 'addresobjbtn'){           
                if (_id[1])
                that.editResultObjectives(dhx.grid,_id[1],row_id);
                return false;          
        }    
    
        return true;
    },
    editCell:function(stage,rId,cInd,nValue,oValue,grid,self){
      var that = this;
      var _id = rId.split("_");
      if (cInd === 0 ) {
          if (!_id[0]) return false;
          switch (_id[0]){
              case 'runit': 
                  if (!_id[2]){
                    if (stage == 2){
                        $.post(self.server_script, {action:"editrset", id:_id[1], data:{custom_name:nValue}}, function(){
                            grid.cells(rId, 0).setValue(nValue);
                            return true;
                        });
                     }else{
                        return true;
                    }
                  }else{
                      return false;
                  }
                break;
              case 'addresultbtn': 
                if (stage==0){
                    that.addResultUnit(grid,self.row_id)
                      console.log('add');
                }else{
                    return true;
                }                 
                break;
              case 'addresobjbtn': 
                if (stage==0 && _id[1]){
                    that.editResultObjectives(grid,_id[1],self.row_id)

                }else{
                    return true;
                }                 
                break;
              default: return false;
          }
          
      }
      if (_id[2]) 
        switch (_id[2]){
            case "attr":
                if (_id[3]){
                    switch (_id[3]){
                        case 'unit':
                            if (stage == 2){
                                    var baseId = _id.slice(0,3).join('_')+'_';
                                    var celLock ={max: false, pass:false};                                   
                                    var sdata ={'unit':nValue};                                    
                                    switch (nValue) {
                                        case '1':
                                            sdata.max ='';
                                            sdata.pass ='';
                                            celLock ={max: false, pass:false};
                                            break;
                                        case '2':
                                            sdata.max ='100%';
                                            sdata.pass ='';
                                            celLock ={max: true, pass:false};
                                            break;
                                        case '3':
                                            sdata.max ='A';
                                            sdata.pass ='E';
                                            celLock ={max: true, pass:true};
                                            break;
                                        case '4':
                                            sdata.max ='Pass';
                                            sdata.pass ='Pass';
                                            celLock ={max: true, pass:true};
                                            break;
                                    }
                                   
                                    grid.cells(baseId+'max', 1).setValue(sdata.max);                                    
                                    grid.cells(baseId+'pass', 1).setValue(sdata.pass);
                                    grid.cells(baseId+'max', 1).setDisabled(celLock.max);
                                    grid.cells(baseId+'pass', 1).setDisabled(celLock.pass);
                                    var activeColor = "white";
                                    var inactiveColor = "#F0F0EE";
                                    if (celLock.max){
                                        grid.setCellTextStyle(baseId+'max', 1,"background-color:"+inactiveColor+";");
                                    }else{
                                        grid.setCellTextStyle(baseId+'max', 1,"background-color:"+activeColor+";");
                                    }
                                    if (celLock.pass){
                                        grid.setCellTextStyle(baseId+'pass', 1,"background-color:"+inactiveColor+";");
                                    }else{
                                        grid.setCellTextStyle(baseId+'pass', 1,"background-color:"+activeColor+";");
                                    }
                                $.post(self.server_script, {action:"editrset", id:_id[1], data:sdata}, function(){
                                    return true;
                                });
                            }
                            return true;
                            break;
                        case 'max':
                            var unittype = grid.cells(_id.slice(0,3).join('_')+'_'+'unit', 1).getValue();
                            var blocks = ['3','4',dlang("runit_selectoption4","Pass"),'2',dlang("runit_selectoption2","Percent"), dlang("runit_selectoption3","Grade")];
                            if ((stage == 1 || stage ==0)  && $.inArray(unittype,blocks)>-1){
                                return false;
                            }
                            if (stage == 2){                                                               
                                 var sData = {max:nValue};                  
                                
                                switch (grid.cells(_id.slice(0,3).join('_')+'_'+'unit', 1).getValue()){
                                    case  dlang("runit_selectoption2","Percent"): 
                                         if ((that.isNumber(nValue) || (that.isNumber(nValue.substr(0,nValue.length-1)) && nValue.substr(-1)=='%'))) {
                                            if (nValue.substr(-1)!='%')
                                                sData.max = nValue + '%';
                                        }else{return false;}            
                                        break;
                                    case dlang("runit_selectoption1","Points") : 
                                       if ((that.isNumber(nValue) || (that.isNumber(nValue.substr(0,nValue.length-1)) && nValue.substr(-1)=='p'))) {
                                            if (nValue.substr(-1)!='p')
                                                sData.max = nValue + 'p';
                                        }else{return false;}       
                                        break;
                                    case  '2': 
                                        if ((that.isNumber(nValue) || (that.isNumber(nValue.substr(0,nValue.length-1)) && nValue.substr(-1)=='%'))) {
                                            if (nValue.substr(-1)!='%')
                                                sData.max = nValue + '%';
                                        }else{return false;}    
                                        break;
                                    case  '1' : 
                                        if ((that.isNumber(nValue) || (that.isNumber(nValue.substr(0,nValue.length-1)) && nValue.substr(-1)=='p'))) {
                                            if (nValue.substr(-1)!='p')
                                                sData.max = nValue + 'p';
                                        }else{return false;}              
                                        break;
                                }
                                grid.cells(rId, 1).setValue(sData.max);
                                $.post(self.server_script, {action:"editrset", id:_id[1], data:sData}, function(){
                                    return true;
                                });
                            }
                            return true;
                            break;
                        case 'pass':
                            var unittype = grid.cells(_id.slice(0,3).join('_')+'_'+'unit', 1).getValue();
                            var blocks = ['3', dlang("runit_selectoption3","Grade"),'4',dlang("runit_selectoption4","Pass")];
                          
                            if ((stage == 1 || stage == 0) && $.inArray(unittype,blocks) > -1){
                                return false;
                            }
                            if (stage == 2){
                                var sData = {pass:nValue};
                                var pass_temp = grid.cells(_id.slice(0,3).join('_')+'_max', 1).getValue();
                                
                                var pass_val = false;
                                
                                if (that.isNumber(pass_temp)){
                                    pass_val = parseInt(pass_temp);
                                }else{
                                    if (that.isNumber(pass_temp.substr(0,pass_temp.length-1))){
                                        pass_val = parseInt(pass_temp.substr(0,pass_temp.length-1));                                        
                                    }
                                }
                                var max_val = false;
                                if (pass_val) {
                                    if (that.isNumber(nValue)) {
                                        max_val = parseInt(nValue);
                                    } else {
                                        if (that.isNumber(nValue.substr(0, nValue.length - 1))) {
                                            max_val = parseInt(nValue.substr(0, nValue.length - 1));
                                        }
                                    }
                                }
                                    
                                if (max_val) {
                                    if (max_val > pass_val)                                        
                                        nValue = pass_val.toString();
                                }
                                switch (unittype){
                                    case  dlang("runit_selectoption2","Percent") :                                         
                                        if ((that.isNumber(nValue) || (that.isNumber(nValue.substr(0,nValue.length-1)) && nValue.substr(-1)=='%'))) {
                                            if (nValue.substr(-1)!='%')
                                                sData.pass = nValue + '%';
                                        }else{return false;}                                       
                                        break;
                                    case dlang("runit_selectoption1","Points") : 
                                         if ((that.isNumber(nValue) || (that.isNumber(nValue.substr(0,nValue.length-1)) && nValue.substr(-1)=='p'))) {
                                            if (nValue.substr(-1)!='p')
                                                sData.pass = nValue + 'p';
                                        }else{return false;}              
                                        break;
                                    case  '2': 
                                         if ((that.isNumber(nValue) || (that.isNumber(nValue.substr(0,nValue.length-1)) && nValue.substr(-1)=='%'))) {
                                            if (nValue.substr(-1)!='%')
                                                sData.pass = nValue + '%';
                                        }else{return false;}              
                                        break;
                                    case  '1' : 
                                        if ((that.isNumber(nValue) || (that.isNumber(nValue.substr(0,nValue.length-1)) && nValue.substr(-1)=='p'))) {
                                            if (nValue.substr(-1)!='p')
                                                sData.pass = nValue + 'p';
                                        }else{return false;}              
                                        break;
                                }
                                grid.cells(rId, 1).setValue(sData.pass);
                                $.post(self.server_script, {action:"editrset", id:_id[1], data:sData}, function(){
                                    return true;
                                });
                            }
                            return true;
                            break;
                        case 'mandatory':
                             if (stage == 1){
                                $.post(self.server_script, {action:"editrset", id:_id[1], data:{mandatory:grid.cells(rId, 1).isChecked()}}, function(){
                                    return true;
                                });
                             }else{
                                return true;
                            }
                            break;
                    }
                }                
                break;
            case "c":
                if (_id[3]){
                    switch (_id[3]){
                        default: return false;
                    }
                }
                break;
            default:
                return false;
                break;
        }
      return false;
      
    },
    popup: [
        {
            id: "add",
            label: dlang("runit_grid_menu_add", "Add new result unit"),
            action: function(id, grid, tree, index, data) {
                var tree = schoolmule.instances.tree_assignments_by_studygroup.getTree();
                var tree_selected_item = tree.getSelectedItemId().split('_')[1];
                seconfirm(dlang("runit_grid_add_conf", "Add new result unit?"), function() {
                    $.post("connectors/connector.php?control_id=grid_assignments_tree", {action: "add_resultset", assignment: data.tree_item}, function(response) {
                        grid.clearAndLoad("connectors/connector.php?act=1&control_id=grid_assignments_tree&id=" + data.tree_item);
                        grid.setSizes();                        
                    })
                });
            }

        },
        {
            id: "delete",
            label: dlang("runit_grid_menu_delete", "Delete this result unit"),
            action: function(id, grid, tree_obj, index, data) {
                seconfirm(dlang("runit_grid_menu_delete", "Delete this result unit"), function() {
                    $.post("connectors/connector.php?control_id=grid_assignments_tree", {action: "delete_resultset", assignment: index}, function(response) {
                        grid.clearAndLoad("connectors/connector.php?act=1&control_id=grid_assignments_tree&id=" + data.tree_item);
                        grid.setSizes();   
                    })
                });
            }
        },
        {
            id: "edit_course",
            label: dlang("runit_grid_assign_object", "Assign objectives"),
            action: function(id, grid, tree, index, data) {
                var tree_id = data.tree_item;
                var checked = null;                
                $.post("connectors/connector.php?control_id=tree_window", {action: "getchecked", resultset: index, type: "assignment"}, function(response) {
                    var treestg = schoolmule.instances.tree_assignments_by_studygroup.getTree();
                    var curstg = treestg.getParentId(treestg.getSelectedItemId());
                    var _curstg = curstg.split('_');
                    /*response.push('stg_'+_curstg[1]);*/
                    schoolmule.instances.window_greed_tree.show({
                        container: "add-treebox",
                        check_ids: response,
                        callback: function(ids, tree) {
                            var text = dlang("runit_grid_obj_dialog", "Make linked copy of assignment also in Studygroup") + " ";
                            var br = tree.getAllCheckedBranches();
                            var _br = br.split(',');
                            var addflag = true;
                            var newstg = Array();
                            var newstgid = Array();
                            var stgs = Array();
                            var treestg = schoolmule.instances.tree_assignments_by_studygroup.getTree();
                            var curstg = treestg.getParentId(treestg.getSelectedItemId());
                            var assign = treestg.getSelectedItemId();
                            var _curstg = curstg.split('_');
                            //var sstg = grid.cells(grid.getSelectedRowId(),5).getValue();
                            for (var i = 0; i < _br.length; i++) {
                                var temp = _br[i].split('_');
                                if (temp[0] == 'stg' && temp[1] != _curstg[1]) {
                                    newstg.push(tree.getItemText(_br[i]));
                                    newstgid.push(temp[1]);
                                    //addflag = false;
                                }
                                if (temp[0] == 'stg') {
                                    stgs.push(temp[1]);
                                }
                            }
                            var prev_stgs = treestg.getUserData(assign, "stgs");


                            if (newstg.length > 1) {
                                text = dlang("runit_grid_obj_dialog2", "Make linked copy of assignment also in Studygroups:") + " ";
                            }

                            for (var j = 0; j < newstgid.length; j++) {
                                if (_.indexOf(prev_stgs.split(','), newstgid[j]) != -1) {
                                    addflag = true;
                                }
                            }

                            var saveAssignmentTree = function() {

                                var co_ids = Array();

                                for (var i = 0; i < ids.length; i++) {
                                    var temp = ids[i].split('_');
                                    if (temp[0] == 'courseobjective') {
                                        co_ids.push(temp[1]);
                                    }
                                }
                                var stgs_string = stgs.join(',');
                                var assign = treestg.getSelectedItemId();
                                var assign_ = assign.split('_');

                                var real_stg = treestg.getParentId('assignment_' + tree_id).split('_');

                                /*                                        if(stgs_string.indexOf(real_stg[1])==-1){
                                 alert(dlang("runit_grid_dialog_alert","You must chose at least one objective in parent studygroup!"));
                                 return false;
                                 }*/

                                if (co_ids.length == 0) {
                                    alert(dlang("runit_grid_dialog_alert", "You must chose at least one objective!"));
                                    return false;
                                }

                                $.post("connectors/connector.php?control_id=tree_window", {action: "savetree", 'ids[]': co_ids, resultset: index, type: "assignment", stgs: stgs_string, aid: assign_[1]}, function() {
                                    grid.clearAndLoad("connectors/connector.php?act=1&control_id=grid_assignments_tree&id=" + tree_id);
                                    treestg.smartRefreshBranch(0, "connectors/connector.php?control_id=tree_assignments_by_studygroup&refresh=1");
                                    treestg.setUserData(assign, "stgs", stgs.join());     
                                    schoolmule.instances.window_greed_tree.hide();
                                });
                            }
                            if (addflag) {
                                saveAssignmentTree();
                            } else {
                                seconfirm(text + newstg.join(', '), saveAssignmentTree);
                                return false;
                            }
                        },
                        tree_type: "assignment",
                        tree_id: tree_id
                    });
                }, "json");
            }
        }
    ],
    
    editResultObjectives: function(grid, index, tree_id) {        
        var checked = null;  
        $.post("connectors/connector.php?control_id=tree_window", {action: "getchecked", resultset: index, type: "assignment"}, function(response) {
            var treestg = schoolmule.instances.tree_assignments_by_studygroup.getTree();
            var curstg = treestg.getParentId(treestg.getSelectedItemId());
            var _curstg = curstg.split('_');
            /*response.push('stg_'+_curstg[1]);*/
            schoolmule.instances.window_greed_tree.show({
                container: "add-treebox",
                check_ids: response,
                callback: function(ids, tree) {
                    var text = dlang("runit_grid_obj_dialog", "Make linked copy of assignment also in Studygroup") + " ";
                    var br = tree.getAllCheckedBranches();
                    var _br = br.split(',');
                    var addflag = true;
                    var newstg = Array();
                    var newstgid = Array();
                    var stgs = Array();
                    var treestg = schoolmule.instances.tree_assignments_by_studygroup.getTree();
                    var curstg = treestg.getParentId(treestg.getSelectedItemId());
                    var assign = treestg.getSelectedItemId();
                    var _curstg = curstg.split('_');
                    //var sstg = grid.cells(grid.getSelectedRowId(),5).getValue();
                    for (var i = 0; i < _br.length; i++) {
                        var temp = _br[i].split('_');
                        if (temp[0] == 'stg' && temp[1] != _curstg[1]) {
                            newstg.push(tree.getItemText(_br[i]));
                            newstgid.push(temp[1]);
                            //addflag = false;
                        }
                        if (temp[0] == 'stg') {
                            stgs.push(temp[1]);
                        }
                    }
                    var prev_stgs = treestg.getUserData(assign, "stgs");


                    if (newstg.length > 1) {
                        text = dlang("runit_grid_obj_dialog2", "Make linked copy of assignment also in Studygroups:") + " ";
                    }

                    for (var j = 0; j < newstgid.length; j++) {
                        if (_.indexOf(prev_stgs.split(','), newstgid[j]) != -1) {
                            addflag = true;
                        }
                    }

                    var saveAssignmentTree = function() {

                        var co_ids = Array();

                        for (var i = 0; i < ids.length; i++) {
                            var temp = ids[i].split('_');
                            if (temp[0] == 'courseobjective') {
                                co_ids.push(temp[1]);
                            }
                        }
                        var stgs_string = stgs.join(',');
                        var assign = treestg.getSelectedItemId();
                        var assign_ = assign.split('_');

                        var real_stg = treestg.getParentId('assignment_' + tree_id).split('_');

                        /*                                        if(stgs_string.indexOf(real_stg[1])==-1){
                         alert(dlang("runit_grid_dialog_alert","You must chose at least one objective in parent studygroup!"));
                         return false;
                         }*/

                        if (co_ids.length == 0) {
                            alert(dlang("runit_grid_dialog_alert", "You must chose at least one objective!"));
                            return false;
                        }

                        $.post("connectors/connector.php?control_id=tree_window", {action: "savetree", 'ids[]': co_ids, resultset: index, type: "assignment", stgs: stgs_string, aid: assign_[1]}, function() {
                            grid.clearAndLoad("connectors/connector.php?act=1&control_id=grid_assignments_tree&id=" + tree_id);
                            treestg.smartRefreshBranch(0, "connectors/connector.php?control_id=tree_assignments_by_studygroup&refresh=1");
                            treestg.setUserData(assign, "stgs", stgs.join());
                            schoolmule.instances.window_greed_tree.hide();
                        });
                    }
                    if (addflag) {
                        saveAssignmentTree();
                    } else {
                        seconfirm(text + newstg.join(', '), saveAssignmentTree);
                        return false;
                    }
                },
                tree_type: "assignment",
                tree_id: tree_id
            });
        }, "json");
    },
    addResultUnit: function(grid, assignment) {    
        seconfirm(dlang("runit_grid_add_conf", "Add new result unit?"), function() {
            $.post("connectors/connector.php?control_id=grid_assignments_tree", {action: "add_resultset", assignment:assignment}, function(response) {
                grid.clearAndLoad("connectors/connector.php?act=1&control_id=grid_assignments_tree&id=" + assignment);
                grid.setSizes();
            })
        });
    }
})