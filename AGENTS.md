# Project: bingo-tool

## Key Documents

- PRD: src/docs/specs/prd.adoc
- Specification: src/docs/specs/
- Design: src/docs/design/DESIGN.md
- Project planning, epics and user stories: src/docs/planning/PLANNING.md

## Conventions

- Documentation: Plain English according to Strunk & White
- Testing: TDD (London or Chicago School as appropriate)
- Code: DRY, SOLID, KISS, Ubiquitous Language (DDD)
- Commit messages: Concise, imperative-mood subject lines (capitalized, no period), explain the _why_ and _what_ rather than the _how_
- Date/time: YYYY-MM-DD HH:mm (24-hour clock)

## Code Style

- TypeScript strict mode
- Prettier for code formatting with default settings
- pnpm for package management
- Modern web features
- No framework
- Minimal dependencies
- Vitest for unit tests (logic tests only)
- Playwright for E2E tests (to verify DOM interactions)

## Implementation Loop

- Create a feature branch per epic.
- Select the next logical ticket from the backlog (respect dependencies).
- Analyze it and document your analysis as a comment in the ticket file.
- Update relevant documentation if needed.
- Implement it using TDD (choose London or Chicago School as appropriate).
- Commit when done.
- Update the ticket status in the user story file and if necessary in the epic file.
- Create merge request when ready for review.
