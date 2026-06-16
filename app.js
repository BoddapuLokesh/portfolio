/**
 * Lokesh Boddapu - Portfolio Application Script
 * * Architecture: Modular, Vanilla ES6+, Performance-Optimized
 */

(() => {
    'use strict';

    // --- Configuration ---
    const CONFIG = {
        typewriterSpeed: 90
    };

    // --- Utilities ---
    const $ = (selector, context = document) => context.querySelector(selector);
    const $$ = (selector, context = document) => context.querySelectorAll(selector);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- UI Modules ---
    function initTypewriter() {
        const title = $('.typewriter');
        const subtitle = $('.typewriter-subtitle');

        if (!title && !subtitle) return;

        if (prefersReducedMotion) {
            if (title) title.textContent = title.dataset.text || '';
            if (subtitle) {
                const firstWord = (subtitle.dataset.texts || '').split(',')[0];
                if (firstWord) subtitle.textContent = firstWord;
            }
            return;
        }

        if (title) {
            const text = title.dataset.text || '';
            let charIndex = 0;
            const startTime = performance.now() + 600;

            const typeStep = (timestamp) => {
                if (document.hidden) return requestAnimationFrame(typeStep);
                if (timestamp < startTime) return requestAnimationFrame(typeStep);

                const targetLength = Math.min(text.length, Math.floor((timestamp - startTime) / CONFIG.typewriterSpeed));
                
                if (targetLength !== charIndex) {
                    charIndex = targetLength;
                    title.textContent = text.slice(0, charIndex);
                }
                
                if (charIndex < text.length) {
                    requestAnimationFrame(typeStep);
                }
            };

            title.textContent = '';
            requestAnimationFrame(typeStep);
        }

        if (subtitle) {
            const words = (subtitle.dataset.texts || '').split(',').map(w => w.trim()).filter(Boolean);
            if (!words.length) return;

            let wordIndex = 0;
            let charCount = 0;
            let isDeleting = false;
            let pauseUntil = 0;
            let lastTime = performance.now();

            const loopStep = (timestamp) => {
                if (document.hidden) {
                    lastTime = timestamp;
                    return requestAnimationFrame(loopStep);
                }

                const deltaTime = timestamp - lastTime;
                lastTime = timestamp;
                const currentWord = words[wordIndex];

                if (!isDeleting) {
                    charCount += deltaTime / 140;
                    if (charCount >= currentWord.length) {
                        charCount = currentWord.length;
                        isDeleting = true;
                        pauseUntil = timestamp + 1800;
                    }
                } else if (timestamp > pauseUntil) {
                    charCount -= deltaTime / 110;
                    if (charCount <= 0) {
                        charCount = 0;
                        isDeleting = false;
                        wordIndex = (wordIndex + 1) % words.length;
                    }
                }

                subtitle.textContent = currentWord.slice(0, Math.floor(Math.max(0, Math.min(currentWord.length, charCount))));
                requestAnimationFrame(loopStep);
            };

            requestAnimationFrame(loopStep);
        }
    }

    function initNavigation() {
        const hamburger = $('#hamburger');
        const menu = $('#nav-menu');
        const links = $$('.nav-link');
        const navbar = $('.navbar');

        const toggleMenu = (forceClose = false) => {
            if (!hamburger || !menu) return;
            const isClosing = forceClose || menu.classList.contains('active');
            
            if (isClosing) {
                hamburger.classList.remove('active');
                menu.classList.remove('active');
                document.body.style.overflow = '';
            } else {
                hamburger.classList.add('active');
                menu.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        };

        if (hamburger && menu) {
            hamburger.addEventListener('click', () => toggleMenu());
            
            document.addEventListener('click', (e) => {
                if (!hamburger.contains(e.target) && !menu.contains(e.target)) {
                    toggleMenu(true);
                }
            });
        }

        links.forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href') === '#') e.preventDefault();
                toggleMenu(true);
            });
        });

        const sections = $$('section[id]');
        if (sections.length) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    
                    const id = entry.target.id;
                    links.forEach(link => {
                        const isMatch = link.getAttribute('href') === `#${id}`;
                        link.classList.toggle('active', isMatch);
                        if (isMatch) {
                            link.setAttribute('aria-current', 'true');
                        } else {
                            link.removeAttribute('aria-current');
                        }
                    });
                });
            }, { threshold: 0.5 });

            sections.forEach(section => observer.observe(section));
        }

        if (navbar) {
            let isTicking = false;
            const onScroll = () => {
                if (isTicking) return;
                isTicking = true;
                requestAnimationFrame(() => {
                    navbar.classList.toggle('navbar--scrolled', window.scrollY > 50);
                    isTicking = false;
                });
            };
            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
        }

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 768) toggleMenu(true);
            }, 180);
        }, { passive: true });
    }

    function initParallax() {
        if (prefersReducedMotion) return;
        
        const hero = $('.hero');
        if (!hero) return;
        
        const particles = $$('.particle', hero);
        let rect = hero.getBoundingClientRect();
        
        const updateRect = () => rect = hero.getBoundingClientRect();
        window.addEventListener('resize', updateRect, { passive: true });

        let pointerTicking = false;
        hero.addEventListener('pointermove', (e) => {
            if (pointerTicking) return;
            pointerTicking = true;
            
            requestAnimationFrame(() => {
                if (document.hidden) {
                    pointerTicking = false;
                    return;
                }
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const mouseX = (e.clientX - rect.left - centerX) / centerX;
                const mouseY = (e.clientY - rect.top - centerY) / centerY;

                particles.forEach((particle, index) => {
                    const depthFactor = (index % 2 ? 0.3 : 0.5) * ((index % 3) + 1);
                    const moveX = (mouseX * 14 * depthFactor).toFixed(2);
                    const moveY = (mouseY * 10 * depthFactor).toFixed(2);
                    particle.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
                });
                
                pointerTicking = false;
            });
        }, { passive: true });

        hero.addEventListener('pointerleave', () => {
            particles.forEach(p => p.style.transform = '');
        });

        let scrollTicking = false;
        const onScroll = () => {
            if (scrollTicking) return;
            scrollTicking = true;
            
            requestAnimationFrame(() => {
                if (window.innerWidth > 768 && !document.hidden) {
                    const scrollY = window.pageYOffset;
                    if (scrollY < window.innerHeight) {
                        hero.style.transform = `translateY(${(scrollY * -0.09).toFixed(2)}px)`;
                    }
                }
                scrollTicking = false;
            });
        };
        
        window.addEventListener('scroll', onScroll, { passive: true });
        updateRect();
    }

    function initHorizontalScroll() {
        const setups = [
            { wrapSel: '.skills.skills--hscroll', rowSel: '.skills.skills--hscroll .skills-grid-min', cssVar: '--hscroll-height' },
            { wrapSel: '#achievements.achievements--hscroll', rowSel: '#achievements.achievements--hscroll .achievements-grid', cssVar: '--ach-h' }
        ];

        const getNavHeight = () => $('.navbar')?.offsetHeight || 70;

        const initializeScrollSection = ({ wrapSel, rowSel, cssVar }) => {
            const wrap = $(wrapSel);
            const row = $(rowSel);
            if (!wrap || !row) return;

            let isEnabled = false;
            let maxScrollX = 0;
            let triggerStart = 0;
            let triggerEnd = 0;

            const updateLayout = () => {
                isEnabled = window.innerWidth > 900;
                
                if (!isEnabled) {
                    wrap.style.removeProperty(cssVar);
                    wrap.removeAttribute('data-hscroll-ready');
                    row.style.transform = '';
                    return;
                }

                const container = wrap.querySelector('.container');
                maxScrollX = Math.max(0, row.scrollWidth - container.clientWidth);
                
                const travelDistance = maxScrollX * 1.8 + 300;
                wrap.style.setProperty(cssVar, `${Math.max(travelDistance, window.innerHeight - getNavHeight() + 200)}px`);
                wrap.setAttribute('data-hscroll-ready', 'true');
                
                triggerStart = getNavHeight();
                triggerEnd = window.innerHeight;
            };

            let isTicking = false;
            const onScroll = () => {
                if (!isEnabled || isTicking) return;
                isTicking = true;

                requestAnimationFrame(() => {
                    const rect = wrap.getBoundingClientRect();
                    const totalScrollArea = rect.height - triggerEnd + triggerStart;

                    if (rect.top <= triggerStart && rect.bottom > triggerEnd) {
                        const progress = Math.min(1, Math.max(0, (triggerStart - rect.top) / Math.max(1, totalScrollArea)));
                        row.style.transform = `translate3d(${-progress * maxScrollX}px, 0, 0)`;
                    } else if (rect.top > triggerStart) {
                        row.style.transform = 'translate3d(0, 0, 0)';
                    } else if (rect.bottom <= triggerEnd) {
                        row.style.transform = `translate3d(${-maxScrollX}px, 0, 0)`;
                    }
                    
                    isTicking = false;
                });
            };

            updateLayout();
            onScroll();

            window.addEventListener('resize', () => {
                updateLayout();
                onScroll();
            }, { passive: true });
            
            window.addEventListener('scroll', onScroll, { passive: true });
        };

        setups.forEach(initializeScrollSection);
    }

    function initRippleEffect() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn');
            if (!btn) return;

            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple-circle';
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
            
            btn.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 520);
        });
    }

    // --- Application Initialization ---
    document.addEventListener('DOMContentLoaded', () => {
        // 1. Initialize Critical Visuals & Navigation First
        initTypewriter();
        initNavigation();

        // 2. Defer Non-Critical Effects to keep main thread unblocked
        const defer = window.requestIdleCallback || ((fn) => setTimeout(fn, 50));
        defer(() => {
            initParallax();
            initHorizontalScroll();
            initRippleEffect();
        });

        document.body.classList.add('loaded');
    });

})();