window.addEventListener("DOMContentLoaded", async function () {

  try {

    let snsPlatform = sessionStorage.getItem('sns_platform');
    let accessToken = sessionStorage.getItem('access_token');

    if (accessToken) {

      if (snsPlatform === 'kakao') {

        let socialToken = sessionStorage.getItem('social_token');

        try {
          const response = await fetch("http://43.201.79.49/users/social/verify?platform=kakao", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ token: socialToken })
          });

          const verifyData = await response.json();

          if (verifyData.code === 200 && verifyData.data.result === "VERIFIED") {
              location.href = '/views/sign_in.html'

            } else if (verifyData.data.result === "SUCCESS") {
              const authorizeResponse = await fetch("http://43.201.79.49/users/authorize", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  email: verifyData.data.email,
                  snsPlatform: 'kakao',
                })
              });

              const authorizeData = await authorizeResponse.json();

              if (authorizeData.code === 200) {
                console.log('카카오 로그인 성공');
              } else {
                console.error('Authorize API Error:', authorizeData.message);
              }
            } else {
              console.error('토큰 검증 실패');
            }
        } catch (error) {
          console.error("API 요청 실패 또는 처리 중 오류 발생:", error);
          sessionStorage.removeItem('access_token');
        }


      } else if (snsPlatform === 'google') {

        let socialToken = sessionStorage.getItem('social_token');

          try {
            const response = await fetch("http://43.201.79.49/users/social/verify?platform=google", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ token: socialToken })
            });

            const verifyData = await response.json();

            if (verifyData.code === 200 && verifyData.data.result === "VERIFIED") {
                location.href = '/views/sign_in.html'

              } else if (verifyData.data.result === "SUCCESS") {
                const authorizeResponse = await fetch("http://43.201.79.49/users/authorize", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                    email: verifyData.data.email,
                    snsPlatform: 'google',
                  })
                });

                const authorizeData = await authorizeResponse.json();

                if (authorizeData.code === 200) {
                  console.log('구글 로그인 성공');
                } else {
                  console.error('Authorize API Error:', authorizeData.message);
                }
              } else {
                console.error('토큰 검증 실패');
              }
          } catch (error) {
            console.error("API 요청 실패 또는 처리 중 오류 발생:", error);
            sessionStorage.removeItem('access_token');
          }

      } else {
        console.log("이메일 로그인 성공");
      }

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
