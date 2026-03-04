# 🚀 First-Time GitHub Contribution Guide

## Overview: How Open Source Contributions Work

```
1. FORK: Create your copy of OpenClaw repo
   OpenClaw/openclaw → guiguicodes/openclaw

2. CLONE: Download your fork to work on it  
   git clone https://github.com/guiguicodes/openclaw.git

3. BRANCH: Create feature branch for your changes
   git checkout -b feature/imessage-reply-context

4. DEVELOP: Make your changes in the branch
   (Add our iMessage reply context fix)

5. COMMIT: Save your changes with good messages
   git commit -m "feat: add reply context to iMessage"

6. PUSH: Upload your branch to your fork
   git push origin feature/imessage-reply-context

7. PULL REQUEST: Ask OpenClaw to merge your changes
   GitHub UI: Compare & Pull Request button

8. REVIEW: OpenClaw maintainers review your code
   (They might ask for changes)

9. MERGE: If approved, your code becomes part of OpenClaw!
   🎉 Your contribution is now in the main project
```

## Step-by-Step Process

### 1. Fork OpenClaw Repository

**Option A: Using GitHub CLI (Recommended)**
```bash
# Fork the repo to your account
gh repo fork openclaw/openclaw --clone=false

# Or fork and clone in one step  
gh repo fork openclaw/openclaw --clone=true
```

**Option B: Using GitHub Web Interface**
1. Go to https://github.com/openclaw/openclaw
2. Click "Fork" button (top right)
3. Choose your account as destination
4. Wait for fork to complete

### 2. Clone Your Fork

```bash
# Clone your fork (not the original)
git clone https://github.com/guiguicodes/openclaw.git
cd openclaw

# Add the original as "upstream" (for syncing later)
git remote add upstream https://github.com/openclaw/openclaw.git
```

### 3. Create Feature Branch

```bash
# Create and switch to feature branch
git checkout -b feature/imessage-reply-context

# Verify you're on the right branch
git branch
```

### 4. Make Your Changes

This is where you'd integrate our iMessage reply fix:

```bash
# Copy our solution files to the appropriate locations:
# src/message-processor.ts → extensions/imessage/src/message-processor.ts
# src/channel-integration.ts → extensions/imessage/src/channel-integration.ts
# tests/ → extensions/imessage/tests/
# Update extensions/imessage/src/channel.ts to use our enhancer
```

### 5. Test Your Changes

```bash
# Run OpenClaw tests
npm test

# Run our specific tests  
npm run test:imessage

# Test with real iMessage setup
# (This would require actual OpenClaw installation)
```

### 6. Commit Your Changes

```bash
# Stage all changes
git add .

# Commit with conventional commit message
git commit -m "feat(imessage): add reply context support

- Detect thread_originator_guid in incoming messages
- Fetch original message content via imsg CLI
- Enhance inbound context with reply information
- Add comprehensive test suite
- Maintain backward compatibility

Fixes #XXXX - iMessage replies lack conversation context"
```

### 7. Push to Your Fork

```bash
# Push your feature branch to your fork
git push origin feature/imessage-reply-context
```

### 8. Create Pull Request

**GitHub will show a banner with "Compare & Pull Request" button, or:**

```bash
# Using GitHub CLI
gh pr create --title "feat(imessage): add reply context support" \
             --body-file GITHUB_SUBMISSION.md \
             --base main \
             --head feature/imessage-reply-context
```

**Or via GitHub Web Interface:**
1. Go to https://github.com/guiguicodes/openclaw
2. Click "Compare & Pull Request" 
3. Fill out the PR template:
   - **Title**: feat(imessage): add reply context support
   - **Description**: Copy from GITHUB_SUBMISSION.md
   - **Base**: openclaw/openclaw main
   - **Head**: guiguicodes/openclaw feature/imessage-reply-context

### 9. Address Review Feedback

OpenClaw maintainers might:
- ✅ **Approve immediately** (rare for large changes)
- 💬 **Request changes** (common - they'll suggest improvements)
- ❌ **Reject** (rare if well-prepared)

**When they request changes:**
```bash
# Make the requested changes
# Commit them
git add .
git commit -m "fix: address code review feedback"

# Push updates (automatically updates the PR)
git push origin feature/imessage-reply-context
```

### 10. Celebrate! 🎉

When merged, your code becomes part of OpenClaw and helps every user!

## Best Practices

### Before Starting
- ✅ Check existing issues/PRs for similar work
- ✅ Read contribution guidelines (CONTRIBUTING.md)
- ✅ Understand the codebase structure
- ✅ Test your changes thoroughly

### Writing Good PRs
- ✅ Clear, descriptive title
- ✅ Detailed description explaining WHY
- ✅ Include tests for new functionality
- ✅ Update documentation if needed
- ✅ Keep changes focused (one feature per PR)

### During Review
- ✅ Be responsive to feedback
- ✅ Ask questions if unclear
- ✅ Be patient - reviews take time
- ✅ Learn from suggestions

## Common Gotchas

### Sync Issues
```bash
# Before working, sync with upstream
git checkout main
git pull upstream main
git push origin main
```

### Merge Conflicts
```bash
# If main branch updated while you worked
git checkout feature/imessage-reply-context
git rebase main
# Fix any conflicts, then
git push --force-with-lease origin feature/imessage-reply-context
```

### Large Changes
- Break into smaller PRs when possible
- Discuss approach in an issue first
- Consider creating a draft PR early for feedback

---

**This is your roadmap for contributing to OpenClaw! 🚀**