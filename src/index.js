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
    breedSelect.style.display = 'none'; // Ukryj select podczas ładowania
    catInfoContainer.style.display = 'none'; // Ukryj informacje o kocie podczas ładowania
  };

  const hideLoader = () => {
    loader.style.display = 'none';
    breedSelect.style.display = 'block'; // Pokaż select po zakończeniu ładowania
  };

  const showError = errorMessage => {
    error.textContent = errorMessage;
    error.style.display = 'block';
  };

  const hideError = () => {
    error.textContent = '';
    error.style.display = 'none';
  };

  showLoader(); // Wyświetl loader na początku

  fetchBreeds()
    .then(data => {
      breeds = data;
      const options = breeds
        .map(breed => `<option value="${breed.id}">${breed.name}</option>`)
        .join('');
      breedSelect.innerHTML = options;
      new SlimSelect('.breed-select');
      hideLoader(); // Ukryj loader po pomyślnym pobraniu ras
    })
    .catch(error => {
      showError('Failed to fetch breeds');
      hideLoader(); // Ukryj loader po nieudanym pobraniu ras
    });

  breedSelect.addEventListener('change', () => {
    selectedBreed = breedSelect.value;
    showLoader(); // Pokaż loader po wyborze rasy
    catInfoContainer.innerHTML = ''; // Wyczyść poprzednie informacje o kocie
    catInfoContainer.style.display = 'none'; // Ukryj informacje o kocie podczas ładowania

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
        catInfoContainer.style.display = 'block'; // Pokaż informacje o kocie po pomyślnym pobraniu
        hideLoader(); // Ukryj loader po pomyślnym pobraniu informacji o kocie
        hideError(); // Ukryj ewentualny wcześniejszy błąd
      })
      .catch(error => {
        showError('Failed to fetch cat information');
        hideLoader(); // Ukryj loader po nieudanym pobraniu informacji o kocie
      });
  });
});
