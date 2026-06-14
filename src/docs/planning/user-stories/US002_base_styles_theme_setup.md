---
id: US002
title: "Base Styles & Theme Setup"
status: new
epic_id: E001
created: 2026-06-05 13:15
updated: 2026-06-05 13:15
---

# US002: Base Styles & Theme Setup

As a user, I want the application's layout and styling to follow the "Verdant Glass" design system, so that the helper tool feels premium, modern, atmospheric, and scales nicely across mobile and desktop.

## Acceptance Criteria

- [ ] CSS custom variables are defined in `src/index.css` for colors, typography weights, and rounded corner tokens matching `DESIGN.md`.
- [ ] Base layout utilizes backdrop-filter blurs, semi-transparent white borders, and Soft Gold gradients for accents.
- [ ] Typography loads "Plus Jakarta Sans" from Google Fonts.
- [ ] The core page layout fits nicely in the viewport and supports a responsive layout.

## Comments

- **2026-06-05 13:15**: Initial analysis. We will define utility variables in CSS and ensure backdrop-filter support. No framework CSS like Tailwind is allowed.
