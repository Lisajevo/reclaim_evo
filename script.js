console.log('Script.js starting...');

// Import AUJOULE Identity & Metadata
const AujouleMetadata = {
    identity: {
        handles: ["lisajEVO", "lisajevolving", "evolvinglisaj", "Lisajthaqueen", "Lisaj"],
        brand: ["Aujoule", "AuEvo", "EvoRoot", "EvolvingRoots"],
        location: "Louisiana"
    },
    philosophy: {
        numerology: ["369_Method", "Ritual_3", "Ritual_6", "Ritual_9", "Sequence_Master"],
        sacred: ["Sacred_Geometry", "Holy_Trinity", "Manifestation", "Seed", "Spirit", "Soul"],
        tongue: ["Auevolving_Tongue", "Soul_Speaks", "Au_Evolving_Tongue", "SoulSpeaks_AuEvoLving_Tongue", "Latin"]
    },
    technical_specs: {
        rendering: ["Dell_HighRes", "GPU_Accelerated", "Lossless", "4K_Master", "Final_Seal"],
        aesthetics: ["Visualizer", "Ambient", "High_Contrast", "Symmetry", "Organic_Texture"],
        audio: ["Original_Song", "Music"]
    },
    system_structure: {
        containers: ["The_Vault", "Archive_2026", "Gold_Standard", "Library", "Esoteric", "Knowledge"],
        evolution: ["EvoSpace", "SpaceEvo", "Evo2Evo", "Surge", "Frequency", "Manifest"]
    },
    core_handshake: "AuEvoJoulEvol"
};

// Initialize Sovereign Identity
console.log(`%c [AUJOULE] ${AujouleMetadata.core_handshake} ACTIVATED `, 'background: #4e3b31; color: #ffd700; font-weight: bold; border: 1px solid #ffd700; padding: 4px;');

