# Planning overview

This folder contains tickets, i.e. epics and user stories, for this project.
The Backlog is maintained in `src/docs/planning/backlog.md`.

## Conventions

### Folder naming

- `src/docs/planning/epics/` for epics
- `src/docs/planning/user-stories/` for user stories

### File naming

- Epic: `E` + 3 digits (`001`-`999`) + underscore + kebab-case + `.md`
- User story: `US` + 3 digits (`001`-`999`) + underscore + kebab-case + `.md`

### Status

- new
- in-progress
- ready-for-review
- in-review
- ready-for-test
- in-test
- ready-for-release
- done
- cancelled

### Frontmatter usage

- Epics and user stories use frontmatter to define metadata.
- Epics contain a list of user stories and user stories contain a reference to the epic they belong to.
- Frontmatter in epics contains id, creation timestamp, update timestamp, title, status and user story ids.
- Frontmatter in user stories contains id, creation timestamp, update timestamp, title, status and epic id.

### General conventions

- Follow the INVEST criteria for User Stories.
- Use MoSCoW prioritization for the initial backlog order.
- Mark dependencies between tickets with cross-references.
- Each ticket has a prose description of its goal, plus a list of acceptance criteria and a comment section.
- Comments are used to document the analysis and implementation of the ticket. Each comment has a timestamp.
