---
id: E001
title: "Project Infrastructure Setup"
status: new
user_story_ids:
  - US001
  - US002
created: 2026-06-05 13:15
updated: 2026-06-05 13:15
---

# E001: Project Infrastructure Setup

This epic covers setting up the initial workspace, TypeScript config, Prettier formatting rules, build process (Vite), testing framework (Vitest for unit tests, Playwright for E2E tests), and the base HTML structure with the CSS theme variables implementing the Verdant Glass design system.

## User Stories

- [US001: Project Boilerplate Setup](file:///Users/eddie/dev/bingo-tool/src/docs/planning/user-stories/US001_project_boilerplate_setup.md)
- [US002: Base Styles & Theme Setup](file:///Users/eddie/dev/bingo-tool/src/docs/planning/user-stories/US002_base_styles_theme_setup.md)

## Comments

- **2026-06-05 13:15**: Initial analysis. We need a pure Vanilla TS setup. Vite is chosen for building and live reloading, Vitest for unit testing, and Playwright for browser testing. Prettier is added as formatting rule. We will configure strict TypeScript compilation.
