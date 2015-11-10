var Map = function() {
    this.tileWidth = 50;
    this.tileHeight = 41; // 83/101 to be more precise
    // These indicate the dimentions of the map for certain methods:
    this.numColumns = 11;
    this.numRows = 15;
    this.totalWidth = this.tileWidth * this.numColumns;
    this.totalHeight = this.tileHeight * (this.numRows + 1);

    // All the map tiles arranged to be more accessible by methods:
    this.mapTiles = [
        'images/white-block.png',
        'images/water-block.png',
        'images/stone-block.png',
        'images/grass-block.png',
        'images/water-block2.png',
    ];

    // These are the images that engine.js will use to draw the map:
    this.rowImages = [
        this.mapTiles[0],
        this.mapTiles[0],
        this.mapTiles[3],
        this.mapTiles[4],
        this.mapTiles[4],
        this.mapTiles[4],
        this.mapTiles[3],
        this.mapTiles[2],
        this.mapTiles[2],
        this.mapTiles[2],
        this.mapTiles[3],
        this.mapTiles[2],
        this.mapTiles[2],
        this.mapTiles[2],
        this.mapTiles[3],
    ];

    // Offset value due to white space at the top of water tiles
    this.buffer = 24.75;

    // xValues and yValues get generated at the bottom of app.js using
    // Map.makeCoordinates. This will be used to determine positions
    // throughout app.js:
    this.xValues = {};
    this.yValues = {};
    // This determines what row the enemy bugs can use:
    this.enemyRows = [6, 7, 8, 10, 11, 12];

    // Below are a series of arrays that hold all the images that will be used in
    // the .render() methods of all objects:
    this.clouds = [
        'images/cloud1.png',
        'images/cloud2.png',
        'images/cloud3.png',
        'images/cloud4.png',
        'images/cloud5.png',
        'images/cloud6.png',
        'images/cloud7.png'
    ];
    this.variousImages = [
        'images/Selector.png',
        'images/Star.png',
        'images/Rock.png',
        'images/Key.png',
        'images/Heart.png',
        'images/corn.png',
        'images/Blue.png',
        'images/Green.png',
        'images/Orange.png',
        'images/Purple.png',
        'images/Yellow.png',
        'images/Black.png',
        'images/White.png',
        'images/Red.png',
        'images/Arrows.png'
    ];
    this.enemySprites = [
        'images/enemy-bug-right.png',
        'images/enemy-bug-left.png',
        'images/enemy-bug-up.png',
        'images/enemy-bug-down.png',
        'images/enemy-bug-burrow-1.png',
        'images/enemy-bug-burrow-2.png'
    ];
    this.playerChars = [
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png'
    ];
    // These sprites are used when the player loses a life:
    this.playerCharsHurt = [
        'images/char-boy-hurt.png',
        'images/char-cat-girl-hurt.png',
        'images/char-horn-girl-hurt.png',
        'images/char-pink-girl-hurt.png',
        'images/char-princess-girl-hurt.png'
    ];
    // These sprites are used when the player has collected all three keys:
    this.playerCharsHappy = [
        'images/char-boy-happy.png',
        'images/char-cat-girl-happy.png',
        'images/char-horn-girl-happy.png',
        'images/char-pink-girl-happy.png',
        'images/char-princess-girl-happy.png'
    ];
    // When the player picks up a green gem:
    this.playerCharsShield = [
        'images/char-boy-shield.png',
        'images/char-cat-girl-shield.png',
        'images/char-horn-girl-shield.png',
        'images/char-pink-girl-shield.png',
        'images/char-princess-girl-shield.png'
    ];
    // When character picks up yellow gem:
    this.playerCharsLasso = [
        'images/char-boy-lasso.png',
        'images/char-cat-girl-lasso.png',
        'images/char-horn-girl-lasso.png',
        'images/char-pink-girl-lasso.png',
        'images/char-princess-girl-lasso.png'
    ];
    // Purple gem:
    this.playerCharsWater = [
        'images/char-boy-water.png',
        'images/char-cat-girl-water.png',
        'images/char-horn-girl-water.png',
        'images/char-pink-girl-water.png',
        'images/char-princess-girl-water.png',
    ];

    // The initial speed of floating corn top, middle and bottom rows:
    this.slowCorn = 70;
    this.medCorn = -100;
    this.fastCorn = 120;

    // This is to current number of powerups on the map:
    this.powerUpCount = 0;
    // This is the maximum number of powerups on the map:
    this.powerUpMax = 3;
    // Wait time between release of powerups:
    this.powerUpDelay = 4;
    // Number of powerups per round:
    this.powerUpsLeft = 5;
    // Current round (game scales in difficulty with higher rounds):
    this.round = 1;
    // Storage of game sounds:
    this.audio = {
        // See credit.txt in audio/ for credits!
        // Sound on/off
        'muted': false,
        // Load audio files
        chime: new Audio('audio/chime.mp3'),
        chaching: new Audio('audio/chaching.mp3'),
        flip: new Audio('audio/flip.mp3'),
        gong: new Audio('audio/gong.mp3'),
        key: new Audio('audio/key.mp3'),
        powerdown: new Audio('audio/powerdown.mp3'),
        run: new Audio('audio/run.mp3'),
        shield: new Audio('audio/shield.mp3'),
        splash: new Audio('audio/splash.mp3'),
        thud: new Audio('audio/thud.mp3'),
        time: new Audio('audio/time.mp3'),
        trumpet: new Audio('audio/trumpet.mp3'),
        yeehaw: new Audio('audio/yeehaw.mp3')
    };
    // Holds the last twenty sounds played so that they can all be muted once 
    // the player presses the 'm' button:
    this.lastTwentySounds = [];
};

// Play game sound effects
// Credit to d3moid
// https://github.com/d3moid
Map.prototype.playSFX = function(SFX) {
    // Player can mute sounds by pressing 'm':
    if (!this.audio.muted) {
        // Stores the current sound being played so that it can be muted by the 
        // 'm' button even if it has already begun:
        this.audio[SFX].play();
        if (map.lastTwentySounds.length < 20) {
            map.lastTwentySounds.push(this.audio[SFX]);
        }
    }
};

// Handles the power ups:
Map.prototype.update = function(dt) {
    // Power ups won't spawn if too many have already or too many are currently
    // on the map:
    if (this.powerUpCount < this.powerUpMax && this.powerUpsLeft > 0) {
        // Timer will count down as long as the game is being played:
        if (this.powerUpDelay > 0 && !player.paused && player.charSelected) {
            this.powerUpDelay -= dt;
            // Once timer reaches 0 a power up is released:
        } else if (this.powerUpDelay <= 0 && !player.paused) {
            // Reset timer:
            this.powerUpDelay = 5;
            this.powerUpsLeft--;
            this.powerUpCount++;
            // Add power up to array to track collisions with player:
            allPowerUps.push(new PowerUp());
        }
    }
};

// Creates an object that maps x and y Coordinate numbers to corresponding
// x and y values on the canvas to create a mapped grid:
Map.prototype.makeCoordinates = function() {
    for (var i = 0; i < this.numColumns; i++) {
        this.xValues[i] = this.tileWidth * i;
    }
    for (i = 0; i < this.numRows; i++) {
        this.yValues[i] = this.buffer + this.tileHeight * i;
    }
};

// Used in handleInput to determine whether a tile is available.
Map.prototype.canGo = function(newX, newY) {
    // Player can't walk into rocks or too far up/down:
    if ((newY === 9 && newX !== 1 && newX !== 5 && newX !== 9) ||
        (newY === 5 && newX !== 3 && newX !== 7) ||
        newY === 0 || newY === map.numRows - 1) {
        return false;
    }
    return true;
};

// This is invoked at the start of every round. Keys always appear in the top
// row and the number 1, 5, and 9 indicate the column positions of the keys:
Map.prototype.makeKeys = function() {
    allKeys.length = 0;
    allKeys.push(new Key(1));
    allKeys.push(new Key(5));
    allKeys.push(new Key(9));
};

// This gets inherited by Item, Corn, Enemy and Cloud:
var Entity = function() {
    this.x = 0;
    this.y = 0;
    this.moving = 1;
    this.sprite = '';
};

