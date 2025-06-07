function initializeWebsite() {
    updateCopyrightYear();
    setupMobileMenu();
    setupNavHighlighting();
    setupBackToTopButton();
    setupThemeToggle();

    setupGitHubStats();
    updateStatsCardsTheme();

    setupStaggeredScrollReveal();
    setupInteractiveTimeline();
}

/**
 * Handles the staggered scroll-reveal animation for elements.
 * Elements fade in with a slight delay as they become visible.
 */
function setupStaggeredScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    if (revealElements.length === 0) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.style.setProperty('--delay', `${index * 100}ms`);
                el.classList.add('is-visible');
                obs.unobserve(el);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => observer.observe(el));
}

/**
 * Manages the interactive timeline in the Education section.
 * A dot follows the scroll progress and activates items as it passes them.
 */
function setupInteractiveTimeline() {
    const timeline = document.querySelector(".timeline");
    if (!timeline) return;

    const line = document.createElement("div");
    line.className = "timeline-line";
    const lineProgress = document.createElement("div");
    lineProgress.className = "timeline-progress";
    line.appendChild(lineProgress);
    const dot = document.createElement("div");
    dot.className = "timeline-dot";

    timeline.prepend(line, dot); 

    const tiles = Array.from(timeline.querySelectorAll(".timeline-item"));

    const handleScroll = () => {
        const timelineRect = timeline.getBoundingClientRect();
        
        if (timelineRect.bottom < 0 || timelineRect.top > window.innerHeight) return;

        // Progress starts when the top of the timeline enters the viewport.
        const startPoint = timelineRect.top + window.scrollY - window.innerHeight;
        const endPoint = timelineRect.top + window.scrollY + timelineRect.height;
        
        let progress = (window.scrollY - startPoint) / (endPoint - startPoint);
        // Clamp the value between 0 and 1.
        progress = Math.max(0, Math.min(1, progress));

        const dotPosition = progress * timelineRect.height;
        dot.style.top = `${dotPosition}px`;
        lineProgress.style.height = `${dotPosition}px`;

        // Activate cards as the dot passes them.
        tiles.forEach(tile => {
            if (!tile.classList.contains('is-activated')) {
                const tileTop = tile.offsetTop;
                const tileHeight = tile.offsetHeight;

                // Activate the card once the dot has passed its midpoint.
                if (dotPosition > tileTop + tileHeight / 2) {
                    tile.classList.add('is-activated');
                }
            }
        });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call to set the state on page load.
}

// -----------------------------------------------------------------------------
// --- DYNAMIC CONTENT & API ---
// -----------------------------------------------------------------------------

/**
 * Updates the GitHub stats card images to match the current site theme.
 */
function updateStatsCardsTheme() {
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    const user = 'dinaosaure';

    // Define color palettes for each theme.
    const colors = {
        dark: { title_color: '3498db', icon_color: '3498db', text_color: 'e0e0e0', bg_color: '2a2f3a', border_color: '404552' },
        light: { title_color: '0077cc', icon_color: '0077cc', text_color: '343a40', bg_color: 'e9eceb', border_color: 'ced4da' }
    };
    const c = colors[theme];

    // Get the image elements by their ID.
    const statsCard = document.getElementById('github-stats-card');
    const langsCard = document.getElementById('top-langs-card');
    const wakatimeCard = document.getElementById('wakatime-card');

    const baseURL = "https://github-readme-stats.vercel.app/api";
    const commonParams = `&title_color=${c.title_color}&icon_color=${c.icon_color}&text_color=${c.text_color}&bg_color=${c.bg_color}&border_color=${c.border_color}&hide_border=false`;

    if (statsCard) statsCard.src = `${baseURL}?username=${user}&show_icons=true${commonParams}`;
    if (langsCard) langsCard.src = `${baseURL}/top-langs/?username=${user}&layout=compact&langs_count=6${commonParams}`;
    if (wakatimeCard) wakatimeCard.src = `${baseURL}/wakatime?username=${user}${commonParams}`;
}

/* Fetches GitHub stats and sets up the counter animations. */
function setupGitHubStats() {
    const counters = document.querySelectorAll('.counter');
    if (counters.length === 0) return;

    const user = 'dinaosaure';
    const repoCountEl = document.getElementById('repoCount');
    const commitCountEl = document.getElementById('commitCount');
    if (!repoCountEl || !commitCountEl) return;

    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        if (isNaN(target) || el.hasAttribute('data-animated')) return;
        el.setAttribute('data-animated', 'true');
        let current = 0;
        const duration = 1500, steps = 90, increment = target / steps;
        const update = () => {
            current += increment;
            if (current < target) {
                el.innerText = Math.floor(current);
                requestAnimationFrame(update);
            } else {
                el.innerText = target;
            }
        };
        requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => { if (entry.isIntersecting) { animateCounter(entry.target); obs.unobserve(entry.target); } });
    }, { threshold: 0.5 });

    Promise.all([
        fetch(`https://api.github.com/users/${user}`),
        fetch(`https://api.github.com/search/commits?q=author:${user}`, { headers: { 'Accept': 'application/vnd.github.cloak-preview' } })
    ]).then(responses => Promise.all(responses.map(res => { if (!res.ok) throw new Error(`API Error: ${res.status}`); return res.json(); })))
      .then(([userData, commitsData]) => {
        if (userData && userData.public_repos) repoCountEl.setAttribute('data-target', userData.public_repos);
        if (commitsData && commitsData.total_count) commitCountEl.setAttribute('data-target', Math.min(commitsData.total_count, 9999));
        counters.forEach(counter => observer.observe(counter));
    }).catch(error => {
        console.error("GitHub API Error:", error);
        repoCountEl.innerText = '-';
        commitCountEl.innerText = '-';
    });
}

