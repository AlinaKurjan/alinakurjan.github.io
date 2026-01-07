// Matrix-style name reveal effect
console.log('Loading matrix-name.js...');

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMatrixName);
} else {
    initMatrixName();
}

function initMatrixName() {
    console.log('Initializing Matrix name effect...');
    
    const canvas = document.getElementById('matrix-name-canvas');
    if (!canvas) {
        console.error('Matrix name canvas not found!');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    // Split name into two parts - ALINA on left, KURJAN on right
    const firstName = 'ALINA';
    const lastName = 'KURJAN';
    
    // Responsive font size
    const screenWidth = window.innerWidth;
    let fontSize = 60;
    let letterSpacing = 20;
    let gapBetweenNames = 250;
    
    if (screenWidth < 480) {
        fontSize = 30;
        letterSpacing = 10;
        gapBetweenNames = 80;
    } else if (screenWidth < 768) {
        fontSize = 40;
        letterSpacing = 15;
        gapBetweenNames = 150;
    }
    
    // Set canvas to full width for positioning
    canvas.width = window.innerWidth;
    canvas.height = fontSize + 60;
    
    ctx.font = `700 ${fontSize}px 'Courier New', monospace`;
    ctx.textBaseline = 'middle';
    
    const letterPositions = [];
    
    // Calculate positions for ALINA (left side)
    const firstNameLetters = firstName.split('');
    const tempCtx = document.createElement('canvas').getContext('2d');
    tempCtx.font = ctx.font;
    const firstNameWidth = firstNameLetters.reduce((sum, letter) => 
        sum + tempCtx.measureText(letter).width + letterSpacing, 0
    );
    
    let currentX = (canvas.width / 2) - (gapBetweenNames / 2) - firstNameWidth;
    
    // Create array of delay indices for ALINA and shuffle them
    const firstNameDelays = Array.from({length: firstNameLetters.length}, (_, i) => i);
    shuffleArray(firstNameDelays);
    
    firstNameLetters.forEach((letter, i) => {
        const charWidth = ctx.measureText(letter).width;
        letterPositions.push({
            letter: letter,
            x: currentX,
            y: canvas.height / 2,
            targetY: canvas.height / 2,
            currentY: -fontSize * (1 + Math.random() * 3),
            velocity: 0,
            settled: false,
            glitchChars: '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン',
            glitchTimer: 0,
            glitchDuration: 30 + Math.random() * 30,
            fallDelay: firstNameDelays[i] * 50, // Random timing for ALINA
            digitRain: [],
            isFirstName: true
        });
        currentX += charWidth + letterSpacing;
    });
    
    // Calculate positions for KURJAN (right side)
    const lastNameLetters = lastName.split('');
    currentX = (canvas.width / 2) + (gapBetweenNames / 2);
    
    // Create array of delay indices for KURJAN and shuffle them INDEPENDENTLY
    const lastNameDelays = Array.from({length: lastNameLetters.length}, (_, i) => i);
    shuffleArray(lastNameDelays);
    
    // Both names start at the same time, but with independent random delays
    lastNameLetters.forEach((letter, i) => {
        const charWidth = ctx.measureText(letter).width;
        letterPositions.push({
            letter: letter,
            x: currentX,
            y: canvas.height / 2,
            targetY: canvas.height / 2,
            currentY: -fontSize * (1 + Math.random() * 3),
            velocity: 0,
            settled: false,
            glitchChars: '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン',
            glitchTimer: 0,
            glitchDuration: 30 + Math.random() * 30,
            fallDelay: lastNameDelays[i] * 50, // Independent random timing for KURJAN (starts same time as ALINA)
            digitRain: [],
            isFirstName: false
        });
        currentX += charWidth + letterSpacing;
    });
    
    // Fisher-Yates shuffle algorithm
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    let frameCount = 0;
    let allSettled = false;
    
    // Add matrix rain characters behind falling letters
    function updateDigitalRain(letterObj) {
        // Add new rain drops occasionally
        if (Math.random() < 0.15 && letterObj.digitRain.length < 8) {
            letterObj.digitRain.push({
                char: letterObj.glitchChars[Math.floor(Math.random() * letterObj.glitchChars.length)],
                y: -10,
                speed: 2 + Math.random() * 3,
                opacity: 0.3 + Math.random() * 0.4
            });
        }
        
        // Update and draw rain
        letterObj.digitRain.forEach((drop, index) => {
            drop.y += drop.speed;
            
            // Remove if off screen
            if (drop.y > canvas.height) {
                letterObj.digitRain.splice(index, 1);
            } else {
                ctx.shadowBlur = 5;
                ctx.shadowColor = '#00ffff';
                ctx.fillStyle = '#00ffff';
                ctx.globalAlpha = drop.opacity * 0.4;
                ctx.font = `${fontSize * 0.6}px 'Courier New', monospace`;
                ctx.fillText(drop.char, letterObj.x, drop.y);
                ctx.globalAlpha = 1;
                ctx.shadowBlur = 0;
            }
        });
        
        // Restore font
        ctx.font = `700 ${fontSize}px 'Courier New', monospace`;
    }
    
    function animate() {
        frameCount++;
        
        // Clear canvas with full transparency (no black background)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Add subtle scan line effect across entire canvas
        if (frameCount % 3 === 0) {
            const scanY = (frameCount * 2) % canvas.height;
            ctx.fillStyle = 'rgba(0, 255, 255, 0.03)';
            ctx.fillRect(0, scanY, canvas.width, 2);
        }
        
        let settled = 0;
        
        letterPositions.forEach((letterObj, index) => {
            // Don't start falling until delay is up
            if (frameCount < letterObj.fallDelay) {
                return;
            }
            
            // Update digital rain behind this letter
            if (!letterObj.settled) {
                updateDigitalRain(letterObj);
            }
            
            if (!letterObj.settled) {
                // Apply gravity
                letterObj.velocity += 0.8;
                letterObj.currentY += letterObj.velocity;
                
                // Add occasional binary flashes while falling
                if (Math.random() < 0.08) {
                    const binaryStr = Math.random() < 0.5 ? '0' : '1';
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = '#00ffff';
                    ctx.fillStyle = '#00ffff';
                    ctx.globalAlpha = 0.4;
                    ctx.font = `${fontSize * 0.5}px 'Courier New', monospace`;
                    ctx.fillText(binaryStr, letterObj.x + (Math.random() - 0.5) * 30, letterObj.currentY + (Math.random() - 0.5) * 40);
                    ctx.font = `700 ${fontSize}px 'Courier New', monospace`;
                    ctx.globalAlpha = 1;
                    ctx.shadowBlur = 0;
                }
                
                // Check if reached target
                if (letterObj.currentY >= letterObj.targetY) {
                    letterObj.currentY = letterObj.targetY;
                    letterObj.settled = true;
                    letterObj.velocity = 0;
                    letterObj.glitchTimer = 0;
                    letterObj.digitRain = []; // Clear rain when settled
                }
            }
            
            if (letterObj.settled) {
                settled++;
                
                // Enhanced glitch effect for a short time after settling
                if (letterObj.glitchTimer < letterObj.glitchDuration) {
                    letterObj.glitchTimer++;
                    
                    // Multiple random glitch characters at different positions
                    if (Math.random() < 0.4) {
                        for (let g = 0; g < 3; g++) {
                            const glitchChar = letterObj.glitchChars[
                                Math.floor(Math.random() * letterObj.glitchChars.length)
                            ];
                            
                            // Draw glitch character at slightly offset position
                            const offsetX = (Math.random() - 0.5) * 15;
                            const offsetY = (Math.random() - 0.5) * 15;
                            ctx.shadowBlur = 10;
                            ctx.shadowColor = '#00ffff';
                            ctx.fillStyle = '#00ffff';
                            ctx.globalAlpha = 0.2 + Math.random() * 0.2;
                            ctx.fillText(glitchChar, letterObj.x + offsetX, letterObj.currentY + offsetY);
                        }
                        ctx.shadowBlur = 0;
                        ctx.globalAlpha = 1;
                    }
                    
                    // Occasional horizontal glitch line through the letter
                    if (Math.random() < 0.1) {
                        ctx.fillStyle = '#00ffff';
                        ctx.globalAlpha = 0.3;
                        ctx.fillRect(letterObj.x - 20, letterObj.currentY + (Math.random() - 0.5) * fontSize, 40, 2);
                        ctx.globalAlpha = 1;
                    }
                }
            }
            
            // Draw the letter - no highlighting, just clean cyan
            // Glow effect
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00ffff';
            
            // Main letter
            if (letterObj.settled && letterObj.glitchTimer >= letterObj.glitchDuration) {
                // Final settled state - solid cyan, no highlight
                ctx.fillStyle = '#00ffff';
                ctx.globalAlpha = 1;
            } else {
                // Falling or glitching - slightly dimmer
                ctx.fillStyle = '#00ffff';
                ctx.globalAlpha = letterObj.settled ? 0.8 : 0.6;
            }
            
            ctx.fillText(letterObj.letter, letterObj.x, letterObj.currentY);
            
            // Reset
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
            
            // Trail effect while falling
            if (!letterObj.settled && letterObj.currentY > 0) {
                for (let i = 1; i < 4; i++) {
                    const trailY = letterObj.currentY - (i * 15);
                    if (trailY > 0) {
                        ctx.shadowBlur = 5;
                        ctx.shadowColor = '#00ffff';
                        ctx.fillStyle = '#00ffff';
                        ctx.globalAlpha = 0.3 / i;
                        ctx.fillText(letterObj.letter, letterObj.x, trailY);
                        ctx.shadowBlur = 0;
                    }
                }
                ctx.globalAlpha = 1;
            }
        });
        
        // Check if all letters are settled and done glitching
        if (settled === letterPositions.length && !allSettled) {
            const allDoneGlitching = letterPositions.every(l => 
                l.glitchTimer >= l.glitchDuration
            );
            if (allDoneGlitching) {
                allSettled = true;
                console.log('Matrix name animation complete!');
                
                // Add final pulse effect
                addFinalPulse();
            }
        } else if (!allSettled) {
            // Check if first name is complete
            const firstNameComplete = letterPositions
                .filter(l => l.isFirstName)
                .every(l => l.settled && l.glitchTimer >= l.glitchDuration);
            
            // Check if last name is complete  
            const lastNameComplete = letterPositions
                .filter(l => !l.isFirstName)
                .every(l => l.settled && l.glitchTimer >= l.glitchDuration);
            
            // Add EMP pulse when first name completes
            if (firstNameComplete && !letterPositions[0].firstNamePulsed) {
                letterPositions.forEach(l => { if (l.isFirstName) l.firstNamePulsed = true; });
                addNamePulse(true);
            }
            
            // Add EMP pulse when last name completes
            if (lastNameComplete && letterPositions.find(l => !l.isFirstName) && !letterPositions.find(l => !l.isFirstName).lastNamePulsed) {
                letterPositions.forEach(l => { if (!l.isFirstName) l.lastNamePulsed = true; });
                addNamePulse(false);
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    function addNamePulse(isFirstName) {
        // Brief EMP-style pulse effect when a name completes
        let pulseFrame = 0;
        const maxPulse = 30;
        
        function pulse() {
            pulseFrame++;
            if (pulseFrame > maxPulse) return;
            
            const pulseIntensity = Math.sin((pulseFrame / maxPulse) * Math.PI);
            
            // Draw expanding ring around completed name
            letterPositions.filter(l => l.isFirstName === isFirstName).forEach(letterObj => {
                ctx.strokeStyle = '#00ffff';
                ctx.globalAlpha = 0.3 * (1 - pulseFrame / maxPulse);
                ctx.lineWidth = 2;
                ctx.shadowBlur = 20;
                ctx.shadowColor = '#00ffff';
                ctx.beginPath();
                ctx.arc(letterObj.x, letterObj.currentY, fontSize * pulseFrame / maxPulse * 1.5, 0, Math.PI * 2);
                ctx.stroke();
            });
            
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
            
            if (pulseFrame < maxPulse) {
                requestAnimationFrame(pulse);
            }
        }
        
        pulse();
    }
    
    function addFinalPulse() {
        let pulseFrame = 0;
        const maxPulse = 60;
        
        function pulse() {
            pulseFrame++;
            if (pulseFrame > maxPulse) return;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const pulseIntensity = Math.sin((pulseFrame / maxPulse) * Math.PI);
            
            letterPositions.forEach(letterObj => {
                ctx.shadowBlur = 20 + (pulseIntensity * 15);
                ctx.shadowColor = '#00ffff';
                ctx.fillStyle = '#00ffff';
                ctx.globalAlpha = 0.9 + (pulseIntensity * 0.1);
                ctx.fillText(letterObj.letter, letterObj.x, letterObj.currentY);
            });
            
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
            
            if (pulseFrame < maxPulse) {
                requestAnimationFrame(pulse);
            }
        }
        
        pulse();
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        // Could recalculate positions here for responsive behavior
    });
    
    console.log('Starting Matrix name animation...');
    animate();
}

console.log('matrix-name.js loaded successfully');
