#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get project name from current directory
function getProjectName() {
  return path.basename(process.cwd());
}

// Generate default claude.md content from template
function generateClaudeMd() {
  const projectName = getProjectName();
  
  // Try to read template file
  const templatePath = path.join(__dirname, '..', 'templates', 'claude-md', 'default.md');
  
  try {
    let template = fs.readFileSync(templatePath, 'utf8');
    // Replace PROJECT_NAME placeholder with actual project name
    return template.replace(/PROJECT_NAME/g, projectName);
  } catch (error) {
    // Fallback to inline template if file not found
    return `# ${projectName}

## Project Overview

Brief description of what this project does and its main purpose.

## Project Structure

\`\`\`
${projectName}/
├── src/              # Source code
├── tests/            # Test files
├── docs/             # Documentation
├── .claude/          # Claude configuration
└── README.md         # Project readme
\`\`\`

## Development Guidelines

- Follow existing code patterns and style
- Write tests for new features
- Update documentation when needed
- Use descriptive commit messages

## Key Files

- **README.md**: Project setup and overview
- **src/**: Main application code
- **tests/**: Test suites

## Context for Claude

This project is [brief description of the project type/domain]. When working on this project:

1. Read the README.md first for setup instructions
2. Follow the existing code structure and patterns
3. Ask questions if requirements are unclear
4. Test changes before committing

## Notes

Current focus: [describe what you're currently working on]
`;
  }
}

async function setupClaude() {
  const claudeDir = '.claude';
  const commandsDir = path.join(claudeDir, 'commands');
  const claudeMdPath = path.join(claudeDir, 'claude.md');
  
  // Create .claude directory
  if (!fs.existsSync(claudeDir)) {
    fs.mkdirSync(claudeDir, { recursive: true });
    console.log(`Created ${claudeDir} directory`);
  } else {
    console.log(`${claudeDir} directory already exists`);
  }

  // Create commands subdirectory
  if (!fs.existsSync(commandsDir)) {
    fs.mkdirSync(commandsDir, { recursive: true });
    console.log(`Created ${commandsDir} directory`);
  } else {
    console.log(`${commandsDir} directory already exists`);
  }

  // Generate claude.md if it doesn't exist
  if (!fs.existsSync(claudeMdPath)) {
    const claudeMdContent = generateClaudeMd();
    fs.writeFileSync(claudeMdPath, claudeMdContent, 'utf8');
    console.log(`✓ Created ${claudeMdPath}`);
  } else {
    console.log(`${claudeMdPath} already exists - skipping generation`);
  }

  // Create a sample command file
  const sampleCommandPath = path.join(commandsDir, 'setup-project.md');
  if (!fs.existsSync(sampleCommandPath)) {
    const sampleCommand = `# Setup Project Command

This is a sample slash command. You can invoke it with \`/setup-project\` in Claude Code.

## Instructions

1. Review the current project structure
2. Check if all necessary dependencies are installed
3. Verify the development environment is properly configured
4. Suggest any missing setup steps

## Context

This command helps ensure the project is ready for development work.
`;
    fs.writeFileSync(sampleCommandPath, sampleCommand, 'utf8');
    console.log(`✓ Created sample command: ${sampleCommandPath}`);
  }

  console.log('\n✅ Claude setup completed successfully!');
  console.log('\nFiles created:');
  console.log(`- ${claudeMdPath} - Main Claude context file`);
  console.log(`- ${commandsDir}/ - Directory for custom slash commands`);
  console.log(`- ${sampleCommandPath} - Sample slash command`);
  console.log('\nNext steps:');
  console.log('1. Edit claude.md to customize it for your project');
  console.log('2. Add custom slash commands to the commands/ directory');
  console.log('3. Start Claude Code and it will automatically read your configuration');
  console.log('4. Use /setup-project to test the sample command');
}

// Run the setup
setupClaude().catch(error => {
  console.error('Setup failed:', error.message);
  process.exit(1);
});
