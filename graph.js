container = document.getElementById("viewport");
controlPanel = document.getElementById("controlPanel")
document.body.appendChild(container);

var containerWidth = container.offsetWidth;
var containerHeight = container.offsetHeight;
var controlPanelWidth = controlPanel.offsetWidth;
console.log(controlPanelWidth, containerWidth, containerHeight)

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, (window.innerWidth-controlPanelWidth)/window.innerHeight, 0.001, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( (window.innerWidth-controlPanelWidth), window.innerHeight );
container.appendChild( renderer.domElement );

// Resize the scene whenever the window is resized
window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
    camera.aspect = (window.innerWidth-controlPanelWidth) / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize((window.innerWidth-controlPanelWidth), window.innerHeight)
}

// Create orbital control system (call 'controls.update'.)
var controls = new THREE.OrbitControls(camera, renderer.domElement);

// Create the X, Y, and Z axis.
// Line materials:
var xAxisMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } );
var yAxisMaterial = new THREE.LineBasicMaterial( { color: 0x00ff00 } );
var zAxisMaterial = new THREE.LineBasicMaterial( { color: 0xff0000 } );


// Geometry
var xAxisGeometry = new THREE.Geometry();
xAxisGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
xAxisGeometry.vertices.push(new THREE.Vector3(100, 0, 0));

var yAxisGeometry = new THREE.Geometry();
yAxisGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
yAxisGeometry.vertices.push(new THREE.Vector3(0, 100, 0));

var zAxisGeometry = new THREE.Geometry();
zAxisGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
zAxisGeometry.vertices.push(new THREE.Vector3(0, 0, 100));

// Define the line
var xAxis = new THREE.Line(xAxisGeometry, xAxisMaterial);
scene.add(xAxis);

var yAxis = new THREE.Line(yAxisGeometry, yAxisMaterial);
scene.add(yAxis);

var zAxis = new THREE.Line(zAxisGeometry, zAxisMaterial);
scene.add(zAxis);

// Set the camera position. It's necessary to update the controls every time you change the cameras position.
camera.position.z = 5;
controls.update();

var point = {
    id: 0,
    xPos: 0,
    yPos: 0,
    zPos: 0,
    hidden: false
};

function createPoint(xPos, yPos, zPos) {

    var pointMaterial = new THREE.PointsMaterial( { size: 0.01, color: 0xffffff });
    var pointGeometry = new THREE.Geometry();
    pointGeometry.vertices.push(new THREE.Vector3(xPos, yPos, zPos));
    var point = new THREE.Points(pointGeometry, pointMaterial);
    scene.add(point);

    console.log('id:', point.id, 'X:', xPos, 'Y:', yPos, 'Z:', zPos, 'Hidden:', point.hidden);
}

var func = {
    function: '',
    lowerLim: 0,
    upperLim: 5
};

function inTermsOfY(func) {
    if(func.charAt(0) == 'x' && func.charAt(1) == '=') {
        return true;

        func = func.substr(1);
        func = func.substr(1);

    } else {
        return false;
    }
}

function interpreter(func, lowerLim, upperLim) {
    // Power
    for(let i=0; i<func.length; i++) {
        if(func.charAt(i) == '^') {
            funcInterp = 'Math.pow('+func.charAt(i-1)+','+func.charAt(i+1)+')';
        }
    }
    // Trigonometric

}

function graphFunction(func, lowerLim, upperLim) {
    funcInterp = func;
    lowerLimInterp = lowerLim;
    upperLimLimInterp = upperLim;

    interpreter(func, lowerLim, upperLim);

    var functionLineMaterial = new THREE.LineBasicMaterial( { color: 0xf0f0f0 } );
    functionLineGeometry = new THREE.Geometry();
    functionLineMesh = new THREE.Mesh(functionLineGeometry, functionLineMaterial);

    for(let i = lowerLimInterp*100; i<upperLimLimInterp*100; i++) {
        x = i/100;
        y = i/100;
        result = eval(funcInterp);

        if(inTermsOfY(func) == true) {
            functionLineGeometry.vertices.push(new THREE.Vector3(result, y, 0));
        } else {
            functionLineGeometry.vertices.push(new THREE.Vector3(x, result, 0));
        }
    }

    functionLine = new THREE.Line(functionLineGeometry, functionLineMaterial);
    scene.add(functionLine);
}

// START | TEMP
var revolveAround = {
    revolveAroundOther: ''
}

function revolve(axisOfRevolution) {
    if(axisOfRevolution == 'x') {
        for(let i=0; i<360; i++) {
            let radian = (i * Math.PI) / (180);
            let newline = functionLine.clone();
            newline.rotation.x = radian;
            scene.add(newline);
        }
    } else if (axisOfRevolution == 'y') {
            for(let i=0; i<360; i++) {
                let radian = (i * Math.PI) / (180);
                let newline = functionLine.clone();
                newline.rotation.y = radian;
                scene.add(newline);
            }
    } else {
        for(let i=0; i<360; i++) {
            let radian = (i * Math.PI) / (180);
            let newline = functionLine.clone();
            scene.add(newline);
            let axisOfRevolutionRef = axisOfRevolution.slice(2);
            if(axisOfRevolution.charAt(0) == 'x') {
                newline.position.set(axisOfRevolutionRef, 0, 0);
                newline.rotation.y = radian;
                newline.position.set(newline.position.x - axisOfRevolutionRef*Math.cos(radian), newline.position.y, newline.position.z + axisOfRevolutionRef*Math.sin(radian));
            } else if (axisOfRevolution.charAt(0) == 'y') {
                newline.position.set(0, axisOfRevolutionRef, 0);
                newline.rotation.y = Math.PI
                newline.rotation.x = radian;
                newline.position.set(Math.abs(newline.position.x - axisOfRevolutionRef*Math.cos(radian)), newline.position.y, newline.position.z);
            }




        }


    }
}
// END | TEMP

var btnAddPoint = {add:function () { createPoint(point.xPos, point.yPos, point.zPos); }};
var btnGraphFunction = {add:function () { graphFunction(func.function, func.lowerLim, func.upperLim) }};
var btnRevolve = {add:function () { revolve(revolveAround.revolveAroundOther) }};

window.onload = function () {
    var gui = new dat.GUI({name: 'controls'});

    var graphPoint = gui.addFolder('Graph Point');
    graphPoint.add(point, 'xPos').name('X Position');
    graphPoint.add(point, 'yPos').name('Y Position');
    graphPoint.add(point, 'zPos').name('Z Position');
    graphPoint.add(btnAddPoint, 'add').name('Add Point');

    var graphFunction = gui.addFolder('Graph Function');
    graphFunction.add(func, 'function').name('Function');
    graphFunction.add(func, 'lowerLim').name('Lower Limit');
    graphFunction.add(func, 'upperLim').name('Upper Limit');
    graphFunction.add(btnGraphFunction, 'add').name('Graph Function');

    var revolve = gui.addFolder('Revolve Around Axis');
    revolve.add(revolveAround, 'revolveAroundOther').name('Revolve Around');
    revolve.add(btnRevolve, 'add').name('Revolve');
}

// TEMP START



//TEMP END
// Render loop (updates camera, controls, and render.)
var animate = function () {
    requestAnimationFrame( animate );

    controls.update();

    renderer.render( scene, camera );
};

animate();