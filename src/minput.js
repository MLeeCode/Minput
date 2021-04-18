// Transformation
class Mtransform {

    groupPositionOffset(meshObject) {
        /* 
         * If the group is moved from position
         * Add to mesh
         */
        meshObject.position.x = this.group.position.x;
        meshObject.position.y = this.group.position.y;
        meshObject.position.z = this.group.position.z;
        return meshObject;
    }

    positionX(value) {
        value = parseFloat(value);
        this.group.position.x = value;
    }

    positionY(value) {
        value = parseFloat(value);
        this.group.position.y = value;
    }

    positionZ(value) {
        value = parseFloat(value);
        this.group.position.z = value;
    }

    position(vector) {
        this.positionX(vector.x);
        this.positionY(vector.y);
        this.positionZ(vector.z);
    }

    translateX(value) {
        value = parseFloat(value);
        this.group.translateX = value;
    }

    translateY(value) {
        value = parseFloat(value);
        this.group.translateY = value;
    }

    translateZ(value) {
        value = parseFloat(value);
        this.group.translateZ = value;
    }

    translate(vector) {
        this.translateX(vector.x);
        this.translateY(vector.y);
        this.translateZ(vector.z);
    }

    scaleX(value) {
        value = parseFloat(value);
        this.group.scale.x = value;
    }

    scaleY(value) {
        value = parseFloat(value);
        this.group.scale.y = value;
    }

    scaleZ(value) {
        value = parseFloat(value);
        this.group.scale.z = value;
    }

    scale(vector) {
        this.scaleX(vector.x);
        this.scaleY(vector.y);
        this.scaleZ(vector.z);
    }

    rotateX(value) {
        value = parseFloat(value);
        this.group.rotation.x = value;
    }

    rotateY(value) {
        value = parseFloat(value);
        this.group.rotation.y = value;
    }

    rotateZ(value) {
        value = parseFloat(value);
        this.group.rotation.z = value;
    }

    rotate(vector) {
        this.rotateX(vector.x);
        this.rotateY(vector.y);
        this.rotateZ(vector.z);
    }
}

// Base Object Class
class Mobject extends Mtransform {
    mesh;
    shape;
    geometry;
    border;
    group;
    material;
    vertices;
    color;
    strokeColor;
    strokeWidth;

    constructor(vertices, { color = 0x000, strokeColor = 0x000, strokeWidth = 0.01, createInstance = true } = {}) {
        super();
        this.vertices = vertices;
        this.color = color;
        this.strokeColor = strokeColor;
        this.strokeWidth = strokeWidth;
        if (createInstance) {
            this.create();
        }
    }

    setColor(color) {
        this.color = color;
        this.material.color = new THREE.Color(color);
    }

    createGeometry(shape) {
        return new THREE.ShapeGeometry(shape);
    }

    createBorder() {
        var borderVerts = this.vertices;
        borderVerts.push(borderVerts[0])
        var line = new MeshLine();
        line.setPoints(borderVerts, p => this.strokeWidth);
        var material = new MeshLineMaterial({ color: this.strokeColor, sizeAttenuation: 1 });
        this.border = new THREE.Mesh(line, material);
        return this.border;
    }

    create(addToScene = true, border = true, meshMaterial = THREE.MeshBasicMaterial) {
        this.shape = new THREE.Shape(this.vertices);
        this.geometry = this.createGeometry(this.shape);
        this.material = new meshMaterial({ color: this.color });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.group = new THREE.Group();
        this.group.add(this.mesh);
        if (border) {
            this.border = this.createBorder();
            this.group.add(this.border);
        }
        if (addToScene) {
            scene.add(this.group);
        }
        return this.group;
    }

    update() {
        var shape = new THREE.Shape(this.vertices);
        this.geometry = this.createGeometry(shape);

        var newBorder = this.createBorder();
        this.border.geometry = newBorder.geometry;

        this.geometry.attributes.position.needsUpdate = true;
        this.border.geometry.attributes.position.needsUpdate = true;
    }
}

