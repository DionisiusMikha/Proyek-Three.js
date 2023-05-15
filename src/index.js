var scene = new THREE.Scene();
var cam = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 1, 100);
var renderer = new THREE.WebGLRenderer();

renderer.setSize(innerWidth, innerHeight);
cam.position.z = 2;

const wibu = new THREE.TextureLoader().load("./src/assets/image.jpg");

var box = new THREE.BoxGeometry(1,1,1);
var box_mat = new THREE.MeshBasicMaterial(
    {map: wibu}
);
var boxMesh = new THREE.Mesh(box, box_mat);
scene.add(boxMesh);

document.body.appendChild(renderer.domElement);

function draw()
{
    requestAnimationFrame(draw);
    boxMesh.rotation.x+=0;
    renderer.render(scene, cam)
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'd') {
        boxMesh.rotation.y += 0.05;
    }
    else if(event.key === 'a'){
        boxMesh.rotation.y -= 0.05;
    }
    else if(event.key === 'w'){
        boxMesh.rotation.x += 0.05;
    }
    else if(event.key === 's'){
        boxMesh.rotation.x -= 0.05;
    }else if(event.key === 'ArrowUp'){
        boxMesh.translateZ(-0.1);
    }else if(event.key === 'ArrowDown'){
        boxMesh.translateZ(0.1);
    }else if(event.key === 'ArrowLeft'){
        boxMesh.position.x -= 0.05;
    }else if(event.key === 'ArrowRight'){
        boxMesh.position.x += 0.05;
    }
});

draw()
renderer.render(scene,cam);