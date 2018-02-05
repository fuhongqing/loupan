$('.dropdown-toggle').click(function(e){
    $(e.target).parent().css('border-color','#ccc');
});
$('.dropdown-toggle>span').click(function(e){
    $(e.target).parent().parent().css('border-color','#ccc');
});
$('#buildingVal').click(function(e){
    $(e.target).css('border-color','#ccc');
});
$('.controls input').focus(function(e){
    $(e.target).css('border-color','#ccc');
});
//合作情况>目前销售模式->独家时，显示代理时间段和代理公司名
$(function(){
    $('#SaleTypes>li').on('click','a',function(e){
        if($(e.target).html()==='独家代理'){
            $('#company').css('display','block');
            $('#agent').css('display','block');
        }else{
            $('#company').css('display','none');
            $('#agent').css('display','none');
        }
    });
    //代理时间段+按钮的点击事件
    var i=0;
    $('#agent>a').on('click','img',function(e){
        e.preventDefault();
        i++;
        //时间段模板
        var timeHtml=`
      <div class="control-group areas reduce">
          <label class="control-label">代理时间段</label>
          <a href="#" class="gt"><img src="./res/reduce.png" alt=""/></a>
                    <div data-toggle="datepicker" class="control-group input-daterange">
                        <div class="controls">
                            <input type="text" id="AgentTimeBegin1" placeholder="请输入内容"><span>至</span>
                            <img src="./res/date.png" alt="" class="imgLeft"/>
                            <input type="text" id="AgentTimeEnd1" placeholder="请输入内容">
                            <img src="./res/date.png" alt=""/>
                        </div>
                    </div>
      </div>
  `;
        //代理公司名模板
        var companyHtml=`
      <div class="control-group star-gt name">
          <label class="control-label">代理公司名</label>
            <div class="controls">
               <input type="text" id="AgentName1"  placeholder="请输入内容" required>
            </div>
          <img src="./res/star.png" alt=""/>
      </div>
  `;
        $('#agent').after(timeHtml);
        $('#time .areas').css('display','block');
        //添加到#company之后
        $('#company').after(companyHtml);
        $('#project3 .star-gt').css('display','block');
    });
    //代理时间段—的点击事件
    $('#time').on('click','.reduce>a>img',function(e){
        i--;
        e.preventDefault();
        $(e.target).parent().parent().remove();
        $('#project3 .name')[i].remove();
    });
});
//上一步，下一步按钮的点击事件，实现其他页面的显示与隐藏
$(function(){
    //体量底部按钮的点击事件
    $('#countContent>footer').on('click','a:last-child',function(e){
        e.preventDefault();
        $('#add').css('position','static');
        $('#countContent').fadeOut().prev().fadeIn();
    });
    //合作底部按钮的点击事件
    $('#cooperate>footer').on('click','a:last-child',function(e){
        e.preventDefault();
        $('#countContent').css('position','static');
        $('#cooperate').fadeOut().prev().fadeIn();
    });
    //土地底部按钮的点击事件
    $('#addLand>footer').on('click','a:last-child',function(e){
        e.preventDefault();
        $('#cooperate').css('position','static');
        $('#addLand').fadeOut().prev().fadeIn();
    });
});
//新增楼盘开发提交按钮点击异步请求
var xiangMuLianXiRen='',
    buildingType='',//建筑类型
    developerSupport='',
    propertyAddress='',//小区地址
    abbreviation='',//开发商简称
    soldState='',//在售状态 0在建 1 待开盘 2在售 3滞销 4售罄
    progress='',//工程进度
    isLimitsign='',//可否限签
    propertyName='',//项目名
    cityID='',//城市id
    boroughID='',//区域id
    plateID='',//板块id
    propertyDevelopers='',//开发商
    isMortgage='',//抵押情况
    isLoan='',//贷款情况
    dealMoney='',//可售货值
    salesArea='',//可售面积
    salesHouse='',//可售套数
    allMoney='',//总货值
    allArea='',//总面积
    allHouse='',//总套数
    minPrice='',//总价区间最小值
    maxPrice='',//总价区间最大值
    minunderquote='',//底价区间最小值
    maxunderquote='',//底价区间最大值
    experience='',//体验情况
    saleValidityDate='',//许可证有效期
    minPriceRange='',//单价区间最小值
    priceRange='',//单价区间最大值
    minFilingprice='',//备案价最小值
    maxFilingprice='',//备案价最大值
    openDatetime='',//开盘时间
    saleValidity='',//预售许可证
    agentTimeBegin='',//代理时间段开始
    agentTimeEnd='',//代理时间段结束
    commissionMethod='',//佣金方式
    bondMenu='',//保证金
    urgency='',//紧急程度
    saleTypes='',//目前销售模式
    agentName='',//代理公司名
    acceptSalestype='',//可接受销售类型
    groupSituation='',//团购收取
    followUp='',//后续效应
    buildingArea='',//建筑用地面积
    competitivePrice='',//竞得价
    floorPrice='',//楼面价
    propertyRightyears='',//产权年限
    competitiveDate='',//竞得日期
    startingPrice='',//起始价
    plotRatioStart='',//容积率
    landTypeStart='',//用地性质
    completionTime='',//竣工时间
    checkRoom='',//最早交房
    afforestationRate='',//绿化率
    propertyManagement='',//物业费
    decorate='',//装修情况
    completeSet='',//配套设施
    constructionArea='',//建筑面积
    propertyCompany='',//物业公司
    propertyType='',//物业类型
    plotRatio='',//容积率
    planningHouse='',//规划户数
    parkingSpace='',//车位数
    storiedBuilding='',//楼栋总数
    coversArea='',//占地面积
    businessCircle='',//周边商圈
    removalRate='',//当前去化率
    deTime='';//去化时间
