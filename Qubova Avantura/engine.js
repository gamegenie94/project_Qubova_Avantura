const maxLevel = 3;

var lastFrameTime = 0, currentSpeed = 0, gameTime = 0;

var gameSpeeds = [
	{name:"Normal", mult:1},
	{name:"Paused", mult:0}
];

let currentGameSpeed = 1;

var directions = {
	up		: 0,
	right	: 1,
	down	: 2,
	left	: 3
};

//KONTROLE
var keysDown = {
	37 : false,
	38 : false,
	39 : false,
	40 : false
};

var player = new Character();

const modal = new Modal();

var count = 0;

//QUBO
function Character()
{
	//QUBOVA POZICIJA
	this.tileFrom	= [1,1];	
	this.tileTo		= [1,1];
	this.timeMoved	= 0;
	this.dimensions	= [30,30];
	this.position	= [45,45];
	this.delayMove	= 150; //QUBOVA BRZINA

	this.direction	= directions.up;
	this.sprites = {};
	this.sprites[directions.up]		= [{x:0,y:120,w:30,h:30}, {x:30,y:120,w:30,h:30}, 
	{x:60,y:120,w:30,h:30}, {x:30,y:120,w:30,h:30}];
	this.sprites[directions.right]	= [{x:0,y:150,w:30,h:30}, {x:30,y:120,w:30,h:30}, 
	{x:60,y:120,w:30,h:30}, {x:30,y:120,w:30,h:30}];
	this.sprites[directions.down]	= [{x:0,y:180,w:30,h:30}, 
	{x:30,y:120,w:30,h:30}, {x:60,y:120,w:30,h:30}, {x:30,y:120,w:30,h:30}];
	this.sprites[directions.left]	= [{x:0,y:210,w:30,h:30}, 
	{x:30,y:120,w:30,h:30}, {x:60,y:120,w:30,h:30}, {x:30,y:120,w:30,h:30}];
}

//SMJESTI QUBO-A
Character.prototype.placeAt = function(x, y)
{
	this.tileFrom	= [x,y];
	this.tileTo		= [x,y];
	this.position	= [((tileW*x)+((tileW-this.dimensions[0])/2)),
		((tileH*y)+((tileH-this.dimensions[1])/2))];
};

//ZADNJI LEVEL
let level = 0;
function finalLevel()
{
	level = 0;
	player.tileFrom	= [1,1];
	player.tileTo	= [1,1];	
	player.position	= [45,45];
	window.location.href="../zavrsni_leo/index.html";
}

