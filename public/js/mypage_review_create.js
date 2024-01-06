let stars;
document.addEventListener('DOMContentLoaded', function () {

    const name = getQueryStringParam('name');
    console.log(name);
    const nameSpan = document.querySelector('.top p span');
    nameSpan.textContent = decodeURIComponent(name);

    $('.wrap_imgbox').slick({
        centerMode: false,
        slidesToShow: 3,
        infinite: false,
    });

    stars = document.querySelectorAll('.star');
    function setRating(clickedStarIndex) {
        stars.forEach((star, index) => {
            if (index <= clickedStarIndex) {
                star.src = '/public/img/common/star_big.svg';
                star.setAttribute('data-filled', 'true');
            } else {
                star.src = '/public/img/common/star_big_empty.svg';
                star.setAttribute('data-filled', 'false');
            }
        });
    }

    stars.forEach((star, index) => {
        star.addEventListener('click', function () {
            setRating(index);
        });
    });

    var imgBoxes = document.querySelectorAll('.imgbox');
    var imageInput = document.getElementById('imageInput');

    function handleImageChange(imgBox) {
        imageInput.click();

        imageInput.onchange = function () {
            if (this.files && this.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    imgBox.style.backgroundImage = 'url(' + e.target.result + ')';
                    imgBox.style.backgroundSize = 'cover';
                    imgBox.classList.add('image-uploaded');
                };
                reader.readAsDataURL(this.files[0]);
            }
        };
    }

    imgBoxes.forEach(function (imgBox) {
        imgBox.addEventListener('click', function () {
            handleImageChange(imgBox);
        });
    });


    const submitButton = document.getElementById('submitReviewButton');
    submitButton.addEventListener('click', sendReview);
});

function getQueryStringParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function getRating() {
    return Array.from(stars).filter(star => star.getAttribute('data-filled') === 'true').length;
}

function collectReviewData() {
    const content = document.querySelector('textarea').value;
    const score = getRating();
    const images = Array.from(document.querySelectorAll('.imgbox'))
        .map(imgBox => imgBox.style.backgroundImage.slice(5, -2));

    return {
        score,
        content,
        images,
        reservationId: getQueryStringParam('reservationId')
    };
}

async function sendReview() {
    const mdId = getQueryStringParam('mdId');
    const reviewData = collectReviewData();

    if (getRating() === 0) {
        alert('별점을 선택해주세요.');
        return;
    }

    const content = document.querySelector('textarea').value;
    if (!content.trim()) {
        alert('리뷰 내용을 입력해주세요.');
        return;
    }

    const url = `http://43.201.79.49/mds/${mdId}/review`;
    try {
        const response = await sendApiRequest(url, {
            method: 'POST',
            body: JSON.stringify(reviewData)
        });
        if (response.code === 200) {
            alert('리뷰가 등록되었습니다.');
            location.href='/views/mypage_review.html'
        } else {
            console.error('Failed to submit review:', response);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
