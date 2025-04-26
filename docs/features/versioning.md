# Versioning System

## Metadata

| Field       | Value             |
| ----------- | ----------------- |
| Feature     | Versioning System |
| Created     | 2025-04-24        |
| Author      | J-Org Team        |
| Last Update | 2025-04-24        |
| Status      | Approved          |
| Version     | 1.0.0             |

## Overview

This document describes the versioning system used in the J-Org project. The versioning system ensures consistent and predictable version numbers across all project components and follows semantic versioning principles.

## Features

- **Semantic Versioning**: Follows SemVer 2.0.0 specification
- **Centralized Version Management**: Single source of truth for version information
- **Automated Version Bumping**: Version numbers automatically updated during release process
- **Version File Tracking**: Versions tracked in the `version.json` file
- **Release Tagging**: Git tags applied for each release with version number

## Configuration

The versioning system is primarily managed through the `version.json` file located at the root of the repository.

### Version File Structure

```json
{
  "version": "1.2.3",
  "commit": "abc123def456",
  "previousVersion": "1.2.2",
  "lastModified": "2025-04-24T09:30:00Z"
}
```

| Field             | Description                                     |
| ----------------- | ----------------------------------------------- |
| `version`         | Current version of the project                  |
| `commit`          | Git commit hash the version was last updated on |
| `previousVersion` | Previous version before the last update         |
| `lastModified`    | Timestamp of the last version update            |

## Usage

### Reading the Current Version

```typescript
import { readFileSync } from 'fs';

const versionInfo = JSON.parse(readFileSync('version.json', 'utf8'));
console.log(`Current version: ${versionInfo.version}`);
```

### Automatic Version Bumping

The version is automatically bumped during the release process based on conventional commit messages:

- `fix:` commits trigger a PATCH update (1.0.0 → 1.0.1)
- `feat:` commits trigger a MINOR update (1.0.0 → 1.1.0)
- `feat:` commits with `BREAKING CHANGE:` in body trigger a MAJOR update (1.0.0 → 2.0.0)

## Versioning Process

1. Developer makes changes following conventional commit guidelines
2. Pre-release scripts analyze commit messages since last release
3. Version is automatically calculated based on commit types
4. On release approval, version is bumped in `version.json`
5. New version is committed and tagged in git
6. Release artifacts are generated with the new version number

## Best Practices

- **Never Manually Edit Version Numbers**: Let the automated process handle versioning
- **Use Proper Commit Types**: Follow conventional commit format for accurate versioning
- **Consider Impacts Carefully**: Breaking changes must be clearly marked
- **Test Version Integration**: Ensure build scripts correctly incorporate version information
- **Include Version in Logs**: Application logs should include version information for debugging

## Troubleshooting

### Common Issues

1. **Version Not Updating**:

   - Ensure commits follow conventional commit format
   - Check release scripts for errors

2. **Incorrect Version Bump**:
   - Review commit messages for proper formatting
   - Verify that breaking changes are properly marked

## Changelog

| Version | Date       | Changes                                  |
| ------- | ---------- | ---------------------------------------- |
| 1.0.0   | 2025-04-24 | Initial versioning system implementation |

## Related Documentation

- [Conventional Commits](./conventional-commits.md)
- [Release Process](./releases.md)
