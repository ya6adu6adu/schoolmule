var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.grid_import_drag = new schoolmule.controls.grid({
    id: "grid_import_drag",
    dp:false,

    addRow: function(rId,cn,dhx){
    },

    selectRow: function(ind,id,dhx,options){
    },
    popup: [
    ],

    load: function(){
    },

    setConfig: function(mygrid,script,id){
        mygrid.setHeader(dlang("import_grid_drag_column","Drag filed from file here"));
        mygrid.setInitWidthsP("100");
        mygrid.setColTypes("ro");
        mygrid.setColAlign("left");
        mygrid.enableTooltips("false");
        mygrid.enableEditEvents(true,false,true);
        mygrid.enableColSpan(true);
    }
})