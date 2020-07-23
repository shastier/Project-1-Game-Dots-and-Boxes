class GameBoard {
    constructor(){
        this.players = [];
        this.grid = [];
        this.playerTurn = 0;
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
        const gameGrid = this.grid[0];
        const player = this.players[this.getPlayerTurn()];                
        player.setChoice(choice); 
        
        gameGrid.drawLine(player);

        //if, no new box was created, setPlayerTurn
        if (gameGrid.getNewBox()=== null) {            
            this.setPlayerTurn(this.getPlayerTurn());
            // update instructions <h2> to updated player in turn.
            updateInstructionsPlayerInTurn();
        } else {
            // grid is full. 
            if (gameGrid.isFull()) {
                //show wireframe e
            } else {
            // show wireframe d.
            // current player keep playing. No need to setPlayerTurn.
            // update <p> "closed a Box and is your turn to play!" on class instructions <div>
            // update current Box's (by id) innerHTML to:  currrent player's name
            // set Box's font color to: current player's color.
            }
        }        
    };
    showResults(){
        alert("Show results");
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
        this.lastNumBoxes = 0;     
    };
    getRow(){
        return this.row;
    };
    getColumn(){
        return this.column;
    };
    drawLine(player){
      //  alert(`Draw Line for ${player.getName()}`);
        const choice = player.getChoice();
        console.log(choice);
        const isBorder = choice.isBorderLine(this.row, this.column);
       // alert(`That line isBorderLine? ${isBorder}`);
        const lineId = choice.getId(); //string Ex. ["2,3"]
        let boxId = "";
        let boxLineSide = "";

        //Get boxID
        // if line is borderLine: only one box will be afected.
        if (isBorder) {            
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
        } else {
           // Line is interior, two boxes will be affected.  
        }
        console.log(`Box ID: ${boxId}, Line Side: ${boxLineSide}`);        
        // find out if the box was already created. add it choiceline.

        // if there is a new box, set up ownerPlayer and addBox 
    };
    getNewBox(){
        if(this.closedBoxes.length === this.lastNumBoxes){
            return null;
        }else{
            this.lastNumBoxes ++;
            return this.closedBoxes[this.closedBoxes.length-1];
        }
    };
    getClosedBoxes(){
        return this.closedBoxes;
    };
    setClosedBoxes(box) {
        if (box.isBoxClosed()) {
            this.closedBoxes.push(box);
            this.lastNumBoxes ++;
        }
    }
    getOpenBoxes() {
        return this.openBoxes;
    }
    setOpenBoxes(box) {
        if (!box.isBoxClosed()) {
            this.openBoxes.push(box);
        }else{
            for (let i = 0; i < this.openBoxes.length; i++) {
                if (this.openBoxes[i].getId() === box.getId()) {
                    this.openBoxes.splice(i,i+1);
                }                
            }     
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
const gameBoard = new GameBoard();

//Manipulating the DOM functions.
function updateInstructionsPlayerInTurn(){
    const playerX_h2 = document.getElementById('player_in_turn');
    
    playerX_h2.style.color = gameBoard.players[gameBoard.playerTurn].getColor();
    playerX_h2.innerHTML = gameBoard.players[gameBoard.getPlayerTurn()].getName();
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