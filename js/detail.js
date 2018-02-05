//获取链接中的楼盘信息
var searchArr=location.search.slice(1).split('&');
var valArr=[];
$.each(searchArr,function(i){
    valArr.push(searchArr[i].slice(searchArr[i].indexOf('=')+1).split(','));
});
var floorId=valArr[0][0];//获取链接中楼盘id
var pageNo=valArr[1][0];//获取链接中页码
var pageSize=valArr[2][0];//获取链接中每页展示数量
$('.dropdown-toggle').click(function(e){
    $(e.target).parent().css('border-color','#ccc');
});
$('.dropdown-toggle>span').click(function(e){
    $(e.target).parent().parent().css('border-color','#ccc');
});
$('.controls input').focus(function(e){
    $(e.target).css('border-color','#ccc');
});
//主详情
var abbVal,//开发商简称
    opentime,//开盘时间
    parking,//车位数
    minunder,//最低的低价
    competitive,//竞得日期
    propertyDe,//小区开发商
    agentN,//代理公司名
    planning,//规划户
    minPrR,//单价最小的价格
    plotRa,//容积率(土地)
    minFiling,//最小的备案价
    completeVal,//配套设施
    floorPr,//楼面价
    propertyAdd,//小区地址
    saleVali,//许可证有效期
    buildingAr,//建筑用地面积
    maxPr,//房屋总价最大值
    competitivePr,//竞得价
    agentTimeE,//代理时间段(结束)
    startingPr,//起始价
    minPr,//房屋总价最小值
    businessCir,//周边商圈
    priceRan,//单价最大
    maxunder,//最高的低价
    checkRo,//最早交房
    plotRat,//容积率
    propertyC,//物业公司
    agentTimeB,//代理时间段(开始)
    allHou,//总套数
    storiedBu,//楼栋总数
    maxFiling,//最大的备案价
    afforestation,//绿化率
    propertyN,//小区名称
    propertyRight,//产权年限
    saleVa,//预售证
    coversA,//占地面积
    dealM,//待销售金额
    salesA,//可售面积
    propertyManage,//物业费用
    salesH,//可售套数
    completionT,//竣工时间
    allA,    //总面积
    constructionA,    //建筑面积
    weiHuR,   //维护人
    fTypeIndex,//跟进
    sSIndex,//在售状态
    bTIndex,//建筑类型
    basicExperience,//体验初值
    aMoney,//总货值
    mIndex,//抵押
    isLimitIndex,//限签
    pIndex,//进度
    lIndex,//贷款
    cIndex,//佣金下标
    bIndex,//保证金
    urIndex,//紧急程度
    saIndex,//目前销售类型
    acIndex,//可接受销售类型
    suIndex,//甲方支持
    grIndex,//团购
    foIndex,//后续效应
    lTypeStart,//用地性质
    decorateIndex,//装修
    prType,//物业类型
    ctId,//城市ID
    plId,//板块id
    brId;//区域id
