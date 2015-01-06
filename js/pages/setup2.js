$(function(){
	schoolmule.main.callback = viewSetup;
	if(schoolmule.main.user_id==null){
		schoolmule.main.showLogin();
	}else{
		viewSetup();
	}
});

var content = null;
var acc = null;
var navigation = null;
var tabbar = null;
var last_defined = "";

function viewSetup(){
	var hashValues = Hash.get();
	var default_select = true;
	if(hashValues.tab){
		default_select = false;
	}
	tabbar = new schoolmule.controls.tabs({
		container:"second-menu",
		width:'130px',
		tabs_left:{
				id:'left-tab', 
				callback: function(){
				}, 
				label:dlang("setup_page_title","Database and users"),
				select: false
			},
		tabs: [
            /*
            {
                id:'import',
                callback: function(){
                    showImport();
                },
                label:dlang("import_tab","Import")
            },
            */
			{
				id:'database',
				callback: function(){
					showSetupDatabase();
				},
				select: default_select,				
				label:dlang("setup_page_db_tab","Database")
			},

/*            {
                id:'export',
                callback: function(){
                    showExport();
                },
                label:dlang("export_tab","Export")
            }*/

		]
	});

	if(hashValues.tab){
		tabbar.setActiveTab(hashValues.tab);
	}
}

function cleanArea(){
	if(navigation){
		navigation.destroyNav();
		navigation = null;
	}
	if(content){
		content.setTitle("main-content","");
		content.destroy();
		content = null;
	}
}

function showExport(){
    cleanArea();
    if(content){
        content.destroy();
        content = null;
    }

    content = new schoolmule.controls.layout({
        cellsBlock: {
            display_footer_right: true,
            cells_right:[
                {
                    cells:[{
                        new_count : false,
                        id : "export_header",
                        title: "",
                        width: '100%',
                        height: '40px',
                        border_bottom: true
                    }]
                },
                {
                    cells:[
                        {
                            new_count : true,
                            id : "db_structure",
                            title: "",
                            width: '30%',
                            height: '100%',
                            border_right: true
                        },
                        {
                            new_count : true,
                            id : "export_fields",
                            title: "",
                            width: '70%',
                            height: '100%',
                            border_right: false
                        }
                    ]
                }
            ]
        }
    });


    var template_html = '<div class="export_template_header">' +
        '<select>' +
        '<option>Template for export</option>' +
        '</select>' +
        '<button class="button">'+dlang("delete_exp_template_button","Delete template")+'</button>'
    '</div>';

    schoolmule.instances.tree_export.attachTo('db_structure');
    schoolmule.instances.grid_export.attachTo('export_fields');

    content.attachButtons([
        {
            label : dlang("export_button_main","Export"),
            id : "export_button",
            callback : function(){
                var grid = schoolmule.instances.grid_export.getGrid().grid;
                var exportItems = Array();
                var ids = grid.getAllRowIds();
                window.location = "libs/ret.php?ids="+ids;
            }
        }
    ],'buttons-left');

    content.attachButtons([
        {
            label : dlang("export_save_template_button","Save settings as template"),
            id : "export_save_template_button",
            callback : function(){


            }
        },
        {
            label : dlang("export_clear_template_button","Clear settings"),
            id : "export_clear_template_button",
            callback : function(){
            }
        }
    ],'buttons-right');

    var header = $("#export_header");
    header.css({'background':'#F0F0EE', 'border-bottom':'1px solid #aaa'});
    header.append(template_html);
    content.elements.push(acc);
    content.setTitle("import ", 'Import to database');
}

