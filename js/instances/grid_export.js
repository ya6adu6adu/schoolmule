var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.grid_export = new schoolmule.controls.grid({
    id: "grid_export",
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
        mygrid.setHeader(dlang("export_grid_filed","Field for items")+','+dlang("export_grid_field_name","Export field name")+','+dlang("export_grid_preview","Export preview")+','+dlang("export_grid_count","Count"));
        mygrid.setInitWidthsP("30,30,30,10");
        mygrid.setColTypes("ro,ed,ro,ro");
        mygrid.setColAlign("left,left,left,left");
        mygrid.enableTooltips("false,false,false,false");
        mygrid.enableEditEvents(true,false,true);
        mygrid.enableColSpan(true);
    }
})