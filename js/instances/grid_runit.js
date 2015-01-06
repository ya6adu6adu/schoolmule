var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.grid_runit = new schoolmule.controls.grid({
    id: "grid_runit",
    dp:true,
    addRow: function(rId,cn,dhx){
    },
    load:function(grid){
        grid.uncheckAll();

    },
    selectRow: function(ind,id,dhx,options){
    },
    editCell: function(stage,rId,cInd,nValue,oValue,grid,tree_obj,pid){
        if(stage==2){
            var grida = schoolmule.instances.grid_assignments.getGrid().grid;
            var combo = grida.getCombo(0);
            combo.values[parseInt(rId-1)] = nValue;
        }

        /*combo.clear();
         */
        return true;
    },
    popup: [
        /*
        {
            id: "delete",
            label: dlang("Delete Result Unit"),
            action: function(id,grid){
            }
        }
        */
    ]
})