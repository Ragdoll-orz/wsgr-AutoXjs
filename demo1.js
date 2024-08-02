/**
 * 写在前面
 *      Ctrl+shift+P开启服务
 *      requestScreenCapture()只能调用一次，超过一次会阻塞运行
 *      colors.toString(images.pixel())输出的内容不能return到函数,同时与相同的rgb做比较为false
 *      ocr方法给的图片框要比文字大一些
 * 
 * 存在的问题
 *      demo1是写死的8-2单次航空点无伤炸鱼
 *      且有远征完成时得先手动收菜，在开脚本
 *      且只能在首次进入游戏开脚本(开脚本之前不能进行过战斗)
 */
setScreenMetrics(960,540);      //设置分辨率
var flag=1;     //设置模式
var location=1;      //当前页面——1港区、2出征、3演戏、4远征、5战役、6决战
var color;      //颜色
var intervalID1;     //定时器id
var boomFlag=false;       //炸鱼超过每日500船默认值
var num=0;      //计数收菜次数
var numBoom=0;      //炸鱼次数
var numShip=0;      //本次运行获取船只数
const dayMaxShip=500;     //每日最大船只获得
var dayGotship;     //每日已获得船只
var dock;       //船坞容量
var ship;       //当前船只数
var type=1;     //点位类型——0普通、1航空、2夜战
var situation=2;        //航空战况选择,1-5
var tactics=4;      //战术选择,1-5
var text;       //ocr文本


/* const areas=[
    [1,2,3,4,5],        //第一章
    [1,2,3,4,5,6],      //第二章
    [1,2,3,4],          //第三章 
    [1,2,3,4],          //第四章
    [1,2,3,4,5],        //第五章
    [1,2,3,4],          //第六章
    [1,2,3,4,5],        //第七章
    [1,2,3,4,5],        //第八章
    [1,2,3],            //第九章
] */
requestScreenCapture(false);        //请求竖屏截图
init();

switch(flag){       //控制模式
    case 1:     //!!!提前配置好队伍!!!
        while(true){
            boomFish(location,8,2);
        }
        break;
    case 2:     //!!!提前安排远征!!!
        longWalk(location);
        intervalID1 = setInterval(function() {
            longWalk(location);
        }, 15*60*1000);     //定时器——15min
        stopLooper(intervalID1);    //停止定时器
        break;
    default:
        break;
}
/**
 * 初始化---获取船坞和船只信息
 */
function init(){
    var arr;
    console.log('获取船坞信息');
    sleep(1000);
    clicks(762,507);
    sleep(1000);
    clicks(553,254);
    sleep(1000);
    clipPicture(844,11,96,38);      //截取船坞信息
    arr=text.split('/');
    ship=arr[0];
    dock=arr[1];
    toast('船坞'+ship+'/'+dock);
    console.log('船坞'+ship+'/'+dock);
    sleep(2000);
    clicks(34,29);
    sleep(1000);
    clicks(34,29);
    sleep(1000);
    clicks(907,488);
    sleep(1000);
    clipPicture(844,11,96,38);      //截取已打捞船只数量
    arr=text.split('/');
    dayGotship=arr[0];
    toast('已打捞'+dayGotship);
    console.log('已打捞'+dayGotship);
    sleep(2000);
    total();
    clicks(34,29);      //返回港区
}
/**
 * 超500船是否继续，true继续,false停止（默认）
 */
function doBoomFish(flag){
    if(!(dock-ship>1)){
        console.log('船坞已满');
        total();
        exit();
    }
    if(!flag){
        if(!(dayMaxShip-dayGotship>1)){
            console.log('每日打捞船只已到上限');
            total();
            exit();
        }
    }
}
/**
 * 统计数据
 */
function total(){
    toast('炸鱼'+numBoom+'次 '+'今日打捞'+dayGotship+'/'+dayMaxShip+' 船坞容量'+ship+'/'+dock);
    console.log('炸鱼 '+numBoom+' 次');
    console.log('本次打捞 '+numShip+'只');
    console.log('今日打捞 '+dayGotship+'/'+dayMaxShip+'  剩 '+(dayMaxShip-dayGotship)+'只');
    console.log('船坞容量 '+ship+'/'+dock+'  剩 '+(dock-ship)+'只');
}
/**
 * 炸鱼
 */
function boomFish(position,map,area){        //炸鱼——位于港区
    console.log('炸鱼逻辑判断');
    doBoomFish(boomFlag);

    getCColor(945,456);
    if(compareColor(color,'#ffff592d')){        //港区出征按钮——红点
        console.log('远征完成,先执行收菜');
        longWalk(position);
    }
    getCColor(476,11);
    if(compareColor(color,'#ffffac96')){        //出征页按钮——红点
        console.log('远征完成,先执行收菜');
        longWalk(position);
    }
    
    console.log('远征未完成--boomFish');
    if(location==1){
        console.log('港区点击出征');
        clicks(902,489);        //点击出征
        location=2;
    }
    if(numBoom==0)
        findMap(map,area);      //进入地图逻辑
    clicks(584,281);        //进入地图
    clicks(228,89);     //选择舰队
    shipIsOkForPrepare();       //状态检查
    clicks(780,504);        //点击出征
    console.log('进入战斗');
    //截图判断哪条路

    sleep(6000);
    battle(type,tactics);
    numBoom++;
    total();
    sleep(3000);
}
/**
 * 战斗逻辑
 */
