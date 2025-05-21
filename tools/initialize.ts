/**
 * TypeScript script for initializing a new project from the ts-nx-preset template.
 * This script provides functionality to:
 * 1. Rename the workspace folder and update references to the new name (preserving casing patterns)
 * 2. Update version numbers in package.json files
 * 3. Clean up template-specific files
 * 4. Stage and commit changes to Git
 * 5. Prevent changes in the original ts-nx-preset template repository
 *
 * @packageDocumentation
 */

/* eslint-disable no-console */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// Constants
const WORKSPACE_NAME = 'ts-nx-preset';
const DEFAULT_VERSION = '0.1.0';
const TEMPLATE_FILES = [
  'tools/initialize.ts',
  '.github/CONTRIBUTING.md',
  '.github/DISCUSSION_TEMPLATE.md',
  '.github/FUNDING.yml',
  '.github/SECURITY.md',
  '.github/SUPPORT.md',
];

// Type definitions
interface RenameOptions {
  dryRun?: boolean;
  force?: boolean;
  newVersion?: string;
  clean?: boolean;
}

interface CaseVariants {
  kebabCase: string;
  camelCase: string;
  pascalCase: string;
  snakeCase: string;
  constantCase: string;
  sentenceCase: string;
  titleCase: string;
}

/**
 * Converts a string from kebab-case to various other case formats
 * @param str The string to convert
 * @returns An object containing the string in various case formats
 */
function generateCaseVariants(str: string): CaseVariants {
  const kebabCase = str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const camelCase = kebabCase.replace(/-([a-z])/g, (_, letter) =>
    letter.toUpperCase()
  );

  const pascalCase = kebabCase
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

  const snakeCase = kebabCase.replace(/-/g, '_');

  const constantCase = snakeCase.toUpperCase();

  const sentenceCase = kebabCase
    .split('-')
    .map((word, index) =>
      index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word
    )
    .join(' ');

  const titleCase = kebabCase
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    kebabCase,
    camelCase,
    pascalCase,
    snakeCase,
    constantCase,
    sentenceCase,
    titleCase,
  };
}

/**
 * Checks if the current repository is the original ts-nx-preset template repository
 * @param dir The directory to check
 * @param options Options for the check
 * @returns A promise that resolves if not the template repo, or throws if it is
 */
async function checkIsTemplateRepo(
  dir: string,
  options: RenameOptions = {}
): Promise<void> {
  const { force = false } = options;

  if (force) {
    console.log('⚠️  Force flag is set. Skipping template repository check.');
    return;
  }

  try {
    const remoteUrl = execSync('git remote get-url origin', {
      cwd: dir,
      encoding: 'utf8',
    }).trim();
    if (remoteUrl.includes('ts-nx-preset')) {
      throw new Error(
        'This appears to be the original ts-nx-preset template repository. Use --force to proceed anyway.'
      );
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('ts-nx-preset')) {
      throw error;
    }
    // Ignore errors if no Git repo or remote is set
    console.log('⚠️  No Git remote found. Skipping template repository check.');
  }
}

/**
 * Verifies if the current workspace is a ts-nx-preset template
 * @param dir The directory to check
 * @param options Options for verification
 * @returns A promise that resolves when verification is complete
 */
async function verifyWorkspace(
  dir: string,
  options: RenameOptions = {}
): Promise<void> {
  const { force = false } = options;

  if (force) {
    console.log('⚠️  Force flag is set. Skipping workspace verification.');
    return;
  }

  const packageJsonPath = path.join(dir, 'package.json');
  const nxJsonPath = path.join(dir, 'nx.json');

  try {
    if (fs.existsSync(packageJsonPath)) {
      const packageJsonContent = await fs.promises.readFile(
        packageJsonPath,
        'utf8'
      );
      const packageJson = JSON.parse(packageJsonContent);

      if (
        packageJson.name &&
        !packageJson.name.toLowerCase().includes(WORKSPACE_NAME.toLowerCase())
      ) {
        throw new Error(
          `This workspace does not appear to be a ts-nx-preset template. Current package name: ${packageJson.name}. Use --force to proceed anyway.`
        );
      }
    }

    if (fs.existsSync(nxJsonPath)) {
      const nxJsonContent = await fs.promises.readFile(nxJsonPath, 'utf8');
      const nxJson = JSON.parse(nxJsonContent);

      if (
        nxJson.npmScope &&
        nxJson.npmScope.toLowerCase() !== WORKSPACE_NAME.toLowerCase()
      ) {
        throw new Error(
          `This workspace does not appear to be a ts-nx-preset template. Current npmScope: ${nxJson.npmScope}. Use --force to proceed anyway.`
        );
      }
    }
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      throw new Error(
        `Could not find essential files. Make sure you're running this script from the workspace root.`
      );
    }
    throw error;
  }
}

