document.addEventListener('DOMContentLoaded', function () {

    // renderPromotions();
    // swiperInit();

    fetchAndRenderExperts();
    fetchAndRenderContents();

    document.querySelectorAll('.wrap_a a').forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            sessionStorage.setItem('selectedCategory', this.textContent.trim());
            window.location.href = '/views/category.html';
        });
    });

});

// promotions
async function fetchPromotions() {
    try {
        const response = await fetch('http://43.201.79.49/promotions', {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log(result);
        return result.data;
    } catch (error) {
        console.error('Error fetching promotions: ', error);
    }
}

async function renderPromotions() {
    const promotions = await fetchPromotions();
    const swiperWrapper = document.querySelector('.slide_main .swiper-wrapper');

    swiperWrapper.innerHTML = '';

    promotions.forEach(promotion => {
        const slide = document.createElement('a');
        slide.className = 'swiper-slide';
        slide.href = promotion.url;
        slide.innerHTML = `<img src="${promotion.image}" alt="Promotion">`;
        swiperWrapper.appendChild(slide);
    });

    slide_main.update();
}


let slide_main;
function swiperInit() {
    slide_main = new Swiper(".slide_main", {
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        }
    })
}

// expert
async function fetchAndRenderExperts(page, size, filter1, filter2, option) {
    const experts = await fetchExperts(page, size, filter1, filter2, option);
    renderExpertsHome(experts);
}

async function fetchExperts(page = 0, size = 4, filter1 = "latest", filter2 = "", option = "all") {
    try {
        const url = `http://43.201.79.49/mds?page=${page}&size=${size}&filter1=${filter1}&filter2=${filter2}&option=${option}`;
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


async function renderExpertsHome(experts) {
    const expertsContainer = document.querySelector(".expert .wrap_item");
    expertsContainer.innerHTML = "";

    experts.forEach((expert) => {
        const expertDiv = document.createElement("div");
        expertDiv.className = "item";
        expertDiv.id = `expert-${expert.id}`;

        expertDiv.innerHTML = `
            <img src="${expert.image}" alt="item">
            <p>${expert.name}</p>
            <p>#${expert.category.split(' ').join(' #')}</p>
            <span class="like ${expert.wish ? "active" : ""}"></span>
        `;
        expertsContainer.appendChild(expertDiv);

        expertDiv.addEventListener("click", function () {
            window.location.href = `/views/expert_detail.html?id=${expert.id}`;
        });
    });

    document.querySelectorAll(".expert .like").forEach(function (element) {
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
          <img src="${post.image}" alt="item">
          <p>${post.title}</p>
          <p>#${post.postType}</p>
          <span class="like ${post.wish ? "active" : ""}"></span>
      `;
      postsContainer.appendChild(postDiv);
  });


  document.querySelectorAll('.like').forEach(function (element) {
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



// async function renderContents(posts) {
//     const postsContainer = document.querySelector('.contents .wrap_item');
//     postsContainer.innerHTML = '';

//     posts.forEach(post => {
//         const postDiv = document.createElement('div');
//         postDiv.className = 'item';
//         postDiv.id = `post-${post.id}`;

//         postDiv.innerHTML = `
//           <img src="${post.image}" alt="item">
//           <p>${post.title}</p>
//           <p>${post.author}</p>
//           <span class="like ${post.wish ? "active" : ""}"></span>
//       `;
//         postsContainer.appendChild(postDiv);

//         postDiv.addEventListener('click', function () {
//             window.location.href = post.url;
//         });
//     });

//     document.querySelectorAll('.contents .like').forEach(function (element) {
//         element.addEventListener('click', function (event) {
//             event.stopPropagation();
//             if (this.classList.contains('active')) {
//                 this.classList.remove('active');
//             } else {
//                 this.classList.add('active');
//             }
//         });
//     });
// }




