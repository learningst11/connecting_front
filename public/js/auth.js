// token
window.addEventListener("DOMContentLoaded", async function () {
  let accessToken = sessionStorage.getItem('access_token');
  try {
    if (!accessToken && window.location.pathname !== '/views/home.html') {
      location.href = '/views/home.html';
    }
  } catch (error) {
    console.error(error);
  }
});


async function sendApiRequest(url, options) {
  const accessToken = sessionStorage.getItem("access_token");

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  };

  const response = await fetch(url, {
    ...options,
    headers: headers,
  });

  if (response.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return sendApiRequest(url, options);
    } else {
      throw new Error("Unauthorized");
    }
  }

  return response.json();
}

async function refreshAccessToken() {
  const refreshToken = sessionStorage.getItem("refresh_token");
  try {
    const response = await fetch("http://43.201.79.49/users/authorize/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_token: accessToken,
        refresh_token: refreshToken
      }),
    });

    if (response.ok) {
      const data = await response.json();
      sessionStorage.setItem("access_token", data.access_token);
      sessionStorage.setItem("refresh_token", data.refresh_token);

      console.log("token refreshed.");

      return true;
    } else {
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("refresh_token");
      return false;
    }
  } catch (error) {
    console.error("Refresh token error:", error);
    return false;
  }
}

// require login
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.require-login').forEach(item => {
      item.addEventListener('click', function(event) {
          if (!requireLogin()) {
              event.preventDefault();
          } else {
              window.location.href = item.getAttribute('data-href');
          }
      });
  });
});

function requireLogin() {
  const accessToken = sessionStorage.getItem("access_token");
  if (!accessToken) {
      alert('로그인 후 이용 가능합니다.');
      return false;
  }
  return true;
}