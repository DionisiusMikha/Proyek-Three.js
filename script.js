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

const gltfGroup = new THREE.Group();
scene.add(gltfGroup);

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

let mobil_1;
loader.load(
    './assets/car_1.gltf',
    function (gltf) {
        // mobil_1 = gltf.scene;
        mobil_1 = gltf.scene;
        mobil_1.scale.set(0.19, 0.19, 0.19);
        // mobil_1.scale.set(1, 1, 1);

        mobil_1.traverse(function (child) {
            if (child.isMesh) {
                child.receiveShadow = true;
            }
        });
        mobil_1.castShadow = true;
        mobil_1.position.set(12.95, 1.08, 9);

        // const box = new THREE.Box3().setFromObject(mobil_1);
        // mobilCenter = box.getCenter(new THREE.Vector3());

        // Tambahkan objek GLTF ke objek grup
        // gltfGroup.add(mobil_1);

        console.log(mobil_1);
        scene.add(mobil_1);
    }
)

let mobil_2;
loader.load(
    './assets/car_2.gltf',
    function (gltf) {
        // mobil_1 = gltf.scene;
        mobil_2 = gltf.scene;
        mobil_2.scale.set(0.19, 0.19, 0.19);
        // mobil_1.scale.set(1, 1, 1);

        mobil_2.traverse(function (child) {
            if (child.isMesh) {
                child.receiveShadow = true;
            }
        });
        mobil_2.castShadow = true;
        mobil_2.position.set(-5, 1.042, -2.6);

        // const box = new THREE.Box3().setFromObject(mobil_1);
        // mobilCenter = box.getCenter(new THREE.Vector3());

        // Tambahkan objek GLTF ke objek grup
        // gltfGroup.add(mobil_1);

        console.log(mobil_2);
        scene.add(mobil_2);
    }
)

let mobil_3;
loader.load(
    './assets/car_3.gltf',
    function (gltf) {
        mobil_3 = gltf.scene;
        mobil_3.scale.set(0.19, 0.19, 0.19);

        mobil_3.traverse(function (child) {
            if (child.isMesh) {
                child.receiveShadow = true;
            }
        });

        mobil_3.castShadow = true;
        mobil_3.position.set(8, 1.29, 1.9);
        mobil_3.rotateX(2.53);

        // const box = new THREE.Box3().setFromObject(mobil_1);
        // mobilCenter = box.getCenter(new THREE.Vector3());

        // Tambahkan objek GLTF ke objek grup
        // gltfGroup.add(mobil_1);

        console.log(mobil_3);
        scene.add(mobil_3);
    }
)