// Primitives
class Polygon extends Mobject {

}

class Rectangle extends Polygon {
    constructor(width = 2, height = 1, { color = 0x000, strokeColor = 0x000, strokeWidth = 0.1 } = {}) {
        var halfWidth = width / 2;
        var halfHeight = height / 2;
        var vertices = [
            new THREE.Vector3(-1 * halfWidth, 1 * halfHeight, 0),
            new THREE.Vector3(1 * halfWidth, 1 * halfHeight, 0),
            new THREE.Vector3(1 * halfWidth, -1 * halfHeight, 0),
            new THREE.Vector3(-1 * halfWidth, -1 * halfHeight, 0)
        ]
        super(vertices, { color: color, strokeColor: strokeColor, strokeWidth: strokeWidth });
    }
}

class Square extends Rectangle {
    constructor(size = 1, { color = 0x000, strokeColor = 0x000, strokeWidth = 0.1 } = {}) {
        super(size, size, { color: color, strokeColor: strokeColor, strokeWidth: strokeWidth });
    }
}

class Circle extends Polygon {
    constructor(diameter = 1, steps = 50, { color = 0x000, strokeColor = 0x000, strokeWidth = 0.1 } = {}) {
        var radius = diameter / 2
        var stepDist = Math.PI * 2 / steps;
        var vertices = [];
        for (var i = 0; i < Math.PI * 2; i += stepDist) {
            var v = new THREE.Vector3(Math.cos(i) * radius, Math.sin(i) * radius, 0);
            vertices.push(v);
        }
        super(vertices, { color: color, strokeColor: strokeColor, strokeWidth: strokeWidth });
    }
}

class Triangle extends Polygon {
    constructor(size = 1, { color = 0x000, strokeColor = 0x000, strokeWidth = 0.1 } = {}) {
        var halfSize = size / 2;
        var vertices = [
            new THREE.Vector3(-1 * halfSize, 0, 0),
            new THREE.Vector3(0, size, 0),
            new THREE.Vector3(1 * halfSize, 0, 0),
        ]
        super(vertices, { color: color, strokeColor: strokeColor, strokeWidth: strokeWidth });
    }
}

class Line extends Mobject {
    constructor(startVertex = new THREE.Vector3(-0.5, 0, 0), endVertex = new THREE.Vector3(0.5, 0, 0), { color = 0x000, strokeColor = 0x000, strokeWidth = 0.1 } = {}) {
        var vertices = [startVertex, endVertex];
        super(vertices, { color: strokeColor, strokeColor: strokeColor, strokeWidth: strokeWidth });
        this.startVertex = startVertex;
        this.endVertex = endVertex;
    }

    create(addToScene = true) {
        this.shape = new MeshLine();
        this.shape.setPoints(this.vertices, p => this.strokeWidth);
        this.material = new MeshLineMaterial({ color: this.strokeColor });
        this.mesh = new THREE.Mesh(this.shape, this.material);
        this.geometry = this.mesh.geometry;
        this.group = new THREE.Group();
        this.group.add(this.mesh);
        if (addToScene) {
            scene.add(this.group);
        }
    }
}

// Dom Elements

class Mtext extends Mobject {
    text;
    fontSize;

    constructor(text, { color = 0x000, fontSize = "1em" } = {}) {
        super(null, { color: color, createInstance: false });
        this.text = text;
        this.fontSize = fontSize; 
        this.create();
    }

    create(addToScene = true, border = null, meshMaterial = null) {
        var element = document.createElement('div');
        element.className = 'element';
        element.textContent = this.text;
        element.style.color = this.color;
        element.style.fontSize = this.fontSize;
        
        this.mesh = new CSS2DObject(element);
        this.group = new THREE.Group();
        this.group.add(this.mesh);
        if (addToScene) {
            scene.add(this.group);
        }
        MathJax.typesetPromise();
        return this.group;
    }


}

// Complex Structures

