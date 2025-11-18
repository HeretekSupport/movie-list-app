// API Communication Functions
import { API_URL, API_KEY } from './config.js';
import { showSpinner } from './ui.js';

export async function fetchAPIData(endpoint) {
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

export async function searchAPIData(mediaType, searchTerm) {
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
