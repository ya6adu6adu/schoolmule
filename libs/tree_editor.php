<?php
	/**
	 * Tree editor main class
	 */
	class tree_editor{
		protected $db = false;
		protected $iconPath='../dhtmlx/dhtmlxTree/codebase/imgs/csh_schoolmule/';
        protected $user;
        protected $treeXml;
		
		function __construct() {
			$this->db = Connection::getDB();
            $this->user = new administrator();
			error_reporting(E_ALL ^ E_NOTICE);
		}
		
		public function getXml($id=0,$autoload = "false",$rf){
			$xml = $this->getXmlTree($id,$rf,$autoload);
			return $xml;
		}

        public function printTree(){
            echo $this->treeXml;
        }
		
		protected function getItemLoad($shared=0, $id = 'my', $rf=false,$autoload,$assign = true){
			$real_id = explode('_', $id);
			if(count($real_id)==3){
				$real_id[0] = $real_id[0].'_'.$real_id[1];
				$real_id[1] = $real_id[2];
			}
			$tableer = $this->getTableInfoFromType($real_id[0]);
			$table = $tableer['table'];
			$type = $tableer['id_name'];
			$items = $this->getChildItems($type);
			for($i=0;$i<count($items);$i++){
				
				$ids = $this->getChildItemsTitles($items[$i],$real_id[1]);
				for($j=0;$j<count($ids);$j++){
					$folder = $this->isFolder($ids[$j][0],$items[$i]['id']);
					if($folder && (!$rf || $rf==$ids[$j][0])){
						$child = 'child="1"';
					}
					if((!$rf || $rf==$ids[$j][0]) && $items[$i]['id']=="assignment"){
						$child = 'child="1"';
					}
					if($items[$i]['id']=="course_room"){
						$tit = "room";
					}else{
						$tit=$items[$i]['id']; 
					}
					if($items[$i]['id']=="assignment" && !$assign){
						$child = 'child="0"';
					}
					//echo $this->iconPath.$tit.'.png';
					if(file_exists($this->iconPath.$tit.'.png')){
						$folder = 'im1="'.$tit.'.png" im2="'.$tit.'.png" im0="'.$tit.'.png"';
					}else{
						$folder = 'im1="folder_open.png" im2="folder_closed.png" im0="folder_open.png"';
					}

                    if($items[$i]['id']=="course_room"){
                        $folder = 'im1="courseroom_opened.png" im2="courseroom_closed.png" im0="courseroom_opened.png"';
                    }

                    if($items[$i]['id']=="member"){
                        $folder = 'im1="members_opened.png" im2="members_closed.png" im0="members_opened.png"';
                    }

                    if($items[$i]['id']=="subject"){
                        $folder = 'im1="subject_opened.png" im2="subject_closed.png" im0="subject_opened.png"';
                    }

                    $item_id = $tit.'_'.$ids[$j][0];
                    $order = mysql_query("SELECT sort_order FROM general_sort WHERE item_id='$item_id'");
                    $sort_order = 0;
                    if(mysql_num_rows($order)!=0){
                        $sort_order_row = mysql_fetch_assoc($order);
                        $sort_order = $sort_order_row['sort_order'];
                    }



                    if($items[$i]['id']=="assignment" || $items[$i]['id']=="performance"){
                        if($ids[$j][2] && $ids[$j][2]!=0){
                            $xml .= '<item '.$child.' id="'.$tit.'_'.$ids[$j][0].'_link_'.$ids[$j][2].'" text="'.$ids[$j][1].'"  '.$folder.'>';
                        }else{
                            $xml .= '<item '.$child.' id="'.$tit.'_'.$ids[$j][0].'" text="'.$ids[$j][1].'"  '.$folder.'>';
                        }
                    }else{
                        $xml .= '<item '.$child.' id="'.$tit.'_'.$ids[$j][0].'" text="'.($items[$i]['id']!="member"?$ids[$j][1]:dlang("course_room_member","Course room members")).'"  '.$folder.'>';
                    }
                    $xml .= "<userdata name='sort_order'>$sort_order</userdata>";
                    if($tit=='studygroup'){
                        $weight = 0;
                        $result = $this->db->query("SELECT weight FROM course_objectives WHERE course_objectives.studygroup_id={$ids[$j][0]}");
                        while($row = mysql_fetch_assoc($result)){
                            $weight +=$row['weight'];
                        }
                        $xml .= "<userdata name='weight'>$weight</userdata>";
                    }
					if($items[$i]['id']=="assignment"){
						$ret = explode('_', $ids[$j][0]);
						$result = $this->db->query("SELECT resultsets_studygroups.studygroup_id FROM resultsets, resultsets_studygroups WHERE assignment_id={$ret[0]} AND resultsets.resultset_id = resultsets_studygroups.resultset_id");
						$stgs = array();
                        while($row = mysql_fetch_assoc($result)){
                            $stgs[] = $row['studygroup_id'];
                        }
						$xml .= "<userdata name='stgs'>".implode(',',$stgs)."</userdata>";
                        if($this->user->role != "pupil" && $this->user->role != "parent"){
                            if($ids[$j][2] && $ids[$j][2]!=0){
						        $xml .= '<item id="submission_'.$ids[$j][0].'_link_'.$ids[$j][2].'" text="'.dlang("tree_assign_submiss","Submissions").'" im1="submission.png" im2="submission.png" im0="submission.png">';
                                $xml .= '</item>';
                            }else{
                                $xml .= '<item id="submission_'.$ids[$j][0].'" text="'.dlang("tree_assign_submiss","Submissions").'" im1="submission.png" im2="submission.png" im0="submission.png">';
                                $xml .= '</item>';
                            }
                        }

					}elseif($items[$i]['id']=="performance"){

						$ret = explode('_', $ids[$j][0]);
						$result = $this->db->query("SELECT resultsets_studygroups.studygroup_id FROM resultsets, resultsets_studygroups WHERE performance_id={$ret[0]} AND resultsets_studygroups.resultset_id = resultsets.resultset_id");
                        while($row = mysql_fetch_assoc($result)){
                            $stgs[] = $row['studygroup_id'];
                        }
						$xml .= "<userdata name='stgs'>".implode(',',$stgs)."</userdata>";
                        if($this->user->role != "pupil" && $this->user->role != "parent"){
                            if($ids[$j][2] && $ids[$j][2]!=0){
                                $xml .= '<item id="assessment_'.$ids[$j][0].'_link_'.$ids[$j][2].'" text="'.dlang("tree_assign_assess","Assessments").'" im1="assessment.png" im2="assessment.png" im0="assessment.png">';
                                $xml .= '</item>';
                            }else{
                                $xml .= '<item id="assessment_'.$ids[$j][0].'" text="'.dlang("tree_assign_assess","Assessments").'" im1="assessment.png" im2="assessment.png" im0="assessment.png">';
                                $xml .= '</item>';
                            }

                        }

					}elseif($items[$i]['id']=="member"){
                        if($this->user->role != "pupil" && $this->user->role != "parent"){
                            $_POST['getstaff'] = 1;
                            $str_tree = new tree_programme_structure();
                            $xml .= $str_tree->getStudyGroupByRoom($ids[$j][0]);
                        }
                    }

					elseif($folder && !$autoload){
						$xml.=$this->getItemLoad($shared=0, $tit.'_'.$ids[$j][0], $rf, false, $assign);
					}
					$xml .= '</item>';
					$child = '';					
				}
			}
			return $xml;
		}

		/********* Get sort order *****************/ 
		protected function getSortOrder($table){
			$result = $this->db->query("SELECT sort_order FROM $table ORDER BY sort_order DESC LIMIT 1");
            if(mysql_num_rows($result)==0){
                return 1;
            }else{
                $row = mysql_fetch_assoc($result);
                $sort_order = $row['sort_order']+1;
                return $sort_order;
            }
		}

		
		/********* Add new *****************/ 
		public function addItem($table,$values,$type,$title_en = null){
			if(!$title_en){
                $title_en = "new ".$type;
            }
			$sort_order = $this->getSortOrder($table);


			$counts = array();
			$vals = array();
			$values['title_en'] = $title_en;
			$values['sort_order'] = $sort_order; 
			foreach ($values as $key => $value) {
				$counts[] = $key;
				$vals[] = "'$value'";
			}
			$counts_res = implode(',', $counts);
			$vals_res = implode(',', $vals);
			$this->db->query("INSERT INTO $table ($counts_res) VALUES ($vals_res)");
			$dup_id = mysql_insert_id();

            $sort_order_gen = $this->getSortOrder('general_sort');
            $item_id = $type.'_'.$dup_id;

            $this->db->query("INSERT INTO general_sort (item_id,sort_order) VALUES ('$item_id',$sort_order_gen)");

			return array("id" => $type.'_'.$dup_id, "idf" =>$dup_id);
		}
		
		public function getChildItemsIds($item,$element){
			$items = array();
			$table = $item['table'];
			$parent = $item['pid'];
			$id = $item['id'];
			$id.='_id';
			$and = "";
            if($parent == "course_room_id" && $id=="page_id"){
                $and = "AND folder_id=0";
            }elseif($parent == "course_room_id" && $id=="folder_id"){
                $and = "AND folder_parent_id=0";
            }elseif($parent == "course_room_id" && ($id=="assignment_id" || $id=="performance_id")){
                $and = "AND page_id=0 AND folder_id=0";
            }elseif($parent == "page_id" && ($id=="assignment_id" || $id=="performance_id")){
                $and = "AND folder_id=0";
            }elseif($parent == "folder_id" && ($id=="assignment_id" || $id=="performance_id")){
                $and = "AND page_id=0";
            }

            if($parent == "my" || $parent == "myobj" || $parent == "mystg" || $parent == "staff" || $parent == "pupils"){
                if($parent == "my"){
                    $id = "course_room_id";
                    $table = "course_rooms";
                }
                if($parent == "myobj"){
                    $id = "academic_year_id";
                    $table = "academic_years";
                }
                if($parent == "staff"){
                    $id = "staff_member_id";
                    $table = "staff_members";
                }
                if($parent == "pupils"){
                    $id = "programme_id";
                    $table = "programmes";
                }
                if($parent == "mystg"){
                    $id = "academic_year_id";
                    $table = "academic_years";
                }
                if($table == 'academic_years'){
                    $and .= 'WHERE entity_id = '.$entity;
                }
				$result = $this->db->query("SELECT $id FROM $table ORDER BY sort_order ASC");
			}else{

				$result = $this->db->query("SELECT $id FROM $table WHERE $parent=$element $and ORDER BY sort_order ASC");
			}
			while($row = mysql_fetch_assoc($result)){
				$items[] = $row["$id"];
			}

			return $items;			
		}
		
		public function getChildItemsTitles($item,$element){
			$items = array();
			$table = $item['table'];
			$parent = $item['pid'];
			$id = $item['id'];
            $filed = 'title_en';
			$id.='_id';
			$and = "";
            $entity = $this->user->entity;

			if($parent == "course_room_id" && $id=="page_id"){
				$and = "AND folder_id=0";
			}elseif($parent == "course_room_id" && $id=="folder_id"){
				$and = "AND folder_parent_id=0";
			}elseif($parent == "course_room_id" && ($id=="assignment_id" || $id=="performance_id")){
                $and = "AND page_id=0 AND folder_id=0";
            }elseif($parent == "page_id" && ($id=="assignment_id" || $id=="performance_id")){
                $and = "AND folder_id=0";
            }elseif($parent == "folder_id" && ($id=="assignment_id" || $id=="performance_id")){
                $and = "AND page_id=0";
            }

			if($parent == "my" || $parent == "myobj" || $parent == "mystg" || $parent == "staff" || $parent == "pupils"){
				if($parent == "my"){
					$id = "course_room_id";
					$table = "course_rooms";					
				}
				if($parent == "myobj"){
                    $id = "academic_year_id";
                    $table = "academic_years";
				}
                if($parent == "staff"){
                    $id = "staff_member_id";
                    $table = "staff_members";
                }
                if($parent == "pupils"){
                    $id = "programme_id";
                    $table = "programmes";
                }
				if($parent == "mystg"){
					$id = "academic_year_id";
					$table = "academic_years";
				}
                if($table == 'academic_years'){
                    $and .= 'WHERE entity_id = '.$entity;
                }

				$result = $this->db->query("SELECT $id,title_en FROM $table $and ORDER BY sort_order ASC");
			}else{
                if($table=="course_objectives"){
                    $id = "objective_id, weight";
                }

                if($table == 'academic_years'){
                    $and .= ' entity_id = '.$entity;
                }

                //echo "SELECT $id,title_en FROM $table WHERE $parent=$element $and ORDER BY sort_order ASC";
                $result=null;
                if($table!="course_rooms_assignments" && $table!="performance"){
                    $result = $this->db->query("SELECT $id,title_en FROM $table WHERE $parent=$element $and ORDER BY sort_order ASC");
                }else{
                    //echo "SELECT $id,title_en,link FROM $table WHERE $parent=$element $and ORDER BY sort_order ASC";
                    $result = $this->db->query("SELECT $id,title_en,link FROM $table WHERE $parent=$element $and ORDER BY sort_order ASC");
                }

                if($table=="course_objectives"){
                    $id = "objective_id";
                }
			}

            if($this->user->role == "staff"){
                if($table == "subjects"){
                    $stgs = array();
                    $res = $this->db->query("SELECT studygroups.subject_id FROM staff_members, studygroup_staff, studygroups WHERE
                    user_id = {$this->user->id} AND staff_members.staff_member_id = studygroup_staff.staff_member_id AND studygroups.studygroup_id = studygroup_staff.studygroup_id");
                    while($row = mysql_fetch_assoc($res)){
                        $subjects[] = $row['subject_id'];
                    }

                    while($row = mysql_fetch_assoc($result)){
                        if(array_search($row["$id"],$subjects) === false){
                            continue;
                        }
                        $items[] = array($row["$id"],$row["title_en"]);
                    }
                }elseif($table == "academic_years"){
                    $stgs = array();
                    $res = $this->db->query("SELECT subjects.academic_year_id FROM staff_members, studygroup_staff, studygroups ,subjects WHERE
                    user_id = {$this->user->id} AND staff_members.staff_member_id = studygroup_staff.staff_member_id AND studygroups.studygroup_id = studygroup_staff.studygroup_id AND subjects.subject_id = studygroups.subject_id");
                    while($row = mysql_fetch_assoc($res)){
                        $stgs[] = $row['academic_year_id'];
                    }

                    while($row = mysql_fetch_assoc($result)){
                        if(array_search($row["$id"],$stgs) === false){
                            continue;
                        }
                        $items[] = array($row["$id"],$row["title_en"]);
                    }
                }elseif($table == "course_rooms"){
                    $stgs = array();
                    $res = $this->db->query("SELECT studygroups.course_room_id FROM staff_members, studygroup_staff, studygroups WHERE
                     user_id = {$this->user->id} AND staff_members.staff_member_id = studygroup_staff.staff_member_id AND studygroups.studygroup_id = studygroup_staff.studygroup_id");
                    while($row = mysql_fetch_assoc($res)){
                        $stgs[] = $row['course_room_id'];
                    }

                    while($row = mysql_fetch_assoc($result)){
                        if(array_search($row["$id"],$stgs) === false){
                            continue;
                        }
                        $items[] = array($row["$id"],$row["title_en"]);
                    }
                }elseif($table == "studygroups"){
                    $stgs = array();
                    $res = $this->db->query("SELECT studygroup_id FROM staff_members, studygroup_staff WHERE user_id = {$this->user->id} AND staff_members.staff_member_id = studygroup_staff.staff_member_id");
                    while($row = mysql_fetch_assoc($res)){
                        $stgs[] = $row['studygroup_id'];
                    }

                    while($row = mysql_fetch_assoc($result)){
                        if(array_search($row["$id"],$stgs) === false){
                            continue;
                        }
                        $items[] = array($row["$id"],$row["title_en"]);
                    }
                }elseif($table == "programmes"){
                    $progs = array();
                    $res = $this->db->query("SELECT programme_id FROM staff_members, studygroup_staff, studygroups  WHERE user_id = {$this->user->id} AND staff_members.staff_member_id = studygroup_staff.staff_member_id AND studygroup_staff.studygroup_id = studygroups.studygroup_id");
                    while($row = mysql_fetch_assoc($res)){
                        $progs[] = $row['programme_id'];
                    }
                    while($row = mysql_fetch_assoc($result)){
                        if(array_search($row["$id"],$progs) === false){
                            continue;
                        }
                        $items[] = array($row["$id"],$row["title_en"]);
                    }
                }else{
                    while($row = mysql_fetch_assoc($result)){
                        if($table=="course_objectives"){
                            $items[] = array($row["$id"],$row["title_en"].' ('.$row["weight"].'%)');
                        }else{
                            $items[] = array($row["$id"],$row["title_en"]);
                        }
                    }
                }
            }elseif($this->user->role == "pupil" || $this->user->role == "parent"){
                if($this->user->role == "pupil"){
                    $pupil = $this->db->query("SELECT pupil_id FROM pupil WHERE pupil.user_id = {$this->user->id}");
                }else{
                    $pupil = $this->db->query("SELECT pupil_id FROM parents WHERE parents.user_id = {$this->user->id}");
                }
                $pupil_row = mysql_fetch_assoc($pupil);
                $pupil_id = $pupil_row['pupil_id'];

                if($table == "subjects"){
                    $stgs = array();
                    $res = $this->db->query("SELECT studygroups.subject_id FROM pupil, pupil_studygroup, studygroups WHERE
                    $pupil_id = pupil_studygroup.pupil_id AND pupil_studygroup.studygroup_id = studygroups.studygroup_id");
                    while($row = mysql_fetch_assoc($res)){
                        $subjects[] = $row['subject_id'];
                    }

                    while($row = mysql_fetch_assoc($result)){
                        if(array_search($row["$id"],$subjects) === false){
                            continue;
                        }
                        $items[] = array($row["$id"],$row["title_en"]);
                    }
                }elseif($table == "academic_years"){
                    $stgs = array();
                    $res = $this->db->query("SELECT subjects.academic_year_id FROM pupil, pupil_studygroup, studygroups,subjects WHERE
                    $pupil_id = pupil_studygroup.pupil_id AND pupil_studygroup.studygroup_id = studygroups.studygroup_id AND subjects.subject_id = studygroups.subject_id");
                    while($row = mysql_fetch_assoc($res)){
                        $stgs[] = $row['academic_year_id'];
                    }

                    while($row = mysql_fetch_assoc($result)){
                        if(array_search($row["$id"],$stgs) === false){
                            continue;
                        }
                        $items[] = array($row["$id"],$row["title_en"]);
                    }
                }elseif($table == "course_rooms"){
                    $stgs = array();
                    $res = $this->db->query("SELECT studygroups.course_room_id FROM pupil, pupil_studygroup, studygroups WHERE
                    $pupil_id = pupil_studygroup.pupil_id AND pupil_studygroup.studygroup_id = studygroups.studygroup_id");
                    while($row = mysql_fetch_assoc($res)){
                        $stgs[] = $row['course_room_id'];
                    }

                    while($row = mysql_fetch_assoc($result)){
                        if(array_search($row["$id"],$stgs) === false){
                            continue;
                        }
                        $items[] = array($row["$id"],$row["title_en"]);
                    }
                }elseif($table == "studygroups"){
                    $stgs = array();
                    $res = $this->db->query("SELECT pupil_studygroup.studygroup_id FROM pupil, pupil_studygroup WHERE $pupil_id = pupil_studygroup.pupil_id");
                    while($row = mysql_fetch_assoc($res)){
                        $stgs[] = $row['studygroup_id'];
                    }

                    while($row = mysql_fetch_assoc($result)){
                        if(array_search($row["$id"],$stgs) === false){
                            continue;
                        }
                        if($table=="course_objectives"){
                            $items[] = array($row["$id"],$row["title_en"].' ('.$row["weight"].'%)');
                        }else{
                            $items[] = array($row["$id"],$row["title_en"]);
                        }
                    }
                }elseif($table == "programmes"){
                    $progs = array();
                    $res = $this->db->query("SELECT programme_id FROM pupil, pupil_studygroup, studygroups WHERE $pupil_id = pupil_studygroup.pupil_id AND pupil_studygroup.studygroup_id = studygroups.studygroup_id");
                    while($row = mysql_fetch_assoc($res)){
                        $progs[] = $row['programme_id'];
                    }
                    while($row = mysql_fetch_assoc($result)){
                        if(array_search($row["$id"],$progs) === false){
                            continue;
                        }
                        if($table=="course_objectives"){
                            $items[] = array($row["$id"],$row["title_en"].' ('.$row["weight"].'%)');
                        }else{
                            $items[] = array($row["$id"],$row["title_en"]);
                        }
                    }
                }else{
                    while($row = mysql_fetch_assoc($result)){
                        if($table=="course_objectives"){
                            $items[] = array($row["$id"],$row["title_en"].' ('.$row["weight"].'%)');
                        }else{
                            $items[] = array($row["$id"],$row["title_en"]);
                        }
                    }
                }
            }else{
                while($row = mysql_fetch_assoc($result)){
                    if($table=="course_objectives"){
                        $items[] = array($row["$id"],$row["title_en"].' ('.$row["weight"].'%)',$row["link"]);
                    }else{
                        $items[] = array($row["$id"],$row["title_en"],$row["link"]);
                    }

                }
            }
			 
			return $items;
		}
		
		protected function isFolder($id,$type){
			$items = $this->getChildItems($type);
			$els = 0;
			for($i=0;$i<count($items);$i++){
				$ids = $this->getChildItemsTitles($items[$i],$id);
				$els+=count($ids);
			}
			if($els>0){
				return true;
			}else{
				return false;
			}			
		}
		
		/********* Remove *****************/
		public function removeItem($id,$table,$type){
			$items = $this->getChildItems($type);
			$type.='_id';
            $or = "";
            if($table=="course_rooms_assignments"){
                $or = " OR link=$id";
            }
			$this->db->query("DELETE FROM $table WHERE $type=$id $or");


            if($table=="course_rooms_assignments"){
                $_POST['no_create_tree'] = 1;
                $tree  = new tree_assignments_by_studygroup(true);
                $tree->deleteAssignment($id);
            }

            if($table=="performance"){
                $tree  = new tree_assignments_by_studygroup(true);
                $tree->deletePerformance($id);
            }

			for($i=0;$i<count($items);$i++){
				$ids = $this->getChildItemsIds($items[$i],$id);
				for($j=0;$j<count($ids);$j++){
					$this->removeItem($ids[$j],$items[$i]['table'],$items[$i]['id']);
				}
			}
			return true;
		}

		public function removeItemContent($id,$table,$type){
			$items = $this->getChildItems($type);
			for($i=0;$i<count($items);$i++){
				$ids = $this->getChildItemsIds($items[$i],$id);
				for($j=0;$j<count($ids);$j++){
					$this->removeItem($ids[$j],$items[$i]['table'],$items[$i]['id']);
				}
			}
			return true;
		}
		
		/************Share********************/
		
		public function shareItem($id,$table,$type){
			$type.='_id';
			$sql = "UPDATE $table SET shared=1 WHERE $type=$id";
			$this->db->query($sql);
			return true;
		}
		
		public function privateItem($id,$table,$type){
			$type.='_id';
			$sql = "UPDATE $table SET shared=0 WHERE $type=$id";
			$this->db->query($sql);
			return true;
		}		
		
		
		/********* Duplicate *****************/
		protected function getFields($table,$type){
			$a=array();
			$query="SHOW COLUMNS FROM `$table`";
			$result=$this->db->query($query);
			while ($row=mysql_fetch_row($result)){
				if($row[0]!='title_en' && $row[0]!='sort_order' && $row[0]!="$type" && $row[0]!='created_at'){
					$a[]=$row[0];
				}
			}
			return $a;
		}
		
		public function duplicateItem($id, $table, $type, $cols = null, $parentname = null,$parentval=null,$titleflag = false,$room=null,$stg){
			$sort_order = $this->getSortOrder("$table");
			$idc = $type.'_'.$id;

			$items = $this->getChildItems($type);
			if(!$titleflag){
				if($type =="course_room"){
					$title_en = "title_en='clone room',";
				}else{
					$title_en = "title_en='clone ".$type."',";
				}
			}else{
				$title_en="";
			}
            $type_main =$type;
            $type.='_id';

			$cols = $this->getFields($table,$type);
			$cols[] = 'sort_order';
			$cols[] = 'title_en';
			$col = implode(",", $cols);
            $and = "";

			$sql = "INSERT INTO $table ($col) SELECT $col FROM $table WHERE $type=$id";

			$this->db->query($sql);
			$dup_id = mysql_insert_id();

            $sort_order_gen = $this->getSortOrder('general_sort');
            $item_id = $type_main.'_'.$dup_id;

            $this->db->query("INSERT INTO general_sort (item_id,sort_order) VALUES ('$item_id',$sort_order_gen)");

			
			$sql = "SELECT title_en FROM $table WHERE $type=$id";
			$result = $this->db->query($sql);
			while($row = mysql_fetch_assoc($result)){
				$title_en = "title_en='".$row['title_en']." duplicate',";
			}
            $par = "";
			if($parentname!=null){
				if($parentname == "folder_id" && $type=="folder_id"){
					$parentname = "folder_parent_id";
				}
				$par = ",$parentname=$parentval";
			}
            if($table!='course_rooms'){
                if(strripos($par,'course_room_id')===false && $stg){
                    $par.=",course_room_id=$stg";
                }
            }

			if($type=="course_room_id"){
				$room = $dup_id;
			}

			$sql = "UPDATE $table SET $title_en sort_order=$sort_order $par WHERE $type=$dup_id";
            $this->db->query($sql);

            if($table=="course_rooms_assignments" || $table=="performance"){
                $_POST['no_create_tree'] = 1;
                $tree = new tree_assignments_by_studygroup(true);
                if($table=="course_rooms_assignments"){
                    $tree->duplicateItemsMan($dup_id,$id,"assignment");
                }

                if($table=="performance"){
                    $tree->duplicateItemsMan($dup_id,$id,"performance");
                }
            }

			for($i=0;$i<count($items);$i++){
				$ids = $this->getChildItemsIds($items[$i],$id);
				$fields = $this->getFields($items[$i]['table'],$items[$i]['id']."_id");
				
				for($j=0;$j<count($ids);$j++){
					$this->duplicateItem($ids[$j],$items[$i]['table'],$items[$i]['id'],$fields,$type,$dup_id,true,$room,$stg);
				}
			}
			$temp = explode("_", $idc);
			if(isset($temp[2])){
				$idc = $temp[1].'_'.$temp[2];
			}
			return array("idc" => $idc,"id" => $dup_id);	
		}
		
		/********* Merge *****************/ 
		public function mergeItem($elements,$table,$type){
			$parentname = $type;
			$type.="_id";
			$result = $this->db->query("SELECT * FROM $table WHERE $type = ".implode(" OR $type =",$elements));
			$title_en = "";
			while($row = mysql_fetch_assoc($result)){
				$title_en.= $row['title_en'].' ';		 
			}
			$title_en.=" merged";
			//$values = array('owner_id','shared','description');
			$values = $this->getFields($table,$type);

			$ids = $this->duplicateItem($elements[0],"$table", "$parentname",$values, null,null,false);
			$id = $ids['id'];
			$sql = "UPDATE $table SET title_en='$title_en' WHERE $type=$id";
			$result = $this->db->query($sql);
			for($j=1;$j<count($elements);$j++){
				$child = $this->getChildItems($parentname);
				for($i=0;$i<count($child);$i++){
					$ids = $this->getChildItemsIds($child[$i],$elements[$j]);
					$fields = $this->getFields($child[$i]['table'],$child[$i]['id']."_id");
					for($j=0;$j<count($ids);$j++){
						if($parentname =="course_room"){
							$room = $id;
						}else{
							$room = false;
						}
						$this->duplicateItem($ids[$j],$child[$i]['table'],$child[$i]['id'],$fields,$type,$id,true,$room);
					}
				}				
			}
			if($parentname =="course_room"){
				$parentname = "room";
			}
			return array("idc" => $parentname."_".$elements[0],"id" => $id);
		}

		public function setParent($id,$parents,$lid,$type,$table,$stg){

            $setArray = array();
			foreach ($parents as $key => $value) {
				$setArray[] = $key.'='.$value;
			}
			$set = implode(",", $setArray);
			$order = explode("_", $lid);

			$id_type = $type.'_id';
            $full_id = $type.'_'.$id;

            if($table=="course_rooms_assignments" || $table=="course_rooms_elements" || $table=="course_room_folders" ||$table=="performance"){
                $result = $this->db->query("SELECT course_room_id FROM $table WHERE $id_type='$id'");
                $room = mysql_fetch_assoc($result);
            }


            if($lid){
                $sortordergen = 0;
                if($order[0]!='member' && $order[0]!='null'){
                    $resultgsort = $this->db->query("SELECT sort_order FROM general_sort WHERE item_id='$lid'");
                }else{
                    $resultgsort = $this->db->query("SELECT sort_order FROM general_sort  ORDER BY sort_order DESC LIMIT 1");
                }

                while($row = mysql_fetch_assoc($resultgsort)){
                    $sortordergen = $row['sort_order'];
                }
                if($order[0]!='member' && $order[0]!='null'){
                    $sortordergen = ((int) $sortordergen) - 1;
                }else{
                    $sortordergen = ((int) $sortordergen) + 1;
                }

                if($order[0]!='member' && $order[0]!='null'){
                    $this->db->query("UPDATE general_sort SET sort_order=sort_order-1 WHERE sort_order <= $sortordergen");
                }


                $this->db->query("UPDATE general_sort SET sort_order = $sortordergen WHERE item_id='$full_id'");
            }
			$this->db->query("UPDATE $table SET $set WHERE $id_type=$id");

            if($room && $room['course_room_id']!=$stg){
                $this->setRoomForAll($id,$type,$table,$stg);
            }
		}

        public function setRoomForAll($id,$type,$table,$room){
            $items = $this->getChildItems($type);
            $type.='_id';

            if($table!="course_rooms"){
                $this->db->query("UPDATE $table SET course_room_id=$room WHERE $type = $id");
                if($table=="course_rooms_assignments" || $table=="performance"){
                    $_POST['no_create_tree'] = 1;
                    $tree = new tree_assignments_by_studygroup(true);
                    if($table=="course_rooms_assignments"){
                        $tree->moveItemsMan($id,'assignment');
                    }

                    if($table==="performance"){
                        $tree->moveItemsMan($id,'performance');
                    }
                }
            }


            for($i=0;$i<count($items);$i++){
                $ids = $this->getChildItemsIds($items[$i],$id);
                for($j=0;$j<count($ids);$j++){
                    $this->setRoomForAll($ids[$j],$items[$i]['id'],$items[$i]['table'],$room);
                }
            }
            return true;
        }
		
		public function rename($id,$value,$table,$name){
            $or = "";
            $id_name = $name."_id";
            if($table=="course_rooms_assignments"){
                $or = " OR link=$id";
                $result = $this->db->query("SELECT link FROM course_rooms_assignments WHERE $id_name=$id");
                $row = mysql_fetch_assoc($result);
                if((int)$row['link']!=0){
                    $this->db->query("UPDATE $table SET title_en='$value' WHERE $id_name={$row['link']}");
                }
            }
            $this->db->query("UPDATE $table SET title_en='$value' WHERE $id_name=$id $or");
		}
	}
	