import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import * as THREE from 'three';
// import anime from 'animejs/lib/anime.es.js';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Initialize the application
class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupCustomCursor();
        this.setupNavigation();
        this.setupHeroBackground();
        this.setupScrollAnimations();
        this.setupCounterAnimations();
        this.setupFormHandling();
        this.setupSmoothScrolling();
        this.setupParticleSystem();
    }

    // Custom Cursor
    setupCustomCursor() {
        const cursor = document.querySelector('.cursor');
        const follower = document.querySelector('.cursor-follower');
        
        if (!cursor || !follower) return;

        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            gsap.to(cursor, {
                x: mouseX - 10,
                y: mouseY - 10,
                duration: 0.1
            });
        });

        // Smooth follower animation
        const updateFollower = () => {
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            
            gsap.set(follower, {
                x: followerX - 20,
                y: followerY - 20
            });
            
            requestAnimationFrame(updateFollower);
        };
        updateFollower();

        // Cursor interactions
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-item');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                gsap.to(cursor, { scale: 1.5, duration: 0.3 });
                gsap.to(follower, { scale: 1.5, duration: 0.3 });
            });
            
            el.addEventListener('mouseleave', () => {
                gsap.to(cursor, { scale: 1, duration: 0.3 });
                gsap.to(follower, { scale: 1, duration: 0.3 });
            });
        });
    }

    // Navigation
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section');
        
        // Smooth scroll to sections
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('data-section');
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    gsap.to(window, {
                        duration: 1.5,
                        scrollTo: targetSection,
                        ease: "power2.inOut"
                    });
                }
            });
        });

        // CTA buttons
        const ctaButtons = document.querySelectorAll('[data-section]');
        ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const targetId = button.getAttribute('data-section');
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    gsap.to(window, {
                        duration: 1.5,
                        scrollTo: targetSection,
                        ease: "power2.inOut"
                    });
                }
            });
        });

        // Active nav link highlighting
        ScrollTrigger.batch(sections, {
            onEnter: (elements) => {
                elements.forEach(section => {
                    const id = section.getAttribute('id');
                    const navLink = document.querySelector(`[data-section="${id}"]`);
                    
                    navLinks.forEach(link => link.classList.remove('active'));
                    if (navLink) navLink.classList.add('active');
                });
            },
            onLeave: (elements) => {
                // Handle leave if needed
            }
        });
    }

    // Hero Background with Three.js
    setupHeroBackground() {
        const canvas = document.getElementById('hero-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance

        // Create a more optimized particle system
        const particleCount = 80; // Further reduced for better performance
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount * 3; i += 3) {
            // Spread particles more widely and avoid center area
            let x, y, z;
            do {
                x = (Math.random() - 0.5) * 250;
                y = (Math.random() - 0.5) * 250;
                z = (Math.random() - 0.5) * 120;
            } while (Math.abs(x) < 50 && Math.abs(y) < 40); // Larger exclusion zone
            
            positions[i] = x;
            positions[i + 1] = y;
            positions[i + 2] = z;

            // Vary colors between cyan and darker cyan
            const intensity = 0.4 + Math.random() * 0.3; // Slightly more visible
            colors[i] = 0 * intensity;     // R
            colors[i + 1] = 0.83 * intensity; // G
            colors[i + 2] = 1 * intensity;     // B
            
            // Vary sizes
            sizes[i / 3] = Math.random() * 2 + 1;
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const particleMaterial = new THREE.PointsMaterial({
            size: 1.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.6, // Slightly more visible
            blending: THREE.AdditiveBlending
        });

        const particleSystem = new THREE.Points(particles, particleMaterial);
        scene.add(particleSystem);

        // Simplified geometric lines for better performance
        const lineGeometry = new THREE.BufferGeometry();
        const linePositions = [];
        const lineColors = [];
        
        // Create fewer lines for better performance
        for (let i = 0; i < 12; i++) {
            const x1 = (Math.random() - 0.5) * 200;
            const y1 = (Math.random() - 0.5) * 200;
            const z1 = (Math.random() - 0.5) * 60;
            
            const x2 = x1 + (Math.random() - 0.5) * 40;
            const y2 = y1 + (Math.random() - 0.5) * 40;
            const z2 = z1 + (Math.random() - 0.5) * 30;
            
            linePositions.push(x1, y1, z1, x2, y2, z2);
            
            // Subtle line colors
            const intensity = 0.25;
            lineColors.push(0, 0.83 * intensity, 1 * intensity);
            lineColors.push(0, 0.83 * intensity, 1 * intensity);
        }
        
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));
        
        const lineMaterial = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.4
        });
        
        const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(lines);

        camera.position.z = 50;

        // Optimized animation with requestAnimationFrame throttling
        let lastTime = 0;
        const animate = (currentTime) => {
            requestAnimationFrame(animate);
            
            // Throttle to ~60fps max
            if (currentTime - lastTime < 16) return;
            lastTime = currentTime;
            
            particleSystem.rotation.x += 0.0003; // Even slower for smoother feel
            particleSystem.rotation.y += 0.0007;
            
            lines.rotation.x += 0.0002;
            lines.rotation.y += 0.0005;
            
            renderer.render(scene, camera);
        };
        animate();

        // Handle resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // Scroll Animations
    setupScrollAnimations() {
        // Fade in animations
        gsap.utils.toArray('.fade-in').forEach(element => {
            gsap.fromTo(element, 
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    scrollTrigger: {
                        trigger: element,
                        start: "top 80%",
                        end: "bottom 20%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Timeline animations
        gsap.utils.toArray('.timeline-item').forEach((item, index) => {
            gsap.fromTo(item,
                { opacity: 0, x: index % 2 === 0 ? -100 : 100 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 1,
                    scrollTrigger: {
                        trigger: item,
                        start: "top 80%",
                        end: "bottom 20%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Project cards animation
        gsap.utils.toArray('.project-card').forEach((card, index) => {
            gsap.fromTo(card,
                { opacity: 0, y: 100, scale: 0.8 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1,
                    delay: index * 0.2,
                    scrollTrigger: {
                        trigger: card,
                        start: "top 80%",
                        end: "bottom 20%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Skills animation
        gsap.utils.toArray('.skill-item').forEach((skill, index) => {
            gsap.fromTo(skill,
                { opacity: 0, scale: 0 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: "back.out(1.7)",
                    scrollTrigger: {
                        trigger: skill,
                        start: "top 80%",
                        end: "bottom 20%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Section titles animation
        gsap.utils.toArray('.section-title').forEach(title => {
            gsap.fromTo(title,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    scrollTrigger: {
                        trigger: title,
                        start: "top 80%",
                        end: "bottom 20%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
    }

    // Counter Animations
    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const suffix = counter.textContent.includes('B') ? 'B+' : 
                          counter.textContent.includes('K') ? 'K+' : 
                          counter.textContent.includes('%') ? '%' : '+';
            
            ScrollTrigger.create({
                trigger: counter,
                start: "top 80%",
                onEnter: () => {
                    // anime({
                    //     targets: counter,
                    //     innerHTML: [0, target],
                    //     duration: 2000,
                    //     round: 1,
                    //     easing: 'easeOutExpo',
                    //     update: function(anim) {
                    //         counter.innerHTML = Math.round(anim.animatables[0].target.innerHTML) + suffix;
                    //     }
                    // });
                    
                    // Alternative counter animation using GSAP
                    gsap.to(counter, {
                        innerHTML: target,
                        duration: 2,
                        ease: "power2.out",
                        snap: { innerHTML: 1 },
                        onUpdate: function() {
                            counter.innerHTML = Math.round(counter.innerHTML) + suffix;
                        }
                    });
                }
            });
        });
    }

    // Form Handling
    setupFormHandling() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Simulate form submission
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                submitButton.textContent = 'Message Sent!';
                submitButton.style.background = 'linear-gradient(135deg, #00ff88, #00d4ff)';
                
                // Reset form
                form.reset();
                
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    submitButton.style.background = '';
                }, 3000);
            }, 2000);
        });

        // Form field animations
        const formFields = form.querySelectorAll('input, textarea');
        formFields.forEach(field => {
            field.addEventListener('focus', () => {
                gsap.to(field, {
                    scale: 1.02,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
            
            field.addEventListener('blur', () => {
                gsap.to(field, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
    }

    // Smooth Scrolling
    setupSmoothScrolling() {
        // Scroll indicator animation
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                gsap.to(window, {
                    duration: 1.5,
                    scrollTo: "#about",
                    ease: "power2.inOut"
                });
            });
        }

        // Parallax effects
        gsap.utils.toArray('.hero-bg').forEach(bg => {
            gsap.to(bg, {
                yPercent: -50,
                ease: "none",
                scrollTrigger: {
                    trigger: bg,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });
    }

    // Particle System for sections
    setupParticleSystem() {
        // Add floating particles to sections
        const sections = document.querySelectorAll('section');
        
        sections.forEach((section, index) => {
            if (index % 2 === 0) return; // Only add to alternate sections
            
            for (let i = 0; i < 5; i++) {
                const particle = document.createElement('div');
                particle.className = 'floating-particle';
                particle.style.cssText = `
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    background: linear-gradient(45deg, #00d4ff, #00ff88);
                    border-radius: 50%;
                    opacity: 0.6;
                    pointer-events: none;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                `;
                
                section.style.position = 'relative';
                section.appendChild(particle);
                
                // Animate particles
                gsap.to(particle, {
                    y: -100,
                    x: Math.random() * 100 - 50,
                    rotation: 360,
                    duration: 10 + Math.random() * 10,
                    repeat: -1,
                    ease: "none"
                });
                
                gsap.to(particle, {
                    opacity: 0.2,
                    duration: 2 + Math.random() * 2,
                    repeat: -1,
                    yoyo: true,
                    ease: "power2.inOut"
                });
            }
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Loading animation
window.addEventListener('load', () => {
    gsap.to('.hero-title .title-line', {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
    });
});

// Add some interactive hover effects
document.addEventListener('DOMContentLoaded', () => {
    // Button hover effects
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });

    // Project card hover effects
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -10,
                boxShadow: "0 20px 40px rgba(0, 212, 255, 0.3)",
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                boxShadow: "0 0 0 rgba(0, 212, 255, 0)",
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
});

