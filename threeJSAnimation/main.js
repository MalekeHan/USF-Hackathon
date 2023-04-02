import * as THREE from 'three';

// Initialize renderer and create a canvas
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Initialize scenes
const scene1 = new THREE.Scene();
const scene2 = new THREE.Scene();

// Initialize cameras
const camera1 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const camera2 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Add cube to scene1
const geometry1 = new THREE.BoxGeometry();
const material1 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube1 = new THREE.Mesh(geometry1, material1);
cube1.interactive = true;
cube1.cursor = 'pointer';
scene1.add(cube1);
camera1.position.z = 5;

// Add sphere to scene2
const geometry2 = new THREE.SphereGeometry(1, 32, 32);
const material2 = new THREE.MeshPhongMaterial({ color: 0xff0000 });
const sphere2 = new THREE.Mesh(geometry2, material2);
sphere2.interactive = true;
sphere2.cursor = 'pointer';
scene2.add(sphere2);
camera2.position.z = 5;

// Add light to scene2
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 0, 10);
scene2.add(light);

let transitionProgress = 0;
let isTransitioning = false;

// Add event listeners to the cube and sphere
cube1.addEventListener('click', () => {
    isTransitioning = !isTransitioning;
});

sphere2.addEventListener('click', () => {
    isTransitioning = !isTransitioning;
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    cube1.rotation.x += 0.01;
    cube1.rotation.y += 0.01;

    sphere2.rotation.y += 0.01;

    if (isTransitioning) {
        transitionProgress += 0.01;
    } else {
        transitionProgress -= 0.01;
    }

    transitionProgress = Math.max(0, Math.min(1, transitionProgress));

    if (transitionProgress < 0.5) {
        camera1.position.z = 5 - transitionProgress * 10;
        renderer.render(scene1, camera1);
    } else {
        camera2.position.z = 5 - (1 - transitionProgress) * 10;
        renderer.render(scene2, camera2);
    }
}

animate();
