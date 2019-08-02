let canvas = document.getElementById("editor-layer");
let render = canvas.getContext("2d");
let width = window.screen.width;
let height = window.screen.height;
canvas.width = width;
canvas.height = height;
function updateScreen(){
	render.save();
    render.setTransform(1, 0, 0, 1, 0, 0);
    render.clearRect(0, 0, width, height);
    render.beginPath();
    render.restore();

    //render.fillStyle = "red";
    render.fillRect(50, 50, 50, 50);

}

updateScreen();