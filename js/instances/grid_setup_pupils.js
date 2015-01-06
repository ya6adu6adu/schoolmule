var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};


schoolmule.instances.grid_setup_pupils = new schoolmule.controls.grid({
    id: "grid_setup_pupils",
    gridImagePath:"dhtmlx/dhtmlxGrid/codebase/imgs/",
    menuIconsPath:"dhtmlx/dhtmlxMenu/codebase/imgs/dhxmenu_dhx_web/",

    dp:false,

    addRow: function(rId,cn,dhx){
    },

    selectRow: function(ind,id,dhx,options,f,funcs,pid){
        if(ind==10){
            seconfirm(dlang("reset_confirm_pass_text","Reset password?"),function(){
                var uid = dhx.grid.getUserData(id,'user');
                $.post("connectors/connector.php?control_id=grid_setup_pupils", {
                    action:"setpass",
                    user: uid
                }, function(res){
                    alert(dlang("after_pass_reset_alert2","User sent a mail stating that the password is changed"));
                },'json');
            });
            return false;
        }
    },

    openTree: function(id,dhx,state,pid){
    },

    beforeSelectRow: function(id,dhx,keysel){
        return true;
    },
    setConfig: function(mygrid,script,id){
        var tree = schoolmule.instances.tree_users.getTree();
        mygrid.setHeader('#master_checkbox,'+dlang("grud_pupils_fname","Forname")+','+dlang("grud_pupils_sname","Surname")+','+dlang("grud_pupils_id","ID")+','+dlang("grud_pupils_pg","Pupilgroup")+',,'+dlang("grud_pupils_porst","Portrait")+','+dlang("grud_pupils_added","Added")+','+dlang("grud_pupils_uname","Username")+','+dlang("grud_pupils_email","Email")+','+dlang("grud_pupils_pass","Password"),null,["text-align:center"]);
        mygrid.setInitWidthsP("3.6,15,15,7,11,0,7,10,13.4,7,11");
        mygrid.setColTypes("ch,ed,ed,ed,ro,ro,img,ro,ed,ed,button");
        mygrid.setColSorting("na,str,str,na,str,dbContentSort,str");
        mygrid.setColValidators([null,null,null,null,null,null,null,null,null,"ValidEmail",null]);
        mygrid.enableTooltips("false,false,false,false,false, false, false, false,false,false");
        mygrid.setColAlign("center,left,left,left,left,left,center,left,left,left");
        mygrid.enableAutoHeight(false);
        //mygrid.enableMultiline(true);
        mygrid.enableTreeCellEdit(true);
        mygrid.setDateFormat("%Y-%m-%d");
        mygrid.enableEditEvents(false, true, true);
        mygrid.kidsXmlFile = script;
        mygrid.loadXML(script+'&selected='+tree.getSelectedItemId());
        $("body").append('<img class="temp_user_image" style="display:none; position:absolute;" />');
    },

    showMenu: function(id){
        return true;
    },

    load: function(grid){
        var tree = schoolmule.instances.tree_users.getTree();
        var item = tree.getSelectedItemId().split('_');
        if(item[0]=='pupil'){
            //grid.selectRowById('pupil_'+item[1])
        }

    },
    mouseOver: function(rId,cInd){
        if(cInd==6){
            var grid = schoolmule.instances.grid_setup_pupils.getGrid().grid;
            if(grid.getRowsNum()==1){
                return true;
            }
            var cell = grid.cells(rId,6);
            if(cell.getValue()!=""){
                var td = cell.cell;
                var img = $(td).find('img');
                if(!img.hasClass('big_image')){
                    var user = grid.getUserData(rId,'user');
                    $(img).attr("id","big_"+user);
                    $(img).addClass("big_image");
                    $(img).hover(
                        function (e) {
                            var src =  $(this).attr('src');
                            setTimeout(function(){
                                var popim = $(".temp_user_image");

                                if(!(src.indexOf('default')+1)){
                                    popim.attr("src",src.replace('small','big'));
                                    popim.css({
                                        top:e.pageY+'px',
                                        left:e.pageX+'px'
                                    });
                                    popim.show();
                                }
                            },300);
                        },
                        function (e) {
                            var src =  $(this).attr('src');
                            setTimeout(function(){
                                if(!(src.indexOf('default')+1)){
                                    $(".temp_user_image").hide();
                                }
                            },300);
                        }
                    );
                }
            }
        }
    },

    rowDblClicked: function(rId,cInd){
        var grid = schoolmule.instances.grid_setup_pupils.getGrid().grid;
        var row = rId.split('_');
        if(cInd == 6 && _.indexOf(["pupil","staffmember","parent"],row[0]) != -1){
            var upload_form = null;
            var uploader = null;
            var upllable = dlang("grud_pupils_upload_img","Upload");
            var close = dlang("close_button_grid_setup","Close");
            var upload_dialog = new schoolmule.controls.window_popup(
                {
                    title: dlang("grud_pupils_upload_photo","Upload photo"),
                    width: "365px",
                    height: "200px",
                    maxWidth:"500px",
                    maxHeight:"600px",
                    buttons: [
                        {
                            text:upllable,
                            click:function(){
                                uploader.upload();
                            }
                        },
                        {
                            text:close,
                            click:function(){
                                upload_dialog.win_dialog.dialog("destroy");
                                upload_dialog.win_dialog.remove();
                            }
                        }
                    ],
                    onBeforeShow: function(container){
                        formData = [
                            {
                                type: "label", label: dlang("grud_pupils_upload_text","Upload portrait of user 49 x 59 pix in size")
                            },
                            {
                                type: "fieldset",
                                label: dlang("grud_pupils_uploader","Uploader"),
                                list: [{
                                    type: "upload",
                                    name: "myPhoto",
                                    inputWidth: 330,
                                    width: 300,
                                    titleScreen: true,
                                    _swfLogs: "enabled",
                                    swfPath: "dhtmlx/dhtmlxFrom/codebase/ext/uploader.swf"
                                }]
                            }];

                        var portrait_uploader = new dhtmlXForm(container,formData);
                        portrait_uploader.setSkin("dhx_terrace");
                        uploader = portrait_uploader.getUploader("myPhoto");
                        var user = grid.getUserData(rId,'user');

                        portrait_uploader.attachEvent("onFileAdd",function(realName){
                            alert(5);
                            var name = realName.split('.');
                            var ext = name[name.length-1];
                            alert(ext);
                        });
                        portrait_uploader.attachEvent("onFileRemove",function(realName,serverName){
                            //alert(realName);
                            //any custom logic here
                        });
                        uploader.setURL("libs/item_upload.php?id="+user);
                        portrait_uploader.attachEvent("onUploadFile",function(realName,serverName){

                            var x1,y1,x2,y2, w,h;
                            portrait_uploader.unload();
                            portrait_uploader = null;
                            upload_dialog.win_dialog.dialog("destroy");
                            upload_dialog.win_dialog.remove();
                            var crop_dialog = new schoolmule.controls.window_popup(
                                {
                                    title: dlang("grud_pupils_upload_crop","Croap Image"),
                                    width: "400px",
                                    height: "600px",
                                    resizable: false,
                                    buttons: {
                                        "Save": function() {
                                            $.post("libs/crop_image.php", {
                                                x1:Math.round(x1),
                                                y1:Math.round(y1),
                                                x2:Math.round(x2),
                                                y2:Math.round(y2),
                                                w:Math.round(w),
                                                h:Math.round(h),
                                                user: user,
                                                name: serverName
                                            }, function(res){
                                                if(grid.getRowsNum()==1){
                                                    grid.cells(rId,6).setValue('images/users/big_'+serverName+'');
                                                }else{
                                                    grid.cells(rId,6).setValue('images/users/small_'+serverName+'');
                                                }
                                                crop_dialog.win_dialog.dialog("destroy");
                                                crop_dialog.win_dialog.remove();
                                            });
                                        },
                                        "Close": function() {
                                            crop_dialog.win_dialog.dialog("destroy");
                                            crop_dialog.win_dialog.remove();
                                        }
                                    },

                                    onBeforeShow: function(container){

                                        $('#'+container).css('padding','5px')
                                        $('#'+container).append('<div style="width: 100%; height: 100%"><div><img id="croping_image" src="images/users/'+serverName+'" /></div></div>');
                                        // $('#'+container + ' .add-box').css('border','0px');
                                        $('#croping_image').load(function(){
                                            var ml = -Math.round(this.width/2)+'px';
                                            var mt = -Math.round(this.height/2)+'px';

                                            $('#croping_image').parent().css({
                                                width:this.width,
                                                height:this.height,
                                                position: 'absolute',
                                                left: '50%',
                                                top: '50%',
                                                'margin-left':ml,
                                                'margin-top': mt
                                            });

                                            $('#croping_image').Jcrop({
                                                aspectRatio: 49/59,
                                                setSelect: [Math.round(this.width/2)-25,Math.round(this.height/2)-30,Math.round(this.width/2)+24,Math.round(this.height/2)-26],
                                                onSelect: function(c){
                                                    x1 = c.x;
                                                    y1 = c.y;
                                                    x2 = c.x2;
                                                    y2 = c.y2;
                                                    w = c.w;
                                                    h = c.h;
                                                }
                                            });

                                        });
                                    }
                            });
                            crop_dialog.show({
                                container: "massage_box"
                            });
                        });
                    }
                }
            );

            upload_dialog.show({
                container: "massage_box"
            });
        }
        return true;
    },

    editCell: function(stage,rId,cInd,nValue,oValue,grid,tree_obj,pid){
        var grid = schoolmule.instances.grid_setup_pupils.getGrid().grid;
        var row = rId.split('_');
        if(stage == 0){
            if(cInd==10){
                return false;
            }
            if(_.indexOf([0,1,2,3,8,9,10],cInd) == -1){
                return false;
            }
        }
        if(stage == 1){
            switch(cInd){
                case 0:

                    if(grid.cells(rId,0).isChecked()){
                        enableButton('delete_selected');
                    }else{
                        if(grid.getCheckedRows(0)==""){
                            disableButton('delete_selected');
                        }
                    }
                    break;
                case 1:
                    $(grid.cells(rId,1).cell).find('input').val("");
                    break;
                case 2:
                    $(grid.cells(rId,2).cell).find('input').val("");
                    break;
            }
        }

        if(stage == 2){
            switch(cInd){
                case 1:
                    if(nValue==""){
                        grid.cells(rId,1).setValue(oValue);
                    }
                    if(nValue.length > 1 && oValue!=nValue){
                            $.post("connectors/connector.php?control_id=grid_setup_pupils", {
                                action:"editpupilname",
                                name: nValue,
                                id: row[1]
                            }, function(res){
                                grid.cells(rId,1).setValue(nValue);

                                var user = nValue+'.'+grid.cells(rId,2).getValue();
                                grid.cells(rId,8).setValue(res.username);

                                var tree = schoolmule.instances.tree_users.getTree();
                                tree.smartRefreshBranch('pupils',"connectors/connector.php?control_id=tree_users");
                            },'json');
                            break;
                    }else{
                        return false;
                    }
                    break;
                case 2:
                    if(nValue==""){
                        grid.cells(rId,1).setValue(oValue);
                    }
                    if(nValue.length > 1 && oValue!=nValue){
                        $.post("connectors/connector.php?control_id=grid_setup_pupils", {
                            action:"editpupilsurname",
                            name: nValue,
                            id: row[1]
                        }, function(res){
                            grid.cells(rId,2).setValue(nValue);

                            var user = grid.cells(rId,1).getValue()+'.'+nValue;
                            grid.cells(rId,8).setValue(res.username);

                            var tree = schoolmule.instances.tree_users.getTree();
                            tree.smartRefreshBranch('pupils',"connectors/connector.php?control_id=tree_users");
                        },'json');
                        break;
                    }else{
                        return false;
                    }
                    break;
                case 3:
                    if( oValue!=nValue){
                        $.post("connectors/connector.php?control_id=grid_setup_pupils", {
                            action:"editpupilid",
                            name: nValue,
                            id: row[1]
                        }, function(res){
                            grid.cells(rId,3).setValue(nValue);
                        });
                        break;
                    }else{
                        return false;
                    }
                    break;
                case 8:
                    if(nValue.length > 1 && oValue!=nValue){
                        nValue = nValue.replace(new RegExp(",",'g'),"");
                        nValue = nValue.replace(new RegExp(" ",'g'),"");
                        $.post("connectors/connector.php?control_id=grid_setup_pupils", {
                            action:"setusername",
                            username: nValue,
                            user: grid.getUserData(rId,'user')
                        }, function(res){
                            if(res == "1"){
                                grid.cells(rId,8).setValue(nValue);
                            }else{
                                alert(dlang("grids_users_exists_popup1","User with name")+' '+nValue+' '+dlang("grids_users_exists_popup2","already exists!"));
                            }
                        });
                    }else{
                        return false;
                    }
                    break;
                case 10:
                    if(nValue.length > 3 && oValue!=nValue){
                        var pass = nValue;
                        var id = grid.getUserData(rId,'user');
                        $.post("connectors/connector.php?control_id=grid_setup_pupils", {
                            action:"setpass",
                            user: id,
                            pass: pass
                        }, function(res){
                            grid.cells(rId,9).setValue(nValue);
                        },'json');
                    }else{
                        return false;
                    }
                    break;
                case 9:
                    if((nValue.length > 3 || nValue=="") && oValue!=nValue){

                        if(!grid.validateCell(rId,9) && nValue!="")
                            return false;
                        var mail = nValue;
                        var id = grid.getUserData(rId,'user');
                        $.post("connectors/connector.php?control_id=grid_setup_pupils", {
                            action:"setemail",
                            user: id,
                            mail: mail
                        }, function(res){
                            grid.cells(rId,9).setValue(nValue);
                        },'json');
                    }else{
                        return false;
                    }
                    break;
            }
        }
        return true;
    },

    popup: []
});

function dbContentSort(a,b,order){
}