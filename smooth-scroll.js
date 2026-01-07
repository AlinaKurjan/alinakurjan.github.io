// Smooth Scroll Enhancement
console.log('Loading smooth-scroll.js...');

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSmoothScroll);
} else {
    initSmoothScroll();
}

function initSmoothScroll() {
    console.log('Initializing smooth scroll...');
    // Add smooth fade-in animations for sections as they come into view
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px'
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        sectionObserver.observe(section);
    });
    
    // Smooth scroll for any anchor links (if you add navigation later)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Optional: Add a subtle parallax effect to the scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        let lastScrollY = window.scrollY;
        let ticking = false;
        
        function updateScrollIndicator() {
            const scrollY = window.scrollY;
            const opacity = Math.max(0, 1 - (scrollY / 300));
            scrollIndicator.style.opacity = opacity;
            ticking = false;
        }
        
        window.addEventListener('scroll', () => {
            lastScrollY = window.scrollY;
            if (!ticking) {
                window.requestAnimationFrame(updateScrollIndicator);
                ticking = true;
            }
        });
    }
    
    console.log('Smooth scroll initialized successfully');
}

console.log('smooth-scroll.js loaded successfully');
