let vh = 0;
window.addEventListener("load", function () {
  document.body.classList.add("loaded");
  vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
});

window.addEventListener("DOMContentLoaded", async function () {
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


  // mypage
  const userGray = document.querySelector('img[alt="user_gray"]')
  if (userGray) {
    userGray.addEventListener('click', function () {
      let accessToken = sessionStorage.getItem('access_token');
      if (accessToken) {
        location.href = '/views/mypage.html';
      } else {
        sessionStorage.setItem('from','mypage');
        location.href = '/views/sign_in.html';
      }
    });
  }
});


