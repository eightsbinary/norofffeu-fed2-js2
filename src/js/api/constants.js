// Use Postman, or JavaScript to get your API key
// In Workflow we will learn how to secure this information
export const API_KEY = '66290fb6-88db-45ae-bd52-25ce14294b88';

export const API_BASE = 'https://v2.api.noroff.dev';

export const API_AUTH = `${API_BASE}/auth`;

export const API_AUTH_LOGIN = `${API_AUTH}/login`;

export const API_AUTH_REGISTER = `${API_AUTH}/register`;

export const API_AUTH_KEY = `${API_AUTH}/create-api-key`;

export const API_SOCIAL = `${API_BASE}/social`;

export const API_SOCIAL_POSTS = `${API_SOCIAL}/posts`;

export const API_SOCIAL_PROFILES = `${API_SOCIAL}/profiles`;

export function getAuthToken() {
  return localStorage.getItem('token');
}

export function getAuthUser() {
  return JSON.parse(localStorage.getItem('user'));
}
