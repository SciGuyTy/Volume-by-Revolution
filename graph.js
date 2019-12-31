var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.001, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

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

function graphFunction(func, lowerLim, upperLim) {
    coords = [];

    for(let i = lowerLim; i<upperLim+1; i++) {
        x = i;
        result = eval(func);
        createPoint(i, result, 0);
    }
}

var btnAddPoint = {add:function () { createPoint(point.xPos, point.yPos, point.zPos); }};
var btnGraphFunction = {add:function () { graphFunction(func.function, func.lowerLim, func.upperLim) }};


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
}

// Render loop (updates camera, controls, and render.)
var animate = function () {
    requestAnimationFrame( animate );

    controls.update();

    renderer.render( scene, camera );
};

animate();