// UI Utility Functions
import { global } from './state.js';

export function showSpinner(toggle) {
  if (toggle) {
    document.querySelector('.spinner').classList.add('show');
  } else {
    document.querySelector('.spinner').classList.remove('show');
  }
}

export function highlightActiveLink() {
  const links = document.querySelectorAll('.nav-link');
  const page = global.currentPage;
  
  links.forEach(link => {
    const href = link.getAttribute('href');
    // Check if current page matches the link
    if ((page === '/' || page.includes('index.html') || page.endsWith('/')) && href === 'index.html') {
      link.classList.add('active');
    } else if (page.includes('shows.html') && href === 'shows.html') {
      link.classList.add('active');
    }
  });
}

export function showEmptySearchAlert(message, className) {
  const alertElement = document.createElement('div');
  alertElement.classList.add('alert', className);
  alertElement.appendChild(document.createTextNode(message));
  document.querySelector('#alert').appendChild(alertElement);

  setTimeout(() => {
    alertElement.remove();
  }, 3000);
}
