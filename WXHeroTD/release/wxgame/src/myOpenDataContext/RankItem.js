function RankItem(){RankItem.super(this),this.size(574,85)}require("./Utils.js"),Laya.class(RankItem,"RankItem",Laya.Box),RankItem.prototype.init=function(i,t){this.removeChildren(),this.rankIndex=this.writeText((t+1).toString(),45,23,36,"black","center",50,1),this.addChild(this.rankIndex),this.rankIndex.anchorX=.5,this.rankIndex.visible=!(t<=2),t<=2&&(this.rankimg=new Laya.Image,this.rankimg.loadImage("res/openDataRes/No."+(t+1)+".png"),this.rankimg.pos(45,15),this.rankimg.anchorX=.5,this.addChild(this.rankimg)),this.headimg=new Laya.Image(i.dataSource.avatarUrl),this.headimg.size(70,65),this.headimg.pos(85,10),this.addChild(this.headimg),this.nickname=this.writeText(i.dataSource.nickname,170,30,25,"#070201","left",50,0),this.nickname.text=Utils.labelTransform(this.nickname.text,36,250),this.addChild(this.nickname),this.score=this.writeText(i.dataSource.KVDataList[0].value,250,36,25,"red","right",200,1),this.addChild(this.score);var e=parseInt(i.dataSource.KVDataList[0].value,10);this.title=this.writeText(Utils.getTitleBySocre(e),370,36,25,"#000000","right",200,1),this.addChild(this.title),this.line=new Laya.Sprite,this.addChild(this.line),this.line.graphics.drawLine(10,81,570,81,"#999595",2)},RankItem.prototype.writeText=function(i,t,e,a,s,h,n,r){var d=new Laya.Label;return d.text=i,d.width=n,d.height=30,d.valign="middle",d.fontSize=a,d.color=s,d.align=h,d.font="SimHei",0!=r&&(d.bold=!0),d.x=t,d.y=e,d};