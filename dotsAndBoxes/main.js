class GameBoard {
    constructor(){
        this.players = [];
        this.grid = [];
        this.playerTurn = 0;        
        this.games = [];
    };
    getPlayers(){
        return this.players;
    }
    setPlayer(player){
        if(this.players.length<2){
            this.players.push(player);            
        }
    };
    getGrid(){
        return this.grid;
    };
    setGrid(grid){
        this.grid.push(grid);
    };
    getPlayerTurn() {
        return this.playerTurn;
    };
    setPlayerTurn(turn) {  
        this.playerTurn = turn;        
        if (turn === (this.players.length)-1) {
            this.playerTurn --;            
        } else {            
            this.playerTurn ++;
        }
    };
    play(lineId, lineType){        
        const choice = new Choice(lineId, lineType);
        const gameGrid = this.grid[this.grid.length-1];

        const player = this.players[this.getPlayerTurn()];                
        player.setChoice(choice); 
        
        gameGrid.drawLine(player);

        //if, no new box was created, setPlayerTurn
        //get an array of new_boxes
        const newBoxes = gameGrid.getNewBoxes();
        if (newBoxes.length === 0) {            
            this.setPlayerTurn(this.getPlayerTurn());
            // update instructions <h2> to updated player in turn.
            updateInstructionsPlayerInTurn();
        } else {
            // grid is full. 
            if (gameGrid.isFull()) {
              //  alert('grid is full');
                updateInstructionsPlayerClosedBox(newBoxes);                               
            } else {                
                //work with newBoxes[]. Show them on screen.
                updateInstructionsPlayerClosedBox(newBoxes);
            }
        }        
    };
    showResults(){        
        const player1 = this.players[0];
        const player2 = this.players[1];
        let msg = "";
        if (player1.getPoints() === player2.getPoints()) {
            msg = "Tied Game!";
        } else {
            if (player1.getPoints() > player2.getPoints()) {
                msg = `${player1.getName()} won!`;
            } else {
                msg =`${player2.getName()} won!`;
            }
        }
        // create new game record.
        //make a copy of gamePlayers
        const gamePlayers = [];
        for (let i = 0; i < this.players.length; i++) {
            const gamePlayer = new Player(this.players[i].getName());
            gamePlayer.setColor(this.players[i].getColor());
            gamePlayer.setPoints(this.players[i].getPoints());

            gamePlayers.push(gamePlayer);
        }
        const gameRecord = new Result(this.grid[this.grid.length-1], gamePlayers);
        this.setGames(gameRecord);

        updateInstructionsGameGridIsFull(msg);
    };
    resetPoints(){        
        if (this.games.length != 0) {            
            // re-set player's points to 0.
            for (let i = 0; i < this.players.length; i++) {                
                this.players[i].resetPoints(0);
            }
            this.games.forEach(game => {
                console.log(`Game: ${game.getGridSize()}, P1: ${game.getPlayerPoints(1)}, P2: ${game.getPlayerPoints(2)}`);
            });
        }
    };
    setGames(game){
        this.games.push(game);
    };
}
class Player {
    constructor(name){
        this.name = name;
        this.color = 'black';
        this.points = 0;
        this.choice = null;
    };
    getName(){
        return this.name;
    };
    setColor(newColor){
        this.color = newColor;
    };
    getColor(){
        return this.color;
    };
    getPoints(){
        return this.points;
    };
    setPoints(point){
        this.points += point;
    };
    resetPoints(points){
        this.points = points;
    };
    getChoice(){
        return this.choice;
    };
    setChoice(choice) {
        this.choice = choice;
    };
}
class Grid {
    constructor(row, column){
        this.row = row;
        this.column = column;
        this.closedBoxes = [];   
        this.openBoxes = [];
        this.closedBoxesIndex = 0;     
    };
    getRow(){
        return this.row;
    };
    getColumn(){
        return this.column;
    };
    drawLine(player){      
        const choice = player.getChoice();        
        const isBorder = choice.isBorderLine(this.row, this.column);       
        const lineId = choice.getId();
        
        // if line is borderLine: only one box will be afected.
        if (isBorder) {   
            let boxId = "";
            let boxLineSide = "";
            // if border line && vertical
            if (choice.isVertical()) {            
                if ((parseInt(lineId[2])) != 1) {                    
                    const tempId = lineId.slice(0,2);
                    const idChar2 = (parseInt(lineId[2]) - 1).toString();                    
                    boxId = tempId.concat(idChar2);
                    boxLineSide = 'rightLine';
                } else {
                    boxId = lineId;
                    boxLineSide = 'leftLine';
                }
            } else if(choice.isHorizontal()){
                if (parseInt(lineId[0]) != 1 ) {                    
                    const idChar1 = (parseInt(lineId[0]) - 1).toString();
                    const tempId = lineId.slice(1,3);
                    boxId = idChar1.concat(tempId);
                    boxLineSide = 'bottomLine';
                } else {
                    boxId = lineId;
                    boxLineSide = 'topLine';
                }
            }
            // find out if the box was already created. add choiceline.
            // if there is a new box, set up ownerPlayer and addBox 
            this.setOpenBoxes(boxId, boxLineSide, player);
           // console.log(`Box ID: ${boxId}, Line Side: ${boxLineSide}`);
        } else {
           // Line is interior, two boxes will be affected.
           if (choice.isVertical()) {
                let leftBoxId = "";
                let leftBoxSide = "";
                let rightBoxId = lineId;
                let rightBoxSide = 'leftLine';

                this.setOpenBoxes(rightBoxId, rightBoxSide, player);

                const tempId = lineId.slice(0,2);
                const idChar2 = (parseInt(lineId[2]) - 1).toString();                    
                leftBoxId = tempId.concat(idChar2);
                leftBoxSide = 'rightLine';

                this.setOpenBoxes(leftBoxId, leftBoxSide, player);
           } else { // is horizontal
                let topBoxId = "";
                let topBoxSide = 'bottomLine';
                let bottomBoxId = lineId;
                let bottomBoxSide = 'topLine';
                
                this.setOpenBoxes(bottomBoxId, bottomBoxSide, player);

                const idChar1 = (parseInt(lineId[0]) - 1).toString();
                const tempId = lineId.slice(1,3);
                topBoxId = idChar1.concat(tempId);

                this.setOpenBoxes(topBoxId, topBoxSide, player);
           }
        }        
      //  console.log(this.openBoxes);
    };
    getNewBoxes(){        
        if((this.closedBoxes.length - this.lastNumBoxes) === 0){
            return null;
        }else{
            let newBoxes = [];
            for (let i = this.closedBoxesIndex; i < this.closedBoxes.length; i++) {                
                newBoxes.push(this.closedBoxes[i]);
                this.closedBoxesIndex ++;
            }            
            return newBoxes;
        }
    };
    getClosedBoxes(){
        return this.closedBoxes;
    };
    setClosedBoxes(box) {
        if (box.isBoxClosed()) {
            this.closedBoxes.push(box);
           // this.lastNumBoxes ++;
        }
    }
    getOpenBoxes() {
        return this.openBoxes;
    }
    setOpenBoxes(id, side, player) {
        let boxIndex = -1;        
        for (let i = 0; i < this.openBoxes.length; i++) {
            if (this.openBoxes[i].getId() === id) { 
                this.openBoxes[i].setLine(side);  
                if (this.openBoxes[i].isBoxClosed()) {
                    const closedBox = this.openBoxes[i];
                    let open_boxes = this.openBoxes.filter(function (e) {
                        if (e.getId() != closedBox.getId()) {
                            return e;
                        }
                    });
                    this.openBoxes = open_boxes;
                //    this.setOpenBoxes(open_boxes);
                    //this.openBoxes.splice(i,i+1);
                    player.setPoints(1);
                    closedBox.setOwnerPlayer(player);
                    this.setClosedBoxes(closedBox);
                }
                boxIndex = i;                        
            }
        }  
        if (boxIndex === -1) { //new open box
            const box = new Box(id);
            box.setLine(side);
            this.openBoxes.push(box);
        }        
    }
    isFull(){
        const totalBoxes = (this.row-1) * (this.column-1);
        return(this.closedBoxes.length === totalBoxes);
    }    
}
class Box {
    constructor(id){
        this.id = id;
        this.topLine = false;
        this.bottomLine = false;
        this.rightLine = false;
        this.leftLine = false;
        this.ownerPlayer = null;
    }
    getId() {
        return this.id;
    }
    setId(id) {
        this.id = id;
    }
    isTopLine() {
        return this.topLine;
    }
    setTopLine(topLine) {
        this.topLine = topLine;
    }
    isBottomLine() {
        return this.bottomLine;
    }
    setBottomLine(bottomLine) {
        this.bottomLine = bottomLine;
    }    
    isRightLine() {
        return this.rightLine;
    }
    setRightLine(rightLine) {
        this.rightLine = rightLine;
    }
    isLeftLine() {
        return this.leftLine;
    }
    setLeftLine(leftLine) {
        this.leftLine = leftLine;
    }
    getOwnerPlayer() {
        return this.ownerPlayer;
    }
    setOwnerPlayer(ownerPlayer) {
        this.ownerPlayer = ownerPlayer;
    }
    isBoxClosed(){
        return (this.topLine && this.bottomLine && 
                this.rightLine && this.leftLine);
    }
    setLine(side){
        switch (side) {
            case 'rightLine':
                this.setRightLine(true);
                break;
            case 'leftLine':
                this.setLeftLine(true);
                break;    
            case 'bottomLine':
                this.setBottomLine(true);
                break;
            case 'topLine':
                this.setTopLine(true);
                break;                     
            default:
                break;
        }
    }
}
class Choice {
    constructor(id, lineType) {
        this.id = id;
        if (lineType === 'vertical') {            
            this.vertical = true;            
            this.horizontal = false;
        } else {            
            this.vertical = false;
            this.horizontal = true;            
        };        
    };
    getId(){
        return this.id;
    };
    isVertical(){        
        return this.vertical;
    };
    isHorizontal(){
        return this.horizontal;
    };
    isBorderLine(row, column){        
        if (this.isHorizontal()) {
            const firstCharId = parseInt(this.id[0]);
            return (firstCharId === 1 || firstCharId === row);
        } else {
            const secondCharId = parseInt(this.id[2]);            
            return (secondCharId === 1 || secondCharId === column);
        }               
    };
}
class Result {
    constructor(grid, players){
        this.grid = grid;
        this.players = players; //array
    };
    getGridSize(){
        const gridSize = [];
        gridSize.push(this.grid.getRow());
        gridSize.push(this.grid.getColumn());

        return gridSize;
    };
    getPlayerName(playerNumber){
        if (playerNumber <= this.players.length && playerNumber >0) {
            return this.players[playerNumber-1].getName();
        }
    };
    getPlayerPoints(playerNumber){
        if (playerNumber <= this.players.length && playerNumber >0) {
            return this.players[playerNumber-1].getPoints();
        }
    };
}
const gameBoard = new GameBoard();

