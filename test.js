$(function () {
	var dataList = [{"left_num": 0, "top_num": 1, "w_num": 4, "h_num": 4, "chart_id": "1", "unit_id": "chart_11544085425822"}, {
		"left_num": 4,
		"top_num": 2,
		"w_num": 3,
		"h_num": 9,
		"chart_id": "2",
		"unit_id": "chart_21544085426038"
	}, {"left_num": 7, "top_num": 0, "w_num": 4, "h_num": 4, "chart_id": "3", "unit_id": "chart_31544085426812"}, {
		"left_num": 11,
		"top_num": 0,
		"w_num": 5,
		"h_num": 7,
		"chart_id": "4",
		"unit_id": "chart_41544085433580"
	}, {"left_num": 7, "top_num": 8, "w_num": 4, "h_num": 4, "chart_id": "5", "unit_id": "chart_51544085444476"}, {
		"left_num": 0,
		"top_num": 5,
		"w_num": 4,
		"h_num": 4,
		"chart_id": "6",
		"unit_id": "chart_61544085446580"
	}];
	var controller = new DadaVController({
		id:'#container',
		dataList:dataList,
		isEdit:true
	});
	controller.editChart = function (id,iframe){
		console.log(id);
		console.log(iframe);
	};
	var i = 0;
	$('#add_btt').on('click',function(){
		i++;
		controller.addChartUnit(i);
	});
	$('#save_btt').on('click',function(){
		var data = controller.getSaveData();
		console.log(JSON.stringify(data));
	});
});