function showImport(){
    cleanArea();
    if(content){
        content.destroy();
        content = null;
    }

    content = new schoolmule.controls.layout({
        cellsBlock: {
            display_footer_right: true,
            cells_right:[
                {
                    cells:[{
                        new_count : false,
                        id : "export_header",
                        title: "",
                        width: '100%',
                        height: '40px',
                        border_bottom: true
                    }]
                },
                {
                    cells:[
                        {
                            new_count : true,
                            id : "import_fields",
                            title: "",
                            width: '25%',
                            height: '100%',
                            border_right: true
                        },
                        {
                            new_count : true,
                            id : "drag_fields",
                            title: "",
                            width: '20%',
                            height: '100%',
                            border_right: true
                        },
                        {
                            new_count : true,
                            id : "db_structure",
                            title: "",
                            width: '55%',
                            height: '100%',
                            border_right: false
                        }
                    ]
                }
            ]
        }
    });


    var template_html = '<div class="">' +
        '<input type="file" />' + ' / ' +
        '<select>' +
        '<option>Template for export</option>' +
        '</select>' +
        '<button class="button">'+dlang("delete_exp_template_button","Delete template")+'</button>'
    '</div>';

    var header = $("#export_header");
    header.css({'background':'#F0F0EE', 'border-bottom':'1px solid #aaa'});
    header.append(template_html);
    content.elements.push(acc);

    schoolmule.instances.grid_import_fields.attachTo('import_fields');
    schoolmule.instances.grid_import_drag.attachTo('drag_fields');
    choolmule.instances.grid_import_dbstructure.attachTo('drag_fields');

    content.attachButtons([
        {
            label : dlang("import_button_main","Import"),
            id : "import_button",
            callback : function(){
                //var grid = schoolmule.instances.grid_export.getGrid().grid;
            }
        }
    ],'buttons-left');

    content.attachButtons([
        {
            label : dlang("import_save_template_button","Save settings as template"),
            id : "import_save_template_button",
            callback : function(){


            }
        },
        {
            label : dlang("import_clear_template_button","Clear settings"),
            id : "import_clear_template_button",
            callback : function(){
            }
        }
    ],'buttons-right');



    content.setTitle("import_title", 'Import to database');
}

function showSetupDatabase(){
    cleanArea();
    navigation = new schoolmule.controls.layout({
        cellsBlock:{
            display_footer_left: true,
            cells_left:[
                {
                    id : "nav-header"

                },
                {
                    id : "nav-body"
                }
            ],
            cells_right:[]
        }
    });

    navigation.setTitle("navigation",dlang("setup_navigation","Setup navigation"));

    acc = new schoolmule.controls.accordeon("nav-body",{
        cells: [
            {
                id: "users",
                title: dlang("setup_page_users_acc","Users"),
                content: "",
                expanded : true
            },
            {
                id: "programme_structure",
                title: dlang("setup_page_prog_str_acc","Programme structure"),
                content: "",
                expanded : true
            }
        ]
    });

    navigation.elements.push(acc);

    schoolmule.instances.tree_users.attachTo("users",
        {
            actions:{
                "pupil":getPupil,
                "staff":getStaff,
                "parent":getParent
            }
        }
    );

    schoolmule.instances.tree_programme_structure.attachTo("programme_structure",{actions:{
            "pupil":getSPupil,
            "staff":getStaff,
            "studygroups":getStudygroups,
            "year":getStudygroups
        }
    });

}

function getStudygroups(id){

    if(content){
        content.destroy();
        content = null;
    }

    content = new schoolmule.controls.layout({
        cellsBlock: {
            display_footer_right: true,
            cells_right:[
                {
                    cells:[{
                        new_count : false,
                        id : "main-box-header",
                        title: "",
                        width: '100%',
                        height: '20px',
                        border_bottom: true
                    }]
                },
                {
                    cells:[
                        {
                            new_count : true,
                            id : "setup_grid",
                            title: "",
                            width: '100%',
                            height: '100%',
                            border_right: false
                        }
                    ]
                }
            ]
        }
    });
    content.elements.push(acc);

    //content.showLoader();
    attachButtons(content,'grid_setup_studygroups');
    schoolmule.instances.grid_setup_studygroups.attachTo("setup_grid",id);
    content.elements.push(schoolmule.instances.grid_setup_studygroups);

    var _id = id.split('_');
    var tree = schoolmule.instances.tree_programme_structure.getTree();
    var path = dlang("setup_path_struct","Programme structure: ");
    if(_id[0]=='years'){
        path += tree.getItemText(tree.getParentId(id))+' > '+tree.getItemText(id);

    }else{
        path += tree.getItemText(tree.getParentId(tree.getParentId(id)))+' > '+ tree.getItemText(tree.getParentId(id))+' > '+tree.getItemText(id);
    }

    $('#main-box-header').text(path);
    $('#main-box-header').addClass('header_navigation_text');
    content.setTitle("main-content", 'Studygroups');
}

