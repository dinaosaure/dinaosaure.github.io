// Wait for the HTML document to be fully loaded and parsed
document.addEventListener('DOMContentLoaded', () => {

    // Update copyright year
    const currentYearSpan = document.getElementById("current-year");
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNavUl = document.querySelector('.main-nav ul');
    if (menuToggle && mainNavUl) {
        menuToggle.addEventListener('click', () => {
            mainNavUl.classList.toggle('active');
            // Optional: Add screen reader accessibility update (aria-expanded)
            const isExpanded = mainNavUl.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });

        // Add click listener to nav links to close mobile menu
        const navLinksForMenuClose = mainNavUl.querySelectorAll('a');
        navLinksForMenuClose.forEach(link => {
            link.addEventListener('click', () => {
                if (mainNavUl.classList.contains('active')) {
                    mainNavUl.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // Scroll Reveal Animation using Intersection Observer
    const revealElements = document.querySelectorAll('.scroll-reveal');
    if (revealElements.length > 0) { // Check if elements exist before setting up observer
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Stop observing once visible
                }
                // Optional: Uncomment below to reverse animation on scroll up
                else {
                     entry.target.classList.remove('is-visible');
                 }
            });
        }, {
            root: null, // viewport
            threshold: 0.1 // 10% visible
            // rootMargin: '0px 0px -50px 0px' // Optional offset
        });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    // Navigation Active Highlighting
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.main-nav ul li a');

    if (sections.length > 0 && navLinks.length > 0) {

        const navObserverOptions = {
            root: null,
            rootMargin: '-40% 0px -60% 0px', // Adjust trigger zone (top/bottom margin)
            threshold: 0 // Trigger as soon as any part enters the zone
        };

        const navObserver = new IntersectionObserver((entries, observer) => {
            let activeSectionId = null;

            entries.forEach(entry => {
                if (entry.isIntersecting) {
                   if (activeSectionId === null || entry.intersectionRatio > 0) { // A simple check
                     activeSectionId = entry.target.id;
                   }
                }
            });

            // Update active link based on the determined active section
             navLinks.forEach(link => {
                 link.classList.remove('active');
                 // Check if the link's href matches the active section ID
                 if (link.getAttribute('href') === `#${activeSectionId}`) {
                     link.classList.add('active');
                 }
             });

             if (window.scrollY < 100 && activeSectionId !== 'accueil') { // Add a check for top of page
                navLinks.forEach(link => link.classList.remove('active'));
                const homeLink = document.querySelector('.main-nav a[href="#accueil"]');
                if (homeLink) homeLink.classList.add('active');
             }


        }, navObserverOptions);

        sections.forEach(section => {
            navObserver.observe(section);
        });
    }


});