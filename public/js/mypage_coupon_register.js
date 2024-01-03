document.addEventListener('DOMContentLoaded', function() {
    
    document.querySelector('.btn_action').addEventListener('click', async function() {
        const userId = sessionStorage.getItem('user_id');
        const couponCode = document.getElementById('couponCode').value;

        if (!couponCode) {
            alert('쿠폰 코드를 입력해주세요');
            return;
        }

        try {
            const url = `http://43.201.79.49/users/${userId}/coupons/${couponCode}`;
            const options = { method: 'POST' };
            const data = await sendApiRequest(url, options);
            console.log(data);

            if (data.code === 200 && data.message === 'SUCCESS') {
                alert('쿠폰이 성공적으로 등록되었습니다');
            } else {
                alert('오류: ' + data.message);
            }
        } catch (error) {
            console.error('오류:', error);
            alert('쿠폰 등록 중 오류가 발생했습니다');
        }
    });
});

