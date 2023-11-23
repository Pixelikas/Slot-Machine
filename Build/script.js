// Creates an object with game configs
const config = {

    // Sets Phaser render, game window size and scene functions
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {preload: preload, create: create, update: update, createItems: createItems}

};

    // Sets all the game variables
    var game = new Phaser.Game(config);
    let balance = 5000;
    let winnings = 0;
    let message = 'GOOD LUCK';
    var isPlaying = false;
    var itemCreated = 0;
    var itemLeftVelocity = 24;
    var itemCenterVelocity = 24;
    var itemRightVelocity = 24;
    var itemIndexLeft = 0;
    var itemIndexCenter = 0;
    var itemIndexRight = 0;
    var roll = 0;
    var bgFrame;
    var itemLeft, itemCenter, itemRight;
    var buttonPlayOn, buttonPlayOff, winLine;
    var eventLoop, eventWinLineOn, eventWinLineOff;
    let result = []

    function preload(){
        
        // Load game assets
        this.load.image('background', 'bg.png');
        this.load.image('background-frame', 'bgframe.png');
        this.load.image('frame', 'frame.png');
        this.load.image('winline', 'winline.png');
        this.load.image('apple', 'apple.png');
        this.load.image('banana', 'banana.png');
        this.load.image('bar', 'bar.png');
        this.load.image('cherry', 'cherry.png');
        this.load.image('grape', 'grape.png');
        this.load.image('lemon', 'lemon.png');
        this.load.image('orange', 'orange.png');
        this.load.image('watermellon', 'watermellon.png');
        this.load.image('playbuttonOn', 'play_button_0.png');
        this.load.image('playbuttonOff', 'play_button_3.png');

    }

    function create(){

        // Creates game sprites and sets the positions
        this.add.sprite(400,300, 'background');
        bgFrame = this.add.sprite(400,300, 'background-frame'); 
        this.add.sprite(400,300, 'frame');
        winLine = this.add.sprite(400,300, 'winline');
        buttonPlayOff = this.add.sprite(400,520, 'playbuttonOff')
        buttonPlayOn = this.add.sprite(400,520, 'playbuttonOn').setInteractive();

        // Sets winLine to start invisible
        winLine.visible = false;

        // Sets empty text to the text variables
        balanceText = this.add.text(200, 147, '', {fontFamily: 'Arial Black', fontSize: '16px', fill: '#000' })
        winningsText = this.add.text(480, 147, '', {fontFamily: 'Arial Black', fontSize: '16px', fill: '#000' })
        messageText = this.add.text(340, 447, '', {fontFamily: 'Arial Black', fontSize: '18px', fill: '#000'})
        buttonText = this.add.text(375, 507, '', {fontFamily: 'Arial Black', fontSize: '20px', fill: '#fff'})

        // Call a loop function to change (random) index items 
        this.time.addEvent({ delay: 100, callback: changeIndexItem, callbackScope: this, loop: false });

        // Get mouse click on Play button
        buttonPlayOn.on('pointerdown', function (click){

            // Set result items on play
            result.push(itemIndexLeft, itemIndexCenter, itemIndexRight);

            // Check condition to start the game
            if(!isPlaying){

                // Change index items to render
                changeIndexItem();

                // Change play variable
                isPlaying = true;
                
                // Subtract one from balance
                balance -= 1;
                
                // Sets a message to player
                message = "PLAYING :D"
                
                // Change Play button to disable
                buttonPlayOn.visible = false;
                buttonPlayOff.visible = true;

            }

        });

    }

    function update(){

        // Sets z position to background frame 
        bgFrame.depth = -300;

        // Sets values to balance and winnings texts
        balanceText.text = "Balance: " + balance;
        winningsText.text = "Winnings: " + winnings;
        
        // Sets messages to message text
        messageText.text = message;
        
        // Sets text to Play button
        buttonText.text = "Play";

        // Check condition to created item
        if(itemCreated == 1){

            // Sets velocity values for the items in each column
            itemLeft.y += itemLeftVelocity;
            itemCenter.y += itemCenterVelocity;
            itemRight.y += itemRightVelocity;

            // Check condition to destroy item
            if(itemLeft.y > 520){

                // Destroy item
                itemLeft.destroy();

            }

            // Check condition to destroy item
            if(itemCenter.y > 520){

                // Destroy item
                itemCenter.destroy();

            }

            // Check condition to destroy item
            if(itemRight.y > 520){

                // Destroy item
                itemRight.destroy();

            }

        }
      
        // Check if game is playing
        if(isPlaying){
            
            // Creates event to call function and create items in each column
            eventLoop = this.time.addEvent({delay: 200, callback: createItems, args: [itemIndexLeft, itemIndexCenter, itemIndexRight], callbackScope: this, loop: true });
            
            // Creates event to call function and stop loop items
            this.time.addEvent({delay: 2240, callback: loopStop, callbackScope: this, loop: false });

            // Creates event to call function and pay the player
            this.time.addEvent({delay: 3500, callback: payWinnings, callbackScope: this, loop: false });

            // Creates event to call function and restart the slot machine
            this.time.addEvent({delay: 5500, callback: restorePlayButton, callbackScope: this, loop: false });
            
            // Change condition to play again
            isPlaying = 0;

        }
        
    }

    // Creates a function to spawn items
    function createItems(itemIndexLeft, itemIndexCenter, itemIndexRight){
    
        // Condition to stop rolls and render result
        if(roll >= 10){

            // Render result
            itemIndexLeft = result[0];
            itemIndexCenter = result[1];
            itemIndexRight = result[2];


        }else{

            // Randomize index items on each call 
            itemIndexLeft = Math.floor(Math.random() * 87) + 1;
            itemIndexCenter = Math.floor(Math.random() * 87) + 1;
            itemIndexRight = Math.floor(Math.random() * 87) + 1;

            // Change roll
            roll++;

        }

        // Condition to create items
        itemCreated = 1;

                // Checks condition to render the correct item
                if(itemIndexLeft > 0 && itemIndexLeft < 25){

                    // Sets item banana sprite to variable
                    itemLeft = this.add.sprite(265, 240, 'banana');

                    // Sets z position to item 
                    itemLeft.depth = -10;

                }

                if(itemIndexCenter > 0 && itemIndexCenter < 25){

                    itemCenter = this.add.sprite(400, 240, 'banana');
                    itemCenter.depth = -10;
        
                }

                if(itemIndexRight > 0 && itemIndexRight < 25){

                    itemRight = this.add.sprite(535, 240, 'banana');
                    itemRight.depth = -10;
                
                }

                // Checks condition to render the correct item
                if(itemIndexLeft > 24 && itemIndexLeft < 45){

                    // Sets item orange sprite to variable
                    itemLeft = this.add.sprite(265, 240, 'orange');

                    // Sets z position to item 
                    itemLeft.depth = -10;

                }

                if(itemIndexCenter > 24 && itemIndexCenter < 45){

                    itemCenter = this.add.sprite(400, 240, 'orange');
                    itemCenter.depth = -10;
        
                }

                if(itemIndexRight > 24 && itemIndexRight < 45){

                    itemRight = this.add.sprite(535, 240, 'orange');
                    itemRight.depth = -10;
                
                }

                // Checks condition to render the correct item
                if(itemIndexLeft > 44 && itemIndexLeft < 61){

                    // Sets item grape sprite to variable
                    itemLeft = this.add.sprite(265, 240, 'grape');

                    // Sets z position to item 
                    itemLeft.depth = -10;

                }

                if(itemIndexCenter > 44 && itemIndexCenter < 61){

                    itemCenter = this.add.sprite(400, 240, 'grape');
                    itemCenter.depth = -10;
        
                }

                if(itemIndexRight > 44 && itemIndexRight < 61){

                    itemRight = this.add.sprite(535, 240, 'grape');
                    itemRight.depth = -10;
                
                }

                // Checks condition to render the correct item
                if(itemIndexLeft > 60 && itemIndexLeft < 73){

                    // Sets item apple sprite to variable
                    itemLeft = this.add.sprite(265, 240, 'apple');

                    // Sets z position to item 
                    itemLeft.depth = -10;

                }

                if(itemIndexCenter > 60 && itemIndexCenter < 73){

                    itemCenter = this.add.sprite(400, 240, 'apple');
                    itemCenter.depth = -10;
        
                }

                if(itemIndexRight > 60 && itemIndexRight < 73){

                    itemRight = this.add.sprite(535, 240, 'apple');
                    itemRight.depth = -10;
                
                }

                // Checks condition to render the correct item
                if(itemIndexLeft > 72 && itemIndexLeft < 81){

                    // Sets item watermellon sprite to variable
                    itemLeft = this.add.sprite(265, 240, 'watermellon');

                    // Sets z position to item 
                    itemLeft.depth = -10;

                }

                if(itemIndexCenter > 72 && itemIndexCenter < 81){

                    itemCenter = this.add.sprite(400, 240, 'watermellon');
                    itemCenter.depth = -10;
        
                }

                if(itemIndexRight > 72 && itemIndexRight < 81){

                    itemRight = this.add.sprite(535, 240, 'watermellon');
                    itemRight.depth = -10;
                
                }

                // Checks condition to render the correct item
                if(itemIndexLeft > 80 && itemIndexLeft < 85){

                    // Sets item lemon sprite to variable
                    itemLeft = this.add.sprite(265, 240, 'lemon');

                    // Sets z position to item 
                    itemLeft.depth = -10;

                }

                if(itemIndexCenter > 80 && itemIndexCenter < 85){

                    itemCenter = this.add.sprite(400, 240, 'lemon');
                    itemCenter.depth = -10;
        
                }

                if(itemIndexRight > 80 && itemIndexRight < 85){

                    itemRight = this.add.sprite(535, 240, 'lemon');
                    itemRight.depth = -10;
                
                }

                // Checks condition to render the correct item
                if(itemIndexLeft > 84 && itemIndexLeft < 87){

                    // Sets item cherry sprite to variable
                    itemLeft = this.add.sprite(265, 240, 'cherry');

                    // Sets z position to item 
                    itemLeft.depth = -10;

                }

                if(itemIndexCenter > 84 && itemIndexCenter < 87){

                    itemCenter = this.add.sprite(400, 240, 'cherry');
                    itemCenter.depth = -10;
        
                }

                if(itemIndexRight > 84 && itemIndexRight < 87){

                    itemRight = this.add.sprite(535, 240, 'cherry');
                    itemRight.depth = -10;
                
                }

                // Checks condition to render the correct item
                if(itemIndexLeft == 87){

                    // Sets item bar sprite to variable
                    itemLeft = this.add.sprite(265, 240, 'bar');

                    // Sets z position to item 
                    itemLeft.depth = -10;

                }

                if(itemIndexCenter == 87){

                    itemCenter = this.add.sprite(400, 240, 'bar');
                    itemCenter.depth = -10;
        
                }

                if(itemIndexRight == 87){

                    itemRight = this.add.sprite(535, 240, 'bar');
                    itemRight.depth = -10;
                
                }

    }

    // Creates a function to pay conditions
    function payWinnings(){

        // Sets switch-case condition to true
        switch(true){

            // Check condition to win
            case (result[0] > 0 && result[0] < 25) && (result[1] > 0 && result[1] < 25) && (result[2] > 0 && result[2] < 25):

                // Flash the winLine
                eventWinLineOn = this.time.addEvent({delay: 200, callback: winLineOn, callbackScope: this, loop: true });
                eventWinLineOff = this.time.addEvent({delay: 400, callback: winLineOff, callbackScope: this, loop: true });
                
                // Sets a message to player
                message = "3 Banana = 1"
                
                // Add values to balance and winnings
                balance += 1;
                winnings = 1;
                break;
            
            // Idem
            case (result[0] > 24 && result[0] < 45) && (result[1] > 24 && result[1] < 45) && (result[2] > 24 && result[2] < 45):

                eventWinLineOn = this.time.addEvent({delay: 200, callback: winLineOn, callbackScope: this, loop: true });
                eventWinLineOff = this.time.addEvent({delay: 400, callback: winLineOff, callbackScope: this, loop: true });
                winLine.visible = true;
                message = "3 Orange = 5"
                balance += 5;
                winnings = 5;
                break;

            // Idem    
            case (result[0] > 44 && result[0] < 61) && (result[1] > 44 && result[1] < 61) && (result[2] > 44 && result[2] < 61):

                eventWinLineOn = this.time.addEvent({delay: 200, callback: winLineOn, callbackScope: this, loop: true });
                eventWinLineOff = this.time.addEvent({delay: 400, callback: winLineOff, callbackScope: this, loop: true });
                winLine.visible = true;
                message = "3 Grape = 10"
                balance += 10;
                winnings = 10;
                break;

            // Idem
            case (result[0] > 60 && result[0] < 73) && (result[1] > 60 && result[1] < 73) && (result[2] > 60 && result[2] < 73):

                eventWinLineOn = this.time.addEvent({delay: 200, callback: winLineOn, callbackScope: this, loop: true });
                eventWinLineOff = this.time.addEvent({delay: 400, callback: winLineOff, callbackScope: this, loop: true });
                winLine.visible = true;
                message = "3 Apple = 15"
                balance += 15;
                winnings = 15;
                break;

            // Idem    
            case (result[0] > 72 && result[0] < 81) && (result[1] > 72 && result[1] < 81) && (result[2] > 72 && result[2] < 81):

                eventWinLineOn = this.time.addEvent({delay: 200, callback: winLineOn, callbackScope: this, loop: true });
                eventWinLineOff = this.time.addEvent({delay: 400, callback: winLineOff, callbackScope: this, loop: true });
                winLine.visible = true;
                message = "3 Wattermellon = 20"
                balance += 20;
                winnings = 20;
                break;
            
            // Idem
            case (result[0] > 80 && result[0] < 85) && (result[1] > 80 && result[1] < 85) && (result[2] > 80 && result[2] < 85):

                eventWinLineOn = this.time.addEvent({delay: 200, callback: winLineOn, callbackScope: this, loop: true });
                eventWinLineOff = this.time.addEvent({delay: 400, callback: winLineOff, callbackScope: this, loop: true });
                winLine.visible = true;
                message = "3 Lemon = 25"
                balance += 25;
                winnings = 25;
                break;

            // Idem
            case (result[0] > 84 && result[0] < 87) && (result[1] > 84 && result[1] < 87) && (result[2] > 84 && result[2] < 87):

                eventWinLineOn = this.time.addEvent({delay: 200, callback: winLineOn, callbackScope: this, loop: true });
                eventWinLineOff = this.time.addEvent({delay: 400, callback: winLineOff, callbackScope: this, loop: true });
                winLine.visible = true;
                message = "3 Cherry = 50"
                balance += 50;
                winnings = 50;
                break;

            // Idem    
            case (result[0] == 87) && (result[1] == 87) && (result[2] == 87):

                eventWinLineOn = this.time.addEvent({delay: 200, callback: winLineOn, callbackScope: this, loop: true });
                eventWinLineOff = this.time.addEvent({delay: 400, callback: winLineOff, callbackScope: this, loop: true });
                winLine.visible = true;
                message = "3 Bar = 100"
                balance += 100;
                winnings = 100;
                break;

            // Default condition (no win condition)    
            default :

                // Sets a message to player
                message = "TRY AGAIN"

        }

    }

    // Creates a function to restart slot machine
    function restorePlayButton(){

        // Destroy last items
        itemLeft.destroy();
        itemCenter.destroy();
        itemRight.destroy();

        // Clear result array
        result = []

        // Sets roll to zero
        roll = 0;

        // Change Play button to enable
        buttonPlayOn.visible = true;
        buttonPlayOff.visible = false;

        // Sets winLine to invisible
        winLine.visible = false;

        // Sets a message to player
        message = "GOOD LUCK"

        // Sets values to items velocity
        itemLeftVelocity = 24;
        itemCenterVelocity = 24;
        itemRightVelocity = 24;
        
        // Reset winnings value
        winnings = 0;

        // Remove winLine events
        this.time.removeEvent(eventWinLineOn);
        this.time.removeEvent(eventWinLineOff);

    }

    // Creates a function to stop left column
    function loopStop(){

        // Sets left item velocity to zero
        itemLeftVelocity = 0; 
        itemCenterVelocity = 0;
        itemRightVelocity = 0;  
        
        // Remove left column loop event
        this.time.removeEvent(eventLoop);

    }  

    // Creates a function to random index items
    function changeIndexItem(){

        // Sets random value between 1 and 87 to index items
        itemIndexLeft = Math.floor(Math.random() * 87) + 1;
        itemIndexCenter = Math.floor(Math.random() * 87) + 1;
        itemIndexRight = Math.floor(Math.random() * 87) + 1;

    }

    // Creates a function to show winLine
    function winLineOn(){

        // Show winLine
        winLine.visible = true;

    }

    // Creates a function to show winLine
    function winLineOff(){

        // Hide winLine
        winLine.visible = false;

    }