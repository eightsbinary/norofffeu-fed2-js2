import './css/style.css';

import router from './js/router';
import './js/ui/search/post/search';

import { setLogoutListener } from './js/ui/global/logout';
import { handleSearchInput } from './js/utilities/searchUtils';

await router(window.location.pathname);
setLogoutListener();
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('keypress', handleSearchInput);
}