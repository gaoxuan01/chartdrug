function DadaVController(param) {
	this.init(param);
}

DadaVController.prototype = {
	init: function (param) {
		var _t = this;
		var id = 'char_'+new Date().getTime();
		var container = $('<div id="'+id+'" class="chart-container"></div>');
		$(param.id).append(container);
		_t.param = param, _t.contentWidth = $(param.id).width(),_t.containerId='#'+id,_t.containDivId = param.id;
		container.css('width',_t.contentWidth+2);
		_t.bgNumber = 18;
		_t.unitWidth = parseFloat((_t.contentWidth / _t.bgNumber).toFixed(2)), _t.unitHeight = Math.round(((_t.unitWidth - 9) * (130 / 177) + 9));
		container.css('height', _t.bgNumber * _t.unitHeight+2);

		if (param.dataList && param.dataList.length) {
			_t.initData(param.dataList);
		}
		if (param.isEdit) {
			var svg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='2000' height='" + _t.unitHeight + "'>";
			for (var i = 0; i < 20; i++) {
				svg += "<rect stroke='#D7DBDE' stroke-width='1' fill='none' x='" + (4.5 + _t.unitWidth * i) + "' y='4.5' width='" + (_t.unitWidth - 9) + "' height='" + (_t.unitHeight - 9) + "'/>";
			}
			svg += "</svg>";
			container.css({'background-image': "url(\"" + svg + "\")"});
			_t.initChartAction();
		}
		$(window).on('resize',function(){
			_t.bindWindowResize();
		});
	},
	/**
	 * 初始化chart 数据
	 * @param dataList
	 */
	initData: function (dataList) {
		var _t = this;
		var el = $(_t.containerId);
		for (var i = 0; i < dataList.length; i++) {
			var temp = dataList[i];
			var unid = 'chart_' + temp['chart_id'] + new Date().getTime() + parseInt(Math.random()*10000);
			var unit = $(_t.getChartUnitHtml(unid, temp['chart_id'], temp['path']));
			el.append(unit);
			unit.css({
				left: temp['left_num'] * _t.unitWidth,
				top: temp['top_num'] * _t.unitHeight,
				width: temp['w_num'] * _t.unitWidth,
				height: temp['h_num'] * _t.unitHeight
			});
			unit.attr({'w_num':temp['w_num'],'h_num':temp['h_num'],'l_num':temp['left_num'],'t_num':temp['top_num']});
		}
		var data=dataList[0]||{};
		if((data.top_num+data.h_num)>_t.bgNumber){
			$(_t.containerId).css('height', (data.top_num+data.h_num+6) * _t.unitHeight);
		}

	},
	/**
	 * 初始化图表事件
	 */
	initChartAction: function () {
		var _t = this;
		$(_t.containerId).on('click', '.chart-del', function () {
			$(this).closest('.chart-unit-div').remove();
		});
		$(_t.containerId).on('click', '.chart-edit', function () {
			var chart = $(this).closest('.chart-unit-div');
			_t.editChart && _t.editChart(chart.attr('chart'), chart.find('iframe')[0]);
		});
		$(".chart-unit-div").draggable({
			containment: _t.containerId,
			scroll: false,
			snap: true,
			// grid: [ 101, 75 ],
			stack: ".chart-unit-div",
			stop: function (event, ui) {

				_t.drag(ui);
			}
		}).resizable({
			containment: _t.containerId,
			stack: ".chart-unit-div",
			start: function (event, ui) {
				this.originalSize = {width: this.clientWidth, height: this.clientHeight};
				this.originalZIndex = $(this).css('zIndex');
				$(this).css('zIndex', 100000);
				event.stopPropagation();
				return false;
			},
			// grid: [ 101, 75 ],
			stop: function (event, ui) {
				$(this).css('zIndex', this.originalZIndex);
				_t.resize(ui);
			}
		}).on('resize',function(e){
			e.stopPropagation();
			return false;
		});

	},
	/**
	 * window 自适应
	 */
	bindWindowResize:function(){
		var _t = this,container=$(_t.containerId);
		var h_number = Math.round($(_t.containerId).height()/_t.unitHeight);
		_t.contentWidth = $(_t.containDivId).width();
		_t.unitWidth = parseFloat((_t.contentWidth / _t.bgNumber).toFixed(2)), _t.unitHeight = Math.round(((_t.unitWidth - 9) * (130 / 177) + 9));
		container.css('width',_t.contentWidth+2);
		container.css('height',h_number*_t.unitHeight+2);
		if (_t.param.isEdit) {
			var svg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='2000' height='" + _t.unitHeight + "'>";
			for (var i = 0; i < 20; i++) {
				svg += "<rect stroke='#D7DBDE' stroke-width='1' fill='none' x='" + (4.5 + _t.unitWidth * i) + "' y='4.5' width='" + (_t.unitWidth - 9) + "' height='" + (_t.unitHeight - 9) + "'/>";
			}
			svg += "</svg>";
			container.css({'background-image': "url(\"" + svg + "\")"});
		}
		container.find('.chart-unit-div').each(function(i,item){
			var temp = $(item);
			temp.css({width: _t.unitWidth * temp.attr('w_num'),height: _t.unitHeight*temp.attr('h_num'),left:_t.unitWidth * temp.attr('l_num'),top: _t.unitHeight*temp.attr('t_num')});
		});
	},
	/**
	 * 获取图表单元
	 * @param unitId
	 * @param chartId
	 * @param src
	 * @returns {string}
	 */
	getChartUnitHtml: function (unitId, chartId, src) {
		var _t = this;
		var str = '<div id="' + unitId + '" class="chart-unit-div" path="' + src + '" chart="' + chartId + '">';
				// str += '<div class="chart-drug-box">';
				if (_t.param.isEdit) {
					str += '<div class="chart-drug-box"><span class="chart-edit" title="设置"><i class="fa fa-cog btn-deploy" aria-hidden="true" ></i></span><span class="chart-del" title="删除"><i class="fa fa-times" aria-hidden="true"></i></span></div>';
				}
				// str += '</div> ';
				str += '<iframe frameborder="0" class="con" src="' + src + '" id="iframe_'+unitId+'"></iframe>';
				str += '</div>';
		return str;
	},
	/**
	 * 添加图形单元
	 */
	// addChartUnit: function (id, src) {
	// 	var _t = this;
	// 	var unid = 'chart_' + id + new Date().getTime() + parseInt(Math.random()*10000);
	// 	var chartUnit = $(_t.getChartUnitHtml(unid, id, src));
	// 	chartUnit.css({width: _t.unitWidth * 4, height: _t.unitHeight * 4});
	//
	// 	$(_t.containerId).append(chartUnit);
	// 	var rowsNum = parseInt($(_t.containerId).height() / _t.unitHeight);
	// 	outLayer:
	// 		for (var i = 0; i < rowsNum; i++) {
	// 			for (var j = 0; j < _t.bgNumber; j++) {
	// 				var pos = {
	// 					left: Math.ceil(_t.unitWidth * j),
	// 					top: Math.ceil(_t.unitHeight * i),
	// 					realLeft: _t.unitWidth * j,
	// 					realTop: _t.unitHeight * i
	// 				};
	// 				var isIn = _t.hasin(pos, chartUnit[0], 20);
	// 				if (!isIn && (pos.realLeft + chartUnit.width()) <= _t.contentWidth) {
	// 					var conHeight = $(_t.containerId).get(0).offsetHeight;
	// 					if(pos.realTop+6*_t.unitHeight>conHeight){
	// 						$(_t.containerId).css('height',conHeight+6*_t.unitHeight);
	// 					}
	// 					chartUnit.css({left: pos.realLeft, top: pos.realTop});
	// 					chartUnit.attr({'w_num':4,'h_num':4,'l_num':j,'t_num':i});
	// 					_t.toAddDrugAction(chartUnit);
	// 					break outLayer;
	// 				}
	// 			}
	// 		}
	// },
	addChartUnit: function (id, src) {
		var _t = this;
		var unid = 'chart_' + id + new Date().getTime() + parseInt(Math.random()*10000);
		var chartUnit = $(_t.getChartUnitHtml(unid, id, src));
		chartUnit.css({width: _t.unitWidth * 4, height: _t.unitHeight * 4});
		chartUnit.attr({'w_num':4,'h_num':4});
		$(_t.containerId).append(chartUnit);
		var rowsNum = parseInt($(_t.containerId).height() / _t.unitHeight);
		outLayer:
			for (var i = 0; i < rowsNum; i++) {
				for (var j = 0; j < _t.bgNumber; j++) {
					var pos = {
						left: j,
						top: i,
						realLeft: _t.unitWidth * j,
						realTop: _t.unitHeight * i
					};
					var isIn = _t.hasin2(pos, chartUnit[0], 0.2);
					if (!isIn && (pos.left + 4) <= _t.bgNumber) {
						var conHeight = $(_t.containerId).get(0).offsetHeight;
						if(pos.realTop+6*_t.unitHeight>conHeight){
							$(_t.containerId).css('height',conHeight+6*_t.unitHeight);
						}
						chartUnit.css({left: pos.realLeft, top: pos.realTop});
						chartUnit.attr({'w_num':4,'h_num':4,'l_num':j,'t_num':i});
						_t.toAddDrugAction(chartUnit);
						break outLayer;
					}
				}
			}
	},
	/**
	 * 注册拖动，缩放时间
	 */
	toAddDrugAction: function (item) {
		var _t = this;
		item.draggable({
			containment: _t.containerId,
			scroll: false,
			snap: true,
			// grid: [ 101, 75 ],
			stack: ".chart-unit-div",
			stop: function (event, ui) {

				_t.drag(ui);
			}
		}).resizable({
			containment: _t.containerId,
			stack: ".chart-unit-div",
			start: function (event, ui) {
				this.originalSize = {width: this.clientWidth, height: this.clientHeight};
				this.originalZIndex = $(this).css('zIndex');
				$(this).css('zIndex', 100000);
			},
			// grid: [ 101, 75 ],
			stop: function (event, ui) {
				$(this).css('zIndex', this.originalZIndex);
				_t.resize(ui);
			}
		}).on('resize',function(e){
			e.stopPropagation();
			return false;
		});

	},
	/**
	 * 拖动
	 * @param ui
	 */
	drag: function (ui) {
		var _t = this, unitW = _t.unitWidth, unitH = _t.unitHeight;
		var pos = ui.position;
		var isIn = _t.hasin(pos, ui.helper[0], 20);
		if (!isIn) {
			var n = parseInt(pos.left / unitW), ef = pos.left % unitW, tn = parseInt(pos.top / unitH), tef = pos.top % unitH;
			var left_n = ef > (unitW / 2) ? (n + 1) :  n;
			var top_n = tef > (unitH / 2) ?  (tn + 1) :  tn;
			//窗口高度适应
			var conHeight = $(_t.containerId).get(0).offsetHeight;
			if(top_n*unitH+ui.helper[0].clientHeight+2*_t.unitHeight>=conHeight){
				$(_t.containerId).css('height',conHeight+6*_t.unitHeight);
			}
			ui.helper.css({left: left_n*unitW, top: top_n*unitH});
			ui.helper.attr({'l_num':left_n,'t_num':top_n});
		} else {
			ui.helper.css({left: ui.originalPosition.left, top: ui.originalPosition.top});
		}

	},
	/**
	 * 缩放
	 * @param ui
	 */
	resize: function (ui) {
		var _t = this, unitW = _t.unitWidth, unitH = _t.unitHeight;
		var size = ui.size, currItem = ui.helper[0];
		var isIn = _t.hasin(ui.position, currItem, 20);
		if (!isIn) {
			var n = parseInt(size.width / unitW), ef = size.width % unitW, tn = parseInt(size.height / unitH), tef = size.height % unitH;
			var vn = ef > (unitW / 2) ? n + 1 : n;
			var hn = tef > (unitH / 2) ? tn + 1 : tn;
			vn = vn > 3 ? vn : 3;
			hn = hn > 3 ? hn : 3;
			//窗口高度适应
			var conHeight = $(_t.containerId).get(0).offsetHeight;
			if(currItem.offsetTop+hn * unitH+2*_t.unitHeight>conHeight){
				$(_t.containerId).css('height',conHeight+6*_t.unitHeight);
			}
			ui.helper.css({width: vn * unitW, height: hn * unitH});
			ui.helper.attr({'w_num':vn,'h_num':hn});
		} else {
			ui.helper.css({width: currItem.originalSize.width, height: currItem.originalSize.height});
		}
	},

	/**
	 *
	 * @param pos 当前坐标
	 * @param obj 当前操作对象
	 * @param containWidth 容错范围
	 * @returns {boolean}
	 */
	hasin: function (pos, obj, containWidth) {
		var _t = this, isIn = false;
		pos.width = obj.clientWidth;
		pos.height = obj.clientHeight;
		$(_t.containerId).find(".chart-unit-div").each(function (i, item) {
			if (item == obj) {
				return true;
			}
			var offset = {left: item.offsetLeft, top: item.offsetTop, width: item.clientWidth, height: item.clientHeight};
			if (_t.changeRole(pos, offset, containWidth) || _t.changeRole(offset, pos, containWidth)) {
				isIn = true;
				return false;
			}
		});
		return isIn;
	},
	/**
	 * 解决小于800 无定位时的情况
	 * @param pos
	 * @param obj
	 * @param containWidth
	 * @returns {boolean}
	 */
	hasin2: function (pos, obj, containWidth) {
		var _t = this, isIn = false;
		pos.width = parseInt($(obj).attr('w_num'));
		pos.height = parseInt($(obj).attr('h_num'));
		$(_t.containerId).find(".chart-unit-div").each(function (i, item) {
			if (item == obj) {
				return true;
			}
			var offset = {left: parseInt($(item).attr('l_num')), top: parseInt($(item).attr('t_num')), width: parseInt($(item).attr('w_num')), height: parseInt($(item).attr('h_num'))};
			if (_t.changeRole(pos, offset, containWidth) || _t.changeRole(offset, pos, containWidth)) {
				isIn = true;
				return false;
			}
		});
		return isIn;
	},

	/**
	 * 比较单元互换
	 * @param pos
	 * @param offset
	 * @param containWidth
	 * @returns {boolean}
	 */
	changeRole: function (pos, offset, containWidth) {
		var isIN = false;
		var v1 = pos.left >= offset.left && pos.left < offset.left + offset.width - containWidth && (pos.top >= offset.top && pos.top < offset.top + offset.height - containWidth || pos.top + pos.height > offset.top + containWidth && pos.top + pos.height <= offset.top + offset.height); //左
		var v2 = pos.left + pos.width > offset.left + containWidth && pos.left + pos.width <= offset.left + offset.width && (pos.top >= offset.top && pos.top < offset.top + offset.height - containWidth || pos.top + pos.height > offset.top + containWidth && pos.top + pos.height <= offset.top + offset.height); //右
		var v3 = pos.top >= offset.top && pos.top < offset.top + offset.height - containWidth && (pos.left >= offset.left && pos.left < offset.left + offset.width - containWidth || pos.left + pos.width <= offset.left + offset.width && pos.left + pos.width > offset.left + containWidth); //上
		var v4 = pos.top + pos.height > offset.top + containWidth && pos.top + pos.height <= offset.top + offset.height && (pos.left >= offset.left && pos.left < offset.left + offset.width - containWidth || pos.left + pos.width <= offset.left + offset.width && pos.left + pos.width > offset.left + containWidth);
		var v5 = pos.left <= offset.left && pos.left + pos.width >= offset.left + offset.width && pos.top <= offset.top && pos.top + pos.height >= offset.top + offset.height;
		if (v1 || v2 || v3 || v4 || v5) {
			isIN = true;
		}
		return isIN;
	},
	/**
	 * 删除
	 */
	deleteChart: function (id) {
		$('#chart_' + id).remove();
	},
	/**
	 * 获取保存的数据
	 */
	getSaveData: function () {
		var _t = this;
		var saveList = [];
		$(_t.containerId).find(".chart-unit-div").each(function (i, item) {
			saveList.push({
				'left_num': $(item).attr('l_num')||Math.round(item.offsetLeft / _t.unitWidth),
				'top_num': $(item).attr('t_num')||Math.round(item.offsetTop / _t.unitHeight),
				'w_num': $(item).attr('w_num')||Math.round(item.clientWidth / _t.unitWidth),
				'h_num': $(item).attr('h_num')||Math.round(item.clientHeight / _t.unitHeight),
				'chart_id': $(item).attr('chart'),
				'path': $(item).attr('path')
			});

		});
		return saveList;
	}
};