//QUBO-OVO KRETANJE
Character.prototype.processMovement = function(t)
{
	if(this.tileFrom[0]===this.tileTo[0] && this.tileFrom[1]===this.tileTo[1]) { return false; }

	if((t-this.timeMoved)>=this.delayMove)
	{
		this.placeAt(this.tileTo[0], this.tileTo[1]);

		var tileFloor = tileTypes[gameMap[level][this.tileFrom[1]][this.tileFrom[0]]].floor;
		
		if(tileFloor===floorTypes.win)
		{
			//BROJAC KOJI IDE ZA 1 LEVEL VISE
			++level;
			
			//AKO JE ZADNJI LEVEL IGRA JE GOTOVA I VRACA SE NA INDEX.HTML
			if(level >= maxLevel) {
				alert("Bravo! \nDosao si do kraja igre!\nUkupan broj bodova: " + score);
				finalLevel();
			} 
			else //AKO NIJE ZADNJI LEVEL QUBA POSTAVLJAMO NA ZADANE KOORDINATE
			{
				this.tileFrom	= [1,1];
				this.tileTo		= [1,1];	
				this.position	= [45,45];
				count = 0;
			}
		}

		else if(tileFloor===floorTypes.question1) 
		{
			modal.getModal(1, 'predmet');
			currentSpeed = 1;
			count = count + 1;
			console.log(count);
			for(let i = 0; i < gameMap[level].length; ++i) {
				for(let j = 0; j < gameMap[level][0].length; ++j) {
					if(gameMap[level][i][j] === floorTypes.question1) {
						gameMap[level][i][j] = floorTypes.path1;
					}
				}
			}
		}
		
		else if(tileFloor===floorTypes.question2) 
		{
			modal.getModal(1, 'predmet');
			currentSpeed = 1;
			count = count + 1;
			console.log(count);
			for(let i = 0; i < gameMap[level].length; ++i) {
				for(let j = 0; j < gameMap[level][0].length; ++j) {
					if(gameMap[level][i][j] === floorTypes.question2) {
						gameMap[level][i][j] = floorTypes.path1;
					}
				}
			}
		}
		
		else if(tileFloor===floorTypes.question3) 
		{
			modal.getModal(1, 'predmet');
			currentSpeed = 1;
			count = count + 1;
			console.log(count);
			for(let i = 0; i < gameMap[level].length; ++i) {
				for(let j = 0; j < gameMap[level][0].length; ++j) {
					if(gameMap[level][i][j] === floorTypes.question3) {
						gameMap[level][i][j] = floorTypes.path1;
					}
				}
			}
		}
		
		else if(count === 3)
		{
			for(let i = 0; i < gameMap[level].length; ++i) {
				for(let j = 0; j < gameMap[level][0].length; ++j) {
					if(gameMap[level][i][j] === floorTypes.door4)
					{	
						var audio = new Audio('exitOpen.mp3');
						audio.play();
						gameMap[level][i][j] = floorTypes.path1;
					}
				}
			}
		}
		
		else if(tileFloor === floorTypes.gumb1 || tileFloor === floorTypes.gumb2 || tileFloor === floorTypes.gumb3) {
			openDoor(tileFloor, level);
		}
	}
	else
	{
		this.position[0] = (this.tileFrom[0] * tileW) + ((tileW-this.dimensions[0])/2);
		this.position[1] = (this.tileFrom[1] * tileH) + ((tileH-this.dimensions[1])/2);

		if(this.tileTo[0] !== this.tileFrom[0])
		{
			var diff = (tileW / this.delayMove) * (t-this.timeMoved);
			this.position[0]+= (this.tileTo[0]<this.tileFrom[0] ? 0 - diff : diff);
		}
		
		if(this.tileTo[1] !== this.tileFrom[1])
		{
			var diff = (tileH / this.delayMove) * (t-this.timeMoved);
			this.position[1]+= (this.tileTo[1]<this.tileFrom[1] ? 0 - diff : diff);
		}
		
		this.position[0] = Math.round(this.position[0]);
		this.position[1] = Math.round(this.position[1]);
	}
	return true;
}

Character.prototype.canMoveTo = function(x, y)
{
	if(x < 0 || x >= mapW || y < 0 || y >= mapH) { return false; }
	return !(tileTypes[gameMap[level][y][x]].floor !== floorTypes.path1 &&
		tileTypes[gameMap[level][y][x]].floor !== floorTypes.path2 &&
		tileTypes[gameMap[level][y][x]].floor !== floorTypes.gumb1 &&
		tileTypes[gameMap[level][y][x]].floor !== floorTypes.gumb2 &&
		tileTypes[gameMap[level][y][x]].floor !== floorTypes.gumb3 &&
		tileTypes[gameMap[level][y][x]].floor !== floorTypes.question1 &&
		tileTypes[gameMap[level][y][x]].floor !== floorTypes.question2 &&
		tileTypes[gameMap[level][y][x]].floor !== floorTypes.question3 &&
		tileTypes[gameMap[level][y][x]].floor !== floorTypes.win);

};

Character.prototype.canMoveUp		= function() { return this.canMoveTo(this.tileFrom[0], this.tileFrom[1]-1); };
Character.prototype.canMoveDown 	= function() { return this.canMoveTo(this.tileFrom[0], this.tileFrom[1]+1); };
Character.prototype.canMoveLeft 	= function() { return this.canMoveTo(this.tileFrom[0]-1, this.tileFrom[1]); };
Character.prototype.canMoveRight 	= function() { return this.canMoveTo(this.tileFrom[0]+1, this.tileFrom[1]); };
Character.prototype.canMoveDirection = function(d) {
	switch(d)
	{
		case directions.up:
			return this.canMoveUp();
		case directions.down:
			return this.canMoveDown();
		case directions.left:
			return this.canMoveLeft();
		default:
			return this.canMoveRight();
	}
};

