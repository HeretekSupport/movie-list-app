// Main Application Entry Point
import { global } from './state.js';
import { displayPopularMedia, displayMediaDetails, search } from './pages.js';
import { highlightActiveLink } from './ui.js';
import { getIdFromUrl } from './utils.js';

function init() {
  //Check which page we're on - use includes() to work with any folder structure
  const page = global.currentPage;
  
  if (page === '/' || page.includes('index.html') || page.endsWith('/')) {
    displayPopularMedia('movie/popular', 'movies');
  } else if (page.includes('shows.html')) {
    displayPopularMedia('tv/popular', 'shows');
  } else if (page.includes('movie-details.html')) {
    displayMediaDetails(`movie/${getIdFromUrl()}`, 'movie');
  } else if (page.includes('tv-details.html')) {
    displayMediaDetails(`tv/${getIdFromUrl()}`, 'tv');
  } else if (page.includes('search.html')) {
    search();
  }
  
  highlightActiveLink();
}

//We want to run init each time the DOM content loads
document.addEventListener('DOMContentLoaded', init);
