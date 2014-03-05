// We start by initializing Phaser
// Parameters: width of the game, height of the game, how to render the game, the HTML div that will contain the game
var game = new Phaser.Game(500, 600, Phaser.AUTO, 'game_div');

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
        this.bird = this.game.add.sprite(100, 245, 'bird');

        // adds gravity to make it fall.
        this.bird.body.gravity.y = 1000;

        // make a group of pipes
        this.pipes = this.game.add.group();
        this.pipes.createMultiple(20, 'pipe');

        // add a pipe timer
        this.timer = this.game.time.events.loop(1500, this.add_row_of_pipes, this);

        // add a scoreboard
        this.score = 0;
        var style = { font: "30px Arial", fill: "#FFFFFF" };
        this.label_score = this.game.add.text(20, 20, "0", style);

        // bind the spacekey so it calls the jump function
        var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space_key.onDown.add(this.jump, this);
    },

    update: function() {
        // This is where we will spend the most of our time. This function is called 60 times per second to update the game.

        // If the bird is out of the world (too high or too low), call the 'restart_game' function

        if (this.bird.inWorld == false)
            this.restart_game();

        this.game.physics.overlap(this.bird, this.pipes, this.restart_game, null, this);
    },

    // Make the bird jump
    jump: function() {
        // add a vertical velocity to the bird
        this.bird.body.velocity.y = -350;
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

        // set the new position of the pipe
        pipe.reset(x, y);

        // add velocity ot the pipe to make it move left
        pipe.body.velocity.x = -200;

        // kill the pipe when its no longer visible
        pipe.outOfBoundsKill = true;
    },

    // add a row of pipes
    add_row_of_pipes: function() {
        var hole = Math.floor(Math.random()*5)+1;

        for (var i = 0; i < 10; i++)
            if (i != hole && i != hole + 1)
                this.add_one_pipe(400, i*60+10);

        this.score += 1;
        this.label_score.content = this.score;
    }
}

// And finally we tell Phaser to add and start our 'main' state
game.state.add('main', main_state);
game.state.start('main');