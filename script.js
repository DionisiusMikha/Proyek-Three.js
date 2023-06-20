import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Posisi Mobil
let xMobil = 0;
let yMobil = 1.1;
let zMobil = 3.1;

let xCamera = -2;
let yCamera = 2;
let zCamera = 3.1;

let isMovingForward = false;
let isMovingBackward = false;
let isTurningLeft = false;
let isTurningRight = false;

// CameraOffSet
let cameraOffset = new THREE.Vector3(0, 5, -10); // Misalnya, kamera berada di belakang mobil, sedikit di atas, dan sedikit ke bawah

// Nilai kecepatan pergerakan dan rotasi mobil
const moveSpeed = 0.01;
const turnSpeed = 0.02;

// Clock
var clock = new THREE.Clock();

// Buat scene
var scene = new THREE.Scene();

// Buat kamera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.set(10, 5, 20);

// Buat renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Background
const temploader = new THREE.TextureLoader();
scene.background = temploader.load('./assets/background.jpeg');

// Tambahkan renderer ke body
document.body.appendChild(renderer.domElement);

// Loader GLTF
var loader = new GLTFLoader();

// Load Map
let map;
loader.load(
    './assets/map.gltf',
    function (gltf) {
        map = gltf.scene;
        map.scale.set(0.2, 0.2, 0.2);

        map.traverse(function (child) {
            if (child.isMesh) {
                child.receiveShadow = true;
            }
        });
        map.castShadow = true;

        console.log(map);
        scene.add(map);
    }
)

// Load Mobil Player
let mobil_player;
let mixer;
loader.load(
    './assets/player.gltf',
    function (gltf) {
        mobil_player = gltf.scene;
        mobil_player.scale.set(0.00135, 0.00135, 0.00135);

        mobil_player.traverse(function (child) {
            if (child.isMesh) {
                child.receiveShadow = true;
            }
        });
        mobil_player.castShadow = true;
        mobil_player.position.set(xMobil, yMobil, zMobil);
        
        mixer = new THREE.AnimationMixer(mobil_player);
        var clips = gltf.animations;

        // Memainkan semua animasi
        clips.forEach(function (clip) {
            mixer.clipAction(clip).play();
        });

        console.log(mobil_player);
        scene.add(mobil_player);
    }
)

let mobil_1;
loader.load(
    './assets/car_1.gltf',
    function (gltf) {
        mobil_1 = gltf.scene;
        mobil_1.scale.set(0.19, 0.19, 0.19);

        mobil_1.traverse(function (child) {
            if (child.isMesh) {
                child.receiveShadow = true;
            }
        });
        mobil_1.castShadow = true;
        mobil_1.position.set(0.7, 0.05, 0);

        console.log(mobil_1);
        scene.add(mobil_1);
    }
)

// Buat directional light
var light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 10)
light.castShadow = true;

// Tentukan area bayangan pada cahaya
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 100;
light.shadow.camera.left = -10;
light.shadow.camera.right = 10;
light.shadow.camera.top = 10;
light.shadow.camera.bottom = -10;

// Tambahkan cahaya ke scene
scene.add(light);

// Inisialisasi OrbitControls
var controls = new OrbitControls(camera, renderer.domElement);

// Konfigurasi kontrol kamera
// controls.enableDamping = true;
// controls.enabled = false;
// camera.lookAt(5, 5, 5);
// controls.enabled = true;
// controls.autoRotate = false;
// controls.dampingFactor = 0.05;
// controls.rotateSpeed = 0.25;
// controls.target.set(xMobil, yMobil, zMobil);

// Pendengar acara pada tombol keyboard
// document.addEventListener('keydown', function(event) {
//     const keyCode = event.keyCode;
//     if (keyCode === 87) { // Tombol "W" ditekan
//         isMovingForward = true;
//     } else if (keyCode === 83) { // Tombol "S" ditekan
//         isMovingBackward = true;
//     } else if (keyCode === 65) { // Tombol "A" ditekan
//         isTurningLeft = true;
//     } else if (keyCode === 68) { // Tombol "D" ditekan
//         isTurningRight = true;
//     }
// });