function battle(type,tactics){      //战斗逻辑(战况)
    console.log('进入战斗逻辑');
    switch(type){
        case 0:     //普通
            break;
        case 1:     //航空
            sleep(2000);
            battleSituation(situation);
            break;
        case 2:     //夜战

            break;
        default:
            console.error('选择战况报错');
    }
    clicks(479,86);     //加速
    //判断索敌是否成功
    /*
    if(){
        //成功
    }else{
        //失败
    }
    */
    clicks(808,500);      //点击开始战斗
    switch(tactics){      //战术
        case 1:     //
            
            console.log('战术——单纵');
            break;
        case 2:     //
            clicks(755,208);
            console.log('战术——复纵');
            break;
        case 3:     //

            console.log('战术——轮型');
            break;
        case 4:     //
            clicks(700,400);
            console.log('战术——梯形');
            break;
        case 5:     //

            console.log('战术——单横');
            break;
        default:
            console.error('选择战术报错');
    }
    //战斗进行
    while(true){
        clipPicture(267,330,133,40);      //267,330/400,370
        if(text=='追击'){       //判断是否需要夜战
            console.log('ocr='+text);
            clicks(595,355);       //选择的撤退
            break;
        }
        sleep(2000);
        clipPicture(410,25,135,42);      //410,25/545,67
        if(text=='战斗结果'){       //判断是否进入结算页
            console.log('ocr='+text);
            break;
        }
        console.log('战斗未结束');
        sleep(5000);
    }
    //判断战斗是否结束

    /* //判断是否追击
    getCColor(295,353);
    if(compareColor(color,'')){     //判断追击按钮
        getCColor(595,355);
        if(!compareColor(color,'')){        //判断撤退按钮
            console.error('追击颜色判断错误');
        }
        //出现是否追击---出现分支!!!
        clicks(595,355);       //选择的撤退
    } */
    //战斗结果页
    sleep(4000);
    console.log('点击战斗结果页');
    clicks(649,373);
    //经验加成页
    sleep(2000);
    console.log('点击经验加成页');
    clicks(649,373);
    //船只获取
    sleep(2000);
    getCColor(758,173);
    if(similarColor(color,'#ffffe18e')){
        console.log('点击船只获取');
        clicks(649,373);
        numShip++;
        ship++;
        dayGotship++;
    }
    //是否前往下个点---出现分支!!!
    sleep(2000);
    console.log('返回');
    clicks(591,351);        //返回
}
/**
 * 裁剪图片并识别文字
 */
function clipPicture(x,y,width,length){
    var img=captureScreen();        //截图
    var im=images.clip(img,x,y,width,length);      //裁剪(图片，起始横坐标，起始纵坐标，宽，高)
    ocr(im);
}
/**
 * OCR文字识别
 */
function ocr(img){
    let result = gmlkit.ocr(img, "zh");
    text=result.text;
}
/**
 * 战况选择
 */
function battleSituation(situation){     //战况选择
    clicks(479,86);     //加速
    console.log('进入战况选择');
    switch(situation){
        case 1:     //
            
            console.log('战况1——');
            break;
        case 2:     //
            clicks(755,208);
            console.log('战况2——');
            break;
        case 3:     //

            console.log('战况3——');
            break;
        case 4:     //

            console.log('战况4——');
            break;
        case 5:     //

            console.log('战况5——');
            break;
        default:
            console.error('选择战况报错');
    }
}
/**
 * 准备出征，状态检查
 */
function shipIsOkForPrepare(){      //准备出征
    console.log('出征准备页————检查状态');
    var b=55;
    var flag=true;
    var count=0;
    while(flag){        //二次验证
        console.log('第'+(count+1)+'次检查');
        if(count==2){
            exit();
        }
        for(var a=0;a<6;a++){
            getCColor(b,321);
            if(!similarColor(color,'#ff3fa16c')){       //血条不为绿 
                //clicks(b,321);
                console.error('第'+(a+1)+'位船只受损');
                break;
                //exchangeShip();
            }
            toast('第'+(a+1)+'位船只良好 '+b);
            console.log('第'+(a+1)+'位船只良好 '+b);
            b=b+120;
            if(a==5){
                flag=false;
            }
        }
        count++;
    }
    console.log('状态良好');
}
/**
 * 更换舰船---船坞页
 */
function exchangeShip(){
    console.log('更换舰船');
    //更换船只逻辑
}
/**
 * 寻找地图。点击出征会进入最后一张打过的地图，通过向上向下各点一下，实现回到9-1位置
 */
