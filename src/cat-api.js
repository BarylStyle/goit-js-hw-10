import axios from 'axios';

const apiKey =
  'live_dPOptY8GwsMeRLpX2z1JZrKysWxYIIxk23DIPaFrIVd7ZXB565hROiomCXGM7npb';

export async function fetchBreeds() {
  try {
    const response = await axios.get('https://api.thecatapi.com/v1/breeds', {
      headers: {
        'x-api-key': apiKey,
      },
    });
    if (!response.data) {
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
      `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`,
      {
        headers: {
          'x-api-key': apiKey,
        },
      }
    );
    if (!response.data) {
      throw new Error('Failed to fetch cat information');
    }
    return response.data;
  } catch (error) {
    throw error;
  }
}
