const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 900;
canvas.height = 500;

// Define shapes to color with their correct colors
const shapes = [
    { 
        type: 'Triangle', 
        trueColor: 'Cyan', 
        colored: null, 
        points: [{ x: 50, y: 200 }, { x: 150, y: 50 }, { x: 250, y: 200 }], 
        text: 'x + 2 = 2 + x', 
        textX: 150, 
        textY: 180 
    },
    { 
        type: 'Diamond', 
        trueColor: 'Yellow', 
        colored: null, 
        points: [{ x: 450, y: 100 }, { x: 600, y: 200 }, { x: 450, y: 300 }, { x: 300, y: 200 }], 
        text: '(5 + 2) + 3 = 5 + (2 + 3)', 
        textX: 450, 
        textY: 200 
    },
    { 
        type: 'Trapezoid', 
        trueColor: 'Violet', 
        colored: null, 
        points: [{ x: 550, y: 100 }, { x: 850, y: 100 }, { x: 750, y: 200 }, { x: 650, y: 200 }], 
        text: '4 x 1 = 1 x 4 = 4', 
        textX: 700, 
        textY: 150 
    },
    { 
        type: 'Rectangle', 
        trueColor: 'Red', 
        colored: null, 
        x: 10, 
        y: 250, 
        width: 350, 
        height: 200, 
        text: 'For every real numbers x and y, one of the following is true: x = y, x > y or x < y', 
        textX: 200, 
        textY: 300 
    },
    { 
        type: 'Pentagon', 
        trueColor: 'Blue', 
        colored: null, 
        points: [{ x: 500, y: 350 }, { x: 650, y: 275 }, { x: 800, y: 350 }, { x: 775, y: 450 }, { x: 525, y: 450 }], 
        text: 'If x + 3 > y and y > z - 5, then x + 3 > z - r', 
        textX: 650, 
        textY: 375 
    }
];

// Define colors
const colors = ['Cyan',, 'brown', 'Yellow', 'Violet', 'pink', 'Red', 'green', 'orange', 'Blue'];

// Variable to store the selected color
let selectedColor = null;

// Function to draw shapes
function drawShapes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    shapes.forEach((shape) => {
        ctx.beginPath();
        switch (shape.type) {
            case 'Triangle':
                ctx.moveTo(shape.points[0].x, shape.points[0].y);
                ctx.lineTo(shape.points[1].x, shape.points[1].y);
                ctx.lineTo(shape.points[2].x, shape.points[2].y);
                break;
            case 'Diamond':
                ctx.moveTo(shape.points[0].x, shape.points[0].y);
                ctx.lineTo(shape.points[1].x, shape.points[1].y);
                ctx.lineTo(shape.points[2].x, shape.points[2].y);
                ctx.lineTo(shape.points[3].x, shape.points[3].y);
                break;
            case 'Trapezoid':
                ctx.moveTo(shape.points[0].x, shape.points[0].y);
                ctx.lineTo(shape.points[1].x, shape.points[1].y);
                ctx.lineTo(shape.points[2].x, shape.points[2].y);
                ctx.lineTo(shape.points[3].x, shape.points[3].y);
                break;
            case 'Rectangle':
                ctx.rect(shape.x, shape.y, shape.width, shape.height);
                break;
            case 'Pentagon':
                ctx.moveTo(shape.points[0].x, shape.points[0].y);
                for (let i = 1; i < shape.points.length; i++) {
                    ctx.lineTo(shape.points[i].x, shape.points[i].y);
                }
                break;
        }
        ctx.closePath();
        ctx.strokeStyle = 'white';
        ctx.stroke();
        if (shape.colored !== null) {
            ctx.fillStyle = shape.colored;
            ctx.fill();
        }
        // Add text inside the shape
        if (shape.text) {
            ctx.fillStyle = 'white';
            ctx.font = 'bold 25px Arial';
            ctx.textAlign = 'center';
            drawMultilineText(ctx, shape.text, shape.textX, shape.textY, 200); // Call drawMultilineText function
        }
    });
}

// Function to draw multiline text
function drawMultilineText(context, text, x, y, maxWidth) {
    let words = text.split(' ');
    let line = '';
    let lineHeight = context.measureText('M').width * 1.2; // Adjust line height as needed
    let offsetY = 0;

    for (let i = 0; i < words.length; i++) {
        let testLine = line + words[i] + ' ';
        let metrics = context.measureText(testLine);
        let testWidth = metrics.width;
        if (testWidth > maxWidth && i > 0) {
            context.fillText(line, x, y + offsetY);
            line = words[i] + ' ';
            offsetY += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, y + offsetY);
}

// Draw initial shapes
drawShapes();

// Draw color palette
const colorPalette = document.getElementById('colorPalette');
colors.forEach((color) => {
    const colorDiv = document.createElement('div');
    colorDiv.classList.add('color');
    colorDiv.style.backgroundColor = color;
    colorDiv.style.cursor = 'pointer';
    colorPalette.appendChild(colorDiv);

    // Add event listener to each color div
    colorDiv.addEventListener('click', function () {
        selectedColor = color; // Store the selected color
        console.log("Selected color:", selectedColor); // For debugging
    });
});

// Handle mouse down event for coloring shapes
canvas.addEventListener('mousedown', (e) => {
    if (selectedColor !== null) {
        shapes.forEach((shape) => {
            if (isPointInsideShape(e.offsetX, e.offsetY, shape)) {
                shape.colored = selectedColor; // Apply the selected color to the clicked shape
                drawShapes(); // Redraw the shapes with the new colors
            }
        });
    }
});

// Function to check if a point is inside a shape
function isPointInsideShape(x, y, shape) {
    switch (shape.type) {
        case 'Triangle':
        case 'Diamond':
        case 'Trapezoid':
        case 'Pentagon':
            // Check if point is inside polygon using ray casting algorithm
            let inside = false;
            for (let i = 0, j = shape.points.length - 1; i < shape.points.length; j = i++) {
                const xi = shape.points[i].x, yi = shape.points[i].y;
                const xj = shape.points[j].x, yj = shape.points[j].y;
                const intersect = ((yi > y) !== (yj > y)) &&
                    (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                if (intersect) inside = !inside;
            }
            return inside;
        case 'Rectangle':
            // Check if point is inside rectangle
            return x >= shape.x && x <= shape.x + shape.width &&
                y >= shape.y && y <= shape.y + shape.height;
    }
}

// When the submit button is clicked, show the modal
document.getElementById('submitBtn').addEventListener('click', function () {
    let score = calculateScore(); // Function to calculate score
    document.getElementById('scoreText').innerHTML = "Your score: " + score;
    document.getElementById('myModal').style.display = "block";
});

// Close the modal when the close button is clicked
document.getElementsByClassName('close')[0].addEventListener('click', function () {
    retry(); // Call retry function
    document.getElementById('myModal').style.display = "none";
});

// Retry button functionality
document.getElementById('retryBtn').addEventListener('click', function () {
    retry(); // Call retry function
    document.getElementById('myModal').style.display = "none";
});

// Function to retry the game
function retry() {
    resetGame(); // Function to reset the game
    // Add any additional retry logic here
}

// Function to calculate score (example)
function calculateScore() {
    let score = 0;
    shapes.forEach((shape) => {
        if (shape.colored === shape.trueColor) {
            score++;
        }
    });
    return score;
}

// Function to reset the game (example)
function resetGame() {
    shapes.forEach((shape) => {
        shape.colored = null;
    });
    drawShapes(); // Redraw the shapes
}
