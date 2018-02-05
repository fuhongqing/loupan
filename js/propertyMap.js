$(function() {
	var mp = new BMap.Map("allmap", {
		minZoom: 4,
		maxZoom: 18,
		enableMapClick: false
	}); //市级视图单位缩放比zoom18
	//	var mp = new BMap.Map("allmap");
	mp.disableDoubleClickZoom();
	mp.addControl(new BMap.ScaleControl()); // 添加默认比例尺控件
	mp.addControl(new BMap.ScaleControl({
		anchor: BMAP_ANCHOR_BOTTOM_LEFT
	})); // 左下
	mp.addControl(new BMap.NavigationControl()); //添加默认缩放平移控件
	mp.addControl(new BMap.NavigationControl({
		anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
		//type: BMAP_NAVIGATION_CONTROL_SMALL
	})); //右上角，仅包含平移和缩放按钮
	//	var point = new BMap.Point(110.803154, 19.559595);
	var point = new BMap.Point(121.434902, 31.266209); //上海视图
	mp.centerAndZoom(point, 7); //初始缩放比
	//	mp.centerAndZoom(point, 14);
	mp.enableScrollWheelZoom();

	var u = mp.getZoom(); // 定义地图缩放等级的变量
	var markerArr = [];
	var markerObj;
	addMarker(1, mp.getBounds().getNorthEast().lng, mp.getBounds().getSouthWest().lng,
		mp.getBounds().getNorthEast().lat, mp.getBounds().getSouthWest().lat, '', '', '', '',
		1, 100);

	function Karea(msg) {
		if(msg) {
			return msg;
		} else {
			return "";
		}
	}
	var proSize;
	var proStr = "";
	var count = 1;
	var conditionNum;

	function addMarker(thisCondition, thisMaxLng, thisMinLng, thisMaxLat, thisMinLat, thisFollowType, thisBuildingType, thisDealMoney, thisSearch, thisPageNum, thisPageSize) {
		console.log(thisCondition);
		$(".listDiv ul").html("");
		var markerArr = [];
		var markerObj = {};
		proStr = "";
		if(mp.getZoom() <= 10) {
			conditionNum = 1;
		} else if(mp.getZoom() <= 12) {
			conditionNum = 2;
		} else if(mp.getZoom() <= 13) {
			conditionNum = 3;
		} else {
			conditionNum = 4;
		}
		$.ajax({
			type: "post",
			url: initUrl + "getEveryMap_2.do",
			async: false,
			data: {
				condition: thisCondition,
				maxlng: thisMaxLng,
				minlng: thisMinLng,
				maxlat: thisMaxLat,
				minlat: thisMinLat,
				FollowType: thisFollowType,
				BuildingType: thisBuildingType,
				DealMoney: thisDealMoney,
				SearchStr: "",
				PageNum: thisPageNum,
				PageSize: thisPageSize,
	            PermissionID:permissionID,//是	string	营运中心或事业部或开发组或开发人员 的 ID
	            Permissiontype:permissionType//是	string	1为 营运中心 2事业部 3位开发组 4位开发人员
			},
			success: function(data) {
				console.log(data);
				proSize = data.data.mapListCount_2;
				count = 1;

				var mapList2 = data.data.mapList_2;
				if(mapList2.length != 0) {
					$.each(mapList2, function(i) {
						proStr +=
							'<a href ="javascript:;""javascript:;" >' +
							'<li>' +
							'<div>' +
							'<p title="' + mapList2[i].PropertyName + '">' + mapList2[i].PropertyName + '</p>' +
							'<p>' + buildingType(mapList2[i].BuildingType) + '</p>' +
							'</div>' +
							'<div>' +
							'<p>' + ProxySalestype(mapList2[i].ProxySalestype) + FollowType(mapList2[i].FollowType) + '</p>' +
							'<p title="' + mapList2[i].PropertyAddress + '">[' + mapList2[i].CityName + '-' + mapList2[i].BoroughName + ']' + mapList2[i].PropertyAddress + '</p>' +
							'</div>' +
							'<div>' +
							'<p>' + mapList2[i].DealMoney + '亿</p>' +
							'<p>' + mapList2[i].SalesHouse + '套</p>' +
							'</div>' +
							'</li>' +
							'</a>';
					});
					$(".listDiv ul").html(proStr);
				}

				$(".listTop span").html('[' + data.data.mapListCount_2 + "]");

				if(mp.getZoom() > 13) {
					if(data.data.length != 0) {
						$.each(data.data.mapList_2, function(i) {
							markerObj = {
								title: data.data.mapList_2[i].PropertyName,
								num: data.data.mapList_2[i].count,
								point: data.data.mapList_2[i].Longitude + '|' + data.data.mapList_2[i].Latitude,
								isOpen: 0,
								icon: {
									w: 21,
									h: 21,
									l: 0,
									t: 0,
									x: 6,
									lb: 5
								}
							}
							markerArr.push(markerObj);
						});
					}
					//console.log(markerArr)

					// 复杂的自定义覆盖物
					function ComplexCustomOverlay(point, text, mouseoverText, num, PropertyName, areaName, citypoint, borough) {
						this._point = point;
						this._text = text;
						this._overText = mouseoverText;
						this._num = num;
						this._PropertyName = PropertyName;
						this._areaName = areaName;
						this._citypoint = citypoint;
						this._borough = borough;
					}
					ComplexCustomOverlay.prototype = new BMap.Overlay();
					ComplexCustomOverlay.prototype.initialize = function(map) {
						this._map = map;
						var div = this._div = document.createElement("div");
						div.style.position = "absolute";
						div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);

						div.style.height = "22px";
						div.style.width = "110px";
						div.style.padding = "0 5px";
						div.style.background = "#409DF4";
						div.style.boxShadow = "0 4px 6px 0 rgba(0,0,0,0.78)";
						div.style.borderRadius = "4px";
						div.style.overflow = "hidden";
						div.style.textOverflow = "ellipsis";
						div.style.whiteSpace = "nowrap";
						div.appendChild(document.createTextNode(this._PropertyName));
						div.style.color = "#fff";
						div.style.textAlign = "center";
						div.style.lineHeight = "22px";
						//						div.style.fontSize = "14px";
						div.style.cursor = "pointer";
						div.setAttribute("title", this._PropertyName);
						div.setAttribute("value", this._citypoint);
						div.setAttribute("class", "area");
						div.setAttribute("alt", this._PropertyName);

						div.onmouseover = function() {
							//console.log($(this).find("p").html());
							div.style.background = "#ED9127";
						}
						div.onmouseout = function() {
							div.style.background = "#409DF4";
						}

						var that = this;
						var arrow = this._arrow = document.createElement("div");
						arrow.style.position = "absolute";
						//		arrow.style.width = "30px";
						//		arrow.style.height = "12px";
						arrow.style.top = "19px";
						arrow.style.left = "10px";
						arrow.style.overflow = "hidden";
						div.appendChild(arrow);

						div.onclick = function() {
							//							    $(".map_tip").css("display","block");

						}
						mp.getPanes().labelPane.appendChild(div);

						return div;
					}
					ComplexCustomOverlay.prototype.draw = function() {
						var map = this._map;
						var pixel = map.pointToOverlayPixel(this._point);
						this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
						this._div.style.top = pixel.y - 30 + "px";
					}
					ComplexCustomOverlay.prototype.addEventListener = function(event, fun) { //点击事件
						this._div['on' + event] = fun;
					}

					var marker;
					var overlays = mp.getOverlays();
					var maker_arr = [];
					for(var i = 0; i < overlays.length; i++) {
						maker_arr.push(overlays[i]);
					}
					for(var i = 0; i < maker_arr.length; i++) {
						mp.removeOverlay(maker_arr[i]);
					}
					for(var i = 0; i < markerArr.length; i++) {
						var json = markerArr[i]
						var txt = markerArr[i].title;
						var num = markerArr[i].num;
						var PropertyName = markerArr[i]._PropertyName;
						var areaName = markerArr[i].title;
						var borough = markerArr[i].alt;
						var citypoint = markerArr[i].point;
						var pintx = markerArr[i].point.split('|')[0];
						var pinty = markerArr[i].point.split('|')[1];
						marker = new ComplexCustomOverlay(new BMap.Point(pintx, pinty), txt, txt, num, areaName, citypoint, borough)
						mp.addOverlay(marker);
					}
				} else {
					//前三层级显示楼盘个数							
					if(data.data.length != 0) {
						$.each(data.data.mapList, function(i) {
							markerObj = {
								title: data.data.mapList[i].areaName,
								num: data.data.mapList[i].count + "个楼盘",
								point: data.data.mapList[i].Longitude + '|' + data.data.mapList[i].Latitude,
								isOpen: 0,
								icon: {
									w: 21,
									h: 21,
									l: 0,
									t: 0,
									x: 6,
									lb: 5
								}
							}
							markerArr.push(markerObj);
						});
					}
					//console.log(markerArr)

					// 复杂的自定义覆盖物
					function ComplexCustomOverlay(point, text, mouseoverText, num, areaName, citypoint, borough) {
						this._point = point;
						this._text = text;
						this._overText = mouseoverText;
						this._num = num;
						this._areaName = areaName;
						this._citypoint = citypoint;
						this._borough = borough;
					}
					ComplexCustomOverlay.prototype = new BMap.Overlay();
					ComplexCustomOverlay.prototype.initialize = function(map) {
						this._map = map;
						var div = this._div = document.createElement("div");
						div.style.position = "absolute";
						div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);

						div.style.color = "#fff";
						div.style.textAlign = "center";
						div.style.lineHeight = "22px";
						//						div.style.fontSize = "14px";
						div.style.cursor = "pointer";
						div.setAttribute("title", this._areaName);
						div.setAttribute("value", this._citypoint);
						div.setAttribute("class", "area");
						div.setAttribute("alt", this._borough);

						div.style.height = "64px";
						div.style.width = "80px";
						div.style.padding = "16px 0 0 0";
						div.style.background = "url(img/map-circleBg1.png) no-repeat center center";
						div.style.backgroundSize = "contain";
						var span = this._span = document.createElement("span");
						div.appendChild(span);
						span.appendChild(document.createTextNode(this._text));

						var p = this._p = document.createElement("p");
						div.appendChild(p);
						p.appendChild(document.createTextNode(this._num));
						span.style.fontSize = "16px";
						p.style.fontSize = "12px";
						div.onmouseover = function() {
							//console.log($(this).find("p").html());
							div.style.background = "url(img/map-circleBg2.png) no-repeat center center";
							div.style.backgroundSize = "contain";
							this.getElementsByTagName("span")[0].innerHTML = that._overText;
						}
						div.onmouseout = function() {
							div.style.background = "url(img/map-circleBg1.png) no-repeat center center";
							div.style.backgroundSize = "contain";
							this.getElementsByTagName("span")[0].innerHTML = that._text;
						}

						var that = this;
						var arrow = this._arrow = document.createElement("div");
						arrow.style.position = "absolute";
						//		arrow.style.width = "30px";
						//		arrow.style.height = "12px";
						arrow.style.top = "19px";
						arrow.style.left = "10px";
						arrow.style.overflow = "hidden";
						div.appendChild(arrow);

						div.onclick = function() {
							$(".map_tip").css("display", "block");
							var gc = new BMap.Geocoder();
							point = new BMap.Point($(this).attr("value").split('|')[0], $(this).attr("value").split('|')[1]);
							var u = mp.getZoom();

							if(u <= 10) {
								mp.centerAndZoom(point, 12);
							} else if(u <= 12) {
								mp.centerAndZoom(point, 13);
							} else if(u <= 13) {
								mp.centerAndZoom(point, 15);
							} else {}

						}
						mp.getPanes().labelPane.appendChild(div);

						return div;
					}
					ComplexCustomOverlay.prototype.draw = function() {
						var map = this._map;
						var pixel = map.pointToOverlayPixel(this._point);
						this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
						this._div.style.top = pixel.y - 30 + "px";
					}
					ComplexCustomOverlay.prototype.addEventListener = function(event, fun) { //点击事件
						this._div['on' + event] = fun;
					}

					var marker;
					var overlays = mp.getOverlays();
					var maker_arr = [];
					for(var i = 0; i < overlays.length; i++) {
						maker_arr.push(overlays[i]);
					}
					for(var i = 0; i < maker_arr.length; i++) {
						mp.removeOverlay(maker_arr[i]);
					}
					for(var i = 0; i < markerArr.length; i++) {
						var json = markerArr[i]
						var txt = markerArr[i].title;
						var num = markerArr[i].num;
						var areaName = markerArr[i].title;
						var borough = markerArr[i].alt;
						var citypoint = markerArr[i].point;
						var pintx = markerArr[i].point.split('|')[0];
						var pinty = markerArr[i].point.split('|')[1];
						marker = new ComplexCustomOverlay(new BMap.Point(pintx, pinty), txt, txt, num, areaName, citypoint, borough)
						mp.addOverlay(marker);
					}

				}

			}
		}).done(function() {
			proStr = "";
			setTimeout(function() {
				$(".map_tip").css("display", "none");
			}, 500)
			//			}).always(function(){
			//				setTimeout(function(){
			//					$(".map_tip").css("display","none");
			//				},2000)
		});
	};

	function buildingType(num) { //0 公寓 1:别墅 5:商业 6:住宅	
		//var num = num.split(",");
		var buildTypeStr = "";
		if(num.indexOf(",") != -1) {
			$.each(num.split(","), function(i) {
				buildTypeStr += "<span>" + buildMark(num.split(",")[i]) + "</span>"
			});
			return buildTypeStr;
		} else {
			return '<span>' + buildMark(num) + '</span>';
		}

		function buildMark(t) {
			switch(t) {
				case "0":
					return t = "公寓"
					break;
				case "1":
					return t = "别墅"
					break;
				case "5":
					return t = "商业"
					break;
				case "6":
					return t = "住宅"
					break;
				default:
					return t = "其他"
			}
		}
	};

	function SoldState(t) {
		switch(t) {
			case 0:
				return t = "在建"
				break;
			case 1:
				return t = "待开盘"
				break;
			case 2:
				return t = "在售"
				break;
			case 3:
				return t = "滞销"
				break;
			case 4:
				return t = "售罄"
				break;
			default:
				return t = "其他"
				return;
		}

	} //"FollowType": 1,//0 待扫盘 2，扫盘中 3， 维护中 4，已提报 5，商务谈判 6，合同签订 7，无效盘
	function FollowType(t) {
		switch(t) {
			case 0:
				return t = "<span>待扫盘</span>"
				break;
			case 2:
				return t = "<span>扫盘中</span>"
				break;
			case 3:
				return t = "<span>维护中</span>"
				break;
			case 4:
				return t = "<span>已提报</span>"
				break;
			case 4:
				return t = "<span>已提报</span>"
				break;
			case 4:
				return t = "<span>已提报</span>"
				break;
			default:
				return t = "<span>其他</span>"
				return;
		}
	}

	function ProxySalestype(t) {
		switch(t) {
			case 1:
				return t = "无代理"
				break;
			case 2:
				return t = "独家代理"
				break;
			case 3:
				return t = "自销"
				break;
			case 4:
				return t = "联合代理"
				break;
			case 5:
				return t = "只做案场"
				break;
			case 6:
				return t = "只做联动"
				break;
			default:
				return t = "其他"
				return;
		}
	} //目前销售类型 1、接受代理，目前无代理  2、独家代理 3、自销 4、联合代理 5、只做案场  6、只做联动

	$("#searchBtn").on("click", function() {
		if($("#search").val() != "" && $("#search").val() != " ") {
			$(".listDiv ul").html("");
			proStr = "";
			$.ajax({
				type: "post",
				url: initUrl + "getEveryMap_2.do",
//	        		url:"http://192.168.1.180:8080/ehaofang-pmweb/property/getEveryMap_2.do",
				async: false,
				data: {
					condition: 10,
					maxlng: 131.700594,
					minlng: 109.623837,
					maxlat: 38.162832,
					minlat: 28.208024,
					BuildingType: "",
					FollowType: "",
					DealMoney: "",
					SearchStr: $("#search").val(),
					PageNum: 1,
					PageSize: 100,
		            PermissionID:permissionID,//是	string	营运中心或事业部或开发组或开发人员 的 ID
		            Permissiontype:permissionType//是	string	1为 营运中心 2事业部 3位开发组 4位开发人员
				},
				success: function(data) {
					console.log(data);
					if(data.data.length != 0) {
						$(".listTop span").html("[" + data.data.mapListCount_2 + "]");
						var mapList2 = data.data.mapList_2;
						$.each(mapList2, function(i) {
							proStr +=
								'<a href ="javascript:;" >' +
								'<li>' +
								'<div>' +
								'<p title="' + mapList2[i].PropertyName + '">' + mapList2[i].PropertyName + '</p>' +
								'<p>' + buildingType(mapList2[i].BuildingType) + '</p>' +
								'</div>' +
								'<div>' +
								'<p>' + ProxySalestype(mapList2[i].ProxySalestype) + '</p>' +
								'<p title="' + mapList2[i].PropertyAddress + '">[' + mapList2[i].CityName + '-' + mapList2[i].BoroughName + ']' + mapList2[i].PropertyAddress + '</p>' +
								'</div>' +
								'<div>' +
								'<p>' + mapList2[i].DealMoney + '亿</p>' +
								'<p>' + mapList2[i].SalesHouse + '套</p>' +
								'</div>' +
								'</li>' +
								'</a>';
						});

						$(".listDiv ul").html(proStr);
					}
				}
			})
		} else {
			loadMaker(mp.getZoom());
		}
	})

	$("#FollowType").on("change", function() {
		addMarker(conditionNum, mp.getBounds().getNorthEast().lng, mp.getBounds().getSouthWest().lng, mp.getBounds().getNorthEast().lat, mp.getBounds().getSouthWest().lat, $(this).val(), $("#BuildingType").val(), $("#DealMoney").val(), '', 1, 10);
	})
	$("#BuildingType").on("change", function() {
		addMarker(conditionNum, mp.getBounds().getNorthEast().lng, mp.getBounds().getSouthWest().lng, mp.getBounds().getNorthEast().lat, mp.getBounds().getSouthWest().lat, $("#FollowType").val(), $(this).val(), $("#DealMoney").val(), '', 1, 10);
	})
	$("#DealMoney").on("change", function() {
		addMarker(conditionNum, mp.getBounds().getNorthEast().lng, mp.getBounds().getSouthWest().lng, mp.getBounds().getNorthEast().lat, mp.getBounds().getSouthWest().lat, $("#FollowType").val(), $("#BuildingType").val(), $(this).val(), '', 1, 10);
	});

	mp.addEventListener("dragend", function() {
		$(".map_tip").css("display", "block");
		loadMaker(mp.getZoom());
	});

	mp.addEventListener("zoomend", function() {
		$(".map_tip").css("display", "block");
		loadMaker(mp.getZoom());
	});

	function loadMaker(u) {
		if(u <= 10) {
			addMarker(1, mp.getBounds().getNorthEast().lng, mp.getBounds().getSouthWest().lng, mp.getBounds().getNorthEast().lat, mp.getBounds().getSouthWest().lat, $("#FollowType").val(), $("#BuildingType").val(), $("#DealMoney").val(), '', 1, 10);
		} else if(u <= 12) {
			addMarker(2, mp.getBounds().getNorthEast().lng, mp.getBounds().getSouthWest().lng, mp.getBounds().getNorthEast().lat, mp.getBounds().getSouthWest().lat, $("#FollowType").val(), $("#BuildingType").val(), $("#DealMoney").val(), '', 1, 10);
		} else if(u <= 13) {
			addMarker(3, mp.getBounds().getNorthEast().lng, mp.getBounds().getSouthWest().lng, mp.getBounds().getNorthEast().lat, mp.getBounds().getSouthWest().lat, $("#FollowType").val(), $("#BuildingType").val(), $("#DealMoney").val(), '', 1, 10);
		} else {
			addMarker(4, mp.getBounds().getNorthEast().lng, mp.getBounds().getSouthWest().lng, mp.getBounds().getNorthEast().lat, mp.getBounds().getSouthWest().lat, $("#FollowType").val(), $("#BuildingType").val(), $("#DealMoney").val(), '', 1, 100);
		}

	}
	//          	console.log(mp.getBounds().getNorthEast().lng);
	//          	console.log(mp.getBounds().getNorthEast().lat);
	//          	console.log(mp.getBounds().getSouthWest().lng);
	//          	console.log(mp.getBounds().getSouthWest().lat);
	//				var gc = new BMap.Geocoder();
	//				gc.getLocation(mp.getCenter(), function(rs){
	//				   addComp = rs.addressComponents;
	//					addMarker(addComp.city);
	//				});

	//百度api搜索地区
	function G(id) {
		return document.getElementById(id);
	}

	var ac = new BMap.Autocomplete( //建立一个自动完成的对象
		{
			"input": "suggestId",
			"location": mp
		});

	ac.addEventListener("onhighlight", function(e) { //鼠标放在下拉列表上的事件
		var str = "";
		var _value = e.fromitem.value;
		var value = "";
		if(e.fromitem.index > -1) {
			value = _value.province + _value.city + _value.district + _value.street + _value.business;
		}
		str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

		value = "";
		if(e.toitem.index > -1) {
			_value = e.toitem.value;
			value = _value.province + _value.city + _value.district + _value.street + _value.business;
		}
		str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
		G("searchResultPanel").innerHTML = str;
	});

	var myValue;
	ac.addEventListener("onconfirm", function(e) { //鼠标点击下拉列表后的事件
		var _value = e.item.value;
		myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
		G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
		setPlace();
	});

	function setPlace() {
		//		mp.clearOverlays();    //清除地图上所有覆盖物
		function myFun() {
			var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
			mp.centerAndZoom(pp, 13);
			mp.addOverlay(new BMap.Marker(pp)); //添加标注

			loadMaker(mp.getZoom());
		}
		var local = new BMap.LocalSearch(mp, { //智能搜索
			onSearchComplete: myFun
		});
		local.search(myValue);
	}
	//list按钮控制展开收起
	$(".turn").on("click", function() {
		$(".listDiv").slideToggle();
	})
	/****************** 滚动上拉下拉加载 ***************/
	$(".listDiv ul").on("scroll", function() {

		var scrollTop = $(this).scrollTop();
		var contentH = $(this).get(0).scrollHeight;
		var viewH = $(this).height();
		if($("#search").val() == "") {
			if($(".listDiv ul li").length == proSize) {
				//          	console.log("加载完成！");
				count = 1;
			} else {
				if(scrollTop + viewH + 10 == contentH) {
					//	                console.log("我到底部了");
					count++;
					if(mp.getZoom() <= 10) {
						conditionNum = 1;
					} else if(mp.getZoom() <= 12) {
						conditionNum = 2;
					} else if(mp.getZoom() <= 13) {
						conditionNum = 3;
					} else {
						conditionNum = 4;
					}
					$.ajax({
						type: "post",
						//      		url:"http://www.ehaofangwang.com/marketapp/agencyGroup/getEveryMap_2",
						url: initUrl + "getEveryMap_2.do",
						async: false,
						data: {
							condition: conditionNum,
							maxlng: mp.getBounds().getNorthEast().lng,
							minlng: mp.getBounds().getSouthWest().lng,
							maxlat: mp.getBounds().getNorthEast().lat,
							minlat: mp.getBounds().getSouthWest().lat,
							BuildingType: $("#BuildingType").val(),
							FollowType: $("#FollowType").val(),
							DealMoney: $("#DealMoney").val(),
							SearchStr: "",
							PageNum: count,
							PageSize: 10,
				            PermissionID:permissionID,//是	string	营运中心或事业部或开发组或开发人员 的 ID
				            Permissiontype:permissionType//是	string	1为 营运中心 2事业部 3位开发组 4位开发人员
						},
						success: function(data) {
							console.log(data);
							proSize = data.data.mapListCount_2;
							$(".listTop span").html("[" + proSize + "]");
							var mapList2 = data.data.mapList_2;
							$.each(mapList2, function(i) {
								proStr +=
									'<a href ="javascript:;" >' +
									'<li>' +
									'<div>' +
									'<p title="' + mapList2[i].PropertyName + '">' + mapList2[i].PropertyName + '</p>' +
									'<p>' + buildingType(mapList2[i].BuildingType) + '</p>' +
									'</div>' +
									'<div>' +
									'<p>' + ProxySalestype(mapList2[i].ProxySalestype) + '</p>' +
									'<p title="' + mapList2[i].PropertyAddress + '">[' + mapList2[i].CityName + '-' + mapList2[i].BoroughName + ']' + mapList2[i].PropertyAddress + '</p>' +
									'</div>' +
									'<div>' +
									'<p>' + mapList2[i].DealMoney + '亿</p>' +
									'<p>' + mapList2[i].SalesHouse + '套</p>' +
									'</div>' +
									'</li>' +
									'</a>';

							});

							//					console.log(proStr);
							$(".listDiv ul").append(proStr);
							proStr = "";
							//					$(".listTop span").html('['+data.data.mapListCount_2+"]");
						}
					})

				}
			}
		}
	});

});