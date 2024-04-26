import SlimSelect from 'slim-select';
import axios from 'axios';
import { fetchBreeds, fetchCatByBreed } from './cat-api';

axios.defaults.headers.common['x-api-key'] =
  'live_dPOptY8GwsMeRLpX2z1JZrKysWxYIIxk23DIPaFrIVd7ZXB565hROiomCXGM7npb';

document.addEventListener('DOMContentLoaded', () => {
  const breedSelect = document.querySelector('.breed-select');
  const loader = document.querySelector('.loader');
  const error = document.querySelector('.error');
  const catInfoContainer = document.querySelector('.cat-info');

  let breeds = [];
  let selectedBreed = '';

  const showLoader = () => {
    loader.style.display = 'block';
    breedSelect.style.display = 'none';
    catInfoContainer.style.display = 'none';
  };

  const hideLoader = () => {
    loader.style.display = 'none';
    breedSelect.style.display = 'block';
  };

  const showError = errorMessage => {
    error.textContent = errorMessage;
    error.style.display = 'block';
  };

  const hideError = () => {
    error.textContent = '';
    error.style.display = 'none';
  };

  showLoader();

  fetchBreeds()
    .then(data => {
      breeds = data;
      const options = breeds
        .map(breed => `<option value="${breed.id}">${breed.name}</option>`)
        .join('');
      breedSelect.innerHTML = options;
      new SlimSelect('.breed-select');
      hideLoader();
    })
    .catch(error => {
      showError('Failed to fetch breeds');
      hideLoader();
    });

  breedSelect.addEventListener('change', () => {
    selectedBreed = breedSelect.value;
    showLoader();
    catInfoContainer.innerHTML = '';
    catInfoContainer.style.display = 'none';

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
        hideLoader();
        hideError();
      })
      .catch(error => {
        showError('Failed to fetch cat information');
        hideLoader();
      });
  });
});
