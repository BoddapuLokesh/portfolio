// Portfolio JavaScript Functionality

document.addEventListener('DOMContentLoaded', () => {
    // Typewriter Effect for Hero Section
    function initTypewriter() {
        const typewriterElement = document.querySelector('.typewriter');
        const typewriterSubtitle = document.querySelector('.typewriter-subtitle');
        
        // Main title typewriter effect
        if (typewriterElement) {
            const text = typewriterElement.dataset.text;
            typewriterElement.innerHTML = '';
            
            let i = 0;
            const SPEED = 100; // ms per character reference for timing
            const start = performance.now() + 800; // delay
            function step(ts){
                if (ts < start) return requestAnimationFrame(step);
                const elapsed = ts - start;
                const targetIndex = Math.min(text.length, Math.floor(elapsed / SPEED));
                if (targetIndex !== i){
                    typewriterElement.textContent = text.slice(0, targetIndex);
                    i = targetIndex;
                }
                if (i < text.length) {
                    requestAnimationFrame(step);
                }
            }
            requestAnimationFrame(step);
        }
        
        // Subtitle rotating typewriter effect
        if (typewriterSubtitle) {
            const texts = typewriterSubtitle.dataset.texts.split(',');
            let currentTextIndex = 0;
            let currentCharIndex = 0;
            let isDeleting = false;
            
            let nextSwitch = performance.now() + 2000; // wait after full word
            let lastTs = performance.now();
            function rotate(ts){
                const dt = ts - lastTs; lastTs = ts;
                const currentText = texts[currentTextIndex];
                if (!isDeleting) {
                    if (currentCharIndex < currentText.length) {
                        currentCharIndex += (dt / 150); // speed factor
                        typewriterSubtitle.textContent = currentText.slice(0, Math.min(currentText.length, Math.floor(currentCharIndex)));
                        if (Math.floor(currentCharIndex) >= currentText.length){
                            isDeleting = true; nextSwitch = ts + 2000; // pause before delete
                        }
                    }
                } else {
                    if (ts >= nextSwitch){
                        currentCharIndex -= (dt / 50);
                        typewriterSubtitle.textContent = currentText.slice(0, Math.max(0, Math.floor(currentCharIndex)));
                        if (currentCharIndex <= 0){
                            isDeleting = false; currentTextIndex = (currentTextIndex + 1) % texts.length; currentCharIndex = 0;
                        }
                    }
                }
                requestAnimationFrame(rotate);
            }
            setTimeout(()=>requestAnimationFrame(rotate), 2000);
        }
    }
    
    // Initialize typewriter effects
    initTypewriter();

    // Parallax effect for hero particles
    function initParallaxEffect() {
        const hero = document.querySelector('.hero');
        const particles = document.querySelectorAll('.particle');
        
        if (!hero || particles.length === 0) return;
        
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;
        
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            particles.forEach((particle, index) => {
                const speed = (index + 1) * 0.5;
                const translateX = x * speed * 20;
                const translateY = y * speed * 20;
                
                particle.style.transform = `translate(${translateX}px, ${translateY}px)`;
            });
        });
        
        hero.addEventListener('mouseleave', () => {
            particles.forEach(particle => {
                particle.style.transform = 'translate(0px, 0px)';
            });
        });
    }
    
    // Initialize parallax effect
    initParallaxEffect();

    // Mobile Navigation Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close mobile menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (hamburger && navMenu && !hamburger.contains(event.target) && !navMenu.contains(event.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Native smooth scrolling handled via CSS (scroll-behavior). Only prevent default if fragment is '#'.
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') e.preventDefault();
        });
    });

    // Active Navigation Link Highlighting
    // Active Navigation Link Highlighting via IntersectionObserver
    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const id = entry.target.id; if (!id) return;
            navLinks.forEach(l => {
                const match = l.getAttribute('href') === `#${id}`;
                l.classList.toggle('active', match);
                if (match) { l.setAttribute('aria-current','true'); } else { l.removeAttribute('aria-current'); }
            });
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('section[id]').forEach(sec => sectionObserver.observe(sec));

    // Navbar Background Change on Scroll
    const navbar = document.querySelector('.navbar');
    function updateNavbarOnScroll() {
        if (!navbar) return;
        const scrolled = window.scrollY > 50;
        navbar.classList.toggle('navbar--scrolled', scrolled);
    }

    // Scroll Event Listeners
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => { updateNavbarOnScroll(); ticking = false; });
            ticking = true;
        }
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    // Removed scroll-triggered fade-in animations for a cleaner, instant render

    // These elements don't exist in current HTML - removing unused code

    // Optimized: Single hover effect for project cards using CSS transitions

    // Contact Form Handling - FIXED
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = formData.get('name').trim();
            const email = formData.get('email').trim();
            const subject = formData.get('subject').trim();
            const message = formData.get('message').trim();

            // Basic form validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            // Simulate API call delay
            setTimeout(() => {
                showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            }, 1500);
        });
    }

    // Email Validation Helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification System - ENHANCED
    function showNotification(message, type = 'info') {
        document.querySelectorAll('.notification').forEach(n => n.remove());
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.setAttribute('role','status');
        notification.setAttribute('aria-live','polite');
        notification.innerHTML = `<div class="notification-content"><span class="notification-message">${message}</span><button class="notification-close" type="button" aria-label="Close notification">×</button></div>`;
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => dismiss());
        function dismiss(){
            notification.classList.remove('notification--visible');
            setTimeout(()=>notification.remove(),300);
        }
        document.body.appendChild(notification);
        requestAnimationFrame(()=>notification.classList.add('notification--visible'));
        setTimeout(()=>dismiss(), 5000);
    }

    // Removed hero fade-in animation for immediate content visibility

    // Optimized parallax with requestAnimationFrame and throttling
    // Parallax (respect reduced motion)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) {
        let parallaxTicking = false;
        const heroSection = document.querySelector('.hero');
        function parallaxEffect() {
            if (parallaxTicking || !heroSection) return;
            parallaxTicking = true;
            requestAnimationFrame(() => {
                if (window.innerWidth > 768) {
                    const scrolled = window.pageYOffset;
                    if (scrolled < window.innerHeight) {
                        heroSection.style.transform = `translateY(${scrolled * -0.1}px)`;
                    }
                }
                parallaxTicking = false;
            });
        }
        window.addEventListener('scroll', parallaxEffect, { passive: true });
    }

    // Achievements horizontal-on-vertical scroll (pinned)
    const achWrap = document.querySelector('#achievements.achievements--hscroll');
    const achRow = document.querySelector('#achievements.achievements--hscroll .achievements-grid');
    if (achWrap && achRow) {
        function layoutAchHScroll() {
            // Enable pinned behavior only on larger screens
            const enablePinned = window.innerWidth > 900;
            if (!enablePinned) {
                achWrap.style.removeProperty('--ach-h');
                achWrap.removeAttribute('data-hscroll-ready');
                achRow.style.transform = 'none';
                return;
            }
            const navbarH = (document.querySelector('.navbar')?.offsetHeight || 70);
            const viewportH = window.innerHeight;
            const stickyH = viewportH - navbarH - 16;
            const container = achWrap.querySelector('.container');
            const overflowX = Math.max(0, achRow.scrollWidth - container.clientWidth);
            const SPEED_RATIO = 1.8;
            const travel = overflowX * SPEED_RATIO + 300;
            achWrap.style.setProperty('--ach-h', `${Math.max(travel, stickyH + 200)}px`);
            achWrap.setAttribute('data-hscroll-ready', 'true');
        }

        let rafA;
        function onAchHScroll() {
            if (window.innerWidth <= 900) return; // disable on small screens
            const rect = achWrap.getBoundingClientRect();
            const navbarH = (document.querySelector('.navbar')?.offsetHeight || 70);
            const start = navbarH;
            const end = window.innerHeight;
            const container = achWrap.querySelector('.container');
            const maxX = Math.max(0, achRow.scrollWidth - container.clientWidth);

            if (rect.top <= start && rect.bottom > end) {
                const totalRange = rect.height - end + start;
                const progress = Math.min(1, Math.max(0, (start - rect.top) / Math.max(1, totalRange)));
                const tx = -progress * maxX;
                achRow.style.transform = `translate3d(${tx}px,0,0)`;
            } else if (rect.top > start) {
                achRow.style.transform = 'translate3d(0,0,0)';
            } else if (rect.bottom <= end) {
                achRow.style.transform = `translate3d(${-maxX}px,0,0)`;
            }
        }

        function onScrollAch() { if (rafA) return; rafA = requestAnimationFrame(() => { onAchHScroll(); rafA = null; }); }

        layoutAchHScroll();
        onAchHScroll();
        window.addEventListener('resize', () => { layoutAchHScroll(); onAchHScroll(); });
        window.addEventListener('scroll', onScrollAch, { passive: true });
    }

    // Skills horizontal-on-vertical scroll (pinned): map section scroll progress to X translate
    const skillsSection = document.querySelector('.skills.skills--hscroll');
    const skillsRow = document.querySelector('.skills.skills--hscroll .skills-grid-min');
    if (skillsSection && skillsRow) {
        // Prepare heights so vertical scroll length equals the horizontal overflow we need
        function layoutHScroll() {
            const enablePinned = window.innerWidth > 900;
            if (!enablePinned) {
                skillsSection.style.removeProperty('--hscroll-height');
                skillsSection.removeAttribute('data-hscroll-ready');
                skillsRow.style.transform = 'none';
                return;
            }
            const navbarH = (document.querySelector('.navbar')?.offsetHeight || 70);
            const viewportH = window.innerHeight;
            const stickyH = viewportH - navbarH - 16; // padding allowance
            const container = skillsSection.querySelector('.container');
            const overflowX = Math.max(0, skillsRow.scrollWidth - container.clientWidth);
            const SPEED_RATIO = 1.8; // >1 means slower horizontal movement per vertical pixel
            const travel = overflowX * SPEED_RATIO + 300;
            skillsSection.style.setProperty('--hscroll-height', `${Math.max(travel, stickyH + 200)}px`);
            skillsSection.setAttribute('data-hscroll-ready', 'true');
        }

        let rAF;
        function onHScroll() {
            if (window.innerWidth <= 900) return; // disable on small screens
            const rect = skillsSection.getBoundingClientRect();
            const navbarH = (document.querySelector('.navbar')?.offsetHeight || 70);
            const start = navbarH; // when section top hits sticky top
            const end = window.innerHeight; // when section bottom leaves viewport
            const container = skillsSection.querySelector('.container');
            const maxX = Math.max(0, skillsRow.scrollWidth - container.clientWidth);

            if (rect.top <= start && rect.bottom > end) {
                // progress from 0..1 while pinned
                const totalRange = rect.height - end + start;
                const progress = Math.min(1, Math.max(0, (start - rect.top) / Math.max(1, totalRange)));
                const tx = -progress * maxX;
                skillsRow.style.transform = `translate3d(${tx}px,0,0)`;
            } else if (rect.top > start) {
                skillsRow.style.transform = 'translate3d(0,0,0)';
            } else if (rect.bottom <= end) {
                skillsRow.style.transform = `translate3d(${-maxX}px,0,0)`;
            }
        }

        // throttle via rAF
        function onScrollPinned() {
            if (rAF) return; rAF = requestAnimationFrame(() => { onHScroll(); rAF = null; });
        }

        layoutHScroll();
        onHScroll();
        window.addEventListener('resize', () => { layoutHScroll(); onHScroll(); });
        window.addEventListener('scroll', onScrollPinned, { passive: true });
    }

    // Button Click Effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.className = 'ripple-circle';
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation keyframes and other styles
    // (Removed dynamic <style> injection; ripple & notification styles now in stylesheet)

    // Removed section reveal-on-scroll fades

    // Handle resize events
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Close mobile menu on resize to desktop
            if (window.innerWidth > 768 && hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }, 250);
    });

    // Add loading state management
    document.body.classList.add('loaded');

    // Console welcome message
    console.log('%c👋 Welcome to Lokesh Boddapu\'s Portfolio!', 'color: #2C3E50; font-size: 16px; font-weight: bold;');
    console.log('%cFeel free to explore the code and connect with me!', 'color: #8B7355; font-size: 14px;');
    
    // Performance monitoring
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`%cPage loaded in ${Math.round(loadTime)}ms`, 'color: #34495E;');
    });
});