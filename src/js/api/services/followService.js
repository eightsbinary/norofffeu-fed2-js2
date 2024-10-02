import followRepository from "../repositories/followRepository";

class FollowService {
  async follow(username) {
    try {
      const data = await followRepository.follow(username);
      return { success: true, message: 'Followed successfully', data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async unfollow(username) {
    try {
      const data = await followRepository.unfollow(username);
      return { success: true, message: 'Unfollowed successfully', data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async checkFollowing(username) {
    try {
      const data = await followRepository.checkFollowing(username);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

export default new FollowService();
