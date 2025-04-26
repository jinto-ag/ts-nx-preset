# Nx Configuration

## Metadata

| Field       | Value            |
| ----------- | ---------------- |
| Feature     | Nx Configuration |
| Created     | 2025-04-24       |
| Author      | Jinto A G        |
| Last Update | 2025-04-24       |
| Status      | Approved         |
| Version     | 1.0.0            |

## Overview

This document describes the Nx configuration used in the TS-NX-Preset template project. Nx is a build system with smart rebuilds and advanced caching that helps maintain a modular monorepo architecture, enabling efficient development workflows for multiple applications and libraries.

## Features

- **Workspace Management**: Centralized configuration for multiple projects
- **Dependency Graph**: Automatic tracking of project dependencies
- **Affected Commands**: Only rebuild what changed for faster development
- **Caching**: Intelligent caching of build artifacts to speed up builds
- **Code Generation**: Scaffolding for new applications and libraries
- **Custom Executors/Builders**: Project-specific build and deployment configurations

## Configuration

The Nx configuration is primarily defined in the `nx.json` file at the root of the repository.

### Key Configuration Files

- **nx.json**: Main Nx configuration file
- **tsconfig.base.json**: Shared TypeScript configuration
- **vitest.workspace.ts**: Vitest configuration for running tests
- **pnpm-workspace.yaml**: Workspace package definition for pnpm

## Usage

### Common Nx Commands

```bash
# Run a specific target for a project
pnpm nx run logging:build

# Run a target for all projects
pnpm nx run-many --target=test

# Run a target only for projects affected by changes
pnpm nx affected --target=build

# Generate a new library
pnpm nx generate @nx/js:library my-new-lib

# Visualize the dependency graph
pnpm nx graph
```

### Using the Nx Dependency Graph

The dependency graph visualizes relationships between projects in the workspace:

```bash
# Open the dependency graph in a browser
pnpm nx graph
```

This helps understand the impact of changes across the project ecosystem.

## Workspace Structure

The TS-NX-Preset workspace is organized according to Nx best practices:

```txt
ts-nx-preset/
├── apps/           # Application projects
├── libs/           # Shared libraries
│   └── logging/    # Logging library
├── tools/          # Custom tooling and scripts
└── nx.json         # Nx configuration
```

## Best Practices

- **Maintain Small, Focused Libraries**: Keep libraries small and focused on a single responsibility
- **Use Tags for Organization**: Apply tags in nx.json to categorize projects
- **Define Clear Boundaries**: Set explicit module boundaries to prevent unwanted dependencies
- **Leverage Affected Commands**: Use affected commands for more efficient development cycles
- **Keep the Cache Clean**: Periodically clean the Nx cache to prevent it from growing too large
- **Use Common Preset**: Standardize configurations across libraries with presets

## Known Issues and Limitations

- Nx cache can grow large over time and may need manual cleanup
- Initial setup has some complexity and learning curve
- Some external tools may require specific integration with Nx

## Troubleshooting

### Common Issues

1. **Build Failures**:

   - Clear the Nx cache: `pnpm nx clear-cache`
   - Ensure all dependencies are installed: `pnpm install`

2. **Dependency Graph Issues**:

   - Regenerate the project graph: `pnpm nx graph --file=dependency-graph.json`

3. **Performance Problems**:
   - Check cache size: `du -sh .nx/cache`
   - Consider using cloud-based caching for larger teams

## Changelog

| Version | Date       | Changes                                          |
| ------- | ---------- | ------------------------------------------------ |
| 1.0.0   | 2025-04-24 | Initial configuration with basic workspace setup |

## Related Documentation

- [Project README](../README.md)
- [ESLint Configuration](./eslint-configuration.md)
- [Logging Library](/libs/logging/docs/logging-library.md)
