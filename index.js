// Set up the canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let frameCount = 0;

let paused = true;

function togglePause() {
  if (!paused) {
    paused = true;
    button.textContent = 'Play';
  } else if (paused) {
    paused = false;
    button.textContent = 'Pause';
  }
}

function addFrameCount(){  
  const frameCountElement = document.createElement('p');
frameCountElement.id = 'frame-count';
frameCountElement.textContent = `Frame count: ${frameCount}`;

const oldFrameCountElement = document.getElementById('frame-count');
if (oldFrameCountElement) {
  oldFrameCountElement.remove();
}

document.body.appendChild(frameCountElement);
}

const button = document.createElement('button');
button.textContent = 'Play';
button.addEventListener('click', togglePause);
document.body.appendChild(button);

const button2 = document.createElement('button');
button2.textContent = 'Next Frame';
button2.addEventListener('click', () => {
  grid = nextGen(grid);
  render(grid);
});
document.body.appendChild(button2);


// Set the size of the cells
const resolution = 20;
canvas.width = 600;
canvas.height = 600;

// Create a 2D array to store the state of each cell
function buildGrid() {
 
   return new Array(canvas.width / resolution).fill(null)
     .map(() => new Array(canvas.height / resolution).fill(null)
       .map(() => Math.floor(Math.random() * 2)));
}

let grid = buildGrid();

requestAnimationFrame(update);

function update() {

  if (!paused){grid = nextGen(grid);
    render(grid);
    
  }
  requestAnimationFrame(update);
  }



function nextGen(grid) {
  frameCount++;
  
  const nextGen = grid.map(arr => [...arr]);

  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      const cell = grid[col][row];
      let numNeighbors = 0;
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          if (i === 0 && j === 0) {
            continue;
          }
          const x_cell = col + i;
          const y_cell = row + j;

          if (x_cell >= 0 && y_cell >= 0 && x_cell < grid.length && y_cell < grid[col].length) {
            const currentNeighbor = grid[col + i][row + j];
            numNeighbors += currentNeighbor;
          }
        }
      }

      // Rules of Life
      if (cell === 1 && numNeighbors < 2) {
        nextGen[col][row] = 0;
      } else if (cell === 1 && numNeighbors > 3) {
        nextGen[col][row] = 0;
      } else if (cell === 0 && numNeighbors === 3) {
        nextGen[col][row] = 1;
      }
    }
  }

return nextGen;
}

function blankGrid() {
  return new Array(canvas.width / resolution).fill(null)
    .map(() => new Array(canvas.height / resolution).fill(0));
}

function render(grid) {
ctx.clearRect(0,0,canvas.width,canvas.height);
for(let col=0;col<grid.length;col++){
for(let row=0;row<grid[col].length;row++){
const cell=grid[col][row];

ctx.beginPath();
ctx.rect(col*resolution,row*resolution,resolution,resolution);
ctx.fillStyle=cell?'black':'white';
ctx.fill();
ctx.stroke();
}
}
addFrameCount();
}

const cells = document.querySelectorAll('canvas');
cells.forEach(cell => {
  cell.addEventListener('click', (event) => {
    const col = Math.floor(event.offsetX / resolution);
    const row = Math.floor(event.offsetY / resolution);
    console.log(grid[col][row])
    
    if (grid[col][row]===1){
      grid[col][row]=0
    } else if (grid[col][row]===0){
      grid[col][row]=1
    }
    
    //grid[col][row] = !grid[col][row]; // toggle the value of the cell
    
    
    
    render(grid); // redraw the grid
   // console.log(`Cell clicked: (${col}, ${row})`);
  });
});


const clearButton = document.createElement('button');
clearButton.textContent = 'Clear grid';
clearButton.addEventListener('click', function(){
  frameCount = 0;
grid = blankGrid();
render(grid)
});
document.body.appendChild(clearButton);
