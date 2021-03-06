var bomberMan = angular.module('bomberMan',['LocalStorageModule']);

// bomberMan.$$socket = io.connect();

bomberMan.controller('gameController',function($scope, localStorageService){
	var name;
	if(!localStorageService.get('name')){
		name = prompt('Please Enter Your Name');
		if(!name){
			name = "Anonymous";
		}
		localStorageService.set('name',name);
	}
	name = localStorageService.get('name');

	// bomberMan.$$socket.emit('newUser',name);

	// bomberMan.$$socket.on('init',function(place){
	// 	console.log("Player: ", place);
	// 	var initial = {};
	// 	if(place === 0){
	// 		initial = {
	// 			player: {
	// 				x: 2,
	// 				y: 1
	// 			},
	// 			createWorld: true
	// 		};
	// 	} else if(place === 1){
	// 		initial = {
	// 			player: {
	// 				x: 14,
	// 				y: 1
	// 			}
	// 		};
	// 	} else if(place === 2){
	// 		initial = {
	// 			player: {
	// 				x: 14,
	// 				y: 11
	// 			}
	// 		};	
	// 	} else {
	// 		initial = {
	// 			player: {
	// 				x: 2,
	// 				y: 11
	// 			}
	// 		};	
	// 	}
	// 	game(initial,name);
	// });

	game(null,name);
});

