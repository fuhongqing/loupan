//跳转到详情页后异步请求详情数据
$(function(){
    var landID=location.search.slice(4);//获取土地id
    var landDetail;//应于存放详情数据
    var tStatusIndex;//交易状态
    var pPIndex;//规划用途
    function land(){
        $.ajax({
            url:saleUrl+'landdetail_version2.do',
            type:'POST',
            data:{
                id:landID
            },
            success:function(data){
                //console.log(data);
                landDetail=data.data;//获取详情数据
                if(!landDetail){
                    return;
                }
                //console.log(landDetail);
                tStatusIndex=landDetail.LandState;//交易状态
                pPIndex=landDetail.PlanningPurposes;//规划用途
                var headHtml='',basicHtml='',dealHtml='',
                    basicModalHtml='',dealModalHtml='';
                //土地状态
                function landState(t){
                    switch (t){
                        case 1:
                            return t='未成交';
                            break;
                        case 2:
                            return t='流拍';
                            break;
                        case 3:
                            return t='已成交';
                            break;
                        default :
                            return t='其他';
                            break;
                    }
                }
                //规划用途
                function planningPurposes(t){
                    switch (t){
                        case 1:
                            return t='别墅';
                            break;
                        case 2:
                            return t='住宅';
                            break;
                        case 3:
                            return t='商铺';
                            break;
                        case 4:
                            return t='商住';
                            break;
                        default :
                            return t='其他';
                            break;
                    }
                }
                if(!landDetail.Cityname){
                    landDetail.Cityname='';
                }
                if(!landDetail.Boroughname){
                    landDetail.Boroughname='';
                }
                //头部内容
                headHtml=`
                    <div class="gt">
                        <h4 class="gt">地块标号：<span>${landDetail.PlotNumbers}</span></h4>
                        <h4>所在地区：<span>${landDetail.Cityname}-${landDetail.Boroughname}</span></h4>
                    </div>
                    <!--标题-->
                    <h2>${landDetail.LandName}<span>[${landState(landDetail.LandState)}]</span></h2>
                `;
                var navHtml=`
                    <p><a href="http://www.xtco.cn/">轩天实业&gt;</a><a href="./index.jsp">楼盘&gt;</a><a href="./landAdd.jsp">新增开发&gt;</a><a href="./landDetail.jsp">土地开发详情</a></p>
                `;
                $('header').html(headHtml+navHtml);
                //土地基本信息表格内容
                basicHtml+=`
                    <tr>
                        <td>
                            <span class="gt">${landDetail.TotalArea}m²</span>
                            <h4>总面积</h4>
                        </td>
                        <td>
                            <span class="gt">${landDetail.ConstructionArea}m²</span>
                            <h4>建筑用地面积</h4>
                        </td>
                        <td>
                            <span class="gt">${landDetail.PlanArea}m²</span>
                            <h4>规划建筑面积</h4>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="gt">${landDetail.CollectArea}m²</span>
                            <h4>代征面积</h4>
                        </td>
                        <td>
                            <span class="gt">大于0，小于${landDetail.PlotRatio}</span>
                            <h4>容积率</h4>
                        </td>
                        <td>
                            <span class="gt">${landDetail.AfforestationRate}%</span>
                            <h4>绿化率</h4>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="gt">${landDetail.BusinessRatio}</span>
                            <h4>商业比例</h4>
                        </td>
                        <td>
                            <span class="gt">大于0，小于${landDetail.BuildingDensity}</span>
                            <h4>建筑密度</h4>
                        </td>
                        <td>
                            <span class="gt">${landDetail.Limitheight}米</span>
                            <h4>限制高度</h4>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="gt">拍卖</span>
                            <h4>出让形式</h4>
                        </td>
                        <td>
                            <span class="gt">${landDetail.FixedYear}年</span>
                            <h4>出让年限</h4>
                        </td>
                        <td>
                            <span class="gt">${planningPurposes(landDetail.PlanningPurposes)}</span>
                            <h4>规划用途</h4>
                        </td>
                    </tr>
                `;
                $('#basic>tbody').html(basicHtml);
                //土地基本信息修改
                basicModalHtml+=`
                                              <div id="basic-gt" class="gt">
                                                <form class="sui-form form-horizontal sui-validate">
                                                    <div class="control-group  star">
                                                        <label class="control-label label-first">规划用途</label>
                                                        <div class="controls">
                                                          <span class="sui-dropdown dropdown-bordered select">
                                                            <span class="dropdown-inner">
                                                            <a  role="button" data-toggle="dropdown" href="#" class="dropdown-toggle">
                                                                <input value="xz" id="plan" name="types" type="hidden"><i class="caret"></i><span>${planningPurposes(landDetail.PlanningPurposes)}</span>
                                                            </a>
                                                              <ul  role="menu" id="purpose" class="sui-dropdown-menu">
                                                                  <li role="presentation" ><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="bs">别墅</a></li>
                                                                  <li role="presentation" ><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="zz">住宅</a></li>
                                                                  <li role="presentation" ><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="sp">商铺</a></li>
                                                                  <li role="presentation" ><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="sz">商住</a></li>
                                                                  <li role="presentation" ><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="qt">其他</a></li>
                                                              </ul></span></span>
                                                        </div>
                                                    </div>
                                                    <div class="control-group star-gt">
                                                        <label class="control-label">建设用地面积</label>
                                                        <div class="controls">
                                                            <input type="text" id="constructionArea" data-rules="required" value="${landDetail.ConstructionArea}">元/平
                                                        </div>
                                                    </div>
                                                    <div class="control-group star-gt">
                                                        <label class="control-label">代征面积</label>
                                                        <div class="controls">
                                                            <input type="text" id="collectArea" data-rules="required" value="${landDetail.CollectArea}">元/平
                                                        </div>
                                                    </div>
                                                    <div class="control-group star">
                                                        <label class="control-label">绿化率</label>
                                                        <div class="controls">
                                                            <input type="text" id="afforestationRate" value="${landDetail.AfforestationRate}">
                                                        </div>
                                                    </div>
                                                    <div class="control-group star">
                                                        <label class="control-label">商业比例</label>
                                                        <div class="controls">
                                                            <input type="text" id="businessRatio" data-rules="required" value="${landDetail.BusinessRatio}">
                                                        </div>
                                                    </div>
                                                    <div class="control-group star">
                                                        <label class="control-label">出让年限</label>
                                                        <div class="controls">
                                                            <input type="text" id="fixedYear" value="${landDetail.FixedYear}">年
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                            <div id="project2">
                                                <form class="sui-form form-horizontal">
                                                    <div class="control-group star-gt">
                                                        <label class="control-label">总面积</label>
                                                        <div class="controls">
                                                            <input type="text" id="totalArea" data-rules="required" value="${landDetail.TotalArea}">元/平
                                                        </div>
                                                    </div>
                                                    <div class="control-group star-gt">
                                                        <label class="control-label">规划建筑面积</label>
                                                        <div class="controls">
                                                            <input type="text" id="planArea" data-rules="required" value="${landDetail.PlanArea}">元/平
                                                        </div>
                                                    </div>
                                                    <div class="control-group">
                                                        <label class="control-label">容积率</label>
                                                        <div class="controls">
                                                            <span>大于</span>
                                                            <input type="text" id="plotRatio1" readonly value="0">
                                                            <span>,小于</span>
                                                            <input type="text" id="plotRatio2" value="${landDetail.PlotRatio}">
                                                        </div>
                                                    </div>
                                                    <div class="control-group">
                                                        <label class="control-label">建筑密度</label>
                                                        <div class="controls">
                                                            <span>大于</span>
                                                            <input type="text" id="buildingDensity1" readonly value="0">
                                                            <span>,小于</span>
                                                            <input type="text" id="buildingDensity2" value="${landDetail.BuildingDensity}">
                                                        </div>
                                                    </div>
                                                    <div class="control-group star-gt">
                                                        <label class="control-label">限制高度</label>
                                                        <div class="controls">
                                                            <input type="text" id="limitheight" data-rules="required" value="${landDetail.Limitheight}">米
                                                        </div>
                                                    </div>
                                                    <div class="control-group star-gt">
                                                        <label class="control-label">出让形式</label>
                                                        <div class="controls">
                                                            <input type="text" id="types" disabled value="拍卖">
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
            `;
                $('#myModal .modal-body').html(basicModalHtml);//土地基本信息修改
                //土地成交信息表格内容
                dealHtml+=`
                    <tr>
                        <td>
                            <span class="gt">${landState(landDetail.LandState)}</span>
                            <h4>交易状态</h4>
                        </td>
                        <td>
                            <span class="gt">${landDetail.PartyName}</span>
                            <h4>竞得方</h4>
                        </td>
                        <td>
                            <span class="gt">${landDetail.TradingSite}</span>
                            <h4>交易地点</h4>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="gt">${landDetail.StartTime}</span>
                            <h4>起始日期</h4>
                        </td>
                        <td>
                            <span class="gt">${landDetail.EndTime}</span>
                            <h4>截止日期</h4>
                        </td>
                        <td>
                            <span class="gt">${landDetail.DealDate}</span>
                            <h4>成交日期</h4>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="gt">${landDetail.StartingPrice}万</span>
                            <h4>起始价</h4>
                        </td>
                        <td>
                            <span class="gt">${landDetail.DealPrice}元</span>
                            <h4>成交价</h4>
                        </td>
                        <td>
                            <span class="gt">${landDetail.PlanePrice}/m²</span>
                            <h4>楼面地价</h4>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="gt">${landDetail.PremiumRate}%</span>
                            <h4>溢价率</h4>
                        </td>
                        <td>
                            <span class="gt">${landDetail.Margin}万</span>
                            <h4>保证金</h4>
                        </td>
                        <td>
                            <span class="gt">${landDetail.MarkUp}万</span>
                            <h4>最小加价幅度</h4>
                        </td>
                    </tr>
                `;
                $('#deal>tbody').html(dealHtml);
                //土地成交信息修改
                dealModalHtml+=`
                                         <div id="deal-gt" class="gt">
                                            <form class="sui-form form-horizontal">
                                                <div class="control-group star">
                                                    <label class="control-label label-first">交易状态</label>
                                                    <div class="controls">
                                                    <span class="sui-dropdown dropdown-bordered select">
                                                          <span class="dropdown-inner">
                                                                    <a  role="button" data-toggle="dropdown" href="#" class="dropdown-toggle">
                                                                        <input value="xz" name="state" type="hidden"><i class="caret"></i><span>${landState(landDetail.LandState)}</span>
                                                                    </a>
                                                              <ul  role="menu" id="tradingStatus" class="sui-dropdown-menu">
                                                                  <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="qxz">未成交</a></li>
                                                                  <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="ds">流拍</a></li>
                                                                  <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="zs">已成交</a></li>
                                                              </ul></span></span>
                                                    </div>
                                                </div>
                                                <div class="control-group star-gt">
                                                    <label class="control-label">起始日期</label>
                                                    <div data-toggle="datepicker" class="control-group input-daterange">
                                                        <div class="controls">
                                                            <img src="./res/date.png" alt="" class="gt"/>
                                                            <input type="text" id="startDate" class="input-medium" value="${landDetail.StartTime}">
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="control-group star-gt">
                                                    <label class="control-label">成交日期</label>
                                                    <div data-toggle="datepicker" class="control-group input-daterange">
                                                        <div class="controls">
                                                            <img src="./res/date.png" alt="" class="gt"/>
                                                            <input type="text" id="dealDate" class="input-medium" value="${landDetail.DealDate}">

                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="control-group">
                                                    <label class="control-label">成交价</label>
                                                    <div class="controls">
                                                        <input type="text" id="dealPrice" value="${landDetail.DealPrice}">万
                                                    </div>
                                                </div>
                                                <div class="control-group">
                                                    <label class="control-label">溢价率</label>
                                                    <div class="controls">
                                                        <input type="text" id="premiumRate" value="${landDetail.PremiumRate}">%
                                                    </div>
                                                </div>
                                                <div class="control-group">
                                                    <label class="control-label">最小加价幅度</label>
                                                    <div class="controls">
                                                        <input type="text" id="markUp" value="${landDetail.MarkUp}">万
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                        <div id="project3">
                                            <form class="sui-form form-horizontal">
                                                <div class="control-group">
                                                    <label class="control-label">竞得方</label>
                                                    <div class="controls">
                                                        <input type="text" id="partyName" value="${landDetail.PartyName}">
                                                    </div>
                                                </div>
                                                <div class="control-group star-gt">
                                                    <label class="control-label">截止日期</label>
                                                    <div data-toggle="datepicker" class="control-group input-daterange">
                                                        <div class="controls">
                                                            <img src="./res/date.png" alt="" class="gt"/>
                                                            <input type="text" id="endDate" class="input-medium" value="${landDetail.EndTime}">

                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="control-group">
                                                    <label class="control-label">起始价</label>
                                                    <div class="controls">
                                                        <input type="text" id="startingPrice" value="${landDetail.StartingPrice}">万
                                                    </div>
                                                </div>
                                                <div class="control-group">
                                                    <label class="control-label">楼面地价</label>
                                                    <div class="controls">
                                                        <input type="text" id="planePrice" value="${landDetail.PlanePrice}">元/平
                                                    </div>
                                                </div>
                                                <div class="control-group">
                                                    <label class="control-label">保证金</label>
                                                    <div class="controls">
                                                        <input type="text" id="margin" value="${landDetail.Margin}">万
                                                    </div>
                                                </div>
                                                <div class="control-group">
                                                    <label class="control-label">交易地点</label>
                                                    <div class="controls">
                                                        <input type="text" id="Abbreviation" value="${landDetail.TradingSite}">
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
            `;
                $('#myModal1 .modal-body').html(dealModalHtml);//土地交易信息修改
            },
            error:function(){
                alert('服务器内部出错了')
            }
        });
    }
    land();
    //编辑模态框的关闭取消的点击事件
    $('#myModal,#myModal1').on('click','.cancel',function(e){
        e.preventDefault();
        land();
    });
    //土地基本信息编辑接口
    $('#myModal .modal-footer').on('click','.modify',function(){
        var constructionAreaVal=$('#constructionArea').val(),//建筑用地面积
            collectAreaVal=$('#collectArea').val(),//代征面积
            afforestationRateVal=$('#afforestationRate').val(),//绿化率
            businessRatioVal=$('#businessRatio').val(),//商业比例
            fixedYearVal=$('#fixedYear').val(),//出让年限
            totalAreaVal=$('#totalArea').val(),//总面积
            planAreaVal=$('#planArea').val(),//规划建筑面积
            plotRatio2Val=$('#plotRatio2').val(),//容积率小于
            buildingDensity2Val=$('#buildingDensity2').val(),//建筑密度小于
            limitheightVal=$('#limitheight').val(),//限制高度
            planningPurposesIndex=$('#purpose>li.active').index()+1===0?pPIndex:$('#purpose>li.active').index()+1;//获取规划用途下标
        var self=land;
        $.ajax({
            url:saleUrl+'updatelandbaseinfo_version2.do',
            type:'POST',
            data:{
                id:landID,//土地id
                constructionArea:constructionAreaVal	,//否	string	//建设用地面积
                collectArea:collectAreaVal	,//是	string	//代征面积
                afforestationRate:afforestationRateVal	,//是	string	//绿化率
                businessRatio:businessRatioVal	,//是	string	//商业比例
                fixedYear:fixedYearVal	,//是	string	//出让年限
                totalArea:totalAreaVal	,//是	string	//总面积
                planArea:planAreaVal	,//是	string	//规划建筑面积
                plotRatio:plotRatio2Val	,//是	string	//容积率
                buildingDensity:buildingDensity2Val	,//是	string	//建筑密度
                limitheight:limitheightVal,	//是	string	//限制高度
                planningPurposes:planningPurposesIndex	//是	string	规划用途 1为住宅 2为商业 3为酒店
            },
            success:function(data){
                if(data.status==='success'){
                    alert('更新成功!');
                    self();
                }else{
                    alert('更新失败!');
                }
            },
            error:function(){
                alert('服务器内部出错了')
            }
        });
    });
    //土地交易信息接口
    $('#myModal1 .modal-footer').on('click','.modify',function(){
        var tradingStatusIndex=$('#tradingStatus>li.active').index()+1===0?tStatusIndex:$('#tradingStatus>li.active').index()+1,//交易状态下标
            startDateVal=$('#startDate').val(),//起始日期
            dealDateVal=$('#dealDate').val(),//成交日期
            dealPriceVal=$('#dealPrice').val(),//成交价
            premiumRateVal=$('#premiumRate').val(),//溢价率
            markUpVal=$('#markUp').val(),//最小加价幅度
            partyNameVal=$('#partyName').val(),//竞得方
            endDateVal=$('#endDate').val(),//截止日期
            startingPriceVal=$('#startingPrice').val(),//起始价
            planePriceVal=$('#planePrice').val(),//楼面地价
            marginVal=$('#margin').val(),//保证金
            abbreviation=$('#Abbreviation').val();//成交地点
        var self=land;
        $.ajax({
            url:saleUrl+'updatetradelandinfo_version2.do',
            type:'POST',
            data:{
                id:landID,//土地id
                startDate:startDateVal	,//否	string	////起始日期
                dealDate:dealDateVal    	,//否	string	//成交日期
                dealPrice:dealPriceVal	,//否	string	//成交价
                premiumRate:premiumRateVal    	,//否	string	//溢价率
                markUp:markUpVal,	//否	string	//加价幅度
                partyName:partyNameVal    	,//否	string	//竞得方
                endDate:endDateVal	,//否	string	//截止日期
                startingPrice:startingPriceVal	,//否	string	//起始价
                planePrice:planePriceVal    	,//否	string	//楼面地价
                margin:marginVal,	//否	string	//保证金
                LandState:tradingStatusIndex,	//是	string	交易状态
                tradingSite:abbreviation	//是	string	交易地点
            },
            success:function(data){
                if(data.status==='success'){
                    alert('更新成功!');
                    self();
                }else{
                    alert('更新失败!');
                }
            },
            error:function(){
                alert('服务器内部出错了')
            }
        });
    });
});