// Brand Configuration
const BrandConfig = {
    identity: {
        root: "EvolvingRoots",
        engine: "AuEvo-JoulEvol",
        manifest: "Aujoule",
        environment: "The Root"
    },
    architecture: {
        type: "Decentralized Galaxy Web",
        security: "Sovereign-Lock-v1",
        signature: "AU-J-2026-EVO"
    },
    userTags: ["Titanium", "Gold-Stardust", "Ancestral-Echo", "Joule-Pulse"]
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    alpha: true,
    preserveDrawingBuffer: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000022, 1); // Deep cosmic blue background
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
    console.log('Texture ready, creating evolved cosmic geometry...');

    // Create main evolved cosmic orb - spherical geometry for uncontained flow
    const geometry = new THREE.SphereGeometry(20, 64, 64);

    // Create evolved shader material for uncontained cosmic flow
    const vertexShader = `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        uniform float time;
        uniform float factor;

        void main() {
            vUv = uv;
            vPosition = position;
            vNormal = normal;

            // Smooth uniform wave displacement for harmonious orb flow
            vec3 pos = position;
            float radius = length(pos);

            // Unified wave patterns for consistent evolution
            float unifiedWave = sin(radius * 0.05 + time * 0.3) * 1.5;
            unifiedWave += cos(radius * 0.08 + time * 0.5) * 1.2;
            unifiedWave += sin(time * 0.7) * 0.8;

            // Smooth radial displacement
            vec3 normalDir = normalize(pos);
            pos += normalDir * unifiedWave * factor * 0.5;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `;

    const fragmentShader = `
        uniform sampler2D map;
        uniform float time;
        uniform float factor;
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;

        // Sacred Geometry Functions - 369 Method
        float sacredGeometry(vec2 uv, float time) {
            // Fibonacci spiral approximation
            float angle = atan(uv.y, uv.x);
            float radius = length(uv);
            float spiral = sin(angle * 3.0 + radius * 6.0 + time) * 0.5 + 0.5;

            // Metatron's cube inspired pattern
            float metatron = sin(uv.x * 9.0 + time) * cos(uv.y * 6.0 + time * 1.5) * 0.3;

            // Flower of life resonance
            float flower = sin(radius * 12.0 + time * 2.0) * 0.2;

            return spiral + metatron + flower;
        }

        void main() {
            // Smooth uniform UV coordinates for consistent evolution
            vec2 uv = vUv;

            // Gentle, uniform distortion patterns with sacred geometry
            float smoothDistort = sin(uv.x * 4.0 + time * 0.2) * cos(uv.y * 3.0 + time * 0.3) * 0.01;
            smoothDistort += cos(uv.y * 5.0 + time * 0.4) * sin(uv.x * 4.5 + time * 0.25) * 0.008;

            // Add sacred geometry influence
            float sacred = sacredGeometry(uv, time) * 0.02;
            uv.x += smoothDistort + sacred;
            uv.y += smoothDistort * 0.7 + sacred * 0.5;

            // Uniform flowing offset with 369 resonance
            float flowOffset = sin(time * 0.15) * 0.03 * factor;
            uv.x += flowOffset;
            uv.y += flowOffset * 0.5;

            // Sample texture with uniform coordinates
            vec4 texColor = texture2D(map, uv);

            // Bright energy glow based on viewing angle - AUJOULE sacred frequencies
            float fresnel = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
            float energy = (sin(time * 1.5) * 0.3 + 0.8) * (1.0 + fresnel * 0.8);

            // 369 Method color harmonics
            vec3 energyColor = vec3(1.2, 1.0, 0.8) * energy * factor * 1.5;
            energyColor.r *= (sin(time * 3.0) * 0.1 + 0.9); // Ritual 3
            energyColor.g *= (sin(time * 6.0) * 0.1 + 0.9); // Ritual 6
            energyColor.b *= (sin(time * 9.0) * 0.1 + 0.9); // Ritual 9

            // Enhanced blend with texture - ensure brightness
            vec3 finalColor = mix(texColor.rgb * 1.3, energyColor, 0.6);

            // Bright uniform iridescence with sacred geometry
            float iridescence = sin(time * 0.8) * 0.12;
            finalColor += vec3(iridescence * 0.6, iridescence * 0.4, iridescence * 0.8);

            // Bright rim lighting - prevent silhouette
            float rim = pow(1.0 - fresnel, 2.0);
            finalColor += vec3(1.0, 0.8, 0.5) * rim * 0.4 * factor;

            // Add inner glow to prevent eclipse appearance
            float innerGlow = 1.0 - length(vPosition) / 20.0;
            finalColor += vec3(0.8, 0.6, 0.4) * innerGlow * 0.3 * factor;

            // Sacred geometry overlay
            float geometryGlow = sacredGeometry(vUv, time * 0.5) * 0.1;
            finalColor += vec3(0.9, 0.7, 0.5) * geometryGlow * factor;

            gl_FragColor = vec4(finalColor, 0.98);
        }
    `;

    const material = new THREE.ShaderMaterial({
        uniforms: {
            map: { value: evoSkin },
            time: { value: 0.0 },
            factor: { value: 0.2 }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        side: THREE.DoubleSide,
        emissive: new THREE.Color(0x332200), // Add base emissive glow
        emissiveIntensity: 0.3
    });

    const mirror = new THREE.Mesh(geometry, material);
    mirror.position.z = -10; // Position in space
    etherealBeing = mirror;
    scene.add(etherealBeing);

    // Add floating geometric satellites
    function createSatellite(x, y, z, size, color) {
        const geo = new THREE.OctahedronGeometry(size, 0);
        const mat = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.2,
            metalness: 0.9,
            roughness: 0.1,
            transparent: true,
            opacity: 0.7
        });
        const satellite = new THREE.Mesh(geo, mat);
        satellite.position.set(x, y, z);
        scene.add(satellite);
        return satellite;
    }

    // Create orbiting satellites
    const satellites = [
        createSatellite(15, 8, -5, 1.5, 0xff6b6b),
        createSatellite(-12, -10, 8, 1.2, 0x4ecdc4),
        createSatellite(8, -15, -3, 1.8, 0x9b59b6),
        createSatellite(-18, 5, 12, 1.0, 0xf39c12)
    ];

    // Store satellites for animation
    etherealBeing.satellites = satellites;

    console.log('Evolved cosmic mirror with satellites created');
    
}).catch((error) => {
    console.error('Failed to load texture:', error);
    // Create fallback cosmic scene
    const geometry = new THREE.SphereGeometry(20, 32, 32);
    const material = new THREE.MeshStandardMaterial({
        color: 0xFFB800,
        emissive: 0xFFB800,
        emissiveIntensity: 0.4,
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.6
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.z = -15;
    etherealBeing = sphere;
    scene.add(etherealBeing);
    console.log('Fallback cosmic sphere created');
});

// 3. Cosmic Outer Space Environment
scene.fog = new THREE.Fog(0x000011, 30, 300);

// Ambient cosmic glow - increased for brightness
const ambientLight = new THREE.AmbientLight(0x2a2a3e, 0.6);
scene.add(ambientLight);

// Primary stellar light (distant star) - brighter
const stellarLight = new THREE.PointLight(0xff8b4a, 2.5, 300);
stellarLight.position.set(50, 50, 50);
scene.add(stellarLight);

// Secondary cosmic light (nebula glow) - brighter
const nebulaLight = new THREE.PointLight(0x6bcfcf, 1.8, 250);
nebulaLight.position.set(-30, -30, 40);
scene.add(nebulaLight);

// Tertiary void light (deep space) - brighter
const voidLight = new THREE.PointLight(0xb86bce, 1.4, 200);
voidLight.position.set(0, 60, -20);
scene.add(voidLight);

// Create starfield background
function createStarfield() {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 1000;     // x
        positions[i + 1] = (Math.random() - 0.5) * 1000; // y
        positions[i + 2] = (Math.random() - 0.5) * 1000; // z
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.8,
        transparent: true,
        opacity: 0.8,
        vertexColors: false
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    return stars;
}

const starfield = createStarfield();

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
        // Responsive rotation based on mouse position
        const targetRotationY = mouse.x * 0.5;
        const targetRotationX = mouse.y * 0.3;
        
        etherealBeing.rotation.y += (targetRotationY - etherealBeing.rotation.y) * 0.05;
        etherealBeing.rotation.x += (targetRotationX - etherealBeing.rotation.x) * 0.05;
        
        // Cosmic evolution rotation
        etherealBeing.rotation.y += 0.005 * factor;
        etherealBeing.rotation.x += 0.002 * factor;
        etherealBeing.rotation.z += 0.001 * factor;
        
        // Hover effect - increased pulsing when mouse is over
        const hoverMultiplier = isHovering ? 1.5 : 1.0;
        
        // Resonant pulsing with multiple harmonics and hover boost
        const pulse1 = 1 + Math.sin(Date.now() * 0.0008) * 0.15 * hoverMultiplier;
        const pulse2 = 1 + Math.sin(Date.now() * 0.0012) * 0.1 * hoverMultiplier;
        const combinedPulse = (pulse1 + pulse2) / 2;
        
        // Click pulse effect
        if (clickPulse > 0) {
            combinedPulse *= (1 + clickPulse * 0.5);
            clickPulse *= 0.95; // Decay pulse
        }
        
        etherealBeing.scale.set(combinedPulse, combinedPulse, combinedPulse);
        
        // Evolve the shader uniforms for uncontained cosmic flow
        if (etherealBeing.material && etherealBeing.material.uniforms) {
            etherealBeing.material.uniforms.time.value = Date.now() * 0.001;
            etherealBeing.material.uniforms.factor.value = factor * (isHovering ? 1.3 : 1.0);
        }
        
        // Animate satellites with mouse influence
        if (etherealBeing.satellites) {
            etherealBeing.satellites.forEach((satellite, index) => {
                const time = Date.now() * 0.001;
                const baseRadius = 25 + index * 5;
                const speed = 0.5 + index * 0.2;
                
                // Mouse influence on satellite orbits
                const mouseInfluence = mouse.x * 5;
                const radius = baseRadius + mouseInfluence * (index + 1) * 0.5;
                
                satellite.position.x = Math.cos(time * speed + index) * radius;
                satellite.position.y = Math.sin(time * speed + index) * radius * 0.7;
                satellite.position.z = Math.sin(time * speed * 0.5 + index) * 10;
                
                satellite.rotation.x += 0.01;
                satellite.rotation.y += 0.015;
                
                // Click ripple effect on satellites
                if (satellite.userData.clickTime) {
                    const timeSinceClick = (Date.now() - satellite.userData.clickTime) * 0.001;
                    if (timeSinceClick < 2.0) {
                        const ripple = Math.sin(timeSinceClick * 10) * 0.2;
                        satellite.scale.set(1 + ripple, 1 + ripple, 1 + ripple);
                    } else {
                        satellite.userData.clickTime = null;
                        satellite.scale.set(1, 1, 1);
                    }
                }
            });
        }
        
        // Animate starfield with mouse parallax
        if (starfield) {
            starfield.rotation.y += 0.0002 + mouse.x * 0.0001;
            starfield.rotation.x += 0.0001 + mouse.y * 0.00005;
        }
    }
    renderer.render(scene, camera);
}
animate();

