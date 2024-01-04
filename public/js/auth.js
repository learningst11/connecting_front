window.addEventListener("DOMContentLoaded", async function () {

  let accessToken = sessionStorage.getItem('access_token');
  try {

    if (accessToken) {

    }

  } catch (error) {
    console.error("Error loading Kakao, Google:", error);
  }

});



// token
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
