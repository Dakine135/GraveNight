import Engine from './js/clientEngine.js';

console.log("index.js loaded in bundle");

var engine = new Engine({

});

function setup(){
}//SETUP

function draw(){
  engine.update();
  engine.draw();
  window.requestAnimationFrame(draw);
}//draw

setup();
draw();