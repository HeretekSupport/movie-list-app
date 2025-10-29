//VARS
const API_KEY = '9ed438ce549f6811e4e4e68ba86e510c'; //Learning purposes only obviously. You'd have this in VAULT or Env var otherwise while using node.js //THIS IS NOT A VALID KEY, use your own here
const API_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/';
const POSTER_SIZE = 'w500';

const global = {
  currentPage: window.location.pathname,
  search: {
    term: '',
    type: '',
    page: 1,
    totalPages: 1,
  },
};

//DISPLAY FUNCTIONS
async function displayPopularMedia(endpoint, mediatype) {
  const { results } = await fetchAPIData(endpoint);
  results.forEach((media) => {
    let mediaCard = createMediaCard(media);
    document.querySelector(`#popular-${mediatype}`).appendChild(mediaCard);
  });
}

async function displayMediaDetails(endpoint) {
  const details = await fetchAPIData(endpoint);

  createMovieDetailCard(details);
}

function showSpinner(toggle) {
  if (toggle) {
    document.querySelector('.spinner').classList.add('show');
  } else {
    document.querySelector('.spinner').classList.remove('show');
  }
}

function highlightActiveLink() {
  //Get the anchor element, with a nav-link class, whose href matches current page
  //The class is necessary to prevent us from highlighting the FLIXX title which also has a href of '/'
  const link = document.querySelector(
    `a.nav-link[href="${global.currentPage}"]`
  );
  link ? link.classList.add('active') : null;
}

function showEmptySearchAlert(message, className) {
  const alertElement = document.createElement('div');
  alertElement.classList.add('alert', className);
  alertElement.appendChild(document.createTextNode(message));
  document.querySelector('#alert').appendChild(alertElement);

  setTimeout(() => {
    alertElement.remove();
  }, 3000);
}

/**Creates a picture card with release date and title details to display all the popular media (either movies or tv shows).
 * I create the elements using the DOM creation methods. This would be the safer approach, especially if using forms.
 * This would be my preference usually but it's also extremely laborious when working without a front-end framework.
 */
function createMediaCard(media) {
  let hrefPrefix;
  let releaseOrAirDate;
  //Check if media is TV show or Movie

  if (media.first_air_date) {
    hrefPrefix = 'tv-details.html?id=';
    releaseOrAirDate = `Aired on: ${media.first_air_date}`;
  } else {
    hrefPrefix = 'movie-details.html?id=';
    releaseOrAirDate = `Released: ${media.release_date}`;
  }

  let cardDiv = document.createElement('div');
  cardDiv.classList.add('card');

  let mediaAnchor = document.createElement('a');
  mediaAnchor.href = `${hrefPrefix}${media.id}`;

  let movieImage = document.createElement('img');
  movieImage.src = `${IMAGE_URL}${POSTER_SIZE}${media.poster_path}`;
  movieImage.classList.add('card-img-top');
  movieImage.alt = media.title;

  let cardBodyDiv = document.createElement('div');
  cardBodyDiv.classList.add('card-body');

  let cardHeader = document.createElement('h5');
  let cardParagraph = document.createElement('p');
  let cardSmall = document.createElement('small');

  cardHeader.classList.add('card-title');
  cardHeader.textContent = media.title;

  cardParagraph.classList.add('card-text');
  cardSmall.classList.add('text-muted');
  cardSmall.textContent = releaseOrAirDate;

  //Assembly
  cardDiv.appendChild(mediaAnchor);
  mediaAnchor.appendChild(movieImage);
  cardDiv.appendChild(cardBodyDiv);
  cardBodyDiv.appendChild(cardHeader);
  cardBodyDiv.appendChild(cardParagraph);
  cardParagraph.appendChild(cardSmall);

  return cardDiv;
}

/**This uses InnerHTML for variety. Security risk if used on forms, so I usually avoid using this, but in this case it's fine. */
function createMovieDetailCard(movie) {
  const detailsDiv = document.createElement('div');
  detailsDiv.id = '#movie-details';

  detailsDiv.innerHTML = `
    <div class="details-top">
      <div>
        <img
          src="${
            movie.poster_path
              ? IMAGE_URL + POSTER_SIZE + movie.poster_path
              : 'images/no-image.jpg'
          }"
          class="card-img-top"
          alt="${movie.title || movie.name}"
        />
      </div>
      <div>
        <h2>${movie.title || movie.name}</h2>
        <p>
          <i class="fas fa-star text-primary"></i>
          ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'} / 10
        </p>
        <p class="text-muted">Release Date: ${
          movie.release_date || movie.first_air_date || 'N/A'
        }</p>
        <p>
          ${movie.overview || 'No description available.'}
        </p>
        <h5>Genres</h5>
        <ul class="list-group">
          ${
            movie.genres
              ? movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')
              : '<li>N/A</li>'
          }
        </ul>
        <a href="${
          movie.homepage || '#'
        }" target="_blank" class="btn">Visit Movie Homepage</a>
      </div>
    </div>
    <div class="details-bottom">
      <h2>Movie Info</h2>
      <ul>
        <li><span class="text-secondary">Budget:</span> $${
          movie.budget ? movie.budget : 'N/A'
        }</li>
        <li><span class="text-secondary">Revenue:</span> $${
          movie.revenue ? movie.revenue : 'N/A'
        }</li>
        <li><span class="text-secondary">Runtime:</span> ${
          movie.runtime || 'N/A'
        } minutes</li>
        <li><span class="text-secondary">Status:</span> ${
          movie.status || 'N/A'
        }</li>
      </ul>
      <h4>Production Companies</h4>
      <div class="list-group">${
        movie.production_companies
          ? movie.production_companies.map((company) => company.name).join(', ')
          : 'N/A'
      }</div>
    </div>
  `;

  document.querySelector('section.container').appendChild(detailsDiv);
}

