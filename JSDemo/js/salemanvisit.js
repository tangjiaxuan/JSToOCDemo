var data = null,
    target,
    config,
    api = {},
    headers = {},
    responseData = new Array();
var myScroll,
    pullDownEl, pullDownOffset,
    pullUpEl, pullUpOffset,
    pageCount = 10, //设置每页的数
    pageIndex = 1,
    topIndex = 1,
    masterflag = 0,
    masterfont = 'menu:1389154284';
Handlebars.registerHelper('rankimg', function(option) {
    var data = option.data;
    var str = "";
    switch (this.visitindex) {
        case "1":
            str = '<img class="divm img-responsive" src="../img/findex.png" style="max-width: 86%;" />';
            break;
        case "2":
            str = '<img class="divm img-responsive" src="../img/sindex.png" style="max-width: 86%;" />';
            break;
        case "3":
            str = '<img class="divm img-responsive" src="../img/tindex.png" style="max-width: 86%;" />';
            break;
        default:
            str = "<h2>" + this.visitindex + "</h2>";
            break;
    }
    return new Handlebars.SafeString(str);
});
Handlebars.registerHelper('monthcount', function(option) {
    var count = "";
    if (this.monthcount != 0)
        count = "：" + this.monthcount;
    return count;
});
Handlebars.registerHelper('yesterdaycount', function(option) {
    var count = "";
    if (this.yesterdaycount != 0)
        count = "：" + this.yesterdaycount;
    return count;
});
Handlebars.registerHelper('logourl', function(option) {
    var str = "";
    var chstr = this.username.replace(/[^\u4E00-\u9FA5]/g, '');
    var colorstr = ChinesetoASC(chstr) + 1;
    if (chstr.length > 0)
        str = '<div class="divm circle color' + colorstr + '">' + chstr.charAt(chstr.length - 1) + '</div>';
    else
        str = ' <img class="divm img-circle imgcircle" src="../img/user.png" />';
    if (GetQueryString("usernumber") == this.usernumber)
        this.username = '我';
    return new Handlebars.SafeString(str);
});
Handlebars.registerHelper('mystyle', function(option) {
    if (this.usernumber == GetQueryString("usernumber"))
        return "yellow";
    else
        return "";
});
/**
 * 下拉刷新
 */
function pullDownAction() {
    pageIndex = 1;
    var _url = "",
        _forwhat = "";
    switch (topIndex) {
        case 0:
            _url = api.yesterdayRank;
            _forwhat = "#forday";
            break;
        case 1:
            _url = api.yesterdayRank;
            _forwhat = "#forday";
            break;
        case 2:
            _url = api.yesterdayRank;
            _forwhat = "#forday";
            break;
    }
    var params = param_data("6b928500-350d-4d0a-832a-26e80bba4cdb", String(topIndex), String(pageIndex));
    http.post(_url, headers, params, function(e, a, b){
    	if (e.error_msg != undefined) {
	        $(_forwhat).html("<span style='color:red;'>" + e.error_msg + "</span>");
	        return;
	    }
    	responseData[topIndex - 1].data = e.response_params;
    	render(responseData[topIndex - 1].data, _forwhat);
    }, error);
}
function loaded() {

    pullDownEl = document.getElementById('pullDown');
    pullDownOffset = pullDownEl.offsetHeight;

    myScroll = new iScroll('wrapper', {
        useTransition: true,
        topOffset: pullDownOffset,
        vScrollbar: false,
        onRefresh: function() {
            if (pullDownEl.className.match('loading')) {
                pullDownEl.className = '';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
            }
        },
        onScrollMove: function() {
            if (this.y > 5 && !pullDownEl.className.match('flip')) {
                pullDownEl.className = 'flip';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '松手刷新...';
                this.minScrollY = 0;
            } else if (this.y < 5 && pullDownEl.className.match('flip')) {
                pullDownEl.className = '';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新加载..';
                this.minScrollY = -pullDownOffset;
            }
        },
        onScrollEnd: function() {
            if (pullDownEl.className.match('flip')) {
                pullDownEl.className = 'loading';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载刷新...';
                pullDownAction();
            }
        }
    });

    setTimeout(function() {
        var containerH = document.getElementById("head");
        document.getElementById('wrapper').style.left = '0';
        document.getElementById('wrapper').style.top = containerH.offsetHeight + 'px';
        myScroll.refresh();
    }, 600);
}

