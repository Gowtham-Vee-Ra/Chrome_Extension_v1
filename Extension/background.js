chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
  });
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'authenticate') {
      chrome.identity.getAuthToken({ interactive: true }, (token) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          sendResponse({ success: false, error: chrome.runtime.lastError });
          return;
        }
        fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => response.json())
        .then(userInfo => {
          console.log(userInfo);
          chrome.storage.sync.set({ userInfo }, () => {
            console.log('User info saved.');
            sendResponse({ success: true, userInfo });
          });
        })
        .catch(error => {
          console.error(error);
          sendResponse({ success: false, error });
        });
      });
  
      // Return true to indicate that the response will be sent asynchronously
      return true;
    }
  });
  