function showDialogWindow(){
    var grid = schoolmule.instances.grid_setup_studygroups.getGrid().grid;
    var stg = grid.getSelectedRowId().split('_')[1];
    $.post("connectors/connector.php?control_id=tree_setup_window", {action:"getchecked", studygroup:stg}, function(response){
        schoolmule.instances.window_setup_tree.show({
            container : "add-treebox",
            check_ids:response,
            callback: function(checked){
                var staff = Array();
                var pupilgroups = Array();
                for(var i=0;i<checked.length;i++){
                    var temp = checked[i].split('_');
                    if(temp[0]=='staffmember'){
                        staff.push(temp[1]);
                    }
                    if(temp[0]=='pupilgroup'){
                        pupilgroups.push(temp[1]);
                    }
                }
                $.post("connectors/connector.php?control_id=tree_setup_window", {action:"savetree", 'idss[]':staff, 'idsp[]':pupilgroups, studygroup:stg}, function(){
                    var tree = schoolmule.instances.tree_programme_structure.getTree();
                    tree.smartRefreshBranch('studygroup_'+stg,"connectors/connector.php?control_id=tree_programme_structure");
                },'json');
                return true;
            }
        });
    },'json');
}
function attachButtons(content,grid){
    var tu = schoolmule.instances.tree_users.getTree();
    var tps = schoolmule.instances.tree_programme_structure.getTree();
    content.attachButtons([
        {
            label : dlang("setup_button_assig_cont","Assign content"),
            id : "assign_content",
            callback : function(){
                showDialogWindow();
            }
        },
        {
            label : dlang("setup_button_import","Import from Excel file"),
            id : "import",
            callback : function(){
                //importFromExcell();
            }
        },
        {
            label : dlang("setup_button_export","Export to Excel file"),
            id : "export",
            callback : function(){
                //exportToExcell();
            }
        },
        {
            label : dlang("setup_button_del_sel","Delete selected"),
            id : "delete_selected",
            callback : function(){
                deleteSelectedRows(grid);
            }
        },

        {
            label : dlang("setup_button_print","Print Login / Pass info"),
            id : "print_login_pass",
            callback : function(){
                printLoginPass(grid);
            }
        }
        /*
        {
            label : dlang("Select last defined"),
            id : "select_last_defined",
            callback : function(){
                selectLastImport(grid);
            }
        }
        */
    ],'buttons-left');
    disableButton('assign_content');
    content.attachButtons([{
        label : dlang("setup_button_log","View log"),
        id : "view_log",
        callback : function(){
            viewLog();
        }
    }],'buttons-right');

    disableButton('delete_selected');

    if(grid=="grid_setup_pupils_stg" || grid=="grid_setup_studygroups"){
        $("#print_login_pass").hide();
    }
    if(!tu.getSelectedItemId()){
        var sel = tps.getSelectedItemId().split('_');
        if(sel[0]=='studygroup' || sel[0]=='years'){
            return true;
        }
    }

}


