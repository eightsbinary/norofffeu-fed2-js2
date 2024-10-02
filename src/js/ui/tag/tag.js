import { formatDate } from "../../utilities/dateUtils";
import { formatTags } from "../../utilities/tagUtils";

export function renderTagResults(results, append = false) {
  const resultContainer = document.querySelector('.tag-container');

  if (!append) {
    resultContainer.innerHTML = ''; // Clear previous results if not appending
  }

  if (!results || results.length === 0) {
    if (!append) {
      resultContainer.innerHTML = '<p>No results found for this tag.</p>';
    }
    return;
  }


  const postElements = results.map(post => {
    const formattedDate = formatDate(post.created);
    const formattedTags = formatTags(post.tags);

    return `
      <div class="post-item">
        <div class="post-meta">
          <a class="profile-link" href="/profile/?username=${post.author.name}">
            <img class="author-avatar" src="${post.author.avatar.url}" alt="${post.author.avatar.alt}" />
          </a>
          <div class="post-info">
            <a class="profile-link" href="/profile/?username=${post.author.name}">
              <span class="mb--1"><small>${post.author.name}</small></span>
            </a>
            <span><small>${formattedDate}</small></span>
          </div>
        </div>
        <a class="post-details-link" href="/post/?id=${post.id}">
          <h2>${post.title}</h2>
        </a>
        <p class="tags-container">${formattedTags}</p>
      </div>
    `;
  }).join('');

  resultContainer.innerHTML += postElements; // Append new post elements to the container
}

export function displayTagQuery(tag) {
  const resultContainer = document.querySelector('.tag-container');

  // Remove any previous tag header to avoid duplicates
  const existingHeader = document.querySelector('.tag-header');
  if (existingHeader) {
    existingHeader.remove();
  }

  // Create a new header for the tag
  const tagHeader = document.createElement('h2');
  tagHeader.className = 'tag-header'; // Optional: Add a class for styling or identification
  tagHeader.textContent = `Posts tagged with: ${tag}`;

  // Insert the header before the result container
  resultContainer.parentNode.insertBefore(tagHeader, resultContainer);
}
