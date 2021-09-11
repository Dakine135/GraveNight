module.exports = class EnergyNode {
    constructor({ x = 0, y = 0, debug = false } = {}) {
        this.x = x;
        this.y = y;
        this.radius = 10;
        this.debug = debug;
        this.color = { r: 255, g: 211, b: 0, a: 1 };

        if (debug) console.log('Created EnergyNode at', this.x, this.y);
    } //constructor

    update(deltaTime) {}

    draw(render, CAMERA, ghost = false) {
        // Start a new drawing state
        render.save();
        render.beginPath();
        let translatedLocation = CAMERA.translate({ x: this.x, y: this.y });
        render.translate(translatedLocation.x, translatedLocation.y);

        //EnergyNode location for debugging
        if (this.debug) {
            render.fillStyle = 'black';
            render.fillText(Math.round(this.x) + ',' + Math.round(this.y), this.radius + 2, this.radius + 2);
        }

        render.fillStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},${ghost ? this.color.a / 2 : this.color.a})`;
        //void ctx.arc(x, y, radius, startAngle, endAngle [, counterclockwise]);
        render.arc(0, 0, this.radius, 0, 2 * Math.PI);
        render.fill();
        render.closePath();
        render.restore(); // Restore original state
    }
}; //end EnergyNode Class
