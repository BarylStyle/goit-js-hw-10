import SlimSelect from 'slim-select';
import axios from 'axios'; // Importuje Axios

axios.defaults.headers.common['x-api-key'] =
  'live_dPOptY8GwsMeRLpX2z1JZrKysWxYIIxk23DIPaFrIVd7ZXB565hROiomCXGM7npb';

document.addEventListener('DOMContentLoaded', () => {
  const breedSelect = document.querySelector('.breed-select');
  const loader = document.querySelector('.loader');
  const error = document.querySelector('.error');
  const catInfoContainer = document.querySelector('.cat-info');

  let breeds = [];
  let selectedBreed = '';

  loader.style.display = 'block';

  fetchBreeds()
    .then(data => {
      breeds = data;
      const options = breeds
        .map(breed => `<option value="${breed.id}">${breed.name}</option>`)
        .join('');
      breedSelect.innerHTML = options;
      new SlimSelect('.breed-select');
      loader.style.display = 'none';
    })
    .catch(error => {
      error.textContent = 'Failed to fetch breeds';
      loader.style.display = 'none';
    });

  breedSelect.addEventListener('change', () => {
    selectedBreed = breedSelect.value;
    loader.style.display = 'block';
    catInfoContainer.innerHTML = ''; // Clear previous cat info
    catInfoContainer.style.display = 'none';

    if (!selectedBreed) {
      // Dodaj walidację breedId
      error.textContent = 'Please select a breed';
      loader.style.display = 'none';
      return;
    }

    fetchCatByBreed(selectedBreed)
      .then(data => {
        const catInfo = data[0];
        const catInfoHtml = `
          <img src="${catInfo.url}" alt="Cat">
          <div>
            <h2>${catInfo.breeds[0].name}</h2>
            <p><strong>Description: </strong>${catInfo.breeds[0].description}</p>
            <p><strong>Temperament: </strong>${catInfo.breeds[0].temperament}</p>
          </div>
        `;
        catInfoContainer.innerHTML = catInfoHtml;
        catInfoContainer.style.display = 'block';
        loader.style.display = 'none';
      })
      .catch(error => {
        error.textContent = 'Failed to fetch cat information';
        loader.style.display = 'none';
      });
  });
});

export async function fetchBreeds() {
  try {
    const response = await axios.get('https://api.thecatapi.com/v1/breeds');
    if (!response.data) {
      // Sprawdza czy odpowiedź zawiera dane
      throw new Error('Failed to fetch breeds');
    }
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchCatByBreed(breedId) {
  try {
    const response = await axios.get(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`
    );
    if (!response.data) {
      // Sprawdza czy odpowiedź zawiera dane
      throw new Error('Failed to fetch cat information');
    }
    return response.data;
  } catch (error) {
    throw error;
  }
}
