var headHeight = 22; // header height (including borders 20+2)

function calcAccSizes(id, itemsCount, simple) {
	if (!simple) {
		var h = $(id).height();
		var h1 = $(id + " .i-body:first").children('.i-content').height();
		if (!$(id + " .i-body:first").hasClass('first-expanded')) h1 = 0;			
		h = h - h1 - itemsCount * headHeight;
		var i = 0;
		$(id + " .i-body:not(.i-first)").each(function() {
			if ($(this).hasClass('i-expanded')) i++;
		});					
		h = Math.floor(h / i);					
		$(id + " .i-expanded:not(.i-first)").height(h);
	} else {
		var h = $(id).height();								
		h = h - itemsCount * headHeight;
		var i = 0;
		$(id + " .i-body").each(function() {
			if ($(this).hasClass('i-expanded')) i++;
		});					
		h = Math.floor(h / i);					
		$(id + " .i-expanded").height(h);	
	}
}

function initAccordion(id, itemsCount, simple) {
			
	if (!simple) {
		// Checking for i-expanded class at page loading, and expanding these items
		// this part calculates heights of items and animate them
		var h = $(id).height();
		var h1 = $(id + " .i-body:first").children('.i-content').height();
		if (!$(id + " .i-body:first").hasClass('first-expanded')) h1 = 0;			
		h = h - h1 - itemsCount * headHeight; // items count * header height (including borders 20+2)
		var i = 0;
		$(id + " .i-body:not(.i-first)").each(function() {
			if ($(this).hasClass('i-expanded')) i++;
		});					
		h = Math.floor(h / i);
		$(id + " .i-expanded:not(.i-first)").height(h);
				
		$(id + " .i-head").click(function () {	
			var obj = $(this).next();					
			if (obj.hasClass('i-first')) {
				obj.toggleClass('first-expanded');
				$(this).children('.i-arrow').toggleClass('arrow-exp');
				$(this).children('.i-arrow').toggleClass('arrow-clp');
				obj.toggle();						
				// this part calculates heights of items and changes them
				calcAccSizes(id, itemsCount);				
				return;
			}					
			obj.toggleClass('i-expanded');
			$(this).children('.i-arrow').toggleClass('arrow-exp');
			$(this).children('.i-arrow').toggleClass('arrow-clp');					
			var h = $(id).height();
			var h1 = $(id + " .i-body:first").height();
			if (!$(id + " .i-body:first").hasClass('first-expanded')) h1 = 0;
			h = h - h1 - itemsCount * headHeight;				
			var i = 0;			
			$(id + " .i-body").each(function() {
				if ($(this).hasClass('i-expanded')) i++;
			});									
			h = Math.floor(h / i);					
			$(id + " .i-body:not(.i-first)").each(function() {
				if (!$(this).hasClass('i-expanded')) $(this).height(0);
			});					
			$(id + " .i-expanded").height(h);
		});
	} else {
		// in this part first item has the same behaviour as others
		var h = $(id).height();	
		h = h - itemsCount * headHeight; // items count * header height (including borders 20+2)
		var i = 0;
		$(id + " .i-body").each(function() {
			if ($(this).hasClass('i-expanded')) i++;
		});					
		h = Math.floor(h / i);
		$(id + " .i-expanded").height(h);
				
		$(id + " .i-head").click(function () {			
			var obj = $(this).next();				
			obj.toggleClass('i-expanded');
			$(this).children('.i-arrow').toggleClass('arrow-exp');
			$(this).children('.i-arrow').toggleClass('arrow-clp');				
			var h = $(id).height();		
			h = h - itemsCount * headHeight;				
			var i = 0;		
			$(id + " .i-body").each(function() {
				if ($(this).hasClass('i-expanded')) i++;
			});									
			h = Math.floor(h / i);					
			$(id + " .i-body").each(function() {
				if (!$(this).hasClass('i-expanded')) $(this).height(0);
			});					
			$(id + " .i-expanded").height(h);		
		});	
	}
}