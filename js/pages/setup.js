$(function(){
    viewSetup();
});

var content = null;
var acc = null;
var navigation = null;
var tabbar = null;

/*do not need it now*/
//var last_defined = "";

/*init setup page function*/
function viewSetup(){
	var hashValues = Hash.get();
	var default_select = true;
	if(hashValues.tab){
		default_select = false;
	}
	tabbar = new schoolmule.controls.tabs({
		container:"second-menu",
		width:'139px',
		tabs_left:{
            id:'left-tab',
            callback: function(){},
            label:dlang("setup_page_title","Database and users"),
            select: false
        },
		tabs: [
			{
				id:'database',
				callback: function(){
					showSetupDatabase();
				},
				select: default_select,				
				label:dlang("setup_page_db_tab","Database")
			}
		]
	});

	if(hashValues.tab){
		tabbar.setActiveTab(hashValues.tab);
	}
}

/*Clears page content*/
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

/*Creates setup page layout*/
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
                title: dlang("setup_page_prog_str_acc","Studygroups"),
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

/*Shows studygroup grid in layout*/
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

    attachButtons(content,'grid_setup_studygroups');
    schoolmule.instances.grid_setup_studygroups.attachTo("setup_grid",id);
    content.elements.push(schoolmule.instances.grid_setup_studygroups);

    var _id = id.split('_');
    var tree = schoolmule.instances.tree_programme_structure.getTree();
    var path = dlang("setup_path_struct","Studygroup: ");
    if(_id[0]=='years'){
        path += tree.getItemText(tree.getParentId(id))+' > '+tree.getItemText(id);

    }else{
        path += tree.getItemText(tree.getParentId(tree.getParentId(id)))+' > '+ tree.getItemText(tree.getParentId(id))+' > '+tree.getItemText(id);
    }

    $('#main-box-header').text(path);
    $('#main-box-header').addClass('header_navigation_text');
    content.setTitle("main-content", dlang("structure_import_ch","Studygroups"));
}

/*Show "Assign content" window*/
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

/*Export all pupils (in studygroups) to excel file*/
function exportToExcel(){
    seconfirm(dlang("export_confirm_dialog","Export Pupil Studyplans to Excell file format. This export will include all Grades on all Studygroups of all Pupils in system"),
    function(){
        window.open("libs/export_import.php?type=export");
    });
}

