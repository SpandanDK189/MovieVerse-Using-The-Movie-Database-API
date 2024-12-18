const API_URL =
  'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=1';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API =
  'https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query=';

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

// Loading spinner element (initialize once)
const loading = document.createElement('div');
loading.classList.add('loading');
loading.innerHTML = "Loading...";
main.appendChild(loading);

// Get initial movies
getMovies(API_URL);

async function getMovies(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error('Failed to fetch movies');
    }
    const data = await res.json();
    showMovies(data.results);
  } catch (error) {
    main.innerHTML = `<p>Error: ${error.message}</p>`;
  } finally {
    loading.style.display = 'none'; // Hide loading indicator
  }
}

function showMovies(movies) {
  main.innerHTML = ''; // Clear loading text
  movies.forEach((movie) => {
    const { title, poster_path, vote_average, overview } = movie;

    const movieEl = document.createElement('div');
    movieEl.classList.add('movie');

    movieEl.innerHTML = `
      <div class="movie-inner">
        <div class="movie-front">
          <img src="${IMG_PATH + poster_path}" alt="${title}">
          <div class="rating">
            <span class="${getClassByRate(vote_average)}">${vote_average}</span>
          </div>
        </div>
        <div class="movie-back">
          <h3>${title}</h3>
          <h4>Overview</h4>
          <p>${overview}</p>
        </div>
      </div>
    `;
    main.appendChild(movieEl);
  });
}

function getClassByRate(vote) {
  if (vote >= 8) {
    return 'green';
  } else if (vote >= 5) {
    return 'orange';
  } else {
    return 'red';
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const searchTerm = search.value;

  if (searchTerm && searchTerm !== '') {
    main.innerHTML = ''; // Clear any previous content before search
    main.appendChild(loading); // Show loading indicator during search
    getMovies(SEARCH_API + searchTerm);

    search.value = '';
  } else {
    window.location.reload();
  }
});

search.addEventListener('focus', () => {
    search.setAttribute('placeholder', ''); // Removes placeholder text when focused
  });
  
  search.addEventListener('blur', () => {
    if (!search.value) {
      search.setAttribute('placeholder', 'Search'); // Resets the placeholder if nothing is typed
    }
  });
  