/**
 * Finds all files that might contain references to the workspace name
 * @param dir The directory to search in
 * @returns An array of file paths to process
 */
function findFilesToProcess(dir: string): string[] {
  const ignoreDirs = [
    'node_modules',
    '.git',
    'dist',
    'build',
    'coverage',
    'tmp',
  ];
  const result: string[] = [];

  function scanDir(currentDir: string): void {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        if (!ignoreDirs.includes(entry.name)) {
          scanDir(fullPath);
        }
      } else {
        const ext = path.extname(entry.name).toLowerCase();
        const relevantExtensions = [
          '.json',
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
          '.md',
          '.yml',
          '.yaml',
          '.html',
          '.css',
          '.scss',
          '.mjs',
          '.cjs',
          '.mts',
          '.cts',
        ];

        if (relevantExtensions.includes(ext)) {
          result.push(fullPath);
        }
      }
    }
  }

  scanDir(dir);
  return result;
}

/**
 * Updates file contents, replacing all instances of the workspace name and folder name with the new name
 * @param files The files to update
 * @param oldNameVariants The old name variants
 * @param newNameVariants The new name variants
 * @param oldFolderName The old folder name
 * @param newFolderName The new folder name
 * @param options Options for the update
 * @returns A promise that resolves when all files are updated
 */
