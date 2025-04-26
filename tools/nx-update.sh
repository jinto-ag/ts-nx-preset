#!/bin/bash

# nx-update.sh - Script to update Nx packages and apply migrations

set -e

echo "===== Nx Update Automation ====="
echo "This script updates Nx packages and applies migrations"
echo ""

# Check if on a clean branch
if [ -n "$(git status --porcelain)" ]; then
  echo "❌ Working directory is not clean. Please commit or stash changes before updating."
  exit 1
fi

# Create a new branch for the update
BRANCH_NAME="chore/nx-update-$(date +%Y%m%d)"
git checkout -b "$BRANCH_NAME"
echo "✅ Created branch: $BRANCH_NAME"

# Step 1: Check for updates and fetch migrations
echo "🔍 Checking for Nx updates..."
MIGRATE_OUTPUT=$(npx nx migrate latest 2>&1)
echo "$MIGRATE_OUTPUT"

# Enhance detection of changes - check both git status and the output text
if [[ -n "$(git status --porcelain package.json)" || "$MIGRATE_OUTPUT" == *"package.json has been updated"* ]]; then
  echo "📦 Updates found for Nx packages"
  
  # Step 2: Install new packages
  echo "📥 Installing updated packages..."
  pnpm install
  
  # Double check if there were actual changes in the lock file after install
  if [[ -n "$(git status --porcelain package.json)" || -n "$(git status --porcelain pnpm-lock.yaml)" ]]; then
    # Commit the package updates
    git add package.json pnpm-lock.yaml
    git commit -m "chore(nx): Update Nx packages to latest version"
    
    # Step 3: Apply migrations if migrations.json exists
    if [ -f "migrations.json" ]; then
      echo "🔄 Applying migrations..."
      npx nx migrate --run-migrations
      
      # Check if any files were changed during migration
      if [ -n "$(git status --porcelain)" ]; then
        echo "✏️ Migrations applied changes to the workspace"
        git add .
        git commit -m "chore(nx): Apply Nx migrations"
      else
        echo "✅ No changes from migrations"
      fi
      
      # Clean up migrations file
      if [ -f "migrations.json" ]; then
        rm migrations.json
        echo "🧹 Removed migrations.json file"
      fi
    else
      echo "✅ No migrations needed"
    fi
    
    # Step 4: Run tests to make sure everything still works
    echo "🧪 Running tests across the workspace..."
    pnpm run affected:test || { echo "❌ Tests failed! Please fix before continuing."; exit 1; }
    
    echo "🔄 Running affected builds..."
    pnpm run affected:build || { echo "❌ Build failed! Please fix before continuing."; exit 1; }
    
    echo "✅ All tests and builds passed!"
    echo ""
    echo "🚀 Ready to create a PR with these changes:"
    echo "git push -u origin $BRANCH_NAME"
    echo "Then create a PR on GitHub"
  else
    echo "⚠️ No actual changes detected after package installation. Cleaning up..."
    git checkout -
    git branch -D "$BRANCH_NAME"
  fi
else
  echo "✅ Nx packages are already up-to-date"
  git checkout -
  git branch -D "$BRANCH_NAME"
fi