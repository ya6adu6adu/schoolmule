var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.grid_search = new schoolmule.controls.grid({
    id: "grid_search",
    gridImagePath:"dhtmlx/dhtmlxGrid/codebase/imgs/",
    menuIconsPath:"dhtmlx/dhtmlxMenu/codebase/imgs/dhxmenu_dhx_web/",
    dp:false,
    save_state:false,
    popup: [],

    addRow: function(rId,cn,dhx){
    },

    selectRow: function(ind,id,dhx,options,f,funcs,pid){
    },

    openTree: function(id,dhx,state,pid){
    },

    beforeSelectRow: function(id,dhx,keysel){
        if(dhx.grid.getParentId(id)==0){
            return false;
        }
        return true;
    },

    setConfig: function(mygrid,script,id){
        mygrid.setHeader(dlang("grid_search_string_found","String found here")+','+dlang("grid_search_item","Item"));
        mygrid.setInitWidthsP("80,20");
        mygrid.setColTypes("tree,ed");
        mygrid.enableTooltips("false,false");
        mygrid.setColAlign("left,left");
        mygrid.enableAutoHeight(false);
        mygrid.enableTreeCellEdit(true);
        mygrid.enableEditEvents(false, true, true);
        mygrid.kidsXmlFile = script;
    },

    showMenu: function(id){
        return true;
    },

    load: function(grid){
        grid.expandAll();
        grid.getRowsNum();
        $('#search_field div').text((grid.getRowsNum()-5)+' '+dlang("grid_search_res_found","results found..."));
        $('.loader-field').remove();
    },

    rowDblClicked: function(rId,cInd){
        var grid = schoolmule.instances.grid_search.getGrid().grid;
        if(grid.getParentId(rId)==0){
            return false;
        }
        var str = 'course_objectives.php';

        var id = rId.split('_');

        switch(id[0]){
            case "objective":

                str += '#tab=second-menu_course_objectives/search=1/objective='+id[1];
                window.location.href = str;
                setTimeout(function(){
                    tabbar.setActiveTab('second-menu_course_objectives');
                },1000);
                break;
            case "assignment":

                str += '#tab=second-menu_assignmrnts_and_performance/itemid='+id[1]+'/itemtype=assignment/search=1';
                window.location.href = str;
                setTimeout(function(){
                    tabbar.setActiveTab('second-menu_assignmrnts_and_performance');
                },1000);
                break;
            case "performance":
                tabbar.setActiveTab('second-menu_assignmrnts_and_performance');
                str += '#tab=second-menu_assignmrnts_and_performance/itemid='+id[1]+'/itemtype=performance/search=1';
                window.location.href = str;
                break;
            case "submission":
                tabbar.setActiveTab('second-menu_assignmrnts_and_performance');
                str += '#tab=second-menu_assignmrnts_and_performance/itemid='+id[1]+'/itemtype=submission/search=1/pupil='+id[2];
                window.location.href = str;
                break;
            case "assessment":
                //tabbar.setActiveTab('second-menu_assignmrnts_and_performance');
                str += '#tab=second-menu_assignmrnts_and_performance/itemid='+id[1]+'/itemtype=assessment/search=1/pupil='+id[2];
                window.location.href = str;
                setTimeout(function(){
                    tabbar.setActiveTab('second-menu_assignmrnts_and_performance');
                },1000);
                break;
            case "pupil":

                str = 'setup.php#search=1/pupil='+id[1]+'/pg='+id[2];
                window.location.href = str;
                setTimeout(function(){
                    tabbar.setActiveTab('second-menu_database');
                },1000);
                break;
            case "staffmember":
                //tabbar.setActiveTab('second-menu_database');
                str = 'setup.php#search=1/staffmember='+id[1];
                window.location.href = str;
                setTimeout(function(){
                    tabbar.setActiveTab('second-menu_database');
                },1000);
                break;
        }

        return false;
    }
});