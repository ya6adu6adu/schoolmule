<?php
/**
 * Created by PhpStorm.
 * User: maxim
 * Date: 22.01.2015
 * Time: 7:23
 */

function buildMenu($menuObj = null){
    $html = null;
    $sub = null;
    $menu = null;
    $id = null;
    $item = null;
    $itemId = null;
    $itemText = null;
    $needClass = null;
    if(count($menuObj) > 0 && count($menuObj["items"]) > 0){
        $menu = $menuObj["items"];
        $id = $menuObj["id"];
        $html = '<ul class="subMenu">';
        foreach($menu as $key=>$value){
            $itemText = $menu[$key]["text"];
            $itemId = $id.$menu[$key]["id"];
            $needClass = $menu[$key]["haveSub"]?"backImg": null;
            $item = '<li id="'.$itemId.'" class="'.$needClass.'">'.$itemText;
            if($needClass){
                $sub = getSubmenu($menu[$key]['sub'], $id);
                $item .= $sub;
            }
            $item .= "</li>";
            $html .= $item;
        }
        $html .="</ul>";
    }
    return $html;
}
function getSubmenu($menu = null, $id = null){
    $html = null;
    $sub = null;
    $item = null;
    $itemId = null;
    $itemText = null;
    $needClass = null;
    if(count($menu) > 0){
        $html = '<ul>';
        foreach($menu as $key=>$value){
            $itemText = $menu[$key]["text"];
            $itemId = $id.$menu[$key]["id"];
            $item = '<li id="'.$itemId.'">'.$itemText.'</li>';
            $html .= $item;
        }
        $html .="</ul>";
    }
    return $html;
}