// dialog 5
$('#tree-box1').empty();
var minHeightGl = null;
var minWeightGl = null;
/*
var tree1 = new dhtmlXTreeObject("tree-box1","100%","100%",0);
tree1.setSkin("dhx_black");
tree1.setImagePath("schoolmodule/dhtmlx/imgs-tree/csh_schoolmule/");
tree1.loadXML("schoolmodule/dhtmlx/myxml/tree_hidden.xml");
*/
//tree1.enableCheckBoxes(true, false);
/*
tree1.enableCheckBoxes(1);
tree1.enableThreeStateCheckboxes(true);

tree1.enableDragAndDrop(true);
*/
//tree1.enableSmartXMLParsing(true);
//tree1.setDragBehavior('sibling');


//tree1.attachEvent('onDrop', function(sId,tId,id,sObject,tObject){
//tree1.attachEvent('onDragIn', function(dId,lId,id,sObject,tObject){
/*tree1.attachEvent(\"onDrag\", function(sId,tId,id,sObject,tObject){
 
	//alert('sourceId = ' + sId );
	//alert('targedId = ' + tId );
	//alert('Id = ' + id );
	//alert('Id = ' + tree1.getAllLeafs() );
	//alert('Id = ' + tree1.getParentId(sId) );
	//alert('Id = ' + tree1.getSubItems( parentId ) );
	
	parentId = tree1.getParentId(sId);
	subId = tree1.getSubItems( parentId );
						
	var temp = new Array();
	temp = subId.split(',');
	for( n = 0; n < temp.length; n++ ){
		if( tId != temp[n] ){
			alert('stop');
			//return false;
		}else{
			alert('ok');
			return true;
		}
	}
});*/
	

// dialog 6
    $('#gridbox').empty();

    function calculateFooterValues() {
        var nrQ = document.getElementById("nr_s");
        nrQ.innerHTML = sumColumn(1)+'%';

        return true;
    }

    function sumColumn(ind) {

        var out = 0;
        for (var i = 0; i < weight_grid.getRowsNum(); i++) {

            out += parseFloat(weight_grid.cells2(i, ind).getValue());
        }
        return out;
    }

    weight_grid = new dhtmlXGridObject('gridbox');
    weight_grid.selMultiRows = false;
    weight_grid.imgURL = "schoolmodule/dhtmlx/imgs/icons_greenfolders/";
    weight_grid.setHeader(dlang("change_weight_objective","Objective")+','+dlang("change_weight_weight","Weight"));
    weight_grid.setInitWidths("276,60");
    weight_grid.setColAlign("left,left");
    weight_grid.setColTypes("ro,co");

    weight_grid.setSkin("dhx_skyblue");
    weight_grid.init();

    weight_grid.attachEvent("onXLE", function(grid_obj,count){
        for(var j=5; j<=100; j+=5){
            weight_grid.getCombo(1).put(j+'%', j+'%');
        }
        calculateFooterValues();
    });

    weight_grid.loadXML("schoolmodule/dhtmlx/myxml/dialog_grid.xml?time="+(new Date()).getTime());

    weight_grid.attachFooter(dlang("change_weight_footer_sum","Sum (must be 100%):")+',<span id="nr_s">0</spanWW>%');

function heightAssignment(){

	$('tr.objname').each(function(){
		var objHeight = $(this).height();
		var amountAssign = 0;
		var amountResult = 0;


		var amountAssignPerf = $(this).find('td.tdassign').find('tr.amountAssign').length;
        var heightAssign = objHeight / amountAssignPerf;
        $(this).find('tr.amountAssign').each(function(){
            $(this).height(heightAssign);
        })

        var max = 0;
        $(this).find('tr.amountAssign').each(function(){
            var assignHeight = $(this).height();
            if(assignHeight > max){
                max = assignHeight;
            }
        });

        //var h1 = $(this).find('td.tdassign').height();
        //var h2 = $(this).find('td.tdassign table:first').height();
		heightLastAssignment = $(this).find('tr.amountAssign:last').height();
		heightObjective = $(this).find('div.heightObjective').height();

        //var ost = (h1-h2)/amountAssignPerf;
        $(this).find('tr.amountAssign').each(function(){
            $(this).height(max+2);
        })

		//$(this).find('tr.amountAssign').height($(this).find('tr.amountAssign').height());

		//}
	});


	//correct height for unit, max, pass, result boxes

	$('tr.amountAssign').each(function(){
		var assignHeight = $(this).height();
		result = $(this).find('table.table_unit');
		assignHeight += 2;
		$(result).height( assignHeight + 'px');
	});

	//correct height for assesment boxes

	$('tr.heightresult').each(function(){
		var ln = parseInt($(this).parent().children().length);

		if($(this).next().length==0 && ln>1){
			$(this).children('td#callChangeResult,td.tdassesment').css("border-bottom","0px");
		}
		var resultHeight = parseInt($(this).parent().parent().height());
		assessment = $(this).find('table#heightAssesment');
		$(assessment).height( resultHeight/ln + 'px');

	});


	//$('.tdassesment > table').css({"height":"100%", "margin-top":"0px"});
	//$('#highlightAssesment').css({"height":"100%"});
	//$('.table_unit').css("height",parseInt($('.table_unit').css("height"))+2+'px');
}

//amount assing/perf on each boxes
function objectiveWeight(){
	var amountAssignPerf;
	var min = 99999;
	var heightMinObj;
	var obj;

	$('tr.objname').each(function(){
		var max = 0;
		$(this).find('tr.amountAssign').each(function(){
			var assignHeight = $(this).height();
			if(assignHeight > max){
				max = assignHeight;
			}
		});

		$(this).find('tr.amountAssign').each(function(){
			//$(this).height(max);
		});
	})

	$('tr.objname:not(tr.selected)').each(function(){
		//amountAssignPerf = $(this).find('td.tdassign').find('tr.amountAssign').length;
		//amountAssignPerf = $(this).find('td.tdassign').find('tr.amountAssign').height();
		var weight = parseInt($(this).find('span.objWeight').text());
		
		if( weight < min ){
			min = weight;
			heightMinObj = parseInt($(this).height()); //$(this).find('tr.amountAssign:last').height();
			//alert(heightLastAssignment);
			//heightLastAssignment = 26;
			obj = $(this);
		}
	});

	$(obj).addClass('selected');
	//heightFirst = heightLastAssignment;
	minHeightGl = heightMinObj;
	//weightFirst = $('tr.selected').find('span.objWeight').text();
	minWeightGl = min;
	//$('tr.selected').height(heightFirst);
	$('tr.objname:not(tr.selected)').each(function(){
		weight = 0;
		height = 0;
		
		weight = $(this).find('span.objWeight').text();
		
		height = ( heightMinObj / min ) * weight;
		$(this).height(height);
	});
	//$('.tdassesment > table').css({"height":"100%", "margin-top":"0px"});
	//$('#highlightAssesment').css({"height":"100%"});
	//$('.table_unit').css("height",parseInt($('.table_unit').css("height"))+2+'px');

}

	objectiveWeight();
	heightAssignment();