document.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, false);

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(loaded, 200);
}, false);

$(function() {
		// 初始化参数
  	util.json("../config/config.json", function(data){
  		config = data;
  		api = util.api(config.host, config.port, config.api);
  
  	    headers = {
  	    	"tenantId": GetQueryString("enterprisenumber"),
  	    	"token": GetQueryString("sessionid"),
  	    	"Content-Type":"application/json"
  	    }
  
  	    initTop();
  
  	});
  
//  api = util.api("172.16.31.113", "18080",  {"yesterdayRank": "/api/sfa/datasource/queryResultForMobile"});
//  headers = {
//  "tenantId": GetQueryString("enterprisenumber"),
//  "token": GetQueryString("sessionid"),
//  "Content-Type":"application/json"
//  }
//  
//  initTop();
    var availh = document.documentElement.clientHeight;
    $("body").innerHeight(availh);
});

function initTop(){
	var params = param_data("6b928500-350d-4d0a-832a-26e80bba4cdb", "3", String(pageIndex));
	
	http.post(api.yesterdayRank, headers, params, function(e, a, b){
		if (e.error_msg != undefined) {
	        $("#top").html("<span style='color:red;'>" + e.error_msg + "</span>");
	        return;
	   }
	    var topTemplate = Handlebars.compile($("#ranktop").html());
	    $("#top").html("").append(topTemplate(e.response_params[0]));
	    masterflag = e.response_params[0].masterflag;
	    masterfont = e.response_params[0].masterfont;

		var tpls = $("#top").find("div[name='tplTop']");
		tpls.click(function(){
			eventClick($(this).index());
		});
		tpls[0].click();
	    
	}, error);
}

/**
 * 请求错误
 * @param {Object} e
 * @param {Object} a
 * @param {Object} b
 */
function error(e, a, b){
	$("#forday").html("<span style='color:red;'>" + e.responseJSON.error_msg + "</span>");
    console.log("操作失败，请重试:" + e.responseText);
}

//点击事件
function eventClick(index) {
    pageIndex = 1;
    topIndex = index + 1;
    
   	var tpls = $("#top").find("div[name='tplTop']");
   	tpls.eq(index).addClass("bw");
   	tpls.eq(index).siblings().removeClass("bw");
    
	if(responseData[index] === undefined){
		responseData[index] = {};
	}
	if(responseData[index].load === undefined || responseData[index].load == false){
		var params = param_data("6b928500-350d-4d0a-832a-26e80bba4cdb", String(topIndex), String(pageIndex));
	   	http.post(api.yesterdayRank, headers, params, function(e, a, b){
	   		if (e.error_msg != undefined) {
		        $("#forday").html("<span style='color:red;'>" + e.error_msg + "</span>");
		        responseData[index].load = false;
		        return;
		    }
	   		responseData[index].load = true;
	   		responseData[index].data = e.response_params;
	    	render(responseData[index].data, "#forday");
	    }, error);
    } else {
    	render(responseData[index].data, "#forday");
    }
}

/**
 * 列表渲染
 * @param {Object} data 数据
 * @param {Object} forwhat 模板id
 */
function render(data, forwhat){
    if (data == 0) {
        $("#main").html("<span style='color:red;'>暂无数据</span>");
        return;
    }
    var myTemplate = Handlebars.compile($(forwhat).html());
    $("#main").html("");
    $("#main").html(myTemplate(data));
    $("#main").fadeIn("slow");
    if (data.length > 0)
        pageIndex++;
    myScroll.refresh();
}

/**
 * 获取url参数
 */
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

function param_data(_datasourceid, _querytype, _currentPage) {
    var _enterpriseid = GetQueryString("enterprisenumber");
    var _usernumber = GetQueryString("usernumber");
    var sessionid = GetQueryString("sessionid");
    var masterflag = GetQueryString("masterflag");
    var username = $("#txt_search").val();
    var paramdata = {
        "datasourceid": _datasourceid,
        "sessionid": sessionid,
        "enterprisenumber": _enterpriseid,
        "usernumber": _usernumber,
        "params": {
            "usernumber": _usernumber,
            "querytype": _querytype,
            "currentPage": _currentPage,
            "pageSize": pageCount,
            "username": username,
            "masterflag": masterflag
        }
    };
    return paramdata;
}
