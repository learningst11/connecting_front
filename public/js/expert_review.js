const queryParams = new URLSearchParams(window.location.search);
var expertId = queryParams.get('id');
console.log(expertId);

document.addEventListener('DOMContentLoaded', function () {

  fetchAndRenderExpertsReviews(expertId);

  // sort
  document.querySelector(".sort_output").addEventListener("click", function () {
    document.querySelector(".wrap_popup").style.display = "block";
    document.querySelector(".popup").style.display = "block";
  });

  document.querySelectorAll(".popup ul li").forEach(function (item) {
    item.addEventListener("click", async function () {
      var selectedText = this.innerText;
      var select = document.getElementById("sort_origin");

      for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].text === selectedText) {
          select.selectedIndex = i;
          break;
        }
      }

      document.querySelector(".sort_output").textContent = selectedText;
      document.querySelector(".wrap_popup").style.display = "none";
      document.querySelector(".popup").style.display = "none";

      var filterValue = select.value;
      await fetchAndRenderExpertsReviews(expertId, filterValue);
    });
  });

  document.addEventListener("click", function (event) {
    var isClickInsidePopup = document.querySelector(".popup").contains(event.target);
    var isClickInsideSortOutput = document.querySelector(".sort_output") === event.target;

    if (!isClickInsidePopup && !isClickInsideSortOutput) {
      document.querySelector(".wrap_popup").style.display = "none";
      document.querySelector(".popup").style.display = "none";
    }
  });

})

async function fetchAndRenderExpertsReviews(expertId, filter = "latest") {
  const expertsReviews = await fetchExpertsReviews(expertId, 0, 6, filter);
  const expertsDetailScore = await fetchExpertsDetailsScore(expertId);
  renderExpertsReviews(expertsReviews, expertsDetailScore);
}


async function fetchExpertsReviews(expertId, page = 0, size = 6, filter = 'latest') {
  try {
    const url = `http://43.201.79.49/mds/${expertId}/review?page=${page}&size=${size}&filter=${filter}`;
    console.log(url);
    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok (${response.status})`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching review data:', error);
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

function renderExpertsReviews(reviews, expertsDetailScore) {
  console.log(reviews);

  const wrap05 = document.querySelector('.wrap.wrap05');
  const wrap05None = document.querySelector('.wrap.wrap05.none');

  if (reviews.length > 0) {
    wrap05None.style.display = 'none';
    wrap05.style.display = 'block';

    const expertName = sessionStorage.getItem('expertName');
    const exertNameH3 = wrap05.querySelector('.flexbox_h2 h3');
    exertNameH3.textContent = `${expertName}` + " 전문가 후기";

    const avgScoreP = wrap05.querySelector('.flexbox_h2 p');
    avgScoreP.innerHTML = `${expertsDetailScore.avgScore.toFixed(1)} <span>(${expertsDetailScore.total})</span>`;

    const wrapItem = wrap05.querySelector('.wrap_item');
    wrapItem.innerHTML = '';

    reviews.forEach(review => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'item';
      itemDiv.setAttribute('data-review-id', review.id);

      const flexboxDiv = document.createElement('div');
      flexboxDiv.className = 'flexbox';

      const wrapStarDiv = document.createElement('div');
      wrapStarDiv.className = 'wrap_star';
      for (let i = 0; i < 5; i++) {
        const starImg = document.createElement('img');
        starImg.src = i < review.score ? '/public/img/common/star.svg' : '/public/img/common/star_empty.svg';
        starImg.alt = 'star';
        wrapStarDiv.appendChild(starImg);
      }

      const nicknameSpan = document.createElement('span');
      nicknameSpan.textContent = review.nickname;

      flexboxDiv.appendChild(wrapStarDiv);
      flexboxDiv.appendChild(nicknameSpan);

      const contentP = document.createElement('p');
      contentP.textContent = review.content;

      const dateSpan = document.createElement('span');
      dateSpan.textContent = review.date;

      itemDiv.appendChild(flexboxDiv);
      itemDiv.appendChild(contentP);
      itemDiv.appendChild(dateSpan);

      itemDiv.addEventListener('click', () => {
        location.href = `/views/review_view.html?reviewId=${review.id}`;
      });

      wrapItem.appendChild(itemDiv);
    });
  } else {
    wrap05None.style.display = 'block';
    wrap05.style.display = 'none';
  }
}


function updateWishImage() {
  var wishImage = document.querySelector('.wrap_like img');

  if (expertsDetail.wish) {
      wishImage.src = '/public/img/common/like_gray_fill_active.svg';
  } else {
      wishImage.src = '/public/img/common/like_gray_fill.svg';
  }
}

updateWishImage();
