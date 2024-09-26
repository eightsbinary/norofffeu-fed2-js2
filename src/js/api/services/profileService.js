import profileRepository from '../repositories/profileRepository';

class ProfileService {
  // Get a single profile by username
  async profile(username) {
    try {
      const response = await profileRepository.profile(username);
      return { success: true, data: response };
    } catch (error) {
      console.error('ProfileService (profile) error:', error);
      return { success: false, message: error.message };
    }
  }

  // Get multiple profiles with pagination (limit, page)
  async profileList(limit = 10, page = 1) {
    try {
      const response = await profileRepository.profileList(limit, page);
      return { success: true, data: response };
    } catch (error) {
      console.error('ProfileService (profileList) error:', error);
      return { success: false, message: error.message };
    }
  }

  // Update a profile by username (with avatar and banner)
  async update(username, { avatar, banner }) {
    try {
      const response = await profileRepository.update(username, {
        avatar,
        banner,
      });
      return { success: true, data: response };
    } catch (error) {
      console.error('ProfileService (update) error:', error);
      return { success: false, message: error.message };
    }
  }
}

export default new ProfileService();
