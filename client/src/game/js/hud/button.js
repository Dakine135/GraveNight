const HitBox = require('../../shared/Hitbox.js');
const PIXI = require('pixi.js');

module.exports = class Button {
    constructor({
        hudPixiContainer,
        x = 0,
        y = 0,
        width = 100,
        height = 30,
        click = () => {},
        hover = () => {},
        hoverLeave = () => {},
        label = 'NoLabel',
        shortCutText,
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
        this.shortCutText = shortCutText;
        this.color = color;
        this.labelColor = labelColor;
        this.isActive = false;
        this.isHovered = false;
        this.isClicked = false;
        this.onClickCallback = click;
        this.onHoverCallback = hover;
        this.onHoverLeaveCallback = hoverLeave;

        //pixiStuff
        this.pixiGraphic = new PIXI.Graphics();
        this.pixiGraphic.lineStyle(2, 0xffffff, 1);
        this.pixiGraphic.beginFill(0xaa4f08);
        this.pixiGraphic.drawRect(this.x, this.y, this.width, this.height);
        this.pixiGraphic.endFill();
        // make the button interactive...
        this.pixiGraphic.interactive = true;
        // this.pixiGraphic.buttonMode = true; //makes cursor a hand html style

        this.pixiGraphic
            // .on('pointerdown', (event) => {
            //     console.log('pointerdown');
            // })
            .on('pointerup', (event) => {
                this.onClick();
            })
            // .on('pointerupoutside', (event) => {
            //     console.log('pointerupoutside');
            // })
            .on('pointerover', (event) => {
                this.onHover();
            })
            .on('pointerout', (event) => {
                this.onHoverLeave();
            });
        hudPixiContainer.addChild(this.pixiGraphic);

        //Main Label Text
        this.text = new PIXI.Text(
            this.label,
            new PIXI.TextStyle({
                fontSize: 14
            })
        );
        this.text.x = this.x + 15;
        this.text.y = this.y + this.height / 3;
        hudPixiContainer.addChild(this.text);
        //shortcut Label
        if (this.shortCutText) {
            this.text = new PIXI.Text(
                this.shortCutText,
                new PIXI.TextStyle({
                    fontSize: 14
                })
            );
            this.text.x = this.x + 5;
            this.text.y = this.y + 1;
            hudPixiContainer.addChild(this.text);
        }

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
}; //Button
