// Global variables
var canvas, engine, scene, camera, score = 0,user,food,state,foodScreen,snakeScreen;

/**
* Load the scene when the canvas is fully loaded
*/
document.addEventListener("DOMContentLoaded", function () {
    if (BABYLON.Engine.isSupported()) {
        initGame();
    }
}, false);

/**
 * Initialize the game
 */
function initGame() {

    canvas = document.getElementById("renderCanvas");

    // Create babylon engine
    engine = new BABYLON.Engine(canvas, true);

    // Create scene
    scene = new BABYLON.Scene(engine);

    // Create the camera
    camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0,4,-10), scene);
    camera.setTarget(new BABYLON.Vector3(0,0,10));
    camera.attachControl(canvas);

    // Create light
    var light = new BABYLON.PointLight("light", new BABYLON.Vector3(0,5,-5), scene);

    // Function to create snake
    var createSnake = function (id, position) {
        var position = [user.getPosition()];
        var total=[];
        var p = user.trail() || [];
        var trail = position.concat(p);
        for( var i in trail){
            var lane = BABYLON.Mesh.CreateBox("lane"+id, 1, scene);
            //lane.material = texture;
            lane.scaling.y = 2;
            lane.scaling.x = 2;
            lane.scaling.z = 2;
            lane.position.x = trail[i][0] * 2;
            lane.position.z = trail[i][1] * 2;
            total.push(lane);
        }
        return total;
    };
    // Function to create food
    var createFood = function () {
        var position = food.position();
        var food1 = BABYLON.Mesh.CreateBox("foodb", 1, scene);
        food1.scaling.y = 2;
        food1.scaling.x = 2;
        food1.scaling.z = 2;
        food1.position.x = position[0] * 2;
        food1.position.z = position[1] * 2;
        var mat = new BABYLON.StandardMaterial("food", scene);
        mat.diffuseColor = new BABYLON.Color3(0.8,0.2,0.2);
        food1.material = mat;
        return food1;
    };
    engine.runRenderLoop(function () {
        scene.render();
         
    });

    (function (glob, consts) {
    for (var x, i = 0; i < consts.length; i += 1) {
        glob[consts[i].name] = {};
        for (x = 0; x < consts[i].consts.length; x += 1) {
            glob[consts[i].name][consts[i].consts[x]] = x;
        }
    }
    })(Snake, Snake.Consts);
	
	var direction = null,
		state = Snake.State.WAITING,
		user = null,
		screen = null,
		ctx,
		timer = null;

    function keyDown(e) {
        //e.preventDefault();
		switch(e.keyCode)
		{
			case KEY.ARROW_UP:
				if(direction != Snake.Dir.DOWN){ 
					direction = Snake.Dir.UP;
				}
			  break;
			case KEY.ARROW_DOWN:
				if(direction != Snake.Dir.UP){
					direction = Snake.Dir.DOWN;
				}
			  break;
			case KEY.ARROW_LEFT:
				if(direction != Snake.Dir.RIGHT){
					direction = Snake.Dir.LEFT;
				}
			  break;
			case KEY.ARROW_RIGHT:
				if(direction != Snake.Dir.LEFT){
					direction = Snake.Dir.RIGHT;
				}
			  break;
			case KEY.ENTER:
				if (state === Snake.State.WAITING)
				{
					newGame();
				}
			 break;
			case KEY.P:
				if(state === Snake.State.PLAYING){
					pauseGame();
				}
			  break;
			case KEY.R:
				if(state === Snake.State.WAITING){
					resumeGame();
				}
			  break;
			default:
			  break;
		 }
    }
    document.addEventListener("keydown", keyDown, true);

    function newGame() {
        if (state != Snake.State.PLAYING) {
            user = new Snake.User();
		    food = new Snake.Food();
            user.reset();
			food.create(user.trail());
            state = Snake.State.PLAYING;
			direction = Snake.Dir.RIGHT;
			timer = window.setInterval(mainLoop, 1000/Snake.FPS);
            //createSnake();
            //createFood();
        }
    }
	
	function pauseGame(){
		clearTimeout(timer);
		state = Snake.State.WAITING;
	}
	
	function resumeGame(){
		timer = window.setInterval(mainLoop, 1000/Snake.FPS);
		state = Snake.State.PLAYING;
	}
	
	function mainLoop() {

        if (state === Snake.State.PLAYING) {

            if(snakeScreen){
                for(var i  in snakeScreen){
                    snakeScreen[i].dispose();
                }
                foodScreen.dispose();
            }

            pos = user.move(direction);
            //screen.draw(ctx);
			
			var eaten = eat(pos,food.position());
			if(eaten === true){
				user.addScore();
				food.create(user.trail());
			}

            var tmp = collided(pos, user.trail());
            if (tmp !== false) {
                if (tmp !== true) {
                    pos = tmp;
                }
                state = Snake.State.DYING;
                user.finished();
            }
			else if(eaten === false){
				user.deletelasttrail();
			}

            snakeScreen = createSnake();
            foodScreen = createFood();
        }
    }
    function collided(pos, trail) {
		for (var i = 0; i < trail.length; i++) {
			var trail_pos = trail[i];
			if( pos[0] == trail_pos[0] && pos[1] == trail_pos[1]){
				return true;
			}
		}
		for (var i = 0; i < Snake.GRID.length; i++) {
			var grid_pos = Snake.GRID[i];
			if( pos[0] == grid_pos[0] && pos[1] == grid_pos[1]){
				return false;
			}
		}
		return true;
    }

	function eat(pos,food_pos){
		if(pos[0] === food_pos[0] && pos[1] == food_pos[1]){
			return true;
		}
		else{
			return false;
		}
	}
    newGame();
}