async function updateFileContents(
  files: string[],
  oldNameVariants: CaseVariants,
  newNameVariants: CaseVariants,
  oldFolderName: string,
  newFolderName: string,
  options: RenameOptions = {}
): Promise<void> {
  const { dryRun = false } = options;
  const updatedFiles: string[] = [];

  for (const file of files) {
    try {
      let content = await fs.promises.readFile(file, 'utf8');
      const originalContent = content;

      // Replace workspace name variants
      Object.keys(oldNameVariants).forEach(caseType => {
        const oldValue = oldNameVariants[caseType as keyof CaseVariants];
        const newValue = newNameVariants[caseType as keyof CaseVariants];

        if (['camelCase', 'pascalCase'].includes(caseType)) {
          const regex = new RegExp(`\\b${oldValue}\\b`, 'g');
          content = content.replace(regex, newValue);
        } else {
          content = content.replace(new RegExp(oldValue, 'g'), newValue);
        }
      });

      // Replace scope pattern
      const scopePattern = `@${oldNameVariants.kebabCase}/`;
      const newScope = `@${newNameVariants.kebabCase}/`;
      content = content.replace(new RegExp(scopePattern, 'g'), newScope);

      // Replace folder name
      const folderNameRegex = new RegExp(`\\b${oldFolderName}\\b`, 'g');
      content = content.replace(folderNameRegex, newFolderName);

      if (content !== originalContent) {
        if (!dryRun) {
          await fs.promises.writeFile(file, content, 'utf8');
        }
        updatedFiles.push(file);
        console.log(`${dryRun ? '✏️  Would update' : '✏️  Updated'}: ${file}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(`❌ Error processing file ${file}:`, error.message);
      }
    }
  }

  console.log(
    `📝 ${dryRun ? 'Would update' : 'Updated'} ${updatedFiles.length} files with new workspace name`
  );
}

/**
 * Updates the package.json file with the new workspace name and version
 * @param dir The directory containing the package.json
 * @param newName The new workspace name
 * @param options Options for the update
 * @returns A promise that resolves when the package.json is updated
 */
async function updatePackageJson(
  dir: string,
  newName: string,
  options: RenameOptions = {}
): Promise<void> {
  const { dryRun = false, newVersion = DEFAULT_VERSION } = options;
  const packageJsonPath = path.join(dir, 'package.json');

  try {
    const packageJsonContent = await fs.promises.readFile(
      packageJsonPath,
      'utf8'
    );
    const packageJson = JSON.parse(packageJsonContent);
    const changes: string[] = [];

    if (packageJson.name) {
      const oldName = packageJson.name;
      packageJson.name = packageJson.name.startsWith('@')
        ? `@${newName}/source`
        : newName;
      changes.push(`name: ${oldName} → ${packageJson.name}`);
    }

    if (packageJson.version && newVersion) {
      const oldVersion = packageJson.version;
      packageJson.version = newVersion;
      changes.push(`version: ${oldVersion} → ${newVersion}`);
    }

    if (changes.length > 0) {
      if (!dryRun) {
        await fs.promises.writeFile(
          packageJsonPath,
          JSON.stringify(packageJson, null, 2),
          'utf8'
        );
      }
      changes.forEach(change =>
        console.log(
          `📦 ${dryRun ? 'Would update' : 'Updated'} package.json ${change}`
        )
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ Error updating package.json:`, error.message);
    }
  }
}

/**
 * Updates the nx.json file with the new workspace name
 * @param dir The directory containing the nx.json
 * @param newName The new workspace name
 * @param options Options for the update
 * @returns A promise that resolves when the nx.json is updated
 */
async function updateNxJson(
  dir: string,
  newName: string,
  options: RenameOptions = {}
): Promise<void> {
  const { dryRun = false } = options;
  const nxJsonPath = path.join(dir, 'nx.json');

  try {
    if (fs.existsSync(nxJsonPath)) {
      const nxJsonContent = await fs.promises.readFile(nxJsonPath, 'utf8');
      const nxJson = JSON.parse(nxJsonContent);

      if (nxJson.npmScope) {
        const oldScope = nxJson.npmScope;
        nxJson.npmScope = newName;

        if (!dryRun) {
          await fs.promises.writeFile(
            nxJsonPath,
            JSON.stringify(nxJson, null, 2),
            'utf8'
          );
        }
        console.log(
          `⚙️  ${dryRun ? 'Would update' : 'Updated'} nx.json npmScope from: ${oldScope} to: ${nxJson.npmScope}`
        );
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ Error updating nx.json:`, error.message);
    }
  }
}

/**
 * Removes template-specific files that shouldn't be in the final project
 * @param dir The directory to clean
 * @param options Options for cleaning
 * @returns A promise that resolves when cleaning is complete
 */
async function cleanTemplateFiles(
  dir: string,
  options: RenameOptions = {}
): Promise<void> {
  const { dryRun = false, clean } = options;

  if (!clean) return;

  console.log(
    `🧹 ${dryRun ? 'Would clean' : 'Cleaning'} template-specific files...`
  );

  for (const filePath of TEMPLATE_FILES) {
    const fullPath = path.join(dir, filePath);
    try {
      if (fs.existsSync(fullPath)) {
        if (!dryRun) fs.unlinkSync(fullPath);
        console.log(`🗑️  ${dryRun ? 'Would remove' : 'Removed'}: ${fullPath}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(`❌ Error removing file ${fullPath}:`, error.message);
      }
    }
  }
}

/**
 * Updates package.json scripts by removing template-specific entries
 * @param dir The directory containing the package.json
 * @param options Options for the update
 * @returns A promise that resolves when the scripts are updated
 */
async function updatePackageScripts(
  dir: string,
  options: RenameOptions = {}
): Promise<void> {
  const { dryRun = false, clean } = options;
  const packageJsonPath = path.join(dir, 'package.json');

  if (!clean) return;

  try {
    const packageJsonContent = await fs.promises.readFile(
      packageJsonPath,
      'utf8'
    );
    const packageJson = JSON.parse(packageJsonContent);

    if (packageJson.scripts) {
      const scriptsToRemove = [
        'rename',
        'rename:dry-run',
        'rename:force',
        'initialize',
        'initialize:dry-run',
      ];
      let scriptsChanged = false;

      for (const script of scriptsToRemove) {
        if (Object.prototype.hasOwnProperty.call(packageJson.scripts, script)) {
          // eslint-disable-next-line security/detect-object-injection
          delete packageJson.scripts[script];
          console.log(
            `🧩 ${dryRun ? 'Would remove' : 'Removed'} script: ${script}`
          );
          scriptsChanged = true;
        }
      }

      if (scriptsChanged && !dryRun) {
        await fs.promises.writeFile(
          packageJsonPath,
          JSON.stringify(packageJson, null, 2),
          'utf8'
        );
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ Error updating package.json scripts:`, error.message);
    }
  }
}

/**
 * Updates version numbers in all package.json files except the root
 * @param dir The directory to search for package.json files
 * @param options Options for the update
 * @returns A promise that resolves when all package.json files are updated
 */
async function updateLibraryVersions(
  dir: string,
  options: RenameOptions = {}
): Promise<void> {
  const { dryRun = false, newVersion = DEFAULT_VERSION } = options;

  if (!newVersion) return;

  console.log(
    `📊 ${dryRun ? 'Would update' : 'Updating'} library versions to ${newVersion}...`
  );

  const files = findFilesToProcess(dir).filter(
    file => path.basename(file) === 'package.json'
  );

  for (const file of files) {
    if (file === path.join(dir, 'package.json')) continue;

    try {
      const packageJsonContent = await fs.promises.readFile(file, 'utf8');
      const packageJson = JSON.parse(packageJsonContent);
      let changed = false;

      if (packageJson.version) {
        const oldVersion = packageJson.version;
        packageJson.version = newVersion;
        changed = true;
        console.log(
          `📦 ${dryRun ? 'Would update' : 'Updated'} ${file} version: ${oldVersion} → ${newVersion}`
        );
      }

      if (changed && !dryRun) {
        await fs.promises.writeFile(
          file,
          JSON.stringify(packageJson, null, 2),
          'utf8'
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(`❌ Error updating ${file}:`, error.message);
      }
    }
  }
}

/**
 * Renames the workspace folder
 * @param oldDir The current directory path
 * @param newName The new workspace name (in kebab-case)
 * @param options Options for the rename
 * @returns The new directory path
 */
function renameWorkspaceFolder(
  oldDir: string,
  newName: string,
  options: RenameOptions = {}
): string {
  const { dryRun = false } = options;
  const parentDir = path.dirname(oldDir);
  const newDir = path.join(parentDir, newName);

  try {
    if (fs.existsSync(newDir)) {
      throw new Error(`Directory ${newDir} already exists`);
    }

    if (!dryRun) {
      fs.renameSync(oldDir, newDir);
    }
    console.log(
      `📂 ${dryRun ? 'Would rename' : 'Renamed'} workspace folder from '${oldDir}' to '${newDir}'`
    );
    return newDir;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ Error renaming workspace folder:`, error.message);
    }
    throw error;
  }
}

/**
 * Stages and commits all changes to Git
 * @param dir The directory to stage and commit
 * @param newName The new workspace name
 * @param options Options for the commit
 * @returns A promise that resolves when changes are committed
 */
async function commitChanges(
  dir: string,
  newName: string,
  options: RenameOptions = {}
): Promise<void> {
  const {
    dryRun = false,
    clean = false,
    newVersion = DEFAULT_VERSION,
  } = options;

  if (dryRun) {
    console.log('⚠️  DRY RUN: Would stage and commit changes to Git');
    return;
  }

  try {
    execSync('git rev-parse --is-inside-work-tree', {
      cwd: dir,
      stdio: 'ignore',
    });
    execSync('git add .', { cwd: dir, stdio: 'inherit' });

    const status = execSync('git status --porcelain', {
      cwd: dir,
      encoding: 'utf8',
    });
    if (!status.trim()) {
      console.log('📌 No changes to commit');
      return;
    }

    const commitMessage = clean
      ? `Initialize workspace '${newName}' with version ${newVersion}, rename folder, and clean template files`
      : `Rename workspace and folder to '${newName}' with version ${newVersion}`;
    execSync(`git commit -m "${commitMessage}"`, {
      cwd: dir,
      stdio: 'inherit',
    });

    console.log(`📌 Committed changes: ${commitMessage}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ Error committing changes to Git:`, error.message);
    }
  }
}

