/**
 * jQuery.ScrollTo
 * Copyright (c) 2007-2009 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 5/25/2009
 *
 * @projectDescription Easy element scrolling using jQuery.
 * http://flesler.blogspot.com/2007/10/jqueryscrollto.html
 * Works with jQuery +1.2.6. Tested on FF 2/3, IE 6/7/8, Opera 9.5/6, Safari 3, Chrome 1 on WinXP.
 *
 * @author Ariel Flesler
 * @version 1.4.2
 *
 * @id jQuery.scrollTo
 * @id jQuery.fn.scrollTo
 * @param {String, Number, DOMElement, jQuery, Object} target Where to scroll the matched elements.
 *	  The different options for target are:
 *		- A number position (will be applied to all axes).
 *		- A string position ('44', '100px', '+=90', etc ) will be applied to all axes
 *		- A jQuery/DOM element ( logically, child of the element to scroll )
 *		- A string selector, that will be relative to the element to scroll ( 'li:eq(2)', etc )
 *		- A hash { top:x, left:y }, x and y can be any kind of number/string like above.
*		- A percentage of the container's dimension/s, for example: 50% to go to the middle.
 *		- The string 'max' for go-to-end.
 * @param {Number} duration The OVERALL length of the animation, this argument can be the settings object instead.
 * @param {Object,Function} settings Optional set of settings or the onAfter callback.
 *	 @option {String} axis Which axis must be scrolled, use 'x', 'y', 'xy' or 'yx'.
 *	 @option {Number} duration The OVERALL length of the animation.
 *	 @option {String} easing The easing method for the animation.
 *	 @option {Boolean} margin If true, the margin of the target element will be deducted from the final position.
 *	 @option {Object, Number} offset Add/deduct from the end position. One number for both axes or { top:x, left:y }.
 *	 @option {Object, Number} over Add/deduct the height/width multiplied by 'over', can be { top:x, left:y } when using both axes.
 *	 @option {Boolean} queue If true, and both axis are given, the 2nd axis will only be animated after the first one ends.
 *	 @option {Function} onAfter Function to be called after the scrolling ends.
 *	 @option {Function} onAfterFirst If queuing is activated, this function will be called after the first scrolling ends.
 * @return {jQuery} Returns the same jQuery object, for chaining.
 *
 * @desc Scroll to a fixed position
 * @example $('div').scrollTo( 340 );
 *
 * @desc Scroll relatively to the actual position
 * @example $('div').scrollTo( '+=340px', { axis:'y' } );
 *
 * @dec Scroll using a selector (relative to the scrolled element)
 * @example $('div').scrollTo( 'p.paragraph:eq(2)', 500, { easing:'swing', queue:true, axis:'xy' } );
 *
 * @ Scroll to a DOM element (same for jQuery object)
 * @example var second_child = document.getElementById('container').firstChild.nextSibling;
 *			$('#container').scrollTo( second_child, { duration:500, axis:'x', onAfter:function(){
 *				alert('scrolled!!');
 *			}});
 *
 * @desc Scroll on both axes, to different values
 * @example $('div').scrollTo( { top: 300, left:'+=200' }, { axis:'xy', offset:-20 } );
 */
;(function( $ ){

	var $scrollTo = $.scrollTo = function( target, duration, settings ){
		$(window).scrollTo( target, duration, settings );
	};

	$scrollTo.defaults = {
		axis:'xy',
		duration: parseFloat($.fn.jquery) >= 1.3 ? 0 : 1
	};

	// Returns the element that needs to be animated to scroll the window.
	// Kept for backwards compatibility (specially for localScroll & serialScroll)
	$scrollTo.window = function( scope ){
		return $(window)._scrollable();
	};

	// Hack, hack, hack :)
	// Returns the real elements to scroll (supports window/iframes, documents and regular nodes)
	$.fn._scrollable = function(){
		return this.map(function(){
			var elem = this,
				isWin = !elem.nodeName || $.inArray( elem.nodeName.toLowerCase(), ['iframe','#document','html','body'] ) != -1;

				if( !isWin )
					return elem;

			var doc = (elem.contentWindow || elem).document || elem.ownerDocument || elem;

			return $.browser.safari || doc.compatMode == 'BackCompat' ?
				doc.body :
				doc.documentElement;
		});
	};

	$.fn.scrollTo = function( target, duration, settings ){
		if( typeof duration == 'object' ){
			settings = duration;
			duration = 0;
		}
		if( typeof settings == 'function' )
			settings = { onAfter:settings };

		if( target == 'max' )
			target = 9e9;

		settings = $.extend( {}, $scrollTo.defaults, settings );
		// Speed is still recognized for backwards compatibility
		duration = duration || settings.speed || settings.duration;
		// Make sure the settings are given right
		settings.queue = settings.queue && settings.axis.length > 1;

		if( settings.queue )
			// Let's keep the overall duration
			duration /= 2;
		settings.offset = both( settings.offset );
		settings.over = both( settings.over );

		return this._scrollable().each(function(){
			var elem = this,
				$elem = $(elem),
				targ = target, toff, attr = {},
				win = $elem.is('html,body');

			switch( typeof targ ){
				// A number will pass the regex
				case 'number':
				case 'string':
					if( /^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(targ) ){
						targ = both( targ );
						// We are done
						break;
					}
					// Relative selector, no break!
					targ = $(targ,this);
				case 'object':
					// DOMElement / jQuery
					if( targ.is || targ.style )
						// Get the real position of the target
						toff = (targ = $(targ)).offset();
			}
			$.each( settings.axis.split(''), function( i, axis ){
				var Pos	= axis == 'x' ? 'Left' : 'Top',
					pos = Pos.toLowerCase(),
					key = 'scroll' + Pos,
					old = elem[key],
					max = $scrollTo.max(elem, axis);

				if( toff ){// jQuery / DOMElement
					attr[key] = toff[pos] + ( win ? 0 : old - $elem.offset()[pos] );

					// If it's a dom element, reduce the margin
					if( settings.margin ){
						attr[key] -= parseInt(targ.css('margin'+Pos)) || 0;
						attr[key] -= parseInt(targ.css('border'+Pos+'Width')) || 0;
					}

					attr[key] += settings.offset[pos] || 0;

					if( settings.over[pos] )
						// Scroll to a fraction of its width/height
						attr[key] += targ[axis=='x'?'width':'height']() * settings.over[pos];
				}else{
					var val = targ[pos];
					// Handle percentage values
					if(val){
					attr[key] = val.slice && val.slice(-1) == '%' ?
						parseFloat(val) / 100 * max
						: val;
					}
				}

				// Number or 'number'
				if( /^\d+$/.test(attr[key]) )
					// Check the limits
					attr[key] = attr[key] <= 0 ? 0 : Math.min( attr[key], max );

				// Queueing axes
				if( !i && settings.queue ){
					// Don't waste time animating, if there's no need.
					if( old != attr[key] )
						// Intermediate animation
						animate( settings.onAfterFirst );
					// Don't animate this axis again in the next iteration.
					delete attr[key];
				}
			});

			animate( settings.onAfter );

			function animate( callback ){
				$elem.animate( attr, duration, settings.easing, callback && function(){
					callback.call(this, target, settings);
				});
			};

		}).end();
	};

	// Max scrolling position, works on quirks mode
	// It only fails (not too badly) on IE, quirks mode.
	$scrollTo.max = function( elem, axis ){
		var Dim = axis == 'x' ? 'Width' : 'Height',
			scroll = 'scroll'+Dim;

		if( !$(elem).is('html,body') )
			return elem[scroll] - $(elem)[Dim.toLowerCase()]();

		var size = 'client' + Dim,
			html = elem.ownerDocument.documentElement,
			body = elem.ownerDocument.body;

		return Math.max( html[scroll], body[scroll] )
			 - Math.min( html[size]  , body[size]   );

	};

	function both( val ){
		return typeof val == 'object' ? val : { top:val, left:val };
	};

})( jQuery );
(function(factory){if(typeof define==="function"&&define.amd)define(["jquery"],factory);else factory(jQuery)})(function($){var d=[],doc=$(document),ua=navigator.userAgent.toLowerCase(),wndw=$(window),w=[];var browser={ieQuirks:null,msie:/msie/.test(ua)&&!/opera/.test(ua),opera:/opera/.test(ua)};browser.ie6=browser.msie&&/msie 6./.test(ua)&&typeof window["XMLHttpRequest"]!=="object";browser.ie7=browser.msie&&/msie 7.0/.test(ua);$.modal=function(data,options){return $.modal.impl.init(data,options)};
$.modal.close=function(){$.modal.impl.close()};$.modal.focus=function(pos){$.modal.impl.focus(pos)};$.modal.setContainerDimensions=function(){$.modal.impl.setContainerDimensions()};$.modal.setPosition=function(){$.modal.impl.setPosition()};$.modal.update=function(height,width){$.modal.impl.update(height,width)};$.fn.modal=function(options){return $.modal.impl.init(this,options)};$.modal.defaults={appendTo:"body",focus:true,opacity:50,overlayId:"simplemodal-overlay",overlayCss:{},containerId:"simplemodal-container",
containerCss:{},dataId:"simplemodal-data",dataCss:{},minHeight:null,minWidth:null,maxHeight:null,maxWidth:null,autoResize:false,autoPosition:true,zIndex:1E3,close:true,closeHTML:'<a class="modalCloseImg" title="Close"></a>',closeClass:"simplemodal-close",escClose:true,overlayClose:false,fixed:true,position:null,persist:false,modal:true,onOpen:null,onShow:null,onClose:null};$.modal.impl={d:{},init:function(data,options){var s=this;if(s.d.data)return false;browser.ieQuirks=browser.msie&&!$.support.boxModel;
s.o=$.extend({},$.modal.defaults,options);s.zIndex=s.o.zIndex;s.occb=false;if(typeof data==="object"){data=data instanceof $?data:$(data);s.d.placeholder=false;if(data.parent().parent().size()>0){data.before($("<span></span>").attr("id","simplemodal-placeholder").css({display:"none"}));s.d.placeholder=true;s.display=data.css("display");if(!s.o.persist)s.d.orig=data.clone(true)}}else if(typeof data==="string"||typeof data==="number")data=$("<div></div>").html(data);else{alert("SimpleModal Error: Unsupported data type: "+
typeof data);return s}s.create(data);data=null;s.open();if($.isFunction(s.o.onShow))s.o.onShow.apply(s,[s.d]);return s},create:function(data){var s=this;s.getDimensions();if(s.o.modal&&browser.ie6)s.d.iframe=$('<iframe src="javascript:false;"></iframe>').css($.extend(s.o.iframeCss,{display:"none",opacity:0,position:"fixed",height:w[0],width:w[1],zIndex:s.o.zIndex,top:0,left:0})).appendTo(s.o.appendTo);s.d.overlay=$("<div></div>").attr("id",s.o.overlayId).addClass("simplemodal-overlay").css($.extend(s.o.overlayCss,
{display:"none",opacity:s.o.opacity/100,height:s.o.modal?d[0]:0,width:s.o.modal?d[1]:0,position:"fixed",left:0,top:0,zIndex:s.o.zIndex+1})).appendTo(s.o.appendTo);s.d.container=$("<div></div>").attr("id",s.o.containerId).addClass("simplemodal-container").css($.extend({position:s.o.fixed?"fixed":"absolute"},s.o.containerCss,{display:"none",zIndex:s.o.zIndex+2})).append(s.o.close&&s.o.closeHTML?$(s.o.closeHTML).addClass(s.o.closeClass):"").appendTo(s.o.appendTo);s.d.wrap=$("<div></div>").attr("tabIndex",
-1).addClass("simplemodal-wrap").css({height:"100%",outline:0,width:"100%"}).appendTo(s.d.container);s.d.data=data.attr("id",data.attr("id")||s.o.dataId).addClass("simplemodal-data").css($.extend(s.o.dataCss,{display:"none"})).appendTo("body");data=null;s.setContainerDimensions();s.d.data.appendTo(s.d.wrap);if(browser.ie6||browser.ieQuirks)s.fixIE()},bindEvents:function(){var s=this;$("."+s.o.closeClass).bind("click.simplemodal",function(e){e.preventDefault();s.close()});if(s.o.modal&&s.o.close&&
s.o.overlayClose)s.d.overlay.bind("click.simplemodal",function(e){e.preventDefault();s.close()});doc.bind("keydown.simplemodal",function(e){if(s.o.modal&&e.keyCode===9)s.watchTab(e);else if(s.o.close&&s.o.escClose&&e.keyCode===27){e.preventDefault();s.close()}});wndw.bind("resize.simplemodal orientationchange.simplemodal",function(){s.getDimensions();s.o.autoResize?s.setContainerDimensions():s.o.autoPosition&&s.setPosition();if(browser.ie6||browser.ieQuirks)s.fixIE();else if(s.o.modal){s.d.iframe&&
s.d.iframe.css({height:w[0],width:w[1]});s.d.overlay.css({height:d[0],width:d[1]})}})},unbindEvents:function(){$("."+this.o.closeClass).unbind("click.simplemodal");doc.unbind("keydown.simplemodal");wndw.unbind(".simplemodal");this.d.overlay.unbind("click.simplemodal")},fixIE:function(){var s=this,p=s.o.position;$.each([s.d.iframe||null,!s.o.modal?null:s.d.overlay,s.d.container.css("position")==="fixed"?s.d.container:null],function(i,el){if(el){var bch="document.body.clientHeight",bcw="document.body.clientWidth",
bsh="document.body.scrollHeight",bsl="document.body.scrollLeft",bst="document.body.scrollTop",bsw="document.body.scrollWidth",ch="document.documentElement.clientHeight",cw="document.documentElement.clientWidth",sl="document.documentElement.scrollLeft",st="document.documentElement.scrollTop",s=el[0].style;s.position="absolute";if(i<2){s.removeExpression("height");s.removeExpression("width");s.setExpression("height",""+bsh+" > "+bch+" ? "+bsh+" : "+bch+' + "px"');s.setExpression("width",""+bsw+" > "+
bcw+" ? "+bsw+" : "+bcw+' + "px"')}else{var te,le;if(p&&p.constructor===Array){var top=p[0]?typeof p[0]==="number"?p[0].toString():p[0].replace(/px/,""):el.css("top").replace(/px/,"");te=top.indexOf("%")===-1?top+" + (t = "+st+" ? "+st+" : "+bst+') + "px"':parseInt(top.replace(/%/,""))+" * (("+ch+" || "+bch+") / 100) + (t = "+st+" ? "+st+" : "+bst+') + "px"';if(p[1]){var left=typeof p[1]==="number"?p[1].toString():p[1].replace(/px/,"");le=left.indexOf("%")===-1?left+" + (t = "+sl+" ? "+sl+" : "+bsl+
') + "px"':parseInt(left.replace(/%/,""))+" * (("+cw+" || "+bcw+") / 100) + (t = "+sl+" ? "+sl+" : "+bsl+') + "px"'}}else{te="("+ch+" || "+bch+") / 2 - (this.offsetHeight / 2) + (t = "+st+" ? "+st+" : "+bst+') + "px"';le="("+cw+" || "+bcw+") / 2 - (this.offsetWidth / 2) + (t = "+sl+" ? "+sl+" : "+bsl+') + "px"'}s.removeExpression("top");s.removeExpression("left");s.setExpression("top",te);s.setExpression("left",le)}}})},focus:function(pos){var s=this,p=pos&&$.inArray(pos,["first","last"])!==-1?pos:
"first";var input=$(":input:enabled:visible:"+p,s.d.wrap);setTimeout(function(){input.length>0?input.focus():s.d.wrap.focus()},10)},getDimensions:function(){var s=this,h=typeof window.innerHeight==="undefined"?wndw.height():window.innerHeight;d=[doc.height(),doc.width()];w=[h,wndw.width()]},getVal:function(v,d){return v?typeof v==="number"?v:v==="auto"?0:v.indexOf("%")>0?parseInt(v.replace(/%/,""))/100*(d==="h"?w[0]:w[1]):parseInt(v.replace(/px/,"")):null},update:function(height,width){var s=this;
if(!s.d.data)return false;s.d.origHeight=s.getVal(height,"h");s.d.origWidth=s.getVal(width,"w");s.d.data.hide();height&&s.d.container.css("height",height);width&&s.d.container.css("width",width);s.setContainerDimensions();s.d.data.show();s.o.focus&&s.focus();s.unbindEvents();s.bindEvents()},setContainerDimensions:function(){var s=this,badIE=browser.ie6||browser.ie7;var ch=s.d.origHeight?s.d.origHeight:browser.opera?s.d.container.height():s.getVal(badIE?s.d.container[0].currentStyle["height"]:s.d.container.css("height"),
"h"),cw=s.d.origWidth?s.d.origWidth:browser.opera?s.d.container.width():s.getVal(badIE?s.d.container[0].currentStyle["width"]:s.d.container.css("width"),"w"),dh=s.d.data.outerHeight(true),dw=s.d.data.outerWidth(true);s.d.origHeight=s.d.origHeight||ch;s.d.origWidth=s.d.origWidth||cw;var mxoh=s.o.maxHeight?s.getVal(s.o.maxHeight,"h"):null,mxow=s.o.maxWidth?s.getVal(s.o.maxWidth,"w"):null,mh=mxoh&&mxoh<w[0]?mxoh:w[0],mw=mxow&&mxow<w[1]?mxow:w[1];var moh=s.o.minHeight?s.getVal(s.o.minHeight,"h"):"auto";
if(!ch)if(!dh)ch=moh;else if(dh>mh)ch=mh;else if(s.o.minHeight&&moh!=="auto"&&dh<moh)ch=moh;else ch=dh;else ch=s.o.autoResize&&ch>mh?mh:ch<moh?moh:ch;var mow=s.o.minWidth?s.getVal(s.o.minWidth,"w"):"auto";if(!cw)if(!dw)cw=mow;else if(dw>mw)cw=mw;else if(s.o.minWidth&&mow!=="auto"&&dw<mow)cw=mow;else cw=dw;else cw=s.o.autoResize&&cw>mw?mw:cw<mow?mow:cw;s.d.container.css({height:ch,width:cw});s.d.wrap.css({overflow:dh>ch||dw>cw?"auto":"visible"});s.o.autoPosition&&s.setPosition()},setPosition:function(){var s=
this,top,left,hc=w[0]/2-s.d.container.outerHeight(true)/2,vc=w[1]/2-s.d.container.outerWidth(true)/2,st=s.d.container.css("position")!=="fixed"?wndw.scrollTop():0;if(s.o.position&&Object.prototype.toString.call(s.o.position)==="[object Array]"){top=st+(s.o.position[0]||hc);left=s.o.position[1]||vc}else{top=st+hc;left=vc}s.d.container.css({left:left,top:top})},watchTab:function(e){var s=this;if($(e.target).parents(".simplemodal-container").length>0){s.inputs=$(":input:enabled:visible:first, :input:enabled:visible:last",
s.d.data[0]);if(!e.shiftKey&&e.target===s.inputs[s.inputs.length-1]||e.shiftKey&&e.target===s.inputs[0]||s.inputs.length===0){e.preventDefault();var pos=e.shiftKey?"last":"first";s.focus(pos)}}else{e.preventDefault();s.focus()}},open:function(){var s=this;s.d.iframe&&s.d.iframe.show();if($.isFunction(s.o.onOpen))s.o.onOpen.apply(s,[s.d]);else{s.d.overlay.show();s.d.container.show();s.d.data.show()}s.o.focus&&s.focus();s.bindEvents()},close:function(){var s=this;if(!s.d.data)return false;s.unbindEvents();
if($.isFunction(s.o.onClose)&&!s.occb){s.occb=true;s.o.onClose.apply(s,[s.d])}else{if(s.d.placeholder){var ph=$("#simplemodal-placeholder");if(s.o.persist)ph.replaceWith(s.d.data.removeClass("simplemodal-data").css("display",s.display));else{s.d.data.hide().remove();ph.replaceWith(s.d.orig)}}else s.d.data.hide().remove();s.d.container.hide().remove();s.d.overlay.hide();s.d.iframe&&s.d.iframe.hide().remove();s.d.overlay.remove();s.d={}}}}});
/*!
 * jScrollPane - v2.0.0beta12 - 2012-09-27
 * http://jscrollpane.kelvinluck.com/
 *
 * Copyright (c) 2010 Kelvin Luck
 * Dual licensed under the MIT or GPL licenses.
 */

