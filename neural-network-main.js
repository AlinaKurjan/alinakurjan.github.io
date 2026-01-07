// Main Neural Network Visualization (Full Screen Hero)
console.log('Loading neural-network-main.js...');

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNeuralNetwork);
} else {
    initNeuralNetwork();
}

function initNeuralNetwork() {
    console.log('Initializing neural network...');
    
    const canvas = document.getElementById('main-canvas');
    if (!canvas) {
        console.error('Canvas element with id "main-canvas" not found!');
        return;
    }
    console.log('Canvas found:', canvas);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Could not get 2D context from canvas!');
        return;
    }
    console.log('Canvas context obtained');
    
    // Configuration
    const config = {
        centerX: 0,
        centerY: 0,
        symmetry: 6,
        maxNodes: 150,
        nodeGrowthRate: 1.5,
        connectionDistance: 150,
        pulseSpeed: 0.002,
        nodeColor: '#00ffff',
        connectionColor: '#00ffff',
        glowIntensity: 15,
        initials: 'AK',
        initialsVisible: false  // Disabled - keeping network clean
    };
    
    // Set canvas to full window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        config.centerX = canvas.width / 2;
        config.centerY = canvas.height / 2;
    }
    
    resizeCanvas();
    
    let nodes = [];
    let time = 0;
    let targetNodeCount = 80;
    let cycleState = 'growing';
    let fadeAmount = 0;
    let cycleTime = 0;
    let cycleDuration = 30;
    
    class Node {
        constructor(angle, birthTime) {
            this.radius = 40 + Math.random() * 20;
            this.targetRadius = 150 + Math.random() * 300;
            this.angle = angle;
            this.speed = 0.3 + Math.random() * 0.4;
            this.birthTime = birthTime;
            this.age = 0;
            this.baseSize = 2 + Math.random() * 2;
            this.pulseOffset = Math.random() * Math.PI * 2;
            this.opacity = 0;
            this.targetOpacity = 0.7 + Math.random() * 0.3;
            this.connections = [];
        }
        
        getPosition(symmetryIndex = 0) {
            const angle = this.angle + (symmetryIndex * (Math.PI * 2 / config.symmetry));
            return {
                x: config.centerX + Math.cos(angle) * this.radius,
                y: config.centerY + Math.sin(angle) * this.radius
            };
        }
        
        update(time) {
            this.age = time - this.birthTime;
            
            if (this.radius < this.targetRadius) {
                this.radius += this.speed;
            }
            
            if (this.opacity < this.targetOpacity && this.age < 2) {
                this.opacity += 0.02;
            }
            
            const distanceToTarget = this.targetRadius - this.radius;
            if (distanceToTarget < 50) {
                this.opacity = Math.max(0, this.targetOpacity * (distanceToTarget / 50));
            }
            
            this.size = this.baseSize + Math.sin(time * 2 + this.pulseOffset) * 0.5;
        }
        
        draw(ctx, time, symmetryIndex, globalFade = 1) {
            const pos = this.getPosition(symmetryIndex);
            const pulse = Math.sin(time * 3 + this.pulseOffset) * 0.3 + 0.7;
            
            ctx.shadowBlur = config.glowIntensity * pulse;
            ctx.shadowColor = config.nodeColor;
            
            ctx.fillStyle = config.nodeColor;
            ctx.globalAlpha = this.opacity * pulse * globalFade;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
        }
    }
    
    function createNode() {
        const angle = Math.random() * Math.PI * 2;
        nodes.push(new Node(angle, time));
    }
    
    function drawInitials(ctx, time) {
        if (!config.initialsVisible) return;
        
        const pulse = Math.sin(time * 1.5) * 0.2 + 0.8;
        
        const dissolveStart = 1;
        const dissolveDuration = 5;
        let dissolveAmount = 0;
        
        if (cycleTime > dissolveStart) {
            const linearProgress = Math.min(1, (cycleTime - dissolveStart) / dissolveDuration);
            dissolveAmount = linearProgress * linearProgress;
        }
        
        if (dissolveAmount >= 1) {
            return;
        }
        
        ctx.font = '300 53px "Helvetica Neue", "Arial", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const mainOpacity = (0.9 * pulse) * (1 - dissolveAmount * 0.8);
        
        ctx.shadowBlur = 30 * pulse;
        ctx.shadowColor = config.nodeColor;
        
        ctx.fillStyle = config.nodeColor;
        ctx.globalAlpha = mainOpacity;
        
        if (dissolveAmount > 0) {
            ctx.save();
            
            const fragments = 12;
            for (let i = 0; i < fragments; i++) {
                const angle = (i / fragments) * Math.PI * 2;
                const distance = dissolveAmount * 150 * (0.5 + Math.sin(time * 3 + i) * 0.5);
                const fragmentOpacity = (1 - dissolveAmount) * 0.4;
                
                ctx.globalAlpha = fragmentOpacity * pulse;
                ctx.shadowBlur = 20 * pulse;
                
                const offsetX = Math.cos(angle) * distance;
                const offsetY = Math.sin(angle) * distance;
                ctx.fillText(config.initials, config.centerX + offsetX, config.centerY + offsetY);
            }
            
            ctx.restore();
        }
        
        const shakeX = dissolveAmount > 0 ? (Math.random() - 0.5) * dissolveAmount * 4 : 0;
        const shakeY = dissolveAmount > 0 ? (Math.random() - 0.5) * dissolveAmount * 4 : 0;
        
        ctx.globalAlpha = mainOpacity;
        ctx.fillText(config.initials, config.centerX + shakeX, config.centerY + shakeY);
        
        ctx.globalAlpha = (0.6 * pulse) * (1 - dissolveAmount * 0.6);
        ctx.fillText(config.initials, config.centerX + shakeX, config.centerY + shakeY);
        
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    }
    
    function findConnections() {
        nodes.forEach(node => node.connections = []);
        
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].radius < 50 || nodes[i].opacity < 0.1) continue;
            
            for (let j = i + 1; j < nodes.length; j++) {
                if (nodes[j].radius < 50 || nodes[j].opacity < 0.1) continue;
                
                const pos1 = nodes[i].getPosition(0);
                const pos2 = nodes[j].getPosition(0);
                const dx = pos2.x - pos1.x;
                const dy = pos2.y - pos1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < config.connectionDistance) {
                    nodes[i].connections.push(j);
                }
            }
        }
    }
    
    function drawConnection(node1, node2, time, symmetryIndex, globalFade = 1) {
        const pos1 = node1.getPosition(symmetryIndex);
        const pos2 = node2.getPosition(symmetryIndex);
        
        const pulse = Math.sin(time * 2 + node1.pulseOffset + node2.pulseOffset) * 0.3 + 0.5;
        const opacity = Math.min(node1.opacity, node2.opacity) * pulse * 0.3 * globalFade;
        
        ctx.strokeStyle = config.connectionColor;
        ctx.globalAlpha = opacity;
        ctx.lineWidth = 0.5 + pulse * 0.5;
        ctx.shadowBlur = 5;
        ctx.shadowColor = config.connectionColor;
        
        ctx.beginPath();
        ctx.moveTo(pos1.x, pos1.y);
        ctx.lineTo(pos2.x, pos2.y);
        ctx.stroke();
        
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    }
    
    function animate() {
        time += config.pulseSpeed;
        cycleTime += 1/60;
        
        if (cycleState === 'growing') {
            if (cycleTime > cycleDuration) {
                cycleState = 'fading';
                fadeAmount = 0;
            }
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            if (nodes.length < targetNodeCount && Math.random() < config.nodeGrowthRate / 60) {
                createNode();
            }
            
            if (targetNodeCount < config.maxNodes && Math.random() < 0.002) {
                targetNodeCount += 1;
            }
            
        } else if (cycleState === 'fading') {
            fadeAmount += 0.015;
            
            ctx.fillStyle = `rgba(0, 0, 0, ${0.05 + fadeAmount * 0.2})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            if (fadeAmount >= 1) {
                cycleState = 'resetting';
            }
            
        } else if (cycleState === 'resetting') {
            ctx.fillStyle = 'rgba(0, 0, 0, 1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            nodes = [];
            time = 0;
            cycleTime = 0;
            fadeAmount = 0;
            targetNodeCount = 80;
            // config.initialsVisible stays false - no initials displayed
            
            for (let i = 0; i < 10; i++) {
                createNode();
            }
            
            cycleState = 'growing';
        }
        
        const oldLength = nodes.length;
        nodes = nodes.filter(node => node.opacity > 0.01 || node.radius < node.targetRadius);
        const nodesRemoved = oldLength !== nodes.length;
        
        if (nodesRemoved || Math.floor(time * 100) % 3 === 0) {
            findConnections();
        }
        
        nodes.forEach(node => node.update(time));
        
        const globalFade = cycleState === 'fading' ? 1 - fadeAmount : 1;
        
        if (globalFade > 0) {
            ctx.save();
            ctx.globalAlpha = globalFade;
            drawInitials(ctx, time);
            ctx.restore();
        }
        
        for (let s = 0; s < config.symmetry; s++) {
            nodes.forEach((node, i) => {
                node.connections.forEach(j => {
                    if (j < nodes.length && nodes[j]) {
                        drawConnection(node, nodes[j], time, s, globalFade);
                    }
                });
            });
        }
        
        for (let s = 0; s < config.symmetry; s++) {
            nodes.forEach(node => node.draw(ctx, time, s, globalFade));
        }
        
        requestAnimationFrame(animate);
    }
    
    window.addEventListener('resize', resizeCanvas);
    
    console.log('Creating initial nodes...');
    for (let i = 0; i < 10; i++) {
        createNode();
    }
    findConnections();
    
    console.log('Starting animation with', nodes.length, 'nodes');
    animate();
}

console.log('neural-network-main.js loaded successfully');