/**
 * Renames the workspace by updating the folder name, all relevant files, and configurations
 * @param newName The new name for the workspace
 * @param options Options for the rename process
 * @returns A promise that resolves when renaming is complete
 */
async function renameWorkspace(
  newName: string,
  options: RenameOptions = {}
): Promise<void> {
  const {
    dryRun = false,
    force = false,
    newVersion = DEFAULT_VERSION,
  } = options;

  if (!newName || typeof newName !== 'string' || newName.trim() === '') {
    throw new Error('New name must be a non-empty string');
  }

  // eslint-disable-next-line security/detect-unsafe-regex
  const kebabCasePattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  if (newName.length > 100 || !kebabCasePattern.test(newName)) {
    throw new Error(
      'New name must be in kebab-case format (lowercase letters, numbers, hyphens) and not exceed 100 characters'
    );
  }

  const cwd = process.cwd();
  console.log(`📂 Current working directory: ${cwd}`);
  console.log(
    `🔄 ${dryRun ? 'Would rename' : 'Renaming'} workspace from '${WORKSPACE_NAME}' to '${newName}'...`
  );

  if (dryRun) console.log('⚠️  DRY RUN: No changes will be made to files');

  // Check if running in the original template repository
  await checkIsTemplateRepo(cwd, { force });

  const oldFolderName = path.basename(cwd);
  const targetDir =
    oldFolderName !== newName ? path.join(path.dirname(cwd), newName) : cwd;

  // Use original cwd for dry-run to avoid scanning non-existent directory
  const workingDir = dryRun ? cwd : targetDir;

  if (oldFolderName !== newName) {
    renameWorkspaceFolder(cwd, newName, { dryRun });
  }

  await verifyWorkspace(workingDir, { force });
  const oldNameVariants = generateCaseVariants(WORKSPACE_NAME);
  const newNameVariants = generateCaseVariants(newName);
  const filesToProcess = findFilesToProcess(workingDir);

  console.log(`🔍 Found ${filesToProcess.length} files to process`);

  await updateFileContents(
    filesToProcess,
    oldNameVariants,
    newNameVariants,
    oldFolderName,
    newName,
    {
      dryRun,
    }
  );
  await updatePackageJson(workingDir, newName, { dryRun, newVersion });
  await updateNxJson(workingDir, newName, { dryRun });
  await updateLibraryVersions(workingDir, { dryRun, newVersion });
  await cleanTemplateFiles(workingDir, options);
  await updatePackageScripts(workingDir, options);
  await commitChanges(workingDir, newName, options);

  if (dryRun) {
    console.log(`✅ Dry run complete. No changes were made.`);
  } else {
    console.log(
      `✅ Workspace successfully renamed to '${newName}' with version ${newVersion}.`
    );
    if (options.clean) {
      console.log(`✅ Template files and scripts have been cleaned up.`);
    }
  }
}