function game(initial,userName){
	//CONSTANTS
	var cols = 17;
	var rows = 15;
	var pixels = 40;
	var name = userName;

	//Directions
	var LEFT=0, UP=1, RIGHT = 2, DOWN = 3;

	//KeyCodes
	var KEY_LEFT=37, KEY_UP=38, KEY_RIGHT=39, KEY_DOWN=40, SPACEBAR=32;

	//FANCY COLLISION DETECTION FUNCTION
	var AABBIntersect = function(ax, ay, aw, ah, bx, by, bw, bh) {
		return ax < bx + bw && ay < by + bh && bx < ax + aw && by < ay + ah;
	};

	var CollisionInArrayForPlayer = function(a,b,direction,what){
		if(what === "block"){
			a.cx = a.x;
			a.cy = a.y - 1;
			if(direction == UP){
				a.cy--;
			}
			if(direction == DOWN){
				a.cy++;
			}
			if(direction == LEFT){
				a.cx--;
			}
			if(direction == RIGHT){
				a.cx++;
			}

			for(var c in b){
				if(AABBIntersect(a.cx, a.cy + 40, a.cw, a.ch, b[c].cx + 2, b[c].cy + 11, b[c].cw - 7, b[c].ch - 13)){
					return true;
				}
			}
			return false;
		} else if(what === "bomb"){
			a.cx = a.x;
			a.cy = a.y - 1;
			if(direction == UP){
				a.cy--;
			}
			if(direction == DOWN){
				a.cy++;
			}
			if(direction == LEFT){
				a.cx--;
			}
			if(direction == RIGHT){
				a.cx++;
			}

			for(var d in b){
				if(b[d].steppedOn){
					return false;
				} else {
					if(AABBIntersect(a.cx, a.cy + 40, a.cw - 10, a.ch - 40, b[d].cx - 30, b[d].cy - 10, b[d].cw * 2 - 5, b[d].ch * 2 + 5)){
						return true;
					}
				}
			}
			return false;
		} else if(what === "wall") {
			a.cx = a.x;
			a.cy = a.y - 1;
			if(direction == UP){
				a.cy--;
			}
			if(direction == DOWN){
				a.cy++;
			}
			if(direction == LEFT){
				a.cx--;
			}
			if(direction == RIGHT){
				a.cx++;
			}

			for(var e in b){
				if(AABBIntersect(a.cx, a.cy + 40, a.cw, a.ch, b[e].cx + 2, b[e].cy + 11, b[e].cw - 7, b[e].ch - 13)){
					return true;
				}
			}
		}
	};

	var CollisionInArrayForExplosion = function(a,b,c){
		var taken = [];
		/*
			------------- DUMBASS ALERT --------------
			LEFT1 AND LEFT2 IS ACTUALLY TO THE RIGHT,
			RIGHT1 AND RIGHT2 IS ACTUALLY TO THE LEFT..
			CODED IN OTHER PLACES THE WRONG WAY SO DONT CHANGE
		*/
		for(var d in b){
			if(AABBIntersect(a.cx + pixels,a.cy,a.cw,a.ch,b[d].cx,b[d].cy,b[d].cw,b[d].ch)){
				taken.push("LEFT1");
			}
			if(AABBIntersect(a.cx + pixels + pixels,a.cy,a.cw,a.ch,b[d].cx,b[d].cy,b[d].cw,b[d].ch)){
				taken.push("LEFT2");
			}
			if(AABBIntersect(a.cx - pixels,a.cy,a.cw,a.ch,b[d].cx,b[d].cy,b[d].cw,b[d].ch)){
				taken.push("RIGHT1");
			}
			if(AABBIntersect(a.cx - pixels - pixels,a.cy,a.cw,a.ch,b[d].cx,b[d].cy,b[d].cw,b[d].ch)){
				taken.push("RIGHT2");
			}
			if(AABBIntersect(a.cx,a.cy - pixels,a.cw,a.ch,b[d].cx,b[d].cy,b[d].cw,b[d].ch)){
				taken.push("UP1");
			}
			if(AABBIntersect(a.cx,a.cy - pixels - pixels,a.cw,a.ch,b[d].cx,b[d].cy,b[d].cw,b[d].ch)){
				taken.push("UP2");
			}
			if(AABBIntersect(a.cx,a.cy + pixels,a.cw,a.ch,b[d].cx,b[d].cy,b[d].cw,b[d].ch)){
				taken.push("DOWN1");
			}
			if(AABBIntersect(a.cx,a.cy + pixels + pixels,a.cw,a.ch,b[d].cx,b[d].cy,b[d].cw,b[d].ch)){
				taken.push("DOWN2");
			}
		}

		for(var e in c){
			if(AABBIntersect(a.cx + pixels,a.cy,a.cw,a.ch,c[e].cx,c[e].cy,c[e].cw,c[e].ch)){
				taken.push("LEFT1");
			}
			if(AABBIntersect(a.cx + pixels + pixels,a.cy,a.cw,a.ch,c[e].cx,c[e].cy,c[e].cw,c[e].ch)){
				taken.push("LEFT2");
			}
			if(AABBIntersect(a.cx - pixels,a.cy,a.cw,a.ch,c[e].cx,c[e].cy,c[e].cw,c[e].ch)){
				taken.push("RIGHT1");
			}
			if(AABBIntersect(a.cx - pixels - pixels,a.cy,a.cw,a.ch,c[e].cx,c[e].cy,c[e].cw,c[e].ch)){
				taken.push("RIGHT2");
			}
			if(AABBIntersect(a.cx,a.cy - pixels,a.cw,a.ch,c[e].cx,c[e].cy,c[e].cw,c[e].ch)){
				taken.push("UP1");
			}
			if(AABBIntersect(a.cx,a.cy - pixels - pixels,a.cw,a.ch,c[e].cx,c[e].cy,c[e].cw,c[e].ch)){
				taken.push("UP2");
			}
			if(AABBIntersect(a.cx,a.cy + pixels,a.cw,a.ch,c[e].cx,c[e].cy,c[e].cw,c[e].ch)){
				taken.push("DOWN1");
			}
			if(AABBIntersect(a.cx,a.cy + pixels + pixels,a.cw,a.ch,c[e].cx,c[e].cy,c[e].cw,c[e].ch)){
				taken.push("DOWN2");
			}
		}

		return taken;
	};

	var CollisionInArrayForArray = function(a,b,v){
		for (var c in a){
			for (var d in b){
				if(AABBIntersect(a[c].cx + pixels,a[c].cy,a[c].cw,a[c].ch,b[d].cx,b[d].cy,b[d].cw,b[d].ch) && v.indexOf('LEFT1') === -1){
					b[d].explode = true;
					return;
				}
				if(AABBIntersect(a[c].cx + pixels + pixels,a[c].cy,a[c].cw,a[c].ch,b[d].cx,b[d].cy,b[d].cw,b[d].ch) && v.indexOf('LEFT1') === -1 && v.indexOf('LEFT2') === -1){
					b[d].explode = true;
					return;
				}
				if(AABBIntersect(a[c].cx - pixels,a[c].cy,a[c].cw,a[c].ch,b[d].cx,b[d].cy,b[d].cw,b[d].ch) && v.indexOf('RIGHT1') === -1){
					b[d].explode = true;
					return;
				}
				if(AABBIntersect(a[c].cx - pixels - pixels,a[c].cy,a[c].cw,a[c].ch,b[d].cx,b[d].cy,b[d].cw,b[d].ch) && v.indexOf('RIGHT1') === -1 && v.indexOf('RIGHT2') === -1){
					b[d].explode = true;
					return;
				}
				if(AABBIntersect(a[c].cx,a[c].cy + pixels,a[c].cw,a[c].ch,b[d].cx,b[d].cy,b[d].cw,b[d].ch) && v.indexOf('DOWN1') === -1){
					b[d].explode = true;
					return;
				}
				if(AABBIntersect(a[c].cx,a[c].cy + pixels + pixels,a[c].cw,a[c].ch,b[d].cx,b[d].cy,b[d].cw,b[d].ch) && v.indexOf('DOWN1') === -1 && v.indexOf('DOWN2') === -1){
					b[d].explode = true;
					return;
				}
				if(AABBIntersect(a[c].cx,a[c].cy - pixels,a[c].cw,a[c].ch,b[d].cx,b[d].cy,b[d].cw,b[d].ch) && v.indexOf('UP1') === -1){
					b[d].explode = true;
					return;
				}
				if(AABBIntersect(a[c].cx,a[c].cy - pixels - pixels,a[c].cw,a[c].ch,b[d].cx,b[d].cy,b[d].cw,b[d].ch) && v.indexOf('UP1') === -1 && v.indexOf('UP2') === -1){
					b[d].explode = true;
					return;
				}
			}
		}
	};

	var CollisionInArrayForDeath = function(a,b,v){
		a.cx = a.x;
		a.cy = a.y - 1;
		for (var d in b){
			// console.log(JSON.parse(JSON.stringify(a)));
			// console.log(JSON.parse(JSON.stringify(b)));
			// console.log(JSON.parse(JSON.stringify(v)));
			if(AABBIntersect(a.cx,a.cy,a.ch,a.cw,b[d].cx,b[d].cy,b[d].cw,b[d].ch)){
				player.life--;
				break;
			}
			if(AABBIntersect(a.cx + 20 + pixels,a.cy + 20,a.cw,a.ch,b[d].cx,b[d].cy,b[d].cw,b[d].ch) && v.indexOf('RIGHT1') === -1){
				player.life--;
				break;
			}
			if(AABBIntersect(a.cx + 20 + pixels + pixels,a.cy + 20,a.cw,a.ch,b[d].cx,b[d].cy,b[d].cw,b[d].ch) && v.indexOf('RIGHT1') === -1 && v.indexOf('RIGHT2') === -1){
				player.life--;
				break;
			}
			if(AABBIntersect(a.cx + 20 - pixels,a.cy + 20,a.cw,a.ch,b[d].cx,b[d].cy,b[d].cw,b[d].ch) && v.indexOf('LEFT1') === -1){
				player.life--;
				break;
			}
			if(AABBIntersect(a.cx + 20 - pixels - pixels,a.cy + 20,a.cw,a.ch,b[d].cx,b[d].cy,b[d].cw,b[d].ch) && v.indexOf('LEFT1') === -1 && v.indexOf('LEFT2') === -1){
				player.life--;
				break;
			}
			if(AABBIntersect(a.cx + 20,a.cy - 20 + pixels,a.cw,a.ch * 2,b[d].cx,b[d].cy,b[d].cw,b[d].ch) && v.indexOf('UP1') === -1){
				player.life--;
				break;
			}
			if(AABBIntersect(a.cx + 20,a.cy + pixels + pixels,a.cw,a.ch * 2,b[d].cx,b[d].cy,b[d].cw,b[d].ch) && v.indexOf("UP1") === -1 && v.indexOf('UP2') === -1){
				player.life--;
				break;
			}
			if(AABBIntersect(a.cx + 20,a.cy - 20 - pixels,a.cw,a.ch * 2,b[d].cx,b[d].cy,b[d].cw,b[d].ch) && v.indexOf('DOWN1') === -1){
				player.life--;
				break;
			}
			if(AABBIntersect(a.cx + 20,a.cy - pixels - pixels,a.cw,a.ch * 2,b[d].cx,b[d].cy,b[d].cw,b[d].ch) && v.indexOf("DOWN1") === -1 && v.indexOf('DOWN2') === -1){
				player.life--;
				break;
			}
		}
	};

	var CollisionInArrayForWall = function(a,b,v){
		for(var d in b){
			// LEFT IS RIGHT AND RIGHT IS LEFT...
			if(v.indexOf("LEFT1") !== -1 && AABBIntersect(a.cx,a.cy,a.cw,a.ch,b[d].cx - pixels,b[d].cy,b[d].cw,b[d].ch)){
				b[d].destroy(b[d]);
			} else if(v.indexOf("LEFT1") == -1 && v.indexOf('LEFT2') !== -1 && AABBIntersect(a.cx,a.cy,a.cw,a.ch,b[d].cx - pixels - pixels,b[d].cy,b[d].cw,b[d].ch)){
				b[d].destroy(b[d]);
			} 

			if(v.indexOf("RIGHT1") !== -1 && AABBIntersect(a.cx,a.cy,a.cw,a.ch,b[d].cx + pixels,b[d].cy,b[d].cw,b[d].ch)){
				b[d].destroy(b[d]);
			} else if(v.indexOf("RIGHT1") == -1 && v.indexOf('RIGHT2') !==-1 && AABBIntersect(a.cx,a.cy,a.cw,a.ch,b[d].cx + pixels + pixels,b[d].cy,b[d].cw,b[d].ch)){
				b[d].destroy(b[d]);
			}

			if(v.indexOf("UP1") !== -1 && AABBIntersect(a.cx,a.cy,a.cw,a.ch,b[d].cx,b[d].cy + pixels,b[d].cw,b[d].ch)){
				b[d].destroy(b[d]);
			} else if(v.indexOf("UP1") == -1 && v.indexOf('UP2') !==-1 && AABBIntersect(a.cx,a.cy,a.cw,a.ch,b[d].cx,b[d].cy + pixels + pixels,b[d].cw,b[d].ch)){
				b[d].destroy(b[d]);
			}

			if(v.indexOf("DOWN1") !== -1 && AABBIntersect(a.cx,a.cy,a.cw,a.ch,b[d].cx,b[d].cy - pixels,b[d].cw,b[d].ch)){
				b[d].destroy(b[d]);
			} else if(v.indexOf("DOWN1") == -1 && v.indexOf('DOWN2') !==-1 && AABBIntersect(a.cx,a.cy,a.cw,a.ch,b[d].cx,b[d].cy - pixels - pixels,b[d].cw,b[d].ch)){
				b[d].destroy(b[d]);
			}
		}
	};

	function Block(x,y,src,xtra){
		this.x = x;
		this.y = y;
		this.width = pixels;
		this.height = pixels;
		this.cw = pixels;
		this.ch = pixels;
		this.cx = this.x * pixels;
		this.cy = this.y * pixels;
		var img = new Image();
		img.onload = function(){
			backgroundCtx.drawImage(img,x*pixels,y*pixels,pixels,pixels + xtra);
		};
		img.src = src;
	}

	var wallIMG = new Image();
	wallIMG.src = 'img/wall.png';
	var blownwallIMG =  new Image();
	blownwallIMG.src = 'img/blownwall.png';
	function Wall(x,y){
		this.x = x;
		this.y = y;
		this.width = pixels;
		this.height = pixels;
		this.cw = pixels;
		this.ch = pixels;
		this.cx = this.x;
		this.cy = this.y;
		var self = this;

		this.draw = function(){
			var x = this.x;
			var y = this.y;
			var width = this.width;
			var height = this.height;
			gameCtx.drawImage(wallIMG,x,y,width,height);
		};

		this.destroy = function(id){
			var x = this.x;
			var y = this.y;
			var width = this.width;
			var height = this.height;
			setTimeout(function(){
				if(id.x === x && id.y === y){
					gameCtx.drawImage(blownwallIMG,x,y,width,height);
				}
			},200);
			setTimeout(function(){
				if(id.x === x && id.y === y){
					delete walls[walls.indexOf(self)];
				}
			},650);
		};
	}

	var sprite = new Image();
	sprite.src = 'img/sprite.gif';
	function Player(x,y,src,d,user){
		this.x = x;
		this.y = y;
		this.user = user;
		this.width = 34;
		this.height = 56;
		this.cw = this.width;
		this.ch = this.height / 2;
		this.src = src;
		this.direction = d;
		this.life = 1;
		var move = -10;
		var moveTime = 0;

		this.move = function(direction){
			var person = this;
			var block = "block";
			var bomb = "bomb";
			var wall = "wall";
			move++;
			moveTime = 0;
			if(move === 30){
				move = -10;
			}
			if(direction === LEFT && !CollisionInArrayForPlayer(person,map,LEFT,block) && !CollisionInArrayForPlayer(person,bombs,LEFT,bomb) && !CollisionInArrayForPlayer(person,walls,LEFT,wall)){
				this.x -= 1.2;
				this.direction = LEFT;
			}
			if(direction === RIGHT && !CollisionInArrayForPlayer(person,map,RIGHT,block) && !CollisionInArrayForPlayer(person,bombs,RIGHT,bomb) && !CollisionInArrayForPlayer(person,walls,RIGHT,wall)){
				this.x += 1.2;
				this.direction = RIGHT;
			}
			if(direction === DOWN && !CollisionInArrayForPlayer(person,map,DOWN,block) && !CollisionInArrayForPlayer(person,bombs,DOWN,bomb) && !CollisionInArrayForPlayer(person,walls,DOWN,wall)){
				this.y += 1.2;
				this.direction = DOWN;
			}
			if(direction === UP && !CollisionInArrayForPlayer(person,map,UP,block) && !CollisionInArrayForPlayer(person,bombs,UP,bomb) && !CollisionInArrayForPlayer(person,walls,UP,wall)){
				this.y -= 1.2;
				this.direction = UP;
			}
		};

		this.update = function(data){
			this.x = data.x;
			this.y = data.y;
			this.direction = data.direction;
		};

		this.moveFinish = function(direction){
			var x = this.x;
			var y = this.y;	
			var width = this.width;
			var height = this.height;
			if(moveTime > 5){
				move = -10;
				if(this.direction === DOWN){
					gameCtx.drawImage(sprite,105,0,17,28,x,y,width,height);
				}
				if(this.direction === UP){
					gameCtx.drawImage(sprite,0,0,17,28,x,y,width,height);
				}
				if(this.direction === LEFT){
					gameCtx.drawImage(sprite,156,0,17,28,x,y,width,height);
				}
				if(this.direction === RIGHT){
					gameCtx.drawImage(sprite,52,0,17,28,x,y,width,height);
				}
			}
		};

		this.draw = function(){
			var x = this.x;
			var y = this.y;	
			var width = this.width;
			var height = this.height;
			moveTime++;
			if(this.direction === DOWN){
				if(move <= 1){
					gameCtx.drawImage(sprite,105,0,17,28,x,y,width,height);
				}
				if(move > 0 && move <= 10){
					gameCtx.drawImage(sprite,122,0,17,28,x,y,width,height);
				}
				if(move > 10 && move <= 20){
					gameCtx.drawImage(sprite,105,0,17,28,x,y,width,height);
				}
				if(move > 20){
					gameCtx.drawImage(sprite,139,0,17,28,x,y,width,height);
				}
			}
			if(this.direction === UP){
				if(move <= 1){
					gameCtx.drawImage(sprite,0,0,17,28,x,y,width,height);
				}
				if(move > 0 && move <= 10){
					gameCtx.drawImage(sprite,17,0,17,28,x,y,width,height);
				}
				if(move > 10 && move <= 20){
					gameCtx.drawImage(sprite,0,0,17,28,x,y,width,height);
				}
				if(move > 20){
					gameCtx.drawImage(sprite,34,0,17,28,x,y,width,height);
				}
			}
			if(this.direction === RIGHT){
				if(move <= 0){
					gameCtx.drawImage(sprite,52,0,17,28,x,y,width,height);
				}
				if(move > 0 && move <= 10){
					gameCtx.drawImage(sprite,70,0,17,28,x,y,width,height);
				}
				if(move > 10 && move <= 20){
					gameCtx.drawImage(sprite,52,0,17,28,x,y,width,height);
				}
				if(move > 20){
					gameCtx.drawImage(sprite,88,0,17,28,x,y,width,height);
				}
			}
			if(this.direction === LEFT){
				if(move <= 0){
					gameCtx.drawImage(sprite,156,0,17,28,x,y,width,height);
				}
				if(move > 0 && move <= 10){
					gameCtx.drawImage(sprite,174,0,17,28,x,y,width,height);
				}
				if(move > 10 && move <= 20){
					gameCtx.drawImage(sprite,156,0,17,28,x,y,width,height);
				}
				if(move > 20){
					gameCtx.drawImage(sprite,192,0,17,28,x,y,width,height);
				}
			}
		};
	}

	var explosionSPRITE = new Image();
	explosionSPRITE.src = "img/explosion.png";
	function Explosion(x,y,src){
		this.x = x;
		this.y = y;
		this.cx = this.x;
		this.cy = this.y;
		this.ch = pixels;
		this.cw = pixels;
		this.timer = 0;
		var caseN = 0;
		var taken = [];

		this.draw = function(){
			var x = this.x;
			var y = this.y;
			var timer = this.timer;
			this.timer++;
			if(timer % 3 === 0){
				caseN++;
				taken = CollisionInArrayForExplosion(this,map,walls);
				CollisionInArrayForArray(bombs,bombs,taken);
				CollisionInArrayForDeath(player,bombs,taken);
				CollisionInArrayForWall(this,walls,taken);
			}
			//BASE
			switch(caseN){
				case 0: gameCtx.drawImage(explosionSPRITE,0,0,24,24,x,y,pixels,pixels); break;
				case 1: gameCtx.drawImage(explosionSPRITE,0,48,24,24,x,y,pixels,pixels); break;
				case 2: gameCtx.drawImage(explosionSPRITE,0,72,24,24,x,y,pixels,pixels); break;
				case 3: gameCtx.drawImage(explosionSPRITE,0,48,24,24,x,y,pixels,pixels); break;
				case 4: gameCtx.drawImage(explosionSPRITE,0,0,24,24,x,y,pixels,pixels); break;
				case 5: gameCtx.drawImage(explosionSPRITE,0,24,24,24,x,y,pixels,pixels); break;
				case 6: gameCtx.drawImage(explosionSPRITE,72,24,24,24,x,y,pixels,pixels); gameCtx.drawImage(explosionSPRITE,120,24,24,24,x,y,pixels,pixels); break;
				case 7: gameCtx.drawImage(explosionSPRITE,72,24,24,24,x,y,pixels,pixels); gameCtx.drawImage(explosionSPRITE,120,24,24,24,x,y,pixels,pixels); break;
			}
			//LEFT1
			if(taken.indexOf("LEFT1") === -1){
				switch(caseN){
					case 1: gameCtx.drawImage(explosionSPRITE,24,0,24,24,x + pixels,y,pixels,pixels); break;
					case 2: gameCtx.drawImage(explosionSPRITE,24,48,24,24,x + pixels,y,pixels,pixels); break;
					case 3: gameCtx.drawImage(explosionSPRITE,24,72,24,24,x + pixels,y,pixels,pixels); break;
					case 4: gameCtx.drawImage(explosionSPRITE,24,48,24,24,x + pixels,y,pixels,pixels); break;
					case 5: gameCtx.drawImage(explosionSPRITE,24,0,24,24,x + pixels,y,pixels,pixels); break;
					case 6: gameCtx.drawImage(explosionSPRITE,24,24,24,24,x + pixels,y,pixels,pixels); break;
					case 7: gameCtx.drawImage(explosionSPRITE,24,24,24,24,x + pixels,y,pixels,pixels); break;
				}
			}
			//LEFT2
			if(taken.indexOf("LEFT1") === -1 && taken.indexOf("LEFT2") === -1){
				switch(caseN){
					case 2: gameCtx.drawImage(explosionSPRITE,96,0,24,24,x + pixels + pixels,y,pixels,pixels); break;
					case 3: gameCtx.drawImage(explosionSPRITE,96,48,24,24,x + pixels + pixels,y,pixels,pixels); break;
					case 4: gameCtx.drawImage(explosionSPRITE,96,72,24,24,x + pixels + pixels,y,pixels,pixels); break;
					case 5: gameCtx.drawImage(explosionSPRITE,96,48,24,24,x + pixels + pixels,y,pixels,pixels); break;
					case 6: gameCtx.drawImage(explosionSPRITE,96,0,24,24,x + pixels + pixels,y,pixels,pixels); break;
					case 7: gameCtx.drawImage(explosionSPRITE,96,24,24,24,x + pixels + pixels,y,pixels,pixels); break;
				}
			}
			//RIGHT1
			if(taken.indexOf("RIGHT1") === -1){
				switch(caseN){
					case 1: gameCtx.drawImage(explosionSPRITE,24,0,24,24,x - pixels,y,pixels,pixels); break;
					case 2: gameCtx.drawImage(explosionSPRITE,24,48,24,24,x - pixels,y,pixels,pixels); break;
					case 3: gameCtx.drawImage(explosionSPRITE,24,72,24,24,x - pixels,y,pixels,pixels); break;
					case 4: gameCtx.drawImage(explosionSPRITE,24,48,24,24,x - pixels,y,pixels,pixels); break;
					case 5: gameCtx.drawImage(explosionSPRITE,24,0,24,24,x - pixels,y,pixels,pixels); break;
					case 6: gameCtx.drawImage(explosionSPRITE,24,24,24,24,x - pixels,y,pixels,pixels); break;
					case 7: gameCtx.drawImage(explosionSPRITE,24,24,24,24,x - pixels,y,pixels,pixels); break;
				}
			}
			//RIGHT2
			if(taken.indexOf("RIGHT1") === -1 && taken.indexOf("RIGHT2") === -1){
				switch(caseN){
					case 2: gameCtx.drawImage(explosionSPRITE,48,0,24,24,x - pixels - pixels,y,pixels,pixels); break;
					case 3: gameCtx.drawImage(explosionSPRITE,48,48,24,24,x - pixels - pixels,y,pixels,pixels); break;
					case 4: gameCtx.drawImage(explosionSPRITE,48,72,24,24,x - pixels - pixels,y,pixels,pixels); break;
					case 5: gameCtx.drawImage(explosionSPRITE,48,48,24,24,x - pixels - pixels,y,pixels,pixels); break;
					case 6: gameCtx.drawImage(explosionSPRITE,48,0,24,24,x - pixels - pixels,y,pixels,pixels); break;
					case 7: gameCtx.drawImage(explosionSPRITE,48,24,24,24,x - pixels - pixels,y,pixels,pixels); break;
				}
			}
			//UP1
			if(taken.indexOf("UP1") === -1){
				switch(caseN){
					case 1: gameCtx.drawImage(explosionSPRITE,120,0,24,24,x,y - pixels,pixels,pixels); break;
					case 2: gameCtx.drawImage(explosionSPRITE,120,48,24,24,x,y - pixels,pixels,pixels); break;
					case 3: gameCtx.drawImage(explosionSPRITE,120,72,24,24,x,y - pixels,pixels,pixels); break;
					case 4: gameCtx.drawImage(explosionSPRITE,120,48,24,24,x,y - pixels,pixels,pixels); break;
					case 5: gameCtx.drawImage(explosionSPRITE,120,0,24,24,x,y - pixels,pixels,pixels); break;
					case 6: gameCtx.drawImage(explosionSPRITE,120,24,24,24,x,y - pixels,pixels,pixels); break;
					case 7: gameCtx.drawImage(explosionSPRITE,120,24,24,24,x,y - pixels,pixels,pixels); break;
				}
			}
			//UP2
			if(taken.indexOf("UP1") === -1 && taken.indexOf('UP2') === -1){
				switch(caseN){
					case 2: gameCtx.drawImage(explosionSPRITE,144,0,24,24,x,y - pixels - pixels,pixels,pixels); break;
					case 3: gameCtx.drawImage(explosionSPRITE,144,48,24,24,x,y - pixels - pixels,pixels,pixels); break;
					case 4: gameCtx.drawImage(explosionSPRITE,144,72,24,24,x,y - pixels - pixels,pixels,pixels); break;
					case 5: gameCtx.drawImage(explosionSPRITE,144,48,24,24,x,y - pixels - pixels,pixels,pixels); break;
					case 6: gameCtx.drawImage(explosionSPRITE,144,0,24,24,x,y - pixels - pixels,pixels,pixels); break;
					case 7: gameCtx.drawImage(explosionSPRITE,144,24,24,24,x,y - pixels - pixels,pixels,pixels); break;
				}
			}
			//DOWN1
			if(taken.indexOf('DOWN1') === -1){
				switch(caseN){
					case 1: gameCtx.drawImage(explosionSPRITE,120,0,24,24,x,y + pixels,pixels,pixels); break;
					case 2: gameCtx.drawImage(explosionSPRITE,120,48,24,24,x,y + pixels,pixels,pixels); break;
					case 3: gameCtx.drawImage(explosionSPRITE,120,72,24,24,x,y + pixels,pixels,pixels); break;
					case 4: gameCtx.drawImage(explosionSPRITE,120,48,24,24,x,y + pixels,pixels,pixels); break;
					case 5: gameCtx.drawImage(explosionSPRITE,120,0,24,24,x,y + pixels,pixels,pixels); break;
					case 6: gameCtx.drawImage(explosionSPRITE,120,24,24,24,x,y + pixels,pixels,pixels); break;
					case 7: gameCtx.drawImage(explosionSPRITE,120,24,24,24,x,y + pixels,pixels,pixels); break;
				}
			}
			//DOWN2
			if(taken.indexOf("DOWN1") === -1 && taken.indexOf('DOWN2') === -1){
				switch(caseN){
					case 1: gameCtx.drawImage(explosionSPRITE,192,0,24,24,x,y + pixels + pixels,pixels,pixels); break;
					case 2: gameCtx.drawImage(explosionSPRITE,192,48,24,24,x,y + pixels + pixels,pixels,pixels); break;
					case 3: gameCtx.drawImage(explosionSPRITE,192,72,24,24,x,y + pixels + pixels,pixels,pixels); break;
					case 4: gameCtx.drawImage(explosionSPRITE,192,48,24,24,x,y + pixels + pixels,pixels,pixels); break;
					case 5: gameCtx.drawImage(explosionSPRITE,192,0,24,24,x,y + pixels + pixels,pixels,pixels); break;
					case 6: gameCtx.drawImage(explosionSPRITE,192,24,24,24,x,y + pixels + pixels,pixels,pixels); break;
					case 7: gameCtx.drawImage(explosionSPRITE,192,24,24,24,x,y + pixels + pixels,pixels,pixels); break;
				}
			}
		};
	}

	var bombIMG = new Image();
	bombIMG.src = 'img/bomb1.png';
	function Bomb(player,src){
		this.x = player.x;
		this.y = player.y + 10;
		this.width = pixels;
		this.height = pixels;
		this.cw = pixels / 2;
		this.ch = pixels / 2;
		this.cx = this.x + 20;
		this.cy = this.y + 20;
		this.timer = 60;
		this.valide = 5;
		this.steppedOn = true;
		this.next = true;
		var first = true;
		this.explode = false;

		this.draw = function(){
			var x = this.x;
			var y = this.y;
			var ay = this.y + 30;
			var ax = this.x + 30;
			if(this.timer > 0 && !this.explode){
				gameCtx.drawImage(bombIMG,x,y,pixels,pixels);
			}

			//VALIDATE
			var cw = this.cw;
			var ch = this.ch;
			if(this.next){
				if(AABBIntersect(x,y - 35,cw + 10,ch + 10,player.x,player.y,player.cw,player.ch)){
					this.steppedOn = true;
				} else {
					this.steppedOn = true;
					this.next = false;
				}
			} else {
				this.steppedOn = false;
			}

			this.valide--;
			if(this.valide > 0){
				this.y += 1;
				this.cy = this.y;
			} else {
				this.timer--;
			}
			if(this.timer < 0 || this.explode){
				if(first){
					explosion = new Explosion(Math.floor(ax / pixels) * pixels,Math.floor(ay / pixels) * pixels,'img/explosion.png');
					this.timer = -1;
				}
				explosion.draw();
				first = false;
			}
		};
	}

	function createBomb(player){
		if(lastbombcreated < 0){
			var bomb = new Bomb(player,'img/bomb1.png');
			bombs.push(bomb);
			lastbombcreated = 160;
		}
	}

	function createWalls(n,player,startingWalls){
		for(var i = 0; i < startingWalls.length; i++){
			var startwall = new Wall(startingWalls[i].x * pixels,startingWalls[i].y * pixels);
			walls.push(startwall);
		}

		for(i = 0; i < n; i++){
			for(var block in world){
				var x = Math.floor(Math.random() * rows);
				var y = Math.floor(Math.random() * cols);
				if(world.world[x + (y * cols)] === 2 && (x * pixels !== player.x || y * pixels !== player.y + 20) && (x * pixels !== player.x + pixels || y * pixels !== player.y + 20) && (x * pixels !== player.x - pixels || y * pixels !== player.y + 20) && (y * pixels !== player.y + pixels + 20 || x * pixels !== player.x) && (y * pixels !== player.y - pixels + 20 || x * pixels !== player.x)){
					var wall = new Wall(x*pixels,y*pixels);
					walls.push(wall);
				}
			}
		}

		if(player !== null && player.length > 1){
			for(var item in walls){
				for (var person in player){
					if((walls[item] !== undefined) && (walls[item].x == player[person].x && walls[item].y == player[person].y)
						|| (walls[item].x == player[person].x + pixels && walls[item].y == player[person].y)
						|| (walls[item].x == player[person].x - pixels && walls[item].y == player[person].y)
						|| (walls[item].x == player[person].x && walls[item].y == player[person].y + pixels)
						|| (walls[item].x == player[person].x && walls[item].y == player[person].y - pixels) 
						){
						walls.splice(walls.indexOf(walls[item]),1);
						// break;
					}
				}
			}
		}
	}

	function World(){
		this.world = [
			0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
			0,1,3,3,3,3,3,3,3,3,3,3,3,3,3,1,0,
			0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0,
			0,1,2,3,2,3,2,3,2,3,2,3,2,3,2,1,0,
			0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0,
			0,1,2,3,2,3,2,3,2,3,2,3,2,3,2,1,0,
			0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0,
			0,1,2,3,2,3,2,3,2,3,2,3,2,3,2,1,0,
			0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0,
			0,1,2,3,2,3,2,3,2,3,2,3,2,3,2,1,0,
			0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0,
			0,1,2,3,2,3,2,3,2,3,2,3,2,3,2,1,0,
			0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0,
			0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
			0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
		];

		this.draw = function(){
			var block;
			for(var y = 0; y < rows; y++ ){
				for(var x = 0; x < cols; x++){
					if(this.world[x + (y * cols)] === 0){
						backgroundCtx.fillStyle = "#888";
						backgroundCtx.fillRect(x*pixels,y*pixels,pixels,pixels);
					} else if(this.world[x + (y * cols)] === 1){
						block = new Block(x,y,'img/block.png',0);
						map.push(block);
					} else if(this.world[x + (y * cols)] === 2){
						backgroundCtx.fillStyle = "#117A31";
						backgroundCtx.fillRect(x*pixels,y*pixels,pixels,pixels);
					} else if(this.world[x + (y*cols)] === 3){
						block = new Block(x,y,'img/block-shadow.png',10);
						map.push(block);
					}
				}
			}
		};
	}

	//GAME OBJECTS
	var backgroundCanvas, gameCanvas, backgroundCtx, playerCtx, gameCtx, frames, map, bombs, lastbombcreated;

	function main(){
		backgroundCanvas = document.getElementById('background');
		backgroundCanvas.width = cols*pixels;
		backgroundCanvas.height = rows*pixels;
		backgroundCtx =  backgroundCanvas.getContext('2d');

		gameCanvas = document.getElementById('game');
		gameCanvas.width = cols*pixels;
		gameCanvas.height = rows*pixels;
		gameCtx =  gameCanvas.getContext('2d');

		//IMAGE SETTINGS
		gameCtx.mozImageSmoothingEnabled = false;
		gameCtx.webkitImageSmoothingEnabled = false;
		gameCtx.msImageSmoothingEnabled = false;
		gameCtx.imageSmoothingEnabled = false;

		keystate = {};
		document.addEventListener("keydown", function(evt) {
			keystate[evt.keyCode] = true;
		});
		document.addEventListener("keyup", function(evt) {
			keystate[evt.keyCode] = false;
			delete keystate[evt.keyCode];
		});

		init();
		loop();
	}

	function init(){
		if(initial){
			frames = 0;
			score = 0;
			map = [];
			bombs = [];
			walls = [];
			players = [];
			lastbombcreated = 0;
			world = new World();
			world.draw();
			player = new Player(initial.player.x * pixels,initial.player.y * pixels + 20,'img/block.png',DOWN,name);
			players.push(player);
			player.draw();
			// bomberMan.$$socket.emit('newPlayer',player);
			if(initial.createWorld){
				startingWalls = [
					{x: 2,y: 10},
					{x: 4,y: 12},
					{x: 2,y: 4},
					{x: 4,y: 2},
					{x: 12,y: 2},
					{x: 14, y: 4},
					{x: 14, y: 10},
					{x: 12, y: 12}
				];
				possiblePlayers = [
					{x: 2 * pixels, y: 2 * pixels},
					{x: 14 * pixels, y: 2 * pixels},
					{x: 14 * pixels, y: 12 * pixels},
					{x: 2 * pixels, y: 12 * pixels}
				];
				createWalls(50,possiblePlayers,startingWalls);
				console.log("INITIALIZED WALLS FOR OTHERS");
				// bomberMan.$$socket.emit('world',walls);
			}
		} else {
			//OLD INIT
			frames = 0;
			score = 0;
			map = [];
			bombs = [];
			walls = [];
			lastbombcreated = 0;
			world = new World();
			world.draw();
			player = new Player(2 * pixels,1 * pixels + 20,'img/block.png',DOWN);
			player.draw();
			startingWalls = [
				{x: 2,y: 10},
				{x: 4,y: 12},
				{x: 2,y: 4},
				{x: 4,y: 2},
				{x: 12,y: 2},
				{x: 14, y: 4},
				{x: 14, y: 10},
				{x: 12, y: 12}
			];
			createWalls(100,player,startingWalls);
		}
	}

	function ObjectLength(object) {
		return Object.keys(object).length;
	}

	function update(){
		frames++;
		lastbombcreated--;
		if(ObjectLength(keystate) < 2){
			if(keystate[KEY_LEFT]) player.move(LEFT); else player.moveFinish(LEFT); 
			if(keystate[KEY_RIGHT]) player.move(RIGHT); else player.moveFinish(RIGHT);
			if(keystate[KEY_UP]) player.move(UP); else player.moveFinish(UP);
			if(keystate[KEY_DOWN]) player.move(DOWN); else player.moveFinish(DOWN);
			if(keystate[SPACEBAR]) createBomb(player);
		} else {
			if(keystate[SPACEBAR]) createBomb(player); 
			else if(keystate[KEY_RIGHT]) player.move(RIGHT);
			else if(keystate[KEY_UP]) player.move(UP);
			else if(keystate[KEY_DOWN]) player.move(DOWN);
			else if(keystate[KEY_LEFT]) player.move(LEFT);
		}

		if(frames % 2 === 0){
			draw();
			// bomberMan.$$socket.emit('loop',{player: player, walls: walls, bombs: bombs});
		}
	}

	function draw(){
		gameCtx.clearRect(0,0,gameCanvas.width,gameCanvas.height);
		for(var wall in walls){
			walls[wall].draw();
		}
		for(var bomb in bombs){
			bombs[bomb].draw();
		}
		for(var a in bombs){
			if(bombs[a].timer < -13){
				delete bombs[a];
			}
		}
		// for(var person in players){
		// 	if(players[person] !== null && players[person].user !== player.user){
		// 		players[person].draw();
		// 	}
		// }
		player.draw();
	}


	function loop(){
		update();
		if(player.life > 0){
			window.requestAnimationFrame(loop);
		} else {
			console.log("DIED");
			setTimeout(function(){
				init();
				loop();
			},200);
		}
	}

	//SOCKET STUFF
	// bomberMan.$$socket.on('game',function(data){
	// 	for(var player in players){
	// 		if(data.user == players[player].user){
	// 			players[player].update(data.playerData);
	// 		}
	// 	}
	// });

	// bomberMan.$$socket.on('newWorld',function(data){
	// 	for(var wall in data){
	// 		data[wall].x /= pixels;
	// 		data[wall].y /= pixels;
	// 	}
	// 	createWalls(0,null,data);
	// });

	// bomberMan.$$socket.on('players',function(data){
	// 	var fixedPlayers = [];
	// 	for (var person in data){
	// 		if(data[person] !== null){
	// 			var player = new Player(data[person].x,data[person].y,data[person].src,data[person].direction,data[person].user);
	// 			fixedPlayers.push(player);
	// 		}
	// 	}
	// 	players = fixedPlayers;
	// });

	main();
}