function getSPupil(id){
    if(content){
        content.destroy();
        content = null;
    }

    content = new schoolmule.controls.layout({
        cellsBlock: {
            display_footer_right: true,
            cells_right:[
                {
                    cells:[{
                        new_count : false,
                        id : "main-box-header",
                        title: "",
                        width: '100%',
                        height: '20px',
                        border_bottom: true
                    }]
                },
                {
                    cells:[
                        {
                            new_count : true,
                            id : "setup_grid",
                            title: "",
                            width: '100%',
                            height: '100%',
                            border_right: false
                        }
                    ]
                }
            ]
        }
    });
    //content.showLoader();
    attachButtons(content,'grid_setup_pupils_stg');
    content.elements.push(acc);
    schoolmule.instances.grid_setup_pupils_stg.attachTo("setup_grid",id);
    content.elements.push(schoolmule.instances.grid_setup_pupils_stg);

    var _id = id.split('_');
    var path = dlang("setup_path_struct","Programme structure: ");
    var tree = schoolmule.instances.tree_programme_structure.getTree();
    if(_id[0]=='pupils'){
        var stg = tree.getParentId(id);
        var year = tree.getParentId(stg);
        var prog = tree.getParentId(year);
        path += tree.getItemText(prog)+' > '+tree.getItemText(year)+' > '+tree.getItemText(stg)+' > '+tree.getItemText(id);
    }else if(_id[0]=='pupilgroup'){
        var pgs = tree.getParentId(id);
        var stg = tree.getParentId(pgs);
        var year = tree.getParentId(stg);
        var prog = tree.getParentId(year);
        path += tree.getItemText(prog)+' > '+tree.getItemText(year)+' > '+tree.getItemText(stg)+' > '+tree.getItemText(pgs)+' > '+tree.getItemText(id);
    }else if(_id[0]=='pupil'){
        var pg = tree.getParentId(id);
        var pgs = tree.getParentId(pg);
        var stg = tree.getParentId(pgs);
        var year = tree.getParentId(stg);
        var prog = tree.getParentId(year);
        path += tree.getItemText(prog)+' > '+tree.getItemText(year)+' > '+tree.getItemText(stg)+' > '+tree.getItemText(pgs)+' > '+tree.getItemText(pg)+' > '+tree.getItemText(id);
    }
    $('#main-box-header').text(path);
    $('#main-box-header').addClass('header_navigation_text');
    content.setTitle("main-content", 'Pupils');
}

function getParent(id,idp){
    if(content){
        content.destroy();
        content = null;
    }

    content = new schoolmule.controls.layout({
        cellsBlock: {
            display_footer_right: true,
            cells_right:[
                {
                    cells:[{
                        new_count : false,
                        id : "main-box-header",
                        title: "",
                        width: '100%',
                        height: '20px',
                        border_bottom: true
                    }]
                },
                {
                    cells:[
                        {
                            new_count : true,
                            id : "grid_setup_parents",
                            title: "",
                            width: '100%',
                            height: '100%',
                            border_right: false
                        }
                    ]
                }
            ]
        }
    });
    content.elements.push(acc);
    //content.showLoader();
    attachButtons(content,'grid_setup_parents');
    schoolmule.instances.grid_setup_parents.attachTo("grid_setup_parents", id);
    content.elements.push(schoolmule.instances.grid_setup_parents);

    var path = dlang("setup_path_users","Users: ");
    var _id = id.split('_');
    var tree = schoolmule.instances.tree_users.getTree();
    var pupil = tree.getParentId('parent_'+id+'_'+idp);
    var pupilgroup = tree.getParentId(pupil);
    var year = tree.getParentId(pupilgroup);
    var progr = tree.getParentId(year);
    path += tree.getItemText(progr)+' > '+tree.getItemText(year)+' > '+tree.getItemText(pupilgroup)+' > '+tree.getItemText(pupil)+' > '+tree.getItemText('parent_'+id+'_'+idp);
    $('#main-box-header').text(path);
    $('#main-box-header').addClass('header_navigation_text');
    content.setTitle("main-content",dlang("setup_details_parents_title","Pupil parents"));
}

