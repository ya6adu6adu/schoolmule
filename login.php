<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Chehow
 * Date: 15.08.13
 * Time: 11:36
 * To change this template use File | Settings | File Templates.
 */

include_once("libs/Connection.php");
include_once("libs/administrator.php");
include_once("libs/lang.php");

$admin = new administrator();

if($_GET['lng']){
    $lang = $_GET['lng'];
    $langs = 'en,se,ru,da,fi,nw,pl,ge,it';
    if(strpos($langs,$lang)<0){
        $lang = 'en';
    }else{
        $lang = $_GET['lng'];
    }
}else{
    $lang = 'en';
}
$_SESSION['lng'] = $lang;
$title = dlang("login_title_page","Login");
?>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel="shortcut icon" type="image/ico" href="favicon.png" />
<title><?php echo $title?></title>
<link rel="stylesheet" type="text/css" media="screen" href="css/pages.css" />
<script type="text/javascript" src="dhtmlx/dhtmlxAjax/codebase/dhtmlxcommon.js"></script>
<link rel="stylesheet" type="text/css" media="screen" href="css/jquery-ui.css" />
<script type="text/javascript" src="js/lang.js"></script>
<script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript" src="js/jquery-ui.js"></script>
<script type="text/javascript" src="js/main.js"></script>
<script>
    var labels_shows = 0;
    var gl_user_lang = <?php echo '"'.$lang.'"'?>;
    $(function(){
        var schoolmule = window.schoolmule||{};
        schoolmule.main = new main({});
        schoolmule.main.showLogin2();

        schoolmule.main.first_login = <?php echo $admin->first_login==1?'"'.'1'.'"':"'0'"?>;
        schoolmule.main.user_login = <?php echo $admin->login?'"'.$admin->login.'"':"''"?>;

        schoolmule.main.full_name = <?php echo $admin->full_name?'"'.$admin->full_name.'"':"''"?>;

        if(parseInt(schoolmule.main.first_login) == 1){
            $('#login-form, #substrate, #dialog2').remove();
            schoolmule.main.showResetPassPage2();
            return 1;
        }
    });
</script>