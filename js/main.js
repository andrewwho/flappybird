// get dimensions of the window considering retina displays
var w = window.innerWidth,
    h = window.innerHeight;

// We start by initializing Phaser
// Parameters: width of the game, height of the game, how to render the game, the HTML div that will contain the game
var game = new Phaser.Game(w, h, Phaser.AUTO, 'game_div');

// And now we define our first and only state, I'll call it 'main'. A state is a specific scene of a game like a menu, a game over screen, etc.
var main_state = {

    preload: function() {
        // Everything in this function will be executed at the beginning. That’s where we usually load the game’s assets (images, sounds, etc.)
        // Load a sprite in the game
        // Parameters: name of the sprite, path to the image
        this.game.stage.backgroundColor = "#00A6FF";

        this.game.load.image('bird', 'assets/bird.png');

        this.game.load.image('pipe', 'assets/pipe.png');

    },

    create: function() {
        // This function will be called after the preload function. Here we set up the game, display sprites, add labels, etc.
        // display the bird on the screen
        this.bird = this.game.add.sprite(this.getRelativeX(0.2), 245, 'bird');

        // adds gravity to make it fall.
        this.bird.body.gravity.y = 1200;

        // set center of gravity of bird
        this.bird.anchor.setTo(-0.2, 0.5);

        // make a group of pipes
        this.pipes = this.game.add.group();
        this.pipes.createMultiple(60, 'pipe');

        var pipeWidth = this.game.cache.getImage('pipe').width;
        this.numberOfBlocks = parseInt(w/pipeWidth);

        // add a scoreboard
        this.score = 0;
        var style = { font: "30px Arial", fill: "#FFFFFF" };
        this.label_score = this.game.add.text(20, 20, "0", style);

        // bind the spacekey so it calls the jump function
        var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space_key.onDown.add(this.jump, this);

        // allow touch events for phone
        this.game.input.onDown.add(this.jump, this);

        this.goFullscreen();

        // add a pipe timer
        this.timer = this.game.time.events.loop(1500, this.add_row_of_pipes, this);

    },

    update: function() {
        // This is where we will spend the most of our time. This function is called 60 times per second to update the game.

        // If the bird is out of the world (too high or too low), call the 'restart_game' function

        if (this.bird.inWorld == false) {
            this.restart_game();
            this.bird.reset(this.getRelativeX(0.2), 245);
        }

        this.game.physics.overlap(this.bird, this.pipes, this.hit_pipe, null, this);

        if (this.bird.angle < 20)
            this.bird.angle += 1;

    },

    // Make the bird jump
    jump: function() {

        if (this.bird.alive == false)
            return;

        // add a vertical velocity to the bird
        this.bird.body.velocity.y = -400;

        // create an animation on the bird
        this.game.add.tween(this.bird).to({angle: -20}, 100).start();
    },

    // restart the game
    restart_game: function() {
        // stop the timer when we restart
        this.game.time.events.remove(this.timer);

        // Start the 'main' state, which restarts the game
        this.game.state.start('main');
    },

    // add one pipe
    add_one_pipe: function(x, y) {
        // get the first dead pipe of the group
        var pipe = this.pipes.getFirstDead();

        if (pipe !== null) {

            // set the new position of the pipe
            pipe.reset(x, y);

            // add velocity ot the pipe to make it move left
            pipe.body.velocity.x = -700;

            // kill the pipe when its no longer visible
            pipe.outOfBoundsKill = true;
        }
    },

    // add a row of pipes
    add_row_of_pipes: function() {
        var hole = Math.floor(Math.random()*5)+1;

        for (var i = 0; i < this.numberOfBlocks; i++)
            if (i != hole && i != hole + 1 && i != hole + 2 && i != hole + 3 && i != hole + 4)
                this.add_one_pipe(w, i*45);

        this.score += 1;
        this.label_score.content = this.score;
    },

    goFullscreen: function() {
        this.game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL; //resize your window to see the stage resize too
        this.game.stage.scale.setShowAll();
        this.game.stage.scale.refresh();
    },

    getRelativeX: function(x) {
        return x*w.toFixed(2);
    },

    hit_pipe: function() {
        // Set the alive property of the bird to false
        this.bird.alive = false;

        // Prevent new pipes from appearing
        this.game.time.events.remove(this.timer);

        // Go through all the pipes, and stop their movement
        this.pipes.forEachAlive(function(p){
            p.body.velocity.x = 0;
        }, this);
    }
}

// And finally we tell Phaser to add and start our 'main' state
game.state.add('main', main_state);
game.state.start('main');