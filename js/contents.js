document.addEventListener("DOMContentLoaded", async function () {
  await fetchAndRenderPosts();

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
});

async function fetchAndRenderPosts(filter = "") {
  const posts = await fetchPosts(0, 4, filter);
  renderPosts(posts);
}

async function fetchPosts(page = 0, size = 4, filter = "") {
  try {
    const url = `http://43.201.79.49/mds/post?page=${page}&size=${size}&filter=${filter}`;
    console.log("Request URL:", url);

    const response = await fetch(url, {
      method: "GET",
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
                  <img src="./img/expert_detail/naver-blog.png" alt="naver-blog">
              </div>
              <div class="wrap_p">
                  <p>${post.author} &nbsp;|&nbsp; ${new Date(
      post.date
    ).toLocaleDateString()}</p>
                  <p>${post.title}</p>
                  <p>${post.postType}</p>
              </div>
          `;
    postsContainer.appendChild(postDiv);

    postDiv.addEventListener("click", function () {
      window.location.href = post.url;
    });
  });
}
