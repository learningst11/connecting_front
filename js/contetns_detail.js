// contents
async function fetchAndRenderContents(page, size, filter, option) {
    const posts = await fetchPosts(page, size, filter, option);
    renderContents(posts);
  }
  
  async function fetchPosts(page = 0, size = 10, filter = '', option = "all") {
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
        postDiv.id = `post-${post.id}`; 
  
        postDiv.innerHTML = `
            <img src="${post.image}" alt="item">
            <p>${post.title}</p>
            <p>${post.author}</p>
            <span class="like ${post.wish ? "active" : ""}"></span>
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
  
  
  
  
  