// Script: jScrollPane - cross browser customisable scrollbars
//
// *Version: 2.0.0beta12, Last updated: 2012-09-27*
//
// Project Home - http://jscrollpane.kelvinluck.com/
// GitHub       - http://github.com/vitch/jScrollPane
// Source       - http://github.com/vitch/jScrollPane/raw/master/script/jquery.jscrollpane.js
// (Minified)   - http://github.com/vitch/jScrollPane/raw/master/script/jquery.jscrollpane.min.js
//
// About: License
//
// Copyright (c) 2012 Kelvin Luck
// Dual licensed under the MIT or GPL Version 2 licenses.
// http://jscrollpane.kelvinluck.com/MIT-LICENSE.txt
// http://jscrollpane.kelvinluck.com/GPL-LICENSE.txt
//
// About: Examples
//
// All examples and demos are available through the jScrollPane example site at:
// http://jscrollpane.kelvinluck.com/
//
// About: Support and Testing
//
// This plugin is tested on the browsers below and has been found to work reliably on them. If you run
// into a problem on one of the supported browsers then please visit the support section on the jScrollPane
// website (http://jscrollpane.kelvinluck.com/) for more information on getting support. You are also
// welcome to fork the project on GitHub if you can contribute a fix for a given issue.
//
// jQuery Versions - tested in 1.4.2+ - reported to work in 1.3.x
// Browsers Tested - Firefox 3.6.8, Safari 5, Opera 10.6, Chrome 5.0, IE 6, 7, 8
//
// About: Release History
//
// 2.0.0beta12 - (2012-09-27) fix for jQuery 1.8+
// 2.0.0beta11 - (2012-05-14)
// 2.0.0beta10 - (2011-04-17) cleaner required size calculation, improved keyboard support, stickToBottom/Left, other small fixes
// 2.0.0beta9 - (2011-01-31) new API methods, bug fixes and correct keyboard support for FF/OSX
// 2.0.0beta8 - (2011-01-29) touchscreen support, improved keyboard support
// 2.0.0beta7 - (2011-01-23) scroll speed consistent (thanks Aivo Paas)
// 2.0.0beta6 - (2010-12-07) scrollToElement horizontal support
// 2.0.0beta5 - (2010-10-18) jQuery 1.4.3 support, various bug fixes
// 2.0.0beta4 - (2010-09-17) clickOnTrack support, bug fixes
// 2.0.0beta3 - (2010-08-27) Horizontal mousewheel, mwheelIntent, keyboard support, bug fixes
// 2.0.0beta2 - (2010-08-21) Bug fixes
// 2.0.0beta1 - (2010-08-17) Rewrite to follow modern best practices and enable horizontal scrolling, initially hidden
//							 elements and dynamically sized elements.
// 1.x - (2006-12-31 - 2010-07-31) Initial version, hosted at googlecode, deprecated

