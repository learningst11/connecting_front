document.addEventListener('DOMContentLoaded', function() {
    fetchCouponList();
});

async function fetchCouponList() {
    const userId = sessionStorage.getItem('user_id');

    try {
        const url = `http://43.201.79.49/users/${userId}/coupons`;
        const response = await sendApiRequest(url, { method: 'GET' });

        if (response.code === 200) {
            updateCouponListUI(response.data);
        } else {
            console.error('Error fetching coupons:', response.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function updateCouponListUI(coupons) {
    const couponContainer = document.querySelector('.wrap_coupon');
    couponContainer.innerHTML = '';

    coupons.forEach(coupon => {
        const couponElement = document.createElement('div');
        couponElement.className = 'coupon';
        couponElement.innerHTML = `
            <img src="/public/img/common/coupon_active.svg" alt="coupon_active">
            <div>
                <p>${coupon.couponName}</p>
                <p>${calculateRemainingDays(coupon.expiredDate)}일 남음</p>
                <p>${formatDate(coupon.startDate)}~${formatDate(coupon.expiredDate)}</p>
            </div>`;
        couponContainer.appendChild(couponElement);
    });
}

function calculateRemainingDays(expiredDate) {
    const today = new Date();
    const expirationDate = new Date(expiredDate);
    const timeDiff = expirationDate.getTime() - today.getTime();
    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return dayDiff > 0 ? dayDiff : 0;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
}

