function initializeWebsite() {
    updateCopyrightYear();
    setupMobileMenu();
    setupScrollReveal();
    setupNavHighlighting();
    setupBackToTopButton();
    setupThemeToggle();
}

function updateCopyrightYear() {
    const currentYearSpan = document.getElementById("current-year");
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
}

function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNavUl = document.querySelector('.main-nav ul');

    if (!menuToggle || !mainNavUl) return;

    const navLinksForMenuClose = mainNavUl.querySelectorAll('a');

    const closeMenu = () => {
        if (mainNavUl.classList.contains('active')) {
            mainNavUl.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll');
        }
    };

    const openMenu = () => {
        mainNavUl.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('no-scroll');
    };

    menuToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        if (mainNavUl.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    navLinksForMenuClose.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (event) => {
        const isClickInsideNav = mainNavUl.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);

        if (mainNavUl.classList.contains('active') && !isClickInsideNav && !isClickOnToggle) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && mainNavUl.classList.contains('active')) {
            closeMenu();
        }
    });

    const breakpoint = 768;
    window.addEventListener('resize', () => {
        const isNavActive = mainNavUl.classList.contains('active');
        if (window.innerWidth >= breakpoint && isNavActive) {
            closeMenu();
        } else if (window.innerWidth <= breakpoint && !isNavActive) {
             mainNavUl.style.transition = 'none';
             mainNavUl.offsetWidth;
             mainNavUl.style.transition = null;
         }
    });
}

function setupScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    if (revealElements.length === 0) return;

    const revealObserverOptions = {
        root: null,
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.revealDelay || '0ms';
                entry.target.style.transitionDelay = delay;

                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    revealElements.forEach((el, index) => {
        revealObserver.observe(el);
    });
}

function setupNavHighlighting() {
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.main-nav ul li a');

    if (sections.length === 0 || navLinks.length === 0) return;

    const navObserverOptions = {
        root: null,
        rootMargin: '-40% 0px -60% 0px',
        threshold: 0
    };

    let currentActiveSectionId = null;

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
             if (entry.isIntersecting) {
                 currentActiveSectionId = entry.target.id;
             }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            if (linkHref === `#${currentActiveSectionId}`) {
                link.classList.add('active');
            }
        });

        if (window.scrollY < 200 && currentActiveSectionId !== 'accueil') {
           navLinks.forEach(link => link.classList.remove('active'));
           const homeLink = document.querySelector('.main-nav a[href="#accueil"]');
           if (homeLink) homeLink.classList.add('active');
        } else if (window.scrollY < 200 && currentActiveSectionId === 'accueil') {
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

function setupBackToTopButton() {
    const backToTopButton = document.getElementById("back-to-top-btn");

    if (!backToTopButton) return;

    backToTopButton.setAttribute('aria-hidden', 'true');

    let scrollTimeout;
    const handleScroll = () => {
         if (window.scrollY > 300) {
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
        scrollTimeout = setTimeout(handleScroll, 50);
    }, { passive: true });
}


function setupThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const htmlElement = document.documentElement;
    const localStorageKey = 'themePreference';

    if (!themeToggle || !htmlElement) {
        return;
    }

    const applyTheme = (theme) => {
        if (theme === 'light') {
            htmlElement.setAttribute('data-theme', 'light');
            themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
            themeToggle.setAttribute('aria-label', 'Switch to dark theme');
        } else {
            htmlElement.setAttribute('data-theme', 'dark');
            themeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
            themeToggle.setAttribute('aria-label', 'Switch to light theme');
        }
    };

    const getPreferredTheme = () => {
        const savedTheme = localStorage.getItem(localStorageKey);
        if (savedTheme) {
            return savedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    };

    const initialTheme = getPreferredTheme();
    applyTheme(initialTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem(localStorageKey, newTheme);
    });

     window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (event) => {
        if (!localStorage.getItem(localStorageKey)) {
             applyTheme(event.matches ? 'light' : 'dark');
         }
     });
}


document.addEventListener('DOMContentLoaded', initializeWebsite);