var KEY = {
    'BACKSPACE': 8, 'TAB': 9, 'NUM_PAD_CLEAR': 12, 'ENTER': 13, 'SHIFT': 16,
    'CTRL': 17, 'ALT': 18, 'PAUSE': 19, 'CAPS_LOCK': 20, 'ESCAPE': 27,
    'SPACEBAR': 32, 'PAGE_UP': 33, 'PAGE_DOWN': 34, 'END': 35, 'HOME': 36,
    'ARROW_LEFT': 37, 'ARROW_UP': 38, 'ARROW_RIGHT': 39, 'ARROW_DOWN': 40,
    'PRINT_SCREEN': 44, 'INSERT': 45, 'DELETE': 46, 'SEMICOLON': 59,
    'WINDOWS_LEFT': 91, 'WINDOWS_RIGHT': 92, 'SELECT': 93,
    'NUM_PAD_ASTERISK': 106, 'NUM_PAD_PLUS_SIGN': 107,
    'NUM_PAD_HYPHEN-MINUS': 109, 'NUM_PAD_FULL_STOP': 110,
    'NUM_PAD_SOLIDUS': 111, 'NUM_LOCK': 144, 'SCROLL_LOCK': 145,
    'EQUALS_SIGN': 187, 'COMMA': 188, 'HYPHEN-MINUS': 189,
    'FULL_STOP': 190, 'SOLIDUS': 191, 'GRAVE_ACCENT': 192,
    'LEFT_SQUARE_BRACKET': 219, 'REVERSE_SOLIDUS': 220,
    'RIGHT_SQUARE_BRACKET': 221, 'APOSTROPHE': 222
};
(function () {
	/* 0 - 9 */
	for (var i = 48; i <= 57; i++) {
        KEY['' + (i - 48)] = i;
	}
	/* A - Z */
	for (i = 65; i <= 90; i++) {
        KEY['' + String.fromCharCode(i)] = i;
	}
	/* NUM_PAD_0 - NUM_PAD_9 */
	for (i = 96; i <= 105; i++) {
        KEY['NUM_PAD_' + (i - 96)] = i;
	}
	/* F1 - F12 */
	for (i = 112; i <= 123; i++) {
        KEY['F' + (i - 112 + 1)] = i;
	}
})();
var Snake = {};
Snake.FPS = 10;
var gridWidth = 20;
var gridHeight = 20;
Snake.GRID = new Array();
var i=0, j=0;
while( j <= gridHeight ){
	i=0;
	while( i <= gridWidth ){
		grid = [i,j];
		i++;
		Snake.GRID.push(grid);
	}
	j++;
}
Snake.Consts = [
  {name: "State", consts: ["WAITING", "PAUSED", "PLAYING", "DYING"]},
  {name: "Dir",   consts: ["UP", "DOWN","LEFT","RIGHT"]}
];
Snake.User = function (params) {

    var _score = 0,
        position = [0,0],
		_currentDirection = null;
		_trail = null;

    function finished() {
        if (_score > bestScore()) {
            localStorage.bestScore = _score;
        }
    }

    function bestScore() {
      return parseInt(localStorage.bestScore || 0, 10);
    }
	function currentDirection() {
        return _currentDirection;
    }

    function score() {
        return _score;
    }

    function reset() {
        _score = 0;
        _trail = [[2,12],[3,12],[4,12]];
		position = [5,12];
		_direction = Snake.State.RIGHT;
    }

    function move(direction) {
		var oldposition = new Array();
		oldposition[0] = position[0];
		oldposition[1] = position[1];
		_trail.push(oldposition);
		var newposition = new Array();
		newposition[0] = position[0];
		newposition[1] = position[1];
		switch(direction)
		{
			case Snake.Dir.UP:
				newposition[1] = (( newposition[1] + gridHeight+1 )-1)%(gridHeight+1);
			  break;
			case Snake.Dir.DOWN:
			    newposition[1] = (( newposition[1] + gridHeight+1 )+1)%(gridHeight+1);
			  break;
			case Snake.Dir.LEFT:
			    newposition[0] = (( newposition[0] + gridWidth+1 )-1)%(gridWidth+1);
			  break;
			case Snake.Dir.RIGHT:
			    newposition[0] = (( newposition[0] + gridWidth+1 )+1)%(gridWidth+1);
			  break;
		}
		position[0] = newposition[0];
		position[1] = newposition[1];
        return newposition;
    }

    function trail() {
        return _trail;
    }
	function deletelasttrail(){
		_trail.shift();
	}
	
	function addScore(){
		_score++;
	}
    function getPosition(){
        return position;
    }
    return {
        "reset":reset,
        "move":move,
        "finished":finished,
        "bestDistance":bestScore,
		"trail":trail,
		"deletelasttrail":deletelasttrail,
		"score":score,
		"addScore":addScore,
        "getPosition":getPosition
    };
};
Snake.Food = function(){
	var _position;
	
	function position(){
		return _position;
	}
	
	function create(trail){
		var available = new Array();
		for (var i = 0; i < Snake.GRID.length; i++) {
			var grid_pos = Snake.GRID[i];
			var add = true;
			for (var j = 0; j < trail.length; j++) {
				var trail_pos = trail[j];
				if(grid_pos[0] == trail_pos[0] && grid_pos[1] == trail_pos[1]){
					add = false;
				}
			}
			if(add === true){
				available.push(grid_pos);
			}
		}
		var random = Math.floor(Math.random()*available.length);
		_position = available[random];
		
	}
	
	return{
		"position":position,
		"create":create
	};
}