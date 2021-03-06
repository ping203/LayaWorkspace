/**
 * 主游戏界面
 */
var Point = Laya.Point;

var GameUILogic = (function(_super){

    function GameUILogic(){
        GameUILogic.super(this);
    }
    Laya.class(GameUILogic,"GameUILogic",_super);
    _proto = GameUILogic.prototype;

    var GameStartTime = 5;                                    //游戏开始倒计时

    _proto.imgTong = null;                                    //最前面的桶
    _proto.imgGuang = null;                                   //桶的光
    _proto.flyAnim = null;                                    //飞向
    _proto.gameOverBox = null;                                //游戏结算面板
    _proto.bossAnim = null;                                   //boss动画
    _proto.showImgGameover = false;                           //是否已经显示完游戏结束
    this.hurtSelfPlayerId = 0;                                //伤害自己的人物id

    _proto.onInit = function(){
        // this.width = Laya.stage.width;
        // this.height = Laya.stage.height;

        MusicManager.getInstance().playMusic("res/music/1.mp3");

        _proto.imgTong = new Laya.Image();
        _proto.imgGuang = new Laya.Image();
        _proto.gameOverBox = new Laya.Sprite();
        _proto.img_pop = new Laya.Image();
        _proto.flyAnim = new Laya.Animation();
        this.bossAnim = new Laya.Animation();
        this.hurtSelfPlayerId = 0; 
        //弹出 开始
        var popPos = new Point(Laya.stage.width/2,Laya.stage.height/2);
        this.img_pop.skin = this.img_start.skin;
        this.img_pop.pos(popPos.x,popPos.y);
        this.img_pop.anchorX = 0.5;
        this.img_pop.anchorY = 0.5;
        Laya.stage.addChild(this.img_pop);
        this.img_pop.zOrder = 10;
        this.img_pop.visible = false;
        this.showImgGameover = false;

        //排行榜数据
        _proto.dataArr = [];
        //初始化人物列表
        //this.initPlayerListData();
        //this.bossProgress.value = 0;
       
        this.btn_sound.on(Laya.Event.CLICK,this,this.onSoundClick);
        this.btn_start.on(Laya.Event.CLICK,this,this.onStartClick);
        this.changeBubbleBox.on(Laya.Event.CLICK,this,this.onChangeBubble);
        this.btn_rank.on(Laya.Event.CLICK,this,this.onRankClick);
        //this.bossBox.on(Laya.Event.CLICK,this,this.onBossBoxClick);
        Laya.timer.frameOnce(8, this, this.delayShow); 
        
        //MessageController.getInstance().AddNotification(MessageEventName.UpdatePlayerListEvent,this,this.updatePlayerListReceiver);
        

    }

   
    _proto.onDestroy = function(){
        MusicManager.getInstance().stopMusic();
        MessageController.getInstance().RemoveNotification(MessageEventName.UpdatePlayerListEvent,this,this.updatePlayerListReceiver);
    }

    _proto.delayShow = function(){

        //创建新的桶 位于球的上层
        this.imgTong.skin = this.img_tong_front.skin;
        var b_point  = new Point(0,0);
        b_point = this.img_tong_front.localToGlobal(b_point);
        // Gamelog("-----------!!!!!!!!!!!-------tong b_point.x="+b_point.x+",pos x="+posX);
        this.imgTong.pos(b_point.x, b_point.y);
        Laya.stage.addChild(this.imgTong);
        // this.addChild(this.imgTong);
        this.imgTong.zOrder=0.1;
        this.imgTong.visible = false;

        //创建光
        var guangPos =  this.img_guang.localToGlobal(new Point(0,0));
        this.imgGuang.skin = this.img_guang.skin;
        this.imgGuang.pos(guangPos.x,guangPos.y);
        Laya.stage.addChild(this.imgGuang);
        this.imgGuang.zOrder = 1;

        this.img_guang.visible = false;
        this.imgGuang.visible = false;
        //创建动画
        this.flyAnim.pos(guangPos.x,guangPos.y);
        this.flyAnim.interval = 100;
        this.flyAnim.zOrder = 1;
        Laya.stage.addChild(this.flyAnim);
        this.flyAnim.visible = false;

        //boss动画
        this.bossAnim.interval = 60;
        this.bossAnim.zOrder = 2;
        Laya.stage.addChild(this.bossAnim);

        

    }

    

    //根据分数显示效果
    _proto.showScore = function(_basketType,_addScore,_playerData){
        // var imgGuang = this.guangList[_scoreNum - 1];
        var imgGuang = this.imgGuang;
        imgGuang.visible = true;
        imgGuang.alpha = 1;

        Laya.Tween.to(imgGuang,
        {
            alpha:0
        },500);
        // var b_point = new Point(imgGuang.x + imgGuang.width /2,imgGuang.y + imgGuang.height /2);
        var b_point = new Point(imgGuang.x + 20 ,imgGuang.y);
        b_point = this.imgGuang.localToGlobal(new Point(this.imgGuang.width/2,this.imgGuang.height/2));
        BubbleScoreAnim(b_point,_addScore);

        //攻击人物特效
        if(_basketType == BubbleTypes.Player && _playerData != null)
        {
            //创建动画
            var Anim = new Laya.Animation();
            Anim.interval = 100;
            Anim.zOrder = 1;
            Laya.stage.addChild(Anim);
            Laya.timer.frameOnce(1,this,this.playerFlyEffect,[Anim,_playerData]);
        }
        //boss攻击
        var bossValue = 0;
        switch (_basketType) {
            case BubbleTypes.Normal:
                bossValue = 0.02 *3;
                break;
            case BubbleTypes.Player:
                bossValue = 0.1 *3;
                break;
            case BubbleTypes.Egg:
                this.showEggEffect();
                break;
        
            default:
                break;
        }
        //boss光点
        // var bossPoint = this.img_bossIcon.localToGlobal(new Point(this.img_bossIcon.width/2,this.img_bossIcon.height/2));
        // var img_bossItem = new Laya.Image("game/img_defen_dikuang39.png");
        // img_bossItem.anchorX = 0.5;
        // img_bossItem.anchorY = 0.5;
        // img_bossItem.pos(b_point.x, b_point.y);
        // img_bossItem.zOrder=0.1;
        // Laya.stage.addChild(img_bossItem);
        
        // Laya.Tween.to(img_bossItem,{
        //     x:bossPoint.x,
        //     y:bossPoint.y
        // },400,null,new Handler(this,function(){
        //     img_bossItem.destroy();
        //     this.bossProgress.value += bossValue;
        //     //boss攻击进度
        //     if(this.bossProgress.value >= 1){
        //         this.progressAnim.visible = true;
        //         this.progressAnim.play(0,true);
        //     }
        // }));

    }
    //飞向人物效果
    _proto.playerFlyEffect = function(_anim,_playerData){
        //播放动画
        var guangPos =  this.img_guang.localToGlobal(new Point(0,0));
        _anim.pos(guangPos.x,guangPos.y);
        _anim.play(0,true,"flyToPlayer");

        // var targetPos = this.btn_sound.localToGlobal(new Point(0,0));
        var targetPos;
        for(var i = 0;i < this.dataArr.length;i++){
            if(_playerData.playerId == this.dataArr[i].playerId){
                var target = this.playerList.getCell(i);
                targetPos = target.localToGlobal(new Laya.Point(0,0));

            }
        }
        MusicManager.getInstance().playSound("res/music/13.wav");
        Laya.Tween.to(_anim,
        {
            x:targetPos.x - 50,
            y:targetPos.y
        },700,null,new Laya.Handler(this,function(){
            _anim.destroy();
            var hurtAnim = new Laya.Animation();
            hurtAnim.interval = 100;
            hurtAnim.zOrder = 1;
            hurtAnim.pos(targetPos.x - 50 ,targetPos.y -50);
            Laya.stage.addChild(hurtAnim);
            hurtAnim.play(0,false,"hurtPlayer");
            hurtAnim.on(Laya.Event.COMPLETE,this,this.playerHurtEffect,[hurtAnim,_playerData]);
        }));

    }
    //伤害人物效果
    _proto.playerHurtEffect = function(_anim,_playerData){
        _anim.destroy();
        MusicManager.getInstance().playSound("res/music/14.wav");
        Gamelog("------造成人物伤害");
        if(_playerData.hp > 0){
            this.playerHurtHp(_playerData.playerId,5);
            GameModule.getInstance().sendHurtPlayer(1,_playerData.playerId);
        }
    }

    /**改变发射球 */
    _proto.onChangeBubble = function(){
        SceneManager.getInstance().currentScene.changeBubble();
    }
    /**隐藏所有光 */
    _proto.hideAllImgGuang = function(){
        // for(var i=0; i<this.guangList.length; i++){
        //     this.guangList[i].visible = false;
        // }
        this.imgGuang.visible = false;
    }
    /**重新开始 */
    _proto.onGameAgain = function(){
        MusicManager.getInstance().playSound("res/music/1.wav");
        SceneManager.getInstance().currentScene.restartGame();
    }
    
    /**声音开关 */
    _proto.onSoundClick = function(e){
        MusicManager.getInstance().playSound("res/music/1.wav");

        var soundSwitch = MusicManager.getInstance().managerSwitch;
        if(soundSwitch == 1){
            this.btn_sound.skin = "game/btn_shengyin_guan.png";
            MusicManager.getInstance().managerSwitch = 0;
            // LocalStorage.setItem("soundSwitch",0);
            SoundManager.stopAll();
        }else{
            MusicManager.getInstance().managerSwitch = 1;
            // LocalStorage.setItem("soundSwitch",1);
            this.btn_sound.skin = "game/btn_shengyin_kai.png";
            MusicManager.getInstance().playMusic("res/music/1.mp3");
        }
    }

    //开始游戏UI
    _proto.startGameUI = function(){
        this.gameStartPanel.visible = true;
        this.btn_start.visible = true;
        
        this.anim_panda.play(0,true,"pandaDaiji");
        this.anim_panda.stop();

        if (GameInFackBook) {
            FBGame.getInstance().loadRewardAd();
            FBGame.getInstance().loadInterstitialAd();
        }
        //this.onStartClick();
    }

    /**游戏倒计时 显示 */
    _proto.animateTimeBased = function()
    {
        this.currentTime -= 1;
        var timeLabel = this.label_startTime;
        timeLabel.text = this.currentTime; 

        if(this.currentTime<=0){
                Laya.timer.clear(this,this.animateTimeBased);
                this.gameStartPanel.visible = false;
                //开始游戏
                SceneManager.getInstance().currentScene.startGame();
        }
    }
    //游戏开始
    _proto.onStartClick = function(){
        // MusicManager.getInstance().playSound("res/music/1.wav");
        this.btn_start.visible = false;
        this.currentTime = GameStartTime;
        // this.label_startTime.text = this.currentTime;
        this.gameStartPanel.visible = false;
        
        this.img_black.visible = true;
        this.img_pop.skin ="game/img_zhunbei.png";
        this.img_pop.alpha = 0;
        this.img_pop.scaleX = 0;
        this.img_pop.scaleY = 0;
        this.img_pop.visible = true;
        Laya.Tween.to(this.img_pop,{
            alpha:1,
            scaleX:1,
            scaleY:1,
        },1500,Laya.Ease.expoOut,new Laya.Handler(this,this.onTweenFinish));
        //开始游戏
        // SceneManager.getInstance().currentScene.startGame();
        SceneManager.getInstance().currentScene.createPointLine(-90);
        //游戏倒计时
        // Laya.timer.loop(1000, this, this.animateTimeBased);
        /*if(Laya.Browser.onFacebook){
            console.log("----------share ")
            FBInstant.shareAsync({
                intent: 'REQUEST',
                // image: "",
                text: 'X is asking for your help!',
                // data: { myReplayData: '...' },
                }).then(function() {
                // 继续游戏
                });
        }*/
    }

    _proto.onTweenFinish = function(){
        MusicManager.getInstance().playSound("res/music/2.wav");
        this.img_pop.skin ="game/img_kaishi.png";
        Laya.timer.once(500,this,function(){
            this.img_pop.visible = false;
            this.img_black.visible = false;
            //开始游戏
            SceneManager.getInstance().currentScene.startGame();
        });
    }
    /**时间到结束游戏 */
    _proto.gameoverByTime = function(){
        this.label_time.text = 0;
        // var gameoverUI = UIManager.getInstance().showUI("GameoverUI");
        // gameoverUI.visible = false;
        if(!this.showImgGameover){
        // if(this.img_pop.alpha <= 1 && !this.img_pop.visible){
            MusicManager.getInstance().playSound("res/music/3.wav");
            this.img_pop.skin ="game/img_shijiandao.png";
            this.img_pop.alpha = 0;
            this.img_pop.scaleX = 0;
            this.img_pop.scaleY = 0;
            this.img_pop.visible = true;
            Laya.Tween.to(this.img_pop,{
                alpha:1,
                scaleX:1,
                scaleY:1,
            },900,Laya.Ease.expoOut,new Laya.Handler(this,function(){
                this.img_black.visible = false;
                this.img_pop.visible = false;
                this.gameoverUI();
            }));
        }else{
            this.img_black.visible = false;
            this.img_pop.visible = false;
            this.gameoverUI();
        }
    }

    //撞到底部显示游戏结束 
    _proto.gameoverByBottom = function(){
        // MusicManager.getInstance().playSound("res/music/3.wav");
        // this.img_pop.skin ="game/img_shijiandao.png";
        // this.img_pop.alpha = 0;
        // this.img_pop.scaleX = 0;
        // this.img_pop.scaleY = 0;
        // this.img_pop.visible = true;
        // Laya.Tween.to(this.img_pop,{
        //     alpha:1,
        //     scaleX:1,
        //     scaleY:1,
        // },900,Laya.Ease.expoOut,new Laya.Handler(this,function(){
            
        //     this.imgTong.visible = false;
        //     this.img_black.visible = true;
        //     this.showImgGameover = true;
        //     this.gameoverByTime();
        // }));
        this.anim_panda.stop();
        this.img_black.visible = false;
        this.imgTong.visible = false;
        this.img_pop.visible = false;
        this.hideAllImgGuang();
    }

    /**显示结算ui */
    _proto.gameoverUI = function(){
        // this.gameoverUI.visible = true;
        this.img_black.visible = false;
        UIManager.getInstance().showUI("GameoverUI");
        // UIManager.getInstance().getUI("GameoverUI").visible = true;
        this.imgTong.visible = false;
        this.hideAllImgGuang();
        this.anim_panda.stop();
    }

    
    
    /**关闭游戏 */
    _proto.onCloseGame = function(){
        //跳转到玩吧
        // window.location.href=UserModule.getInstance().redirect;
    }

    _proto.onRankClick = function(){
        UIManager.getInstance().showUI("GameRankUI");
    }

    //获得金蛋动画效果
    _proto.showEggEffect = function(){
        MusicManager.getInstance().playSound("res/music/18.wav");
        UIManager.getInstance().showUI("GameEggUI");
    }

    
    return GameUILogic;
})(GameUI);