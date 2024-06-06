document.addEventListener('DOMContentLoaded', () => {
    const toggleButtons = document.querySelectorAll('.toggleButton');
    const toggleAllButton = document.getElementById('toggleAll');
  
    toggleButtons.forEach(button => {
      button.addEventListener('click', () => {
        button.classList.toggle('active');
      });
    });
  
    toggleAllButton.addEventListener('click', () => {
      const allActive = Array.from(toggleButtons).every(button => button.classList.contains('active'));
      toggleButtons.forEach(button => {
        if (allActive) {
          button.classList.remove('active');
        } else {
          button.classList.add('active');
        }
      });
    });
  });
  