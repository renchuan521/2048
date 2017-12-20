/*
  model 数据模型
  author xqhero 476837464@qq.com
  date 2017/12/11
*/
var model = {
	
	rows : 4,
	cols : 4,
	arr : [], //存储数据的数组
	randData : [2,4],
	flag : false, // 标记是否有合并或者移动
	score : 0, // 得分
	numbers : 0,
	isOver : false,

	init : function(rows,cols){
		rows && (this.rows=rows);
		cols && (this.cols=cols);

		for($i=0;$i<this.rows;$i++){
			var array = [];
			for($j=0;$j<this.cols;$j++){
				array.push(0);
			}
			this.arr.push(array);
		}
		// 调用随机生成方法 进行2 或 4的生成
		this.randCreate();
	},
	// 生成随机的行和列 并设置好
	randCreate : function(){
		while(true){
			var randRow = (Math.floor(Math.random()*100000))%this.rows;
			var randCol = (Math.floor(Math.random()*100000))%this.cols;
			if(!this.arr[randRow][randCol]) break;
		}
		// 设置数组对应位置为对应的数字
		var index = (Math.floor(Math.random()*100000))% (this.randData.length);
		this.arr[randRow][randCol] = this.randData[index];
	},
	// 合并计算
	calculate: function(moveDirection){
		if(!moveDirection){
			return false;
		} 
		// 获取数据进行合并和移位
		switch(moveDirection){
			case 'right':
				this.leftRight(true);
				break;
			case 'left':
				this.leftRight();
				break;
			case 'up':
				this.upDown();
				break;
			case 'down':
				this.upDown(true);
				break;
		}
		if(this.flag){
			this.randCreate();
			this.numbers += 1;
			// 判断是否满屏
			if(this.numbers == this.cols*this.rows){
				// 判断能否再次移动
				if(this.checkOverH() && this.checkOverV()){
					this.isOver = true;
				}
			}
			this.numbers = 0; // 重置	
		}
	},
	// 对一个一维数组的合并 len 表示长度 direction 表示方向
	// direction 为真表示从后往前 否则 从前往后
	merge: function(arr,len,direction){
		var k,j;
		if(direction){
			for(k=len-1;k>0;k--){
				if(arr[k]){
					for(j=k-1;j>=0;j--){
						if(arr[j]) break;
					}
					if(j>=0 && arr[k] == arr[j]){
						this.flag = true;
						this.score += arr[k];
						arr[k] *= 2;
						arr[j] = 0;
						
					}
				}
			}
		}else{
			for(k=0;k<len-1;k++){
				if(arr[k]){
					for(j=k+1;j<len;j++){
						if(arr[j]) break;
					}
					if(j<len && arr[k] == arr[j]){
						this.flag = true;
						this.score += arr[k];
						arr[k] *= 2;
						arr[j] = 0;
					}
				}
			}
		}
	},
	// 移位 对一个一维数组的移位
	move: function(arr,len,direction){
		var k,j;
		if(direction){
			for(k=len-1,j=len-1;k>=0;k--){
				if(arr[k]){
					if(k==j){
						j--;
					}else{
						arr[j] = arr[k];
						arr[k] = 0;
						j--;
						this.flag = true;
					}
				}
			}
			this.numbers += len-1-j;
		}else{
			for(k=0,j=0;k<len;k++){
				if(arr[k]){
					if(k==j){
						j++;
					}else{
						arr[j] = arr[k];
						arr[k] = 0;
						j++;
						this.flag = true;
					}
				}
			}
			this.numbers += j;
		}
		
	},
	// 向左向右合并移位
	leftRight : function(direction){
		var arr;
		for(var i=0;i<this.rows;i++){
			arr = this.arr[i]; // 得到第i行数据
			// 合并
			this.merge(arr,this.cols,direction);
			//移位
			this.move(arr,this.cols,direction);
			this.arr[i] = arr;
		}
	},
	// 向上向下合并移位
	upDown : function(direction){
		var arr;
		for(var i=0;i<this.cols;i++){
			// 合并
			//得到第i列的数据
			arr = this.getDataByCol(i);
			this.merge(arr,this.rows,direction);
			//移位
			this.move(arr,this.rows,direction);
			// 重新赋值		
			this.setDataByCol(arr,i);
		}
	},
	// 得到第col列的数据
	getDataByCol(col){
		var arr=[],i=0;
		for(;i<this.rows;i++){
			arr.push(this.arr[i][col]);
		}
		return arr;
	},
	// 设置第col列的数据
	setDataByCol(data,col){
		var i=0;
		for(;i<this.rows;i++){
			this.arr[i][col] = data[i];
		}
	},
	checkOverH: function(){
		var i,k,j;
		// 循环当前数组进行判断
		for(i=0;i<this.rows;i++){
			for(k=0;k<this.cols-1;k++){
				if(this.arr[i][k] == this.arr[i][k+1]){
					return false;
				}
			}
		}
		return true;
	},
	checkOverV: function(){
		var i,k,j;
		// 循环当前数组进行判断
		for(i=0;i<this.cols;i++){
			for(k=0;k<this.rows-1;k++){
				if(this.arr[k][i] == this.arr[k+1][i]){
					return false;
				}
			}
		}
		return true;
	},
};