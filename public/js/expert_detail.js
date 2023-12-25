document.addEventListener("DOMContentLoaded", function () {
  const queryParams = new URLSearchParams(window.location.search);
  var expertId = queryParams.get("id");
  
  if (expertId) {

    fetchAndRenderExpertsDetails(expertId);

    const tabs = document.querySelectorAll('.wrap_tab li');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {

            tabs.forEach(tab => tab.classList.remove('active'));

            this.classList.add('active');

            if (this.textContent === '전문가 소개') {
                fetchAndRenderExpertsDetails(expertId);
                document.querySelector('.introduction').style.display = 'block';
                document.querySelector('.contents').style.display = 'none';
            } else if (this.textContent === '콘텐츠') {
                fetchAndRenderExpertsPosts(expertId);
                document.querySelector('.contents').style.display = 'block';
                document.querySelector('.introduction').style.display = 'none';
            }
        });
    });

    fetchAndRenderExpertsReviews(expertId);
  } else {
    location.href="./index.html";
  }
  
});

async function fetchAndRenderExpertsDetails(expertId) {
  const expertsDetail = await fetchExpertsDetails(expertId);
  const expertsDetailScore = await fetchExpertsDetailsScore(expertId);
  renderExpertsDetails(expertsDetail, expertsDetailScore, expertId);
}

// 전문가 소개
async function fetchExpertsDetails(expertId) {
  try {
    const url = `http://43.201.79.49/mds/${expertId}`;
    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok (${response.status})`);
    }

    const result = await response.json();
    console.log("Response data:", result.data);
    return result.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function fetchExpertsDetailsScore(expertId) {
  try {
    const url = `http://43.201.79.49/mds/${expertId}/score`;
    console.log(url);
    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok (${response.status})`);
    }

    const result2 = await response.json();
    console.log("Response data2:", result2.data);
    return result2.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function renderExpertsDetails(expertsDetail, expertsDetailScore) {
  try {
    const imgElement = document.querySelector(".top .item img");
    imgElement.src = expertsDetail.image;
    const nameElement1 = document.querySelector(".top .item p:first-child");
    const totalAvgScore =
      expertsDetailScore.avgScore % 1 === 0
        ? expertsDetailScore.avgScore + ".0"
        : expertsDetailScore.avgScore;
    nameElement1.innerHTML =
      expertsDetail.name +
      '<img src="/public/img/common/star.svg" alt="star"><span>' +
      totalAvgScore +
      "</span><span>(" +
      expertsDetailScore.total +
      ")</span>";

    const jobElement = document.querySelector(".top .item p:nth-child(2)");
    jobElement.innerHTML = `${expertsDetail.job}<br>${expertsDetail.career}`;

    const introductionTitleElement = document.querySelector(
      ".introduction .wrap01 h2 span"
    );
    introductionTitleElement.textContent = expertsDetail.name;

    const introductionItems = document.querySelectorAll(
      ".introduction .wrap01 .wrap_item .item span:nth-of-type(1)"
    );

    introductionItems[0].textContent = expertsDetail.field;
    introductionItems[2].textContent = expertsDetail.subject;
    introductionItems[3].textContent = expertsDetail.characteristic;

    const careerElement = document.querySelector(".wrap02 h3");
    careerElement.textContent = expertsDetail.career;

    const descriptionElement = document.querySelector(".wrap02 p");
    descriptionElement.textContent = expertsDetail.description;

    const nameElement2 = document.querySelector(".wrap03 h3 span");
    nameElement2.textContent = expertsDetail.name;

    const consultingButtons = document.querySelectorAll(".wrap03 button");
    consultingButtons[0].textContent = expertsDetail.consulting[0];
    consultingButtons[1].textContent = expertsDetail.consulting[1];
    consultingButtons[2].textContent = expertsDetail.consulting[2];

    const meetingScheduleElement = document.querySelector(".wrap04 p");
    meetingScheduleElement.textContent = expertsDetail.meetingSchedule;
  } catch (error) {
    console.error("Error rendering data:", error);
  }
}

// 리뷰
async function fetchAndRenderExpertsReviews(expertId) {
  const expertsReviews = await fetchExpertsReviews(expertId);
  const expertsDetailScore = await fetchExpertsDetailsScore(expertId);
  renderExpertsReviews(expertsReviews, expertsDetailScore, expertId);
}

async function fetchExpertsReviews(
  expertId,
  page = 0,
  size = 2,
  filter = "latest"
) {
  try {
    const url = `http://43.201.79.49/mds/${expertId}/review?page=${page}&size=${size}&filter=${filter}`;
    console.log(url);
    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok (${response.status})`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching review data:", error);
  }
}

function renderExpertsReviews(reviews, expertsDetailScore, expertId) {
  console.log(reviews);

  const wrapRating = document.querySelector(".wrap05 .wrap_rating");
  const moreLink = document.querySelector(".wrap05 .flexbox_h3 a");
  const wrapItem = document.querySelector(".wrap05 .wrap_item");

  if (reviews.length === 0) {
    wrapRating.style.display = 'none';
    moreLink.style.display = 'none';
  } else {
    wrapRating.style.display = '';
    moreLink.style.display = '';

    const ratingSpans = document.querySelectorAll(".wrap05 .wrap_rating span");
    ratingSpans[0].textContent = expertsDetailScore.avgScore;
    ratingSpans[1].textContent = `(${expertsDetailScore.total})`;
  }

  wrapItem.innerHTML = "";


  reviews.forEach((review) => {
    const reviewDiv = document.createElement("div");
    reviewDiv.className = "item";

    const flexboxDiv = document.createElement("div");
    flexboxDiv.className = "flexbox";

    const wrapStarDiv = document.createElement("div");
    wrapStarDiv.className = "wrap_star";

    for (let i = 0; i < 5; i++) {
      const starImg = document.createElement("img");
      starImg.src =
        i < review.score
          ? "/public/img/common/star.svg"
          : "/public/img/common/star_empty.svg";
      starImg.alt = "star";
      wrapStarDiv.appendChild(starImg);
    }

    const nicknameSpan = document.createElement("span");
    nicknameSpan.textContent = review.nickname;

    flexboxDiv.appendChild(wrapStarDiv);
    flexboxDiv.appendChild(nicknameSpan);

    const contentP = document.createElement("p");
    contentP.textContent = review.content;

    const dateSpan = document.createElement("span");
    dateSpan.textContent = review.date;

    reviewDiv.appendChild(flexboxDiv);
    reviewDiv.appendChild(contentP);
    reviewDiv.appendChild(dateSpan);
~
    wrapItem.appendChild(reviewDiv);

    document.querySelector(".wrap05 .flexbox_h3 a").addEventListener("click", function () {
        window.location.href = `expert_review.html?id=${expertId}`;
      });
  });
}

// 콘텐츠
async function fetchAndRenderExpertsPosts(expertId) {
  const expertsPost = await fetchExpertsPosts(expertId);
  renderExpertsPosts(expertsPost);
}

async function fetchExpertsPosts(expertId, page = 0, size = 10, filter = "") {
  try {
    const url = `http://43.201.79.49/mds/${expertId}/post?page=${page}&size=${size}&filter=${filter}`;
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

async function renderExpertsPosts(posts) {
  const postsContainer = document.querySelector(".contents .wrap_item");
  postsContainer.innerHTML = "";

  posts.forEach((post) => {
    const postDiv = document.createElement("div");
    postDiv.className = "item";

    postDiv.innerHTML = `
              <div class="wrap_img">
                  <img src="${post.image}" alt="contents_item">
                  <img src="/public/img/expert_detail/naver-blog.png" alt="naver-blog">
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