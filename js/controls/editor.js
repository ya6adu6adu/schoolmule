var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.controls.editor = function(editor,_options){
	var self = this;
	var edits = [];
	var active;
	var curr_arr;
	var initObj;
	
	var defaults = {
		type : "text",
		content : ""
	};
	
	var options = $.extend(defaults, _options);
	
	self.refresh = function(){
        var height = 0, searchField, cont = $("#"+curr_arr);
        searchField = cont.parent().find("#page_content_custom_editor_for_edit_tab");
        if(searchField.length>0){
            height = searchField.outerHeight();
        }
        $("#"+curr_arr+"_ifr").height(cont.outerHeight()-171+88 - height); // height - its height of search field
        $("#"+curr_arr).parent().find(".mce-edit-area").height(cont.outerHeight()-171+88 - height);
	}

	self.getContent = function(all_content){
		if(!arguments[0]){
			return tinyMCE.get(options.container)?tinyMCE.get(options.container).getContent():"";
		}else{
			var eds = {};
			for(var edit in edits){
				if(active==edit)
					eds[edit] = tinyMCE.get(options.container).getContent();
				else
					eds[edit] = edits[edit];
			}
			return JSON.stringify(eds);
		}	
	}
	
	self.setContent = function(){
		 for(var i=0; i<arguments.length; i++){
		 	for(var edit in arguments[i]){
				edits[edit] = arguments[i][edit];
				if(!options.active_select || (options.active_select && options.active_select==edit)){
					$('#'+options.container).html(arguments[i][edit]);
				}
			}
		 }
	}

	self.setDefaults = function(){
	}
	
	self.selectEditor = function(edit){
		if(tinyMCE.get(options.container).getContent())
			edits[active] = tinyMCE.get(options.container).getContent();
		tinyMCE.get(options.container).setContent(edits[edit]);
		active = edit;
	}

	self.hide = function(edit){
        if(tinyMCE.get(options.container)){
            tinyMCE.get(options.container).hide();
            $('#'+options.container).addClass("edit");
        }
	}

	self.show = function(edit){
		var mcs = $('#'+options.container).outerHeight();
		$('#'+options.container+'_parent').height(mcs);
		tinyMCE.get(options.container).show();
		$('#'+options.container).removeClass("edit");
        self.refresh();
	}
    self.getType = function(){
        return options.active_item;
    }

	function init(){
		if(options.container){
			self.attachTo(options.container);
		}
	}

	self.attachTo = function(area){

        var lng = 'en';
        switch(gl_user_lang){
            case 'se':
                lng = 'sv_SE';
                break;
            case 'en':
                lng = '';
                break;
            case 'da':
                lng = 'da';
                break;
            case 'nw':
                lng = 'nb_NO';
                break;
            case 'ge':
                lng = 'de';
                break;
            case 'pl':
                lng = 'pl';
                break;
            case 'fr':
               lng = 'fr_FR';
               break;
            case 'fi':
                lng = 'fi';
                break;
            case 'it':
                lng = 'it';
                break;
            case 'sp':
                lng = 'es';
                break;
            case 'ru':
                lng = 'ru';
                break;
            default:
               lng = gl_user_lang;
               break;
        }
        area = area +'_field';
		curr_arr = area;
		var settings;
		var ed = area;
		$("#"+area).css('overflow','hidden');
		if(options.active_select){
			active = options.active_select+'_field';
		}else{
			active = editor[0];
		}

        $('#'+options.container).css("overflow","hidden").append('<div style="width: 100%; height: 100%; word-wrap: break-word;" id="'+options.container+'_field">'+options.content+'</div>')
        options.container = options.container+'_field';
		//$('#'+options.container).html(options.content);
		var width = $("#"+area).width();
		var height = $("#"+area).height();

        var cont = $("#"+curr_arr+'_container');
        var menuh = $("#"+curr_arr+'_container .mce-menubar').height();
        var menui = cont.find('.mce-container-body.mce-stack-layout .mce-panel.mce-stack-layout-item:first').height();

		if(options.type == "text"){
			settings={
                mode : "exact",
                elements : ed,
                theme: "modern",
                language : lng,
                height: height-171,
                oninit : function(){
                    afterLoadAction()
                },
                plugins: [
                    "advlist autolink lists link image charmap print preview anchor textcolor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table contextmenu paste moxiemanager"
                ],

                menubar : "insert edit view format table tools",
                /*                menu: {
                 file: {title: 'File', items: 'newdocument'},
                 edit: {title: 'Edit', items: 'undo redo | cut copy paste | selectall'},
                 insert: {title: 'Insert', items: 'insertfile'},
                 view: {title: 'View', items: 'visualaid'},
                 format: {title: 'Format', items: 'bold italic underline strikethrough superscript subscript | formats | removeformat'},
                 },*/
                toolbar2: "forecolor backcolor | fontselect styleselect | bold italic | bullist numlist outdent indent",
                toolbar1: "fullscreen preview print |  fontsizeselect | emoticons | insertfile image media link | alignleft aligncenter alignright alignjustify code  | table"
            }
		}


		if(options.type == "assignment"){
			settings={
                //selector: "exact",
                mode : "exact",
                elements : ed,
                theme: "modern",
                language : lng,
                height: height-81,
                oninit : function(){

                    afterLoadAction()
                },
                change  :function(){
                    alert(5)
                },
                plugins: [
                    "advlist autolink lists link image charmap print preview anchor textcolor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table contextmenu paste moxiemanager"
                ],

                menubar : "insert edit view format table tools",
/*                menu: {
                    file: {title: 'File', items: 'newdocument'},
                    edit: {title: 'Edit', items: 'undo redo | cut copy paste | selectall'},
                    insert: {title: 'Insert', items: 'insertfile image'},
                    view: {title: 'View', items: 'visualaid'},
                    format: {title: 'Format', items: 'bold italic underline strikethrough superscript subscript | formats | removeformat'}
                },*/
                theme_advanced_buttons3_add : "tablecontrols",

                toolbar2: "forecolor backcolor | fontselect styleselect | bold italic | bullist numlist outdent indent ",
                toolbar1: "fullscreen preview print | fontsizeselect | emoticons | insertfile image media link | alignleft aligncenter alignright alignjustify | code | table"
			}
		}
		
		if(options.type == "small"){
			settings={
                mode : "exact",
                elements : ed,
                theme: "modern",
                language : lng,
                height: height-81,
                oninit : function(){
                    afterLoadAction()
                },
                plugins: [
                    "advlist autolink lists link image charmap print preview anchor textcolor code",
                    "searchreplace visualblocks fullscreen",
                    "insertdatetime media table contextmenu paste moxiemanager"
                ],

                menubar : "insert edit view format table tools",
                /*                menu: {
                 file: {title: 'File', items: 'newdocument'},
                 edit: {title: 'Edit', items: 'undo redo | cut copy paste | selectall'},
                 insert: {title: 'Insert', items: 'insertfile'},
                 view: {title: 'View', items: 'visualaid'},
                 format: {title: 'Format', items: 'bold italic underline strikethrough superscript subscript | formats | removeformat'},
                 },*/
                toolbar2: "forecolor backcolor | fontselect styleselect | bold italic | bullist numlist outdent indent",
                toolbar1: "fullscreen preview print | fontsizeselect |  emoticons | insertfile image media link | alignleft aligncenter alignright alignjustify | code | table"
			}
		}
		
		if(options.type == "assignment_progress"){
			settings={
                mode : "exact",
                elements : ed,
                language : lng,
                theme: "modern",
                height: height-101,
                oninit : function(){
                    afterLoadAction()
                },
                plugins: [
                    "advlist autolink lists link image charmap print preview anchor textcolor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table contextmenu paste moxiemanager"
                ],

                menubar : "insert edit view format table",
                /*                menu: {
                 file: {title: 'File', items: 'newdocument'},
                 edit: {title: 'Edit', items: 'undo redo | cut copy paste | selectall'},
                 insert: {title: 'Insert', items: 'insertfile'},
                 view: {title: 'View', items: 'visualaid'},
                 format: {title: 'Format', items: 'bold italic underline strikethrough superscript subscript | formats | removeformat'},
                 },*/
                toolbar2: "forecolor backcolor | fontselect styleselect | bold italic | bullist numlist outdent indent code",
                toolbar1: "fullscreen preview print | fontsizeselect | emoticons | insertfile image media link | alignleft aligncenter alignright alignjustify  | table"
			}
		}

		if(options.type == "assignment_small"){
			settings={
                mode : "exact",
                elements : ed,
                theme: "modern",
                language : lng,
                height: height-81,
                oninit : function(){
                    afterLoadAction();
                },
                plugins: [
                    "advlist autolink lists link image charmap print preview hr anchor pagebreak textcolor moxiemanager",
                    "searchreplace wordcount visualblocks visualchars code fullscreen",
                    "insertdatetime media nonbreaking save table contextmenu directionality",
                    "emoticons template paste"
                ],
                toolbar1: "fullscreen preview print  | fontsizeselect | forecolor backcolor | insertfile | bullist numlist outdent indent | link image code | table",
                menubar : "insert format tools"
			}
		}


		initObj = settings;
		tinyMCE.init(settings);

		edits[active] = options.content;
	}

    function checkContentState(){
        window.save_notification = true;
        $('#'+options.container).parent().children('span').fadeOut("slow");
        $("#save").removeAttr("disabled");
        $("#save").removeClass("disabled-button");

        if(options.active_item && options.active_item == "assignment"){
            window.assignment_content = window.tinyContent.getContent();
            window.grading_content = window.tinyGrading?window.tinyGrading.getContent():null;
            setEditbold();

            if(window.grading_content){
                setEditboldObjective();
            }

            if(window.assignment_content == window.published_assignment_content && (window.grading_content && window.grading_content == window.published_grading_content)){
                $("#save_publish").attr("disabled");
                $("#save_publish").addClass("disabled-button");
                $("#revert").attr("disabled");
                $("#revert").addClass("disabled-button");
            }else{
                if(!options.setAutoSave) {
                    options.setAutoSave = setInterval(function () {
                        if(!$("#save").hasClass("disabled-button")) {
                            $("#save").click();
                            clearInterval(options.setAutoSave);
                            delete options.setAutoSave;
                        }
                    }, 10000);
                }
                $("#save_publish").removeAttr("disabled");
                $("#save_publish").removeClass("disabled-button");
                $("#revert").removeAttr("disabled");
                $("#revert").removeClass("disabled-button");
            }
        }
    }

    function afterLoadAction(){
        var tuny =  tinyMCE.get(options.container), height, width,
            editArea = $('#'+options.container);
        if(options.setAutoSave) {
            clearInterval(options.setAutoSave);
            delete options.setAutoSave;
        }

        tuny.on('keypress', function(a){
            checkContentState();
/*            $('#'+options.container).parent().children('span').fadeOut("slow");
            $("#save").removeAttr("disabled");
            $("#save").removeClass("disabled-button");*/
        });

        tuny.on('change', function(a){
            checkContentState();
        });

        if(options.hide){
            $("#edit").removeAttr("disabled");
            $("#edit").removeClass("disabled-button");
            $("#save").attr("disabled","disabled");
            $("#save").addClass("disabled-button");

            if(options.active_item && options.active_item == "assignment"){
                if(window.assignment_content == window.published_assignment_content &&  window.grading_content == window.published_grading_content){
                    $("#save_publish").attr("disabled");
                    $("#save_publish").addClass("disabled-button");
                    $("#revert").attr("disabled");
                    $("#revert").addClass("disabled-button");
                }
            }

            self.hide();
            $(editArea).css("height","auto");
            if(editArea.outerHeight() > editArea.parent().outerHeight()){
                height = "100%";
                width = "100%";
            }else{
                height = "auto";
                width = "auto";
            }
            $('#'+options.container).css({
                'padding':'8px',
                'width': width,
                'display':'inline-block',
                'height': height,
                'box-sizing': 'border-box'
            });

            $('#'+options.container).parent().css({
                'overflow':'hidden'
            });

            return true;
        }

        self.refresh();
    }
	
	init();
};