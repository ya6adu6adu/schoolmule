var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.controls.forum = function(_options){
	var self = this;
	
	var defaults = {
		connector : "connectors/connector.php",
		gridImagePath:"dhtmlx/dhtmlxGrid/codebase/imgs/",
		menuIconsPath:"dhtmlx/dhtmlxMenu/codebase/imgs/dhxmenu_dhx_web/",
		lng:"en,de",
        edit: true,
		files:true
	};
	var options = $.extend(defaults, _options);
	var dhx = {
		form: null,
		dp: null
	};
	var container = null;
	var content = null;
	var dialog;
    var anfile;
	var myDataProcessor;
	var curr_popup_data = null;
	var curr_item = null;
	this.current_user = null;
	this.menu = null;

    this.reload = function(id,type,container){
            //$("#comments_tiny_main").html("");
            getForumContent(id,type,options.container,true);
	}


    function setConfig(){
        var config;
		if(options.files){
            if(options.edit){
                config = [

                    {
                        type: "fieldset",
                        label: dlang("subm_comm_grag_text","Drag files here.."),
                        width:220,
                        className:"qwert",
                        list: [{
                            titleScreen: false,
                            className: "forumUploader",
                            type: "upload",
                            name: "files",
                            inputWidth: 185,
                            url: "libs/file_upload.php",
                            titleText:"",
                            autoStart:false
                        }
                        ]
                    },
                    {type: "input", width:254, name: "comment", label: dlang("subm_comm_grag_comments","Comments:"), value: "", rows:2, position:"label-top", inputHeight:30},
                    {type: "button", name: "save", value: dlang("subm_comm_grag_button_text","Submit"), offsetTop:10, width:80}
                ];
            }else{
                config = [];
                $('.forum-main').css({
                    height: '100%',
                    position: 'static'
                });
                $('.forum-cont').hide();
            }
		}else{
            if(options.edit){
                config = [
                    {type: "input", width:215, name: "comment", label: dlang("subm_comm_grag_comments","Comments:"), value: "", rows:2, position:"label-top", inputHeight:30},
                    {type: "button", name: "save", value: dlang("subm_comm_grag_button_text","Submit"),offsetTop:10, width:80}
                ];
            }else{
                config = [];
                $('.forum-main').css({
                    height: '100%',
                    position: 'static'
                });
                $('.forum-cont').hide();
            }
		}

		return config;
	}

    function getForumContent(id,type,container,reload){

		var pupil_id = options.pupil;
        var post = null;
		
		$.post("libs/forum_content.php", {id:id, type:type, pupil_id:pupil_id}, function(response){
			for(a in response){

				post = $('<p class="post" id="comment_'+a+'"></p>');

                if($('#comment_'+a).size()==0 && reload){
                    post.addClass("reloaded");
                }
                $('#comment_'+a).remove();

				post.hover(
				      function () {
				      	self.menu.addContextZone($(this).attr("id"));
				      },
				      function () {
				        self.menu.addContextZone($(this).parent().attr("id"));
				      }
				);
				
			    post.click(function(e){
			    	self.menu.showContextMenu(e.clientX, e.clientY);
			    });
			    
				var comment = response[a]['comment'];

                if(response[a]['notes']){
                    comment += "<br>"+dlang("private_subm_notes","Private notes:")+'<br>'+response[a]['notes'];
                }
				//comment=comment.replace(/http\:\/\/(\S+[\w\-\/])/ig,"<a target='_blank' href='http://$1'>$1</a>");
				//comment=comment.replace(/www.(\S+[\w\-\/])/ig,"<a target='_blank' href='http://$1'>$1</a>");
				post.append("<span class='login-name'>"+response[a]['user']+"</span> <span class='comment'>"+comment+"</span><br>");
				for(var i=0; i<response[a]['file'].length;i++){
					var file = response[a]['file'][i]['name'].split('.');
                    var file_image = response[a]['file'][i]['saved']=='0'?'not_annotate':'save_only';
                    if(response[a]['file'][i]['published']=='1'){
                        if(response[a]['file'][i]['passed']=='1'){
                            file_image = 'passed';
                        }else{
                            file_image = 'not_passed';
                        }
                    }
                    var annot = "";
                    if(response[a]['file'][i]['full_name'].split('.').pop()=='pdf'){
                        annot = "<span class='annotate_file "+file_image+"'></span>";
                    }

					var flll = $("<p class='file_item' id='file_"+response[a]['file'][i]['fid']+"'  target='_blank' href='"+response[a]['file'][i]['full_name']+"'>" +
                        "<img class='file_type_icon_item' src='images/files/"+response[a]['file'][i]['name'].split('.').pop().toLowerCase()+".png' />" +
                        "<span class='file_name'>"+response[a]['file'][i]['name']+"</span >" +
                        annot +
                    "</p>");

				   	flll.hover(
				      function () {
				      	self.menu.addContextZone($(this).attr("id"));
				      },
				      function () {
				        self.menu.addContextZone($(this).parent().attr("id"));
				      }
				    );					
					post.append(flll);
				}
				post.append("<span class='date'>"+response[a]['date']+"</span><br>");
				$("#"+container+"_main").prepend(post);
                var annotate = post.find(".annotate_file");
                annotate.click(function(){
                    var file_pass = $(this).parent().attr('href');
                    anfile = $(this).parent().attr('id').split('_')[1];
                    annotateFile(file_pass,anfile);
                });

			}

            $('.file_item img.file_type_icon_item, .file_item .file_name').click(function(event){
                var file_pass = $(this).parent().attr('href');
                anfile = $(this).parent().attr('id').split('_')[1];
                annotateFile(file_pass,anfile);
            });
		},"json");
	}

    function annotateFile(file_pass,anfile){
        var _file_pass = file_pass.split('.');
        var file_type = _file_pass[_file_pass.length-1];

        if(file_type!='pdf'){
            //alert(dlang("not_supported_annotation_alert","Unsupported file type!"));

            if(_.indexOf(["pdf","jpg","jpeg","txt","sql","gif","bmp","png"],file_type)== -1){
                seconfirm(dlang("subm_comm_grag_popup_downl","Download this file?"),function(){
                    if(link){
                        window.open(file_pass);
                    }
                });
            }else{
                window.open(file_pass);
            }

            return false;
        }
        window.open('anotation.php?file='+file_pass+'&fileid='+anfile+'&assignment='+options.id+'&pupil='+options.pupil,'_blank');
    }

    this.initForum = function(container){
        if(!comet_messager){

            comet_messager = new Messanger(function(){
                //self.reload(options.id,options.type);
                var grid = schoolmule.instances.grid_assess_assignments.getGrid().grid;
                var tree = schoolmule.instances.tree_assignments_by_studygroup.getTree();
                grid.updateFromXML("connectors/connector.php?control_id=grid_assess_assignments&id="+tree.getSelectedItemId().split('_')[1]);
            });

            comet_messager.start();
        }
/*        if(!submission_interval_reload){
            submission_interval_reload = setInterval(function(){
                $.post("libs/update_check.php", {}, function(response){
                    if(response=='update'){
                        self.reload(options.id,options.type);
                    }
                });
            }, 3000);
        }*/

        var forum = this;

		getForumContent(options.id, options.type, container,false);
		$("#"+container).append('<form action="libs/file_upload.php"><div id="'+container+'_main" class="forum-main"></div></form>'+'<div class="forum-cont"><div id="'+container+'_form"></div></div>');
		if(!options.files){
			$(".forum-cont").css('height','105px');
			$(".forum-main").css('bottom','105px');
		}
        if(schoolmule.main.user_role != 'parent'){
            var dropZone = $('#comments_tiny_main');
            var maxFileSize = 1000000;

            dropZone[0].ondragover = function() {
                dropZone.addClass('hover');
                return false;
            };

            dropZone[0].ondragleave = function() {
                dropZone.removeClass('hover');
                return false;
            };

            dropZone[0].ondrop = function(event) {
                event.preventDefault();
                dropZone.removeClass('hover');
                dropZone.addClass('drop');
                var file = event.dataTransfer.files[0];

                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) {
                        if(xhr.status == 200) {
                            transferComplete();
                        }
                    }
                };
                var formData = new FormData();
                formData.append('file', file);
                xhr.upload.addEventListener('progress', uploadProgress, false);
                //xhr.upload.addEventListener("load", transferComplete, false);
                $.post("libs/addcomment.php", {action:"add", comment:"", item_id:options.id, type:options.type, id:schoolmule.main.user_id, user:schoolmule.main.user_login, date:ttt.split(' GMT')[0], pupil_id:options.pupil}, function(response){
                    dropZone.append('<div class="upload_progress">Loading...</div>');
                    //dropZone.css('background', '#ddd');
                    xhr.open('POST', "libs/file_upload.php?id="+schoolmule.main.user_id+"&login="+schoolmule.main.user_login+"&comment="+response+"&item_id="+options.id);
                    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                    xhr.send(formData);
                });

            };


            function transferComplete(event) {
                dropZone.css('background', '#F0F0EE');
                getForumContent(options.id,options.type,options.container,false);
                dropZone.find('.upload_progress').remove();
            }

            function uploadProgress(event) {
                var percent = parseInt(event.loaded / event.total * 100);
                dropZone.find('div').text('Loading:'+' '+ percent + '%');
            }
        }
        if(schoolmule.main.user_role != 'parent'){
            $(".forum-cont").append('' +
                '<div class="link_btn_cont">' +
                    '<span class="link_title_field'+(options.files?"":" performance_link")+'" >'+dlang("add_link_text","Link")+':</span>' +
                    '<div class="linkbutton" title="Link"></div>' +
                '</div>');
            $('.linkbutton').click(function(){
                var cont = $('<div id="dialog-confirm">\
                    '+dlang("insert_link_dialog_link_title","Title:")+'\
                    <p><input class="link_title" /></p>\
                     '+dlang("insert_link_dialog_link","Link:")+'\
                    <p><input class="link_src" /></p>\
                    </div>');
                $('body').append(cont);
                var Ok = dlang("button_ok","Ok");
                var Cancel = dlang("button_cancel","Cancel");
                cont.dialog({
                    title: dlang("insert_link_dialog_title","Insert Link"),
                    autoOpen: true,
                    modal: true,
                    width: 300,
                    minHeight: 120,
                    resizable: false,
                    buttons: [
                        {
                            text: Ok,
                            click: function() {
                                var title = $('.link_title').val();
                                var src = $('.link_src').val();

                                if(!(src.indexOf('http://') + 1)) {
                                    src = 'http://'+src;
                                }

                                cont.dialog( "destroy" );
                                cont.remove();
                                var comment = '<a href="'+src+'" target="_blank">'+title+'</a>';
                                $.post("libs/addcomment.php", {action:"add", comment:comment, item_id:options.id, type:options.type, id:schoolmule.main.user_id, user:schoolmule.main.user_login, date:ttt.split(' GMT')[0], pupil_id:options.pupil}, function(response){
                                    if($('.dhx_upload_files > div').size()==0){
                                        getForumContent(options.id,options.type,options.container,false);
                                    }
                                });
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
                    }
                });
            });

            if(!options.files){
                $('.link_btn_cont').css({
                    height:'32px',
                    top:'26px'
                });

                $('.linkbutton').css({
                    bottom: '7px'
                });

                $('.link_title_field').css('padding-left','0');
            }

            var config = setConfig();
            dhx.form = new dhtmlXForm(container+"_form",config);
            dhx.form.setSkin('dhx_web');
        }else{
            $('.forum-cont').remove();
            $('.forum-main').css("bottom","0");
        }

		var post = $('<p class="post"></p>');
		var d = new Date();
		var ttt = d.toString();
	    self.menu = new dhtmlXMenuObject();
	    self.menu.renderAsContextMenu();

        if(schoolmule.main.user_role == 'pupil' || schoolmule.main.user_role == 'parent'){
            if(options.files){
                var uploader = dhx.form.getUploader("files");
                self.menu.addNewChild(self.menu.topId, 2, "downloadf", dlang("subm_comm_grag_menu_p","Preview"), false);
            }
        }else{

            if(options.files){
                var uploader = dhx.form.getUploader("files");
                self.menu.addNewChild(self.menu.topId, 0, "download", dlang("subm_comm_grag_menu_d","Download"), false);
                self.menu.addNewChild(self.menu.topId, 2, "downloadf", dlang("subm_comm_grag_menu_p","Preview"), false);
                self.menu.addNewChild(self.menu.topId, 1, "downloadall", dlang("subm_comm_grag_menu_da","Download all"), false);
            }

            if(options.edit){
                self.menu.addNewChild(self.menu.topId, 3, "annotate", dlang("subm_comm_grag_menu_ann","Annotate"), false);
                self.menu.addNewChild(self.menu.topId, 4, "delete", dlang("subm_comm_grag_menu_del","Delete this submission"), false);
                self.menu.addNewChild(self.menu.topId, 5, "deleteall", dlang("subm_comm_grag_menu_clear","Clear list"), false);
            }
        }

	    self.menu.attachEvent("onBeforeContextMenu", function(id){
	    	var _id = id.split("_");
	    	switch(_id[0]){
	    		case "comment": 
			      	$(".post").css("background-color","#F0F0EE");
			      	$("#"+id).css("background-color","lightgrey");
			      	curr_item = id;
	    		break;
	    		case "file": 
			      	$(".post").css("background-color","#F0F0EE");
			      	$("#"+id).parent().css("background-color","lightgrey");
			      	curr_item = $("#"+id).parent().attr('id');
	    		break;
	    		//default: return false;
	    	}
	    	return true;
	    });
        if(schoolmule.main.user_role != 'parent'){
            dhx.form.attachEvent("onButtonClick", function(name){
                var pupil_id = options.pupil;
                if(name=='save'){
                    $(".forum-cont .dhx_file_param.dhx_file_progress").show();
                    var comment = dhx.form.getItemValue('comment');
                    debugger;
                    $.post("libs/addcomment.php", {action:"add", comment:comment, item_id:options.id, type:options.type, id:schoolmule.main.user_id, user:schoolmule.main.user_login, date:ttt.split(' GMT')[0], pupil_id:pupil_id}, function(response){
                        if(options.files){
                            uploader.setURL("libs/file_upload.php?id="+schoolmule.main.user_id+"&login="+schoolmule.main.user_login+"&comment="+response+"&item_id="+options.id);
                            uploader.upload();
                        }

                        if($('.dhx_upload_files > div').size()==0){
                            getForumContent(options.id,options.type,options.container,false);
                        }

                        dhx.form.setItemValue("comment","");
                    })
                }else{
                    location.href = 'libs/forum_content.php?action=getzip&pupil='+pupil_id+'&assign='+options.id;
                }
            });

            dhx.form.attachEvent("onUploadFile",function(realName,serverName){
                /*
                 var file = realName.split('.');
                 post.children(".comment").next().remove();
                 post.children(".comment").after("<p class='file'  target='_blank' href='"+serverName+"'><img src='images/files/"+file[1].toLowerCase()+".png' />"+realName+"</p>");
                 */
            });

            dhx.form.attachEvent("onUploadComplete",function(realName,serverName){
                $(".forum-cont .dhx_file_param.dhx_file_progress").hide();
                //post.append("<span class='date'>"+ttt.split(' GMT')[0]+"</span><br>");
                uploader.clear();
                //self.reload(options.id,options.type);
                getForumContent(options.id,options.type,options.container,false);
            });

            if(options.files && uploader){
                uploader._addFileToList2 = uploader._addFileToList;
                uploader._addFileToList = function(id, name, size){
                    this._addFileToList2.apply(this,arguments);
                    this.callEvent("onFileAdded", [id, name, size]);
                }

                dhx.form.attachEvent("onFileAdded", function(){
                    $(".link_btn_cont").css("height",(parseInt($(".link_btn_cont").css("height"))+18)+"px");
                    $(".link_title_field").css("bottom",(parseInt($(".link_title_field").css("bottom"))+18)+"px");
                    $(".forum-cont").css("height",(parseInt($(".forum-cont").css("height"))+18)+"px");
                    $(".forum-main").css("bottom",(parseInt($(".forum-main").css("bottom"))+18)+"px");
                });

                dhx.form.attachEvent("onFileRemove", function(){
                    $(".link_btn_cont").css("height",(parseInt($(".link_btn_cont").css("height"))-18)+"px");
                    $(".link_title_field").css("bottom",(parseInt($(".link_title_field").css("bottom"))-18)+"px");
                    $(".forum-cont").css("height",(parseInt($(".forum-cont").css("height"))-18)+"px");
                    $(".forum-main").css("bottom",(parseInt($(".forum-main").css("bottom"))-18)+"px");
                });
            }

        }

	    self.menu.attachEvent("onClick", function(id, zoneId, casState){
	    	$(".post").css("background-color","#F0F0EE");
            switch(id){
                case "annotate":

                    if($("#"+zoneId).hasClass("file_item")){
                        var file_pass = $("#"+zoneId).attr("href");
                        anfile = $("#"+zoneId).parent().attr('id').split('_')[1];
                        annotateFile(file_pass,anfile);
                    }else if($("#"+zoneId).hasClass("post")){
                        var file_pass = $("#"+zoneId).find('.file_item').attr("href");
                        $("#"+zoneId).attr('id').split('_')[1];
                        annotateFile(file_pass,anfile);
                    }
                    break;
                case "delete":
                    seconfirm(dlang("subm_comm_grag_popup_dele","Do you really want to delete?"),function(){
                        $.post("libs/addcomment.php", {action:"delete", id:curr_item}, function(response){})
                        $("#"+curr_item).remove();
                    });

                    break;
                case "deleteall":
                    seconfirm(dlang("subm_comm_grag_popup_dele","Do you really want to delete?"),function(){
                        var links = $("#"+options.container+"_main > p");
                        $.each(links, function(i) {
                            $.post("libs/addcomment.php", {action:"delete", id:$(this).attr("id")}, function(response){})
                            $("#"+$(this).attr("id")).remove();
                        });
                    });
                    break;
                case "download":
                    var link = $("#"+zoneId).attr("href");

                    if(!link){
                        link = $("#"+zoneId).find("p").attr("href");
                    }
                    if(link){
                        window.open(link);
                    }
                    break;
                case "downloadf":
                    var link = $("#"+zoneId).attr("href"),
                        file;
                    
                    if(!link){
                        link = $("#"+zoneId).find("p").attr("href");
                    }
                    file = link.toLowerCase().split('.');
                    if(file == "pdf"){
                        if($("#"+zoneId).hasClass("file_item")){
                            var file_pass = $("#"+zoneId).attr("href");
                            anfile = $("#"+zoneId).parent().attr('id').split('_')[1];
                            annotateFile(file_pass,anfile);
                        }else if($("#"+zoneId).hasClass("post")){
                            var file_pass = $("#"+zoneId).find('.file_item').attr("href");
                            $("#"+zoneId).attr('id').split('_')[1];
                            annotateFile(file_pass,anfile);
                        }
                    }else{
                        window.open(link);
                    }

                    break;
/*
                    var link = $("#"+zoneId).attr("href");
                    var file = link.toLowerCase().split('.');
                    if(_.indexOf(["pdf","jpg","jpeg","txt","sql","gif","bmp","png"],file[file.length-1])== -1){
                        seconfirm(dlang("subm_comm_grag_popup_downl","Download this file?"),function(){
                            if(link){
                                window.open(link);
                            }
                        });
                    }else{
                        window.open(link);
                    }
*/
                    var link = $("#"+zoneId).attr("href");
                    var file = link.toLowerCase().split('.');
                    annotateFile(link,file);
                    break;
                case "downloadall":
                    var links = $("#"+curr_item + " p");
                    var state = false;
                    $.each(links, function() {
                        var link = $(this).attr("href");
                        if(_.indexOf(["pdf","jpg","txt","sql","gif","bmp","png"],link.toLowerCase().split('.')[1])== -1 && !state){
                            seconfirm(dlang("subm_comm_grag_popup_downl","Download this file?"),function(){
                                state = true;
                                if(link){
                                    window.open(link);
                                }
                            });
                        }else{
                            if(link){
                                window.open(link);
                            }
                        }
                    });
                    break;

            }
	    });
	}

    this.saveData = function (cont){
	}

    this.refresh = function(){
	}


    this.refreshExpand = function(){
	}

    this.getForm = function(){
		return {grid:dhx.form,dp:myDataProcessor};
	}

    this.attachTo = function(id){
		options.container = id;
		this.initForum(id);
	};
}

var submission_interval_reload = null;

var comet_messager = null;

function Messanger(callback) {
    this.last = 0;
    this.timeout = 60;
    this.comet = 0;
    var self = this;
    var stop = false;
    this.parseData = function(message) {
        if(stop){
            return true;
        }
        if (message == 'update') {
            callback();
        }
        setTimeout(self.connection,1000);
    }
    this.connection = function() {
        self.comet = $.ajax({
            type: "GET",
            url:  "libs/update_check.php",
            dataType: "text",
            timeout: self.timeout*1000,
            success: self.parseData,
            error: function(){
                if(stop){
                    return true;
                }
                setTimeout(self.connection,5000);
            }
        });
    }

    this.stop = function(){
        stop = true;
    }

    this.start = function() {
        setTimeout(self.connection,5000);
    }
}

