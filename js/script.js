//Simple router for specific JS on specific pages

//Can use WINDOW.LOCATION.PATHNAME
/* TODO
1) Build a simple page router [X]
2) Get popular movies [X]
3) Display popular movies [X]

*/
/* HTML FOR MOVIE CARDS
<div class="card">
  <a href="movie-details.html?id=1">
    <img
      src="images/no-image.jpg"
      class="card-img-top"
      alt="Movie Title"
    />
  </a>
  <div class="card-body">
    <h5 class="card-title">Movie Title</h5>
    <p class="card-text">
      <small class="text-muted">Release: XX/XX/XXXX</small>
    </p>
  </div>
</div>
*/


//VARS
const API_KEY = '9ed438ce549f6811e4e4e68ba86e510c' //Learning purposes only obviously. You'd have this in VAULT or Env var otherwise while using node.js
const API_URL = 'https://api.themoviedb.org/3'
const IMAGE_URL = 'https://image.tmdb.org/t/p/'
const POSTER_SIZE = 'w500';

const global = {
    currentPage: window.location.pathname
}

//DISPLAY FUNCTIONS
async function displayMovies(){
    const { results } = await fetchAPIData('movie/popular');
    results.forEach(movie => {
        let movieCard = createMovieCard(movie);
        document.querySelector('#popular-movies').appendChild(movieCard); 
    })
}

function createMovieCard(movie) {
        let cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        
        let movieAnchor = document.createElement('a');
        movieAnchor.href = `movie-details.html?id=${movie.id}`;
        
        let movieImage = document.createElement('img');
        movieImage.src = `${IMAGE_URL}${POSTER_SIZE}${movie.poster_path}`;
        movieImage.classList.add('card-img-top');
        movieImage.alt = movie.title;
        
        let cardBodyDiv = document.createElement('div');
        cardBodyDiv.classList.add('card-body');
        
        let cardHeader = document.createElement('h5');
        let cardParagraph = document.createElement('p');
        let cardSmall = document.createElement('small');
        
        cardHeader.classList.add('card-title');
        cardHeader.textContent = movie.title;
        
        cardParagraph.classList.add('card-text');
        cardSmall.classList.add('text-muted');
        cardSmall.textContent = `Release: ${movie.release_date}`;
        
        
        //Assembly
        cardDiv.appendChild(movieAnchor);
        movieAnchor.appendChild(movieImage);
        cardDiv.appendChild(cardBodyDiv);
        cardBodyDiv.appendChild(cardHeader);
        cardBodyDiv.appendChild(cardParagraph);
        cardParagraph.appendChild(cardSmall);

        return cardDiv;
}
//FETCHING FUNCTIONS

async function fetchAPIData(endpoint) {
    try{
        const res = await fetch(`${API_URL}/${endpoint}?api_key=${API_KEY}&language=en-US&page=1`)
        //Remember, catch does not account for 401s. You need to check the response for that
        if (!res.ok) {
            throw new Error(`HTTP Error. Status: ${res.status}`);
        }
        const data = await res.json();
        return data;
    }
    catch (error) {
        throw new Error(`Couldn't fetch data. Error: ${error}`)
    }
}

function highlightActiveLink() {
    //Get the anchor element, with a nav-link class, whose href matches current page
    //The class is necessary to prevent us from highlighting the FLIXX title which also has a href of '/'
    const link = document.querySelector(`a.nav-link[href="${global.currentPage}"]`);
    const href = link.getAttribute('href');
    link.classList.add('active');
}


//Init App
function init () {
    //Check which page we're on
    switch (global.currentPage) {
        //You can use multi conditions by having multiple cases and only 1 block of execution under the last one
        case '/':
        case '/index.html':
            displayMovies();
            break;
        case '/shows.html':
            console.log("TV Shows");
            break;
        case '/movie-details.html':
            break;
        case '/tv-details.html':
            break;
        case '/search.html':
            break;
    }
    highlightActiveLink();
}

//We want to run init each time the DOM content loads
document.addEventListener('DOMContentLoaded', init);