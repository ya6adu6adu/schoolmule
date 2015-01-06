<?php
    require_once 'Connection.php';
    $filename = "../images/users/".$_POST['name'].'';
    $new_filename_big = "../images/users/big_".$_POST['name'].'';
    $new_filename_small = "../images/users/small_".$_POST['name'].'';

    $db = Connection::getDB();
    $result = $db->query("UPDATE pupil SET pupil_image='{$_POST["name"]}' WHERE user_id={$_POST["user"]}");

    list($current_width, $current_height) = getimagesize($filename);

    $x1    = $_POST['x1'];
    $y1    = $_POST['y1'];
    $x2    = $_POST['x2'];
    $y2    = $_POST['y2'];
    $w    = $_POST['w'];
    $h    = $_POST['h'];

    $crop_width = 49;
    $crop_height = 59;

    $new = imagecreatetruecolor($crop_width, $crop_height);
    $current_image = imagecreatefromjpeg($filename);

    imagecopyresampled($new, $current_image, 0, 0, $x1, $y1, $crop_width, $crop_height, $w, $h);

    imagejpeg($new, $new_filename_big, 100);
    image_resize($new_filename_big,$new_filename_small,15,18);

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
            imagejpeg($image_p, $new_image, 100);
        }else if ($size[2]==1){
            imagegif($image_p, $new_image);
        }else if ($size[2]==3){
            imagepng($image_p, $new_image);
        }
    }