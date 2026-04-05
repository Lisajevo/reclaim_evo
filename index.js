const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log('--- AuJoulé Sovereign Bridge v3.6.9 ---');

let engineStatus = "OFFLINE";
setInterval(() => {
    exec('tasklist /FI "IMAGENAME eq engine.exe"', (err, stdout) => {
        engineStatus = stdout.includes('engine.exe') ? "RESONANCE" : "DISSONANCE";
    });
}, 2000);

http.createServer((req, res) => {
    if (req.url === '/data') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ 
            status: engineStatus, 
            factor: engineStatus === "RESONANCE" ? 1.5 : 0.2 
        }));
    }

    let filePath = '.' + (req.url === '/' ? '/index.html' : req.url);
    const ext = path.extname(filePath);
    const types = { 
        '.html': 'text/html', 
        '.js': 'text/javascript', 
        '.css': 'text/css', 
        '.svg': 'image/svg+xml', 
        '.jpg': 'image/jpeg',
        '.png': 'image/png'
    };
    
    fs.readFile(filePath, (err, content) => {
        if (err) { res.writeHead(404); res.end("File Not Found"); }
        else { res.writeHead(200, { 'Content-Type': types[ext] || 'text/plain' }); res.end(content); }
    });
}).listen(3000);

console.log('Bridge Live: http://localhost:3000');