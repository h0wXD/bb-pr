// Background script to monitor URL changes and redirect if needed

// Shared regex pattern for task name parsing
// Captures: [1] = task name (e.g., "TASK-1337"), [2] = branch part (e.g., "uat")
const TASK_BRANCH_PATTERN = /^([A-Z]+[-_]\d+)[-_](.+)$/i;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only process when the URL has changed and is complete
  if (changeInfo.status === 'complete' && tab.url) {
    processUrl(tabId, tab.url);
  }
});

function processUrl(tabId, url) {
  try {
    const urlObj = new URL(url);
    
    // Check if this is a Bitbucket pull request creation URL
    if (urlObj.hostname === 'bitbucket.org' && 
        urlObj.pathname.includes('/pull-requests/new')) {
      
      const searchParams = new URLSearchParams(urlObj.search);
      const sourceParam = searchParams.get('source');
      const destParam = searchParams.get('dest');
      
      // Only process if source exists and dest doesn't exist
      if (sourceParam && !destParam) {
        const destValue = determineDestValue(sourceParam);
        
        if (destValue) {
          // Add the dest parameter
          searchParams.set('dest', destValue);
          urlObj.search = searchParams.toString();
          
          // Redirect to the new URL
          chrome.tabs.update(tabId, { url: urlObj.toString() });
        }
      }
    }
  } catch (error) {
    console.error('Error processing URL:', error);
  }
}

function determineDestValue(sourceParam) {
  // Extract the target branch from the source parameter
  // Expected format: LETTERS[-_]NUMBERS[-_]BRANCH (e.g., TASK-1337-uat, TASK_1337_uat, OTHER-23213-production, OTHER_23213_production)
  
  // Use regex to match the pattern and extract both task name and branch part
  const match = sourceParam.match(TASK_BRANCH_PATTERN);
  if (!match) {
    return null;
  }
  
  const branchPart = match[2].toLowerCase();
  
  // Check for UAT branches
  if (branchPart === 'uat' || branchPart.endsWith('uat')) {
    return 'uat';
  }
  
  // Check for production branches
  if (branchPart === 'prod' || branchPart.endsWith('production') || branchPart.endsWith('prod')) {
    return 'production';
  }
  
  // Check for demo branches
  if (branchPart === 'demo' || branchPart.endsWith('demo')) {
    return 'demo';
  }
  
  return null;
}
