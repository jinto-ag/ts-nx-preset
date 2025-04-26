# Conventional Commits

## Metadata

| Field       | Value                |
| ----------- | -------------------- |
| Feature     | Conventional Commits |
| Created     | 2025-04-24           |
| Author      | J-Org Team           |
| Last Update | 2025-04-24           |
| Status      | Approved             |
| Version     | 1.0.0                |

## Overview

This document describes the Conventional Commits standard used in the J-Org project. Conventional Commits provides a standardized format for commit messages, making them machine-readable for automated tools while improving human readability and project history.

## Features

- **Structured Commit Format**: Standardized, machine-readable commit messages
- **Automatic Versioning**: Enables automated semantic versioning
- **Automatic Changelog**: Simplifies changelog generation
- **Git Hook Enforcement**: Enforced via Husky pre-commit hooks
- **Clear Communication**: Improves team communication about changes

## Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

| Type       | Description                                             | Version Impact |
| ---------- | ------------------------------------------------------- | -------------- |
| `feat`     | A new feature                                           | MINOR          |
| `fix`      | A bug fix                                               | PATCH          |
| `docs`     | Documentation only changes                              | NONE           |
| `style`    | Changes that don't affect code meaning                  | NONE           |
| `refactor` | Code change that neither fixes a bug nor adds a feature | NONE           |
| `perf`     | Code change that improves performance                   | PATCH          |
| `test`     | Adding missing tests or correcting existing tests       | NONE           |
| `build`    | Changes to build system or dependencies                 | NONE           |
| `ci`       | Changes to CI configuration files and scripts           | NONE           |
| `chore`    | Other changes that don't modify src or test files       | NONE           |
| `revert`   | Reverts a previous commit                               | VARIES         |

### Scope

The scope provides additional contextual information specifying the section of the codebase affected:

```
feat(logging): add support for custom log formatters
```

Common scopes in J-Org include:

- `logging` - Logging library
- `config` - Configuration systems
- `ci` - CI/CD pipeline
- `docs` - Documentation

### Breaking Changes

Breaking changes must be indicated by:

1. `!` after the type/scope: `feat(api)!: remove deprecated endpoints`
2. `BREAKING CHANGE:` in the footer section

A breaking change will trigger a MAJOR version bump when following semantic versioning.

## Examples

### Simple Feature

```
feat(auth): add password complexity validation
```

### Bug Fix with Body

```
fix(logging): prevent duplicate log entries

Logger was creating duplicate entries when used with certain configurations.
This changes the internal buffer management to prevent duplication.
```

### Breaking Change

```
feat(api)!: change authentication flow

BREAKING CHANGE: The authentication flow now requires a two-step verification process. Previous implementations will need to be updated.
```

## Configuration and Enforcement

Conventional Commits are enforced in this project using:

1. **Husky**: Git hooks to validate commits
2. **Commitlint**: Validates commit message format
3. **Commitizen**: Interactive CLI tool for formatting commits

### Configuration Files

- `.commitlintrc.json` - Commitlint configuration
- `.cz-config.js` - Commitizen configuration

## Usage

### Creating a Commit with Commitizen

```bash
# Stage your changes
git add .

# Create a conventional commit
pnpm commit
```

This will launch the interactive Commitizen interface to help format your commit message.

### Manual Commit Creation

```bash
git commit -m "feat(component): add new feature"
```

## Best Practices

- **Be Specific**: Provide clear, concise descriptions
- **Use Present Tense**: Write "add feature" not "added feature"
- **Avoid Capitalization**: Start with lowercase letters
- **Keep it Short**: First line should be under 72 characters
- **Reference Issues**: Include issue numbers in footer (e.g., "Fixes #123")
- **One Change per Commit**: Keep commits focused on a single change

## Troubleshooting

### Common Issues

1. **Commit Rejected by Hooks**:

   - Check the error message for specific format issues
   - Ensure type is valid and description is present
   - Fix the format and try again

2. **Confusing Type Selection**:
   - When in doubt between `feat` and `refactor`, choose based on whether the change adds new functionality (`feat`) or reorganizes existing code (`refactor`)

## Changelog

| Version | Date       | Changes                                     |
| ------- | ---------- | ------------------------------------------- |
| 1.0.0   | 2025-04-24 | Initial conventional commits implementation |

## Related Documentation

- [Versioning System](./versioning.md)
- [Husky Hooks](./husky-hooks.md)
- [Release Process](./releases.md)
