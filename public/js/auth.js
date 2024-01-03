window.addEventListener("DOMContentLoaded", async function () {

  try {

    let loginPlatform = sessionStorage.getItem('login_platform');

    if (loginPlatform === 'kakao') {

      let accessToken = sessionStorage.getItem('access_token');

      if (accessToken) {
        try {
          const response = await fetch("http://43.201.79.49/users/social/verify?platform=kakao", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ token: accessToken })
          });

          const data = await response.json();

          if (data.code === 200) {
            if (data.data.result === 'VERIFIED') {
              console.log('토큰 검증 성공')
            } else {
              location.href = '/views/sign_in.html'
            }
          } else {
            throw new Error("API 응답 오류");
          }
        } catch (error) {
          console.error("API 요청 실패 또는 처리 중 오류 발생:", error);
          sessionStorage.removeItem('access_token');
        }
      } else {
        console.log("세션 스토리지에 토큰이 없음");
        location.href = '/views/sign_in.html'
      }


    } else if (loginPlatform === 'google') {

      let accessToken = sessionStorage.getItem('access_token');

      if (accessToken) {
        try {
          const response = await fetch("http://43.201.79.49/users/social/verify?platform=google", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ token: accessToken })
          });

          const data = await response.json();

          if (data.code === 200) {
            if (data.data.result === 'VERIFIED') {
              console.log('토큰 검증 성공')
            } else {
              location.href = '/views/sign_in.html'
            }
          } else {
            throw new Error("API 응답 오류");
          }
        } catch (error) {
          console.error("API 요청 실패 또는 처리 중 오류 발생:", error);
          sessionStorage.removeItem('access_token');
        }
      } else {
        console.log("세션 스토리지에 토큰이 없음");
        location.href = '/views/sign_in.html'
      }

    } else {
      console.log("이메일 로그인");
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
