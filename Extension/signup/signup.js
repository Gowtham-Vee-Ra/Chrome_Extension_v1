document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  const oauthButton = document.getElementById('oauthButton');
  const errorDiv = document.getElementById('error');

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:5000/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'User created successfully') {
        chrome.storage.sync.set({ isAuthenticated: true }, () => {
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
