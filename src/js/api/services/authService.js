import authRepository from '../repositories/authRepository';

class AuthService {
  async login(data) {
    console.log('loginService', data);
    try {
      const response = await authRepository.login(data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('AuthService (login) error:', error);
      return { success: false, message: error.message };
    }
  }

  async register(data) {
    console.log('registerService', data);
    try {
      const response = await authRepository.register(data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('AuthService (register) error:', error);
      return { success: false, message: error.message };
    }
  }

  // Get API key
  async getKey(name) {
    try {
      const response = await authRepository.getKey(name);
      return { success: true, data: response };
    } catch (error) {
      console.error('AuthService (getKey) error:', error);
      return { success: false, message: error.message };
    }
  }
}

export default new AuthService();