Character.prototype.moveLeft	= function(t) { this.tileTo[0]-=1; this.timeMoved = t; this.direction = directions.left; };
Character.prototype.moveRight	= function(t) { this.tileTo[0]+=1; this.timeMoved = t; this.direction = directions.right; };
Character.prototype.moveUp		= function(t) { this.tileTo[1]-=1; this.timeMoved = t; this.direction = directions.up; };
Character.prototype.moveDown	= function(t) { this.tileTo[1]+=1; this.timeMoved = t; this.direction = directions.down; };
Character.prototype.moveDirection = function(d, t) {
	switch(d)
	{
		case directions.up:
			return this.moveUp(t);
		case directions.down:
			return this.moveDown(t);
		case directions.left:
			return this.moveLeft(t);
		default:
			return this.moveRight(t);
	}
};

//FUNKCIJA ZA IZLAZ NA INDEX1.HTML
function resetGame()
{
	window.location.href="../zavrsni_leo/index.html";
}

//POCETNI PRIKAZ
var viewport = {
	screen		: [0,0],
	startTile	: [0,0],
	endTile		: [0,0],
	offset		: [0,0],
	update		: function(px, py) {
		this.offset[0] = Math.floor((this.screen[0]/2) - px);
		this.offset[1] = Math.floor((this.screen[1]/2) - py);

		var tile = [ Math.floor(px/tileW), Math.floor(py/tileH) ];

		this.startTile[0] = tile[0] - 1 - Math.ceil((this.screen[0]/2) / tileW);
		this.startTile[1] = tile[1] - 1 - Math.ceil((this.screen[1]/2) / tileH);

		if(this.startTile[0] < 0) { this.startTile[0] = 0; }
		if(this.startTile[1] < 0) { this.startTile[1] = 0; }

		this.endTile[0] = tile[0] + 1 + Math.ceil((this.screen[0]/2) / tileW);
		this.endTile[1] = tile[1] + 1 + Math.ceil((this.screen[1]/2) / tileH);

		if(this.endTile[0] >= mapW) { this.endTile[0] = mapW-1; }
		if(this.endTile[1] >= mapH) { this.endTile[1] = mapH-1; }
	}
};

//FUNKCIJA KOJA UCITAVA PODATKE
window.onload = function()
{
	ctx = document.getElementById('game').getContext("2d");
	requestAnimationFrame(drawGame);
	ctx.font = "24pt bold monospace"; //STIL FONTA ZA PRIKAZ PODATAKA U IGRI
	
	window.addEventListener("keydown", function(e) {
		if(e.keyCode>=37 && e.keyCode<=40) { keysDown[e.keyCode] = true; }
		if(e.keyCode==32) //TIPKA SPACE
		{
			var r = confirm("Želiš li izaći na početnu stranicu?\nOK = Da\nCancel = Ne")
			if(r == true){
				resetGame();
			}
		}
	});
	
	window.addEventListener("keyup", function(e) {
		if(e.keyCode>=37 && e.keyCode<=40) { keysDown[e.keyCode] = false; }
	});

	viewport.screen = [document.getElementById('game').width,
		document.getElementById('game').height];

	tileset = new Image();
	tileset.onerror = function()
	{
		ctx = null;
		alert("Failed loading tileset."); //PORUKA AKO SE NIJE UČITAO TILESET
	};
	
	tileset.onload = function() { tilesetLoaded = true; };
	tileset.src = tilesetURL;

	for(x in tileTypes)
	{
		tileTypes[x]['animated'] = tileTypes[x].sprite.length > 1 ? true : false;

		if(tileTypes[x].animated)
		{
			var t = 0;
			
			for(let s in tileTypes[x].sprite)
			{
				tileTypes[x].sprite[s]['start'] = t;
				t+= tileTypes[x].sprite[s].d;
				tileTypes[x].sprite[s]['end'] = t;
			}

			tileTypes[x]['spriteDuration'] = t;
		}
	}
};

//PRIKAZ IGRE NA EKRANU
let lastSwapImageTimeStamp = Date.now()
let currentCharacterImage = 0;

