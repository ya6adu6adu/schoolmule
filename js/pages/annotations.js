/**
 * Created with JetBrains PhpStorm.
 * User: Chehow
 * Date: 15.08.13
 * Time: 10:58
 * To change this template use File | Settings | File Templates.
 */
$(function(){
    schoolmule.main.callback = showAnnotationPage;
    if(schoolmule.main.user_id==null){
        schoolmule.main.showLogin();
    }else{
        showAnnotationPage();
        checkUserActivityEvents();
    }
});

function showAnnotationPage(){
    /*script for result grud updates*/
    var script = "connectors/connector.php?control_id=grid_assess_assignments";

    var numbs = "";
    var counter = $('#result_cunter');
    var removeConf = "<span class='remove_note'></span>"

    var oldnotes = true;
    var set_assess = $('#setassessment');

    $("title").html(dlang("flexpaper_page_title","File Annotation"));

    schoolmule.instances.grid_result_annotate.attachTo('results_grid',{
        pupil:pupil,
        assignment:assign
    });

    var grid = schoolmule.instances.grid_result_annotate.getGrid().grid;

    $(window).on('beforeunload', function() {
        return dlang("close_anotation_alert","You kept all the changes?");
    });

    if(role!='superadmin' && role!='staff'){
        grid.setEditable(false);
        set_assess.attr('disabled', 'disabled');
        $('.comments').remove();
        grid.setColumnHidden(4,true);
        grid.setColWidth(3,'66');
    }else{
        for(var i=1; i<101;i++){
            numbs+='<div class="number">'+i+'</div>';
        }
        counter.append(numbs);

        $('.number').click(function(){
            var id = grid.getSelectedRowId();
            var val = parseInt($(this).html());
            schoolmule.instances.grid_result_annotate.setNewResult(val+(grid.cells(id,3).getValue()?parseInt(grid.cells(id,3).getValue()):0), grid.cells(id,3).getValue(), id, 2);
            counter.fadeOut(200);
        });

        $(document).click( function(event){
            if( $(event.target).closest("#result_cunter").length )
                return;
            counter.fadeOut(200);
            event.stopPropagation();
        });

        $(".flexpaper_note").live("mouseenter", function(){
            var elem = $(removeConf);
            elem.click(function(){
                $FlexPaper('paperViwer').removeSelectedMark();
            })
            $(this).find("div:first").append(elem);
        });

        $(".flexpaper_note").live("mouseleave", function(e){
            $(this).find("div:first").empty();
        });
    }

    var prevmarks = "";

    var option = "<option  value=''></option>";

    var asessments = ['A','B','C','D','E','F','Fx'];

    for(var i=0; i<asessments.length; i++){
        option += "<option value='"+(asessments[i])+"'>"+(asessments[i])+"</option>";
    }


    set_assess.append(option);
    set_assess.change(function(){
        var val = $(this).val();
        setAssessmentValue(val);
        var id = grid.getSelectedRowId().split('_');
        $.post("connectors/connector.php?control_id=grid_assess_assignments", {action:"editgrade", id:id[1], value:val}, function(){})
    });

    function saveMarks(){
        alert(dlang("save_submision_alert_2","Annotated PDF is saved to submissions list. You need to Publish the PDF before the Pupil can see it"));
        var marks = JSON.stringify($FlexPaper('paperViwer').getMarkList());
        $.post("libs/addcomment.php", {action:"add_marks", marks:marks, file:fileid}, function(response){});
    }

    $('#textbtn').click(function(){
        /*var mark = {
         note: "",
         pageIndex:1,
         //positionX:30,
         //positionY:30,
         width:200,
         height:200,
         collapsed:false,
         readonly:false,
         displayFormat:'html',
         type: 'note'
         };*/

        //$FlexPaper('paperViwer').addMark(mark);
        $('.flexpaper_bttnComment').click();
    });

    $('div#prev').click(function(){
        $FlexPaper('paperViwer').prevPage();
    });

    $('div#next').click(function(){
        $FlexPaper('paperViwer').nextPage()
    });

    //$('textarea.runitinp').autosize();

    //$('.flex_pic').hover(
    //    function(){
    //        $(this).find('span').addClass('hover-item');
    //    },
    //    function(){
    //        $(this).find('span').removeClass('hover-item');
    //    }
    //);

    $('.page_pic').click(function(){
        var img = $(this).find("img"), twoPagePic = $('.2page_pic').find('img'), manyPagePic = $('.many_page_pic').find('img');
        $FlexPaper('paperViwer').switchMode("Portrait");
        //$(this).find('span').css('display','inline');
        if(!img.hasClass("selected")){
            //img.removeClass("selected").attr('src', 'images/flexpaper/fit.png').css({
            //    margin: "2px 1.5px",
            //    position: "relative"
            //});
            img.addClass("selected").attr('src', 'images/flexpaper/one_page_selected.png').css({
                margin: "1.5px 2.5px",
                position: "relative"
            });
            twoPagePic.removeClass("selected").css("margin","3px 1px").attr("src","images/flexpaper/twodocuments.png");
            manyPagePic.removeClass("selected").css("margin","3px").attr("src","images/flexpaper/thumbs.png");
        }
    });

    $('.2page_pic').click(function(){
        var img = $(this).find("img"), pagePic = $('.page_pic').find('img'), manyPagePic = $('.many_page_pic').find('img');
        $FlexPaper('paperViwer').switchMode("TwoPage");
        if(!img.hasClass("selected")){
            img.addClass("selected").css({
                margin: "1.5px 2.5px",
                position: "relative"
            }).attr('src', 'images/flexpaper/twopages_selected.png');
            pagePic.removeClass("selected").css("margin","3px 3.5px").attr("src","images/flexpaper/document.png");
            manyPagePic.removeClass("selected").css("margin","3px").attr("src","images/flexpaper/thumbs.png");
        }
    });

    $('.many_page_pic').click(function(){
        var img = $(this).find("img"), pagePic = $('.page_pic').find('img'), twoPagePic = $('.2page_pic').find('img');
        $FlexPaper('paperViwer').switchMode("Tile");
        if(!img.hasClass("selected")){
            img.addClass("selected").css({
                margin: "1.5px 2.5px",
                position: "relative"
            }).attr('src', 'images/flexpaper/thumbs_selected.png');
            pagePic.removeClass("selected").css("margin","3px 3.5px").attr("src","images/flexpaper/document.png");
            twoPagePic.removeClass("selected").css("margin","3px 1px").attr("src","images/flexpaper/twodocuments.png");
        }
    });

    $('.fullscreen_pic').click(function(){
        $FlexPaper('paperViwer').showFullScreen();
    });

    $('.fill_vert_pic').click(function(){
        var img = $(this).find("img"), fillHorisPic = $('.fill_hor_pic').find('img');
        if(!img.hasClass("selected")){
            img.addClass("selected").css({
                margin: "0.5px 3px",
                position: "relative"
            }).attr('src', 'images/flexpaper/fit_vert_selected.png');
            fillHorisPic.removeClass("selected").css("margin","2px 0").attr("src","images/flexpaper/fit.png");
        }
        $FlexPaper('paperViwer').fitHeight()
    });

    $( "#slider" ).slider({
        animate: "fast",
        min:0.1,
        max:5,
        step:0.1,
        value:0.9,
        slide: function( event, ui ) {
            $FlexPaper('paperViwer').setZoom(ui.value)
        }
    });

    $('.fill_hor_pic').click(function(){
        $FlexPaper('paperViwer').fitWidth();
        //$(this).find('span').css('display','inline');
//        $('.fill_vert_pic').find('span').hide();
        var img = $(this).find("img"), fillVertPic = $('.fill_vert_pic').find('img');
        if(!img.hasClass("selected")){
            img.addClass("selected").css({
                margin: "2px 0",
                position: "relative"
            }).attr('src', 'images/flexpaper/fit_horis_selected.png');
            fillVertPic.removeClass("selected").css("margin","2px").attr("src","images/flexpaper/pagefit.png");
        }
    });

    $('.rotate_pic').click(function(){
        $FlexPaper('paperViwer').rotate();
    });

    $('.select_pic').click(function(){
        $FlexPaper('paperViwer').setCurrentCursor('TextSelectorCursor');
        //$(this).find('span').css('display','inline');
        var img = $(this).find("img"), movePic = $('.move_pic').find('img');
        if(!img.hasClass("selected")){
            img.addClass("selected").css({
                margin: "1.5px 0.5px",
                position: "relative"
            }).attr('src', 'images/flexpaper/textselect_selected.png');
            movePic.removeClass("selected").css("margin","3px 3.5px").attr("src","images/flexpaper/hand.png");
        }
        deselectActiveAnnotationInstrument();
    });

    $('.move_pic').click(function(){
        var img = $(this).find("img"), selectPic = $('.select_pic').find('img');
        $FlexPaper('paperViwer').setCurrentCursor('ArrowCursor');
        if(!img.hasClass("selected")){
            img.addClass("selected").css({
                margin: "1px 2px",
                position: "relative"
            }).attr('src', 'images/flexpaper/hand_selected.png');
            selectPic.removeClass("selected").css("margin","2px 1.5px").attr("src","images/flexpaper/textselect.png");
        }
        deselectActiveAnnotationInstrument();
    });

    $(".show_pic").click(function() {
        var img = $(this).find("img");
        if(img.hasClass("selected")){
            img.removeClass("selected").attr('src', 'images/flexpaper/View_annotation_dissabled.png').css({
                margin: "4.5px 1.5px",
                position: "relative"
            });

        }else{
            img.addClass("selected").attr('src', 'images/flexpaper/View_annotation_active.png').css({
                margin: "3px 1.5px",
                position: "relative"
            });
        }
        $('.flexpaper_bttnShowHide').click();
        }
    );

    $('.comment_pic').click(function(){
/*        $FlexPaper('paperViwer').addNote();
        if($(this).find('span').css('display')=='none'){
            $(this).find('span').css('display','inline');
        }else{
            $(this).find('span').css('display','none');
        }
        $('.draw_pic').find('span').hide();
        $('.highlightfill_vert_pic').find('span').hide();
        $('.strike_pic').find('span').hide();*/
        var img = $(this).find("img"), drawPic = $('.draw_pic').find("img"), highLight = $('.highlightfill_vert_pic').find("img"), strikePic = $('.strike_pic').find("img");
        if(!img.hasClass("selected")){
            img.addClass("selected");
            img.css({margin: "1.5px", position: "relative"}).attr("src","images/flexpaper/comment_selected.png");
            drawPic.removeClass("selected").css({margin:"2px 3px", position: "relative"}).attr("src","images/flexpaper/pen.png");
            highLight.removeClass("selected").css({margin: "2px 3px", position: "relative"}).attr("src","images/flexpaper/highlight.png");
            strikePic.removeClass("selected").css({margin: "3.5px", position: "relative"}).attr("src","images/flexpaper/Strike_through.png");
        }
        showCommentMode(this);
        deselectActiveMoveInstrument();
    });

    function showCommentMode(item,mode){
        //$FlexPaper('paperViwer').enableStrikeout();
        if(!mode)
            $(item).find('span').css('display','inline');
        else $(item).find('span').css('display','none');

        $('.draw_pic').find('span').hide();
        $('.highlightfill_vert_pic').find('span').hide();
        $('.strike_pic').find('span').hide();

        $FlexPaper('paperViwer').addNote();
    }

    $('.draw_pic').click(function(){
        var img = $(this).find("img"), commentPic = $('.comment_pic').find("img"), highLight = $('.highlightfill_vert_pic').find("img"), strikePic = $('.strike_pic').find("img");
        if(!img.hasClass("selected")){
            img.addClass("selected");
            img.css({margin:"1.5px 0.5px", position: "relative"}).attr("src","images/flexpaper/pen_selected.png");
            highLight.removeClass("selected").css({margin: "2px 3px", position: "relative"}).attr("src","images/flexpaper/highlight.png");
            strikePic.removeClass("selected").css({margin: "3.5px", position: "relative"}).attr("src","images/flexpaper/Strike_through.png");
            commentPic.removeClass("selected").css({margin: "2px 1.5px", position: "relative"}).attr("src","images/flexpaper/comment.png");
        }
        showDravMode(this);
        deselectActiveMoveInstrument();
        //$FlexPaper('paperViwer').enableDrawMode('blue');
    });

    $('.highlightfill_vert_pic').click(function(){
        var img = $(this).find("img"), commentPic = $('.comment_pic').find("img"),  strikePic = $('.strike_pic').find("img"), drawPic = $('.draw_pic').find("img");
        if(!img.hasClass("selected")){
            img.addClass("selected");
            img.css({margin: "1.5px 0.5px", position: "relative"}).attr("src","images/flexpaper/highlight_selected.png");
            drawPic.removeClass("selected").css({margin:"2px 3px", position: "relative"}).attr("src","images/flexpaper/pen.png");
            strikePic.removeClass("selected").css({margin: "3.5px", position: "relative"}).attr("src","images/flexpaper/Strike_through.png");
            commentPic.removeClass("selected").css({margin: "2px 1.5px", position: "relative"}).attr("src","images/flexpaper/comment.png");
        }
        showHighlightMode(this);
        deselectActiveMoveInstrument();
    });

    $('.strike_pic').click(function(){
        var img = $(this).find("img"), commentPic = $('.comment_pic').find("img"),  drawPic = $('.draw_pic').find("img"), highLight = $('.highlightfill_vert_pic').find("img");
        if(!img.hasClass("selected")){
            img.addClass("selected");
            img.css({margin: "3px 1.5px", position: "relative"}).attr("src","images/flexpaper/strikethrough_selected.png");
            highLight.removeClass("selected").css({margin: "2px 3px", position: "relative"}).attr("src","images/flexpaper/highlight.png");
            drawPic.removeClass("selected").css({margin:"2px 3px", position: "relative"}).attr("src","images/flexpaper/pen.png");
            commentPic.removeClass("selected").css({margin: "2px 1.5px", position: "relative"}).attr("src","images/flexpaper/comment.png");
        }
        showStrikeMode(this);
        deselectActiveMoveInstrument();
    });

    function showDravMode(item,mode){
        $('.flexpaper_bttnDraw').click();

        if(!mode)
            $(item).find('span').css('display','inline');
        else $(item).find('span').css('display','none');

        $('.comment_pic').find('span').hide();
        $('.highlightfill_vert_pic').find('span').hide();
        $('.strike_pic').find('span').hide();
    }

    function showHighlightMode(item,mode){
        //$FlexPaper('paperViwer').enableHighlighter('red');
        if(!mode)
            $(item).find('span').css('display','inline');
        else $(item).find('span').css('display','none');
        $('.comment_pic').find('span').hide();
        $('.draw_pic').find('span').hide();
        $('.strike_pic').find('span').hide();
        $('.flexpaper_bttnHighlight').click();
    }

    function showStrikeMode(item,mode){
        //$FlexPaper('paperViwer').enableStrikeout();
        if(!mode)
            $(item).find('span').css('display','inline');
        else $(item).find('span').css('display','none');
        $('.comment_pic').find('span').hide();
        $('.draw_pic').find('span').hide();
        $('.highlightfill_vert_pic').find('span').hide();
        $('.flexpaper_bttnStrikeout').click();
    }


    $('.delete_pic').click(function(){
        $FlexPaper('paperViwer').removeSelectedMark();
    });

    $('.print').click(function(){
        $FlexPaper('paperViwer').printPaper();
    });

    $('.draw_search').click(function(){
        $FlexPaper('paperViwer').searchText($("#search_input").val());
    });


    function deselectActiveMoveInstrument(){
        var items = ['select_pic','move_pic'];
        for(var i=0; i<items.length; i++){
            if($('.'+items[i]).find('span').css('display')!='none'){
                $('.'+items[i]).find('span').css('display','none');
            }
        }
    }

    function deselectActiveAnnotationInstrument(){

        var items = ['strike_pic','highlightfill_vert_pic','draw_pic','comment_pic'];
        for(var i=0; i<items.length; i++){
            if($('.'+items[i]).find('span').css('display')!='none'){
                switch(i){
                    case 0:
                        showStrikeMode($('.'+items[i]),true);
                        break;
                    case 1:
                        showHighlightMode($('.'+items[i]),true);
                        break;
                    case 2:
                        showDravMode($('.'+items[i]),true);
                    case 3:
                        showCommentMode($('.'+items[i]),true);
                        break;
                }
            }
        }
    }

    function saveDoc(){
        var publish_text = dlang("annotation_publish_confirm2","Do you want to publish the annotation ? This will be visible to the Pupil.");
        if(role!='superadmin' && role!='staff'){
            publish_text = dlang("annotation_publish_confirm3","Do you want to publish the annotation ?.");
        }
        seconfirm(publish_text,function(){
            var marks = JSON.stringify($FlexPaper('paperViwer').getMarkList());
            var d = new Date();
            var ttt = d.toString();
            var comments = $('#comments_text').val();
            var notes = $('#private_notes_text').val();
            $.post("libs/addcomment.php", {
                action:"publish_marks",
                comments:comments,
                notes:notes,
                grade:set_assess.val(),
                marks:marks,
                file:fileid,
                assign:assign,
                pupil:pupil,
                user:user,
                username:username,
                date:ttt.split(' GMT')[0]
            }, function(response){
            });
        })
    }

    function cancelDoc(){
        $FlexPaper('paperViwer').clearMarks();
        $FlexPaper('paperViwer').addMarks(prevmarks);
    }

    var lng = 'en_US';

    switch(gl_user_lang){
        case 'en':
            lng = 'en_US';
            break;
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

    $('#paperViwer').FlexPaperViewer(
        {
            config : {
                PDFFile : file,
                Scale : 1,
                ZoomTransition : 'easeOut',
                ZoomTime : 0.5,
                ZoomInterval : 0.1,
                localeDirectory:"flexpaper/locale/",
                FitPageOnLoad : true,
                FitWidthOnLoad : false,
                StickyTools : true,
                FullScreenAsMaxWindow : false,
                ProgressiveLoading : false,
                MinZoomSize : 0.2,
                MaxZoomSize : 5,
                SearchMatchAll : false,
                InitViewMode : 'Portrait',
                RenderingOrder : 'html5,flash',
                StartAtPage : '',
                AnnotationToolsVisible:true,
                NavToolsVisible:false,
                BackgroundColor:"red",
                WMode : 'window',
                localeChain: lng
            }
        }
    );

    $('#paperViwer').bind('onDocumentLoaded',function(e,totalPages){
        $('#toolbar_paperViwer *').hide();
        $('#toolbar_paperViwer_annotations *').hide();

        var option = "<option>"+dlang("goto_page_select","Goto Page")+"</option>";
        for(var i=0; i<totalPages; i++){
            option += "<option value='"+(i+1)+"'>"+(i+1)+"</option>";
        }
        var gotopage = $('#gotopage');
        gotopage.append(option);
        gotopage.change(function(){
            var val = parseInt($(this).val());
            if(!isNaN(val)){
                $FlexPaper('paperViwer').gotoPage(val);
            }
            setPagesValue(val);

        });

        //$('.flexpaper_bttnHighlight, .flexpaper_bttnComment, .flexpaper_bttnStrikeout, .flexpaper_bttnDraw').hide();
        $(".flexpaper_note").mouseover(function(){
            $(".flexpaper_note").removeClass('flexpaper_note_selected');
            return false;
        });
        $(".flexpaper_note").click(function(){
            $(".flexpaper_note").removeClass('flexpaper_note_selected');
            return false;
        });

        $.post("libs/addcomment.php", {action:"get_marks", file:fileid}, function(response){
            if(response.pbl || role=='superadmin' || role=='staff' || role=='admin'){
                if(response.marks){
                    $FlexPaper('paperViwer').addMarks(JSON.parse(response.marks));
                }
            }
            if(role=='superadmin' || role=='staff' || role=='admin'){

                $('#comments_text').text(response.comment_text);
                $('#private_notes_text').text(response.private_notes);
            }
        },'json');

        if(role!='superadmin' && role!='staff'){
            $('#paperViwer').bind('DOMSubtreeModified', function(){
                if(oldnotes){
                    var notes =  $(".flexpaper_note");
                    if(notes){
                        notes.draggable("disable");
                        notes.resizable( "disable");
                        notes.css({
                            opacity:1
                        })
                    }

                    $('#paperViwer textarea').focus(function (e) {
                        this.blur();
                        return false;
                    })
                }
            });
            //$('#toolbar_paperViwer_annotations').empty();
        }
        $('#paperViwer').bind('DOMSubtreeModified', function(){
            /*for(var i=0; i<prevmarks.length; i++){
             if(prevmarks[i].type == 'note'){

             alert($('#'+prevmarks[i].id+'_block').size());
             }
             }*/
            $('#pagesContainer_paperViwer').next().hide();
            $('.flexpaper_floatright.flexpaper_bttnI').hide();
        })
    });


    $('#paperViwer').bind('onMarkCreated',function(e,mark){
        //$('.comment_pic').find('span').hide();

        if(mark.type=="note"){
            window.setTimeout(function(){
                $FlexPaper('paperViwer').addNote();
            }, 1000)
        }
        oldnotes = false;
    });

    $("#save_button").click(function(){
        saveMarks();
    });

    $("#publish_button").click(function(){
        saveDoc();
    });

    $("#cancel_button").click(function(){
        cancelDoc();
    });
}

function checkUserActivityEvents(){
    if(opener.setUserActivity) {
        opener.bindEvents(window.document);
    }
}

function setPagesValue(val){
    var span = $("#number_page");
    if(val) {
        span.text(val);
    }else {
        span.text(dlang("goto_page_select","Goto Page"));
    }
    return true;
}
function setAssessmentValue(val){
    $("#assesment").text(val);
    return true;
}