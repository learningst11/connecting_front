const reviewId = getQueryStringParam('reviewId');
document.addEventListener('DOMContentLoaded', function () {

    if(!reviewId) {
        location.href='/views/home.html'
    }

    fetchReview();

    const expertName = sessionStorage.getItem('expertName');
    document.querySelector('.top p span').textContent = expertName;

    document.querySelector('.bottom textarea').disabled = true;
    document.querySelectorAll('.imgbox input[type="file"]').forEach(input => {
        input.disabled = true;
    });

    $('.wrap_imgbox').slick({
        centerMode: false,
        slidesToShow: 3,
        infinite: false,
    });

});

async function fetchReview() {
    const url = `http://43.201.79.49/users/${reviewId}/review`;
    try {
        const response = await fetch(url, {
            method: 'GET',
        });

        const data = await response.json();
        if (response.ok && data.code === 200) {
            console.log(data.data);
            displayReview(data.data);
        } else {
            console.error('Failed to fetch review:', data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayReview(data) {

    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < data.score) {
            star.src = '/public/img/common/star_big.svg';
            star.setAttribute('data-filled', 'true');
        } else {
            star.src = '/public/img/common/star_big_empty.svg';
            star.setAttribute('data-filled', 'false');
        }
    });

    document.querySelector('.bottom textarea').textContent = data.content;

    const imgBoxes = document.querySelectorAll('.imgbox');
    if (Array.isArray(data.images) && data.images.length > 0) {
        imgBoxes.forEach((box, index) => {
            if (data.images[index]) {
                box.style.backgroundImage = `url(${data.images[index]})`;
                box.style.backgroundSize = 'cover';
                box.style.display = 'block';
                box.classList.add('image-uploaded');
            } else {
                box.style.display = 'none';
                box.classList.remove('image-uploaded');
            }
        });
    } else {
        imgBoxes.forEach(box => {
            box.style.display = 'none';
            box.classList.remove('image-uploaded');
        });
    }
}

function getQueryStringParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
