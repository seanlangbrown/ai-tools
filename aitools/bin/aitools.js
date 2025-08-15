#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

const command = process.argv[2];
const args = process.argv.slice(3);

function showHelp() {
  console.log(`
aitools - CLI tools for setting up Claude Code development environments

Usage:
  aitools <command> [options]

Commands:
  devcontainers    Set up .devcontainer directory with Claude Code configuration
  claude-md        Set up .claude directory and generate default claude.md
  help             Show this help message

Examples:
  aitools devcontainers
  aitools claude-md
  
Alternative commands:
  setup-claude-devcontainers
  setup-claude-md
`);
}

function runScript(scriptName) {
  const scriptPath = path.join(__dirname, `${scriptName}.js`);
  try {
    execSync(`node "${scriptPath}" ${args.join(' ')}`, { stdio: 'inherit' });
  } catch (error) {
    process.exit(error.status || 1);
  }
}

switch (command) {
  case 'devcontainers':
    runScript('setup-devcontainers');
    break;
  case 'claude-md':
    runScript('setup-claude-md');
    break;
  case 'help':
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    console.error(`Unknown command: ${command}`);
    showHelp();
    process.exit(1);
}
