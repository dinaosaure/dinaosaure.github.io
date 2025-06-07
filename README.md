Personal Portfolio Website — Dina DIDOUCHE

✅ Features Implemented

🌐 General Structure
	•	Multi-section landing page: Home, About, Education, Experience, Projects, Contact
	•	Sticky Navigation with smooth scrolling and active link highlighting
	•	Responsive Design (mobile + tablet support)
	•	Dark/Light Theme Toggle with localStorage preference persistence
	•	Accessible Navigation (focusable elements, aria tags)

✨ Visuals & UI
	•	Hero banner with image and intro text
	•	Interactive scroll animations via IntersectionObserver (.scroll-reveal)
	•	Themed color system using CSS variables
	•	Back to top button that appears on scroll
	•	Downloadable Resumés in FR & EN

🧠 Technical Skills Section
	•	Grouped skills by category (languages, OS, tools)
	•	Interactive skill “bubbles”
	•	Language proficiency with emojis and CEFR levels

🎓 Education Timeline
	•	Interactive vertical timeline
	•	Single visible central dot animated via JS
	•	Each tile becomes illuminated on scroll and deactivated when out of focus

💼 Experience Section
	•	Grid of cards: volunteer, internships, UNICEF
	•	Logos, descriptions, and date tags

🧰 Projects
	•	Main landing view (index.html) shows featured projects
	•	projects.html lists all projects in detail
	•	GitHub links & hosted project links
	•	Some project previews open in greenwatch.html

📈 Stats & KPIs Section
	•	Real-time coding stats with WakaTime API and GitHub API
	•	Dynamic display of:
	•	Number of public repositories
	•	Total commits (approximated via GitHub pagination headers)
	•	Weekly coding time (via WakaTime)
	•	Most used languages with horizontal bar indicators
	•	Fully responsive and animated on scroll

🛠️ Code Organization
	•	index.html: main landing page
	•	projects.html: full project list
	•	greenwatch.html: detailed project view
	•	style.css: all styling logic (variables, themes, grid, responsive breakpoints)
	•	script.js: JS functionality (menu toggle, scroll animations, stats fetch, timeline)

🧪 Completed Interactive JS Systems
	•	scroll-reveal (with visibility toggles)
	•	Navigation scroll sync + focus handling
	•	Timeline dot follow + highlight
	•	Theme persistence + toggle
	•	GitHub + WakaTime stats fetcher

⸻

🚧 Features To Improve or Add

📊 Stats Section
	•	Add animated number counters (e.g. GitHub commits)
	•	Add fallback for WakaTime API if rate-limited or key is missing
	•	Optionally toggle between weekly/monthly data
	•	Add error-handling UI if WakaTime returns error

🎨 UI Enhancements
	•	Add animation staggering for scroll-reveal cards (delay per card)
	•	Improve mobile spacing in .container for < 350px viewports
	•	Add a modal/lightbox for project screenshots

📄 Additional Pages
	•	Add a “Blog” or “Notes” page (if you want to share articles, reports, side-projects)
	•	Add certificate section (LeetCode, Udemy, OpenClassrooms)
	•	Add a 404.html page for dead links

🚀 Optimization
	•	Lazy-load images conditionally
	•	Use <picture> with srcset for mobile optimization
	•	Minify CSS and defer script loading (in production)

🔐 Security
	•	GitHub token / WakaTime API key must not be hard-coded
	•	Use a backend proxy (like Netlify Functions or Vercel Edge) for secure token calls

⸻

✅ Final Notes
	•	All user comments in code have been preserved.
	•	All files have been adjusted for modularity and reusability.
	•	HTML is clean, semantic, and SEO-ready.

You are ready for production — or to push further with optional improvements!