(function($,window,undefined){

    $.fn.jScrollPane = function(settings)
    {
        // JScrollPane "class" - public methods are available through $('selector').data('jsp')
        function JScrollPane(elem, s)
        {
            var settings, jsp = this, pane, paneWidth, paneHeight, container, contentWidth, contentHeight,
                percentInViewH, percentInViewV, isScrollableV, isScrollableH, verticalDrag, dragMaxY,
                verticalDragPosition, horizontalDrag, dragMaxX, horizontalDragPosition,
                verticalBar, verticalTrack, scrollbarWidth, verticalTrackHeight, verticalDragHeight, arrowUp, arrowDown,
                horizontalBar, horizontalTrack, horizontalTrackWidth, horizontalDragWidth, arrowLeft, arrowRight,
                reinitialiseInterval, originalPadding, originalPaddingTotalWidth, previousContentWidth,
                wasAtTop = true, wasAtLeft = true, wasAtBottom = false, wasAtRight = false,
                originalElement = elem.clone(false, false).empty(),
                mwEvent = $.fn.mwheelIntent ? 'mwheelIntent.jsp' : 'mousewheel.jsp';

            originalPadding = elem.css('paddingTop') + ' ' +
                elem.css('paddingRight') + ' ' +
                elem.css('paddingBottom') + ' ' +
                elem.css('paddingLeft');
            originalPaddingTotalWidth = (parseInt(elem.css('paddingLeft'), 10) || 0) +
                (parseInt(elem.css('paddingRight'), 10) || 0);

            function initialise(s)
            {

                var /*firstChild, lastChild, */isMaintainingPositon, lastContentX, lastContentY,
                    hasContainingSpaceChanged, originalScrollTop, originalScrollLeft,
                    maintainAtBottom = false, maintainAtRight = false;

                settings = s;

                if (pane === undefined) {
                    originalScrollTop = elem.scrollTop();
                    originalScrollLeft = elem.scrollLeft();

                    elem.css(
                        {
                            overflow: 'hidden',
                            padding: 0
                        }
                    );
                    // TODO: Deal with where width/ height is 0 as it probably means the element is hidden and we should
                    // come back to it later and check once it is unhidden...
                    paneWidth = elem.innerWidth() + originalPaddingTotalWidth;
                    paneHeight = elem.innerHeight();

                    elem.width(paneWidth);

                    pane = $('<div class="jspPane" />').css('padding', originalPadding).append(elem.children());
                    container = $('<div class="jspContainer" />')
                        .css({
                            'width': paneWidth + 'px',
                            'height': paneHeight + 'px'
                        }
                    ).append(pane).appendTo(elem);

                    /*
                     // Move any margins from the first and last children up to the container so they can still
                     // collapse with neighbouring elements as they would before jScrollPane
                     firstChild = pane.find(':first-child');
                     lastChild = pane.find(':last-child');
                     elem.css(
                     {
                     'margin-top': firstChild.css('margin-top'),
                     'margin-bottom': lastChild.css('margin-bottom')
                     }
                     );
                     firstChild.css('margin-top', 0);
                     lastChild.css('margin-bottom', 0);
                     */
                } else {
                    elem.css('width', '');

                    maintainAtBottom = settings.stickToBottom && isCloseToBottom();
                    maintainAtRight  = settings.stickToRight  && isCloseToRight();

                    hasContainingSpaceChanged = elem.innerWidth() + originalPaddingTotalWidth != paneWidth || elem.outerHeight() != paneHeight;

                    if (hasContainingSpaceChanged) {
                        paneWidth = elem.innerWidth() + originalPaddingTotalWidth;
                        paneHeight = elem.innerHeight();
                        container.css({
                            width: paneWidth + 'px',
                            height: paneHeight + 'px'
                        });
                    }

                    // If nothing changed since last check...
                    if (!hasContainingSpaceChanged && previousContentWidth == contentWidth && pane.outerHeight() == contentHeight) {
                        elem.width(paneWidth);
                        return;
                    }
                    previousContentWidth = contentWidth;

                    pane.css('width', '');
                    elem.width(paneWidth);

                    container.find('>.jspVerticalBar,>.jspHorizontalBar').remove().end();
                }

                pane.css('overflow', 'auto');
                if (s.contentWidth) {
                    contentWidth = s.contentWidth;
                } else {
                    contentWidth = pane[0].scrollWidth;
                }
                contentHeight = pane[0].scrollHeight;
                pane.css('overflow', '');

                percentInViewH = contentWidth / paneWidth;
                percentInViewV = contentHeight / paneHeight;
                isScrollableV = percentInViewV > 1;

                isScrollableH = percentInViewH > 1;

                //console.log(paneWidth, paneHeight, contentWidth, contentHeight, percentInViewH, percentInViewV, isScrollableH, isScrollableV);

                if (!(isScrollableH || isScrollableV)) {
                    elem.removeClass('jspScrollable');
                    pane.css({
                        top: 0,
                        width: container.width() - originalPaddingTotalWidth
                    });
                    removeMousewheel();
                    removeFocusHandler();
                    removeKeyboardNav();
                    removeClickOnTrack();
                } else {
                    elem.addClass('jspScrollable');

                    isMaintainingPositon = settings.maintainPosition && (verticalDragPosition || horizontalDragPosition);
                    if (isMaintainingPositon) {
                        lastContentX = contentPositionX();
                        lastContentY = contentPositionY();
                    }

                    initialiseVerticalScroll();
                    initialiseHorizontalScroll();
                    resizeScrollbars();

                    if (isMaintainingPositon) {
                        scrollToX(maintainAtRight  ? (contentWidth  - paneWidth ) : lastContentX, false);
                        scrollToY(maintainAtBottom ? (contentHeight - paneHeight) : lastContentY, false);
                    }

                    initFocusHandler();
                    initMousewheel();
                    initTouch();

                    if (settings.enableKeyboardNavigation) {
                        initKeyboardNav();
                    }
                    if (settings.clickOnTrack) {
                        initClickOnTrack();
                    }

                    observeHash();
                    if (settings.hijackInternalLinks) {
                        hijackInternalLinks();
                    }
                }

                if (settings.autoReinitialise && !reinitialiseInterval) {
                    reinitialiseInterval = setInterval(
                        function()
                        {
                            initialise(settings);
                        },
                        settings.autoReinitialiseDelay
                    );
                } else if (!settings.autoReinitialise && reinitialiseInterval) {
                    clearInterval(reinitialiseInterval);
                }

                originalScrollTop && elem.scrollTop(0) && scrollToY(originalScrollTop, false);
                originalScrollLeft && elem.scrollLeft(0) && scrollToX(originalScrollLeft, false);

                elem.trigger('jsp-initialised', [isScrollableH || isScrollableV]);
            }

            function initialiseVerticalScroll()
            {
                if (isScrollableV) {

                    container.append(
                        $('<div class="jspVerticalBar" />').append(
                            $('<div class="jspCap jspCapTop" />'),
                            $('<div class="jspTrack" />').append(
                                $('<div class="jspDrag" />').append(
                                    $('<div class="jspDragTop" />'),
                                    $('<div class="jspDragBottom" />')
                                )
                            ),
                            $('<div class="jspCap jspCapBottom" />')
                        )
                    );

                    verticalBar = container.find('>.jspVerticalBar');
                    verticalTrack = verticalBar.find('>.jspTrack');
                    verticalDrag = verticalTrack.find('>.jspDrag');

                    if (settings.showArrows) {
                        arrowUp = $('<a class="jspArrow jspArrowUp" />').bind(
                            'mousedown.jsp', getArrowScroll(0, -1)
                        ).bind('click.jsp', nil);
                        arrowDown = $('<a class="jspArrow jspArrowDown" />').bind(
                            'mousedown.jsp', getArrowScroll(0, 1)
                        ).bind('click.jsp', nil);
                        if (settings.arrowScrollOnHover) {
                            arrowUp.bind('mouseover.jsp', getArrowScroll(0, -1, arrowUp));
                            arrowDown.bind('mouseover.jsp', getArrowScroll(0, 1, arrowDown));
                        }

                        appendArrows(verticalTrack, settings.verticalArrowPositions, arrowUp, arrowDown);
                    }

                    verticalTrackHeight = paneHeight;
                    container.find('>.jspVerticalBar>.jspCap:visible,>.jspVerticalBar>.jspArrow').each(
                        function()
                        {
                            verticalTrackHeight -= $(this).outerHeight();
                        }
                    );


                    verticalDrag.hover(
                        function()
                        {
                            verticalDrag.addClass('jspHover');
                        },
                        function()
                        {
                            verticalDrag.removeClass('jspHover');
                        }
                    ).bind(
                        'mousedown.jsp',
                        function(e)
                        {
                            // Stop IE from allowing text selection
                            $('html').bind('dragstart.jsp selectstart.jsp', nil);

                            verticalDrag.addClass('jspActive');

                            var startY = e.pageY - verticalDrag.position().top;

                            $('html').bind(
                                'mousemove.jsp',
                                function(e)
                                {
                                    positionDragY(e.pageY - startY, false);
                                }
                            ).bind('mouseup.jsp mouseleave.jsp', cancelDrag);
                            return false;
                        }
                    );
                    sizeVerticalScrollbar();
                }
            }

            function sizeVerticalScrollbar()
            {
                verticalTrack.height(verticalTrackHeight + 'px');
                verticalDragPosition = 0;
                scrollbarWidth = settings.verticalGutter + verticalTrack.outerWidth();

                // Make the pane thinner to allow for the vertical scrollbar
                pane.width(paneWidth - scrollbarWidth - originalPaddingTotalWidth);

                // Add margin to the left of the pane if scrollbars are on that side (to position
                // the scrollbar on the left or right set it's left or right property in CSS)
                try {
                    if (verticalBar.position().left === 0) {
                        pane.css('margin-left', scrollbarWidth + 'px');
                    }
                } catch (err) {
                }
            }

            function initialiseHorizontalScroll()
            {
                if (isScrollableH) {

                    container.append(
                        $('<div class="jspHorizontalBar" />').append(
                            $('<div class="jspCap jspCapLeft" />'),
                            $('<div class="jspTrack" />').append(
                                $('<div class="jspDrag" />').append(
                                    $('<div class="jspDragLeft" />'),
                                    $('<div class="jspDragRight" />')
                                )
                            ),
                            $('<div class="jspCap jspCapRight" />')
                        )
                    );

                    horizontalBar = container.find('>.jspHorizontalBar');
                    horizontalTrack = horizontalBar.find('>.jspTrack');
                    horizontalDrag = horizontalTrack.find('>.jspDrag');

                    if (settings.showArrows) {
                        arrowLeft = $('<a class="jspArrow jspArrowLeft" />').bind(
                            'mousedown.jsp', getArrowScroll(-1, 0)
                        ).bind('click.jsp', nil);
                        arrowRight = $('<a class="jspArrow jspArrowRight" />').bind(
                            'mousedown.jsp', getArrowScroll(1, 0)
                        ).bind('click.jsp', nil);
                        if (settings.arrowScrollOnHover) {
                            arrowLeft.bind('mouseover.jsp', getArrowScroll(-1, 0, arrowLeft));
                            arrowRight.bind('mouseover.jsp', getArrowScroll(1, 0, arrowRight));
                        }
                        appendArrows(horizontalTrack, settings.horizontalArrowPositions, arrowLeft, arrowRight);
                    }

                    horizontalDrag.hover(
                        function()
                        {
                            horizontalDrag.addClass('jspHover');
                        },
                        function()
                        {
                            horizontalDrag.removeClass('jspHover');
                        }
                    ).bind(
                        'mousedown.jsp',
                        function(e)
                        {
                            // Stop IE from allowing text selection
                            $('html').bind('dragstart.jsp selectstart.jsp', nil);

                            horizontalDrag.addClass('jspActive');

                            var startX = e.pageX - horizontalDrag.position().left;

                            $('html').bind(
                                'mousemove.jsp',
                                function(e)
                                {
                                    positionDragX(e.pageX - startX, false);
                                }
                            ).bind('mouseup.jsp mouseleave.jsp', cancelDrag);
                            return false;
                        }
                    );
                    horizontalTrackWidth = container.innerWidth();
                    sizeHorizontalScrollbar();
                }
            }

            function sizeHorizontalScrollbar()
            {
                container.find('>.jspHorizontalBar>.jspCap:visible,>.jspHorizontalBar>.jspArrow').each(
                    function()
                    {
                        horizontalTrackWidth -= $(this).outerWidth();
                    }
                );

                horizontalTrack.width(horizontalTrackWidth + 'px');
                horizontalDragPosition = 0;
            }

            function resizeScrollbars()
            {
                if (isScrollableH && isScrollableV) {
                    var horizontalTrackHeight = horizontalTrack.outerHeight(),
                        verticalTrackWidth = verticalTrack.outerWidth();
                    verticalTrackHeight -= horizontalTrackHeight;
                    $(horizontalBar).find('>.jspCap:visible,>.jspArrow').each(
                        function()
                        {
                            horizontalTrackWidth += $(this).outerWidth();
                        }
                    );
                    horizontalTrackWidth -= verticalTrackWidth;
                    paneHeight -= verticalTrackWidth;
                    paneWidth -= horizontalTrackHeight;
                    horizontalTrack.parent().append(
                        $('<div class="jspCorner" />').css('width', horizontalTrackHeight + 'px')
                    );
                    sizeVerticalScrollbar();
                    sizeHorizontalScrollbar();
                }
                // reflow content
                if (isScrollableH) {
                    pane.width((container.outerWidth() - originalPaddingTotalWidth) + 'px');
                }
                contentHeight = pane.outerHeight();
                percentInViewV = contentHeight / paneHeight;

                if (isScrollableH) {
                    horizontalDragWidth = Math.ceil(1 / percentInViewH * horizontalTrackWidth);
                    if (horizontalDragWidth > settings.horizontalDragMaxWidth) {
                        horizontalDragWidth = settings.horizontalDragMaxWidth;
                    } else if (horizontalDragWidth < settings.horizontalDragMinWidth) {
                        horizontalDragWidth = settings.horizontalDragMinWidth;
                    }
                    horizontalDrag.width(horizontalDragWidth + 'px');
                    dragMaxX = horizontalTrackWidth - horizontalDragWidth;
                    _positionDragX(horizontalDragPosition); // To update the state for the arrow buttons
                }
                if (isScrollableV) {
                    verticalDragHeight = Math.ceil(1 / percentInViewV * verticalTrackHeight);
                    if (verticalDragHeight > settings.verticalDragMaxHeight) {
                        verticalDragHeight = settings.verticalDragMaxHeight;
                    } else if (verticalDragHeight < settings.verticalDragMinHeight) {
                        verticalDragHeight = settings.verticalDragMinHeight;
                    }
                    verticalDrag.height(verticalDragHeight + 'px');
                    dragMaxY = verticalTrackHeight - verticalDragHeight;
                    _positionDragY(verticalDragPosition); // To update the state for the arrow buttons
                }
            }

            function appendArrows(ele, p, a1, a2)
            {
                var p1 = "before", p2 = "after", aTemp;

                // Sniff for mac... Is there a better way to determine whether the arrows would naturally appear
                // at the top or the bottom of the bar?
                if (p == "os") {
                    p = /Mac/.test(navigator.platform) ? "after" : "split";
                }
                if (p == p1) {
                    p2 = p;
                } else if (p == p2) {
                    p1 = p;
                    aTemp = a1;
                    a1 = a2;
                    a2 = aTemp;
                }

                ele[p1](a1)[p2](a2);
            }

            function getArrowScroll(dirX, dirY, ele)
            {
                return function()
                {
                    arrowScroll(dirX, dirY, this, ele);
                    this.blur();
                    return false;
                };
            }

            function arrowScroll(dirX, dirY, arrow, ele)
            {
                arrow = $(arrow).addClass('jspActive');

                var eve,
                    scrollTimeout,
                    isFirst = true,
                    doScroll = function()
                    {
                        if (dirX !== 0) {
                            jsp.scrollByX(dirX * settings.arrowButtonSpeed);
                        }
                        if (dirY !== 0) {
                            jsp.scrollByY(dirY * settings.arrowButtonSpeed);
                        }
                        scrollTimeout = setTimeout(doScroll, isFirst ? settings.initialDelay : settings.arrowRepeatFreq);
                        isFirst = false;
                    };

                doScroll();

                eve = ele ? 'mouseout.jsp' : 'mouseup.jsp';
                ele = ele || $('html');
                ele.bind(
                    eve,
                    function()
                    {
                        arrow.removeClass('jspActive');
                        scrollTimeout && clearTimeout(scrollTimeout);
                        scrollTimeout = null;
                        ele.unbind(eve);
                    }
                );
            }

            function initClickOnTrack()
            {
                removeClickOnTrack();
                if (isScrollableV) {
                    verticalTrack.bind(
                        'mousedown.jsp',
                        function(e)
                        {
                            if (e.originalTarget === undefined || e.originalTarget == e.currentTarget) {
                                var clickedTrack = $(this),
                                    offset = clickedTrack.offset(),
                                    direction = e.pageY - offset.top - verticalDragPosition,
                                    scrollTimeout,
                                    isFirst = true,
                                    doScroll = function()
                                    {
                                        var offset = clickedTrack.offset(),
                                            pos = e.pageY - offset.top - verticalDragHeight / 2,
                                            contentDragY = paneHeight * settings.scrollPagePercent,
                                            dragY = dragMaxY * contentDragY / (contentHeight - paneHeight);
                                        if (direction < 0) {
                                            if (verticalDragPosition - dragY > pos) {
                                                jsp.scrollByY(-contentDragY);
                                            } else {
                                                positionDragY(pos);
                                            }
                                        } else if (direction > 0) {
                                            if (verticalDragPosition + dragY < pos) {
                                                jsp.scrollByY(contentDragY);
                                            } else {
                                                positionDragY(pos);
                                            }
                                        } else {
                                            cancelClick();
                                            return;
                                        }
                                        scrollTimeout = setTimeout(doScroll, isFirst ? settings.initialDelay : settings.trackClickRepeatFreq);
                                        isFirst = false;
                                    },
                                    cancelClick = function()
                                    {
                                        scrollTimeout && clearTimeout(scrollTimeout);
                                        scrollTimeout = null;
                                        $(document).unbind('mouseup.jsp', cancelClick);
                                    };
                                doScroll();
                                $(document).bind('mouseup.jsp', cancelClick);
                                return false;
                            }
                        }
                    );
                }

                if (isScrollableH) {
                    horizontalTrack.bind(
                        'mousedown.jsp',
                        function(e)
                        {
                            if (e.originalTarget === undefined || e.originalTarget == e.currentTarget) {
                                var clickedTrack = $(this),
                                    offset = clickedTrack.offset(),
                                    direction = e.pageX - offset.left - horizontalDragPosition,
                                    scrollTimeout,
                                    isFirst = true,
                                    doScroll = function()
                                    {
                                        var offset = clickedTrack.offset(),
                                            pos = e.pageX - offset.left - horizontalDragWidth / 2,
                                            contentDragX = paneWidth * settings.scrollPagePercent,
                                            dragX = dragMaxX * contentDragX / (contentWidth - paneWidth);
                                        if (direction < 0) {
                                            if (horizontalDragPosition - dragX > pos) {
                                                jsp.scrollByX(-contentDragX);
                                            } else {
                                                positionDragX(pos);
                                            }
                                        } else if (direction > 0) {
                                            if (horizontalDragPosition + dragX < pos) {
                                                jsp.scrollByX(contentDragX);
                                            } else {
                                                positionDragX(pos);
                                            }
                                        } else {
                                            cancelClick();
                                            return;
                                        }
                                        scrollTimeout = setTimeout(doScroll, isFirst ? settings.initialDelay : settings.trackClickRepeatFreq);
                                        isFirst = false;
                                    },
                                    cancelClick = function()
                                    {
                                        scrollTimeout && clearTimeout(scrollTimeout);
                                        scrollTimeout = null;
                                        $(document).unbind('mouseup.jsp', cancelClick);
                                    };
                                doScroll();
                                $(document).bind('mouseup.jsp', cancelClick);
                                return false;
                            }
                        }
                    );
                }
            }

            function removeClickOnTrack()
            {
                if (horizontalTrack) {
                    horizontalTrack.unbind('mousedown.jsp');
                }
                if (verticalTrack) {
                    verticalTrack.unbind('mousedown.jsp');
                }
            }

            function cancelDrag()
            {
                $('html').unbind('dragstart.jsp selectstart.jsp mousemove.jsp mouseup.jsp mouseleave.jsp');

                if (verticalDrag) {
                    verticalDrag.removeClass('jspActive');
                }
                if (horizontalDrag) {
                    horizontalDrag.removeClass('jspActive');
                }
            }

            function positionDragY(destY, animate)
            {
                if (!isScrollableV) {
                    return;
                }
                if (destY < 0) {
                    destY = 0;
                } else if (destY > dragMaxY) {
                    destY = dragMaxY;
                }

                // can't just check if(animate) because false is a valid value that could be passed in...
                if (animate === undefined) {
                    animate = settings.animateScroll;
                }
                if (animate) {
                    jsp.animate(verticalDrag, 'top', destY,	_positionDragY);
                } else {
                    verticalDrag.css('top', destY);
                    _positionDragY(destY);
                }

            }

            function _positionDragY(destY)
            {
                if (destY === undefined) {
                    destY = verticalDrag.position().top;
                }

                container.scrollTop(0);
                verticalDragPosition = destY;

                var isAtTop = verticalDragPosition === 0,
                    isAtBottom = verticalDragPosition == dragMaxY,
                    percentScrolled = destY/ dragMaxY,
                    destTop = -percentScrolled * (contentHeight - paneHeight);

                if (wasAtTop != isAtTop || wasAtBottom != isAtBottom) {
                    wasAtTop = isAtTop;
                    wasAtBottom = isAtBottom;
                    elem.trigger('jsp-arrow-change', [wasAtTop, wasAtBottom, wasAtLeft, wasAtRight]);
                }

                updateVerticalArrows(isAtTop, isAtBottom);
                pane.css('top', destTop);
                elem.trigger('jsp-scroll-y', [-destTop, isAtTop, isAtBottom]).trigger('scroll');
            }

            function positionDragX(destX, animate)
            {
                if (!isScrollableH) {
                    return;
                }
                if (destX < 0) {
                    destX = 0;
                } else if (destX > dragMaxX) {
                    destX = dragMaxX;
                }

                if (animate === undefined) {
                    animate = settings.animateScroll;
                }
                if (animate) {
                    jsp.animate(horizontalDrag, 'left', destX,	_positionDragX);
                } else {
                    horizontalDrag.css('left', destX);
                    _positionDragX(destX);
                }
            }

            function _positionDragX(destX)
            {
                if (destX === undefined) {
                    destX = horizontalDrag.position().left;
                }

                container.scrollTop(0);
                horizontalDragPosition = destX;

                var isAtLeft = horizontalDragPosition === 0,
                    isAtRight = horizontalDragPosition == dragMaxX,
                    percentScrolled = destX / dragMaxX,
                    destLeft = -percentScrolled * (contentWidth - paneWidth);

                if (wasAtLeft != isAtLeft || wasAtRight != isAtRight) {
                    wasAtLeft = isAtLeft;
                    wasAtRight = isAtRight;
                    elem.trigger('jsp-arrow-change', [wasAtTop, wasAtBottom, wasAtLeft, wasAtRight]);
                }

                updateHorizontalArrows(isAtLeft, isAtRight);
                pane.css('left', destLeft);
                elem.trigger('jsp-scroll-x', [-destLeft, isAtLeft, isAtRight]).trigger('scroll');
            }

            function updateVerticalArrows(isAtTop, isAtBottom)
            {
                if (settings.showArrows) {
                    arrowUp[isAtTop ? 'addClass' : 'removeClass']('jspDisabled');
                    arrowDown[isAtBottom ? 'addClass' : 'removeClass']('jspDisabled');
                }
            }

            function updateHorizontalArrows(isAtLeft, isAtRight)
            {
                if (settings.showArrows) {
                    arrowLeft[isAtLeft ? 'addClass' : 'removeClass']('jspDisabled');
                    arrowRight[isAtRight ? 'addClass' : 'removeClass']('jspDisabled');
                }
            }

            function scrollToY(destY, animate)
            {
                var percentScrolled = destY / (contentHeight - paneHeight);
                positionDragY(percentScrolled * dragMaxY, animate);
            }

            function scrollToX(destX, animate)
            {
                var percentScrolled = destX / (contentWidth - paneWidth);
                positionDragX(percentScrolled * dragMaxX, animate);
            }

            function enable(){
                settings.enabled = true;
            }

            function disable(){
                settings.enabled = false;
            }

            function scrollToElement(ele, stickToTop, animate)
            {
                var e, eleHeight, eleWidth, eleTop = 0, eleLeft = 0, viewportTop, viewportLeft, maxVisibleEleTop, maxVisibleEleLeft, destY, destX;

                // Legal hash values aren't necessarily legal jQuery selectors so we need to catch any
                // errors from the lookup...
                try {
                    e = $(ele);
                } catch (err) {
                    return;
                }
                eleHeight = e.outerHeight();
                eleWidth= e.outerWidth();

                container.scrollTop(0);
                container.scrollLeft(0);

                // loop through parents adding the offset top of any elements that are relatively positioned between
                // the focused element and the jspPane so we can get the true distance from the top
                // of the focused element to the top of the scrollpane...
                while (!e.is('.jspPane')) {
                    eleTop += e.position().top;
                    eleLeft += e.position().left;
                    e = e.offsetParent();
                    if (/^body|html$/i.test(e[0].nodeName)) {
                        // we ended up too high in the document structure. Quit!
                        return;
                    }
                }

                viewportTop = contentPositionY();
                maxVisibleEleTop = viewportTop + paneHeight;
                if (eleTop < viewportTop || stickToTop) { // element is above viewport
                    destY = eleTop - settings.verticalGutter + 50;
                } else if (eleTop + eleHeight > maxVisibleEleTop) { // element is below viewport
                    destY = eleTop - paneHeight + eleHeight + settings.verticalGutter;
                }
                if (destY) {
                    scrollToY(destY, animate);
                }

                viewportLeft = contentPositionX();
                maxVisibleEleLeft = viewportLeft + paneWidth;
                if (eleLeft < viewportLeft || stickToTop) { // element is to the left of viewport
                    destX = eleLeft - settings.horizontalGutter;
                } else if (eleLeft + eleWidth > maxVisibleEleLeft) { // element is to the right viewport
                    destX = eleLeft - paneWidth + eleWidth + settings.horizontalGutter;
                }
                if (destX) {
                    scrollToX(destX, animate);
                }

            }

            function contentPositionX()
            {
                return -pane.position().left;
            }

            function contentPositionY()
            {
                return -pane.position().top;
            }

            function isCloseToBottom()
            {
                var scrollableHeight = contentHeight - paneHeight;
                return (scrollableHeight > 20) && (scrollableHeight - contentPositionY() < 10);
            }

            function isCloseToRight()
            {
                var scrollableWidth = contentWidth - paneWidth;
                return (scrollableWidth > 20) && (scrollableWidth - contentPositionX() < 10);
            }

            function initMousewheel()
            {
                container.unbind(mwEvent).bind(
                    mwEvent,
                    function (event, delta, deltaX, deltaY) {
                        var dX = horizontalDragPosition, dY = verticalDragPosition;
                        jsp.scrollBy(deltaX * settings.mouseWheelSpeed, -deltaY * settings.mouseWheelSpeed, false);
                        // return true if there was no movement so rest of screen can scroll
                        return dX == horizontalDragPosition && dY == verticalDragPosition;
                    }
                );
            }

            function removeMousewheel()
            {
                container.unbind(mwEvent);
            }

            function nil()
            {
                return false;
            }

            function initFocusHandler()
            {
                pane.find(':input,a').unbind('focus.jsp').bind(
                    'focus.jsp',
                    function(e)
                    {
                        scrollToElement(e.target, false);
                    }
                );
            }

            function removeFocusHandler()
            {
                pane.find(':input,a').unbind('focus.jsp');
            }

            function initKeyboardNav()
            {
                var keyDown, elementHasScrolled, validParents = [];
                isScrollableH && validParents.push(horizontalBar[0]);
                isScrollableV && validParents.push(verticalBar[0]);

                // IE also focuses elements that don't have tabindex set.
                pane.focus(
                    function()
                    {
                        elem.focus();
                    }
                );

                elem.attr('tabindex', 0)
                    .unbind('keydown.jsp keypress.jsp')
                    .bind(
                    'keydown.jsp',
                    function(e)
                    {
                        if (e.target !== this && !(validParents.length && $(e.target).closest(validParents).length)){
                            return;
                        }
                        var dX = horizontalDragPosition, dY = verticalDragPosition;
                        switch(e.keyCode) {
                            case 40: // down
                            case 38: // up
                            case 34: // page down
                            case 32: // space
                            case 33: // page up
                            case 39: // right
                            case 37: // left
                                keyDown = e.keyCode;
                                keyDownHandler();
                                break;
                            case 35: // end
                                scrollToY(contentHeight - paneHeight);
                                keyDown = null;
                                break;
                            case 36: // home
                                scrollToY(0);
                                keyDown = null;
                                break;
                        }

                        elementHasScrolled = e.keyCode == keyDown && dX != horizontalDragPosition || dY != verticalDragPosition;
                        return !elementHasScrolled;
                    }
                ).bind(
                    'keypress.jsp', // For FF/ OSX so that we can cancel the repeat key presses if the JSP scrolls...
                    function(e)
                    {
                        if (e.keyCode == keyDown) {
                            keyDownHandler();
                        }
                        return !elementHasScrolled;
                    }
                );

                if (settings.hideFocus) {
                    elem.css('outline', 'none');
                    if ('hideFocus' in container[0]){
                        elem.attr('hideFocus', true);
                    }
                } else {
                    elem.css('outline', '');
                    if ('hideFocus' in container[0]){
                        elem.attr('hideFocus', false);
                    }
                }

                function keyDownHandler()
                {
                    var dX = horizontalDragPosition, dY = verticalDragPosition;
                    switch(keyDown) {
                        case 40: // down
                            jsp.scrollByY(settings.keyboardSpeed, false);
                            break;
                        case 38: // up
                            jsp.scrollByY(-settings.keyboardSpeed, false);
                            break;
                        case 34: // page down
                        case 32: // space
                            jsp.scrollByY(paneHeight * settings.scrollPagePercent, false);
                            break;
                        case 33: // page up
                            jsp.scrollByY(-paneHeight * settings.scrollPagePercent, false);
                            break;
                        case 39: // right
                            jsp.scrollByX(settings.keyboardSpeed, false);
                            break;
                        case 37: // left
                            jsp.scrollByX(-settings.keyboardSpeed, false);
                            break;
                    }

                    elementHasScrolled = dX != horizontalDragPosition || dY != verticalDragPosition;
                    return elementHasScrolled;
                }
            }

            function removeKeyboardNav()
            {
                elem.attr('tabindex', '-1')
                    .removeAttr('tabindex')
                    .unbind('keydown.jsp keypress.jsp');
            }

            function observeHash()
            {
                if (location.hash && location.hash.length > 1) {
                    var e,
                        retryInt,
                        hash = escape(location.hash.substr(1)) // hash must be escaped to prevent XSS
                        ;
                    try {
                        e = $('#' + hash + ', a[name="' + hash + '"]');
                    } catch (err) {
                        return;
                    }

                    if (e.length && pane.find(hash)) {
                        // nasty workaround but it appears to take a little while before the hash has done its thing
                        // to the rendered page so we just wait until the container's scrollTop has been messed up.
                        if (container.scrollTop() === 0) {
                            retryInt = setInterval(
                                function()
                                {
                                    if (container.scrollTop() > 0) {
                                        scrollToElement(e, true);
                                        $(document).scrollTop(container.position().top);
                                        clearInterval(retryInt);
                                    }
                                },
                                50
                            );
                        } else {
                            scrollToElement(e, true);
                            $(document).scrollTop(container.position().top);
                        }
                    }
                }
            }

            function hijackInternalLinks()
            {
                // only register the link handler once
                if ($(document.body).data('jspHijack')) {
                    return;
                }

                // remember that the handler was bound
                $(document.body).data('jspHijack', true);

                // use live handler to also capture newly created links
                $(document.body).delegate('a[href*=#]', 'click', function(event) {
                    // does the link point to the same page?
                    // this also takes care of cases with a <base>-Tag or Links not starting with the hash #
                    // e.g. <a href="index.html#test"> when the current url already is index.html
                    var href = this.href.substr(0, this.href.indexOf('#')),
                        locationHref = location.href,
                        hash,
                        element,
                        container,
                        jsp,
                        scrollTop,
                        elementTop;
                    if (location.href.indexOf('#') !== -1) {
                        locationHref = location.href.substr(0, location.href.indexOf('#'));
                    }
                    if (href !== locationHref) {
                        // the link points to another page
                        return;
                    }

                    // check if jScrollPane should handle this click event
                    hash = escape(this.href.substr(this.href.indexOf('#') + 1));

                    // find the element on the page
                    element;
                    try {
                        element = $('#' + hash + ', a[name="' + hash + '"]');
                    } catch (e) {
                        // hash is not a valid jQuery identifier
                        return;
                    }

                    if (!element.length) {
                        // this link does not point to an element on this page
                        return;
                    }

                    container = element.closest('.jspScrollable');
                    jsp = container.data('jsp');

                    // jsp might be another jsp instance than the one, that bound this event
                    // remember: this event is only bound once for all instances.
                    jsp.scrollToElement(element, true);

                    if (container[0].scrollIntoView) {
                        // also scroll to the top of the container (if it is not visible)
                        scrollTop = $(window).scrollTop();
                        elementTop = element.offset().top;
                        if (elementTop < scrollTop || elementTop > scrollTop + $(window).height()) {
                            container[0].scrollIntoView();
                        }
                    }

                    // jsp handled this event, prevent the browser default (scrolling :P)
                    event.preventDefault();
                });
            }

            // Init touch on iPad, iPhone, iPod, Android
            function initTouch()
            {
                var startX,
                    startY,
                    touchStartX,
                    touchStartY,
                    moved,
                    moving = false;

                container.unbind('touchstart.jsp touchmove.jsp touchend.jsp click.jsp-touchclick').bind(
                    'touchstart.jsp',
                    function(e)
                    {
                        var touch = e.originalEvent.touches[0];
                        startX = contentPositionX();
                        startY = contentPositionY();
                        touchStartX = touch.pageX;
                        touchStartY = touch.pageY;
                        moved = false;
                        moving = true;
                    }
                ).bind(
                    'touchmove.jsp',
                    function(ev)
                    {
                        if(!settings.enabled){ev.preventDefault();return true;}
                        if(!moving) {
                            return;
                        }

                        var touchPos = ev.originalEvent.touches[0],
                            dX = horizontalDragPosition, dY = verticalDragPosition;

                        jsp.scrollTo(startX + touchStartX - touchPos.pageX, startY + touchStartY - touchPos.pageY);

                        moved = moved || Math.abs(touchStartX - touchPos.pageX) > 5 || Math.abs(touchStartY - touchPos.pageY) > 5;

                        // return true if there was no movement so rest of screen can scroll
                        return dX == horizontalDragPosition && dY == verticalDragPosition;
                    }
                ).bind(
                    'touchend.jsp',
                    function(e)
                    {
                        moving = false;
                        /*if(moved) {
                         return false;
                         }*/
                    }
                ).bind(
                    'click.jsp-touchclick',
                    function(e)
                    {
                        if(moved) {
                            moved = false;
                            return false;
                        }
                    }
                );
            }

            function destroy(){
                var currentY = contentPositionY(),
                    currentX = contentPositionX();
                elem.removeClass('jspScrollable').unbind('.jsp');
                elem.replaceWith(originalElement.append(pane.children()));
                originalElement.scrollTop(currentY);
                originalElement.scrollLeft(currentX);

                // clear reinitialize timer if active
                if (reinitialiseInterval) {
                    clearInterval(reinitialiseInterval);
                }
            }

            // Public API
            $.extend(
                jsp,
                {
                    // Reinitialises the scroll pane (if it's internal dimensions have changed since the last time it
                    // was initialised). The settings object which is passed in will override any settings from the
                    // previous time it was initialised - if you don't pass any settings then the ones from the previous
                    // initialisation will be used.
                    reinitialise: function(s)
                    {
                        s = $.extend({}, settings, s);
                        initialise(s);
                    },
                    // Scrolls the specified element (a jQuery object, DOM node or jQuery selector string) into view so
                    // that it can be seen within the viewport. If stickToTop is true then the element will appear at
                    // the top of the viewport, if it is false then the viewport will scroll as little as possible to
                    // show the element. You can also specify if you want animation to occur. If you don't provide this
                    // argument then the animateScroll value from the settings object is used instead.
                    scrollToElement: function(ele, stickToTop, animate)
                    {
                        scrollToElement(ele, stickToTop, animate);
                    },
                    // Scrolls the pane so that the specified co-ordinates within the content are at the top left
                    // of the viewport. animate is optional and if not passed then the value of animateScroll from
                    // the settings object this jScrollPane was initialised with is used.
                    scrollTo: function(destX, destY, animate)
                    {
                        scrollToX(destX, animate);
                        scrollToY(destY, animate);
                    },
                    // Scrolls the pane so that the specified co-ordinate within the content is at the left of the
                    // viewport. animate is optional and if not passed then the value of animateScroll from the settings
                    // object this jScrollPane was initialised with is used.
                    scrollToX: function(destX, animate)
                    {
                        scrollToX(destX, animate);
                    },
                    // Scrolls the pane so that the specified co-ordinate within the content is at the top of the
                    // viewport. animate is optional and if not passed then the value of animateScroll from the settings
                    // object this jScrollPane was initialised with is used.
                    scrollToY: function(destY, animate)
                    {
                        scrollToY(destY, animate);
                    },
                    // Scrolls the pane to the specified percentage of its maximum horizontal scroll position. animate
                    // is optional and if not passed then the value of animateScroll from the settings object this
                    // jScrollPane was initialised with is used.
                    scrollToPercentX: function(destPercentX, animate)
                    {
                        scrollToX(destPercentX * (contentWidth - paneWidth), animate);
                    },
                    // Scrolls the pane to the specified percentage of its maximum vertical scroll position. animate
                    // is optional and if not passed then the value of animateScroll from the settings object this
                    // jScrollPane was initialised with is used.
                    scrollToPercentY: function(destPercentY, animate)
                    {
                        scrollToY(destPercentY * (contentHeight - paneHeight), animate);
                    },
                    // Scrolls the pane by the specified amount of pixels. animate is optional and if not passed then
                    // the value of animateScroll from the settings object this jScrollPane was initialised with is used.
                    scrollBy: function(deltaX, deltaY, animate)
                    {
                        jsp.scrollByX(deltaX, animate);
                        jsp.scrollByY(deltaY, animate);
                    },
                    // Scrolls the pane by the specified amount of pixels. animate is optional and if not passed then
                    // the value of animateScroll from the settings object this jScrollPane was initialised with is used.
                    scrollByX: function(deltaX, animate)
                    {
                        var destX = contentPositionX() + Math[deltaX<0 ? 'floor' : 'ceil'](deltaX),
                            percentScrolled = destX / (contentWidth - paneWidth);
                        positionDragX(percentScrolled * dragMaxX, animate);
                    },
                    // Scrolls the pane by the specified amount of pixels. animate is optional and if not passed then
                    // the value of animateScroll from the settings object this jScrollPane was initialised with is used.
                    scrollByY: function(deltaY, animate)
                    {
                        var destY = contentPositionY() + Math[deltaY<0 ? 'floor' : 'ceil'](deltaY),
                            percentScrolled = destY / (contentHeight - paneHeight);
                        positionDragY(percentScrolled * dragMaxY, animate);
                    },
                    // Positions the horizontal drag at the specified x position (and updates the viewport to reflect
                    // this). animate is optional and if not passed then the value of animateScroll from the settings
                    // object this jScrollPane was initialised with is used.
                    positionDragX: function(x, animate)
                    {
                        positionDragX(x, animate);
                    },
                    // Positions the vertical drag at the specified y position (and updates the viewport to reflect
                    // this). animate is optional and if not passed then the value of animateScroll from the settings
                    // object this jScrollPane was initialised with is used.
                    positionDragY: function(y, animate)
                    {
                        positionDragY(y, animate);
                    },
                    // This method is called when jScrollPane is trying to animate to a new position. You can override
                    // it if you want to provide advanced animation functionality. It is passed the following arguments:
                    //  * ele          - the element whose position is being animated
                    //  * prop         - the property that is being animated
                    //  * value        - the value it's being animated to
                    //  * stepCallback - a function that you must execute each time you update the value of the property
                    // You can use the default implementation (below) as a starting point for your own implementation.
                    animate: function(ele, prop, value, stepCallback)
                    {
                        var params = {};
                        params[prop] = value;
                        ele.animate(
                            params,
                            {
                                'duration'	: settings.animateDuration,
                                'easing'	: settings.animateEase,
                                'queue'		: false,
                                'step'		: stepCallback
                            }
                        );
                    },
                    // Returns the current x position of the viewport with regards to the content pane.
                    getContentPositionX: function()
                    {
                        return contentPositionX();
                    },
                    // Returns the current y position of the viewport with regards to the content pane.
                    getContentPositionY: function()
                    {
                        return contentPositionY();
                    },
                    // Returns the width of the content within the scroll pane.
                    getContentWidth: function()
                    {
                        return contentWidth;
                    },
                    // Returns the height of the content within the scroll pane.
                    getContentHeight: function()
                    {
                        return contentHeight;
                    },
                    // Returns the horizontal position of the viewport within the pane content.
                    getPercentScrolledX: function()
                    {
                        return contentPositionX() / (contentWidth - paneWidth);
                    },
                    // Returns the vertical position of the viewport within the pane content.
                    getPercentScrolledY: function()
                    {
                        return contentPositionY() / (contentHeight - paneHeight);
                    },
                    // Returns whether or not this scrollpane has a horizontal scrollbar.
                    getIsScrollableH: function()
                    {
                        return isScrollableH;
                    },
                    // Returns whether or not this scrollpane has a vertical scrollbar.
                    getIsScrollableV: function()
                    {
                        return isScrollableV;
                    },
                    // Gets a reference to the content pane. It is important that you use this method if you want to
                    // edit the content of your jScrollPane as if you access the element directly then you may have some
                    // problems (as your original element has had additional elements for the scrollbars etc added into
                    // it).
                    getContentPane: function()
                    {
                        return pane;
                    },
                    // Scrolls this jScrollPane down as far as it can currently scroll. If animate isn't passed then the
                    // animateScroll value from settings is used instead.
                    scrollToBottom: function(animate)
                    {
                        positionDragY(dragMaxY, animate);
                    },
                    // Hijacks the links on the page which link to content inside the scrollpane. If you have changed
                    // the content of your page (e.g. via AJAX) and want to make sure any new anchor links to the
                    // contents of your scroll pane will work then call this function.
                    hijackInternalLinks: $.noop,
                    // Removes the jScrollPane and returns the page to the state it was in before jScrollPane was
                    // initialised.
                    destroy: function()
                    {
                        destroy();
                    },

                    disable: function(){
                        disable();
                    },

                    enable : function(){
                        enable();
                    }
                }
            );

            initialise(s);
        }

        // Pluginifying code...
        settings = $.extend({}, $.fn.jScrollPane.defaults, settings);

        // Apply default speed
        $.each(['mouseWheelSpeed', 'arrowButtonSpeed', 'trackClickSpeed', 'keyboardSpeed'], function() {
            settings[this] = settings[this] || settings.speed;
        });

        return this.each(
            function()
            {
                var elem = $(this), jspApi = elem.data('jsp');
                if (jspApi) {
                    jspApi.reinitialise(settings);
                } else {
                    $("script",elem).filter('[type="text/javascript"],:not([type])').remove();
                    jspApi = new JScrollPane(elem, settings);
                    elem.data('jsp', jspApi);
                }
            }
        );
    };

    $.fn.jScrollPane.defaults = {
        showArrows					: false,
        maintainPosition			: true,
        stickToBottom				: false,
        stickToRight				: false,
        clickOnTrack				: true,
        autoReinitialise			: false,
        autoReinitialiseDelay		: 500,
        verticalDragMinHeight		: 0,
        verticalDragMaxHeight		: 99999,
        horizontalDragMinWidth		: 0,
        horizontalDragMaxWidth		: 99999,
        contentWidth				: undefined,
        animateScroll				: false,
        animateDuration				: 300,
        animateEase					: 'linear',
        hijackInternalLinks			: false,
        verticalGutter				: 4,
        horizontalGutter			: 4,
        mouseWheelSpeed				: 0,
        arrowButtonSpeed			: 0,
        arrowRepeatFreq				: 50,
        arrowScrollOnHover			: false,
        trackClickSpeed				: 0,
        trackClickRepeatFreq		: 70,
        verticalArrowPositions		: 'split',
        horizontalArrowPositions	: 'split',
        enableKeyboardNavigation	: true,
        hideFocus					: false,
        keyboardSpeed				: 0,
        initialDelay                : 300,        // Delay before starting repeating
        speed						: 30,		// Default speed when others falsey
        scrollPagePercent			: .8,		// Percent of visible area scrolled when pageUp/Down or track area pressed
        enabled						: true
    };

})(jQuery,this);
/*!
 * jQuery Double Tap Plugin.
 * 
 * Copyright (c) 2010 Raul Sanchez (http://www.sanraul.com)
 * 
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */

