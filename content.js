// Content script to update the PR title after redirect
(function() {
  'use strict';
  
  // Function to determine expected dest value from source parameter
  function getExpectedDestValue(sourceParam) {
    const lowerSource = sourceParam.toLowerCase();
    
    // Extract the branch part after the last dash
    const parts = lowerSource.split('-');
    if (parts.length < 3) {
      return null; // Need at least TASK-NUMBER-BRANCH format
    }
    
    const branchPart = parts[parts.length - 1]; // Get the last part (branch name)
    
    // Check for UAT branches
    if (branchPart === 'uat' || branchPart.startsWith('uat')) {
      return 'uat';
    }
    
    // Check for production branches
    if (branchPart === 'prod' || branchPart === 'production' || branchPart.startsWith('prod')) {
      return 'production';
    }
    
    // Check for demo branches
    if (branchPart === 'demo' || branchPart.startsWith('demo')) {
      return 'demo';
    }
    
    return null; // No matching pattern found
  }
  
  // Function to check and fix dest parameter if needed
  function checkAndFixDestParameter() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const sourceParam = urlParams.get('source');
      const destParam = urlParams.get('dest');
      
      if (!sourceParam) {
        return;
      }
      
      const expectedDest = getExpectedDestValue(sourceParam);
      
      if (expectedDest && destParam && destParam.toLowerCase() !== expectedDest) {
        // Dest parameter exists but doesn't match expected value, reload with correct dest
        urlParams.set('dest', expectedDest);
        const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
        console.log(`Correcting dest parameter from "${destParam}" to "${expectedDest}"`);
        window.location.href = newUrl;
        return true; // Indicates a reload is happening
      }
      
      return false; // No reload needed
    } catch (error) {
      console.error('Error checking dest parameter:', error);
      return false;
    }
  }

  // Function to update the PR title
  function updatePRTitle() {
    try {
      // First check if we need to fix the dest parameter
      if (checkAndFixDestParameter()) {
        return; // Page is reloading, don't continue
      }
      
      const urlParams = new URLSearchParams(window.location.search);
      const sourceParam = urlParams.get('source');
      const destParam = urlParams.get('dest');
      
      if (!sourceParam || !destParam) {
        return;
      }
      
      // Extract task name (e.g., TASK-1337 or OTHER-23213 from TASK-1337-uat or OTHER-23213-production)
      const taskMatch = sourceParam.match(/^([A-Z]+-\d+)/i);
      if (!taskMatch) {
        return;
      }
      
      const taskName = taskMatch[1].toUpperCase();
      let environment = '';
      
      if (destParam.toLowerCase() === 'uat') {
        environment = 'UAT';
      } else if (destParam.toLowerCase() === 'production') {
        environment = 'PRODUCTION';
      } else if (destParam.toLowerCase() === 'demo') {
        environment = 'DEMO';
      } else {
        return;
      }
      
      const newTitle = `${taskName} CHERRY PICK ${environment}`;
      
      // Continuously monitor and update the title until user focuses on it
      let titleUpdateInterval;
      let userHasFocused = false;
      let descriptionCleared = false; // Track if description has been cleared
      
      const startTitleMonitoring = () => {
        titleUpdateInterval = setInterval(() => {
          const titleInput = document.querySelector('input[data-testid="create-PR-title"]');
          
          if (titleInput && !userHasFocused) {
            // Check if the title is not what we want it to be
            if (titleInput.value !== newTitle) {
              titleInput.value = newTitle;
              
              // Trigger change events to ensure the form recognizes the update
              titleInput.dispatchEvent(new Event('input', { bubbles: true }));
              titleInput.dispatchEvent(new Event('change', { bubbles: true }));
              
              console.log('PR title updated to:', newTitle);
              
              // Clear description field once title is successfully set and not cleared yet
              if (!descriptionCleared) {
                const descriptionEditor = document.querySelector('div.ProseMirror[contenteditable="true"]');
                if (descriptionEditor) {
                  descriptionEditor.innerHTML = '<p data-prosemirror-content-type="node" data-prosemirror-node-name="paragraph" data-prosemirror-node-block="true"><br class="ProseMirror-trailingBreak"></p>';
                  
                  // Trigger events to notify the editor of changes
                  descriptionEditor.dispatchEvent(new Event('input', { bubbles: true }));
                  descriptionEditor.dispatchEvent(new Event('change', { bubbles: true }));
                  descriptionEditor.dispatchEvent(new Event('blur', { bubbles: true }));
                  
                  descriptionCleared = true;
                  console.log('PR description cleared');
                } else {
                  console.log('Description editor not found');
                }
              }
            }
            
            // Add focus listener to stop monitoring when user interacts
            if (!titleInput.hasAttribute('data-title-listener-added')) {
              titleInput.addEventListener('focus', () => {
                userHasFocused = true;
                clearInterval(titleUpdateInterval);
                console.log('User focused on title input, stopping automatic updates');
              });
              titleInput.setAttribute('data-title-listener-added', 'true');
            }
          } else if (!titleInput) {
            // If input disappears, try to find it again
            console.log('Title input not found, retrying...');
          }
        }, 1000); // Check every 1 second
        
        // Stop monitoring after 30 seconds to prevent infinite checking
        setTimeout(() => {
          if (titleUpdateInterval) {
            clearInterval(titleUpdateInterval);
            console.log('Stopped title monitoring after 30 seconds');
          }
        }, 30000);
      };
      
      // Start monitoring after initial delay
      setTimeout(startTitleMonitoring, 0);
      
    } catch (error) {
      console.error('Error updating PR title:', error);
    }
  }
  
  // Run the title update function when the page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(updatePRTitle, 3000); // Wait 3 seconds after DOM is ready
    });
  } else {
    setTimeout(updatePRTitle, 3000); // Wait 3 seconds if already loaded
  }
  
  // Also run when the URL changes (for single-page app navigation)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(updatePRTitle, 3500); // Wait 3.5 seconds for URL changes to allow page to stabilize
    }
  }).observe(document, { subtree: true, childList: true });
  
})();
