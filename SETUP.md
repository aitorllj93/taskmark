# Setup Guide

This guide will help you set up the taskmark project for development and publishing.

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Git Repository

Update the repository URLs in `package.json`:

```json
"repository": {
  "type": "git",
  "url": "git+https://github.com/YOUR_USERNAME/taskmark.git"
},
"bugs": {
  "url": "https://github.com/YOUR_USERNAME/taskmark/issues"
},
"homepage": "https://github.com/YOUR_USERNAME/taskmark#readme"
```

Also update the `repo` field in `docs/index.html`:

```javascript
repo: 'YOUR_USERNAME/taskmark',
```

### 3. Initialize Git

```bash
git init
git add .
git commit -m "feat: initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/taskmark.git
git push -u origin main
```

## GitHub Configuration

### 1. Enable GitHub Pages

1. Go to your repository settings on GitHub
2. Navigate to **Pages** section
3. Under **Source**, select **GitHub Actions**

### 2. Set up npm Token for Publishing

1. Create an npm access token at https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. Choose "Automation" token type
3. Add it as a repository secret:
   - Go to repository **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Name: `NPM_TOKEN`
   - Value: your npm token

### 3. Configure Dependabot (Optional)

Dependabot is already configured in `.github/dependabot.yml`. It will automatically create PRs for dependency updates.

## Development Workflow

### Run Tests

```bash
# Run once
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

### Linting & Formatting

```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Type Checking

```bash
npm run typecheck
```

### Build

```bash
npm run build
```

### Documentation

```bash
# Serve docs locally at http://localhost:3000
npm run docs:serve
```

## Publishing Workflow

### Manual Publishing

```bash
# Test build
npm run build

# Publish to npm
npm publish
```

### Automated Publishing with GitHub Actions

1. **Create a new version:**
   ```bash
   npm version patch  # or minor, or major
   ```

2. **Push changes and tags:**
   ```bash
   git push && git push --tags
   ```

3. The GitHub Action will automatically:
   - Run tests
   - Build the package
   - Publish to npm

### Using GitHub Release Workflow

Alternatively, use the GitHub UI:

1. Go to **Actions** → **Release** workflow
2. Click **Run workflow**
3. Select version bump type (patch/minor/major)
4. The workflow will create a version bump, tag, and push automatically

## GitHub Actions Overview

### CI Workflow (`.github/workflows/ci.yml`)
- Runs on every push and pull request
- Tests on Node.js 18, 20, and 22
- Runs linting, type checking, tests, and build
- Uploads coverage to Codecov (optional)

### Publish Workflow (`.github/workflows/publish.yml`)
- Triggers when a version tag is pushed
- Publishes package to npm
- Requires `NPM_TOKEN` secret

### Documentation Workflow (`.github/workflows/docs.yml`)
- Deploys documentation to GitHub Pages
- Triggers on changes to `docs/` directory

### Release Workflow (`.github/workflows/release.yml`)
- Manual workflow for creating releases
- Can be triggered from GitHub UI
- Creates version bump, tag, and GitHub release

## Project Structure

```
taskmark/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml            # Continuous Integration
│   │   ├── publish.yml       # npm Publishing
│   │   ├── docs.yml          # Documentation Deployment
│   │   └── release.yml       # Release Management
│   └── dependabot.yml        # Dependency Updates
├── docs/                      # Docsify Documentation
│   ├── index.html            # Documentation Entry
│   ├── README.md             # Home Page
│   ├── _sidebar.md           # Navigation Sidebar
│   ├── getting-started.md    # Getting Started Guide
│   ├── api.md                # API Reference
│   └── contributing.md       # Contributing Guide
├── src/
│   ├── index.ts              # Main Entry Point
│   └── index.test.ts         # Tests
├── .editorconfig             # Editor Configuration
├── .gitattributes            # Git Attributes
├── .gitignore                # Git Ignore Rules
├── .npmignore                # npm Ignore Rules
├── .nvmrc                    # Node Version
├── biome.json                # Biome Linting Config
├── CHANGELOG.md              # Change Log
├── CONTRIBUTING.md           # Contributing Guidelines
├── LICENSE                   # MIT License
├── package.json              # Package Configuration
├── README.md                 # Project README
├── tsconfig.json             # TypeScript Configuration
└── vitest.config.ts          # Vitest Configuration
```

## Verification Checklist

Before publishing your first version:

- [ ] Update `package.json` with correct repository URLs
- [ ] Update `docs/index.html` with correct repo name
- [ ] Update `LICENSE` with your name/organization
- [ ] Update `README.md` with project-specific information
- [ ] Run `npm test` - all tests pass
- [ ] Run `npm run lint` - no linting errors
- [ ] Run `npm run build` - builds successfully
- [ ] Configure npm token in GitHub secrets
- [ ] Enable GitHub Pages in repository settings
- [ ] Test documentation locally with `npm run docs:serve`

## Tips

- Use `npm version patch/minor/major` for semantic versioning
- Keep `CHANGELOG.md` updated with each release
- Write tests for all new features
- Document public APIs with JSDoc comments
- Run `npm run prepublishOnly` before manual publishing to ensure everything passes

## Troubleshooting

### Build Fails
```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

### Tests Fail
```bash
# Run tests with verbose output
npm test -- --reporter=verbose
```

### Linting Issues
```bash
# Auto-fix most issues
npm run lint:fix
npm run format
```

## Next Steps

1. Customize the library code in `src/index.ts`
2. Add comprehensive tests
3. Update documentation
4. Create your first release
5. Share with the community!

Happy coding! 🚀

