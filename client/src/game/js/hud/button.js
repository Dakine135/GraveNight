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
        this.buttonContainer = new PIXI.Container();
        this.buttonContainer.name = `Button ${this.label}`;
        this.buttonContainer.x = this.x;
        this.buttonContainer.y = this.y;
        hudPixiContainer.addChild(this.buttonContainer);

        this.square = new PIXI.Graphics();
        this.square.name = `square ${this.label}`;
        this.square.lineStyle(2, 0xffffff, 1);
        this.square.beginFill(0xaa4f08);
        this.square.drawRect(0, 0, this.width, this.height);
        this.square.endFill();
        // make the button interactive...
        this.square.interactive = true;
        // this.pixiGraphic.buttonMode = true; //makes cursor a hand html style

        this.square
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
        this.buttonContainer.addChild(this.square);

        //Main Label Text
        this.pixiLabel = new PIXI.Text(
            this.label,
            new PIXI.TextStyle({
                fontSize: 14
            })
        );
        this.pixiLabel.name = `label ${this.label}`;
        this.pixiLabel.x = 15;
        this.pixiLabel.y = this.height / 3;
        this.buttonContainer.addChild(this.pixiLabel);
        //shortcut Label
        if (this.shortCutText) {
            this.pixiShortCutText = new PIXI.Text(
                this.shortCutText,
                new PIXI.TextStyle({
                    fontSize: 14
                })
            );
            this.pixiShortCutText.name = `shortcutText ${this.shortCutText}`;
            this.pixiShortCutText.x = 5;
            this.pixiShortCutText.y = 1;
            this.buttonContainer.addChild(this.pixiShortCutText);
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
