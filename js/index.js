//交互
$(function(){
    if($('#appendedInput').val()!==''){
        setTimeout(function(){
            $('#search>form>div>span>img').click();
        },0);
    }
    $('#aa').hover(function(){
            if($('#aa').hasClass('moreDown')){
                $('#aa>img').attr('src','./res/angle-double-down-a.png');
            }
            if($('#aa').hasClass('moreUp')){
                $('#aa>img').attr('src','./res/angle-double-up-a.png');
            }
        },
        function(){
            if($('#aa').hasClass('moreDown')){
                $('#aa>img').attr('src','./res/angle-double-down.png');
            }
            if($('#aa').hasClass('moreUp')){
                $('#aa>img').attr('src','./res/angle-double-up.png');
            }
        });
    //header 切换模式点击事件
    $('header').on('click','a',function(e){
        $(e.target).addClass('active').siblings().removeClass('active');
    });
    $('section ul>li').on('click','a',function(e){
        e.preventDefault();
        $(e.target).parent().addClass('active').siblings().removeClass('active');
    });
    //不限超链接的点击事件
    $('#more').on('click','li.all>a',function(e){
        $('#more .total').hide();//区域隐藏
    });
    //section 展开按钮的点击事件
    $('#more').on('click','li.extend>a',function(){
        var html=`
          收起<img src="./res/up-disabled.png"/>
        `;
        $('#bb').html(html).toggleClass('up');
        $('#more>ul.total').show();//区域显示
    });
    //收起按钮点击事件
    $('#more').on('click','li.extend>a.up',function(e){
        $('#more>ul.total').hide();
        $('#plate').hide();
        var html=`
          展开<img src="./res/down.png"/>
        `;
        $('#bb').html(html);
    });
    //展开选项的点击事件
    $('section>div>p').on('click','a.moreDown',function(e){
        e.preventDefault();
        $('#aa').html('收起选项 <img src="./res/angle-double-up.png"/>').attr('class','moreUp').parent().prev().show();
    })
        //收起选项的点击事件
        .on('click','a.moreUp',function(e){
            e.preventDefault();
            $('#aa').html('展开选项 <img src="./res/angle-double-down.png"/>').attr('class','moreDown').parent().prev().hide();
        });
    //模态框列表的点击事件
    $('#main-area ul.cities').on('click','li',function(){
        $(this).toggleClass('active');
    });
    //取消按钮点击事件
    $('#main-area div.btns').on('click','a:last-child',function(e){
        e.preventDefault();
        $(e.target).parent().parent().parent().parent().fadeOut();
    });
    //设置主营区域按钮点击事件
    $('#search>div.btns').on('click','a:last-child',function(e){
        e.preventDefault();
        $(e.target).parent().next().fadeIn();
    });
});
//主营
//级别接口
var mainID,mainCode,mainFlag;
//主营模态框提交或者取消点击刷新
$('#search>.btns>a:last').click(function(e){
    level(1,'businessUnit');
});
$('#main-area>div>.btns>a:last-child,#search>.btns>a:last').click(function(e){
    e.preventDefault();
    $('#main-area .person').html('');
    $('#appended').val('');
    $('#main-area .textarea').html('');
    $('#searchCity').hide();//模糊查询列表隐藏
    $('#main-area .textarea').hide();//文本域隐藏
});
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
                      <li id="${departData[i].Userid}">${departData[i].FullName}</li>
                                       `;
                        });
                        $('#main-area .person').append(departHtml);
                    },
                    error:function(){
                        alert('服务器出错了');
                    }
                });
            }
            $.each(departData,function(i){
                departHtml+=`
                      <li id="${departData[i].ID}" class="${departData[i].DepartMentCode}" style="${perFlag}">${departData[i].DepartName}</li>
                                       `;
            });
            $('#main-area .person').append(departHtml);
        },
        error:function(){
            alert('服务器出错了');
        }
    });
}
//主营组别点击事件
$('#main-area .person').on('click','li',function(e){
    mainID=$(e.target).attr('id');
    mainCode=$(e.target).attr('class').split(' ')[0];
    mainFlag=$(e.target).attr('style');
    if(mainCode=='businessUnit'&&mainFlag==1){
        mainCode='samllUnit';
    }else if(mainCode=='samllUnit'&&mainFlag==1){
        mainCode='developmentservice';
    }else if(mainCode=='developmentservice'&&mainFlag==1){
        mainCode='developmentgroup';
    }else if(mainCode=='developmentgroup'&&mainFlag==1){
        mainCode='developmentteam';
    }else{
        $(e.target).addClass('active').siblings().removeClass('active');
        return;
    }
    level(mainID,mainCode);
    $(e.target).addClass('active').siblings().removeClass('active');
});
//设置主营提交
var dataID,//是	string	位置ID(城市的ID 或者 区域的ID 或者 板块的ID )
    dataType;//是	string	1城市 2位区域 3为板块
//模糊查询登录人有权限的城市区域板块
$('#main-area').on('click','.add-on,.add-on>img',function(e){
    e.stopPropagation();
    $('#searchCity').show();//模糊查询列表显示
    $('#main-area .textarea').show();//文本域显示
    var searchStr=$('#appended').val(),//查询字符串
        searchHtml='',searchData;
    $.ajax({
        url:initUrl+'moHuChaXunSuoYouDiDian_2.do',
        type:'POST',
        data:{
            "SearchStr":searchStr,//是	string	模糊查询条件
            "PermissionID":421,//permissionID,//是	string	部门或开发人员 ID
            "Permissiontype":1//是	string	1部门
        },
        success:function(data){
            searchData=data.data.moHuChaXunSuoYouDiDian_2;
            if(!searchData){
                return;
            }
            $.each(searchData,function(i){
                searchHtml+=`
                       <li id="${searchData[i].plateid}" class="${searchData[i].DataType}">${searchData[i].fullname}</li>
                    `;
            });
            $('#searchCity').html(searchHtml);
        },
        error:function(){
            alert('服务器内部出错了')
        }
    });
});
//定义一个设置主营的方法
function mainArea(){
    $.ajax({
        url:initUrl+'addD_ProjectPermission_2.do',
        type:'POST',
        data:{
            "PermissionType":1,//是	string	1为部门
            "PermissionID":mainID,//是	string	部门或开发人员 ID
            "DataID":dataID,//是	string	位置ID(城市的ID 或者 区域的ID 或者 板块的ID )
            "DataType":dataType,//是	string	1城市 2位区域 3为板块
            "CreateUserid":1//createUserid//是	string	创建人ID
        },
        success:function(data){
            if(data.data.status=='success'){
                alert('设置成功');
            }else{
                alert('设置失败');
            }
        },
        error:function(){
            alert('服务器内部出错了')
        }
    });
}
//点击模糊查询的城市区域或者板块，获取其class，id
var dataIDArr=[],dataTypeArr=[],$arr=[],textHtml='';
//选择城市添加到文本域
$('#searchCity').on('click','li',function(e){
    dataID=$(e.target).attr('id');
    if($arr.indexOf($(e.target).html())==-1){
        dataIDArr.push(dataID);
        dataTypeArr.push(parseFloat($(e.target).attr('class')));
        $arr.push($(e.target).html());
    }
    var $i=$arr.length-1;
    textHtml=`
          <a href="#"><b class="gt">&times;</b><span id="${dataID}">${$arr[$i]}</span></a>
        `;
    $(this).parent().parent().next().next().append(textHtml);
    //文本域关闭图标的hover效果
    $('#main-area .textarea>a>b').hover(function(e){
        $(e.target).html('<img src="./res/delete_hover.png" alt=""/>');
    },function(e){
        $('#main-area .textarea>a>b').html('&times;');
    });
})
.on('click','li.active',function(e){
        var dataIndex=$arr.indexOf($(e.target).html());
        dataIDArr.splice(dataIndex,1);
        dataTypeArr.splice(dataIndex,1);
        $arr.remove($(e.target).html());
        var dataName=$(e.target).html();
        $('#main-area .textarea>a>span:contains('+dataName+')').parent().remove();
});
//文本域关闭按钮的点击事件
$('#main-area .textarea').on('click','img',function(e){
    var dataIndex=$arr.indexOf($(e.target).parent().next().html());
    dataIDArr.splice(dataIndex,1);
    dataTypeArr.splice(dataIndex,1);
    $arr.splice(dataIndex,1);
    $(e.target).parent().parent().hide();
    var dataName=$(e.target).parent().next().html();
    $('#searchCity>li:contains('+dataName+')').removeClass('active');
    //console.log(dataTypeArr);
});
//提交
$('#main-area>div.contain>div.btns>a:first-child').click(function(e){
    e.preventDefault();
    $.each(dataIDArr,function(i){
        dataID=dataIDArr[i];
        dataType=dataTypeArr[i];
        mainArea();
    });
    $('#appended').val('');
    $('#main-area .person').html('');
    $('#main-area .textarea').html('');
    $('#searchCity').hide();//模糊查询列表隐藏
    $('#main-area .textarea').hide();//文本域隐藏
    $('#modal').hide();
});
//楼盘列表_及模糊查询
//跳转成功后异步请求详情数据
var pageNo=1,//页码数
    maxPage=20,//每页条数
    pageSize,
    ordermethod=0,//升序，降序
    searchStr='',//搜索
    buildingType='',//否	string	建筑类型 0 公寓 1:别墅 5:商业 6:住宅 7其他
    salePoint='',//星级
    followTypeIndex='',//否	string	跟进状态：0 待扫盘 2，扫盘中 3， 维护中 4，已提报 5
    soldStateIndex="",//否	string	在售状态 0在建 1 待开盘 2在售 3滞销 4售罄
    dealMoney="",//否	string	1: 1亿以内 , 2: 1-3亿 , 3: 3-10亿 ,4: 10亿以上
    weiHuRen='',//维护人
    weiHuShiJian_start='',
    weiHuShiJian_end='',
    cityID="",//城市
    boroughID="",//区域
    plateID="",//板块
    condition="0";//是
var flag='';//否	string
//动态生成页码，实现翻页功能
function page(){
    $.ajax({
        url:initUrl+'propertyList_2.do',
        type:'POST',
        data:{
            "SoldState":soldStateIndex,//否	string	在售状态 0在建 1 待开盘 2在售 3滞销 4售罄
            "PageNum":pageNo,
            "PageSize":maxPage,
            "CityID":cityID,//否	string	城市ID
            "BoroughID":boroughID,//否	string	区域ID
            "PlateID":plateID,//否	string	板块ID
            "BuildingType":buildingType,//否	string	建筑类型 0 公寓 1:别墅 5:商业 6:住宅 7其他
            "FollowType":followTypeIndex,//否	string	跟进状态：0 待扫盘 2，扫盘中 3， 维护中 4，已提报 5，商务谈判 6，合同签订 7，无效盘
            "DealMoney":dealMoney,//否	string	1: 1亿以内 , 2: 1-3亿 , 3: 3-10亿 ,4: 10亿以上
            "SalePoint":salePoint,//否	string	级别 销售重点 1 星 2星 3星 4星
            "SearchStr":searchStr,
            "WeiHuShiJian_start":weiHuShiJian_start,//否	string	时间区间筛选__开始
            "WeiHuShiJian_end":weiHuShiJian_end,//否	string	时间区间筛选__结束
            "WeiHuRen":weiHuRen,
            "condition":condition,//是	string	0：修改更新时间 1: 跟进状态 2: 剩余体量 还剩 多少（500）套 房子 3 : 剩余货值 4: 最近维护
            "ordermethod":ordermethod,//是	string	1为正序 0 为 倒序
            "PermissionID":421,//permissionID,//是	string	营运中心或事业部或开发组或开发人员 的 ID
            "Permissiontype":1,//permissionType,//是	string
            "Flag":flag	//否	string	2 事业部 ， 3 开发组 ， 4 开发人员
        },
        success:function(data){
            if(data==''){
                return;
            }
            //console.log(data);
            var floorList=data.data.propertyList_2;//列表数据
            var listHtml='',theadHtml='';
            //判断列表数据内容为空
            if(!floorList||floorList.length==0||data.data.Size==0){
                $('#items>tbody').html('');
                //thead数据
                theadHtml+=`
                      项目名 <span>(0)</span>
                    `;
            }else{
                //thead数据
                theadHtml+=`
                      项目名 <span>(${data.data.Size})</span>
                    `;
            }
            $('#floorCount').html(theadHtml);
            //在售状态
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
            //建筑类型
            function buildingType(t){
                switch(t)
                {
                    case 0:
                        return t = "公寓";
                        break;
                    case 1:
                        return t = "别墅";
                        break;
                    case 5:
                        return t = "商业";
                        break;
                    case 6:
                        return t = "住宅";
                        break;
                    default:
                        return t = "其他";
                        break;
                }
            }
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
            //目前销售类型
            function proxySalestype(t){
                switch(t)
                {
                    case 1:
                        return t = "接受代理，目前无代理";
                        break;
                    case 2:
                        return t = "独家代理";
                        break;
                    case 3:
                        return t = "自销";
                        break;
                    case 4:
                        return t = "联合代理";
                        break;
                    case 5:
                        return t = "只做案场";
                        break;
                    case 6:
                        return t = "只做联动";
                        break;
                    default:
                        return t = "其他";
                        break;
                }
            }
            $.each(floorList,function(i){
                //判断字段是否有意义
                if(!floorList[i].Abbreviation){
                    floorList[i].Abbreviation='';//开发商简称
                }
                if(!floorList[i].PropertyName){
                    floorList[i].PropertyName='';//小区名称
                }
                if(!floorList[i].DealMoney){
                    floorList[i].DealMoney=0;//待销售金额
                }
                if(!floorList[i].Updatetime){
                    floorList[i].Updatetime='';//最新维护时间
                }
                if(!floorList[i].CityName){
                    floorList[i].CityName='';//城市
                }
                if(!floorList[i].SalesHouse){
                    floorList[i].SalesHouse=0;//可售套数
                }
                if(!floorList[i].DeTime){
                    floorList[i].DeTime=0;//去化时间
                }
                if(!floorList[i].BoroughName){
                    floorList[i].BoroughName='';//区域
                }
                if(!floorList[i].PropertyDevelopers){
                    floorList[i].PropertyDevelopers='';//开发商
                }
                if(!floorList[i].FullName){
                    floorList[i].FullName='';//维护人
                }
                if(!floorList[i].ProxySalestype){
                    floorList[i].ProxySalestype=0;//目前销售类型
                }
                //销售重点
                var starHtml='';
                var salePoints=parseFloat(floorList[i].SalePoint);
                if(isNaN(salePoints)){
                    salePoints=0;
                }
                for(var j=0;j<salePoints;j++){
                    starHtml+=`
                            <img src="./res/star-full.png" alt=""/>
                        `;
                }
                //列表内容
                //建筑类型(多选)
                var buildingArr=[],arr1=[];
                buildingArr=buildingArr.concat(floorList[i].BuildingType.split(','));

                //定义一个方法和数组arr1，用来存放建筑类型多选值对应的类型
                function fun(){
                    for(var i=0;i<buildingArr.length;i++){
                        buildingArr[i]==0?arr1[i]=buildingType(0):
                            buildingArr[i]==5?arr1[i]=buildingType(5):
                                buildingArr[i]==1?arr1[i]=buildingType(1):
                                    buildingArr[i]==6?arr1[i]=buildingType(6):arr1[i]="其他";
                    }
                }
                fun();

                //console.dir(arr1);
                //遍历arr1，动态添加
                var buildingHtml='';
                if(buildingArr[0]==''){
                    arr1=[''];
                }
                $.each(arr1,function(i){
                    buildingHtml+=`
                          <a href="#">${arr1[i]}</a>
                        `;
                });
                //console.log(buildingHtml);
                var soldHtml=`
                      <a href="#">${soldState(floorList[i].SoldState)}</a>
                    `;
                var statesHtml=buildingHtml+soldHtml;
                if(buildingArr[0]==''){
                    statesHtml=soldHtml;
                }
                if(isNaN(parseFloat(floorList[i].SoldState))){
                    statesHtml=buildingHtml;
                }
                //tbody数据
                listHtml+=`
                         <tr id="${floorList[i].ID}">
                            <td>
                                <div class="gt">
                                    <div class="stars">
                                        ${starHtml}
                                    </div>
                                    <div class="states gt">
                                        ${statesHtml}
                                    </div>
                                </div>
                                <h4>${floorList[i].PropertyName}</h4>
                                <p>${floorList[i].Abbreviation}</p>
                            </td>
                            <td>${floorList[i].CityName}-${floorList[i].BoroughName}</td>
                            <td>${followType(floorList[i].FollowType)}</td>
                            <td>${floorList[i].SalesHouse}套</td>
                            <td>${floorList[i].DealMoney}亿</td>
                            <td>${floorList[i].DeTime}个月</td>
                            <td>${proxySalestype(floorList[i].ProxySalestype)}</td>
                            <td>${floorList[i].Updatetime}</td>
                            <td>${floorList[i].FullName}</td>
                         </tr>
                    `;
                $('#items>tbody').html(listHtml);
            });
            //页码
            var pageHtml='',moreHtml='',styleHtml='';
            pageSize=Math.ceil(data.data.Size/20);//获取页码最大值
            //循环拼接字符串，生成翻页功能
            if(pageSize==0){
                pageSize=1;
            }
            if(pageSize<7){
                for(var i=1;i<=pageSize;i++){
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
                  <li><a href="#" class="${pageSize}">${pageSize}</a></li>
                `;
                for(var j=5;j<pageSize;j++){
                    moreHtml+=`
                          <li><a href="#" class="${j}">${j}</a></li>
                        `;
                }
                $('#pageNum').html(styleHtml);
                $('#pageNum>li.more').on('click','a',function(e){
                    e.preventDefault();
                    $(e.target).parent().after(moreHtml);//显示所有页码
                    $(e.target).parent().css('display','none');//...隐藏
                    $('#pageNum>li:nth-child(1)').addClass('active').siblings().removeClass('active');//第四页加.active
                });
            }
            $('#pageNum>li>a.'+pageNo).parent().addClass('active');
            //判断当前页码，决定.more的显示隐藏
            if(pageNo>4){
                $('#pageNum>li.more').hide().after(moreHtml);
                $('#pageNum>li>a.'+pageNo).parent().addClass('active');
            }
        },
        error:function(){
            alert('服务器内部出错了')
        }
    });
}
page();
//页码数的点击事件
$('#pageNum').on('click','li:not(.more)>a',function(e){
    e.preventDefault();
    $(e.target).parent().addClass('active').siblings().removeClass('active');
    pageNo=$(e.target).html();//获取当前页码
    //pageSize=$('#pageNum>li:last-child>a').html();
    if(pageNo==1){
        $('#pages>ul>li.prev').addClass('disabled').siblings().removeClass('disabled');
    }else{
        $('#pages>ul>li.prev').removeClass('disabled');
    }
    if(pageNo==pageSize){
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
    pageNo++;
    $('#pageNum>li.active').removeClass('active').next().addClass('active');//为下一页加.active
    $('#pages>ul>li.prev').removeClass('disabled');
    for(var j=5;j<pageSize;j++){
        moreHtml+=`
                          <li><a href="#" class="${j}">${j}</a></li>
                        `;
    }
    if(pageNo==5){
        $('#pageNum>li.more').hide().after(moreHtml);//显示所有页码;
        $('#pageNum>li.active').removeClass('active').next().addClass('active');//为下一页加.active
    }
    if(pageNo>=pageSize){
        pageNo=pageSize;
        $('#pages>ul>li.next').addClass('disabled');
        $('#pageNum>li:last-child').addClass('active');
    }
    page();
});
//向后翻页的点击事件
$('#pages>ul>li.prev').on('click','a',function(e){
    e.preventDefault();
    pageNo--;
    $('#pageNum>li.active').removeClass('active').prev().addClass('active');//为下一页加.active
    $('#pages>ul>li.next').removeClass('disabled');
    if(pageNo==4){
        $('#pageNum>li.active').removeClass('active').prev().addClass('active');
    }
    if(pageNo<=1){
        pageNo=1;
        $('#pages>ul>li.prev').addClass('disabled');
        $('#pageNum>li:first-child').addClass('active');
    }
    page();
});
//建筑类型筛选条件
$('#BuildingType>li:gt(1)').on('click','a',function(e){
    e.preventDefault();
    buildingType=$(e.target).attr('id');
    page();
});
//建筑类型不限按钮的点击事件
$('#BuildingType>li.all').on('click','a',function(e){
    e.preventDefault();
    buildingType='';
    page();
});
//级别 销售重点 筛选条件
$('#SalePoint>li').on('click','a',function(e){
    var selfPage=page;
    e.preventDefault();
    if($(e.target).html()=='四星'){
        salePoint=4;
        selfPage();
    }
    if($(e.target).html()=='三星'){
        salePoint=3;
        selfPage();
    }
    if($(e.target).html()=='二星'){
        salePoint=2;
        selfPage();
    }
    if($(e.target).html()=='一星'){
        salePoint=1;
        selfPage();
    }
});
//级别不限的点击事件
$('#SalePoint>li.all').on('click','a',function(e){
    e.preventDefault();
    salePoint='';
    page();
});
//跟进状态筛选条件
$('#FollowType>li').on('click','a',function(e){
    var selfPage=page;
    e.preventDefault();
    if($(e.target).html()=='待扫盘'){
        followTypeIndex=0;
        selfPage();
    }
    if($(e.target).html()=='扫盘中'){
        followTypeIndex=2;
        selfPage();
    }
    if($(e.target).html()=='维护中'){
        followTypeIndex=3;
        selfPage();
    }
    if($(e.target).html()=='已提报'){
        followTypeIndex=4;
        selfPage();
    }
    if($(e.target).html()=='商务谈判'){
        followTypeIndex=5;
        selfPage();
    }
    if($(e.target).html()=='合同签订'){
        followTypeIndex=6;
        selfPage();
    }
    if($(e.target).html()=='无效盘'){
        followTypeIndex=7;
        selfPage();
    }
});
//跟进状态不限的点击事件
$('#FollowType>li.all').on('click','a',function(e){
    e.preventDefault();
    followTypeIndex='';
    page();
});
//在售状态筛选条件
$('#SoldState>li').on('click','a',function(e){
    var selfPage=page;
    e.preventDefault();
    if($(e.target).html()=='在建'){
        soldStateIndex=0;
        selfPage();
    }
    if($(e.target).html()=='在售'){
        soldStateIndex=2;
        selfPage();
    }
    if($(e.target).html()=='滞销'){
        soldStateIndex=3;
        selfPage();
    }
    if($(e.target).html()=='售罄'){
        soldStateIndex=4;
        selfPage();
    }
    if($(e.target).html()=='待开盘'){
        soldStateIndex=1;
        selfPage();
    }
});
//在售状态不限点击事件
$('#SoldState>li.all').on('click','a',function(e){
    e.preventDefault();
    soldStateIndex='';
    page();
});
//货值筛选条件
$('#DealMoney>li').on('click','a',function(e){
    var selfPage=page;
    e.preventDefault();
    if($(e.target).html()=='1亿以内'){
        dealMoney=1;
        selfPage();
    }
    if($(e.target).html()=='1-3亿'){
        dealMoney=2;
        selfPage();
    }
    if($(e.target).html()=='3-10亿'){
        dealMoney=3;
        selfPage();
    }
    if($(e.target).html()=='10亿以上'){
        dealMoney=4;
        selfPage();
    }
});
//货值不限点击事件
$('#DealMoney>li.all').on('click','a',function(e){
    e.preventDefault();
    dealMoney='';
    page();
});
//城市筛选条件
$('#limit').on('click','li.city>a',function(e){
    e.preventDefault();
    $('#limit>li>a').css('color','#616161');
    $(e.target).css('color','#ED9127');
    cityID=$(e.target).attr('id');
    boroughID='';
    plateID='';
    page();
});
//城市不限按钮的点击事件
$('#limit').on('click','li.all>a',function(e){
    e.preventDefault();
    $(e.target).css('color','#ED9127');
    $(e.target).parent().addClass('active').siblings().removeClass('active');
    $('#limit>li.city>a').css('color','#616161');
    var navHtml=`
               <a href="http://www.xtco.cn/">轩天实业&gt;</a><a href="./index.jsp">项目开发</a>
              `;
    $('section>p').html(navHtml);
    cityID="";
    boroughID='';
    plateID='';
    page();
});
//区域筛选条件
$('#borough').on('click','li.borough>a',function(e){
    e.preventDefault();
    boroughID=$(e.target).attr('id');
    plateID='';
    page();
});
//区域全部链接点击事件
$('#borough').on('click','a.all',function(e){
    e.preventDefault();
    $('#borough>li').removeClass('active');
    $('#plate').hide();
    boroughID='';
    plateID='';
    page();
});
//板块筛选条件
$('#plateTotal').on('click','li.plate>a',function(e){
    e.preventDefault();
    plateID=$(e.target).attr('id');
    page();
});
//板块不限按钮点击事件
$('#plateTotal').on('click','a.all',function(e){
    e.preventDefault();
    $('#plateTotal>li').removeClass('active');
    plateID='';
    page();
});
//点击空白处板块隐藏
$(document).click(function(e){
    var _con=$('#plate,#borough');//设置目标区域
    if(!_con.is(e.target)&&_con.has(e.target).length==0){
        $('#plate').hide(500);
    }
});
//维护人筛选
$('#WeiHuRen').click(function(){
    $('#menu12').css('display','block');
});
//时间筛选
$('#btn').click(function(e){
    e.preventDefault();
    weiHuShiJian_start=$('#WeiHuShiJian_start').val();//时间开始
    weiHuShiJian_end=$('#WeiHuShiJian_end').val();//时间开始
    page();
});
//点击空白处下拉框隐藏
$(document).click(function(e){
    var _con=$('#WeiHuRen,#menu12');//设置目标区域
    if(!_con.is(e.target)&&_con.has(e.target).length==0){
        $('#menu12').hide(500);
    }
});
//表头a标记点击阻止默认行为
$('#items>thead').on('click','a',function(e){
    e.preventDefault();
});
//楼盘列表中点击上下箭头实现排序功能
$('#items>thead').on('click','.up-img',function(e){
    e.preventDefault();
    $(e.target).attr('src','./res/up-disabled-a.png');
    $(e.target).next().attr('src','./res/down-disabled.png');
    if($(e.target).parent().hasClass('follow')){
        condition=1;
    }else if($(e.target).parent().hasClass('count')){
        condition=2;
    }else if($(e.target).parent().hasClass('material')){
        condition=3;
    }else if($(e.target).parent().hasClass('protect')){
        condition=4;
    }
    ordermethod=1;
    page();
});
$('#items>thead').on('click','.down-img',function(e){
    e.preventDefault();
    $(e.target).prev().attr('src','./res/up-disabled.png');
    $(e.target).attr('src','./res/down-disabled-a.png');
    if($(e.target).parent().hasClass('follow')){
        condition=1;
    }else if($(e.target).parent().hasClass('count')){
        condition=2;
    }else if($(e.target).parent().hasClass('material')){
        condition=3;
    }else if($(e.target).parent().hasClass('protect')){
        condition=4;
    }
    ordermethod=0;
    page();
});
//搜索框的模糊查询
$('#search>form>div>span').on('click','img',function(){
    searchStr=$('#appendedInput').val();
    page();
});
//tobody>tr点击跳转详情
$('#items>tbody').on('click','tr>td',function(e){
    if($(e.target).context.localName=='td'){
        var fId=$(e.target).parent().attr('id');
        var pageNo=$('#pageNum>li.active>a').html();
        $(location).attr('href','./detail.html?Id='+fId+'&PageNum='+pageNo+'&PageSize=20');
    }else{
        e.preventDefault();
        return;
    }
});
//登录人有权限的城市，区域，板块
$('#aa').on('click',function(e){
    e.preventDefault();
    //首字母
    var strChineseFirstPY = "YDYQSXMWZSSXJBYMGCCZQPSSQBYCDSCDQLDYLYBSSJGYZZJJFKCCLZDHWDWZJLJPFYYNWJJTMYHZWZHFLZPPQHGSCYYYNJQYXXGJHHSDSJNKKTMOMLCRXYPSNQSECCQZGGLLYJLMYZZSECYKYYHQWJSSGGYXYZYJWWKDJHYCHMYXJTLXJYQBYXZLDWRDJRWYSRLDZJPCBZJJBRCFTLECZSTZFXXZHTRQHYBDLYCZSSYMMRFMYQZPWWJJYFCRWFDFZQPYDDWYXKYJAWJFFXYPSFTZYHHYZYSWCJYXSCLCXXWZZXNBGNNXBXLZSZSBSGPYSYZDHMDZBQBZCWDZZYYTZHBTSYYBZGNTNXQYWQSKBPHHLXGYBFMJEBJHHGQTJCYSXSTKZHLYCKGLYSMZXYALMELDCCXGZYRJXSDLTYZCQKCNNJWHJTZZCQLJSTSTBNXBTYXCEQXGKWJYFLZQLYHYXSPSFXLMPBYSXXXYDJCZYLLLSJXFHJXPJBTFFYABYXBHZZBJYZLWLCZGGBTSSMDTJZXPTHYQTGLJSCQFZKJZJQNLZWLSLHDZBWJNCJZYZSQQYCQYRZCJJWYBRTWPYFTWEXCSKDZCTBZHYZZYYJXZCFFZZMJYXXSDZZOTTBZLQWFCKSZSXFYRLNYJMBDTHJXSQQCCSBXYYTSYFBXDZTGBCNSLCYZZPSAZYZZSCJCSHZQYDXLBPJLLMQXTYDZXSQJTZPXLCGLQTZWJBHCTSYJSFXYEJJTLBGXSXJMYJQQPFZASYJNTYDJXKJCDJSZCBARTDCLYJQMWNQNCLLLKBYBZZSYHQQLTWLCCXTXLLZNTYLNEWYZYXCZXXGRKRMTCNDNJTSYYSSDQDGHSDBJGHRWRQLYBGLXHLGTGXBQJDZPYJSJYJCTMRNYMGRZJCZGJMZMGXMPRYXKJNYMSGMZJYMKMFXMLDTGFBHCJHKYLPFMDXLQJJSMTQGZSJLQDLDGJYCALCMZCSDJLLNXDJFFFFJCZFMZFFPFKHKGDPSXKTACJDHHZDDCRRCFQYJKQCCWJDXHWJLYLLZGCFCQDSMLZPBJJPLSBCJGGDCKKDEZSQCCKJGCGKDJTJDLZYCXKLQSCGJCLTFPCQCZGWPJDQYZJJBYJHSJDZWGFSJGZKQCCZLLPSPKJGQJHZZLJPLGJGJJTHJJYJZCZMLZLYQBGJWMLJKXZDZNJQSYZMLJLLJKYWXMKJLHSKJGBMCLYYMKXJQLBMLLKMDXXKWYXYSLMLPSJQQJQXYXFJTJDXMXXLLCXQBSYJBGWYMBGGBCYXPJYGPEPFGDJGBHBNSQJYZJKJKHXQFGQZKFHYGKHDKLLSDJQXPQYKYBNQSXQNSZSWHBSXWHXWBZZXDMNSJBSBKBBZKLYLXGWXDRWYQZMYWSJQLCJXXJXKJEQXSCYETLZHLYYYSDZPAQYZCMTLSHTZCFYZYXYLJSDCJQAGYSLCQLYYYSHMRQQKLDXZSCSSSYDYCJYSFSJBFRSSZQSBXXPXJYSDRCKGJLGDKZJZBDKTCSYQPYHSTCLDJDHMXMCGXYZHJDDTMHLTXZXYLYMOHYJCLTYFBQQXPFBDFHHTKSQHZYYWCNXXCRWHOWGYJLEGWDQCWGFJYCSNTMYTOLBYGWQWESJPWNMLRYDZSZTXYQPZGCWXHNGPYXSHMYQJXZTDPPBFYHZHTJYFDZWKGKZBLDNTSXHQEEGZZYLZMMZYJZGXZXKHKSTXNXXWYLYAPSTHXDWHZYMPXAGKYDXBHNHXKDPJNMYHYLPMGOCSLNZHKXXLPZZLBMLSFBHHGYGYYGGBHSCYAQTYWLXTZQCEZYDQDQMMHTKLLSZHLSJZWFYHQSWSCWLQAZYNYTLSXTHAZNKZZSZZLAXXZWWCTGQQTDDYZTCCHYQZFLXPSLZYGPZSZNGLNDQTBDLXGTCTAJDKYWNSYZLJHHZZCWNYYZYWMHYCHHYXHJKZWSXHZYXLYSKQYSPSLYZWMYPPKBYGLKZHTYXAXQSYSHXASMCHKDSCRSWJPWXSGZJLWWSCHSJHSQNHCSEGNDAQTBAALZZMSSTDQJCJKTSCJAXPLGGXHHGXXZCXPDMMHLDGTYBYSJMXHMRCPXXJZCKZXSHMLQXXTTHXWZFKHCCZDYTCJYXQHLXDHYPJQXYLSYYDZOZJNYXQEZYSQYAYXWYPDGXDDXSPPYZNDLTWRHXYDXZZJHTCXMCZLHPYYYYMHZLLHNXMYLLLMDCPPXHMXDKYCYRDLTXJCHHZZXZLCCLYLNZSHZJZZLNNRLWHYQSNJHXYNTTTKYJPYCHHYEGKCTTWLGQRLGGTGTYGYHPYHYLQYQGCWYQKPYYYTTTTLHYHLLTYTTSPLKYZXGZWGPYDSSZZDQXSKCQNMJJZZBXYQMJRTFFBTKHZKBXLJJKDXJTLBWFZPPTKQTZTGPDGNTPJYFALQMKGXBDCLZFHZCLLLLADPMXDJHLCCLGYHDZFGYDDGCYYFGYDXKSSEBDHYKDKDKHNAXXYBPBYYHXZQGAFFQYJXDMLJCSQZLLPCHBSXGJYNDYBYQSPZWJLZKSDDTACTBXZDYZYPJZQSJNKKTKNJDJGYYPGTLFYQKASDNTCYHBLWDZHBBYDWJRYGKZYHEYYFJMSDTYFZJJHGCXPLXHLDWXXJKYTCYKSSSMTWCTTQZLPBSZDZWZXGZAGYKTYWXLHLSPBCLLOQMMZSSLCMBJCSZZKYDCZJGQQDSMCYTZQQLWZQZXSSFPTTFQMDDZDSHDTDWFHTDYZJYQJQKYPBDJYYXTLJHDRQXXXHAYDHRJLKLYTWHLLRLLRCXYLBWSRSZZSYMKZZHHKYHXKSMDSYDYCJPBZBSQLFCXXXNXKXWYWSDZYQOGGQMMYHCDZTTFJYYBGSTTTYBYKJDHKYXBELHTYPJQNFXFDYKZHQKZBYJTZBXHFDXKDASWTAWAJLDYJSFHBLDNNTNQJTJNCHXFJSRFWHZFMDRYJYJWZPDJKZYJYMPCYZNYNXFBYTFYFWYGDBNZZZDNYTXZEMMQBSQEHXFZMBMFLZZSRXYMJGSXWZJSPRYDJSJGXHJJGLJJYNZZJXHGXKYMLPYYYCXYTWQZSWHWLYRJLPXSLSXMFSWWKLCTNXNYNPSJSZHDZEPTXMYYWXYYSYWLXJQZQXZDCLEEELMCPJPCLWBXSQHFWWTFFJTNQJHJQDXHWLBYZNFJLALKYYJLDXHHYCSTYYWNRJYXYWTRMDRQHWQCMFJDYZMHMYYXJWMYZQZXTLMRSPWWCHAQBXYGZYPXYYRRCLMPYMGKSJSZYSRMYJSNXTPLNBAPPYPYLXYYZKYNLDZYJZCZNNLMZHHARQMPGWQTZMXXMLLHGDZXYHXKYXYCJMFFYYHJFSBSSQLXXNDYCANNMTCJCYPRRNYTYQNYYMBMSXNDLYLYSLJRLXYSXQMLLYZLZJJJKYZZCSFBZXXMSTBJGNXYZHLXNMCWSCYZYFZLXBRNNNYLBNRTGZQYSATSWRYHYJZMZDHZGZDWYBSSCSKXSYHYTXXGCQGXZZSHYXJSCRHMKKBXCZJYJYMKQHZJFNBHMQHYSNJNZYBKNQMCLGQHWLZNZSWXKHLJHYYBQLBFCDSXDLDSPFZPSKJYZWZXZDDXJSMMEGJSCSSMGCLXXKYYYLNYPWWWGYDKZJGGGZGGSYCKNJWNJPCXBJJTQTJWDSSPJXZXNZXUMELPXFSXTLLXCLJXJJLJZXCTPSWXLYDHLYQRWHSYCSQYYBYAYWJJJQFWQCQQCJQGXALDBZZYJGKGXPLTZYFXJLTPADKYQHPMATLCPDCKBMTXYBHKLENXDLEEGQDYMSAWHZMLJTWYGXLYQZLJEEYYBQQFFNLYXRDSCTGJGXYYNKLLYQKCCTLHJLQMKKZGCYYGLLLJDZGYDHZWXPYSJBZKDZGYZZHYWYFQYTYZSZYEZZLYMHJJHTSMQWYZLKYYWZCSRKQYTLTDXWCTYJKLWSQZWBDCQYNCJSRSZJLKCDCDTLZZZACQQZZDDXYPLXZBQJYLZLLLQDDZQJYJYJZYXNYYYNYJXKXDAZWYRDLJYYYRJLXLLDYXJCYWYWNQCCLDDNYYYNYCKCZHXXCCLGZQJGKWPPCQQJYSBZZXYJSQPXJPZBSBDSFNSFPZXHDWZTDWPPTFLZZBZDMYYPQJRSDZSQZSQXBDGCPZSWDWCSQZGMDHZXMWWFYBPDGPHTMJTHZSMMBGZMBZJCFZWFZBBZMQCFMBDMCJXLGPNJBBXGYHYYJGPTZGZMQBQTCGYXJXLWZKYDPDYMGCFTPFXYZTZXDZXTGKMTYBBCLBJASKYTSSQYYMSZXFJEWLXLLSZBQJJJAKLYLXLYCCTSXMCWFKKKBSXLLLLJYXTYLTJYYTDPJHNHNNKBYQNFQYYZBYYESSESSGDYHFHWTCJBSDZZTFDMXHCNJZYMQWSRYJDZJQPDQBBSTJGGFBKJBXTGQHNGWJXJGDLLTHZHHYYYYYYSXWTYYYCCBDBPYPZYCCZYJPZYWCBDLFWZCWJDXXHYHLHWZZXJTCZLCDPXUJCZZZLYXJJTXPHFXWPYWXZPTDZZBDZCYHJHMLXBQXSBYLRDTGJRRCTTTHYTCZWMXFYTWWZCWJWXJYWCSKYBZSCCTZQNHXNWXXKHKFHTSWOCCJYBCMPZZYKBNNZPBZHHZDLSYDDYTYFJPXYNGFXBYQXCBHXCPSXTYZDMKYSNXSXLHKMZXLYHDHKWHXXSSKQYHHCJYXGLHZXCSNHEKDTGZXQYPKDHEXTYKCNYMYYYPKQYYYKXZLTHJQTBYQHXBMYHSQCKWWYLLHCYYLNNEQXQWMCFBDCCMLJGGXDQKTLXKGNQCDGZJWYJJLYHHQTTTNWCHMXCXWHWSZJYDJCCDBQCDGDNYXZTHCQRXCBHZTQCBXWGQWYYBXHMBYMYQTYEXMQKYAQYRGYZSLFYKKQHYSSQYSHJGJCNXKZYCXSBXYXHYYLSTYCXQTHYSMGSCPMMGCCCCCMTZTASMGQZJHKLOSQYLSWTMXSYQKDZLJQQYPLSYCZTCQQPBBQJZCLPKHQZYYXXDTDDTSJCXFFLLCHQXMJLWCJCXTSPYCXNDTJSHJWXDQQJSKXYAMYLSJHMLALYKXCYYDMNMDQMXMCZNNCYBZKKYFLMCHCMLHXRCJJHSYLNMTJZGZGYWJXSRXCWJGJQHQZDQJDCJJZKJKGDZQGJJYJYLXZXXCDQHHHEYTMHLFSBDJSYYSHFYSTCZQLPBDRFRZTZYKYWHSZYQKWDQZRKMSYNBCRXQBJYFAZPZZEDZCJYWBCJWHYJBQSZYWRYSZPTDKZPFPBNZTKLQYHBBZPNPPTYZZYBQNYDCPJMMCYCQMCYFZZDCMNLFPBPLNGQJTBTTNJZPZBBZNJKLJQYLNBZQHKSJZNGGQSZZKYXSHPZSNBCGZKDDZQANZHJKDRTLZLSWJLJZLYWTJNDJZJHXYAYNCBGTZCSSQMNJPJYTYSWXZFKWJQTKHTZPLBHSNJZSYZBWZZZZLSYLSBJHDWWQPSLMMFBJDWAQYZTCJTBNNWZXQXCDSLQGDSDPDZHJTQQPSWLYYJZLGYXYZLCTCBJTKTYCZJTQKBSJLGMGZDMCSGPYNJZYQYYKNXRPWSZXMTNCSZZYXYBYHYZAXYWQCJTLLCKJJTJHGDXDXYQYZZBYWDLWQCGLZGJGQRQZCZSSBCRPCSKYDZNXJSQGXSSJMYDNSTZTPBDLTKZWXQWQTZEXNQCZGWEZKSSBYBRTSSSLCCGBPSZQSZLCCGLLLZXHZQTHCZMQGYZQZNMCOCSZJMMZSQPJYGQLJYJPPLDXRGZYXCCSXHSHGTZNLZWZKJCXTCFCJXLBMQBCZZWPQDNHXLJCTHYZLGYLNLSZZPCXDSCQQHJQKSXZPBAJYEMSMJTZDXLCJYRYYNWJBNGZZTMJXLTBSLYRZPYLSSCNXPHLLHYLLQQZQLXYMRSYCXZLMMCZLTZSDWTJJLLNZGGQXPFSKYGYGHBFZPDKMWGHCXMSGDXJMCJZDYCABXJDLNBCDQYGSKYDQTXDJJYXMSZQAZDZFSLQXYJSJZYLBTXXWXQQZBJZUFBBLYLWDSLJHXJYZJWTDJCZFQZQZZDZSXZZQLZCDZFJHYSPYMPQZMLPPLFFXJJNZZYLSJEYQZFPFZKSYWJJJHRDJZZXTXXGLGHYDXCSKYSWMMZCWYBAZBJKSHFHJCXMHFQHYXXYZFTSJYZFXYXPZLCHMZMBXHZZSXYFYMNCWDABAZLXKTCSHHXKXJJZJSTHYGXSXYYHHHJWXKZXSSBZZWHHHCWTZZZPJXSNXQQJGZYZYWLLCWXZFXXYXYHXMKYYSWSQMNLNAYCYSPMJKHWCQHYLAJJMZXHMMCNZHBHXCLXTJPLTXYJHDYYLTTXFSZHYXXSJBJYAYRSMXYPLCKDUYHLXRLNLLSTYZYYQYGYHHSCCSMZCTZQXKYQFPYYRPFFLKQUNTSZLLZMWWTCQQYZWTLLMLMPWMBZSSTZRBPDDTLQJJBXZCSRZQQYGWCSXFWZLXCCRSZDZMCYGGDZQSGTJSWLJMYMMZYHFBJDGYXCCPSHXNZCSBSJYJGJMPPWAFFYFNXHYZXZYLREMZGZCYZSSZDLLJCSQFNXZKPTXZGXJJGFMYYYSNBTYLBNLHPFZDCYFBMGQRRSSSZXYSGTZRNYDZZCDGPJAFJFZKNZBLCZSZPSGCYCJSZLMLRSZBZZLDLSLLYSXSQZQLYXZLSKKBRXBRBZCYCXZZZEEYFGKLZLYYHGZSGZLFJHGTGWKRAAJYZKZQTSSHJJXDCYZUYJLZYRZDQQHGJZXSSZBYKJPBFRTJXLLFQWJHYLQTYMBLPZDXTZYGBDHZZRBGXHWNJTJXLKSCFSMWLSDQYSJTXKZSCFWJLBXFTZLLJZLLQBLSQMQQCGCZFPBPHZCZJLPYYGGDTGWDCFCZQYYYQYSSCLXZSKLZZZGFFCQNWGLHQYZJJCZLQZZYJPJZZBPDCCMHJGXDQDGDLZQMFGPSYTSDYFWWDJZJYSXYYCZCYHZWPBYKXRYLYBHKJKSFXTZJMMCKHLLTNYYMSYXYZPYJQYCSYCWMTJJKQYRHLLQXPSGTLYYCLJSCPXJYZFNMLRGJJTYZBXYZMSJYJHHFZQMSYXRSZCWTLRTQZSSTKXGQKGSPTGCZNJSJCQCXHMXGGZTQYDJKZDLBZSXJLHYQGGGTHQSZPYHJHHGYYGKGGCWJZZYLCZLXQSFTGZSLLLMLJSKCTBLLZZSZMMNYTPZSXQHJCJYQXYZXZQZCPSHKZZYSXCDFGMWQRLLQXRFZTLYSTCTMJCXJJXHJNXTNRZTZFQYHQGLLGCXSZSJDJLJCYDSJTLNYXHSZXCGJZYQPYLFHDJSBPCCZHJJJQZJQDYBSSLLCMYTTMQTBHJQNNYGKYRQYQMZGCJKPDCGMYZHQLLSLLCLMHOLZGDYYFZSLJCQZLYLZQJESHNYLLJXGJXLYSYYYXNBZLJSSZCQQCJYLLZLTJYLLZLLBNYLGQCHXYYXOXCXQKYJXXXYKLXSXXYQXCYKQXQCSGYXXYQXYGYTQOHXHXPYXXXULCYEYCHZZCBWQBBWJQZSCSZSSLZYLKDESJZWMYMCYTSDSXXSCJPQQSQYLYYZYCMDJDZYWCBTJSYDJKCYDDJLBDJJSODZYSYXQQYXDHHGQQYQHDYXWGMMMAJDYBBBPPBCMUUPLJZSMTXERXJMHQNUTPJDCBSSMSSSTKJTSSMMTRCPLZSZMLQDSDMJMQPNQDXCFYNBFSDQXYXHYAYKQYDDLQYYYSSZBYDSLNTFQTZQPZMCHDHCZCWFDXTMYQSPHQYYXSRGJCWTJTZZQMGWJJTJHTQJBBHWZPXXHYQFXXQYWYYHYSCDYDHHQMNMTMWCPBSZPPZZGLMZFOLLCFWHMMSJZTTDHZZYFFYTZZGZYSKYJXQYJZQBHMBZZLYGHGFMSHPZFZSNCLPBQSNJXZSLXXFPMTYJYGBXLLDLXPZJYZJYHHZCYWHJYLSJEXFSZZYWXKZJLUYDTMLYMQJPWXYHXSKTQJEZRPXXZHHMHWQPWQLYJJQJJZSZCPHJLCHHNXJLQWZJHBMZYXBDHHYPZLHLHLGFWLCHYYTLHJXCJMSCPXSTKPNHQXSRTYXXTESYJCTLSSLSTDLLLWWYHDHRJZSFGXTSYCZYNYHTDHWJSLHTZDQDJZXXQHGYLTZPHCSQFCLNJTCLZPFSTPDYNYLGMJLLYCQHYSSHCHYLHQYQTMZYPBYWRFQYKQSYSLZDQJMPXYYSSRHZJNYWTQDFZBWWTWWRXCWHGYHXMKMYYYQMSMZHNGCEPMLQQMTCWCTMMPXJPJJHFXYYZSXZHTYBMSTSYJTTQQQYYLHYNPYQZLCYZHZWSMYLKFJXLWGXYPJYTYSYXYMZCKTTWLKSMZSYLMPWLZWXWQZSSAQSYXYRHSSNTSRAPXCPWCMGDXHXZDZYFJHGZTTSBJHGYZSZYSMYCLLLXBTYXHBBZJKSSDMALXHYCFYGMQYPJYCQXJLLLJGSLZGQLYCJCCZOTYXMTMTTLLWTGPXYMZMKLPSZZZXHKQYSXCTYJZYHXSHYXZKXLZWPSQPYHJWPJPWXQQYLXSDHMRSLZZYZWTTCYXYSZZSHBSCCSTPLWSSCJCHNLCGCHSSPHYLHFHHXJSXYLLNYLSZDHZXYLSXLWZYKCLDYAXZCMDDYSPJTQJZLNWQPSSSWCTSTSZLBLNXSMNYYMJQBQHRZWTYYDCHQLXKPZWBGQYBKFCMZWPZLLYYLSZYDWHXPSBCMLJBSCGBHXLQHYRLJXYSWXWXZSLDFHLSLYNJLZYFLYJYCDRJLFSYZFSLLCQYQFGJYHYXZLYLMSTDJCYHBZLLNWLXXYGYYHSMGDHXXHHLZZJZXCZZZCYQZFNGWPYLCPKPYYPMCLQKDGXZGGWQBDXZZKZFBXXLZXJTPJPTTBYTSZZDWSLCHZHSLTYXHQLHYXXXYYZYSWTXZKHLXZXZPYHGCHKCFSYHUTJRLXFJXPTZTWHPLYXFCRHXSHXKYXXYHZQDXQWULHYHMJTBFLKHTXCWHJFWJCFPQRYQXCYYYQYGRPYWSGSUNGWCHKZDXYFLXXHJJBYZWTSXXNCYJJYMSWZJQRMHXZWFQSYLZJZGBHYNSLBGTTCSYBYXXWXYHXYYXNSQYXMQYWRGYQLXBBZLJSYLPSYTJZYHYZAWLRORJMKSCZJXXXYXCHDYXRYXXJDTSQFXLYLTSFFYXLMTYJMJUYYYXLTZCSXQZQHZXLYYXZHDNBRXXXJCTYHLBRLMBRLLAXKYLLLJLYXXLYCRYLCJTGJCMTLZLLCYZZPZPCYAWHJJFYBDYYZSMPCKZDQYQPBPCJPDCYZMDPBCYYDYCNNPLMTMLRMFMMGWYZBSJGYGSMZQQQZTXMKQWGXLLPJGZBQCDJJJFPKJKCXBLJMSWMDTQJXLDLPPBXCWRCQFBFQJCZAHZGMYKPHYYHZYKNDKZMBPJYXPXYHLFPNYYGXJDBKXNXHJMZJXSTRSTLDXSKZYSYBZXJLXYSLBZYSLHXJPFXPQNBYLLJQKYGZMCYZZYMCCSLCLHZFWFWYXZMWSXTYNXJHPYYMCYSPMHYSMYDYSHQYZCHMJJMZCAAGCFJBBHPLYZYLXXSDJGXDHKXXTXXNBHRMLYJSLTXMRHNLXQJXYZLLYSWQGDLBJHDCGJYQYCMHWFMJYBMBYJYJWYMDPWHXQLDYGPDFXXBCGJSPCKRSSYZJMSLBZZJFLJJJLGXZGYXYXLSZQYXBEXYXHGCXBPLDYHWETTWWCJMBTXCHXYQXLLXFLYXLLJLSSFWDPZSMYJCLMWYTCZPCHQEKCQBWLCQYDPLQPPQZQFJQDJHYMMCXTXDRMJWRHXCJZYLQXDYYNHYYHRSLSRSYWWZJYMTLTLLGTQCJZYABTCKZCJYCCQLJZQXALMZYHYWLWDXZXQDLLQSHGPJFJLJHJABCQZDJGTKHSSTCYJLPSWZLXZXRWGLDLZRLZXTGSLLLLZLYXXWGDZYGBDPHZPBRLWSXQBPFDWOFMWHLYPCBJCCLDMBZPBZZLCYQXLDOMZBLZWPDWYYGDSTTHCSQSCCRSSSYSLFYBFNTYJSZDFNDPDHDZZMBBLSLCMYFFGTJJQWFTMTPJWFNLBZCMMJTGBDZLQLPYFHYYMJYLSDCHDZJWJCCTLJCLDTLJJCPDDSQDSSZYBNDBJLGGJZXSXNLYCYBJXQYCBYLZCFZPPGKCXZDZFZTJJFJSJXZBNZYJQTTYJYHTYCZHYMDJXTTMPXSPLZCDWSLSHXYPZGTFMLCJTYCBPMGDKWYCYZCDSZZYHFLYCTYGWHKJYYLSJCXGYWJCBLLCSNDDBTZBSCLYZCZZSSQDLLMQYYHFSLQLLXFTYHABXGWNYWYYPLLSDLDLLBJCYXJZMLHLJDXYYQYTDLLLBUGBFDFBBQJZZMDPJHGCLGMJJPGAEHHBWCQXAXHHHZCHXYPHJAXHLPHJPGPZJQCQZGJJZZUZDMQYYBZZPHYHYBWHAZYJHYKFGDPFQSDLZMLJXKXGALXZDAGLMDGXMWZQYXXDXXPFDMMSSYMPFMDMMKXKSYZYSHDZKXSYSMMZZZMSYDNZZCZXFPLSTMZDNMXCKJMZTYYMZMZZMSXHHDCZJEMXXKLJSTLWLSQLYJZLLZJSSDPPMHNLZJCZYHMXXHGZCJMDHXTKGRMXFWMCGMWKDTKSXQMMMFZZYDKMSCLCMPCGMHSPXQPZDSSLCXKYXTWLWJYAHZJGZQMCSNXYYMMPMLKJXMHLMLQMXCTKZMJQYSZJSYSZHSYJZJCDAJZYBSDQJZGWZQQXFKDMSDJLFWEHKZQKJPEYPZYSZCDWYJFFMZZYLTTDZZEFMZLBNPPLPLPEPSZALLTYLKCKQZKGENQLWAGYXYDPXLHSXQQWQCQXQCLHYXXMLYCCWLYMQYSKGCHLCJNSZKPYZKCQZQLJPDMDZHLASXLBYDWQLWDNBQCRYDDZTJYBKBWSZDXDTNPJDTCTQDFXQQMGNXECLTTBKPWSLCTYQLPWYZZKLPYGZCQQPLLKCCYLPQMZCZQCLJSLQZDJXLDDHPZQDLJJXZQDXYZQKZLJCYQDYJPPYPQYKJYRMPCBYMCXKLLZLLFQPYLLLMBSGLCYSSLRSYSQTMXYXZQZFDZUYSYZTFFMZZSMZQHZSSCCMLYXWTPZGXZJGZGSJSGKDDHTQGGZLLBJDZLCBCHYXYZHZFYWXYZYMSDBZZYJGTSMTFXQYXQSTDGSLNXDLRYZZLRYYLXQHTXSRTZNGZXBNQQZFMYKMZJBZYMKBPNLYZPBLMCNQYZZZSJZHJCTZKHYZZJRDYZHNPXGLFZTLKGJTCTSSYLLGZRZBBQZZKLPKLCZYSSUYXBJFPNJZZXCDWXZYJXZZDJJKGGRSRJKMSMZJLSJYWQSKYHQJSXPJZZZLSNSHRNYPZTWCHKLPSRZLZXYJQXQKYSJYCZTLQZYBBYBWZPQDWWYZCYTJCJXCKCWDKKZXSGKDZXWWYYJQYYTCYTDLLXWKCZKKLCCLZCQQDZLQLCSFQCHQHSFSMQZZLNBJJZBSJHTSZDYSJQJPDLZCDCWJKJZZLPYCGMZWDJJBSJQZSYZYHHXJPBJYDSSXDZNCGLQMBTSFSBPDZDLZNFGFJGFSMPXJQLMBLGQCYYXBQKDJJQYRFKZTJDHCZKLBSDZCFJTPLLJGXHYXZCSSZZXSTJYGKGCKGYOQXJPLZPBPGTGYJZGHZQZZLBJLSQFZGKQQJZGYCZBZQTLDXRJXBSXXPZXHYZYCLWDXJJHXMFDZPFZHQHQMQGKSLYHTYCGFRZGNQXCLPDLBZCSCZQLLJBLHBZCYPZZPPDYMZZSGYHCKCPZJGSLJLNSCDSLDLXBMSTLDDFJMKDJDHZLZXLSZQPQPGJLLYBDSZGQLBZLSLKYYHZTTNTJYQTZZPSZQZTLLJTYYLLQLLQYZQLBDZLSLYYZYMDFSZSNHLXZNCZQZPBWSKRFBSYZMTHBLGJPMCZZLSTLXSHTCSYZLZBLFEQHLXFLCJLYLJQCBZLZJHHSSTBRMHXZHJZCLXFNBGXGTQJCZTMSFZKJMSSNXLJKBHSJXNTNLZDNTLMSJXGZJYJCZXYJYJWRWWQNZTNFJSZPZSHZJFYRDJSFSZJZBJFZQZZHZLXFYSBZQLZSGYFTZDCSZXZJBQMSZKJRHYJZCKMJKHCHGTXKXQGLXPXFXTRTYLXJXHDTSJXHJZJXZWZLCQSBTXWXGXTXXHXFTSDKFJHZYJFJXRZSDLLLTQSQQZQWZXSYQTWGWBZCGZLLYZBCLMQQTZHZXZXLJFRMYZFLXYSQXXJKXRMQDZDMMYYBSQBHGZMWFWXGMXLZPYYTGZYCCDXYZXYWGSYJYZNBHPZJSQSYXSXRTFYZGRHZTXSZZTHCBFCLSYXZLZQMZLMPLMXZJXSFLBYZMYQHXJSXRXSQZZZSSLYFRCZJRCRXHHZXQYDYHXSJJHZCXZBTYNSYSXJBQLPXZQPYMLXZKYXLXCJLCYSXXZZLXDLLLJJYHZXGYJWKJRWYHCPSGNRZLFZWFZZNSXGXFLZSXZZZBFCSYJDBRJKRDHHGXJLJJTGXJXXSTJTJXLYXQFCSGSWMSBCTLQZZWLZZKXJMLTMJYHSDDBXGZHDLBMYJFRZFSGCLYJBPMLYSMSXLSZJQQHJZFXGFQFQBPXZGYYQXGZTCQWYLTLGWSGWHRLFSFGZJMGMGBGTJFSYZZGZYZAFLSSPMLPFLCWBJZCLJJMZLPJJLYMQDMYYYFBGYGYZMLYZDXQYXRQQQHSYYYQXYLJTYXFSFSLLGNQCYHYCWFHCCCFXPYLYPLLZYXXXXXKQHHXSHJZCFZSCZJXCPZWHHHHHAPYLQALPQAFYHXDYLUKMZQGGGDDESRNNZLTZGCHYPPYSQJJHCLLJTOLNJPZLJLHYMHEYDYDSQYCDDHGZUNDZCLZYZLLZNTNYZGSLHSLPJJBDGWXPCDUTJCKLKCLWKLLCASSTKZZDNQNTTLYYZSSYSSZZRYLJQKCQDHHCRXRZYDGRGCWCGZQFFFPPJFZYNAKRGYWYQPQXXFKJTSZZXSWZDDFBBXTBGTZKZNPZZPZXZPJSZBMQHKCYXYLDKLJNYPKYGHGDZJXXEAHPNZKZTZCMXCXMMJXNKSZQNMNLWBWWXJKYHCPSTMCSQTZJYXTPCTPDTNNPGLLLZSJLSPBLPLQHDTNJNLYYRSZFFJFQWDPHZDWMRZCCLODAXNSSNYZRESTYJWJYJDBCFXNMWTTBYLWSTSZGYBLJPXGLBOCLHPCBJLTMXZLJYLZXCLTPNCLCKXTPZJSWCYXSFYSZDKNTLBYJCYJLLSTGQCBXRYZXBXKLYLHZLQZLNZCXWJZLJZJNCJHXMNZZGJZZXTZJXYCYYCXXJYYXJJXSSSJSTSSTTPPGQTCSXWZDCSYFPTFBFHFBBLZJCLZZDBXGCXLQPXKFZFLSYLTUWBMQJHSZBMDDBCYSCCLDXYCDDQLYJJWMQLLCSGLJJSYFPYYCCYLTJANTJJPWYCMMGQYYSXDXQMZHSZXPFTWWZQSWQRFKJLZJQQYFBRXJHHFWJJZYQAZMYFRHCYYBYQWLPEXCCZSTYRLTTDMQLYKMBBGMYYJPRKZNPBSXYXBHYZDJDNGHPMFSGMWFZMFQMMBCMZZCJJLCNUXYQLMLRYGQZCYXZLWJGCJCGGMCJNFYZZJHYCPRRCMTZQZXHFQGTJXCCJEAQCRJYHPLQLSZDJRBCQHQDYRHYLYXJSYMHZYDWLDFRYHBPYDTSSCNWBXGLPZMLZZTQSSCPJMXXYCSJYTYCGHYCJWYRXXLFEMWJNMKLLSWTXHYYYNCMMCWJDQDJZGLLJWJRKHPZGGFLCCSCZMCBLTBHBQJXQDSPDJZZGKGLFQYWBZYZJLTSTDHQHCTCBCHFLQMPWDSHYYTQWCNZZJTLBYMBPDYYYXSQKXWYYFLXXNCWCXYPMAELYKKJMZZZBRXYYQJFLJPFHHHYTZZXSGQQMHSPGDZQWBWPJHZJDYSCQWZKTXXSQLZYYMYSDZGRXCKKUJLWPYSYSCSYZLRMLQSYLJXBCXTLWDQZPCYCYKPPPNSXFYZJJRCEMHSZMSXLXGLRWGCSTLRSXBZGBZGZTCPLUJLSLYLYMTXMTZPALZXPXJTJWTCYYZLBLXBZLQMYLXPGHDSLSSDMXMBDZZSXWHAMLCZCPJMCNHJYSNSYGCHSKQMZZQDLLKABLWJXSFMOCDXJRRLYQZKJMYBYQLYHETFJZFRFKSRYXFJTWDSXXSYSQJYSLYXWJHSNLXYYXHBHAWHHJZXWMYLJCSSLKYDZTXBZSYFDXGXZJKHSXXYBSSXDPYNZWRPTQZCZENYGCXQFJYKJBZMLJCMQQXUOXSLYXXLYLLJDZBTYMHPFSTTQQWLHOKYBLZZALZXQLHZWRRQHLSTMYPYXJJXMQSJFNBXYXYJXXYQYLTHYLQYFMLKLJTMLLHSZWKZHLJMLHLJKLJSTLQXYLMBHHLNLZXQJHXCFXXLHYHJJGBYZZKBXSCQDJQDSUJZYYHZHHMGSXCSYMXFEBCQWWRBPYYJQTYZCYQYQQZYHMWFFHGZFRJFCDPXNTQYZPDYKHJLFRZXPPXZDBBGZQSTLGDGYLCQMLCHHMFYWLZYXKJLYPQHSYWMQQGQZMLZJNSQXJQSYJYCBEHSXFSZPXZWFLLBCYYJDYTDTHWZSFJMQQYJLMQXXLLDTTKHHYBFPWTYYSQQWNQWLGWDEBZWCMYGCULKJXTMXMYJSXHYBRWFYMWFRXYQMXYSZTZZTFYKMLDHQDXWYYNLCRYJBLPSXCXYWLSPRRJWXHQYPHTYDNXHHMMYWYTZCSQMTSSCCDALWZTCPQPYJLLQZYJSWXMZZMMYLMXCLMXCZMXMZSQTZPPQQBLPGXQZHFLJJHYTJSRXWZXSCCDLXTYJDCQJXSLQYCLZXLZZXMXQRJMHRHZJBHMFLJLMLCLQNLDXZLLLPYPSYJYSXCQQDCMQJZZXHNPNXZMEKMXHYKYQLXSXTXJYYHWDCWDZHQYYBGYBCYSCFGPSJNZDYZZJZXRZRQJJYMCANYRJTLDPPYZBSTJKXXZYPFDWFGZZRPYMTNGXZQBYXNBUFNQKRJQZMJEGRZGYCLKXZDSKKNSXKCLJSPJYYZLQQJYBZSSQLLLKJXTBKTYLCCDDBLSPPFYLGYDTZJYQGGKQTTFZXBDKTYYHYBBFYTYYBCLPDYTGDHRYRNJSPTCSNYJQHKLLLZSLYDXXWBCJQSPXBPJZJCJDZFFXXBRMLAZHCSNDLBJDSZBLPRZTSWSBXBCLLXXLZDJZSJPYLYXXYFTFFFBHJJXGBYXJPMMMPSSJZJMTLYZJXSWXTYLEDQPJMYGQZJGDJLQJWJQLLSJGJGYGMSCLJJXDTYGJQJQJCJZCJGDZZSXQGSJGGCXHQXSNQLZZBXHSGZXCXYLJXYXYYDFQQJHJFXDHCTXJYRXYSQTJXYEFYYSSYYJXNCYZXFXMSYSZXYYSCHSHXZZZGZZZGFJDLTYLNPZGYJYZYYQZPBXQBDZTZCZYXXYHHSQXSHDHGQHJHGYWSZTMZMLHYXGEBTYLZKQWYTJZRCLEKYSTDBCYKQQSAYXCJXWWGSBHJYZYDHCSJKQCXSWXFLTYNYZPZCCZJQTZWJQDZZZQZLJJXLSBHPYXXPSXSHHEZTXFPTLQYZZXHYTXNCFZYYHXGNXMYWXTZSJPTHHGYMXMXQZXTSBCZYJYXXTYYZYPCQLMMSZMJZZLLZXGXZAAJZYXJMZXWDXZSXZDZXLEYJJZQBHZWZZZQTZPSXZTDSXJJJZNYAZPHXYYSRNQDTHZHYYKYJHDZXZLSWCLYBZYECWCYCRYLCXNHZYDZYDYJDFRJJHTRSQTXYXJRJHOJYNXELXSFSFJZGHPZSXZSZDZCQZBYYKLSGSJHCZSHDGQGXYZGXCHXZJWYQWGYHKSSEQZZNDZFKWYSSTCLZSTSYMCDHJXXYWEYXCZAYDMPXMDSXYBSQMJMZJMTZQLPJYQZCGQHXJHHLXXHLHDLDJQCLDWBSXFZZYYSCHTYTYYBHECXHYKGJPXHHYZJFXHWHBDZFYZBCAPNPGNYDMSXHMMMMAMYNBYJTMPXYYMCTHJBZYFCGTYHWPHFTWZZEZSBZEGPFMTSKFTYCMHFLLHGPZJXZJGZJYXZSBBQSCZZLZCCSTPGXMJSFTCCZJZDJXCYBZLFCJSYZFGSZLYBCWZZBYZDZYPSWYJZXZBDSYUXLZZBZFYGCZXBZHZFTPBGZGEJBSTGKDMFHYZZJHZLLZZGJQZLSFDJSSCBZGPDLFZFZSZYZYZSYGCXSNXXCHCZXTZZLJFZGQSQYXZJQDCCZTQCDXZJYQJQCHXZTDLGSCXZSYQJQTZWLQDQZTQCHQQJZYEZZZPBWKDJFCJPZTYPQYQTTYNLMBDKTJZPQZQZZFPZSBNJLGYJDXJDZZKZGQKXDLPZJTCJDQBXDJQJSTCKNXBXZMSLYJCQMTJQWWCJQNJNLLLHJCWQTBZQYDZCZPZZDZYDDCYZZZCCJTTJFZDPRRTZTJDCQTQZDTJNPLZBCLLCTZSXKJZQZPZLBZRBTJDCXFCZDBCCJJLTQQPLDCGZDBBZJCQDCJWYNLLZYZCCDWLLXWZLXRXNTQQCZXKQLSGDFQTDDGLRLAJJTKUYMKQLLTZYTDYYCZGJWYXDXFRSKSTQTENQMRKQZHHQKDLDAZFKYPBGGPZREBZZYKZZSPEGJXGYKQZZZSLYSYYYZWFQZYLZZLZHWCHKYPQGNPGBLPLRRJYXCCSYYHSFZFYBZYYTGZXYLXCZWXXZJZBLFFLGSKHYJZEYJHLPLLLLCZGXDRZELRHGKLZZYHZLYQSZZJZQLJZFLNBHGWLCZCFJYSPYXZLZLXGCCPZBLLCYBBBBUBBCBPCRNNZCZYRBFSRLDCGQYYQXYGMQZWTZYTYJXYFWTEHZZJYWLCCNTZYJJZDEDPZDZTSYQJHDYMBJNYJZLXTSSTPHNDJXXBYXQTZQDDTJTDYYTGWSCSZQFLSHLGLBCZPHDLYZJYCKWTYTYLBNYTSDSYCCTYSZYYEBHEXHQDTWNYGYCLXTSZYSTQMYGZAZCCSZZDSLZCLZRQXYYELJSBYMXSXZTEMBBLLYYLLYTDQYSHYMRQWKFKBFXNXSBYCHXBWJYHTQBPBSBWDZYLKGZSKYHXQZJXHXJXGNLJKZLYYCDXLFYFGHLJGJYBXQLYBXQPQGZTZPLNCYPXDJYQYDYMRBESJYYHKXXSTMXRCZZYWXYQYBMCLLYZHQYZWQXDBXBZWZMSLPDMYSKFMZKLZCYQYCZLQXFZZYDQZPZYGYJYZMZXDZFYFYTTQTZHGSPCZMLCCYTZXJCYTJMKSLPZHYSNZLLYTPZCTZZCKTXDHXXTQCYFKSMQCCYYAZHTJPCYLZLYJBJXTPNYLJYYNRXSYLMMNXJSMYBCSYSYLZYLXJJQYLDZLPQBFZZBLFNDXQKCZFYWHGQMRDSXYCYTXNQQJZYYPFZXDYZFPRXEJDGYQBXRCNFYYQPGHYJDYZXGRHTKYLNWDZNTSMPKLBTHBPYSZBZTJZSZZJTYYXZPHSSZZBZCZPTQFZMYFLYPYBBJQXZMXXDJMTSYSKKBJZXHJCKLPSMKYJZCXTMLJYXRZZQSLXXQPYZXMKYXXXJCLJPRMYYGADYSKQLSNDHYZKQXZYZTCGHZTLMLWZYBWSYCTBHJHJFCWZTXWYTKZLXQSHLYJZJXTMPLPYCGLTBZZTLZJCYJGDTCLKLPLLQPJMZPAPXYZLKKTKDZCZZBNZDYDYQZJYJGMCTXLTGXSZLMLHBGLKFWNWZHDXUHLFMKYSLGXDTWWFRJEJZTZHYDXYKSHWFZCQSHKTMQQHTZHYMJDJSKHXZJZBZZXYMPAGQMSTPXLSKLZYNWRTSQLSZBPSPSGZWYHTLKSSSWHZZLYYTNXJGMJSZSUFWNLSOZTXGXLSAMMLBWLDSZYLAKQCQCTMYCFJBSLXCLZZCLXXKSBZQCLHJPSQPLSXXCKSLNHPSFQQYTXYJZLQLDXZQJZDYYDJNZPTUZDSKJFSLJHYLZSQZLBTXYDGTQFDBYAZXDZHZJNHHQBYKNXJJQCZMLLJZKSPLDYCLBBLXKLELXJLBQYCXJXGCNLCQPLZLZYJTZLJGYZDZPLTQCSXFDMNYCXGBTJDCZNBGBQYQJWGKFHTNPYQZQGBKPBBYZMTJDYTBLSQMPSXTBNPDXKLEMYYCJYNZCTLDYKZZXDDXHQSHDGMZSJYCCTAYRZLPYLTLKXSLZCGGEXCLFXLKJRTLQJAQZNCMBYDKKCXGLCZJZXJHPTDJJMZQYKQSECQZDSHHADMLZFMMZBGNTJNNLGBYJBRBTMLBYJDZXLCJLPLDLPCQDHLXZLYCBLCXZZJADJLNZMMSSSMYBHBSQKBHRSXXJMXSDZNZPXLGBRHWGGFCXGMSKLLTSJYYCQLTSKYWYYHYWXBXQYWPYWYKQLSQPTNTKHQCWDQKTWPXXHCPTHTWUMSSYHBWCRWXHJMKMZNGWTMLKFGHKJYLSYYCXWHYECLQHKQHTTQKHFZLDXQWYZYYDESBPKYRZPJFYYZJCEQDZZDLATZBBFJLLCXDLMJSSXEGYGSJQXCWBXSSZPDYZCXDNYXPPZYDLYJCZPLTXLSXYZYRXCYYYDYLWWNZSAHJSYQYHGYWWAXTJZDAXYSRLTDPSSYYFNEJDXYZHLXLLLZQZSJNYQYQQXYJGHZGZCYJCHZLYCDSHWSHJZYJXCLLNXZJJYYXNFXMWFPYLCYLLABWDDHWDXJMCXZTZPMLQZHSFHZYNZTLLDYWLSLXHYMMYLMBWWKYXYADTXYLLDJPYBPWUXJMWMLLSAFDLLYFLBHHHBQQLTZJCQJLDJTFFKMMMBYTHYGDCQRDDWRQJXNBYSNWZDBYYTBJHPYBYTTJXAAHGQDQTMYSTQXKBTZPKJLZRBEQQSSMJJBDJOTGTBXPGBKTLHQXJJJCTHXQDWJLWRFWQGWSHCKRYSWGFTGYGBXSDWDWRFHWYTJJXXXJYZYSLPYYYPAYXHYDQKXSHXYXGSKQHYWFDDDPPLCJLQQEEWXKSYYKDYPLTJTHKJLTCYYHHJTTPLTZZCDLTHQKZXQYSTEEYWYYZYXXYYSTTJKLLPZMCYHQGXYHSRMBXPLLNQYDQHXSXXWGDQBSHYLLPJJJTHYJKYPPTHYYKTYEZYENMDSHLCRPQFDGFXZPSFTLJXXJBSWYYSKSFLXLPPLBBBLBSFXFYZBSJSSYLPBBFFFFSSCJDSTZSXZRYYSYFFSYZYZBJTBCTSBSDHRTJJBYTCXYJEYLXCBNEBJDSYXYKGSJZBXBYTFZWGENYHHTHZHHXFWGCSTBGXKLSXYWMTMBYXJSTZSCDYQRCYTWXZFHMYMCXLZNSDJTTTXRYCFYJSBSDYERXJLJXBBDEYNJGHXGCKGSCYMBLXJMSZNSKGXFBNBPTHFJAAFXYXFPXMYPQDTZCXZZPXRSYWZDLYBBKTYQPQJPZYPZJZNJPZJLZZFYSBTTSLMPTZRTDXQSJEHBZYLZDHLJSQMLHTXTJECXSLZZSPKTLZKQQYFSYGYWPCPQFHQHYTQXZKRSGTTSQCZLPTXCDYYZXSQZSLXLZMYCPCQBZYXHBSXLZDLTCDXTYLZJYYZPZYZLTXJSJXHLPMYTXCQRBLZSSFJZZTNJYTXMYJHLHPPLCYXQJQQKZZSCPZKSWALQSBLCCZJSXGWWWYGYKTJBBZTDKHXHKGTGPBKQYSLPXPJCKBMLLXDZSTBKLGGQKQLSBKKTFXRMDKBFTPZFRTBBRFERQGXYJPZSSTLBZTPSZQZSJDHLJQLZBPMSMMSXLQQNHKNBLRDDNXXDHDDJCYYGYLXGZLXSYGMQQGKHBPMXYXLYTQWLWGCPBMQXCYZYDRJBHTDJYHQSHTMJSBYPLWHLZFFNYPMHXXHPLTBQPFBJWQDBYGPNZTPFZJGSDDTQSHZEAWZZYLLTYYBWJKXXGHLFKXDJTMSZSQYNZGGSWQSPHTLSSKMCLZXYSZQZXNCJDQGZDLFNYKLJCJLLZLMZZNHYDSSHTHZZLZZBBHQZWWYCRZHLYQQJBEYFXXXWHSRXWQHWPSLMSSKZTTYGYQQWRSLALHMJTQJSMXQBJJZJXZYZKXBYQXBJXSHZTSFJLXMXZXFGHKZSZGGYLCLSARJYHSLLLMZXELGLXYDJYTLFBHBPNLYZFBBHPTGJKWETZHKJJXZXXGLLJLSTGSHJJYQLQZFKCGNNDJSSZFDBCTWWSEQFHQJBSAQTGYPQLBXBMMYWXGSLZHGLZGQYFLZBYFZJFRYSFMBYZHQGFWZSYFYJJPHZBYYZFFWODGRLMFTWLBZGYCQXCDJYGZYYYYTYTYDWEGAZYHXJLZYYHLRMGRXXZCLHNELJJTJTPWJYBJJBXJJTJTEEKHWSLJPLPSFYZPQQBDLQJJTYYQLYZKDKSQJYYQZLDQTGJQYZJSUCMRYQTHTEJMFCTYHYPKMHYZWJDQFHYYXWSHCTXRLJHQXHCCYYYJLTKTTYTMXGTCJTZAYYOCZLYLBSZYWJYTSJYHBYSHFJLYGJXXTMZYYLTXXYPZLXYJZYZYYPNHMYMDYYLBLHLSYYQQLLNJJYMSOYQBZGDLYXYLCQYXTSZEGXHZGLHWBLJHEYXTWQMAKBPQCGYSHHEGQCMWYYWLJYJHYYZLLJJYLHZYHMGSLJLJXCJJYCLYCJPCPZJZJMMYLCQLNQLJQJSXYJMLSZLJQLYCMMHCFMMFPQQMFYLQMCFFQMMMMHMZNFHHJGTTHHKHSLNCHHYQDXTMMQDCYZYXYQMYQYLTDCYYYZAZZCYMZYDLZFFFMMYCQZWZZMABTBYZTDMNZZGGDFTYPCGQYTTSSFFWFDTZQSSYSTWXJHXYTSXXYLBYQHWWKXHZXWZNNZZJZJJQJCCCHYYXBZXZCYZTLLCQXYNJYCYYCYNZZQYYYEWYCZDCJYCCHYJLBTZYYCQWMPWPYMLGKDLDLGKQQBGYCHJXY";
//此处收录了375个多音字
    var oMultiDiff = {
        "19969": "DZ",
        "19975": "WM",
        "19988": "QJ",
        "20048": "YL",
        "20056": "SC",
        "20060": "NM",
        "20094": "QG",
        "20127": "QJ",
        "20167": "QC",
        "20193": "YG",
        "20250": "KH",
        "20256": "ZC",
        "20282": "SC",
        "20285": "QJG",
        "20291": "TD",
        "20314": "YD",
        "20340": "NE",
        "20375": "TD",
        "20389": "YJ",
        "20391": "CZ",
        "20415": "PB",
        "20446": "YS",
        "20447": "SQ",
        "20504": "TC",
        "20608": "KG",
        "20854": "QJ",
        "20857": "ZC",
        "20911": "PF",
        "20504": "TC",
        "20608": "KG",
        "20854": "QJ",
        "20857": "ZC",
        "20911": "PF",
        "20985": "AW",
        "21032": "PB",
        "21048": "XQ",
        "21049": "SC",
        "21089": "YS",
        "21119": "JC",
        "21242": "SB",
        "21273": "SC",
        "21305": "YP",
        "21306": "QO",
        "21330": "ZC",
        "21333": "SDC",
        "21345": "QK",
        "21378": "CA",
        "21397": "SC",
        "21414": "XS",
        "21442": "SC",
        "21477": "JG",
        "21480": "TD",
        "21484": "ZS",
        "21494": "YX",
        "21505": "YX",
        "21512": "HG",
        "21523": "XH",
        "21537": "PB",
        "21542": "PF",
        "21549": "KH",
        "21571": "E",
        "21574": "DA",
        "21588": "TD",
        "21589": "O",
        "21618": "ZC",
        "21621": "KHA",
        "21632": "ZJ",
        "21654": "KG",
        "21679": "LKG",
        "21683": "KH",
        "21710": "A",
        "21719": "YH",
        "21734": "WOE",
        "21769": "A",
        "21780": "WN",
        "21804": "XH",
        "21834": "A",
        "21899": "ZD",
        "21903": "RN",
        "21908": "WO",
        "21939": "ZC",
        "21956": "SA",
        "21964": "YA",
        "21970": "TD",
        "22003": "A",
        "22031": "JG",
        "22040": "XS",
        "22060": "ZC",
        "22066": "ZC",
        "22079": "MH",
        "22129": "XJ",
        "22179": "XA",
        "22237": "NJ",
        "22244": "TD",
        "22280": "JQ",
        "22300": "YH",
        "22313": "XW",
        "22331": "YQ",
        "22343": "YJ",
        "22351": "PH",
        "22395": "DC",
        "22412": "TD",
        "22484": "PB",
        "22500": "PB",
        "22534": "ZD",
        "22549": "DH",
        "22561": "PB",
        "22612": "TD",
        "22771": "KQ",
        "22831": "HB",
        "22841": "JG",
        "22855": "QJ",
        "22865": "XQ",
        "23013": "ML",
        "23081": "WM",
        "23487": "SX",
        "23558": "QJ",
        "23561": "YW",
        "23586": "YW",
        "23614": "YW",
        "23615": "SN",
        "23631": "PB",
        "23646": "ZS",
        "23663": "ZT",
        "23673": "YG",
        "23762": "TD",
        "23769": "ZS",
        "23780": "QJ",
        "23884": "QK",
        "24055": "XH",
        "24113": "DC",
        "24162": "ZC",
        "24191": "GA",
        "24273": "QJ",
        "24324": "NL",
        "24377": "TD",
        "24378": "QJ",
        "24439": "PF",
        "24554": "ZS",
        "24683": "TD",
        "24694": "WE",
        "24733": "LK",
        "24925": "TN",
        "25094": "ZG",
        "25100": "XQ",
        "25103": "XH",
        "25153": "PB",
        "25170": "PB",
        "25179": "KG",
        "25203": "PB",
        "25240": "ZS",
        "25282": "FB",
        "25303": "NA",
        "25324": "KG",
        "25341": "ZY",
        "25373": "WZ",
        "25375": "XJ",
        "25384": "A",
        "25457": "A",
        "25528": "SD",
        "25530": "SC",
        "25552": "TD",
        "25774": "ZC",
        "25874": "ZC",
        "26044": "YW",
        "26080": "WM",
        "26292": "PB",
        "26333": "PB",
        "26355": "ZY",
        "26366": "CZ",
        "26397": "ZC",
        "26399": "QJ",
        "26415": "ZS",
        "26451": "SB",
        "26526": "ZC",
        "26552": "JG",
        "26561": "TD",
        "26588": "JG",
        "26597": "CZ",
        "26629": "ZS",
        "26638": "YL",
        "26646": "XQ",
        "26653": "KG",
        "26657": "XJ",
        "26727": "HG",
        "26894": "ZC",
        "26937": "ZS",
        "26946": "ZC",
        "26999": "KJ",
        "27099": "KJ",
        "27449": "YQ",
        "27481": "XS",
        "27542": "ZS",
        "27663": "ZS",
        "27748": "TS",
        "27784": "SC",
        "27788": "ZD",
        "27795": "TD",
        "27812": "O",
        "27850": "PB",
        "27852": "MB",
        "27895": "SL",
        "27898": "PL",
        "27973": "QJ",
        "27981": "KH",
        "27986": "HX",
        "27994": "XJ",
        "28044": "YC",
        "28065": "WG",
        "28177": "SM",
        "28267": "QJ",
        "28291": "KH",
        "28337": "ZQ",
        "28463": "TL",
        "28548": "DC",
        "28601": "TD",
        "28689": "PB",
        "28805": "JG",
        "28820": "QG",
        "28846": "PB",
        "28952": "TD",
        "28975": "ZC",
        "29100": "A",
        "29325": "QJ",
        "29575": "SL",
        "29602": "FB",
        "30010": "TD",
        "30044": "CX",
        "30058": "PF",
        "30091": "YSP",
        "30111": "YN",
        "30229": "XJ",
        "30427": "SC",
        "30465": "SX",
        "30631": "YQ",
        "30655": "QJ",
        "30684": "QJG",
        "30707": "SD",
        "30729": "XH",
        "30796": "LG",
        "30917": "PB",
        "31074": "NM",
        "31085": "JZ",
        "31109": "SC",
        "31181": "ZC",
        "31192": "MLB",
        "31293": "JQ",
        "31400": "YX",
        "31584": "YJ",
        "31896": "ZN",
        "31909": "ZY",
        "31995": "XJ",
        "32321": "PF",
        "32327": "ZY",
        "32418": "HG",
        "32420": "XQ",
        "32421": "HG",
        "32438": "LG",
        "32473": "GJ",
        "32488": "TD",
        "32521": "QJ",
        "32527": "PB",
        "32562": "ZSQ",
        "32564": "JZ",
        "32735": "ZD",
        "32793": "PB",
        "33071": "PF",
        "33098": "XL",
        "33100": "YA",
        "33152": "PB",
        "33261": "CX",
        "33324": "BP",
        "33333": "TD",
        "33406": "YA",
        "33426": "WM",
        "33432": "PB",
        "33445": "JG",
        "33486": "ZN",
        "33493": "TS",
        "33507": "QJ",
        "33540": "QJ",
        "33544": "ZC",
        "33564": "XQ",
        "33617": "YT",
        "33632": "QJ",
        "33636": "XH",
        "33637": "YX",
        "33694": "WG",
        "33705": "PF",
        "33728": "YW",
        "33882": "SR",
        "34067": "WM",
        "34074": "YW",
        "34121": "QJ",
        "34255": "ZC",
        "34259": "XL",
        "34425": "JH",
        "34430": "XH",
        "34485": "KH",
        "34503": "YS",
        "34532": "HG",
        "34552": "XS",
        "34558": "YE",
        "34593": "ZL",
        "34660": "YQ",
        "34892": "XH",
        "34928": "SC",
        "34999": "QJ",
        "35048": "PB",
        "35059": "SC",
        "35098": "ZC",
        "35203": "TQ",
        "35265": "JX",
        "35299": "JX",
        "35782": "SZ",
        "35828": "YS",
        "35830": "E",
        "35843": "TD",
        "35895": "YG",
        "35977": "MH",
        "36158": "JG",
        "36228": "QJ",
        "36426": "XQ",
        "36466": "DC",
        "36710": "JC",
        "36711": "ZYG",
        "36767": "PB",
        "36866": "SK",
        "36951": "YW",
        "37034": "YX",
        "37063": "XH",
        "37218": "ZC",
        "37325": "ZC",
        "38063": "PB",
        "38079": "TD",
        "38085": "QY",
        "38107": "DC",
        "38116": "TD",
        "38123": "YD",
        "38224": "HG",
        "38241": "XTC",
        "38271": "ZC",
        "38415": "YE",
        "38426": "KH",
        "38461": "YD",
        "38463": "AE",
        "38466": "PB",
        "38477": "XJ",
        "38518": "YT",
        "38551": "WK",
        "38585": "ZC",
        "38704": "XS",
        "38739": "LJ",
        "38761": "GJ",
        "38808": "SQ",
        "39048": "JG",
        "39049": "XJ",
        "39052": "HG",
        "39076": "CZ",
        "39271": "XT",
        "39534": "TD",
        "39552": "TD",
        "39584": "PB",
        "39647": "SB",
        "39730": "LG",
        "39748": "TPB",
        "40109": "ZQ",
        "40479": "ND",
        "40516": "HG",
        "40536": "HG",
        "40583": "QJ",
        "40765": "YQ",
        "40784": "QJ",
        "40840": "YK",
        "40863": "QJG"
    };
//参数,中文字符串
//返回值:拼音首字母串数组
    function makePy(str) {
        if (typeof(str) != "string")
            throw new Error(-1, "函数makePy需要字符串类型参数!");
        var arrResult = new Array(); //保存中间结果的数组
        for (var i = 0, len = str.length; i < len; i++) {
//获得unicode码
            var ch = str.charAt(i);
//检查该unicode码是否在处理范围之内,在则返回该码对映汉字的拼音首字母,不在则调用其它函数处理
            arrResult.push(checkCh(ch));
        }
//处理arrResult,返回所有可能的拼音首字母串数组
        return mkRslt(arrResult);
    }

    function checkCh(ch) {
        var uni = ch.charCodeAt(0);
//如果不在汉字处理范围之内,返回原字符,也可以调用自己的处理函数
        if (uni > 40869 || uni < 19968)
            return ch; //dealWithOthers(ch);
//检查是否是多音字,是按多音字处理,不是就直接在strChineseFirstPY字符串中找对应的首字母
        return (oMultiDiff[uni] ? oMultiDiff[uni] : (strChineseFirstPY.charAt(uni - 19968)));
    }

    function mkRslt(arr) {
        var arrRslt = [""];
        for (var i = 0, len = arr.length; i < len; i++) {
            var str = arr[i];
            var strlen = str.length;
            if (strlen == 1) {
                for (var k = 0; k < arrRslt.length; k++) {
                    arrRslt[k] += str;
                }
            } else {
                var tmpArr = arrRslt.slice(0);
                arrRslt = [];
                for (k = 0; k < strlen; k++) {
//复制一个相同的arrRslt
                    var tmp = tmpArr.slice(0);
//把当前字符str[k]添加到每个元素末尾
                    for (var j = 0; j < tmp.length; j++) {
                        tmp[j] += str.charAt(k);
                    }
//把复制并修改后的数组连接到arrRslt上
                    arrRslt = arrRslt.concat(tmp);
                }
            }
        }
        return arrRslt;
    }

//两端去空格函数
    String.prototype.trim = function () {
        return this.replace(/(^\s*)|(\s*$)/g, "");
    };
    //判断登录人是否属于营运中心
    if(3>2){
        var citiesHtml = '', limitCity;
        //城市内容动态添加
        citiesHtml += `
         <li class="city"><a href="#" id="1">上海</a></li>
         <li class="city"><a href="#" id="4">杭州</a></li>
         <li class="city"><a href="#" id="3">苏州</a></li>
         <li class="city"><a href="#" id="10">无锡</a></li>
         <li class="city"><a href="#" id="11">南通</a></li>
         <li class="city"><a href="#" id="398">宁波</a></li>
         <li class="city"><a href="#" id="14">南京</a></li>
         <li class="city"><a href="#" id="9">常州</a></li>
         <li class="city"><a href="#" id="39">马鞍山</a></li>
         <li class="city"><a href="#" id="60">滁州</a></li>
         <li class="city"><a href="#" id="180">绍兴</a></li>
         <li class="city"><a href="#" id="190">厦门</a></li>
         <li class="city"><a href="#" id="519">漳州</a></li>
         <li class="city"><a href="#" id="544">诸暨</a></li>
                        `;
        var allHtml = `
                      <li class="all active"><a href="#">不限</a></li>
                    `;
        $('#limit').html(allHtml + citiesHtml);
        //热门城市一行定14个，超过的默认隐藏
        if ($('#limit>li.city').size() > 14) {
            $('#limit>li.city:gt(13)').css('display', 'none');
        }else{
            $('#more li.extend').hide();
        }
        //城市超链接的点击事件
        $('#limit').on('click', 'li.city>a', function (e) {
            var navHtml = `
                          <a href="http://www.xtco.cn/">轩天实业&gt;</a><a href="index.jsp">项目开发&gt;</a><a href="#">${$(e.target).html()}</a>
                        `;
            $('section>p').html(navHtml);
            e.preventDefault();
            $('#more>ul.total').css('display', 'block');//区域显示
            $('#plate').hide();
        });
        //异步请求区域数据
        $('#limit').on('click', 'li.city>a', function (e) {
            e.preventDefault();
            var cityId=$(e.target).attr('id');
            $.ajax({
                url:initUrl+'AreaBorough.do',
                type:'POST',
                data:{
                    "CityID":cityId//城市id
                },
                success:function(data){
                    //console.log(data);
                    //区域内容动态添加
                    var boroughHtml='',limitBorough;
                    limitBorough=data.AreaBorough;
                    if(!limitBorough){
                        return;
                    }
                    $.each(limitBorough, function (i) {
                        boroughHtml += `
                           <li class="borough"><a href="#" id="${limitBorough[i].ID}">${limitBorough[i].BoroughName}</a></li>
                         `;
                    });
                    var allHtml = `
                  <li class="active"><a href="#" class="all">全部</a></li>
                `;
                    $('#borough').html(allHtml + boroughHtml);
                    //板块的显示与隐藏
                    $('#borough').on('click', 'li.borough>a', function (e) {
                        e.preventDefault();
                        var city = $('#limit>li.active>a').html();
                        var navHtml = `
                          <a href="http://www.xtco.cn/">轩天实业&gt;</a><a href="./index.jsp">项目开发&gt;</a>
                          <a href="#">${city}&gt;</a><a href="#">${$(e.target).html()}</a>
                        `;
                        $('section>p').html(navHtml);
                        $('#plate').show();
                    });
                },
                error:function(){
                    alert('服务器内部出错了')
                }
            });
        });
        //板块内容的动态生成
        $('#borough').on('click', 'li.borough>a', function (e) {
            e.preventDefault();
            //获取鼠标相对文档点击坐标，实现板块框可变移动
            scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
            scrollY = document.documentElement.scrollTop || document.body.scrollTop;
            x = e.pageX + 33 + 'px' || e.clientX + scrollX + 33 + 'px';
            y = e.pageY - 30 + 'px' || e.clientY + scrollY - 30 + 'px';
            if (parseFloat(x) > 735) {
                $('#plate>.caret-left').hide();
                $('#plate>.caret-right').show();
                x = e.pageX + 33 - 656 + 'px' || e.clientX + scrollX + 33 - 656 + 'px';
            } else {
                $('#plate>.caret-left').show();
                $('#plate>.caret-right').hide();
            }
            //固定板块弹出框的上下位置
            if (parseFloat(y) > 254 && parseFloat(y) < 268) {
                y = 262 + 'px';
            } else if (parseFloat(y) > 284 && parseFloat(y) < 297) {
                y = 290 + 'px';
            }
            $('#plate').css({
                left: x,
                top: y
            });
            var boroughId=$(e.target).attr('id');//区域id
            $.ajax({
                url:initUrl+'AreaPlate.do',
                type:'POST',
                data:{
                    "BoroughID":boroughId//板块id
                },
                success:function(data){
                    var limitPlate, AHtml = '', BHtml = '', CHtml = '', DHtml = '', EHtml = '', FHtml = '', GHtml = '', HHtml = '', IHtml = '', JHtml = '', KHtml = '', LHtml = '', MHtml = '', NHtml = '', OHtml = '', PHtml = '', QHtml = '', RHtml = '', SHtml = '', THtml = '', UHtml = '', VHtml = '', WHtml = '', XHtml = '', YHtml = '', ZHtml = '';
                    var aHtml = '<li class="plate"><span>A</span></li>';
                    var bHtml = '<li class="plate"><span>B</span></li>';
                    var cHtml = '<li class="plate"><span>C</span></li>';
                    var dHtml = '<li class="plate"><span>D</span></li>';
                    var eHtml = '<li class="plate"><span>E</span></li>';
                    var fHtml = '<li class="plate"><span>F</span></li>';
                    var gHtml = '<li class="plate"><span>G</span></li>';
                    var hHtml = '<li class="plate"><span>H</span></li>';
                    var iHtml = '<li class="plate"><span>I</span></li>';
                    var jHtml = '<li class="plate"><span>J</span></li>';
                    var kHtml = '<li class="plate"><span>K</span></li>';
                    var lHtml = '<li class="plate"><span>L</span></li>';
                    var mHtml = '<li class="plate"><span>M</span></li>';
                    var nHtml = '<li class="plate"><span>N</span></li>';
                    var oHtml = '<li class="plate"><span>O</span></li>';
                    var pHtml = '<li class="plate"><span>P</span></li>';
                    var qHtml = '<li class="plate"><span>Q</span></li>';
                    var rHtml = '<li class="plate"><span>R</span></li>';
                    var sHtml = '<li class="plate"><span>S</span></li>';
                    var tHtml = '<li class="plate"><span>T</span></li>';
                    var uHtml = '<li class="plate"><span>U</span></li>';
                    var vHtml = '<li class="plate"><span>V</span></li>';
                    var wHtml = '<li class="plate"><span>W</span></li>';
                    var xHtml = '<li class="plate"><span>X</span></li>';
                    var yHtml = '<li class="plate"><span>Y</span></li>';
                    var zHtml = '<li class="plate"><span>Z</span></li>';
                    limitPlate=data.AreaPlate;
                    if(!limitPlate){
                        return;
                    }
                    $.each(limitPlate, function (i) {
                        var str = limitPlate[i].PlateName.trim();
                        if (str == "") return;
                        var arrRslt = makePy(str);
                        var firstWord = arrRslt[0].slice(0, 1);
                        if (firstWord == 'A') {
                            AHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].ID}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'B') {
                            BHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].ID}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'C') {
                            CHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].ID}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'D') {
                            DHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].ID}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'E') {
                            EHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].ID}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'F') {
                            FHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].ID}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'G') {
                            GHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].ID}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'H') {
                            HHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].ID}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'I') {
                            IHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].ID}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'J') {
                            JHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].ID}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'K') {
                            KHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].ID}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'L') {
                            LHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].ID}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'M') {
                            MHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].ID}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'N') {
                            NHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].ID}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'O') {
                            OHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].ID}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'P') {
                            PHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].ID}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'Q') {
                            QHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].ID}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'R') {
                            RHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].ID}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'S') {
                            SHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].ID}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'T') {
                            THtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].ID}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'U') {
                            UHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].ID}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'V') {
                            VHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].ID}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'W') {
                            WHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].ID}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'X') {
                            XHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].ID}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'Y') {
                            YHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].ID}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'Z') {
                            ZHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].ID}">${limitPlate[i].PlateName}</a></li>
                        `;
                        }
                    });
                    var allHtml = `
                     <li class="active"><a href="#" class="all">全部</a></li>
                `;
                    if (AHtml == '') {
                        aHtml = '';
                    }
                    if (BHtml == '') {
                        bHtml = '';
                    }
                    if (CHtml == '') {
                        cHtml = '';
                    }
                    if (DHtml == '') {
                        dHtml = '';
                    }
                    if (EHtml == '') {
                        eHtml = '';
                    }
                    if (FHtml == '') {
                        fHtml = '';
                    }
                    if (GHtml == '') {
                        gHtml = '';
                    }
                    if (HHtml == '') {
                        hHtml = '';
                    }
                    if (IHtml == '') {
                        iHtml = '';
                    }
                    if (JHtml == '') {
                        jHtml = '';
                    }
                    if (KHtml == '') {
                        kHtml = '';
                    }
                    if (LHtml == '') {
                        lHtml = '';
                    }
                    if (MHtml == '') {
                        mHtml = '';
                    }
                    if (NHtml == '') {
                        nHtml = '';
                    }
                    if (OHtml == '') {
                        oHtml = '';
                    }
                    if (PHtml == '') {
                        pHtml = '';
                    }
                    if (QHtml == '') {
                        qHtml = '';
                    }
                    if (RHtml == '') {
                        rHtml = '';
                    }
                    if (SHtml == '') {
                        sHtml = '';
                    }
                    if (THtml == '') {
                        tHtml = '';
                    }
                    if (UHtml == '') {
                        uHtml = '';
                    }
                    if (VHtml == '') {
                        vHtml = '';
                    }
                    if (WHtml == '') {
                        wHtml = '';
                    }
                    if (XHtml == '') {
                        xHtml = '';
                    }
                    if (YHtml == '') {
                        yHtml = '';
                    }
                    if (ZHtml == '') {
                        zHtml = '';
                    }
                    $('#plateTotal').html(allHtml + aHtml + AHtml + bHtml + BHtml + cHtml + CHtml + dHtml + DHtml + eHtml + EHtml + fHtml + FHtml + gHtml + GHtml + hHtml + HHtml + iHtml + IHtml + jHtml + JHtml + kHtml + KHtml + lHtml + LHtml + mHtml + MHtml + nHtml + NHtml + oHtml + OHtml + pHtml + PHtml + qHtml + QHtml + rHtml + RHtml + sHtml + SHtml + tHtml + THtml + uHtml + UHtml + vHtml + VHtml + wHtml + WHtml + xHtml + XHtml + yHtml + YHtml + zHtml + ZHtml);
                },
                error:function(){
                    alert('服务器内部出错了')
                }
            });
        });
    }else {
        function city() {
            $.ajax({
                url: initUrl + 'diQuQuanXian_2.do',
                type: 'POST',
                data: {
                    "Type": "1",////是	string	1：为城市 2：为区域 3：为板块
                    "DepartmentID": 11,//permissionID,//营运中心id
                    "Permissiontype":1// permissionType//是	string	1为 营运中心 2事业部 3位开发组 4位开发人员
                },
                success: function (data) {
                    //console.log(data);
                    var citiesHtml = '', limitCity;
                    //城市内容动态添加
                    limitCity = data.data.QuanXianChengShi_2;
                    if(!limitCity){
                        return;
                    }
                    $.each(limitCity, function (i) {
                        citiesHtml += `
                           <li class="city"><a href="#" id="${limitCity[i].CityID}">${limitCity[i].CityName}</a></li>
                        `;
                    });
                    var allHtml = `
                      <li class="all active"><a href="#">不限</a></li>
                    `;
                    $('#limit').html(allHtml + citiesHtml);
                    //热门城市一行定14个，超过的默认隐藏
                    if ($('#limit>li.city').size() > 14) {
                        $('#limit>li.city:gt(13)').css('display', 'none');
                    }else{
                        $('#more li.extend').hide();
                    }
                    //城市超链接的点击事件
                    $('#limit').on('click', 'li.city>a', function (e) {
                        var navHtml = `
                          <a href="http://www.xtco.cn/">轩天实业&gt;</a><a href="index.jsp">项目开发&gt;</a><a href="#">${$(e.target).html()}</a>
                        `;
                        $('section>p').html(navHtml);
                        e.preventDefault();
                        $('#more>ul.total').css('display', 'block');//区域显示
                        $('#plate').hide();
                    });
                },
                error:function(){
                    alert('服务器内部出错了')
                }
            });
        }

        city();
        //异步请求区域数据
        $('#limit').on('click', 'li.city>a', function (e) {
            e.preventDefault();
            var cityId = $(e.target).attr('id');//获取城市id
            $.ajax({
                url: initUrl + 'diQuQuanXian_2.do',
                type: 'POST',
                data: {
                    "Type": "2",//是	string	1：为城市 2：为区域 3：为板块
                    "DepartmentID": 11,//permissionID,//营运中心id
                    "Permissiontype": 2,//permissionType,//是	string	1为 营运中心 2事业部 3位开发组 4位开发人员
                    "CityID": cityId//否	string	城市 ID
                },
                success: function (data) {
                    //console.log(data);
                    //区域内容动态添加
                    var boroughHtml = '', limitBorough;
                    limitBorough = data.data.QuanXianQuYu_2;
                    if(!limitBorough){
                        return;
                    }
                    $.each(limitBorough, function (i) {
                        boroughHtml += `
                           <li class="borough"><a href="#" id="${limitBorough[i].BoroughID}">${limitBorough[i].BoroughName}</a></li>
                         `;
                    });
                    var allHtml = `
                  <li class="active"><a href="#" class="all">全部</a></li>
                `;
                    $('#borough').html(allHtml + boroughHtml);
                    //板块的显示与隐藏
                    $('#borough').on('click', 'li.borough>a', function (e) {
                        e.preventDefault();
                        var city = $('#limit>li.active>a').html();
                        var navHtml = `
                          <a href="http://www.xtco.cn/">轩天实业&gt;</a><a href="./index.jsp">项目开发&gt;</a>
                          <a href="#">${city}&gt;</a><a href="#">${$(e.target).html()}</a>
                        `;
                        $('section>p').html(navHtml);
                        $('#plate').show();
                    });
                },
                error:function(){
                    alert('服务器内部出错了')
                }
            });
        });
//板块内容的动态生成
        var x, y, scrollX, scrollY;
        $('#borough').on('click', 'li.borough>a', function (e) {
            e.preventDefault();
            //获取鼠标相对文档点击坐标，实现板块框可变移动
            scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
            scrollY = document.documentElement.scrollTop || document.body.scrollTop;
            x = e.pageX + 33 + 'px' || e.clientX + scrollX + 33 + 'px';
            y = e.pageY - 30 + 'px' || e.clientY + scrollY - 30 + 'px';
            if (parseFloat(x) > 735) {
                $('#plate>.caret-left').hide();
                $('#plate>.caret-right').show();
                x = e.pageX + 33 - 656 + 'px' || e.clientX + scrollX + 33 - 656 + 'px';
            } else {
                $('#plate>.caret-left').show();
                $('#plate>.caret-right').hide();
            }
            //固定板块弹出框的上下位置
            if (parseFloat(y) > 254 && parseFloat(y) < 268) {
                y = 262 + 'px';
            } else if (parseFloat(y) > 284 && parseFloat(y) < 297) {
                y = 290 + 'px';
            }
            $('#plate').css({
                left: x,
                top: y
            });
            var boroughId = $(e.target).attr('id');//获取区域id
            $.ajax({
                url: initUrl + 'diQuQuanXian_2.do',
                type: 'POST',
                data: {
                    "Type": "3",//是	string	1：为城市 2：为区域 3：为板块
                    "DepartmentID": 11,//permissionID,//营运中心id
                    "Permissiontype": 2,//permissionType,//是	string	1为 营运中心 2事业部 3位开发组 4位开发人员
                    "BoroughID": boroughId//区域id
                },
                success: function (data) {
                    var limitPlate, AHtml = '', BHtml = '', CHtml = '', DHtml = '', EHtml = '', FHtml = '', GHtml = '', HHtml = '', IHtml = '', JHtml = '', KHtml = '', LHtml = '', MHtml = '', NHtml = '', OHtml = '', PHtml = '', QHtml = '', RHtml = '', SHtml = '', THtml = '', UHtml = '', VHtml = '', WHtml = '', XHtml = '', YHtml = '', ZHtml = '';
                    var aHtml = '<li class="plate"><span>A</span></li>';
                    var bHtml = '<li class="plate"><span>B</span></li>';
                    var cHtml = '<li class="plate"><span>C</span></li>';
                    var dHtml = '<li class="plate"><span>D</span></li>';
                    var eHtml = '<li class="plate"><span>E</span></li>';
                    var fHtml = '<li class="plate"><span>F</span></li>';
                    var gHtml = '<li class="plate"><span>G</span></li>';
                    var hHtml = '<li class="plate"><span>H</span></li>';
                    var iHtml = '<li class="plate"><span>I</span></li>';
                    var jHtml = '<li class="plate"><span>J</span></li>';
                    var kHtml = '<li class="plate"><span>K</span></li>';
                    var lHtml = '<li class="plate"><span>L</span></li>';
                    var mHtml = '<li class="plate"><span>M</span></li>';
                    var nHtml = '<li class="plate"><span>N</span></li>';
                    var oHtml = '<li class="plate"><span>O</span></li>';
                    var pHtml = '<li class="plate"><span>P</span></li>';
                    var qHtml = '<li class="plate"><span>Q</span></li>';
                    var rHtml = '<li class="plate"><span>R</span></li>';
                    var sHtml = '<li class="plate"><span>S</span></li>';
                    var tHtml = '<li class="plate"><span>T</span></li>';
                    var uHtml = '<li class="plate"><span>U</span></li>';
                    var vHtml = '<li class="plate"><span>V</span></li>';
                    var wHtml = '<li class="plate"><span>W</span></li>';
                    var xHtml = '<li class="plate"><span>X</span></li>';
                    var yHtml = '<li class="plate"><span>Y</span></li>';
                    var zHtml = '<li class="plate"><span>Z</span></li>';
                    limitPlate = data.data.QuanXianBanKuai_2;
                    if(!limitPlate){
                        return;
                    }
                    $.each(limitPlate, function (i) {
                        var str = limitPlate[i].PlateName.trim();
                        if (str == "") return;
                        var arrRslt = makePy(str);
                        var firstWord = arrRslt[0].slice(0, 1);
                        if (firstWord == 'A') {
                            AHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].plateid}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'B') {
                            BHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].plateid}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'C') {
                            CHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].plateid}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'D') {
                            DHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].plateid}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'E') {
                            EHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].plateid}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'F') {
                            FHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].plateid}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'G') {
                            GHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].plateid}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'H') {
                            HHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].plateid}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'I') {
                            IHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].plateid}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'J') {
                            JHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].plateid}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'K') {
                            KHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].plateid}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'L') {
                            LHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].plateid}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'M') {
                            MHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].plateid}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'N') {
                            NHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].plateid}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'O') {
                            OHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].plateid}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'P') {
                            PHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].plateid}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'Q') {
                            QHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].plateid}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'R') {
                            RHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].plateid}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'S') {
                            SHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].plateid}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'T') {
                            THtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].plateid}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'U') {
                            UHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].plateid}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'V') {
                            VHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].plateid}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'W') {
                            WHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].plateid}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'X') {
                            XHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].plateid}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'Y') {
                            YHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].plateid}">${limitPlate[i].PlateName}</a></li>
                        `;
                        } else if (firstWord == 'Z') {
                            ZHtml += `
                          <li class="plate"><a href="#" id="${limitPlate[i].plateid}">${limitPlate[i].PlateName}</a></li>
                        `;
                        }
                    });
                    var allHtml = `
                     <li class="active"><a href="#">全部</a></li>
                `;
                    if (AHtml == '') {
                        aHtml = '';
                    }
                    if (BHtml == '') {
                        bHtml = '';
                    }
                    if (CHtml == '') {
                        cHtml = '';
                    }
                    if (DHtml == '') {
                        dHtml = '';
                    }
                    if (EHtml == '') {
                        eHtml = '';
                    }
                    if (FHtml == '') {
                        fHtml = '';
                    }
                    if (GHtml == '') {
                        gHtml = '';
                    }
                    if (HHtml == '') {
                        hHtml = '';
                    }
                    if (IHtml == '') {
                        iHtml = '';
                    }
                    if (JHtml == '') {
                        jHtml = '';
                    }
                    if (KHtml == '') {
                        kHtml = '';
                    }
                    if (LHtml == '') {
                        lHtml = '';
                    }
                    if (MHtml == '') {
                        mHtml = '';
                    }
                    if (NHtml == '') {
                        nHtml = '';
                    }
                    if (OHtml == '') {
                        oHtml = '';
                    }
                    if (PHtml == '') {
                        pHtml = '';
                    }
                    if (QHtml == '') {
                        qHtml = '';
                    }
                    if (RHtml == '') {
                        rHtml = '';
                    }
                    if (SHtml == '') {
                        sHtml = '';
                    }
                    if (THtml == '') {
                        tHtml = '';
                    }
                    if (UHtml == '') {
                        uHtml = '';
                    }
                    if (VHtml == '') {
                        vHtml = '';
                    }
                    if (WHtml == '') {
                        wHtml = '';
                    }
                    if (XHtml == '') {
                        xHtml = '';
                    }
                    if (YHtml == '') {
                        yHtml = '';
                    }
                    if (ZHtml == '') {
                        zHtml = '';
                    }
                    $('#plateTotal').html(allHtml + aHtml + AHtml + bHtml + BHtml + cHtml + CHtml + dHtml + DHtml + eHtml + EHtml + fHtml + FHtml + gHtml + GHtml + hHtml + HHtml + iHtml + IHtml + jHtml + JHtml + kHtml + KHtml + lHtml + LHtml + mHtml + MHtml + nHtml + NHtml + oHtml + OHtml + pHtml + PHtml + qHtml + QHtml + rHtml + RHtml + sHtml + SHtml + tHtml + THtml + uHtml + UHtml + vHtml + VHtml + wHtml + WHtml + xHtml + XHtml + yHtml + YHtml + zHtml + ZHtml);
                },
                error:function(){
                    alert('服务器内部出错了')
                }
            });
        });
    }
    //维护人筛选
    var depID,depCode,deFlag,hasLead;
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
                           DepartmentID:depID
                       },
                       success:function(data){
                           departData=data.data.buMenChaRenYuan_2;
                           $.each(departData,function(i){
                               departHtml+=`
                      <p title="${departData[i].ISlead}" id="${departData[i].Userid}" style="${departData[i].Department}">${departData[i].FullName}</p>
                                       `;
                           });
                           $('#menu12').html(departHtml);
                       },
                       error:function(){
                           alert('服务器出错了');
                       }
                   });
               }
               $.each(departData,function(i){
                   departHtml+=`
                      <p id="${departData[i].ID}" class="${departData[i].DepartMentCode}" style="${perFlag}">${departData[i].DepartName}</p>
                                       `;
               });
               $('#menu12').html(departHtml);
           },
           error:function(){
               alert('服务器出错了');
           }
       });
    }
    $('#menu12').on('click','p',function(e){
        $('#WeiHuRen>input').val($(e.target).html());
        hasLead=$(e.target).attr('title');
        if(!hasLead){
            depID=$(e.target).attr('id');
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
            }
            weiHuRen=depID;
            flag=1;
            level(depID,depCode);
        }else{
            $(e.target).addClass('active').siblings().removeClass('active');
        }
        if(hasLead==1){
            weiHuRen=$(e.target).attr('style');
            flag=1;
        }
        if(hasLead==0){
            weiHuRen=$(e.target).attr('id');
            flag=2;
        }
        page();
    });
    $('#WeiHuRen').click(function(){
        level(1,'businessUnit');
        //level(permissionID,departCode);
    });
});