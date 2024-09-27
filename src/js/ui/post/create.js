import postService from '../../api/services/postService';

// Main function to handle post creation
export async function onCreatePost(event) {
  event.preventDefault(); // Prevent default form submission

  // Collect form data and convert to an object
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());

  // Convert the tags field from a comma-separated string into an array
  if (data.tags) {
    data.tags = data.tags.split(',').map(tag => tag.trim()); // Ensure tags are split and trimmed
  }

  // Construct the media object
  if (data.media) {
    data.media = {
      url: data.media, // Assuming media is a direct URL input
      alt: data.alt || '' // Assuming there's an alt text input; default to empty string if not provided
    };
  }

  // Ensure the data is valid
  if (!data.title || !data.body || data.tags.length === 0) {
    console.error('Please fill out all fields.');
    return;
  }

  try {
    // Call the postService to create the post
    const result = await postService.create(data);

    if (result.success) {
      console.log('Post created successfully:', result.data);
      // Redirect to the newly created post
      window.location.href = `/post/?id=${result.data.data.id}`; // Redirect to the post page
    } else {
      console.error('Failed to create post:', result.message);
    }
  } catch (error) {
    console.error('Error creating post:', error);
  }
}

// Handle the cancel button click
function handleCancelBtn(event) {
  event.preventDefault(); // Prevent form submission
  window.location.href = '/'; // Redirect to homepage or desired page
}

// Add event listener to the cancel button
document.getElementById('cancelCreate').addEventListener('click', handleCancelBtn);
