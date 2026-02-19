# Contributing

## Local setup
```bash
npm install
npm run dev
```

## Quality gate
Before any PR:
```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Commit style
- `feat:` new functionality
- `fix:` bug fix
- `refactor:` internal improvements
- `chore:` tooling/docs

## Pull request checklist
- [ ] Feature works locally
- [ ] No console errors
- [ ] Tests added/updated when needed
- [ ] README updated if behavior changed
