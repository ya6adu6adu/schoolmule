    <?php
        include_once('_pageshead.php');
        $admin = new administrator();
    ?>

    <link rel="stylesheet" type="text/css" href="flexpaper/css/flexpaper.css" />
    <link rel="stylesheet" type="text/css" href="css/paper.css" />

    <script type="text/javascript" src="flexpaper/js/jquery.extensions.minf.js"></script>
    <script type="text/javascript" src="flexpaper/js/flexpaper.js"></script>
    <script type="text/javascript" src="flexpaper/js/flexpaper_handlers.js"></script>
    <script type="text/javascript" src="js/controls/grid.js"></script>
    <script type="text/javascript" src="js/instances/grid_result_annotate.js"></script>
    <script type="text/javascript" src="js/pages/annotations.js"></script>
    </head>
<body>
    <div id="result_cunter"></div>
    <div id="dialogflexpaper">
           <div id="flexpaper_buttons" >
               <div style="min-height: 704px; position: absolute; height: 100%; margin-left: 15px;">
                           <div class="nav_buttons" style=" padding-top: 10px;">
                               <label class="main_label"><?php echo dlang("flexpaper_page_navig_title","Page Navigation"); ?></label>
                               <div class="buttoncont">
                                   <button class="button annbutton" id="prev"><</button>
                                   <button class="button annbutton" id="next">></button>
                               </div>
                               <select class="styled runitsel" id="gotopage">
                               </select>
                               <span class="page_pic flex_pic "><span class="select-item"></span><img src="images/flexpaper/View_page.png"></span>
                               <span class="2page_pic flex_pic"><span style="display: none" class="select-item"></span><img src="images/flexpaper/View_two_pages.png"></span>
                               <span class="many_page_pic flex_pic"><span style="display: none" class="select-item"></span><img src="images/flexpaper/Many_pages.png"></span>
                               <span class="fill_vert_pic flex_pic"><span  class="select-item"></span><img src="images/flexpaper/Fill_vertically.png"></span>
                               <span class="fill_hor_pic flex_pic"><span style="display: none" class="select-item"></span><img src="images/flexpaper/Fill_horizontally.png"></span>
                               <span class="rotate_pic flex_pic"><img src="images/flexpaper/Rotate.png"></span>
                               <span class="select_pic flex_pic"><span style="display: none" class="select-item"></span><img src="images/flexpaper/Select_text.png"></span>
                               <span class="move_pic flex_pic"><span class="select-item"></span><img src="images/flexpaper/Move.png"></span>
                               <!--<span class="fullscreen_pic flex_pic"><img src="images/flexpaper/Full_screen.png"></span>-->
                               <div style="margin-top: 5px;" id="slider"></div>
                           </div>

                           <?php
                           if($admin->role!="pupil" && $admin->role!="parent"){
                               echo '
                                   <div class="nav_buttons" style="border-top: 1px solid #666; padding-top: 10px; margin-top: 10px;">
                                       <label class="main_label">'.dlang("flexpaper_annotate_tools","Annotate tools").'</label>
                                       <span class="show_pic flex_pic"><span style="display: none" class="select-item"></span><img src="images/flexpaper/View_annotation_active.png"></span>
                                       <span class="comment_pic flex_pic"><span style="display: none; " class="select-item"></span><img src="images/flexpaper/Comment.png"></span>
                                       <span class="draw_pic flex_pic"><span style="display: none" class="select-item"></span><img src="images/flexpaper/Draw.png"></span>
                                       <span class="highlightfill_vert_pic flex_pic"><span style="display: none" class="select-item"></span><img src="images/flexpaper/Highlight.png"></span>
                                       <span class="strike_pic flex_pic"><span style="display: none" class="select-item"></span><img src="images/flexpaper/Strike_through.png"></span>
                                       <span class="delete_pic flex_pic"><span style="display: none" class="select-item"></span><img src="images/flexpaper/Delete.png"></span>
                                   </div>
                                ';
                           }
                           ?>


                           <div class="nav_buttons" style="border-top: 1px solid #666; padding-top: 10px; margin-top: 10px;">
                               <label class="main_label"><?php echo dlang("flexpaper_print_search","Print and search"); ?></label>
                               <span class="print flex_pic"><img src="images/flexpaper/Print.png"></span>
                               <input class="search_input" id="search_input" type="text" />
                               <span class="draw_search flex_pic"><img src="images/flexpaper/Search.png"></span>
                           </div>
                           <div class="nav_buttons" style="border-top: 1px solid #666; padding-top: 10px; margin-top: 10px;">
                               <label class="main_label"><?php echo dlang("flexpaper_results_title","Results"); ?></label>
                           </div>
                           <div id="results_grid"></div>
                           <div class="nav_buttons" class="nav_buttons" style="padding-top: 10px;">
                               <label class="main_label"><?php echo dlang("flexpaper_assessment_title","Assessment"); ?></label>
                               <select class="styled runitsel" id="setassessment"></select>
                           </div>
                            <?php
                                if($admin->role!="pupil" && $admin->role!="parent"){
                                    echo '
                                       <div class="nav_buttons comments" class="nav_buttons" style="padding-top: 10px;">
                                           <label class="main_label">'.dlang("flexpaper_assessment_comments","Comments:").'</label>
                                           <textarea id="comments_text" class="runitinp" rows="10" cols="45"></textarea>
                                           <label class="main_label">'.dlang("flexpaper_assessment_private_notes","Teachers private notes:").'</label>
                                           <textarea id="private_notes_text" class="runitinp" rows="10" cols="45"></textarea>
                                       </div>
                                       <div class="nav_buttons" class="nav_buttons" style="padding-top: 10px;">
                                    ';
                                }
                            ?>
                           </div>
                               <?php
                               if($admin->role!="pupil" && $admin->role!="parent"){
                                   echo '
                                       <div class="save_buttons nav_buttons" style=" margin-bottom: 10px">
                                           <div style="margin-bottom: 7px;">
                                               <button class="button annbutton" id="save_button">'.dlang("flexpaper_save_button","Save").'</button>
                                               <button class="button annbutton" id="cancel_button">'.dlang("flexpaper_cancel_button","Cancel").'</button>
                                           </div>
                                           <div>
                                               <button class="button fullbtn" id="publish_button">'.dlang("flexpaper_publish_button","Publish").'</button>
                                           </div>
                                       </div>
                                       </div>
                                    ';
                               }
                               ?>


               </div>
        <div id="paperViwer"  style="height:100%; width: 100%; background-color: #919191; /*margin-left: -200px;*/ /*padding-left: 200px;*/ box-sizing: border-box;"></div>
    </div>
    <script type="text/javascript">
        var gl_user_lang = <?php echo '"'.$lang.'"'?>;
        var file = '<?php echo $_GET['file']?$_GET['file']:0 ?>';
        var fileid = <?php echo $_GET['fileid']?$_GET['fileid']:0 ?>;
        var assign = '<?php echo $_GET['assignment']; ?>';
        var pupil = <?php echo $_GET['pupil']; ?>;
        var user = <?php echo $admin->id; ?>;
        var username = '<?php echo $admin->login; ?>';
        var gl_user_lang = <?php echo '"'.$lang.'"'?>;
        var labels_shows = <?php echo $labels?>;
        var role = '<?php echo $admin->role?$admin->role:0 ?>';
    </script>
</body>
</html>
