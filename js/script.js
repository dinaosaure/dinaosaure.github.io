/**
 * Initializes the core functionalities of the website after the DOM is fully loaded.
 */
function initializeWebsite() {
    updateCopyrightYear();
    setupMobileMenu();
    setupScrollReveal();
    setupNavHighlighting();
    setupBackToTopButton();
}

/**
 * Updates the copyright year in the footer.
 */
function updateCopyrightYear() {
    const currentYearSpan = document.getElementById("current-year");
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
}

/**
 * Sets up the mobile menu toggle, outside click closure, escape key closure,
 * link click closure, and body scroll lock.
 */
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNavUl = document.querySelector('.main-nav ul');

    if (!menuToggle || !mainNavUl) return; // Exit if elements aren't found

    const navLinksForMenuClose = mainNavUl.querySelectorAll('a');

    // Function to close the menu
    const closeMenu = () => {
        if (mainNavUl.classList.contains('active')) {
            mainNavUl.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll'); // Remove body scroll lock
        }
    };

    // Function to open the menu
    const openMenu = () => {
        mainNavUl.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('no-scroll'); // Add body scroll lock
    };

    // Toggle menu on button click
    menuToggle.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent click from immediately triggering document listener
        if (mainNavUl.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close menu when a link inside is clicked
    navLinksForMenuClose.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu on outside click
    document.addEventListener('click', (event) => {
        // Check if the menu is active and the click was outside the menu AND outside the toggle button
        const isClickInsideNav = mainNavUl.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target); // Already handled by its own listener

        if (mainNavUl.classList.contains('active') && !isClickInsideNav && !isClickOnToggle) {
            closeMenu();
        }
    });

    // Close menu on 'Escape' key press (Accessibility improvement)
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && mainNavUl.classList.contains('active')) {
            closeMenu();
        }
    });

    // Optional:
    // - Close menu and remove scroll lock if window resizes to desktop view
    // - Prevent unwanted animation if window resizes to mobile view
    const breakpoint = 768;
    window.addEventListener('resize', () => {
        // Use the same breakpoint as your CSS media query (768px)
        const isNavActive = mainNavUl.classList.contains('active');
        if (window.innerWidth >= breakpoint && isNavActive) {
            closeMenu();
        }

        else if (window.innerWidth <= breakpoint && !isNavActive) {
            mainNavUl.style.transition = 'none';
            mainNavUl.offsetWidth; // trigger reflow
            mainNavUl.style.transition = null;
        }
    });
}

/**
 * Sets up scroll reveal animations using Intersection Observer.
 * Elements reveal once and stay visible.
 */
function setupScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    if (revealElements.length === 0) return;

    const revealObserverOptions = {
        root: null, // viewport
        threshold: 0.1 // Trigger when 10% is visible
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => { // Index can be used for staggering if needed
            if (entry.isIntersecting) {
                // Optional: Add staggered delay using data attribute
                const delay = entry.target.dataset.revealDelay || '0ms';
                entry.target.style.transitionDelay = delay;

                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Reveal only once
            }
            // Non-reversible animation: no 'else' block needed
        });
    }, revealObserverOptions);

    revealElements.forEach((el, index) => {
        // Optional: Set default stagger delay if no data-attribute is present
        // if (!el.dataset.revealDelay) {
        //     el.style.transitionDelay = `${index * 50}ms`; // Example: 50ms stagger
        // }
        revealObserver.observe(el);
    });

    /* Example HTML for staggered delay:
       <div class="timeline-item scroll-reveal" data-reveal-delay="100ms">...</div>
       <div class="timeline-item scroll-reveal" data-reveal-delay="200ms">...</div>
       <article class="experience-card scroll-reveal" data-reveal-delay="50ms">...</article>
    */
}

/**
 * Sets up active navigation link highlighting based on scroll position
 * using Intersection Observer.
 */
function setupNavHighlighting() {
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.main-nav ul li a');

    if (sections.length === 0 || navLinks.length === 0) return;

    const navObserverOptions = {
        root: null,
        rootMargin: '-40% 0px -60% 0px', // Active when section is roughly between 40% from top and 40% from bottom
        threshold: 0 // Trigger as soon as any part enters/leaves the rootMargin zone
    };

    let currentActiveSectionId = null;

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
             // If the section is intersecting the observation zone
             if (entry.isIntersecting) {
                 currentActiveSectionId = entry.target.id;
             }
        });

        // Update nav links based on the last intersecting section ID
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            if (linkHref === `#${currentActiveSectionId}`) {
                link.classList.add('active');
            }
        });

        // Special case: If scrolled near the top, explicitly activate 'Home'/'Accueil'
        // Adjust the scrollY value (e.g., 200) based on your header/hero height
        if (window.scrollY < 200 && currentActiveSectionId !== 'accueil') {
           navLinks.forEach(link => link.classList.remove('active'));
           const homeLink = document.querySelector('.main-nav a[href="#accueil"]');
           if (homeLink) homeLink.classList.add('active');
        } else if (window.scrollY < 200 && currentActiveSectionId === 'accueil') {
             // Ensure home is active if already at top and 'accueil' is detected
             const homeLink = document.querySelector('.main-nav a[href="#accueil"]');
             if (homeLink && !homeLink.classList.contains('active')) {
                 navLinks.forEach(link => link.classList.remove('active'));
                 homeLink.classList.add('active');
             }
        }

    }, navObserverOptions);

    sections.forEach(section => {
        navObserver.observe(section);
    });
}


/**
 * Sets up the Back to Top button visibility toggle based on scroll position
 * and adds accessibility attributes.
 */
function setupBackToTopButton() {
    const backToTopButton = document.getElementById("back-to-top-btn");

    if (!backToTopButton) return;

    // Set initial accessible state
    backToTopButton.setAttribute('aria-hidden', 'true');

    // Debounce function to limit scroll event firing rate (optional but good practice)
    let scrollTimeout;
    const handleScroll = () => {
         if (window.scrollY > 300) { // Show after 300px scroll
            if (!backToTopButton.classList.contains('visible')) {
                backToTopButton.classList.add('visible');
                backToTopButton.setAttribute('aria-hidden', 'false');
            }
        } else {
             if (backToTopButton.classList.contains('visible')) {
                backToTopButton.classList.remove('visible');
                backToTopButton.setAttribute('aria-hidden', 'true');
            }
        }
    };

    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(handleScroll, 50); // Adjust timeout (ms) as needed
    }, { passive: true }); // Improve scroll performance

    // Note: The smooth scroll itself is handled by the href="#accueil"
    // and the CSS `html { scroll-behavior: smooth; }`. No click listener needed here
    // unless you want to add extra analytics or polyfill behavior.
}

// === Wait for the HTML document to be fully loaded and parsed ===
document.addEventListener('DOMContentLoaded', initializeWebsite);
