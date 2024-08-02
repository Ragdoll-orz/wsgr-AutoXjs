/**
 * 写在前面
 *      requestScreenCapture()只能调用一次，超过一次会阻塞运行
 *      colors.toString(images.pixel())输出的内容不能return到函数,同时与相同的rgb做比较为false
 *      ocr方法给的图片框要比文字大一些
 * 
 *      9-1捞战利品
 */
setScreenMetrics(960, 540);      //设置分辨率
var flag = 1;     //设置模式
var activity = 0      //活动地图1-12
var activityRoad = 2;     //活动地图进入点，α=>1、β=>2
var location = 1;      //当前页面——1港区、2出征、3演戏、4远征、5战役、6决战、7活动
var tangeFlag = true;        //战利品模式
var color;      //颜色
var intervalID1;     //定时器id
var boomFlag = false;       //炸鱼超过每日500船默认值
var num = 0;      //计数收菜次数
var numBoom = 0;      //炸鱼次数
var numShip = 0;      //本次运行获取船只数
const dayMaxShip = 500;     //每日最大船只获得
var dayGotship;     //每日已获得船只
var dock;       //船坞容量
var ship;       //当前船只数
var dayGotTanga;   //每日已获得战利品数量
const dayMaxTanga = 50;       //每日最大战利品获得
var type = 2;     //点位类型——0普通、1航空、2夜战
var situation = 2;        //航空战况选择,1-5
var tactics = 4;      //战术选择,1-5
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

switch (flag) {       //控制模式
    case 1:     //!!!提前配置好队伍!!!
        while (true) {
            boomFish(location, 9, 1, 0, true);
        }
        break;
    case 2:     //!!!提前安排远征!!!
        longWalk(location);
        intervalID1 = setInterval(function () {
            longWalk(location);
        }, 15 * 60 * 1000);     //定时器——15min
        stopLooper(intervalID1);    //停止定时器
        break;
    default:
        break;
}
/**
 * 初始化---获取船坞和船只信息
 */
function init() {
    var arr;
    console.log('获取船坞信息');
    sleep(1000);
    clicks(762, 507);
    sleep(1000);
    clicks(553, 254);
    sleep(1000);
    clipPicture(844, 11, 96, 38);      //截取船坞信息
    arr = text.split('/');
    ship = arr[0];
    dock = arr[1];
    toast('船坞' + ship + '/' + dock);
    console.log('船坞' + ship + '/' + dock);
    sleep(2000);
    clicks(34, 29);
    sleep(1000);
    clicks(34, 29);
    sleep(1000);
    clicks(907, 488);
    sleep(1000);
    clipPicture(844, 11, 96, 38);      //截取已打捞船只数量
    arr = text.split('/');
    if (arr[0] == 'O' || arr[0] == 'o') {
        arr[0] = 0;
    }
    dayGotship = arr[0];
    toast('已打捞' + dayGotship + '艘船');
    console.log('已打捞' + dayGotship + '艘船');
    clipPicture(742, 11, 96, 38);       //截取已打捞战利品数量
    arr = text.split('/');
    if (arr[0] == 'O' || arr[0] == 'o') {
        arr[0] = 0;
    }
    dayGotTanga = arr[0];
    toast('已打捞' + dayGotTanga + '战利品');
    console.log('已打捞' + dayGotTanga + '战利品');
    sleep(2000);
    total();
    clicks(34, 29);      //返回港区
}
/**
 * 超500船是否继续，true继续,false停止（默认）
 */
function doBoomFish(flag) {
    if (!(dock - ship > 1)) {
        console.log('船坞已满');
        total();
        exit();
    }
    if (!flag) {
        if (!(dayMaxShip - dayGotship > 1)) {
            console.log('每日打捞船只已到上限');
            total();
            exit();
        }
        if (!(dayMaxTanga - dayGotTanga > 1)) {
            console.log('每日打捞战利品已到上限');
            total();
            exit();
        }
    }
}
/**
 * 统计数据
 */
function total() {
    toast('炸鱼' + numBoom + '次 ' + '今日打捞' + dayGotship + '/' + dayMaxShip + ' 船坞容量' + ship + '/' + dock + '  战利品' + dayGotTanga + '/' + dayMaxTanga);
    console.log('炸鱼 ' + numBoom + ' 次');
    console.log('本次打捞 ' + numShip + '只');
    console.log('今日打捞 ' + dayGotship + '/' + dayMaxShip + '  剩 ' + (dayMaxShip - dayGotship) + '只');
    console.log('船坞容量 ' + ship + '/' + dock + '  剩 ' + (dock - ship) + '只');
    console.log('今日战利品' + dayGotTanga + '/' + dayMaxTanga + '  剩 ' + (dayMaxTanga - dayGotTanga) + '条')
}
/**
 * 炸鱼(位置，第几章，该章哪个海域，活动地图,战利品模式)
 */