var buildingTypeIndex,supportIndex;//建筑类型
//跳转成功后异步请求详情数据
var buildingArr=[],supportArr=[],build2Html='',support2Html='';
var tipHtml='';//跟进变更
//跟进状态
function followType(t){
    switch(t)
    {
        case 0:
            return t = "待扫盘";
            break;
        case 2:
            return t = "扫盘中";
            break;
        case 3:
            return t = "维护中";
            break;
        case 4:
            return t = "已提报";
            break;
        case 5:
            return t = "商务谈判";
            break;
        case 6:
            return t = "合同签订";
            break;
        case 7:
            return t = "无效盘";
            break;
        default:
            return t = "其他";
            break;
    }
}
//物业类型
function propertyType0(t){
    switch(t)
    {
        case 1:
            return t = "住宅";
            break;
        case 2:
            return t = "公寓";
            break;
        case 3:
            return t = "商铺";
            break;
        default:
            return t = "其他";
            break;
    }
}
// "SoldState": 2,//在售状态 0在建  1 待开盘 2在售 3滞销 4售罄
function soldState(t){
    switch(t)
    {
        case 0:
            return t = "在建";
            break;
        case 1:
            return t = "待开盘";
            break;
        case 2:
            return t = "在售";
            break;
        case 3:
            return t = "滞销";
            break;
        case 4:
            return t = "售罄";
            break;
        default:
            return t = "其他";
            break;
    }
}
//工程进度
function progress(t){
    switch(t)
    {
        case 1:
            return t = "打桩";
            break;
        case 2:
            return t = "浇筑";
            break;
        case 3:
            return t = "封顶";
            break;
        case 4:
            return t = "竣工";
            break;
        default:
            return t = "其他";
            break;
    }
}
//可否贷款
function isLoan(t){
    switch(t)
    {
        case 0:
            return t = "否";
            break;
        case 1:
            return t = "是";
            break;
        default:
            return t = "其他";
            break;
    }
}
//抵押情况
function isMortgage(t){
    switch(t)
    {
        case 0:
            return t = "否";
            break;
        case 1:
            return t = "是";
            break;
        default:
            return t = "其他";
            break;
    }
}
//是否限签
function isLimitsign(t){
    switch(t)
    {
        case 0:
            return t = "否";
            break;
        case 1:
            return t = "是";
            break;
        default:
            return t = "其他";
            break;
    }
}
//职位
function place(t){//职位 1、销售员 2、销售经理 3、营销总 4、项目总经理 5、股东6、董事长 7、其他
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
        case 7:
            return t = "其他";
            break;
        default:
            return t = "其他";
            break;
    }
}
//体验情况
function experience(t){
    switch(t)
    {
        case 1:
            return t = "不需要包装";
            break;
        case 2:
            return t = "部分包装";
            break;
        case 3:
            return t = "整体重新包装";
            break;
        case 4:
            return t = "烂尾楼";
            break;
        default:
            return t = "其他";
            break;
    }
}
//销售类型
function salesType(c){
    switch(c)
    {
        case 1:
            return c = "接受代理，目前无代理";
            break;
        case 2:
            return c = "独家代理";
            break;
        case 3:
            return c = "自销";
            break;
        case 4:
            return c = "联合代理";
            break;
        case 5:
            return c = "只做案场 ";
            break;
        case 6:
            return c = "只做联动";
            break;
        default:
            return c = "其他";
            break;
    }
}
//佣金方式
function commission(t){
    switch(t)
    {
        case 1:
            return t = "固定点数";
            break;
        case 2:
            return t = "跳点";
            break;
        case 3:
            return t = "包销";
            break;
        default:
            return t = "其他";
            break;
    }
}
//保证金
function bond(t){
    switch (t){
        case 1:
            return t = "0-50万";
            break;
        case 2:
            return t = "50-100万";
            break;
        case 3:
            return t = "100-200万";
            break;
        case 4:
            return t = "200-300万";
            break;
        case 5:
            return t = "500万以上";
            break;
        default:
            return t = "其他";
            break;
    }
}
//团购情况
function group(t){
    switch (t){
        case 1:
            return t = "甲方收";
            break;
        case 2:
            return t = "代理收";
            break;
        default:
            return t = "其他";
            break;
    }
}
//紧急程度
function urgency(t){
    switch (t){
        case 1:
            return t = "不紧急";
            break;
        case 2:
            return t = "一般";
            break;
        case 3:
            return t = "需要马上进场";
            break;
        default:
            return t = "其他";
            break;
    }
}
//后续效应
function followUp(t){
    switch (t){
        case 1:
            return t = "后续合作机会";
            break;
        case 2:
            return t = "提高知名";
            break;
        default:
            return t = "其他";
            break;
    }
}
//用地性质
function landType(t){
    switch (t){
        case 1:
            return t = "住宅";
            break;
        case 2:
            return t = "商业／办公";
            break;
        case 3:
            return t = "工业";
            break;
        case 4:
            return t = "其他";
            break;
        default:
            return t = "其他";
            break;
    }
}
//装修情况
function decorate0(t){
    switch (t){
        case 1:
            return t = "毛坯";
            break;
        case 2:
            return t = "精装修";
            break;
        case 3:
            return t = "简装修";
            break;
        default:
            return t = "其他";
            break;
    }
}
function floorDetail(){
    $.ajax({
        url:initUrl+'propertyDetails_2.do',
        data:{
            Id:floorId,//楼盘id
            PageNum:pageNo,//页码
            PageSize:pageSize//最大页数
        },
        type:'POST',
        success:function(data){
            //console.log(data);
            //项目联系人
            var LinkHtml="";
            var result=data.data.property_D_ProjectContact_2;
            if(!result){
                return;
            }
            $.each(result,function(i){
                var phone=result[i].LinkPhone;
                var phoneStr=phone.slice(0,3)+'****'+phone.slice(-4);
                LinkHtml+=`
                <div class="sui-row-fluid">
                    <div class="span4"><h4>${place(parseFloat(result[i].Job))}</h4></div>
                </div>
                <div class="sui-row-fluid">
                    <div class="span4">${result[i].LinkName}</div>
                    <div class="span5 show">${phone}</div>
                    <div class="span5">${phoneStr}</div>
                    <div class="span3 look"><a href="#">查看</a></div>
                </div>
            `;
            });
            $('#contacts>div.person').html(LinkHtml);
            $('#contacts>div.person').on('click','.look>a',function(e){
                e.preventDefault();
                $(e.target).parent().prev().css('display','none');//加密的电话隐藏
                $(e.target).parent().prev().prev().css('display','block');//显示完整电话
            });
            //体量
            var countResult=data.data.propertyDetails_2;
            var countHtml='',marketHtml='',coopHtml='',landHtml='',floorHtml='',fHtml='',
                countModalHtml='',markeModaltHtml='',coopModalHtml='',landModalHtml='',
                floorModalHtml='',fModalHtml='';
            if(!countResult){
                return;
            }
            $.each(countResult,function(i){
                weiHuR=countResult[i].WeiHuRen;
                if(!weiHuR){
                    weiHuR='';
                }
                $('#whr').html(weiHuR);//维护人
                abbVal=countResult[i].Abbreviation;//开发商简称
                opentime=countResult[i].OpenDatetime;//开盘时间
                parking=countResult[i].ParkingSpace;//车位数
                minunder=countResult[i].Minunderquote;//最低的低价
                competitive=countResult[i].CompetitiveDate;//竞得日期
                propertyDe=countResult[i].PropertyDevelopers;//小区开发商
                agentN=countResult[i].AgentName;//代理公司名
                planning=countResult[i].PlanningHouse;//规划户
                minPrR=countResult[i].MinPriceRange;//单价最小的价格
                plotRa=countResult[i].PlotRatioStart;//容积率(土地)
                minFiling=countResult[i].MinFilingprice;//最小的备案价
                completeVal=countResult[i].CompleteSet;//配套设施
                floorPr=countResult[i].FloorPrice;//楼面价
                propertyAdd=countResult[i].PropertyAddress;//小区地址
                saleVali=countResult[i].SaleValidityDate;//许可证有效期
                buildingAr=countResult[i].BuildingArea;//建筑用地面积
                maxPr=countResult[i].MaxPrice;//房屋总价最大值
                competitivePr=countResult[i].CompetitivePrice;//竞得价
                agentTimeE=countResult[i].AgentTimeEnd;//代理时间段(结束)
                startingPr=countResult[i].StartingPrice;//起始价
                minPr=countResult[i].MinPrice;//房屋总价最小值
                businessCir=countResult[i].BusinessCircle;//周边商圈
                priceRan=parseFloat(countResult[i].PriceRange);//单价最大
                maxunder=countResult[i].Maxunderquote;//最高的低价
                checkRo=countResult[i].CheckRoom;//最早交房
                plotRat=countResult[i].PlotRatio;//容积率
                propertyC=countResult[i].PropertyCompany;//物业公司
                agentTimeB=countResult[i].AgentTimeBegin;//代理时间段(开始)
                allHou=countResult[i].AllHouse;//总套数
                storiedBu=countResult[i].StoriedBuilding;//楼栋总数
                maxFiling=countResult[i].MaxFilingprice;//最大的备案价
                afforestation=countResult[i].AfforestationRate;//绿化率
                propertyN=countResult[i].PropertyName;//小区名称
                propertyRight=countResult[i].PropertyRightyears;//产权年限
                saleVa=countResult[i].SaleValidity;//预售证
                coversA=countResult[i].CoversArea;//占地面积
                dealM=countResult[i].DealMoney;//待销售金额
                salesA=countResult[i].SalesArea;//可售面积
                propertyManage=countResult[i].PropertyManagement;//物业费用
                salesH=countResult[i].SalesHouse;//可售套数
                completionT=countResult[i].CompletionTime;//竣工时间
                allA=countResult[i].AllArea;    //总面积
                constructionA=countResult[i].ConstructionArea;    //建筑面积
                //头部楼盘详情
                isLimitIndex=parseFloat(countResult[i].IsLimitsign);//限签初值
                pIndex=parseFloat(countResult[i].Progress);//进度初值
                acIndex=parseFloat(countResult[i].AcceptSalestype);//可接受销售类型
                suIndex=parseFloat(countResult[i].DeveloperSupport);//甲方支持
                grIndex=parseFloat(countResult[i].GroupSituation);//团购
                foIndex=parseFloat(countResult[i].FollowUp);//后续效应
                fTypeIndex=parseFloat(countResult[i].FollowType);//保存跟进状态初值
                sSIndex=parseFloat(countResult[i].SoldState);//保存在售状态初值
                bTIndex=countResult[i].BuildingType;//建筑类型
                basicExperience=parseFloat(countResult[i].Experience);//体验初值
                aMoney=countResult[i].AllMoney;//总货值初值
                mIndex=parseFloat(countResult[i].IsMortgage);//抵押初值
                lIndex=parseFloat(countResult[i].IsLoan);//贷款初值
                cIndex=parseFloat(countResult[i].CommissionMethod);//佣金下标
                bIndex=parseFloat(countResult[i].Bond);//保证金
                urIndex=parseFloat(countResult[i].Urgency);//紧急程度
                saIndex=countResult[i].ProxySalestype;//目前销售类型
                lTypeStart=parseFloat(countResult[i].LandTypeStart);//用地性质
                decorateIndex=parseFloat(countResult[i].Decorate);//装修
                prType=parseFloat(countResult[i].PropertyType);//物业类型
                ctId=countResult[i].CityID;//城市
                brId=countResult[i].BoroughID;//区域
                plId=countResult[i].PlateID;//板块
                if(!priceRan){
                    priceRan=0;//单价最大
                }
                if(isNaN(isLimitIndex)){
                    isLimitIndex=2;//是否限签
                }
                if(isNaN(prType)){
                    prType=0;//物业类型
                }
                if(isNaN(decorateIndex)){
                    decorateIndex=0;//装修
                }
                if(isNaN(lTypeStart)){
                    lTypeStart=0;//用地性质
                }
                if(!saIndex){
                    saIndex=0;//目前销售类型
                }
                if(isNaN(urIndex)){
                    urIndex=0;//紧急程度
                }
                if(isNaN(bIndex)){
                    bIndex=0;//保证金
                }
                if(isNaN(cIndex)){
                    cIndex=0;//佣金下标
                }
                if(isNaN(lIndex)){
                    lIndex=2;//贷款初值
                }
                if(!aMoney){
                    aMoney=0;//总货值初值
                }
                if(isNaN(basicExperience)){
                    basicExperience=0;//体验初值
                }
                if(isNaN(mIndex)){
                    mIndex=2;//抵押初值
                }
                if(isNaN(pIndex)){
                    pIndex=0;//进度初值
                }
                if(isNaN(acIndex)){
                    acIndex=0;//可接受销售类型
                }
                if(isNaN(suIndex)){
                    suIndex=0;//甲方支持
                }
                if(isNaN(grIndex)){
                    grIndex=0;//团购
                }
                if(isNaN(foIndex)){
                    foIndex=0;//后续效应
                }
                if(isNaN(fTypeIndex)){
                    fTypeIndex=1; //保存跟进状态初值
                }
                if(isNaN(sSIndex)){
                    sSIndex=5; //在售状态
                }
                if(!bTIndex){
                    bTIndex='';//建筑类型
                }
                if(!plotRa){
                    plotRa=0;//容积率
                }
                if(!plotRat){
                    plotRat=0;//详情容积率
                }
                if(!coversA){
                    coversA=0;//占地面积
                }
                //楼盘详情星级
                var n=parseFloat(countResult[i].SalePoint);//获得几星
                //console.log(n);
                if(isNaN(n)){
                    n=0;
                }
                var imgHtml='';
                for(var j=0;j<n;j++){
                    imgHtml+=`
                      <img src="./res/star-full.png" alt=""/>
                    `;
                }
                //建筑类型
                var build=[];
                if(bTIndex.toString().length==1){
                    build[0]=bTIndex;
                }else{
                    build=bTIndex.split(',');
                }
                var buildHtml='',build1Html='';
                $.each(build,function(j){
                    if(build[j]==0){
                        buildHtml+=`
                        <div class="span1 btn zz"><a href="#">公寓</a></div>
                       `;
                        build1Html+=`公寓`;
                    }else if(build[j]==1){
                        buildHtml+=`
                        <div class="span1 btn zz"><a href="#">别墅</a></div>
                       `;
                        build1Html+=` 别墅`;
                    }else if(build[j]==5){
                        buildHtml+=`
                        <div class="span1 btn zz"><a href="#">商业</a></div>
                       `;
                        build1Html+=` 商业`;
                    }else if(build[j]==6){
                        buildHtml+=`
                        <div class="span1 btn zz"><a href="#">住宅</a></div>
                       `;
                        build1Html+=` 住宅`;
                    }else{
                        buildHtml+=`
                        <div class="span1 btn zz"><a href="#">其他</a></div>
                       `;
                        build1Html+=` 其他`;
                    }
                });
                build2Html=build1Html;
                //甲方支持
                var support=[];
                if(suIndex.toString().length==1){
                    support[0]=suIndex;
                }else{
                    support=suIndex.split(',')
                }
                var supportHtml='',support1Html='';
                $.each(support,function(j){
                    if(support[j]==1){
                        supportHtml+=`
                        <div class="span2">班车</div>
                       `;
                        support1Html+=`班车`;
                    }else if(support[j]==2){
                        supportHtml+=`
                        <div class="span2">样板房</div>
                       `;
                        support1Html+=` 样板房`;
                    }else if(support[j]==3){
                        supportHtml+=`
                        <div class="span2">物料</div>
                       `;
                        support1Html+=` 物料`;
                    }else if(support[j]==4){
                        supportHtml+=`
                        <div class="span2">盒饭</div>
                       `;
                        support1Html+=` 盒饭`;
                    }else{
                        supportHtml+=`
                        <div class="span2">其他</div>
                       `;
                        support1Html+=` 其他`;
                    }
                });
                support2Html=support1Html;
                //楼盘信息
                fHtml+=`
                    <div class="sui-row-fluid project">
                        <div class="span3"><h1>${propertyN}<span>${imgHtml}</span></h1></div>
                        <div class="span1 btn"><a href="#">${followType(fTypeIndex)}</a></div>
                        <div class="span1 btn"><a href="#">${soldState(sSIndex)}</a></div>
                        ${buildHtml}
                    </div>
                    <div class="sui-row-fluid lists">
                        <div class="span1"><h3>项目地址</h3></div>
                        <div class="span3">${propertyAdd}</div>
                        <div class="span1"><h3>工程进度</h3></div>
                        <div class="span1">${progress(pIndex)}</div>
                        <div class="span2"><h3>是否可以贷款</h3></div>
                        <div class="span1">${isLoan(lIndex)}</div>
                    </div>
                    <div class="sui-row-fluid lists">
                        <div class="span1"><h3>开发商</h3></div>
                        <div class="span3">${abbVal}（${propertyDe}）</div>
                        <div class="span1"><h3>抵押情况</h3></div>
                        <div class="span1">${isMortgage(mIndex)}</div>
                        <div class="span2"><h3>是否限签</h3></div>
                        <div class="span1 no">${isLimitsign(isLimitIndex)}</div>
                    </div>
                `;
                fModalHtml+=`
                      <div class="grid-demo">
                         <div id="count-gt1" class="gt">
                                  <form class="sui-form form-horizontal">
                                           <div class="control-group">
                                               <label class="control-label">跟进状态</label>
                                               <div class="controls">
                                                   <span class="sui-dropdown dropdown-bordered select">
                                                                     <span class="dropdown-inner">
                                                                               <a  role="button" data-toggle="dropdown" href="#" class="dropdown-toggle">
                                                           <input id="progress" name="state" type="hidden"><i class="caret"></i><span>${followType(fTypeIndex)}</span>
                                                                               </a>
                                                                         <ul  id="followMenu" role="menu"  class="sui-dropdown-menu">
                                                                             <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);">待扫盘</a></li>
                                                                             <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);"></a></li>
                                                                             <li role="presentation" ><a role="menuitem" tabindex="-1" href="javascript:void(0);">扫盘中</a></li>
                                                                             <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);">维护中</a></li>
                                                                             <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);">已提报</a></li>
                                                                             <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);">商务谈判</a></li>
                                                                             <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);">合同签订</a></li>
                                                                             <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);">无效盘</a></li>
                                                                         </ul></span></span>
                                               </div>
                                           </div>

                                      <div class="control-group star-gt">
                                          <label class="control-label">开发商全称</label>
                                          <div class="controls">
                                              <input type="text" id="Develope" value="${propertyDe}">
                                          </div>
                                      </div>
                                      <div class="control-group star-gt">
                                          <label class="control-label">开发商简称</label>
                                          <div class="controls">
                                              <input type="text" id="Develope1" value="${abbVal}">
                                          </div>
                                      </div>
                                      <div class="control-group star">
                                          <label class="control-label">抵押情况</label>
                                          <div class="controls">
                                              <span class="sui-dropdown dropdown-bordered select">
                                                <span class="dropdown-inner">
                                                     <a  role="button" data-toggle="dropdown" href="#" class="dropdown-toggle">
                                                        <input id="IsMortgage" name="state" type="hidden"><i class="caret"></i><span>${isMortgage(mIndex)}</span>
                                                     </a>
                                                     <ul  id="MortgageMenu" role="menu"  class="sui-dropdown-menu">
                                                         <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);">无抵押</a></li>
                                                         <li role="presentation" ><a role="menuitem" tabindex="-1" href="javascript:void(0);">有抵押</a></li>
                                                     </ul></span></span>
                                          </div>
                                      </div>
                                      <div class="control-group star">
                                          <label class="control-label">可否限签</label>
                                          <div class="controls gt">
                                              <span class="sui-dropdown dropdown-bordered select">
                                                                <span class="dropdown-inner">
                                                                          <a  role="button" data-toggle="dropdown" href="#" class="dropdown-toggle">
                                                     <input id="IsLimitsign" name="state" type="hidden"><i class="caret"></i><span>${isLimitsign(isLimitIndex)}</span>
                                                                          </a>
                                                                    <ul  id="LimitsignMenu" role="menu"  class="sui-dropdown-menu">
                                                                        <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="否">否</a></li>
                                                                        <li role="presentation" ><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="是">是</a></li>
                                                                    </ul></span></span>
                                          </div>
                                      </div>
                                  </form>
                         </div>
                         <div id="project-m1">
                                  <form class="sui-form form-horizontal">
                                           <div class="control-group  type">
                    <label class="control-label">建筑类型</label>
                    <div class="controls">
                        <img src="./res/caret-down.png" alt="" class="gt caret"/>
                        <div id="buildingVal" data-rules="required">
                            <span>${build1Html}</span>
                        </div>
                        <ul id="BuildingType">
                            <li>
                                <img src="./res/right.png" alt="" class="gt"/>
                                <a href="#" class="0">公寓</a>
                            </li>
                            <li>
                                <img src="./res/right.png" alt="" class="gt"/>
                                <a href="#" class="1">别墅</a>
                            </li>
                            <li>
                                <img src="./res/right.png" alt="" class="gt"/>
                                <a href="#" class="5">商业</a>
                            </li>
                            <li>
                                <img src="./res/right.png" alt="" class="gt"/>
                                <a href="#" class="6">住宅</a>
                            </li>
                            <li>
                                <img src="./res/right.png" alt="" class="gt"/>
                                <a href="#" class="7">其他</a>
                            </li>
                        </ul>
                    </div>
                </div>
                                           <div class="control-group">
                                               <label class="control-label">在售状态</label>
                                               <div class="controls">
                                                   <span class="sui-dropdown dropdown-bordered select">
                                                                     <span class="dropdown-inner">
                                                                               <a  role="button" data-toggle="dropdown" href="#" class="dropdown-toggle">
                                                           <input id="progress" name="state" type="hidden"><i class="caret"></i><span>${soldState(sSIndex)}</span>
                                                                               </a>
                                                                         <ul  id="soldMenu" role="menu"  class="sui-dropdown-menu">
                                                                             <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);">在建</a></li>
                                                                             <li role="presentation" ><a role="menuitem" tabindex="-1" href="javascript:void(0);">待开盘</a></li>
                                                                             <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);">在售</a></li>
                                                                             <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);">滞销</a></li>
                                                                             <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);">售罄</a></li>

                                                                         </ul></span></span>
                                               </div>
                                           </div>
                                           <div class="control-group">
                                               <label class="control-label">名称</label>
                                               <div class="controls">
                                                   <input type="text" id="PropertyName" value="${propertyN}">
                                               </div>
                                           </div>
                                           <div class="control-group">
                                               <label class="control-label">项目地址</label>
                                               <div class="controls">
                                                   <input type="text" id="PropertyAddress" value="${propertyAdd}">
                                               </div>
                                           </div>
                                           <div class="control-group">
                                               <label class="control-label">工程进度</label>
                                               <div class="controls">
                                                   <span class="sui-dropdown dropdown-bordered select">
                                                                     <span class="dropdown-inner">
                                                                               <a  role="button" data-toggle="dropdown" href="#" class="dropdown-toggle">
                                                           <input id="progress" name="state" type="hidden"><i class="caret"></i><span>${progress(pIndex)}</span>
                                                                               </a>
                                                                         <ul  id="progressMenu" role="menu"  class="sui-dropdown-menu">
                                                                             <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="打桩">打桩</a></li>
                                                                             <li role="presentation" ><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="浇筑">浇筑</a></li>
                                                                             <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="封顶">封顶</a></li>
                                                                             <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="竣工">竣工</a></li>
                                                                         </ul></span></span>
                                               </div>
                                           </div>
                                           <div class="control-group">
                                               <label class="control-label">是否可以贷款</label>
                                               <div class="controls gt">
                                                   <span class="sui-dropdown dropdown-bordered select">
                                                                     <span class="dropdown-inner">
                                                                               <a  role="button" data-toggle="dropdown" href="#" class="dropdown-toggle">
                                                   <input id="loan" name="state" type="hidden"><i class="caret"></i><span>${isLoan(lIndex)}</span>
                                                                               </a>
                                                                         <ul  id="loanMenu" role="menu"  class="sui-dropdown-menu">
                                                                             <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="否">否</a></li>
                                                                             <li role="presentation" ><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="是">是</a></li>
                                                                         </ul></span></span>
                                               </div>
                                           </div>
                                  </form>
                         </div>
                    </div>
                    `;
                //体量
                countHtml+=`
                  <div class="sui-row">
                    <div class="span2">货值</div>
                    <div class="span2">${new Number(aMoney).toLocaleString()}亿</div>
                    <div class="span2 move">剩余货值</div>
                    <div class="span2">${new Number(dealM).toLocaleString()}亿</div>
                  </div>
                  <div class="sui-row">
                    <div class="span2">总套数</div>
                    <div class="span2">${allHou}套</div>
                    <div class="span2 move">剩余套数</div>
                    <div class="span2">${salesH}套</div>
                </div>
                <div class="sui-row">
                    <div class="span2">总面积</div>
                    <div class="span2">${new Number(allA).toLocaleString()}m²</div>
                    <div class="span2 move">剩余面积</div>
                    <div class="span2">${new Number(salesA).toLocaleString()}m²</div>
                </div>
                <div class="sui-row">
                    <div class="span2">当前去化速率</div>
                    <div class="span2">${new Number(countResult[i].RemovalRate).toLocaleString()}万/月</div>
                    <div class="span2 move">预计去化时间</div>
                    <div class="span2">${countResult[i].DeTime}个月</div>
                </div>
                `;
                //体量修改
                countModalHtml+=`
                            <div class="grid-demo">
                                <div id="count-gt" class="gt">
                                    <form class="sui-form form-horizontal">
                                        <div class="control-group star-gt">
                                            <label class="control-label">剩余总价</label>
                                            <div class="controls">
                                                <input type="text" value="${dealM}" id="DealMoney">亿
                                            </div>
                                        </div>
                                        <div class="control-group star-gt">
                                            <label class="control-label">剩余套数</label>
                                            <div class="controls">
                                                <input type="text" value="${salesH}" id="SalesHouse">套
                                            </div>
                                        </div>
                                        <div class="control-group star">
                                            <label class="control-label">剩余面积</label>
                                            <div class="controls">
                                                <input type="text" value="${salesA}" id="SalesArea">m²
                                            </div>
                                        </div>
                                        <div class="control-group star-gt">
                                            <label class="control-label last">预计去化时间</label>
                                            <div class="controls">
                                                <input type="text" readonly value="${countResult[i].DeTime}" id="DeTime">月
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div id="project-m">
                                    <form class="sui-form form-horizontal">
                                        <div class="control-group">
                                            <label class="control-label">总价</label>
                                            <div class="controls">
                                                <input type="text" value="${aMoney}" id="AllMoney">亿
                                            </div>
                                        </div>
                                        <div class="control-group">
                                            <label class="control-label">总套数</label>
                                            <div class="controls">
                                                <input type="text" value="${allHou}" id="AllHouse">套
                                            </div>
                                        </div>
                                        <div class="control-group">
                                            <label class="control-label">总面积</label>
                                            <div class="controls">
                                                <input type="text" value="${allA}" id="AllArea">m²
                                            </div>
                                        </div>
                                        <div class="control-group star">
                                            <label class="control-label last">当前去化速率</label>
                                            <div class="controls">
                                                <input type="text" readonly value="${countResult[i].RemovalRate}" id="RemovalRate">万/月
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                    `;
                //销售信息
                //判断是否为空--NaN
                if(minPrR==""){
                    minPrR=0;
                }
                //物业费
                if(propertyManage==''){
                    propertyManage=0;
                }
                marketHtml+=`
                    <div class="sui-row">
                        <div class="span2">单价区间</div>
                        <div class="span2">${parseFloat(minPrR)}-${parseFloat(priceRan)}元/m²</div>
                        <div class="span2 move">总价区间</div>
                        <div class="span3">${parseFloat(minPr)}-${parseFloat(maxPr)}万/套</div>
                    </div>
                    <div class="sui-row">
                        <div class="span2">备案价</div>
                        <div class="span2">${minFiling}-${maxFiling}元/m²</div>
                        <div class="span2 move">底价区间</div>
                        <div class="span4">${minunder}-${maxunder}元/m²</div>
                    </div>
                    <div class="sui-row">
                        <div class="span2">首次开盘时间</div>
                        <div class="span2">${opentime}</div>
                        <div class="span2 move">体验情况</div>
                        <div class="span2">${experience(basicExperience)}</div>
                    </div>
                    <div class="sui-row">
                        <div class="span2">预售许可证</div>
                        <div class="span2">${saleVa}</div>
                        <div class="span2 move">许可证有效期</div>
                        <div class="span2">${saleVali}</div>
                    </div>
                `;
                //销售修改
                markeModaltHtml+=`
                            <div class="grid-demo">
                                <div id="count-gt2" class="gt">
                                    <form class="sui-form form-horizontal">
                                        <div class="control-group areas">
                                            <label class="control-label">总价区间</label>
                                            <div class="controls">
                                                <input type="text" value="${parseFloat(minPr)}" id="MinPrice">
                                                <input type="text" value="${parseFloat(maxPr)}" id="MaxPrice"><span>至</span>万/套
                                            </div>
                                        </div>
                                        <div class="control-group areas">
                                            <label class="control-label">底价区间</label>
                                            <div class="controls">
                                                <input type="text" value="${minunder}" id="Minunderquote">
                                                <input type="text" value="${maxunder}" id="Maxunderquote"><span>至</span>元/m²
                                            </div>
                                        </div>
                                        <div class="control-group">
                                            <label class="control-label">体验情况</label>
                                            <div class="controls">
                                                <span class="sui-dropdown dropdown-bordered select">
                                                <span class="dropdown-inner">
                                                    <a  role="button" data-toggle="dropdown" href="#" class="dropdown-toggle">
                                                        <input value="xz" name="kaifashang" type="hidden"><i class="caret"></i><span>${experience(basicExperience)}</span>
                                                    </a>
                                                      <ul  role="menu" id="experienceMenu" class="sui-dropdown-menu">
                                                          <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="请选择">请选择</a></li>
                                                          <li role="presentation" ><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="不需要包装">不需要包装</a></li>
                                                          <li role="presentation" ><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="部分包装">部分包装</a></li>
                                                          <li role="presentation" ><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="整体重新包装">整体重新包装</a></li>
                                                          <li role="presentation" ><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="烂尾楼">烂尾楼</a></li>
                                                      </ul></span></span>
                                            </div>
                                        </div>
                                        <div id="valid-time" class="control-group">
                                            <label class="control-label">许可证有效期</label>
                                            <div data-toggle="datepicker" class="control-group input-daterange">
                                                <div class="controls">
                                                    <input type="text" class="input-medium" value="${saleVali}" id="SaleValidityDate">
                                                    <img src="./res/date.png" alt=""/>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div id="project-m2">
                                    <form class="sui-form form-horizontal">
                                        <div class="control-group  areas">
                                            <label class="control-label">单价区间</label>
                                            <div class="controls">
                                                <input type="text" value="${parseFloat(minPrR)}" id="MinPriceRange">
                                                <input type="text" value="${parseFloat(priceRan)}" id="PriceRange"><span>至</span>元/m²
                                            </div>
                                        </div>
                                        <div class="control-group areas">
                                            <label class="control-label">备案价</label>
                                            <div class="controls">
                                                <input type="text" value="${minFiling}" id="MinFilingprice">
                                                <input type="text" value="${maxFiling}" id="MaxFilingprice"><span>至</span>元/m²
                                            </div>
                                        </div>
                                        <div id="open-time" class="control-group">
                                            <label class="control-label">首次开盘时间</label>
                                            <div class="controls">
                                                <div data-toggle="datepicker" class="control-group input-daterange">
                                                    <input type="text" class="input-medium" value="${opentime}" id="OpenDatetime">
                                                    <img src="./res/date.png" alt=""/>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="permit" class="control-group">
                                            <label class="control-label">预售许可证号</label>
                                            <div class="controls gt">
                                                <input type="text" value="${saleVa}" id="SaleValidity">
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                    `;
                //合作
                coopHtml+=`
                    <div class="sui-row">
                        <div class="span2">目前销售类型</div>
                        <div class="span2 two">${salesType(saIndex)}</div>
                    </div>
                    <div class="sui-row" id="agentRow">
                        <div class="span2">代理公司名</div>
                        <div class="span2">${agentN}</div>
                        <div class="span2 move">代理时间段</div>
                        <div class="span2">${agentTimeB}至${agentTimeE}</div>
                    </div>
                    <div class="sui-row">
                        <div class="span2">可接受销售类型</div>
                        <div class="span2">${salesType(acIndex)}</div>
                        <div class="span2 move">佣金方式</div>
                        <div class="span2">${commission(cIndex)}</div>
                    </div>
                    <div class="sui-row">
                        <div class="span2">甲方支持</div>
                        ${supportHtml}
                        <div class="span2 move">保证金</div>
                        <div class="span2">${bond(bIndex)}</div>
                    </div>
                    <div class="sui-row">
                        <div class="span2">团购情况</div>
                        <div class="span2">${group(grIndex)}</div>
                        <div class="span2 move">紧急程度</div>
                        <div class="span2">${urgency(urIndex)}</div>
                    </div>
                    <div class="sui-row">
                        <div class="span2">后续效应</div>
                        <div class="span2 two">${followUp(foIndex)}</div>
                    </div>
                `;
                //合作修改
                coopModalHtml+=`
                             <div class="grid-demo">
                                <div id="count-gt3" class="gt">
                                    <form class="sui-form form-horizontal">
                                        <div class="control-group areas" id="timeM">
                                            <label class="control-label">代理时间段</label>
                                            <div data-toggle="datepicker" class=" input-daterange gt">
                                                <div class="controls">
                                                    <input type="text" class="input-medium" value="${agentTimeB}" id="AgentTimeBegin"><span>至</span>
                                                    <img src="./res/date.png" alt="" class="agentBegin"/>
                                                    <input type="text" class="input-medium" value="${agentTimeE}" id="AgentTimeEnd">
                                                    <img src="./res/date.png" alt="" class="agentEnd"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="control-group">
                                            <label class="control-label">佣金方式</label>
                                            <div class="controls gt">
                                                <span class="sui-dropdown dropdown-bordered select">
                                                                          <span class="dropdown-inner">
                                                                                    <a  role="button" data-toggle="dropdown" href="#" class="dropdown-toggle">
                                                                                        <input id="Commission" name="state" type="hidden"><i class="caret"></i><span>${commission(cIndex)}</span>
                                                                                    </a>
                                                                              <ul  id="CommissionMenu" role="menu"  class="sui-dropdown-menu">
                                                                                  <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="固定">固定</a></li>
                                                                                  <li role="presentation" ><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="跳点">跳点</a></li>
                                                                                  <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="包销">包销</a></li>
                                                                              </ul></span></span>
                                            </div>
                                        </div>
                                        <div class="control-group star">
                                            <label class="control-label">保证金</label>
                                            <div class="controls gt">
                                                <span class="sui-dropdown dropdown-bordered select">
                                                <span class="dropdown-inner">
                                                    <a  role="button" data-toggle="dropdown" href="#" class="dropdown-toggle">
                                                        <input value="xz" name="diya" type="hidden"><i class="caret"></i><span>${bond(bIndex)}</span>
                                                    </a>
                                                      <ul  role="menu" id="BondMenu" class="sui-dropdown-menu">
                                                          <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="请选择">请选择</a></li>
                                                          <li role="presentation" ><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="0-50万">0-50万</a></li>
                                                          <li role="presentation" ><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="50-100万">50-100万</a></li>
                                                          <li role="presentation" ><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="100-200万">100-200万</a></li>
                                                          <li role="presentation" ><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="200-300万">200-300万</a></li>
                                                          <li role="presentation" ><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="500万以上">500万以上</a></li>
                                                      </ul></span></span>
                                            </div>
                                        </div>
                                        <div class="control-group star-gt">
                                            <label class="control-label last">紧急程度</label>
                                            <div class="controls gt">
                                                <span class="sui-dropdown dropdown-bordered select">
                                                                          <span class="dropdown-inner">
                                                                                    <a  role="button" data-toggle="dropdown" href="#" class="dropdown-toggle">
                                                                                        <input id="Urgency" name="state" type="hidden"><i class="caret"></i><span>${urgency(urIndex)}</span>
                                                                                    </a>
                                                                              <ul  id="UrgencyMenu" role="menu"  class="sui-dropdown-menu">
                                                                                  <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="不紧急">不紧急</a></li>
                                                                                  <li role="presentation" ><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="一般">一般</a></li>
                                                                                  <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="需要马上进场">需要马上进场</a></li>
                                                                              </ul></span></span>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div id="project-m3">
                                    <form class="sui-form form-horizontal">
                                        <div class="control-group">
                                            <label class="control-label">目前销售类型</label>
                                            <div class="controls gt">
                                                <span class="sui-dropdown dropdown-bordered select">
                                                                          <span class="dropdown-inner">
                                                                                    <a  role="button" data-toggle="dropdown" href="#" class="dropdown-toggle">
                                                                                        <input id="Sales" name="state" type="hidden"><i class="caret"></i><span>${salesType(saIndex)}</span>
                                                                                    </a>
                                                                              <ul  id="SalesMenu" role="menu"  class="sui-dropdown-menu">
                                                                                  <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);">接受代理，目前无代理</a></li>
                                                                                  <li role="presentation" ><a role="menuitem" tabindex="-1" href="javascript:void(0);">独家代理</a></li>
                                                                                  <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);">自销</a></li>
                                                                                  <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);">联合代理</a></li>
                                                                                  <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);">只做案场</a></li>
                                                                                  <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);">只做联动</a></li>
                                                                              </ul></span></span>
                                            </div>
                                        </div>
                                        <div class="control-group" id="companyM">
                                            <label class="control-label">代理公司名</label>
                                            <div class="controls gt">
                                                <input type="text" value="${agentN}" id="AgentName">
                                            </div>
                                        </div>
                                        <div class="control-group">
                                            <label class="control-label">可接受销售类型</label>
                                            <div class="controls gt">
                                                <span class="sui-dropdown dropdown-bordered select">
                                                                          <span class="dropdown-inner">
                                                                                    <a  role="button" data-toggle="dropdown" href="#" class="dropdown-toggle">
                                                                                        <input id="accept" name="state" type="hidden"><i class="caret"></i><span>${salesType(acIndex)}</span>
                                                                                    </a>
                                                                              <ul  id="acceptMenu" role="menu"  class="sui-dropdown-menu">
                                                                                  <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);">接受代理，目前无代理</a></li>
                                                                                  <li role="presentation" ><a role="menuitem" tabindex="-1" href="javascript:void(0);">独家代理</a></li>
                                                                                  <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);">自销</a></li>
                                                                                  <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);">联合代理</a></li>
                                                                                  <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);">只做案场</a></li>
                                                                                  <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);">只做联动</a></li>
                                                                              </ul></span></span>
                                            </div>
                                        </div>
                                        <div class="control-group type">
                                            <label class="control-label last">甲方支持</label>
                                            <div class="controls gt">
                                                <img src="./res/caret-down.png" alt="" class="gt caret"/>
                        <div id="supportVal" data-rules="required">
                            <span>${support1Html}</span>
                        </div>
                        <ul id="supportType">
                            <li>
                                <img src="./res/right.png" alt="" class="gt"/>
                                <a href="#" class="1">班车</a>
                            </li>
                            <li>
                                <img src="./res/right.png" alt="" class="gt"/>
                                <a href="#" class="2">样板房</a>
                            </li>
                            <li>
                                <img src="./res/right.png" alt="" class="gt"/>
                                <a href="#" class="3">物料</a>
                            </li>
                            <li>
                                <img src="./res/right.png" alt="" class="gt"/>
                                <a href="#" class="4">盒饭</a>
                            </li>
                        </ul>
                                            </div>
                                        </div>
                                        <div class="control-group star">
                                            <label class="control-label last">团购情况</label>
                                            <div class="controls gt">
                                                <span class="sui-dropdown dropdown-bordered select">
                                                                          <span class="dropdown-inner">
                                                                                    <a  role="button" data-toggle="dropdown" href="#" class="dropdown-toggle">
                                                                                        <input id="Group" name="state" type="hidden"><i class="caret"></i><span>${group(grIndex)}</span>
                                                                                    </a>
                                                                              <ul  id="GroupMenu" role="menu"  class="sui-dropdown-menu">
                                                                                  <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="甲方收">甲方收</a></li>
                                                                                  <li role="presentation" ><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="代理收">代理收</a></li>
                                                                              </ul></span></span>
                                            </div>
                                        </div>
                                        <div class="control-group star">
                                            <label class="control-label last">后续效应</label>
                                            <div class="controls gt">
                                                <span class="sui-dropdown dropdown-bordered select">
                                                                          <span class="dropdown-inner">
                                                                                    <a  role="button" data-toggle="dropdown" href="#" class="dropdown-toggle">
                                                                                        <input id="FollowUp" name="state" type="hidden"><i class="caret"></i><span>${followUp(foIndex)}</span>
                                                                                    </a>
                                                                              <ul  id="FollowUpMenu" role="menu"  class="sui-dropdown-menu">
                                                                                  <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="后续合作机会">后续合作机会</a></li>
                                                                                  <li role="presentation" ><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="提高知名">提高知名</a></li>
                                                                              </ul></span></span>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                    `;
                //土地情况
                landHtml+=`
                    <div class="sui-row">
                        <div class="span2">竞得日期</div>
                        <div class="span2">${competitive}</div>
                        <div class="span2 move">建筑用地面积</div>
                        <div class="span2">${buildingAr}m²</div>
                    </div>
                    <div class="sui-row">
                        <div class="span2">起始价</div>
                        <div class="span2">${startingPr}万</div>
                        <div class="span2 move">竞得价</div>
                        <div class="span2">${competitivePr}万</div>
                    </div>
                    <div class="sui-row">
                        <div class="span2">容积率</div>
                        <div class="span2">${parseFloat(plotRa)}</div>
                        <div class="span2 move">楼面价</div>
                        <div class="span2">${new Number(floorPr).toLocaleString()}元/m²</div>
                    </div>
                    <div class="sui-row">
                        <div class="span2">用地性质</div>
                        <div class="span2">${landType(lTypeStart)}</div>
                        <div class="span2 move">产权年限</div>
                        <div class="span2">${propertyRight}年</div>
                    </div>
                `;
                //土地修改
                landModalHtml+=`
                             <div class="grid-demo">
                                <div id="count-gt4" class="gt">
                                    <form class="sui-form form-horizontal">
                                        <div class="control-group star-gt">
                                            <label class="control-label">建筑用地面积</label>
                                            <div class="controls">
                                                <input type="text" value="${buildingAr}" id="BuildingArea">m²
                                            </div>
                                        </div>
                                        <div class="control-group star-gt">
                                            <label class="control-label">竞得价</label>
                                            <div class="controls">
                                                <input type="text" value="${competitivePr}" id="CompetitivePrice">万
                                            </div>
                                        </div>
                                        <div class="control-group star">
                                            <label class="control-label">楼面价</label>
                                            <div class="controls">
                                                <input type="text" value="${floorPr}" id="FloorPrice">元/m²
                                            </div>
                                        </div>
                                        <div class="control-group star-gt">
                                            <label class="control-label last">产权年限</label>
                                            <div class="controls">
                                                <input type="text" value="${propertyRight}" id="PropertyRightyears">年
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div id="project-m4">
                                    <form class="sui-form form-horizontal">
                                        <div class="control-group">
                                            <label class="control-label">竞得日期</label>
                                            <div data-toggle="datepicker" class="control-group input-daterange gt">
                                                <div class="controls">
                                                    <input type="text" id="CompetitiveDate" class="input-medium" value="${competitive}" >
                                                    <img src="./res/date.png" alt=""/>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="control-group star">
                                            <label class="control-label last">用地性质</label>
                                            <div class="controls">
                                              <span class="sui-dropdown dropdown-bordered select">
                                                <span class="dropdown-inner">
                                                                <a  role="button" data-toggle="dropdown" href="#" class="dropdown-toggle">
                                                                    <input value="xz" name="diya" type="hidden"><i class="caret"></i><span>${landType(lTypeStart)}</span>
                                                                </a>
                                                          <ul  role="menu" id="LandTypeStart" class="sui-dropdown-menu">
                                                              <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="请选择">请选择</a></li>
                                                              <li role="presentation" ><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="住宅">住宅</a></li>
                                                              <li role="presentation" ><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="商业/办公">商业/办公</a></li>
                                                              <li role="presentation" ><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="工业">工业</a></li>
                                                              <li role="presentation" ><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="其他">其他</a></li>
                                                          </ul></span></span>
                                            </div>
                                        </div>
                                        <div class="control-group">
                                            <label class="control-label">起始价</label>
                                            <div class="controls">
                                                <input type="text" value="${startingPr}" id="StartingPrice">万
                                            </div>
                                        </div>
                                        <div class="control-group">
                                            <label class="control-label">容积率</label>
                                            <div class="controls">
                                                <input type="text" value="${parseFloat(plotRa)}" id="PlotRatioStart">
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                    `;
                //楼盘详情
                floorHtml+=`
                    <div class="sui-row">
                        <div class="span2">物业公司</div>
                        <div class="span2">${propertyC}</div>
                        <div class="span2 move">竣工时间</div>
                        <div class="span2">${completionT}</div>
                    </div>
                    <div class="sui-row">
                        <div class="span2">物业类型</div>
                        <div class="span2">${propertyType0(prType)}</div>
                        <div class="span2 move">最早交房</div>
                        <div class="span2">${checkRo}</div>
                    </div>
                    <div class="sui-row">
                        <div class="span2">容积率</div>
                        <div class="span2">${parseFloat(plotRat)}</div>
                        <div class="span2 move">绿化率</div>
                        <div class="span2">${afforestation}</div>
                    </div>
                    <div class="sui-row">
                        <div class="span2">规划户数</div>
                        <div class="span2">${planning}</div>
                        <div class="span2 move">物业费</div>
                        <div class="span2">${parseFloat(propertyManage)}m²/月</div>
                    </div>
                    <div class="sui-row">
                        <div class="span2">车位数</div>
                        <div class="span2">${parking}</div>
                        <div class="span2 move">装修情况</div>
                        <div class="span2">${decorate0(decorateIndex)}</div>
                    </div>
                    <div class="sui-row">
                        <div class="span2">楼栋总数</div>
                        <div class="span2">${storiedBu}</div>
                        <div class="span2 move">配套设施</div>
                        <div class="span2">${completeVal}</div>
                    </div>
                    <div class="sui-row">
                        <div class="span2">占地面积</div>
                        <div class="span2">${parseFloat(coversA)}m²</div>
                        <div class="span2 move">建筑面积</div>
                        <div class="span2">${new Number(constructionA).toLocaleString()}m²</div>
                    </div>
                    <div class="sui-row">
                        <div class="span2">周边商圈</div>
                        <div class="span2 two">${businessCir}</div>
                    </div>
                `;
                //详情修改
                floorModalHtml+=`
                            <div class="grid-demo">
                                <div id="count-gt5" class="gt">
                                    <form class="sui-form form-horizontal">
                                        <div class="control-group star-gt">
                                            <label class="control-label date">竣工时间</label>
                                            <div class="controls">
                                                <div data-toggle="datepicker" class="control-group input-daterange">
                                                    <div class="controls">
                                                        <input type="text" class="input-medium" value="${completionT}" id="CompletionTime">
                                                        <img src="./res/date.png" alt=""/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="control-group star-gt">
                                            <label class="control-label date">最早交房</label>
                                            <div class="controls">
                                                <div data-toggle="datepicker" class="control-group input-daterange">
                                                    <div class="controls">
                                                        <input type="text" id="CheckRoom" class="input-medium" value="${checkRo}">
                                                        <img src="./res/date.png" alt=""/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="control-group star">
                                            <label class="control-label">绿化率</label>
                                            <div class="controls">
                                                <input type="text" value="${afforestation}" id="AfforestationRate">
                                            </div>
                                        </div>
                                        <div class="control-group">
                                            <label class="control-label">物业费</label>
                                            <div class="controls">
                                                <input type="text" value="${parseFloat(propertyManage)}" id="PropertyManagement">
                                            </div>
                                        </div>
                                        <div class="control-group ">
                                            <label class="control-label">装修情况</label>
                                            <div class="controls">
                                              <span class="sui-dropdown dropdown-bordered select">
                                                <span class="dropdown-inner">
                                                                <a  role="button" data-toggle="dropdown" href="#" class="dropdown-toggle">
                                                                    <input value="xz" name="diya" type="hidden"><i class="caret"></i><span>${decorate0(decorateIndex)}</span>
                                                                </a>
                                                          <ul  role="menu" id="Decorate" class="sui-dropdown-menu">
                                                              <li role="presentation" ><a role="menuitem" tabindex="-1" href="javascript:void(0);" >毛坯</a></li>
                                                              <li role="presentation" ><a role="menuitem" tabindex="-1" href="javascript:void(0);" >精装修</a></li>
                                                              <li role="presentation" ><a role="menuitem" tabindex="-1" href="javascript:void(0);" >简装修</a></li>
                                                          </ul></span></span>
                                            </div>
                                        </div>
                                        <div class="control-group ">
                                            <label class="control-label">配套设施</label>
                                            <div class="controls">
                                                <input type="text" value="${completeVal}" id="CompleteSet">
                                            </div>
                                        </div>
                                        <div class="control-group">
                                            <label class="control-label">建筑面积</label>
                                            <div class="controls">
                                                <input type="text" value="${constructionA}" id="ConstructionArea">
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div id="project-m5">
                                    <form class="sui-form form-horizontal">
                                        <div class="control-group star-gt">
                                            <label class="control-label">物业公司</label>
                                            <div class="controls">
                                                <input type="text" value="${propertyC}" id="PropertyCompany">
                                            </div>
                                        </div>
                                        <div class="control-group star-gt">
                                            <label class="control-label">物业类型</label>
                                            <div class="controls">
                                              <span class="sui-dropdown dropdown-bordered select">
                                                <span class="dropdown-inner">
                                                                <a  role="button" data-toggle="dropdown" href="#" class="dropdown-toggle">
                                                                    <input value="xz" name="diya" type="hidden"><i class="caret"></i><span>${propertyType0(prType)}</span>
                                                                </a>
                                                          <ul  role="menu" id="PropertyType" class="sui-dropdown-menu">
                                                              <li role="presentation" ><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="zz">住宅</a></li>
                                                              <li role="presentation" ><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="sp">公寓</a></li>
                                                              <li role="presentation" ><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="sz">商铺</a></li>
                                                          </ul></span></span>
                                            </div>
                                        </div>
                                        <div class="control-group star">
                                            <label class="control-label">容积率</label>
                                            <div class="controls">
                                                <input type="text" value="${parseFloat(plotRat)}" id="PlotRatio">
                                            </div>
                                        </div>
                                        <div class="control-group">
                                            <label class="control-label">规划户数</label>
                                            <div class="controls">
                                                <input type="text" value="${planning}" id="PlanningHouse">
                                            </div>
                                        </div>
                                        <div class="control-group star-gt">
                                            <label class="control-label">车位数</label>
                                            <div class="controls">
                                                <input type="text" value="${parking}" id="ParkingSpace">
                                            </div>
                                        </div>
                                        <div class="control-group star">
                                            <label class="control-label">楼栋总数</label>
                                            <div class="controls">
                                                <input type="text" value="${storiedBu}" id="StoriedBuilding">
                                            </div>
                                        </div>
                                        <div class="control-group">
                                            <label class="control-label">占地面积</label>
                                            <div class="controls">
                                                <input type="text" value="${parseFloat(coversA)}" id="CoversArea">
                                            </div>
                                        </div>
                                        <div class="control-group">
                                            <label class="control-label">周边商圈</label>
                                            <div class="controls">
                                                <input type="text" value="${businessCir}" id="BusinessCircle">
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                    `;
            });
            $('#project-detail').html(fHtml);//头部楼盘详情
            $('#count').html(countHtml);//体量
            $('#market').html(marketHtml);//销售信息
            $('#coop').html(coopHtml);//合作
            $('#land').html(landHtml);//土地情况
            $('#floor').html(floorHtml);//楼盘详情
            $('#myModal5 .modal-body').html(fModalHtml);//基本信息修改
            $('#myModal .modal-body').html(countModalHtml);//体量信息修改
            $('#myModal1 .modal-body').html(markeModaltHtml);//销售信息修改
            $('#myModal2 .modal-body').html(coopModalHtml);//合作信息修改
            $('#myModal3 .modal-body').html(landModalHtml);//土地信息修改
            $('#myModal4 .modal-body').html(floorModalHtml);//详情信息修改
            //判断合作情况是否独家代理
            if(saIndex==2){
                $('#agentRow').show();
            }else{
                $('#agentRow').hide();
            }
            var propertyName=$('#PropertyName').val();
            //验证小区名称是否重复
            $('#PropertyName').change(function(){
                $.ajax({
                    url:initUrl+'isHavePropertyNameBySameCity_2.do',
                    type:'POST',
                    data:{
                        PropertyName:propertyName	,//是	string	楼盘名称
                        CityID:ctId,	//是	string	城市Id
                        Id:floorId
                    },
                    success:function(data){
                        if(data.data.flag==1){
                            alert('楼盘名称重复');
                        }else if(data.data.flag==0){
                            alert('楼盘名称不重复，可用');
                        }
                    }
                });
            });
            //目前销售类型下拉的选择
            $('#SalesMenu>li').on('click','a',function(e){
                e.preventDefault();
                if($(e.target).html()=='独家代理'){
                    $('#companyM,#timeM').show();
                    $('#agentRow').show();
                    $('#companyM>div').css('margin-right','49px');
                }else{
                    $('#companyM,#timeM').hide();
                    $('#agentRow').hide();
                }
            });
            //建筑类型多选
            //#buildingVal事件
            $('#buildingVal').click(function(){
                $('#BuildingType').show();
            });
            //甲方支持
            $('#supportVal').click(function(){
                $('#supportType').show();
            });
            //点击空白处建筑类型框隐藏
            $(document).click(function(e){
                var _con=$('#buildingVal,#BuildingType,#supportVal,#supportType');//设置目标区域
                if(!_con.is(e.target)&&_con.has(e.target).length===0){
                    $('#BuildingType,#supportType').hide(500);
                }
            });
            var buildingHtml='',indexArr=[],supportHtml='',sortArr=[];
            $('#BuildingType>li').on('click','a',function(e){
                e.preventDefault();
                $(e.target).parent().toggleClass('active');
                $('#buildingVal').css('left','0');
                var liIndex=$(e.target).attr('class');
                if($('#BuildingType>li').hasClass('active')&&
                    buildingArr.indexOf($(e.target).html())==-1&&
                    buildingHtml.indexOf($(e.target).html())==-1){
                    buildingArr.push($(e.target).html());
                    var $i=buildingArr.length-1;
                    buildingHtml+=`
              <a href="#"><span class="${liIndex}">${buildingArr[$i]}</span></a>
            `;
                    $('#buildingVal').html(buildingHtml);
                    indexArr.push(liIndex);
                }else{
                    var bdHtml='';
                    buildingArr.remove($(e.target).html());
                    indexArr.remove(liIndex);
                    $.each(buildingArr,function(i){
                        bdHtml+=`
              <a href="#"><span class="${indexArr[i]}">${buildingArr[i]}</span></a>
            `;
                    });
                    $('#buildingVal').html(bdHtml);
                    buildingHtml=bdHtml;
                }
                //console.log(indexArr.join(','));
                $('#buildingVal').css('border-color','#ccc');
                buildingTypeIndex =indexArr.join(',');
                //console.log(buildingTypeIndex);
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
              <a href="#"><span class="${liIndex}">${supportArr[$i]}</span></a>
            `;
                    $('#supportVal').html(supportHtml);
                    sortArr.push(liIndex);
                }else{
                    var bdHtml='';
                    supportArr.remove($(e.target).html());
                    sortArr.remove(liIndex);
                    $.each(supportArr,function(i){
                        bdHtml+=`
              <a href="#"><span  class="${sortArr[i]}">${supportArr[i]}</span></a>
            `;
                    });
                    $('#supportVal').html(bdHtml);
                    supportHtml=bdHtml;
                }
                //console.log(sortArr.join(','));
                $('#supportVal').css('border-color','#ccc');
                supportIndex=sortArr.join(',');
                console.log(supportIndex);
                if($('#supportVal').html()===''){
                    $('#supportVal').html('甲方支持（多选）').css('color','#BEBEBE');
                }
            });
        },
        error:function(){
            alert('服务器内部出错了')
        }
    });
}
floorDetail();
//修改模态框的关闭取消的点击事件
$('#myModal6,#myModal7,#myModal5,#myModal,#myModal1,#myModal2,#myModal3,#myModal4').on('click','.cancel',function(e){
    e.preventDefault();
    floorDetail();
});
//开发楼盘第一部分修改
//下拉点击切换.active
$('#MortgageMenu>li,#LimitsignMenu>li,#progressMenu>li,#loanMenu>li,#followMenu>li').on('click','a',function(e){
    e.preventDefault();
    $(e.target).parent().addClass('active').siblings().removeClass('active');
});
var developeVal,develope1Val,mortgageIndex,limitsignIndex,propertyName,propertyAddress,
    progressIndex,loanIndex,followTypeIndex,soldStateIndex;
$('#myModal5 .modal-footer').on('click','.modify',function(e){
    var self=floorDetail;
    var thisChange=change;
    followTypeIndex=$('#followMenu>li.active').index();//跟进状态
    soldStateIndex=$('#soldMenu>li.active').index()==-1?sSIndex:$('#soldMenu>li.active').index();//在售状态
    developeVal=$('#Develope').val();//开发商名字全称
    develope1Val=$('#Develope1').val();//开发商名字简称
    mortgageIndex=$('#MortgageMenu>li.active').index()==-1?mIndex:$('#MortgageMenu>li.active').index();//获取抵押情况下标
    limitsignIndex=$('#LimitsignMenu>li.active').index()==-1?isLimitIndex:$('#LimitsignMenu>li.active').index();//获取限签情况下标
    propertyName=$('#PropertyName').val();//获取小区名称
    propertyAddress=$('#PropertyAddress').val();//获取小区地址
    progressIndex=$('#progressMenu>li.active').index()+1==0?pIndex:$('#progressMenu>li.active').index()+1;//获取工程进度下标
    loanIndex=$('#loanMenu>li.active').index()==-1?lIndex:$('#loanMenu>li.active').index();//获取贷款下标
    //跟进状态修改不可逆
    if(followTypeIndex<fTypeIndex){
        followTypeIndex=fTypeIndex;
    }
    $.ajax({
        type:'POST',
        url:initUrl+'updateProperty_201.do',
        data:{
            "PropertyName":propertyName,//是	string	小区名称
            "FollowType":followTypeIndex,//否	string	0 待扫盘 2，扫盘中 3， 维护中 4，已提报 5，商务谈判 6，合同签订 7，无效盘(1.待扫盘- 系统自动添加的，未进行任何修改及跟进2.扫盘中- 用户自行添加的，或针对系统添加的进行修改或填写跟进的 3.维护中- 用户添加了关键人信息（参见维护规则） 4.已提报、商务谈判、合同签订、无效盘 - 根据用户自行修改维护状态判别)注：此流程不可逆
            "SoldState":soldStateIndex,//是	string	在售状态 0在建 1 待开盘 2在售 3滞销 4售罄
            "BuildingType":buildingTypeIndex,//是	string	建筑类型 0 公寓 1:别墅 5:商业 6:住宅 7其他
            "CityID":ctId,//是	string	城市id
            "BoroughID":brId,//是	string	区域id
            "PlateID":plId,//是	string	板块id
            "PropertyAddress":propertyAddress,//是	string	小区地址
            "PropertyDevelopers":developeVal,//是	string	小区开发商
            "Abbreviation":develope1Val,//否	string	开发商简称
            "Progress":progressIndex,//否	string	工程进度
            "IsMortgage":mortgageIndex,//否	string	抵押情况
            "IsLoan":loanIndex,//否	string	是否可以贷款
            "IsLimitsign":limitsignIndex,//否	string	可否限签
            "Id":floorId,//是	string	楼盘ID
            "AllMoney":aMoney,//是	string	总销金额
            "ProxySalestype":saIndex,//是	string	目前销售类型 1、接受代理，目前无代理 2、独家代理 3、自销 4、联合代理 5、只做案场 6、只做联动
            "Experience":basicExperience,//是	string	体验 1、不需要包装 2、部分包装 3、整体重新包装 4、烂尾楼
            "UpdateUserid":1//createUserid//是	string	更新人ID
        },
        success:function(data){
            //console.log(data);
            if(data.data.status=='success'){
                alert('修改成功');
                //验证变更
                if(isLimitIndex!=limitsignIndex){
                    tipHtml+=`可否限签由${isLimitsign(isLimitIndex)}变更为${isLimitsign(limitsignIndex)};`;
                }
                if(mIndex!=mortgageIndex){
                    tipHtml+=`抵押情况由${isMortgage(mIndex)}变更为${isMortgage(mortgageIndex)};`;
                }
                if(abbVal!=develope1Val){
                    tipHtml+=`小区开发商简称由${abbVal}变更为${develope1Val};`;
                }
                if(propertyDe!=developeVal){
                    tipHtml+=`小区开发商全称由${propertyDe}变更为${developeVal};`;
                }
                if(fTypeIndex!=followTypeIndex){
                    tipHtml+=`跟进状态由${followType(fTypeIndex)}变更为${followType(followTypeIndex)};`;
                }
                if(propertyN!=propertyName){
                    tipHtml+=`小区名称由${propertyN}变更为${propertyName};`;
                }
                if(sSIndex!=soldStateIndex){
                    tipHtml+=`在售状态由${soldState(sSIndex)}变更为${soldState(soldStateIndex)};`;
                }
                if(bTIndex!=buildingTypeIndex){
                    var bdHtml='';
                    $.each(buildingArr,function(i){
                        bdHtml+=buildingArr[i];
                    });
                    if(bdHtml!=''){
                        tipHtml+=`建筑类型由${build2Html}变更为${bdHtml};`;
                    }
                }
                if(propertyAdd!=propertyAddress){
                    tipHtml+=`项目地址由${propertyAdd}变更为${propertyAddress};`;
                }
                if(propertyAdd!=propertyAddress){
                    tipHtml+=`项目地址由${propertyAdd}变更为${propertyAddress};`;
                }
                if(pIndex!=progressIndex){
                    tipHtml+=`工程进度由${progress(pIndex)}变更为${progress(progressIndex)};`;
                }
                if(lIndex!=loanIndex){
                    tipHtml+=`是否可以贷款由${isLoan(lIndex)}变更为${isLoan(loanIndex)};`;
                }
                thisChange();
                self();
            }else{
                alert('修改失败');
            }
        },
        error:function(){
            alert('服务器内部出错了')
        }
    });
});
//体量修改
var dealMoney,salesHouse,salesArea,deTime,allMoney,allHouse,allArea,removalRate;
$('#myModal .modal-footer').on('click','.modify',function(e){
    var self=floorDetail;
    var thisChange=change;
    dealMoney=$('#DealMoney').val();//剩余总价
    salesHouse=$('#SalesHouse').val();//剩余套数
    salesArea=$('#SalesArea').val();//剩余面积
    deTime=$('#DeTime').val();//预计去化时间
    allMoney=$('#AllMoney').val();//总价
    allHouse=$('#AllHouse').val();//总套数
    allArea=$('#AllArea').val();//总面积
    removalRate=$('#RemovalRate').val();//当前去化速率
    $.ajax({
        url:initUrl+'updatePropertyTiLiang_202.do',
        type:'POST',
        data:{
            "AllMoney":allMoney,//否	string	总货值
            "AllHouse":allHouse,//否	string	总套数
            "AllArea":allArea,//否	string	总面积
            "DealMoney":dealMoney,//否	string	可售货值
            "SalesHouse":salesHouse,//否	string	可售套数
            "SalesArea":salesArea,//否	string	可售面积
            "FollowType":fTypeIndex,//否	string	0 待扫盘 2，扫盘中 3， 维护中 4，已提报 5，商务谈判 6，合同签订 7，无效盘(1.待扫盘- 系统自动添加的，未进行任何修改及跟进2.扫盘中- 用户自行添加的，或针对系统添加的进行修改或填写跟进的 3.维护中- 用户添加了关键人信息（参见维护规则） 4.已提报、商务谈判、合同签订、无效盘 - 根据用户自行修改维护状态判别)注：此流程不可逆
            "BuildingType":bTIndex,//是	string	建筑类型 0 公寓 1:别墅 5:商业 6:住宅 7其他
            "ProxySalestype":saIndex,//是	string	目前销售类型 1、接受代理，目前无代理 2、独家代理 3、自销 4、联合代理 5、只做案场 6、只做联动
            "Experience":basicExperience,//是	string	体验 1、不需要包装 2、部分包装 3、整体重新包装 4、烂尾楼
            "RemovalRate":removalRate,//否	string	去化率(当前去化率：（体量总价 - 剩余总价） ／（当前时间 年月 - 首次开盘时间 年月） = xxxx万元／月)
            "DeTime":deTime,//否	string	去化时间 (预计去化时间：剩余总价 ／ 当前去化率 = xxx 个月)
            "Id":floorId,//是	string	楼盘ID
            "UpdateUserid":createUserid//是	string	更新人ID
        },
        success:function(data){
            if(data.data.status=='success'){
                alert('修改成功');
                //验证变更
                if(dealM!=dealMoney){
                    tipHtml+=`剩余总价由${dealM}变更为${dealMoney};`;
                }
                if(salesH!=salesHouse){
                    tipHtml+=`剩余套数由${salesH}变更为${salesHouse};`;
                }
                if(salesA!=salesArea){
                    tipHtml+=`剩余面积由${salesA}变更为${salesArea};`;
                }
                if(allA!=allArea){
                    tipHtml+=`总面积由${allA}变更为${allArea};`;
                }
                if(aMoney!=allMoney){
                    tipHtml+=`总价由${aMoney}变更为${allMoney};`;
                }
                if(allHou!=allHouse){
                    tipHtml+=`总套数由${allHou}变更为${allHouse};`;
                }
                thisChange();
                self();
            }else{
                alert('修改失败');
            }
        },
        error:function(){
            alert('服务器内部出错了')
        }
    });
});
//销售信息
//下拉菜单点击切换.active
$('#experienceMenu>li').on('click','a',function(e){
    e.preventDefault();
    $(e.target).parent().addClass('active').siblings().removeClass('active');
});
var minPrice,maxPrice,minunderquote,maxunderquote,experienceIndex,saleValidityDate,
    minPriceRange,priceRange,minFilingprice,maxFilingprice,openDatetime,saleValidity;
$('#myModal1 .modal-footer').on('click','.modify',function(e){
    var self=floorDetail;
    var thisChange=change;
    minPrice=$('#MinPrice').val();//总价最小值
    maxPrice=$('#MaxPrice').val();//总价最大值
    minunderquote=$('#Minunderquote').val();//底价最小值
    maxunderquote=$('#Maxunderquote').val();//底价最大值
    experienceIndex=$('#experienceMenu>li.active').index()==-1?basicExperience:$('#experienceMenu>li.active').index();//获取体验情况下标
    saleValidityDate=$('#SaleValidityDate').val();//许可证有效期
    minPriceRange=$('#MinPriceRange').val();//单价最小值
    priceRange=$('#PriceRange').val();//单价最大值
    minFilingprice=$('#MinFilingprice').val();//备案价最小值
    maxFilingprice=$('#MaxFilingprice').val();//备案价最大值
    openDatetime=$('#OpenDatetime').val();//开盘时间
    saleValidity=$('#SaleValidity').val();//预售证
    $.ajax({
        url:initUrl+'updatePropertyXiaoShouXinXi_203.do',
        type:'POST',
        data:{
            "MinPriceRange":minPriceRange,//否	string	单价最小的价格
            "PriceRange":priceRange,//否	string	单价最大
            "MaxPrice":maxPrice,//否	string	房屋总价最大值
            "MinPrice":minPrice,//否	string	房屋总价最小值
            "MinFilingprice":minFilingprice,//否	string	最小的备案价
            "MaxFilingprice":maxFilingprice,//否	string	最大的备案价
            "Minunderquote":minunderquote,//否	string	最低的低价
            "Maxunderquote":maxunderquote,//否	string	最高的低价
            "SaleValidity":saleValidity,//否	string	预售证
            "SaleValidityDate":saleValidityDate,//否	string	许可证有效期
            "OpenDatetime":openDatetime,//否	string	开盘时间
            "Experience":experienceIndex,//否	string	体验 1、不需要包装 2、部分包装 3、整体重新包装 4、烂尾楼
            "FollowType":fTypeIndex,//否	string	0 待扫盘 2，扫盘中 3， 维护中 4，已提报 5，商务谈判 6，合同签订 7，无效盘(1.待扫盘- 系统自动添加的，未进行任何修改及跟进2.扫盘中- 用户自行添加的，或针对系统添加的进行修改或填写跟进的 3.维护中- 用户添加了关键人信息（参见维护规则） 4.已提报、商务谈判、合同签订、无效盘 - 根据用户自行修改维护状态判别)注：此流程不可逆
            "AllMoney":aMoney,//否	string	总货值
            "BuildingType":bTIndex,//是	string	建筑类型 0 公寓 1:别墅 5:商业 6:住宅 7其他
            "ProxySalestype":saIndex,//是	string	目前销售类型 1、接受代理，目前无代理 2、独家代理 3、自销 4、联合代理 5、只做案场 6、只做联动
            "RemovalRate":removalRate,//否	string	去化率(当前去化率：（体量总价 - 剩余总价） ／（当前时间 年月 - 首次开盘时间 年月） = xxxx万元／月)
            "DeTime":deTime,//否	string	去化时间 (预计去化时间：剩余总价 ／ 当前去化率 = xxx 个月)
            "Id":floorId,//是	string	楼盘ID
            "UpdateUserid":createUserid//是	string	更新人ID
        },
        success:function(data){
            if(data.data.status=='success'){
                alert('修改成功');
                //验证变更
                if(saleVali!=saleValidityDate){
                    tipHtml+=`许可证有效期由${saleVali}变更为${saleValidityDate};`;
                }
                if(basicExperience!=experienceIndex){
                    tipHtml+=`体验由${experience(basicExperience)}变更为${experience(experienceIndex)};`;
                }
                if(maxunder!=maxunderquote){
                    tipHtml+=`最高的低价由${maxunder}变更为${maxunderquote};`;
                }
                if(minunder!=minunderquote){
                    tipHtml+=`最低的低价由${minunder}变更为${minunderquote};`;
                }
                if(minPr!=minPrice){
                    tipHtml+=`房屋总价最小值由${minPr}变更为${minPrice};`;
                }
                if(maxPr!=maxPrice){
                    tipHtml+=`房屋总价最大值由${maxPr}变更为${maxPrice};`;
                }
                if(saleVa!=saleValidity){
                    tipHtml+=`预售许可证号由${saleVa}变更为${saleValidity};`;
                }
                if(opentime!=openDatetime){
                    tipHtml+=`开盘时间由${opentime}变更为${openDatetime};`;
                }
                if(maxFiling!=maxFilingprice){
                    tipHtml+=`最大的备案价由${maxFiling}变更为${maxFilingprice};`;
                }
                if(minFiling!=minFilingprice){
                    tipHtml+=`最小的备案价由${minFiling}变更为${minFilingprice};`;
                }
                if(priceRan!=priceRange){
                    tipHtml+=`最大单价由${priceRan}变更为${priceRange};`;
                }
                if(minPrR!=minPriceRange){
                    tipHtml+=`最小单价由${minPrR}变更为${minPriceRange};`;
                }
                thisChange();
                self();
            }else{
                alert('修改失败');
            }
        },
        error:function(){
            alert('服务器内部出错了')
        }
    });
});
//合作情况
//下拉菜单点击切换.active
$('#FollowUpMenu>li,#GroupMenu>li,#SupportMenu>li,#CommissionMenu>li,#BondMenu>li,#UrgencyMenu>li,#SalesMenu>li,#acceptMenu>li').on('click','a',function(e){
    e.preventDefault();
    $(e.target).parent().addClass('active').siblings().removeClass('active');
});
var agentTimeBegin,agentTimeEnd,commissionIndex,bondIndex,urgencyIndex,salesIndex,
    agentName,acceptIndex,groupIndex,followIndex;
$('#myModal2 .modal-footer').on('click','.modify',function(e){
    var self=floorDetail;
    var thisChange=change;
    agentTimeBegin=$('#AgentTimeBegin').val();//代理时间段开始
    agentTimeEnd=$('#AgentTimeEnd').val();//代理时间段结束
    commissionIndex=$('#CommissionMenu>li.active').index()+1==0?cIndex:$('#CommissionMenu>li.active').index()+1;//佣金方式下标
    bondIndex=$('#BondMenu>li.active').index()==-1?bIndex:$('#BondMenu>li.active').index();//保证金下标
    urgencyIndex=$('#UrgencyMenu>li.active').index()+1==0?urIndex:$('#UrgencyMenu>li.active').index()+1;//紧急程度下标
    salesIndex=$('#SalesMenu>li.active').index()+1==0?saIndex:$('#SalesMenu>li.active').index()+1;//目前销售类型下标
    agentName=$('#AgentName').val();//代理公司名
    acceptIndex=$('#acceptMenu>li.active').index()+1==0?acIndex:$('#acceptMenu>li.active').index()+1;//可接受销售类型
    supportIndex=$('#SupportMenu>li.active').index()+1==0?suIndex:$('#SupportMenu>li.active').index()+1;//甲方支持
    groupIndex=$('#GroupMenu>li.active').index()+1==0?grIndex:$('#GroupMenu>li.active').index()+1;//团购情况
    followIndex=$('#FollowUpMenu>li.active').index()+1==0?foIndex:$('#FollowUpMenu>li.active').index()+1;//后续效应
    $.ajax({
        url:initUrl+'updatePropertyHeZuoQingKuang_204.do',
        type:'POST',
        data:{
            "ProxySalestype":salesIndex,//否	string	目前销售类型 1、接受代理，目前无代理 2、独家代理 3、自销 4、联合代理 5、只做案场 6、只做联动
            "AgentTimeBegin":agentTimeBegin,//否	string	代理时间段(开始)
            "AgentTimeEnd":agentTimeEnd,//否	string	代理时间段(结束)
            "AcceptSalestype":acceptIndex,//否	string	可接受销售类型 1、接受代理，目前无代理 2、独家代理 3、自销 4、联合代理 5、只做案场 6、只做联动
            "DeveloperSupport":supportIndex,//否	string	甲方支持 1、班车 2、样板房 3、物料 4、盒饭
            "GroupSituation":groupIndex,//否	string	团购情况 1、甲方收 2、代理收
            "FollowUp":followIndex,//否	string	后续效应 1、后续合作机会 2、提高知名
            "AgentName":agentName,//否	string	代理公司名
            "CommissionMethod":commissionIndex,//否	string	佣金方式 1、固定 2、跳点 3、包销
            "Bond":bondIndex,//否	string	保证金 1、0-50万 2、50-100万 3、100-200万 4、200-300万 5、500万以上
            "Urgency":urgencyIndex,//否	string	紧急程度 1、不紧急 2、一般 3、需要马上进场
            "FollowType":fTypeIndex,//否	string	0 待扫盘 2，扫盘中 3， 维护中 4，已提报 5，商务谈判 6，合同签订 7，无效盘(1.待扫盘- 系统自动添加的，未进行任何修改及跟进2.扫盘中- 用户自行添加的，或针对系统添加的进行修改或填写跟进的 3.维护中- 用户添加了关键人信息（参见维护规则） 4.已提报、商务谈判、合同签订、无效盘 - 根据用户自行修改维护状态判别)注：此流程不可逆
            "AllMoney":aMoney,//否	string	总货值
            "BuildingType":bTIndex,//是	string	建筑类型 0 公寓 1:别墅 5:商业 6:住宅 7其他
            "Experience":basicExperience,//否	string	体验 1、不需要包装 2、部分包装 3、整体重新包装 4、烂尾楼
            "Id":floorId,//是	string	楼盘ID
            "UpdateUserid":createUserid//是	string	更新人ID
        },
        success:function(data){
            if(data.data.status=='success'){
                alert('修改成功');
                //验证变更
                if(urIndex!=urgencyIndex){
                    tipHtml+=`紧急程度由${urgency(urIndex)}变更为${urgency(urgencyIndex)};`;
                }
                if(bIndex!=bondIndex){
                    tipHtml+=`保证金由${bond(bIndex)}变更为${bond(bondIndex)};`;
                }
                if(cIndex!=commissionIndex){
                    tipHtml+=`佣金方式由${commission(cIndex)}变更为${commission(commissionIndex)};`;
                }
                if(foIndex!=followIndex){
                    tipHtml+=`后续效应由${followUp(foIndex)}变更为${followUp(followIndex)};`;
                }
                if(grIndex!=groupIndex){
                    tipHtml+=`团购情况由${group(grIndex)}变更为${group(groupIndex)};`;
                }
                if(suIndex!=supportIndex){
                    var spHtml='';
                    $.each(supportArr,function(i){
                        spHtml+=supportArr[i];
                    });
                    if(spHtml!=''){
                        tipHtml+=`甲方支持由${support2Html}变更为${spHtml};`;
                    }
                }
                if(acIndex!=acceptIndex){
                    tipHtml+=`可接受销售类型由${salesType(acIndex)}变更为${salesType(acceptIndex)};`;
                }
                if(saIndex!=salesIndex){
                    tipHtml+=`目前销售类型由${salesType(saIndex)}变更为${salesType(salesIndex)};`;
                }
                thisChange();
                self();
            }else{
                alert('修改失败');
            }
        },
        error:function(){
            alert('服务器内部出错了')
        }
    });
});
//土地情况
//下拉菜单点击切换.active
$('#LandTypeStart>li').on('click','a',function(e){
    e.preventDefault();
    $(e.target).parent().addClass('active').siblings().removeClass('active');
});
var buildingArea,competitivePrice,floorPrice,propertyRightyears,competitiveDate,
    startingPrice,plotRatioStart,landTypeStart;
$('#myModal3 .modal-footer').on('click','.modify',function(e){
    var self=floorDetail;
    var thisChange=change;
    buildingArea=$('#BuildingArea').val();//建筑用地面积
    competitivePrice=$('#CompetitivePrice').val();//竞得价
    floorPrice=$('#FloorPrice').val();//楼面价
    propertyRightyears=$('#PropertyRightyears').val();//产权年限
    competitiveDate=$('#CompetitiveDate').val();//竞得日期
    startingPrice=$('#StartingPrice').val();//起始价
    plotRatioStart=$('#PlotRatioStart').val();//容积率
    landTypeStart=$('#LandTypeStart>li.active').index()==-1?lTypeStart:$('#LandTypeStart>li.active').index();//用地性质下标
    $.ajax({
        type:'POST',
        url:initUrl+'updatePropertyTuDiQingKuang_205.do',
        data:{
            "CompetitiveDate":competitiveDate,//否	string	竞得日期
            "StartingPrice":startingPrice,//否	string	起始价
            "PlotRatioStart":plotRatioStart,//否	string	容积率(土地)
            "LandTypeStart":landTypeStart,//否	string	用地性质 1、住宅 2、商业／办公 3、工业 4、其他
            "BuildingArea":buildingArea,//否	string	建筑用地面积
            "CompetitivePrice":competitivePrice,//否	string	竞得价
            "FloorPrice":floorPrice,//否	string	楼面价
            "PropertyRightyears":propertyRightyears,//否	string	产权年限
            "FollowType":fTypeIndex,//否	string	0 待扫盘 2，扫盘中 3， 维护中 4，已提报 5，商务谈判 6，合同签订 7，无效盘(1.待扫盘- 系统自动添加的，未进行任何修改及跟进2.扫盘中- 用户自行添加的，或针对系统添加的进行修改或填写跟进的 3.维护中- 用户添加了关键人信息（参见维护规则） 4.已提报、商务谈判、合同签订、无效盘 - 根据用户自行修改维护状态判别)注：此流程不可逆
            "Id":floorId,//是	string	楼盘ID
            "UpdateUserid":createUserid//是	string	更新人ID
        },
        success:function(data){
            if(data.data.status=='success'){
                alert('修改成功');
                //变更
                if(propertyRight!=propertyRightyears){
                    tipHtml+=`产权年限由${propertyRight}变更为${propertyRightyears};`;
                }
                if(floorPr!=floorPrice){
                    tipHtml+=`楼面价由${floorPr}变更为${floorPrice};`;
                }
                if(competitivePr!=competitivePrice){
                    tipHtml+=`竞得价由${competitivePr}变更为${competitivePrice};`;
                }
                if(buildingAr!=buildingArea){
                    tipHtml+=`建筑用地面积由${buildingAr}变更为${buildingArea};`;
                }
                if(plotRa!=plotRatioStart){
                    tipHtml+=`容积率(土地)由${plotRa}变更为${plotRatioStart};`;
                }
                if(startingPr!=startingPrice){
                    tipHtml+=`起始价由${startingPr}变更为${startingPrice};`;
                }
                if(lTypeStart!=landTypeStart){
                    tipHtml+=`用地性质由${landType(lTypeStart)}变更为${landType(landTypeStart)};`;
                }
                if(competitive!=competitiveDate){
                    tipHtml+=`竞得日期由${competitive}变更为${competitiveDate};`;
                }
                thisChange();
                self();
            }else{
                alert('修改失败');
            }
        },
        error:function(){
            alert('服务器内部出错了')
        }
    });
});
//楼盘详情修改
//下拉菜单点击切换.active
$('#Decorate>li,#PropertyType>li').on('click','a',function(e){
    e.preventDefault();
    $(e.target).parent().addClass('active').siblings().removeClass('active');
});
var completionTime,checkRoom,afforestationRate,propertyManagement,decorate,completeSet,
    constructionArea,propertyCompany,propertyType,plotRatio,planningHouse,parkingSpace,
    storiedBuilding,coversArea,businessCircle;
$('#myModal4 .modal-footer').on('click','.modify',function(e){
    var self=floorDetail;
    var thisChange=change;
    completionTime=$('#CompletionTime').val();//竣工时间
    checkRoom=$('#CheckRoom').val();//最早交房
    afforestationRate=$('#AfforestationRate').val();//绿化率
    propertyManagement=$('#PropertyManagement').val();//物业费
    decorate=$('#Decorate>li.active').index()+1==0?decorateIndex:$('#Decorate>li.active').index()+1;//装修情况下标
    completeSet=$('#CompleteSet').val();//配套设施
    constructionArea=$('#ConstructionArea').val();//建筑面积
    propertyCompany=$('#PropertyCompany').val();//物业公司
    propertyType=$('#PropertyType>li.active').index()+1==0?prType:$('#PropertyType>li.active').index()+1;//物业类型
    plotRatio=$('#PlotRatio').val();//容积率
    planningHouse=$('#PlanningHouse').val();//规划户数
    parkingSpace=$('#ParkingSpace').val();//车位数
    storiedBuilding=$('#StoriedBuilding').val();//楼栋总数
    coversArea=$('#CoversArea').val();//占地面积
    businessCircle=$('#BusinessCircle').val();//周边商圈
    $.ajax({
        url:initUrl+'updatePropertyLouPanXiangQing_206.do',
        type:'POST',
        data:{
            "Id":floorId,//是	string	楼盘ID
            "PropertyCompany":propertyCompany,//否	string	物业公司
            "PropertyType":propertyType,//否	string	物业类型 1 住宅 2公寓 3商铺
            "PlotRatio":plotRatio,//否	string	容积率
            "PlanningHouse":planningHouse,//否	string	规划户数
            "ParkingSpace":parkingSpace,//否	string	车位数
            "StoriedBuilding":storiedBuilding,//否	string	楼栋总数
            "CoversArea":coversArea,//否	string	占地面积
            "BusinessCircle":businessCircle,//否	string	周边商圈
            "CompletionTime":completionTime,//否	string	竣工时间
            "CheckRoom":checkRoom,//否	string	最早交房
            "AfforestationRate":afforestationRate,//否	string	绿化率
            "PropertyManagement":propertyManagement,//否	string	物业费用
            "Decorate":decorate,//否	string	1 毛坯 2精装修 3简装修
            "CompleteSet":completeSet,//否	string	配套设施
            "ConstructionArea":constructionArea,//否	string	建筑面积
            "FollowType":fTypeIndex,//否	string	0 待扫盘 2，扫盘中 3， 维护中 4，已提报 5，商务谈判 6，合同签订 7，无效盘(1.待扫盘- 系统自动添加的，未进行任何修改及跟进2.扫盘中- 用户自行添加的，或针对系统添加的进行修改或填写跟进的 3.维护中- 用户添加了关键人信息（参见维护规则） 4.已提报、商务谈判、合同签订、无效盘 - 根据用户自行修改维护状态判别)注：此流程不可逆
            "UpdateUserid":createUserid//是	string	更新人ID
        },
        success:function(data){
            if(data.data.status=='success'){
                alert('修改成功');
                //变更
                if(constructionA!=constructionArea){
                    tipHtml+=`建筑面积由${constructionA}变更为${constructionArea};`;
                }
                if(completeVal!=completeSet){
                    tipHtml+=`配套设施由${completeVal}变更为${completeSet};`;
                }
                if(decorateIndex!=decorate){
                    tipHtml+=`装修情况由${decorate0(decorateIndex)}变更为${decorate0(decorate)};`;
                }
                if(propertyManage!=propertyManagement){
                    tipHtml+=`物业费用由${propertyManage}变更为${propertyManagement};`;
                }
                if(afforestation!=afforestationRate){
                    tipHtml+=`绿化率由${afforestation}变更为${afforestationRate};`;
                }
                if(checkRo!=checkRoom){
                    tipHtml+=`最早交房由${checkRo}变更为${checkRoom};`;
                }
                if(completionT!=completionTime){
                    tipHtml+=`竣工时间由${completionT}变更为${completionTime};`;
                }
                if(businessCir!=businessCircle){
                    tipHtml+=`周边商圈由${businessCir}变更为${businessCircle};`;
                }
                if(coversA!=coversArea){
                    tipHtml+=`占地面积由${coversA}变更为${coversArea};`;
                }
                if(storiedBu!=storiedBuilding){
                    tipHtml+=`楼栋总数由${storiedBu}变更为${storiedBuilding};`;
                }
                if(parking!=parkingSpace){
                    tipHtml+=`车位数由${parking}变更为${parkingSpace};`;
                }
                if(planning!=planningHouse){
                    tipHtml+=`规划户数由${planning}变更为${planningHouse};`;
                }
                if(plotRat!=plotRatio){
                    tipHtml+=`容积率由${plotRat}变更为${plotRatio};`;
                }
                if(prType!=propertyType){
                    tipHtml+=`物业类型由${propertyType0(prType)}变更为${propertyType0(propertyType)};`;
                }
                if(propertyC!=propertyCompany){
                    tipHtml+=`物业公司由${propertyC}变更为${propertyCompany};`;
                }
                thisChange();
                self();
            }else{
                alert('修改失败');
            }
        },
        error:function(){
            alert('服务器内部出错了')
        }
    });
});
//
var pageNum=1,
    maxPage=20,//每页数量
    pageSize1,//最大页码数
    userTypes='',
    FollowTypes='',
    fileUrl,//文件路径
    fileName;//文件名
//动态生成页码，实现翻页功能
function page(){
    $.ajax({
        type:'POST',
        url:initUrl+'propertyDetailsPropertyLog_2.do',
        data:{
            Id:floorId,//是	string	楼盘ID
            PageNum:pageNum,//是	string	页码
            PageSize:maxPage,//是	string	页面数量
            UserType:userTypes,//是	string	1为微信 2为来电 3为面谈 4为其他
            FollowType:FollowTypes//是	string	1 销售员 2 销售经理 3营销总 4项目总经理 5股东 6董事长 7其他
        },
        success:function(data){
            if(data==''){
                return;
            }
            //console.log(data);
            var follow=data.data.propertyDetailsPropertyLog_2;
            var followHtml='';
            if(!follow){
                return;
            }
            $.each(follow,function(i){
                var mainLogs=follow[i].Maintainlog;//跟进记录内容
                var mainArr=mainLogs.split('#');
                var tipArr=mainArr[0].split(';');
                var biangeng='';//变更html
                tipArr.splice(-1);
                if(!mainArr[1]){
                    mainArr[1]='';
                }
                //console.log(mainArr[1]);
                if(tipArr[0]!=''){
                    $.each(tipArr,function(i){
                        biangeng+=`
                          <div>${i+1}、${tipArr[i]}</div>
                        `;
                        //console.log(tipArr[i]);
                    });
                }else{
                    biangeng='';
                }
                //跟进形式
                function userType(t){
                    switch (t){
                        case 1:
                            return t = "微信";
                            break;
                        case 2:
                            return t = "来电";
                            break;
                        case 3:
                            return t = "面谈";
                            break;
                        case 4:
                            return t = "其他";
                            break;
                        default:
                            return t = "其他";
                            break;
                    }
                }
                //跟进阶段
                function intentionType(t){
                    switch (t){
                        case 1:
                            return t = "了解基本情况";
                            break;
                        case 2:
                            return t = "关系维护";
                            break;
                        case 3:
                            return t = "准备提报";
                            break;
                        case 4:
                            return t = "已提报";
                            break;
                        case 5:
                            return t = "商务谈判";
                            break;
                        case 6:
                            return t = "合同签订";
                            break;
                        case 7:
                            return t = "无效盘";
                            break;
                        default:
                            return t = "其他";
                            break;
                    }
                }
                //跟进对象
                function followType(t){
                    switch (t){
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
                        case 7:
                            return t = "其他";
                            break;
                        default:
                            return t = "其他";
                            break;
                    }
                }
                if(parseFloat(follow[i].IntentionType)==4&&follow[i].FileUrl){
                    followHtml+=`
                    <div>
                        <div class="grid-demo">
                            <div class="gt down-load clear">
                                <a href="http://oitvtdaml.bkt.clouddn.com/${follow[i].FileUrl}" class="gt">下载</a>
                                <p class="file"><a href="http://oitvtdaml.bkt.clouddn.com/${follow[i].FileUrl}"><img src="./res/file.png" alt=""/>${follow[i].FileName}</a></p>
                            </div>
                            <div class="sui-row">
                                <div class="span2"><h1>${userName}</h1></div>
                                <div class="span1 btn"><a href="#">${userType(parseFloat(follow[i].UserType))}</a></div>
                                <div class="span2 btn basic"><a href="#">${intentionType(parseFloat(follow[i].IntentionType))}</a></div>
                                <div class="span2 btn"><a href="#">${followType(parseFloat(follow[i].FollowType))}</a></div>
                            </div>
                            <!--<div class="gt picture">-->
                                <!--<p><img src="./res/picture.png" alt=""/>dashboard_achievements.png</p>-->
                            <!--</div>-->
                            <div class="sui-row tips">
                                 ${biangeng}
                            </div>
                            <!--时间-->
                            <div class="time gt"><img src="./res/time.png" alt=""/>${follow[i].Createtime}</div>
                            <div class="sui-row">
                                <div class="span5">${mainArr[1]}</div>
                            </div>
                        </div>
                    </div>
                `;
                }else{
                    followHtml+=`
                    <div>
                        <div class="grid-demo">
                            <div class="sui-row">
                                <div class="span2"><h1>张三</h1></div>
                                <div class="span1 btn"><a href="#">${userType(parseFloat(follow[i].UserType))}</a></div>
                                <div class="span2 btn basic"><a href="#">${intentionType(parseFloat(follow[i].IntentionType))}</a></div>
                                <div class="span2 btn"><a href="#">${followType(parseFloat(follow[i].FollowType))}</a></div>
                            </div>
                            <!--<div class="gt picture">-->
                                <!--<p><img src="./res/picture.png" alt=""/>dashboard_achievements.png</p>-->
                            <!--</div>-->
                            <div class="sui-row tips">
                                 ${biangeng}
                            </div>
                            <!--时间-->
                            <div class="time gt"><img src="./res/time.png" alt=""/>${follow[i].Createtime}</div>
                            <div class="sui-row">
                                <div class="span5">${mainArr[1]}</div>
                            </div>
                        </div>
                    </div>
                `;
                }
            });
            $('#show').html(followHtml);
            //page页码
            var pageHtml='',moreHtml='',styleHtml='';
            pageSize1=Math.ceil(data.data.Size/20);//获取页码最大值
            //循环拼接字符串，生成翻页功能
            if(!pageSize1){
                pageSize1=1;
            }
            if(pageSize1<7){
                for(var i=1;i<=pageSize1;i++){
                    pageHtml+=`
                          <li><a href="#" class="${i}">${i}</a></li>
                        `;
                }
                $('#pageNum').html(pageHtml);
            }else{
                styleHtml+=`
                  <li><a href="#" class="1">1</a></li>
                  <li><a href="#" class="2">2</a></li>
                  <li><a href="#" class="3">3</a></li>
                  <li><a href="#" class="4">4</a></li>
                  <li class="more"><a href="#">...</a></li>
                  <li><a href="#" class="${pageSize1}">${pageSize1}</a></li>
                `;
                $('#pageNum').html(styleHtml);
                for(var j=5;j<pageSize1;j++){
                    moreHtml+=`
                          <li><a href="#" class="${j}">${j}</a></li>
                        `;
                }
                $('#pageNum>li.more').on('click','a',function(e){
                    e.preventDefault();
                    $(e.target).parent().after(moreHtml);//显示所有页码
                    $(e.target).parent().css('display','none');//...隐藏
                    $('#pageNum>li:nth-child(1)').addClass('active').siblings().removeClass('active');//第四页加.active
                });
            }
            $('#pageNum>li>a.'+pageNum).parent().addClass('active');
            //判断当前页码，决定.more的显示隐藏
            if(pageNum>4){
                $('#pageNum>li.more').hide().after(moreHtml);
                $('#pageNum>li>a.'+pageNum).parent().addClass('active');
            }
        },
        error:function(){
            alert('服务器内部出错了')
        }
    });
}
page();
//跟进形式点击筛选
$('#followTypes1>li').on('click','a',function(e){
    e.preventDefault();
    userTypes=$(e.target).parent().index()+1;
    if(userTypes==5){
        userTypes='';
    }
    page();
});
//跟进对象点击筛选
$('#FollowType1>li').on('click','a',function(e){
    e.preventDefault();
    FollowTypes=$(e.target).parent().index()+1;
    if(FollowTypes==8){
        FollowTypes='';
    }
    page();
});
//页码数的点击事件
$('#pageNum').on('click','li:not(.more)>a',function(e){
    e.preventDefault();
    $(e.target).parent().addClass('active').siblings().removeClass('active');
    pageNum=$(e.target).html();//获取当前页码
    if(pageNum==1){
        $('#pages>ul>li.prev').addClass('disabled').siblings().removeClass('disabled');
    }else{
        $('#pages>ul>li.prev').removeClass('disabled');
    }
    if(pageNum==pageSize1){
        $('#pages>ul>li.next').addClass('disabled').siblings().removeClass('disabled');
    }else{
        $('#pages>ul>li.next').removeClass('disabled');
    }
    page();
});
//向前翻页按钮的点击事件
$('#pages>ul>li.next').on('click','a',function(e){
    e.preventDefault();
    var moreHtml='';
    pageNum++;
    $('#pageNum>li.active').removeClass('active').next().addClass('active');//为下一页加.active
    $('#pages>ul>li.prev').removeClass('disabled');
    for(var j=5;j<pageSize1;j++){
        moreHtml+=`
                          <li><a href="#" class="${j}">${j}</a></li>
                        `;
    }
    if(pageNum==5){
        $('#pageNum>li.more').hide().after(moreHtml);//显示所有页码;
        $('#pageNum>li.active').removeClass('active').next().addClass('active');//为下一页加.active
    }
    if(pageNum>=pageSize1){
        pageNum=pageSize1;
        $('#pages>ul>li.next').addClass('disabled');
    }
    page();
});
//向后翻页的点击事件
$('#pages>ul>li.prev').on('click','a',function(e){
    e.preventDefault();
    pageNum--;
    $('#pageNum>li.active').removeClass('active').prev().addClass('active');//为下一页加.active
    $('#pages>ul>li.next').removeClass('disabled');
    if(pageNum==4){
        $('#pageNum>li.active').removeClass('active').prev().addClass('active');
    }
    if(pageNum<=1){
        pageNum=1;
        $('#pages>ul>li.prev').addClass('disabled');
    }
    page();
});
//跟进记录
//添加跟进记录中下拉菜单点击切换.active
//判断是否已提报，显示或隐藏上传附件按钮
$('#stateMenu>li').on('click','a',function(e){
    var stateVal=$(e.target).html();
    if(stateVal=='已提报'){
        $('#records>p>a.load').css('display','inline-block');
    }else{
        $('#records>p>a.load').css('display','none');
        $('#btn-file').css('display','none');
    }
});
//上传附件按钮的点击事件，实现文件选择
$('#records>p').on('click','a.load',function(e){
    e.preventDefault();
    $('#btn-file').click().show();
});
//文件上传
$('#btn-file').change(function(e){
    if($(e.target).val()==''){
        alert('文件不能为空');
    }
    var files=$(e.target).prop('files');//获取文件列表
    var formData = new FormData();
    $.each(files, function(i) {
        if (files[i].size > 5 * 1024 * 1024) {
            alert("单个文件大小不可超过5M");
            return;
        }
        formData.append('files', files[i]);
    });
    $.ajax({
        url: 'http://www.ehaofangwang.com/publicshow/qiniuUtil/fileToQiniu',
        type: 'POST',
        data: formData,
        contentType: false, // 注意这里应设为false
        processData: false,
        cache: false,
        success: function(data) {
            fileUrl=data.pathUrls;//文件路径
            fileName=data.fileNames;//文件名
            if(data.statas=='true'){
                alert(data.message);
            }else if(data.statas=='false'){
                alert(data.message);
            }
        },
        error: function (jqXHR) {
            console.log(JSON.stringify(jqXHR));
        }
    })
});
//新增项目联系人
//项目联系人下拉列表点击切换.active
$('#positionsMenu>li').on('click','a',function(e){
    e.preventDefault();
    $(e.target).parent().addClass('active').siblings().removeClass('active');
});
$('#myModal6 .modal-footer').on('click','.modify',function(e){
    var self=floorDetail;
    var jobIndex=$('#positionsMenu>li.active').index()+1;//职位
    var contactVal=$('#contactPerson').val();//姓名
    var phoneVal=$('#phone').val();//电话
    var vali=0;
    if($('#posit>a>span').html()=='请选择'){
        vali+=1;
        $('#posit').css('border-color','#f00');
    }
    if(contactVal===''){
        vali+=1;
        $('#contactPerson').css('border-color','#f00');
    }
    if(phoneVal===''){
        vali+=1;
        $('#phone').css('border-color','#f00');
    }
    if(vali>0){
        alert('新增联系人失败，请检查必填项');
    }else{
        $.ajax({
            url:initUrl+'addD_ProjectContact_2.do',
            data:{
                Job:jobIndex,//是	string	职位 1、销售员 2、销售经理 3、营销总 4、项目总经理 5、股东6、董事长 7、其他
                LinkName:contactVal,//是	string	联系人
                LinkPhone:phoneVal,//是	string	联系电话
                CreateUserid:1,//createUserid,//是	string	创建人ID
                PropertyID:floorId,//是	string	楼盘ID
                FollowType:followTypeIndex,//是	string	0 待扫盘 2，扫盘中 3， 维护中 4，已提报 5，商务谈判 6，合同签订
                // 7，无效盘(1.待扫盘- 系统自动添加的，未进行任何修改及跟进2.扫盘中- 用户自行添加的，或针对系统添加的进行修改或填写跟进的 3.维护中- 用户添加了关键人信息（参见维护规则）
                // 4.已提报、商务谈判、合同签订、无效盘 - 根据用户自行修改维护状态判别)注：此流程不可逆
                PermissionCode:1//createUserid	//是	string
            },
            type:'POST',
            success:function(data){
                if(data.data.status=='success'){
                    alert(data.data.data);
                    self();
                    $('#posit>a>span').html('请选择');
                    $('#contactPerson').val('');
                    $('#phone').val('');
                    $('#whr').html(userName);
                }else{
                    alert('没有新增成功！');
                }
            },
            error:function(){
                alert('服务器内部出错了')
            }
        });
    }
});
//设置维护人
//维护人筛选
var whrName,//维护人名字
    mainID;//维护人id
var depCode,deFlag;
//定义获取登录人层级的函数
function level(departID,departCode){
    $.ajax({
        url:initUrl+'chaZiBuMen_2.do',
        type:'POST',
        data:{
            DepartmentID:departID,//部门ID
            DepartMentCode:departCode//子部门标识
        },
        success:function(data){
            var departHtml='';
            var departData=data.data.chaZiBuMen_2;
            var perFlag=data.data.flag;// 组织往下有部门为1，没有了为空则为0
            if(!departData){
                return;
            }
            if(perFlag==0){
                $.ajax({
                    url:initUrl+'buMenChaRenYuan_2.do',
                    type:'POST',
                    data:{
                        DepartmentID:mainID
                    },
                    success:function(data){
                        departData=data.data.buMenChaRenYuan_2;
                        $.each(departData,function(i){
                        departHtml+=`
                         <li role="presentation"><a id="${departData[i].Userid}">${departData[i].FullName}</a></li>
                                `;
                         });
                         $('#weihuMenu').html(departHtml);
                    },
                    error:function(){
                        alert('服务器出错了');
                    }
                });
            }
            $.each(departData,function(i){
                departHtml+=`
                  <li role="presentation"><a id="${departData[i].ID}" class="${departData[i].DepartMentCode}"
                  style="${perFlag}">${departData[i].DepartName}</a></li>
                                `;
            });
            $('#weihuMenu').html(departHtml);
        },
        error:function(){
            alert('服务器出错了');
        }
    });
}
//维护人组别点击事件
$('#weihuMenu').on('click','li>a',function(e){
    e.preventDefault();
    whrName=$(e.target).html();//维护人名字
    mainID=$(e.target).attr('id');//主营人员id
    depCode=$(e.target).attr('class');
    deFlag=$(e.target).attr('style');
    if(depCode=='businessUnit'&&deFlag==1){
        depCode='samllUnit';
    }else if(depCode=='samllUnit'&&deFlag==1){
        depCode='developmentservice';
    }else if(depCode=='developmentservice'&&deFlag==1){
        depCode='developmentgroup';
    }else if(depCode=='developmentgroup'&&deFlag==1){
        depCode='developmentteam';
    }else{
        return;
    }
    level(mainID,depCode);
});
$('#contacts div.look1>a').click(function(){
    level(1,'businessUnit');
    //level(permissionID,departCode);
});
//维护人修改按钮的点击事件
$('#myModal7 .modal-footer').on('click','.modify',function(e){
    var self=floorDetail;
    $.ajax({
        url:initUrl+'sheZhiWeiHuRen_2.do',
        type:'POST',
        data:{
            "CreateUserid":createUserid,//是	string	创建人
            "PropertyID":floorId,//是	string	楼盘ID
            "FollowType":3,//是	string	0 待扫盘 2，扫盘中 3， 维护中 4，已提报 5，商务谈判 6，合同签订 7，无效盘(1.待扫盘- 系统自动添加的，未进行任何修改及跟进2.扫盘中- 用户自行添加的，或针对系统添加的进行修改或填写跟进的 3.维护中- 用户添加了关键人信息（参见维护规则） 4.已提报、商务谈判、合同签订、无效盘 - 根据用户自行修改维护状态判别)注：此流程不可逆
            "PermissionCode":mainID//是	string	PermissionCode字段 规则 （XXXXXXXXXXXXXXX） 1到4位为 事业部 5-8为组 9-15为人员的ID
        },
        success:function(data){
            if(data.data.status=='success'){
                alert('设置成功！');
                //验证变更
                if(weiHuR!=whrName){
                    tipHtml+=`维护人由${weiHuR}变更为${whrName};`;
                }
                self();
                fTypeIndex=3;
            }else{
                alert('设置失败');
            }
        },
        error:function(){
            alert('服务器内部出错了')
        }
    });
});
//提交按钮的点击事件
$('#records>p.btn').on('click','a:last-child',function(e){
    e.preventDefault();
    var selfPage=page;
    //跟进形式
    var followTypesIndex=$('#followTypes>li.active').index();
    //跟进对象
    var followObjectIndex=$('#followObject>li.active').index();
    var followTextVal=$('#Maintainlog').val();//跟进内容
    //跟进阶段
    var stateIndex=$('#stateMenu>li.active').index();//获取项目跟进阶段选取下标值
    $.ajax({
        url:initUrl+'addPropertyLog_2.do',
        data:{
            PropertyID:floorId,//是	string	开发楼盘ID
            Userid:createUserid,//是	string	创建人ID
            Maintainlog:tipHtml+'#'+followTextVal,//是	string	跟进记录内容
            UserType:followTypesIndex,//是	string	1为微信 2为来电 3为面谈 4为其他
            IntentionType:stateIndex,//是	string	1，了解基本情况 2，关系维护 3，准备提报 4，已提报 5，商务谈判 6，合同签订 7，无效盘 8
            FollowType:followObjectIndex,//是	string	1 销售员 2 销售经理 3营销总 4项目总经理 5股东 6董事长 7其他
            FileUrl:fileUrl,//是	string	文件URL
            FileName:fileName,//是	string	文件名称
            FollowType_1:fTypeIndex//否	string	0 待扫盘 2，扫盘中 3， 维护中 4，已提报 5，商务谈判 6，合同签订 7，无效盘(1.待扫盘- 系统自动添加的，未进行任何修改及跟进2.扫盘中- 用户自行添加的，或针对系统添加的进行修改或填写跟进的 3.维护中- 用户添加了关键人信息（参见维护规则） 4.已提报、商务谈判、合同签订、无效盘 - 根据用户自行修改维护状态判别)注：此流程不可逆
        },
        type:'POST',
        success:function(data){
            //console.log(data);
            if(data.status=='success'){
                alert('跟进记录提交成功');
                selfPage();
                $('#follow span.state,#follow span.follow,#follow span.job').html('请选择').css('color','#BEBEBE');
                $('#Maintainlog').val('');//清空文本域
                $('#btn-file,#records a.load').hide();//上传附件隐藏
                $('#btn-file').val('');//清空附件
            }else{
                alert('跟进记录提交失败');
            }
        },
        error:function(){
            alert('服务器内部出错了')
        }
    });
});
//定义一个方法，每次修改时，更新跟进记录
function change(){
    $.ajax({
        url:initUrl+'addPropertyLog_2.do',
        data:{
            PropertyID:floorId,//是	string	开发楼盘ID
            Userid:1,//createUserid,//是	string	创建人ID
            Maintainlog:tipHtml+'#',//是	string	跟进记录内容
            UserType:4,//是	string	1为微信 2为来电 3为面谈 4为其他
            IntentionType:2,//是	string	1，了解基本情况 2，关系维护 3，准备提报 4，已提报 5，商务谈判 6，合同签订 7，无效盘 8
            FollowType_1:fTypeIndex//是	string	0 待扫盘 2，扫盘中 3， 维护中 4，已提报 5，商务谈判 6，合同签订 7，无效盘(1.待扫盘- 系统自动添加的，未进行任何修改及跟进2.扫盘中- 用户自行添加的，或针对系统添加的进行修改或填写跟进的 3.维护中- 用户添加了关键人信息（参见维护规则） 4.已提报、商务谈判、合同签订、无效盘 - 根据用户自行修改维护状态判别)注：此流程不可逆
        },
        type:'POST',
        success:function(data){
            //console.log(data);
            if(data.status=='success'){
                page();
                tipHtml='';//清空变更html
            }else{
                alert('跟进变更添加失败');
            }
        },
        error:function(){
            alert('服务器内部出错了')
        }
    });
}