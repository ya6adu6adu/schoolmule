var schoolmule = window.schoolmule||{};
schoolmule.controls = schoolmule.controls||{};
schoolmule.instances = schoolmule.instances||{};

schoolmule.instances.chart_stats = {
		width : '100%',
		height : '100%',
		settings:{
			view:"stackedBar",
			container:"pupil_assessment_stat",
		    value:"#assig#",
            color: "gray",
            tooltip:{
                template:"#day#"
            },
            //width:20,
			xAxis:{
                //width:20,
				title:dlang("stats_chsrt_title_hor","Performance/Assignments"),
				lines: false,
	            template:function(item){
                    if(item.type=='line'){
                        return "";
                    }
                    return "";
                    if(item.type=='perf' || item.type=='line'){
                        return "";
                    }
	                return item.day;
	            },

	            value:function(item){
	                return item.day;
	            },

	            units:{
	                start:0,
	                end:60,
	                next:function(value){
	                    return value+1;
	                }
	            }


			},

			yAxis:{
				start: 1,
				step: 2,
				end: 15,
                width:5,
				title:dlang("assign_submission_grade_chart","Assess./Submiss. grade"),
	            template: function(obj) {
	            	switch(obj){
	            		case "1": return '<p class="perf_assign_chart">'+dlang("assign_chart_title","Assig")+'</p>';
	            		case "2": return 'A/P';
	            		case "3": return '<span style="position:relative">'+dlang("subm_chart_title","Subm")+'</span>';
	            		case "5": return 'F';
	            		case "7": return 'E';
	            		case "9": return 'D';
	            		case "11": return 'C';
	            		case "13": return 'B';
	            		case "15": return 'A';
	            	}
                    return 1;
	            }
			}
		},
		load:function(chart){

			chart.addSeries({
			    value:"#vert_bar#",
				color:"rgb(69, 96, 117)",
				width:2,
				label:"",
				tooltip:{
					template:"Separator"
				}
			});

			chart.addSeries({
			    value:"#assig#",
				color:"gray",
				label:"",
				tooltip:{
					template:"#day_ts#"
				}
			});
			chart.addSeries({
			    value:"#subm1#",
				color:"yellow",
				label:"",
				tooltip:{
					template:"#day_ts#"
				}
			});
			chart.addSeries({
			    value:"#subm2#",
	            color:"blue",
	            label:"",
	            tooltip:{
	                template:"#day_ts#"
	            }
			});
			chart.addSeries({
			    value:"#grade1#",
	            color:"#00FF00",
	            label:"",
	            tooltip:{
	                template:"#day_ts#"
	            }
			});
			chart.addSeries({
			    value:"#grade2#",
	            color:"#00FF00",
	            label:"",
	            tooltip:{
	                template:"#day_ts#"
	            }
			});
			chart.addSeries({
			    value:"#grade3#",
	            color:"#00FF00",
	            label:"",
	            tooltip:{
	                template:"#day_ts#"
	            }
			});
			chart.addSeries({
			    value:"#grade4#",
	            color:"#00FF00",
	            label:"",
	            tooltip:{
	                template:"#day_ts#"
	            }
			});
			chart.addSeries({
			    value:"#grade5#",
	            color:"#00FF00",
	            label:"",
	            tooltip:{
	                template:"#day_ts#"
	            }
			});
			chart.addSeries({
			    value:"#grade6#",
	            color:"#00FF00",
	            label:"",
	            tooltip:{
	                template:"#day_ts#"
	            }
			});
			chart.addSeries({
			    value:"#grade7#",
	            color:"#00FF00",
	            label:"",
	            tooltip:{
	                template:"#day_ts#"
	            }
			});
			chart.addSeries({
			    value:"#grade8#",
	            color:"red",
	            label:"",
	            tooltip:{
	                template:"#day_ts#"
	            }
			});
		}
};