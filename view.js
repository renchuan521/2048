/*
  view 控制页面的渲染
  author xqhero 476837464@qq.com
  date 2017/12/11
*/
var view = {
	canvasWidth: 512,
	canvasHeight: 512,
	eleBaseSize: 128,  
	eleWidth: 128,
	eleHeight: 128,
	context: null,
	fontsize: 60,
	colors : {"0" : '#CDC1B5',"2" : '#EFE5DB',"4" : '#EEE1C9','8' : '#F3B178','16': '#F59562',
	'32' : '#F77C5E','64' : '#F75E3A','128' : '#EDCF72','256' : '#EDCD60','512' : '#EDC950',
	'1024' : '#EDC53E'
	},

	canvasObj: null,
	container: null,
	// 获取屏幕的宽度高度
	getViewSize : function(){
		return [window.innerWidth,window.innerHeight];
	},
	setSize : function(){
		var canvas = this.canvasObj;
		var game = this.container;
		var size = this.getViewSize();
		if(size[0] < 600 ){
			this.eleWidth = Math.floor((size[0] - 50 )/model.cols);
			this.eleHeight = Math.floor((size[1] - 170) /model.rows);
		}
		this.canvasWidth = model.cols* this.eleWidth + 30;
		this.canvasHeight = model.rows * this.eleHeight + 30;
		canvas.width = this.canvasWidth;
		canvas.height = this.canvasHeight;

		game.style.width = this.canvasWidth + 20 +'px';
	},
	setContext: function(){
		// 设置字体大小
		this.fontsize = Math.floor(this.fontsize * (this.eleWidth/this.eleBaseSize));
		// 设置画布字体上下文
		this.context.font = this.fontsize+'px Arial ';
	},
	// 初始化
	init: function(canvasObj,container){
		if(!window.canvas){
			alert("浏览器不支持画布，请更换浏览器");
			return false;
		}

		this.canvasObj = canvasObj;
		this.container = container;

		this.setSize();  // 根据屏幕的大小进行适配
		this.context = this.canvasObj.getContext('2d'); // 获取画布的上下文
		this.setContext(); // 设置字体大小和样式
	},
	render: function(){
		var dt ;
		// 清空画布内容
		this.context.clearRect(0,0,this.canvasWidth,this.canvasHeight);
		// 循环进行渲染
		for(var j=0;j<model.rows;j++){
			for(var i = 0;i<model.cols;i++){
				dt = model.arr[j][i];
				this.context.fillStyle = this.chooseColor(dt); 
				this.context.fillRect(i*this.eleWidth+i*10,j*this.eleHeight+j*10,this.eleWidth,this.eleHeight);
				this.context.fillStyle = '#fff';
				this.context.textAlign="center";
				this.context.textBaseline = "middle";
			    dt && this.context.fillText(dt,i*this.eleWidth+this.eleWidth/2 + i*10,j*this.eleHeight+this.eleHeight/2 + j*10);
			}
		}
	},
	chooseColor : function(value){
		return this.colors[''+value];
	}

};