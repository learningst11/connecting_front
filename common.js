
window.addEventListener('load', function () {

  sessionStorage.setItem('user_id', '658b91c5b493d458e6015fc4');
  sessionStorage.setItem('access_token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0MTIzQHRlc3QxMjMuY29tIiwiaWQiOiI2NThiOTFjNWI0OTNkNDU4ZTYwMTVmYzQiLCJleHAiOjE3MDM2OTUxMzR9.VQqND0sNLvG4MeHDJBoYQIkG9eKArH0rDhUGCG3urJ8-p3TMzraY5t78LQv1XnhAKkUUaZ3TuySFSHXzdMicJw' );
  sessionStorage.setItem('refresh_token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0MTIzQHRlc3QxMjMuY29tIiwiaWQiOiI2NThiOTFjNWI0OTNkNDU4ZTYwMTVmYzQiLCJleHAiOjE3MDQ1OTI3MTJ9.z4YWgDzVcLmMIOz2-Bg2ZZeBuMYziRW0U-wal_cDRu7Eg4A4z4qrppUSFe0WDT0dlZzI4HzhXEma8LPY07Fv3w');

  document.body.classList.add('loaded');

});

let vh = 0;
window.addEventListener("DOMContentLoaded", function (event) {

  vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);

  let page = $('#input_page').val();

  if (document.querySelector('.fnb')) {
    fetch('/public/include/fnb.html')
      .then(response => response.text())
      .then(html => {
        document.querySelector('.fnb').innerHTML = html;
        if (page !== '') {
          const activeElement = document.querySelector(`.fnb a[data-value="${page}"]`);
          if (activeElement) {
            activeElement.classList.add('active');
          }
        }
      })
      .catch(error => console.error('Error loading fnb.html:', error));
  }

});

// token
async function sendApiRequest(url, options) {
  const accessToken = sessionStorage.getItem('access_token');

  const response = await fetch(url, {
      ...options,
      headers: {
          ...options.headers,
          'Authorization': `Bearer ${accessToken}`
      }
  });


  if (response.status === 401) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
          return sendApiRequest(url, options); 
      } else {
          throw new Error('Unauthorized');
      }
  }

  return response.json();
}

async function refreshAccessToken() {
  const refreshToken = sessionStorage.getItem('refresh_token');
  try {
      const response = await fetch('/api/token/refresh', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ refresh_token: refreshToken })
      });
      
      if (response.ok) {
          const data = await response.json();
          sessionStorage.setItem('access_token', data.access_token); 저장
          return true;
      } else {
          sessionStorage.removeItem('access_token');
          sessionStorage.removeItem('refresh_token');
          return false;
      }
  } catch (error) {
      console.error('Refresh token error:', error);
      return false;
  }
}

// // example
// sendApiRequest('/api/some-endpoint', { method: 'GET' })
//   .then(data => {

//   })
//   .catch(error => {

//   });
