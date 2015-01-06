<?php
/**
 * Created by JetBrains PhpStorm.
 * User: User
 * Date: 11.04.13
 * Time: 10:58
 * To change this template use File | Settings | File Templates.
 */
function export_csv(
    $table = 'studygroups', 		// Имя таблицы для экспорта
    $afields = array('title_en'), 		// Массив строк - имен полей таблицы
    $filename, 	 	// Имя CSV файла для сохранения информации
    // (путь от корня web-сервера)
    $delim=',', 		// Разделитель полей в CSV файле
    $enclosed='"', 	 	// Кавычки для содержимого полей
    $escaped='\\', 	 	// Ставится перед специальными символами
    $lineend='\\r\\n'){  	// Чем заканчивать строку в файле CSV

    $q_export =
        "SELECT ".implode(',', $afields).
            "   INTO OUTFILE '".$_SERVER['DOCUMENT_ROOT'].$filename."' ".
            "FIELDS TERMINATED BY '".$delim."' ENCLOSED BY '".$enclosed."' ".
            "    ESCAPED BY '".$escaped."' ".
            "LINES TERMINATED BY '".$lineend."' ".
            "FROM ".$table
    ;

    // Если файл существует, при экспорте будет выдана ошибка
    if(file_exists($_SERVER['DOCUMENT_ROOT'].$filename))
        unlink($_SERVER['DOCUMENT_ROOT'].$filename);
    return mysql_query($q_export);
}

function import_csv(
    $table, 		// Имя таблицы для импорта
    $afields, 		// Массив строк - имен полей таблицы
    $filename, 	 	// Имя CSV файла, откуда берется информация
    // (путь от корня web-сервера)
    $delim=',',  		// Разделитель полей в CSV файле
    $enclosed='"',  	// Кавычки для содержимого полей
    $escaped='\\', 	 	// Ставится перед специальными символами
    $lineend='\\r\\n',   	// Чем заканчивается строка в файле CSV
    $hasheader=FALSE){  	// Пропускать ли заголовок CSV

    if($hasheader) $ignore = "IGNORE 1 LINES ";
    else $ignore = "";
    $q_import =
        "LOAD DATA INFILE '".
            $_SERVER['DOCUMENT_ROOT'].$filename."' INTO TABLE ".$table." ".
            "FIELDS TERMINATED BY '".$delim."' ENCLOSED BY '".$enclosed."' ".
            "    ESCAPED BY '".$escaped."' ".
            "LINES TERMINATED BY '".$lineend."' ".
            $ignore.
            "(".implode(',', $afields).")"
    ;
    return mysql_query($q_import);
}