// -----------------------------------------------------------------------------
// --- CORE UI & HELPER FUNCTIONS ---
// -----------------------------------------------------------------------------


function updateCopyrightYear() {
    const currentYearSpan = document.getElementById("current-year");
    if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();
}

function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (!menuToggle || !mainNav) return;
    
    const closeMenu = () => {
        mainNav.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
    };
    
    menuToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        const isActive = mainNav.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isActive);
        document.body.classList.toggle('no-scroll', isActive);
    });

    mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('click', (event) => {
        if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
}

function setupNavHighlighting() {
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.main-nav ul li a');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(entries => {
        let currentSectionId = '';
        entries.forEach(entry => { if (entry.isIntersecting) currentSectionId = entry.target.id; });
        
        // Force 'contact' section if at the very bottom of the page.
        const scrollPosition = window.scrollY + window.innerHeight;
        if (scrollPosition >= document.body.offsetHeight - 100) {
            const lastSection = sections[sections.length - 1];
            if (lastSection) currentSectionId = lastSection.id;
        }

        navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${currentSectionId}`));
    }, { rootMargin: '-40% 0px -60% 0px' });

    sections.forEach(section => observer.observe(section));
}

/* Shows/hides the "back to top" button based on scroll position. */
function setupBackToTopButton() {
    const button = document.getElementById("back-to-top-btn");
    if (!button) return;
    window.addEventListener('scroll', () => button.classList.toggle('visible', window.scrollY > 300));
}

function setupThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const html = document.documentElement;
    const localStorageKey = 'themePreference';
    if (!themeToggle) return;

    function applyTheme(theme) {
        html.setAttribute('data-theme', theme);
        const icon = themeToggle.querySelector('i');
        icon.classList.toggle('fa-sun', theme === 'light');
        icon.classList.toggle('fa-moon', theme === 'dark');
        updateStatsCardsTheme();
    }

    const savedTheme = localStorage.getItem(localStorageKey);
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    const initialTheme = savedTheme || (systemPrefersLight ? 'light' : 'dark');
    applyTheme(initialTheme);

    themeToggle.addEventListener('click', () => {
        const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem(localStorageKey, newTheme);
    });
}

// --- Initialize the website ---
document.addEventListener('DOMContentLoaded', initializeWebsite);