function getStaff(id){
    if(content){
        content.destroy();
        content = null;
    }

    content = new schoolmule.controls.layout({
        cellsBlock: {
            display_footer_right: true,
            cells_right:[
                {
                    cells:[{
                        new_count : false,
                        id : "main-box-header",
                        title: "",
                        width: '100%',
                        height: '20px',
                        border_bottom: true
                    }]
                },
                {
                    cells:[
                        {
                            new_count : true,
                            id : "setup_grid",
                            title: "",
                            width: '100%',
                            height: '100%',
                            border_right: false
                        }
                    ]
                }
            ]
        }
    });
    content.elements.push(acc);
    //content.showLoader();
    attachButtons(content,'grid_setup_staff');
    schoolmule.instances.grid_setup_staff.attachTo("setup_grid", id);
    content.elements.push(schoolmule.instances.grid_setup_staff);
    var _id = id.split('_');
    var path = dlang("setup_path_struct","Programme structure: ");
    var tree = schoolmule.instances.tree_programme_structure.getTree();
    if(_id[0]=='teachers'){
        var stg = tree.getParentId(id);
        var year = tree.getParentId(stg);
        var progr = tree.getParentId(year);
        path += tree.getItemText(progr)+' > '+tree.getItemText(year)+' > '+tree.getItemText(stg)+' > '+tree.getItemText(id);
    }else if(_id[0]=='staffmember' && tree.getParentId(id).split('_')[0]=="teachers"){
        var teachers = tree.getParentId(id);
        var stg = tree.getParentId(teachers);
        var year = tree.getParentId(stg);
        var progr = tree.getParentId(year);
        path += tree.getItemText(progr)+' > '+tree.getItemText(year)+' > '+tree.getItemText(stg)+' > '+tree.getItemText(teachers)+' > '+tree.getItemText(id);
    }else if(_id[0]=='staffmember'){
        path = dlang("setup_path_users","Users: ");
        var tree = schoolmule.instances.tree_users.getTree();
        path +=dlang("setup_path_staff","Staff")+' > '+tree.getItemText(id);
    }else{
        path = dlang("setup_path_users","Users: ");
        var tree = schoolmule.instances.tree_users.getTree();
        path +=  tree.getItemText(id);
    }

    $('#main-box-header').text(path);
    $('#main-box-header').addClass('header_navigation_text');
    content.setTitle("main-content",dlang("setup_details_staff_title","Staff members"));

    //content.setTitle("main-content",dlang("Database content and hierarchy"));
}

function getPupil(id){
    if(content){
        content.destroy();
        content = null;
    }
    content = new schoolmule.controls.layout({
        cellsBlock: {
            display_footer_right: true,
            cells_right:[
                {
                    cells:[{
                        new_count : false,
                        id : "main-box-header",
                        title: "",
                        width: '100%',
                        height: '20px',
                        border_bottom: true
                    }]
                },
                {
                    cells:[
                        {
                            new_count : true,
                            id : "setup_grid",
                            title: "",
                            width: '100%',
                            height: '100%',
                            border_right: false
                        }
                    ]
                }
            ]
        }
    });
    //content.showLoader();
    attachButtons(content,'grid_setup_pupils');
    content.elements.push(acc);
    schoolmule.instances.grid_setup_pupils.attachTo("setup_grid");

    content.elements.push(schoolmule.instances.grid_setup_pupils);
    var path = dlang("setup_path_users","Users: ");
    var _id = id.split('_');
    var tree = schoolmule.instances.tree_users.getTree();
    if(_id[0]=='years'){
        var progr = tree.getParentId(id);
        path += dlang("setup_path_pupils","Pupils")+' > '+tree.getItemText(progr)+' > '+tree.getItemText(id);
        content.setTitle("main-content", path);
    }else if(_id[0]=='pupil' && tree.getParentId(id).split('_')[0]=="pupilgroup"){
        var pupilgroup = tree.getParentId(id);
        var year = tree.getParentId(pupilgroup);
        var progr = tree.getParentId(year);
        path += dlang("setup_path_pupils","Pupils")+' > '+ tree.getItemText(progr)+' > '+tree.getItemText(year)+' > '+tree.getItemText(pupilgroup)+' > '+tree.getItemText(id);

        content.setTitle("main-content",path);
    }else if(_id[0]=='pupilgroup'){
        var pupilgroup = tree.getParentId(id);
        var year = tree.getParentId(pupilgroup);
        var progr = tree.getParentId(year);
        path += tree.getItemText(progr)+' > '+tree.getItemText(year)+' > '+tree.getItemText(pupilgroup)+' > '+tree.getItemText(id);
        content.setTitle("main-content",path);
    }

    $('#main-box-header').text(path);
    $('#main-box-header').addClass('header_navigation_text');
    content.setTitle("main-content", dlang("setup_details_pupils_title","Pupils"));

}