(function($){
	// Determine if we on iPhone or iPad
	var isTouchDevice = (function(){try {return 'ontouchstart' in document.documentElement;} catch (e) {return false;} })();

	$.fn.doubletap = function(onDoubleTapCallback, onTapCallback, delay){
		var eventName, action;
		delay = delay == null? 500 : delay;
		eventName = isTouchDevice == true? 'touchend' : 'click';
		
		$(this).bind(eventName, function(event){
            event.preventDefault();

			var now = new Date().getTime();
			var lastTouch = $(this).data('lastTouch') || now + 1 /** the first time this will make delta a negative number */;
			var delta = now - lastTouch;
			clearTimeout(action);
			if(delta<delay && delta>0){
				//$(this).trigger('doubletap', [event]);
				if(onDoubleTapCallback != null && typeof onDoubleTapCallback == 'function'){
					onDoubleTapCallback(event);
				}
			}else{
				$(this).data('lastTouch', now);
				action = setTimeout(function(evt){
					if(onTapCallback != null && typeof onTapCallback == 'function'){
						onTapCallback(evt);
					}
					clearTimeout(action);   // clear the timeout
				}, delay, [event]);
			}
			$(this).data('lastTouch', now);
		});
	};
})(jQuery);
/**
 * JQuery TouchWipe
 * MIT Licensed.
 *
 * jQuery Plugin to obtain touch gestures from iPhone, iPod Touch and iPad, should also work with Android mobile phones (not tested yet!)
 * Common usage: wipe images (left and right to show the previous or next image)
 * 
 * @author Andreas Waltl, netCU Internetagentur (http://www.netcu.de)
 * @version 1.1.1 (9th December 2010) - fix bug (older IE's had problems)
 * @version 1.1 (1st September 2010) - support wipe up and wipe down
 * @version 1.0 (15th July 2010)
 */