function boomFish(position, map, area, activities, tange) {        //炸鱼
    console.log('炸鱼逻辑判断');

    if (position == 1) {        //位于港区
        getCColor(945, 456);
        if (compareColor(color, '#ffff592d')) {        //港区出征按钮——红点
            console.log('港区页远征完成,先执行收菜');
            longWalk(position);
        }
    }
    if (position != 7 && position != 1) {       //出征页面
        getCColor(476, 11);
        if (compareColor(color, '#ffffac96')) {        //出征页按钮——红点
            console.log('出征页远征完成,先执行收菜');
            longWalk(position);
        }
    }
    console.log('远征未完成--boomFish');

    init();     //获取已炸鱼/船坞数据
    doBoomFish(boomFlag);       //判断船坞已满或捞船上限

    if (activities != 0) {      //判断是否活动
        clicks(884, 270);        //点击港区右边活动图，进入活动
        clipPicture(9, 478, 103, 40);      //ocr普通or困难
        if (activities <= 5) {      //普通难度
            if (text == '简单模式')
                clicks(66, 498);     //点击简单模式
            clickActivityMap(activities);
            //与下面应该相同，以后写成方法
            exit();
        } else {      //困难难度
            if (text == '困难模式')
                clicks(66, 498);        //点击困难模式
            clickActivityMap(activities);       //活动地图点击
            //要改！！！
            while (true) {
                getCColor(858, 323);
                if (activityRoad == 1) {        //α入口
                    if (!similarColor(color, '#ff208ef5'))        //蓝色
                        clicks(830, 332);        //点击α
                    clicks(830, 468);        //点击出击准备
                    //shipIsOkForPrepare();     //出征检查
                    //与下面应该相同，以后写成方法
                    exit();
                } else {      //β入口
                    if (!similarColor(color, '#ff208ef5'))
                        clicks(830, 376);
                    clicks(830, 468);
                    //shipIsOkForPrepare();     //出征检查
                    clicks(106, 88);
                    clicks(780, 504);        //点击出征
                    sleep(8000);
                    battle(type, tactics);
                    numBoom++;
                    total();
                    sleep(3000);
                    //return;
                }
            }


        }


        console.error('活动错误');
        exit();
    }
    /* if(决战){        //判断是否决战
        sleep(2000);
        return;
    } */
    clicks(902, 486);        //点击出征
    if (tange) {      //判断是否是战利品
        dayGotship = 'unknow';
        ship = 'unknow';
        while (true) {
            getCColor(476, 11);
            if (compareColor(color, '#ffffac96')) {        //出征页按钮——红点
                console.log('出征页远征完成,先执行收菜');
                clicks(422,25);
                longWalk(4);
                clicks(900,483);
            }
            if(dayGotTanga==50){
                console.log('任务完成');
                total();
                exit();
            }
            findMap(map, area);
            clicks(225, 87);     //第二队
            shipIsOkForPrepare();
            clicks(840, 503);    //开始出征

            clicks(861, 500);    //加速
            sleep(2000);
            clicks(861, 500);    //加速

            clicks(861, 500);    //开始战斗
            clicks(861, 500);    //单横
            numBoom++;
            //sleep(37*1000);
            while (true) {
                clipPicture(267, 330, 133, 40);      //267,330/400,370
                if (text == '追击') {       //判断是否需要夜战
                    console.log('ocr=' + text);
                    clicks(595, 355);       //选择的撤退
                    break;
                }
                sleep(2000);
                clipPicture(410, 25, 135, 42);      //410,25/545,67
                if (text == '战斗结果') {       //判断是否进入结算页
                    console.log('ocr=' + text);
                    break;
                }
                console.log('战斗未结束');
                sleep(5000);
            }
            sleep(4000);
            console.log('战斗结果点击');
            clicks(861, 500);    //战斗结果
            sleep(1000);
            console.log('2');
            clicks(861, 500);    //经验加成页
            sleep(1000);
            //可能的分支，船只未获取
            console.log('3');
            clicks(861, 500);    //获取船只
            console.log('开睡1');
            sleep(4000);
            clicks(332, 351);    //前进--下一个点

            clicks(861, 500);    //加速
            sleep(2000);
            clicks(861, 500);    //加速
            console.log('开始判断补给');
            clipPicture(16, 227, 83, 46);
            if (text != '补给') {
                console.log('第一次没有补给');
                sleep(2000);
                clipPicture(16, 227, 83, 46);
                if (text != '补给') {
                    console.log('第二次没有补给');
                    clicks(702, 501);    //撤退
                    total();
                    sleep(3000);
                    continue;
                }
                console.log('第二次补给识别成功');
            } else if (text == '补给') {
                console.log('发现补给');
            } else {
                console.log('补给识别错误');
                total();
                exit();
            }

            clicks(861, 500);    //开始战斗
            clicks(861, 500);    //单横
            //战斗时间控制
            //sleep(30 * 1000);
            while (true) {
                clipPicture(267, 330, 133, 40);      //267,330/400,370
                if (text == '追击') {       //判断是否需要夜战
                    console.log('ocr=' + text);
                    clicks(595, 355);       //选择的撤退
                    break;
                }
                sleep(2000);
                clipPicture(410, 25, 135, 42);      //410,25/545,67
                if (text == '战斗结果') {       //判断是否进入结算页
                    console.log('ocr=' + text);
                    break;
                }
                console.log('战斗未结束');
                sleep(5000);
            }
            sleep(4000);
            numBoom++;
            dayGotTanga++;
            clicks(861, 500);    //战斗结果
            sleep(1000);
            clicks(861, 500);    //经验加成页
            sleep(1000);
            //可能的分支，船只未获取
            clicks(861, 500);    //获取船只
            clicks(622, 348);    //回港

            total();
            sleep(3000);
        }
    }

    if (location == 1) {
        console.log('港区点击出征');
        clicks(902, 489);        //点击出征
        location = 2;
    }
    if (numBoom == 0)
        findMap(map, area);      //进入地图逻辑
    clicks(584, 281);        //进入地图
    clicks(228, 89);     //选择舰队
    shipIsOkForPrepare();       //状态检查
    clicks(780, 504);        //点击出征
    console.log('进入战斗');
    //截图判断哪条路

    sleep(6000);
    battle(type, tactics);
    numBoom++;
    total();
    sleep(3000);
}
/**
 * 活动地图点击
 */
