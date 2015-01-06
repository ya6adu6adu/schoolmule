<script src="dhtmlx/dhtmlxChart/codebase/dhtmlxchart.js" type="text/javascript"></script>
<link rel="STYLESHEET" type="text/css" href="dhtmlx/dhtmlxChart/codebase/dhtmlxchart.css">
<script src="testdata.js"></script>
<style>
</style>
<script>
    var month_dataset=[
        {grade:"F",weight:"40",obj:"Objective 1",color:"red"},
        {grade:"Not set",weight:"20",obj:"Objective 2",color:"yellow"},
        {grade:"E",weight:"10",obj:"Objective 3",color:"#93c47d"},
        {grade:"A",weight:"30",obj:"Objective 4",color:"green"}
    ];
        window.onload = function() {
        var chart = new dhtmlXChart({
            view: "pie",
            container: "chart1",
            value: "#weight#",
            color: "#color#",
            labelOffset: 12,
            shadow: 1,
            //label: "#obj#",
            label: function(obj) {
                return "<div style='font-size: 11px;'>" + obj.obj + "</div>";
            },
            pieInnerText: "<sapn class='label' style='font-size: 11px; color: #000;'>#grade#</sapn>",
    });
    chart.parse(month_dataset, "json");

    var chart2 = new dhtmlXChart({
        view: "pie",
        container: "chart2",
        value: "#sales#",
        color: "#color#",
        tooltip: "#sales#",
        label: "#month#",
        shadow: 0,
        radius: 65,
        x: 280,
        y: 120
    });
    chart2.parse(month_dataset, "json");
    }
</script>

<table>
    <tr>
        <td>Pie chart with Automatic radius and center position</td>
        <td>Pie chart with Custom radius and center position</td>
    </tr>
    <tr>
        <td><div id="chart1" style="width:400px;height:250px;border:1px solid #A4BED4;"></div></td>
        <td><div id="chart2" style="width:400px;height:250px;border:1px solid #A4BED4;"></div></td>
    </tr>
</table>