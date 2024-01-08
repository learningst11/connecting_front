const userId = sessionStorage.getItem('user_id');
const accessToken = sessionStorage.getItem('access_token');

document.addEventListener('DOMContentLoaded', async function () {
    await renderWishlistItems('md');

    var tabs = document.querySelectorAll('.wrap_tab li');

    tabs.forEach(function (tab, index) {
        tab.addEventListener('click', async function () {
            tabs.forEach(function (tab) {
                tab.classList.remove('active');
            });

            this.classList.add('active');

            const type = index === 0 ? 'md' : 'post';
            await renderWishlistItems(type);
        });
    });
});


async function fetchWishlist(type, page = 0, size = 10) {
    const url = `http://43.201.79.49/users/${userId}/wish/${type}?page=${page}&size=${size}`;
    try {
        const response = await sendApiRequest(url, {
            method: 'GET'
        });

        console.log(url);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching wishlist:", error);
    }
}

async function renderWishlistItems(type) {
    const wishlistItems = await fetchWishlist(type);
    const container = document.querySelector(type === 'md' ? '.expert .wrap_item' : '.contents .wrap_item');
    container.innerHTML = '';

    updateItemCount(type, wishlistItems.length);

    wishlistItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item';
        itemElement.innerHTML = `
        <img src="${item.image}" alt="item">
        <p>${type === 'md' ? item.name : item.title}</p>
        <span class="like active"></span>
      `;
        container.appendChild(itemElement);
    });

    var expertSection = document.querySelector('.expert');
    var contentsSection = document.querySelector('.contents');

    if (type === 'md') {
        expertSection.style.display = 'block';
        contentsSection.style.display = 'none';
    } else {
        expertSection.style.display = 'none';
        contentsSection.style.display = 'block';
    }
}

function updateItemCount(type, count) {
    const countSpan = type === 'md'
        ? document.querySelector('.expert span')
        : document.querySelector('.contents span');

    const itemType = type === 'md' ? '전문가' : '콘텐츠';
    countSpan.textContent = `${itemType} : ${count}개`;
}



