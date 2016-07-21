/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	(function webpackMissingModule() { throw new Error("Cannot find module \"start\""); }());


/***/ },
/* 1 */
/***/ function(module, exports) {

	// Global variables
	var canvas, engine, scene, camera, score = 0;
	var TOAD_MODEL;

	// An array to store each ending of the lane
	var ENDINGS = [];

	/**
	* Load the scene when the canvas is fully loaded
	*/
	document.addEventListener("DOMContentLoaded", function () {
	    if (BABYLON.Engine.isSupported()) {
	        initScene();
	        initGame();
	    }
	}, false);

	/**
	 * Creates a new BABYLON Engine and initialize the scene
	 */
	function initScene() {
	    // Get canvas
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
	}

	/**
	 * Initialize the game
	 */
	function initGame() {

	    // Number of lanes
	    var LANE_NUMBER = 3;
	    // Space between lanes
	    var LANE_INTERVAL = 5;
	    var LANES_POSITIONS = [];

	    // Function to create lanes
	    var createLane = function (id, position) {
	        var lane = BABYLON.Mesh.CreateBox("lane"+id, 1, scene);
	        lane.scaling.y = 0.1;
	        lane.scaling.x = 3;
	        lane.scaling.z = 800;
	        lane.position.x = position;
	        lane.position.z = lane.scaling.z/2-200;
	    };

	    var createEnding = function (id, position) {
	        var ending = BABYLON.Mesh.CreateGround(id, 3, 4, 1, scene);
	        ending.position.x = position;
	        ending.position.y = 0.1;
	        ending.position.z = 1;
	        var mat = new BABYLON.StandardMaterial("endingMat", scene);
	        mat.diffuseColor = new BABYLON.Color3(0.8,0.2,0.2);
	        ending.material = mat;
	        return ending;
	    };

	    var currentLanePosition = LANE_INTERVAL * -1 * (LANE_NUMBER/2);
	    for (var i = 0; i<LANE_NUMBER; i++){
	        LANES_POSITIONS[i] = currentLanePosition;
	        createLane(i, currentLanePosition);
	        var e = createEnding(i, currentLanePosition);
	        ENDINGS.push(e);
	        currentLanePosition += LANE_INTERVAL;
	    }

	    // Adjust camera position
	    camera.position.x = LANES_POSITIONS[Math.floor(LANE_NUMBER/2)];

	    // The function ImportMesh will import our custom model in the scene given in parameter
	    BABYLON.SceneLoader.ImportMesh("red_toad", "/assets/", "toad.babylon", scene, function (meshes) {
	        var m = meshes[0];
	        m.isVisible = false;
	        m.scaling = new BABYLON.Vector3(0.5,0.5,0.5);
	        TOAD_MODEL = m;
	    });

	    var ENEMIES  = [];
	    // Creates a shroom in a random lane
	    var createEnemy = function () {
	        // The starting position of toads
	        var posZ = 100;

	        // Get a random lane
	        var posX = LANES_POSITIONS[Math.floor(Math.random() * LANE_NUMBER)];

	        // Create a clone of our template
	        var shroom = TOAD_MODEL.clone(TOAD_MODEL.name);

	        shroom.id = TOAD_MODEL.name+(ENEMIES.length+1);
	        // Our toad has not been killed yet !
	        shroom.killed = false;
	        // Set the shroom visible
	        shroom.isVisible = true;
	        // Update its position
	        shroom.position = new BABYLON.Vector3(posX, shroom.position.y/2, posZ);
	        ENEMIES.push(shroom);
	    };

	    // Creates a clone every 1 seconds
	    setInterval(createEnemy, 1000);

	    engine.runRenderLoop(function () {
	        scene.render();
	        ENEMIES.forEach(function (shroom) {
	        if (shroom.killed) {
	                // Nothing to do here
	            } else {
	                shroom.position.z -= 0.5;
	            }
	        });
	    });
	}

/***/ }
/******/ ]);