//OSTALE ANIMACIJE
function getFrame(sprite, duration, time, animated)
{
	if(!animated) { return sprite[0]; }
	time = time % duration;

	for(x in sprite)
	{
		if(sprite[x].end>=time) { return sprite[x]; }
	}
}

//CRTANJE ELEMENATA IGRE
function drawGame()
{	
	const timeStamp = Date.now()

	if(ctx==null) { return; }
	if(!tilesetLoaded) { requestAnimationFrame(drawGame); return; }

	var currentFrameTime = Date.now();
	var timeElapsed = currentFrameTime - lastFrameTime;

	gameTime+= Math.floor(timeElapsed * gameSpeeds[currentSpeed].mult);
	
	if(!player.processMovement(gameTime) && gameSpeeds[currentSpeed].mult!==0)
	{
		if(keysDown[38] && player.canMoveUp())			{ player.moveUp(gameTime); }
		else if(keysDown[40] && player.canMoveDown())	{ player.moveDown(gameTime); }
		else if(keysDown[37] && player.canMoveLeft())	{ player.moveLeft(gameTime); }
		else if(keysDown[39] && player.canMoveRight())	{ player.moveRight(gameTime); }
	}

	viewport.update(player.position[0] + (player.dimensions[0]/2),
		player.position[1] + (player.dimensions[1]/2));

	ctx.fillStyle = "#ff6600";
	ctx.fillRect(0, 0, viewport.screen[0], viewport.screen[1]);

	for(var y = viewport.startTile[1]; y <= viewport.endTile[1]; ++y) {
		for(var x = viewport.startTile[0]; x <= viewport.endTile[0]; ++x) {

			var tile = tileTypes[gameMap[level][y][x]];
			var sprite = getFrame(tile.sprite, tile.spriteDuration,
				gameTime, tile.animated);
			ctx.drawImage(tileset,
				sprite.x, sprite.y, sprite.w, sprite.h,
				viewport.offset[0] + (x*tileW), viewport.offset[1] + (y*tileH),
				tileW, tileH);
		}
	}

	//QUBOVA ANIMACIJA
	var sprite = player.sprites[player.direction];
	ctx.drawImage(tileset,
		sprite[currentCharacterImage].x, sprite[currentCharacterImage].y, 
		sprite[currentCharacterImage].w, sprite[currentCharacterImage].h,
		viewport.offset[0] + player.position[0], viewport.offset[1] + player.position[1],
		player.dimensions[0], player.dimensions[1]);

	let canSwapImage = false;
	const deltaT = timeStamp - lastSwapImageTimeStamp;
	
	if (currentCharacterImage == 0 && deltaT >= 2000) {
		canSwapImage = true
	} else if (currentCharacterImage > 0 && deltaT >= 120) {
		canSwapImage = true;
	}
	
	if(canSwapImage){
		currentCharacterImage = (currentCharacterImage+1)%4;
		lastSwapImageTimeStamp = Date.now()
	}
	
	//BOJA FONTA
	ctx.fillStyle = "black";
	//PRIKAZ PODATAKA NA EKRANU (LEVEL)
	ctx.fillText("RAZINA: " + (level+1), 5, 30);
	ctx.fillText("BODOVI: " + score, 5, 60);
	lastFrameTime = currentFrameTime;
	requestAnimationFrame(drawGame);
}

function openDoor(buttonId, level) {

	let openDoor;

	switch(buttonId) {
		case floorTypes.gumb1:
			openDoor = floorTypes.door1;
			var audio = new Audio('door.mp3');
			audio.play();
			break;
		case floorTypes.gumb2:
			openDoor = floorTypes.door2;
			var audio = new Audio('door.mp3');
			audio.play();
			break;
		case floorTypes.gumb3:
			openDoor = floorTypes.door3;
			var audio = new Audio('door.mp3');
			audio.play();
			break;
		default:
			console.log('error');
			break;
	}

	for(let i = 0; i < gameMap[level].length; ++i) {
		for(let j = 0; j < gameMap[level][0].length; ++j) {
			if(gameMap[level][i][j] === openDoor)
			{
				gameMap[level][i][j] = floorTypes.path1;
			}
		}
	}
}