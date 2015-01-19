var schoolmule = window.schoolmule||{};
var showNav;

/*get all exists now cookies */
function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ))
    return matches ? decodeURIComponent(matches[1]) : undefined
}

/*show search resul page*/
function showSearchResult(query){
    var script = "connectors/connector.php?control_id=grid_search";
    if(content){
        content.destroy();
        content = null;
    }

    content = new schoolmule.controls.layout({
        cellsBlock:{
            display_footer_left: true,
            display_footer_right: true,
            cells_right:[
                {
                    cells:[
                        {
                            new_count : false,
                            id : "search_field",
                            width: '100%',
                            height: '28px',
                            border_bottom: true
                        },
                        {
                            new_count : false,
                            id : "grid_search",
                            title: "",
                            width: '100%',
                            height: '100%',
                            border_bottom: false,
                            display_footer_right:true
                        }]
                }
            ]
        }
    });

    createSearch(query);

    schoolmule.instances.grid_search.attachTo("grid_search");
    content.elements.push(schoolmule.instances.grid_search);
    var grid = schoolmule.instances.grid_search.getGrid().grid;
    if(query != ""){
        content.showLoader();
        grid.loadXML(script+'&query='+query);
    }else{
        grid.loadXML(script);
    }

    content.setTitle("main-content",dlang("search_details_title","Search results"));
}

/*create cearch area*/
function createSearch(query){
    var search = $('<form class="search_field_form"><input class="input_search" type="text" value="'+query+'"><input  type="submit" class="button search-button" value="'+dlang("search_details_search_button","Search")+'" /></form>');
    $('#search_field').append(search);
    $('#search_field form').submit(function(){
        var grid = schoolmule.instances.grid_search.getGrid().grid;
        content.showLoader();
        grid.clearAndLoad("connectors/connector.php?control_id=grid_search"+'&query='+$('#search_field input.input_search').val().toLowerCase(),function(){
            content.hideLoader();
        });
        return false;
    });
    $('#search_field').append('<div class="search_field_results"> '+dlang("search_details_results_found","results found")+'</div>');
}

/*define new alert for system*/
window.alert = function(text){
    var cont = $('<div id="dialog-message" title="">\
        <p>'+text+'</p></div>');
    $('body').append(cont);
    var Ok = dlang("button_ok","Ok");
    cont.dialog({
        autoOpen: true,
        modal: true,
        width: 300,
        minHeight: 120,
        resizable: false,
        buttons: [
            {
                text: Ok,
                click: function() {
                    cont.dialog( "destroy" );
                    cont.remove();
                }
            }

        ],

        beforeClose: function( event, ui ) {
            cont.dialog( "destroy" );
            cont.remove();
        }
    });
}


/*define new confirm for system*/
window.seconfirm = function(text,ok,cancel){
    var cont = $('<div id="dialog-confirm" title="">\
        <p>'+text+'</p></div>');
    $('body').append(cont);
    var Ok = dlang("button_ok","Ok");
    var Cancel = dlang("button_cancel","Cancel");
    cont.dialog({
        autoOpen: true,
        modal: true,
        width: 300,
        minHeight: 120,
        resizable: false,
        buttons: [
            {
                text: Ok,
                click: function() {
                    cont.dialog( "destroy" );
                    cont.remove();
                    if(ok){
                        ok();
                    }
                    return true;
                }
            },
            {
                text: Cancel,
                click: function() {
                    cont.dialog( "destroy" );
                    cont.remove();
                    if(cancel){
                        cancel();
                    }
                    return false;
                }
            }
        ],
        beforeClose: function( event, ui ) {
            cont.dialog("destroy");
            cont.remove();
            if(cancel){
                cancel();
            }
        }
    });
}


/*define new prompt for system*/
window.seprompt = function(text,value,ok,cancel){
    var cont = $('<div id="dialog-prompt" title="">\
         <p>'+text+'</p><input id="prompt_input" value="'+value+'" style="width: 98%; margin-top: 10px;" type="text"/></div>');
    $('body').append(cont);
    var Ok = dlang("button_ok","Ok");
    var Cancel = dlang("button_cancel","Cancel");
    cont.dialog({
        autoOpen: true,
        modal: true,
        minWidth: 300,
        minHeight: 100,
        resizable: false,
        buttons: [
            {
                text: Ok,
                click: function() {
                    var val = $('#prompt_input').val();
                    cont.dialog( "destroy" );
                    cont.remove();
                    if(ok){
                        ok(val);
                    }
                    return true;
                }
            },
            {
                text: Cancel,
                click: function() {
                    cont.dialog( "destroy" );
                    cont.remove();
                    if(cancel){
                        cancel();
                    }

                    return false;
                }
            }
        ],
        beforeClose: function( event, ui ) {
            cont.dialog( "destroy" );
            cont.remove();
            cancel();
        }
    });
}

