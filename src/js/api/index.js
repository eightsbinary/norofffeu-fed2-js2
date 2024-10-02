// Repositories
import authRepository from './repositories/auth';
import commentRepository from './repositories/commentRepository';
import followRepository from './repositories/followRepository';
import postRepository from './repositories/postRepository';
import profileRepository from './repositories/profileRepository';
import replyRepository from './repositories/replyRepository';
import searchRepository from './repositories/searchRepository';
import tagRepository from './repositories/tagRepository';

// Services
import authService from './services/auth';
import commentService from './services/commentService';
import followService from './services/followService';
import logoutService from './services/logoutService'
import postService from './services/postService';
import profileService from './services/profileService';
import replyService from './services/replyService'
import searchService from './services/searchService';
import tagService from './services/tagService';

// Export all repositories and services
export {
  // Repositories
  authRepository,
  commentRepository,
  followRepository,
  postRepository,
  profileRepository,
  replyRepository,
  searchRepository,
  tagRepository,

  // Services
  authService,
  commentService,
  followService,
  postService,
  logoutService,
  profileService,
  replyService,
  searchService,
  tagService,
};
