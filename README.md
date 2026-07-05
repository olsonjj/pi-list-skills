# pi-list-skills

A [Pi](https://pi.dev) extension that lists all loaded skills grouped by source.

## Features

- **`/list-skills` command** — interactive select UI showing skills grouped by where they came from
- **`list_skills` tool** — LLM-callable tool that returns skills as structured markdown, grouped by source
- **Source grouping** — skills are automatically organized by origin:
  - Git repos (e.g., `github.com/mattpocock/pi-skills`)
  - npm packages (e.g., `npm:pi-ollama-cloud`)
  - Global skills (`~/.pi/agent/skills`, `~/.agents/skills`)
  - Project skills (`.pi/skills`, `.agents/skills`)

## Install

```bash
pi install git:github.com/olsonjj/pi-list-skills
```

Then `/reload` in Pi or restart.

## Usage

```
/list-skills          # interactive select UI, grouped by source
```

Or ask the agent: "what skills are loaded?"

## Example output

```
### github.com/mattpocock/pi-skills

- **grill-me** — A relentless interview to sharpen a plan or design.
- **to-issues** — Break a plan, spec, or PRD into independently-grabbable issues.
- **to-prd** — Turn the current conversation into a PRD.

### Global (~/.pi/agent/skills)

- **pi-sandbox** — Runs Pi inside an isolated throwaway Docker container.
- **vercel-cli-with-tokens** — Deploy and manage projects on Vercel.

### Global (~/.agents/skills)

- **deploy-to-vercel** — Deploy applications and websites to Vercel.
- **find-skills** — Helps discover and install agent skills.
```

## License

MIT
