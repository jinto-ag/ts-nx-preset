#!/bin/bash

# setup-github-release.sh

echo "Setting up GitHub Token for Nx releases..."
echo ""
echo "This script will help configure your environment to create GitHub releases."
echo ""
echo "Prerequisites:"
echo "1. You need a GitHub Personal Access Token with 'repo' permissions"
echo "2. You can create one at: https://github.com/settings/tokens"
echo ""
read -p "Enter your GitHub Personal Access Token: " GITHUB_TOKEN

# Store the token (securely, for this session)
export GITHUB_TOKEN=$GITHUB_TOKEN

# Create a .env file for use with dotenv if needed
echo "GITHUB_TOKEN=$GITHUB_TOKEN" > .env.local
echo "# Add this to .gitignore to prevent committing tokens" >> .env.local

# Instructions
echo ""
echo "✓ Token configured for this session!"
echo ""
echo "For persistent configuration, add to your shell profile:"
echo "export GITHUB_TOKEN=$GITHUB_TOKEN"
echo ""
echo "When you're ready to enable GitHub releases, update nx.json:"
echo "1. Change 'createRelease' from false to 'github'"
echo ""
echo "Try releasing with: pnpm release:beta"