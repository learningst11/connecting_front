document.addEventListener("DOMContentLoaded", async function () {
  let category;

  await fetchAndRenderExperts();

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
      await fetchAndRenderExperts(filterValue, category);
    });
  });

  document.addEventListener("click", function (event) {
    var isClickInsidePopup = document
      .querySelector(".popup")
      .contains(event.target);
    var isClickInsideSortOutput =
      document.querySelector(".sort_output") === event.target;

    if (!isClickInsidePopup && !isClickInsideSortOutput) {
      document.querySelector(".wrap_popup").style.display = "none";
      document.querySelector(".popup").style.display = "none";
    }
  });

  document.querySelectorAll(".wrap_button button").forEach(function (button) {
    button.addEventListener("click", async function () {
      category = this.innerText;
      if (category == "전체") {
        category = "";
      }
      const postsContainer = document.querySelector(".wrap_item");
      postsContainer.innerHTML = "";

      const experts = await fetchExperts(0, 10, "latest", category);
      renderExperts(experts);

      document.querySelectorAll(".wrap_button button").forEach(function (btn) {
        btn.classList.remove("active");
      });
      this.classList.add("active");
    });
  });
});

async function fetchAndRenderExperts(filter1 = "latest", filter2 = "") {
  const experts = await fetchExperts(filter1, filter2);
  renderExperts(experts);
}

async function fetchExperts(
  page = 0,
  size = 10,
  filter1 = "latest",
  filter2 = ""
) {
  try {
    const url = `http://43.201.79.49/mds?page=${page}&size=${size}&filter1=${filter1}&filter2=${filter2}`;
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

async function renderExperts(experts) {
  const expertsContainer = document.querySelector(".wrap_item");
  expertsContainer.innerHTML = "";

  experts.forEach((expert) => {
    const expertDiv = document.createElement("div");
    expertDiv.className = "item";
    expertDiv.id = `expert-${expert.id}`;

    expertDiv.innerHTML = `
            <div class="top">
                <img src="${expert.image}" alt="item">
                    <div>
                        <div>
                            <p>${
                              expert.name
                            }</p><img src="./img/common/rating.svg" alt="rating"><span>${
      expert.score
    }</span>
                        </div>  
                            <p>${expert.job}</p>
                            <p>${expert.career}</p>
                    </div>
                <span class="like ${expert.wish ? "active" : ""}"></span>
            </div>
            <div class="bottom">
                <p>${expert.profile}</p>
            </div>
        `;
    expertsContainer.appendChild(expertDiv);

    expertDiv.addEventListener("click", function () {
      window.location.href = `expert_detail.html?id=${expert.id}`;
    });
  });

  document.querySelectorAll(".like").forEach(function (element) {
    element.addEventListener("click", function (event) {
      event.stopPropagation();
      if (this.classList.contains("active")) {
        this.classList.remove("active");
      } else {
        this.classList.add("active");
      }
    });
  });
}
