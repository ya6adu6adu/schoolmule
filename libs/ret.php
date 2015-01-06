<?php

require_once 'Connection.php';

set_include_path(get_include_path() . PATH_SEPARATOR .'Classes/');
include_once 'PHPExcel.php';
include_once "Writer/Excel5.php";

class ExcelExporter{
    private $documentName = "default";
    private $excel = null;
    private $db = null;
    private $clo = 1;
    private $fields = "";

    function __construct($name,$fl) {

        $this->excel = new PHPExcel();
        $this->documentName = $name;
        $this->db = Connection::getDB();
        $this->createExcel($fl);
    }

    function createExcel($fl){
        $pupils = array();
        $pupilsst = array();
        $staffmembers = array();
        $parents = array();
        $studygroups = array();
        $years = array();
        $acyears = array();
        $subjects = array();
        $programmes = array();

        for($i=0; $i < count($fl); $i++){
            $items = explode('_',$fl[$i]);
            switch($items[0]){
                case "pupil":
                    if(count($items)==4){
                        $pupilsst[] = $items;
                    }else{
                        $pupils[] = $items[1];
                    }
                    break;
                case "staffmember":
                    $staffmembers[] = $items[1];
                    break;
                case "studygroup":
                    $studygroups[] = $items[1];
                    break;
                case "parent":
                    $parents[] = $items[1];
                    break;
                case "academicyear":
                    $acyears[] = $items[1];
                    break;
                case "subject":
                    $subjects[] = $items[1];
                    break;
                case "programme":
                    $programmes[] = $items[1];
                    break;
                case "years":
                    $years[] = $items[1];
                    break;
            }
        }


        if(count($pupilsst)>0){
            $this->createStudygroupPupilsTable($pupilsst);
        }

        if(count($pupils)>0){
            $this->createSimplePupilsTable($pupils);
        }

        if(count($staffmembers)>0){
            $this->createStaffTable($staffmembers);
        }
        if(count($studygroups)>0){
            $this->createStgsTable($studygroups);
        }
        if(count($parents)>0){
            $this->createParentsTable($parents);
        }
        if(count($acyears)>0){
            $this->createAccYearsTable($acyears);
        }
        if(count($subjects)>0){
            $this->createSubjectsTable($subjects);
        }
        if(count($programmes)>0){
            $this->createProgrammeTable($programmes);
        }
        if(count($years)>0){
            $this->createYearsTable($years);
        }

        $objWriter = new PHPExcel_Writer_Excel5($this->excel);
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="'.$this->documentName.'.xls"');
        header('Cache-Control: max-age=0');
        $objWriter->save('php://output');
    }

