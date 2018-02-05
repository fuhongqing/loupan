//获取页面输入信息，异步发送数据
//登录人有权限的城市，区域，板块
//判断登录人是否属于营运中心
$('.dropdown-toggle').click(function(e){
    $(e.target).parent().css('border-color','#ccc');
});
$('.dropdown-toggle>span').click(function(e){
    $(e.target).parent().parent().css('border-color','#ccc');
});
$('.controls input').focus(function(e){
    $(e.target).css('border-color','#ccc');
});
//提交按钮
$('#deal>footer').on('click','a',function(e){
    e.preventDefault();
    var plotAreaVal=$('#plotArea').val(),//土地面积
        PlotNumbers=$('#PropertyAddress').val(),//地块标号
        abbreviation=$('#Abbreviation').val(),//详细地址
        landStateIndex=$('#landState>li.active').index()+1,//状态下标
        landNameVal=$('#landName').val(),//土地名
        boroughIDVal=$('#BoroughID>li.active>a').attr('id'),//区域id
        plateIDVal=$('#PlateID>li.active>a').attr('id'),//板块id
        purposeIndex=$('#purpose>li.active').index()+1,//土地用途
        constructionAreaVal=$('#constructionArea').val(),//建筑用地面积
        collectAreaVal=$('#collectArea').val(),//代征面积
        afforestationRateVal=$('#afforestationRate').val(),//绿化率
        businessRatioVal=$('#businessRatio').val(),//商业比例
        fixedYearVal=$('#fixedYear').val(),//出让年限
        totalAreaVal=$('#totalArea').val(),//总面积
        planAreaVal=$('#planArea').val(),//规划建筑面积
        plotRatio2Val=$('#plotRatio2').val(),//容积率小于
        buildingDensity2Val=$('#buildingDensity2').val(),//建筑密度小于
        limitheightVal=$('#limitheight').val(),//限制高度
        startDateVal=$('#startDate').val(),//起始日期
        dealDateVal=$('#dealDate').val(),//成交日期
        dealPriceVal=$('#dealPrice').val(),//成交价
        premiumRateVal=$('#premiumRate').val(),//溢价率
        markUpVal=$('#markUp').val(),//最小加价幅度
        partyNameVal=$('#partyName').val(),//竞得方
        endDateVal=$('#endDate').val(),//截止日期
        startingPriceVal=$('#startingPrice').val(),//起始价
        planePriceVal=$('#planePrice').val(),//楼面地价
        marginVal=$('#margin').val();//保证金
    //判断必填项是否有值
    var vali=0;
    if(permissionType==1){
        if($('#cityName').val()===''){
            vali+=1;
            $('#cityName').css('border-color','#f00') ;//项目名
        }
    }else{
        if($('#cityMenu>a>span').html()=='市'){
            vali+=1;
            $('#cityMenu').css('border-color','#f00');
        }
    }
    if($('#landName').val()===''){
        vali+=1;
        $('#landName').css('border-color','#f00') ;
    }
    if($('#borouMenu>a>span').html()=='区'){
        vali+=1;
        $('#borouMenu').css('border-color','#f00');
    }
    if($('#plateMenu>a>span').html()=='板块'){
        vali+=1;
        $('#plateMenu').css('border-color','#f00');
    }
    if($('#plotArea').val()===''){
        vali+=1;
        $('#plotArea').css('border-color','#f00') ;
    }
    if($('#totalArea').val()===''){
        vali+=1;
        $('#totalArea').css('border-color','#f00') ;
    }
    if($('#planArea').val()===''){
        vali+=1;
        $('#planArea').css('border-color','#f00') ;
    }
    if($('#limitheight').val()===''){
        vali+=1;
        $('#limitheight').css('border-color','#f00') ;
    }
    if($('#constructionArea').val()===''){
        vali+=1;
        $('#constructionArea').css('border-color','#f00') ;
    }
    if($('#collectArea').val()===''){
        vali+=1;
        $('#collectArea').css('border-color','#f00') ;
    }
    if($('#businessRatio').val()===''){
        vali+=1;
        $('#businessRatio').css('border-color','#f00') ;
    }
    if(vali>0){
        alert('新增失败，请检查必填项是否漏填');
    }else{
        $.ajax({
            url:saleUrl+'insertland_version2.do',
            type:'POST',
            data:{
                landName:landNameVal	,//是	string	//土地标题
                plotArea:plotAreaVal	,//是	string	//土地面积
                plotNumbers:PlotNumbers	,//否	string	//地块编号
                cityID:cityIDVal	,//是	string	//城市id
                boroughID:boroughIDVal	,//是	string	//区域ID
                plateID:plateIDVal	,//否	string	//版块ID
                totalArea:totalAreaVal	,//是	string	//总面积
                planArea:planAreaVal	,//是	string	//规划建筑面积
                plotRatio:plotRatio2Val	,//否	string	//容积率
                businessRatio:businessRatioVal	,//是	string	//商业比例
                limitheight:limitheightVal	,//是	string	//限制高度
                fixedYear:fixedYearVal	,//否	string	//出让年限
                constructionArea:constructionAreaVal	,//是	string	//建设用地面积
                collectArea:collectAreaVal	,//是	string	//代征面积
                afforestationRate:afforestationRateVal	,//否	string	//绿化率
                buildingDensity:buildingDensity2Val	,//否	string	//建筑密度
                planningPurposes:purposeIndex	,//否	string	//规划用途
                landState:landStateIndex 	,//否	string	//交易状态
                startDate:startDateVal	,//否	string	////起始日期
                dealDate:dealDateVal    	,//否	string	//成交日期
                startingPrice:startingPriceVal	,//否	string	//起始价
                planePrice:planePriceVal    	,//否	string	//楼面地价
                margin:marginVal	,//否	string	//保证金
                partyName:partyNameVal    	,//否	string	//竞得方
                endDate:endDateVal	,//否	string	//截止日期
                tradingSite:abbreviation    	,//否	string	//交易地点
                dealPrice:dealPriceVal	,//否	string	//成交价
                premiumRate:premiumRateVal    	,//否	string	//溢价率
                markUp:markUpVal	//否	string	//加价幅度
            },
            success:function(data){
                //console.log(data);
                if(data.status==='success'){
                    alert('新增成功!3s后跳转到列表页...');
                    setTimeout(function(){
                        $(location).attr('href','./land.jsp');//跳转列表页
                    },3000);
                }else{
                    alert('新增失败，请检查填写内容是否正确');
                }
            },
            error:function(){
                alert('服务器内部出错了')
            }
        });
    }
});
if(3>2){
    $('#area1').show().css('display','inline-block');
    $('#drop').hide();
    $('#area .dropdown-inner').css({
        'position': 'relative',
        'bottom': '7px'
    });
    $('#project1 img.cityImg').css('top','0');
    //异步请求区域数据
    $('#CityID0').on('click','a',function(e){
        e.preventDefault();
        cityIDVal=$(e.target).attr('id');
        $('#cityName').val($(e.target).html());
        $.ajax({
            url:initUrl+'AreaBorough.do',
            type:'POST',
            data:{
                "CityID":cityIDVal//城市id
            },
            success:function(data){
                //console.log(data);
                $('#CityID0').hide();
                //区域内容动态添加
                var boroughHtml='',limitBorough;
                limitBorough=data.AreaBorough;
                if(!limitBorough){
                    return;
                }
                $.each(limitBorough,function(i){
                    boroughHtml+=`
                           <li class="borough"><a href="#" id="${limitBorough[i].ID}">${limitBorough[i].BoroughName}</a></li>
                         `;
                });
                $('#BoroughID').html(boroughHtml);
            },
            error:function(){
                alert('服务器内部出错了')
            }
        });
    });
    //板块内容的动态生成
    $('#BoroughID').on('click','a',function(e){
        e.preventDefault();
        var boroughId=$(e.target).attr('id');//区域id
        $.ajax({
            url:initUrl+'AreaPlate.do',
            type:'POST',
            data:{
                "BoroughID":boroughId//板块id
            },
            success:function(data){
                var plateHtml='',limitPlate;
                limitPlate=data.AreaPlate;
                if(!limitPlate){
                    return;
                }
                $.each(limitPlate,function(i){
                    plateHtml+=`
                          <li class="plate"><a href="#" id="${limitPlate[i].ID}">${limitPlate[i].PlateName}</a></li>
                        `;
                });
                $('#PlateID').html(plateHtml);
            },
            error:function(){
                alert('服务器内部出错了')
            }
        });
    });
}else{
    $('#area1').hide();
    function city(){
        $.ajax({
            url:initUrl+'diQuQuanXian_2.do',
            type:'POST',
            data:{
                "Type":"1",//是	string	1：为城市 2：为区域 3：为板块
                "DepartmentID":permissionID,
                "Permissiontype":permissionType//是	string	1为 营运中心 2事业部 3位开发组 4位开发人员
            },
            success:function(data){
                //console.log(data);
                var citiesHtml='',limitCity;
                //城市内容动态添加
                limitCity=data.data.QuanXianChengShi_2;
                if(!limitCity){
                    return;
                }
                $.each(limitCity,function(i){
                    citiesHtml+=`
                           <li class="city"><a href="#" id="${limitCity[i].CityID}">${limitCity[i].CityName}</a></li>
                        `;
                });
                $('#CityID').html(citiesHtml);
            },
            error:function(){
                alert('服务器内部出错了')
            }
        });
    }
    city();
    //异步请求区域数据
    $('#CityID').on('click','a',function(e){
        e.preventDefault();
        cityIDVal=$(e.target).attr('id');
        $.ajax({
            url:initUrl+'diQuQuanXian_2.do',
            type:'POST',
            data:{
                "Type":"2",//是	string	1：为城市 2：为区域 3：为板块
                "DepartmentID":permissionID,
                "Permissiontype":permissionType,//是	string	1为 营运中心 2事业部 3位开发组 4位开发人员
                "CityID":cityIDVal//城市id
            },
            success:function(data){
                //console.log(data);
                //区域内容动态添加
                var boroughHtml='',limitBorough;
                limitBorough=data.data.QuanXianQuYu_2;
                if(!limitBorough){
                    return;
                }
                $.each(limitBorough,function(i){
                    boroughHtml+=`
                           <li class="borough"><a href="#" id="${limitBorough[i].BoroughID}">${limitBorough[i].BoroughName}</a></li>
                         `;
                });
                $('#BoroughID').html(boroughHtml);
            },
            error:function(){
                alert('服务器内部出错了')
            }
        });
    });
    //板块内容的动态生成
    $('#BoroughID').on('click','a',function(e){
        e.preventDefault();
        var boroughId=$(e.target).attr('id');//区域id
        $.ajax({
            url:initUrl+'diQuQuanXian_2.do',
            type:'POST',
            data:{
                "Type":"3",//是	string	1：为城市 2：为区域 3：为板块
                "DepartmentID":permissionID,
                "Permissiontype":permissionType,//是	string	1为 营运中心 2事业部 3位开发组 4位开发人员
                "BoroughID":boroughId//板块id
            },
            success:function(data){
                var plateHtml='',limitPlate;
                limitPlate=data.data.QuanXianBanKuai_2;
                if(!limitPlate){
                    return;
                }
                $.each(limitPlate,function(i){
                    plateHtml+=`
                          <li class="plate"><a href="#" id="${limitPlate[i].plateid}">${limitPlate[i].PlateName}</a></li>
                        `;
                });
                $('#PlateID').html(plateHtml);
            },
            error:function(){
                alert('服务器内部出错了')
            }
        });
    });
}
//城市筛选失去焦点
$('#cityName').keyup(function(e){
    $('#CityID0').show();
    var cityVal=$(e.target).val();
    $.ajax({
        url:initUrl+'cityarea.do',
        type:'POST',
        data:{
            'Str':cityVal//否	string	查询条件
        },
        success:function(data){
            var citiesHtml0='',limitCity0;
            //城市内容动态添加
            limitCity0=data.cityName;
            if(!limitCity0){
                return;
            }
            $.each(limitCity0,function(i){
                citiesHtml0+=`
                           <li class="city"><a href="#" id="${limitCity0[i].ID}">${limitCity0[i].CityName}</a></li>
                        `;
            });
            $('#CityID0').html(citiesHtml0);
        },
        error:function(){
            alert('服务器内部出错了')
        }
    });
});