import { API_SOCIAL_POSTS } from '../constants';
import { headers } from '../headers';

class SearchRepository {
  async post(query, limit = 12, page = 1) { // Added page parameter
    const url = `${API_SOCIAL_POSTS}/search?q=${query}&limit=${limit}&page=${page}&_author=true`; // Include page in the URL

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: headers()
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API error: ${response.status} ${response.statusText}. Details: ${errorBody}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Search Error:', error);
      throw error;
    }
  }
}

export default new SearchRepository();