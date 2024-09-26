// ui/auth/login.js
import AuthService from '../../api/services/authService';

export async function onLogin(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const userData = await AuthService.login(data);
    if (userData.success) {
      localStorage.setItem('token', userData.data.accessToken);
      const { name, email, bio, avatar, banner, meta } = userData.data;

      localStorage.setItem(
        'user',
        JSON.stringify({
          name: name,
          email: email,
          bio: bio,
          avatar: avatar,
          banner: banner,
          meta: meta,
        })
      );
      window.location.href = '/';
    } else {
      alert('Login failed: ' + userData.message);
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('An error occurred during login. Please try again.');
  }
}
