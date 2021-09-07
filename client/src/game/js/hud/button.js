const HitBox = require('../../shared/Hitbox.js');

module.exports = class Button {
    constructor({
        x = 0,
        y = 0,
        width = 100,
        height = 30,
        click = () => {},
        hover = () => {},
        hoverLeave = () => {},
        label = 'NoLabel',
        color = { r: 255, g: 255, b: 255 },
        labelColor = { r: 100, g: 100, b: 100 },
        debug = false,
        fontSize = 20
    }) {
        this.debug = debug;
        this.fontSize = fontSize;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.label = label;
        this.color = color;
        this.labelColor = labelColor;
        this.isActive = false;
        this.isHovered = false;
        this.isClicked = false;
        this.onClickCallback = click;
        this.onHoverCallback = hover;
        this.onHoverLeaveCallback = hoverLeave;

        console.log('Created Button:', this.label);
        if (this.debug) console.log('Button Debug On');
    } //constructor

    onClick() {
        if (this.debug) {
            console.log(`${this.label} Clicked`);
        }
        this.isClicked = true;
        this.onClickCallback();
    }
    onHover() {
        if (this.debug) {
            console.log(`${this.label} Hovered`);
        }
        this.isHovered = true;
        this.onHoverCallback();
    }
    onHoverLeave() {
        if (this.debug) {
            console.log(`${this.label} HoverLeave`);
        }
        this.isHovered = false;
        this.onHoverLeaveCallback();
    }

    update({ mouseX = 0, mouseY = 0, leftClick = false } = {}) {
        //check if mouse is inside this button
        if (HitBox.collidePointRect({ x: mouseX, y: mouseY }, { rx: this.x, ry: this.y, rw: this.width, rh: this.height })) {
            if (!this.isHovered) this.onHover();
            if (leftClick && !this.isClicked) this.onClick();
            if (!leftClick && this.isClicked) this.isClicked = false;
        } else {
            if (this.isHovered) {
                this.isHovered = false;
                this.isClicked = false;
                this.onHoverLeave();
            }
        }
    }

    draw(render) {
        // Start a new drawing state
        render.save();
        render.beginPath();

        //draw Button body
        render.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.isHovered ? '1' : '0.6'})`;
        render.lineWidth = this.isHovered ? 3 : 1;
        render.strokeStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 1)`;
        render.rect(this.x, this.y, this.width, this.height);
        render.stroke();
        render.fill();

        //Button Label
        render.font = '20px Arial';
        render.fillStyle = `rgba(${this.labelColor.r}, ${this.labelColor.g}, ${this.labelColor.b}, 1)`;
        render.textAlign = 'center';
        render.textBaseline = 'middle';
        //render.measureText(this.label).width
        render.fillText(this.label, this.x + this.width / 2, this.y + this.height / 2, this.width - 10);

        render.closePath();
        render.restore(); // Restore original state
    } //draw
}; //Button
