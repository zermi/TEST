//作者:fishdo;

//通过class获取节点
function getElementsByClassName(className) {
	var classArr = [];
	var tags = document.getElementsByTagName('*');
	for(var i = 0; i < tags.length; i++) {
		if(tags[i].nodeType == 1) {
			if(tags[i].getAttribute('class') == className) {
				classArr.push(tags[i]);
			}
		}
	}
	return classArr; //返回
}

//设置cookie
function setCookie(name, value, expires, path, domain, secure) {
	var createText = encodeURIComponent(name) + "=" + encodeURIComponent(value);
	if(expires instanceof Date) {
		createText += "; expires=" + expires.toGMTString();
	}
	if(path) {
		createText += "; path=" + path;
	}
	if(domain) {
		createText += "; domain=" + domain;
	}
	if(secure) {
		createText += "; secure=" + secure;
	}
	document.cookie = createText;
}

//获取cookie
function getCookie() {
	var cookie = {};
	var all = document.cookie;
	if(all == "") {
		return cookie;
	}
	var list = all.split("; ");
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var num = item.indexOf("=");
		var name = encodeURIComponent(item.substring(0, num));;
		var value = encodeURIComponent(item.substring(num + 1));
		cookie[name] = value;
	}
	return cookie;
}

$(function() {
	//	登录框
	function login() {
		var fans = document.getElementsByClassName("title-attention")[0];
		fans.addEventListener('click', function(e) {
			var back = document.getElementsByClassName("mask")[0];
			var model = document.getElementsByClassName("model")[0];
			back.style.display = "block";
			model.style.display = "block";
			verification();
			closeModel();
		})
	}
	login()

	//	验证用户名密码
	function loginVeri() {
		if(($("#modal-user").val() == "studyOnline" && $("#modal-password").val() == "study.163.com")) {
			return true;
		} else {
			if($("#modal-user").val() == "") {
				$("#modal-user").css("background-color", "lightpink");
			}
			if($("#modal-password").val() == "") {
				$("#modal-password").css("background-color", "lightpink");
			}
			deleteRed()
		}
	}
	//	点击文本框取消红色
	function deleteRed() {
		$("input").on("focus", function() {
			$("input").css("background-color", "")
		})
	}

	//	登录验证
	function verification() {
		$(".s-btn").on("click", function() {
			var data = {
				userName: md5("studyOnline"),
				password: md5("study.163.com")
			}
			if(loginVeri()) {
				$.ajax({
					type: "get",
					data: data,
					url: "http://study.163.com/webDev/login.htm",
					async: true,
					success: function(res) {
						if(res == 1) {
							setCookie("userName", "password");
							$.ajax({
								type: "get",
								url: "http://study.163.com/webDev/attention.htm",
								async: true,
								success: function(response) {
									if(response == 1) {
										setCookie("checked", "true");
										$(".mask").css("display", "none");
										$(".model").css("display", "none");
										successAttention()
									}
								}
							});
						}
					}
				});
			}
		})
	}

	//	已登录的状态
	function attentioned() {
		var last = document.getElementsByClassName("title-attention")[0];
		var success = document.getElementsByClassName("title-attentioned")[0];
		var cancel = document.getElementsByClassName("cancel")[0];
		last.style.display = 'none';
		success.style.display = 'inline-block';
		cancel.style.display = "inline-block";
	}

	//	判断cookie是否已登录
	function successAttention() {
		if(getCookie().checked) {
			attentioned();
			cancelAttention()
		}
	}
	successAttention()

	//	点击取消关注
	function cancelAttention() {
		$(".cancel").on('click', function() {
			$(".title-attention").css('display', 'inline-block');
			$(".title-attentioned").css('display', 'none');
			$(this).css("display", "none");
		})
	}

	//	关闭登录框
	function closeModel() {
		$(".off").on("click", function() {
			$(".mask").css('display', 'none');
			$(".model").css('display', 'none');
		})
	}

	//  顶部提示框
	function topAlert() {
		$(".title-x").on("click", function() {
			$(".title-alert-outer").css("display", "none");
			setCookie("title", "true");
		})
	}
	topAlert()
		//判断cookie是否要弹出提示框	
	function noAlert() {
		if(getCookie().title) {
			$(".title-alert-outer").css("display", "none");
		}
	}
	noAlert()

	//	轮播图

	//	手动轮播
	$(".carousel-img li").eq(0).show();
	$(".carousel-num li").eq(0).addClass("actoutive");
	$(".carousel-num li").mouseover(function() {
			$(this).addClass("active").siblings().removeClass("active");
			var index = $(this).index();
			$(".carousel-img li").eq(index).stop().fadeIn(500).siblings().stop().fadeOut(500);
		})
		//	自动轮播
	var i = 0;

	function carousel() {
		i++;
		if(i == 3) {
			i = 0;
		};
		$(".carousel-num li").eq(i).addClass("active").siblings().removeClass("active");
		$(".carousel-img li").eq(i).stop().fadeIn(500).siblings().stop().fadeOut(500);
	}
	var s = setInterval(carousel, 5000)

	//	鼠标移动到轮播上
	$(".out").mouseover(function() {
		clearInterval(s)
	});
	$(".out").mouseout(function() {
		s = setInterval(carousel, 5000)
	});

	//左侧tab
	function leftTab() {
		//		事件委托木有写成功 应该是有两个className的缘故
		//		$(".main-nav").on("click",function(event){
		//			switch(event.target.className){
		//				case "main-nav-container":
		//					$(this).addClass("main-nav-first").siblings().removeClass("main-nav-first");
		//				case "main-nav-first":
		//					getLeftMainLis(pageno(),psize(),10);
		//				case "main-nav-second":
		//					getLeftMainLis(pageno(),psize(),20);
		//			}
		//		})
		$(".main-nav-container").on('click', function() {
			$(this).addClass("main-nav-first").siblings().removeClass("main-nav-first");
		});
		$(".main-nav-first").on('click', function() {
			getLeftMainLis(pageno(), psize(), 10);
		});
		$(".main-nav-second").on('click', function() {
			getLeftMainLis(pageno(), psize(), 20);
		});
		ptype()
	}
	leftTab()

	function ptype() {
		if($(".main-nav-second").css("background-color") == "rgba(0, 0, 0, 0)") {
			return 10;
		} else {
			return 20;
		}
	}

	//左侧内容区页码
	var index = 1;

	function pageno() {
		$(".page").children().on('click', function(e) {
			$(".page-first").removeClass("page-first");
			$(this).css('background-color', '#9DD8B1').siblings().css("background-color", "")
			$(this).css('color', '#FFFFFF').siblings().css("color", "");
			index = $(this).index();
			getLeftMainLis(index, psize(), ptype());
		})
		$(".page-ico").off('click');
		$(".page-ico-left").on("click", function() {
			$(".page-first").removeClass("page-first");
			index--;
			if(index == 0) {
				index = 8;
			}
			$(".page li").eq(index).css('background-color', '#9DD8B1').siblings().css("background-color", "");
			$(".page li").eq(index).css('color', '#FFFFFF').siblings().css("color", "");
			getLeftMainLis(index, psize(), ptype());
		})
		$(".page-ico-right").on("click", function() {
			$(".page-first").removeClass("page-first");
			index++;
			if(index == 9) {
				index = 1;
			}
			$(".page li").eq(index).css('background-color', '#9DD8B1').siblings().css("background-color", "");
			$(".page li").eq(index).css('color', '#FFFFFF').siblings().css("color", "");
			getLeftMainLis(index, psize(), ptype());
		})
		return index;
	}
	pageno()

	window.onresize = function() {
		getLeftMainLis(pageno(), psize(), ptype())
	};

	//	请求数据数量(与宽度适应). 但是是静态的。打开的时候多大是多少就是多少。 一旦出现打开的时候小窗口 一放大这个无法动态改变。
	function psize() {
		if($(".g-outer").width() > 1205) {
			return 20;
		} else {
			return 15;
		}
	}

	function getLeftMainLis(pageNo, pSize, pType) {
		var main = document.getElementsByClassName("course")[0];
		var overMain = document.getElementsByClassName("instruction")[0];
		//ajax获取左侧内容区数据
		var data = {
			pageNo: pageNo,
			psize: pSize,
			type: pType
		}
		$.ajax({
			type: "get",
			url: "http://study.163.com/webDev/couresByCategory.htm",
			data: data,
			async: true,
			success: function(res) {
				var result = JSON.parse(res);
				courseRender(result.list, result.pagination.pageSize)
			}
		});

		//	建立html结构
		function createList(opt) {
			return '<li class="course-container"><div class="course-content"><img class="course-content-p" src="' + opt.middlePhotoUrl + '"/><p class="course-content-title">' +
				opt.name + '</p><p class="course-content-author">' + opt.provider + '</p><div class="course-content-hot"><img src="img/用户.png">' +
				opt.learnerCount + '</div></div><div class="course-content-pay">￥' + opt.price + '</div><div class="instruction-outer"><div class="instruction-top clearfix"><div class="instruction-img"><img src="' + opt.middlePhotoUrl + '" /></div><div class="instruction-content"><p class="instruction-content-name">' +
				opt.name + '</p><p class="instruction-content-learner"><img src="img/用户.png">' +
				opt.learnerCount + '在学</p><p class="instruction-content-provide">发布者：' + opt.provider + '</p><p class="instruction-content-category">' + opt.categoryName + '</p></div></div><div class="instruction-container"><p class="instruction-content-description">' +
				opt.description + '</p></div></div></li>'
		}

		//	遍历数据
		function courseRender(arr, num) {
			var lis = '';
			for(var i = 0; i < num; i++) {
				lis += createList(arr[i]);
			}
			main.innerHTML = lis;
			//	课程详情函数	
			classesInstruction()
		}

	}
	getLeftMainLis(1, psize(), 10)

	//	课程详情事件
	function classesInstruction() {
		$(".course-container").hover(function() {
			$(".instruction-outer").eq($(this).index()).css("display", "block");
			$(this).css("box-shadow", "1px 1px #39a030");
		}, function() {
			$(".instruction-outer").eq($(this).index()).css("display", "none");
			$(this).css("box-shadow", "");
		})
	}

	////	实时监听宽度变化
	//	window.onresize = function(){
	//		imgNumber()
	//	}
	////	环境图变化
	//	function imgNumber(){
	//		if(document.body.clientWidth < 1205){
	//			$(".environment-img1").css("display","none").siblings().css("display","block");
	//			$(".environment-img5").css("display","none").siblings().css("display","block");
	//		}else{
	//			$(".environment-img1").css("display","block").siblings().css("display","none");
	//			$(".environment-img5").css("display","block").siblings().css("display","none");
	//		}
	//	}
	//	imgNumber()

	//右侧最热排行
	function hotList() {
		var hotUl = document.getElementsByClassName("hot-list")[0];

		function createHotList(opt) {
			return '<li class="clearfix" style="top:0"><img class="hot-img" src="' + opt.middlePhotoUrl + '"/><p class="hot-title">' +
				opt.name + '</p><div class="hot-learner"><img src="img/用户.png" />' + opt.learnerCount + '</div></li>'
		}
		$.ajax({
			type: "get",
			url: "http://study.163.com/webDev/hotcouresByCategory.htm",
			async: true,
			success: function(res) {
				var result = JSON.parse(res);
				var hotLis = '';
				for(var i = 0; i < 20; i++) {
					hotLis += createHotList(result[i])
				}
				hotUl.innerHTML = hotLis;
			}
		});
		hotScroll()
	}
	hotList()

	//	最热排行滚动效果
	//	最开始li是没有style的所以transition并不能发挥其作用,没研究到好方法,最后在↑获取数据的时候直接加了个style 估计是笨到家了。
	function hotScroll() {
		var i = 0;
		var h;
		var hotset = setInterval(
			function topScroll() {
				i++;
				h = -i * 72;
				$(".hot-list li").css("top", h);
				if(i == 11) {
					$(".hot-list li").css("top", "0");
					i = 0;
				}
			}, 5000)
		$(".hot-list").hover(function() {
			clearInterval(hotset)
		}, function() {
			hotset = setInterval(
				function topScroll() {
					i++;
					h = -i * 72;
					$(".hot-list li").css("top", h);
					if(i == 11) {
						$(".hot-list li").css("top", "0");
						i = 0;
					}
				}, 5000)
		})
	}

	//	视频弹窗
	function videoAlert() {
		$(".side-main-video").on('click', function() {
			$(".video").css("display", "block");
		})
		$(".video-exit").on('click', function() {
			$(".video").css("display", "none");
		})
	}
	videoAlert()
})