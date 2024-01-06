document.addEventListener("DOMContentLoaded", async function () {

  document.querySelectorAll('.wrap_button button').forEach(function (button) {

    button.addEventListener('click', function () {

      document.querySelectorAll('.wrap_button button').forEach(function (btn) {
        btn.classList.remove('active');
      });

      this.classList.add('active');
    });
  });

  document.querySelectorAll('.like').forEach(function (element) {

    element.addEventListener('click', function () {

      console.log(this)

      if (this.classList.contains('active')) {
        this.classList.remove('active');
      } else {
        this.classList.add('active');
      };
    })
  });

  document.querySelectorAll(".wrap_button button").forEach(function (button) {
    button.addEventListener("click", async function () {
      let postType = this.innerText;
      if (postType == "전체") {
        postType = "";
      }
      const postsContainer = document.querySelector(".wrap_item");
      postsContainer.innerHTML = "";

      const posts = await fetchPosts(0, 4, postType);
      renderPosts(posts);

      document.querySelectorAll(".wrap_button button").forEach(function (btn) {
        btn.classList.remove("active");
      });
      this.classList.add("active");
    });
  });

  await fetchAndRenderPosts();

});

async function fetchAndRenderPosts(filter = "") {
  const posts = await fetchPosts(0, 4, filter);
  renderPosts(posts);
}

async function fetchPosts(page = 0, size = 4, filter = "") {
  try {
    const accessToken = sessionStorage.getItem('access_token');
    const url = `http://43.201.79.49/mds/post?page=${page}&size=${size}&filter=${filter}`;
    console.log("Request URL:", url);

    let headers = {};
    if (accessToken) {
      headers['Authorization'] = accessToken;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: headers
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    console.log(result);
    return result.data;
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
}

async function renderPosts(posts) {
  const postsContainer = document.querySelector(".wrap_item");
  postsContainer.innerHTML = "";

  posts.forEach((post) => {
    const postDiv = document.createElement("div");
    postDiv.className = "item";

    postDiv.innerHTML = `
              <div class="wrap_img">
                  <img src="${post.image}" alt="contents_item">
                  <img src="" alt="platform">
                  <span class="like ${post.wish ? "active" : ""}"></span>
              </div>
              <div class="wrap_p">
                  <p>${post.author} &nbsp;|&nbsp; ${new Date(post.date).toLocaleDateString()}</p>
                  <p>${post.title}</p>
                  <p>${post.postType}</p>
              </div>
          `;
    postsContainer.appendChild(postDiv);

    postDiv.addEventListener("click", function () {
      window.location.href = post.url;
    });
  });

  document.querySelectorAll(".contents .like").forEach(function (element) {
    element.addEventListener("click", async function (event) {
      event.stopPropagation();

      const userId = sessionStorage.getItem('user_id');
      if (!userId) {
        alert("로그인이 필요합니다");
        window.location.href = '/views/sign_in.html';
        return;
      }

      const productId = this.closest('.item').getAttribute('data-post-id');

      try {
        const response = await sendApiRequest(`http://43.201.79.49/users/${userId}/wish`, {
          method: 'POST',
          body: JSON.stringify({
            type: 'POST',
            product_id: productId
          })
        });

        if (response.code === 200) {
          if (this.classList.contains("active")) {
            this.classList.remove("active");
          } else {
            this.classList.add("active");
          }
        } else {
          alert("오류가 발생했습니다: " + response.message);
        }
      } catch (error) {
        console.error('Error:', error);
        alert("요청 처리 중 오류가 발생했습니다.");
      }
    });
  });

}