// As long as the player's character is selected, the all entities will be
// rendered at their current positions:
Entity.prototype.render = function() {
    if (player.charSelected === true) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

// this.moving is multiplied by the speed of each all entities in their
// respective .update methods. If this.moving is 0, an entity won't move:
Entity.prototype.togglePause = function() {
    if (this.moving === 0) {
        this.moving = 1;
    } else {
        this.moving = 0;
    }
};

// Sometimes the game has to be paused, in those circumstances this method is
// invoked to make sure all entities stop moving. A notable example is when the
// game window is navigated away from (the 'blur' event occurs, hence the name
// of the method:
Entity.prototype.blurPause = function() {
    this.moving = 0;
};

// Clouds appear in later rounds to obscure the player's field of vision and
// make the game more challenging:
var Cloud = function() {
    // All Cloud sprites are 400 pixels wide so they have to start at least
    // that many pixels off screen left. The randomization is done to stagger
    // their initial positions. See Cloud.prototype.update() for more info:
    this.x = -400 - Math.random() * 110;
    this.y = Math.random() * map.totalHeight;
    this.sprite = map.clouds[Math.floor(Math.random() * 7)];
    this.moving = 1;
    this.speed = 20 + Math.random() * 80;
    // While true, Clouds will respawn offscreen left after reaching a certain
    // spot offscreen right:
    this.respawn = true;
};

inherit(Cloud, Entity);

// When the player is hit/drowned/killed/has, won everything is paused except
// for the clouds, which keepMoving(). This allows the clouds to get out of
// the way so that the text on the screen can be read without being obscured.
// They also stop respawning on the left side of the map:
Cloud.prototype.keepMoving = function() {
    var length = allClouds.length;
    for (var i = 0; i < length; i++) {
        allClouds[i].moving = 2;
        allClouds[i].respawn = false;
    }
};

// When all the other objects are unpaused, clouds return to moving at their
// normal speed, and also start to respawn again:
Cloud.prototype.moveNormally = function() {
    var length = allClouds.length;
    for (var i = 0; i < length; i++) {
        allClouds[i].moving = 1;
        allClouds[i].respawn = true;
    }
};

Cloud.prototype.update = function(dt) {
    // this.moving determines if the clouds are moving or not and also is used
    // to determine if they are moving faster than usual (if keepMoving() is
    // invoked). dt is the delta time between the last frame and the current
    // one, which keeps the movements synched across computers:
    this.x += this.speed * dt * this.moving;
    // Once the clouds are too far off screen right and they are aren't
    // currently in the keepMoving state, they will respawn offscreen left:
    if (this.x > map.totalWidth + 100 && this.respawn) {
        // There is some variation in the x-start position so that the initial
        // clouds don't all come at the same time:
        this.x = -410 + Math.random() * 120;
        // Clouds can be anywhere on the y-axis except on the menu:
        this.y = map.tileWidth + Math.random() * map.totalHeight;
        // Each time a cloud respawns it changes its sprite and speed:
        this.sprite = map.clouds[Math.floor(Math.random() * 7)];
        this.speed = 20 + Math.random() * 80;
    }
};

// Corn are the corn that the player can walk on at the top part of the map.
// If the player steps on water where there is no Corn, the player.drown()s:
var Corn = function(row, pos, speed) {
    // Corn sprite:
    this.sprite = map.variousImages[5];
    // This is the initial position of the Corn as initialized by addCorn():
    this.x = pos;
    // y values have to be more precise as these are constant throughout the
    // game and need to line up with the player's y positions:
    this.y = this.cornRow(row);
    // As initialized by addCorn() at the bottom of app.js:
    this.speed = speed;
    // Pause control:
    this.moving = 1;
    // Affected by the enemy
    this.gemSpeed = 1.0;
};

inherit(Corn, Entity);

Corn.prototype.update = function(dt) {
    // this.moving is changed to 0 when the game is paused.
    this.x = this.x + this.speed * dt * this.moving * this.gemSpeed;
    // Reset Corn when they go offscreen:
    if (this.x > map.totalWidth + (2.5 * map.tileWidth)) {
        this.x = -2.0 * map.tileWidth;
    }
    if (this.x < -2.5 * map.tileWidth) {
        this.x = map.totalWidth + 2.0 * map.tileWidth;
    }
};

// Picks one of the rows for the corn:
Corn.prototype.cornRow = function(row) {
    return map.yValues[row];
};

var PowerUp = function() {
    // Picks a random number corresponding to an array map.variousImages 
    // inside map object:
    var randomChoice = (function aChoice() {
        var options = [6, 7, 8, 9, 10, 11, 12, 13];
        return options[Math.floor(Math.random() * options.length)];
    })();
    // Pause control:
    this.moving = 1;
    // Controls which way the PowerUp is currently moving, see .update:
    this.movingRight = false;
    // Sets a name to the PowerUp to be used by the .pickUp method on player: 
    this.gem = (function randomGem() {
        if (randomChoice === 6) {
            return 'time';
        } else if (randomChoice === 7) {
            return 'shield';
        } else if (randomChoice === 8) {
            return 'fast';
        } else if (randomChoice === 9) {
            return 'water';
        } else if (randomChoice === 10) {
            return 'lasso';
        } else if (randomChoice === 11) {
            return 'points';
        } else if (randomChoice === 12) {
            return 'slow';
        } else if (randomChoice === 13) {
            return 'reverse';
        }
    })();
    // Finds the corresponding .png file from an array in the map object:
    this.sprite = map.variousImages[randomChoice];
    // Use the method defined in Enemy class to choose one of the enemy lanes
    // for the PowerUp to use:
    this.y = Enemy.prototype.startY();
    this.speed = 25 + Math.random() * 25;
    // Original position is either on the left or the right of the map:
    this.x = (function chooseSide() {
        var options = [-100, map.totalWidth + 100];
        return options[Math.floor(Math.random() * 2)];
    })();
};

inherit(PowerUp, Entity);

// Runs on every requestAnimationFrame cycle engine.js:
PowerUp.prototype.update = function(dt) {
    // If not too far left, move left:
    if (this.x > -50 && !this.movingRight) {
        this.x -= this.moving * this.speed * dt;
    }
    // If far enough left, start moving right:
    else if (this.x <= -40 && !this.movingRight) {
        this.movingRight = true;
    }
    // If not too far right, more right:
    else if (this.movingRight && this.x <= map.totalWidth + 50) {
        this.x += this.moving * this.speed * dt;
    }
    // Assume PowerUp is too far right, move left:
    else {
        this.movingRight = false;
    }
};

// Class for the keys supposed to be collected by the player:
var Key = function(pos) {
    // Pause control:
    this.moving = 1;
    // If false, key has yet to be reached by player:
    this.collected = false;
    // If activated, key will move toward player from a distance:
    this.lasso = false;
    // Short delay between player grabbing key and it flying to bottom of map,
    // this is just for aesthetic effect:
    this.throwDelay = 30;
    // Keys all fly to slightly different spots at the bottom of the map so that 
    // the player can tell whether 1 or two have been collected:
    this.collectedOffset = Math.floor(Math.random() * map.tileWidth * 3);
    // Key .png file:
    this.sprite = map.variousImages[3];
    // x-value is given as a coordinate at initialization:
    this.x = map.xValues[pos];
    // All keys start at the top line:
    this.y = map.yValues[1];
};

inherit(Key, Entity);

Key.prototype.update = function(dt) {
    // this.collected gets activated by the Player.prototype.update method when
    // the player is close enough to the key:
    if (this.collected) {
        // Wait a short time:
        if (this.throwDelay > 0) {
            this.throwDelay -= 100 * dt * this.moving;
        } // Fly to a designated spot at the bottom right of the screen:
        else {
            if (this.x < map.xValues[map.numColumns - 4] + this.collectedOffset) {
                this.x = this.x + 100 * dt *
                    // Slow down the x-movement as time goes on for a smoother animation:
                    (map.xValues[map.numColumns - 2] / this.x) * this.moving;
            }
            if (this.y < map.yValues[map.numRows - 2]) {
                this.y = this.y + 300 * dt * this.moving;
            }
        }
    }

    // lasso PowerUp will cause key to fly toward the player, from where it can
    // be easily collected:
    if (this.lasso && !this.collected) {
        if (this.x > player.x) {
            this.x -= 230 * dt * this.moving;
        } else if (this.x < player.x) {
            this.x += 230 * dt * this.moving;
        }
        if (this.y > player.y) {
            this.y -= 100 * dt * this.moving;
        } else if (this.y < player.y) {
            this.y += 100 * dt * this.moving;
        }
    }
};

// Enemies the player must avoid:
var Enemy = function() {
    // Enemy sprite changes depending on what direction the enemy is travelling 
    // in:
    this.sprite = '';
    // Random value for the start of any given enemy:
    this.x = this.startX();
    // Picks an appropriate column for the enemy type:
    this.y = this.startY();
    // Speed is determined by which row an enemy is found in (positive/negative
    // speeds are used to find direction due to multi directional possibilities 
    // when this.zigzag = true:
    this.xSpeed = 0;
    // This is used when zigzag is true and enemies are moving vertically:
    this.ySpeed = 0;
    // When gemSpeed or gemSlow is picked up, this increase and decreases
    // respectively in order to modify speed of the enemy temporarily. 
    this.gemSpeed = 1.0;
    // Gets turned on after several rounds to give regular enemies the ability 
    // to move vertically:
    this.zigzag = false;
    // Timer between changes of direction for zigzagging enemies:
    this.alterDirCount = 2 + Math.random() * 15;
    // If 1, the enemies are moving, if 0, they are not,
    // see Enemy.prototype.togglePause() This function allows the pause to work.
    this.moving = 1;
    // Controls whether the enemy is frozen or not due to a PowerUp:
    this.frozen = 1;
};

inherit(Enemy, Entity);

// Generate a start position for each enemy
Enemy.prototype.startX = function() {
    return Math.random() * map.totalWidth * 1.0;
};

// Picks a random row for the enemy out of an array defined in the map object:
Enemy.prototype.startY = function() {
    return map.yValues[map.enemyRows[Math.floor(Math.random() * map.enemyRows.length)]];
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between rendererings of the canvas:
Enemy.prototype.update = function(dt) {

    // Update the current position of the enemy appropriately according to the 
    // enemy's speed. this.moving is changed to 0 when the game is paused and 
    // this.gemSpeed determines a speed boost/handicap:
    this.x = this.x + this.xSpeed * dt * this.moving * this.gemSpeed * this.frozen;
    this.y = this.y + this.ySpeed * dt * this.moving * this.gemSpeed * this.frozen;

    // Give enemies an appropriate initial speed if they have no current speed,
    // Appropriateness is gauged by the column in which the enemy is:
    if (this.xSpeed === 0 && this.ySpeed === 0) {
        this.initialSpeed();
    }
    // Zig-zagging behaviour will only occur if this mode is turned on:
    if (this.zigzag) {
        this.handleZigzag(dt);
    }

    // Update sprite depending on what direction the enemy is travelling in:
    this.updateSprite();

    // If the enemy is too far left or right, reset the enemy's position on the 
    // row:
    if (this.x < -100 || this.x > map.totalWidth + 100) {
        this.resetTrack();
    }
};

Enemy.prototype.resetTrack = function() {
    // Pick a random, appropriate column for the enemy:
    this.y = this.startY();
    // Certain rows have enemies initially traveling left in them:
    if (this.y === map.yValues[10] || this.y === map.yValues[7]) {
        this.x = map.totalWidth + 80;
        // Change speed of the enemy for the next loop
        this.xSpeed = this.newSpeed('left');
    } // Other rows have enemies initially travelling right in the them:
    else {
        this.x = -80;
        // Change speed of the enemy for the next loop
        this.xSpeed = this.newSpeed('right');
    }
};

// Assign a speed to a newly created enemy:
Enemy.prototype.initialSpeed = function() {
    if (this.y === map.yValues[10] || this.y === map.yValues[7]) {
        this.xSpeed = this.newSpeed('left');
    } else {
        this.xSpeed = this.newSpeed('right');
    }
};

// Change the sprite based on direction enemy is travelling:
Enemy.prototype.updateSprite = function() {
    // Travelling right sprite:
    if (this.xSpeed > 0) {
        this.sprite = map.enemySprites[0];
    }
    // left:
    if (this.xSpeed < 0) {
        this.sprite = map.enemySprites[1];
    }
    // up:
    if (this.ySpeed < 0) {
        this.sprite = map.enemySprites[2];
    }
    // down:
    if (this.ySpeed > 0) {
        this.sprite = map.enemySprites[3];
    }
};

Enemy.prototype.handleZigzag = function(dt) {
    // If enemy is not paused, the countdown until a change of direction will 
    // continue:
    if (this.moving === 1) {
        this.alterDirCount -= dt;
    }
    // When countdown is 0, change direction:
    if (this.alterDirCount <= 0) {
        this.alterDirection();
    }
    // The next 4 if blocks deal with situations where enemies are moving 
    // out of bounds, in which case they are redirected:
    // Enemies in top path moving too far up:
    if (this.y <= map.yValues[6] && this.ySpeed < 0) {
        this.alterDirectionSide();
    }
    // Enemies in top path moving too far down:
    if (this.y >= map.yValues[8] && this.y < map.yValues[9] && this.ySpeed > 0) {
        this.alterDirectionSide();
    }
    // Enemies in bottom path moving too far up:
    if (this.y <= map.yValues[10] && this.y > map.yValues[9] && this.ySpeed < 0) {
        this.alterDirectionSide();
    }
    // Enemies in bottom path moving too far down:
    if (this.y >= map.yValues[12] && this.ySpeed > 0) {
        this.alterDirectionSide();
    }
};

// Causes all enemies to begin zigzag behaviour of sometimes changing directions
// and occationally moving vertically:
Enemy.prototype.activateZigzag = function() {
    var numEnemies = allEnemies.length;
    for (var i = 0; i < numEnemies; i++) {
        allEnemies[i].zigzag = true;
    }
};

// Handles situations where enemies are about to vertically go out of bounds and 
// sends them left or right:
Enemy.prototype.alterDirectionSide = function() {
    var options = ['left', 'right'];
    // Get the magnitude to their current speed in order to maintain speed but 
    // assign a new, horizontal direction:
    var speed = Math.abs(this.ySpeed);
    this.ySpeed = 0;
    var choice = options[Math.floor(Math.random() * 2)];

    if (choice === 'left') {
        this.xSpeed = -1 * speed;
    } else if (choice === 'right') {
        this.xSpeed = speed;
    }
};

// Changes the direction that an enemy is moving in randomly. This only works 
// when the enemies have this.zigzac activated using activateZigzag():
Enemy.prototype.alterDirection = function() {
    // Reset countdown timer until the next time the direction will be altered:
    this.alterDirCount = 2 + Math.random() * 15;
    var options = ['left', 'up', 'down', 'right'];
    var speed;
    // Get magnitude of the current speed. Enemies don't move diagonally so 
    // either the vertical speed or the horizontal speed will represent the 
    // current magnitude:
    if (this.xSpeed === 0) {
        speed = Math.abs(this.ySpeed);
    } else {
        speed = Math.abs(this.xSpeed);
    }

    // Clear current speeds in order to set a new one:
    this.xSpeed = 0;
    this.ySpeed = 0;

    var choice = options[Math.floor(Math.random() * 4)];

    if (choice === 'left') {
        this.xSpeed = -1 * speed;
    } else if (choice === 'right') {
        this.xSpeed = speed;
    } else if (choice === 'up') {
        this.ySpeed = -1 * speed;
    } else if (choice === 'down') {
        this.ySpeed = speed;
    }
};

// Generate a random, appropriate speed for each enemy
Enemy.prototype.newSpeed = function(direction) {
    if (direction === 'right') {
        return map.tileWidth / 2 + (Math.random() * map.tileWidth * 3);
    } else if (direction === 'left') {
        return (map.tileWidth / -2 + (Math.random() * map.tileWidth * -3));
    }
};

// A different type of enemy that burrows out of the ground on grass to hit the
// player:
var Burrower = function(type) {
    this.sprite = map.enemySprites[4];
    // Burrowers start off screen until the unburrow:
    this.x = -100;
    this.y = -100;
    // Determines behavior of the Burrower:
    this.type = type;
    // Used to keep track of movements of unburrow by determining which hole the
    // burrower unburrowed from last:
    this.lastBurrow = 5;
    this.burrowWait = 5;
    this.unburrowed = 0;
    // When the game is paused and this.moving is set to 0, the burrowWait timer 
    // will stop counting down:
    this.moving = 1;
};

inherit(Burrower, Entity);

Burrower.prototype.update = function(dt) {

    // Count down timer until the next time unburrow will happen:
    if (this.burrowWait >= 0) {
        this.burrowWait -= dt * this.moving;
    }

    // Controls animation of unburrowed sprite:
    if (this.unburrowed <= 1 || this.unburrowed >= 2.5) {
        this.sprite = map.enemySprites[4];
    } else {
        this.sprite = map.enemySprites[5];
    }

    // Unburrower type 1's behaviour upon the countdown timers reaching zero. 
    // unburrow() sets this.umburrowed > 0 so this only runs once every few 
    // seconds:
    if (this.type === 1) {
        if (this.burrowWait <= 0 && this.unburrowed <= 0) {
            this.unburrow();
        }
    }

    // Unburrower type 2's behaviour:
    if (this.type === 2) {
        if (this.burrowWait <= 0 && this.unburrowed <= 0) {
            this.unburrow2();
        }
    }

    // Countdown timer until Burrower stops being unburrowed:
    if (this.unburrowed > 0) {
        this.unburrowed -= dt * this.moving;
    }

    // When the timer is 0, the burrower burrows again and a new timer is set 
    // until the next unburrow:
    if (this.unburrowed <= 0 && this.burrowWait <= 0) {
        this.hide();
    }
};

// Type 1 Burrower behaviour:
Burrower.prototype.unburrow = function() {
    // Set timer until the Burrower will burrow again:
    this.unburrowed = 3;
    // If the last unburrow happened at the final location (5), then go to the 
    // first location again:
    if (this.lastBurrow === 5) {
        this.lastBurrow = 1;
        this.x = map.xValues[3];
        this.y = map.yValues[5];
    } else {
        // Move to the next location:
        if (this.lastBurrow === 1) {
            this.x = map.xValues[7];
            this.y = map.yValues[5];
        } else if (this.lastBurrow === 2) {
            this.x = map.xValues[1];
            this.y = map.yValues[9];
        } else if (this.lastBurrow === 3) {
            this.x = map.xValues[5];
            this.y = map.yValues[9];
        } else if (this.lastBurrow === 4) {
            this.x = map.xValues[9];
            this.y = map.yValues[9];
        }
        this.lastBurrow++;
    }
};

// Type 2 Burrower behaviour:
Burrower.prototype.unburrow2 = function() {
    // Unburrow will last for this long:
    this.unburrowed = 1 + 4 * Math.random();
    this.y = map.yValues[13];
    // Unburrow can happen on any tile along the bottommost row:
    this.x = map.xValues[Math.floor(Math.random() * map.numColumns)];
};

// What Burrowers do when they are burrow after unburrowing:
Burrower.prototype.hide = function(wait) {
    this.x = -100;
    this.y = -100;
    if (this.type === 1) {
        // Type 1 Burrowers have a fixed time to wait until the next unburrow:
        this.burrowWait = 5;
    } else {
        // Type 2 Burrowers wait a random time:
        this.burrowWait = (2 + 4 * Math.random());
    }

};

// This is run whenever the player respawns to avoid having the player spawn on
// top of a Burrower causing repeated deaths:
Burrower.prototype.resetBurrow = function() {
    var numEnemies = allEnemies.length;
    for (var i = 0; i < numEnemies; i++) {
        allEnemies[i].burrowWait = 5;
        if (allEnemies[i] instanceof Burrower) {
            allEnemies[i].x = -100;
        }
    }
};

var Player = function() {
    // this.sprite, this.x, this.y, this.xCoord and this.yCoord are all 
    // generated for the first time in Player.prototype.handleInput() when a 
    // player picks a character
    this.sprite = '';
    this.x = 0;
    this.y = 0;
    // xCoord and yCoord are to do with the dynamically generated grid system
    // which Player uses to move around the game map.
    this.xCoord = 0;
    this.yCoord = 0;
    // Determines if the game is paused:
    this.paused = false;
    // Determines if the victory message should be shown:
    this.victory = false;
    this.keysHeld = 0;
    // Determines if the player is hurt messages should be shown:
    this.ouch = false;
    this.drowned = false;
    // Determines if the game should restart:
    this.isDead = false;
    this.livesLeft = 5;
    // This value is used in anchoring the victory jumps the player does upon 
    // collecting all the keys:
    this.victorySpot = 0;
    // This is used to help guide the victory jumps as they loop in
    // Player.prototype.update():
    this.movingUp = true;
    // Is the player on a Corn?
    this.floating = false;
    // Used to determine how fast the player is moving when the player is on
    // floating corn:
    this.speed = null;
    // Used to determine speed on the floating corn if the corn is moving faster 
    // or slower than usual due to a PowerUp:
    this.gemSpeed = 1.0;
    // Pause control on the floating corn:
    this.moving = 1;

    // Game begins when this is true:
    this.charSelected = false;
    // selectX and selectY control the position of the character selection box,
    // this.x and this.y couldn't be used to due to possible collisions with
    // enemies whose position values are already generated when the selection
    // screen comes up.
    this.selectX = map.totalWidth / 2 - 260;
    this.selectY = map.tileHeight * 9;
    // The following six arrays all get used through
    // Player.prototype.handleInput to choose the correct player.sprite in 
    // various situations:
    this.charOptions = map.playerChars;
    this.charHappy = map.playerCharsHappy;
    this.charHurt = map.playerCharsHurt;
    this.charShield = map.playerCharsShield;
    this.charLasso = map.playerCharsLasso;
    this.charWater = map.playerCharsWater;
    // This selects which value from the above arrays is used to determine which
    // character sprite will appear:
    this.selection = 0;

    // Countdown timer for each round is assigned when resetStart() is run at
    // the start of a new round:
    this.timeLeft = 0;
    // Time left before PowerUp affecting enemy speed runs out:
    this.enemySpeedTime = 0;
    // Time left before enemies unfreeze:
    this.freeze = 0;
    // Time left before player can get hit by enemies:
    this.shield = 0;
    // Time left before player can no longer walk on water:
    this.water = 0;
    // Time left before keys no longer fly towards the player:
    this.lasso = 0;
    //
    this.counting = false;

    this.points = 0;
    this.latestPoints = 0;
    this.pointsY = -200;

    this.pointsScreen = false;
};

// Until the player has selected a character, this gets rendered over the game:
Player.prototype.character = function() {
    // Display game goal instructions in the white space at the top:
    this.topIntroText();
    // Display instructions about movement controls and how to mute the game:
    this.instructionsText();
    // Display the box holding the characters and the accompanying text:
    this.charSelection();
    // Draw the character sprites that can be selected:
    this.charChoices();
};

// This gets run for every frame of the game
Player.prototype.update = function(dt) {

    // Store the number of corn, enemies, keys, and PowerUps to use in scanning 
    // hit boxes:
    var numCorn = allCorn.length,
        numEnemies = allEnemies.length,
        numKeys = allKeys.length,
        numPowerUps = allPowerUps.length;

    // Victory conditions:
    if (this.keysHeld === 3 && !this.victory) {
        map.playSFX('trumpet');
        // Reset for next round:
        this.keysHeld = 0;
        // Initiates other behaviour:
        this.victory = true;
        // Position from which the player will be jumping up and down:
        this.victorySpot = this.y;
        this.sprite = this.charHappy[this.selection];
        // Gain points based on the amount of time that is still left on the 
        // countdown clock. If timeLeft is 0, gain 100 points:
        this.winPoints(100 + (Math.ceil(this.timeLeft) * 10), 'victory');
        // Pause all Entities:
        this.blurPause();
    }

    // If the orange text depicting the latest points won is still onscreen, 
    // make sure it is moving offscreen:
    if (this.pointsY > -200) {
        this.pointsY -= 150 * dt;
    }

    // As long as the game has gone beyond the character selection screen, pause 
    // the game if the window is ever navigated away from:
    if (this.charSelected) {
        // Pause game if window is not active:
        window.addEventListener('blur', function() {
            player.blurPause();
        });
    }

    // Enemies are fast/slow:
    if (this.enemySpeedTime >= 0) {
        // Keep counting down the timer:
        this.enemySpeedTime -= dt * this.moving;
    } else if (this.enemySpeedTime <= 0 && this.enemySpeedTime >= -1) {
        // Set timer well below the minimum required to run the following set of 
        // instructions to ensure they only have to get run once:
        this.enemySpeedTime -= 2;
        // Reset the player's speed on the corn:
        this.gemSpeed = 1.0;
        // Reset the speed of enemies and of the corn themselves:
        for (var q = 0; q < numEnemies; q++) {
            allEnemies[q].gemSpeed = 1.0;
        }
        for (q = 0; q < numCorn; q++) {
            allCorn[q].gemSpeed = 1.0;
        }
    }

    // Lasso PowerUp allows extended reach when grabbing keys:
    if (this.lasso > 0) {
        // Count down timer:
        this.lasso -= dt * this.moving;
        // There is still some time left on the lasso countdown:
        if (this.lasso > 0.1) {
            // Shield and water sprites would take priority over the lasso 
            // sprite if they have not almost completely run out as well:
            if (this.shield <= 0.09 && this.water <= 0.09) {
                this.sprite = this.charLasso[this.selection];
            }
            // This gives the player an extended influence over the keys. The  
            // value written is the number of pixels that this reach is extended 
            // by:
            this.extention = 100;
        } // If all the countdowns are really low, go back to the regular 
        // sprite:
        else if (this.lasso < 0.09) {
            // If no timer is about 0.1, set sprite back to normal:
            this.resetSprite();
            // Remove extention:
            this.extention = 0;
        }
    }

    // Player with water gem buff doesn't die when this.drown() is run:
    if (this.water > 0) {
        // Count down timer:
        this.water -= dt * this.moving;
        // Shield would take priority over water, but otherwise, as long as 
        // there is sufficient time on the countodnw timer, apply water sprite:
        if (this.water > 0.1 && this.shield <= 0.09) {
            this.sprite = this.charWater[this.selection];
        }
        // If no timer is about 0.1, set sprite back to normal:
        this.resetSprite();
    }

    // Player with shield gem buff doesn't die when this.hit() is run:
    if (this.shield > 0) {
        // Count down timer:
        this.shield -= dt * this.moving;
        // Shield takes priority over other buffs in determining sprite:
        if (this.shield > 0.1) {
            this.sprite = this.charShield[this.selection];
        }
        // If no timer is about 0.1, set sprite back to normal:
        this.resetSprite();
    }

    // Player is on top of corn:
    if (this.floating) {
        // Update the this.xCoord value as the player is moved by corn;
        this.trackPosition();
        // Move player at the speed of the corn that the player is on:
        this.x += this.speed * dt * this.moving * this.gemSpeed;
    }

    // Keep points countdown timer going when the game is not paused:
    if (!this.paused && this.timeLeft >= 0) {
        this.timeLeft -= dt * this.moving;
    }

    // Works as long as the freeze timer from timeGem() is greater than 0:
    if (this.freeze > 0) {
        // Count down timer:
        this.freeze -= dt * this.moving;
        // Freeze all enemies:
        for (var t = 0; t < numEnemies; t++) {
            // enemy.frozen gets multiplied by enemy.xSpeed and enemy.ySpeed 
            // when determining the enemy's movement across the map:
            allEnemies[t].frozen = 0;
        }
    }

    // If the first enemy is frozen, assume all enemies are. If the freeze timer 
    // is at 0, unfreeze all enemies:
    if (this.freeze <= 0 && allEnemies[0].frozen === 0) {
        for (var r = 0; r < numEnemies; r++) {
            allEnemies[r].frozen = 1;
        }
    }

    // Holds current positions of all corn:
    var cornSpots = [];

    // Add current position of each Corn object to the array:
    for (var i = 0; i < numCorn; i++) {
        var x = allCorn[i].x;
        var y = allCorn[i].y;
        cornSpots.push([x, y]);
    }

    // Reset this.floating to false. If the player is on top of the corn, this 
    // value will be set to true in the following for-loop, otherwise, the 
    // player should not be floating:
    this.floating = false;

    // Check to see if the player has stepped on a corn. This is only possible
    // if the player is in the rows where corn exists:
    if (this.yCoord === 2 || this.yCoord === 3 || this.yCoord === 4) {
        // Check each position where the corn currently is to see if the player
        // is on the corn:
        for (var b = 0; b < numCorn; b++) {
            // The width of the corn is equal to 2 * map.tileWidth. The reason 
            // for adding 30 and 25 to this.x is in order to match where the 
            // character appears to be rendered with where the corn appears to
            // be rendered on the screen. The actual width of the player sprite
            // is buffered by transparent (alpha) space:
            if ((this.x + 30 < cornSpots[b][0] + 2 * map.tileWidth &&
                    this.x + 25 > cornSpots[b][0]) &&
                (this.y - map.tileHeight / 8 < cornSpots[b][1] &&
                    this.y + map.tileHeight / 8 > cornSpots[b][1])) {
                // This will run if the player appears to be on the corn. When
                // this.floating === true, the player will move at the speed of 
                // the corn that's being stood on:
                this.floating = true;
                this.speed = allCorn[b].speed;
            }
        }
        // If the player is not on any corn, the player must have drowned:
        if (this.floating === false) {
            // this.drown will do nothing if the player still has time left on 
            // the water gem buff counter:
            this.drown();
        }
    }

    // If the player is in the top row and not on top of one of the three grass 
    // patches, the player must be in the water and must therefore drown:
    if (this.yCoord === 1 && this.xCoord !== 1 && this.xCoord !== 5 &&
        this.xCoord !== 9) {
        this.drown();
    }

    // Holds current positions of all keys:
    var keySpots = [];

    // Push current key positions to the array. This is important when the lasso
    // is in play as the keys might not necessarily be in their original spots 
    // and still need to be picked up by the player in those instances:
    for (i = 0; i < numKeys; i++) {
        var xK = allKeys[i].x;
        var yK = allKeys[i].y;
        keySpots.push([xK, yK]);
    }

    // If the any key is within the this.extention range of the player, it 
    // is grabbed by the lasso and will fly toward the player:
    for (var p = 0; p < numKeys; p++) {
        if ((this.x - this.extention < keySpots[p][0] &&
                this.x + this.extention > keySpots[p][0]) &&
            (this.y - this.extention < keySpots[p][1] &&
                this.y + this.extention > keySpots[p][1]) &&
            this.lasso > 0) {
            // Key lassoed. Lassoed keys fly toward the player.x and player.y 
            // values:
            allKeys[p].lasso = true;
        }
    }

    // Check to see if the player is close enough to any of the keys to
    // pick them up:
    for (p = 0; p < numKeys; p++) {
        if ((this.x - map.tileWidth / 2 < keySpots[p][0] &&
                this.x + map.tileWidth / 2 > keySpots[p][0]) &&
            (this.y - map.tileHeight / 8 < keySpots[p][1] &&
                this.y + map.tileHeight / 8 > keySpots[p][1])) {
            // If the key is not already picked up, it now should be:
            if (allKeys[p].collected === false) {
                allKeys[p].collected = true;
                map.playSFX('key');
                // Once this.keysHeld is === 3, the round is won:
                this.keysHeld++;
                this.winPoints(50);
            }
        }
    }
    // Holds current positions of all power ups:
    var powerSpots = [];

    // Push current positions of each PowerUp to the array:
    for (p = 0; p < numPowerUps; p++) {
        var xP = allPowerUps[p].x;
        var yP = allPowerUps[p].y;
        powerSpots.push([xP, yP]);
    }

    // Check to see if the player is close enough to any of the power ups to
    // pick them up:
    for (p = 0; p < numPowerUps; p++) {
        if ((this.x - map.tileWidth / 2 < powerSpots[p][0] &&
                this.x + map.tileWidth / 2 > powerSpots[p][0]) &&
            (this.y - map.tileHeight / 8 < powerSpots[p][1] &&
                this.y + map.tileHeight / 8 > powerSpots[p][1])) {
            // When a PowerUp is picked up, it adds its buff to the player, and 
            // also gets removed from the allPowerUps array:
            this.pickUp(allPowerUps[p]);
            // If the loop isn't broken at this point, it will continue running 
            // through the previously established numPowerUps and might pickUp 
            // PowerUps that are not actually at the correct location due to 
            // powerSpots and allPowerUps indices no longer being matched after 
            // the removal of the first PowerUp that was picked up:
            break;
        }
    }
    // Holds current positions of all enemies:
    var enemySpots = [];

    // Push all current enemy position values to the array:
    for (i = 0; i < numEnemies; i++) {
        var xE = allEnemies[i].x;
        var yE = allEnemies[i].y;
        enemySpots.push([xE, yE]);
    }
    // Check to see if the player is close enough to any of the enemies to
    // trigger a colission
    for (var k = 0; k < numEnemies; k++) {
        if ((this.x - map.tileWidth / 2 < enemySpots[k][0] &&
                this.x + map.tileWidth / 2 > enemySpots[k][0]) &&
            (this.y - map.tileHeight / 2 < enemySpots[k][1] &&
                this.y + map.tileHeight / 2 > enemySpots[k][1])) {
            // Collision detected:
            this.hit();
        }
    }
    // If player reached the end objective, character does a little bounce,
    // this.victorySpot is determined once the player reaches the objective:
    if (this.victory === true) {
        this.victoryBounce(this.victorySpot, dt);
    }
};

// When all the gem buff timers that change the sprite of the character are 
// simultaneously slow, set the sprite to the original one:
Player.prototype.resetSprite = function() {
    if (this.water < 0.1 && this.shield < 0.1 &&
        this.lasso < 0.1) {
        this.sprite = this.charOptions[this.selection];
    }
};


// This runs whenever the player is on the floating corn to determine where the 
// player should .move() to if the player moves off the floating corn area:
Player.prototype.trackPosition = function() {
    // Run through all xCoodinate positions:
    for (var i = 0; i < (map.numColumns - 1); i++) {
        // The use of the -25 accounts for the player sprite's aplha/transparent
        // parts, such that trackPosition() will return a result that is more in
        // line with where the character sprite appears to be standing:
        if (this.x > map.xValues[i] - 25 && this.x < map.xValues[i + 1] - 25) {
            this.xCoord = i;
        }
    }
};

// Moves player.sprite to the current grid coordinates which get updated by
// Player.prototype.handleInput()
Player.prototype.move = function() {
    this.x = map.xValues[this.xCoord];
    this.y = map.yValues[this.yCoord];
};

// This move the player sprite without regard for the coordinate system. This is 
// used in conjunction with trackPosition() in order to make transitions from 
// waterMove()s to move()s (which use the coordinate system) seemless:
Player.prototype.waterMove = function(direc) {
    if (direc === 'left') {
        this.x = this.x - map.tileWidth;
    } else if (direc === 'right') {
        this.x = this.x + map.tileWidth;
    } else if (direc === 'up') {
        this.y = this.y - map.tileHeight;
    } else if (direc === 'down') {
        this.y = this.y + map.tileHeight;
    }
};

// Resets the player.sprite to the starting position near the bottom centre
// part of the screen:
Player.prototype.resetStart = function() {
    // Position player somewhere in the middle of the bottom-most row:
    this.xCoord = Math.floor(map.numColumns / 2);
    this.yCoord = map.numRows - 2;
    this.move();
    // Countdown timer is reset so that the player can get extra points:
    this.timeLeft = 30;
};

// Draws each frame.
Player.prototype.render = function() {

    // Always display the latest points won. Except unless the points where won
    // just recently, the display will occur off the canvas and won't be seen,
    // and once points are won and the display is back on canvas, the
    // this.pointsY property that determines the current position of 
    // announcePoints will continue decreasing until it is once again offscreen:
    this.announcePoints(this.latestPoints);

    // Show character selection at start of game:
    if (this.charSelected === false) {
        this.character();
    }

    // When the character sprite is chosen, the game has begun:
    if (this.charSelected === true) {
        // Draw current position of appropriate player.sprite:
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        // Draw the HUD at the top of the screen:
        this.displayTimer();
        this.displayPoints();
        this.displayHearts();
    }

    // Set all common features of the following PowerUp time displays:
    ctx.font = '24px Impact';
    ctx.textAlign = 'left';
    // Common x-position of all the PowerUp time displays:
    var xText = map.totalWidth / 2.1;

    // Shield PowerUp timer appears when it is active:
    if (this.shield > 0) {
        ctx.fillStyle = 'green';
        ctx.fillText('Shield: ' + Math.ceil(this.shield), xText,
            map.tileHeight * 0.6);
    }

    // Time PowerUp timer appears when it is active:
    if (this.freeze > 0) {
        ctx.fillStyle = 'blue';
        ctx.fillText('Freeze: ' + Math.ceil(this.freeze), xText,
            map.tileHeight * 1.2);
    }

    // Water PowerUp timer appears when it is active:
    if (this.water > 0) {
        ctx.fillStyle = 'purple';
        ctx.fillText('Water: ' + Math.ceil(this.water), xText,
            map.tileHeight * 1.8);
    }

    // Lasso PowerUp timer appears when it is active:
    if (this.lasso > 0) {
        ctx.fillStyle = 'yellow';
        // Yellow is hard to see, so a thin outline is added:
        ctx.strokeStyle = 'black';
        ctx.lineWidth = '1';
        ctx.fillText('Lasso: ' + Math.ceil(this.lasso), xText,
            map.tileHeight * 2.4);
        ctx.strokeText('Lasso: ' + Math.ceil(this.lasso), xText,
            map.tileHeight * 2.4);
        ctx.lineWidth = '2';
    }

    if (this.victory === true) {
        this.victoryScreen();
    } else if (this.isDead === true) {
        this.deadScreen();
    }
    // Has to be above this.ouch === true, since if drowned is true, ouch is
    // true as well:
    else if (this.drowned === true) {
        this.drownMessage();
    } else if (this.ouch === true) {
        this.hitMessage();
    }
    // Has to be lowest in chain since this.paused === true in all the above 
    // situations as well:
    else if (this.paused === true) {
        this.pauseMessage();
    }
};


// Runs whenever points are awarded to the player. lastKey is an optional 
// parameter that only need to be run when picking up the third key in a round:
Player.prototype.winPoints = function(points, lastKey) {
    // Give player points:
    this.points += points;
    // Move the orange announcePoints text down so that it is briefly visible:
    this.pointsY = map.tileHeight * 5;
    // Make the points being displayed the points that were just acquired:
    this.latestPoints = points;
    // If the last key parameter is included, the points shown will have 50 
    // added to them to account for the 50 points getting that key awareded. 
    // Otherwise, the more recent time bonus score will override the value 
    // of this.latestPoints completely:
    if (lastKey) {
        this.latestPoints = points + 50;
    }
};

// This always displays this.latestPoints through this.render();
Player.prototype.announcePoints = function(points) {
    ctx.fillStyle = 'orange';
    ctx.strokeStyle = 'black';
    ctx.font = '56px Impact';
    ctx.fillText('+' + points, map.totalWidth - map.tileWidth * 1.5, this.pointsY);
    ctx.strokeText('+' + points, map.totalWidth - map.tileWidth * 1.5, this.pointsY);
};

// Display when all keys are collected:
Player.prototype.victoryScreen = function() {
    // Clouds speed up even though eveything else is paused to clear area where 
    // text appears:
    Cloud.prototype.keepMoving();
    Player.prototype.victoryMessage();
    Player.prototype.continueMessage();
};

// Display when all lives are lost:
Player.prototype.deadScreen = function() {
    // Clouds speed up even though eveything else is paused to clear area where 
    // text appears, especially important here as final point count might 
    // otherwise be obscured:
    Cloud.prototype.keepMoving();
    this.deadOverlay();
    this.deadMessage();
    this.playAgainMessage();
};

// Display during character selection screen:
Player.prototype.topIntroText = function() {
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.font = '30px Impact';

    ctx.fillText('Collect the keys,', map.totalWidth / 2, map.tileHeight);
    ctx.fillText('Collect the gems,', map.totalWidth / 2, map.tileHeight * 1.75);
    ctx.fillText('Beat the clock!', map.totalWidth / 2, map.tileHeight * 2.5);
};

// Display during character selection screen:
Player.prototype.instructionsText = function() {
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';

    ctx.fillText('Use ', (map.totalWidth / 6), map.tileHeight * 5);
    ctx.drawImage(Resources.get(map.variousImages[14]), (map.totalWidth / 5) + 30, map.tileHeight * 3);
    ctx.fillText(' to move. ', (map.totalWidth / 2) + 10, map.tileHeight * 5);
    ctx.fillText('Use \'m\' to mute sound.', map.totalWidth / 6, map.tileHeight * 6.3);
};

// Display during character selection screen:
Player.prototype.charSelection = function() {
    this.bwMsgStyle();
    ctx.textAlign = 'center';
    ctx.fillText('Select a character', map.totalWidth / 2, map.tileHeight * 8.6);
    ctx.strokeText('Select a character', map.totalWidth / 2, map.tileHeight * 8.6);
    ctx.fillText('Press enter to choose', map.totalWidth / 2, map.tileHeight * 13.2);
    ctx.strokeText('Press enter to choose', map.totalWidth / 2, map.tileHeight * 13.2);
    // Box to contain the characters
    ctx.fillStyle = 'silver';
    ctx.fillRect(0, map.tileHeight * 8.6, map.totalWidth, 140);
    ctx.strokeRect(0, map.tileHeight * 8.6, map.totalWidth, 140);
    // Box to indicate which character is being selected
    ctx.drawImage(Resources.get(map.variousImages[0]), this.selectX, this.selectY);
};

// Display character options during character selection screen:
Player.prototype.charChoices = function() {
    // Determine number of character options for the for loop ahead:
    var length = this.charOptions.length,
        // Find the character's position on the character menu:
        position = map.totalWidth / 2 - 260;
    // Draw all of the characters so user can see which one is being selected
    for (var i = 0; i < length; i++) {
        ctx.drawImage(Resources.get(this.charOptions[i]), position, map.tileHeight * 9);
        // spread the characters out evenly
        position = position + 112;
    }
};

Player.prototype.victoryMessage = function() {
    ctx.font = '56px Impact';
    ctx.fillStyle = 'lime';
    ctx.strokeStyle = 'black';
    ctx.textAlign = 'center';

    ctx.fillText('Good job!', canvas.width / 2, canvas.height / 2);
    ctx.strokeText('Good job!', canvas.width / 2, canvas.height / 2);
};

Player.prototype.continueMessage = function() {
    ctx.font = '40px Impact';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.textAlign = 'center';

    ctx.fillText('Press enter to continue', canvas.width / 2, canvas.height - 60);
    ctx.strokeText('Press enter to continue', canvas.width / 2, canvas.height - 60);
};

Player.prototype.playAgainMessage = function() {
    ctx.font = '40px Impact';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.textAlign = 'center';

    ctx.fillText('Press enter to play again!', canvas.width / 2, canvas.height - 60);
    ctx.strokeText('Press enter to play again!', canvas.width / 2, canvas.height - 60);
};

Player.prototype.bwMsgStyle = function() {
    ctx.font = '40px Impact';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
};

Player.prototype.pauseMessage = function() {
    this.bwMsgStyle();
    ctx.textAlign = 'center';
    ctx.fillText('Press "p" to unpause', canvas.width / 2, canvas.height / 2);
    ctx.strokeText('Press "p" to unpause', canvas.width / 2, canvas.height / 2);
};

Player.prototype.hitMessage = function() {
    // Red, see-through gradient appears around the player sprite:
    this.hitOverlay();
    // Sends clouds to keep moving and sets font style:
    this.loseLifeMsgStyle();
    ctx.fillText('You got hit!', canvas.width / 2, canvas.height - 140);
    ctx.strokeText('You got hit!', canvas.width / 2, canvas.height - 140);
    this.continueMessage();
};

Player.prototype.drownMessage = function() {
    // Sends clouds to keep moving and sets font style:
    this.loseLifeMsgStyle();
    ctx.fillText('You can\'t swim!', canvas.width / 2, canvas.height - 140);
    ctx.strokeText('You can\'t swim!', canvas.width / 2, canvas.height - 140);
    this.continueMessage();
};

Player.prototype.loseLifeMsgStyle = function() {
    // If clouds are present, their speed will be doubled so that they move 
    // offscreen and allow the text below them to be read:
    Cloud.prototype.keepMoving();
    ctx.font = '56px Impact';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'red';
    ctx.textAlign = 'center';
};

// Display when all lives are lost to show the player the number of points 
// earned:
Player.prototype.deadMessage = function() {
    ctx.font = '64px Impact';
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'red';
    ctx.textAlign = 'center';
    ctx.fillText('You got ' + this.points + ' points!', canvas.width / 2, canvas.height - 140);
    ctx.strokeText('You got ' + this.points + ' points!', canvas.width / 2, canvas.height - 140);
};

// This is used to in most circumstances to switch between having all entities 
// being paused and all entities being unpaused:
Player.prototype.togglePause = function() {
    var numEnemies = allEnemies.length,
        numCorn = allCorn.length,
        numKeys = allKeys.length,
        numClouds = allClouds.length,
        numPowerUps = allPowerUps.length;
    for (var i = 0; i < numEnemies; i++) {
        allEnemies[i].togglePause();
    }
    for (i = 0; i < numCorn; i++) {
        allCorn[i].togglePause();
    }
    for (i = 0; i < numKeys; i++) {
        allKeys[i].togglePause();
    }
    for (i = 0; i < numPowerUps; i++) {
        allPowerUps[i].togglePause();
    }
    for (i = 0; i < numClouds; i++) {
        allClouds[i].togglePause();
    }
    this.paused = !this.paused;
    // This controls whether the player is moving while floating on top of the 
    // corn:
    if (this.moving === 1) {
        this.moving = 0;
    } else {
        this.moving = 1;
    }
};

// This is used in circumstances where we want to make sure that everything 
// gets paused whether it is paused already or not. The primary use (and 
// possibily only ever necessary use) is to pause the game when the game window 
// is navigated away from such that the 'blur' event occurs on the window:
Player.prototype.blurPause = function() {
    var numEnemies = allEnemies.length,
        numCorn = allCorn.length,
        numKeys = allKeys.length,
        numClouds = allClouds.length,
        numPowerUps = allPowerUps.length;
    // Pause all enemies:
    for (var i = 0; i < numEnemies; i++) {
        allEnemies[i].blurPause();
    }
    for (i = 0; i < numCorn; i++) {
        allCorn[i].blurPause();
    }
    for (i = 0; i < numKeys; i++) {
        allKeys[i].blurPause();
    }
    for (i = 0; i < numPowerUps; i++) {
        allPowerUps[i].blurPause();
    }
    for (i = 0; i < numClouds; i++) {
        allClouds[i].blurPause();
    }
    this.paused = true;
    this.moving = 0;
};

// Runs whenever a PowerUp is picked up. It takes the picked-up PowerUp as an
// argument:
Player.prototype.pickUp = function(power) {
    // Run the effects of picking up this PowerUp. power.gem returns a string 
    // that identifies the kind of PowerUp that was picked up. It needs to be 
    // run with .call(player) as otherwise the value of this in the effects will 
    // be mapped as the Player.prototype.gems object:
    this.gems[power.gem].call(player);
    // If the powerUpMax number has been reached on the map, this frees a spot
    // for a new PowerUp to be spawned:
    map.powerUpCount--;
    // Remove PowerUp from the array of PowerUps so that it cannot be picked up
    // again:
    var index = allPowerUps.indexOf(power);
    allPowerUps.splice(index, 1);
};

// Stores all the effects of all of the PowerUps:
Player.prototype.gems = {
    // Orange PowerUp, increases the speed of all enemies and corn:
    fast: (function gemFast() {
        map.playSFX('run');
        this.winPoints(150);
        // How long the effects will last in seconds:
        this.enemySpeedTime = 5;
        // Increase the speed of the player when the player is floating on corn:
        this.gemSpeed = 1.5;
        var numEnemies = allEnemies.length,
            numCorn = allCorn.length;
        // Increase speed of enemies and the corn:
        for (var i = 0; i < numEnemies; i++) {
            allEnemies[i].gemSpeed = 1.5;
        }
        for (i = 0; i < numCorn; i++) {
            allCorn[i].gemSpeed = 1.5;
        }
    }),
    // Blue PowerUp, stops the enemies from moving:
    time: (function gemTime() {
        map.playSFX('time');
        this.winPoints(100);
        // Adds some extra time to the clock to potentially get more points:
        this.timeLeft += 10;
        // How long the effects will last in seconds:
        this.freeze = 6;
    }),
    // Green PowerUp, makes the player invulnerable to collisions with enemies:
    shield: (function gemShield() {
        map.playSFX('shield');
        this.winPoints(100);
        // How long the effects will last in seconds:
        this.shield = 5;
    }),
    // Purple PowerUp, allows the player to walk on water without drowning:
    water: (function gemWater() {
        map.playSFX('chime');
        this.winPoints(100);
        // How long the effects will last in seconds:
        this.water = 4;
    }),
    // Yellow PowerUp, gives the player extra reach when grabbing keys:
    lasso: (function gemLasso() {
        map.playSFX('yeehaw');
        this.winPoints(100);
        // How long the effects will last in seconds:
        this.lasso = 8;
    }),
    // Black PowerUp, gives the player a lot of points:
    points: (function gemPoints() {
        map.playSFX('chaching');
        this.winPoints(300);
    }),
    // White PowerUp, slows the enemies and corn down:
    slow: (function gemSlow() {
        map.playSFX('powerdown');
        this.winPoints(100);
        this.enemySpeedTime = 5;
        // Decrease the speed of the player when the player is floating on corn:
        this.gemSpeed = 0.5;
        var numEnemies = allEnemies.length,
            numCorn = allCorn.length;
        for (var i = 0; i < numEnemies; i++) {
            allEnemies[i].gemSpeed = 0.5;
        }
        for (i = 0; i < numCorn; i++) {
            allCorn[i].gemSpeed = 0.5;
        }
    }),
    // Red PowerUp, switch the direction that all corn is floating in:
    reverse: (function gemReverse() {
        map.playSFX('flip');
        this.winPoints(100);
        var numCorn = allCorn.length;
        for (i = 0; i < numCorn; i++) {
            allCorn[i].speed *= -1;
        }
    })
};

// Handles player colliding with enemies:
Player.prototype.hit = function() {
    // This will not run if the player has the shield PowerUp:
    if (this.paused === false && this.shield <= 0) {
        map.playSFX('thud');
        // All PowerUp effects go away:
        this.resetTimers();
        this.loseLife();
    }
};

// Handles player stepping onto water:
Player.prototype.drown = function() {
    // This will not run if the player has the water PowerUp:
    if (this.paused === false && this.water <= 0) {
        map.playSFX('splash');
        // Results in the drowned message being shown instead of the hit 
        // message:
        this.drowned = true;
        // All PowerUp effects go away:
        this.resetTimers();
        this.loseLife();
    }
};

// Removes all timed PowerUp effects:-
Player.prototype.resetTimers = function() {
    this.enemySpeedTime = 0;
    this.freeze = 0;
    this.shield = 0;
    this.water = 0;
    this.lasso = 0;
};

// Runs when the player is hit() or drown()s:
Player.prototype.loseLife = function() {
    // Everything should pause:
    this.blurPause();
    // Allows user to reset game using enter button through this.handleInput():
    this.ouch = true;
    // Change to hurt sprite:
    this.sprite = this.charHurt[this.selection];
    // Reduce lives:
    this.livesLeft--;
    // Once player has 0 lives left, the game is over:
    if (this.livesLeft < 1) {
        map.playSFX('gong');
        // Causes specific final message actions to occur:
        this.isDead = true;
    }
};

// Runs in render() to show number of lives left:
Player.prototype.displayHearts = function() {
    // x-value of the leftmost heart:
    var position = 10;
    for (var i = 0; i < this.livesLeft; i++) {
        ctx.drawImage(Resources.get(map.variousImages[4]), position, 10);
        position += map.tileWidth;
    }
};

// Runs in render() to show how much bonus time is left:
Player.prototype.displayTimer = function() {
    this.bwMsgStyle();
    ctx.textAlign = 'right';
    var displayMe;
    if (this.timeLeft > 0) {
        // Will display the rounded-up value of the number of seconds left:
        displayMe = Math.ceil(this.timeLeft);
    } else {
        // Indicate to the player that they have lost a chance to get bonus 
        // points:
        displayMe = 'No bonus!';
    }
    ctx.fillText(displayMe, map.totalWidth - 5, 50);
    ctx.strokeText(displayMe, map.totalWidth - 5, 50);
};

// Runs in render() to show total number of points collected:
Player.prototype.displayPoints = function() {
    this.bwMsgStyle();
    ctx.textAlign = 'right';
    // Draw a star next to the points: 
    ctx.drawImage(Resources.get(map.variousImages[1]), map.totalWidth - map.tileWidth, 52);
    ctx.fillText(this.points, map.totalWidth - (5 + map.tileWidth), 100);
    ctx.strokeText(this.points, map.totalWidth - (5 + map.tileWidth), 100);
};

// Display red see-through overlay over player when player is hit:
Player.prototype.hitOverlay = function() {
    // Center gradient around current position of player:
    var grd = ctx.createRadialGradient(this.x + map.tileWidth / 2,
        this.y + map.tileWidth, map.tileWidth / 2, this.x + map.tileWidth / 2,
        this.y + map.tileWidth, map.tileWidth);

    // Fade gradient to become completely see-through as it moves away from the 
    // player:
    grd.addColorStop(0, 'rgba(255, 0, 0, 0.4)');
    grd.addColorStop(1, "rgba(255, 0, 0, 0)");

    // Overlay is a circle:
    ctx.arc(this.x, this.y + map.tileWidth / 2, map.tileWidth * 3, 0, 2 * Math.PI);
    ctx.fillStyle = grd;
    ctx.fill();
};

// Display grey see-through overlay over the game map when all lives are lost:
Player.prototype.deadOverlay = function() {
    ctx.fillStyle = 'rgba(100, 100, 100, 0.5)';
    ctx.fillRect(0, map.buffer + 2 * map.tileHeight, map.totalWidth, map.totalHeight);
};

// player.sprite jumps up and down upon collecting all the keys:
Player.prototype.victoryBounce = function(startingY, dt) {
    // Height of jumps is determined by the height of the tiles for easy 
    // scaling:
    var height = map.tileHeight / 4;
    // The sprite be moving up if below the highest point and is currently in 
    // ascend:
    if (this.y > startingY - height && this.movingUp === true) {
        // map.tileWidth here is used as a basis for a time measurement so that
        // the game scales appropriately if bigger maps are used:
        this.y -= map.tileWidth * dt;
    } else if (this.y < startingY) {
        // Move down:
        this.movingUp = false;
        this.y += map.tileWidth * dt;
    } else {
        // player.sprite is assumed to have reached starting position:
        this.movingUp = true;
    }
};

// Actions to perform when the user presses keys:
Player.prototype.handleInput = function(input) {
    if (input === 'mute') {
        map.audio.muted = !map.audio.muted;
        if (map.audio.muted) {
            var numSounds = map.lastTwentySounds.length;
            for (var sound = 0; sound < numSounds; sound++){
                map.lastTwentySounds[sound].pause();
            }
        }
    }

    // Character-selection screen controls
    if (this.charSelected === false) {
        if (input === 'left') {
            // Leftmost selection:
            if (this.selection === 0) {
                // Skip to rightmost character.
                this.selectX = this.selectX + (this.charOptions.length - 1) * 112;
                this.selection = this.charOptions.length - 1;
            } else {
                // Move selection left:
                this.selectX = this.selectX - 112;
                this.selection--;
            }
        } else if (input === 'right') {
            // Rightmost selection:
            if (this.selection === this.charOptions.length - 1) {
                // Skip to leftmost character.
                this.selectX = this.selectX - (this.charOptions.length - 1) * 112;
                this.selection = 0;
            } else {
                // Move selection right:
                this.selectX = this.selectX + 112;
                this.selection++;
            }
        } else if (input === 'enter') {
            // Choose character
            this.charSelected = true;
            this.sprite = this.charOptions[this.selection];
            this.resetStart();
            map.makeKeys();
        }
    }
    // Controls only work when game isn't paused
    else if (this.charSelected === true && this.paused === false) {

        if (input === 'left') {
            // If on water, just move a tile width over, don't use coordinates:
            if (this.floating) {
                this.waterMove('left');
                return;
            } // Leftmost position:
            if (this.xCoord === 0) {
                // Move to rightmost tile:
                this.xCoord = map.numColumns - 1;
            } else {
                // Check if the tile is available:
                if (map.canGo((this.xCoord - 1), this.yCoord)) {
                    // Move left:
                    this.xCoord--;
                }
            }
        } else if (input === 'up') {
            // Check if the tile is available:
            if (map.canGo(this.xCoord, this.yCoord - 1)) {
                // Move up:
                this.yCoord--;
                // Avoid coordinates:
                if (this.floating && this.yCoord !== 1) {
                    this.waterMove('up');
                    return;
                }
            }
        } else if (input === 'right') {
            // If on water, just move a tile width over, don't use coordinates:
            if (this.floating) {
                this.waterMove('right');
                return;
            } // Rightmost position:
            if (this.xCoord === map.numColumns - 1) {
                // Move to leftmost tile:
                this.xCoord = 0;
            } else {
                // Check if the tile is available:
                if (map.canGo(this.xCoord + 1, this.yCoord)) {
                    // Move right:
                    this.xCoord++;
                }
            }
        } else if (input === 'down') {
            // Check if the tile is available:
            if (map.canGo(this.xCoord, this.yCoord + 1)) {
                // Move down:
                this.yCoord++;
                if (this.floating && this.yCoord !== 5) {
                    this.waterMove('down');
                    return;
                }
            }
        } else if (input === 'pause') {
            this.togglePause();
            return;
        }


        // Handles the move for all the possible changes in the if statements above:
        this.move();
    }
    // If the game is paused, only the unpause button will work:
    else if (this.paused === true && this.victory === false &&
        this.ouch === false && this.isDead === false) {
        if (input === 'pause') {
            this.togglePause();
        }
    } // 'enter' can be used to reset the game:
    else if (this.victory === true || this.ouch === true || this.isDead === true ||
        this.drowned === true) {
        if (input === 'enter') {
            if (this.isDead === true) {
                this.isDead = false;
                this.livesLeft = 5;
                map.powerUpCount = 0;
                map.powerUpsLeft = 5;
                allPowerUps.length = 0;
                allClouds.length = 0;
                map.makeKeys();
                // Back to round 1.
                map.round = 1;
                setEnemies(8);
                // Pause the enemies only, so that the new ones generated don't 
                // begin the next game paused:
                this.blurPause();
                this.points = 0;
            } else if (this.victory === true) {
                this.victory = false;
                map.round++;
                map.makeKeys();
                // More enemies each rounch
                if (allEnemies.length <= 40) {
                    addEnemies(1);
                }
                if (map.round === 2) {
                    // Extra add in for round 2:
                    addEnemies(5);
                }
                // Add a burrower starting on the third round:
                if (map.round === 3) {
                    allEnemies.push(new Burrower(1));
                }
                // Enemies will be able to move in all 4 directions starting on the
                // fourth round:
                if (map.round >= 4) {
                    Enemy.prototype.activateZigzag();
                }
                // Clouds and a second burrower will appear on the 5th round:
                if (map.round === 5) {
                    addClouds(3);
                    allEnemies.push(new Burrower(2));
                }
                // Add another borrower 2 on the 6th round:
                if (map.round === 6) {
                    allEnemies.push(new Burrower(2));
                }
                // Clouds will be added starting on the fifth round:
                if (allClouds.length <= 15 && map.round >= 5) {
                    addClouds(1);
                }
                map.powerUpsLeft = 5;
                this.blurPause();
            }
            this.freeze = 0;
            this.shield = 0;
            this.lasso = 0;
            this.water = 0;
            this.enemySpeedTime = 0;
            this.ouch = false;
            this.drowned = false;
            this.togglePause();
            Cloud.prototype.moveNormally();
            Burrower.prototype.resetBurrow();
            // Back to starting position of game:
            this.sprite = this.charOptions[this.selection];
            this.resetStart();
        }
    }
};

// Instantiation of all objects:

var map = new Map();
// Generate coordinate system for Player.prototyle.handleInput() to use:
map.makeCoordinates();

var player = new Player();

var allEnemies = [];
var allCorn = [];
var allKeys = [];
var allPowerUps = [];
var allClouds = [];
allPowerUps.push(new PowerUp());
allPowerUps.push(new PowerUp());
allPowerUps.push(new PowerUp());
allPowerUps.push(new PowerUp());
allPowerUps.push(new PowerUp());
allPowerUps.push(new PowerUp());
allPowerUps.push(new PowerUp());

function addClouds(count) {
    for (var i = 0; i < count; i++) {
        allClouds.push(new Cloud());
    }
}

function addEnemies(count) {
    for (var i = 0; i < count; i++) {
        allEnemies.push(new Enemy());
    }
}

function addCorn() {
    // Add first row of corn:
    for (var i = 0; i < 4; i++) {
        allCorn.push(new Corn(2, (map.tileWidth * 3.5 * i) - map.tileWidth, map.slowCorn));
    } // Add second row of corn:
    for (i = 0; i < 3; i++) {
        allCorn.push(new Corn(3, map.tileWidth * 5 * i, map.medCorn));
    } // Add third row of corn:
    for (i = 0; i < 3; i++) {
        allCorn.push(new Corn(4, map.tileWidth * 4.5 * i, map.fastCorn));
    }
}

function inherit(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype); // delegate to prototype
    subClass.prototype.constructor = subClass; // set constructor on prototype
}

function setEnemies(count) {
    allEnemies.length = 0;
    addEnemies(count);
}
// Pick a number of enemies:
addEnemies(8);

// Generate Corn:
addCorn();


// This listens for key presses and sends the keys to the Player.handleInput()
// method:
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        65: 'left',
        72: 'left',
        38: 'up',
        87: 'up',
        75: 'up',
        39: 'right',
        68: 'right',
        76: 'right',
        40: 'down',
        83: 'down',
        74: 'down',
        13: 'enter',
        32: 'enter',
        80: 'pause',
        19: 'pause',
        77: 'mute'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});


