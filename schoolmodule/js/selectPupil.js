$(document).ready(function(){
	
	// attach menu to quaLITY BOX
	/*$('#objective_progress').live('mouseover',function(){
		if( $(this).find('div#quality_assesment').is('.block5') ){
			var assesmentTop = $('#objective_progress').scrollTop();
			$(this).find('.block5').css({'display':'block','margin-top':'-'+assesmentTop+'px','margin-left':'0px'});
		}
	});*/
	
	$('#objective_progress').scroll(function(){
		$('div#quality_assesment').fadeOut(700);
		$('td#tdquality').removeClass('tdquality_hide').addClass('tdquality');
		$('div.block5').removeClass('block5');
	});
	
	//click on quality box and show menu
	$('td#tdquality').live("click",function(){
		$('td#tdquality').removeClass('tdquality_hide').addClass('tdquality');
		$('div#quality_assesment').hide();
		
		//qualityTop = parseInt( $(this).offset().top );
		qualityTop = parseInt( $(this).offset().top );;
		qualityScroll = $('#objective_progress').scrollTop();
		
		//$(this).find('#quality_assesment').css({'margin-top':'-'+qualityTop+'px','display':'block'}).addClass('block5');
		
		if( qualityTop > 800 ){
			qualityScroll1 = qualityScroll + 100;
			$(this).find('#quality_assesment').css({'display':'block','margin-top':'-'+qualityScroll1+'px'}).addClass('block5');
			//$(this).find('#quality_assesment').css({'margin-top':'-95px','display':'block'});
		}else
			$(this).find('#quality_assesment').css({'display':'block','margin-top':'-'+qualityScroll+'px'}).addClass('block5');
			//$(this).find('#quality_assesment').css('display','block');

        var field = $(this).find('#quality_assesment');
        var itempos = field.offset().top + field.height();
        var mainpos =  $("#objective_progress").offset().top + $("#objective_progress").height();

        if(itempos>mainpos-5){
            field.css('margin-top',-(field.height()+3));
        }

		//$(this).find('#quality_assesment').css('display','block');
		$(this).removeClass('tdquality').addClass('tdquality_hide');
	});
	//click on quality box and hide menu
	$('td.tdquality_hide').live("click",function(){

		$(this).find('#quality_assesment').hide();//slideUp('slow');
		$(this).removeClass('tdquality_hide').addClass('tdquality');
		$('div.block5').removeClass('block5');
	});
	
	//Hide objective menu if click anywhere
	$(document + ":not(.tdquality)").click(function(){

		$('div#quality_assesment').hide();
		$('td#tdquality').removeClass('tdquality_hide').addClass('tdquality');
		$('div.block5').removeClass('block5');
	});
	
	//hide menu on quality and assesment box
	$('#quality_assesment').live("mouseleave",function(){
		setTimeout(
			function(){
				$('div#quality_assesment').hide();
				$('td#tdquality').removeClass('tdquality_hide').addClass('tdquality');
				$('div.block5').removeClass('block5');
			},
			2500
		);
	});
	
	// Highlighted quality box when mouse over
	$('td#tdquality').live("mouseover",function(){
        if(schoolmule.main.user_role=='staff' || schoolmule.main.user_role=='superadmin'){
            o = $(this);
            if( $(o).find('span.quality').text() == '-' )
                $(o).css('background-color','#fcf3cf');
            else if( $(o).find('span.quality').text() == 'F' )
                $(o).css('background-color','#f2928e');
            else
                $(o).css('background-color','#d9f2cb');
        }
	});
	
	// Return color when mouse out
	$('td#tdquality').live("mouseout",function(){
        if(schoolmule.main.user_role=='staff' || schoolmule.main.user_role=='superadmin'){
            o = $(this);
            if( $(o).find('span.quality').text() == '-' )
                $(o).css('background-color','#f5e8b3');
            else if( $(o).find('span.quality').text() == 'F' )
                $(o).css('background-color','#f4726d');
            else
                $(o).css('background-color','#CBE6BD');
        }
	});
	
	
	// attach menu to assesment
	/*$('#objective_progress').live('mouseover',function(){
		if( $(this).find('div#quality_assesment').is('.block4') ){
			var assesmentTop = $('#objective_progress').scrollTop();
			$(this).find('.block4').css({'display':'block','margin-top':'-'+assesmentTop+'px','margin-left':'0px'});
		}
	});*/
	$('#objective_progress').scroll(function(){
		$('div#quality_assesment').fadeOut(700);
		$('tr#new_assesment').removeClass('new_assesment1').addClass('new_assesment');
		$('div.block4').removeClass('block4');
	});
	
	//click on assesment box
	$('tr#new_assesment').live("click",function(){
		//$('div.quality_assesment').hide();
		$('tr#new_assesment').removeClass('new_assesment1').addClass('new_assesment');
		$('tr#new_assesment').parent().parent().prev('#quality_assesment').hide();
		
		assesmentTop = parseInt( $(this).offset().top );
		assesmentScroll = $('#objective_progress').scrollTop();
		
		if( assesmentTop > 900 ){
			assesmentScroll1 = assesmentScroll + 100;
			//$(this).parent().parent().prev('div.quality_assesment').css({'margin-top':'-'+assesmentTop+'px','display':'block'}).addClass('block4');
			$(this).parent().parent().prev('div.quality_assesment').css({'margin-top':'-'+assesmentScroll1+'px','display':'block'}).addClass('block4');
		}else
			$(this).parent().parent().prev('div.quality_assesment').css({'margin-top':'-'+assesmentScroll+'px','display':'block'}).addClass('block4');
		
		//$(this).parent().parent().prev('.quality_assesment').css('display','block');
		$(this).removeClass('new_assesment').addClass('new_assesment1');

        var field =$(this).parent().parent().prev('div.quality_assesment');
        var itempos = field.offset().top + field.height();
        var mainpos =  $("#objective_progress").offset().top + $("#objective_progress").height();

        if(itempos>mainpos-5){
            field.css('margin-top',-(field.height()+3));
        }

	});
	
	$('tr.new_assesment1').live("click",function(){
		$(this).parent().parent().prev('.quality_assesment').hide();
		$(this).removeClass('new_assesment1').addClass('new_assesment');
	});
	
	$(document + ":not(.new_assesment1)").click(function(){
		$('div#quality_assesment').hide();
		$('tr#new_assesment').removeClass('new_assesment1').addClass('new_assesment');
		$('div.block4').removeClass('block4');
	});
	
	//click on assesment box menu (pass or NPass)
	$('.pass').live("click",function(){
		o = $(this);
		id = $(o).parent().next('table:first').find('#assPerfId').val();
		type = $(o).parent().next('table:first').find('#assPerfId').next().val();
		$('.quality_assesment').hide();
		$('tr.new_assesment1').removeClass('new_assesment1').addClass('new_assesment');
		$.post("schoolmodule/ajax/ajax_update.php",{action:"pass", assessment:dlang("passvalue","Pass"), id:id, pupilId:$('#hidden_pupil_id').val()},function(data){
            $.post("schoolmodule/ajax/ajax.php",{action:"select_info", staffAdmin: "", pupilId: pupilId, StudyGroupID: StudyGroupID },function(data){
                $('#objective_progress').html(data)
            });
			//$(o).parent().next('table:first').children().children('tr.new_assesment').html(data);
		});
	});
	$('.notpass').live("click",function(){
		o = $(this);
		id = $(o).parent().next('table:first').find('#assPerfId').val();
		type = $(o).parent().next('table:first').find('#assPerfId').next().val();
		$('.quality_assesment').hide();
		$('tr.new_assesment1').removeClass('new_assesment1').addClass('new_assesment');
		$.post("schoolmodule/ajax/ajax_update.php",{action:"notpass", assessment:dlang("npassvalue","NPass"), id:id, pupilId:$('#hidden_pupil_id').val()},function(data){
            $.post("schoolmodule/ajax/ajax.php",{action:"select_info", staffAdmin: "", pupilId: pupilId, StudyGroupID: StudyGroupID },function(data){
                $('#objective_progress').html(data)
            });
			//$(o).parent().next('table:first').children().children('tr.new_assesment').html(data);
		});
	});
	
	//click on assesment box menu (A-F) and select value
	$('.assesmentliA').live("click",function(){

		o = $(this);
		id = $(o).parent().next('table:first').find('#assPerfId').val();
		type = $(o).parent().next('table:first').find('#assPerfId').next().val();
		$('tr.new_assesment1').removeClass('new_assesment1').addClass('new_assesment');
		$.post("schoolmodule/ajax/ajax_update.php",{action:"insert_A", assessment:'A', id:id, type:type, pupilId:$('#hidden_pupil_id').val()},function(data){
            $.post("schoolmodule/ajax/ajax.php",{action:"select_info", staffAdmin: "", pupilId: pupilId, StudyGroupID: StudyGroupID },function(data){
                $('#objective_progress').html(data)
            });
/*            $(o).parent().next('table:first').show();
            $(o).parent().nextAll('span').hide();
            $(o).parent().parent().css('padding','0');

            var items = $("#assPerfId[value='"+id+"'] ~ tbody tr.new_assesment");

            for(var i=0; i<=items.length; i++){
                $(items[i]).parent().parent().parent().prev().find('div').css('color','green');
                if($(items[i]).parent().prev("[value='"+type+"']").size()==1){
                    $(items[i]).html(data);
                }
            }*/

            $('.quality_assesment').hide();
            //$(o).parent().next('table:first').children().children('tr.new_assesment').html(data);
		});
	});
	$('.assesmentliB').live("click",function(){
		o = $(this);
		id = $(o).parent().next('table:first').find('#assPerfId').val();
		type = $(o).parent().next('table:first').find('#assPerfId').next().val();
		$('.quality_assesment').hide();
		$('tr.new_assesment1').removeClass('new_assesment1').addClass('new_assesment');
		$.post("schoolmodule/ajax/ajax_update.php",{action:"insert_B", assessment:'B', id:id, type:type, pupilId:$('#hidden_pupil_id').val()},function(data){
            $.post("schoolmodule/ajax/ajax.php",{action:"select_info", staffAdmin: "", pupilId: pupilId, StudyGroupID: StudyGroupID },function(data){
                $('#objective_progress').html(data)
            });
/*            $(o).parent().next('table:first').show();
            $(o).parent().nextAll('span').hide();
            $(o).parent().parent().css('padding','0');
            var items = $("#assPerfId[value='"+id+"'] ~ tbody tr.new_assesment");

            for(var i=0; i<=items.length; i++){
                $(items[i]).parent().parent().parent().prev().find('div').css('color','green');
                if($(items[i]).parent().prev("[value='"+type+"']").size()==1){
                    $(items[i]).html(data);
                }
            }*/
            $('.quality_assesment').hide();

        });
	});
	$('.assesmentliC').live("click",function(){
		o = $(this);
		id = $(o).parent().next('table:first').find('#assPerfId').val();
		type = $(o).parent().next('table:first').find('#assPerfId').next().val();
		$('.quality_assesment').hide();
		$('tr.new_assesment1').removeClass('new_assesment1').addClass('new_assesment');
		$.post("schoolmodule/ajax/ajax_update.php",{action:"insert_C", assessment:'C', id:id, type:type, pupilId:$('#hidden_pupil_id').val()},function(data){
            $.post("schoolmodule/ajax/ajax.php",{action:"select_info", staffAdmin: "", pupilId: pupilId, StudyGroupID: StudyGroupID },function(data){
                $('#objective_progress').html(data)
            });
/*            $(o).parent().next('table:first').show();
            $(o).parent().nextAll('span').hide();
            $(o).parent().parent().css('padding','0');
            var items = $("#assPerfId[value='"+id+"'] ~ tbody tr.new_assesment");

            for(var i=0; i<=items.length; i++){
                $(items[i]).parent().parent().parent().prev().find('div').css('color','green');
                if($(items[i]).parent().prev("[value='"+type+"']").size()==1){
                    $(items[i]).html(data);
                }
            }*/
            $('.quality_assesment').hide();

        });
	});
	$('.assesmentliD').live("click",function(){
		o = $(this);
		id = $(o).parent().next('table:first').find('#assPerfId').val();
		type = $(o).parent().next('table:first').find('#assPerfId').next().val();
		$('.quality_assesment').hide();
		$('tr.new_assesment1').removeClass('new_assesment1').addClass('new_assesment');
		$.post("schoolmodule/ajax/ajax_update.php",{action:"insert_D", assessment:'D', id:id, type:type, pupilId:$('#hidden_pupil_id').val()},function(data){
            $.post("schoolmodule/ajax/ajax.php",{action:"select_info", staffAdmin: "", pupilId: pupilId, StudyGroupID: StudyGroupID },function(data){
                $('#objective_progress').html(data)
            });
/*            $(o).parent().next('table:first').show();
            $(o).parent().nextAll('span').hide();
            $(o).parent().parent().css('padding','0');
            var items = $("#assPerfId[value='"+id+"'] ~ tbody tr.new_assesment");

            for(var i=0; i<=items.length; i++){
                $(items[i]).parent().parent().parent().prev().find('div').css('color','green');
                if($(items[i]).parent().prev("[value='"+type+"']").size()==1){
                    $(items[i]).html(data);
                }
            }*/
            $('.quality_assesment').hide();

        });
	});
	$('.assesmentliE').live("click",function(){
		o = $(this);
		
		id = $(o).parent().next('table:first').find('#assPerfId').val();
		type = $(o).parent().next('table:first').find('#assPerfId').next().val();
		$('.quality_assesment').hide();
		$('tr.new_assesment1').removeClass('new_assesment1').addClass('new_assesment');
		$.post("schoolmodule/ajax/ajax_update.php",{action:"insert_E", assessment:'E', id:id, type:type, pupilId:$('#hidden_pupil_id').val()},function(data){
            $.post("schoolmodule/ajax/ajax.php",{action:"select_info", staffAdmin: "", pupilId: pupilId, StudyGroupID: StudyGroupID },function(data){
                $('#objective_progress').html(data)
            });
/*            $(o).parent().next('table:first').show();
            $(o).parent().nextAll('span').hide();
            $(o).parent().parent().css('padding','0');
            var items = $("#assPerfId[value='"+id+"'] ~ tbody tr.new_assesment");

            for(var i=0; i<=items.length; i++){
                $(items[i]).parent().parent().parent().prev().find('div').css('color','green');
                if($(items[i]).parent().prev("[value='"+type+"']").size()==1){
                    $(items[i]).html(data);
                }
            }*/

            $('.quality_assesment').hide();

        });
	});
	$('.assesmentliF').live("click",function(){
		o = $(this);
		id = $(o).parent().next('table:first').find('#assPerfId').val();
		type = $(o).parent().next('table:first').find('#assPerfId').next().val();
		$('.quality_assesment').hide();
		$('tr.new_assesment1').removeClass('new_assesment1').addClass('new_assesment');
		$.post("schoolmodule/ajax/ajax_update.php",{action:"insert_F", assessment:'F', id:id, type:type, pupilId:$('#hidden_pupil_id').val()},function(data){
            $.post("schoolmodule/ajax/ajax.php",{action:"select_info", staffAdmin: "", pupilId: pupilId, StudyGroupID: StudyGroupID },function(data){
                $('#objective_progress').html(data)
            });
/*            $(o).parent().next('table:first').show();
            $(o).parent().nextAll('span').hide();
            $(o).parent().parent().css('padding','0');
            var items = $("#assPerfId[value='"+id+"'] ~ tbody tr.new_assesment");

            for(var i=0; i<=items.length; i++){
                $(items[i]).parent().parent().parent().prev().find('div').css('color','red');
                if($(items[i]).parent().prev("[value='"+type+"']").size()==1){
                    $(items[i]).html(data);
                }
            }*/
            $('.quality_assesment').hide();

		});
	});
	$('.assesmentliFx').live("click",function(){
		o = $(this);
		id = $(o).parent().next('table:first').find('#assPerfId').val();
		type = $(o).parent().next('table:first').find('#assPerfId').next().val();
		$('.quality_assesment').hide();
		$('tr.new_assesment1').removeClass('new_assesment1').addClass('new_assesment');
		$.post("schoolmodule/ajax/ajax_update.php",{action:"insert_Fx", assessment:'na', id:id, type:type, pupilId:$('#hidden_pupil_id').val()},function(data){
            $.post("schoolmodule/ajax/ajax.php",{action:"select_info", staffAdmin: "", pupilId: pupilId, StudyGroupID: StudyGroupID },function(data){
                $('#objective_progress').html(data)
            });
/*            $(o).parent().next('table:first').show();
            $(o).parent().nextAll('span').hide();
            $(o).parent().parent().css('padding','0');
            var items = $("#assPerfId[value='"+id+"'] ~ tbody tr.new_assesment");

            for(var i=0; i<=items.length; i++){
                $(items[i]).parent().parent().parent().prev().find('div').css('color','green');
                if($(items[i]).parent().prev("[value='"+type+"']").size()==1){
                    $(items[i]).html(data);
                }
            }*/
            $('.quality_assesment').hide();

        });
	});
	
	//click on quality box and select value
	$('#liA').live("click",function(){
		id = $(this).parent().prev().val();
		$.post("schoolmodule/ajax/ajax_update.php",{action:"insert_quality_A", assessment:'A', id:id});
		$(this).parent().parent('td#tdquality').css('background-color','#CBE6BD');
		$(this).parent().next('span.quality').text("A").css('color','green');
	});
	$('#liB').live("click",function(){
		id = $(this).parent().prev().val();
		$.post("schoolmodule/ajax/ajax_update.php",{action:"insert_quality_B", assessment:'B', id:id});
		$(this).parent().parent('td#tdquality').css('background-color','#CBE6BD');
		$(this).parent().next('span.quality').text("B").css('color','green');
	});
	$('#liC').live("click",function(){
		id = $(this).parent().prev().val();
		$.post("schoolmodule/ajax/ajax_update.php",{action:"insert_quality_C", assessment:'C', id:id});
		$(this).parent().parent('td#tdquality').css('background-color','#CBE6BD');
		$(this).parent().next('span.quality').text("C").css('color','green');
	});
	$('#liD').live("click",function(){
		id = $(this).parent().prev().val();
		$.post("schoolmodule/ajax/ajax_update.php",{action:"insert_quality_D", assessment:'D', id:id});
		$(this).parent().parent('td#tdquality').css('background-color','#CBE6BD');
		$(this).parent().next('span.quality').text("D").css('color','green');
	});
	$('#liE').live("click",function(){
		id = $(this).parent().prev().val();
		$.post("schoolmodule/ajax/ajax_update.php",{action:"insert_quality_E", assessment:'E', id:id});
		$(this).parent().parent('td#tdquality').css('background-color','#CBE6BD');
		$(this).parent().next('span.quality').text("E").css('color','green');
	});
	$('#liF').live("click",function(){
		id = $(this).parent().prev().val();
		$.post("schoolmodule/ajax/ajax_update.php",{action:"insert_quality_F", assessment:'F', id:id});
		$(this).parent().parent('td#tdquality').css('background-color','#f4726d');
		$(this).parent().next('span.quality').text('F').css('color','white');
	});
	$('#liFx').live("click",function(){
		id = $(this).parent().prev().val();
		$.post("schoolmodule/ajax/ajax_update.php",{action:"insert_quality_", assessment:'-', id:id});
		$(this).parent().parent('td#tdquality').css('background-color','#F5EAB2');
		$(this).parent().next('span.quality').text('-').css('color','black');
	});
	
	/*$('tr.new_assesment').live("mouseover",function(){
		$(this).parent().parent().prev('.new_assesment_before').val( $(this).html() );
		$(this).replaceWith("<tr class='new_assesment1'>"
								+"<td class='assesment_F' style='width: 22%; text-align:right;'><span style='margin-right: 3px;'>F</span></td>"
								+"<td class='assesment_E' style='width: 16%;'>E</td>"
								+"<td class='assesment_D' style='width: 16%;'>D</td>"
								+"<td class='assesment_C' style='width: 16%;'>C</td>"
								+"<td class='assesment_B' style='width: 16%;'>B</td>"
								+"<td class='assesment_A' style='width: 16%;'>A</td>"
							+"</tr>");
		
		//htmlstr = $('tr.new_assesment1').parent().parent().prev('.new_assesment_before').val();
	});
	$('tr.new_assesment1').live("mouseout",function(){
		//$(this).html(htmlstr).removeClass('new_assesment1').addClass('new_assesment');
		htmlstr = $(this).parent().parent().prev('.new_assesment_before').val();
		console.log(htmlstr)
		o = $(this);
		setTimeout( function(){ $(o).html(htmlstr).removeClass('new_assesment1').addClass('new_assesment');}, 500 );
	});*/
			
	// hover mouse on "not assesment"
	$("tr.noAssesment").live("mouseover",function(){
		//$(this).css("opacity","0.7");
		//$(this).addClass('assesmentOver');
	});
	$("tr.noAssesment").live("mouseout",function(){
		//$(this).css("opacity","1");
		//$(this).removeClass('assesmentOver');
	});
	
	//hover mouse on assesment
	$("tr.new_assesment").live("mouseover",function(){
		//$(this).children().css("opacity","0.7");
	});
	$("tr.new_assesment").live("mouseout",function(){
		//$(this).children().css("opacity","1");
	});
	
	// hover mouse on "not assesment"
	$('td.assesment_F').live("mouseover",function(){
		//$(this).css("background-color","#F4726D");
		$(this).removeClass('assesment_F').addClass('assesment_F1');
	});
	$('td.assesment_F1').live("mouseout",function(){
		//$(this).css("background-color","#f5eab2");
		$(this).removeClass('assesment_F1').addClass('assesment_F');
	});
	
	$('td.assesment_E').live("mouseover",function(){
		//$(this).css("background-color","green");
		$(this).removeClass('assesment_E').addClass('assesment_E1');
	});
	$('td.assesment_E1').live("mouseout",function(){
		//$(this).css("background-color","#f5eab2");
		$(this).removeClass('assesment_E1').addClass('assesment_E');
	});
	
	$('td.assesment_D').live("mouseover",function(){
		//$(this).css("background-color","green");
		$(this).removeClass('assesment_D').addClass('assesment_D1');
	});
	
	$('td.assesment_D1').live("mouseout",function(){
		//$(this).css("background-color","#f5eab2");
		$(this).removeClass('assesment_D1').addClass('assesment_D');
	});
	$('td.assesment_C').live("mouseover",function(){
		//$(this).css("background-color","green");
		$(this).removeClass('assesment_C').addClass('assesment_C1');
	});
	$('td.assesment_C1').live("mouseout",function(){
		//$(this).css("background-color","#f5eab2");
		$(this).removeClass('assesment_C1').addClass('assesment_C');
	});
	
	$('td.assesment_B').live("mouseover",function(){
		//$(this).css("background-color","green");
		$(this).removeClass('assesment_B').addClass('assesment_B1');
	});
	$('td.assesment_B1').live("mouseout",function(){
		//$(this).css("background-color","#f5eab2");
		$(this).removeClass('assesment_B1').addClass('assesment_B');
	});
	
	$('td.assesment_A').live("mouseover",function(){
		//$(this).css("background-color","green");
		$(this).removeClass('assesment_A').addClass('assesment_A1');
	});
	$('td.assesment_A1').live("mouseout",function(){
		//$(this).css("background-color","#f5eab2");
		$(this).removeClass('assesment_A1').addClass('assesment_A');
	});
	
	//click mouse on "not assesment" and install assesment
	$('td.assesment_F1').live("click",function(){
		o = $(this);
		id = $(o).parent().parent().prev().val();
		$.post("schoolmodule/ajax/ajax_update.php",{action:"insert_F", assessment:'F', id:id},function(data){
			$(o).parent().parent().parent().prev().val( data );
			$(o).parent().empty().html(data);
		});
	});
	$('td.assesment_E1').live("click",function(){
		o = $(this);
		id = $(o).parent().parent().prev().val();
		$.post("schoolmodule/ajax/ajax_update.php",{action:"insert_E", assessment:'E', id:id},function(data){
			$(o).parent().parent().parent().prev().val( data );
			$(o).parent().empty().html(data);
		});
	});
	$('td.assesment_D1').live("click",function(){
		o = $(this);
		id = $(o).parent().parent().prev().val();
		$.post("schoolmodule/ajax/ajax_update.php",{action:"insert_D", assessment:'D', id:id},function(data){
			$(o).parent().parent().parent().prev().val( data );
			$(o).parent().empty().html(data);
		});
	});
	$('td.assesment_C1').live("click",function(){
		o = $(this);
		id = $(o).parent().parent().prev().val();
		$.post("schoolmodule/ajax/ajax_update.php",{action:"insert_C", assessment:'C', id:id},function(data){
			$(o).parent().parent().parent().prev().val( data );
			$(o).parent().empty().html(data);
		});
	});
	$('td.assesment_B1').live("click",function(){
		o = $(this);
		id = o.parent().parent().prev().val();
		$.post("schoolmodule/ajax/ajax_update.php",{action:"insert_B", assessment:'B', id:id},function(data){
			$(o).parent().parent().parent().prev().val( data );
			$(o).parent().empty().html(data);
		});
	});
	$('td.assesment_A1').live("click",function(){
		o = $(this);
		id = $(o).parent().parent().prev().val();
		$.post("schoolmodule/ajax/ajax_update.php",{action:"insert_A", assessment:'A', id:id},function(data){
			$(o).parent().parent().parent().prev().val( data );
			$(o).parent().empty().html(data);
		});
	});
	
});