
<?php

include_once("libs/Connection.php");
include_once("libs/administrator.php");
include_once("libs/lang.php");

$login = "";
$labels = 0;
$admin = new administrator();

if($admin->login!=null){
    $login = $admin->login;
}else{
    $protocol='http';
    if (isset($_SERVER['HTTPS']))
        if (strtoupper($_SERVER['HTTPS'])=='ON')
            $protocol='https';
    if($protocol=='https'){
        header("location: $protocol://".$_SERVER['HTTP_HOST']."/login.php");
    }else{
        header('Location: login.php');
    }


    $login = "Guest";
}

$params['top_title'] = $admin->entity_title;

if(isset($_SESSION['lng'])){
    $lang = $_SESSION['lng'];
}else{
    $lang = 'en';
}
if(isset($_GET['lng']) && $_GET['lng']){
    $lang = $_GET['lng'];
    $langs = 'en,se,ru,da,fi,nw,pl,ge,it';
    if(strpos($langs,$lang)<0){
        $lang = 'en';
    }else{
        $lang = $_GET['lng'];
    }
    $_SESSION['lng'] = $lang;
}

if(isset($_GET['labels']) && $_GET['labels']){
    $labels = 1;
    $_SESSION['labels'] = 1;
}else{
    $_SESSION['labels'] = 0;
}

//session_start();
$appPath = "";

//$_SESSION['lng'] = $lang;
//session_start();
$item1_menu = dlang("main_menu_db_and_users","Database and users");
$item2_menu = dlang("main_menu_db_course_rooms","Courserooms");

// include file coneccted to database
include ("schoolmodule/dbconn.php");
// include config file with clsses where  select table and fields
include("schoolmodule/config.php");

unset( $_SESSION['script'] );
?>

<?php
$title = "Schoolmule";
switch($params['title']){
    case "browser_tab_assignemnt":
        $title = dlang("browser_tab_assignemnt","Assignments");
        break;
    case "browser_tab_setup":
        $title = dlang("browser_tab_setup","Setup");
        break;

}
?>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?php echo $title?></title>
<link rel="stylesheet" type="text/css" media="screen" href="css/pages.css" />

<link rel="stylesheet" type="text/css" media="screen" href="schoolmodule/css/module.css" />
<link rel="stylesheet" type="text/css" media="screen" href="schoolmodule/css/popup.css" />
<link rel="stylesheet" type="text/css" media="screen" href="css/jquery-ui.css" />
<link rel="stylesheet" type="text/css" media="screen" href="css/jquery.Jcrop.css" />

<link rel="stylesheet" type="text/css" href="dhtmlx/dhtmlxWindows/codebase/dhtmlxwindows.css">
<link rel="stylesheet" type="text/css" href="dhtmlx/dhtmlxWindows/codebase/skins/dhtmlxwindows_dhx_web.css">

<link rel="stylesheet" type="text/css" href="dhtmlx/dhtmlxCalendar/codebase/dhtmlxcalendar.css">
<link rel="stylesheet" type="text/css" href="dhtmlx/dhtmlxCalendar/codebase/skins/dhtmlxcalendar_omega.css">
<link rel="stylesheet" type="text/css" href="dhtmlx/dhtmlxCalendar/codebase/skins/dhtmlxcalendar_dhx_skyblue.css">

<link rel="stylesheet" type="text/css" href="dhtmlx/dhtmlxTree/codebase/dhtmlxtree.css">
<link rel="stylesheet" type="text/css" href="dhtmlx/dhtmlxGrid/codebase/dhtmlxgrid.css">
<link rel="stylesheet" type="text/css" href="dhtmlx/dhtmlxGrid/codebase/skins/dhtmlxgrid_dhx_schoolmule.css">
<link rel="stylesheet" type="text/css" href="dhtmlx/dhtmlxCombo/codebase/dhtmlxcombo.css">
<link rel="stylesheet" type="text/css" href="dhtmlx/dhtmlxMenu/codebase/skins/dhtmlxmenu_dhx_schoolmule.css">

<link rel="stylesheet" type="text/css" href="dhtmlx/dhtmlxForm/codebase/skins/dhtmlxform_dhx_skyblue.css">
<link rel="stylesheet" type="text/css" href="dhtmlx/dhtmlxForm/codebase/skins/dhtmlxform_dhx_web.css">
<link rel="stylesheet" type="text/css" href="dhtmlx/dhtmlxForm/codebase/skins/dhtmlxform_dhx_terrace.css">
<link rel="stylesheet" type="text/css" href="dhtmlx/dhtmlxChart/codebase/dhtmlxchart.css">
<link rel="stylesheet" type="text/css" href="dhtmlx/dhtmlxMessage/themes/message_default.css">


