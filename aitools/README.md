# seanlangbrown-ai-tools

CLI tools for setting up Claude Code development environments with devcontainers and project configuration.

## Installation

### From NPM (Recommended)

Install globally via npm:

```bash
npm install -g seanlangbrown-ai-tools
```

### Local Development Installation

For developing or testing local changes:

```bash
# Clone the repository
git clone <your-repo-url>
cd <your-repo>

# Install locally from the aitools directory
cd aitools
chmod +x install.sh
./install.sh
```

This provides three commands:
- `aitools` - Main CLI with subcommands
- `setup-claude-devcontainers` - Direct command for devcontainer setup
- `setup-claude-md` - Direct command for Claude configuration setup

## Repository Structure

To organize this package in your git repository, structure it as follows:

```
your-repo/
├── aitools/                    # Package directory
│   ├── package.json           # Package configuration
│   ├── install.sh             # Local installation script
│   ├── README.md              # This file
│   ├── bin/                   # Executable scripts
│   │   ├── aitools.js         # Main CLI
│   │   ├── setup-devcontainers.js
│   │   └── setup-claude-md.js
│   └── templates/             # Template files
│       └── claude-md/
│           └── default.md     # Default claude.md template
├── .github/
│   └── workflows/
│       ├── publish.yml        # NPM publishing workflow
│       └── version-check.yml  # PR version validation
└── other-project-files...
```

## GitHub Actions

This package includes two GitHub Actions:

### 1. Version Check (`version-check.yml`)
**Triggers:** Pull requests that modify files in `aitools/`
**Purpose:** Ensures that any changes to the package include a proper version bump

**What it does:**
- Detects if files in `aitools/` have been modified
- Compares the version in `package.json` between PR branch and main branch
- **Fails the PR** if changes exist but version hasn't been bumped
- Provides clear instructions on how to fix version issues

**Error example:**
```
❌ ERROR: Changes detected in aitools/ but version was not bumped!

To fix this:
1. Navigate to aitools directory: cd aitools
2. Bump the version: npm version patch|minor|major
3. Commit the version change: git add package.json && git commit -m 'Bump version'
4. Push the changes: git push
```

### 2. Publish to NPM (`publish.yml`)
**Triggers:** Push to main branch
**Purpose:** Automatically publishes new versions to NPM

**What it does:**
- Checks if the current version already exists on NPM
- Runs tests (if present)
- Publishes to NPM if version is new
- Creates git tags and GitHub releases
- Skips publishing if version already exists

### Local Development Workflow

1. **Make changes** in the `aitools/` directory
2. **Test locally**:
   ```bash
   cd aitools
   ./install.sh  # Reinstall with changes
   ```
3. **Test in a project**:
   ```bash
   cd /path/to/test-project
   aitools devcontainers
   aitools claude-md
   ```
4. **Update version** when ready for PR (see Version Management below)
5. **Create PR** - Version Check action will verify version was bumped
6. **Merge PR** - Auto-publish to NPM will trigger

### Pull Request Workflow

When creating a PR that modifies `aitools/`:

```bash
# 1. Make your changes
cd aitools
# ... make changes to files ...

# 2. Bump version before creating PR
npm version patch  # or minor/major

# 3. Commit all changes including version
cd ..
git add aitools/
git commit -m "Add new feature and bump version"

# 4. Create PR
git push origin feature-branch
# GitHub PR will automatically run version check
```

**Important:** The Version Check action will **fail your PR** if you modify files in `aitools/` without bumping the version. This ensures every change gets properly 
versioned.

### Version Management

Since this is a monorepo, version management applies only to the `aitools` package. Always work from the `aitools` directory:

```bash
cd aitools

# Check current version
npm version

# Bump version (choose one):
npm version patch   # 1.0.0 -> 1.0.1 (bug fixes)
npm version minor   # 1.0.0 -> 1.1.0 (new features, backward compatible)
npm version major   # 1.0.0 -> 2.0.0 (breaking changes)

# Or set a specific version:
npm version 1.2.3

# Or use prerelease versions:
npm version prerelease --preid=beta  # 1.0.0 -> 1.0.1-beta.0
npm version prerelease               # 1.0.1-beta.0 -> 1.0.1-beta.1
```

**Important Notes:**
- The `npm version` command only updates `aitools/package.json` - it doesn't create git tags in this monorepo setup
- The version change must be committed and pushed to trigger the GitHub Action
- Git tags are created automatically by the GitHub Action during publishing

