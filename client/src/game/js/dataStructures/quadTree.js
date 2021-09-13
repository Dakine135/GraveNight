const Rectangle = require('./rectangle');

class QuadTree {
    constructor(boundary, capacity) {
        if (!boundary) {
            throw TypeError('boundary is null or undefined');
        }
        if (!(boundary instanceof Rectangle)) {
            throw TypeError('boundary should be a Rectangle');
        }
        if (typeof capacity !== 'number') {
            throw TypeError(`capacity should be a number but is a ${typeof capacity}`);
        }
        if (capacity < 1) {
            throw RangeError('capacity must be greater than 0');
        }
        this.boundary = boundary;
        this.capacity = capacity;
        this.points = [];
        this.divided = false;
    }

    get children() {
        if (this.divided) {
            return [this.northeast, this.northwest, this.southeast, this.southwest];
        } else {
            return [];
        }
    }

    static create() {
        let DEFAULT_CAPACITY = 8;
        if (arguments.length === 0) {
            if (typeof width === 'undefined') {
                throw new TypeError('No global width defined');
            }
            if (typeof height === 'undefined') {
                throw new TypeError('No global height defined');
            }
            let bounds = new Rectangle(width / 2, height / 2, width, height);
            return new QuadTree(bounds, DEFAULT_CAPACITY);
        }
        if (arguments[0] instanceof Rectangle) {
            let capacity = arguments[1] || DEFAULT_CAPACITY;
            return new QuadTree(arguments[0], capacity);
        }
        if (typeof arguments[0] === 'number' && typeof arguments[1] === 'number' && typeof arguments[2] === 'number' && typeof arguments[3] === 'number') {
            let capacity = arguments[4] || DEFAULT_CAPACITY;
            return new QuadTree(new Rectangle(arguments[0], arguments[1], arguments[2], arguments[3]), capacity);
        }
        throw new TypeError('Invalid parameters');
    }

    toJSON(isChild) {
        let obj = { points: this.points };
        if (this.divided) {
            if (this.northeast.points.length > 0) {
                obj.ne = this.northeast.toJSON(true);
            }
            if (this.northwest.points.length > 0) {
                obj.nw = this.northwest.toJSON(true);
            }
            if (this.southeast.points.length > 0) {
                obj.se = this.southeast.toJSON(true);
            }
            if (this.southwest.points.length > 0) {
                obj.sw = this.southwest.toJSON(true);
            }
        }
        if (!isChild) {
            obj.capacity = this.capacity;
            obj.x = this.boundary.x;
            obj.y = this.boundary.y;
            obj.w = this.boundary.w;
            obj.h = this.boundary.h;
        }
        return obj;
    }

    static fromJSON(obj, x, y, w, h, capacity) {
        if (typeof x === 'undefined') {
            if ('x' in obj) {
                x = obj.x;
                y = obj.y;
                w = obj.w;
                h = obj.h;
                capacity = obj.capacity;
            } else {
                throw TypeError('JSON missing boundary information');
            }
        }
        let qt = new QuadTree(new Rectangle(x, y, w, h), capacity);
        qt.points = obj.points;
        if ('ne' in obj || 'nw' in obj || 'se' in obj || 'sw' in obj) {
            let x = qt.boundary.x;
            let y = qt.boundary.y;
            let w = qt.boundary.w / 2;
            let h = qt.boundary.h / 2;

            if ('ne' in obj) {
                qt.northeast = QuadTree.fromJSON(obj.ne, x + w / 2, y - h / 2, w, h, capacity);
            } else {
                qt.northeast = new QuadTree(qt.boundary.subdivide('ne'), capacity);
            }
            if ('nw' in obj) {
                qt.northwest = QuadTree.fromJSON(obj.nw, x - w / 2, y - h / 2, w, h, capacity);
            } else {
                qt.northwest = new QuadTree(qt.boundary.subdivide('nw'), capacity);
            }
            if ('se' in obj) {
                qt.southeast = QuadTree.fromJSON(obj.se, x + w / 2, y + h / 2, w, h, capacity);
            } else {
                qt.southeast = new QuadTree(qt.boundary.subdivide('se'), capacity);
            }
            if ('sw' in obj) {
                qt.southwest = QuadTree.fromJSON(obj.sw, x - w / 2, y + h / 2, w, h, capacity);
            } else {
                qt.southwest = new QuadTree(qt.boundary.subdivide('sw'), capacity);
            }

            qt.divided = true;
        }
        return qt;
    }

