/**
 * Created with JetBrains PhpStorm.
 * User: Chehow
 * Date: 20.05.13
 * Time: 14:44
 * Grid development page
 */

var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.grid_development = new schoolmule.controls.grid({
    id: "grid_development",
    gridImagePath:"dhtmlx/dhtmlxGrid/codebase/imgs/",
    menuIconsPath:"dhtmlx/dhtmlxMenu/codebase/imgs/dhxmenu_dhx_web/",
    dp:false,

    addRow: function(rId,cn,dhx){
    },

    selectRow: function(ind, id, dhx){
        if(ind==7){
            var text = dlang("develop_grid_flag_confirm_text_deact","Deactivate flag?");
            var tree = schoolmule.instances.tree_assessments_overview.getTree();
            var pupil = tree.getSelectedItemId().split('_')[1];
            var action = "activate";
            if(dhx.grid.cells(id,7).getValue().indexOf('gfx/flagred.png')+1){
                text = dlang("develop_grid_flag_confirm_text_act","Activate flag?");
            }
            seconfirm(text,function(){
                if(dhx.grid.cells(id,7).getValue().indexOf('gfx/flagred.png')+1){
                    action = "activate";
                    dhx.grid.cells(id,7).setValue('gfx/flag.png');
                }else{

                    action = "deactivate";
                    dhx.grid.cells(id,7).setValue('gfx/flagred.png');
                }
                $.post("connectors/connector.php?control_id=grid_development", {action:action, stg: id.split('_')[1], pupil:pupil}, function(response){
                });
                dhx.grid.clearSelection();
            },function(){
                dhx.grid.clearSelection();
            });
        }
        return true;
    },

    openEnd: function(id, state, grid){
        var _id = id.split('_');
        grid.setSizes();
        return true;
    },

    openTree: function(id,dhx,state,pid){
        $(".ev_dhx_skyblue").next(".odd_dhx_skyblue").next(".ev_dhx_skyblue").removeClass('norowselected');
        var nsel = $(".ev_dhx_skyblue").next(".odd_dhx_skyblue").next(".ev_dhx_skyblue");
        while(nsel.next(".ev_dhx_skyblue").size()>0){
            nsel = nsel.next(".ev_dhx_skyblue")
            nsel.removeClass('norowselected');
        }

        var ids = dhx.grid.getSelectedRowId();
        if(ids){
            var _id = ids.split("_");

            if((_id[0]=="studygroup")){
                dhx.grid.clearSelection();
            }
        }
    },

    beforeSelectRow:  function(id,dhx,keysel){
        var _id = id.split("_");
        if(_id[0]=="studygroup"){
            var caell = dhx.grid.cells(id,1).cell;
            $(caell).parent().addClass('norowselected');
            return true;
        }else{
            return false;
        }

    },

    load: function(grid){
        grid.expandAll();
        grid.forEachRow(function(id){
            var _id = id.split('_');
            if(_id[0]=='statistics'){
                grid.openItem(id);
                var cont = grid.getSubItems(id);
                var cell = grid.cells(cont,0).cell;
                cell = $(cell).find('div');
                if($(cell).find('.development_charts').size()!=0){
                    return true;
                }
                var charts = JSON.parse($(cell).find('span').text());
                $(cell).css({'height':'200px', padding:0,display:'block'});
                cell.empty();
                cell.css('background','#f8f7f5');

                cell.append('<div class="development_charts">' +
                    '<div class="assignment_charts" id="assignment_chart_'+charts.ochart.id+'"></div>' +
                    '<div class="ovjecive_chart" id="ovjecive_chart_'+charts.ochart.id+'"></div>' +
                    '</div>');

                var charto = new schoolmule.controls.chart(schoolmule.instances.chart_stats);
                charto.appendTo('assignment_chart_'+charts.ochart.id,charts.obja.maxday);
                if(charts.obja){
                    charto.setData(charts.obja[0],'json');
                }

                var chart = new dhtmlXChart({
                    view: "pie",
                    container: 'ovjecive_chart_'+charts.ochart.id,
                    value: "#weight#",
                    color: "#color#",
                    shadow: 0.1,
                    labelOffset:30,
                    label: function(obj) {
                        return "<div style='font-size: 11px;  color: #666;'>" + obj.obj + "</div>";
                    },
                    pieInnerText: "<sapn class='label' style='font-size: 11px; color: #FFF; font-weight: bold;'>#grade#</sapn>"
                });
                content.elements.push(chart);
                content.elements.push(charto);
                chart.parse(charts.ochart.objectives, "json");
                grid.closeItem(id);
            }
            if(_id[0]=='iup'){
                grid.openItem(id);
                var cont = grid.getSubItems(id);
                var cell = grid.cells(cont,0).cell;
                cell = $(cell).find('div');
                if($(cell).find('.development_iup').size()!=0){
                    return true;
                }
                var values = JSON.parse($(cell).find('span').text());
                $(cell).css({'height':'380px', padding:0,display:'block'});
                cell.empty();
                cell.css('background','#f8f7f5');
                cell.append('<div class="development_iup">' +
                    '<div id="dev_evaluation_'+_id[1]+'_'+_id[2]+'">' +
                    '<p>'+dlang("dev_grid_print_ev","Evaluation")+':</p><textarea rows="10" cols="45">'+values.eval+'</textarea>' +
                    '</div>' +
                    '<div id="dev_goal_'+_id[1]+'_'+_id[2]+'">' +
                    '<p>'+dlang("dev_grid_print_dg","Development goal")+':</p>' +
                    '<textarea rows="10" cols="45" >'+values.devel+'</textarea></div>' +
                    '<div id="dev_plan'+_id[1]+'_'+_id[2]+'">' +
                    '<p>'+dlang("dev_grid_print_plan","Plan")+':</p>' +
                    '<textarea rows="10" cols="45">'+values.plan+'</textarea></div>' +
                    '<div ><button id="dev_button_'+_id[1]+'_'+_id[2]+'" class="button">'+dlang("devel_grid_save","Save")+'</button><button id="dev_button_print'+_id[1]+'_'+_id[2]+'" class="button">'+dlang("devel_grid_print","Print")+'</button></div>' +
                    '</div>');
                $('.development_iup textarea').autosize();
                $('.development_iup textarea').click(function(){
                    return false;
                });

                $(cell).css({'height':'auto', padding:'0 0 10px'});
                $("#dev_button_"+_id[1]+'_'+_id[2]).click(function(){
                    var eval = $("#dev_evaluation_"+_id[1]+'_'+_id[2]+' textarea').val();
                    var goal = $("#dev_goal_"+_id[1]+'_'+_id[2]+' textarea').val();
                    var plan = $("#dev_plan"+_id[1]+'_'+_id[2]+' textarea').val();
                    $.post("connectors/connector.php?control_id=grid_development", {action:"saveinfo", stg: _id[2], pupil:_id[1] , eval:eval, goal:goal, plan:plan}, function(response){

                    });
                    return false;
                });
                $("#dev_button_print"+_id[1]+'_'+_id[2]).click(function(){
                    var eval = $("#dev_evaluation_"+_id[1]+'_'+_id[2]+' textarea').val();
                    var goal = $("#dev_goal_"+_id[1]+'_'+_id[2]+' textarea').val();
                    var plan = $("#dev_plan"+_id[1]+'_'+_id[2]+' textarea').val();

                    var pupil = $('.template #pupil_name span').text()+($('.template #id span').text()==""?"":" ("+$('.template #id span').text()+")")+" "+$('.template #pupilgroup_head span').text();
                    pupil = $('#main-box-header').html();
                    var html = "\
                        <html>\
                            <head>\
                                <meta http-equiv='Content-Type' content='text/html; charset=utf-8'/>\
                            </head>\
                            <style>\
                                .teblock{width:100%;min-height:100px; background-color: #919191; margin-bottom: 30px; border: 1px solid #919191}\
                                body{font-family: Arial; font-size: 12px;}\
                                .first{margin-top: 170px;}\
                            </style>\
                            <body>\
                                <div style='height: 60px; width: 100%;'>"+pupil+"</div>\
                                <p>"+dlang("dev_grid_print_ev","Evaluation")+":</p>\
                                <div class='teblock'>"+eval+"</div>\
                                <p>"+dlang("dev_grid_print_dg","Development goal")+":</p>\
                                <div class='teblock'>"+goal+"</div>\
                                <p>"+dlang("dev_grid_print_plan","Plan")+":</p>\
                                <div class='teblock'>"+plan+"</div>\
                            </body>\
                        </html>\
                        ";
                    var printWindow = window.open('','printWindow','');
                    printWindow.document.open();
                    printWindow.document.write(html);
                    $(printWindow.document.body).find('tbody tr').find('td:eq(7)').remove();
                    printWindow.print();
                    printWindow.close();
                });
                grid.closeItem(id);
            }
            if(_id[0]=='plan'){
                grid.openItem(id);
                var cont = grid.getSubItems(id);
                var cell = grid.cells(cont,0).cell;
                cell = $(cell).find('div');
                if($(cell).find('.development_plan').size()!=0){
                    return true;
                }
                var values = JSON.parse($(cell).find('span').text());
                $(cell).css({'height':'786px', padding:0,display:'block'});
                cell.empty();
                cell.css('background','#f8f7f5');
                cell.append('<div class="development_iup">' +
                    '<div id="dev_support_'+_id[1]+'_'+_id[2]+'">' +
                    '<p>'+dlang("dev_grid_print_supp","Pupil\'s need for support")+':</p><textarea rows="10" cols="45">'+values.support+'</textarea>' +
                    '</div>' +
                    '<div id="dev_long_goal_'+_id[1]+'_'+_id[2]+'">' +
                    '<p>'+dlang("dev_grid_print_ltg","Long-term goals")+':</p>' +
                    '<textarea rows="10" cols="45" >'+values.long_goals+'</textarea></div>' +
                    '<div id="dev_short_goal'+_id[1]+'_'+_id[2]+'">' +
                    '<p>'+dlang("dev_grid_print_stg","Short-term goals")+':</p>' +
                    '<textarea rows="10" cols="45">'+values.short_golas+'</textarea></div>' +
                    '<div id="dev_arrang'+_id[1]+'_'+_id[2]+'">' +
                    '<p>'+dlang("dev_grid_print_arrg","Arrangements")+':</p>' +
                    '<textarea rows="10" cols="45">'+values.arrang+'</textarea></div>' +
                    '<div id="dev_account'+_id[1]+'_'+_id[2]+'">' +
                    '<p>'+dlang("dev_grid_print_acco","Accountable")+':</p>' +
                    '<textarea rows="10" cols="45">'+values.account+'</textarea></div>' +
                    '<div id="dev_evaluate'+_id[1]+'_'+_id[2]+'">' +
                    '<p>'+dlang("dev_grid_print_wahte","When and how to evaluate the action")+':</p>' +
                    '<textarea rows="10" cols="45">'+values.evaluate+'</textarea></div>' +
                    '<div id="dev_other'+_id[1]+'_'+_id[2]+'">' +
                    '<p>'+dlang("dev_grid_print_oinf","Other info")+':</p>' +
                    '<textarea rows="10" cols="45">'+values.other+'</textarea></div>' +
                    '<div id="dev_report'+_id[1]+'_'+_id[2]+'">' +
                    '<p>'+dlang("dev_grid_print_rep","Report")+':</p>' +
                    '<textarea rows="10" cols="45">'+values.report+'</textarea></div>' +
                    '<div ><button id="plan_button_'+_id[1]+'_'+_id[2]+'" class="button">'+dlang("devel_grid_save","Save")+'</button><button id="plan_button_print'+_id[1]+'_'+_id[2]+'" class="button">'+dlang("devel_grid_print","Print")+'</button></div>' +
                    '</div>');
                $('.development_iup textarea').autosize();
                $('.development_iup textarea').click(function(){
                    return false;
                });

                $(cell).css({'height':'auto', padding:'0 0 10px'});
                $("#plan_button_"+_id[1]+'_'+_id[2]).click(function(){
                    var support = $("#dev_support_"+_id[1]+'_'+_id[2]+' textarea').val();
                    var long_golas = $("#dev_long_goal_"+_id[1]+'_'+_id[2]+' textarea').val();
                    var short_goals = $("#dev_short_goal"+_id[1]+'_'+_id[2]+' textarea').val();
                    var account = $("#dev_account"+_id[1]+'_'+_id[2]+' textarea').val();
                    var arrang = $("#dev_arrang"+_id[1]+'_'+_id[2]+' textarea').val();
                    var evaluate = $("#dev_evaluate"+_id[1]+'_'+_id[2]+' textarea').val();
                    var other = $("#dev_other"+_id[1]+'_'+_id[2]+' textarea').val();
                    var report = $("#dev_report"+_id[1]+'_'+_id[2]+' textarea').val();
                    $.post("connectors/connector.php?control_id=grid_development", {
                        action:"saveplan",
                        stg: _id[2],
                        pupil:_id[1],
                        support:support,
                        long_golas:long_golas,
                        short_goals:short_goals,
                        account:account,
                        arrang:arrang,
                        evaluate:evaluate,
                        other:other,
                        report:report
                    }, function(response){

                    });
                    return false;
                });

                $("#plan_button_print"+_id[1]+'_'+_id[2]).click(function(){
                    var support = $("#dev_support_"+_id[1]+'_'+_id[2]+' textarea').val();
                    var long_golas = $("#dev_long_goal_"+_id[1]+'_'+_id[2]+' textarea').val();
                    var short_goals = $("#dev_short_goal"+_id[1]+'_'+_id[2]+' textarea').val();
                    var account = $("#dev_account"+_id[1]+'_'+_id[2]+' textarea').val();
                    var arrang = $("#dev_arrang"+_id[1]+'_'+_id[2]+' textarea').val();
                    var evaluate = $("#dev_evaluate"+_id[1]+'_'+_id[2]+' textarea').val();
                    var other = $("#dev_other"+_id[1]+'_'+_id[2]+' textarea').val();
                    var report = $("#dev_report"+_id[1]+'_'+_id[2]+' textarea').val();

                    var pupil = $('.template #pupil_name span').text()+($('.template #id span').text()==""?"":" ("+$('.template #id span').text()+")")+" "+$('.template #pupilgroup_head span').text();
                    pupil = $('#main-box-header').html();
                    var html = "\
                        <html>\
                            <head>\
                                <meta http-equiv='Content-Type' content='text/html; charset=utf-8'/>\
                            </head>\
                            <style>\
                                .teblock{width:100%;min-height:100px; background-color: #919191; margin-bottom: 30px; border: 1px solid #919191}\
                                body{font-family: Arial; font-size: 12px;}\
                            </style>\
                            <body>\
                                <div style='height: 60px; width: 100%;'>"+pupil+"</div>\
                                <p>"+dlang("dev_grid_print_supp","Pupil's need for support")+":</p>\
                                <div class='teblock first'>"+support+"</div>\
                                <p>"+dlang("dev_grid_print_ltg","Long-term goals")+":</p>\
                                <div class='teblock'>"+long_golas+"</div>\
                                <p>"+dlang("dev_grid_print_stg","Short-term goals")+":</p>\
                                <div class='teblock'>"+short_goals+"</div>\
                                <p>"+dlang("dev_grid_print_arrg","Arrangements")+":</p>\
                                <div class='teblock'>"+arrang+"</div>\
                                <p>"+dlang("dev_grid_print_acco","Accountable")+":</p>\
                                <div class='teblock'>"+account+"</div>\
                                <p>"+dlang("dev_grid_print_wahte","When and how to evaluate the action")+":</p>\
                                <div class='teblock'>"+evaluate+"</div>\
                                <p>"+dlang("dev_grid_print_oinf","Other info")+":</p>\
                                <div class='teblock'>"+other+"</div>\
                                <p>"+dlang("dev_grid_print_rep","Report")+":</p>\
                                <div class='teblock'>"+report+"</div>\
                            </body>\
                        </html>\
                        ";
                    var printWindow = window.open('','printWindow','');
                    printWindow.document.open();
                    printWindow.document.write(html);
                    $(printWindow.document.body).find('tbody tr').find('td:eq(7)').remove();
                    printWindow.print();
                    printWindow.close();
                });
                grid.closeItem(id);
            }

            if(_id[0]=='subject'||_id[0]=='academicyear'){
                grid.openItem(id);
            }
        });
        grid.clearSelection();
        grid.setSizes();
    },


    setConfig: function(mygrid,script,id){
        mygrid.setHeader(dlang("grid_devel_stg","Studygroups")+','+dlang("grid_devel_teach","Teacher(s)")+','+dlang("grid_devel_goal","Goal")+','+dlang("grid_devel_assign","Assignm.")+','+dlang("grid_devel_obj","Objective progress")+','+dlang("grid_devel_prog","Prognose")+','+dlang("grid_devel_grade","Grade")+','+dlang("grid_devel_flag","Flag"));
        mygrid.setInitWidthsP("25,20,8,10,15,8,9,5");
        mygrid.setColTypes("tree,ro,co,ro,ro,co,co,img");
        mygrid.setColAlign("left,left,left,left,left,left,left,center");
        mygrid.enableTooltips("false,false,false,false,false,false,false,false");
        mygrid.enableTreeCellEdit(false);
        //mygrid.enableMultiline(true);
        mygrid.enableEditEvents(true,false,true);
        mygrid.enableColSpan(true);
        mygrid.kidsXmlFile = script;
        mygrid.loadXML(script+'&id='+id);
    },

    showMenu: function(id){
        return true;
    },


    editCell: function(stage,rId,cInd,nValue,oValue,grid,tree_obj,pid){
        if(stage==0){
            if(cInd == 7){
                return true
            }else{
                return true;
            }
        }
        if(stage==2){
            var els = rId.split('_');
            switch (cInd){
                case 2:
                    $.post("connectors/connector.php?control_id=grid_development", {action:'editgoal', stg: els[1], pupil:els[2], val:nValue}, function(response){
                    });
                    grid.clearSelection();
                    break;
                case 5:
                    $.post("connectors/connector.php?control_id=grid_development", {action:'editprognose', stg: els[1], pupil:els[2], val:nValue}, function(response){
                    });
                    grid.clearSelection();
                    break;
                case 6:
                    $.post("connectors/connector.php?control_id=grid_development", {action:'editgrade', stg: els[1], pupil:els[2], val:nValue}, function(response){
                    });
                    grid.clearSelection();
                    break;
            }
            return true;
        }
    },
    popup: [
        {
            id: "expandall",
            label: dlang("details_devpage_menu_expandall","Expand All"),
            action: function(id, grid, tree_obj, index){
                grid.forEachRow(function(id){
                    grid.openItem(id);
                });
            }
        },
        {
            id: "collapseall",
            label: dlang("details_devpage_menu_collapseall","Collapse All"),
            action: function(id, grid, tree_obj, index){
                grid.forEachRow(function(id){
                    grid.closeItem(id);
                });
            }
        },
        {
            id: "expand",
            label: dlang("details_devpage_menu_expand","Expand"),
            action: function(id, grid, tree_obj, index,tree, sindex){
                var sindex = sindex!=0?'_'+sindex:'';
                grid.openItem(id+'_'+index+sindex);
            }
        },
        {
            id: "collapse",
            label: dlang("details_devpage_menu_collapse","Collapse"),
            action: function(id, grid, tree_obj, index,tree, sindex){
                var sindex = sindex!=0?'_'+sindex:'';
                grid.closeItem(id+'_'+index+sindex);
            }
        }
    ]


})