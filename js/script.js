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
                else {
                     entry.target.classList.remove('is-visible');
                 }
            });
        }, {
            root: null, 
            threshold: 0.1 
            // rootMargin: '0px 0px -50px 0px' // Optional offset
        });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

});