// 4.5. Interactive Responsiveness
let mouse = { x: 0, y: 0 };
let isHovering = false;
let clickPulse = 0;

// Mouse tracking for responsive interaction
document.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Check if mouse is over the orb (approximate)
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const distance = Math.sqrt(
        Math.pow(event.clientX - centerX, 2) + 
        Math.pow(event.clientY - centerY, 2)
    );
    isHovering = distance < 150; // Approximate orb radius in pixels
});

// Click interaction for pulse effect
document.addEventListener('click', (event) => {
    clickPulse = 1.0; // Trigger click pulse
    
    // Add ripple effect to satellites
    if (etherealBeing.satellites) {
        etherealBeing.satellites.forEach((satellite, index) => {
            satellite.userData.clickTime = Date.now();
        });
    }
});

// Touch support for mobile
document.addEventListener('touchmove', (event) => {
    if (event.touches.length > 0) {
        const touch = event.touches[0];
        mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
    }
});

document.addEventListener('touchstart', (event) => {
    if (event.touches.length > 0) {
        const touch = event.touches[0];
        mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
        clickPulse = 1.0;
    }
});

// Window resize responsiveness
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// 5. AUJOULE Branded UI Elements
function createBrandedUI() {
    // Sovereign Identity Seal
    const sealContainer = document.createElement('div');
    sealContainer.id = 'aujoule-seal';
    sealContainer.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 10000;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        color: #ffd700;
        background: rgba(78, 59, 49, 0.9);
        border: 1px solid #ffd700;
        padding: 8px 12px;
        border-radius: 4px;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        pointer-events: none;
        opacity: 0.8;
    `;
    sealContainer.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 4px;">[AUJOULE SOVEREIGN]</div>
        <div>${BrandConfig.identity.root}</div>
        <div style="font-size: 10px; opacity: 0.7;">${BrandConfig.architecture.signature}</div>
    `;
    document.body.appendChild(sealContainer);

    // Sacred Geometry Status
    const statusContainer = document.createElement('div');
    statusContainer.id = 'sacred-status';
    statusContainer.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 10000;
        font-family: 'Courier New', monospace;
        font-size: 10px;
        color: #4ecdc4;
        background: rgba(0, 0, 0, 0.8);
        border: 1px solid #4ecdc4;
        padding: 6px 10px;
        border-radius: 4px;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        pointer-events: none;
        opacity: 0.7;
    `;

    function updateSacredStatus() {
        const time = Date.now() * 0.001;
        const ritual3 = Math.sin(time * 3) > 0 ? 'ACTIVE' : 'DORMANT';
        const ritual6 = Math.sin(time * 6) > 0 ? 'FLOWING' : 'STILL';
        const ritual9 = Math.sin(time * 9) > 0 ? 'MANIFEST' : 'SEEDING';

        statusContainer.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 4px;">SACRED RESONANCE</div>
            <div>369: ${ritual3} | ${ritual6} | ${ritual9}</div>
            <div style="font-size: 9px; opacity: 0.6;">${AujouleMetadata.philosophy.sacred.join(' • ')}</div>
        `;
    }

    document.body.appendChild(statusContainer);
    setInterval(updateSacredStatus, 1000);
    updateSacredStatus();

    // Evolution Tags Display
    const tagsContainer = document.createElement('div');
    tagsContainer.id = 'evolution-tags';
    tagsContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        font-family: 'Courier New', monospace;
        font-size: 11px;
        color: #b86bce;
        background: rgba(0, 0, 0, 0.8);
        border: 1px solid #b86bce;
        padding: 8px 12px;
        border-radius: 4px;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        pointer-events: none;
        opacity: 0.7;
        max-width: 200px;
    `;

    function updateEvolutionTags() {
        const currentTags = BrandConfig.userTags.slice(0, 3).join(' | ');
        tagsContainer.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 4px;">EVOLUTION TAGS</div>
            <div style="font-size: 10px;">${currentTags}</div>
        `;
    }

    document.body.appendChild(tagsContainer);
    updateEvolutionTags();
}

// Initialize branded UI
createBrandedUI();

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