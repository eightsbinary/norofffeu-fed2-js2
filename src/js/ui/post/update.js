import postService from '../../api/services/postService';

// Function to handle updating the post
export async function onUpdatePost(postId, event) {
  event.preventDefault(); // Prevent default form submission behavior

  // Target the correct form
  const form = document.forms['editPost'];

  if (!form) {
    console.error("Form element not found");
    return;
  }

  // Collect form data and convert it to an object
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  // Convert the tags string into an array
  data.tags = data.tags.split(',').map(tag => tag.trim());

  // Prepare the payload for the API
  const payload = {
    title: data.title,
    body: data.body,
    tags: data.tags,
    media: {
      url: data.media,
      alt: '' // Optional: Add alt if required
    }
  };

  try {
    // Send the update request to the API
    const result = await postService.update(postId, payload);
    
    if (result.success) {
      console.log('Post updated successfully:', result);
      alert('Post updated successfully!'); // Notify the user
      window.location.href = '/'; // Redirect to another page if needed
    } else {
      console.error('Failed to update post:', result.message);
      alert('Failed to update post. Please try again.');
    }
  } catch (error) {
    console.error('Error updating post:', error);
    alert('An error occurred while updating the post.');
  }
}
