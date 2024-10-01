import postService from '../../api/services/postService';
import { authGuard } from '../../utilities/authGuard';
import { formatDate } from '../../utilities/dateUtils';
import { formatTags } from '../../utilities/tagUtils';
import { loadMoreContent, setupInfiniteScroll } from '../../utilities/scrollUtils';

authGuard();

let currentPage = 1;
let totalPages = 1;
let isLoading = false;

const postGrid = document.querySelector('.post-grid');

async function fetchPosts(page = currentPage) {
  if (isLoading) return;
  isLoading = true;

  try {
    const result = await postService.getAll(page);

    if (result.success) {
      const posts = result.data.data;
      const { currentPage: newCurrentPage, pageCount } = result.data.meta;
      
      currentPage = newCurrentPage;
      totalPages = pageCount;

      renderPosts(posts);
    } else {
      console.error('Failed to fetch posts:', result.message);
    }
  } catch (error) {
    console.error('Error loading posts:', error);
  } finally {
    isLoading = false;
  }
}

function renderPosts(posts) {
  if (!Array.isArray(posts)) {
    console.error('Expected an array of posts');
    return;
  }

  const postElements = posts.map((post) => {
    const postElement = document.createElement('div');
    postElement.classList.add('post');
    
    const formattedDate = formatDate(post.created);
    const formattedTags = formatTags(post.tags);
    
    postElement.innerHTML = `
    <div class="post-meta">
      <a class="profile-link" href="/profile/?username=${post.author.name}">
        <img class="author-avatar" src="${post.author.avatar.url}" alt="${post.author.avatar.alt}" />
      </a>
      <div class="post-info">
        <a class="profile-link" href="/profile/?username=${post.author.name}"><span class="mb--1"><small>${post.author.name}</small></span></a>
        <span><small>${formattedDate}</small></span>
      </div>
    </div>
    <a class="post-details-link" href="/post/?id=${post.id}">
      <h2>${post.title}</h2>
    </a>
    <p class="tags-container">${formattedTags}</p>
    `;

    return postElement;
  });

  postGrid.append(...postElements);
}

async function loadMorePosts() {
  if (!isLoading) {
    const newPage = await loadMoreContent(fetchPosts, currentPage, totalPages);
    currentPage = newPage;
  }
}

// Initial fetch
fetchPosts();

// Setup infinite scroll
setupInfiniteScroll(loadMorePosts);