<?php

if (@$_REQUEST["mode"] == "html5" || @$_REQUEST["mode"] == "flash") {
	$filename = $_FILES["file"]["name"];
	move_uploaded_file($_FILES["file"]["tmp_name"],"../images/users/".$_GET['id']."_".$filename);

	//image_resize("../images/users/".$_GET['id']."_".$filename,'../images/users/big_'.$_GET['id'].'.jpg',49,59);
    //image_resize("../images/users/".$_GET['id']."_".$filename,'../images/users/small_'.$_GET['id'].'.jpg',18,18);
    rename( "../images/users/".$_GET['id']."_".$filename, "../images/users/full_".$_GET['id'].'.jpg');
    list($current_width, $current_height) = getimagesize("../images/users/full_".$_GET['id'].'.jpg');
    $coeff = round($current_width/$current_height);

    if($current_width > 368){
        $current_width = 368;
        $current_height = round(368*$coeff);
    }

    $coeff = round($current_width/$current_height);

    if($current_height > 340    ){
        $current_height = 340;
        $current_width = round(340*$coeff);
    }

    image_resize("../images/users/full_".$_GET['id'].'.jpg','../images/users/'.$_GET['id'].'_'.time().'.jpg', $current_width, $current_height);
	//unlink("../images/users/".$_GET['id']."_".$filename);
	print_r("{state: 1, name:'".str_replace("'","\\'",''.$_GET['id'].'_'.time().'.jpg')."'}");
}

if (@$_REQUEST["mode"] == "html4") {
	if (@$_REQUEST["action"] == "cancel") {
		print_r("{state:'cancelled'}");
	} else {
        $filename = $_FILES["file"]["name"];
        move_uploaded_file($_FILES["file"]["tmp_name"],"../images/users/".$_GET['id']."_".$filename);
        image_resize("../images/users/".$_GET['id']."_".$filename,'../images/users/small_'.$_GET['id'].'.jpg',18,18);

        unlink("../images/users/".$_GET['id']."_".$filename);
        print_r("{state: 1, name:'".str_replace("'","\\'",'small_'.$_GET['id'].'.jpg')."'}");
	}
}

function image_resize($sourse,$new_image,$width,$height){
    $size = GetImageSize($sourse);
    $new_height = $height;
    $new_width = $width;
    if ($size[0] < $size[1]){
   	 $new_width=($size[0]/$size[1])*$height;
	}
    else{
    	$new_height=($size[1]/$size[0])*$width;
	}
    $new_width=($new_width > $width)?$width:$new_width;
    $new_height=($new_height > $height)?$height:$new_height;
    $image_p = imagecreatetruecolor($new_width, $new_height);
    if ($size[2]==2){
        $image_cr = imagecreatefromjpeg($sourse);
    }else if ($size[2]==3){
       $image_cr = imagecreatefrompng($sourse);
    }else if ($size[2]==1){
		$image_cr = imagecreatefromgif($sourse);
	}
	imagecopyresampled($image_p, $image_cr, 0, 0, 0, 0, $new_width, $new_height, $size[0], $size[1]);
	if($size[2]==2){
		imagejpeg($image_p, $new_image, 100);
	}else if ($size[2]==1){
		imagegif($image_p, $new_image);
	}else if ($size[2]==3){
		imagepng($image_p, $new_image);
	}
}