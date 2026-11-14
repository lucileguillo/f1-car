import * as THREE from 'three'; 
import { OrbitControls } from "three/addons/controls/OrbitControls.js"; 
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; 
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
};

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x342652 );
const camera = new THREE.PerspectiveCamera(
    45,
    viewport.width / viewport.height,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(viewport.width, viewport.height);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.cursorStyle = 'grab';
controls.autoRotate = true;
controls.autoRotateSpeed = 3;
controls.enableDamping = true;

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);
loader.load("./f1-2026-car&textures.glb", (gltf) => {
    const model = gltf.scene;
    scene.add(model);

    model.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true; 

            node.material = node.material.clone();
        }
    });
});

window.onresize = () => {
    viewport.width = window.innerWidth;
    viewport.height = window.innerHeight;

    camera.aspect = viewport.width / viewport.height;
    camera.updateProjectionMatrix();

    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.setSize(viewport.width, viewport.height);
    renderer.render(scene, camera);
};

camera.position.set(3, 2, 2); 

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.ShadowMaterial({ opacity: 0.3 })
);

ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;

scene.add(ground);

// soleil de jour

const ambLight = new THREE.AmbientLight(0xFFFFFF, 1);

const dirLight = new THREE.DirectionalLight(0xFFFFFF, 5);
dirLight.position.set(0, 5, 10);
dirLight.target.position.set(-10, 0, 2);
dirLight.castShadow = true;

dirLight.shadow.mapSize.set(2048, 2048);

dirLight.shadow.camera.near = 0.5;
dirLight.shadow.camera.far = 50;

dirLight.shadow.camera.left = -20;
dirLight.shadow.camera.right = 20;
dirLight.shadow.camera.top = 20;
dirLight.shadow.camera.bottom = -20;

dirLight.shadow.bias = -0.0005;
dirLight.shadow.normalBias = 0.02;

scene.add(ambLight, dirLight, dirLight.target);

function animate(time){
    controls.update();
    renderer.render(scene, camera);
};

renderer.setAnimationLoop(animate);

renderer.render(scene, camera);