# Bingo Helper Tool

> Tracking drawn numbers on a 5x5 grid has never looked so... _premium_.

Welcome to the **Bingo Helper Tool**—a sleek, dark-mode, client-side digital companion for serious Bingo players. This tool is built to let you track numbers, watch winning lines glow, and manage multiple boards without losing your zen.

---

## 🚀 See it in action

🔗 https://EduardDopler.github.io/bingo-tool/

## ✨ Features

- **⚡ Clipboard Magic** – Paste raw text directly in Edit Mode. Commas, spaces, tabs? The smart parser gobbles it up, formats single digits (hello `09`), and drops them into a 5x5 grid.
- **🎯 Win Highlights** – Complete a row, column, or diagonal, and watch it light up in Soft Gold.
- **⏳ Time Travel (Undo)** – Made a mistake? Hit Undo. Even entire Edit Mode sessions can be rolled back in one go.
- **💾 Multi-Board Persistence** – Your boards are auto-saved to `localStorage` under dynamic dates. Empty boards disappear when they should, keeping your dashboard clean.

---

## 💻 Run locally

```bash
# 1. Install dependencies
pnpm install

# 2. Fire up the dev server
pnpm dev

# 3. Build for production
pnpm build
```

---

## 🛠️ Under the Hood

- **Core:** Strict-mode TypeScript, Vanilla HTML, and native modern CSS.
- **Bundler:** [Vite](https://vite.dev/) ⚡
- **Testing:** [Vitest](https://vitest.dev/) for logic, [Playwright](https://playwright.dev/) for E2E.
- **Dependencies:** Zero frameworks, minimal dependencies. Pure vanilla power.
