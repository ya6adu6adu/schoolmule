var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.controls.comments = function(_options){
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
	var container_main = null;
	var content = null;
	var dialog;
	var myDataProcessor;
	var curr_popup_data = null;
	var curr_item = null;
	this.current_user = null;
	this.menu = null;
	
	
	
	this.reload = function(id,type,container){
            //$("#comments_tiny_main").html("");
            getForumContent(id,type,container,true);
	}
	
	function setConfig(width,height){
        var config;
        if(options.edit){
            config = [
                {type: "input", name: "comment", label: dlang("Write notes:"), value: "", rows:40, position:"label-top", inputWidth:width, width:width, inputHeight :height, height:height},
                {type: "button", name: "save", value: dlang("Submit"),offsetTop:10}
            ];
        }else{
            config = [];
            $('.forum-main-comm').css({
                height: '100%',
                position: 'static'
            });
            $('.forum-cont-comm').hide();
        }

		return config;
	}
	
	function getForumContent(id,type,container,reload){
		var pupil_id;
		if($("#assignment_garade").size()>0){
			var grid = schoolmule.instances.grid_assess_assignments.getGrid().grid
			var pupil = grid.getSelectedRowId().split('_');
			pupil_id = pupil[1];
		}else if($("#assess_grid").size()>0){
			var grid = schoolmule.instances.grid_assess_performance.getGrid().grid
			var pupil = grid.getSelectedRowId().split('_');
			pupil_id = pupil[1];
		}else{
			var tree = schoolmule.instances.tree_assessments_by_studygroup.getTree();
			var pupil = tree.getParentId(tree.getSelectedItemId()).split('_');
			pupil_id = pupil[1];
		}
		
		$.post("libs/forum_content.php", {id:id, type:type, pupil_id:pupil_id}, function(response){
			for(a in response){
				if($('#comment_'+a).size()!=0){
					continue;
				}

				var post = $('<p class="post" id="comment_'+a+'"></p>');
				
				if(reload){
					post.addClass("reloaded");
				}
				
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
				comment=comment.replace(/http\:\/\/(\S+[\w\-\/])/ig,"<a target='_blank' href='http://$1'>$1</a>");
				comment=comment.replace(/www.(\S+[\w\-\/])/ig,"<a target='_blank' href='http://$1'>$1</a>");	    
				post.append("<span class='login-name'>"+response[a]['user']+"</span> <span class='comment'>"+comment+"</span><br>");
				for(var i=0; i<response[a]['file'].length;i++){
					var file = response[a]['file'][i]['name'].split('.');
					var flll = $("<p id='file_"+response[a]['file'][i]['fid']+"' class='file'  target='_blank' href='"+response[a]['file'][i]['full_name']+"'><img src='images/files/"+file[1].toLowerCase()+".png' />"+response[a]['file'][i]['name']+"</p>");
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
			}
		},"json")	
	}

    this.refresh = function(){
        dhx.form.setItemWidth('comment',container_main.width()-14);
        container_main.find('.dhxform_textarea[name="comment"]').height(container_main.parent().height()-70);
    }

    this.refreshExpand = function(){
        this.refresh();
    }

	this.initForum = function(container){

		getForumContent(options.id, options.type, container,false);
		$("#"+container).append('<div id="'+container+'_main" class="forum-main-comm"></div>'+'<div class="forum-cont-comm"><div style="width: 100%" id="'+container+'_form"></div></div>');
		if(!options.files){
			//$(".forum-cont-comm").css('height','105px');
            //$(".forum-cont-comm").css('height','105px');
			//$(".forum-main").css('bottom','105px');
		}
        var jqcont = $('#'+container+"_form");
        container_main = jqcont;
		var config = setConfig(jqcont.width()-14,jqcont.parent().height()-70);

		dhx.form = new dhtmlXForm(container+"_form",config);
		dhx.form.setSkin('dhx_web');

		var post = $('<p class="post"></p>');
		var d = new Date();
		var ttt = d.toString();
	    self.menu = new dhtmlXMenuObject();
	    self.menu.renderAsContextMenu();
	       
		if(options.files){
			var uploader = dhx.form.getUploader("files");
			self.menu.addNewChild(self.menu.topId, 0, "download", dlang("Download"), false);
			self.menu.addNewChild(self.menu.topId, 2, "downloadf", dlang("Preview"), false);
	   		self.menu.addNewChild(self.menu.topId, 1, "downloadall", dlang("Download all"), false);
		}

        if(options.edit){
            self.menu.addNewChild(self.menu.topId, 3, "annotate", dlang("Annotate"), false);
            self.menu.addNewChild(self.menu.topId, 4, "delete", dlang("Delete this submission"), false);
            self.menu.addNewChild(self.menu.topId, 5, "deleteall", dlang("Clear list"), false);
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
	    
	    self.menu.attachEvent("onClick", function(id, zoneId, casState){
	    	$(".post").css("background-color","#F0F0EE");
	    	switch(id){
	    		case "annotate":
	    			window.open("https://docs.google.com/drawings/d/1fnYAtgRRH8ZyQiG51Es7Gi_njg6IKXlHtzz2XH1FCyQ/edit");
	    		break;
	    		case "delete":
                    seconfirm(dlang("Do you really want to delete?"),function(){
                        $.post("libs/addcomment.php", {action:"delete", id:curr_item}, function(response){})
                        $("#"+curr_item).remove();
                    });

	    		break;
	    		case "deleteall":
                    seconfirm(dlang("Do you really want to delete?"),function(){
                        var links = $("#"+options.container+"_main > p");
                        $.each(links, function(i) {
                            $.post("libs/addcomment.php", {action:"delete", id:$(this).attr("id")}, function(response){})
                            $("#"+$(this).attr("id")).remove();
                        });
                    });
	    		break;
	    		case "download":
	    			var link = $("#"+zoneId).attr("href");
                    if(link){
                        window.open(link);
                    }

	    		break;
	    		case "downloadf":
	    			var link = $("#"+zoneId).attr("href");

	    			if(_.indexOf(["pdf","jpg","txt","sql","gif","bmp","png"],link.toLowerCase().split('.')[1])== -1){
                        seconfirm(dlang("Download this file?"),function(){
                            if(link){
                                window.open(link);
                            }
                        });
                        /*
                        if(!confirm("Download this file?")){
	    					break;
	    				}
	    				*/
	    			}

	    		break;	    		
	    		case "downloadall":
	    			var links = $("#"+curr_item + " p");
	    			var state = false;
	    			$.each(links, function() {
	    				var link = $(this).attr("href");
		    			if(_.indexOf(["pdf","jpg","txt","sql","gif","bmp","png"],link.toLowerCase().split('.')[1])== -1 && !state){
                            seconfirm(dlang("Download this file?"),function(){
                                state = true;
                                if(link){
                                    window.open(link);
                                }
                            });
                            /*
		    				if(confirm("Download this file?")){
                                if(link){
                                    window.open(link);
                                }
		    				}
		    				*/
		    			}else{
                            if(link){
		    				    window.open(link);
                            }
		    			}	    				
	    			});
	    		break;
	    		
	    	}
	    });
	    
		dhx.form.attachEvent("onButtonClick", function(name){
			$(".forum-cont .dhx_file_param.dhx_file_progress").show();
			var comment = dhx.form.getItemValue('comment');
			comment=comment.replace(/http\:\/\/(\S+[\w\-\/])/ig,"<a target='_blank' href='http://$1'>$1</a>");
			comment=comment.replace(/www.(\S+[\w\-\/])/ig,"<a target='_blank' href='http://$1'>$1</a>");
			var pupil_id;
			if($("#assignment_garade").size()>0){
				var grid = schoolmule.instances.grid_assess_assignments.getGrid().grid
				var pupil = grid.getSelectedRowId().split('_');
				pupil_id = pupil[1];
			}else if($("#assess_grid").size()>0){
				var grid = schoolmule.instances.grid_assess_performance.getGrid().grid
				var pupil = grid.getSelectedRowId().split('_');
				pupil_id = pupil[1];
			}else{
				var tree = schoolmule.instances.tree_assessments_by_studygroup.getTree();
				var pupil = tree.getParentId(tree.getSelectedItemId()).split('_');
				pupil_id = pupil[1];
			}
			$.post("libs/addcomment.php", {action:"add", comment:dhx.form.getItemValue('comment'), item_id:options.id, type:options.type, id:schoolmule.main.user_id, user:schoolmule.main.user_login, date:ttt.split(' GMT')[0], pupil_id:pupil_id}, function(response){
				if(options.files){

					uploader.setURL("libs/file_upload.php?id="+schoolmule.main.user_id+"&login="+schoolmule.main.user_login+"&comment="+response+"&item_id="+options.id);				
					uploader.upload();
				}
				
				if($('.dhx_upload_files > div').size()==0){
					getForumContent(options.id,options.type,options.container,false);
				}
				
				dhx.form.setItemValue("comment","");
			    post.hover(
			      function () {
			      	alert(3);
			      },
			      function () {
			        alert(3);
			      }
			);
			/*
				post = $('<p class="post"></p>');
				dhx.form.setItemValue("comment","");
				post.attr("id","comment_"+response);
				post.append("<span class='login-name'>"+schoolmule.main.user_login+"</span> <span class='comment'>"+comment+"</span><br>");
				if(options.files){
					uploader.setURL("libs/file_upload.php?id="+schoolmule.main.user_id+"&login="+schoolmule.main.user_login+"&comment="+response+"&item_id="+options.id);				
					uploader.upload();
				}
				//else{
					post.append("<span class='date'>"+ttt.split(' GMT')[0]+"</span><br>");
				//}
				$("#"+container+"_main").prepend(post);
			post.click(
		      function () {
		      	$(".post").css("background-color","#F0F0EE");
		      	$(this).css("background-color","lightgrey");
		      	curr_item = $(this).attr("id");
		      }
			);
			post.hover(
			      function () {
			      	self.menu.addContextZone($(this).attr("id"));
			      },
			      function () {
			        self.menu.addContextZone($(this).parent().attr("id"));
			      }
			);
			*/
			})					
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
				$(".forum-cont").css("height",(parseInt($(".forum-cont").css("height"))+25)+"px");
				$(".forum-main").css("bottom",(parseInt($(".forum-main").css("bottom"))+25)+"px");
			});	
	
			dhx.form.attachEvent("onFileRemove", function(){
				$(".forum-cont").css("height",(parseInt($(".forum-cont").css("height"))-25)+"px");
				$(".forum-main").css("bottom",(parseInt($(".forum-main").css("bottom"))-25)+"px");
			});
		}
	}

	this.saveData = function (cont){
	}

	
	this.getForm = function(){
		return {grid:dhx.form,dp:myDataProcessor};
	}
	
	this.attachTo = function(id){
		options.container = id;
		this.initForum(id);
	};
}