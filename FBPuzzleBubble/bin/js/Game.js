
//laya初始化
Laya.init(GameConfig.GameWidth, GameConfig.GameHeight, Laya.WebGL);
//FPS
// Laya.Stat.show(0,0);
//设置适配模式 宽度不变，高度根据屏幕比缩放
Laya.stage.scaleMode = "fixedauto";
//场景布局类型 自动竖屏
Laya.stage.screenMode = "vertical";
//设置水平居中对齐
Laya.stage.alignH = "center";
//垂直居中对齐
Laya.stage.alignV = "middle";

Laya.stage.bgColor = "#000000";//设置画布的背景颜色。
//使用WebWorker加载并解码图片，把耗费cpu的工作放到worker中执行，防止js主线程卡死，从而能大大减少游戏中加载卡顿现象。
//指定worker.js所在的路径,比如放在libs目录下
//Laya.WorkerLoader.workerPath = "libs/worker.js";
//开启使用WorkerLoader来加载解码图片的功能
//Laya.WorkerLoader.enable = true;

//设置版本控制类型为使用文件名映射的方式
// ResourceVersion.type = ResourceVersion.FILENAME_VERSION;
//加载版本信息文件
// ResourceVersion.enable("version.json", Handler.create(this, initVersion));   

if (GameInFackBook) {
    FBInstant.initializeAsync().then(function () {
        console.log("initializeAsync End 004");
        console.log("getLocale:", FBInstant.getLocale());
        console.log("getPlatform:", FBInstant.getPlatform());
        console.log("getSDKVersion", FBInstant.getSDKVersion());
        console.log("getSupportedAPIs", FBInstant.getSupportedAPIs());
        console.log("getEntryPointData", FBInstant.getEntryPointData());

        beginLoad();
        FBInstant.setLoadingProgress(10);
        
        FBGame.getInstance().Init();

    })

    
} else {
    beginLoad();
}


function  beginLoad(){
    var arr = [
                //图集
                ["res/atlas/bubbles.atlas",Laya.Loader.ATLAS],
                ["res/atlas/game.atlas",Laya.Loader.ATLAS],
                // ["res/atlas/bomb.atlas",Laya.Loader.ATLAS],
                //图片
                ["game/bgGame.png",Laya.Loader.IMAGE],
                //字体
                // ["bitmapFont/shuziRed.fnt",Laya.Loader.FONT],
                //声音
                ["res/music/1.mp3",Laya.Loader.SOUND],
                ["res/music/1.wav",Laya.Loader.SOUND],
                ["res/music/2.wav",Laya.Loader.SOUND],
                ["res/music/3.wav",Laya.Loader.SOUND],
                ["res/music/4.wav",Laya.Loader.SOUND],
                ["res/music/6.wav",Laya.Loader.SOUND],
                ["res/music/7.wav",Laya.Loader.SOUND],
                ["res/music/8.wav",Laya.Loader.SOUND],
                ["res/music/9.wav",Laya.Loader.SOUND],
                ["res/music/12.ogg",Laya.Loader.SOUND],

                ];

    var asset = [];
    for(var i=0; i<arr.length; i++){
        asset.push({
            url : [
                arr[i][0]
            ],
            type:arr[i][1]
        }); 
    }
    //loading 界面需要的图集
    if (GameInFackBook) {
        Laya.loader.load(asset, Laya.Handler.create(null, loadingEnd), Laya.Handler.create(null, onLoading,null,false));
        // Laya.loader.load(asset, Laya.Handler.create(null, loadingCallback));
    } else {
        Laya.loader.load(asset, Laya.Handler.create(null, loadingCallback));
    }
    
}

//加载进度
function onLoading (progress){
    console.log("loadingUI onLoading: " + progress);
    var intPro = parseInt(progress *100+"");
    console.log("loadingUI onLoading: " + intPro);
    // if(intPro > 80)
    //     intPro = 80;
    FBInstant.setLoadingProgress(intPro);
    //取小数点后2位
    // this.loadingLabel.text = (progress).toFixed(2) * 100 +"%";
}

function loadingEnd() {
    console.log("-------------loadingEnd");

    FBInstant.startGameAsync().then(function () {
		console.log("-------------startGameAsync");
        loadingCallback();
    });

}

function loadingCallback(){

    console.log("----------loadingCallback ");

    Laya.Animation.createFrames(["bubbles/bomb_01.png","bubbles/bomb_02.png","bubbles/bomb_03.png","bubbles/bomb_04.png"],"bomb");
    
    Laya.Animation.createFrames(["game/img_daiji01.png","game/img_daiji02.png","game/img_daiji03.png","game/img_daiji04.png","game/img_daiji06.png"],"pandaDaiji");

    Laya.Animation.createFrames(["game/img_toulan01.png","game/img_toulan02.png"],"pandaToulan");

    if (GameInFackBook) {
        FBGame.getInstance().loadRewardAd();
    }
    SceneManager.getInstance().currentScene = new GameScene();


    
}