class NumberLine extends Line {
    constructor(minVal = 0, maxVal = 1, width = 1, tickInterval = 1, bigTickInterval=2, labelInterval=2, { flipTicks = false, color = 0x000, strokeColor = 0x000, strokeWidth = 0.05, startLabel=true} = {}) {
        super(new THREE.Vector3(-0.5 * width, 0, 0), new THREE.Vector3(0.5 * width, 0, 0),
            { color: strokeColor, strokeColor: strokeColor, strokeWidth: strokeWidth });
        this.minVal = minVal;
        this.maxVal = maxVal;
        this.tickInterval = tickInterval;
        this.bigTickInterval = bigTickInterval;
        this.labelInterval = labelInterval;
        this.startLabel = startLabel;
        this.flipTicks = flipTicks;
        this.createTicks();
    }

    addTick(vertex, size = 0.05, strokeWidthMultiplier = 1) {

        var v2 = vertex.clone();
        v2.y -= size
        if (this.flipTicks) {
            v2.y *= -1;
            vertex.y -= this.strokeWidth / 2 - 0.005;
        } else {
            vertex.y += this.strokeWidth / 2 - 0.005;
        }
        var tick = new Line(vertex, v2,
            { color: this.color, strokeColor: this.strokeColor, strokeWidth: this.strokeWidth * strokeWidthMultiplier });
        return tick;
    }

    addLabel(text, vertex, size = "0.75em") {
        var t = new Mtext(text, { fontSize: size, color: this.color});
        t.position(vertex);
        if (this.flipTicks) {
            t.positionY(0.23);
        } else {
            t.positionY(-0.23);
        }
        return t;
    }

    createTicks() {
        var labels = new THREE.Group();
        var tickLines = new THREE.Group();
        var tickNum = Math.floor((this.maxVal - this.minVal) / this.tickInterval);
        var startCap = this.addTick(this.startVertex, 0.1, 1);
        tickLines.add(startCap.group);

        if (this.startLabel) {
            labels.add(this.addLabel("$$" + this.minVal + "$$", this.startVertex).group);
        }

        for (var i = 0; i < tickNum; i++) {
            var size = 0.05;
            if (i % this.bigTickInterval == 0) {
                size = size * 2;
            }
            
            var tick = i + this.minVal;
            var position = this.p2l(tick);

            if (i % this.labelInterval == 0) {
                if (i == 0 && this.startLabel || i > 0) {
                    var t = this.addLabel("$$" + (i + this.minVal) + "$$", position);
                    labels.add(t.group);
                } 
                
            }
            
            var tickLine = this.addTick(position, size);
            tickLines.add(tickLine.group);
        }
        var endCap = this.addTick(this.endVertex, 0.1, 1);
        tickLines.add(endCap.group);
        this.group.add(tickLines);
        this.group.add(labels);
    }

    pointToLine(x) {
        var alpha = getInterpolateAlpha(this.minVal, this.maxVal, x);
        //console.log(alpha);
        var vec = linearInterpolateVectors(this.startVertex, this.endVertex, alpha);
        vec.applyAxisAngle(new THREE.Vector3(0, 0, 1), this.group.rotation.z);
        vec.add(this.group.position);
        return vec;
    }

    p2l(x) {
        return this.pointToLine(x);
    }
}

class Axis2D extends Mtransform {
    constructor(
        xMin = 0,
        xMax = 1,
        yMin = 0,
        yMax = 1,
        xWidth = 3,
        yHeight = 3,
        xTickInterval = 1,
        yTickInterval = 1,
        { color = 0x000, strokeColor = 0x888888, strokeWidth = 0.03 } = {}
    ) {
        super();
        this.xMin = xMin;
        this.xMax = xMax;
        this.yMin = yMin;
        this.yMax = yMax;
        this.xWidth = xWidth;
        this.yHeight = yHeight;
        this.xTickInterval = xTickInterval;
        this.yTickInterval = yTickInterval;
        this.color = color;
        this.strokeColor = strokeColor;
        this.strokeWidth = strokeWidth;
        this.createAxis();
    }

