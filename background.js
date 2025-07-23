// Background script to monitor URL changes and redirect if needed
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
  // Expected format: LETTERS-NUMBERS-uat or LETTERS-NUMBERS-production (e.g., TASK-1337-uat, OTHER-23213-production)
  const lowerSource = sourceParam.toLowerCase();
  
  if (lowerSource.endsWith('-uat')) {
    return 'uat';
  } else if (lowerSource.endsWith('-production') || lowerSource.endsWith('-prod')) {
    return 'production';
  }
  
  return null;
}
