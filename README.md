# TS-NX-Preset

> **BETA NOTICE**: This project is currently in beta version (0.1.0-beta.1). APIs may change before the stable release. Please report any issues on our GitHub repository.

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

## Overview

TS-NX-Preset is a template repository for TypeScript monorepo projects powered by Nx. It provides a solid foundation for scaffolding scalable JavaScript/TypeScript development environments with built-in support for:

- Consistent code quality through ESLint and Prettier configurations
- Structured commit messages using Conventional Commits
- Automated Git hooks with Husky
- Simplified versioning and release management
- Comprehensive documentation templates

## Key Features

- **Project Initialization**: Tool to quickly rename and set up your own project from this template
- **Logging Library**: A flexible logging utility for consistent logging across projects
- **Workspace Preset**: Custom Nx generators for scaffolding standardized projects
- **Conventional Commits**: Enforced commit message standards
- **Automated Versioning**: Nx-powered versioning and release management

## Getting Started

### Create a New Project from Template

1. Click the "Use this template" button on the [ts-nx-preset GitHub repository](https://github.com/jinto-ag/ts-nx-preset) to create a new repository
2. Clone your new repository locally:
   ```sh
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```
3. Initialize your project to rename the workspace and clean up template files:

   ```sh
   # Install dependencies first
   pnpm install

   # Initialize your project with a new name
   pnpm initialize your-project-name
   ```

### Working with the Workspace

```sh
# View the project dependency graph
pnpx nx graph

# Run tests across affected projects
pnpx nx affected:test
```

### Project Initialization

This workspace includes a dedicated initialization tool to help you quickly set up your own project:

```sh
# Initialize a new project using the TypeScript script directly
pnpx tsx tools/initialize.ts initialize my-project-name

# Use custom version number
pnpx tsx tools/initialize.ts initialize my-project-name --version 1.0.0

# Preview changes without applying them
pnpx tsx tools/initialize.ts initialize my-project-name --dry-run
```

This will:

- Rename the workspace from `ts-nx-preset` to your project name
- Update all references to the workspace name throughout the codebase
- Clean up template-specific files and scripts
- Stage and commit the changes to Git

[Learn more about Project Initialization](/docs/features/project-initialization.md)

### Using as a Template

This workspace is designed to be used as a template for creating new projects. Follow these steps:

1. **Create a New Repository from Template**:

   - Go to the [ts-nx-preset GitHub repository](https://github.com/jinto-ag/ts-nx-preset)
   - Click the "Use this template" button near the top of the page
   - Fill in your new repository details and create it
   - Clone your new repository locally

2. **Initialize Your Project**:
   Once you've cloned your repository, you can use one of the following methods to set up your project:

#### 1. Initialize a New Project (Recommended)

The initialize command renames the workspace and cleans up template-specific files:

```sh
# Initialize a new project (renames and cleans up template files)
pnpm initialize your-project-name
# or with other package managers
npm run initialize your-project-name
yarn initialize your-project-name

# To see what would be changed without making changes (dry run)
pnpm initialize:dry-run your-project-name
# or with other package managers
npm run initialize:dry-run your-project-name
yarn initialize:dry-run your-project-name

# Specify a custom version (default is 0.1.0)
pnpm initialize your-project-name --version 1.0.0
# or with other package managers
npm run initialize your-project-name -- --version 1.0.0
yarn initialize your-project-name --version 1.0.0
```

#### 2. Rename Only (Keep Template Files)

If you just want to rename the workspace without removing template files:

```sh
# Rename the workspace only
pnpm rename your-project-name
# or with other package managers
npm run rename your-project-name
yarn rename your-project-name

# To see what would be changed without making changes (dry run)
pnpm rename:dry-run your-project-name
# or with other package managers
npm run rename:dry-run your-project-name
yarn rename:dry-run your-project-name

# If you need to bypass workspace verification (use with caution)
pnpm rename:force your-project-name
# or with other package managers
npm run rename:force your-project-name
yarn rename:force your-project-name
```

Both options will update all references to `ts-nx-preset` in the codebase to your project name, including package names, import statements, and configuration files.

## Generate a library

```sh
pnpx nx g @nx/js:lib packages/pkg1 --publishable --importPath=@my-org/pkg1
```

## Run tasks

To build the library use:

```sh
pnpx nx build pkg1
```

To run any task with Nx use:

```sh
pnpx nx <target> <project-name>
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Versioning and releasing

To version and release the library use

```
pnpx nx release
```

Pass `--dry-run` to see what would happen without actually releasing the library.

[Learn more about Nx release &raquo;](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Keep TypeScript project references up to date

Nx automatically updates TypeScript [project references](https://www.typescriptlang.org/docs/handbook/project-references.html) in `tsconfig.json` files to ensure they remain accurate based on your project dependencies (`import` or `require` statements). This sync is automatically done when running tasks such as `build` or `typecheck`, which require updated references to function correctly.

To manually trigger the process to sync the project graph dependencies information to the TypeScript project references, run the following command:

```sh
pnpx nx sync
```

You can enforce that the TypeScript project references are always in the correct state when running in CI by adding a step to your CI job configuration that runs the following command:

```sh
pnpx nx sync:check
```

[Learn more about nx sync](https://nx.dev/reference/nx-commands#sync)

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Documentation

Comprehensive documentation is available in the `/docs` directory:

- [Feature Documentation](/docs/features/)
- [Guidelines](/docs/guidelines/)
- [Library Documentation](/libs/logging/docs/logging-library.md)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/nx-api/js?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:

- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## License

This project is licensed under the MIT License.