    createAxis() {
        var startLabel = !(this.xMin == this.yMin);

        this.xAxis = new NumberLine(this.xMin, this.xMax, this.xWidth, this.xTickInterval, 2, 2,
            { color: this.color, strokeColor: this.strokeColor, strokeWidth: this.strokeWidth, startLabel: startLabel });
        this.yAxis = new NumberLine(this.yMin, this.yMax, this.yHeight, this.yTickInterval, 2, 2,
            { color: this.color, strokeColor: this.strokeColor, strokeWidth: this.strokeWidth, flipTicks: true, startLabel: startLabel });


        this.yAxis.rotateZ(Math.PI / 2);
        this.xAxis.group.translateX(this.xWidth / 2);
        this.yAxis.group.translateX(this.yHeight / 2);
        this.group = new THREE.Group();
        this.group.add(this.xAxis.group);
        this.group.add(this.yAxis.group);

        if (!startLabel) {
            var t = new Mtext("$$" + this.xMin + "$$", { fontSize: "0.75em", color: this.color });
            t.position(this.xAxis.startVertex);
            t.positionY(-0.23);
            t.positionX(-0.23);
            this.group.add(t.group);
        }

        scene.add(this.group);
    }

    pointToLine(x, y) {
        var vecX = this.xAxis.p2l(x);
        var vecY = this.yAxis.p2l(y);
        var vec = vecX.add(vecY);
        vec.applyAxisAngle(new THREE.Vector3(0, 0, 1), this.group.rotation.z);
        vec.add(this.group.position);

        return vec;
    }

    p2l(x, y) {
        return this.pointToLine(x, y);
    }

    parametricPlot(func, color = 0xaa00aa, width = 0.05, dt = 0.01) {
        var output = [];
        for (var x = this.xMin; x < this.xMax; x += dt) {
            var out = func(x);
            output.push(this.p2l(x, out));
        }
        var shape = new MeshLine();
        shape.setPoints(output, p => width);
        var material = new MeshLineMaterial({ color: color });
        var mesh = new THREE.Mesh(shape, material);
        var group = new THREE.Group();
        group.add(mesh);
        group.position.x -= this.group.position.x;
        group.position.y -= this.group.position.y;
        group.position.z -= this.group.position.z;
        this.group.add(group);
    }
}

// Interpolation Functions

function linearInterpolateVectors(a, b, alpha, interpolation = EasingFunction.linear) {
    a = a.clone();
    b = b.clone();
    alpha = interpolation(alpha);
    return b.multiplyScalar(alpha).add(a.multiplyScalar(1 - alpha));
}

function linearInterpolate(a, b, alpha, interpolation = EasingFunction.linear) {
    alpha = interpolation(alpha);
    return (b - a) * alpha + a;
}

function getInterpolateAlpha(num1, num2, num3) {
    return (num3 - num1) / (num2 - num1);
}

var EasingFunction = {
    // no easing, no acceleration
    linear: t => t,
    // accelerating from zero velocity
    easeInQuad: t => t * t,
    // decelerating to zero velocity
    easeOutQuad: t => t * (2 - t),
    // acceleration until halfway, then deceleration
    easeInOutQuad: t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    // accelerating from zero velocity
    easeInCubic: t => t * t * t,
    // decelerating to zero velocity
    easeOutCubic: t => (--t) * t * t + 1,
    // acceleration until halfway, then deceleration
    easeInOutCubic: t => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    // accelerating from zero velocity
    easeInQuart: t => t * t * t * t,
    // decelerating to zero velocity
    easeOutQuart: t => 1 - (--t) * t * t * t,
    // acceleration until halfway, then deceleration
    easeInOutQuart: t => t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
    // accelerating from zero velocity
    easeInQuint: t => t * t * t * t * t,
    // decelerating to zero velocity
    easeOutQuint: t => 1 + (--t) * t * t * t * t,
    // acceleration until halfway, then deceleration
    easeInOutQuint: t => t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
}
