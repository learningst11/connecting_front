document.addEventListener('DOMContentLoaded', function () {
  const tabs = document.querySelectorAll('.wrap_tab li');
  const expertSection = document.querySelector('.expert');
  const contentsSection = document.querySelector('.contents');

  var selectedCategory = sessionStorage.getItem('selectedCategory');

  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      if (this.textContent === '콘텐츠') {
        contentsSection.style.display = 'block';
        expertSection.style.display = 'none';

        const page = 0; 
        const size = 4; 
        const filter = selectedCategory; 
        const option = "all"; 

        fetchAndRenderContents(page, size, filter, option);
      } else if (this.textContent === '전문가') {
        expertSection.style.display = 'block';
        contentsSection.style.display = 'none';
      }
    });
  });

  expertSection.style.display = 'block';
  contentsSection.style.display = 'none';

  if (selectedCategory) {
    document.querySelector('.top h2').textContent = selectedCategory;
    fetchAndRenderExperts('latest', selectedCategory);
  }
});

// experts
async function fetchAndRenderExperts(filter1 = "latest", filter2 = "") {
    const experts = await fetchExperts(0, 10, filter1, filter2);
    renderExperts(experts);
  }
  
  async function fetchExperts(
    page = 0,
    size = 4,
    filter1 = "latest",
    filter2 = ""
  ) {
    try {
      const url = `http://43.201.79.49/mds?page=${page}&size=${size}&filter1=${filter1}&filter2=${filter2}`;
  
      const response = await fetch(url, { method: "GET" });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const result = await response.json();
      console.log(result);
      return result.data;
    } catch (error) {
      console.error("Error fetching data: ", error);
      return [];
    }
  }
  
  async function renderExperts(experts) {
    const expertsContainer = document.querySelector(".wrap_item");
    expertsContainer.innerHTML = "";
  
    experts.forEach((expert) => {
      const expertDiv = document.createElement("div");
      expertDiv.className = "item";
      expertDiv.setAttribute('data-id', expert.id);
  
      expertDiv.innerHTML = `
        <div class="top">
          <img src="${expert.image}" alt="item">
          <div>
            <p>${expert.name} <img src="./img/common/rating.svg" alt="rating"><span>${expert.score}</span></p>
            <p>${expert.job}</p>
            <p>${expert.category}</p>
          </div>
          <span class="like"></span>
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
  }
  
  
// contents
async function fetchAndRenderContents(page, size, filter, option) {
    const posts = await fetchPosts(page, size, filter, option);
    renderContents(posts);
  }
  
  async function fetchPosts(page = 0, size = 4, filter = '', option = "all") {
  try {
      const response = await fetch(`http://43.201.79.49/mds/post?page=${page}&size=${size}&filter=${filter}&option=${option}`, {
          method: 'GET',
      });
  
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
  
      const result = await response.json();
      console.log(result);
      return result.data;
  } catch (error) {
      console.error('Error fetching posts: ', error);
  }
  }

  async function renderContents(posts) {
    const postsContainer = document.querySelector('.contents .wrap_item');
    postsContainer.innerHTML = ''; 
  
    posts.forEach(post => {
      const postDiv = document.createElement('div');
      postDiv.className = 'item';
  
      postDiv.innerHTML = `
        <div class="wrap_img">
          <img src="${post.image}" alt="contents_item">
          <img src="" alt="platform-etc">
        </div>
        <div class="wrap_p">
          <p>${post.author} | ${post.date}</p>
          <p>${post.title}</p>
          <p>#${post.postType}</p>
        </div>
      `;
  
      postsContainer.appendChild(postDiv);
  
        postDiv.addEventListener('click', function () {
          window.location.href = post.url; 
      });
    });
  
    document.querySelectorAll('.contents .like').forEach(function (element) {
        element.addEventListener('click', function (event) {
            event.stopPropagation(); 
            if (this.classList.contains('active')) {
                this.classList.remove('active');
            } else {
                this.classList.add('active');
            }
        });
    });
  }
  
  
  
  
  