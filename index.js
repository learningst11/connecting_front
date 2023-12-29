window.addEventListener("load", function () {
  document.body.classList.add("loaded");
});

function redirectToMyPageIfLoggedIn() {
  const accessToken = sessionStorage.getItem("access_token");
  if (accessToken) {
    location.href = "/views/mypage.html";
  } else {
    location.href = "/views/sign_in.html";
  }
}

function loadKakaoSDK() {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://developers.kakao.com/sdk/js/kakao.js";
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// function loadKakaoSDK() {
//   return fetch("https://developers.kakao.com/sdk/js/kakao.js")
//     .then(response => {
//       if (!response.ok) {
//         throw new Error("Failed to load Kakao SDK");
//       }
//       return response.text();
//     })
//     .then(scriptText => {
//       const script = document.createElement("script");
//       script.textContent = scriptText;
//       document.head.appendChild(script);
//     });
// }



let vh = 0;
window.addEventListener("DOMContentLoaded", async function () {
  try {
    await loadKakaoSDK();
    Kakao.init("6aea60a72234bef0d5cbb423b8f41266");

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
            switch(data.data.result) {
                case 'VERIFIED':
                    // 회원가입 절차 진행
                    break;
                case 'INVALID':
                    window.location.href = '/views/home.html'; 
                case 'SUCCESS':
                    // 로그인 성공. 받은 토큰으로 세션 관리
                    break;
                default:
                    // 예상치 못한 결과 처리
                    break;
            }
        } else {
            // 오류 처리
            throw new Error("API 응답 오류");
        }
    } catch (error) {
        console.error("API 요청 실패 또는 처리 중 오류 발생:", error);
        sessionStorage.removeItem('access_token');
    }
} else {
    console.log("세션 스토리지에 토큰이 없음");
    // 로그인 페이지로 리다이렉트
}

    
    // 뷰포트 높이 설정
    vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);

    let page = $("#input_page").val();

    if (document.querySelector(".fnb")) {
      fetch("/public/include/fnb.html")
        .then((response) => response.text())
        .then((html) => {
          document.querySelector(".fnb").innerHTML = html;

          if (page !== "") {
            const activeElement = document.querySelector(
              `.fnb a[data-value="${page}"]`
            );
            if (activeElement) {
              activeElement.classList.add("active");
            }
          }
        })
        .catch((error) => console.error("Error loading fnb.html:", error));
    }
  } catch (error) {
    console.error("Error loading Kakao SDK:", error);
  }
});

// token
async function sendApiRequest(url, options) {
  const accessToken = sessionStorage.getItem("access_token");

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
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
    const response = await fetch("/api/token/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      sessionStorage.setItem("access_token", data.access_token);
      저장;
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

// // example
// sendApiRequest('/api/some-endpoint', { method: 'GET' })
//   .then(data => {

//   })
//   .catch(error => {

//   });
