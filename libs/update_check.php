<?php

$limit = 60;
$time = time();

set_time_limit($limit+5);
while (time()-$time<$limit) {
    @session_start();
    if(isset($_SESSION['submissions_update'])&& $_SESSION['submissions_update']==$_SESSION['user']){
        echo 'update';
        $_SESSION['submissions_update']=0;
        unset($_SESSION['submissions_update']);
        session_write_close();
        flush();
        exit;
    }
    session_write_close();
    sleep(5);
}

/*    @session_start();
    if(isset($_SESSION['annotation']) && $_SESSION['annotation']==1){
        if(isset($_SESSION['submissions_update'])&& $_SESSION['submissions_update']==$_SESSION['user']){
            echo 'update';
            $_SESSION['annotation']=0;
            $_SESSION['submissions_update']=0;
            session_write_close();
            flush();
            exit;
        }
    }else{
        echo 'none';
    }
    session_write_close();*/

?>