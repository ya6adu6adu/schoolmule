var headHeight = 22; // header height (including borders 20+2)

function resizeAccordion(id, simple) {
	var itemsCount = $(id).children().length;
	if (!simple) {
		var h = $(id).height();
		var firstItem = $(id + " .acc-item:first");
		if (firstItem.hasClass('i-expanded')) {
			firstItem.children(".i-body").height(firstItem.children(".i-body").children('.i-content').height() + 2); // 2 - content paddings
		}
		else {
			firstItem.children(".i-body").height(0);
		}
		var h1 = firstItem.children(".i-body").height();
		h = h - h1 - itemsCount * headHeight;
		var expCount = 0;
		$(id + " .acc-item").each(function(i) {
			if (!(i==0)) {if ($(this).hasClass('i-expanded')) expCount++;}
		});
		var itemHeight = Math.floor(h / expCount);
		$(id + " .acc-item").each(function(i) {
			if (!(i==0)) {
				if ($(this).hasClass('i-expanded')) {
					$(this).find(".i-body").height(itemHeight);
				}
				else {
					$(this).find(".i-body").height(0);
				}
			}
		});
		if (expCount > 0) {
			var diff = h - (itemHeight * expCount);
			if (diff > 0) $('.i-expanded:last').find(".i-body").height(itemHeight + diff);
		}
	} else {
		var h = $(id).height();	
		h = h - itemsCount * headHeight;
		var expCount = 0;
		$(id + " .acc-item").each(function() {
			if ($(this).hasClass('i-expanded')) expCount++;
			$(this).find(".i-body").height(0);
		});
		var itemHeight = Math.floor(h / expCount);
		$(id + " .i-expanded").find(".i-body").height(itemHeight);
		if (expCount > 0) {
			var diff = h - (itemHeight * expCount);
			if (diff > 0) $('.i-expanded:last').find(".i-body").height(itemHeight + diff);
		}
	}
}

function initAccordion(id, simple) {
// By default first item has height of its content. If simple == true, all items are equal height.
	$(id + " .acc-item").each(function() {
		if ($(this).hasClass('i-expanded')) $(this).find('.i-arrow').addClass('arrow-exp');
	});
	if (!simple) {
		resizeAccordion(id);
		$(id + " .i-head").click(function () {
			$(this).parent().toggleClass('i-expanded');
			$(this).children('.i-arrow').toggleClass('arrow-exp');
			resizeAccordion(id);
		});
	} else {
		resizeAccordion(id, true);		
		$(id + " .i-head").click(function () {
			$(this).parent().toggleClass('i-expanded');
			$(this).children('.i-arrow').toggleClass('arrow-exp');
			resizeAccordion(id, true);
		});
	}
}