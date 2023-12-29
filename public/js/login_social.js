    // kakao

    async function kakaoLogin() {
    window.Kakao.Auth.login({
        scope: 'account_email',
        success: async function(authObj) {
            console.log(authObj);

            sessionStorage.setItem('loginMethod', 'social');
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
                console.log(verifyData);

                if (verifyData.code === 200 && verifyData.data.result === "VERIFIED") {
                  
                  sessionStorage.setItem('email', verifyData.data.email);
                  sessionStorage.setItem('action', 'signup');
                  sessionStorage.setItem('snsPlatform', 'kakao');
                  location.href = "/views/sign_up02.html";
                } else if (verifyData.data.result === "SUCCESS") {
                  
                    sessionStorage.setItem('access_token', authObj.access_token);
                    sessionStorage.setItem('refresh_token',authObj.refresh_token);
                    window.location.href = '/views/home.html'; 
                } else {
                    console.error('토큰 검증 실패');
                }
            } catch (error) {
                console.error('API 요청 실패:', error);
            }
        }
    });
}

    // google
    async function handleCredentialResponse(response) {

      const responsePayload = parseJwt(response.credential);
      console.log(responsePayload);

      console.log("Email: " + responsePayload.email);
      console.log(response.credential);

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
            token: response.credential,
          })
        });

        const verifyData = await verifyResponse.json();
        console.log(verifyData);

        if (verifyData.code === 200 && verifyData.data.result === "VERIFIED") {

            sessionStorage.setItem('email', verifyData.data.email);
            location.href = "/views/sign_up02.html";
        } else if (verifyData.data.result === "SUCCESS") {

            sessionStorage.setItem('access_token', verifyData.data.access_token);
            sessionStorage.setItem('refresh_token', verifyData.data.refresh_token);
            sessionStorage.setItem('user_id', verifyData.data.user_id);

            alert('로그인되었습니다.');
            // window.location.href = '/views/home.html'; 
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
