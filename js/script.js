/* ==========================================================================
   PORTFOLIO SCRIPTS (js/script.js)
   ========================================================================== */


// Immediate Scroll & History Restoration Reset on Page Refresh

if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        if (window.location.hash) {
            history.replaceState(null, document.title, window.location.pathname + window.location.search);
        }
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;




// Projects Horizontal Scroll Rail Controller
        (function() {
            const grid = document.querySelector('.projects-grid');
            const prevBtn = document.getElementById('projects-prev');
            const nextBtn = document.getElementById('projects-next');

            if (grid && prevBtn && nextBtn) {
                const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                const behavior = prefersReducedMotion ? 'auto' : 'smooth';

                const getMetrics = () => {
                    const cards = grid.querySelectorAll('.project-card');
                    if (!cards.length) return { maxScroll: 0, step: 400, positions: [0] };

                    const cWidth = grid.clientWidth;
                    const gap = parseFloat(window.getComputedStyle(grid).gap) || 32;
                    const firstCard = cards[0];
                    const cardW = firstCard.getBoundingClientRect().width;
                    const totalW = (cards.length * cardW) + ((cards.length - 1) * gap);

                    const maxScroll = Math.max(0, Math.ceil(totalW - cWidth));
                    const step = Math.round(cardW + gap);

                    const positions = [0];
                    let pos = 0;
                    while (pos + step < maxScroll) {
                        pos += step;
                        if (maxScroll - pos < step * 0.45) break;
                        positions.push(pos);
                    }
                    positions.push(maxScroll);

                    return {
                        maxScroll,
                        step,
                        positions: Array.from(new Set(positions)).sort((a, b) => a - b)
                    };
                };

                const updateButtonStates = () => {
                    if (grid.clientWidth <= 0) return;
                    const { maxScroll } = getMetrics();

                    if (maxScroll <= 2) {
                        prevBtn.disabled = true;
                        nextBtn.disabled = true;
                        return;
                    }

                    if (grid.scrollLeft > maxScroll) {
                        grid.scrollLeft = maxScroll;
                    }

                    prevBtn.disabled = grid.scrollLeft <= 4;
                    nextBtn.disabled = grid.scrollLeft >= maxScroll - 4;
                };

                const scheduleUpdate = () => {
                    requestAnimationFrame(updateButtonStates);
                    setTimeout(updateButtonStates, 100);
                    setTimeout(updateButtonStates, 300);
                    setTimeout(updateButtonStates, 500);
                };

                const goToNext = () => {
                    if (nextBtn.disabled) return;
                    const { positions, maxScroll } = getMetrics();
                    const current = grid.scrollLeft;
                    const nextPos = positions.find(p => p > current + 4);

                    if (nextPos !== undefined) {
                        grid.scrollTo({ left: nextPos, behavior });
                        if (nextPos >= maxScroll - 4) {
                            nextBtn.disabled = true;
                        }
                        prevBtn.disabled = false;
                        scheduleUpdate();
                    } else {
                        nextBtn.disabled = true;
                    }
                };

                const goToPrev = () => {
                    if (prevBtn.disabled) return;
                    const { positions } = getMetrics();
                    const current = grid.scrollLeft;
                    const prevPositions = positions.filter(p => p < current - 4);

                    if (prevPositions.length > 0) {
                        const prevPos = prevPositions[prevPositions.length - 1];
                        grid.scrollTo({ left: prevPos, behavior });
                        if (prevPos <= 4) {
                            prevBtn.disabled = true;
                        }
                        nextBtn.disabled = false;
                        scheduleUpdate();
                    } else {
                        prevBtn.disabled = true;
                    }
                };

                prevBtn.addEventListener('click', goToPrev);
                nextBtn.addEventListener('click', goToNext);

                grid.addEventListener('keydown', (e) => {
                    if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        goToPrev();
                    } else if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        goToNext();
                    }
                });

                grid.addEventListener('scroll', updateButtonStates, { passive: true });
                if ('onscrollend' in window) {
                    grid.addEventListener('scrollend', updateButtonStates, { passive: true });
                }
                window.addEventListener('resize', updateButtonStates, { passive: true });
                updateButtonStates();
            }
        })();

        // Experience Accordion & Horizontal Gallery Controller
        (function() {
            const accordion = document.getElementById('experience-accordion');
            if (!accordion) return;

            const items = accordion.querySelectorAll('.experience-item');
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const behavior = prefersReducedMotion ? 'auto' : 'smooth';

            // In-memory 16:9 neutral fallback for broken images to strictly prevent layout shifts
            const brokenImageSvg = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360' width='640' height='360'%3E%3Crect width='640' height='360' fill='%23ede8df'/%3E%3Crect x='0.5' y='0.5' width='639' height='359' fill='none' stroke='%23d9d4c9' stroke-width='1'/%3E%3Ctext x='320' y='185' text-anchor='middle' font-family='sans-serif' font-size='13' font-weight='500' fill='%237a766d'%3EImage Unavailable%3C/text%3E%3C/svg%3E";

            function setupGallery(galleryEl) {
                const track = galleryEl.querySelector('.gallery-track-container');
                const inner = galleryEl.querySelector('.gallery-track');
                const prevBtn = galleryEl.querySelector('.gallery-prev');
                const nextBtn = galleryEl.querySelector('.gallery-next');

                if (!track || !inner || !prevBtn || !nextBtn) return null;

                // Handle any broken images gracefully without panel height layout shifts
                galleryEl.querySelectorAll('.gallery-img').forEach((img) => {
                    img.addEventListener('error', function() {
                        if (this.dataset.hasFallback) return;
                        this.dataset.hasFallback = 'true';
                        this.src = brokenImageSvg;
                    });
                    if (!img.complete) {
                        img.addEventListener('load', () => updateControls(), { once: true });
                    }
                });

                const getMetrics = () => {
                    const galleryItems = inner.querySelectorAll('.gallery-item');
                    if (!galleryItems.length) {
                        return { maxScroll: 0, step: 300, positions: [0] };
                    }

                    const cWidth = track.clientWidth;
                    const gap = parseFloat(window.getComputedStyle(inner).gap) || 16;
                    const firstItem = galleryItems[0];
                    const itemW = firstItem.getBoundingClientRect().width;
                    const totalW = (galleryItems.length * itemW) + ((galleryItems.length - 1) * gap);

                    // Strictly constrain the physical width of the track to match content
                    // preventing any extra empty space beyond the final image
                    inner.style.width = Math.ceil(totalW) + 'px';

                    const maxScroll = Math.max(0, Math.ceil(totalW - cWidth));
                    const step = Math.round(itemW + gap);

                    const positions = [0];
                    let pos = 0;
                    while (pos + step < maxScroll) {
                        pos += step;
                        // Avoid micro-steps right before maxScroll
                        if (maxScroll - pos < step * 0.45) break;
                        positions.push(pos);
                    }
                    positions.push(maxScroll);

                    return {
                        maxScroll,
                        step,
                        totalW,
                        cWidth,
                        positions: Array.from(new Set(positions)).sort((a, b) => a - b)
                    };
                };

                const updateControls = () => {
                    if (track.clientWidth <= 0) return;
                    const { maxScroll } = getMetrics();

                    if (maxScroll <= 2) {
                        prevBtn.disabled = true;
                        nextBtn.disabled = true;
                        return;
                    }

                    // Strict boundary guard: clamp scroll position so it never overshoots the final image
                    if (track.scrollLeft > maxScroll) {
                        track.scrollLeft = maxScroll;
                    }

                    prevBtn.disabled = track.scrollLeft <= 3;
                    nextBtn.disabled = track.scrollLeft >= maxScroll - 3;
                };

                const scheduleUpdate = () => {
                    requestAnimationFrame(updateControls);
                    setTimeout(updateControls, 100);
                    setTimeout(updateControls, 300);
                    setTimeout(updateControls, 500);
                };

                const goToNext = () => {
                    if (nextBtn.disabled) return;
                    const { positions, maxScroll } = getMetrics();
                    const current = track.scrollLeft;
                    const nextPos = positions.find(p => p > current + 4);

                    if (nextPos !== undefined) {
                        track.scrollTo({ left: nextPos, behavior });
                        if (nextPos >= maxScroll - 3) {
                            nextBtn.disabled = true;
                        }
                        prevBtn.disabled = false;
                        scheduleUpdate();
                    } else {
                        nextBtn.disabled = true;
                    }
                };

                const goToPrev = () => {
                    if (prevBtn.disabled) return;
                    const { positions } = getMetrics();
                    const current = track.scrollLeft;
                    const prevPositions = positions.filter(p => p < current - 4);

                    if (prevPositions.length > 0) {
                        const prevPos = prevPositions[prevPositions.length - 1];
                        track.scrollTo({ left: prevPos, behavior });
                        if (prevPos <= 4) {
                            prevBtn.disabled = true;
                        }
                        nextBtn.disabled = false;
                        scheduleUpdate();
                    } else {
                        prevBtn.disabled = true;
                    }
                };

                prevBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    goToPrev();
                });

                nextBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    goToNext();
                });

                // Accessible left/right keyboard navigation when track container has focus
                track.addEventListener('keydown', (e) => {
                    if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        goToPrev();
                    } else if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        goToNext();
                    }
                });

                track.addEventListener('scroll', updateControls, { passive: true });
                if ('onscrollend' in window) {
                    track.addEventListener('scrollend', updateControls, { passive: true });
                }
                window.addEventListener('resize', updateControls, { passive: true });

                updateControls();
                return updateControls;
            }

            // Bind each accordion item for independent, smooth toggling
            items.forEach((item) => {
                const trigger = item.querySelector('.experience-trigger');
                const panel = item.querySelector('.experience-panel');
                const galleryEl = item.querySelector('.experience-gallery');
                const updateGallery = galleryEl ? setupGallery(galleryEl) : null;

                if (trigger) {
                    trigger.addEventListener('click', () => {
                        const isExpanded = item.classList.contains('is-expanded');
                        const willExpand = !isExpanded;

                        item.classList.toggle('is-expanded', willExpand);
                        trigger.setAttribute('aria-expanded', willExpand ? 'true' : 'false');

                        if (willExpand && updateGallery) {
                            requestAnimationFrame(updateGallery);
                            setTimeout(updateGallery, 150);
                            setTimeout(updateGallery, 420);
                        }
                    });
                }

                if (panel && updateGallery) {
                    panel.addEventListener('transitionend', (e) => {
                        if (e.target === panel && item.classList.contains('is-expanded')) {
                            updateGallery();
                        }
                    });
                }
            });
        })();

        // 0. SITE PRELOADER (Wordmark Typing & Morph Controller)
        (function() {
            // Guarantee scroll position is at the very top immediately
            if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
            }
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            if (document.body) document.body.scrollTop = 0;



            const preloader = document.getElementById('preloader');
            const headerWordmark = document.querySelector('.site-header .wordmark');
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            if (!preloader) return;

            if (prefersReducedMotion) {
                preloader.remove();
                document.body.classList.remove('is-loading');
                document.documentElement.classList.remove('is-loading-scroll');
                window.scrollTo(0, 0);
                const siteHeader = document.querySelector('.site-header');
                if (siteHeader) siteHeader.classList.add('is-ready');
                window.dispatchEvent(new CustomEvent('preloaderComplete'));
                return;
            }

            const preloaderWordmark = preloader.querySelector('.preloader-wordmark');
            const preloaderText = preloader.querySelector('.preloader-text');
            const preloaderCursor = preloader.querySelector('.preloader-cursor');
            const fullWordmark = 'mrtn.riel';

            if (headerWordmark) {
                headerWordmark.style.opacity = '0';
                headerWordmark.style.transition = 'opacity 200ms ease-out';
            }

            function morphToHeader() {
                window.scrollTo(0, 0);
                document.documentElement.scrollTop = 0;
                if (preloaderCursor) {
                    preloaderCursor.classList.add('is-finished');
                }

                if (headerWordmark && preloaderWordmark) {
                    const target = headerWordmark.getBoundingClientRect();
                    const current = preloaderWordmark.getBoundingClientRect();

                    const deltaX = (target.left + target.width / 2) - (current.left + current.width / 2);
                    const deltaY = (target.top + target.height / 2) - (current.top + current.height / 2);
                    const scale = target.height / current.height;

                    // Glide & scale into header position with custom spring curve
                    preloaderWordmark.style.transition = 'transform 520ms cubic-bezier(0.16, 1, 0.3, 1)';
                    preloaderWordmark.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scale})`;

                    setTimeout(() => {
                        // Docked! Reveal header wordmark and dissolve preloader curtain
                        headerWordmark.style.opacity = '1';
                        preloader.classList.add('is-done');
                        document.body.classList.remove('is-loading');

                        // Reveal navbar items with slow, elegant fade up
                        const siteHeader = document.querySelector('.site-header');
                        if (siteHeader) {
                            siteHeader.classList.add('is-ready');
                        }

                        // Signal preloader completion so hero typing starts
                        window.dispatchEvent(new CustomEvent('preloaderComplete'));

                        setTimeout(() => preloader.remove(), 400);
                    }, 490);
                } else {
                    preloader.classList.add('is-done');
                    document.body.classList.remove('is-loading');
                    const siteHeader = document.querySelector('.site-header');
                    if (siteHeader) siteHeader.classList.add('is-ready');
                    window.dispatchEvent(new CustomEvent('preloaderComplete'));
                    setTimeout(() => preloader.remove(), 400);
                }
            }

            // Wordmark typing animation
            let charIndex = 0;
            function typeChar() {
                if (charIndex < fullWordmark.length) {
                    preloaderText.textContent += fullWordmark.charAt(charIndex);
                    const char = fullWordmark.charAt(charIndex);
                    charIndex++;
                    const delay = (char === '.') ? 140 : 45;
                    setTimeout(typeChar, delay);
                } else {
                    // Brief pause after typing completes, then morph into header
                    setTimeout(morphToHeader, 240);
                }
            }

            // Small initial pause before typing starts so cursor blinks cleanly once
            setTimeout(typeChar, 140);

            window.addEventListener('pageshow', (event) => {
                if (event.persisted) {
                    if ('scrollRestoration' in history) {
                        history.scrollRestoration = 'manual';
                    }
                    window.scrollTo(0, 0);
                    document.documentElement.scrollTop = 0;
                    if (document.body) document.body.scrollTop = 0;
                    const siteHeader = document.querySelector('.site-header');
                    if (siteHeader) siteHeader.classList.add('is-ready');
                }
            });

            window.addEventListener('load', () => {
                window.scrollTo(0, 0);
                document.documentElement.scrollTop = 0;
            });
        })();

        // Unified Typing Animation Controller (Hero & Section Headings)
        (function() {
            document.documentElement.classList.add('js-loaded');
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            // 1. HERO TITLE & REVEAL CHOREOGRAPHY CONTROLLER
            const heroHeading = document.getElementById('hero-title');
            if (heroHeading) {
                const heroContent = heroHeading.closest('.hero-content');
                const heroMedia = document.querySelector('.hero-media');
                const textEl = heroHeading.querySelector('.typing-text');
                const cursor = heroHeading.querySelector('.typing-cursor');
                const fullText = "Hello! I'm Martin";
                let heroTimeout = null;
                let heroTyped = false;

                if (prefersReducedMotion) {
                    window.scrollTo(0, 0);
                    document.documentElement.scrollTop = 0;
                    document.documentElement.classList.remove('is-loading-scroll');
                    if (textEl) textEl.textContent = fullText;
                    if (cursor) cursor.style.display = 'none';
                    if (heroContent) heroContent.classList.add('is-ready');
                    if (heroMedia) heroMedia.classList.add('is-revealed');
                    heroHeading.classList.add('is-active');
                } else if (textEl && cursor) {
                    function typeHero() {
                        clearTimeout(heroTimeout);
                        
                        // Ensure page is strictly anchored at (0, 0) for perfect viewport coordinate calculations
                        window.scrollTo(0, 0);
                        document.documentElement.scrollTop = 0;
                        if (document.body) document.body.scrollTop = 0;

                        // Reset states
                        if (cursor) {
                            cursor.classList.remove('is-finished');
                            cursor.style.display = 'inline-block';
                        }
                        if (heroContent) heroContent.classList.remove('is-ready');
                        if (heroMedia) heroMedia.classList.remove('is-revealed');

                        // 1. Calculate natural position vs viewport center
                        heroHeading.style.transition = 'none';
                        heroHeading.style.transform = 'none';
                        textEl.textContent = fullText;

                        const naturalRect = heroHeading.getBoundingClientRect();
                        textEl.textContent = ''; // clear for typing animation

                        const vpCenterX = window.innerWidth / 2;
                        const vpCenterY = window.innerHeight / 2;
                        const naturalCenterX = naturalRect.left + (naturalRect.width / 2);
                        const naturalCenterY = naturalRect.top + (naturalRect.height / 2);

                        const deltaX = Math.round(vpCenterX - naturalCenterX);
                        const deltaY = Math.round(vpCenterY - naturalCenterY);

                        // Fix min-width during centered typing to prevent horizontal jitter
                        heroHeading.style.minWidth = `${Math.min(Math.ceil(naturalRect.width), window.innerWidth - 32)}px`; heroHeading.style.maxWidth = "calc(100vw - 32px)";
                        // Position heading at exact center of the screen
                        heroHeading.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                        heroHeading.classList.add('is-active');

                        // 2. Centered greeting: type "Hello! I'm Martin"
                        let index = 0;
                        function typeChar() {
                            if (index < fullText.length) {
                                textEl.textContent += fullText.charAt(index);
                                const char = fullText.charAt(index);
                                index++;

                                let delay = 65;
                                if (char === '!') delay = 240;
                                else if (char === ' ') delay = 90;

                                heroTimeout = setTimeout(typeChar, delay);
                            } else {
                                // 3. Once typing is complete, pause briefly then smoothly transition to original layout position
                                heroTimeout = setTimeout(glideToOrigin, 240);
                            }
                        }

                        // 3. Smooth transition to original position
                        function glideToOrigin() {
                            heroHeading.style.transition = 'transform 800ms cubic-bezier(0.16, 1, 0.3, 1)';
                            heroHeading.style.transform = 'translate(0px, 0px)';

                            setTimeout(() => {
                                heroHeading.style.transform = '';
                                heroHeading.style.transition = '';
                                heroHeading.style.minWidth = '';

                                if (cursor) {
                                    cursor.classList.add('is-finished');
                                }

                                // 4. Text and button reveal: fade up remaining text elements and buttons
                                revealTextAndButtons();
                            }, 820);
                        }

                        // 4. Reveal text, buttons & hero image together
                        function revealTextAndButtons() {
                            if (heroContent) {
                                heroContent.classList.add('is-ready');
                            }
                            if (heroMedia) {
                                heroMedia.classList.add('is-revealed');
                            }
                            // Restore smooth scrolling for standard user navigation
                            document.documentElement.classList.remove('is-loading-scroll');
                        }

                        // Start centered typing after brief 80ms delay
                        heroTimeout = setTimeout(typeChar, 80);
                    }

                    window.addEventListener('pageshow', (event) => {
                        if (event.persisted) {
                            window.scrollTo(0, 0);
                            document.documentElement.scrollTop = 0;
                            if (document.body) document.body.scrollTop = 0;
                            document.documentElement.classList.remove('is-loading-scroll');
                            // Back-forward cache restore
                            if (textEl) textEl.textContent = fullText;
                            if (cursor) cursor.classList.add('is-finished');
                            if (heroContent) heroContent.classList.add('is-ready');
                            if (heroMedia) heroMedia.classList.add('is-revealed');
                            heroHeading.classList.add('is-active');
                            heroHeading.style.transform = '';
                            heroHeading.style.minWidth = '';
                        }
                    });

                    // Wait for preloader to dock before typing on initial load
                    const hasPreloader = document.getElementById('preloader');
                    if (hasPreloader && !prefersReducedMotion) {
                        window.addEventListener('preloaderComplete', () => {
                            typeHero();
                        }, { once: true });
                    } else if ('IntersectionObserver' in window) {
                        const heroObserver = new IntersectionObserver((entries) => {
                            entries.forEach((entry) => {
                                if (entry.isIntersecting && !heroTyped) {
                                    heroTyped = true;
                                    typeHero();
                                }
                            });
                        }, { threshold: 0.2 });
                        heroObserver.observe(heroHeading);
                    } else {
                        typeHero();
                    }
                }
            }

            // 2. OTHER SECTION HEADINGS SCROLL-REVEAL TYPING CONTROLLER
            const otherHeadings = document.querySelectorAll('.section-heading h2:not(#about-title):not(#projects-title):not(#stack-title):not(#experience-title):not(#education-title):not(#certificates-title):not(#contact-title)');
            if (otherHeadings.length) {
                otherHeadings.forEach((heading) => {
                    const fullText = heading.textContent.trim();
                    heading.setAttribute('aria-label', fullText);

                    if (prefersReducedMotion) {
                        return; // Respect reduced motion preference; keep static text
                    }

                    // Inject typing elements
                    heading.innerHTML = '<span class="typing-text"></span><span class="typing-cursor" aria-hidden="true"></span>';
                    const textEl = heading.querySelector('.typing-text');
                    const cursor = heading.querySelector('.typing-cursor');
                    let headingTimer = null;
                    let hasTyped = false;

                    function typeHeading() {
                        clearTimeout(headingTimer);
                        textEl.textContent = '';
                        if (cursor) {
                            cursor.classList.remove('is-finished');
                            cursor.style.display = 'inline-block';
                        }

                        let idx = 0;
                        function step() {
                            if (idx < fullText.length) {
                                textEl.textContent += fullText.charAt(idx);
                                const char = fullText.charAt(idx);
                                idx++;
                                const delay = (char === ' ') ? 90 : 55;
                                headingTimer = setTimeout(step, delay);
                            } else if (cursor) {
                                headingTimer = setTimeout(() => {
                                    cursor.classList.add('is-finished');
                                }, 1200);
                            }
                        }
                        headingTimer = setTimeout(step, 100);
                    }

                    if ('IntersectionObserver' in window) {
                        const observer = new IntersectionObserver((entries) => {
                            entries.forEach((entry) => {
                                if (entry.isIntersecting) {
                                    if (!hasTyped) {
                                        hasTyped = true;
                                        typeHeading();
                                    }
                                } else {
                                    // Reset when scrolled out of view so it replays whenever scrolled back into view
                                    hasTyped = false;
                                    textEl.textContent = '';
                                    if (cursor) {
                                        cursor.classList.remove('is-finished');
                                    }
                                }
                            });
                        }, {
                            threshold: 0.2,
                            rootMargin: '0px 0px -40px 0px'
                        });
                        observer.observe(heading);
                    } else {
                        typeHeading();
                    }
                });
            }

            // 3. ABOUT SECTION: CENTERED TITLE TYPING & STAGGERED REVEAL CONTROLLER
            const aboutSection = document.getElementById('about');
            const aboutHeading = document.getElementById('about-title');
            const aboutNarrative = document.querySelector('.about-narrative');
            const aboutMedia = document.querySelector('.about-media');

            if (aboutHeading) {
                const fullText = aboutHeading.textContent.trim();
                aboutHeading.setAttribute('aria-label', fullText);

                if (prefersReducedMotion) {
                    aboutHeading.textContent = fullText;
                    aboutHeading.classList.add('is-active');
                    if (aboutSection) aboutSection.classList.add('is-revealed');
                    if (aboutNarrative) aboutNarrative.classList.add('is-revealed');
                    if (aboutMedia) aboutMedia.classList.add('is-revealed');
                } else {
                    aboutHeading.innerHTML = '<span class="typing-text"></span><span class="typing-cursor" aria-hidden="true"></span>';
                    const textEl = aboutHeading.querySelector('.typing-text');
                    const cursor = aboutHeading.querySelector('.typing-cursor');
                    let aboutTimeout = null;
                    let hasTyped = false;
                    let isAnimating = false;

                    function setAboutRevealed(revealed) {
                        if (aboutSection) {
                            aboutSection.classList.toggle('is-revealed', revealed);
                        }
                        if (aboutNarrative) {
                            aboutNarrative.classList.toggle('is-revealed', revealed);
                        }
                        if (aboutMedia) {
                            aboutMedia.classList.toggle('is-revealed', revealed);
                        }
                    }

                    function typeAbout() {
                        clearTimeout(aboutTimeout);
                        isAnimating = true;

                        // Reset states
                        if (cursor) {
                            cursor.classList.remove('is-finished');
                            cursor.style.display = 'inline-block';
                        }
                        setAboutRevealed(false);

                        // 1. Measure natural layout position & calculate centering delta relative to the About section
                        aboutHeading.style.transition = 'none';
                        aboutHeading.style.transform = 'none';
                        textEl.textContent = fullText;

                        const container = (aboutSection && aboutSection.querySelector('.container')) || aboutSection;
                        const containerRect = container.getBoundingClientRect();
                        const titleRect = aboutHeading.getBoundingClientRect();
                        textEl.textContent = ''; // clear for typing animation

                        // Horizontal center of the About section container:
                        const containerCenterX = containerRect.left + (containerRect.width / 2);
                        const titleCenterX = titleRect.left + (titleRect.width / 2);
                        const deltaX = Math.round(containerCenterX - titleCenterX);

                        // Vertical center within the About section's content area:
                        const containerCenterY = containerRect.top + Math.min(Math.max(containerRect.height * 0.38, 160), 280);
                        const titleCenterY = titleRect.top + (titleRect.height / 2);
                        const deltaY = Math.round(containerCenterY - titleCenterY);

                        // Fix min-width during centered typing to prevent horizontal jitter
                        aboutHeading.style.minWidth = `${Math.min(Math.ceil(titleRect.width), window.innerWidth - 32)}px`; aboutHeading.style.maxWidth = "calc(100vw - 32px)";
                        // Position heading at center of the About section
                        aboutHeading.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                        aboutHeading.classList.add('is-active');

                        // 2. Centered typing: type "About"
                        let index = 0;
                        function typeChar() {
                            if (index < fullText.length) {
                                textEl.textContent += fullText.charAt(index);
                                index++;
                                aboutTimeout = setTimeout(typeChar, 75);
                            } else {
                                // 3. Once typing is complete, pause briefly then smoothly transition to original layout position
                                aboutTimeout = setTimeout(glideToOrigin, 220);
                            }
                        }

                        // 3. Smooth transition to original position
                        function glideToOrigin() {
                            aboutHeading.style.transition = 'transform 750ms cubic-bezier(0.16, 1, 0.3, 1)';
                            aboutHeading.style.transform = 'translate(0px, 0px)';

                            setTimeout(() => {
                                aboutHeading.style.transform = '';
                                aboutHeading.style.transition = '';
                                aboutHeading.style.minWidth = '';

                                if (cursor) {
                                    cursor.classList.add('is-finished');
                                }

                                // 4. Reveal section-index, narrative text, and portrait image AFTER going back
                                setAboutRevealed(true);
                                isAnimating = false;
                            }, 770);
                        }

                        // Start centered typing after brief 80ms delay
                        aboutTimeout = setTimeout(typeChar, 80);
                    }

                    if ('IntersectionObserver' in window) {
                        const aboutObserver = new IntersectionObserver((entries) => {
                            entries.forEach((entry) => {
                                if (entry.isIntersecting && !hasTyped && !isAnimating) {
                                    hasTyped = true;
                                    typeAbout();
                                } else if (!entry.isIntersecting && hasTyped && !isAnimating) {
                                    // Only reset when scrolled completely away (e.g. back up to hero or far below)
                                    if (entry.boundingClientRect.top > window.innerHeight || entry.boundingClientRect.bottom < 0) {
                                        hasTyped = false;
                                        clearTimeout(aboutTimeout);
                                        textEl.textContent = '';
                                        aboutHeading.classList.remove('is-active');
                                        aboutHeading.style.transform = '';
                                        aboutHeading.style.minWidth = '';
                                        if (cursor) {
                                            cursor.classList.remove('is-finished');
                                        }
                                        setAboutRevealed(false);
                                    }
                                }
                            });
                        }, {
                            threshold: 0.2,
                            rootMargin: '0px 0px -50px 0px'
                        });
                        aboutObserver.observe(aboutSection || aboutHeading);
                    } else {
                        typeAbout();
                    }
                }
            }

            // 4. PROJECTS SECTION: CENTERED TITLE TYPING & STAGGERED REVEAL CONTROLLER
            const projectsSection = document.getElementById('projects');
            const projectsHeading = document.getElementById('projects-title');

            if (projectsHeading) {
                const fullText = projectsHeading.textContent.trim();
                projectsHeading.setAttribute('aria-label', fullText);

                if (prefersReducedMotion) {
                    projectsHeading.textContent = fullText;
                    projectsHeading.classList.add('is-active');
                    if (projectsSection) projectsSection.classList.add('is-revealed');
                } else {
                    projectsHeading.innerHTML = '<span class="typing-text"></span><span class="typing-cursor" aria-hidden="true"></span>';
                    const textEl = projectsHeading.querySelector('.typing-text');
                    const cursor = projectsHeading.querySelector('.typing-cursor');
                    let projectsTimeout = null;
                    let hasTyped = false;
                    let isAnimating = false;

                    function setProjectsRevealed(revealed) {
                        if (projectsSection) {
                            projectsSection.classList.toggle('is-revealed', revealed);
                        }
                    }

                    function typeProjects() {
                        clearTimeout(projectsTimeout);
                        isAnimating = true;

                        // Reset states
                        if (cursor) {
                            cursor.classList.remove('is-finished');
                            cursor.style.display = 'inline-block';
                        }
                        setProjectsRevealed(false);

                        // 1. Measure natural layout position & calculate centering delta relative to the Projects section
                        projectsHeading.style.transition = 'none';
                        projectsHeading.style.transform = 'none';
                        textEl.textContent = fullText;

                        const container = (projectsSection && projectsSection.querySelector('.container')) || projectsSection;
                        const containerRect = container.getBoundingClientRect();
                        const titleRect = projectsHeading.getBoundingClientRect();
                        textEl.textContent = ''; // clear for typing animation

                        // Horizontal center of the Projects section container:
                        const containerCenterX = containerRect.left + (containerRect.width / 2);
                        const titleCenterX = titleRect.left + (titleRect.width / 2);
                        const deltaX = Math.round(containerCenterX - titleCenterX);

                        // Vertical center within the Projects section:
                        const containerCenterY = containerRect.top + Math.min(Math.max(projectsSection.offsetHeight * 0.35, 160), 280);
                        const titleCenterY = titleRect.top + (titleRect.height / 2);
                        const deltaY = Math.round(containerCenterY - titleCenterY);

                        // Fix min-width during centered typing to prevent horizontal jitter
                        projectsHeading.style.minWidth = `${Math.min(Math.ceil(titleRect.width), window.innerWidth - 32)}px`; projectsHeading.style.maxWidth = "calc(100vw - 32px)";
                        // Position heading at center of the Projects section
                        projectsHeading.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                        projectsHeading.classList.add('is-active');

                        // 2. Centered typing: type "Projects"
                        let index = 0;
                        function typeChar() {
                            if (index < fullText.length) {
                                textEl.textContent += fullText.charAt(index);
                                index++;
                                projectsTimeout = setTimeout(typeChar, 75);
                            } else {
                                // 3. Once typing is complete, pause briefly then smoothly glide back to original layout position
                                projectsTimeout = setTimeout(glideToOrigin, 220);
                            }
                        }

                        // 3. Smooth transition to original position
                        function glideToOrigin() {
                            projectsHeading.style.transition = 'transform 750ms cubic-bezier(0.16, 1, 0.3, 1)';
                            projectsHeading.style.transform = 'translate(0px, 0px)';

                            setTimeout(() => {
                                projectsHeading.style.transform = '';
                                projectsHeading.style.transition = '';
                                projectsHeading.style.minWidth = '';

                                if (cursor) {
                                    cursor.classList.add('is-finished');
                                }

                                // 4. Reveal section-index, carousel controls, and staggered project cards AFTER going back
                                setProjectsRevealed(true);
                                isAnimating = false;
                            }, 770);
                        }

                        // Start centered typing after brief 80ms delay
                        projectsTimeout = setTimeout(typeChar, 80);
                    }

                    if ('IntersectionObserver' in window) {
                        const projectsObserver = new IntersectionObserver((entries) => {
                            entries.forEach((entry) => {
                                if (entry.isIntersecting && !hasTyped && !isAnimating) {
                                    hasTyped = true;
                                    typeProjects();
                                } else if (!entry.isIntersecting && hasTyped && !isAnimating) {
                                    // Only reset when scrolled completely away (e.g. back up to about/hero or far below)
                                    if (entry.boundingClientRect.top > window.innerHeight || entry.boundingClientRect.bottom < 0) {
                                        hasTyped = false;
                                        clearTimeout(projectsTimeout);
                                        textEl.textContent = '';
                                        projectsHeading.classList.remove('is-active');
                                        projectsHeading.style.transform = '';
                                        projectsHeading.style.minWidth = '';
                                        if (cursor) {
                                            cursor.classList.remove('is-finished');
                                        }
                                        setProjectsRevealed(false);
                                    }
                                }
                            });
                        }, {
                            threshold: 0.2,
                            rootMargin: '0px 0px -50px 0px'
                        });
                        projectsObserver.observe(projectsSection || projectsHeading);
                    } else {
                        typeProjects();
                    }
                }
            }

            // 5. TECH STACK SECTION: CENTERED TITLE TYPING & STAGGERED REVEAL CONTROLLER
            const stackSection = document.getElementById('stack');
            const stackHeading = document.getElementById('stack-title');

            if (stackHeading) {
                const fullText = stackHeading.textContent.trim();
                stackHeading.setAttribute('aria-label', fullText);

                if (prefersReducedMotion) {
                    stackHeading.textContent = fullText;
                    stackHeading.classList.add('is-active');
                    if (stackSection) stackSection.classList.add('is-revealed');
                } else {
                    stackHeading.innerHTML = '<span class="typing-text"></span><span class="typing-cursor" aria-hidden="true"></span>';
                    const textEl = stackHeading.querySelector('.typing-text');
                    const cursor = stackHeading.querySelector('.typing-cursor');
                    let stackTimeout = null;
                    let hasTyped = false;
                    let isAnimating = false;

                    function setStackRevealed(revealed) {
                        if (stackSection) {
                            stackSection.classList.toggle('is-revealed', revealed);
                        }
                    }

                    function typeStack() {
                        clearTimeout(stackTimeout);
                        isAnimating = true;

                        // Reset states
                        if (cursor) {
                            cursor.classList.remove('is-finished');
                            cursor.style.display = 'inline-block';
                        }
                        setStackRevealed(false);

                        // 1. Measure natural layout position & calculate centering delta relative to the Stack section
                        stackHeading.style.transition = 'none';
                        stackHeading.style.transform = 'none';
                        textEl.textContent = fullText;

                        const container = (stackSection && stackSection.querySelector('.container')) || stackSection;
                        const containerRect = container.getBoundingClientRect();
                        const titleRect = stackHeading.getBoundingClientRect();
                        textEl.textContent = ''; // clear for typing animation

                        // Horizontal center of the Stack section container:
                        const containerCenterX = containerRect.left + (containerRect.width / 2);
                        const titleCenterX = titleRect.left + (titleRect.width / 2);
                        const deltaX = Math.round(containerCenterX - titleCenterX);

                        // Vertical center within the Stack section:
                        const containerCenterY = containerRect.top + Math.min(Math.max(stackSection.offsetHeight * 0.35, 160), 280);
                        const titleCenterY = titleRect.top + (titleRect.height / 2);
                        const deltaY = Math.round(containerCenterY - titleCenterY);

                        // Fix min-width during centered typing to prevent horizontal jitter
                        stackHeading.style.minWidth = `${Math.min(Math.ceil(titleRect.width), window.innerWidth - 32)}px`; stackHeading.style.maxWidth = "calc(100vw - 32px)";
                        // Position heading at center of the Stack section
                        stackHeading.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                        stackHeading.classList.add('is-active');

                        // 2. Centered typing: type "Tech Stack"
                        let index = 0;
                        function typeChar() {
                            if (index < fullText.length) {
                                textEl.textContent += fullText.charAt(index);
                                index++;
                                stackTimeout = setTimeout(typeChar, 75);
                            } else {
                                // 3. Once typing is complete, pause briefly then smoothly glide back to original layout position
                                stackTimeout = setTimeout(glideToOrigin, 220);
                            }
                        }

                        // 3. Smooth transition to original position
                        function glideToOrigin() {
                            stackHeading.style.transition = 'transform 750ms cubic-bezier(0.16, 1, 0.3, 1)';
                            stackHeading.style.transform = 'translate(0px, 0px)';

                            setTimeout(() => {
                                stackHeading.style.transform = '';
                                stackHeading.style.transition = '';
                                stackHeading.style.minWidth = '';

                                if (cursor) {
                                    cursor.classList.add('is-finished');
                                }

                                // 4. Reveal section-index and staggered category rows AFTER going back
                                setStackRevealed(true);
                                isAnimating = false;
                            }, 770);
                        }

                        // Start centered typing after brief 80ms delay
                        stackTimeout = setTimeout(typeChar, 80);
                    }

                    if ('IntersectionObserver' in window) {
                        const stackObserver = new IntersectionObserver((entries) => {
                            entries.forEach((entry) => {
                                if (entry.isIntersecting && !hasTyped && !isAnimating) {
                                    hasTyped = true;
                                    typeStack();
                                } else if (!entry.isIntersecting && hasTyped && !isAnimating) {
                                    // Only reset when scrolled completely away (e.g. back up or far below)
                                    if (entry.boundingClientRect.top > window.innerHeight || entry.boundingClientRect.bottom < 0) {
                                        hasTyped = false;
                                        clearTimeout(stackTimeout);
                                        textEl.textContent = '';
                                        stackHeading.classList.remove('is-active');
                                        stackHeading.style.transform = '';
                                        stackHeading.style.minWidth = '';
                                        if (cursor) {
                                            cursor.classList.remove('is-finished');
                                        }
                                        setStackRevealed(false);
                                    }
                                }
                            });
                        }, {
                            threshold: 0.2,
                            rootMargin: '0px 0px -50px 0px'
                        });
                        stackObserver.observe(stackSection || stackHeading);
                    } else {
                        typeStack();
                    }
                }
            }

            // 6. EXPERIENCE SECTION: CENTERED TITLE TYPING & STAGGERED REVEAL CONTROLLER
            const experienceSection = document.getElementById('experience');
            const experienceHeading = document.getElementById('experience-title');

            if (experienceHeading) {
                const fullText = experienceHeading.textContent.trim();
                experienceHeading.setAttribute('aria-label', fullText);

                if (prefersReducedMotion) {
                    experienceHeading.textContent = fullText;
                    experienceHeading.classList.add('is-active');
                    if (experienceSection) experienceSection.classList.add('is-revealed');
                } else {
                    experienceHeading.innerHTML = '<span class="typing-text"></span><span class="typing-cursor" aria-hidden="true"></span>';
                    const textEl = experienceHeading.querySelector('.typing-text');
                    const cursor = experienceHeading.querySelector('.typing-cursor');
                    let experienceTimeout = null;
                    let hasTyped = false;
                    let isAnimating = false;

                    function setExperienceRevealed(revealed) {
                        if (experienceSection) {
                            experienceSection.classList.toggle('is-revealed', revealed);
                        }
                    }

                    function typeExperience() {
                        clearTimeout(experienceTimeout);
                        isAnimating = true;

                        // Reset states
                        if (cursor) {
                            cursor.classList.remove('is-finished');
                            cursor.style.display = 'inline-block';
                        }
                        setExperienceRevealed(false);

                        // 1. Measure natural layout position & calculate centering delta relative to the Experience section
                        experienceHeading.style.transition = 'none';
                        experienceHeading.style.transform = 'none';
                        textEl.textContent = fullText;

                        const container = (experienceSection && experienceSection.querySelector('.container')) || experienceSection;
                        const containerRect = container.getBoundingClientRect();
                        const titleRect = experienceHeading.getBoundingClientRect();
                        textEl.textContent = ''; // clear for typing animation

                        // Horizontal center of the Experience section container:
                        const containerCenterX = containerRect.left + (containerRect.width / 2);
                        const titleCenterX = titleRect.left + (titleRect.width / 2);
                        const deltaX = Math.round(containerCenterX - titleCenterX);

                        // Vertical center within the Experience section:
                        const containerCenterY = containerRect.top + Math.min(Math.max(experienceSection.offsetHeight * 0.35, 160), 280);
                        const titleCenterY = titleRect.top + (titleRect.height / 2);
                        const deltaY = Math.round(containerCenterY - titleCenterY);

                        // Fix min-width during centered typing to prevent horizontal jitter
                        experienceHeading.style.minWidth = `${Math.min(Math.ceil(titleRect.width), window.innerWidth - 32)}px`; experienceHeading.style.maxWidth = "calc(100vw - 32px)";
                        // Position heading at center of the Experience section
                        experienceHeading.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                        experienceHeading.classList.add('is-active');

                        // 2. Centered typing: type "Experience"
                        let index = 0;
                        function typeChar() {
                            if (index < fullText.length) {
                                textEl.textContent += fullText.charAt(index);
                                index++;
                                experienceTimeout = setTimeout(typeChar, 75);
                            } else {
                                // 3. Once typing is complete, pause briefly then smoothly glide back to original layout position
                                experienceTimeout = setTimeout(glideToOrigin, 220);
                            }
                        }

                        // 3. Smooth transition to original position
                        function glideToOrigin() {
                            experienceHeading.style.transition = 'transform 750ms cubic-bezier(0.16, 1, 0.3, 1)';
                            experienceHeading.style.transform = 'translate(0px, 0px)';

                            setTimeout(() => {
                                experienceHeading.style.transform = '';
                                experienceHeading.style.transition = '';
                                experienceHeading.style.minWidth = '';

                                if (cursor) {
                                    cursor.classList.add('is-finished');
                                }

                                // 4. Reveal section-index and staggered timeline rows AFTER going back
                                setExperienceRevealed(true);
                                isAnimating = false;
                            }, 770);
                        }

                        // Start centered typing after brief 80ms delay
                        experienceTimeout = setTimeout(typeChar, 80);
                    }

                    if ('IntersectionObserver' in window) {
                        const experienceObserver = new IntersectionObserver((entries) => {
                            entries.forEach((entry) => {
                                if (entry.isIntersecting && !hasTyped && !isAnimating) {
                                    hasTyped = true;
                                    typeExperience();
                                } else if (!entry.isIntersecting && hasTyped && !isAnimating) {
                                    // Only reset when scrolled completely away (e.g. back up or far below)
                                    if (entry.boundingClientRect.top > window.innerHeight || entry.boundingClientRect.bottom < 0) {
                                        hasTyped = false;
                                        clearTimeout(experienceTimeout);
                                        textEl.textContent = '';
                                        experienceHeading.classList.remove('is-active');
                                        experienceHeading.style.transform = '';
                                        experienceHeading.style.minWidth = '';
                                        if (cursor) {
                                            cursor.classList.remove('is-finished');
                                        }
                                        setExperienceRevealed(false);
                                    }
                                }
                            });
                        }, {
                            threshold: 0.2,
                            rootMargin: '0px 0px -50px 0px'
                        });
                        experienceObserver.observe(experienceSection || experienceHeading);
                    } else {
                        typeExperience();
                    }
                }
            }

            // 7. EDUCATION SECTION: CENTERED TITLE TYPING & STAGGERED REVEAL CONTROLLER
            const educationSection = document.getElementById('education');
            const educationHeading = document.getElementById('education-title');

            if (educationHeading) {
                const fullText = educationHeading.textContent.trim();
                educationHeading.setAttribute('aria-label', fullText);

                if (prefersReducedMotion) {
                    educationHeading.textContent = fullText;
                    educationHeading.classList.add('is-active');
                    if (educationSection) educationSection.classList.add('is-revealed');
                } else {
                    educationHeading.innerHTML = '<span class="typing-text"></span><span class="typing-cursor" aria-hidden="true"></span>';
                    const textEl = educationHeading.querySelector('.typing-text');
                    const cursor = educationHeading.querySelector('.typing-cursor');
                    let educationTimeout = null;
                    let hasTyped = false;
                    let isAnimating = false;

                    function setEducationRevealed(revealed) {
                        if (educationSection) {
                            educationSection.classList.toggle('is-revealed', revealed);
                        }
                    }

                    function typeEducation() {
                        clearTimeout(educationTimeout);
                        isAnimating = true;

                        // Reset states
                        if (cursor) {
                            cursor.classList.remove('is-finished');
                            cursor.style.display = 'inline-block';
                        }
                        setEducationRevealed(false);

                        // 1. Measure natural layout position & calculate centering delta relative to the Education section
                        educationHeading.style.transition = 'none';
                        educationHeading.style.transform = 'none';
                        textEl.textContent = fullText;

                        const container = (educationSection && educationSection.querySelector('.container')) || educationSection;
                        const containerRect = container.getBoundingClientRect();
                        const titleRect = educationHeading.getBoundingClientRect();
                        textEl.textContent = ''; // clear for typing animation

                        // Horizontal center of the Education section container:
                        const containerCenterX = containerRect.left + (containerRect.width / 2);
                        const titleCenterX = titleRect.left + (titleRect.width / 2);
                        const deltaX = Math.round(containerCenterX - titleCenterX);

                        // Vertical center within the Education section:
                        const containerCenterY = containerRect.top + Math.min(Math.max(educationSection.offsetHeight * 0.35, 160), 280);
                        const titleCenterY = titleRect.top + (titleRect.height / 2);
                        const deltaY = Math.round(containerCenterY - titleCenterY);

                        // Fix min-width during centered typing to prevent horizontal jitter
                        educationHeading.style.minWidth = `${Math.min(Math.ceil(titleRect.width), window.innerWidth - 32)}px`; educationHeading.style.maxWidth = "calc(100vw - 32px)";
                        // Position heading at center of the Education section
                        educationHeading.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                        educationHeading.classList.add('is-active');

                        // 2. Centered typing: type "Education"
                        let index = 0;
                        function typeChar() {
                            if (index < fullText.length) {
                                textEl.textContent += fullText.charAt(index);
                                index++;
                                educationTimeout = setTimeout(typeChar, 75);
                            } else {
                                // 3. Once typing is complete, pause briefly then smoothly glide back to original layout position
                                educationTimeout = setTimeout(glideToOrigin, 220);
                            }
                        }

                        // 3. Smooth transition to original position
                        function glideToOrigin() {
                            educationHeading.style.transition = 'transform 750ms cubic-bezier(0.16, 1, 0.3, 1)';
                            educationHeading.style.transform = 'translate(0px, 0px)';

                            setTimeout(() => {
                                educationHeading.style.transform = '';
                                educationHeading.style.transition = '';
                                educationHeading.style.minWidth = '';

                                if (cursor) {
                                    cursor.classList.add('is-finished');
                                }

                                // 4. Reveal section-index and education item AFTER going back
                                setEducationRevealed(true);
                                isAnimating = false;
                            }, 770);
                        }

                        // Start centered typing after brief 80ms delay
                        educationTimeout = setTimeout(typeChar, 80);
                    }

                    if ('IntersectionObserver' in window) {
                        const educationObserver = new IntersectionObserver((entries) => {
                            entries.forEach((entry) => {
                                if (entry.isIntersecting && !hasTyped && !isAnimating) {
                                    hasTyped = true;
                                    typeEducation();
                                } else if (!entry.isIntersecting && hasTyped && !isAnimating) {
                                    // Only reset when scrolled completely away (e.g. back up or far below)
                                    if (entry.boundingClientRect.top > window.innerHeight || entry.boundingClientRect.bottom < 0) {
                                        hasTyped = false;
                                        clearTimeout(educationTimeout);
                                        textEl.textContent = '';
                                        educationHeading.classList.remove('is-active');
                                        educationHeading.style.transform = '';
                                        educationHeading.style.minWidth = '';
                                        if (cursor) {
                                            cursor.classList.remove('is-finished');
                                        }
                                        setEducationRevealed(false);
                                    }
                                }
                            });
                        }, {
                            threshold: 0.2,
                            rootMargin: '0px 0px -50px 0px'
                        });
                        educationObserver.observe(educationSection || educationHeading);
                    } else {
                        typeEducation();
                    }
                }
            }

            // 8. CERTIFICATES SECTION: CENTERED TITLE TYPING & STAGGERED REVEAL CONTROLLER
            const certificatesSection = document.getElementById('certificates');
            const certificatesHeading = document.getElementById('certificates-title');

            if (certificatesHeading) {
                const fullText = certificatesHeading.textContent.trim();
                certificatesHeading.setAttribute('aria-label', fullText);

                if (prefersReducedMotion) {
                    certificatesHeading.textContent = fullText;
                    certificatesHeading.classList.add('is-active');
                    if (certificatesSection) certificatesSection.classList.add('is-revealed');
                } else {
                    certificatesHeading.innerHTML = '<span class="typing-text"></span><span class="typing-cursor" aria-hidden="true"></span>';
                    const textEl = certificatesHeading.querySelector('.typing-text');
                    const cursor = certificatesHeading.querySelector('.typing-cursor');
                    let certificatesTimeout = null;
                    let hasTyped = false;
                    let isAnimating = false;

                    function setCertificatesRevealed(revealed) {
                        if (certificatesSection) {
                            certificatesSection.classList.toggle('is-revealed', revealed);
                        }
                    }

                    function typeCertificates() {
                        clearTimeout(certificatesTimeout);
                        isAnimating = true;

                        // Reset states
                        if (cursor) {
                            cursor.classList.remove('is-finished');
                            cursor.style.display = 'inline-block';
                        }
                        setCertificatesRevealed(false);

                        // 1. Measure natural layout position & calculate centering delta relative to the Certificates section
                        certificatesHeading.style.transition = 'none';
                        certificatesHeading.style.transform = 'none';
                        textEl.textContent = fullText;

                        const container = (certificatesSection && certificatesSection.querySelector('.container')) || certificatesSection;
                        const containerRect = container.getBoundingClientRect();
                        const titleRect = certificatesHeading.getBoundingClientRect();
                        textEl.textContent = ''; // clear for typing animation

                        // Horizontal center of the Certificates section container:
                        const containerCenterX = containerRect.left + (containerRect.width / 2);
                        const titleCenterX = titleRect.left + (titleRect.width / 2);
                        const deltaX = Math.round(containerCenterX - titleCenterX);

                        // Vertical center within the Certificates section:
                        const containerCenterY = containerRect.top + Math.min(Math.max(certificatesSection.offsetHeight * 0.35, 160), 280);
                        const titleCenterY = titleRect.top + (titleRect.height / 2);
                        const deltaY = Math.round(containerCenterY - titleCenterY);

                        // Fix min-width during centered typing to prevent horizontal jitter
                        certificatesHeading.style.minWidth = `${Math.min(Math.ceil(titleRect.width), window.innerWidth - 32)}px`; certificatesHeading.style.maxWidth = "calc(100vw - 32px)";
                        // Position heading at center of the Certificates section
                        certificatesHeading.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                        certificatesHeading.classList.add('is-active');

                        // 2. Centered typing: type "Certificates"
                        let index = 0;
                        function typeChar() {
                            if (index < fullText.length) {
                                textEl.textContent += fullText.charAt(index);
                                index++;
                                certificatesTimeout = setTimeout(typeChar, 75);
                            } else {
                                // 3. Once typing is complete, pause briefly then smoothly glide back to original layout position
                                certificatesTimeout = setTimeout(glideToOrigin, 220);
                            }
                        }

                        // 3. Smooth transition to original position
                        function glideToOrigin() {
                            certificatesHeading.style.transition = 'transform 750ms cubic-bezier(0.16, 1, 0.3, 1)';
                            certificatesHeading.style.transform = 'translate(0px, 0px)';

                            setTimeout(() => {
                                certificatesHeading.style.transform = '';
                                certificatesHeading.style.transition = '';
                                certificatesHeading.style.minWidth = '';

                                if (cursor) {
                                    cursor.classList.add('is-finished');
                                }

                                // 4. Reveal section-index and certificate cards AFTER going back
                                setCertificatesRevealed(true);
                                isAnimating = false;
                            }, 770);
                        }

                        // Start centered typing after brief 80ms delay
                        certificatesTimeout = setTimeout(typeChar, 80);
                    }

                    if ('IntersectionObserver' in window) {
                        const certificatesObserver = new IntersectionObserver((entries) => {
                            entries.forEach((entry) => {
                                if (entry.isIntersecting && !hasTyped && !isAnimating) {
                                    hasTyped = true;
                                    typeCertificates();
                                } else if (!entry.isIntersecting && hasTyped && !isAnimating) {
                                    // Only reset when scrolled completely away (e.g. back up or far below)
                                    if (entry.boundingClientRect.top > window.innerHeight || entry.boundingClientRect.bottom < 0) {
                                        hasTyped = false;
                                        clearTimeout(certificatesTimeout);
                                        textEl.textContent = '';
                                        certificatesHeading.classList.remove('is-active');
                                        certificatesHeading.style.transform = '';
                                        certificatesHeading.style.minWidth = '';
                                        if (cursor) {
                                            cursor.classList.remove('is-finished');
                                        }
                                        setCertificatesRevealed(false);
                                    }
                                }
                            });
                        }, {
                            threshold: 0.5,
                            rootMargin: '0px 0px -100px 0px'
                        });
                        certificatesObserver.observe(certificatesHeading);
                    } else {
                        typeCertificates();
                    }
                }
            }

            // 9. CONTACT SECTION: CENTERED TITLE TYPING & STAGGERED REVEAL CONTROLLER
            const contactSection = document.getElementById('contact');
            const contactHeading = document.getElementById('contact-title');

            if (contactHeading) {
                const fullText = contactHeading.textContent.trim();
                contactHeading.setAttribute('aria-label', fullText);

                if (prefersReducedMotion) {
                    contactHeading.textContent = fullText;
                    contactHeading.classList.add('is-active');
                    if (contactSection) contactSection.classList.add('is-revealed');
                } else {
                    contactHeading.innerHTML = '<span class="typing-text"></span><span class="typing-cursor" aria-hidden="true"></span>';
                    const textEl = contactHeading.querySelector('.typing-text');
                    const cursor = contactHeading.querySelector('.typing-cursor');
                    let contactTimeout = null;
                    let hasTyped = false;
                    let isAnimating = false;

                    function setContactRevealed(revealed) {
                        if (contactSection) {
                            contactSection.classList.toggle('is-revealed', revealed);
                        }
                    }

                    function typeContact() {
                        clearTimeout(contactTimeout);
                        isAnimating = true;

                        // Reset states
                        if (cursor) {
                            cursor.classList.remove('is-finished');
                            cursor.style.display = 'inline-block';
                        }
                        setContactRevealed(false);

                        // 1. Measure natural layout position & calculate centering delta relative to the Contact section
                        contactHeading.style.transition = 'none';
                        contactHeading.style.transform = 'none';
                        textEl.textContent = fullText;

                        const container = (contactSection && contactSection.querySelector('.container')) || contactSection;
                        const containerRect = container.getBoundingClientRect();
                        const titleRect = contactHeading.getBoundingClientRect();
                        textEl.textContent = ''; // clear for typing animation

                        // Horizontal center of the Contact section container:
                        const containerCenterX = containerRect.left + (containerRect.width / 2);
                        const titleCenterX = titleRect.left + (titleRect.width / 2);
                        const deltaX = Math.round(containerCenterX - titleCenterX);

                        // Vertical center within the Contact section:
                        const containerCenterY = containerRect.top + Math.min(Math.max(contactSection.offsetHeight * 0.35, 160), 280);
                        const titleCenterY = titleRect.top + (titleRect.height / 2);
                        const deltaY = Math.round(containerCenterY - titleCenterY);

                        // Fix min-width during centered typing to prevent horizontal jitter
                        contactHeading.style.minWidth = `${Math.min(Math.ceil(titleRect.width), window.innerWidth - 32)}px`; contactHeading.style.maxWidth = "calc(100vw - 32px)";
                        // Position heading at center of the Contact section
                        contactHeading.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                        contactHeading.classList.add('is-active');

                        // 2. Centered typing: type "Contact"
                        let index = 0;
                        function typeChar() {
                            if (index < fullText.length) {
                                textEl.textContent += fullText.charAt(index);
                                index++;
                                contactTimeout = setTimeout(typeChar, 75);
                            } else {
                                // 3. Once typing is complete, pause briefly then smoothly glide back to original layout position
                                contactTimeout = setTimeout(glideToOrigin, 220);
                            }
                        }

                        // 3. Smooth transition to original position
                        function glideToOrigin() {
                            contactHeading.style.transition = 'transform 750ms cubic-bezier(0.16, 1, 0.3, 1)';
                            contactHeading.style.transform = 'translate(0px, 0px)';

                            setTimeout(() => {
                                contactHeading.style.transform = '';
                                contactHeading.style.transition = '';
                                contactHeading.style.minWidth = '';

                                if (cursor) {
                                    cursor.classList.add('is-finished');
                                }

                                // 4. Reveal section-index, lead paragraph, staggered channel rows, and contact card AFTER going back
                                setContactRevealed(true);
                                isAnimating = false;
                            }, 770);
                        }

                        // Start centered typing after brief 80ms delay
                        contactTimeout = setTimeout(typeChar, 80);
                    }

                    if ('IntersectionObserver' in window) {
                        const contactObserver = new IntersectionObserver((entries) => {
                            entries.forEach((entry) => {
                                if (entry.isIntersecting && !hasTyped && !isAnimating) {
                                    hasTyped = true;
                                    typeContact();
                                } else if (!entry.isIntersecting && hasTyped && !isAnimating) {
                                    // Only reset when scrolled completely away (e.g. back up or far below)
                                    if (entry.boundingClientRect.top > window.innerHeight || entry.boundingClientRect.bottom < 0) {
                                        hasTyped = false;
                                        clearTimeout(contactTimeout);
                                        textEl.textContent = '';
                                        contactHeading.classList.remove('is-active');
                                        contactHeading.style.transform = '';
                                        contactHeading.style.minWidth = '';
                                        if (cursor) {
                                            cursor.classList.remove('is-finished');
                                        }
                                        setContactRevealed(false);
                                    }
                                }
                            });
                        }, {
                            threshold: 0.2,
                            rootMargin: '0px 0px -50px 0px'
                        });
                        contactObserver.observe(contactSection || contactHeading);
                    } else {
                        typeContact();
                    }
                }
            }
        })();

// Smooth Top Alignment for Brand Wordmark & Back-to-Top Links
        (function() {
            document.querySelectorAll('a[href="#hero"]').forEach((link) => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    if (history.pushState) {
                        history.pushState(null, '', '#hero');
                    } else {
                        location.hash = '#hero';
                    }
                });
            });
        })();

        // Mobile Navigation Toggle Controller
        (function() {
            const navToggle = document.getElementById('mobile-nav-toggle');
            const siteHeader = document.querySelector('.site-header');
            const mainNav = document.getElementById('main-nav');
            if (navToggle && siteHeader && mainNav) {
                const toggleMenu = (open) => {
                    const isOpen = typeof open === 'boolean' ? open : !siteHeader.classList.contains('is-open');
                    siteHeader.classList.toggle('is-open', isOpen);
                    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                };

                navToggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggleMenu();
                });

                mainNav.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', () => {
                        toggleMenu(false);
                    });
                });

                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && siteHeader.classList.contains('is-open')) {
                        toggleMenu(false);
                        navToggle.focus();
                    }
                });

                document.addEventListener('click', (e) => {
                    if (siteHeader.classList.contains('is-open') && !siteHeader.contains(e.target)) {
                        toggleMenu(false);
                    }
                });

                window.addEventListener('resize', () => {
                    if (window.innerWidth > 768 && siteHeader.classList.contains('is-open')) {
                        toggleMenu(false);
                    }
                }, { passive: true });
            }
        })();
// Smart Email Routing Controller (Gmail Web Compose on Desktop with Mobile mailto: fallback)
(function() {
    const emailLinks = document.querySelectorAll('.email-compose-link, .work-with-me-btn');
    if (!emailLinks.length) return;

    emailLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            const email = 'martinramirezasdw@gmail.com';
            const subject = encodeURIComponent('Collaboration Inquiry — Gabriel Martin');
            const body = encodeURIComponent('Hi Martin,\n\nI came across your portfolio and would like to discuss a collaboration opportunity...');

            if (isMobile) {
                // On mobile devices, native mail app (iOS Mail / Android Gmail) provides the smoothest flow
                e.preventDefault();
                window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
            }
            // On desktop, default href to https://mail.google.com/mail/?view=cm&fs=1&... opens in a new tab smoothly
        });
    });
})();
