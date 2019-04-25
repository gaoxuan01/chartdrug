(function ($) {
	//渲染模板
	$.fn.renderTpl = function (tplString, data) {
		var result = null;
		try {
			var render = template.compile(tplString);
			result = render(data);
			if (this[0]) {
				$(this).html(result);
			}
		} catch (e) {
			throw new Error("add [ art-template ] lib please!!");
		}
	};
	var has401 = false;
	$.ajaxTemp = $.ajax;
	$.ajax = function (opt) {
		var url = opt.url;
		var type = opt.type || "POST";
		var success = opt.success;
		var error = opt.error;

		//如果请求为json文件，请求方法为GET
		if (url.match('.json')) {
			type = "GET";
		}
		opt.data = opt.data || {};
		$.LightBox.show();
		$.ajaxTemp({
			type: type,
			url: url,
			timeout: 15000, //超时时间设置，单位毫秒
			data: JSON.stringify(opt.data),
			headers: opt.header,
			dataType: 'json',
			contentType: 'application/json; charset=utf-8',
			success: function (res) {
				// console.log(res);
				$.LightBox.hide();
				if (res.code != 401) {
					has401 = false;
					success && success.call(this, res);
				} else {
					if (has401) {
						return false;
					}
					if (confirm("未登录")) {
						has401 = true;
						if (window.location.pathname == "/openPage.html") {
							_openPage.shareLogin();
						} else {
							window.location.href = "./";
						}

					}
				}
			},
			complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
				// console.log(Urls);
				if(status == 'timeout'){
					$.LightBox.hide();
					if (url == window.Urls.saveSourceLink) {//超时,status还有success,error等值的情况
						alert('数据库连接异常');
					}else{
						alert('请求超时');
					}
				}
				
			},
			error: function (res) {
				error && error.call(this, res);
			}
		});
	};

	$.queryUrlParam = function (name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r !== null) return decodeURIComponent(r[2]);
		return null;
	};
	/**
	 * 表单正则
	 */
	$.validateReg = {
		reg001: /^[1-9]*$|^[1-9]{1}\d*$|^[1-9]\d*\.\d{1,2}$|^0\.\d{1,2}$/, //整数或两位小数
		reg002: /^[0-9]{1}\d*$/, //整数
		require: /\S+/ //非空必填
	};
	$.validateContents = function (contentId, cbk) {
		var regCache = $.validateReg;
		var inputs = $(contentId).find("input[type=text][reg]");
		var selects = $(contentId).find("select");
		var flag = true;
		inputs.each(function (i, input) {
			var temp = $(input);
			var reg = temp.attr("reg");
			var currValue = temp.val();
			if (reg && !regCache[reg].test(currValue)) {
				flag = false;
				temp.addClass("hm-invalidate-input");
			} else {
				temp.removeClass("hm-invalidate-input");
			}
		});
		selects.each(function (i, slect) {
			var temp = $(slect);
			if (!temp.val() || temp.val() == '0') {
				flag = false;
				temp.addClass("hm-invalidate-input");
			} else {
				temp.removeClass("hm-invalidate-input");
			}
		});
		return flag;

	};

	$.LightBox = {
		element: null,
		init: function () {
			var height = '100%';
			var position = "fixed";

			var html = '<div id="lightbox" style="left:0; background:rgb(150,150,150); top:0; width:100%; height:'
				+ height
				+ '; filter:alpha(opacity=10); -moz-opacity: 0.1; opacity: 0.1;zoom:1; position:'
				+ position + '; z-index:10000000; " ><img src="./assets/images/loading.gif" style="margin-left: 48%; margin-top: 300px;" /></div>';


			this.element = $(html).appendTo(document.body);
			this.count = 0;
		},
		show: function () {
			if (!this.element) {
				this.init();
			}
			this.count++;
			this.element.show();
		},
		hide: function () {
			this.count--;
			if (this.count == 0) {
				this.element.hide();
			}
		}
	};


})(jQuery);
