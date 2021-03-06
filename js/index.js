
$(function (){  
    /*首页轮播图*/
    $.ajax({
        type:"get",
        url:"http://h5.wingoalclub.com/zucai/inf/homepageScroll",
        data:{timer:new Date().getTime()},
        dataType:"json",
        error:function (){
            loadExpert();
        },
        success:function (data){
            loadExpert();
            if(data && data.status==200 && data.error==null){
                var list=data.data;
                var html='';
                for(var i=0;i<list.length;i++){
                    html+='<div class="swiper-slide"><a href="'+list[i].url+'"><img src="'+list[i].image+'"></a></div>';
                }
                $(".swiper-wrapper").eq(0).empty().html(html);
                var mySwipe = new Swiper(".swiper-container",{
                    autoplay:5000,
                    pagination:".swiper-pagination"
                });
            }
        }
    });  
    function loadExpert(op){/*专家推荐*/
        var defaultOption={role:"1,2",type:"1,3",page_index:1,page_num:10,timer:new Date().getTime()};/*默认北京专场，第一页每页10条*/;
        var option=$.extend(defaultOption,op);
        $.ajax({
            type:"get",
            url:"http://h5.wingoalclub.com/zucai/inf/expertRecommend",
            data:option,
            dataType:"json",
            error:function (){
                loadProficient();
            },
            success:function (data){
                loadProficient();
                if(data && data.status==200 && data.error==null){
                    var list=data.data;
                    var experthtml="";
                    for(var i=0;i<list.length;i++){
                        experthtml+='<li class="commen_per" expertid="'+list[i].expertid+'" recommendid="'+list[i].recommendid+'"  expertimg="'+list[i].imageSrc+'" expertname="'+list[i].nickname+'" expertintro="'+list[i].content+'"><div class="js_cell"><img src="'+list[i].imageSrc+'"></div><span class="name_hut">'+list[i].nickname+'</span></li>';
                    }
                    $("#experts").empty().html(experthtml).delegate("li","click",function (){

                        var nickname=$(this).attr("expertname");
                        var picture=$(this).attr("expertimg");
                        var intro=$(this).attr("expertintro");

                        localStorage.setItem("expertName",nickname);
                        localStorage.setItem("expertImg",picture);
                        localStorage.setItem("expertIntro",intro);
                        location.href='/expert.html?expertid='+$(this).attr("expertid");
                    });
                }
            }
        });
    }
    function loadProficient(op){/*高手推荐*/
        var timer=new Date().getTime();
        var defaultOption={role:"1,2",type:"1,3",page_index:1,page_num:10,t:timer};/*默认北京专场，第一页每页10条*/;

        var option=$.extend(defaultOption,op);
        $.ajax({
            type:"get",
            url:"http://h5.wingoalclub.com/zucai/inf/expertRecommend",
            data:option,
            dataType:"json",
            success:function (data){
                if(data.status==200){
                    var list=data.data;
                    var recommendhtml='<a href="/recommend.html"><dt>最新推荐<span class="more_icon">更多</span></dt></a>';
                    var typeName=["北京单场","北京单场","胜负玩法","竞彩玩法"];
                    var weekday=["周日","周一","周二","周三","周四","周五","周六"];
                    for(var i=0;i<list.length;i++){
                        var type=list[i].type || "北京单场";
                        var datatime=list[i].begin_match_time || list[i].create_time;
                        var beginTime=$.trim(datatime).substring(0,10);
                        var isBuy=list[i].status || 0;
                        var date=new Date(beginTime);
                        var d=date.getDay();
                        if(isBuy==1 || list[i].is_hit){
                            recommendhtml+='<dd expertid="'+list[i].expertid+'" recommendid="'+list[i].recommendid+'" title="'+list[i].title+'" type="'+type+'" jump="jump"><section class="expert_case"><a class="gotoexpert" expertid="'+list[i].expertid+'" expertimg="'+list[i].imageSrc+'" expertname="'+list[i].nickname+'" expertintro="'+list[i].content+'"><span class="head_cap"><img src="'+list[i].imageSrc+'"></span></a><div class="cap_cont jumpexpert" expertid="'+list[i].expertid+'"><em>'+list[i].nickname+'</em><mark>专家</mark><span class="more_icon">更多</span></div></section><section class="ball_detail"><div class="ball_time"><small>'+weekday[d]+'</small><p>'+datatime.substring(5,16)+'</p></div><p class="span_contr"><strong>'+list[i].title+'</strong>';
                            if(list[i].is_hit){
                                recommendhtml+='</p><p class="ball_case txt_contr2"><span>类型：<a>'+typeName[type]+'</a></span></p><p class="ball_case txt_contr2">推荐语:<a>'+list[i].content+'</a></p><span class="tag">'+list[i].is_hit+'</span></section></dd>';
                            }else{
                                recommendhtml+='</p><p class="ball_case txt_contr2"><span>类型：<a>'+typeName[type]+'</a></span></p><p class="ball_case txt_contr2">推荐语:<a>'+list[i].content+'</a></p><span class="tag">已购买</span></section></dd>';
                            }
                            
                        }else{
                            var price=list[i].price;
                            recommendhtml+='<dd expertid="'+list[i].expertid+'" recommendid="'+list[i].recommendid+'" title="'+list[i].title+'" price="'+price+'" type="'+type+'"><section class="expert_case"><a class="gotoexpert" expertid="'+list[i].expertid+'" expertimg="'+list[i].imageSrc+'" expertname="'+list[i].nickname+'" expertintro="'+list[i].content+'"><span class="head_cap"><img src="'+list[i].imageSrc+'"></span></a><div class="cap_cont jumpexpert" expertid="'+list[i].expertid+'"><em>'+list[i].nickname+'</em><mark>专家</mark><span class="more_icon">更多</span></div></section><section class="ball_detail"><div class="ball_time"><small>'+weekday[d]+'</small><p>'+datatime.substring(5,16)+'</p></div><p class="span_contr"><strong>'+list[i].title+'</strong><span class="star_box" style="position: absolute;right:10px">￥<em>'+price+'</em></span></p><p class="ball_case txt_contr2"><span>类型：<a>'+typeName[type]+'</a></span></p><p class="ball_case txt_contr2">推荐语:<a>'+list[i].content+'</a></p><span class="tag">购买</span></section></dd>';
                        }
                       
                    }
                    $("#recommendlist").empty().html(recommendhtml).delegate("dd","click",function (){  
                            var type=$(this).attr("type");
                            var jump=$(this).attr("jump");
                            var recommendid=$(this).attr("recommendid");
                            var nickname=$(this).find(".gotoexpert").attr("expertname");
                            var picture=$(this).find(".gotoexpert").attr("expertimg");
                            if(jump !== undefined){
                                location.href="/plan.html?type="+type+"&recommendid="+recommendid+"&nickname="+nickname+"&picture="+picture;
                                return false;
                            }
                            var backTitle=$(this).attr("title");
                            var money=$(this).attr("price");
                            var weChatcallback="http://h5.wingoalclub.com/plan.html?type="+type+"replacerecommendid="+recommendid+"replacenickname="+nickname+"replacepicture="+picture;
                            weChatPay(backTitle,recommendid,money,encodeURIComponent(weChatcallback));
                        }).delegate(".gotoexpert","click",function (event){
                            event.stopPropagation();
                            var nickname=$(this).attr("expertname");
                            var picture=$(this).attr("expertimg");
                            var intro=$(this).attr("expertintro");

                            localStorage.setItem("expertName",nickname);
                            localStorage.setItem("expertImg",picture);
                            localStorage.setItem("expertIntro",intro);
                            location.href='/expert.html?expertid='+$(this).attr("expertid");

                        }).delegate(".jumpexpert","click",function (event){
                            event.stopPropagation();
                            $(this).siblings(".gotoexpert").click();
                        });
                }
            }
        });
    }
    
    
    /*$(window).delegate(".jumpexpert","click",function (event){
        event.stopPropagation();
        jumpExpert($(this));
        return false;
    });*/
});