function viewLog(){
    var log = null;
    var dialog = new schoolmule.controls.window_popup(
        {
            title: "Log",
            width: "500px",
            height: "600px",
            buttons: {
                "Close": function() {
                    dialog.win_dialog.dialog("destroy");
                    dialog.win_dialog.remove();
                }

            },
            onBeforeShow: function(container){
                var cont = $("#"+container);
                var logs = "";
                var litem = "\
                        <div class='log_item'>\
                            <div class='log_time'><span><%= time %></span></div>\
                            <div class='log_text'><span><%= text %></span></div>\
                            <div class='log_user'><span><%= user %></span></div>\
                        </div>\
                    ";

                $.post("connectors/connector.php?control_id=grid_setup_database", {
                    action:"getlogs"
                }, function(res){
                    for(var i=0; i<res.length; i++){
                        logs+= _.template(litem,{
                            time: res[i].time,
                            text: res[i].text,
                            user: res[i].user
                        });
                    }
                    cont.append(logs);
                },'json');


            }
        });
    dialog.show({
        container: "massage_box"
    });
}
function printLoginPass(gridname){
    var users="";
    var usert = "\
    <div style='width:100%; height: 100%;'>\
        <div style='width: 100%; height: 35%;'></div>\
        <div style='width: 100%; height: 30%;'>\
            <table style=' margin:0 auto; border: 1px solid #000000; width: 65%; height: 100%; padding: 20px; font-family: Verdana' \
                <tr>\
                <td>"+dlang("print_school","School:")+"</td>\
                <td><%= school %></td>\
                </tr>\
                <tr>\
                    <td>"+dlang("print_programme","Programme:")+"</td>\
                    <td><%= programme %></td>\
                    </tr>\
                        <tr>\
                            <td>"+dlang("print_pg","Pupilgroup:")+"</td>\
                            <td><%= pupilgroup %></td>\
                        </tr>\
                        <tr>\
                            <td>"+dlang("print_name","Name:")+"</td>\
                            <td><%= name %></td>\
                        </tr>\
                        <tr>\
                            <td>"+dlang("print_id","ID:")+"</td>\
                            <td><%= id %></td>\
                        </tr>\
                        <tr>\
                            <td>"+dlang("print_username","Username:")+"</td>\
                            <td><%= username %></td>\
                        </tr>\
                        <tr>\
                            <td>"+dlang("print_pass","Password:")+"</td>\
                            <td><%= password %></td>\
                        </tr>\
                        <tr>\
                        </tr>\
                        <tr>\
                            <td colspan='2'>"+dlang("print_info","You will have to change password of first login. At least 7 digits containing numbers and letters")+"</td>\
                        </tr>\
            </table>\
        </div>\
        <div style='width: 100%; height: 35%;'></div>\
    </div>\
    ";
    var grid = null;
    switch(gridname){
        case 'grid_setup_pupils':
            grid = schoolmule.instances.grid_setup_pupils;
            break;
        case 'grid_setup_pupils_stg':
            grid = schoolmule.instances.grid_setup_pupils_stg;
            break;
        case 'grid_setup_staff':
            grid = schoolmule.instances.grid_setup_staff;
            break;
        case 'grid_setup_studygroups':
            grid = schoolmule.instances.grid_setup_studygroups;
            break;
        case 'grid_setup_parents':
            grid = schoolmule.instances.grid_setup_parents;
            break;
    }

    var grid = grid.getGrid().grid;
    var checked = grid.getCheckedRows(0);

    checked = checked.split(',');
    var school = schoolmule.main.entity_title;
    var programme;
    var pupilgroup;
    var name;
    var id;
    var username;
    var password;
    var name;

    for(var i=0; i<checked.length; i++){
        var item = checked[i].split('_');
        var add = false;
        switch(item[0]){
            case "staffmember":
                add = true;
                password = grid.getUserData(checked[i],'pass');
                username = grid.cells(checked[i],6).getValue();
                name = grid.cells(checked[i],1).getValue()+" "+grid.cells(checked[i],2).getValue();
                pupilgroup = "";
                programme = "";
                id = grid.cells(checked[i],3).getValue();
                break;
            case "pupil":
                add = true;
                password = grid.getUserData(checked[i],'pass');
                username = grid.cells(checked[i],8).getValue();
                name = grid.cells(checked[i],1).getValue()+" "+grid.cells(checked[i],2).getValue();
                pupilgroup = grid.cells(checked[i],4).getValue();
                programme = grid.getUserData(checked[i],'programme');
                id = grid.cells(checked[i],3).getValue();
                break;
            case "parent":
                add = true;
                password = grid.getUserData(checked[i],'pass');
                username = grid.cells(checked[i],3).getValue();
                name = grid.cells(checked[i],1).getValue()+" "+grid.cells(checked[i],2).getValue();
                pupilgroup = "";
                programme = "";
                id = "";
                break;
            default:
                continue;
        }
        if(add){
            var user = _.template(usert,{
                school: school,
                programme: programme,
                pupilgroup: pupilgroup,
                name: name,
                id: id,
                username: username,
                password: password
            });
            users+=user;
        }
    }

    if(users==""){
        alert("Please, select users!");
        return false;
    }

    var html = "\
    <html>\
        <head>\
            <meta http-equiv='Content-Type' content='text/html; charset=utf-8'/>\
        </head>\
        <body>\
    ";
    html+=users;

    html+="\
        </body>\
    </html>\
    ";
    printWindow = window.open('','printWindow','Location=0,Toolbar=0,Location=0,Directories=0,Status=0,Menubar=0,Scrollbars=0,Resizable=0');
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.print();
    printWindow.close();
}

