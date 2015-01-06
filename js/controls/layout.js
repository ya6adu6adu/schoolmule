var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.controls.layout = function(_options){
	var self = this;
	var he = true; // hide Details box flagv
	var loader = null; // ajax loader
	this.elements = [];
	
	//empty left and right part example
	var defaults = {
		cellsBlock: {
					display_footer_left: false,
					display_footer_right: false,
					cells_left:[
									{
										id : "nav-body"
									}
						   	   	],
					cells_right:[
								{
									cells:[{
										new_count : true,
										id : "empty_block",
										title: "",
										content: "Present view",
										width: '100%',
										height: '100%'				
									 }
									]
								}
						     ]
		  	}		
	};
	
	var options = $.extend(defaults, _options);
	
	this.setTitle = function(block, title){
		if(block=='navigation'){
			var titleobj = $('#navigation .box-caption')
			titleobj.empty();
			titleobj.html(title);			
		}else{
			var titleobj = $('#main-content .box-caption #title_expand');
			titleobj.empty();
			titleobj.html(title);
			/*
			var titleobj = $('<span class="title-block">'+title+'</span>');
			if($("#"+block+' .box-caption *').size()>1){
				titleobj.css('left','20px');
			}
			$('#'+block+' > .box-caption').append(titleobj);
			*/			
		}
		/*
		var titleobj = $('#main-content .title-block')
		if(titleobj.size() > 0){
			titleobj.empty();
			titleobj.html(title);
		}else{
			titleobj = $('<span class="title-block">'+title+'</span>');
			if($("#"+block+' .box-caption *').size()>1){
				titleobj.css('left','20px');
			}
			$('#'+block+' > .box-caption').append(titleobj);
		}
		*/
	}
	
	//needs work
	
	this.destroy = function(){
		$("#overview-body").empty();
		$("#overview-footer").remove();
        $("#main-content").css({left: '324px'});
	}
	
	this.destroyNav = function(){
		//console.log(new Date().getTime());
		//$("#navigation").remove();
		var el = document.getElementById("navigation");
		el.parentNode.removeChild(el);
		//console.log(new Date().getTime());
	}
	
	this.showLoader = function(){
		loader = $("<div class='loader-field'></div>");
		var field = $("<div class='loader-content'></div>");
		loader.append(field);
		$("#overview-body").append(loader);
	}

	this.hideLoader = function(){
		loader.remove();
	}
	
	this.attachButtons = function (buttons){
		var pos = null;
		if(arguments[1]){
			pos = arguments[1];
		}else{
			pos = "buttons-left";
		}
		for(pr in buttons){
			(function(pr){
				var button = $('<button class="button" id="'+buttons[pr].id+'">'+buttons[pr].label+'</button>');
				button.click(function(){
					buttons[pr].callback();
				});
				$("#"+pos).append(button);

			})(pr)
		}
	}

	
	this.setHeaderSelect = function(container,optionsSelect,callback){
		var opts;
		$.each(optionsSelect, function (i){
			var val = optionsSelect[i].value;
			var label = optionsSelect[i].label;
			opts+='<option value="'+val+'">'+label+'</option>';
		});	
		var select = $('<select class="header-select">'+opts+'</select>');
		headerContent = $("<div class='headerContent'></div>");
		headerContent.append(select);
		var header = $("#"+container).prev();
		header.append(headerContent);	
		select.change(function () {
			callback(select.val());
		});		
	}
	
	this.setHeaderExpand = function(container){
		var header = $("#"+container).prev();
		var collexp = $("<div class='expand-layout pointer expanded-grid'></div>"); 
		header.append(collexp);
		collexp.click(function () {
			if(collexp.hasClass("expanded-grid")){
				collexp.removeClass("expanded-grid");
				$('#comments_tiny_container').hide();
				$('#assignment_garade_container').css('width','100%');
				$('#assignment_garade').css('width','100%');
				collexp.css('background','url(images/collapse.png) no-repeat');
				$("#overview-body").trigger('resizeMainCont');
				for(var i=0; i<self.elements.length ; i++){
					if(self.elements[i].refreshExpand){
						self.elements[i].refreshExpand(he);
					}
				}				
			}else{
				collexp.addClass("expanded-grid");
				$('#comments_tiny_container').show();
				$('#assignment_garade_container').css('width',parseInt($('#assignment_garade_container').css('width'))-270+'px');
				$('#assignment_garade').css('width',parseInt($('#assignment_garade_container').css('width'))+'px');
				collexp.css('background','url(images/expand.png) no-repeat');
				$("#overview-body").trigger('resizeMainCont');
				for(var i=0; i<self.elements.length ; i++){
					if(self.elements[i].refreshExpand){
						self.elements[i].refreshExpand(he);
					}
				}	
			}

		});
	}

    function setSearchArea(){
        var search = $('<form><input type="text"><input type="submit" value="'+dlang("butt_sea","Search")+'" class="button search-button" /></form>');

        $('#nav-header').append(search);

        $('#nav-header form').submit(function(){
            showSearchResult($('#nav-header input').val());
            return false;
        });
    }
/*
	function setCells(cell){
		if(cell.display_footer_right){
			//temp
			$("#main-content").append('<div id="overview-footer"><div id="buttons-left"></div><div id="buttons-right"></div></div>');
		}

		var currleft = 0;
		var currtop = 0;		
		var currtoprem=0;
		var overview = $("#overview-body");
		if(cell.cells_left){
			var navigation = $("#navigation");
			if(navigation.size()==0){
				navigation = $('<div id="navigation"><div class="box-caption"></div></div>');
			}
			$.each(cell.cells_left, function (i){
				navigation.append('<div id="'+cell.cells_left[i].id+'"></div>');
			});
			$('#page-wrap').append(navigation);
            setSearchArea();
		}else if($("#navigation").size()==0){
			$("#main-content").css({left:"16px"});
		}

		if(cell.display_footer_left){
			$("#navigation").append('<div id="details-footer"></div>');
		}

		$.each(cell.cells_right, function (j){		
			var subtrahendWidth = 0;
			var mainHeigth;
			$.each(cell.cells_right[j].cells, function (i){		
				if(cell.cells_right[j].cells[i].title){
					var title = '<div class="box-caption">'+cell.cells_right[j].cells[i].title+'</div>';
				}
				else{
					var title='';
				}
				var idr = cell.cells_right[j].cells[i].id;
				if((cell.cells_right[j].cells[i].width).indexOf('%')!=-1){		
					$.each(cell.cells_right[j].cells, function (m){
						var k = (cell.cells_right[j].cells[m].width).indexOf('%');
						if(cell.cells_right[j].cells[m].new_count && k==-1){
							subtrahendWidth+= parseInt(cell.cells_right[j].cells[m].width);
						}
					});
					var widthcont = parseInt(overview.css('width'));							
					var width = (cell.cells_right[j].cells[i].width) ? cell.cells_right[j].cells[i].width: '100%';
					var height = (cell.cells_right[j].cells[i].height) ? cell.cells_right[j].cells[i].height: '100%';
					width = (widthcont - subtrahendWidth)*parseInt(width)/100;
					mainHeigth = parseInt(height);		
				}
				else{		
					var width = cell.cells_right[j].cells[i].width;
					var height = (cell.cells_right[j].cells[i].height) ? cell.cells_right[j].cells[i].height: '100%';
				}
	
				if((cell.cells_right[j].cells[i].height).indexOf('%')!=-1){
					height = (parseInt(overview.css("height"))-currtop)*parseInt(cell.cells_right[j].cells[i].height)/100+"px";
				}
				var elementStyle = {
						"width" : width,
						"height" : height,
						"top" : currtop+'px',
						"left" : currleft+'px'
					   };   
				
				var newBlock = $('<div id="'+idr+'_container">'+title+'</div>');
				newBlock.css(elementStyle);
				overview.append(newBlock);
				var internalBlock = $('<div id="'+idr+'" class="internal_container"></div>');
	
				newBlock.append(internalBlock);
				
				var padding_left = internalBlock.css('padding-left');
				var padding_top = internalBlock.css('padding-top');
				mainHeigth+=parseInt(padding_top)+1;
								
				if(cell.cells_right[j].cells[i].border_right){
					internalBlock.addClass('block-border-right');
					var v = parseInt(internalBlock.css('width'));
					internalBlock.css('width',(v-1)+'px');
				}
				if(cell.cells_right[j].cells[i].border_bottom){
					internalBlock.addClass('block-border-bottom');
				}					
				if(cell.cells_right[j].cells[i].title){
					var ht = parseInt(internalBlock.css("height"));
					internalBlock.css("height",(ht-23)+'px');
				} 
				if(cell.cells_right[j].cells[i+1]){
					if(cell.cells_right[j].cells[i+1].new_count && !cell.cells_right[j].cells[i].new_count){
						currtop = parseInt(currtoprem);
						currtoprem = 0;
					}
					if(cell.cells_right[j].cells[i+1].new_count){
						currleft+= parseInt(newBlock.css('width'));
					}else{
						if(currtoprem==0){	
							currtoprem = newBlock.css('top');
						}
						currtop+= parseInt(newBlock.css('height'));
					}
				}						
			});
			currtop+= mainHeigth;
			currleft = 0;
		});
	}
    */

    function setCells(cell){
        $("#overview-footer").remove();
        //if(cell.display_footer_right){
            $("#main-content").append('<div id="overview-footer"><div id="buttons-left"></div><div id="buttons-right"></div></div>');
        //}

        var currleft = 0;
        var currtop = 0;
        var currtoprem=0;
        var overview = $("#overview-body");
        if(cell.cells_left){
            var navigation = $("#navigation");
            if(navigation.size()==0){
                navigation = $('<div id="navigation"><div class="box-caption"></div></div>');
            }
            $.each(cell.cells_left, function (i){
                navigation.append('<div id="'+cell.cells_left[i].id+'"></div>');
            });
            $('#page-wrap').append(navigation);
            setSearchArea();
        }else if($("#navigation").size()==0){
            $("#main-content").css({left:"16px"});
        }

        if(cell.display_footer_left){
            $("#navigation").append('<div id="details-footer"></div>');
        }

        $.each(cell.cells_right, function (j){
            var subtrahendWidth = 0;
            var mainHeigth;
            $.each(cell.cells_right[j].cells, function (i){
                if(cell.cells_right[j].cells[i].title){
                    var title = '<div class="box-caption">'+cell.cells_right[j].cells[i].title+'</div>';
                }
                else{
                    var title='';
                }
                var idr = cell.cells_right[j].cells[i].id;
                if((cell.cells_right[j].cells[i].width).indexOf('%')!=-1){
                    $.each(cell.cells_right[j].cells, function (m){
                        var k = (cell.cells_right[j].cells[m].width).indexOf('%');
                        if(cell.cells_right[j].cells[m].new_count && k==-1){
                            subtrahendWidth+= parseInt(cell.cells_right[j].cells[m].width);
                        }
                    });
                    var widthcont = parseInt(overview.css('width'));
                    var width = (cell.cells_right[j].cells[i].width) ? cell.cells_right[j].cells[i].width: '100%';
                    var height = (cell.cells_right[j].cells[i].height) ? cell.cells_right[j].cells[i].height: '100%';
                    width = (widthcont - subtrahendWidth)*parseInt(width)/100;
                    mainHeigth = parseInt(height);
                }
                else{
                    var width = cell.cells_right[j].cells[i].width;
                    var height = (cell.cells_right[j].cells[i].height) ? cell.cells_right[j].cells[i].height: '100%';
                }

                if((cell.cells_right[j].cells[i].height).indexOf('%')!=-1){
                    height = (parseInt(overview.css("height"))-currtop)*parseInt(cell.cells_right[j].cells[i].height)/100+"px";
                }
                var elementStyle = {
                    "width" : width,
                    "height" : height,
                    "top" : currtop+'px',
                    "left" : currleft+'px'
                };

                var newBlock = $('<div id="'+idr+'_container">'+title+'</div>');
                newBlock.css(elementStyle);
                overview.append(newBlock);
                var internalBlock = $('<div id="'+idr+'" class="internal_container"></div>');

                newBlock.append(internalBlock);

                var padding_left = internalBlock.css('padding-left');
                var padding_top = internalBlock.css('padding-top');
                mainHeigth+=parseInt(padding_top)+1;

                if(cell.cells_right[j].cells[i].border_right){
                    internalBlock.addClass('block-border-right');
                    var v = parseInt(internalBlock.css('width'));
                    internalBlock.css('width',(v-1)+'px');
                }
                if(cell.cells_right[j].cells[i].border_bottom){
                    internalBlock.addClass('block-border-bottom');
                }
                if(cell.cells_right[j].cells[i].title){
                    var ht = parseInt(internalBlock.css("height"));
                    internalBlock.css("height",(ht-23)+'px');
                }
                if(cell.cells_right[j].cells[i+1]){
                    if(cell.cells_right[j].cells[i+1].new_count && !cell.cells_right[j].cells[i].new_count){
                        currtop = parseInt(currtoprem);
                        currtoprem = 0;
                    }
                    if(cell.cells_right[j].cells[i+1].new_count){
                        currleft+= parseInt(newBlock.css('width'));
                    }else{
                        if(currtoprem==0){
                            currtoprem = newBlock.css('top');
                        }
                        currtop+= parseInt(newBlock.css('height'));
                    }
                }
            });
            currtop+= mainHeigth;
            currleft = 0;
        });
    }


	function hideNavigation() {
		if (he) {
			$("#navigation").hide();
			$("#hide-navigation").css("src","images/expand.png");
			$("#main-content").css("left","16px");
		}
		else {
			$("#navigation").show();
			$("#hide-navigation").css("src","images/collapse.png");
			$("#main-content").css("left","324px");
		}
		he = !he;
	}
	
	function hideElement() {
		if (he) {
			$("#navigation").css("details","none");
			$("#hide-details").css("src","../../images/collapse.png");
			$("#main-content").css("right","16px");
		}
		else {
			$("#navigation").css("details","block");
			$("#hide-details").css("src","../../images/expand.png");
			$("#main-content").css("right","324px");
		}
		he = !he;
	}
	
	function mainContentFullScreen() {
		if (he) {
			$("#navigation,#second-menu,#first-menu,#header").hide();
			$("#main-content").css({
				left:"16px",
				top:"6px"
			});
            $("#hide-navigation").addClass("expanded");
		}
		else {
			$("#navigation,#second-menu,#first-menu,#header").show();
			if($("#navigation").size()>0){
				$("#main-content").css({
					left:"324px",
					top:"93px"
				});
			}else{
				$("#main-content").css({
					top:"93px"
				});				
			}
            $("#hide-navigation").removeClass("expanded");
		}

		
		he = !he;
	}
	
	function resizeGrid() { return; }
	
	function resizeMainBoxBody() { return; }
	
	function refreshChild(cell){
		var overview = $("#overview-body");
		var currleft = 0;
		var currtop = 0;		
		var currtoprem=0;
		$.each(cell.cells_right, function (j){		
			var subtrahendWidth = 0;
			var mainHeigth;
			$.each(cell.cells_right[j].cells, function (i){
			var idr = cell.cells_right[j].cells[i].id;
							
			if((cell.cells_right[j].cells[i].width).indexOf('%')!=-1){		
				$.each(cell.cells_right[j].cells, function (m){
					
					var k = (cell.cells_right[j].cells[m].width).indexOf('%');
					if(cell.cells_right[j].cells[m].new_count && k==-1){
						var id = cell.cells_right[j].cells[m].id;
						if($("#"+id+'_container').css('display')!='none'){
							subtrahendWidth+= parseInt(cell.cells_right[j].cells[m].width);
						}
					}
				});
				var widthcont = parseInt(overview.css('width'));							
				var width = (cell.cells_right[j].cells[i].width) ? cell.cells_right[j].cells[i].width: '100%';
				var height = (cell.cells_right[j].cells[i].height) ? cell.cells_right[j].cells[i].height: '100%';
				width = (widthcont - subtrahendWidth)*parseInt(width)/100;
				mainHeigth = parseInt(height);		
			}
			else{		
				var width = cell.cells_right[j].cells[i].width;
				var height = (cell.cells_right[j].cells[i].height) ? cell.cells_right[j].cells[i].height: '100%';
			}

			if((cell.cells_right[j].cells[i].height).indexOf('%')!=-1){
				height = (parseInt(overview.css("height"))-currtop)*parseInt(cell.cells_right[j].cells[i].height)/100+"px";
			}
						
			var elementStyle = {
					"width" : width,
					"height" : height,
					"top" : currtop+'px',
					"left" : currleft+'px'
				   };
			
			var mainBlock = $("#"+idr+"_container");	   
			mainBlock.css(elementStyle);
			var internalContainer = $("#"+idr);
			internalContainer.css({
							"width" : "100%",
							"height" : "100%"
							});
			if(cell.cells_right[j].cells[i].border_right){
					var v = parseInt(internalContainer.css('width'));
					internalContainer.css('width',(v-1)+'px');
			}
		
			if(cell.cells_right[j].cells[i].title){
				var ht = parseInt(internalContainer.css("height"));
				internalContainer.css("height",(ht-23)+'px');
			} 
			if(cell.cells_right[j].cells[i+1]){
				if(cell.cells_right[j].cells[i+1].new_count && !cell.cells_right[j].cells[i].new_count){
					currtop = parseInt(currtoprem);
					currtoprem = 0;
				}
				if(cell.cells_right[j].cells[i+1].new_count){
					currleft+= parseInt(mainBlock.css('width'));
				}else{
					if(currtoprem==0){	
						currtoprem = mainBlock.css('top');
					}
					currtop+= parseInt(mainBlock.css('height'));
				}
			}							
		});
			currtop+= parseInt(mainHeigth);
			currleft = 0;
		});	
	}
	
	function init(){
		$('#overview-body').unbind();
		$('#hide-navigation').unbind();
		
		$("#overview-body").bind("resizeMainCont",function(){
			refreshChild(options.cellsBlock);
			for(var i=0; i<self.elements.length ; i++){
				if(self.elements[i].refresh){
					self.elements[i].refresh();
				}
			}
		});
		
		$(window).resize(function(){
			$("#overview-body").trigger('resizeMainCont');
		});
		
		setCells(options.cellsBlock);
		
		$('#hide-navigation').click(function () {;
			mainContentFullScreen();
			$("#overview-body").trigger('resizeMainCont');
            $("#overview-body").trigger('resizeMainCont');
		});
		$(document).keydown(function(e) {
		  if (e.keyCode == 27) {
			mainContentFullScreen();
			$("#overview-body").trigger('resizeMainCont');
		  }
		});
	};
	
	init();
};