/*disable button helper func*/
function disableButton(id){
    $("#"+id).attr("disabled","disabled");
    $("#"+id).addClass("disabled-button");
}

/*enable button helper func*/
function enableButton(id){
    $("#"+id).removeAttr("disabled");
    $("#"+id).removeClass("disabled-button");
}

/*set new cookie*/
function setCookie(name, value, props) {
    props = props || {}
    var exp = props.expires
    if (typeof exp == "number" && exp) {
        var d = new Date()
        d.setTime(d.getTime() + exp*1000)
        exp = props.expires = d
    }
    if(exp && exp.toUTCString) { props.expires = exp.toUTCString() }

    value = encodeURIComponent(value)
    var updatedCookie = name + "=" + value
    for(var propName in props){
        updatedCookie += "; " + propName
        var propValue = props[propName]
        if(propValue !== true){ updatedCookie += "=" + propValue }
    }
    document.cookie = updatedCookie

}

/*delete cookie*/
function deleteCookie(name) {
    setCookie(name, null, { expires: -1 })
}

/*delete all cookies*/
function deleteAllCookies() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

var main = function(_options){
	var self = this;
	var login;
	var loginMenu;
    var navigationMenu;
	this.user_id = null;
	this.callback = null;
	
	var defaults = {
		// an array of objects
		login_image: "images/top_menu.png",
		connector : "connectors/connector.php"
	};
	
	var options = $.extend(defaults,_options);
	
	this.script = options.connector+"?control_id=administrator";


	function createMenuHtml(){
		var html='\
			<div class="login-img-block">\
				<img id="login-dd" src='+options.login_image+' alt="Login" />\
			</div>';
		$('#login').prepend(html);
		login = $('#login-dd');
	}

    /*generate password function*/
	this.randomPassword = function(length){
		chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
		pass = "";
		for(x=0;x<length;x++){
			i = Math.floor(Math.random() * 62);
			pass += chars.charAt(i);
		}
		return pass;
	}
	
	function showMenu(){
		loginMenu.showContextMenu(login.offset().left - 42, login.offset().top + 9);
	}
	
	function checkLogin(){
		return true;
	}

    this.search = function(text){
        showSearchResult(text)
        //window.location = 'search.php?query='+text;
    }

    /**
     * logout user
     * @returns {boolean}
     */
    this.logOutUser = function(){
        $.post(self.script+'&action=logout', {action:'logout'}, function(data){
            window.location = 'login.php'
        },'json');
        return true;
    }

    this.showLogin2 = function(){
        var html ='\
                <form id="login-form" onsubmit="return false">\
                    <div class="main_login_logo"><img class="logo" src="images/total/logo.png" /></div>\
                    <h2>'+dlang("login_log","Login")+'</h2>\
                    <div class="loginArea">\
                        <div class="label"><label for="name">'+dlang("login_user","Username")+'</label></div>\
                        <div class="field"><input type="text" id="name" class="login-input" name="username" title="comment_0101" /></div>\
                        <div class="label"><label for="password">'+dlang("login_pass","Password")+'</label></div>\
                        <div class="field"><input type="password" id="password" class="login-input" name="password" title="comment_0102" /></div>\
                        <div class="field" id="wrong" style="visibility: hidden">'+dlang("login_wrong","wrong username or password")+'</div>\
                    </div>\
                    <div id="captcha-wrap" style="display:none;"><img src="images/captcha.jpg" alt="" /></div>\
                    <div id="button-wrap">\
                        <button class="button login-buttons left" title="'+dlang("login_sigin","Sign in")+'" id="signin" >'+dlang("login_sigin","Sign in")+'</button>\
                        <button class="button login-buttons right" title="'+dlang("login_reset","Reset password")+'"  id="reset_pass" >'+dlang("login_reset","Reset password")+'</button>\
                    </div>\
                <div class="optimized">'+dlang("optimized","Optimized for Google Chrome")+'</div>\
                </form>\
                <div id="substrate"></div>\
                ';

        $('body').append(html);

        $('#reset_pass').click(function(){
            var login = $('#name','#login-form').val();
            var pass = $('#password','#login-form').val();

            var Ok = dlang("button_reset_send","Send");
            var Cancel = dlang("button_reset_cancel","Cancel");

            var cont = $('<div id="dialog-confirm" title="">\
                <p>'+dlang("reset_pass_user_text","We will send a link to your email where you can change password.")+'</p>' +
            '</div>');

            $('body').append(cont);

            if(login==""){
                alert(dlang("empty_login_or_pass_alert","Please, enter you current login"));
                return false;
            }

            cont.dialog({
                autoOpen: true,
                modal: true,
                width: 300,
                minHeight: 120,
                resizable: false,
                buttons: [
                    {
                        text: Ok,
                        click: function() {
                            cont.dialog( "destroy" );
                            cont.remove();
                            resetPassword(login);
                            return true;
                        }
                    },
                    {
                        text: Cancel,
                        click: function() {
                            cont.dialog( "destroy" );
                            cont.remove();

                            return false;
                        }
                    }
                ],
                beforeClose: function( event, ui ) {
                    cont.dialog( "destroy" );
                    cont.remove();
                    //resetPassword(login,pass);

                }
            });
        });

        $('#signin').click(function(){
            $('#wrong').css({visibility:"hidden"});
            var login = $('#name','#login-form').val();
            var pass = $('#password','#login-form').val();
            $.post(self.script, {login: login, password:pass, action:'sign_in'}, function(data){
                if(data.login){
                    if(data.role =='mainadmin'){
                        window.location = 'backend.php';
                        return false;
                    }
                    if(data.first_login == '1'){
                        $('#login-form, #substrate, #dialog2').remove();
                        schoolmule.main.user_login = data.login;
                        self.showResetPassPage2();
                        return 1;
                    }else{
                        window.location = 'index.php?lng=se';
                    }
                }else{
                    $('#wrong').css({visibility:"visible"});
                }
            },'json');
        });
    }

	this.showLogin = function(){
        if(schoolmule.main.first_login == '1'){
            showResetPassPage(self);
            return 1;
        }
		$('#main-content').hide();
		var html ='\
			<form id="login-form" onsubmit="return false">\
			    <img src="gfx/logo.png" />\
				<h2>'+dlang("login_log","Login")+'</h2>\
				<div>\
					<div class="label"><label for="name">'+dlang("login_user","Username")+'</label></div>\
					<div class="field"><input type="text" id="name" class="login-input" name="username" title="comment_0101" /></div>\
					<div class="label"><label for="password">'+dlang("login_pass","Password")+'</label></div>\
					<div class="field"><input type="password" id="password" class="login-input" name="password" title="comment_0102" /></div>\
					<div class="field" id="wrong" style="display:none;">'+dlang("login_wrong","wrong username or password")+'</div>\
				</div>\
				<div id="captcha-wrap" style="display:none;"><img src="images/captcha.jpg" alt="" /></div>\
				<div id="button-wrap">\
					<button class="button" title="comment_0103" id="signin" >'+dlang("login_sigin","Sign in")+'</button>\
					<div class="field" id="reset_pass">'+dlang("login_reset","Reset password")+'</div>\
				</div>\
			</form>\
			<div id="substrate">\
		</div>';
		
		//in button-wrap block
		//<a a href="#" id="dialog_link" class="usual-link btn-row-right">Lost your password?</a>\
		//<div id="dialog2" title="Information" style="display:none">\
		//	<p>A message containing your password has been sent to your registered email account.</p>\
		//</div>\
		/*
		$('#dialog_link').click(function(){
			lostDialog.dialog('open');
			lostDialog.css("min-height", "30px"); // if height of content div is too small
			return false;
		})
		*/;
		
		$('body').append(html);
		var lostDialog = $('#dialog2');
        var Ok = dlang("button_ok","Ok");
		lostDialog.dialog({
			autoOpen: false,
			modal: true,
			width: 200,
			resizable: false,
			buttons: [
                {
                    text:Ok,
                    click: function() {
                        $(this).dialog("close");
                    }
                }
			]
		});
		
		$('#reset_pass').click(function(){
            var login = $('#name','#login-form').val();
            var pass = $('#password','#login-form').val();

            var cont = $('<div id="dialog-confirm" title="">\
            <p>'+dlang("reset_pass_user_text","We will send a link to your email where you can change password.")+'</p></div>');
                $('body').append(cont);
                var Ok = dlang("button_reset_send","Send");
                var Cancel = dlang("button_reset_cancel","Cancel");
                cont.dialog({
                    autoOpen: true,
                    modal: true,
                    width: 300,
                    minHeight: 120,
                    resizable: false,
                    buttons: [
                        {
                            text: Ok,
                            click: function() {
                                cont.dialog( "destroy" );
                                cont.remove();
                                resetPassword(login,pass);
                                return true;
                            }
                        },
                        {
                            text: Cancel,
                            click: function() {
                                cont.dialog( "destroy" );
                                cont.remove();

                                return false;
                            }
                        }
                    ],
                    beforeClose: function( event, ui ) {
                        cont.dialog( "destroy" );
                        cont.remove();
                        //resetPassword(login,pass);

                    }
                });
		});
		
		$('#signin').click(function(){
            $('#wrong').hide();
			var login = $('#name','#login-form').val();
			var pass = $('#password','#login-form').val();
			$.post(self.script, {login: login, password:pass, action:'sign_in'}, function(data){
				if(data.login){
                    //deleteAllCookies();\
                    schoolmule.main.user_id = data.id;
                    schoolmule.main.user_login = data.login;
                    schoolmule.main.user_role = data.role;
                    schoolmule.main.entity = data.entity;
                    schoolmule.main.entity_title = data.entity_title;

                    if(data.role =='mainadmin'){
                        window.location = 'backend.php';
                        return false;
                    }

                    if(data.first_login == '1'){

                        $('#login-form, #substrate, #dialog2').remove();
                        showResetPassPage(self);
                        return 1;
                    }else{
                        schoolmule.main.first_login = 0;
                        if(schoolmule.main.user_role=='pupil' || schoolmule.main.user_role=='parent' || schoolmule.main.user_role=='staff'){
                            if(window.location.href.indexOf('setup.php') + 1){
                                window.location = 'course_objectives.php';
                                return false;
                            }
                            $('#setup_menu').hide();
                        }else{
                            $('#setup_menu').show();
                        }
                        $('#teacher-name').html(data.login);
                        $('#login-form,#substrate,#dialog2').remove();
                        self.user_id = data.id;
                        $('#main-content').show();
                        self.callback();
                    }
				}else{
                    $('#wrong').show();
                }
			},'json');
		});

		return $('#signin');
	}

    function resetPassword(login,pass){
        $.post("connectors/connector.php?control_id=grid_setup_pupils", {
            action:"resetpass",
            user: login
        }, function(res){
            //alert(res.link);
        },'json');
    }

    this.showResetPassPage2 = function(){
        var html ='\
			<form id="login-form-first" onsubmit="return false">\
				<h2>'+dlang("login_hello","Hello,")+' '+schoolmule.main.full_name+'</h2>\
				<span>'+dlang("login_first_info_8","Your password must include at least one upper case, one lower case, one number. The password must be at least 8 characters.")+'</span>\
				<div>\
					<div class="label"><label for="name">'+dlang("login_new_pass","New Password")+'</label></div>\
					<div class="field"><input autocomplete="off" type="password" id="passwordf" class="login-input" name="passwordf" title="comment_0101" /></div>\
					<div class="label"><label autocomplete="off" for="password">'+dlang("login_rep_new_pass2","Repeat new password")+'</label></div>\
					<div class="field"><input autocomplete="off" type="password" id="password" class="login-input" name="password" title="comment_0102" /></div>\
					<div class="label"><label for="name">'+dlang("login_username","Your username")+'</label></div>\
					<div class="field"><input autocomplete="off" type="text" id="email" class="login-input" name="email" title="comment_0101" /></div>\
					<div class="field" id="wrong" style="display:none;">'+dlang("not_correct_warn_password_1","Please follow the guidelines for password...")+'</div>\
				</div>\
				<div id="button-wrap">\
					<button class="button" title="comment_0103" id="reset" >'+dlang("login_butt_reset","Reset")+'</button>\
					<button class="button" title="comment_0103" id="cancel" >'+dlang("login_cancel","Cancel")+'</button>\
				</div>\
			</form>\
			<div id="substrate">\
		</div>';

        $('body').append(html);

        $('#reset').click(function(){
            var email = $('#email').val();
            var wrong = $('#wrong');
            var pass = $('#passwordf').val();
            var passr = $('#password').val();
            wrong.hide();

/*            if(!email.match("^[-._a-z0-9]+@(?:[a-z0-9][-a-z0-9]+\.)+[a-z]{2,6}$")){
                wrong.text(dlang("login_wrong_email","wrong email..."));
                wrong.show();
                return false;
            }*/

            if(passr!=pass){
                alert(dlang("not_correct_warn_password_confirm","You have to type in the same password in Confirm new password as New password. 'Confirm new password' should replace 'Password'"));
                wrong.text(dlang("not_correct_warn_password_confirm_small","'Confirm new password' should replace 'Password'"));
                wrong.show();
                return false;
            }

            if(pass.length < 8 || passr!=pass || !pass.match("(?!^[0-9]*$)(?!^[a-zA-Z]*$)(?!^[a-z0-9]*$)(?!^[A-Z0-9]*$)^([a-zA-Z0-9]{6,})$")){
                wrong.text(dlang("not_correct_warn_password_1","Please follow the guidelines for password..."));
                wrong.show();
                return false;
            }

            $.post(self.script, {email: email, password:pass, action:'pass_reset'}, function(data){
                if(data=="1"){
                    window.location = 'index.php?lng=se'
                }else{
                    wrong.text(dlang("login_wrong_username2","wrong username..."));
                    wrong.show();
                }
            });
        });

        $('#cancel').click(function(){
            $.post(self.script+'&action=logout', {action:'logout'}, function(data){
                window.location = 'login.php'
            },'json');
        });
    }

    function showResetPassPage(self){
        $('#main-content').hide();
        var html ='\
			<form id="login-form-first" onsubmit="return false">\
				<h2>'+dlang("login_hello","Hello,")+' '+schoolmule.main.user_login+'</h2>\
				<span>'+dlang("login_first_info","You must change password on first login. New password needs to have at least 7 characters, mixed uppercase, lowercase, and numbers.")+' '+schoolmule.main.user_login+'</span>\
				<div>\
					<div class="label"><label for="name">'+dlang("login_new_pass","New Password")+'</label></div>\
					<div class="field"><input type="password" id="passwordf" class="login-input" name="passwordf" title="comment_0101" /></div>\
					<div class="label"><label for="password">'+dlang("login_rep_new_pass","Password")+'</label></div>\
					<div class="field"><input type="password" id="password" class="login-input" name="password" title="comment_0102" /></div>\
					<div class="label"><label for="name">'+dlang("login_email","Your Email")+'</label></div>\
					<div class="field"><input type="text" id="email" class="login-input" name="email" title="comment_0101" /></div>\
					<div class="field" id="wrong" style="display:none;">'+dlang("not_correct_warn","wrong login or rassword...")+'</div>\
				</div>\
				<div id="button-wrap">\
					<button class="button" title="comment_0103" id="reset" >'+dlang("login_butt_reset","Reset")+'</button>\
					<button class="button" title="comment_0103" id="cancel" >'+dlang("login_cancel","Cancel")+'</button>\
				</div>\
			</form>\
			<div id="substrate">\
		</div>';
        $('body').append(html);

        $('#reset').click(function(){
            var email = $('#email').val();
            var wrong = $('#wrong');
            var pass = $('#passwordf').val();
            var passr = $('#password').val();
            wrong.hide();

            if(!email.match("^[-._a-z0-9]+@(?:[a-z0-9][-a-z0-9]+\.)+[a-z]{2,6}$")){
                wrong.text(dlang("login_wrong_email","wrong email..."));
                wrong.show();
                return false;
            }
            if(pass.length < 7 || passr!=pass || !pass.match("(?!^[0-9]*$)(?!^[a-zA-Z]*$)(?!^[a-z0-9]*$)(?!^[A-Z0-9]*$)^([a-zA-Z0-9]{6,})$")){

                wrong.text(dlang("login_wrong_pass","wrong password..."));
                wrong.show();
                return false;
            }

            $.post(self.script, {email: email, password:pass, action:'pass_reset'}, function(data){
                if(data=="1"){
                    schoolmule.main.first_login = 0;
                    if(schoolmule.main.user_role=='pupil' || schoolmule.main.user_role=='parent' || schoolmule.main.user_role=='staff'){
                        if(window.location.href.indexOf('setup.php') + 1){
                            window.location = 'course_objectives.php';
                        }
                        $('#setup_menu').hide();
                    }else{
                        $('#setup_menu').show();
                    }
                    $('#teacher-name').html(schoolmule.main.user_login);
                    $('#login-form-first,#substrate,#dialog2').remove();
                    self.user_id = schoolmule.main.user_id;
                    $('#main-content').show();
                    showInstructions();
                    self.callback();
                }else{
                    wrong.text(dlang("login_wrong_username2","wrong username..."));
                    wrong.show();
                }
            });
        });

        $('#cancel').click(function(){
            schoolmule.main.first_login = 0;
            if(!schoolmule.main.user_id){
                window.location = 'course_objectives.php';
                return false;
            }
            if(schoolmule.main.user_role=='pupil' || schoolmule.main.user_role=='parent' || schoolmule.main.user_role=='staff'){
                if(window.location.href.indexOf('setup.php') + 1){
                    window.location = 'course_objectives.php';
                }
                $('#setup_menu').hide();
            }else{
                $('#setup_menu').show();
            }
            $('#teacher-name').html(schoolmule.main.user_login);
            $('#login-form-first,#substrate,#dialog2').remove();
            self.user_id = schoolmule.main.user_id;
            $('#main-content').show();
            showInstructions();
            self.callback();
        });
    }

    this.showInstructions = function(){
        var ok = dlang("button_ok","Ok");
        var hi_dialog = new schoolmule.controls.window_popup(
            {
                title: dlang("main_hello_text","Hello, ")+schoolmule.main.full_name,
                width: "423px",
                buttons: [
                    {
                        text:ok,
                        click: function() {
                            hi_dialog.win_dialog.dialog("destroy");
                            hi_dialog.win_dialog.remove();
                        }
                    }
                ],
                onBeforeShow: function(container){
                    $('#'+container).css('padding','10px')
                    $('#'+container).text('Hello, '+schoolmule.main.full_name+'!');
                }
            });

        hi_dialog.show({
            container: "massage_box"
        });
    }

	function showInstructions(){
        var ok = dlang("button_ok","Ok");
        var hi_dialog = new schoolmule.controls.window_popup(
            {
                title: dlang("main_hello_text","Hello, ")+schoolmule.main.full_name,
                width: "423px",
                buttons: [
                    {
                        text:ok,
                        click: function() {
                            hi_dialog.win_dialog.dialog("destroy");
                            hi_dialog.win_dialog.remove();
                        }
                    }
                ],
                onBeforeShow: function(container){
                    $('#'+container).css('padding','10px')
                    $('#'+container).text('Hello, '+schoolmule.main.full_name+'!');
                }
            });

        hi_dialog.show({
            container: "massage_box"
        });
    }

	function createMenu(){
		loginMenu = new dhtmlXMenuObject();
        loginMenu.renderAsContextMenu();
		loginMenu.contextAutoHide = false;
		loginMenu.addNewChild(loginMenu.topId, 0, "logout", dlang("right_top_logout","Log Out"), false);
        loginMenu.addNewChild(loginMenu.topId, 1, "make_request", dlang("right_top_make_request","Make feature request"), false);
        loginMenu.addNewChild(loginMenu.topId, 2, "report_bug", dlang("right_top_report_bug","Report bug"), false);
/*        loginMenu.addNewChild(loginMenu.topId, 3, "show_ids", "Show ID's", false);
        loginMenu.addNewChild(loginMenu.topId, 4, "hide_ids", "Hide ID's", false);*/
        loginMenu.addNewChild(loginMenu.topId, 5, "select_language", dlang("right_top_lang","Change language"), false);
        loginMenu.addNewChild("select_language", 6, "lang_en", dlang("lang_en","English"), false);
        loginMenu.addNewChild("select_language", 7, "lang_se", dlang("lang_se","Swedish"), false);

		loginMenu.attachEvent("onClick", function(id, zoneId, casState){
            switch (id){
                case 'logout':
                    $.post(self.script+'&action=logout', {action:'logout'}, function(data){
                        window.location = 'login.php'
                    },'json');
                    break;
                case 'make_request':
                    createSendMessageDialog(dlang("mail_feature_request","Feature request"));
                    break;
                case 'report_bug':
                    createSendMessageDialog(dlang("mail_bug","Bug"));
                    break;
                case 'show_ids':
                    window.location = window.location.pathname+'?labels=1'+window.location.hash;
                    break;
                case 'hide_ids':
                    window.location = window.location.pathname+window.location.hash;
                    break;
            }
            if(id.split('_')[0]=='lang'){
                $.post('connectors/connector.php?control_id=administrator&action=select_language',{
                    lang:id.split('_')[1]
                },function(res){
                    window.location = "index.php";
                });
            }
		});		
	}
		
	function init(){
        $("#feature_request").click(function(){
            createSendMessageDialog(dlang("mail_feature_request","Feature request"));
        });
        $("#bug_message").click(function(){
            createSendMessageDialog(dlang("mail_bug","Bug"));
        });
		createMenuHtml();
	  	login.click(function (event) {
            event.stopPropagation();
	  		createMenu();
	     	showMenu();
	    });
        $('body').click(function(){
            if(loginMenu){
                loginMenu.hide();
            }
            if(detectMobileDevice() && navigationMenu){
                navigationMenu.hide();
            }
        })
        if(detectMobileDevice()) {

        }else{
            //$(".menuBlock").mouseover(
            //    function (e) {
            //        createNavigationMenu();
            //        showNavMenu($(this));
            //    }
            //);
            //$(".menuBlock").mouseout(
            //    function (e) {
            //        console.log(e.clientX, e.clientY);
            //        setTimeout(function(){
            //            navigationMenu.hide();
            //        },1500)
            //    }
            //);
        }
        //document.getElementsByClassName("menuBlock")[0].onmouseover = function(e){
        //    alert(e);
        //}
        //$("#mail_lamp").click(createSendMessageDialog);
	};

    function createNavigationMenu(){
        if(!navigationMenu) {
            var database, courseRoom;
            navigationMenu = new dhtmlXMenuObject();
            navigationMenu.renderAsContextMenu();
            navigationMenu.contextAutoHide = false;
            database = dlang("main_menu_db_and_users", "Database and users");
            courseRoom = dlang("main_menu_db_course_rooms", "Courserooms");
            navigationMenu.addNewChild(navigationMenu.topId, 0, "db", database, false);
            navigationMenu.addNewChild(navigationMenu.topId, 1, "cr", courseRoom, false);
            navigationMenu.addNewChild('cr', 2, "co", dlang("course_objectives_tab", "Course objectives"), false);
            navigationMenu.addNewChild('cr', 3, "crs", dlang("course_rooms_tab", "Courserooms"), false);
            navigationMenu.addNewChild("cr", 4, "assess", dlang("assessments_tab", "Assessment"), false);
            navigationMenu.attachEvent("onClick", function (id, zoneId, casState) {
                switch (id) {
                    case 'logout':
                        break;
                }
            });
        }
    }
    function showNavMenu(obj){
        navigationMenu.showContextMenu(obj.offset().left + obj.outerWidth(), obj.offset().top -1);
    }

    function createSendMessageDialog(type){
        var message_form = null;
        var send = dlang("mail_button_send","Send");
        var colse = dlang("mail_button_close","Close");
        var message_dialog = new schoolmule.controls.window_popup(
            {
                title: dlang("mail_write_message_to_schoolm","Write a message to Schoolmule"),
                width: "423px",
                buttons: [
                    {
                        text:send,
                        click: function() {
                            var message = message_form.getItemValue("message");
                            var setup = message_form.isItemChecked("setup")?dlang("mail_setup","Setup"):"";
                            var course_objectives = message_form.isItemChecked("course_objectives")?dlang("mail_course_objectives","Course objectives"):"";
                            var assignments = message_form.isItemChecked("assignments")?dlang("mail_assignments_performance","Assignments and performances"):"";
                            var assessments = message_form.isItemChecked("assessments")?dlang("mail_assessments","Assessments"):"";
                            if(message != "" && (setup || course_objectives || assignments || assessments)){
                                var regards = Array();
                                setup?regards.push(setup):"";
                                course_objectives?regards.push(course_objectives):"";
                                assignments?regards.push(assignments):"";
                                assessments?regards.push(assessments):"";
                                regards = regards.join(", ");
                                regards = '('+message_form.getCheckedValue('bug')+') '+regards;
                                message_dialog.hide();
                                $.post('libs/send_email.php',{type:message_form.getCheckedValue('bug'), message:message, regards:regards, user:schoolmule.main.user_login},function(res){
                                    alert(res);
                                });
                            }else{
                                alert(dlang("mail_alert_not_valid_message","You must select at least one subject and a message box should not be empty!"));
                            }
                        }
                    },
                    {
                        text:colse,
                        click: function() {
                            message_dialog.win_dialog.dialog("destroy");
                            message_dialog.win_dialog.remove();
                        }
                    }
                ],
                onBeforeShow: function(container){
                    var formData = [
                       // {type: "block", className:"simple_text", list:[
                            {
                                type: "settings",
                                position: "label-right"
                            },
                            {
                                type: "label",
                                label: dlang("mail_message_regards","Message regards:")
                            },
                            {
                                type: "checkbox",
                                label: dlang("mail_setup","Setup"),
                                name: "setup"
                                //checked: true
                            },
                            {
                                type: "checkbox",
                                label: dlang("mail_course_objectives","Course objectives"),
                                name: "course_objectives"
                                //checked: true
                            },
                            {
                                type: "checkbox",
                                label: dlang("mail_assignments_performance","Assignments and performances"),
                                name: "assignments"
                            },
                            {
                                type: "checkbox",
                                label: dlang("mail_assessments","Assessments"),
                                name: "assessments"
                                //checked: true
                            },
                            {
                                type: "label",
                                label: dlang("mail_i_want_to_file","I want to file a:")
                            },
                            {
                                type: "radio",
                                label: dlang("mail_bug","Bug"),
                                name: "bug",
                                value:dlang("mail_bug","Bug"),
                                checked: true
                            },
                            {
                                type: "radio",
                                label: dlang("mail_feature_request","Feature request"),
                                value:dlang("mail_feature_request","Feature request"),
                                name: "bug"

                            },
                            {type: "input", name:"message", id:"message", rows:3, style:"width:400px;height:150px;"}
                        //]}
                    ];

                    message_form = new dhtmlXForm(container, formData);
                    message_form.setSkin('dhx_terrace');
                    message_form.setItemValue('bug',type);
                    //message_form.setItemFocus("message");
                    //message_form.setFocusOnFirstActive();
                    //$('#'+container).html("wefwefwefewwfwef");
                }
            }
        );

        message_dialog.show({
           container: "massage_box"
        });

    }
	init();
};
function detectMobileDevice(){
    var device  = /ipad|iphone|ipod|android|blackberry|webos|windows phone/i.test(navigator.userAgent.toLowerCase());
    return (device) ? true : false;
}

