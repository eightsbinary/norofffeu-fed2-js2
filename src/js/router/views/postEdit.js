import { authGuard } from "../../utilities/authGuard";
import postService from "../../api/services/postService";
import { onUpdatePost } from "../../ui/post/update";

authGuard();

// Fetch and populate the post data into the form
async function fetchAndUpdatePost() {
  const postId = new URLSearchParams(window.location.search).get('id');
  
  if (!postId) {
    console.error('No post ID provided in the URL');
    return;
  }

  try {
    const result = await postService.post(postId); // Fetch the post
    if (result.success) {
      populateForm(result.data.data); // Populate form with fetched data
    } else {
      console.error('Failed to fetch post:', result.message);
    }
  } catch (error) {
    console.error('Error fetching post:', error);
  }
}

// Populate form fields with the fetched post data
function populateForm(post) {
  const form = document.forms['editPost'];
  form.title.value = post.title;
  form.body.value = post.body || '';
  form.tags.value = post.tags ? post.tags.join(', ') : ''; // Convert array to comma-separated string
  form.media.value = post.media?.url || ''; // Handle media URL
}

// Initialize fetch on page load
fetchAndUpdatePost();

// Attach the event listener for form submission
document.getElementById('updatePost').addEventListener('click', async (event) => {
  const postId = new URLSearchParams(window.location.search).get('id');
  await onUpdatePost(postId, event); // Handle the update on click
});