/*Import pupils and studygroups from excel file window*/
function importFromExcel(){
    //var simport = dlang("import_button_text","Import");
    var close = dlang("import_button_close","Close");

    var user_file = null;
    var file = null;
    var programme_file = null;



    var message_dialog = new schoolmule.controls.window_popup(
        {
            title: dlang("import_confirm_title","Import DB"),
            width: "423px",
            buttons: [
/*                {
                    text:simport,
                    click: function(){
                        var upl_params = "type=import&";
                        if(!user_file && !programme_file){
                            return false;
                        }

                        if(user_file){
                            upl_params += "&users="+user_file;
                        }

                        if(programme_file){
                            upl_params += "&programme="+programme_file;
                        }

                        $.post("libs/export_import.php?"+upl_params,{}, function(res){

                        },'json');
                    }
                },*/
                {
                    text:close,
                    click: function() {
                        message_dialog.win_dialog.dialog("destroy");
                        message_dialog.win_dialog.remove();
                    }
                }
            ],
            onBeforeShow: function(container){
                /*create import form config*/
                var formData = [
                    {
                        type: "checkbox",
                        label: dlang("user_data_import_ch","User data"),
                        name: "user_data"
                    },
                    {
                        type: "label", label: dlang("import_user_help_text","Choose a Microsoft Excell file that has the following field names as column names. Only these fields will be imported. If some of these field names are not present in the file, the fields that does not exist will not be imported, but the rest will.: Studygroup name, Subject, Academic year, Teacher, Pupilgroup, Course, Points, Start date, End date. ")
                    },
                    {
                        type: "fieldset",
                        width:403,
                        label: dlang("user_data_uploader_fieldset","User data uploader"),
                        list: [
                            {
                                type: "upload",
                                inputWidth:373,
                                disabled:true,
                                inputHeight: 30,
                                titleScreen: false,

                                name: "upload_user_data",
                                url: "libs/export_import.php?action=upload"
                            }
                        ]
                    },
                    {
                        type: "checkbox",
                        label: dlang("structure_import_ch","Studygroups"),
                        name: "programme_structure"
                        //checked: true
                    },
                    {
                        type: "label", label: dlang("import_stgs_help_text","Choose a Microsoft Excell file that has the following field names as column names. Only these fields will be imported. If some of these field names are not present in the file, the fields that does not exist will not be imported, but the rest will.: Studygroup name, Subject, Academic year, Teacher, Pupilgroup, Course, Points, Start date, End date.")
                    },
                    {
                        type: "fieldset",
                        width:403,
                        label: dlang("programme_data_uploader_fieldset","Studygroups uploader"),
                        list: [
                            {
                                type: "upload",
                                inputWidth:373,
                                disabled:true,
                                inputHeight: 30,
                                titleScreen: false,
                                name: "upload_programme_struct",
                                url: "libs/export_import.php?action=upload"
                            }
                        ]
                    }
                ];
                $('#'+container).append("<p>"+dlang("export_text_alert","What do you want to import, User data or Programme structure ?")+"</p>");


                /*create import form*/
                var message_form = new dhtmlXForm(container, formData);

                /*get user data uploader*/
                var uploader = message_form.getUploader("upload_user_data");
                uploader.name = "upload_user_data";
                uploader._addFileToList2 = uploader._addFileToList;
                uploader._addFileToList = function(id, name, size){
                    this._addFileToList2.apply(this,arguments);
                    this.callEvent("onFileAdded", [id, name, size, uploader]);
                }

                /*get programme uploader*/
                var uploader2 = message_form.getUploader("upload_programme_struct");
                uploader2.name = "upload_programme_struct";
                uploader2._addFileToList2 = uploader2._addFileToList;
                uploader2._addFileToList = function(id, name, size){
                    this._addFileToList2.apply(this,arguments);
                    this.callEvent("onFileAdded", [id, name, size,uploader2]);
                }


                message_form.attachEvent("onUploadComplete",function(realName,serverName){
/*                        uploader.clear();
                        uploader2.clear();*/
                        /*function shows import result alert*/
                        var alertExportResults = function(res){
                            $.post("libs/export_import.php?action=remove_files",{
                                file:file.name
                            });
                            if(~~res.imported == 0){
                                alert(dlang("incorrect_import_data_file","Sorry, incorrect data in the file. Please correct file and try again."));
                            }else{
                                alert(res.imported+" "+dlang("rows_added_import_text","row(s) added.")+(parseInt(res.errors)!=0?" "+res.errors+" "+dlang("rows_ignored_import_text"," rows ignored (has incompatible content)"):""));
                            }

                            uploader.clear();
                            uploader2.clear();
                            schoolmule.instances.tree_users.refreshAllTree();
                            schoolmule.instances.tree_programme_structure.refreshAllTree();
                        }

                        var cancelImport = function() {
                            $.post("libs/export_import.php?action=remove_files",{
                                file:file.name
                            });
                            uploader.clear();
                            uploader2.clear();
                        };

                        $.post("libs/export_import.php?action="+file.type+"&file="+file.name,{}, function(res){
                            var type = "";
                            if(file.type == "upload_user_data"){
                                type = dlang("","Users");
                            }else{
                                type = dlang("structure_import_ch","Studygroups");
                            }

                            /*Count import fields confirm*/
                            seconfirm(dlang("import_confirm_first","The file you have choosen consist of")+" "+res+" "+type+" "+dlang("import_confirm_second","that can be imported"),function(){
                                var upl_params = "type=import";
                                if(file.type == "upload_user_data"){
                                    upl_params += "&users="+file.name;
                                }else{
                                    upl_params += "&programme="+file.name;
                                }

                                $.post("libs/export_import.php?"+upl_params,{}, function(res){
                                    /*if import file consist duplicated fields*/
                                    if(parseInt(res.duplicate)!=0 && !isNaN(parseInt(res.duplicate))){
                                        var question = dlang("duplicated_confirm_first","We have found")+" "+res.duplicate+" "+dlang("duplicated_confirm_second","items in this file that has the same name, or username as items already in the Database. Do you want to import these items and update the rest of the info, or do you want to ignore these items and only import the rest of the file to Database ?");
                                        var cont = $('<div id="dialog-confirm" title="">\
                                        <p>'+question+'</p></div>');
                                        $('body').append(cont);

                                        var update = dlang("button_update","Update");
                                        var ignore = dlang("button_ignote","Ignore");
                                        var cancel = dlang("button_cancel","Cancel");


                                        cont.dialog({
                                            autoOpen: true,
                                            modal: true,
                                            width: 300,
                                            minHeight: 120,
                                            resizable: false,
                                            buttons: [
                                                {
                                                    text: update,
                                                    click: function() {
                                                        cont.dialog( "destroy" );
                                                        cont.remove();
                                                        $.post("libs/export_import.php?update=1&"+upl_params,{}, function(res){
                                                            alertExportResults(res);
                                                        },'json')
                                                    }
                                                },
                                                {
                                                    text: ignore,
                                                    click: function() {
                                                        cont.dialog( "destroy" );
                                                        cont.remove();
                                                        $.post("libs/export_import.php?update=0&"+upl_params,{}, function(res){
                                                            alertExportResults(res);
                                                        },'json')
                                                    }
                                                },
                                                {
                                                    text: cancel,
                                                    click: function() {
                                                        cancelImport(file);
                                                        cont.dialog( "destroy" );
                                                        cont.remove();
                                                    }
                                                }
                                            ],
                                            beforeClose: function( event, ui ) {
                                                cont.dialog("destroy");
                                                cont.remove();
                                            }
                                        });

                                    }else{
                                        alertExportResults(res);
                                    }
                                },'json');
                            },function(){
                                cancelImport(file);
                            });
                        });
                });

                /*when user select import checkboxes*/
                message_form.attachEvent("onChange", function (id, value){
                    switch(id){
                        case "user_data":
                            if(message_form.getItemValue(id)){
                                message_form.enableItem('upload_user_data');
                            }else{
                                message_form.disableItem('upload_user_data');
                            }
                            break;
                        case "programme_structure":
                            if(message_form.getItemValue(id)){
                                message_form.enableItem('upload_programme_struct');
                            }else{
                                message_form.disableItem('upload_programme_struct');
                            }
                            break;
                    }
                });

                /*when file added in upload area*/
                message_form.attachEvent("onFileAdded", function(id,name,size,uploader){
                    var type = name.split(".").pop();
                    if(type!="xls" && type!="xlsx"){
                        alert(dlang(/*"",*/"Please select excell file (.xls or .xlsx)"));
                        uploader.clear();
                    }

                    if(Object.keys(uploader._files).length >=2){
                        uploader._removeFileFromQueue(id);
                        alert(dlang(/*"",*/"You can add only one file!"));
                    }else{
                        file = {
                            name:name,
                            type:uploader.name
                        };
/*                        if(uploader.name == "upload_user_data"){
                            user_file = name;
                        }else{
                            programme_file = name;
                        }*/
                    }
                });

                /*when file added from upload area*/
                message_form.attachEvent("onFileRemove",function(realName,serverName){
                    if(user_file==realName){
                        user_file = null;
                    }
                    if(programme_file==realName){
                        programme_file = null;
                    }
                    file = null;
                });

/*                $(".dhx_file_uploader_button.button_upload").remove();
                $(".dhx_file_uploader_button.button_browse").css({
                    right:'74px'
                });*/

                message_form.setSkin('dhx_terrace');
            }
        }
    );

    /*show import dialog*/
    message_dialog.show({
        container: "massage_box"
    });
}

