# Privacy Policy for Bitbucket PR Redirector

**Effective Date: July 23, 2025**

## Overview

Bitbucket PR Redirector ("the Extension") is committed to protecting your privacy. This privacy policy explains our data practices for the Chrome extension that automates Bitbucket pull request workflows.

## Information We Collect

**We collect NO personal information.**

The Extension:
- ❌ Does NOT collect personal data
- ❌ Does NOT store user information
- ❌ Does NOT track browsing behavior
- ❌ Does NOT use cookies or analytics
- ❌ Does NOT transmit data to external servers

## What the Extension Accesses

The Extension only accesses:

### URL Information
- Reads URL parameters on Bitbucket pull request pages
- Detects `source` and `dest` parameters for workflow automation
- **Purpose**: Determine if URL redirect is needed

### Page Elements
- Accesses PR title input field to update formatting
- Accesses description editor to clear content for cherry-picks
- **Purpose**: Automate standardized PR creation process

## How We Use Information

All processing happens **locally in your browser**:

1. **URL Analysis**: Parses Bitbucket URLs to identify missing `dest` parameters
2. **Automatic Redirects**: Adds correct destination branch parameters
3. **Form Updates**: Sets standardized titles (e.g., "TASK-123 CHERRY PICK UAT")
4. **Content Clearing**: Removes template content for cherry-pick PRs

**No data leaves your browser.**

## Data Storage

- ✅ **Zero data storage** - Extension operates without saving any information
- ✅ **No local storage** used
- ✅ **No databases** created
- ✅ **Stateless operation** - each page load is independent

## Permissions Explanation

### Required Permissions:

**`activeTab`**
- **Why needed**: Read current tab's URL parameters
- **What it accesses**: Only the active Bitbucket tab
- **Data retention**: None

**`tabs`**
- **Why needed**: Monitor URL changes and perform redirects
- **What it accesses**: Tab URLs for redirect functionality
- **Data retention**: None

**`scripting`**
- **Why needed**: Modify PR title and description fields
- **What it accesses**: Form elements on Bitbucket pages only
- **Data retention**: None

**`https://bitbucket.org/*`**
- **Why needed**: Extension only works on Bitbucket domain
- **What it accesses**: Bitbucket pull request creation pages
- **Data retention**: None

## Third-Party Services

The Extension:
- Does NOT use third-party services
- Does NOT make external API calls
- Does NOT load remote scripts
- Does NOT share data with any external parties

## Security

Your data is protected because:
- All processing occurs within Chrome's secure sandbox
- No network communication eliminates data breach risks
- Minimal permissions reduce security exposure
- Open source code allows security review

## Your Choices

You have complete control:
- **Disable**: Turn off the extension anytime in Chrome settings
- **Uninstall**: Remove the extension completely
- **No cleanup needed**: No stored data to remove

## Children's Privacy

The Extension does not knowingly collect information from children under 13. Since no personal information is collected from any users, this policy applies to all users regardless of age.

## International Users

Since no personal data is collected or transmitted, international data transfer regulations do not apply to this Extension.

## Changes to This Policy

- Policy updates will be included in extension updates
- Material changes will be communicated in update notes
- Continued use constitutes acceptance of policy changes

## Contact Us

For privacy questions or concerns:
- Create an issue on our GitHub repository
- Email: [Your contact email if applicable]

## Compliance

This Extension complies with:
- Chrome Web Store Developer Program Policies
- Privacy best practices for browser extensions
- Data minimization principles

---

**Summary**: This Extension protects your privacy by design - it processes everything locally, stores nothing, and transmits no data. Your Bitbucket workflow is automated without any privacy compromise.
