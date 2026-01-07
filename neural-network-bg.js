// Background Neural Network Visualizations (Smaller networks for sections)
(function() {
    const bgCanvases = document.querySelectorAll('.bg-network');
    if (!bgCanvases.length) return;
    
    // Configuration for background networks
    const config = {
        maxNodes: 20, // Much smaller networks
        nodeGrowthRate: 0.3, // Slower growth
        connectionDistance: 120,
        pulseSpeed: 0.001, // Slower pulse
        nodeColor: '#00ffff',
        connectionColor: '#00ffff',
        glowIntensity: 8,
        baseOpacity: 0.4 // Lower opacity for background
    };
    
    class BackgroundNetwork {
        constructor(canvas, sectionName) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.sectionName = sectionName;
            this.nodes = [];
            this.time = 0;
            this.animationId = null;
            
            // Set canvas size
            this.resize();
            
            // Initialize with a few nodes
            for (let i = 0; i < 5; i++) {
                this.createNode();
            }
            
            // Start animation
            this.animate();
        }
        
        resize() {
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;
            this.centerX = this.canvas.width / 2;
            this.centerY = this.canvas.height / 2;
        }
        
        createNode() {
            if (this.nodes.length >= config.maxNodes) return;
            
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * Math.min(this.canvas.width, this.canvas.height) * 0.4;
            
            this.nodes.push({
                x: this.centerX + Math.cos(angle) * distance,
                y: this.centerY + Math.sin(angle) * distance,
                targetX: this.centerX + Math.cos(angle) * distance,
                targetY: this.centerY + Math.sin(angle) * distance,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: 1.5 + Math.random() * 1.5,
                pulseOffset: Math.random() * Math.PI * 2,
                opacity: 0,
                targetOpacity: 0.5 + Math.random() * 0.3,
                birthTime: this.time
            });
        }
        
        updateNodes() {
            this.nodes.forEach(node => {
                // Gentle drift movement
                node.x += node.vx;
                node.y += node.vy;
                
                // Bounce off edges
                if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
                if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;
                
                // Keep in bounds
                node.x = Math.max(0, Math.min(this.canvas.width, node.x));
                node.y = Math.max(0, Math.min(this.canvas.height, node.y));
                
                // Fade in
                const age = this.time - node.birthTime;
                if (node.opacity < node.targetOpacity && age < 3) {
                    node.opacity += 0.01;
                }
            });
        }
        
        findConnections() {
            const connections = [];
            
            for (let i = 0; i < this.nodes.length; i++) {
                for (let j = i + 1; j < this.nodes.length; j++) {
                    const dx = this.nodes[j].x - this.nodes[i].x;
                    const dy = this.nodes[j].y - this.nodes[i].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < config.connectionDistance) {
                        connections.push({ i, j, distance });
                    }
                }
            }
            
            return connections;
        }
        
        drawNode(node) {
            const pulse = Math.sin(this.time * 2 + node.pulseOffset) * 0.3 + 0.7;
            
            this.ctx.shadowBlur = config.glowIntensity * pulse;
            this.ctx.shadowColor = config.nodeColor;
            
            this.ctx.fillStyle = config.nodeColor;
            this.ctx.globalAlpha = node.opacity * pulse * config.baseOpacity;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.globalAlpha = 1;
            this.ctx.shadowBlur = 0;
        }
        
        drawConnection(node1, node2, distance) {
            const pulse = Math.sin(this.time + node1.pulseOffset + node2.pulseOffset) * 0.2 + 0.5;
            const opacity = Math.min(node1.opacity, node2.opacity) * pulse * 0.2 * config.baseOpacity;
            const strengthByDistance = 1 - (distance / config.connectionDistance);
            
            this.ctx.strokeStyle = config.connectionColor;
            this.ctx.globalAlpha = opacity * strengthByDistance;
            this.ctx.lineWidth = 0.5;
            this.ctx.shadowBlur = 3;
            this.ctx.shadowColor = config.connectionColor;
            
            this.ctx.beginPath();
            this.ctx.moveTo(node1.x, node1.y);
            this.ctx.lineTo(node2.x, node2.y);
            this.ctx.stroke();
            
            this.ctx.globalAlpha = 1;
            this.ctx.shadowBlur = 0;
        }
        
        animate() {
            this.time += config.pulseSpeed;
            
            // Clear canvas
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Occasionally add new nodes
            if (this.nodes.length < config.maxNodes && Math.random() < config.nodeGrowthRate / 60) {
                this.createNode();
            }
            
            // Update nodes
            this.updateNodes();
            
            // Find and draw connections
            const connections = this.findConnections();
            connections.forEach(conn => {
                this.drawConnection(this.nodes[conn.i], this.nodes[conn.j], conn.distance);
            });
            
            // Draw nodes
            this.nodes.forEach(node => this.drawNode(node));
            
            // Continue animation
            this.animationId = requestAnimationFrame(() => this.animate());
        }
        
        destroy() {
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
            }
        }
    }
    
    // Create a network for each background canvas
    const networks = [];
    bgCanvases.forEach(canvas => {
        const sectionName = canvas.getAttribute('data-section');
        networks.push(new BackgroundNetwork(canvas, sectionName));
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        networks.forEach(network => network.resize());
    });
    
    // Optional: Pause animations when section is not visible (performance optimization)
    const observerOptions = {
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const canvas = entry.target;
            const network = networks.find(n => n.canvas === canvas);
            
            if (network) {
                if (entry.isIntersecting) {
                    // Resume animation if paused
                    if (!network.animationId) {
                        network.animate();
                    }
                } else {
                    // Optionally pause animation when not visible
                    // Uncomment the next two lines to enable this optimization
                    // if (network.animationId) {
                    //     cancelAnimationFrame(network.animationId);
                    //     network.animationId = null;
                    // }
                }
            }
        });
    }, observerOptions);
    
    bgCanvases.forEach(canvas => observer.observe(canvas));
})();
