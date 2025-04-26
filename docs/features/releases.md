# Release Process

## Metadata

| Field       | Value           |
| ----------- | --------------- |
| Feature     | Release Process |
| Created     | 2025-04-24      |
| Author      | Jinto A G       |
| Last Update | 2025-04-24      |
| Status      | Approved        |
| Version     | 1.0.0           |

## Overview

This document describes the automated release process for the TS-NX-Preset template project. Our release workflow automates versioning, changelog generation, and artifact publishing to ensure consistent and reliable releases.

## Features

- **Automated Versioning**: Version numbers determined from conventional commits
- **Changelog Generation**: Release notes automatically generated from commit history
- **Git Tagging**: Releases automatically tagged in Git
- **Artifact Publishing**: Packages automatically published to npm
- **Release PR Creation**: Pull requests for releases with full changelog
- **Environment-Specific Deployments**: Configurable deployment to different environments

## Release Flow

The release process follows these steps:

1. **Prepare Release**:

   - Analyze commits since last release
   - Determine next version based on conventional commits
   - Generate changelog
   - Update version in package.json files
   - Create release branch

2. **Verify Release**:

   - Run all tests
   - Build all artifacts
   - Perform smoke tests

3. **Publish Release**:
   - Tag release in Git
   - Publish packages to npm
   - Create GitHub release
   - Merge release branch to main

## Configuration

The release process is configured through several files:

- **.releaserc.json**: Release configuration
- **version.json**: Current version information
- **ci/release.yml**: CI pipeline for releases

### Release Configuration

The `.releaserc.json` file configures the semantic-release behavior:

```json
{
  "branches": ["main", "next"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/npm",
    "@semantic-release/git",
    "@semantic-release/github"
  ]
}
```

## Usage

### Triggering a Release

Releases are typically triggered automatically when changes are merged to the main branch. However, a release can also be triggered manually:

```bash
# Trigger a release manually
pnpm release
```

### Release Types

Different release types are automatically determined from commit messages:

- **Patch Release (1.0.0 → 1.0.1)**:

  - Triggered by `fix:` commits
  - Bug fixes and patches

- **Minor Release (1.0.0 → 1.1.0)**:

  - Triggered by `feat:` commits
  - New features that don't break compatibility

- **Major Release (1.0.0 → 2.0.0)**:
  - Triggered by `feat:` or `fix:` commits with `BREAKING CHANGE:` footer
  - Changes that break backward compatibility

### Pre-releases

Pre-releases can be created from the `next` branch:

```bash
# Create a pre-release
git checkout -b next
# Make changes
git commit -m "feat: new feature for pre-release"
# Push and trigger pre-release
git push origin next
```

Pre-releases use the format `1.0.0-next.1`, `1.0.0-next.2`, etc.

## Release Artifacts

Each release generates the following artifacts:

1. **Git Tag**: Version tag in the repository
2. **GitHub Release**: Release entry on GitHub with changelog
3. **npm Packages**: Published packages for each library
4. **Documentation**: Updated documentation reflecting the new version

## Best Practices

- **Regular Small Releases**: Prefer frequent small releases over infrequent large ones
- **Thorough Testing**: Ensure all tests pass before triggering a release
- **Proper Commit Messages**: Follow conventional commit format for accurate versioning
- **Review Release Notes**: Always review auto-generated changelogs before finalizing
- **Version Lockstep**: Keep related packages in version lockstep when appropriate
- **Document Breaking Changes**: Clearly document any breaking changes with migration guides

## Troubleshooting

### Common Issues

1. **Version Not Incrementing**:

   - Check that commit messages follow conventional format
   - Verify semantic-release configuration

2. **Release Failed**:

   - Review CI logs for specific errors
   - Check npm authentication
   - Verify GitHub permissions

3. **Incorrect Changelog**:
   - Review commit messages for proper formatting
   - Check semantic-release plugins configuration

## Changelog

| Version | Date       | Changes                                |
| ------- | ---------- | -------------------------------------- |
| 1.0.0   | 2025-04-24 | Initial release process implementation |

## Related Documentation

- [Conventional Commits](./conventional-commits.md)
- [Versioning System](./versioning.md)
- [Continuous Integration](./ci-cd-pipeline.md)
