exports.error = (string) => {
    return new Error(string);
};

function randomColor() {
    return {
        r: Math.floor(255 * Math.random()),
        g: Math.floor(255 * Math.random()),
        b: Math.floor(255 * Math.random())
    };
}
exports.randomColor = randomColor;

exports.midPoint = (point1, point2) => {
    let middleX = point2.x - (point2.x - point2.x) / 2;
    let middleY = point2.y - (point2.y - point1.y) / 2;
    return { x: middleX, y: middleY };
};

exports.rotatePoint = ({ center = { x: 0, y: 0 }, point = { x: 0, y: 0 }, angle = 0 }) => {
    let s = Math.sin(angle);
    let c = Math.cos(angle);

    //make copy
    let newPoint = { x: point.x, y: point.y };

    // translate point back to origin:
    newPoint.x -= center.x;
    newPoint.y -= center.y;

    // rotate point
    let xnew = newPoint.x * c - newPoint.y * s;
    let ynew = newPoint.x * s + newPoint.y * c;

    // translate point back:
    newPoint.x = xnew + center.x;
    newPoint.y = ynew + center.y;
    return newPoint;
};

exports.extendEndPoint = ({ startPoint, endPoint, length }) => {
    let currentlength = Math.sqrt(Math.pow(startPoint.x - endPoint.x, 2.0) + Math.pow(startPoint.y - endPoint.y, 2.0));
    let amount = length - currentlength;
    let newEndPoint = {
        x: endPoint.x + ((endPoint.x - startPoint.x) / currentlength) * amount,
        y: endPoint.y + ((endPoint.y - startPoint.y) / currentlength) * amount
    };
    return newEndPoint;
};

function dist(point1, point2) {
    let diffX = point1.x - point2.x;
    let diffY = point1.y - point2.y;
    return Math.sqrt(diffX * diffX + diffY * diffY);
}
exports.dist = dist;

exports.calculateAngle = ({ point1, point2, centerPoint = { x: 0, y: 0 } }) => {
    if (point1.x === point2.x && point1.y === point2.y) return 0;

    let p1Trans = { x: point1.x - centerPoint.x, y: point1.y - centerPoint.y };
    let p2Trans = { x: point2.x - centerPoint.x, y: point2.y - centerPoint.y };
    // let diffX   = p1Trans.x - p2Trans.x;
    // let diffY   = p1Trans.y - p2Trans.y;
    // var angleRadians = Math.atan2(diffY, diffX);
    let angleOfP1 = Math.atan2(p1Trans.y, p1Trans.x);
    let angleOfP2 = Math.atan2(p2Trans.y, p2Trans.x);
    if (angleOfP1 < 0) angleOfP1 = angleOfP1 + Math.PI * 2;
    if (angleOfP2 < 0) angleOfP2 = angleOfP2 + Math.PI * 2;
    let angleRadians = angleOfP2 - angleOfP1;
    // if(angleRadians < 0) angleRadians = (angleRadians + Math.PI*2);
    return angleRadians;
    // let angleOfP1 = Math.atan2(p1Trans.x, p1Trans.y);
    // let angleOfP2 = Math.atan2(point2.y - centerPoint.y, point2.x - centerPoint.x);
    // if(angleOfP1 < 0) angleOfP1 = angleOfP1 + Math.PI*2;
    // if(angleOfP2 < 0) angleOfP2 = angleOfP2 + Math.PI*2;
    //angle in radians
    // return  angleOfP2 - angleOfP1;
};

exports.mapNum = ({ input, start1, end1, start2, end2 }) => {
    if (input < start1) input = start1;
    else if (input > end1) input = end1;
    let diffRange1 = end1 - start1;
    let fractionOfFirstRange = (input - start1) / diffRange1;
    let diffRange2 = end2 - start2;
    return diffRange2 * fractionOfFirstRange + start2;
};

function cloneObject(obj) {
    //make a new object to return
    let newObj = {};
    //copy all properties onto newobject
    for (var id in obj) {
        let propery = obj[id];
        if (typeof propery === 'object' && propery !== null) {
            newObj[id] = cloneObject(propery);
        }
        if (propery !== null) {
            newObj[id] = propery;
        }
    }
    return newObj;
}
exports.cloneObject = cloneObject;

// function memorySizeOf(obj) {
//     var bytes = 0;

//     function sizeOf(obj) {
//         if (obj !== null && obj !== undefined) {
//             switch (typeof obj) {
//                 case 'number':
//                     bytes += 8;
//                     break;
//                 case 'string':
//                     bytes += obj.length * 2;
//                     break;
//                 case 'boolean':
//                     bytes += 4;
//                     break;
//                 case 'object':
//                     var objClass = Object.prototype.toString.call(obj).slice(8, -1);
//                     if (objClass === 'Object' || objClass === 'Array') {
//                         for (var key in obj) {
//                             if (!obj.hasOwnProperty(key)) continue;
//                             sizeOf(obj[key]);
//                         }
//                     } else bytes += obj.toString().length * 2;
//                     break;
//             }
//         }
//         return bytes;
//     }

//     function formatByteSize(bytes) {
//         if (bytes < 1024) return bytes + ' bytes';
//         else if (bytes < 1048576) return (bytes / 1024).toFixed(3) + ' KiB';
//         else if (bytes < 1073741824) return (bytes / 1048576).toFixed(3) + ' MiB';
//         else return (bytes / 1073741824).toFixed(3) + ' GiB';
//     }

//     return formatByteSize(sizeOf(obj));
// } //memorySizeOf
// exports.memorySizeOf = memorySizeOf;
