# Bitbucket PR Redirector Chrome Extension

This Chrome extension automatically handles Bitbucket pull request URLs by:

1. **URL Monitoring**: Monitors the address bar for Bitbucket pull request creation URLs
2. **Automatic Redirection**: Adds the appropriate `dest` parameter based on the source branch
3. **Title Update**: Automatically updates the PR title to follow the naming convention

## Features

### URL Processing
- Detects URLs like: `https://bitbucket.org/company/*/pull-requests/new?source=TASK-1337-uat` or `https://bitbucket.org/company/*/pull-requests/new?source=OTHER-23213-production`
- Automatically adds `dest=uat` or `dest=production` based on the source branch suffix
- Supports any task naming pattern with letters followed by dash and numbers (e.g., TASK-1337, OTHER-23213, ABC-999)
- Only processes URLs that don't already have a `dest` parameter

### Title Generation
- Extracts task name from source parameter (e.g., `TASK-1337` from `TASK-1337-uat` or `OTHER-23213` from `OTHER-23213-production`)
- Updates the PR title input to format: `TASK-NAME CHERRY PICK UAT` or `TASK-NAME CHERRY PICK PRODUCTION`

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select this extension folder
4. The extension will be active for all Bitbucket domains

## Usage

1. Navigate to a Bitbucket pull request creation URL with a `source` parameter
2. The extension will automatically redirect with the appropriate `dest` parameter
3. The PR title will be automatically populated with the correct format

## Example

**Before**: `https://bitbucket.org/company/repository/pull-requests/new?source=TASK-1337-uat`
**Before**: `https://bitbucket.org/company/repository/pull-requests/new?source=OTHER-23213-production`

**After**: `https://bitbucket.org/company/repository/pull-requests/new?source=TASK-1337-uat&dest=uat`
**After**: `https://bitbucket.org/company/repository/pull-requests/new?source=OTHER-23213-production&dest=production`

**PR Title**: `TASK-1337 CHERRY PICK UAT` or `OTHER-23213 CHERRY PICK PRODUCTION`

## Files

- `manifest.json`: Extension configuration and permissions
- `background.js`: Service worker that monitors URL changes and handles redirects
- `content.js`: Content script that updates the PR title on the page