(function($){$.fn.touchwipe=function(settings){var config={min_move_x:20,min_move_y:20,wipeLeft:function(){},wipeRight:function(){},wipeUp:function(){},wipeDown:function(){},preventDefaultEvents:true};if(settings)$.extend(config,settings);var _this=this;this.config=config;this.each(function(){var startX;var startY;var isMoving=false;function cancelTouch(){this.removeEventListener('touchmove',onTouchMove);startX=null;isMoving=false}function onTouchMove(e){if(_this.config.preventDefaultEvents){e.preventDefault()}if(isMoving){var x=e.touches[0].pageX;var y=e.touches[0].pageY;var dx=startX-x;var dy=startY-y;if(Math.abs(dx)>=config.min_move_x){cancelTouch();if(dx>0){config.wipeLeft()}else{config.wipeRight()}}else if(Math.abs(dy)>=config.min_move_y){cancelTouch();if(dy>0){config.wipeDown()}else{config.wipeUp()}}}}function onTouchStart(e){if(e.touches.length==1){startX=e.touches[0].pageX;startY=e.touches[0].pageY;isMoving=true;this.addEventListener('touchmove',onTouchMove,false)}}if('ontouchstart'in document.documentElement){this.addEventListener('touchstart',onTouchStart,false)}});return this}})(jQuery);
var __slice = Array.prototype.slice;
(function($) {
  var Sketch;
  $.fn.sketch = function() {
    var args, key, sketch;
    key = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (this.length > 1) {
      $.error('Sketch.js can only be called on one element at a time.');
    }
    sketch = this.data('sketch');
    if (typeof key === 'string' && sketch) {
      if (sketch[key]) {
        if (typeof sketch[key] === 'function') {
          return sketch[key].apply(sketch, args);
        } else if (args.length === 0) {
          return sketch[key];
        } else if (args.length === 1) {
          return sketch[key] = args[0];
        }
      } else {
        return $.error('Sketch.js did not recognize the given command.');
      }
    } else if (sketch) {
      return sketch;
    } else {
      this.data('sketch', new Sketch(this.get(0), key));
      return this;
    }
  };
  Sketch = (function() {
    function Sketch(el, opts) {
      this.el = el;
      this.canvas = $(el);
      this.context = el.getContext('2d');
      this.options = $.extend({
        toolLinks: true,
        defaultTool: 'marker',
        defaultColor: '#000000',
        defaultSize: 1
      }, opts);
      this.painting = false;
      this.enabled = true;
      this.color = this.options.defaultColor;
      this.size = this.options.defaultSize;
      this.tool = this.options.defaultTool;
      this.actions = [];
      this.action = [];
      this.bindcanvas = (eb.browser.msie && eb.browser.version < 9)?this.canvas.parent().parent():this.canvas;
      this.bindcanvas.bind('click mousedown mouseup mousemove mouseleave mouseout touchstart touchmove touchend touchcancel', this.onEvent);
      if (this.options.toolLinks) {
        $('body').delegate("a[href=\"#" + (this.canvas.attr('id')) + "\"]", 'click', function(e) {
          var $canvas, $this, key, sketch, _i, _len, _ref;
          $this = $(this);
          $canvas = $($this.attr('href'));
          sketch = $canvas.data('sketch');
          _ref = ['color', 'size', 'tool'];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            key = _ref[_i];
            if ($this.attr("data-" + key)) {
              sketch.set(key, $(this).attr("data-" + key));
            }
          }
          if ($(this).attr('data-download')) {
            sketch.download($(this).attr('data-download'));
          }
          return false;
        });
      }
    }
    Sketch.prototype.download = function(format) {
      var mime;
      format || (format = "png");
      if (format === "jpg") {
        format = "jpeg";
      }
      mime = "image/" + format;
      return window.open(this.el.toDataURL(mime));
    };
    Sketch.prototype.set = function(key, value) {
      this[key] = value;
      return this.canvas.trigger("sketch.change" + key, value);
    };
    Sketch.prototype.startPainting = function() {
      this.painting = true;
      return this.action = {
        tool: this.tool,
        color: this.color,
        size: parseFloat(this.size),
        events: []
      };
    };
    Sketch.prototype.stopPainting = function() {
      if (this.action) {
        this.actions.push(this.action);
      }
      
      if(this.painting && this.action && this.action.events && this.action.events.length>0)
      	$(this.el).trigger("onDrawingStopped",this);
      
      this.painting = false;
      this.action = null;
      return this.redraw();
    };
    Sketch.prototype.onEvent = function(e) {
        var target = (eb.browser.msie && eb.browser.version < 9)?$($($(this).children().get(0)).children(0).get(0)):$(this);

    	if(target.data('sketch').enabled){
	      if (e.originalEvent && e.originalEvent.targetTouches && e.originalEvent.targetTouches.length>0) {
	        e.pageX = e.originalEvent.targetTouches[0].pageX;
	        e.pageY = e.originalEvent.targetTouches[0].pageY;
	      }
	      $.sketch.tools[target.data('sketch').tool].onEvent.call(target.data('sketch'), e);
	      	e.preventDefault();
	      	return false;
	      }else{
	      	return true;
	      }
    };
    Sketch.prototype.redraw = function() {
      var sketch;
      //this.el.width = this.canvas.width(); // not nessecary in flexpaper
      this.context = this.el.getContext('2d');
      sketch = this;
      $.each(this.actions, function() {
        if (this.tool) {
          return $.sketch.tools[this.tool].draw.call(sketch, this);
        }
      });
      if (this.painting && this.action) {
        return $.sketch.tools[this.action.tool].draw.call(sketch, this.action);
      }
    };
    return Sketch;
  })();
  $.sketch = {
    tools: {}
  };
  $.sketch.tools.marker = {
    onEvent: function(e) {
      if(!this.enabled){return true;}
      switch (e.type) {
        case 'mousedown':
        case 'touchstart':
          this.startPainting();
          break;
        case 'mouseup':
        case 'mouseout':
        case 'mouseleave':
        case 'touchend':
        case 'touchcancel':
          this.stopPainting();
      }
      if (this.painting) {
        this.action.events.push({
          x: e.pageX - this.canvas.offset().left,
          y: e.pageY - this.canvas.offset().top,
          event: e.type
        });
        return this.redraw();
      }
    },
    draw: function(action) {
      var event, previous, _i, _len, _ref;
      this.context.lineJoin = "round";
      this.context.lineCap = "round";
      this.context.beginPath();
      this.context.moveTo(action.events[0].x, action.events[0].y);
      _ref = action.events;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        event = _ref[_i];
        this.context.lineTo(event.x, event.y);
        previous = event;
      }
      this.context.strokeStyle = action.color;
      this.context.lineWidth = action.size;
      return this.context.stroke();
    }
  };
  return $.sketch.tools.eraser = {
    onEvent: function(e) {
      return $.sketch.tools.marker.onEvent.call(this, e);
    },
    draw: function(action) {
      var oldcomposite;
      oldcomposite = this.context.globalCompositeOperation;
      this.context.globalCompositeOperation = "copy";
      action.color = "rgba(0,0,0,0)";
      $.sketch.tools.marker.draw.call(this, action);
      return this.context.globalCompositeOperation = oldcomposite;
    }
  };
})(jQuery);
/*!
 * jQuery corner plugin: simple corner rounding
 * Examples and documentation at: http://jquery.malsup.com/corner/
 * version 2.13 (19-FEB-2013)
 * Requires jQuery v1.3.2 or later
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * Authors: Dave Methvin and Mike Alsup
 */

/**
 *  corner() takes a single string argument:  $('#myDiv').corner("effect corners width")
 *
 *  effect:  name of the effect to apply, such as round, bevel, notch, bite, etc (default is round).
 *  corners: one or more of: top, bottom, tr, tl, br, or bl.  (default is all corners)
 *  width:   width of the effect; in the case of rounded corners this is the radius.
 *           specify this value using the px suffix such as 10px (yes, it must be pixels).
 */
