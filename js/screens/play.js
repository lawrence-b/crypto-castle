game.PlayScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function () {
        // load a level
        me.levelDirector.loadLevel("level_1")

        this.lever_list = [];

        this.spawnEntities("vigenere");
    },

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function () {
        // remove the cipher from the game world
        me.game.world.removeChild(this.cipher);
    },

    "spawnEntities": function (level_type) {
        var groundY = 700;

        // Add our cipher to the game world, add it last so that this is on top of the rest.
        // Can also be forced by specifying a "Infinity" z value to the addChild function.
        // Position x and y need to be negative integers relative to bottom right
        this.cipher = new game.cipher.Container(750, 650);
        me.game.world.addChild(this.cipher);

        var lever;
        if (level_type === "caesar") {
            console.log("caesar level");

            lever = me.pool.pull("InteractEntity", 670, groundY, game.getCaesarLever(-1), game.getCaesarLever(1));
            me.game.world.addChild(lever);
        } else if (level_type === "vigenere") {
            console.log("vigenere level");

            for (var i = 0; i < game.data.current_string.length; i++) {
                lever = me.pool.pull("InteractEntity", 400 + 100 * i, groundY, game.getVigenereLever(i, -1), game.getVigenereLever(i, 1));
                me.game.world.addChild(lever);
            }
        }
    }
});

game.getVigenereLever = function (j, n) {
    return function () {
        // game.data.current_string[i] = addToChar(game.data.current_string[i], n);
        var result = '';
        for (var i = 0; i < game.data.current_string.length; i++) {
            if (i == j) {
                result += addToChar(game.data.current_string[i], n);
            } else {
                result += game.data.current_string[i];
            }
        }

        game.data.current_string = result;
    };
};

game.getCaesarLever = function (i) {
    return function () {
        game.data.current_string = caesarCipher(game.data.current_string, i);
    };
};
