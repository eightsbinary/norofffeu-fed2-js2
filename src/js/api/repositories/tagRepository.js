import { API_SOCIAL_POSTS } from '../constants.js';
import { headers } from '../headers.js';

class TagRepository {
  async tagRelatedPost(tag, page = 1) {
    try {
      const response = await fetch(
        `${API_SOCIAL_POSTS}?_tag=${tag}&_author=true&_comments=true&page=${page}`,
        {
          method: 'GET',
          headers: headers(),
        }
      );
      console.log('API Response:', response);
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Get Tag Error:', error);
      throw error;
    }
  }
}

export default new TagRepository();