document.addEventListener('keydown', directCalculator);
const container = document.querySelector('.container');
const score = document.querySelector('.spanScore')
let gridPositions = [];
let activeClass = 'active';
let inactiveClass = 'inactive';
let headClass = 'head';
let gridClass = 'grid';
let foodClass = 'food';
let snakeBlockSize = 25;
let gridWidth = 750;
let gridHeight = 500;
let gridBorderWidth = 10;
let gridBorderColor = 'black';
let gridTotalPositions = (gridWidth / snakeBlockSize) * (gridHeight / snakeBlockSize);
let gridHorizontalPositions = gridWidth / snakeBlockSize;
let pontuation = 0;

container.style.width = gridWidth + 2 * gridBorderWidth + 'px';
container.style.height = gridHeight + 2 * gridBorderWidth + 'px';
container.style.border = gridBorderWidth + 'px' + ' solid ' + gridBorderColor;

for (let i = 0; i < gridTotalPositions; i++) {
    const div = document.createElement('div');
    div.setAttribute('id', i.toString());
    div.className = gridClass + ' ' + inactiveClass;
    div.style.width = snakeBlockSize + 'px';
    div.style.height = snakeBlockSize + 'px';
    div.style.float = 'left';
    container.appendChild(div);
    gridPositions.push(div);
}

let snake = [];
snake[0] = document.getElementById('0');
snake[1] = document.getElementById('1');
snake[2] = document.getElementById('2');
snake[0].className = activeClass;
snake[1].className = activeClass;
snake[2].className = activeClass;

let headSnake = snake[2];
let gameStatus = 1;
let direction = 'right';
let left = 'left';
let right = 'right';
let up = 'up';
let down = 'down';

for (let i = 3; i < gridTotalPositions; i++) {
    gridPositions.push(document.getElementById(i.toString()));
}

function directCalculator(event) {
    if (gameStatus) {
        let key = event.keyCode;
        let newDirection = undefined;

        if (key == 37) {
            if (!(direction == right)) newDirection = left;
        }
        else if (key == 38) {
            if (!(direction == down)) newDirection = up;
        }
        else if (key == 39) {
            if (!(direction == left)) newDirection = right;
        }
        else if (key == 40) {
            if (!(direction == up)) newDirection = down;
        }
        if (curve(direction, newDirection)) {
            direction = newDirection;
            moveSnake();
        } else if(newDirection){
            direction = newDirection;
        }
    }
}

function curve(x, y) {
    if ((x == up || x == down) && (y == right || y == left)) return true;
    else if ((x == right || x == left) && (y == up || y == down)) return true;
}

function foodGenerator() {
    let random = Math.floor(Math.random() * (gridPositions.length + 1));
    let element = gridPositions[random];

    if (element.classList.contains(gridClass)) {
        element.className = foodClass;
        gridPositions.pop(random);
    } else return (foodGenerator());
}

function newIdHeadCalculator(idHead, direction) {
    if (direction == right) return ++idHead;
    else if (direction == left) return --idHead;
    else if (direction == up) return (idHead - gridHorizontalPositions);
    else if (direction == down) return (idHead + gridHorizontalPositions);
}

function headSnakeCalculator(head, direction) {
    if (head && direction) {
        let idHead = +head.getAttribute('id');
        let newIdHead = newIdHeadCalculator(idHead, direction);
        let horizontalBoard = (newIdHead < 0) || (newIdHead > gridTotalPositions);
        let verticalBoard1 = (direction == right) && (newIdHead % gridHorizontalPositions < idHead % gridHorizontalPositions);
        let verticalBoard2 = (direction == left) && (newIdHead % gridHorizontalPositions > idHead % gridHorizontalPositions);

        if(horizontalBoard || verticalBoard1 || verticalBoard2) headSnake = undefined;
        else {
            let temp = document.getElementById(newIdHead.toString());
            if(!temp.classList.contains(activeClass)) headSnake = temp;
            else headSnake = undefined;
        }
    }
}

function moveSnake() {
    if (headSnake && gameStatus) {
        if (headSnake.classList.contains(foodClass)) {
            headSnake.classList.remove(foodClass);
            pontuation++;
            score.innerText = pontuation;

            foodGenerator();
        } else {
            snake[0].className = gridClass;
            gridPositions.push(snake[0]);
            snake.shift();
        }
        snake[snake.length - 1].classList.remove(headClass);
        headSnake.className = headClass + ' ' + activeClass;
        snake.push(headSnake);
        headSnakeCalculator(headSnake, direction);
    } else {
        document.removeEventListener('keydown', directCalculator);
        snake.forEach(item => item.style.backgroundColor = 'red');
        clearInterval(game);
        gameStatus = 0;
    }
}

foodGenerator()
headSnakeCalculator(headSnake, direction)

let game = setInterval(moveSnake, 100)