//Manipulating the DOM functions.
function updateInstructionsGameGridIsFull(results){
    //show wireframe e & update closed boxes on screen.    
    const playerX_h2 = document.getElementById('player_in_turn');
    playerX_h2.style.color = "black";
    playerX_h2.innerHTML = results;
    
    //remove <p>
    const p = document.getElementsByTagName('p');
    p[0].remove();

    //Add a division with two buttons (Play & Restart) to div's class instructions.
    const instructions_div = document.getElementsByClassName('instructions');
    
    const btns_div = document.createElement('div');
    btns_div.className = "btns_div";
    instructions_div[0].append(btns_div);

    const play_btn = document.createElement('button');
    const restart_btn = document.createElement('button');
    play_btn.setAttribute('id', 'play-btn');
    play_btn.innerHTML = "Play";  
    play_btn.addEventListener('click', playAgain);

    restart_btn.setAttribute('id', 'restart-btn');
    restart_btn.innerHTML = "Restart";
    
    btns_div.append(restart_btn);
    btns_div.append(play_btn);
    
    const body = document.querySelector('body');
    const footer = document.createElement('footer');
    footer.style.backgroundColor = "black";
    body.append(footer);

    const results_h2 = document.createElement('h2');
    results_h2.innerHTML = "Show results";
    results_h2.style.textDecoration = "underline";
    footer.append(results_h2);
    

    //Play, show initial three grids types to keep playing. Requirement: preserve 
    // status of current grid size and results with player's names.

    //Restart. Reset game status to its original state.

    // Add a section at the bottom to show a link: "Results section"
    // Style: background color: black
}
function playAgain(e){
    const body_tags = document.getElementsByTagName('body');
    const body_element = body_tags[0];   
    const children = body_element.children;    

    for (let i = 1; i < children.length; i++) {
        children[i].remove();        
    }
    const grid3_table = document.getElementsByClassName('grid3_table');
    grid3_table[0].remove();

    const main_sec = document.createElement('section');
    main_sec.className = "main";
    body_element.appendChild(main_sec);
    
    const grids_div = document.createElement('div');
    grids_div.className = "grid-size";
    grids_div.style.marginTop = "20px";
    grids_div.style.marginBottom = "100px";
    main_sec.appendChild(grids_div);

    const instructions_h2 = document.createElement('h2');
    instructions_h2.innerHTML = "Select size of grid:";    
    grids_div.appendChild(instructions_h2);

    for (let i = 3; i <= 5; i++) {
        const size_div = document.createElement('div');
        size_div.className = "grid";
        size_div.setAttribute('id', `x${i}`);
        size_div.innerHTML = `${i}x${i}`;
        size_div.addEventListener('click',setGrid);
        grids_div.appendChild(size_div);
    }    
}
function updateInstructionsPlayerClosedBox(closedBoxes){
   // alert('Dom');
    for (let i = 0; i < closedBoxes.length; i++) {
        const playerX_h2 = document.getElementById('player_in_turn');
        playerX_h2.style.color = gameBoard.players[gameBoard.playerTurn].getColor();
        playerX_h2.innerHTML = gameBoard.players[gameBoard.getPlayerTurn()].getName();
    
        const p = document.getElementsByTagName('p');
        p[0].innerHTML = 'closed a Box and is your turn to play!';
        
        const box = document.getElementById(closedBoxes[i].getId());
        const boxWinner = closedBoxes[i].getOwnerPlayer();
        box.innerHTML = boxWinner.getName();
        box.style.color = boxWinner.getColor();
        box.style.justifyContent = 'center';

        console.log(`${boxWinner.getName()} has: ${boxWinner.getPoints()} points!`);
    }
    //if grid is full
    const isFull = gameBoard.grid[gameBoard.grid.length-1].isFull();
    if (isFull) {
        gameBoard.showResults();
    }
};
function updateInstructionsPlayerInTurn(){
    const playerX_h2 = document.getElementById('player_in_turn');
    
    playerX_h2.style.color = gameBoard.players[gameBoard.playerTurn].getColor();
    playerX_h2.innerHTML = gameBoard.players[gameBoard.getPlayerTurn()].getName();

    const p = document.getElementsByTagName('p');
    p[0].innerHTML = 'is your turn to play!';
};
function setPlayer(e) {    
    let player = new Player(e.target.value);
    const playerNumber = e.target.placeholder;

    if (playerNumber === 'Player 1') {
        player.setColor('blue');
        document.getElementById('player1').removeEventListener('input', setPlayer);
    }else{
        player.setColor('green');
        document.getElementById('player2').removeEventListener('input', setPlayer);
    }    
    gameBoard.setPlayer(player);    
};
function setGrid(e){
    const gridSize = parseInt(e.target.id.charAt(e.target.id.length-1));
    const grid = new Grid(gridSize, gridSize);
        
    gameBoard.setGrid(grid);
    alert('abut to reset Points');
    gameBoard.resetPoints();  
    
    if (gameBoard.players.length < 2) {
        if (gameBoard.players.length === 0) {
            let player1 = new Player("Player 1");
            let player2 = new Player("Player 2");
            
            player1.setColor('blue');
            player2.setColor('green');
            gameBoard.setPlayer(player1);
            gameBoard.setPlayer(player2);
        } else {
            let player2 = new Player("Player 2");
            player2.setColor('red');        
            gameBoard.setPlayer(player2);
        }
    }   
    //update screen to wireframe b.    
    //setPayer's turn:
    gameBoard.setPlayerTurn(1);
    const main = document.getElementsByClassName('main');
    for (let i = 0; i < main.length; i++) {
        main[i].remove();                
    }
    const instructions_div = document.createElement('div');
    instructions_div.className = 'instructions';
    const playerX_h2 = document.createElement('h2');
    playerX_h2.setAttribute('id', 'player_in_turn');
    playerX_h2.style.color = gameBoard.players[gameBoard.playerTurn].getColor();
    playerX_h2.innerHTML = gameBoard.players[gameBoard.getPlayerTurn()].getName();
    instructions_div.appendChild(playerX_h2);

    const instruction_p = document.createElement('p');
    instruction_p.innerHTML = "Is your turn to play!";
    instructions_div.appendChild(instruction_p);
    
    const body = document.querySelector('body');
    body.appendChild(instructions_div);
    
    //create gridTable div
    const grid_table = document.createElement('div');
    if (gridSize === 4) {
        grid_table.style.height = "190px";
        grid_table.style.width = "190px";
    }else if (gridSize === 5) {
        grid_table.style.height = "250px";
        grid_table.style.width = "250px";
    }

    grid_table.className = 'grid3_table';
    
    for (let i = 1; i <= gridSize; i++) {
        for (let j = 1; j <= gridSize; j++) {
            //create dot
            const dot_div = document.createElement('div');
            dot_div.className = "dot";
            grid_table.appendChild(dot_div);
            if(j != gridSize){
                //create horizontal line
                const line_horiz_div = document.createElement('div');
                line_horiz_div.className = "horizontal_line"
                line_horiz_div.setAttribute('id',`${i},${j}`);
                line_horiz_div.addEventListener('mouseover', mouseOver);
                line_horiz_div.addEventListener('mouseout', mouseOut);
                line_horiz_div.addEventListener('click', gameBoard_drawLine);
              //  line_horiz_div.innerHTML = `${i},${j}`;
                grid_table.appendChild(line_horiz_div);
            }
        }
        if(i != gridSize){
            for (let k = 1; k <= gridSize; k++) {
                //create vertical line            
                const line_vertical_div = document.createElement('div');
                line_vertical_div.className = "vertical_line";   
                line_vertical_div.setAttribute('id',`${i},${k}`);
                line_vertical_div.addEventListener('mouseover', mouseOver);
                line_vertical_div.addEventListener('mouseout', mouseOut);
                line_vertical_div.addEventListener('click', gameBoard_drawLine);
               // line_vertical_div.innerHTML = `${i},${k}`;
                grid_table.appendChild(line_vertical_div);

                if(k != gridSize){
                    //create empty box
                    const box = document.createElement('div');
                    box.className = "box";   
                    box.setAttribute('id',`${i},${k}`);
                    //box.innerHTML = `${i},${k}`;
                    grid_table.appendChild(box);
                }
            }
        }
    }  
    //show grid:    
    body.appendChild(grid_table);
};
function mouseOver(e) {
    e.target.classList.add('colored_in');
}
function mouseOut(e) {
    e.target.classList.remove('colored_in');
}
function gameBoard_drawLine(e) {
    e.target.removeEventListener('mouseover', mouseOver);
    e.target.removeEventListener('mouseout', mouseOut);
    e.target.removeEventListener('click', gameBoard_drawLine);   

    const color = gameBoard.players[gameBoard.getPlayerTurn()].getColor();    
    e.target.style.backgroundColor = color;
    
    //line. Player's choice
    const className = e.target.className;
    const lineType = className.substr(0, 8); //horizont or vertical
    const lineId = e.target.id;

    gameBoard.play(lineId, lineType);    
}
window.onload = function(){    
    document.querySelector('#player1').addEventListener('input', setPlayer);
    document.querySelector('#player2').addEventListener('input', setPlayer);  
    document.querySelector('#x3').addEventListener('click', setGrid);
    document.querySelector('#x4').addEventListener('click', setGrid);
    document.querySelector('#x5').addEventListener('click', setGrid);
};