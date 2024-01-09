document.addEventListener('DOMContentLoaded', async function () {

    history.pushState(null, null, location.href);

    window.onpopstate = function(event) {
        if (location.href.includes('/views/mypage_review.html')) {

            location.href = '/views/mypage_review.html';
        }
    };

    var tabs = document.querySelectorAll('.wrap_tab li');
    tabs.forEach(function (tab, index) {
        tab.addEventListener('click', function () {
            tabs.forEach(function (tab) {
                tab.classList.remove('active');
            });
            this.classList.add('active');
            toggleSections(index);
            if (index === 0) {
                fetchAvailableReviews();
            } else {
                fetchWrittenReviews();
            }
        });
    });

    fetchAvailableReviews();
});

function toggleSections(index) {
    var reviewToWriteSection = document.querySelector('.review_to_write');
    var reviewWrittenSection = document.querySelector('.review_written');

    if (index === 0) {
        reviewToWriteSection.style.display = 'block';
        reviewWrittenSection.style.display = 'none';
    } else {
        reviewToWriteSection.style.display = 'none';
        reviewWrittenSection.style.display = 'block';
    }
}

async function fetchAvailableReviews() {
    const url = 'http://43.201.79.49/users/available/reviews?page=0&size=6';
    try {
        const response = await sendApiRequest(url, { method: 'GET' });
        if (response.code === 200) {
            updateAvailableReviews(response.data);
            console.log(url);
            console.log(response.data);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function fetchWrittenReviews() {
    const userId = sessionStorage.getItem('user_id');
    const url = `http://43.201.79.49/users/${userId}/reviews`;
    try {
        const response = await sendApiRequest(url, { method: 'GET' });
        if (response.code === 200) {
            updateWrittenReviews(response.data);
            console.log(url);
            console.log(response.data);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function updateAvailableReviews(reviews) {
    const container = document.querySelector('.review_to_write .wrap_item');
    container.innerHTML = '';

    reviews.forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'item';
        reviewElement.setAttribute('data-reservation-id', review.reservationId);
        reviewElement.setAttribute('data-md-id', review.mdId);
        reviewElement.innerHTML = `
            <div class="top">
                <img src="${review.image}" alt="item">
                <div>
                    <p>${review.name}</p>
                    <p>${review.job}<span>전문가</span></p>
                    <p>상담진행일 | ${formatDate(review.startDateTime)}</p>
                </div>
            </div>
            <div class="bottom">
                <button type="button">리뷰작성</button>
            </div>`;

        const reviewButton = reviewElement.querySelector('.bottom button');
        reviewButton.addEventListener('click', () => {
            location.href = `/views/mypage_review_create.html?reservationId=${review.reservationId}&mdId=${review.mdId}&name=${encodeURIComponent(review.name)}`;
        });

        container.appendChild(reviewElement);
    });
}


function updateWrittenReviews(reviews) {
    const container = document.querySelector('.review_written .wrap_item');
    container.innerHTML = '';

    reviews.forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'item';
        reviewElement.innerHTML = `
            <div class="top">
                <img src="${review.mdImage}" alt="item">
                <div>
                    <p>${review.name}</p>
                    <p>${review.job}<span>전문가</span></p>
                    <p>구매확정일 | ${formatDate(review.purchaseDate)}</p>
                </div>
            </div>
            <div class="bottom">
                <div class="wrap_star">${generateStars(review.score)}</div>
                <p>${review.content}</p>
            </div>`;
        container.appendChild(reviewElement);
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
}

function generateStars(score) {
    let starsHtml = '';
    for (let i = 0; i < score; i++) {
        starsHtml += '<img src="/public/img/common/star.svg" alt="star">';
    }
    return starsHtml;
}