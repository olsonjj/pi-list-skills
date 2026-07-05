# pi-list-skills

A [Pi](https://pi.dev) extension that lists all loaded skills with their descriptions and file locations.

## Features

- **`/list-skills` command** — interactive select UI showing every loaded skill
- **`list_skills` tool** — LLM-callable tool that returns skill details as structured text
- Shows skill name, description, and source file path

## Install

### From GitHub

```bash
pi install github:<user>/pi-list-skills
```

### Manual

Copy `src/index.ts` to `~/.pi/agent/extensions/list-skills.ts`:

```bash
mkdir -p ~/.pi/agent/extensions
cp src/index.ts ~/.pi/agent/extensions/list-skills.ts
```

Then `/reload` in Pi or restart.

## Usage

```
/list-skills          # interactive select UI
```

Or ask the agent: "what skills are loaded?"

## License

MIT
