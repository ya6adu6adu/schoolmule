var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.controls.accordeon = function(container,_options){
	var self = this;
	
	var defaults = {
		// an array of objects
		cells: [
					{
						id: "course_rooms",
						title: "Course rooms",
						content: "",
						expanded : true
					},
					{
						id: "item_2",
						title: "Accordeon item",
						content: ""
					},
					{
						id: "item_3",
						title: "Accordeon item",
						content: ""
					},
					{
						id: "item_4",
						title: "Accordeon item",
						content: ""
					}
			 ],
		simple: true,
		headHeight: 22
	};
	
	var options = $.extend(defaults,_options);
	
	this.toggleItem = function(id){
		$('#'+id).parent().prev().trigger('click');
	}

	this.refresh = function(){
		var selId = "#"+container;
		var itemsCount = options.cells.length;
		// Ivan: not the best idea to re-define such varuiables. Options should remains as options everywhere. Easier to understand the source of variable.
		var simple = options.simple;
		if (!simple) {
			var h = $(selId).height();
			var h1 = $(selId + " .i-body:first").children('.i-content').height();
			if (!$(selId + " .i-body:first").hasClass('first-expanded')) h1 = 0;			
			h = h - h1 - itemsCount * options.headHeight;
			var i = 0;
			$(selId + " .i-body:not(.i-first)").each(function() {
				if ($(this).hasClass('i-expanded')) i++;
			});					
			h = Math.floor(h / i);					
			$(selId + " .i-expanded:not(.i-first)").height(h);
		} else {
			var h = $(selId).height();								
			h = h - itemsCount * options.headHeight;
			var i = 0;
			$(selId + " .i-body").each(function() {
				if ($(this).hasClass('i-expanded')) i++;
			});					
			h = Math.floor(h / i);					
			$(selId + " .i-expanded").height(h);	
		}
	}
	
	function createAccordeonHtml(){
		var html='';

		$.each(options.cells, function (i){
			var expanded;
			var arrow;
            if(getCookie(options.cells[i].id)){
                options.cells[i].expanded = getCookie(options.cells[i].id)=="true"?true:false;
            }

			if(options.cells[i].expanded){
				expanded = "i-expanded";
				arrow = "";
			}else{
				expanded = "";
				arrow ="arrow-exp";
			}

			html+='\
                <div class="acc-item">\
                    <div class="i-head">\
                        <span class="i-title">'+options.cells[i].title+'</span>\
                        <div class="i-arrow ' +arrow+'"></div>\
                    </div>\
                    <div class="i-body ' +expanded+'">\
                        <div class="i-content" id="' +options.cells[i].id+'">\
                            <div id="' +options.cells[i].id+'_content'+'" style="margin:4px 4px;">'+options.cells[i].content+'</div>\
                        </div>\
                    </div>\
                </div>';
        });

        $('#'+container).append(html);
	}
	
	function initAccordeon(id, itemsCount, simple, headHeight) {
		var selId = '#'+id;
			
		$(selId + " .i-body").each(function() {
			var obj = $(this);			
			var h = $(selId).height();		
			h = h - itemsCount * headHeight;				
			var i = 0;		
			$(selId + " .i-body").each(function() {
				if ($(this).hasClass('i-expanded')) i++;
			});									
			h = Math.floor(h / i);					
			$(selId + " .i-body").each(function() {
			if (!$(this).hasClass('i-expanded')) $(this).height(0);
				});
							
			$(selId + " .i-expanded").height(h);
		})
			
		if (!simple) {
			// Checking for i-expanded class at page loading, and expanding these items
			// this part calculates heights of items and animate them
			var h = $(selId).height();
			var h1 = $(selId + " .i-body:first").children('.i-content').height();
			if (!$(selId + " .i-body:first").hasClass('first-expanded')) h1 = 0;			
			h = h - h1 - itemsCount * headHeight; // items count * header height (including borders 20+2)
			var i = 0;
			$(selId + " .i-body:not(.i-first)").each(function() {
				if ($(this).hasClass('i-expanded')) i++;
			});					
			h = Math.floor(h / i);
			$(selId + " .i-expanded:not(.i-first)").height(h);		
			$(selId + " .i-head").click(function () {
				var obj = $(this).next();

				if (obj.hasClass('i-first')) {
					obj.toggleClass('first-expanded');
					$(this).children('.i-arrow').toggleClass('arrow-exp');
					$(this).children('.i-arrow').toggleClass('arrow-clp');
					obj.toggle();						
					// this part calculates heights of items and changes them
					self.refresh();				
					return;
				}					
				obj.toggleClass('i-expanded');
				$(this).children('.i-arrow').toggleClass('arrow-exp');
				$(this).children('.i-arrow').toggleClass('arrow-clp');					
				var h = $(selId).height();
				var h1 = $(selId + " .i-body:first").height();
				if (!$(selId + " .i-body:first").hasClass('first-expanded')) h1 = 0;
				h = h - h1 - itemsCount * headHeight;				
				var i = 0;			
				$(selId + " .i-body").each(function() {
					if ($(this).hasClass('i-expanded')) i++;
				});									
				h = Math.floor(h / i);					
				$(selId + " .i-body:not(.i-first)").each(function() {
					if (!$(this).hasClass('i-expanded')) $(this).height(0);
				});					
				$(selId + " .i-expanded").height(h);
			});
		} else {
			// in this part first item has the same behaviour as others
			var h = $(selId).height();	
			h = h - itemsCount * headHeight; // items count * header height (including borders 20+2)
			var i = 0;
			$(selId + " .i-body").each(function() {
				if ($(this).hasClass('i-expanded')) i++;
			});					
			h = Math.floor(h / i);
			$(selId + " .i-expanded").height(h);
					
			$(selId + " .i-head").click(function () {
				var obj = $(this).next();
                if(obj.hasClass('i-expanded')){
                    setCookie(obj.find('.i-content').attr('id'),false);

                }else{
                    setCookie(obj.find('.i-content').attr('id'),true);
                }
				obj.toggleClass('i-expanded');
				$(this).children('.i-arrow').toggleClass('arrow-exp');
				$(this).children('.i-arrow').toggleClass('arrow-clp');				
				var h = $(selId).height();		
				h = h - itemsCount * headHeight;				
				var i = 0;		
				$(selId + " .i-body").each(function() {
					if ($(this).hasClass('i-expanded')) i++;
				});									
				h = Math.floor(h / i);					
				$(selId + " .i-body").each(function() {
					if (!$(this).hasClass('i-expanded')) $(this).height(0);
				});					
				$(selId + " .i-expanded").height(h);		
			});	
		}
	}
		
	function init(){
		createAccordeonHtml();
		initAccordeon(container, options.cells.length, options.simple, options.headHeight);
	};
	
	init();
};