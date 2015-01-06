var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.grid_result_annotate = new schoolmule.controls.grid({
    id: "grid_result_annotate",
    dp:false,
    setConfig: function(mygrid,script,id){
        mygrid.setHeader(
            dlang("ann_unit","Result unit")+','+
            dlang("ann_max","Max")+','+
            dlang("ann_pass","Pass")+','+
            dlang("ann_result","Result")+','+
            dlang("ann_add","Add")
        );

        mygrid.setInitWidths("60,34,35,40,30");
        mygrid.setColAlign("left,left,left,left,center");
        mygrid.setColTypes("ro,ro,ro,ed,img");
        mygrid.enableTooltips("false,false,false,false,false");
        mygrid.setColumnColor("white,white,white,#FEF5CA,#FEF5CA");
        mygrid.enableEditEvents(true,false,true);
        mygrid.kidsXmlFile = script;
        mygrid.loadXML(script+'&id='+id.pupil+"&assign="+id.assignment);
    },
    addRow: function(rId,cn,dhx){
    },

    load:function(grid){
        grid.selectRow(0,true);
    },

    selectRow: function(ind,id,dhx,options){
        var grid = dhx.grid;
        var assessment = grid.getUserData(id,'assess');
        $('#setassessment [value="'+assessment+'"]').attr("selected", "selected");
        if(ind==4){
            var cell = grid.cells(id,4).cell;
            var item = $('#result_cunter');
            var coords = $(cell).offset();
            item.css(
                {left:coords.left+20,top:coords.top+10}
            );
            item.fadeIn(500);
        }
    },
    editCell: function(stage,rId,cInd,nValue,oValue){
        return schoolmule.instances.grid_result_annotate.setNewResult(nValue,oValue,rId,stage);
    },

    popup:[

    ]
});

schoolmule.instances.grid_result_annotate.setNewResult = function(nValue, oValue, rId, stage){
    var grid = this.getGrid().grid;
    var cInd = 3;
    var _id = rId.split("_");
    if(stage == 2){
        if(nValue!=oValue){
            var script = "connectors/connector.php?control_id=grid_assess_assignments";
            var runit = grid.getUserData(grid.getSelectedRowId(),'unit');
            var grades = ['A','B','C','D','E','F'];
            var pass;
            switch (parseInt(runit)){
                case 1:
                    var val = parseInt(nValue);
                    if(!isNaN(val) && val<=parseInt(grid.cells(grid.getSelectedRowId(),1).getValue())){

                        grid.cells(rId,cInd).setValue(val);
                        if(val<parseInt(grid.cells(grid.getSelectedRowId(),2).getValue())){
                            pass = 0;
                        }else{
                            pass = 1;
                        }
                        grid.cells(grid.getSelectedRowId(),3).setValue(val+'p')
                        $.post(script, {action:"editresult", id:_id[1], value:val+'p', pass:pass}, function(){ });
                        return true;
                    }else if(!isNaN(val)){
                        pass = 0;
                        grid.cells(grid.getSelectedRowId(),3).setValue(val+'p')
                        $.post(script, {action:"editresult", id:_id[1], value:val+'p', pass:pass}, function(){ });
                        return true;
                    }
                    break;
                case 2:
                    var val = parseInt(nValue);
                    if(!isNaN(val) && val <=100 && val<=parseInt(grid.cells(grid.getSelectedRowId(),1).getValue())){
                        grid.cells(rId,cInd).setValue(val);
                        if(val<parseInt(grid.cells(grid.getSelectedRowId(),2).getValue())){
                            pass = 0;
                        }else{
                            pass = 1;
                        }
                        grid.cells(grid.getSelectedRowId(),3).setValue(val+'%')
                        $.post(script, {action:"editresult", id:_id[1], value:val+'%', pass:pass}, function(){});
                        return true;
                    }else if(!isNaN(val)){
                        pass = 0;
                        grid.cells(grid.getSelectedRowId(),3).setValue(val+'%')
                        $.post(script, {action:"editresult", id:_id[1], value:val+'p', pass:pass}, function(){ });
                        return true;
                    }
                    break;
                case 3:
                    if(!isNaN((parseInt(nValue)))){
                        return false;
                    }
                    var val = nValue.toUpperCase();
                    if(grades.join().search(val) != -1 && grades.join().search(val)>=grades.join().search(grid.cells(grid.getSelectedRowId(),2).getValue())){
                        grid.cells(rId,cInd).setValue(val);
                        if(grades.join().search(val)>=grades.join().search(grid.cells(grid.getSelectedRowId(),2).getValue())){
                            pass = 0;
                        }else{
                            pass = 1;
                        }
                        $.post(script, {action:"editresult", id:_id[1], value:val, pass:pass}, function(){});
                        return true;
                    }else if(grades.join().search(val) != -1){
                        pass = 0;
                        $.post(script, {action:"editresult", id:_id[1], value:val, pass:pass}, function(){ });
                        return true;
                    }

                    break;
                case 4:
                    var val = nValue;
                    if(val == dlang("details_gr_acess_assign_pts","Pass") || val == dlang("details_gr_acess_assign_npts","NPass")){
                        if(val!=dlang("details_gr_acess_assign_pts","Pass")){
                            grid.cells(rId,3).setBgColor('#ff8888');
                            pass = 0;
                        }else{
                            grid.cells(rId,3).setBgColor('#88ff88');
                            pass = 1;
                        }
                        $.post(script, {action:"editresult", id:_id[1], value:nValues, pass:pass}, function(){});
                        return true;
                    }

                    break;
            }
        }
    }
    return true;
}