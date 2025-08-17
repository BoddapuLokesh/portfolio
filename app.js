// Portfolio JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Typewriter Effect for Hero Section
    function initTypewriter() {
        const typewriterElement = document.querySelector('.typewriter');
        const typewriterSubtitle = document.querySelector('.typewriter-subtitle');
        
        // Main title typewriter effect
        if (typewriterElement) {
            const text = typewriterElement.dataset.text;
            typewriterElement.innerHTML = '';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    typewriterElement.innerHTML += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                } else {
                    // Remove cursor after typing is complete
                    setTimeout(() => {
                        typewriterElement.style.borderRight = 'none';
                    }, 1000);
                }
            };
            
            // Start typing after a delay
            setTimeout(typeWriter, 800);
        }
        
        // Subtitle rotating typewriter effect
        if (typewriterSubtitle) {
            const texts = typewriterSubtitle.dataset.texts.split(',');
            let currentTextIndex = 0;
            let currentCharIndex = 0;
            let isDeleting = false;
            
            const rotateText = () => {
                const currentText = texts[currentTextIndex];
                
                if (!isDeleting) {
                    typewriterSubtitle.innerHTML = currentText.substring(0, currentCharIndex + 1);
                    currentCharIndex++;
                    
                    if (currentCharIndex === currentText.length) {
                        isDeleting = true;
                        setTimeout(rotateText, 2000); // Wait before deleting
                        return;
                    }
                } else {
                    typewriterSubtitle.innerHTML = currentText.substring(0, currentCharIndex - 1);
                    currentCharIndex--;
                    
                    if (currentCharIndex === 0) {
                        isDeleting = false;
                        currentTextIndex = (currentTextIndex + 1) % texts.length;
                    }
                }
                
                const typingSpeed = isDeleting ? 50 : 150;
                setTimeout(rotateText, typingSpeed);
            };
            
            // Start subtitle typing after main title is done
            setTimeout(rotateText, 2000);
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
            if (entry.isIntersecting) {
                const id = entry.target.id;
                if (!id) return;
                navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
            }
        });
    }, { root: null, threshold: 0.5 });
    document.querySelectorAll('section[id]').forEach(sec => sectionObserver.observe(sec));

    // Navbar Background Change on Scroll
    function updateNavbarOnScroll() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(44, 62, 80, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        }
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
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            notification.remove();
        });

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        
        // Set notification styles based on type
        const colors = {
            success: { bg: '#2C3E50', border: '#8B7355' },
            error: { bg: '#e74c3c', border: '#c0392b' },
            info: { bg: '#34495E', border: '#2C3E50' }
        };

        const color = colors[type] || colors.info;

        notification.innerHTML = `<div class="notification-content"><span class="notification-message">${message}</span><button class="notification-close" type="button" aria-label="Close notification">×</button></div>`;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${color.bg};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            border-left: 4px solid ${color.border};
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            max-width: 400px;
            min-width: 300px;
            transform: translateX(120%);
            transition: transform 0.3s ease;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            line-height: 1.4;
        `;

        const notificationContent = notification.querySelector('.notification-content');
        notificationContent.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 1rem;
        `;

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background 0.3s ease;
            flex-shrink: 0;
        `;

        // Close button functionality
        closeBtn.addEventListener('click', function() {
            if (notification.parentElement) {
                notification.style.transform = 'translateX(120%)';
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 300);
            }
        });

        closeBtn.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(255,255,255,0.2)';
        });

        closeBtn.addEventListener('mouseleave', function() {
            this.style.background = 'none';
        });

        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.transform = 'translateX(120%)';
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
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