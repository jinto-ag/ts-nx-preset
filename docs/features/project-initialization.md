# Project Initialization

## Metadata

| Field       | Value                  |
| ----------- | ---------------------- |
| Feature     | Project Initialization |
| Created     | 2025-05-21             |
| Author      | Jinto A G              |
| Last Update | 2025-05-21             |
| Status      | Approved               |
| Version     | 1.0.0                  |

## Overview

Project Initialization provides a streamlined way to transform the ts-nx-preset template into your own project. This tool allows you to rename the workspace while preserving various casing formats, update version numbers, and clean up template-specific files. It's designed to accelerate the setup process for new projects based on the ts-nx-preset template.

## Features

- **Workspace Renaming**: Renames the workspace folder and updates all references to the new name
- **Case Format Preservation**: Maintains consistent naming across kebab-case, camelCase, PascalCase, and more
- **Version Management**: Updates version numbers in all package.json files
- **Template Cleanup**: Removes template-specific files and scripts
- **Git Integration**: Automatically stages and commits changes (optional)
- **Safety Checks**: Prevents accidental modifications to the original template repository

## Getting Started

### Creating a New Project from Template

1. Go to the [ts-nx-preset GitHub repository](https://github.com/jinto-ag/ts-nx-preset)
2. Click the "Use this template" button near the top of the page
3. Fill in your new repository details and create it
4. Clone your new repository locally:
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```
5. Install dependencies and initialize your project:

   ```bash
   # Install dependencies first
   pnpm install

   # Initialize your project
   pnpm initialize your-project-name
   ```

## Usage

The initialization functionality is provided through the TypeScript CLI tool located at `tools/initialize.ts`. It offers two main commands:

### Rename Command

Renames the workspace without removing template files:

```bash
# Basic usage
pnpx tsx tools/initialize.ts rename my-new-project

# With custom version
pnpx tsx tools/initialize.ts rename my-new-project --version 2.0.0

# Dry run to preview changes without applying them
pnpx tsx tools/initialize.ts rename my-new-project --dry-run
```

### Initialize Command

Renames the workspace and cleans up template files:

```bash
# Basic usage
pnpx tsx tools/initialize.ts initialize my-new-project

# With custom version
pnpx tsx tools/initialize.ts initialize my-new-project --version 2.0.0

# Dry run to preview changes without applying them
pnpx tsx tools/initialize.ts initialize my-new-project --dry-run
```

For convenience, these commands are also available as scripts through package managers:

```bash
# Rename commands with pnpm (recommended)
pnpm rename my-new-project
pnpm rename:dry-run my-new-project
pnpm rename:force my-new-project

# Or using npm
npm run rename my-new-project
npm run rename:dry-run my-new-project
npm run rename:force my-new-project

# Or using yarn
yarn rename my-new-project
yarn rename:dry-run my-new-project
yarn rename:force my-new-project

# Initialize commands with pnpm (recommended)
pnpm initialize my-new-project
pnpm initialize:dry-run my-new-project

# Or using npm
npm run initialize my-new-project
npm run initialize:dry-run my-new-project

# Or using yarn
yarn initialize my-new-project
yarn initialize:dry-run my-new-project
```

## Options

| Option            | Description                                    |
| ----------------- | ---------------------------------------------- |
| `--version`, `-v` | Set a specific version number (default: 0.1.0) |
| `--dry-run`, `-d` | Preview changes without applying them          |
| `--force`, `-f`   | Bypass workspace verification checks           |
| `--help`, `-h`    | Show help information                          |

## Implementation Details

The initialization tool performs the following operations:

1. **Workspace Verification**: Ensures you're working with a ts-nx-preset template
2. **Case Variant Generation**: Creates variations of the workspace name in different case formats
3. **File Processing**: Scans for files that need to be updated
4. **Content Updates**: Updates references to the old name with the new name
5. **Package Updates**: Updates package.json name and version fields
6. **Nx Configuration**: Updates the npmScope in nx.json
7. **Library Updates**: Updates versions in all package.json files
8. **Template Cleanup**: Removes template-specific files (during initialization)
9. **Script Cleanup**: Removes initialization-related scripts (during initialization)
10. **Git Commit**: Stages and commits the changes (during initialization)

## After Initialization

Once your project is initialized, you'll have a clean starting point for your TypeScript monorepo with the following benefits:

1. **Clean Project Identity**: All references to the template name are replaced with your project name
2. **Ready-to-Use Structure**: The monorepo structure remains intact with all the tooling configured
3. **Removed Template Files**: Template-specific files are removed to avoid clutter
4. **Fresh Git History**: The initialization process creates a new commit with all changes

### Next Steps After Initialization

After initializing your project, you can:

1. **Start developing your libraries**:

   ```bash
   pnpx nx g @nx/js:lib packages/my-library --publishable --importPath=@your-org/my-library
   ```

2. **Run tasks across your workspace**:

   ```bash
   pnpx nx run-many -t lint,test,build --all
   ```

3. **Explore the project structure** to understand how the monorepo is organized

## Files Cleaned During Initialization

The following files are removed during the initialization process:

- `tools/initialize.ts` (the initialization tool itself)
- `.github/CONTRIBUTING.md`
- `.github/DISCUSSION_TEMPLATE.md`
- `.github/FUNDING.yml`
- `.github/SECURITY.md`
- `.github/SUPPORT.md`

## Scripts Removed During Initialization

The following npm scripts are removed from package.json during initialization:

- `rename`
- `rename:dry-run`
- `rename:force`
- `initialize`
- `initialize:dry-run`

## Integration with Other Features

The initialization tool works seamlessly with other features of the ts-nx-preset:

- **Nx Configuration**: Updates the npmScope in nx.json to match the new project name
- **ESLint Configuration**: Updates ESLint configurations with the new project name
- **Package Management**: Updates package names while preserving the proper scoping
