class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.left = x - w / 2;
        this.right = x + w / 2;
        this.top = y - h / 2;
        this.bottom = y + h / 2;
    }

    contains(point) {
        return this.left <= point.x && point.x <= this.right && this.top <= point.y && point.y <= this.bottom;
    }

    intersects(range) {
        return !(this.right < range.left || range.right < this.left || this.bottom < range.top || range.bottom < this.top);
    }

    subdivide(quadrant) {
        switch (quadrant) {
            case 'ne':
                return new Rectangle(this.x + this.w / 4, this.y - this.h / 4, this.w / 2, this.h / 2);
            case 'nw':
                return new Rectangle(this.x - this.w / 4, this.y - this.h / 4, this.w / 2, this.h / 2);
            case 'se':
                return new Rectangle(this.x + this.w / 4, this.y + this.h / 4, this.w / 2, this.h / 2);
            case 'sw':
                return new Rectangle(this.x - this.w / 4, this.y + this.h / 4, this.w / 2, this.h / 2);
        }
    }

    xDistanceFrom(point) {
        if (this.left <= point.x && point.x <= this.right) {
            return 0;
        }

        return Math.min(Math.abs(point.x - this.left), Math.abs(point.x - this.right));
    }

    yDistanceFrom(point) {
        if (this.top <= point.y && point.y <= this.bottom) {
            return 0;
        }

        return Math.min(Math.abs(point.y - this.top), Math.abs(point.y - this.bottom));
    }

    distanceFrom(point) {
        const dx = this.xDistanceFrom(point);
        const dy = this.yDistanceFrom(point);

        return Math.sqrt(dx * dx + dy * dy);
    }
}

if (typeof module !== 'undefined') {
    module.exports = Rectangle;
}