let mobil_4;
loader.load(
    './assets/car_4.gltf',
    function (gltf) {
        mobil_4 = gltf.scene;
        mobil_4.scale.set(0.19, 0.19, 0.19);

        mobil_4.traverse(function (child) {
            if (child.isMesh) {
                child.receiveShadow = true;
            }
        });

        mobil_4.castShadow = true;
        mobil_4.position.set(8.5, 1.34, 1.9);

        console.log(mobil_4);
        scene.add(mobil_4);
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
controls.enableDamping = true;
controls.enabled = false;
camera.lookAt(5, 5, 5);
controls.enabled = true;
controls.autoRotate = false;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.25;
controls.target.set(xMobil, yMobil, zMobil);

let gerak = true;

// Pendengar acara pada tombol keyboard
document.addEventListener('keydown', function(event) {
    const keyCode = event.keyCode;
    if (keyCode === 87 && gerak) { // Tombol "W" ditekan
        isMovingForward = true;
    } else if (keyCode === 83 && gerak) { // Tombol "S" ditekan
        isMovingBackward = true;
    } else if (keyCode === 65 && gerak) { // Tombol "A" ditekan
        isTurningLeft = true;
    } else if (keyCode === 68 && gerak) { // Tombol "D" ditekan
        isTurningRight = true;
    }
});

document.addEventListener('keyup', function(event) {
    const keyCode = event.keyCode;
    if (keyCode === 87) { // Tombol "W" dilepas
        isMovingForward = false;
    } else if (keyCode === 83) { // Tombol "S" dilepas
        isMovingBackward = false;
    } else if (keyCode === 65) { // Tombol "A" dilepas
        isTurningLeft = false;
    } else if (keyCode === 68) { // Tombol "D" dilepas
        isTurningRight = false;
    }
});

controls.addEventListener('change', function () {
    xCamera = controls.object.position.x;
    yCamera = controls.object.position.y;
    zCamera = controls.object.position.z;
});

function updateMobilPosition(delta) {
    if (isMovingForward) {
        mobil_player.translateX(moveSpeed);
        xMobil = mobil_player.position.x;
        zMobil = mobil_player.position.z;
    } else if (isMovingBackward) {
        mobil_player.translateX(-moveSpeed);
        xMobil = mobil_player.position.x;
        xMobil = mobil_player.position.x;
        zMobil = mobil_player.position.z;
    }

    // Rotasi belok kiri/kanan
    if (isTurningLeft && isMovingForward) {
        mobil_player.rotateY(turnSpeed);
        xMobil = mobil_player.position.x;
        zMobil = mobil_player.position.z;
    } else if (isTurningRight && isMovingForward) {
        mobil_player.rotateY(-turnSpeed);
        xMobil = mobil_player.position.x;
        zMobil = mobil_player.position.z;
    }

    if (isTurningLeft && isMovingBackward) {
        mobil_player.rotateY(-turnSpeed);
        xMobil = mobil_player.position.x;
        zMobil = mobil_player.position.z;
    } else if (isTurningRight && isMovingBackward) {
        mobil_player.rotateY(turnSpeed);
        xMobil = mobil_player.position.x;
        zMobil = mobil_player.position.z;
    }

    if (mobil_player) {
        camera.position.copy(mobil_player.position).add(cameraOffset);
        camera.lookAt(mobil_player.position);
    }

    controls.target.set(xMobil, yMobil, zMobil);
    camera.position.set(xCamera, yCamera, zCamera);
    controls.enabled = false;
    camera.lookAt(xMobil, yMobil, zMobil);
    controls.enabled = true;

    // Pembaruan animasi mixer
    if (mixer) {
        mixer.update(delta);
    }

    console.log(mobil_player.position.z);
}

let mobil_1_is_moving_forward = false;
let mobil_1_is_turning_left = false;

function mobil_1_jalan(delta){
    if(mobil_1.position.z > 3.7){
        mobil_1_is_moving_forward = true;
    }else if(mobil_1.position.z <= 3.7 && mobil_1.position.x > 12.467){
        mobil_1_is_turning_left = true;
    }else if(mobil_1.position.x <= 12.467 && mobil_1.position.x > 7.7){
        mobil_1_is_turning_left = false;
    }else if(mobil_1.position.x <= 7.7 && mobil_1.position.z > 3 && mobil_1.position.z < 3.62){
        mobil_1_is_turning_left = true;
    }else if(mobil_1.position.z >= 3.62 && mobil_1.position.z <= 9.5 && mobil_1.position.x < 7.2){
        mobil_1_is_turning_left = false;
    }
    if(mobil_1.position.z > 9.5 && mobil_1.position.z < 10.013378083){
        mobil_1_is_turning_left = true;
    }else if(mobil_1.position.z >= 10.013378083 && mobil_1.position.z < 10.06 && mobil_1.position.x < 10){
        mobil_1_is_turning_left = false;
    }else if(mobil_1.position.x >= 10 && mobil_1.position.z >= 10.06 && mobil_1.position.z >= 10.06){
        mobil_1_is_moving_forward = false;
        mobil_1_is_turning_left = false;
    }

    if (mobil_1_is_moving_forward) {
        mobil_1.translateZ(-moveSpeed);
    }

    // Rotasi belok kiri/kanan
    if (mobil_1_is_turning_left) {
        mobil_1.rotateY(turnSpeed);
    }
    
    // console.log(mobil_1.position.x);
    // console.log(mobil_1.position.z);
}

let mobil_2_is_moving_forward = true;

function mobil_2_jalan(delta){
    if (mobil_2_is_moving_forward) {
        mobil_2.translateX(moveSpeed);

        if (mobil_2.position.x > -2.75 && mobil_2.position.x < -2.74) {
            stopMoving();
        }
    }

    if(mobil_2.position.x >= 7){
        mobil_2_is_moving_forward = false;
    }

    // console.log(mobil_2.position.x);
}

function stopMoving() {
    mobil_2_is_moving_forward = false;
    setTimeout(startMoving, 2000);
}

function startMoving() {
    mobil_2_is_moving_forward = true;
}

let mobil_4_is_moving_forward = true;
let mobil_4_is_turning_left = false;
let turnAngle = Math.PI / 2;

let posisi;
let selesai_jatuh = false;
let batas = false;

function mobil_4_jalan(delta){
    posisi = mobil_4.position.z;
    if (mobil_4.position.z <= -2.62) {
        mobil_4_is_turning_left = true;
    }

    if(mobil_4.position.z <= -3.1349){
        mobil_4_is_turning_left = false;
    }

    if (mobil_4_is_moving_forward) {
        mobil_4.translateZ(-moveSpeed);
    }

    if(mobil_4.position.x <= -4.5){
        mobil_4_is_moving_forward = false;
    }

    // Rotasi belok kiri
    if (mobil_4_is_turning_left) {
        mobil_4.rotateY(turnSpeed);
    }

    if(mobil_4.position.z < -3.1349){
        if(posisi < mobil_4.position.z){
            mobil_4.rotateY(-0.001);
        }else if(posisi > mobil_4.position.z){
            mobil_4.rotateY(0.001);
        }
    }

    // console.log(mobil_4.position.x)
}


function cek_posisi_player(delta){
    if(mobil_player.position.x <= -6.15){
        selesai_jatuh = true;
    }else if(mobil_player.position.x >= 13.17){
        selesai_jatuh = true;
    }else if(mobil_player.position.z >= 16.66){
        selesai_jatuh = true;
    }else if(mobil_player.position.z <= -12.6){
        selesai_jatuh = true;
    }

    if(mobil_player.position.y <= 0.6 && !batas){
        selesai_jatuh = true;
    }
    
    if(selesai_jatuh){
        selesai_jatuh = false;
        batas = true;
        alert("SIM mu nembak a?");
        window.location.reload(true);
    }
}

// Fungsi animasi
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    var delta = clock.getDelta();
    
    updateMobilPosition(delta);
    mobil_1_jalan(delta);
    mobil_2_jalan(delta);
    mobil_4_jalan(delta)
    cek_posisi_player(delta);
}

// Panggil fungsi animasi
animate();


// Mendengarkan kejadian key press pada dokumen
// document.addEventListener('keydown', function(event) {
//     // Mendapatkan kode tombol yang ditekan
//     var keyCode = event.keyCode;
  
//     // Mengubah posisi kamera berdasarkan kunci yang ditekan
//     switch(keyCode) {
//       case 37: // Tombol panah kiri
//         camera.position.x -= 1; // Menggeser kamera ke kiri
//         break;
//       case 39: // Tombol panah kanan
//         camera.position.x += 1; // Menggeser kamera ke kanan
//         break;
//       case 38: // Tombol panah atas
//         camera.position.z -= 1; // Menggeser kamera ke depan
//         break;
//       case 40: // Tombol panah bawah
//         camera.position.z += 1; // Menggeser kamera ke belakang
//         break;
//     }
//   });
  