function selectLastImport(gridname){
    if(last_defined!=""){
        var grid = null;
        switch(gridname){
            case 'grid_setup_pupils':
                grid = schoolmule.instances.grid_setup_pupils;
                break;
            case 'grid_setup_pupils_stg':
                grid = schoolmule.instances.grid_setup_pupils_stg;
                break;
            case 'grid_setup_staff':
                grid = schoolmule.instances.grid_setup_staff;
                break;
            case 'grid_setup_studygroups':
                grid = schoolmule.instances.grid_setup_studygroups;
                break;
        }
        grid = grid.getGrid().grid;
        if(grid){
            last_defined = last_defined.replace(new RegExp('"','g'),'');
            var ld = last_defined.split(',');
            for(var i=0; i<ld.length; i++){
                var row = grid.cells(ld[i], 0);
                if(row){
                    row.setValue(1);
                    enableButton('delete_selected');
                }

            }
        }
    }else{
        alert("No last defined objects!")
    }

}

function deleteSelectedRows(gridname){
    var grid = null;
    var tree = null;
    var treename = null;
    switch(gridname){
        case 'grid_setup_pupils':
            grid = schoolmule.instances.grid_setup_pupils;
            tree = schoolmule.instances.tree_users;
            treename = "tree_users";
            break;
        case 'grid_setup_pupils_stg':
            grid = schoolmule.instances.grid_setup_pupils_stg;
            tree = schoolmule.instances.tree_programme_structure;
            treename = "tree_programme_structure";
            break;
        case 'grid_setup_staff':
            grid = schoolmule.instances.grid_setup_staff;
            tree = schoolmule.instances.tree_users;
            treename = "tree_users";
            break;
        case 'grid_setup_studygroups':
            grid = schoolmule.instances.grid_setup_studygroups;
            tree = schoolmule.instances.tree_programme_structure;
            treename = "tree_programme_structure";
            break;
    }
    grid = grid.getGrid().grid;
    var checked = grid.getCheckedRows(0);
    tree = tree.getTree();

    if(confirm("Delete all selected?")){
        $.post("connectors/connector.php?control_id=grid_setup_database", {
            action:"delete_checked",
            checked: checked
        }, function(res){
            grid.updateFromXML('connectors/connector.php?control_id='+gridname,false,true);
            tree.smartRefreshBranch('pupils','connectors/connector.php?control_id='+treename);
        });
        disableButton("delete_selected");
    }
}
