import { API_SOCIAL_PROFILES } from '../constants';
import { headers } from '../headers';

class ProfileRepository {
  // Get a single profile by username
  async profile(username) {
    try {
      const response = await fetch(`${API_SOCIAL_PROFILES}/${username}`, {
        method: 'GET',
        headers: headers(),
      });
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('ProfileRepository (profile) error:', error);
      throw error;
    }
  }

  // Get multiple profiles with pagination (limit, page)
  async profileList(limit = 10, page = 1) {
    try {
      const response = await fetch(
        `${API_SOCIAL_PROFILES}?limit=${limit}&page=${page}`,
        {
          method: 'GET',
          headers: headers(),
        }
      );
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('ProfileRepository (profileList) error:', error);
      throw error;
    }
  }

  // Update a profile by username (with avatar and banner)
  async update(username, { avatar, banner }) {
    try {
      const body = JSON.stringify({ avatar, banner });
      const response = await fetch(`${API_SOCIAL_PROFILES}/${username}`, {
        method: 'PUT',
        headers: headers(),
        body,
      });
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('ProfileRepository (update) error:', error);
      throw error;
    }
  }

  async getPostsByProfile(username) {
    try {
      const response = await fetch(`${API_SOCIAL_PROFILES}/${username}/posts?_author=true`, {
        method: 'GET',
        headers: headers(),
      });
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('ProfileRepository (profile) error:', error);
      throw error;
    }
  }
}

export default new ProfileRepository();
