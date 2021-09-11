class Point {
    constructor(x, y, data) {
        this.x = x;
        this.y = y;
        this.userData = data;
    }

    // Pythagoreans: a^2 = b^2 + c^2
    distanceFrom(other) {
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

if (typeof module !== 'undefined') {
    module.exports = Point;
}
