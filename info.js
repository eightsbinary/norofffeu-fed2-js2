/**
 * ### API Key account ###
 * name: sa_me_des
 * email: eightsbinary@stud.noroff.no
 * password: e1ghtsb1nary
 * johnw
 * email: johnw@stud.noroff.no
 * password: 123456789
 * test
 * test123@test.com
 * 123456789
 */

/**
 * API key: daf62b52-c838-4e51-ba97-ba5497ecf30f
 * API key: daf62b52-c838-4e51-ba97-ba5497ecf30f
 * API key: 144e5087-b424-4c7c-a405-000026305e61
 */

/**
 * #### headers ####
 */
const options = {
  headers: {
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoic2FfbWVfZGVzIiwiZW1haWwiOiJlaWdodHNiaW5hcnlAc3R1ZC5ub3JvZmYubm8iLCJpYXQiOjE3MjcwMjIyNzN9.NJslQjhWwGy0egq5EczowmyQIF0oWH5tf1szP2gtsrA',
    'X-Noroff-API-Key': 'daf62b52-c838-4e51-ba97-ba5497ecf30f',
  },
};

// const options = {
//   headers: {
//     Authorization: `Bearer ${accessToken}`,
//     "X-Noroff-API-Key": apiKey.data.key
//   }
// }

const response = await fetch(`${NOROFF_API_URL}/social/posts`, options);
const data = await response.json();

/**
 * #####
 * remaining feature
 * #####
 * - follow/unfollow user
 * 
 * #####
 * get post of a user 
 * #####
 * - click on user avatar and display user profile
 * - has a follow button for author 
 * - list all the post that user has post
 * 
 * #####
 * same with the get post of a user 
 * #####
 * - get post from followed user
 * 
 * //#####
 * //search post
 * //#####
 * //- list all the post that related to search terms
 * 
 * #####
 * additional post function
 * #####
 * - react to a post
 * //- comment on a post
 * // -delete comment on a post
 * - reply to a comment
 * 
 * #####
 * other feature
 * #####
 * - tags link
 * - list all post with tags related witht
 * 
 * / 

/**
 * dev.to account
 * usr: sa_me_desu
 * pwd: lastpass or google authen
*/
