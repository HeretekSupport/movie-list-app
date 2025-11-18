// Page Display Logic
import { fetchAPIData, searchAPIData } from './api.js';
import {
  createMediaCard,
  createMovieDetailCard,
  createShowDetailCard,
} from './card-builder.js';
import { showEmptySearchAlert } from './ui.js';
import { global } from './state.js';

export async function displayPopularMedia(endpoint, mediatype) {
  const { results } = await fetchAPIData(endpoint);
  results.forEach((media) => {
    let mediaCard = createMediaCard(media);
    document.querySelector(`#popular-${mediatype}`).appendChild(mediaCard);
  });
}

export async function displayMediaDetails(endpoint, mediaType) {
  const details = await fetchAPIData(endpoint);
  mediaType === 'tv'
    ? createShowDetailCard(details)
    : createMovieDetailCard(details);
}

export async function search() {
  const queryString = new URLSearchParams(window.location.search);
  global.search.type = queryString.get('type');
  global.search.term = queryString.get('search-term');

  // Set the correct radio button based on search type
  global.search.type === 'tv'
    ? (document.querySelector('#tv').checked = true)
    : (document.querySelector('#movie').checked = true);

  // Keep the search term in the input field
  if (global.search.term) {
    document.querySelector('#search-term').value = global.search.term;
  }

  if (global.search.term !== '' && global.search.term !== null) {
    const { results } = await searchAPIData(
      global.search.type,
      global.search.term
    );

    results.forEach((result) => {
      let mediaCard = createMediaCard(result);
      document.querySelector('#search-results').appendChild(mediaCard);
    });
  } else {
    showEmptySearchAlert('Nothing to search for', 'error');
  }
}