// document.addEventListener('keyup', function(event) {
//     const keyCode = event.keyCode;
//     if (keyCode === 87) { // Tombol "W" dilepas
//         isMovingForward = false;
//     } else if (keyCode === 83) { // Tombol "S" dilepas
//         isMovingBackward = false;
//     } else if (keyCode === 65) { // Tombol "A" dilepas
//         isTurningLeft = false;
//     } else if (keyCode === 68) { // Tombol "D" dilepas
//         isTurningRight = false;
//     }
// });

// controls.addEventListener('change', function () {
//     xCamera = controls.object.position.x;
//     yCamera = controls.object.position.y;
//     zCamera = controls.object.position.z;
// });

// function updateMobilPosition(delta) {
//     if (isMovingForward) {
//         mobil_player.translateX(moveSpeed);
//         xMobil = mobil_player.position.x;
//         zMobil = mobil_player.position.z;
//     } else if (isMovingBackward) {
//         mobil_player.translateX(-moveSpeed);
//         xMobil = mobil_player.position.x;
//         xMobil = mobil_player.position.x;
//         zMobil = mobil_player.position.z;
//     }

//     // Rotasi belok kiri/kanan
//     if (isTurningLeft && isMovingForward) {
//         mobil_player.rotateY(turnSpeed);
//         xMobil = mobil_player.position.x;
//         zMobil = mobil_player.position.z;
//     } else if (isTurningRight && isMovingForward) {
//         mobil_player.rotateY(-turnSpeed);
//         xMobil = mobil_player.position.x;
//         zMobil = mobil_player.position.z;
//     }

//     if (isTurningLeft && isMovingBackward) {
//         mobil_player.rotateY(-turnSpeed);
//         xMobil = mobil_player.position.x;
//         zMobil = mobil_player.position.z;
//     } else if (isTurningRight && isMovingBackward) {
//         mobil_player.rotateY(turnSpeed);
//         xMobil = mobil_player.position.x;
//         zMobil = mobil_player.position.z;
//     }

//     if (mobil_player) {
//         camera.position.copy(mobil_player.position).add(cameraOffset);
//         camera.lookAt(mobil_player.position);
//     }

//     controls.target.set(xMobil, yMobil, zMobil);
//     camera.position.set(xCamera, yCamera, zCamera);
//     controls.enabled = false;
//     camera.lookAt(xMobil, yMobil, zMobil);
//     controls.enabled = true;

//     // Pembaruan animasi mixer
//     if (mixer) {
//         mixer.update(delta);
//     }
// }

function mobil_1_jalan(delta){
    if(mobil_1.position.z > -2.9){
        mobil_1.translateZ(-moveSpeed);
    }else if(mobil_1.position.z <= -2.8){
        mobil_1.translateZ(-moveSpeed);
        mobil_1.rotateY(turnSpeed);
    }
    
    console.log(mobil_1.position.z);
}

// Fungsi animasi
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    var delta = clock.getDelta();
    // updateMobilPosition(delta);
    mobil_1_jalan(delta);
}

// Panggil fungsi animasi
animate();


// Mendengarkan kejadian key press pada dokumen
document.addEventListener('keydown', function(event) {
    // Mendapatkan kode tombol yang ditekan
    var keyCode = event.keyCode;
  
    // Mengubah posisi kamera berdasarkan kunci yang ditekan
    switch(keyCode) {
      case 37: // Tombol panah kiri
        camera.position.x -= 1; // Menggeser kamera ke kiri
        break;
      case 39: // Tombol panah kanan
        camera.position.x += 1; // Menggeser kamera ke kanan
        break;
      case 38: // Tombol panah atas
        camera.position.z -= 1; // Menggeser kamera ke depan
        break;
      case 40: // Tombol panah bawah
        camera.position.z += 1; // Menggeser kamera ke belakang
        break;
    }
  });
  
