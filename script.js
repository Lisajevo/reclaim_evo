console.log('Script.js starting...');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    canvas: document.querySelector('#bg'), 
    alpha: true, 
    preserveDrawingBuffer: true 
});
renderer.setSize(window.innerWidth, window.innerHeight);
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
    console.log('Texture ready, loading SVG...');
    
    // Try to load SVG with proper CORS handling
    fetch('aujoule.svg')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(svgText => {
            console.log('SVG fetched successfully, parsing...');
            // Parse SVG manually since SVGLoader might have issues
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
            const paths = svgDoc.querySelectorAll('path');
            
            if (paths.length === 0) {
                throw new Error('No paths found in SVG');
            }
            
            const group = new THREE.Group();
            
            paths.forEach((path, index) => {
                try {
                    const d = path.getAttribute('d');
                    if (!d) return;
                    
                    const fillColor = path.getAttribute('fill') || path.style.fill || '#FFB800';
                    if (fillColor === 'transparent' || fillColor === 'none') return;
                    
                    // Create a simple shape from the path
                    const shape = new THREE.Shape();
                    // For simplicity, create a basic geometry
                    const geometry = new THREE.ExtrudeGeometry(shape, { depth: 2, bevelEnabled: false });
                    geometry.center();
                    
                    const material = new THREE.MeshStandardMaterial({
                        map: evoSkin,
                        emissive: new THREE.Color(fillColor),
                        emissiveIntensity: 0.3,
                        metalness: 0.8,
                        roughness: 0.2
                    });
                    
                    const mesh = new THREE.Mesh(geometry, material);
                    group.add(mesh);
                    
                } catch (e) {
                    console.warn(`Error processing path ${index}:`, e);
                }
            });
            
            if (group.children.length > 0) {
                group.scale.set(0.1, 0.1, 0.1);
                etherealBeing = group;
                scene.add(etherealBeing);
                console.log('SVG geometry created successfully');
            } else {
                throw new Error('No valid geometry created from SVG');
            }
            
        })
        .catch(error => {
            console.error('SVG loading failed:', error);
            console.log('Falling back to plane geometry...');
            
            // Fallback to plane geometry
            const geometry = new THREE.PlaneGeometry(20, 20);
            const material = new THREE.MeshBasicMaterial({
                map: evoSkin,
                transparent: true
            });
            const plane = new THREE.Mesh(geometry, material);
            plane.position.z = -10;
            etherealBeing = plane;
            scene.add(etherealBeing);
            console.log('Fallback plane with texture added');
        });
        
}).catch((error) => {
    console.error('Failed to load texture:', error);
    // Create fallback without texture
    const geometry = new THREE.PlaneGeometry(20, 20);
    const material = new THREE.MeshBasicMaterial({
        color: 0xFFB800,
        transparent: true
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.position.z = -10;
    etherealBeing = plane;
    scene.add(etherealBeing);
    console.log('Fallback plane added (no texture)');
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
        etherealBeing.rotation.x += 0.005 * factor;
        const pulse = 1 + Math.sin(Date.now() * 0.002) * 0.05;
        etherealBeing.scale.set(pulse, pulse, pulse);
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