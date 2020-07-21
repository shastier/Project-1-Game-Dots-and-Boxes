class GameBoard {
    constructor(){
        this.players = [];
        this.grid = [];
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
    play(){
        alert("Time to play!");
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
}
class Grid {
    constructor(row, column){
        this.row = row;
        this.column = column;
        this.boxes = [];
        this.lastNumBoxes = 0;
    };
    getRow(){
        return this.row;
    };
    getColumn(){
        return this.column;
    };
    drawLine(player){
        alert('Draw Line');
        // if there is a new box, addBox
    };
    getNewBox(){
        if(this.boxes.length === this.lastNumBoxes){
            return null;
        }else{
            this.lastNumBoxes ++;
            return this.boxes[this.boxes.length-1];
        }
    };
    getBoxes(){
        return this.boxes;
    };
}
class Box {

}
const gameBoard = new GameBoard();

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
    const main = document.getElementsByClassName('main');
    for (let i = 0; i < main.length; i++) {
        main[i].remove();                
    }
    const instructions_div = document.createElement('div');
    instructions_div.className = 'instructions';
    const playerX_h2 = document.createElement('h2');
    playerX_h2.setAttribute('id', 'player1');
    playerX_h2.innerHTML = gameBoard.players[0].getName();
    instructions_div.appendChild(playerX_h2);

    const instruction_p = document.createElement('p');
    instruction_p.innerHTML = "Is your turn to play!";
    instructions_div.appendChild(instruction_p);
    
    const body = document.querySelector('body');
    body.appendChild(instructions_div);
    
    //create gridTable div
    const grid3_table = document.createElement('div');
    grid3_table.className = 'grid3_table';
    
    for (let i = 1; i <= 3; i++) {
        for (let j = 1; j <= 3; j++) {
            //create dot
            const dot_div = document.createElement('div');
            dot_div.className = "dot";
            grid3_table.appendChild(dot_div);
            if(j != 3){
                //create horizontal line
                const line_horiz_div = document.createElement('div');
                line_horiz_div.className = "horizontal_line"
                line_horiz_div.setAttribute('id',`${i},${j}`);
                line_horiz_div.innerHTML = `${i},${j}`;
                grid3_table.appendChild(line_horiz_div);
            }
        }
        if(i != 3){
            for (let k = 1; k <= 3; k++) {
                //create vertical line            
                const line_vertical_div = document.createElement('div');
                line_vertical_div.className = "vertical_line";   
                line_vertical_div.setAttribute('id',`${i},${k}`);
                line_vertical_div.innerHTML = `${i},${k}`;
                grid3_table.appendChild(line_vertical_div);
            }
        }
    }  
    //show grid:
    body.appendChild(grid3_table);
};
window.onload = function(){    
    document.querySelector('#player1').addEventListener('input', setPlayer);
    document.querySelector('#player2').addEventListener('input', setPlayer);  
    document.querySelector('#x3').addEventListener('click', setGrid);
    document.querySelector('#x4').addEventListener('click', setGrid);
    document.querySelector('#x5').addEventListener('click', setGrid);
};