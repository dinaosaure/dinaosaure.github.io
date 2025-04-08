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
            const isExpanded = mainNavUl.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });

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
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
                 // Garde l'animation non-réversible pour l'instant
                 // else {
                 //    entry.target.classList.remove('is-visible');
                 // }
            });
        }, {
            root: null,
            threshold: 0.1
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
            rootMargin: '-40% 0px -60% 0px',
            threshold: 0
        };

        const navObserver = new IntersectionObserver((entries, observer) => {
            let activeSectionId = null;

            entries.forEach(entry => {
                if (entry.isIntersecting) {
                   if (activeSectionId === null || entry.intersectionRatio > 0) {
                     activeSectionId = entry.target.id;
                   }
                }
            });

             navLinks.forEach(link => {
                 link.classList.remove('active');
                 if (link.getAttribute('href') === `#${activeSectionId}`) {
                     link.classList.add('active');
                 }
             });

             if (window.scrollY < 100 && activeSectionId !== 'accueil') {
                navLinks.forEach(link => link.classList.remove('active'));
                const homeLink = document.querySelector('.main-nav a[href="#accueil"]');
                if (homeLink) homeLink.classList.add('active');
             }

        }, navObserverOptions);

        sections.forEach(section => {
            navObserver.observe(section);
        });
    }

    // === Back to Top Button Logic === AJOUTÉ ICI ===
    const backToTopButton = document.getElementById("back-to-top-btn");

    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Affiche après 300px de scroll
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        // Le lien href="#accueil" gère déjà le scroll smooth grâce au CSS sur <html>
        // Pas besoin d'ajouter un event listener 'click' ici sauf pour des cas spécifiques.
    }
    // ============================================

}); // End of DOMContentLoaded listener