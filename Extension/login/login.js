document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const oauthButton = document.getElementById('oauthButton');
  const errorDiv = document.getElementById('error');

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:5000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.token) {
        chrome.storage.sync.set({ isAuthenticated: true, userInfo: data.userInfo }, () => {
          window.location.href = '../popup/popup.html';
        });
      } else {
        errorDiv.textContent = data.message;
      }
    })
    .catch(error => {
      console.error('Error:', error);
      errorDiv.textContent = 'An error occurred. Please try again.';
    });
  });

  oauthButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'authenticate' }, (response) => {
      if (response && response.success) {
        chrome.storage.sync.set({ isAuthenticated: true }, () => {
          window.location.href = '../popup/popup.html';
        });
      } else {
        console.error('Authentication failed', response.error);
      }
    });
  });

  chrome.storage.sync.get(['isAuthenticated', 'userInfo'], (result) => {
    if (result.isAuthenticated) {
      window.location.href = '../popup/popup.html';
    }
  });
});