<script type="text/javascript" src="dhtmlx/dhtmlxAjax/codebase/dhtmlxcommon.js"></script>
<script type="text/javascript" src="dhtmlx/dhtmlxTree/codebase/dhtmlxtree.js"></script>
<script type="text/javascript" src="dhtmlx/dhtmlxTree/codebase/ext/dhtmlxtree_ed.js"></script>
<script type="text/javascript" src="dhtmlx/dhtmlxTree/codebase/ext/dhtmlxtree_xw.js"></script>
<script type="text/javascript" src="dhtmlx/dhtmlxTree/codebase/ext/dhtmlxtree_sb.js"></script>
<script type="text/javascript" src="dhtmlx/dhtmlxGrid/codebase/dhtmlxgrid.js"></script>
<script type="text/javascript" src="dhtmlx/dhtmlxGrid/codebase/dhtmlxgridcell.js"></script>
<script type="text/javascript" src="dhtmlx/dhtmlxCombo/codebase/dhtmlxcombo.js"></script>
<script type="text/javascript" src="dhtmlx/dhtmlxGrid/codebase/ext/dhtmlxgrid_excell_combo.js"></script>
<script type="text/javascript" src="dhtmlx/dhtmlxGrid/codebase/ext/dhtmlxgrid_filter.js"></script>
<script type="text/javascript" src="dhtmlx/dhtmlxGrid/codebase/ext/dhtmlxgrid_ssc.js"></script>
<script type="text/javascript" src="dhtmlx/dhtmlxGrid/codebase/ext/dhtmlxgrid_nxml.js"></script>
<script type="text/javascript" src="dhtmlx/dhtmlxGrid/codebase/ext/dhtmlxgrid_srnd.js"></script>
<script type="text/javascript" src="dhtmlx/dhtmlxGrid/codebase/ext/dhtmlxgrid_mcol.js"></script>
<script type="text/javascript" src="dhtmlx/dhtmlxGrid/codebase/ext/dhtmlxgrid_export.js"></script>
<script type="text/javascript" src="dhtmlx/dhtmlxGrid/codebase/ext/dhtmlxgrid_excell_sub_row.js"></script>
<script type="text/javascript" src="dhtmlx/dhtmlxGrid/codebase/excells/dhtmlxgrid_excell_acheck.js"></script>
<script type="text/javascript" src="dhtmlx/dhtmlxGrid/codebase/ext/dhtmlxgrid_validation.js"></script>

<script type="text/javascript" src="dhtmlx/dhtmlxCalendar/codebase/dhtmlxcalendar.js"></script>

<script type="text/javascript" src="dhtmlx/dhtmlxTreeGrid/codebase/dhtmlxtreegrid.js"></script>
<script type="text/javascript" src="dhtmlx/dhtmlxTreeGrid/codebase/ext/dhtmlxtreegrid_filter.js"></script>
<script type="text/javascript" src="dhtmlx/dhtmlxTreeGrid/codebase/ext/dhtmlxtreegrid_lines.js"></script>
<script type="text/javascript" src="dhtmlx/dhtmlxCombo/codebase/ext/dhtmlxcombo_extra.js"></script>
<script type="text/javascript" src="dhtmlx/dhtmlxCombo/codebase/ext/dhtmlxcombo_group.js"></script>
<script type="text/javascript" src="dhtmlx/dhtmlxCombo/codebase/ext/dhtmlxcombo_whp.js"></script>
<script type="text/javascript" src="dhtmlx/dhtmlxWindows/codebase/dhtmlxcontainer.js"></script>
<script type="text/javascript" src="dhtmlx/dhtmlxWindows/codebase/dhtmlxwindows.js"></script>

<script type="text/javascript" src="dhtmlx/dhtmlxMenu/codebase/dhtmlxmenu.js"></script>
<script type="text/javascript" src="dhtmlx/dhtmlxMenu/codebase/ext/dhtmlxmenu_ext.js"></script>
<script type="text/javascript" src="dhtmlx/dhtmlxConnector/php/codebase/dhtmlxdataprocessor.js"></script>
<script type="text/javascript" src="dhtmlx/dhtmlxConnector/php/codebase/connector.js"></script>

