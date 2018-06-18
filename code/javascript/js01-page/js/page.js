/*
*	分页组件
*	
*	参数说明：
*		id：容器的id
*		currentNum：当前页码
*		totalNum：总页数
*/
function page(opt) {

	if(!opt.id) { return false; }

	var obj = document.getElementById(opt.id);

	var currentNum = opt.currentNum || 1,
		totalNum = opt.totalNum || 5,
		callback = opt.callback || function() {},
		pageStep = 5, //页码步长
		halfStep = Math.ceil(pageStep / 2); //中间页距离两边的步长

	// 添加首页链接
	if(currentNum > halfStep && totalNum > pageStep) {
		var oA = document.createElement('a');
		oA.href = '#1';
		oA.innerHTML = '首页';
		obj.appendChild(oA);
	}

	// 添加上一页链接
	if(currentNum > 1) {
		var oA = document.createElement('a');
		oA.href = '#' + (currentNum - 1);
		oA.innerHTML = '上一页';
		obj.appendChild(oA);
	}

	if(totalNum <= pageStep) {
		// 如果总页数小于等于5，则直接遍历输出
		for(var i=1; i<=totalNum; i++) {
			var oA = document.createElement('a');
			oA.href = '#' + i;
			oA.innerHTML = i;

			if(currentNum == i) {
				// 当前页添加选择样式
				oA.className = "active";
			}

			obj.appendChild(oA);
		}
	} else {
		// 如果总页数大于5，则由中间向两边扩散
		for(var i=1; i<=5; i++) {
			var oA = document.createElement('a');

			if(currentNum == 1 || currentNum == 2){
				//如果当前页是第1页或者第2页
				oA.href = '#' + i;
				oA.innerHTML = i;

				if(currentNum == i) {
					// 当前页添加选择样式
					oA.className = "active";
				}
			} else if(totalNum - currentNum == 0 || totalNum - currentNum == 1){
				//如果当前页是最后两页
				oA.href = '#' + (totalNum - pageStep + i);
				oA.innerHTML = totalNum - pageStep + i;

				if(currentNum == totalNum - pageStep + i) {
					// 当前页添加选择样式
					oA.className = "active";
				}
			} else {
				//如果当前页不是第1页或者第2页
				oA.href = '#' + (currentNum - halfStep + i);
				oA.innerHTML = (currentNum - halfStep + i);

				if(i == halfStep) {
					// 当前页添加选择样式
					oA.className = "active";
				}
			}

			obj.appendChild(oA);
		}
	}

	// 添加下一页链接
	if(totalNum - currentNum > 0) {
		var oA = document.createElement('a');
		oA.href = '#' + (currentNum + 1);
		oA.innerHTML = '下一页';
		obj.appendChild(oA);
	}

	// 添加尾页链接
	if(totalNum - currentNum >= halfStep && totalNum > pageStep) {
		var oA = document.createElement('a');
		oA.href = '#' + totalNum;
		oA.innerHTML = '尾页';
		obj.appendChild(oA);
	}

	// 回调函数
	callback(currentNum, totalNum);

	// 添加链接点击事件处理
	var aA = obj.getElementsByTagName('a');

	for(var i=0; i<aA.length; i++) {
		aA[i].onclick = function() {
			// 获取点击的当前页码
			var currentNum = parseInt(this.getAttribute('href').substring(1));

			obj.innerHTML = '';

			page({
				id: opt.id,
				currentNum: currentNum,
				totalNum: totalNum,
				callback: callback
			});

			return false;
		}
	}

}