function findMap(map,area){     //寻找地图(第几章，第几张)
    console.log('进入findMap');
    clicks(94,236);      //向上点击
    clicks(99,359);      //向下点击
    for(var a=map;a<9;a++){     //定位第map章
        if(a==9)
            break;
        clicks(94,236);      //向上点击
    }
    for(var a=1;a<area;a++){        //定位具体地图
        clicks(931,280);
    }
    console.log('已进入地图 '+map+'-'+area);
}
/**
 * 通过港区出征按钮上的红点和远征按钮上的红点来判断远征是否已完成
 */
function longWalk(position){        //远征(当前页面)
    /* if(!requestScreenCapture()){        //请求截图权限
        console.log('请求截图失败');
        exit();
    } */
    sleep(2000);
    if(position!=4){        //不在远征页面
        console.log('不在远征');
        if(position==1){        //在港区
            console.log('在港区');
            getCColor(945,456);
            if(!compareColor(color,'#ffff592d')){        //港区出征按钮——红点
                console.log('远征未完成');
                return;
            }
            console.log('发现已完成的远征');
            sleep(2000);
        }else{      //不在港区
            getCColor(476,11);
            if(!compareColor(color,'#ffffac96')){        //远征按钮——红点
                console.log('远征未完成');    
                clicks(32,28)       //返回港区
                location=1;
                return;
            }
            console.log('发现已完成的远征,先返回港区');
            clicks(32,28)       //返回港区
            location=1;
        }
        /** 收菜 */
        console.log('准备收菜');
        clicks(902,489);       //点击出征
        location=4;
        getLongWalk();
        clicks(32,28)       //返回港区
        location=1;
        return;     //分支!4结束
    }
    console.log('在远征页面');
    getCColor(476,11);
    if(!compareColor(color,'#ffffac96')){        //远征按钮——红点
        console.log('远征未完成');
        clicks(32,28)       //返回港区
        location=1;
        return;
    }
    /** 收菜 */
    getLongWalk();
    clicks(32,28)       //返回港区——分支4结束
    location=1;
}
/** 
 * 获取颜色---带sleep(2000)
 */
function getCColor(x,y){
    console.log('进入获取颜色');
    //requestScreenCapture(false);        //请求竖屏截图
    var img=captureScreen();        //截图
    var col=images.pixel(img,x,y);        //获取图片(x,y)处的颜色
    color=colors.toString(col);      //返回颜色
    sleep(2000);
}
/** 
 * 收菜部分，利用软件自身，当远征完成时，点击出征按钮会自动跳到相应远征页
 */
function getLongWalk(){
    console.log('getLongWalk');
    var getFlag=true;
    while(getFlag){
        getCColor(915,150);
        if(compareColor(color,'#fffee442')){
            getLongWalkClick(915,150);
            console.log('收菜成功1');
            num++;
        }
        sleep(2000);
        getCColor(915,253);
        if(compareColor(color,'#fffee442')){
            getLongWalkClick(915,253);
            console.log('收菜成功2');
            num++;
        }
        sleep(2000);
        getCColor(915,362);
        if(compareColor(color,'#fffee442')){
            getLongWalkClick(915,362);
            console.log('收菜成功3');
            num++;
        }
        sleep(2000);
        getCColor(915,466);
        if(compareColor(color,'#fffee442')){
            getLongWalkClick(915,466);
            console.log('收菜成功4');
            num++;
        }
        sleep(2000);
        getCColor(476,11);
        if(compareColor(color,'#ffffac96')){        //远征按钮——红点
            console.log('还可以收菜');
        }else{
            getFlag=false;      //终止循环
        }
    }
    console.log('收菜结束');
    console.log('已收菜'+num+'次');
}
/**
 * 收菜点击---带sleep(2000)
 */
function getLongWalkClick(x,y){
    console.log('getLongWalkClick');
    if(!click(x,y)){     //点击收菜
        console.log('收菜点击失败');
        exit();
    }
    sleep(3000);
    if(!click(x,y)){     //结算页面
        console.log('收菜结算点击失败');
        exit();
    }
    sleep(3000);
    if(!click(404,342)){     //继续远征
        console.log('继续远征失败');
        exit();
    }    
    sleep(2000);
}
/**
 * 判断颜色是否相似
 */
function similarColor(str1,str2){
    var flag=colors.isSimilar(str1,str2,20);
    console.log('颜色相似'+flag);
    return flag;
}
/**
 * 比较颜色---绝对相等
 */
function compareColor(str1,str2){       //比较颜色
    if(str1.length==str2.length){
        for(var a=0;a<str1.length;a++){
            if(str1.substr(a,1)!=str2.substr(a,1)){
                console.log(str1+'不同'+str2);
                return false;
            }
        }
        console.log(str1+'相同'+str2);
        return true;
    }
    console.log('长度不同');
    return false;
}
/**
 * 停止循环
 */
function stopLooper(id){        //停止循环
    setTimeout(function() {
        clearInterval(id); // 停止循环执行
        console.log('循环已停止');
    },24*60*60*1000);       //1day
}
/**
 * 点击---带sleep(2000)
 */
function clicks(x,y){       //点击
    if(!click(x,y)){
        console.log('点击出错');
        exit();
    }
    sleep(2000);
}

