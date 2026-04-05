console.log('Script.js starting...');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    canvas: document.querySelector('#bg'), 
    alpha: true, 
    preserveDrawingBuffer: true 
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000011, 1); // Deep blue-black background for ethereal feel
camera.position.z = 60;
camera.lookAt(0, 0, 0); // Make sure camera is looking at origin

// 1. Texture & Math Loaders
const texLoader = new THREE.TextureLoader();
let evoSkin;

function loadTexture() {
    return new Promise((resolve, reject) => {
        texLoader.load('evospace.jpg', 
            function(texture) {
                console.log('Texture loaded successfully:', texture);
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.needsUpdate = true;
                evoSkin = texture;
                resolve(texture);
            },
            function(progress) {
                console.log('Texture loading progress:', progress);
            },
            function(error) {
                console.error('Error loading texture:', error);
                // Try loading as image and converting to texture
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = function() {
                    const texture = new THREE.Texture(img);
                    texture.needsUpdate = true;
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;
                    evoSkin = texture;
                    console.log('Fallback texture loaded');
                    resolve(texture);
                };
                img.onerror = function() {
                    console.error('Fallback image loading failed');
                    reject(error);
                };
                img.src = 'evospace.jpg';
            }
        );
    });
}
const svgLoader = new THREE.SVGLoader();
let etherealBeing = new THREE.Group();

// Load texture first, then create geometry
loadTexture().then(() => {
    console.log('Texture ready, creating ethereal geometry...');
    
    // Create a beautiful ethereal resonant plane
    const geometry = new THREE.PlaneGeometry(40, 40, 32, 32);
    
    // Create a material with the texture and ethereal properties
    const material = new THREE.MeshStandardMaterial({
        map: evoSkin,
        emissive: new THREE.Color(0xFFB800), // Golden emissive
        emissiveIntensity: 0.4,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
    });
    
    const plane = new THREE.Mesh(geometry, material);
    plane.position.z = -5; // Position in front of camera
    etherealBeing = plane;
    scene.add(etherealBeing);
    
    console.log('Ethereal resonant plane created with texture');
    
}).catch((error) => {
    console.error('Failed to load texture:', error);
    // Create fallback without texture but still ethereal
    const geometry = new THREE.PlaneGeometry(40, 40, 32, 32);
    const material = new THREE.MeshStandardMaterial({
        color: 0xFFB800,
        emissive: 0xFFB800,
        emissiveIntensity: 0.6,
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.position.z = -5;
    etherealBeing = plane;
    scene.add(etherealBeing);
    console.log('Fallback ethereal plane created (no texture)');
});

// 3. Ethereal Lighting Setup
const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
scene.add(ambientLight);

// Primary resonant light
const primaryLight = new THREE.PointLight(0xFFB800, 2, 100);
primaryLight.position.set(10, 10, 10);
scene.add(primaryLight);

// Secondary harmonic light
const secondaryLight = new THREE.PointLight(0x1C7293, 1.5, 80);
secondaryLight.position.set(-10, -10, 15);
scene.add(secondaryLight);

// Tertiary ethereal glow
const tertiaryLight = new THREE.PointLight(0xFFFFFF, 1, 60);
tertiaryLight.position.set(0, 20, -5);
scene.add(tertiaryLight);

// Add some fog for atmosphere
scene.fog = new THREE.Fog(0x000000, 50, 200);

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
        // Ethereal rotation with multiple harmonics
        etherealBeing.rotation.y += 0.008 * factor;
        etherealBeing.rotation.x += 0.003 * factor;
        etherealBeing.rotation.z += 0.001 * factor;
        
        // Resonant pulsing with multiple frequencies
        const pulse1 = 1 + Math.sin(Date.now() * 0.001) * 0.1;
        const pulse2 = 1 + Math.sin(Date.now() * 0.002) * 0.05;
        const combinedPulse = (pulse1 + pulse2) / 2;
        
        etherealBeing.scale.set(combinedPulse, combinedPulse, combinedPulse);
        
        // Subtle position oscillation for resonance
        etherealBeing.position.z = -5 + Math.sin(Date.now() * 0.0005) * 2;
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

// Test image loading
console.log('Setting up test image...');
const testImg = document.getElementById('testImage');
console.log('Test image element:', testImg);

if (testImg) {
    testImg.onload = () => {
        console.log('Test image loaded successfully');
        testImg.style.border = '2px solid green';
    };
    testImg.onerror = () => {
        console.error('Test image failed to load');
        testImg.style.border = '2px solid red';
    };
    console.log('Test image event handlers set up');
} else {
    console.error('Test image element not found!');
}