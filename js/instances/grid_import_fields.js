var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.grid_import_fields = new schoolmule.controls.grid({
    id: "grid_import_fields",
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
        mygrid.setHeader(dlang("import_grid_column","Column")+','+dlang("import_grid_mapped","Mapped"));
        mygrid.setInitWidthsP("90,10");
        mygrid.setColTypes("ro,ro");
        mygrid.setColAlign("left,center");
        mygrid.enableTooltips("false,false");
        mygrid.enableEditEvents(true,false,true);
        mygrid.enableColSpan(true);
    }
})