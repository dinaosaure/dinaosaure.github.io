// ========== Dina's Website Script.js ========== //

function initializeWebsite() {
    updateCopyrightYear();
    setupMobileMenu();
    setupScrollReveal();
    setupNavHighlighting();
    setupBackToTopButton();
    setupThemeToggle(); // Cette fonction va maintenant aussi gérer les thèmes des cartes
    setupGitHubStats();
    updateStatsCardsTheme(); // On l'appelle une fois au début pour le thème initial
}

/**
 * Met à jour les images de statistiques pour correspondre au thème actuel du site (clair/sombre).
 */
function updateStatsCardsTheme() {
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    const user = 'dinaosaure';
    
    // On définit les couleurs pour chaque thème
    const colors = {
        dark: {
            title_color: '3498db', // Bleu accent
            icon_color: '3498db',  // Bleu accent
            text_color: 'e0e0e0',    // Texte clair
            bg_color: '2a2f3a',    // Fond secondaire foncé
            border_color: '404552', // Bordure foncée
        },
        light: {
            title_color: '0077cc', // Bleu accent plus foncé sur fond clair
            icon_color: '0077cc',  // Bleu accent plus foncé sur fond clair
            text_color: '343a40',    // Texte sombre
            bg_color: 'e9eceb',    // Fond secondaire clair
            border_color: 'ced4da', // Bordure claire
        }
    };

    const currentColors = colors[theme];

    // On récupère les éléments image par leur ID
    const statsCard = document.getElementById('github-stats-card');
    const langsCard = document.getElementById('top-langs-card');
    const wakatimeCard = document.getElementById('wakatime-card');

    if (statsCard) {
        statsCard.src = `https://github-readme-stats.vercel.app/api?username=${user}&show_icons=true&title_color=${currentColors.title_color}&icon_color=${currentColors.icon_color}&text_color=${currentColors.text_color}&bg_color=${currentColors.bg_color}&border_color=${currentColors.border_color}&hide_border=false`;
    }
    if (langsCard) {
        langsCard.src = `https://github-readme-stats.vercel.app/api/top-langs/?username=${user}&layout=compact&langs_count=6&title_color=${currentColors.title_color}&icon_color=${currentColors.icon_color}&text_color=${currentColors.text_color}&bg_color=${currentColors.bg_color}&border_color=${currentColors.border_color}&hide_border=false`;
    }
    if (wakatimeCard) {
        wakatimeCard.src = `https://github-readme-stats.vercel.app/api/wakatime?username=${user}&title_color=${currentColors.title_color}&icon_color=${currentColors.icon_color}&text_color=${currentColors.text_color}&bg_color=${currentColors.bg_color}&border_color=${currentColors.border_color}&hide_border=false`;
    }
}


function setupGitHubStats() {
    const counters = document.querySelectorAll('.counter');
    if (counters.length === 0) return;

    const user = 'dinaosaure';
    const repoCountEl = document.getElementById('repoCount');
    const commitCountEl = document.getElementById('commitCount');

    // On ne cherche plus langCountEl
    if (!repoCountEl || !commitCountEl) return;

    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        if (isNaN(target) || el.hasAttribute('data-animated')) return;

        el.setAttribute('data-animated', 'true');
        let current = 0;
        const duration = 1500;
        const steps = 60;
        const stepTime = Math.max(16, duration / steps);
        const increment = target / (duration / stepTime);

        const update = () => {
            if (current < target) {
                current = Math.min(target, current + increment);
                el.innerText = Math.floor(current);
                requestAnimationFrame(update);
            } else {
                el.innerText = target;
            }
        };
        requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    // La requête pour la liste des repos a été enlevée, car elle n'était que pour langCount
    Promise.all([
        fetch(`https://api.github.com/users/${user}`),
        fetch(`https://api.github.com/search/commits?q=author:${user}`, {
            headers: { 'Accept': 'application/vnd.github.cloak-preview' }
        })
    ]).then(responses => Promise.all(responses.map(res => {
            if (!res.ok) throw new Error(`Erreur API GitHub: ${res.status}`);
            return res.json();
        })))
      .then(([userData, commitsData]) => {
        if (userData && userData.public_repos) {
            repoCountEl.setAttribute('data-target', userData.public_repos);
        }
        if (commitsData && commitsData.total_count) {
            commitCountEl.setAttribute('data-target', Math.min(commitsData.total_count, 9999));
        }
        counters.forEach(counter => observer.observe(counter));
    }).catch(error => {
        console.error("Erreur lors de la récupération des stats GitHub:", error);
        repoCountEl.innerText = '-';
        commitCountEl.innerText = '-';
    });
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

    const closeMenu = () => {
        mainNavUl.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
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

    mainNavUl.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (event) => {
        if (!mainNavUl.contains(event.target) && !menuToggle.contains(event.target)) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenu();
        }
    });
}

function setupScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    if (revealElements.length === 0) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => observer.observe(el));
}

function setupNavHighlighting() {
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.main-nav ul li a');

    if (sections.length === 0 || navLinks.length === 0) return;

    const observer = new IntersectionObserver(entries => {
        let currentSectionId = '';
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                currentSectionId = entry.target.id;
            }
        });

        const scrollPosition = window.scrollY + window.innerHeight;
        const documentHeight = document.body.offsetHeight;
        if (scrollPosition >= documentHeight - 100) {
             const lastSection = sections[sections.length - 1];
             if(lastSection) currentSectionId = lastSection.id;
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }, {
        rootMargin: '-40% 0px -60% 0px'
    });

    sections.forEach(section => observer.observe(section));
}

function setupBackToTopButton() {
    const button = document.getElementById("back-to-top-btn");
    if (!button) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    });
}

function setupThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const html = document.documentElement;
    const localStorageKey = 'themePreference';

    if (!themeToggle) return;

    function applyTheme(theme) {
        html.setAttribute('data-theme', theme);
        const icon = themeToggle.querySelector('i');
        if (theme === 'light') {
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
        }
        updateStatsCardsTheme();
    }

    const savedTheme = localStorage.getItem(localStorageKey);
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    const initialTheme = savedTheme || (systemPrefersLight ? 'light' : 'dark');
    applyTheme(initialTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem(localStorageKey, newTheme);
    });
}

document.addEventListener('DOMContentLoaded', initializeWebsite);