# J-Org Project Documentation

## Overview

This directory contains comprehensive documentation for the J-Org project, its features, libraries, and components. The documentation is organized in a way that supports future integration with documentation tools like VitePress.

## Documentation Structure

- **General Documentation**: `/docs/general/` - General project information
- **Feature Documentation**: `/docs/features/` - Specific feature documentation
- **Guidelines**: `/docs/guidelines/` - Development guidelines and standards
- **Library Documentation**: Located within each library's own directory (e.g., `/libs/logging/docs/`)

All documentation follows a consistent format defined in [documentation-template.md](./documentation-template.md) and uses dash-case naming convention.

## Available Documentation

### Features

| Feature                                                    | Description                         | Status   |
| ---------------------------------------------------------- | ----------------------------------- | -------- |
| [Nx Configuration](./features/nx-configuration.md)         | Monorepo build system configuration | Complete |
| [Versioning System](./features/versioning.md)              | Semantic versioning implementation  | Complete |
| [Conventional Commits](./features/conventional-commits.md) | Standardized commit message format  | Complete |
| [ESLint Configuration](./features/eslint-configuration.md) | Code quality and style enforcement  | Complete |
| [Husky Hooks](./features/husky-hooks.md)                   | Git hooks for code quality          | Complete |
| [Release Process](./features/releases.md)                  | Automated versioning and publishing | Complete |

### Libraries

| Library                                            | Description                         | Location              |
| -------------------------------------------------- | ----------------------------------- | --------------------- |
| [Logging](../libs/logging/docs/logging-library.md) | Flexible TypeScript logging utility | `/libs/logging/docs/` |

## Creating New Documentation

1. Copy the [documentation template](./documentation-template.md)
2. Rename following the dash-case convention (e.g., `new-feature.md`)
3. Place in the appropriate directory:
   - General project information → `/docs/general/`
   - Feature documentation → `/docs/features/`
   - Development guidelines → `/docs/guidelines/`
   - Library-specific documentation → `/libs/[library-name]/docs/`
4. Fill in all sections with relevant information
5. Add the new documentation to the appropriate table in this README

## Documentation Best Practices

- Keep documentation up-to-date as features evolve
- Include practical examples for all features
- Document both public API and internal considerations
- Update the metadata section when making significant changes
- Use consistent formatting for all documentation files
- Include diagrams and visual aids when helpful

## Markdown Linting

This project uses markdown linting to ensure consistent documentation. Rules include:

- Use ATX-style headers with a space after the hash marks (`# Header` not `#Header`)
- Include a single blank line before and after headers, code blocks, and lists
- Use backtick fences for code blocks with language specified
- Use dashes for unordered lists

## Future VitePress Integration

The documentation structure has been designed to seamlessly integrate with VitePress:

- Documentation is organized in a logical hierarchy
- Each document follows a consistent structure
- Cross-references use relative links
- Image paths are consistent
