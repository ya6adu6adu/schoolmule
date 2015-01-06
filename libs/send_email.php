<?php
/**
 * Created by JetBrains PhpStorm.
 * User: User
 * Date: 12.04.13
 * Time: 15:04
 * To change this template use File | Settings | File Templates.
 */
    require_once 'Connection.php';

 //   $db = Connection::getDB();
    $message = $_POST['message'];
    $regards = $_POST['regards'];
    $user = $_POST['user'];

    $emails = array();

 /*   $sql = "SELECT email, username FROM email_addresses";
    $result = $db->query($sql);


    while($row = mysql_fetch_assoc($result)){
        $emails[] = $row['email'];
    }
 */
    $emails[] = 'support@schoolmule.se';
    $verify = mail(implode(', ',$emails), '['.$regards.']: user subject', $message,"From: Schoolmule <noreplay@schoolmule.com>");

    if($verify){
        echo dlang("mail_send_alert","Mail Sended!");
    }else{
        echo dlang("mail_no_send_alert","Mail not Sended!");
    }