function setMainPath(path){
    $("#mainSub").text(path);
}
function updateTreePath(tree, selectedId){
    var text = " > "+ tree.getItemText(selectedId), newId = selectedId;
    while(tree.getParentId(newId)){
        newId = tree.getParentId(newId);
        text = " > " + tree.getItemText(newId) + text;
    }
    $("#selectedInTree").text(text);
}

function bindMenuEvents(){
    var target, clicked , time;
    if(detectMobileDevice()){
        $(".navMenu > li").click(
            function(e){
                if(!e.isTrigger) {
                    clicked =  new Date().getTime();
                    $(".navMenu > li > ul").css({display: 'block', zIndex: '3'});
                    if(!showNav) {
                        showNav = setInterval(function () {
                            time = new Date().getTime();
                            if (time - clicked > 6000) {
                                hideNavMenu();
                            }
                        }, 6000);
                    }
                }
            }
        );
        $(".navMenu > li > ul > li").click(
            function(e){
                target = e.srcElement || e.target;
                if($(target).find("ul").length > 0) {
                    clicked =  new Date().getTime();
                    $(".navMenu > li > ul > li > ul").css({opacity: "1"});
                };
                if(!showNav) {
                    showNav = setInterval(function () {
                        time = new Date().getTime();
                        if (time - clicked < 6000) {
                            hideNavMenu();
                        }
                    }, 6000);
                }
            }
        );
        $("body").click(function(){
            hideNavMenu();
        });
    }else{
        $(".navMenu > li").hover(
            function(e){
                target = e.srcElement || e.target;
                if(target.id !== 'mainSub' && target.id !== 'selectedInTree')
                $(".navMenu > li > ul").css({ display: 'block',zIndex:'3'});
            },
            function(e){
                $(".navMenu > li > ul").css({ display: 'none',zIndex:'0'});
            }
        );
        $(".navMenu > li > ul > li").hover(
            function(e){
                target = e.srcElement || e.target;
                if($(target).find("ul").length > 0) {
                    $(".navMenu > li > ul > li > ul").css({opacity: "1"});
                }
            },
            function(){
                $(".navMenu > li > ul > li > ul").css({opacity: "0"});
            }
        );
    }
}

function hideNavMenu(){
    $(".navMenu > li > ul > li > ul").css({opacity: "0"});
    $(".navMenu > li > ul").css({display: 'none', zIndex: '0'});
    if(showNav) {
        clearInterval(showNav);
        showNav = null;
    }
}


