/**
 * AUJOULÉ MASTER TRINITY BRIDGE - VERSION 3.1
 * Logic: 1 + 1 = 6 (Structural Truth)
 * Primary Path: C:\Users\lisaj\Desktop\reclaim_evo
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Define the "Flesh" - where the logs live
const fleshDir = path.join(__dirname, '02_THE_FLESH');
const logPath = path.join(fleshDir, 'scan_results.log');

/**
 * SELF-HEALING PROTOCOL
 * Ensures the physical folder exists before the Soul (Logic) attempts to write.
 */
if (!fs.existsSync(fleshDir)) {
    fs.mkdirSync(fleshDir, { recursive: true });
    console.log("--- [SYSTEM] 02_THE_FLESH Created ---");
}

if (!fs.existsSync(logPath)) {
    fs.writeFileSync(logPath, `--- LOG INITIALIZED: ${new Date().toLocaleString()} ---\n`);
}

/**
 * THE TRINITY HANDSHAKE
 * Monitors the system process list for the resonance of engine.exe.
 */
function checkEnginePulse() {
    // We check the Windows Tasklist for your C-binary
    exec('tasklist /FI "IMAGENAME eq engine.exe"', (err, stdout) => {
        const isRunning = stdout.includes('engine.exe');
        const timestamp = new Date().toLocaleString();

        if (isRunning) {
            // Golden Glow - Resonance achieved
            console.log(`[${timestamp}] ✨ RESONANCE: engine.exe is Active. 1+1=6.`);
            fs.appendFileSync(logPath, `${timestamp} - STATUS: RESONANCE | LEVEL: 55\n`);
        } else {
            // Red Glow - Dissonance detected
            console.log(`[${timestamp}] 🚨 DISSONANCE: engine.exe is Missing. Manual Re-entry Required.`);
            fs.appendFileSync(logPath, `${timestamp} - STATUS: DISSONANCE | ENGINE_LOST\n`);
        }
    });
}

// Clear the screen for a clean "Organic" start
console.clear();
console.log("==================================================");
console.log("   AUJOULÉ TRINITY BRIDGE: ACTIVE (LEVEL 55)      ");
console.log("==================================================");
console.log(`Monitoring: ${fleshDir}`);
console.log("Handshake Frequency: 5 Seconds");
console.log("--------------------------------------------------");

// Initialize the loop
setInterval(checkEnginePulse, 5000);