**Complete release workflow:**
```bash
# 1. Make your changes in aitools/
cd aitools

# 2. Test locally
./install.sh

# 3. Update version
npm version patch  # or minor/major as appropriate

# 4. Commit the version change
cd ..  # Back to repo root
git add aitools/package.json
git commit -m "Bump aitools version to $(node -p 'require("./aitools/package.json").version')"

# 5. Push to trigger auto-publish
git push origin main
```

### Publishing

The package is automatically published to NPM when:
- Changes are pushed to the main branch
- The version in `aitools/package.json` doesn't already exist on NPM
- All files in the `aitools/` directory are included in the publish

**Automated Checks:**
- **Version Check**: PRs that modify files in `aitools/` must include a version bump, or the PR will fail
- **Publish Check**: Only publishes if the version doesn't already exist on NPM

**Manual verification:**
```bash
# Check if version exists on NPM
npm view seanlangbrown-ai-tools versions --json

# Check what files would be published
cd aitools
npm pack --dry-run
```

## Commands

### Setup DevContainers

Creates a `.devcontainer` directory and downloads **all files** from the official Claude Code devcontainer configuration.

```bash
# Using main CLI
aitools devcontainers

# Or using direct command
setup-claude-devcontainers
```

**What it does:**
- Creates `.devcontainer/` directory
- Dynamically fetches all files from the Anthropic Claude Code repository
- Downloads files like `devcontainer.json`, `Dockerfile`, `init-firewall.sh`, etc.
- Sets appropriate file permissions for shell scripts
- Adapts automatically if Anthropic adds new files to their devcontainer setup

**Requirements:**
- Internet connection to access GitHub API and download files

### Setup Claude Configuration

Creates a `.claude` directory and generates a default `claude.md` context file for your project.

```bash
# Using main CLI
aitools claude-md

# Or using direct command
setup-claude-md
```

**What it does:**
- Creates `.claude/` directory
- Creates `.claude/commands/` directory for custom slash commands
- Generates `claude.md` with a concise, project-specific context template
- Creates a sample slash command file

**Requirements:**
- None - can be run in any directory

## Usage Workflow

1. **Navigate to your project directory**:
   ```bash
   cd /path/to/your/project
   ```

2. **Set up devcontainer** (optional but recommended):
   ```bash
   aitools devcontainers
   ```

3. **Set up Claude configuration**:
   ```bash
   aitools claude-md
   ```

4. **Customize your setup**:
   - Edit `.claude/claude.md` to describe your project
   - Add custom commands to `.claude/commands/`
   - Customize `.devcontainer/devcontainer.json` if needed

5. **Start development**:
   - Open in VS Code and "Reopen in Container" (if using devcontainer)
   - Run `claude` in your terminal to start Claude Code

## Generated Files

### DevContainer Setup
```
.devcontainer/
├── devcontainer.json    # VS Code container configuration
├── Dockerfile          # Container image definition
└── init-firewall.sh    # Security firewall rules
```

### Claude Configuration
```
.claude/
├── claude.md           # Main project context file
└── commands/
    └── setup-project.md # Sample slash command
```

## Claude.md Template

The generated `claude.md` is concise and follows Anthropic's recommended structure:
- Project overview and structure
- Development guidelines and standards
- Key files and directories
- Context and instructions for Claude
- Notes section for current focus

## Best Practices

1. **Keep claude.md updated**: Update the notes section with current focus and project changes
2. **Use descriptive project structure**: Help Claude understand your codebase organization
3. **Create custom commands**: Add frequently-used workflows to `.claude/commands/`
4. **Version control**: Commit `.claude/` and `.devcontainer/` directories to share with your team

## Troubleshooting

### Version Check Failed on PR
If your PR fails the version check with "Changes detected but version was not bumped":

```bash
# Fix the version check failure
cd aitools
npm version patch  # or minor/major as appropriate
git add package.json
git commit -m "Bump version for PR changes"
git push  # Push to your PR branch
```

The version check will re-run and should pass.

### Download failures
Ensure you have internet connectivity and access to GitHub. The devcontainer tool downloads files from:
- GitHub API: `https://api.github.com/repos/anthropics/claude-code/contents/.devcontainer`
- Raw file URLs from the repository

### Permission issues
On Unix systems, the script automatically sets execute permissions for shell scripts. If you encounter permission issues, manually set them:
```bash
chmod +x .devcontainer/*.sh
```

### Template not found
If the claude.md template isn't found, the script falls back to an inline template. For the full template experience, ensure the package is properly installed.

## Requirements

- Node.js 14.0.0 or higher
- Internet connection for downloading template files

## Contributing

This tool downloads the official Anthropic Claude Code devcontainer configuration. For issues with the devcontainer setup itself, refer to the [official Claude Code 
repository](https://github.com/anthropics/claude-code).

## License

MIT
