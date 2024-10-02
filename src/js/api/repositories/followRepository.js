import { API_SOCIAL_PROFILES } from '../constants';
import { headers } from '../headers';

class FollowRepository {
  // Follow a user by username
  async follow(username) {
    try {
      const response = await fetch(`${API_SOCIAL_PROFILES}/${username}/follow`, {
        method: 'PUT',
        headers: headers(),
      });
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Follow User Error:', error);
      throw error;
    }
  }

  // Unfollow a user by username
  async unfollow(username) {
    try {
      const response = await fetch(`${API_SOCIAL_PROFILES}/${username}/unfollow`, {
        method: 'PUT',
        headers: headers(),
      });
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Unfollow User Error:', error);
      throw error;
    }
  }

  // Check if the current user follows a specific profile
  async checkFollowing(username) {
    try {
      const response = await fetch(`${API_SOCIAL_PROFILES}/${username}?_following=true&_follower=true&_posts=true`, {
        method: 'GET',
        headers: headers(),
      });
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Check Following Error:', error);
      throw error;
    }
  }
}

export default new FollowRepository();
