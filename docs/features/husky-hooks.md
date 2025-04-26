# Husky Hooks

## Metadata

| Field       | Value       |
| ----------- | ----------- |
| Feature     | Husky Hooks |
| Created     | 2025-04-24  |
| Author      | J-Org Team  |
| Last Update | 2025-04-24  |
| Status      | Approved    |
| Version     | 1.0.0       |

## Overview

This document describes the Husky Git hooks configuration used in the J-Org project. Husky enables automatic running of scripts during different Git lifecycle events, ensuring code quality, consistency, and preventing problematic commits from entering the codebase.

## Features

- **Pre-commit Validation**: Validates code before allowing commits
- **Commit Message Formatting**: Enforces conventional commit message format
- **Staged Files Linting**: Lints only files staged for commit
- **Type Checking**: Ensures TypeScript types are valid before commit
- **Test Verification**: Runs related tests for modified files
- **Automated Fixes**: Automatically fixes formatting issues when possible

## Configuration

Husky hooks are configured in the `.husky` directory with individual script files for each Git hook.

### Installed Hooks

| Hook                 | Purpose                                      |
| -------------------- | -------------------------------------------- |
| `pre-commit`         | Runs linting and type checking before commit |
| `commit-msg`         | Validates commit message format              |
| `pre-push`           | Runs tests before pushing to remote          |
| `prepare-commit-msg` | Prepares commit message template             |
| `post-merge`         | Updates dependencies after pulling changes   |

### Implementation Details

The hooks are implemented as shell scripts in the `.husky` directory:

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Lint staged files
pnpm lint-staged

# Type check
pnpm tsc --noEmit
```

```bash
# .husky/commit-msg
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Validate commit message
pnpm commitlint --edit $1
```

## Integration with Other Tools

Husky works alongside several other tools:

- **lint-staged**: Runs linters on staged files only
- **commitlint**: Validates commit messages against conventional commits
- **commitizen**: Helps format commit messages correctly

### Lint-Staged Configuration

The `.lintstagedrc.js` file configures which commands run on which file types:

```javascript
module.exports = {
  '*.{js,ts,tsx}': ['eslint --fix', 'prettier --write'],
  '*.{json,md}': ['prettier --write'],
};
```

## Usage

### Normal Workflow

Husky hooks run automatically during Git operations:

1. Developer makes code changes
2. `git add` stages the changes
3. `git commit` triggers pre-commit hook
   - Lint-staged runs ESLint and Prettier on changed files
   - TypeScript type checking validates types
4. If pre-commit passes, commit message validation occurs
5. If commit message is valid, commit succeeds

### Using Commitizen (Recommended)

For easier commit message creation:

```bash
# Stage your changes
git add .

# Use commitizen instead of regular commit
pnpm commit
```

This launches an interactive prompt to help format your commit message correctly.

### Bypassing Hooks

In rare cases when hooks need to be bypassed (not recommended for normal workflow):

```bash
# Bypass pre-commit and commit-msg hooks
git commit --no-verify -m "commit message"
```

## Best Practices

- **Never Bypass Hooks Routinely**: Hooks exist to maintain quality
- **Keep Hooks Fast**: Optimize hooks to run quickly for better developer experience
- **Test Hook Changes**: Verify changes to hook scripts before committing
- **Document Hook Requirements**: Ensure team understands what the hooks check
- **Regular Maintenance**: Update hooks when project requirements change

## Troubleshooting

### Common Issues

1. **Slow Pre-commit Hooks**:

   - Ensure lint-staged is used to only check changed files
   - Consider running TypeScript type checking only on affected projects

2. **Hook Failures**:

   - Read error messages carefully to identify the specific issue
   - Fix the identified problems in your code
   - Re-stage and attempt to commit again

3. **Hook Not Executing**:
   - Check hook file permissions (`chmod +x .husky/*`)
   - Verify husky is installed correctly
   - Run `pnpm husky install` to reinitialize hooks

## Changelog

| Version | Date       | Changes                            |
| ------- | ---------- | ---------------------------------- |
| 1.0.0   | 2025-04-24 | Initial Husky hooks implementation |

## Related Documentation

- [Conventional Commits](./conventional-commits.md)
- [ESLint Configuration](./eslint-configuration.md)
- [Contributing Guidelines](../guidelines/contributing.md)
