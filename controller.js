/*
	controller 控制器对象
	功能： 实现对游戏主流程的控制 及 事件响应
	author: xqhero 476837464@qq.com
	date 2017/12/11
*/
var controller = {

	voice : null,     // 声音
	canvas : null,    // 画布
	restartBtn : null,// 重新开始按钮
	container : null, // 容器
	score : null,
	mask: null,
	gameAgainBtn: null,
	bestscore: null,

	direct : "right", // 方向 默认为向右
	touchCord : [],   // touch事件的坐标存储数组
	initConfig: {
		'voiceId': '#voice',
		'canvasId':'#canvas',
		'restartBtnId':'#restart',
		'container' : '#container',
		'score': '#score',
		'bestscore': '#maxscore p',
		'mask': '.mask',
		'gameAgainBtn':'.mask button',
	},
	/*
		init 初始化
		config 配置参数
	*/
	init: function(config={}){
		// 合并json对象
		this.initConfig = Object.assign(this.initConfig, config);
		// 获取各种对象
		this.container = document.querySelector(this.initConfig['container']);
		this.voice = document.querySelector(this.initConfig['voiceId']);
		this.canvas = document.querySelector(this.initConfig['canvasId']);
		this.restartBtn = document.querySelector(this.initConfig['restartBtnId']);
		this.score = document.querySelector(this.initConfig['score']);
		this.bestscore = document.querySelector(this.initConfig['bestscore']);
		this.mask = document.querySelector(this.initConfig['mask']);
		this.gameAgainBtn = document.querySelector(this.initConfig['gameAgainBtn']);
		//console.log(this.score);
		// 数据初始化
		model.init(); 
		view.init(this.canvas,this.container);
		view.render();
		// 初始化历史最高分
		this.bestScore();
		this.updateScore();	
		this.bindEvents();
	},
	bestScore: function(flag){
		var bestscore = 0 ;
		if(localStorage.bestscore){
			bestscore = Number(localStorage.bestscore);
		}
		if(flag){
			(model.score > bestscore)  &&  (localStorage.bestscore = model.score);
		}else{
			this.bestscore.innerText = bestscore;
		}
	},
	updateScore: function(){
		this.score.innerText = model.score;
	},

	bindEvents: function(){
		var that = this;
		document.addEventListener('keydown',function(ent){
			var event = ent || window.event;
			// 得到按下的键值
			var keycode = event.keyCode;
			// switch 判断
			switch(keycode){
				case 37:
				case 65:
					that.direct = "left";
					break;
				case 38:
				case 87:
					that.direct = "up";
					break;
				case 39:
				case 68:
					that.direct = "right";
					break;
				case 40:
				case 83:
					that.direct = "down";
					break;
			}
			that.deal();
			
		});
		this.canvas.addEventListener("touchstart", function(e){
			var event = e || window.event;
			// 记录当前触摸的位置
			that.touchCord[0] =  e.touches[0].clientX;
			that.touchCord[1] =  e.touches[0].clientY;

		});
  	    this.canvas.addEventListener("touchend", function(e){
  	    	var event = e || window.event;
  	    	var lastX = that.touchCord[2];
  	    	var lastY = that.touchCord[3];
  	    	var diffx = lastX - that.touchCord[0];
  	    	var diffy = lastY - that.touchCord[1];
  	    	if(diffx > 0 && Math.abs(diffx/diffy) > 1){
  	    		that.direct = 'right';
  	    	}else if(diffx<0 && Math.abs(diffx/diffy)>1){
  	    		that.direct = 'left';
  	    	}else if(diffy>0 && Math.abs(diffy/diffx)>1){
  	    		that.direct = 'down';
  	    	}else if(diffy<0 && Math.abs(diffy/diffx)>1){
  	    		that.direct = 'up';
  	    	}
  	    	that.touchCord.length = 0;
  	    	that.deal();
  	    });
        this.canvas.addEventListener("touchmove",function(ent){
        	var event = ent || window.event;
        	that.touchCord[2] = event.touches[0].clientX;
        	that.touchCord[3] = event.touches[0].clientY;
        	event.preventDefault();
        });
		this.restartBtn.addEventListener('click',function(){
			location.reload();
		});

		this.gameAgainBtn.addEventListener('click',function(){
			location.reload();
		});

	},
	deal: function(){
		if(model.isOver) return;
		model.calculate(this.direct);
		if(model.flag){
			this.voice.play();
			model.flag = false;
		}
		view.render();
		this.updateScore();
		if(model.isOver){
			// 游戏结束
			this.mask.style.display='block';
			// 保存最高分
			this.bestScore(true);
		}	
	}
};

controller.init({'container':'#game','score':'#score p','mask':'.mask'});