/**
 * Parses command-line arguments to determine the command and options
 * @returns An object containing the command, new name, and options
 */
function parseArgs(): {
  command: 'rename' | 'initialize' | 'help';
  newName?: string;
  options: RenameOptions;
} {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    return { command: 'help', options: {} };
  }

  const command = args[0].toLowerCase() as 'rename' | 'initialize' | 'help';
  if (command !== 'rename' && command !== 'initialize') {
    return { command: 'help', options: {} };
  }

  const options: RenameOptions = {
    dryRun: args.includes('--dry-run') || args.includes('-d'),
    force: args.includes('--force') || args.includes('-f'),
    clean: command === 'initialize',
  };

  const versionIndex = args.findIndex(
    arg => arg === '--version' || arg === '-v'
  );
  if (
    versionIndex !== -1 &&
    versionIndex + 1 < args.length &&
    !args[versionIndex + 1].startsWith('-')
  ) {
    options.newVersion = args[versionIndex + 1];
  }

  const filteredArgs = args
    .slice(1)
    .filter(
      arg =>
        !arg.startsWith('-') &&
        args.indexOf(`--version ${arg}`) === -1 &&
        args.indexOf(`-v ${arg}`) === -1
    );

  return {
    command,
    newName: filteredArgs[0],
    options,
  };
}

/**
 * Displays usage information and examples for the script
 */
function printHelp(): void {
  console.log('Usage: tsx tools/initialize.ts <command> [options]');
  console.log('\nCommands:');
  console.log(
    '  rename <new-name>    Rename the workspace folder and references from "ts-nx-preset" to the new name.'
  );
  console.log(
    '  initialize <new-name> Rename the workspace folder and references, remove template-specific files, and commit changes.'
  );
  console.log('\nOptions:');
  console.log(
    '  --version, -v <version> Set a specific version number (default: 0.1.0)'
  );
  console.log(
    '  --dry-run, -d           Show what would be changed without making changes or committing'
  );
  console.log(
    '  --force, -f             Bypass workspace verification and template repository checks'
  );
  console.log('  --help, -h              Show this help message');
  console.log('\nExamples:');
  console.log('  tsx tools/initialize.ts rename my-awesome-project');
  console.log(
    '  tsx tools/initialize.ts initialize my-awesome-project --version 1.0.0'
  );
  console.log('  tsx tools/initialize.ts rename my-awesome-project --dry-run');
}

/**
 * Main entry point for the script
 * @returns A promise that resolves when the script completes
 */
async function main(): Promise<void> {
  const { command, newName, options } = parseArgs();

  if (command === 'help') {
    printHelp();
    process.exit(0);
  }

  if (!newName) {
    console.error('❌ Error: Please provide a new name for the workspace');
    printHelp();
    process.exit(1);
  }

  try {
    await renameWorkspace(newName, options);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ Error: ${error.message}`);
    } else {
      console.error('❌ Unknown error occurred');
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

export { cleanTemplateFiles, generateCaseVariants, renameWorkspace };