function createShowDetailCard(show) {
  const detailsDiv = document.createElement('div');
  detailsDiv.id = '#show-details';

  detailsDiv.innerHTML = `
    <div class="details-top">
      <div>
        <img
          src="${
            show.poster_path
              ? IMAGE_URL + POSTER_SIZE + show.poster_path
              : 'images/no-image.jpg'
          }"
          class="card-img-top"
          alt="${show.name}"
        />
      </div>
      <div>
        <h2>${show.name}</h2>
        <p>
          <i class="fas fa-star text-primary"></i>
          ${show.vote_average ? show.vote_average.toFixed(1) : 'N/A'} / 10
        </p>
        <p class="text-muted">Release Date: ${show.first_air_date || 'N/A'}</p>
        <p>
          ${show.overview || 'No description available.'}
        </p>
        <h5>Genres</h5>
        <ul class="list-group">
          ${
            show.genres
              ? show.genres.map((genre) => `<li>${genre.name}</li>`).join('')
              : '<li>N/A</li>'
          }
        </ul>
        <a href="${
          show.homepage || '#'
        }" target="_blank" class="btn">Visit Show Homepage</a>
      </div>
    </div>
    <div class="details-bottom">
      <h2>Show Info</h2>
      <ul>
        <li><span class="text-secondary">Number Of Episodes:</span> ${
          show.number_of_episodes || 'N/A'
        }</li>
        <li>
          <span class="text-secondary">Last Episode To Air:</span> ${
            show.last_episode_to_air?.name || 'N/A'
          }
        </li>
        <li><span class="text-secondary">Status:</span> ${
          show.status || 'N/A'
        }</li>
      </ul>
      <h4>Production Companies</h4>
      <div class="list-group">${
        show.production_companies
          ? show.production_companies.map((company) => company.name).join(', ')
          : 'N/A'
      }</div>
    </div>
  `;

  document.querySelector('section.container').appendChild(detailsDiv);
}

//FETCHING FUNCTIONS
async function fetchAPIData(endpoint) {
  showSpinner(true);
  try {
    const res = await fetch(
      `${API_URL}/${endpoint}?api_key=${API_KEY}&language=en-US`
    );
    //Remember, catch does not account for 401s. You need to check the response for that
    if (!res.ok) {
      throw new Error(`HTTP Error. Status: ${res.status}`);
    }
    const data = await res.json();
    showSpinner(false);
    return data;
  } catch (error) {
    throw new Error(`Couldn't fetch data. Error: ${error}`);
  }
}

async function searchAPIData(mediaType, searchTerm) {
  showSpinner(true);
  try {
    const res = await fetch(
      `${API_URL}/search/${mediaType}?api_key=${API_KEY}&language=en-US&query=${searchTerm}`
    );

    if (!res.ok) {
      throw new Error(`HTTP Error. Status: ${res.status}`);
    }
    const data = await res.json();
    showSpinner(false);
    return data;
  } catch (error) {
    throw new Error(`Couldn't fetch data. Error: ${error}`);
  }
}

async function search() {
  const queryString = new URLSearchParams(window.location.search);
  global.search.type = queryString.get('type');
  global.search.term = queryString.get('search-term');

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

// HELPER FUNCTIONS
function getIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

//Init App
function init() {
  //Check which page we're on
  switch (global.currentPage) {
    //You can use multi conditions by having multiple cases and only 1 block of execution under the last one
    case '/':
    case '/index.html':
      displayPopularMedia('movie/popular', 'movies');
      break;
    case '/shows.html':
      displayPopularMedia('tv/popular', 'shows');
      break;
    case '/movie-details.html':
      displayMediaDetails(`movie/${getIdFromUrl()}`, 'movie');
      break;
    case '/tv-details.html':
      displayMediaDetails(`tv/${getIdFromUrl()}`, 'tv');
      break;
    case '/search.html':
      search();
      break;
  }
  highlightActiveLink();
}

//We want to run init each time the DOM content loads
document.addEventListener('DOMContentLoaded', init);