function clickActivityMap(actnum) {      //活动地图点击
    if (actnum > 6)
        actnum -= 6;
    switch (actnum) {
        case 1:
            clicks(145, 182);
            break;
        case 2:
            //clicks();
            break;
        case 3:
            //clicks();
            break;
        case 4:
            //clicks();
            break;
        case 5:
            clicks(780, 167);
            break;
        case 6:
            //clicks();
            break;
        default:
            console.error('活动地图点击错误');
            exit();
    }
}
/**
 * 战斗逻辑
 */
function battle(type, tactics) {      //战斗逻辑(战斗类型,战术)
    console.log('进入战斗逻辑');
    switch (type) {
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
    clicks(479, 86);     //加速
    sleep(1000);
    clicks(861, 500);
    //判断索敌是否成功
    /*
    if(){
        //成功
    }else{
        //失败
    }
    */
    //clicks(808,500);      //点击开始战斗
    switch (tactics) {      //战术
        case 1:     //

            console.log('战术——单纵');
            break;
        case 2:     //
            clicks(755, 208);
            console.log('战术——复纵');
            break;
        case 3:     //

            console.log('战术——轮型');
            break;
        case 4:     //
            clicks(700, 400);
            console.log('战术——梯形');
            break;
        case 5:     //

            console.log('战术——单横');
            break;
        default:
            console.error('选择战术报错');
    }
    //战斗进行
    /* while(true){
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
    } */
    sleep(35 * 1000);
    //战斗结果页
    //sleep(4000);
    console.log('点击战斗结果页');
    clicks(649, 373);
    //经验加成页
    sleep(3000);
    console.log('点击经验加成页');
    clicks(649, 373);
    //船只获取
    sleep(3000);
    getCColor(758, 173);
    if (similarColor(color, '#ffffe18e')) {
        console.log('点击船只获取');
        clicks(649, 373);
        numShip++;
        ship++;
        dayGotship++;
    }
    //是否前往下个点---出现分支!!!
    sleep(3000);
    console.log('返回');
    clicks(591, 351);        //返回
}
/**
 * 裁剪图片并识别文字
 */
function clipPicture(x, y, width, length) {
    var img = captureScreen();        //截图
    var im = images.clip(img, x, y, width, length);      //裁剪(图片，起始横坐标，起始纵坐标，宽，高)
    ocr(im);
}
/**
 * OCR文字识别
 */
function ocr(img) {
    let result = gmlkit.ocr(img, "zh");
    text = result.text;
}
/**
 * 战况选择
 */
function battleSituation(situation) {     //战况选择
    clicks(479, 86);     //加速
    console.log('进入战况选择');
    switch (situation) {
        case 1:     //

            console.log('战况1——');
            break;
        case 2:     //
            clicks(755, 208);
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
function shipIsOkForPrepare() {      //准备出征
    console.log('出征准备页————检查状态');
    var b = 55;
    var flag = true;
    var count = 0;
    while (flag) {        //二次验证
        console.log('第' + (count + 1) + '次检查');
        if (count == 2) {
            exit();
        }
        for (var a = 0; a < 6; a++) {
            getCColor(b, 321);
            if (!similarColor(color, '#ff3fa16c')) {       //血条不为绿(点位在血条左侧) 
                //clicks(b,321);
                console.error('第' + (a + 1) + '位船只受损');
                if (tangeFlag) {
                    clicks(422, 425);    //快速修理
                    console.log('修理第' + (a + 1) + '位船只');
                    clicks(b, 321);  //受损船只
                } else {
                    break;
                }
                //exchangeShip();
            } else {
                toast('第' + (a + 1) + '位船只良好 ' + b);
                console.log('第' + (a + 1) + '位船只良好 ' + b);
            }
            b = b + 120;
            if (a == 5) {
                flag = false;
            }
        }
        count++;
    }
    console.log('状态良好');
}
/**
 * 更换舰船---船坞页
 */
function exchangeShip() {
    console.log('更换舰船');
    //更换船只逻辑
}
/**
 * 寻找地图。点击出征会进入最后一张打过的地图，通过向上向下各点一下，实现回到9-1位置
 */
function findMap(map, area) {     //寻找地图(第几章，第几张)
    console.log('进入findMap');
    /* clicks(94,236);      //向上点击
    clicks(99,359);      //向下点击
    for(var a=map;a<9;a++){     //定位第map章
        if(a==9)
            break;
        clicks(94,236);      //向上点击
    }
    for(var a=1;a<area;a++){        //定位具体地图
        clicks(931,280);
    } */
    var arr;
    clipPicture(26, 276, 110, 42);
    arr = text.split('章');
    text = arr[0] + '章';
    console.log(text);
    switch (text) {
        case '第一章':
            console.log('case第一章');
            chapterSelect(map, 1);
            seaareaSelect(area);
            break;
        case '第二章':
            console.log('case第二章');
            chapterSelect(map, 2);
            seaareaSelect(area);
            break;
        case '第三章':
            console.log('case第三章');
            chapterSelect(map, 3);
            seaareaSelect(area);
            break;
        case '第四章':
            console.log('case第四章');
            chapterSelect(map, 4);
            seaareaSelect(area);
            break;
        case '第五章':
            console.log('case第五章');
            chapterSelect(map, 5);
            seaareaSelect(area);
            break;
        case '第六章':
            console.log('case第六章');
            chapterSelect(map, 6);
            seaareaSelect(area);
            break;
        case '第七章':
            console.log('case第七章');
            chapterSelect(map, 7);
            seaareaSelect(area);
            break;
        case '第八章':
            console.log('case第八章');
            chapterSelect(map, 8);
            seaareaSelect(area);
            break;
        case '第九章':
            console.log('case第九章');
            chapterSelect(map, 9);
            seaareaSelect(area);
            break;
        default:
            console.error('章节选择出错');
    }
    console.log('已进入地图 ' + map + '-' + area);
}
/**
 * 章节选择(设定章节，当前章节)
 */
function chapterSelect(map, now) {
    console.log('进入章节选择');
    while (true) {
        if (map == now)
            break;
        if (map > now) {
            clicks(99, 359);      //向下点击
            now++;
        } else if (map < now) {
            clicks(94, 236);      //向上点击
            now--;
        }
    }
}
/**
 * 海域选择
 */
function seaareaSelect(area) {
    console.log('进入海域选择');
    var arr;
    clipPicture(667, 78, 223, 53);
    arr = text.split('/');
    arr = arr[0].split('-');
    text = arr[1];
    console.log(text + "海域");
    while (true) {
        if (area == text) {
            break;
        }
        if (area > text) {
            clicks(930, 281);       //向右点击
            text++;
        } else if (area < text) {
            clicks(249, 281);       //向左点击
            text--;
        }
    }
    clicks(620, 289);
}
/**
 * 通过港区出征按钮上的红点和远征按钮上的红点来判断远征是否已完成
 */
function longWalk(position) {        //远征(当前页面)
    /* if(!requestScreenCapture()){        //请求截图权限
        console.log('请求截图失败');
        exit();
    } */
    sleep(2000);
    if (position != 4) {        //不在远征页面
        console.log('不在远征');
        if (position == 1) {        //在港区
            console.log('在港区');
            getCColor(945, 456);
            if (!compareColor(color, '#ffff592d')) {        //港区出征按钮——红点
                console.log('远征未完成');
                return;
            }
            console.log('发现已完成的远征');
            sleep(2000);
        } else {      //不在港区
            getCColor(476, 11);
            if (!compareColor(color, '#ffffac96')) {        //远征按钮——红点
                console.log('远征未完成');
                clicks(32, 28)       //返回港区
                location = 1;
                return;
            }
            console.log('发现已完成的远征,先返回港区');
            clicks(32, 28)       //返回港区
            location = 1;
        }
        /** 收菜 */
        console.log('准备收菜');
        clicks(902, 489);       //点击出征
        location = 4;
        getLongWalk();
        clicks(32, 28)       //返回港区
        location = 1;
        return;     //分支!4结束
    }
    console.log('在远征页面');
    getCColor(476, 11);
    if (!compareColor(color, '#ffffac96')) {        //远征按钮——红点
        console.log('远征未完成');
        clicks(32, 28)       //返回港区
        location = 1;
        return;
    }
    /** 收菜 */
    getLongWalk();
    clicks(32, 28)       //返回港区——分支4结束
    location = 1;
}
/** 
 * 获取颜色---带sleep(2000)
 */
function getCColor(x, y) {
    console.log('进入获取颜色');
    //requestScreenCapture(false);        //请求竖屏截图
    var img = captureScreen();        //截图
    var col = images.pixel(img, x, y);        //获取图片(x,y)处的颜色
    color = colors.toString(col);      //返回颜色
    sleep(2000);
}
/** 
 * 收菜部分，利用软件自身，当远征完成时，点击出征按钮会自动跳到相应远征页
 */
function getLongWalk() {
    console.log('getLongWalk');
    var getFlag = true;
    while (getFlag) {
        getCColor(915, 150);
        if (compareColor(color, '#fffee442')) {
            getLongWalkClick(915, 150);
            console.log('收菜成功1');
            num++;
        }
        sleep(2000);
        getCColor(915, 253);
        if (compareColor(color, '#fffee442')) {
            getLongWalkClick(915, 253);
            console.log('收菜成功2');
            num++;
        }
        sleep(2000);
        getCColor(915, 362);
        if (compareColor(color, '#fffee442')) {
            getLongWalkClick(915, 362);
            console.log('收菜成功3');
            num++;
        }
        sleep(2000);
        getCColor(915, 466);
        if (compareColor(color, '#fffee442')) {
            getLongWalkClick(915, 466);
            console.log('收菜成功4');
            num++;
        }
        sleep(2000);
        getCColor(476, 11);
        if (compareColor(color, '#ffffac96')) {        //远征按钮——红点
            console.log('还可以收菜');
        } else {
            getFlag = false;      //终止循环
        }
    }
    console.log('收菜结束');
    console.log('已收菜' + num + '次');
}
/**
 * 收菜点击---带sleep(2000)
 */
function getLongWalkClick(x, y) {
    console.log('getLongWalkClick');
    if (!click(x, y)) {     //点击收菜
        console.log('收菜点击失败');
        exit();
    }
    sleep(3000);
    if (!click(x, y)) {     //结算页面
        console.log('收菜结算点击失败');
        exit();
    }
    sleep(3000);
    if (!click(404, 342)) {     //继续远征
        console.log('继续远征失败');
        exit();
    }
    sleep(2000);
}
/**
 * 判断颜色是否相似
 */
function similarColor(str1, str2) {
    var flag = colors.isSimilar(str1, str2, 20);        //flag(true/false)
    console.log('颜色相似' + flag);
    return flag;
}
/**
 * 比较颜色---绝对相等
 */
function compareColor(str1, str2) {       //比较颜色
    if (str1.length == str2.length) {
        for (var a = 0; a < str1.length; a++) {
            if (str1.substr(a, 1) != str2.substr(a, 1)) {
                console.log(str1 + '不同' + str2);
                return false;
            }
        }
        console.log(str1 + '相同' + str2);
        return true;
    }
    console.log('长度不同');
    return false;
}
/**
 * 停止循环
 */
function stopLooper(id) {        //停止循环
    setTimeout(function () {
        clearInterval(id); // 停止循环执行
        console.log('循环已停止');
    }, 24 * 60 * 60 * 1000);       //1day
}
/**
 * 点击---带sleep(2000)
 */
function clicks(x, y) {       //点击
    if (!click(x, y)) {
        console.log('点击出错');
        exit();
    }
    sleep(2000);
}