<script type="text/javascript" src="dhtmlx/dhtmlxForm/codebase/dhtmlxform.js"></script>
<script type="text/javascript" src="dhtmlx/dhtmlxForm/codebase/ext/dhtmlxform_item_calendar.js"></script>
<script type="text/javascript" src="dhtmlx/dhtmlxForm/codebase/ext/dhtmlxform_item_upload.js"></script>
<script type="text/javascript" src="dhtmlx/dhtmlxForm/codebase/ext/swfobject.js"></script>
<script type="text/javascript" src="dhtmlx/dhtmlxChart/codebase/dhtmlxchart.js"></script>
<script type="text/javascript" src="js/date.format.js"></script>
<script type="text/javascript" src="dhtmlx/dhtmlxMessage/message.js"></script>

<script type="text/javascript" src="dhtmlx/dhtmlxGrid/codebase/excells/dhtmlxgrid_excell_dhxcalendar.js"></script>
<script type="text/javascript" src="js/lang.js"></script>

<script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript" src="js/jquery.scrollTo-min.js"></script>
<script type="text/javascript" src="js/jquery-ui.js"></script>
<script type="text/javascript" src="js/jquery.Jcrop.min.js"></script>
<script type="text/javascript" src="js/jquery.autosize-min.js"></script>
<script type="text/javascript" src="js/underscore.js"></script>
<script type="text/javascript" src="js/moment.min.js"></script>
<script type="text/javascript" src="js/hash.js"></script>
<script type="text/javascript" src="tinymce/tinymce.min.js" ></script>
<script type="text/javascript" src="js/main.js"></script>
<script type="text/javascript" src="schoolmodule/js/sample.js"></script>
<script type="text/javascript" src="schoolmodule/js/selectPupil.js"></script>

<script>
    var gl_user_lang = <?php echo '"'.$lang.'"'?>;
    var labels_shows = <?php echo $labels?>;
    $(function(){
        $("body").on("contextmenu", false);
        schoolmule.main = new main({});
        schoolmule.main.user_id = <?php echo $admin->id?$admin->id:"null"?>;
        schoolmule.main.user_login = <?php echo $login?'"'.$login.'"':""?>;
        schoolmule.main.user_role = <?php echo $admin->role?'"'.$admin->role.'"':"''"?>;
        schoolmule.main.first_login = <?php echo $admin->first_login==1?'"'.'1'.'"':"'0'"?>;
        schoolmule.main.entity = <?php echo $admin->entity?'"'.$admin->entity.'"':"'0'"?>;
        schoolmule.main.entity_title = <?php echo $admin->entity_title?'"'.$admin->entity_title.'"':"''"?>;
        schoolmule.main.full_name = <?php echo $admin->full_name?'"'.$admin->full_name.'"':"''"?>;


        if(parseInt(schoolmule.main.first_login)==1){
            schoolmule.main.showInstructions();
        }        
        if(window.location.href.indexOf('setup.php') + 1){
            if(schoolmule.main.user_role=='pupil' || schoolmule.main.user_role=='parent' || schoolmule.main.user_role=='staff'){
                window.location = 'index.php';
            }
            if(schoolmule.main.user_role=='mainadmin'){
                window.location = 'backend.php';
                return false;
            }
            $('#top-menu-fold-setup_menu').addClass('top_menu_fold_selected');
            $('#setup_menu').addClass('top_menu_selected');
        }else if(window.location.href.indexOf('course_objectives.php') + 1 
                || window.location.href.indexOf('second-menu_assignmrnts_and_performance') + 1 
                || (window.location.href === window.location.origin)
                || (window.location.href === window.location.origin+'/')){
            if(schoolmule.main.user_role=='mainadmin'){
                window.location = 'backend.php';
            }
            $('#top-menu-fold-course_objectives_menu').addClass('top_menu_fold_selected');
            $('#course_objectives_menu').addClass('top_menu_selected');
        }else if(window.location.href.indexOf('backend.php') + 1){
            if(schoolmule.main.user_role!='mainadmin'){
                window.location = 'course_objectives.php';
                return false;
            }
        }

        if(schoolmule.main.user_role=='pupil' || schoolmule.main.user_role=='parent' || schoolmule.main.user_role=='staff'){
            $('#setup_menu').parent().css('padding-left',"0");
            $('#setup_menu').remove();
        }else{
            $('#setup_menu').show();
        }

        if(schoolmule.main.user_role=='mainadmin'){
            $('#first-menu').remove();
        }
    });
</script>