/*attach buttons in footer details part ans set click actions*/
function attachButtons(content,grid){
    /*get tree users*/
    var tu = schoolmule.instances.tree_users.getTree();

    /*get tree programme structure*/
    var tps = schoolmule.instances.tree_programme_structure.getTree();

    content.attachButtons([
        {
            label : dlang("setup_button_assig_cont","Assign content"),
            id : "assign_content",
            callback : function(){
                if(grid == "grid_setup_pupils"){
                    var tree = schoolmule.instances.tree_users.getTree(),
                        id = tree.getSelectedItemId(),
                        server = "connectors/connector.php?control_id=tree_users";

                    showAssignPupilToPupilGroupWindow(id,tree,server);
                }else{
                    showDialogWindow();
                }
            }
        },
        {
            label : dlang("setup_button_import","Import from Excel file"),
            id : "import",
            callback : function(){
                importFromExcel();
            }
        },
        {
            label : dlang("setup_button_export","Export to Excel file"),
            id : "export",
            callback : function(){
                exportToExcel();
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

    /*check need show buttos*/
    if(!tu.getSelectedItemId()){
        var sel = tps.getSelectedItemId().split('_');
        if(sel[0]=='studygroup' || sel[0]=='years'){
            return true;
        }
    }

}

/*details for pupils in studygroup*/

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

    attachButtons(content,'grid_setup_pupils_stg');
    content.elements.push(acc);
    schoolmule.instances.grid_setup_pupils_stg.attachTo("setup_grid",id);
    content.elements.push(schoolmule.instances.grid_setup_pupils_stg);

    /*set details dynamic header*/
    var _id = id.split('_');
    var path = dlang("setup_path_struct","Studygroups: ");
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
    content.setTitle("main-content", dlang("setup_path_pupils","Pupils"));
}

/*shows detail page for parents*/
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

/*shows detail page for staff members*/
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
    attachButtons(content,'grid_setup_staff');
    schoolmule.instances.grid_setup_staff.attachTo("setup_grid", id);
    content.elements.push(schoolmule.instances.grid_setup_staff);

    var _id = id.split('_');
    var path = dlang("setup_path_struct","Studygroups: ");
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
}

/*shows detail page for pupils*/
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

/*shows log which show all changes in DB*/
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

/*Shows print user info native window*/
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

    var printWindow = window.open('','printWindow','');
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.print();
    printWindow.close();
}


/*function selectLastImport(gridname){
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
}*/

/*Delete all checked in grid rows func*/
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

    seconfirm(dlang("delete_all_selected_setup","Delete all selected?"),function(){
        $.post("connectors/connector.php?control_id=grid_setup_database", {
            action:"delete_checked",
            checked: checked
        }, function(res){
            grid.updateFromXML('connectors/connector.php?control_id='+gridname,false,true);
            tree.smartRefreshBranch('pupils','connectors/connector.php?control_id='+treename);
        });
        disableButton("delete_selected");
    })
}