//基础信息
$('#add>footer>a').click(function(e){
    e.preventDefault();
    var vali=0;
    //判断必填项是否有值
    if(3>2){
        if($('#cityName').val()===''){
            vali+=1;
            $('#cityName').css('border-color','#f00') ;//项目名
        }
    }else{
        if($('#cityMenu>a>span').html()=='请选择'){
            vali+=1;
            $('#cityMenu').css('border-color','#f00');
        }
    }
    if($('#PropertyName').val()===''){
        vali+=1;
        $('#PropertyName').css('border-color','#f00') ;//项目名
    }
    if($('#PropertyDevelopers').val()===''){
        vali+=1;
        $('#PropertyDevelopers').css('border-color','#f00') ;//开发商全称
    }
    if($('#PropertyAddress').val()===''){
        vali+=1;
        $('#PropertyAddress').css('border-color','#f00') ;//详细地址
    }
    if($('#Abbreviation').val()===''){
        vali+=1;
        $('#Abbreviation').css('border-color','#f00') ;//开发商简称
    }
    if(!$('#buildingVal').hasClass('bd')){
        vali+=1;
        $('#buildingVal').css('border-color','#f00') ;
    }
    if($('#sold>a>span').html()=='请选择'){
        vali+=1;
        $('#sold').css('border-color','#f00');
    }
    if($('#borouMenu>a>span').html()=='请选择'){
        vali+=1;
        $('#borouMenu').css('border-color','#f00');
    }
    if($('#plateMenu>a>span').html()=='请选择'){
        vali+=1;
        $('#plateMenu').css('border-color','#f00');
    }
    if(vali>0){
        alert('请检查必填项是否漏填');
    }else{
        //基础信息底部按钮的点击事件
        $('#add').css({
            top:'-610px',
            position:'absolute'
        }).next().fadeIn();
    }
});
//体量
$('#countContent>footer>a:first-child').click(function(e){
    e.preventDefault();
    if($('#exper>a>span').html()=='请选择'){
        $('#exper').css('border-color','#f00');
        alert('体验情况是必选项，请选择');
    }else{
        //体量底部按钮的点击事件
        $('#countContent').css({
            top:'-1000px',
            position:'absolute'
        }).next().fadeIn();
    }
});
//合作信息
$('#cooperate>footer>a:first-child').click(function(e){
    e.preventDefault();
    var valiCo=0;
    if($('#saleTy>a>span').html()=='请选择'){
        valiCo+=1;
        $('#saleTy').css('border-color','#f00');
    }
    if($('#jobMenu>a>span').html()=='请选择'){
        valiCo+=1;
        $('#jobMenu').css('border-color','#f00');
    }
    if($('#saleTy>a>span').html()=='独家代理'){
        if($('#AgentName').val()===''){
            valiCo+=1;
            $('#AgentName').css('border-color','#f00');
        }
        if($('#AgentTimeBegin').val()===''){
            valiCo+=1;
            $('#AgentTimeBegin').css('border-color','#f00');
        }
        if($('#AgentTimeEnd').val()===''){
            valiCo+=1;
            $('#AgentTimeEnd').css('border-color','#f00');
        }
    }
    //合作情况
    if($('#tbl>tbody>tr:gt(0)').length===0){
        //项目联系人
        if($('#LinkName').val()===''){
            valiCo+=1;
            $('#LinkName').css('border-color','#f00') ;
        }
        if($('#LinkPhone').val()===''){
            valiCo+=1;
            $('#LinkPhone').css('border-color','#f00') ;
        }
        if(valiCo>0){
            alert('请检查必填项是否漏填');
        }else{
            //合作底部按钮的点击事件
            $('#cooperate>footer').on('click','a:first-child',function(e){
                e.preventDefault();
                $('#cooperate').css({
                    top:'-1000px',
                    position:'absolute'
                }).next().fadeIn();
            })
        }
    }else{
        if(valiCo>0){
            alert('请检查必填项是否漏填');
        }else{
            //合作底部按钮的点击事件
            $('#cooperate>footer').on('click','a:first-child',function(e){
                e.preventDefault();
                $('#cooperate').css({
                    top:'-1000px',
                    position:'absolute'
                }).next().fadeIn();
            })
        }
    }
});
//建筑类型多选，甲方支持多选
//#buildingVal事件
$('#buildingVal').click(function(){
    $('#BuildingType').show();
});
//#supportVal事件
$('#supportVal').click(function(){
    $('#supportType').show();
});
//点击空白处建筑类型，甲方下拉框隐藏
$(document).click(function(e){
    var _con=$('#buildingVal,#BuildingType,#supportVal,#supportType,#cityName,#CityID0');//设置目标区域
    if(!_con.is(e.target)&&_con.has(e.target).length===0){
        $('#BuildingType,#supportType,#CityID0').hide(500);
    }
});
var buildingArr=[],supportArr=[],buildingHtml='',supportHtml='',indexArr=[],sortArr=[];
$('#BuildingType>li').on('click','a',function(e){
    e.preventDefault();
    $(e.target).parent().toggleClass('active');
    var liIndex=$(e.target).attr('class');
    if($('#BuildingType>li').hasClass('active')&&
        buildingArr.indexOf($(e.target).html())===-1&&
        buildingHtml.indexOf($(e.target).html())===-1){
        buildingArr.push($(e.target).html());
        var $i=buildingArr.length-1;
        buildingHtml+=`
              <a href="#"><span class="${liIndex}">${buildingArr[$i]}</span><b class="gt">&times;</b></a>
            `;
        $('#buildingVal').html(buildingHtml);
        indexArr.push(liIndex);
    }else{
        var bdHtml='';
        buildingArr.remove($(e.target).html());
        indexArr.remove(liIndex);
        $.each(buildingArr,function(i){
            bdHtml+=`
              <a href="#"><span  class="${indexArr[i]}">${buildingArr[i]}</span><b class="gt">&times;</b></a>
            `;
        });
        $('#buildingVal').html(bdHtml);
        buildingHtml=bdHtml;
    }
    //建筑类型关闭图标的hover效果
    $('#buildingVal>a>b').hover(function(e){
        $(e.target).html('<img src="./res/delete_hover.png" alt=""/>');
    },function(e){
        $('#buildingVal>a>b').html('&times;');
    });
    //console.log(indexArr.join(','));
    $('#buildingVal').css('border-color','#ccc');
    buildingType=indexArr.join(',');
    //console.log(buildingType);
    if(indexArr.length>0){
        $('#buildingVal').addClass('bd');
    }else{
        $('#buildingVal').removeClass('bd');
    }
    if($('#buildingVal').html()===''){
        $('#buildingVal').html('请选择（多选）').css('color','#BEBEBE');
    }
});
//甲方支持
$('#supportType>li').on('click','a',function(e){
    e.preventDefault();
    $(e.target).parent().toggleClass('active');
    var liIndex=$(e.target).attr('class');
    if($('#supportType>li').hasClass('active')&&
        supportArr.indexOf($(e.target).html())===-1&&
        supportHtml.indexOf($(e.target).html())===-1){
        supportArr.push($(e.target).html());
        var $i=supportArr.length-1;
        supportHtml+=`
              <a href="#"><span class="${liIndex}">${supportArr[$i]}</span><b class="gt">&times;</b></a>
            `;
        $('#supportVal').html(supportHtml);
        sortArr.push(liIndex);
    }else{
        var bdHtml='';
        supportArr.remove($(e.target).html());
        sortArr.remove(liIndex);
        $.each(supportArr,function(i){
            bdHtml+=`
              <a href="#"><span  class="${sortArr[i]}">${supportArr[i]}</span><b class="gt">&times;</b></a>
            `;
        });
        $('#supportVal').html(bdHtml);
        supportHtml=bdHtml;
    }
    //甲方关闭图标的hover效果
    $('#supportVal>a>b').hover(function(e){
        $(e.target).html('<img src="./res/delete_hover.png" alt=""/>');
    },function(e){
        $('#supportVal>a>b').html('&times;');
    });
    //console.log(sortArr.join(','));
    $('#supportVal').css('border-color','#ccc');
    developerSupport=sortArr.join(',');
    //console.log(developerSupport);
    if($('#supportVal').html()===''){
        $('#supportVal').html('甲方支持（多选）').css('color','#BEBEBE');
    }
});
//建筑类型关闭按钮的点击事件
$('#buildingVal').on('click','img',function(e){
    e.preventDefault();
    e.stopPropagation();
    $(e.target).parent().parent().css('display','none');
    var eText=$(e.target).parent().prev().html();
    if(eText==='公寓'){
        $('#BuildingType>li>a.0').click();
    }else if(eText==='别墅'){
        $('#BuildingType>li>a.1').click();
    }else if(eText==='商业'){
        $('#BuildingType>li>a.5').click();
    }else if(eText==='住宅'){
        $('#BuildingType>li>a.6').click();
    }else if(eText==='其他'){
        $('#BuildingType>li>a.7').click();
    }
    //console.log(buildingType);
});
//甲方支持关闭按钮的点击事件
$('#supportVal').on('click','img',function(e){
    e.preventDefault();
    e.stopPropagation();
    $(e.target).parent().parent().css('display','none');
    var eText=$(e.target).parent().prev().html();
    if(eText==='班车'){
        $('#supportType>li>a.1').click();
    }else if(eText==='样板房'){
        $('#supportType>li>a.2').click();
    }else if(eText==='物料'){
        $('#supportType>li>a.3').click();
    }else if(eText==='盒饭'){
        $('#supportType>li>a.4').click();
    }
    //console.log(developerSupport);
});
var jobIndex,//职位名称下标
    linkName,//联系人
    linkPhone,//联系人电话
    linkHtml='',i=-1;
