# Original portfolio design plan (historical snapshot)

Purpose: preserve the original design intent and references after its upstream deletion. Intended reader: maintainers researching product history.

Last verified against commit `e7f95698811156a1fa4a1807fdd6cc2c6e5a5e76` on 2026-10-18.

Archived on 2026-10-18 from `.lovable/plan.md` at commit `0d6ea67`. The template merge deleted that source file and introduced the [new template plan](../../.lovable/plan/make-the-portfolio-a-fully-configurable-template-2026-10-02.md). This snapshot preserves the original text below; it is design intent, not a current feature specification. See the [audit](../CHANGELOG.md) for implementation differences.

**[Unverified, from original doc]** The following historical plan is reproduced unchanged. Current behavior is documented in the [product guide](../05-product-guide.md).

---

# Portfolio Website for Rusiru Rathmina

A bold, creative, and animated portfolio website showcasing your expertise as a Full-Stack Software Engineer.

---

## Design Direction
- **Bold & Creative Style**: Eye-catching design with gradient accents, unique layouts, and strong visual hierarchy
- **Dark/Light Mode**: Toggle between themes with smooth transitions
- **Rich Animations**: Parallax effects, scroll-triggered reveals, hover interactions, and animated backgrounds
- **Modern Typography**: Clean, professional fonts with dynamic sizing

---

## Sections

### 1. Hero Section
- Full-screen intro with your name and title
- Animated background (gradient mesh or particles)
- "View Work" and "Download Resume" buttons
- Smooth scroll indicator

### 2. About Me
- Your introduction and story
- Key highlights with animated stats/counters (years of experience, projects, technologies)
- Creative layout with visual elements

### 3. Experience Timeline
- Interactive vertical timeline
- Omobio positions with expandable details
- Animated markers and content reveals on scroll

### 4. Education
- Modern card-based design for UCSC and Mahinda College
- Institution logos and achievement highlights

### 5. Featured Projects
- Dynamic project cards with hover effects
- Technology stack icons for each project
- All 6 projects: Dialog.lk, Dialog BizCare, Project-X, Roamly, Micro CAPS, ToDo
- "View More/Less" toggle functionality

### 6. Technical Skills
- Animated skills grid with categorized sections
- Skill icons with hover tooltips
- Visual grouping (Languages, Frameworks, Databases, DevOps/Cloud, Tools)

### 7. Blog Preview
- Static cards showcasing featured blog posts
- Link to your Blogger site
- Clean, minimal design

### 8. Contact Section
- Visual contact form (name, email, message fields)
- Your social media links (LinkedIn, GitHub, Discord, Facebook, Twitter, Reddit, Blogger, Spotify)
- Styled icons with hover animations

### 9. Navigation & Footer
- Fixed navbar with smooth scroll navigation
- Mobile hamburger menu
- Footer with social links and copyright

---

## Technical Features
- Fully responsive (mobile, tablet, desktop)
- Dark/Light theme toggle with system preference detection
- Smooth scroll animations using CSS and intersection observers
- SEO-optimized meta tags (keeping your existing Open Graph and Twitter cards)
- Performance optimized with lazy loading images

Next: [Documentation index](../README.md).