    subdivide() {
        this.northeast = new QuadTree(this.boundary.subdivide('ne'), this.capacity);
        this.northwest = new QuadTree(this.boundary.subdivide('nw'), this.capacity);
        this.southeast = new QuadTree(this.boundary.subdivide('se'), this.capacity);
        this.southwest = new QuadTree(this.boundary.subdivide('sw'), this.capacity);

        this.divided = true;
    }

    insert(point) {
        if (!this.boundary.contains(point)) {
            return false;
        }

        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        }

        if (!this.divided) {
            this.subdivide();
        }

        return this.northeast.insert(point) || this.northwest.insert(point) || this.southeast.insert(point) || this.southwest.insert(point);
    }

    query(range, found) {
        if (!found) {
            found = [];
        }

        if (!range.intersects(this.boundary)) {
            return found;
        }

        for (let p of this.points) {
            if (range.contains(p)) {
                found.push(p);
            }
        }
        if (this.divided) {
            this.northwest.query(range, found);
            this.northeast.query(range, found);
            this.southwest.query(range, found);
            this.southeast.query(range, found);
        }

        return found;
    }

    closest(searchPoint, maxCount = 1, maxDistance = Infinity) {
        if (typeof searchPoint === 'undefined') {
            throw TypeError("Method 'closest' needs a point");
        }

        return this.kNearest(searchPoint, maxCount, maxDistance, 0, 0).found;
    }

    kNearest(searchPoint, maxCount, maxDistance, furthestDistance, foundSoFar) {
        let found = [];

        this.children
            .sort((a, b) => a.boundary.distanceFrom(searchPoint) - b.boundary.distanceFrom(searchPoint))
            .forEach((child) => {
                const distance = child.boundary.distanceFrom(searchPoint);
                if (distance > maxDistance) {
                    return;
                } else if (foundSoFar < maxCount || distance < furthestDistance) {
                    const result = child.kNearest(searchPoint, maxCount, maxDistance, furthestDistance, foundSoFar);
                    const childPoints = result.found;
                    found = found.concat(childPoints);
                    foundSoFar += childPoints.length;
                    furthestDistance = result.furthestDistance;
                }
            });

        this.points
            .sort((a, b) => a.distanceFrom(searchPoint) - b.distanceFrom(searchPoint))
            .forEach((p) => {
                const distance = p.distanceFrom(searchPoint);
                if (distance > maxDistance) {
                    return;
                } else if (foundSoFar < maxCount || distance < furthestDistance) {
                    found.push(p);
                    furthestDistance = Math.max(distance, furthestDistance);
                    foundSoFar++;
                }
            });

        return {
            found: found.sort((a, b) => a.distanceFrom(searchPoint) - b.distanceFrom(searchPoint)).slice(0, maxCount),
            furthestDistance
        };
    }

    forEach(fn) {
        this.points.forEach(fn);
        if (this.divided) {
            this.northeast.forEach(fn);
            this.northwest.forEach(fn);
            this.southeast.forEach(fn);
            this.southwest.forEach(fn);
        }
    }

    merge(other, capacity) {
        let left = Math.min(this.boundary.left, other.boundary.left);
        let right = Math.max(this.boundary.right, other.boundary.right);
        let top = Math.min(this.boundary.top, other.boundary.top);
        let bottom = Math.max(this.boundary.bottom, other.boundary.bottom);
        let height = bottom - top;
        let width = right - left;
        let midX = left + width / 2;
        let midY = top + height / 2;
        let boundary = new Rectangle(midX, midY, width, height);
        let result = new QuadTree(boundary, capacity);
        this.forEach((point) => result.insert(point));
        other.forEach((point) => result.insert(point));

        return result;
    }

    get length() {
        let count = this.points.length;
        if (this.divided) {
            count += this.northwest.length;
            count += this.northeast.length;
            count += this.southwest.length;
            count += this.southeast.length;
        }
        return count;
    }
}

if (typeof module !== 'undefined') {
    module.exports = QuadTree;
}
