
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, controls;

var camera, cameraTarget, scene, renderer;

init();
//animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 15000 );
    camera.position.set( 300, 150, 300 );

    cameraTarget = new THREE.Vector3( 0, 0, 0 );

    scene = new THREE.Scene();

    // Lights

    scene.add( new THREE.HemisphereLight( 0x443333, 0x111122 ) );

    addShadowedLight( 0.5, 1, -1, 0xffff99, 1 );

    // renderer
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setClearColor( 0xffffff );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.cullFace = THREE.CullFaceBack;

    // Orbit Controls
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
    controls.enablePan = true;
    controls.target.set(0,0,0);
    controls.minDistance = 100;
    controls.enableZoom = true;

    // Axis helper for my own reference
    var axisHelper = new THREE.AxisHelper( 30 );
    scene.add( axisHelper );

    container.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );



    //renderer.render();
}

function addShadowedLight( x, y, z, color, intensity ) {

    var directionalLight = new THREE.DirectionalLight( color, intensity );
    directionalLight.position.set( x, y, z );
    scene.add( directionalLight );

    directionalLight.castShadow = true;
    // directionalLight.shadowCameraVisible = true;

    var d = 1;
    directionalLight.shadowCameraLeft = -d;
    directionalLight.shadowCameraRight = d;
    directionalLight.shadowCameraTop = d;
    directionalLight.shadowCameraBottom = -d;

    directionalLight.shadowCameraNear = 1;
    directionalLight.shadowCameraFar = 4;

    directionalLight.shadowMapWidth = 1024;
    directionalLight.shadowMapHeight = 1024;

    directionalLight.shadowBias = -0.005;

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function render() {
    renderer.render( scene, camera );
}

function clearScene(){
    // Don't mutate while removing
    _.each(_.clone(scene.children),function(child){
        if (child.type == "Mesh") {
            scene.remove(child);
        }
    });

    render();
}

//function animate() {
//
//    requestAnimationFrame( animate );
//    controls.update();
//    render();
//
//}