    function createStudygroupPupilsTable($items){
        $this->excel->setActiveSheetIndex(0);
        $firstrow = $this->clo;
        $aSheet = $this->excel->getActiveSheet();
        $aSheet->setTitle("Pupils Studygroup");
        $aSheet->getColumnDimension('A')->setWidth(20);
        $aSheet->getColumnDimension('B')->setWidth(20);
        $aSheet->getColumnDimension('C')->setWidth(20);
        $aSheet->getColumnDimension('D')->setWidth(20);
        $aSheet->getColumnDimension('E')->setWidth(20);
        $aSheet->getColumnDimension('F')->setWidth(20);
        $aSheet->getColumnDimension('G')->setWidth(20);
        $aSheet->getColumnDimension('H')->setWidth(20);
        $aSheet->getColumnDimension('I')->setWidth(20);
        $aSheet->getColumnDimension('J')->setWidth(20);
        $aSheet->getColumnDimension('K')->setWidth(20);

        $aSheet->getStyle("A")->getAlignment()->setWrapText(true);
        $aSheet->getStyle("B")->getAlignment()->setWrapText(true);
        $aSheet->getStyle("C")->getAlignment()->setWrapText(true);
        $aSheet->getStyle("D")->getAlignment()->setWrapText(true);
        $aSheet->getStyle("E")->getAlignment()->setWrapText(true);
        $aSheet->getStyle("F")->getAlignment()->setWrapText(true);
        $aSheet->getStyle("G")->getAlignment()->setWrapText(true);
        $aSheet->getStyle("H")->getAlignment()->setWrapText(true);
        $aSheet->getStyle("I")->getAlignment()->setWrapText(true);
        $aSheet->getStyle("J")->getAlignment()->setWrapText(true);
        $aSheet->getStyle("K")->getAlignment()->setWrapText(true);
        $aSheet->getStyle("A".$this->clo.':K'.$this->clo)->getFont()->setBold(true);

        $aSheet->setCellValue('A'.$this->clo,"Type");
        $aSheet->setCellValue('B'.$this->clo,"Forename");
        $aSheet->setCellValue('C'.$this->clo,"Lastname");
        $aSheet->setCellValue('D'.$this->clo,"Pupilgroup");
        $aSheet->setCellValue('E'.$this->clo,"Studygroup");
        $aSheet->setCellValue('F'.$this->clo,"Development Goal");
        $aSheet->setCellValue('G'.$this->clo,"Plan");
        $aSheet->setCellValue('H'.$this->clo,"Evaluation");
        $aSheet->setCellValue('I'.$this->clo,"Goal");
        $aSheet->setCellValue('J'.$this->clo,"Prognose");
        $aSheet->setCellValue('K'.$this->clo,"Grade");
        for($i=0 ; $i<count($items); $i++){
            $result = $this->db->query("
            SELECT pupil.forename AS forename, pupil.lastname AS lastname, pupilgroups.title_en AS pupilgroup,  studygroups.title_en AS studygroup,
            pupil_studygroup.development_gola AS goal, pupil_studygroup.plan AS plan, pupil_studygroup.evaluation AS evaluation,
             studygroup_grades.goal AS goals, studygroup_grades.prognose AS prognose, studygroup_grades.grade AS grade
            FROM pupil,pupil_studygroup,studygroups,pupilgroups,studygroup_grades WHERE pupil_studygroup.pupil_id = {$items[$i][1]} AND pupil_studygroup.studygroup_id = {$items[$i][3]}
             AND pupil_studygroup.pupil_id = pupil.pupil_id  AND  pupil_studygroup.studygroup_id = studygroups.studygroup_id
             AND pupilgroups.pupilgroup_id = pupil.pupilgroup_id  AND  studygroup_grades.studygroup_grades_id = pupil_studygroup.grades_id
        ");

            $result2 = $this->db->query("
                                  SELECT grade_definition_id, title_en
                                  FROM grade_definition
                             ");

            $ht = array();
            while($row2 = mysql_fetch_assoc($result2)){
                $ht[$row2['grade_definition_id']] = $row2['title_en'];
            }

            while($row = mysql_fetch_assoc($result)){
                $this->clo++;
                $aSheet->setCellValue('A'.$this->clo,'pupil');
                $aSheet->setCellValue('B'.$this->clo,$row['forename']);
                $aSheet->setCellValue('C'.$this->clo,$row['lastname']);
                $aSheet->setCellValue('D'.$this->clo,$row['pupilgroup']);
                $aSheet->setCellValue('E'.$this->clo,$row['studygroup']);
                $aSheet->setCellValue('F'.$this->clo,$row['goal']);
                $aSheet->setCellValue('G'.$this->clo,$row['plan']);
                $aSheet->setCellValue('H'.$this->clo,$row['evaluation']);
                $aSheet->setCellValue('I'.$this->clo,$ht[$row['goals']]);
                $aSheet->setCellValue('J'.$this->clo,$ht[$row['prognose']]);
                $aSheet->setCellValue('K'.$this->clo,$ht[$row['grade']]);

            }

        }

        $styleArray = array(
            'borders' => array(
                'outline' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THICK,
                    'color' => array('argb' => '666666'),
                ),
            ),
        );

        $aSheet->getStyle('A'.$firstrow.':K'.$this->clo)->applyFromArray($styleArray);
    }

    function createSimplePupilsTable($items){
        $this->clo = 1;
        $firstrow = $this->clo;
        $items = implode(',',$items);

        $aSheet = new PHPExcel_Worksheet($this->excel, 'Pupils');
        $this->excel->addSheet($aSheet);

        $aSheet->setCellValue('A'.$this->clo,"Type");
        $aSheet->setCellValue('B'.$this->clo,"Forename");
        $aSheet->setCellValue('C'.$this->clo,"Lastname");
        $aSheet->setCellValue('D'.$this->clo,"Personal ID");
        $aSheet->setCellValue('E'.$this->clo,"Pupilgroup");

        $aSheet->getStyle("A".$this->clo.':E'.$this->clo)->getFont()->setBold(true);
        $aSheet->getColumnDimension('A')->setWidth(20);
        $aSheet->getColumnDimension('B')->setWidth(20);
        $aSheet->getColumnDimension('C')->setWidth(20);
        $aSheet->getColumnDimension('D')->setWidth(20);
        $aSheet->getColumnDimension('E')->setWidth(20);
        $result = $this->db->query("
            SELECT * FROM pupil, pupilgroups WHERE pupil_id IN ($items) AND pupil.pupilgroup_id = pupilgroups.pupilgroup_id
        ");

        while($row = mysql_fetch_assoc($result)){
            $this->clo++;
            $aSheet->setCellValue('A'.$this->clo,'pupil');
            $aSheet->setCellValue('B'.$this->clo,$row['forename']);
            $aSheet->setCellValue('C'.$this->clo,$row['lastname']);
            $aSheet->setCellValue('D'.$this->clo,$row['personal_id']);
            $aSheet->setCellValue('E'.$this->clo,$row['title_en']);
        }

        $styleArray = array(
            'borders' => array(
                'outline' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THICK,
                    'color' => array('argb' => '666666'),
                ),
            ),
        );

        $aSheet->getStyle('A'.$firstrow.':E'.$this->clo)->applyFromArray($styleArray);
    }

    function createStaffTable($items){
        $this->clo = 1;
        $firstrow = $this->clo;
        $items = implode(',',$items);

        $aSheet = new PHPExcel_Worksheet($this->excel, 'Staff Members');
        $this->excel->addSheet($aSheet);

        $aSheet->setCellValue('A'.$this->clo,"Type");
        $aSheet->setCellValue('B'.$this->clo,"Forename");
        $aSheet->setCellValue('C'.$this->clo,"Lastname");
        $aSheet->setCellValue('D'.$this->clo,"Personal ID");
        $aSheet->getStyle("A".$this->clo.':D'.$this->clo)->getFont()->setBold(true);
        $aSheet->getColumnDimension('A')->setWidth(20);
        $aSheet->getColumnDimension('B')->setWidth(20);
        $aSheet->getColumnDimension('C')->setWidth(20);
        $aSheet->getColumnDimension('D')->setWidth(20);

        $result = $this->db->query("
            SELECT * FROM staff_members WHERE staff_member_id IN ($items)
        ");

        while($row = mysql_fetch_assoc($result)){
            $this->clo++;
            $aSheet->setCellValue('A'.$this->clo,'staff');
            $aSheet->setCellValue('B'.$this->clo,$row['fore_name']);
            $aSheet->setCellValue('C'.$this->clo,$row['last_name']);
            $aSheet->setCellValue('D'.$this->clo,$row['personal_id']);
        }

        $styleArray = array(
            'borders' => array(
                'outline' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THICK,
                    'color' => array('argb' => '666666'),
                ),
            ),
        );

        $aSheet->getStyle('A'.$firstrow.':D'.$this->clo)->applyFromArray($styleArray);
    }

    function createParentsTable($items){
        $this->clo = 1;
        $firstrow = $this->clo;
        $items = implode(',',$items);

        $aSheet = new PHPExcel_Worksheet($this->excel, 'Parents');
        $this->excel->addSheet($aSheet);

        $aSheet->setCellValue('A'.$this->clo,"Type");
        $aSheet->setCellValue('B'.$this->clo,"Forename");
        $aSheet->setCellValue('C'.$this->clo,"Lastname");
        $aSheet->setCellValue('D'.$this->clo,"Pupil");
        $aSheet->getStyle("A".$this->clo.':D'.$this->clo)->getFont()->setBold(true);
        $aSheet->getColumnDimension('A')->setWidth(20);
        $aSheet->getColumnDimension('B')->setWidth(20);
        $aSheet->getColumnDimension('C')->setWidth(20);
        $aSheet->getColumnDimension('D')->setWidth(20);

        $result = $this->db->query("
            SELECT parents.forename AS pfname,parents.lastname AS lfname,pupil.forename AS pufname,pupil.lastname AS ulfname FROM parents,pupil WHERE parent_id IN ($items) AND parents.pupil_id = pupil.pupil_id
        ");

        while($row = mysql_fetch_assoc($result)){
            $this->clo++;
            $aSheet->setCellValue('A'.$this->clo,'parent');
            $aSheet->setCellValue('B'.$this->clo,$row['pfname']);
            $aSheet->setCellValue('C'.$this->clo,$row['lfname']);
            $aSheet->setCellValue('D'.$this->clo,$row['pufname'].' '.$row['ulfname']);

        }

        $styleArray = array(
            'borders' => array(
                'outline' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THICK,
                    'color' => array('argb' => '666666'),
                ),
            ),
        );

        $aSheet->getStyle('A'.$firstrow.':D'.$this->clo)->applyFromArray($styleArray);
    }


    function createStgsTable($items){
        $this->clo = 1;
        $firstrow = $this->clo;
        $items = implode(',',$items);

        $aSheet = new PHPExcel_Worksheet($this->excel, 'Studygroups');
        $this->excel->addSheet($aSheet);

        $aSheet->setCellValue('A'.$this->clo,"Type");
        $aSheet->setCellValue('B'.$this->clo,"Title");
        $aSheet->setCellValue('C'.$this->clo,"Course");
        $aSheet->setCellValue('D'.$this->clo,"Start date");
        $aSheet->setCellValue('E'.$this->clo,"End date");
        $aSheet->setCellValue('F'.$this->clo,"Created At");
        $aSheet->setCellValue('G'.$this->clo,"Points");
        $aSheet->setCellValue('H'.$this->clo,"Academic Year");
        $aSheet->setCellValue('I'.$this->clo,"Subject");


        $aSheet->getStyle("A".$this->clo.':I'.$this->clo)->getFont()->setBold(true);
        $aSheet->getColumnDimension('A')->setWidth(20);
        $aSheet->getColumnDimension('B')->setWidth(20);
        $aSheet->getColumnDimension('C')->setWidth(20);
        $aSheet->getColumnDimension('D')->setWidth(20);
        $aSheet->getColumnDimension('E')->setWidth(20);
        $aSheet->getColumnDimension('F')->setWidth(20);
        $aSheet->getColumnDimension('J')->setWidth(20);
        $aSheet->getColumnDimension('H')->setWidth(20);
        $aSheet->getColumnDimension('I')->setWidth(20);

        $result = $this->db->query("
            SELECT studygroups.title_en AS studygroup, studygroups.course AS course, studygroups.enddate AS enddate, studygroups.startdate AS startdate,
             studygroups.created_at AS created_at,studygroups.points AS points,subjects.title_en AS subject, academic_years.title_en AS acyear
            FROM studygroups,subjects,academic_years WHERE studygroup_id IN ($items)
            AND subjects.subject_id = studygroups.subject_id AND subjects.academic_year_id = academic_years.academic_year_id
        ");

        while($row = mysql_fetch_assoc($result)){
            $this->clo++;
            $aSheet->setCellValue('A'.$this->clo,'studygroup');
            $aSheet->setCellValue('B'.$this->clo,$row['studygroup']);
            $aSheet->setCellValue('C'.$this->clo,$row['course']);
            $aSheet->setCellValue('D'.$this->clo,$row['startdate']);
            $aSheet->setCellValue('E'.$this->clo,$row['enddate']);
            $aSheet->setCellValue('F'.$this->clo,$row['created_at']);
            $aSheet->setCellValue('G'.$this->clo,$row['points']);
            $aSheet->setCellValue('H'.$this->clo,$row['acyear']);
            $aSheet->setCellValue('I'.$this->clo,$row['subject']);

        }

        $styleArray = array(
            'borders' => array(
                'outline' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THICK,
                    'color' => array('argb' => '666666'),
                ),
            ),
        );

        $aSheet->getStyle('A'.$firstrow.':I'.$this->clo)->applyFromArray($styleArray);
    }

    function createYearsTable($items){
        $this->clo = 1;
        $firstrow = $this->clo;
        $items = implode(',',$items);
        $aSheet = new PHPExcel_Worksheet($this->excel, 'Years');
        $this->excel->addSheet($aSheet);

        $aSheet->setCellValue('A'.$this->clo,"Type");
        $aSheet->setCellValue('B'.$this->clo,"Year");
        $aSheet->setCellValue('C'.$this->clo,"Programme");


        $aSheet->getStyle("A".$this->clo.':C'.$this->clo)->getFont()->setBold(true);
        $aSheet->getColumnDimension('A')->setWidth(20);
        $aSheet->getColumnDimension('B')->setWidth(20);
        $aSheet->getColumnDimension('C')->setWidth(20);


        $result = $this->db->query("
                SELECT years.title_en AS yeart, programmes.title_en AS programme FROM years,programmes WHERE year_id IN ($items) AND years.programme_id = programmes.programme_id
        ");

        while($row = mysql_fetch_assoc($result)){
            $this->clo++;
            $aSheet->setCellValue('A'.$this->clo,'year');
            $aSheet->setCellValue('B'.$this->clo,$row['yeart']);
            $aSheet->setCellValue('C'.$this->clo,$row['programme']);

        }

        $styleArray = array(
            'borders' => array(
                'outline' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THICK,
                    'color' => array('argb' => '666666'),
                ),
            ),
        );

        $aSheet->getStyle('A'.$firstrow.':C'.$this->clo)->applyFromArray($styleArray);
    }

    function createAccYearsTable($items){
        $this->clo = 1;
        $firstrow = $this->clo;
        $items = implode(',',$items);
        $aSheet = new PHPExcel_Worksheet($this->excel, 'Academic Years');
        $this->excel->addSheet($aSheet);

        $aSheet->setCellValue('A'.$this->clo,"Type");
        $aSheet->setCellValue('B'.$this->clo,"Academic Year");


        $aSheet->getStyle("A".$this->clo.':B'.$this->clo)->getFont()->setBold(true);
        $aSheet->getColumnDimension('A')->setWidth(20);
        $aSheet->getColumnDimension('B')->setWidth(20);


        $result = $this->db->query("
                SELECT * FROM academic_years WHERE academic_year_id IN ($items)
        ");

        while($row = mysql_fetch_assoc($result)){
            $this->clo++;
            $aSheet->setCellValue('A'.$this->clo,'year');
            $aSheet->setCellValue('B'.$this->clo,$row['title_en']);
        }

        $styleArray = array(
            'borders' => array(
                'outline' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THICK,
                    'color' => array('argb' => '666666'),
                ),
            ),
        );

        $aSheet->getStyle('A'.$firstrow.':B'.$this->clo)->applyFromArray($styleArray);
    }

    function createSubjectsTable($items){
        $this->clo = 1;
        $firstrow = $this->clo;
        $items = implode(',',$items);
        $aSheet = new PHPExcel_Worksheet($this->excel, 'Subjects');
        $this->excel->addSheet($aSheet);

        $aSheet->setCellValue('A'.$this->clo,"Type");
        $aSheet->setCellValue('B'.$this->clo,"Subject");
        $aSheet->setCellValue('C'.$this->clo,"Academic Year");

        $aSheet->getStyle("A".$this->clo.':C'.$this->clo)->getFont()->setBold(true);
        $aSheet->getColumnDimension('A')->setWidth(20);
        $aSheet->getColumnDimension('B')->setWidth(20);
        $aSheet->getColumnDimension('C')->setWidth(20);

        $result = $this->db->query("
            SELECT subjects.title_en AS subject,academic_years.title_en AS acyear FROM subjects,academic_years WHERE subject_id IN ($items) AND subjects.academic_year_id = academic_years.academic_year_id
        ");

        while($row = mysql_fetch_assoc($result)){
            $this->clo++;
            $aSheet->setCellValue('A'.$this->clo,'subject');
            $aSheet->setCellValue('B'.$this->clo,$row['subject']);
            $aSheet->setCellValue('C'.$this->clo,$row['acyear']);

        }

        $styleArray = array(
            'borders' => array(
                'outline' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THICK,
                    'color' => array('argb' => '666666'),
                ),
            ),
        );

        $aSheet->getStyle('A'.$firstrow.':C'.$this->clo)->applyFromArray($styleArray);
    }

    function createProgrammeTable($items){
        $this->clo = 1;
        $firstrow = $this->clo;
        $items = implode(',',$items);
        $aSheet = new PHPExcel_Worksheet($this->excel, 'Programmes');
        $this->excel->addSheet($aSheet);

        $aSheet->setCellValue('A'.$this->clo,"Type");
        $aSheet->setCellValue('B'.$this->clo,"Programme");

        $aSheet->getStyle("A".$this->clo.':B'.$this->clo)->getFont()->setBold(true);
        $aSheet->getColumnDimension('A')->setWidth(20);
        $aSheet->getColumnDimension('B')->setWidth(20);

        $result = $this->db->query("
            SELECT * FROM programmes WHERE programme_id IN ($items)
        ");

        while($row = mysql_fetch_assoc($result)){
            $this->clo++;
            $aSheet->setCellValue('A'.$this->clo,'programme');
            $aSheet->setCellValue('B'.$this->clo,$row['title_en']);

        }

        $styleArray = array(
            'borders' => array(
                'outline' => array(
                    'style' => PHPExcel_Style_Border::BORDER_THICK,
                    'color' => array('argb' => '666666'),
                ),
            ),
        );
        $aSheet->getStyle('A'.$firstrow.':B'.$this->clo)->applyFromArray($styleArray);
    }
}

if(isset($_GET['ids'])){
    $fields = explode(',',$_GET['ids']);
}else{
    $fields = "";
}

$temp = new ExcelExporter('Export Database file',$fields);
?>