// TODO: Change sprites to make a unique look

// TODO: menu
// TODO: Refactor everything, particularly methods belonging to Corn, Enemy and
// Item, Cloud

// TODO: Level editor to move rocks

// TODO: Diplay information off of the canvas (like the timers);
// TODO: Mention mute controls
// TODO: Include muted symbol bottom lefthand corner
// TODO: Edit intro with Sarah's suggestions

// TODO: display Enemy slow/speed
// TODO: unburrow sound
// TODO: move sound
// TODO: 2 lane monster
// TODO: Slow down regular enemies and add FAST one
// TODO: Add a water enemy
// TODO: Create a powerup class that inherits from Item
// TODO: Fix switch to be smaller
// TODO: No class for non-class
// TODO: Fix bug with unburrow
// TODO: How many keys has player collected? Put it on the player
// TODO: Make a new class for burrow and burrow2 (currently at 829 editting out 
//  the complext bools.)
// TODO: Seperate allEnemies and create a new allBurrowers
// TODO: Get mute to instantly mute the sounds that are already playing
// TODO: FIX bug where Mute moves the player a bit when on top of the corn
// TODO: Wakka Wakka monster on the water
// TODO: Make a function that handles all sprite changes due to buffs
// TODO: Stop the alterDirection timer on enemies when the game is paused/when
// they are frozen (this is when the problem happens)
// TODO: Make it possible to see several points announcements if many PowerUps
// are picked up
