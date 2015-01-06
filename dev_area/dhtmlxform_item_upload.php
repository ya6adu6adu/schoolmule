<?php

if (@$_REQUEST["mode"] == "html5" || @$_REQUEST["mode"] == "flash") {
	$filename = $_FILES["file"]["name"];
	
	move_uploaded_file($_FILES["file"]["tmp_name"],"photos/".$_GET['id']."_".$filename);
	image_resize("photos/".$_GET['id']."_".$filename,'photos/small_'.$_GET['id'].'_'.$_FILES['file']['name'],200,270);
	print_r("{state: 1, name:'".str_replace("'","\\'",'small_'.$_GET['id']."_".$filename)."'}");
}

if (@$_REQUEST["mode"] == "html4") {
	if (@$_REQUEST["action"] == "cancel") {
		print_r("{state:'cancelled'}");
	} else {
		$filename = $_FILES["file"]["name"];
		move_uploaded_file($_FILES["file"]["tmp_name"], "photos/".$filename);
		image_resize("photos/".$_GET['id']."_".$filename,'photos/small_'.$_GET['id'].'_'.$_FILES['file']['name'],200,270);
		print_r("{state: 1, name:'".str_replace("'","\\'",$filename)."', size:".$_FILES["file"]["size"]/*filesize("uploaded/".$filename)*/."}");
	}
}

function image_resize($sourse,$new_image,$width,$height){
    $size = GetImageSize($sourse);
    file_put_contents("lol.txt", $size);
    $new_height = $height;
    $new_width = $width;
    if ($size[0] < $size[1])
    $new_width=($size[0]/$size[1])*$height;
    else
    $new_height=($size[1]/$size[0])*$width;
    $new_width=($new_width > $width)?$width:$new_width;
    $new_height=($new_height > $height)?$height:$new_height;
    $image_p = @imagecreatetruecolor($new_width, $new_height);
    if ($size[2]==2){
        $image_cr = imagecreatefromjpeg($sourse);
    }else if ($size[2]==3){
       $image_cr = imagecreatefrompng($sourse);
    }else if ($size[2]==1){
	$image_cr = imagecreatefromgif($sourse);
	}
	imagecopyresampled($image_p, $image_cr, 0, 0, 0, 0, $new_width, $new_height, $size[0], $size[1]);
	if($size[2]==2){
	imagejpeg($image_p, $new_image, 75);
	}else if ($size[2]==1){
	imagegif($image_p, $new_image);
	}else if ($size[2]==3){
	imagepng($image_p, $new_image);
	}
}