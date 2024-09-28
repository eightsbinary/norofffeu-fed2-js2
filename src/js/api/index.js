// Repositories
import authRepository from './repositories/auth';
import postRepository from './repositories/post';
import profileRepository from './repositories/profile';
import searchRepository from './repositories/searchRepository';

// Services
import authService from './services/auth';
import postService from './services/post';
import profileService from './services/profile';
import searchService from './services/searchService';

// Export all repositories and services
export {
  // Repositories
  authRepository,
  postRepository,
  profileRepository,
  searchRepository,

  // Services
  authService,
  postService,
  profileService,
  searchService
};
