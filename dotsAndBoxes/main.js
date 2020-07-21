class GameBoard {
    constructor(){
        this.players = [];
        this.grid = null;
    };
    getPlayers(){
        return this.players;
    }
    setPlayer(player){
        if(this.players.length<2){
            this.players.push(player);            
        }
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
const gameBoard = new GameBoard();

function setPlayer(e) {  
    const playerNumber = e.target.placeholder;
    let player = new Player(e.target.value);

    if (playerNumber === 'Player 1') {
        player.setColor('blue');
    }else{
        player.setColor('green');
    }    
    gameBoard.setPlayer(player);    
};

window.onload = function(){    
    document.querySelector('#player1').addEventListener('input', setPlayer);
    document.querySelector('#player2').addEventListener('input', setPlayer);    
};