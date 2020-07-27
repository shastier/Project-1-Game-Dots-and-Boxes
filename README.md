# Project 1: Game Dots and Boxes
Dots and Boxes is a pencil and paper game for two players. It was first published in the 19th century by French mathematician Edouard Lucas. 

## Explanations of the technologies used
JavaScript 88% was the main language to develop the game using DOM(Document Object Model) manipulation to interact with the user.
CSS 7% used for general styling. 
HTML 5% used for basic initial game presentation. 

## Approach taken
Object Oriented Design. "gameBoard" is a variable of type "GameBoard" that handles the interaction between the UI(DOM manipulation in JavaScript) and the game's logic implemented using different classes depending on the required functionalities. GameBoard class has an array of two players, grid and results; each of them are classes. 

The approach taken to represent the grid was to break it down into single pieces such as: dot, vertical line, horizontal line and box. All of them were div HTML tag dinamically created with JavaScript and styled using Flexbox and added 'click' EventListener to interact with the user and collect the information needed to make decisions.
  
## User stories
- a.) Presentation screen design and collect user’s information.
Include brief description section and how to play.
Once all initial information is entered by user, display wireframe b.
- b.) Time to play!
Display selected grid size on screen.
Notify user’s turn to play.
Show line of possible line options on mouse over and mouse out events.
- c.) Other player turn to play.
Update player’s name on page top section.
Use a different color for the next player line choices.
Update board game and got to section b.
Repeat steps b-c until a box is closed.
- d.) Once a box is closed, update top description to show: “Player x closed a Box!”
Display player x initials inside its closed box.
Allow same player to keep playing and selecting a new line. If that includes close a new box, it’s completely correct game’s behavior.
- e.) Once all boxes are closed, display results.
Tied Game.
Player x won!
Give options:
o Play. Will keep counter of current game state. Offer options for grids of different sizes, not necessary the same that was just used.
o Restart. Reset game status to its original state.
- f.) Results section.
Show a table with results for each player and the size of grids used on each game.
Include total points at bottom.
Keep options to play and restart game at top.

## Wireframes
See below link for quick reference.
https://github.com/shastier/Project-1-Game-Dots-and-Boxes/issues

## How-to-use instructions
The game starts with an empty grid of dots, the grid can be of any size between 3x3 dots and up to 5x5 dots preferred. Players will take turns to connect two dots with an horizontal or vertical line, if a player can close a 1x1 box, it earns one point and takes another turn to play. The game ends when no more lines can be placed. The winner will be the player who was able to accumulate more points.

## Unsolved problems
None.

## Features to be included in a later version:
### Screen design:
- Space-between grids sizes.
- Update input event to select complete user's name
- Update label from "red X" to "green checkmark" once the name is entered.
- Change label mark position from top to right side.
- Restart btn: on-mouse-over: change color to "red"
- Play btn: on-mouse-over: change color to "green"
- Improve results section. Show "results table" with better design.
### KeepPlaying
- Set playerTurn to the one who didn't start on previous game.
### Create an app for cell phone.
- Allow two users to play each of them on their cellphone.
### Save results
- Inclue a log-in section and allow user to see their records.
- Being able to sort resutls as needed (by grid size, higher or lower points, players).