;(function($) {

    var msie = /MSIE/.test(navigator.userAgent);

    var style = document.createElement('div').style,
        moz = style['MozBorderRadius'] !== undefined,
        webkit = style['WebkitBorderRadius'] !== undefined,
        radius = style['borderRadius'] !== undefined || style['BorderRadius'] !== undefined,
        mode = document.documentMode || 0,
        noBottomFold = msie && (!mode || mode < 8),

        expr = msie && (function() {
            var div = document.createElement('div');
            try { div.style.setExpression('width','0+0'); div.style.removeExpression('width'); }
            catch(e) { return false; }
            return true;
        })();

    $.support = $.support || {};
    $.support.borderRadius = moz || webkit || radius; // so you can do:  if (!$.support.borderRadius) $('#myDiv').corner();

    function sz(el, p) {
        return parseInt($.css(el,p),10)||0;
    }
    function hex2(s) {
        s = parseInt(s,10).toString(16);
        return ( s.length < 2 ) ? '0'+s : s;
    }
    function gpc(node) {
        while(node) {
            var v = $.css(node,'backgroundColor'), rgb;
            if (v && v != 'transparent' && v != 'rgba(0, 0, 0, 0)') {
                if (v.indexOf('rgb') >= 0) {
                    rgb = v.match(/\d+/g);
                    return '#'+ hex2(rgb[0]) + hex2(rgb[1]) + hex2(rgb[2]);
                }
                return v;
            }
            if (node.nodeName.toLowerCase() == 'html')
                break;
            node = node.parentNode; // keep walking if transparent
        }
        return '#ffffff';
    }

    function getWidth(fx, i, width) {
        switch(fx) {
            case 'round':  return Math.round(width*(1-Math.cos(Math.asin(i/width))));
            case 'cool':   return Math.round(width*(1+Math.cos(Math.asin(i/width))));
            case 'sharp':  return width-i;
            case 'bite':   return Math.round(width*(Math.cos(Math.asin((width-i-1)/width))));
            case 'slide':  return Math.round(width*(Math.atan2(i,width/i)));
            case 'jut':    return Math.round(width*(Math.atan2(width,(width-i-1))));
            case 'curl':   return Math.round(width*(Math.atan(i)));
            case 'tear':   return Math.round(width*(Math.cos(i)));
            case 'wicked': return Math.round(width*(Math.tan(i)));
            case 'long':   return Math.round(width*(Math.sqrt(i)));
            case 'sculpt': return Math.round(width*(Math.log((width-i-1),width)));
            case 'dogfold':
            case 'dog':    return (i&1) ? (i+1) : width;
            case 'dog2':   return (i&2) ? (i+1) : width;
            case 'dog3':   return (i&3) ? (i+1) : width;
            case 'fray':   return (i%2)*width;
            case 'notch':  return width;
            case 'bevelfold':
            case 'bevel':  return i+1;
            case 'steep':  return i/2 + 1;
            case 'invsteep':return (width-i)/2+1;
        }
    }

    $.fn.corner = function(options) {
        // in 1.3+ we can fix mistakes with the ready state
        if (this.length === 0) {
            if (!$.isReady && this.selector) {
                var s = this.selector, c = this.context;
                $(function() {
                    $(s,c).corner(options);
                });
            }
            return this;
        }

        return this.each(function(index){
            var $this = $(this),
            // meta values override options
                o = [$this.attr($.fn.corner.defaults.metaAttr) || '', options || ''].join(' ').toLowerCase(),
                keep = /keep/.test(o),                       // keep borders?
                cc = ((o.match(/cc:(#[0-9a-f]+)/)||[])[1]),  // corner color
                sc = ((o.match(/sc:(#[0-9a-f]+)/)||[])[1]),  // strip color
                width = parseInt((o.match(/(\d+)px/)||[])[1],10) || 10, // corner width
                re = /round|bevelfold|bevel|notch|bite|cool|sharp|slide|jut|curl|tear|fray|wicked|sculpt|long|dog3|dog2|dogfold|dog|invsteep|steep/,
                fx = ((o.match(re)||['round'])[0]),
                fold = /dogfold|bevelfold/.test(o),
                edges = { T:0, B:1 },
                opts = {
                    TL:  /top|tl|left/.test(o),       TR:  /top|tr|right/.test(o),
                    BL:  /bottom|bl|left/.test(o),    BR:  /bottom|br|right/.test(o)
                },
            // vars used in func later
                strip, pad, cssHeight, j, bot, d, ds, bw, i, w, e, c, common, $horz;

            if ( !opts.TL && !opts.TR && !opts.BL && !opts.BR )
                opts = { TL:1, TR:1, BL:1, BR:1 };

            // support native rounding
            if ($.fn.corner.defaults.useNative && fx == 'round' && (radius || moz || webkit) && !cc && !sc) {
                if (opts.TL)
                    $this.css(radius ? 'border-top-left-radius' : moz ? '-moz-border-radius-topleft' : '-webkit-border-top-left-radius', width + 'px');
                if (opts.TR)
                    $this.css(radius ? 'border-top-right-radius' : moz ? '-moz-border-radius-topright' : '-webkit-border-top-right-radius', width + 'px');
                if (opts.BL)
                    $this.css(radius ? 'border-bottom-left-radius' : moz ? '-moz-border-radius-bottomleft' : '-webkit-border-bottom-left-radius', width + 'px');
                if (opts.BR)
                    $this.css(radius ? 'border-bottom-right-radius' : moz ? '-moz-border-radius-bottomright' : '-webkit-border-bottom-right-radius', width + 'px');
                return;
            }

            strip = document.createElement('div');
            $(strip).css({
                overflow: 'hidden',
                height: '1px',
                minHeight: '1px',
                fontSize: '1px',
                backgroundColor: sc || 'transparent',
                borderStyle: 'solid'
            });

            pad = {
                T: parseInt($.css(this,'paddingTop'),10)||0,     R: parseInt($.css(this,'paddingRight'),10)||0,
                B: parseInt($.css(this,'paddingBottom'),10)||0,  L: parseInt($.css(this,'paddingLeft'),10)||0
            };

            if (typeof this.style.zoom !== undefined) this.style.zoom = 1; // force 'hasLayout' in IE
            if (!keep) this.style.border = 'none';
            strip.style.borderColor = cc || gpc(this.parentNode);
            cssHeight = $(this).outerHeight();

            for (j in edges) {
                bot = edges[j];
                // only add stips if needed
                if ((bot && (opts.BL || opts.BR)) || (!bot && (opts.TL || opts.TR))) {
                    strip.style.borderStyle = 'none '+(opts[j+'R']?'solid':'none')+' none '+(opts[j+'L']?'solid':'none');
                    d = document.createElement('div');
                    $(d).addClass('jquery-corner');
                    ds = d.style;

                    bot ? this.appendChild(d) : this.insertBefore(d, this.firstChild);

                    if (bot && cssHeight != 'auto') {
                        if ($.css(this,'position') == 'static')
                            this.style.position = 'relative';
                        ds.position = 'absolute';
                        ds.bottom = ds.left = ds.padding = ds.margin = '0';
                        if (expr)
                            ds.setExpression('width', 'this.parentNode.offsetWidth');
                        else
                            ds.width = '100%';
                    }
                    else if (!bot && msie) {
                        if ($.css(this,'position') == 'static')
                            this.style.position = 'relative';
                        ds.position = 'absolute';
                        ds.top = ds.left = ds.right = ds.padding = ds.margin = '0';

                        // fix ie6 problem when blocked element has a border width
                        if (expr) {
                            bw = sz(this,'borderLeftWidth') + sz(this,'borderRightWidth');
                            ds.setExpression('width', 'this.parentNode.offsetWidth - '+bw+'+ "px"');
                        }
                        else
                            ds.width = '100%';
                    }
                    else {
                        ds.position = 'relative';
                        ds.margin = !bot ? '-'+pad.T+'px -'+pad.R+'px '+(pad.T-width)+'px -'+pad.L+'px' :
                            (pad.B-width)+'px -'+pad.R+'px -'+pad.B+'px -'+pad.L+'px';
                    }

                    for (i=0; i < width; i++) {
                        w = Math.max(0,getWidth(fx,i, width));
                        e = strip.cloneNode(false);
                        e.style.borderWidth = '0 '+(opts[j+'R']?w:0)+'px 0 '+(opts[j+'L']?w:0)+'px';
                        bot ? d.appendChild(e) : d.insertBefore(e, d.firstChild);
                    }

                    if (fold && $.support.boxModel) {
                        if (bot && noBottomFold) continue;
                        for (c in opts) {
                            if (!opts[c]) continue;
                            if (bot && (c == 'TL' || c == 'TR')) continue;
                            if (!bot && (c == 'BL' || c == 'BR')) continue;

                            common = { position: 'absolute', border: 'none', margin: 0, padding: 0, overflow: 'hidden', backgroundColor: strip.style.borderColor };
                            $horz = $('<div/>').css(common).css({ width: width + 'px', height: '1px' });
                            switch(c) {
                                case 'TL': $horz.css({ bottom: 0, left: 0 }); break;
                                case 'TR': $horz.css({ bottom: 0, right: 0 }); break;
                                case 'BL': $horz.css({ top: 0, left: 0 }); break;
                                case 'BR': $horz.css({ top: 0, right: 0 }); break;
                            }
                            d.appendChild($horz[0]);

                            var $vert = $('<div/>').css(common).css({ top: 0, bottom: 0, width: '1px', height: width + 'px' });
                            switch(c) {
                                case 'TL': $vert.css({ left: width }); break;
                                case 'TR': $vert.css({ right: width }); break;
                                case 'BL': $vert.css({ left: width }); break;
                                case 'BR': $vert.css({ right: width }); break;
                            }
                            d.appendChild($vert[0]);
                        }
                    }
                }
            }
        });
    };

    $.fn.uncorner = function() {
        if (radius || moz || webkit)
            this.css(radius ? 'border-radius' : moz ? '-moz-border-radius' : '-webkit-border-radius', 0);
        $('div.jquery-corner', this).remove();
        return this;
    };

// expose options
    $.fn.corner.defaults = {
        useNative: true, // true if plugin should attempt to use native browser support for border radius rounding
        metaAttr:  'data-corner' // name of meta attribute to use for options
    };

})(jQuery);
/*
 * jQuery UI Touch Punch 0.2.2
 *
 * Copyright 2011, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */
(function(b){b.support.touch="ontouchend" in document;if(!b.support.touch){return;}var c=b.ui.mouse.prototype,e=c._mouseInit,a;function d(g,h){if(g.originalEvent.touches.length>1){return;}g.preventDefault();var i=g.originalEvent.changedTouches[0],f=document.createEvent("MouseEvents");f.initMouseEvent(h,true,true,window,1,i.screenX,i.screenY,i.clientX,i.clientY,false,false,false,false,0,null);g.target.dispatchEvent(f);}c._touchStart=function(g){var f=this;if(a||!f._mouseCapture(g.originalEvent.changedTouches[0])){return;}a=true;f._touchMoved=false;d(g,"mouseover");d(g,"mousemove");d(g,"mousedown");};c._touchMove=function(f){if(!a){return;}this._touchMoved=true;d(f,"mousemove");};c._touchEnd=function(f){if(!a){return;}d(f,"mouseup");d(f,"mouseout");if(!this._touchMoved){d(f,"click");}a=false;};c._mouseInit=function(){var f=this;f.element.bind("touchstart",b.proxy(f,"_touchStart")).bind("touchmove",b.proxy(f,"_touchMove")).bind("touchend",b.proxy(f,"_touchEnd"));e.call(f);};})(jQuery);
//fgnass.github.com/spin.js#v1.2.5
(function(a,b,c){function g(a,c){var d=b.createElement(a||"div"),e;for(e in c)d[e]=c[e];return d}function h(a){for(var b=1,c=arguments.length;b<c;b++)a.appendChild(arguments[b]);return a}function j(a,b,c,d){var g=["opacity",b,~~(a*100),c,d].join("-"),h=.01+c/d*100,j=Math.max(1-(1-a)/b*(100-h),a),k=f.substring(0,f.indexOf("Animation")).toLowerCase(),l=k&&"-"+k+"-"||"";return e[g]||(i.insertRule("@"+l+"keyframes "+g+"{"+"0%{opacity:"+j+"}"+h+"%{opacity:"+a+"}"+(h+.01)+"%{opacity:1}"+(h+b)%100+"%{opacity:"+a+"}"+"100%{opacity:"+j+"}"+"}",0),e[g]=1),g}function k(a,b){var e=a.style,f,g;if(e[b]!==c)return b;b=b.charAt(0).toUpperCase()+b.slice(1);for(g=0;g<d.length;g++){f=d[g]+b;if(e[f]!==c)return f}}function l(a,b){for(var c in b)a.style[k(a,c)||c]=b[c];return a}function m(a){for(var b=1;b<arguments.length;b++){var d=arguments[b];for(var e in d)a[e]===c&&(a[e]=d[e])}return a}function n(a){var b={x:a.offsetLeft,y:a.offsetTop};while(a=a.offsetParent)b.x+=a.offsetLeft,b.y+=a.offsetTop;return b}var d=["webkit","Moz","ms","O"],e={},f,i=function(){var a=g("style");return h(b.getElementsByTagName("head")[0],a),a.sheet||a.styleSheet}(),o={lines:12,length:7,width:5,radius:10,rotate:0,color:"#000",speed:1,trail:100,opacity:.25,fps:20,zIndex:2e9,className:"spinner",top:"auto",left:"auto"},p=function q(a){if(!this.spin)return new q(a);this.opts=m(a||{},q.defaults,o)};p.defaults={},m(p.prototype,{spin:function(a){this.stop();var b=this,c=b.opts,d=b.el=l(g(0,{className:c.className}),{position:"relative",zIndex:c.zIndex}),e=c.radius+c.length+c.width,h,i;a&&(a.insertBefore(d,a.firstChild||null),i=n(a),h=n(d),l(d,{left:(c.left=="auto"?i.x-h.x+(a.offsetWidth>>1):c.left+e)+"px",top:(c.top=="auto"?i.y-h.y+(a.offsetHeight>>1):c.top+e)+"px"})),d.setAttribute("aria-role","progressbar"),b.lines(d,b.opts);if(!f){var j=0,k=c.fps,m=k/c.speed,o=(1-c.opacity)/(m*c.trail/100),p=m/c.lines;!function q(){j++;for(var a=c.lines;a;a--){var e=Math.max(1-(j+a*p)%m*o,c.opacity);b.opacity(d,c.lines-a,e,c)}b.timeout=b.el&&setTimeout(q,~~(1e3/k))}()}return b},stop:function(){var a=this.el;return a&&(clearTimeout(this.timeout),a.parentNode&&a.parentNode.removeChild(a),this.el=c),this},lines:function(a,b){function e(a,d){return l(g(),{position:"absolute",width:b.length+b.width+"px",height:b.width+"px",background:a,boxShadow:d,transformOrigin:"left",transform:"rotate("+~~(360/b.lines*c+b.rotate)+"deg) translate("+b.radius+"px"+",0)",borderRadius:(b.width>>1)+"px"})}var c=0,d;for(;c<b.lines;c++)d=l(g(),{position:"absolute",top:1+~(b.width/2)+"px",transform:b.hwaccel?"translate3d(0,0,0)":"",opacity:b.opacity,animation:f&&j(b.opacity,b.trail,c,b.lines)+" "+1/b.speed+"s linear infinite"}),b.shadow&&h(d,l(e("#000","0 0 4px #000"),{top:"2px"})),h(a,h(d,e(b.color,"0 0 1px rgba(0,0,0,.1)")));return a},opacity:function(a,b,c){b<a.childNodes.length&&(a.childNodes[b].style.opacity=c)}}),!function(){function a(a,b){return g("<"+a+' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">',b)}var b=l(g("group"),{behavior:"url(#default#VML)"});!k(b,"transform")&&b.adj?(i.addRule(".spin-vml","behavior:url(#default#VML)"),p.prototype.lines=function(b,c){function f(){return l(a("group",{coordsize:e+" "+e,coordorigin:-d+" "+ -d}),{width:e,height:e})}function k(b,e,g){h(i,h(l(f(),{rotation:360/c.lines*b+"deg",left:~~e}),h(l(a("roundrect",{arcsize:1}),{width:d,height:c.width,left:c.radius,top:-c.width>>1,filter:g}),a("fill",{color:c.color,opacity:c.opacity}),a("stroke",{opacity:0}))))}var d=c.length+c.width,e=2*d,g=-(c.width+c.length)*2+"px",i=l(f(),{position:"absolute",top:g,left:g}),j;if(c.shadow)for(j=1;j<=c.lines;j++)k(j,-2,"progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");for(j=1;j<=c.lines;j++)k(j);return h(b,i)},p.prototype.opacity=function(a,b,c,d){var e=a.firstChild;d=d.shadow&&d.lines||0,e&&b+d<e.childNodes.length&&(e=e.childNodes[b+d],e=e&&e.firstChild,e=e&&e.firstChild,e&&(e.opacity=c))}):f=k(b,"animation")}(),a.Spinner=p})(window,document);
// Copyright 2006 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
document.createElement("canvas").getContext||(function(){var s=Math,j=s.round,F=s.sin,G=s.cos,V=s.abs,W=s.sqrt,k=10,v=k/2;function X(){return this.context_||(this.context_=new H(this))}var L=Array.prototype.slice;function Y(b,a){var c=L.call(arguments,2);return function(){return b.apply(a,c.concat(L.call(arguments)))}}var M={init:function(b){if(/MSIE/.test(navigator.userAgent)&&!window.opera){var a=b||document;a.createElement("canvas");a.attachEvent("onreadystatechange",Y(this.init_,this,a))}},init_:function(b){b.namespaces.g_vml_||
b.namespaces.add("g_vml_","urn:schemas-microsoft-com:vml","#default#VML");b.namespaces.g_o_||b.namespaces.add("g_o_","urn:schemas-microsoft-com:office:office","#default#VML");if(!b.styleSheets.ex_canvas_){var a=b.createStyleSheet();a.owningElement.id="ex_canvas_";a.cssText="canvas{display:inline-block;overflow:hidden;text-align:left;width:300px;height:150px}g_vml_\\:*{behavior:url(#default#VML)}g_o_\\:*{behavior:url(#default#VML)}"}var c=b.getElementsByTagName("canvas"),d=0;for(;d<c.length;d++)this.initElement(c[d])},
initElement:function(b){if(!b.getContext){b.getContext=X;b.innerHTML="";b.attachEvent("onpropertychange",Z);b.attachEvent("onresize",$);var a=b.attributes;if(a.width&&a.width.specified)b.style.width=a.width.nodeValue+"px";else b.width=b.clientWidth;if(a.height&&a.height.specified)b.style.height=a.height.nodeValue+"px";else b.height=b.clientHeight}return b}};function Z(b){var a=b.srcElement;switch(b.propertyName){case "width":a.style.width=a.attributes.width.nodeValue+"px";a.getContext().clearRect();
break;case "height":a.style.height=a.attributes.height.nodeValue+"px";a.getContext().clearRect();break}}function $(b){var a=b.srcElement;if(a.firstChild){a.firstChild.style.width=a.clientWidth+"px";a.firstChild.style.height=a.clientHeight+"px"}}M.init();var N=[],B=0;for(;B<16;B++){var C=0;for(;C<16;C++)N[B*16+C]=B.toString(16)+C.toString(16)}function I(){return[[1,0,0],[0,1,0],[0,0,1]]}function y(b,a){var c=I(),d=0;for(;d<3;d++){var f=0;for(;f<3;f++){var h=0,g=0;for(;g<3;g++)h+=b[d][g]*a[g][f];c[d][f]=
h}}return c}function O(b,a){a.fillStyle=b.fillStyle;a.lineCap=b.lineCap;a.lineJoin=b.lineJoin;a.lineWidth=b.lineWidth;a.miterLimit=b.miterLimit;a.shadowBlur=b.shadowBlur;a.shadowColor=b.shadowColor;a.shadowOffsetX=b.shadowOffsetX;a.shadowOffsetY=b.shadowOffsetY;a.strokeStyle=b.strokeStyle;a.globalAlpha=b.globalAlpha;a.arcScaleX_=b.arcScaleX_;a.arcScaleY_=b.arcScaleY_;a.lineScale_=b.lineScale_}function P(b){var a,c=1;b=String(b);if(b.substring(0,3)=="rgb"){var d=b.indexOf("(",3),f=b.indexOf(")",d+
1),h=b.substring(d+1,f).split(",");a="#";var g=0;for(;g<3;g++)a+=N[Number(h[g])];if(h.length==4&&b.substr(3,1)=="a")c=h[3]}else a=b;return{color:a,alpha:c}}function aa(b){switch(b){case "butt":return"flat";case "round":return"round";case "square":default:return"square"}}function H(b){this.m_=I();this.mStack_=[];this.aStack_=[];this.currentPath_=[];this.fillStyle=this.strokeStyle="#000";this.lineWidth=1;this.lineJoin="miter";this.lineCap="butt";this.miterLimit=k*1;this.globalAlpha=1;this.canvas=b;
var a=b.ownerDocument.createElement("div");a.style.width=b.clientWidth+"px";a.style.height=b.clientHeight+"px";a.style.overflow="hidden";a.style.position="absolute";b.appendChild(a);this.element_=a;this.lineScale_=this.arcScaleY_=this.arcScaleX_=1}var i=H.prototype;i.clearRect=function(){this.element_.innerHTML=""};i.beginPath=function(){this.currentPath_=[]};i.moveTo=function(b,a){var c=this.getCoords_(b,a);this.currentPath_.push({type:"moveTo",x:c.x,y:c.y});this.currentX_=c.x;this.currentY_=c.y};
i.lineTo=function(b,a){var c=this.getCoords_(b,a);this.currentPath_.push({type:"lineTo",x:c.x,y:c.y});this.currentX_=c.x;this.currentY_=c.y};i.bezierCurveTo=function(b,a,c,d,f,h){var g=this.getCoords_(f,h),l=this.getCoords_(b,a),e=this.getCoords_(c,d);Q(this,l,e,g)};function Q(b,a,c,d){b.currentPath_.push({type:"bezierCurveTo",cp1x:a.x,cp1y:a.y,cp2x:c.x,cp2y:c.y,x:d.x,y:d.y});b.currentX_=d.x;b.currentY_=d.y}i.quadraticCurveTo=function(b,a,c,d){var f=this.getCoords_(b,a),h=this.getCoords_(c,d),g={x:this.currentX_+
0.6666666666666666*(f.x-this.currentX_),y:this.currentY_+0.6666666666666666*(f.y-this.currentY_)};Q(this,g,{x:g.x+(h.x-this.currentX_)/3,y:g.y+(h.y-this.currentY_)/3},h)};i.arc=function(b,a,c,d,f,h){c*=k;var g=h?"at":"wa",l=b+G(d)*c-v,e=a+F(d)*c-v,m=b+G(f)*c-v,r=a+F(f)*c-v;if(l==m&&!h)l+=0.125;var n=this.getCoords_(b,a),o=this.getCoords_(l,e),q=this.getCoords_(m,r);this.currentPath_.push({type:g,x:n.x,y:n.y,radius:c,xStart:o.x,yStart:o.y,xEnd:q.x,yEnd:q.y})};i.rect=function(b,a,c,d){this.moveTo(b,
a);this.lineTo(b+c,a);this.lineTo(b+c,a+d);this.lineTo(b,a+d);this.closePath()};i.strokeRect=function(b,a,c,d){var f=this.currentPath_;this.beginPath();this.moveTo(b,a);this.lineTo(b+c,a);this.lineTo(b+c,a+d);this.lineTo(b,a+d);this.closePath();this.stroke();this.currentPath_=f};i.fillRect=function(b,a,c,d){var f=this.currentPath_;this.beginPath();this.moveTo(b,a);this.lineTo(b+c,a);this.lineTo(b+c,a+d);this.lineTo(b,a+d);this.closePath();this.fill();this.currentPath_=f};i.createLinearGradient=function(b,
a,c,d){var f=new D("gradient");f.x0_=b;f.y0_=a;f.x1_=c;f.y1_=d;return f};i.createRadialGradient=function(b,a,c,d,f,h){var g=new D("gradientradial");g.x0_=b;g.y0_=a;g.r0_=c;g.x1_=d;g.y1_=f;g.r1_=h;return g};i.drawImage=function(b){var a,c,d,f,h,g,l,e,m=b.runtimeStyle.width,r=b.runtimeStyle.height;b.runtimeStyle.width="auto";b.runtimeStyle.height="auto";var n=b.width,o=b.height;b.runtimeStyle.width=m;b.runtimeStyle.height=r;if(arguments.length==3){a=arguments[1];c=arguments[2];h=g=0;l=d=n;e=f=o}else if(arguments.length==
5){a=arguments[1];c=arguments[2];d=arguments[3];f=arguments[4];h=g=0;l=n;e=o}else if(arguments.length==9){h=arguments[1];g=arguments[2];l=arguments[3];e=arguments[4];a=arguments[5];c=arguments[6];d=arguments[7];f=arguments[8]}else throw Error("Invalid number of arguments");var q=this.getCoords_(a,c),t=[];t.push(" <g_vml_:group",' coordsize="',k*10,",",k*10,'"',' coordorigin="0,0"',' style="width:',10,"px;height:",10,"px;position:absolute;");if(this.m_[0][0]!=1||this.m_[0][1]){var E=[];E.push("M11=",
this.m_[0][0],",","M12=",this.m_[1][0],",","M21=",this.m_[0][1],",","M22=",this.m_[1][1],",","Dx=",j(q.x/k),",","Dy=",j(q.y/k),"");var p=q,z=this.getCoords_(a+d,c),w=this.getCoords_(a,c+f),x=this.getCoords_(a+d,c+f);p.x=s.max(p.x,z.x,w.x,x.x);p.y=s.max(p.y,z.y,w.y,x.y);t.push("padding:0 ",j(p.x/k),"px ",j(p.y/k),"px 0;filter:progid:DXImageTransform.Microsoft.Matrix(",E.join(""),", sizingmethod='clip');")}else t.push("top:",j(q.y/k),"px;left:",j(q.x/k),"px;");t.push(' ">','<g_vml_:image src="',b.src,
'"',' style="width:',k*d,"px;"," height:",k*f,'px;"',' cropleft="',h/n,'"',' croptop="',g/o,'"',' cropright="',(n-h-l)/n,'"',' cropbottom="',(o-g-e)/o,'"'," />","</g_vml_:group>");this.element_.insertAdjacentHTML("BeforeEnd",t.join(""))};i.stroke=function(b){var a=[],c=P(b?this.fillStyle:this.strokeStyle),d=c.color,f=c.alpha*this.globalAlpha;a.push("<g_vml_:shape",' filled="',!!b,'"',' style="position:absolute;width:',10,"px;height:",10,'px;"',' coordorigin="0 0" coordsize="',k*10," ",k*10,'"',' stroked="',
!b,'"',' path="');var h={x:null,y:null},g={x:null,y:null},l=0;for(;l<this.currentPath_.length;l++){var e=this.currentPath_[l];switch(e.type){case "moveTo":a.push(" m ",j(e.x),",",j(e.y));break;case "lineTo":a.push(" l ",j(e.x),",",j(e.y));break;case "close":a.push(" x ");e=null;break;case "bezierCurveTo":a.push(" c ",j(e.cp1x),",",j(e.cp1y),",",j(e.cp2x),",",j(e.cp2y),",",j(e.x),",",j(e.y));break;case "at":case "wa":a.push(" ",e.type," ",j(e.x-this.arcScaleX_*e.radius),",",j(e.y-this.arcScaleY_*e.radius),
" ",j(e.x+this.arcScaleX_*e.radius),",",j(e.y+this.arcScaleY_*e.radius)," ",j(e.xStart),",",j(e.yStart)," ",j(e.xEnd),",",j(e.yEnd));break}if(e){if(h.x==null||e.x<h.x)h.x=e.x;if(g.x==null||e.x>g.x)g.x=e.x;if(h.y==null||e.y<h.y)h.y=e.y;if(g.y==null||e.y>g.y)g.y=e.y}}a.push(' ">');if(b)if(typeof this.fillStyle=="object"){var m=this.fillStyle,r=0,n={x:0,y:0},o=0,q=1;if(m.type_=="gradient"){var t=m.x1_/this.arcScaleX_,E=m.y1_/this.arcScaleY_,p=this.getCoords_(m.x0_/this.arcScaleX_,m.y0_/this.arcScaleY_),
z=this.getCoords_(t,E);r=Math.atan2(z.x-p.x,z.y-p.y)*180/Math.PI;if(r<0)r+=360;if(r<1.0E-6)r=0}else{var p=this.getCoords_(m.x0_,m.y0_),w=g.x-h.x,x=g.y-h.y;n={x:(p.x-h.x)/w,y:(p.y-h.y)/x};w/=this.arcScaleX_*k;x/=this.arcScaleY_*k;var R=s.max(w,x);o=2*m.r0_/R;q=2*m.r1_/R-o}var u=m.colors_;u.sort(function(ba,ca){return ba.offset-ca.offset});var J=u.length,da=u[0].color,ea=u[J-1].color,fa=u[0].alpha*this.globalAlpha,ga=u[J-1].alpha*this.globalAlpha,S=[],l=0;for(;l<J;l++){var T=u[l];S.push(T.offset*q+
o+" "+T.color)}a.push('<g_vml_:fill type="',m.type_,'"',' method="none" focus="100%"',' color="',da,'"',' color2="',ea,'"',' colors="',S.join(","),'"',' opacity="',ga,'"',' g_o_:opacity2="',fa,'"',' angle="',r,'"',' focusposition="',n.x,",",n.y,'" />')}else a.push('<g_vml_:fill color="',d,'" opacity="',f,'" />');else{var K=this.lineScale_*this.lineWidth;if(K<1)f*=K;a.push("<g_vml_:stroke",' opacity="',f,'"',' joinstyle="',this.lineJoin,'"',' miterlimit="',this.miterLimit,'"',' endcap="',aa(this.lineCap),
'"',' weight="',K,'px"',' color="',d,'" />')}a.push("</g_vml_:shape>");this.element_.insertAdjacentHTML("beforeEnd",a.join(""))};i.fill=function(){this.stroke(true)};i.closePath=function(){this.currentPath_.push({type:"close"})};i.getCoords_=function(b,a){var c=this.m_;return{x:k*(b*c[0][0]+a*c[1][0]+c[2][0])-v,y:k*(b*c[0][1]+a*c[1][1]+c[2][1])-v}};i.save=function(){var b={};O(this,b);this.aStack_.push(b);this.mStack_.push(this.m_);this.m_=y(I(),this.m_)};i.restore=function(){O(this.aStack_.pop(),
this);this.m_=this.mStack_.pop()};function ha(b){var a=0;for(;a<3;a++){var c=0;for(;c<2;c++)if(!isFinite(b[a][c])||isNaN(b[a][c]))return false}return true}function A(b,a,c){if(!!ha(a)){b.m_=a;if(c)b.lineScale_=W(V(a[0][0]*a[1][1]-a[0][1]*a[1][0]))}}i.translate=function(b,a){A(this,y([[1,0,0],[0,1,0],[b,a,1]],this.m_),false)};i.rotate=function(b){var a=G(b),c=F(b);A(this,y([[a,c,0],[-c,a,0],[0,0,1]],this.m_),false)};i.scale=function(b,a){this.arcScaleX_*=b;this.arcScaleY_*=a;A(this,y([[b,0,0],[0,a,
0],[0,0,1]],this.m_),true)};i.transform=function(b,a,c,d,f,h){A(this,y([[b,a,0],[c,d,0],[f,h,1]],this.m_),true)};i.setTransform=function(b,a,c,d,f,h){A(this,[[b,a,0],[c,d,0],[f,h,1]],true)};i.clip=function(){};i.arcTo=function(){};i.createPattern=function(){return new U};function D(b){this.type_=b;this.r1_=this.y1_=this.x1_=this.r0_=this.y0_=this.x0_=0;this.colors_=[]}D.prototype.addColorStop=function(b,a){a=P(a);this.colors_.push({offset:b,color:a.color,alpha:a.alpha})};function U(){}G_vmlCanvasManager=
M;CanvasRenderingContext2D=H;CanvasGradient=D;CanvasPattern=U})();
/*!
 * jQuery Transit - CSS3 transitions and transformations
 * Copyright(c) 2011 Rico Sta. Cruz <rico@ricostacruz.com>
 * MIT Licensed.
 *
 * http://ricostacruz.com/jquery.transit
 * http://github.com/rstacruz/jquery.transit
 */

(function($) {
  "use strict";

  $.transit = {
    version: "0.1.3",

    // Map of $.css() keys to values for 'transitionProperty'.
    // See https://developer.mozilla.org/en/CSS/CSS_transitions#Properties_that_can_be_animated
    propertyMap: {
      marginLeft    : 'margin',
      marginRight   : 'margin',
      marginBottom  : 'margin',
      marginTop     : 'margin',
      paddingLeft   : 'padding',
      paddingRight  : 'padding',
      paddingBottom : 'padding',
      paddingTop    : 'padding'
    },

    // Will simply transition "instantly" if false
    enabled: true,

    // Set this to false if you don't want to use the transition end property.
    useTransitionEnd: false
  };

  var div = document.createElement('div');
  var support = {};

  // Helper function to get the proper vendor property name.
  // (`transition` => `WebkitTransition`)
  function getVendorPropertyName(prop) {
    var prefixes = ['Moz', 'Webkit', 'O', 'ms'];
    var prop_ = prop.charAt(0).toUpperCase() + prop.substr(1);

    if (prop in div.style) { return prop; }

    for (var i=0; i<prefixes.length; ++i) {
      var vendorProp = prefixes[i] + prop_;
      if (vendorProp in div.style) { return vendorProp; }
    }
  }

  // Helper function to check if transform3D is supported.
  // Should return true for Webkits and Firefox 10+.
  function checkTransform3dSupport() {
    div.style[support.transform] = '';
    div.style[support.transform] = 'rotateY(90deg)';
    return div.style[support.transform] !== '';
  }

  var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

  // Check for the browser's transitions support.
  // You can access this in jQuery's `$.support.transition`.
  // As per [jQuery's cssHooks documentation](http://api.jquery.com/jQuery.cssHooks/),
  // we set $.support.transition to a string of the actual property name used.
  support.transition      = getVendorPropertyName('transition');
  support.transitionDelay = getVendorPropertyName('transitionDelay');
  support.transform       = getVendorPropertyName('transform');
  support.transformOrigin = getVendorPropertyName('transformOrigin');
  support.transform3d     = checkTransform3dSupport();

  $.extend($.support, support);

  var eventNames = {
    'MozTransition':    'transitionend',
    'OTransition':      'oTransitionEnd',
    'WebkitTransition': 'webkitTransitionEnd',
    'msTransition':     'MSTransitionEnd'
  };

  // Detect the 'transitionend' event needed.
  var transitionEnd = support.transitionEnd = eventNames[support.transition] || null;

  // Avoid memory leak in IE.
  div = null;

  // ## $.cssEase
  // List of easing aliases that you can use with `$.fn.transition`.
  $.cssEase = {
    '_default': 'ease',
    'in':       'ease-in',
    'out':      'ease-out',
    'in-out':   'ease-in-out',
    'snap':     'cubic-bezier(0,1,.5,1)'
  };

  // ## 'transform' CSS hook
  // Allows you to use the `transform` property in CSS.
  //
  //     $("#hello").css({ transform: "rotate(90deg)" });
  //
  //     $("#hello").css('transform');
  //     //=> { rotate: '90deg' }
  //
  $.cssHooks.transform = {
    // The getter returns a `Transform` object.
    get: function(elem) {
      return $(elem).data('transform');
    },

    // The setter accepts a `Transform` object or a string.
    set: function(elem, v) {
      var value = v;

      if (!(value instanceof Transform)) {
        value = new Transform(value);
      }

      // We've seen the 3D version of Scale() not work in Chrome when the
      // element being scaled extends outside of the viewport.  Thus, we're
      // forcing Chrome to not use the 3d transforms as well.  Not sure if
      // translate is affectede, but not risking it.  Detection code from
      // http://davidwalsh.name/detecting-google-chrome-javascript
      if (support.transform === 'WebkitTransform' && !eb.browser.safari) { //!isChrome
        elem.style[support.transform] = value.toString(true);
      } else {
        elem.style[support.transform] = value.toString();
      }

      $(elem).data('transform', value);
    }
  };

  // ## 'transformOrigin' CSS hook
  // Allows the use for `transformOrigin` to define where scaling and rotation
  // is pivoted.
  //
  //     $("#hello").css({ transformOrigin: '0 0' });
  //
  $.cssHooks.transformOrigin = {
    get: function(elem) {
      return elem.style[support.transformOrigin];
    },
    set: function(elem, value) {
      elem.style[support.transformOrigin] = value;
    }
  };

  // ## 'transition' CSS hook
  // Allows you to use the `transition` property in CSS.
  //
  //     $("#hello").css({ transition: 'all 0 ease 0' }); 
  //
  $.cssHooks.transition = {
    get: function(elem) {
      return elem.style[support.transition];
    },
    set: function(elem, value) {
      elem.style[support.transition] = value;
    }
  };

  // ## Other CSS hooks
  // Allows you to rotate, scale and translate.
  registerCssHook('scale');
  registerCssHook('translate');
  registerCssHook('rotate');
  registerCssHook('rotateX');
  registerCssHook('rotateY');
  registerCssHook('rotate3d');
  registerCssHook('perspective');
  registerCssHook('skewX');
  registerCssHook('skewY');
  registerCssHook('x', true);
  registerCssHook('y', true);

  // ## Transform class
  // This is the main class of a transformation property that powers
  // `$.fn.css({ transform: '...' })`.
  //
  // This is, in essence, a dictionary object with key/values as `-transform`
  // properties.
  //
  //     var t = new Transform("rotate(90) scale(4)");
  //
  //     t.rotate             //=> "90deg"
  //     t.scale              //=> "4,4"
  //
  // Setters are accounted for.
  //
  //     t.set('rotate', 4)
  //     t.rotate             //=> "4deg"
  //
  // Convert it to a CSS string using the `toString()` and `toString(true)` (for WebKit)
  // functions.
  //
  //     t.toString()         //=> "rotate(90deg) scale(4,4)"
  //     t.toString(true)     //=> "rotate(90deg) scale3d(4,4,0)" (WebKit version)
  //
  function Transform(str) {
    if (typeof str === 'string') { this.parse(str); }
    return this;
  }

  Transform.prototype = {
    // ### setFromString()
    // Sets a property from a string.
    //
    //     t.setFromString('scale', '2,4');
    //     // Same as set('scale', '2', '4');
    //
    setFromString: function(prop, val) {
      var args =
        (typeof val === 'string')  ? val.split(',') :
        (val.constructor === Array) ? val :
        [ val ];

      args.unshift(prop);

      Transform.prototype.set.apply(this, args);
    },

    // ### set()
    // Sets a property.
    //
    //     t.set('scale', 2, 4);
    //
    set: function(prop) {
      var args = Array.prototype.slice.apply(arguments, [1]);
      if (this.setter[prop]) {
        this.setter[prop].apply(this, args);
      } else {
        this[prop] = args.join(',');
      }
    },

    get: function(prop) {
      if (this.getter[prop]) {
        return this.getter[prop].apply(this);
      } else {
        return this[prop] || 0;
      }
    },

    setter: {
      // ### rotate
      //
      //     .css({ rotate: 30 })
      //     .css({ rotate: "30" })
      //     .css({ rotate: "30deg" })
      //     .css({ rotate: "30deg" })
      //
      rotate: function(theta) {
        this.rotate = unit(theta, 'deg');
      },

      rotateX: function(theta) {
        this.rotateX = unit(theta, 'deg');
      },

      rotateY: function(theta) {
        this.rotateY = unit(theta, 'deg');
      },

      // ### scale
      //
      //     .css({ scale: 9 })      //=> "scale(9,9)"
      //     .css({ scale: '3,2' })  //=> "scale(3,2)"
      //
      scale: function(x, y) {
        if (y === undefined) { y = x; }
        this.scale = x + "," + y;
      },

      // ### skewX + skewY
      skewX: function(x) {
        this.skewX = unit(x, 'deg');
      },

      skewY: function(y) {
        this.skewY = unit(y, 'deg');
      },

      // ### perspectvie
      perspective: function(dist) {
        this.perspective = unit(dist, 'px');
      },

      // ### x / y
      // Translations. Notice how this keeps the other value.
      //
      //     .css({ x: 4 })       //=> "translate(4px, 0)"
      //     .css({ y: 10 })      //=> "translate(4px, 10px)"
      //
      x: function(x) {
        this.set('translate', x, null);
      },

      y: function(y) {
        this.set('translate', null, y);
      },

      // ### translate
      // Notice how this keeps the other value.
      //
      //     .css({ translate: '2, 5' })    //=> "translate(2px, 5px)"
      //
      translate: function(x, y) {
        if (this._translateX === undefined) { this._translateX = 0; }
        if (this._translateY === undefined) { this._translateY = 0; }

        if (x !== null) { this._translateX = unit(x, 'px'); }
        if (y !== null) { this._translateY = unit(y, 'px'); }

        this.translate = this._translateX + "," + this._translateY;
      }
    },

    getter: {
      x: function() {
        return this._translateX || 0;
      },

      y: function() {
        return this._translateY || 0;
      },

      scale: function() {
        var s = (this.scale || "1,1").split(',');
        if (s[0]) { s[0] = parseFloat(s[0]); }
        if (s[1]) { s[1] = parseFloat(s[1]); }

        // "2.5,2.5" => 2.5
        // "2.5,1" => [2.5,1]
        return (s[0] === s[1]) ? s[0] : s;
      },

      rotate3d: function() {
        var s = (this.rotate3d || "0,0,0,0deg").split(',');
        for (var i=0; i<=3; ++i) {
          if (s[i]) { s[i] = parseFloat(s[i]); }
        }
        if (s[3]) { s[3] = unit(s[3], 'deg'); }

        return s;
      }
    },

    // ### parse()
    // Parses from a string. Called on constructor.
    parse: function(str) {
      var self = this;
      str.replace(/([a-zA-Z0-9]+)\((.*?)\)/g, function(x, prop, val) {
        self.setFromString(prop, val);
      });
    },

    // ### toString()
    // Converts to a `transition` CSS property string. If `use3d` is given,
    // it converts to a `-webkit-transition` CSS property string instead.
    toString: function(use3d) {
      var re = [];

      for (var i in this) {
        if (this.hasOwnProperty(i)) {
          // Don't use 3D transformations if the browser can't support it.
          if ((!support.transform3d) && (
            (i === 'rotateX') ||
            (i === 'rotateY') ||
            (i === 'perspective') ||
            (i === 'transformOrigin'))) { continue; }

          if (i[0] !== '_') {
            if (use3d && (i === 'scale')) {
              re.push(i + "3d(" + this[i] + ",1)");
            } else if (use3d && (i === 'translate')) {
              re.push(i + "3d(" + this[i] + ",0)");
            } else {
              re.push(i + "(" + this[i] + ")");
            }
          }
        }
      }

      return re.join(" ");
    }
  };

  function callOrQueue(self, queue, fn) {
    if (queue === true) {
      self.queue(fn);
    } else if (queue) {
      self.queue(queue, fn);
    } else {
      fn();
    }
  }

  // ### getProperties(dict)
  // Returns properties (for `transition-property`) for dictionary `props`. The
  // value of `props` is what you would expect in `$.css(...)`.
  function getProperties(props) {
    var re = [];

    $.each(props, function(key) {
      key = $.camelCase(key); // Convert "text-align" => "textAlign"
      key = $.transit.propertyMap[key] || key;
      key = uncamel(key); // Convert back to dasherized

      if ($.inArray(key, re) === -1) { re.push(key); }
    });

    return re;
  }

  // ### getTransition()
  // Returns the transition string to be used for the `transition` CSS property.
  //
  // Example:
  //
  //     getTransition({ opacity: 1, rotate: 30 }, 500, 'ease');
  //     //=> 'opacity 500ms ease, -webkit-transform 500ms ease'
  //
  function getTransition(properties, duration, easing, delay) {
    // Get the CSS properties needed.
    var props = getProperties(properties);

    // Account for aliases (`in` => `ease-in`).
    if ($.cssEase[easing]) { easing = $.cssEase[easing]; }

    // Build the duration/easing/delay attributes for it.
    var attribs = '' + toMS(duration) + ' ' + easing;
    if (parseInt(delay, 10) > 0) { attribs += ' ' + toMS(delay); }

    // For more properties, add them this way:
    // "margin 200ms ease, padding 200ms ease, ..."
    var transitions = [];
    $.each(props, function(i, name) {
      transitions.push(name + ' ' + attribs);
    });

    return transitions.join(', ');
  }

  // ## $.fn.transition
  // Works like $.fn.animate(), but uses CSS transitions.
  //
  //     $("...").transition({ opacity: 0.1, scale: 0.3 });
  //
  //     // Specific duration
  //     $("...").transition({ opacity: 0.1, scale: 0.3 }, 500);
  //
  //     // With duration and easing
  //     $("...").transition({ opacity: 0.1, scale: 0.3 }, 500, 'in');
  //
  //     // With callback
  //     $("...").transition({ opacity: 0.1, scale: 0.3 }, function() { ... });
  //
  //     // With everything
  //     $("...").transition({ opacity: 0.1, scale: 0.3 }, 500, 'in', function() { ... });
  //
  //     // Alternate syntax
  //     $("...").transition({
  //       opacity: 0.1,
  //       duration: 200,
  //       delay: 40,
  //       easing: 'in',
  //       complete: function() { /* ... */ }
  //      });
  //
  $.fn.transition = $.fn.transit = function(properties, duration, easing, callback) {
    var self  = this;
    var delay = 0;
    var queue = true;

    // Account for `.transition(properties, callback)`.
    if (typeof duration === 'function') {
      callback = duration;
      duration = undefined;
    }

    // Account for `.transition(properties, duration, callback)`.
    if (typeof easing === 'function') {
      callback = easing;
      easing = undefined;
    }

    // Alternate syntax.
    if (typeof properties.easing !== 'undefined') {
      easing = properties.easing;
      delete properties.easing;
    }

    if (typeof properties.duration !== 'undefined') {
      duration = properties.duration;
      delete properties.duration;
    }

    if (typeof properties.complete !== 'undefined') {
      callback = properties.complete;
      delete properties.complete;
    }

    if (typeof properties.queue !== 'undefined') {
      queue = properties.queue;
      delete properties.queue;
    }

    if (typeof properties.delay !== 'undefined') {
      delay = properties.delay;
      delete properties.delay;
    }

    // Set defaults. (`400` duration, `ease` easing)
    if (typeof duration === 'undefined') { duration = $.fx.speeds._default; }
    if (typeof easing === 'undefined')   { easing = $.cssEase._default; }

    duration = toMS(duration);

    // Build the `transition` property.
    var transitionValue = getTransition(properties, duration, easing, delay);

    // Compute delay until callback.
    // If this becomes 0, don't bother setting the transition property.
    var work = $.transit.enabled && support.transition;
    var i = work ? (parseInt(duration, 10) + parseInt(delay, 10)) : 0;

    // If there's nothing to do...
    if (i === 0) {
      var fn = function(next) {
        self.css(properties);
        if (callback) { callback.apply(self); }
        if (next) { next(); }
      };

      callOrQueue(self, queue, fn);
      return self;
    }

    // Save the old transitions of each element so we can restore it later.
    var oldTransitions = {};

    var run = function(nextCall) {
      var bound = false;

      // Prepare the callback.
      var cb = function() {
        if (bound) { self.unbind(transitionEnd, cb); }

        if (i > 0) {
          self.each(function() {
            this.style[support.transition] = (oldTransitions[this] || null);
          });
        }

        if (typeof callback === 'function') { callback.apply(self); }
        if (typeof nextCall === 'function') { nextCall(); }
      };

      if ((i > 0) && (transitionEnd) && ($.transit.useTransitionEnd)) {
        // Use the 'transitionend' event if it's available.
        bound = true;
        self.bind(transitionEnd, cb);
      } else {
        // Fallback to timers if the 'transitionend' event isn't supported.
        window.setTimeout(cb, i);
      }

      // Apply transitions.
      self.each(function() {
        if (i > 0) {
          this.style[support.transition] = transitionValue;
        }
        $(this).css(properties);
      });
    };

    // Defer running. This allows the browser to paint any pending CSS it hasn't
    // painted yet before doing the transitions.
    var deferredRun = function(next) {
      var i = 0;

      // Durations that are too slow will get transitions mixed up.
      // (Tested on Mac/FF 7.0.1)
      if ((support.transition === 'MozTransition') && (i < 25)) { i = 25; }

      window.setTimeout(function() { run(next); }, i);
    };

    // Use jQuery's fx queue.
    callOrQueue(self, queue, deferredRun);

    // Chainability.
    return this;
  };

  function registerCssHook(prop, isPixels) {
    // For certain properties, the 'px' should not be implied.
    if (!isPixels) { $.cssNumber[prop] = true; }

    $.transit.propertyMap[prop] = support.transform;

    $.cssHooks[prop] = {
      get: function(elem) {
        var t = $(elem).css('transform');
          if(!(t instanceof Transform)) { t = new Transform(); }

        return t.get(prop);
      },

      set: function(elem, value) {
        var t = $(elem).css('transform');
          if(!(t instanceof Transform)) { t = new Transform(); }
        t.setFromString(prop, value);

        $(elem).css({ transform: t });
      }
    };
  }

  // ### uncamel(str)
  // Converts a camelcase string to a dasherized string.
  // (`marginLeft` => `margin-left`)
  function uncamel(str) {
    return str.replace(/([A-Z])/g, function(letter) { return '-' + letter.toLowerCase(); });
  }

  // ### unit(number, unit)
  // Ensures that number `number` has a unit. If no unit is found, assume the
  // default is `unit`.
  //
  //     unit(2, 'px')          //=> "2px"
  //     unit("30deg", 'rad')   //=> "30deg"
  //
  function unit(i, units) {
    if ((typeof i === "string") && (!i.match(/^[\-0-9\.]+$/))) {
      return i;
    } else {
      return "" + i + units;
    }
  }

  // ### toMS(duration)
  // Converts given `duration` to a millisecond string.
  //
  //     toMS('fast')   //=> '400ms'
  //     toMS(10)       //=> '10ms'
  //
  function toMS(duration) {
    var i = duration;

    // Allow for string durations like 'fast'.
    if ($.fx.speeds[i]) { i = $.fx.speeds[i]; }

    return unit(i, 'ms');
  }

  // Export some functions for testable-ness.
  $.transit.getTransitionValue = getTransition;
})(jQuery);