//第三步合作中新增项目联系人新增按钮的点击事件，获取新增信息
$('#contacts>a').click(function(e){
    e.preventDefault();
    i++;
    jobIndex=$('#Job>li.active').index();//职位名称下标
    linkName=$('#LinkName').val();//联系人
    linkPhone=$('#LinkPhone').val();//联系人电话
    //定义一个方法，用于显示职位名称
    function job(t){
        switch(t)
        {
            case 1:
                return t = "销售员";
                break;
            case 2:
                return t = "销售经理";
                break;
            case 3:
                return t = "营销总";
                break;
            case 4:
                return t = "项目总经理";
                break;
            case 5:
                return t = "股东";
                break;
            case 6:
                return t = "董事长";
                break;
            default:
                return t = "其他";
                break;
        }
    }
    linkHtml=`
            <tr>
                <td>${job(jobIndex)}</td>
                <td>${linkName}</td>
                <td>${linkPhone}<img class="gt reduce" src='./res/reduce.png'></td>
            </tr>
        `;
    $('#tbl>tbody').append(linkHtml);
    var linkTd2=$('#tbl>tbody>tr:gt(0)>td:nth-child(2)');//追加的联系人集合
    var linkTd3=$('#tbl>tbody>tr:gt(0)>td:last-child');//追加的联系人电话集合
    xiangMuLianXiRen+=jobIndex+','+linkTd2[i].innerHTML+','+linkTd3[i].innerText+';';
    //提交按钮
    //console.log(xiangMuLianXiRen.slice(0,-1));
    //清空联系人输入框中的内容
    $('#tbl span.job').html('请选择').css('color','#BEBEBE');
    $('#LinkName').val('');
    $('#LinkPhone').val('');
});
//减按钮的点击事件，实现删除行的功能
$('#tbl>tbody').on('click','img.reduce',function(e){
    e.preventDefault();
    var arr=xiangMuLianXiRen.split(';');
    var i=$('#tbl>tbody>tr').index($(e.target).parent().parent());
    arr.splice(arr.length-1,1);
    arr.splice(i-1,1);
    $(e.target).parent().parent().css('display','none');
    xiangMuLianXiRen=arr.join(';')+';';
    //console.log(xiangMuLianXiRen.slice(0,-1));
    //提交按钮
});
//详细地址失去焦点
$('#PropertyAddress').blur(function(e){
    //获得经纬度
    var map = new BMap.Map("container");
    var localSearch = new BMap.LocalSearch(map);
    localSearch.setSearchCompleteCallback(function(searchResult) {
        var poi = searchResult.getPoi(0);
        if(poi != undefined){
            longitude=poi.point.lng;//经度
            latitude=poi.point.lat;//纬度
            //console.log(longitude);
        }else{
            console.log("error");
        }
    });
    localSearch.search($(e.target).val());
});
function floorAdd(){
    $.ajax({
        url:initUrl+'addProperty_2.do',
        type:'POST',
        data:{
            XiangMuLianXiRen:xiangMuLianXiRen,//项目联系人
            PropertyName:propertyName,//是	string	小区名称
            FollowType	:"2",//否	string	0 待扫盘 2，扫盘中 3， 维护中 4，已提报 5，商务谈判 6，合同签订 7，无效盘(1.待扫盘- 系统自动添加的，未进行任何修改及跟进2.扫盘中- 用户自行添加的，或针对系统添加的进行修改或填写跟进的 3.维护中- 用户添加了关键人信息（参见维护规则） 4.已提报、商务谈判、合同签订、无效盘 - 根据用户自行修改维护状态判别)注：此流程不可逆
            SoldState:soldState,//是	string	在售状态 0在建 1 待开盘 2在售 3滞销 4售罄
            BuildingType:buildingType,//是	string	建筑类型 0 公寓 1:别墅 5:商业 6:住宅 7其他
            CityID	:cityID,//是	string	城市id
            BoroughID	:boroughID,//是	string	区域id
            PlateID	:plateID,//是	string	版块id
            PropertyAddress	:propertyAddress,//是	string	小区地址
            PropertyDevelopers	:propertyDevelopers,//是	string	小区开发商
            Abbreviation	:abbreviation,//否	string	开发商简称
            Progress	:progress,//否	string	工程进度
            IsMortgage	:isMortgage,//否	string	抵押情况
            IsLoan	:isLoan,//否	string	是否可以贷款
            IsLimitsign	:isLimitsign,//否	string	可否限签
            AllMoney	:allMoney,//否	string	总货值
            AllHouse	:allHouse,//否	string	总套数
            AllArea	:allArea,//否	string	总面积
            DealMoney	:dealMoney,//否	string	可售货值
            SalesHouse	:salesHouse,//否	string	可售套数
            SalesArea	:salesArea,//否	string	可售面积
            RemovalRate	:removalRate,//否	string	去化率(当前去化率：（体量总价 - 剩余总价） ／（当前时间 年月 - 首次开盘时间 年月） = xxxx万元／月)
            DeTime	:deTime,//否	string	去化时间 (预计去化时间：剩余总价 ／ 当前去化率 = xxx 个月)
            MinPriceRange	:minPriceRange,//否	string	单价最小的价格
            PriceRange	:priceRange,//否	string	单价最大
            MaxPrice	:maxPrice,//否	string	房屋总价最大值
            MinPrice	:minPrice,//否	string	房屋总价最小值
            MinFilingprice	:minFilingprice,//否	string	最小的备案价
            MaxFilingprice	:maxFilingprice,//否	string	最大的备案价
            Minunderquote	:minunderquote,//否	string	最低的低价
            Maxunderquote	:maxunderquote,//否	string	最高的低价
            SaleValidity	:saleValidity,//否	string	预售证
            SaleValidityDate	:saleValidityDate,//否	string	许可证有效期
            OpenDatetime	:openDatetime,//否	string	开盘时间
            Experience	:experience,//否	string	体验 1、不需要包装 2、部分包装 3、整体重新包装 4、烂尾楼
            ProxySalestype	:saleTypes,//否	string	目前销售类型 1、接受代理，目前无代理 2、独家代理 3、自销 4、联合代理 5、只做案场 6、只做联动
            AgentTimeBegin	:agentTimeBegin,//否	string	代理时间段(开始)
            AgentTimeEnd	:agentTimeEnd,//否	string	代理时间段(结束)
            AcceptSalestype	:acceptSalestype,//否	string	可接受销售类型 1、接受代理，目前无代理 2、独家代理 3、自销 4、联合代理 5、只做案场 6、只做联动
            DeveloperSupport	:developerSupport,//否	string	甲方支持 1、班车 2、样板房 3、物料 4、盒饭
            GroupSituation	:groupSituation,//否	string	团购情况 1、甲方收 2、代理收
            FollowUp	:followUp,//否	string	后续效应 1、后续合作机会 2、提高知名
            AgentName	:agentName,//否	string	代理公司名
            CommissionMethod	:commissionMethod,//否	string	佣金方式 1、固定 2、跳点 3、包销
            Bond	:bondMenu,//否	string	保证金 1、0-50万 2、50-100万 3、100-200万 4、200-300万 5、500万以上
            Urgency	:urgency,//否	string	紧急程度 1、不紧急 2、一般 3、需要马上进场
            CompetitiveDate	:competitiveDate,//否	string	竞得日期
            StartingPrice	:startingPrice,//否	string	起始价
            PlotRatioStart	:plotRatioStart,//否	string	容积率(土地)
            LandTypeStart	:landTypeStart,//否	string	用地性质 1、住宅 2、商业／办公 3、工业 4、其他
            BuildingArea	:buildingArea,//否	string	建筑用地面积
            CompetitivePrice	:competitivePrice,//否	string	竞得价
            FloorPrice	:floorPrice,//否	string	楼面价
            PropertyRightyears	:propertyRightyears,//否	string	产权年限
            PropertyCompany	:propertyCompany,//否	string	物业公司
            PropertyType	:propertyType,//否	string	物业类型 1 住宅 2公寓 3商铺
            PlotRatio	:plotRatio,//否	string	容积率
            PlanningHouse	:planningHouse,//否	string	规划户数
            ParkingSpace	:parkingSpace,//否	string	车位数
            StoriedBuilding	:storiedBuilding,//否	string	楼栋总数
            CoversArea	:coversArea,//否	string	占地面积
            BusinessCircle	:businessCircle,//否	string	周边商圈
            CompletionTime	:completionTime,//否	string	竣工时间
            CheckRoom	:checkRoom,//否	string	最早交房
            AfforestationRate	:afforestationRate,//否	string	绿化率
            PropertyManagement	:propertyManagement,//否	string	物业费用
            Decorate	:decorate,//否	string	1 毛坯 2精装修 3简装修
            CompleteSet	:completeSet,//否	string	配套设施
            ConstructionArea	:constructionArea,//否	string	建筑面积
            CreateUserid	:1,//createUserid,//否	string	创建人
            PermissionCode	:1,//createUserid,//否	string	权限字段 部门+组织+人员 (如：一事业部的ID是1，一组的ID是1，一组的某专员ID是1，即为000100010000001)
            IsPermission	:"1",//否	string	0 为公盘 1为私盘
            Longitude	:longitude,//否	string	baidu经度
            Latitude	:latitude//否	string	baidu纬度
        },
        success:function(data){
            if(data.data.status==='success'){
                alert('新增楼盘成功!3s后跳转到列表页...');
                setTimeout(function(){
                    $(location).attr('href','./index.html');//跳转列表页
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
$('#addLand>footer').on('click','a:first-child',function(e){
    e.preventDefault();
    jobIndex=$('#Job>li.active').index();//职位名称下标
    linkName=$('#LinkName').val();//联系人
    linkPhone=$('#LinkPhone').val();//联系人电话
    //判断是否新增
    if($('#tbl>tbody>tr:gt(0)').length===0){
        xiangMuLianXiRen=jobIndex+','+linkName+','+linkPhone+';';
    }
    //console.log(xiangMuLianXiRen);
    xiangMuLianXiRen=xiangMuLianXiRen.slice(0,-1);//xiangMuLianXiRen
    propertyAddress=$('#PropertyAddress').val();//小区地址
    abbreviation=$('#Abbreviation').val();//开发商简称
    soldState=$('#SoldState>li.active').index()===-1?'':$('#SoldState>li.active').index();//在售状态 0在建 1 待开盘 2在售 3滞销 4售罄
    progress=$('#Progress>li.active').index()===-1?'':$('#Progress>li.active').index();//工程进度
    isLimitsign=$('#IsLimitsign>li.active').index()===-1?'':$('#IsLimitsign>li.active').index();//可否限签
    propertyName=$('#PropertyName').val();//项目名
    boroughID=$('#BoroughID>li.active>a').attr('id');//区域id
    plateID=$('#PlateID>li.active>a').attr('id');//板块id
    propertyDevelopers=$('#PropertyDevelopers').val();//开发商
    isMortgage=$('#IsMortgage>li.active').index()===-1?'':$('#IsMortgage>li.active').index();//抵押情况
    isLoan=$('#IsLoan>li.active').index()===-1?'':$('#IsLoan>li.active').index();//贷款情况
    dealMoney=$('#DealMoney').val();//可售货值
    salesArea=$('#SalesArea').val();//可售面积
    salesHouse=$('#SalesHouse').val();//可售套数
    allMoney=$('#AllMoney').val();//总货值
    allArea=$('#AllArea').val();//总面积
    allHouse=$('#AllHouse').val();//总套数
    minPrice=$('#MinPrice').val();//总价区间最小值
    maxPrice=$('#MaxPrice').val();//总价区间最大值
    minunderquote=$('#Minunderquote').val();//底价区间最小值
    maxunderquote=$('#Maxunderquote').val();//底价区间最大值
    experience=$('#Experience>li.active').index()===-1?'':$('#Experience>li.active').index() ;//体验情况
    saleValidityDate=$('#SaleValidityDate').val();//许可证有效期
    minPriceRange=$('#MinPriceRange').val();//单价区间最小值
    priceRange=$('#PriceRange').val();//单价区间最大值
    minFilingprice=$('#MinFilingprice').val();//备案价最小值
    maxFilingprice=$('#MaxFilingprice').val();//备案价最大值
    openDatetime=$('#OpenDatetime').val();//开盘时间
    saleValidity=$('#SaleValidity').val();//预售许可证
    agentTimeBegin=$('#agent .AgentTimeBegin').val();//代理时间段开始
    agentTimeEnd=$('#agent .AgentTimeEnd').val();//代理时间段结束
    commissionMethod=$('#CommissionMethod>li.active').index()+1===0?'':$('#CommissionMethod>li.active').index()+1 ;//佣金方式
    bondMenu=$('#BondMenu>li.active').index()===-1?'':$('#BondMenu>li.active').index();//保证金
    urgency=$('#Urgency>li.active').index()===-1?'':$('#Urgency>li.active').index();//紧急程度
    saleTypes=$('#SaleTypes>li.active').index()===-1?'':$('#SaleTypes>li.active').index();//目前销售模式
    agentName=$('#company .AgentName').val();//代理公司名
    acceptSalestype=$('#AcceptSalestype>li.active').index()===-1?'':$('#AcceptSalestype>li.active').index();//可接受销售类型
    groupSituation=$('#GroupSituation>li.active').index()===-1?'':$('#GroupSituation>li.active').index();//团购收取
    followUp=$('#FollowUp>li.active').index()===-1?'':$('#FollowUp>li.active').index();//后续效应
    buildingArea=$('#BuildingArea').val();//建筑用地面积
    competitivePrice=$('#CompetitivePrice').val();//竞得价
    floorPrice=$('#FloorPrice').val();//楼面价
    propertyRightyears=$('#PropertyRightyears').val();//产权年限
    competitiveDate=$('#CompetitiveDate').val();//竞得日期
    startingPrice=$('#StartingPrice').val();//起始价
    plotRatioStart=$('#PlotRatioStart').val();//容积率
    landTypeStart=$('#LandTypeStart>li.active').index()===-1?'':$('#LandTypeStart>li.active').index();//用地性质
    completionTime=$('#CompletionTime').val();//竣工时间
    checkRoom=$('#CheckRoom').val();//最早交房
    afforestationRate=$('#AfforestationRate').val();//绿化率
    propertyManagement=$('#PropertyManagement').val();//物业费
    decorate=$('#Decorate>li.active').index()===-1?'':$('#Decorate>li.active').index();//装修情况
    completeSet=$('#CompleteSet').val();//配套设施
    constructionArea=$('#ConstructionArea').val();//建筑面积
    propertyCompany=$('#PropertyCompany').val();//物业公司
    propertyType=$('#PropertyType>li.active').index()===-1?'':$('#PropertyType>li.active').index();//物业类型
    plotRatio=$('#PlotRatio').val();//容积率
    planningHouse=$('#PlanningHouse').val();//规划户数
    parkingSpace=$('#ParkingSpace').val();//车位数
    storiedBuilding=$('#StoriedBuilding').val();//楼栋总数
    coversArea=$('#CoversArea').val();//占地面积
    businessCircle=$('#BusinessCircle').val();//周边商圈
    removalRate=((allMoney-dealMoney)*10000/((new Date().getTime()-new Date(openDatetime).getTime())/1000/3600/24/30)).toFixed(2);
    deTime=Math.ceil(dealMoney*10000/removalRate);//去化时间
    if(allMoney===''||dealMoney===''||openDatetime===''){
        removalRate='';
        deTime='';
    }
    floorAdd();
});
//登录人有权限的城市，区域，板块
//判断登录人是否属于营运中心
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
        cityID=$(e.target).attr('id');
        $('#cityName').val($(e.target).html());
        $.ajax({
            url:initUrl+'AreaBorough.do',
            type:'POST',
            data:{
                "CityID":cityID//城市id
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
    function city(){
        $.ajax({
            url:initUrl+'diQuQuanXian_2.do',
            type:'POST',
            data:{
                "Type":"1",//是	string	1：为城市 2：为区域 3：为板块
                "DepartmentID":permissionID,//营运中心id
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
        cityID=$(e.target).attr('id');
        $.ajax({
            url:initUrl+'diQuQuanXian_2.do',
            type:'POST',
            data:{
                "Type":"2",//是	string	1：为城市 2：为区域 3：为板块
                "DepartmentID":permissionID,
                "Permissiontype":permissionType,//是	string	1为 营运中心 2事业部 3位开发组 4位开发人员
                "CityID":cityID//城市id
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
    //板块点击
    $('#PlateID').on('click','a',function(e){
        e.preventDefault();
    });
}
//城市筛选
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
            var citiesHtml='',limitCity;
            //城市内容动态添加
            limitCity=data.cityName;
            if(!limitCity){
                return;
            }
            $.each(limitCity,function(i){
                citiesHtml+=`
                           <li class="city"><a href="#" id="${limitCity[i].ID}">${limitCity[i].CityName}</a></li>
                        `;
            });
            $('#CityID0').html(citiesHtml);
        },
        error:function(){
            alert('服务器内部出错了')
        }
    });
});
$('#cityName').focus(function(){
    $('#borouMenu>a>span').html('请选择').css('color','#BEBEBE');
    $('#plateMenu>a>span').html('请选择').css('color','#BEBEBE');
});
//楼盘名去重接口
$(function(){
    var  propertyName='';//项目名
    $('#add>footer>a').click(function(e){
        e.preventDefault();
        propertyName=$('#PropertyName').val();//项目名
        $.ajax({
            url:initUrl+'isHavePropertyNameBySameCity_2.do',
            type:'POST',
            data:{
                PropertyName:propertyName	,//是	string	楼盘名称
                CityID:cityID	//是	string	城市Id
            },
            success:function(data){
                if(data.data.flag==1){
                    alert('楼盘名称重复');
                    $(location).attr('href','./add.jsp');
                }else if(data.data.flag==0){
                    alert('楼盘名称不重复，可用');
                }
            },
            error:function(){
                alert('服务器内部出错了')
            }
        });
    });
});