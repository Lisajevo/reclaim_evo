const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    canvas: document.querySelector('#bg'), 
    alpha: true, 
    preserveDrawingBuffer: true 
});
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 60;

// 1. Texture & Math Loaders
const texLoader = new THREE.TextureLoader();
const evoSkin = texLoader.load('evospace.jpg');
const svgLoader = new THREE.SVGLoader();
let etherealBeing = new THREE.Group();

// 2. SVG Math Manifestation
svgLoader.load('aujoule.svg', function (data) {
    const paths = data.paths;
    const group = new THREE.Group();

    paths.forEach((path) => {
        const fillColor = path.userData.style.fill;
        if (fillColor === 'transparent' || fillColor === 'none') return;

        const shapes = THREE.SVGLoader.createShapes(path);
        shapes.forEach((shape) => {
            const geometry = new THREE.ExtrudeGeometry(shape, { depth: 6, bevelEnabled: true });
            geometry.center(); 
            const material = new THREE.MeshStandardMaterial({
                map: evoSkin,
                emissive: 0xFFB800,
                emissiveIntensity: 0.5,
                metalness: 0.8,
                roughness: 0.2
            });
            group.add(new THREE.Mesh(geometry, material));
        });
    });
    group.scale.set(0.1, 0.1, 0.1);
    etherealBeing = group;
    scene.add(etherealBeing);
});

// 3. Lighting
const pLight = new THREE.PointLight(0xffffff, 2);
pLight.position.set(20, 20, 20);
scene.add(pLight);
scene.add(new THREE.AmbientLight(0xffffff, 0.7));

// 4. Sync & Animation
let factor = 0.2;
setInterval(async () => {
    try {
        const res = await fetch('/data');
        const d = await res.json();
        factor = d.factor;
    } catch (e) { factor = 0.1; }
}, 1000);

function animate() {
    requestAnimationFrame(animate);
    if (etherealBeing) {
        etherealBeing.rotation.y += 0.01 * factor;
        const pulse = 1 + Math.sin(Date.now() * 0.002) * 0.05;
        etherealBeing.scale.set(0.1 * pulse, 0.1 * pulse, 0.1 * pulse);
    }
    renderer.render(scene, camera);
}
animate();

// 5. Recording Anchor
const btn = document.getElementById('recordButton');
let mediaRecorder, chunks = [];
btn.onclick = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
        btn.innerText = "START RECORDING";
    } else {
        const stream = document.querySelector('#bg').captureStream(30);
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        chunks = [];
        mediaRecorder.ondataavailable = e => chunks.push(e.data);
        mediaRecorder.onstop = () => {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(new Blob(chunks, { type: 'video/webm' }));
            a.download = "AuEvo-Hybrid.webm";
            a.click();
        };
        mediaRecorder.start();
        btn.innerText = "STOP RECORDING";
    }
};