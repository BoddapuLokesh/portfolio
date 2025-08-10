# Lokesh Boddapu – Portfolio

Live site: https://boddapulokesh.github.io/portfolio

## Overview
A clean, responsive personal portfolio for showcasing experience, projects, and skills. It’s a static site built with HTML, CSS, and vanilla JavaScript—optimized for smooth navigation, accessibility, and quick deployment (e.g., GitHub Pages).

## Features
- Responsive layout with fixed navbar and smooth section scrolling
- Modern UI with cards, timelines, and horizontal-on-vertical scroll sections
- Contact form with client-side validation and toast-style notifications
- Downloadable resume and external profile links (GitHub, LinkedIn)
- Prefers-color-scheme friendly styles and accessible focus states
- Simple, dependency-free stack (no frameworks)

## Tech Stack
- HTML5 (semantic sections)
- CSS3 (custom design system + responsive styles)
- JavaScript (vanilla, DOM APIs)
- Google Fonts (Inter)

## Project Structure
```
/portfolio
├── index.html          # Main page markup
├── style.css           # Styles (design tokens + sections)
├── app.js              # Interactions (nav, scroll, forms, effects)
├── LokeshBoddapu.jpg   # Profile image
├── Lokesh Boddapu - Resume.pdf  # Downloadable resume
└── .gitignore
```

## Getting Started
- Option A: Open `index.html` directly in a browser.
- Option B (recommended for local dev): serve with a local web server.

Example (Python 3):
```bash
# from the portfolio directory
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy
- GitHub Pages
  1) Push this folder to a GitHub repo
  2) In Repo → Settings → Pages, select the `main` branch (root) and save
  3) Your site will be available at: `https://<username>.github.io/<repo>`
- Netlify/Vercel: drag-and-drop the folder or connect the repo; no build step needed

## Customize
- Content: edit section text and links in `index.html` (name, roles, experience, projects, contact links)
- Resume: replace `Lokesh Boddapu - Resume.pdf` and update links if you rename it
- Images: swap `LokeshBoddapu.jpg` with your photo (keep the same filename or update the `<img>` src)
- Colors and design: adjust CSS variables in `style.css` (see `:root` tokens)
- Sections:
  - Skills and Achievements have an optional horizontal-on-vertical scroll effect (controlled by classes `skills--hscroll` and `achievements--hscroll`)
  - Add more projects by duplicating `.project-card` blocks
- Contact form: currently simulates submission; wire it to a backend or service (e.g., Formspree, Netlify Forms) if needed

## Accessibility & Performance
- Uses focus outlines and reduced motion friendliness
- Keep images optimized (compressed JPG/PNG/WebP)
- Minimal JavaScript; no external dependencies for fast loads

## SEO
- Update `<title>` and `<meta name="description">` in `index.html`
- Add social preview tags (Open Graph/Twitter) if you want rich link sharing

## License
Copyright (c) 2025 Lokesh Boddapu. All rights reserved.

## Contact
- Email: lokeshboddapu1234@gmail.com
- LinkedIn: https://linkedin.com/in/lokeshboddapu
- GitHub: https://github.com/BoddapuLokesh
