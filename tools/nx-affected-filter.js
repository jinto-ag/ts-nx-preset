#!/usr/bin/env node

/**
 * nx-affected-filter.js
 *
 * This script helps integrate lint-staged with nx affected commands.
 * It filters staged files to only those that are part of Nx projects.
 *
 * Usage: node nx-affected-filter.js <target> <...files>
 * Example: node nx-affected-filter.js lint file1.ts file2.tsx
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get command line arguments
const [, , target, ...stagedFiles] = process.argv;

if (!target || stagedFiles.length === 0) {
  console.error('Usage: node nx-affected-filter.js <target> <...files>');
  process.exit(1);
}

// Make paths relative to workspace root
const workspaceRoot = process.cwd();
const relativeFiles = stagedFiles.map(file =>
  path.relative(workspaceRoot, file)
);

// Create a temporary file with the list of files
const tempFile = path.join(workspaceRoot, '.nx-staged-files.json');
fs.writeFileSync(tempFile, JSON.stringify(relativeFiles, null, 2));

try {
  // Run nx affected with the files-from option
  const command = `pnpm exec nx affected -t ${target} --files-from=.nx-staged-files.json`;
  console.log(`Running: ${command}`);
  execSync(command, { stdio: 'inherit' });
} catch (error) {
  console.error('Error running nx affected:', error.message);
  process.exit(1);
} finally {
  // Clean up the temporary file
  fs.unlinkSync(tempFile);
}
