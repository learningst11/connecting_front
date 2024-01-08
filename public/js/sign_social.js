document.addEventListener('DOMContentLoaded', function () {

  let accessToken = sessionStorage.getItem('access_token');

  if (accessToken) {
    location.href = '/views/home.html';
  }

});

// kakao
Kakao.init("6aea60a72234bef0d5cbb423b8f41266");

async function kakaoLogin() {
  window.Kakao.Auth.login({
    scope: 'account_email',
    success: async function (authObj) {
      sessionStorage.setItem('social_token', authObj.access_token);

      try {
        const verifyResponse = await fetch("http://43.201.79.49/users/social/verify?platform=kakao", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            token: authObj.access_token,
          })
        });

        const verifyData = await verifyResponse.json();

        if (verifyData.code === 200 && verifyData.data.result === "VERIFIED") {
          sessionStorage.setItem('email', verifyData.data.email);
          sessionStorage.setItem('action', 'signup');
          sessionStorage.setItem('sns_platform', 'kakao');
          location.href = "/views/sign_up02.html";
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
            sessionStorage.setItem('sns_platform', 'kakao');
            sessionStorage.setItem('access_token', authorizeData.data.access_token);
            sessionStorage.setItem('refresh_token', authorizeData.data.refresh_token);
            sessionStorage.setItem('user_id', authorizeData.data.userId);
            alert('로그인되었습니다.');

            if (sessionStorage.getItem('from') === 'mypage') {
              location.href = '/views/mypage.html';
              return;
            } else if (sessionStorage.getItem('from') === 'list_like') {
              location.href = '/views/list_like.html';
              return;
            }

            location.href = '/views/home.html';

          } else {
            console.error('Authorize API Error:', authorizeData.message);
          }
        } else {
          console.error('토큰 검증 실패');
        }
      } catch (error) {
        console.error('API 요청 실패:', error);
      }
    }
  });
}


window.onload = function () {
  google.accounts.id.initialize({
    client_id: "266214929436-9acqh2au2h8e05ourhgeuq66v6ldt7cn.apps.googleusercontent.com",
    callback: handleCredentialResponse
  });
  google.accounts.id.renderButton(
    document.getElementById("buttonDiv"),
    { theme: "outline", size: "large" }
  );
  google.accounts.id.prompt();
};

// google
async function handleCredentialResponse(response) {

  const responsePayload = parseJwt(response.credential);
  console.log("Email: " + responsePayload.email);
  console.log("token" + response.credential);

  sessionStorage.setItem('loginMethod', 'social');
  sessionStorage.setItem('email', responsePayload.email);
  sessionStorage.setItem('social_token', response.credential);

  try {
    const verifyResponse = await fetch("http://43.201.79.49/users/social/verify?platform=google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: response.credential
      })
    });

    const verifyData = await verifyResponse.json();
    console.log(verifyData.data.email)

    if (verifyData.code === 200 && verifyData.data.result === "VERIFIED") {
      sessionStorage.setItem('sns_platform', 'google');
      sessionStorage.setItem('email', verifyData.data.email);
      location.href = "/views/sign_up02.html";
    } else if (verifyData.data.result === "SUCCESS") {
      const authorizeResponse = await fetch("http://43.201.79.49/users/authorize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: verifyData.data.email,
          snsPlatform: 'google'
        })
      });

      const authorizeData = await authorizeResponse.json();

      if (authorizeData.code === 200) {
        sessionStorage.setItem('sns_platform', 'google');
        sessionStorage.setItem('access_token', authorizeData.data.access_token);
        sessionStorage.setItem('refresh_token', authorizeData.data.refresh_token);
        sessionStorage.setItem('user_id', authorizeData.data.userId);
        alert('로그인되었습니다.');

        if (sessionStorage.getItem('from') === 'mypage') {
          location.href = '/views/mypage.html';
          return;
        } else if (sessionStorage.getItem('from') === 'list_like') {
          location.href = '/views/list_like.html';
          return;
        }

        window.location.href = '/views/home.html';

      } else {
        console.error('Authorize API Error:', authorizeData.message);
      }
    } else {
      console.error('토큰 검증 실패');
    }
  } catch (error) {
    console.error('API 요청 실패:', error);
  }
};

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
};
