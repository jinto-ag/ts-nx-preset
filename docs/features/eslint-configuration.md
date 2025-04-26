# ESLint Configuration

## Metadata

| Field       | Value                |
| ----------- | -------------------- |
| Feature     | ESLint Configuration |
| Created     | 2025-04-24           |
| Author      | J-Org Team           |
| Last Update | 2025-04-24           |
| Status      | Approved             |
| Version     | 1.0.0                |

## Overview

This document describes the ESLint configuration used in the J-Org project. ESLint is configured to enforce consistent code style, catch common errors, and ensure best practices across all TypeScript and JavaScript code in the repository.

## Features

- **Flat Config Format**: Uses modern ESLint flat config format
- **Shared Base Configuration**: Common rules defined in a base config file
- **TypeScript Integration**: Full TypeScript support with type-checking
- **Project-Specific Overrides**: Customized rules for specific projects
- **IDE Integration**: Configuration works with VS Code and other IDEs
- **Automatic Fixing**: Many rules support automatic fixing

## Configuration Files

The ESLint configuration is defined in several files:

- **eslint.base.config.mjs**: Base configuration shared across all projects
- **eslint.config.mjs**: Root configuration that extends the base config
- **libs/\*/eslint.config.mjs**: Project-specific configurations

### Base Configuration

The base configuration in `eslint.base.config.mjs` defines common rules and plugins:

```javascript
// Common ESLint configuration for all projects
export default [
  {
    // JavaScript and TypeScript files
    files: ['**/*.{js,ts,tsx,mjs}'],
    plugins: {
      '@typescript-eslint': typescriptEslint,
      import: importPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      // Common rules for all files
      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],
      // ... more rules
    },
  },
];
```

### Project-Specific Configuration

Each project can extend the base configuration with its own rules:

```javascript
import baseConfig from '../../eslint.base.config.mjs';

export default [
  ...baseConfig,
  {
    files: ['src/**/*.ts'],
    rules: {
      // Project-specific rule overrides
    },
  },
];
```

## Rule Categories

The ESLint configuration enforces rules in several categories:

### Code Quality

- No unused variables or imports
- No unreachable code
- Proper error handling
- Safe type assertions in TypeScript

### Formatting and Style

- Consistent spacing, indentation, and line breaks
- Proper use of braces for control statements
- Consistent naming conventions
- Ordering of import statements

### Best Practices

- No console statements in production code
- Proper promise handling
- Avoiding deprecated APIs
- Consistent return statements

### TypeScript Specific

- Strict type checking
- Proper interface and type usage
- Safe null/undefined handling
- Proper use of access modifiers

## Usage

### Running ESLint

```bash
# Lint all files
pnpm lint

# Lint a specific project
pnpm nx run logging:lint

# Lint and fix automatically
pnpm lint:fix

# Lint only changed files
pnpm nx affected --target=lint
```

### VS Code Integration

ESLint is configured to work with VS Code. Install the ESLint extension and add this to your settings:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["javascript", "typescript"]
}
```

## Customizing Rules

To modify rules for a specific project:

1. Edit the project's `eslint.config.mjs` file
2. Add new rules or override existing ones
3. Commit the changes
4. Run linting to verify the changes

## Best Practices

- **Fix Lint Errors Before Committing**: Use pre-commit hooks to enforce this
- **Don't Disable Rules Globally**: Prefer specific, targeted disables
- **Update Rules Consistently**: Keep all projects in sync with base configuration
- **Document Rule Customizations**: Add comments explaining non-standard rules
- **Balance Strictness**: Rules should improve code quality without excessive restrictions

## Troubleshooting

### Common Issues

1. **Conflicting Rules**:

   - Check for conflicts between different plugins
   - Ensure rule overrides are applied correctly

2. **Performance Issues**:

   - Use `.eslintignore` to exclude build outputs and node_modules
   - Consider using `--cache` flag for faster subsequent runs

3. **Type-Checking Problems**:
   - Ensure `tsconfig.json` path is correct in parser options
   - Verify TypeScript version compatibility

## Changelog

| Version | Date       | Changes                      |
| ------- | ---------- | ---------------------------- |
| 1.0.0   | 2025-04-24 | Initial ESLint configuration |

## Related Documentation

- [Code Style Guidelines](../guidelines/code-style.md)
- [Contributing Guide](../guidelines/contributing.md)
