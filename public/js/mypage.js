document.addEventListener('DOMContentLoaded', function () {

    const accessToken = sessionStorage.getItem("access_token");
    const userDiv = document.querySelector('.user');
    const userText = document.querySelector('.user span');

    if (accessToken) {
        userDiv.setAttribute('onclick', "location.href='/views/myinfo.html'");
        fetchAndRenderUserInfo();
        addLogoutButton();
    }else{
        userDiv.setAttribute('onclick', "sessionStorage.setItem('from','mypage'); location.href='/views/sign_in.html';");
        if (userText) {
            userText.textContent = '로그인/회원가입';
        }
    }

});


async function fetchAndRenderUserInfo() {
    const userId = sessionStorage.getItem('user_id');
    if (!userId) {
        console.error('User ID not found');
        return;
    }

    try {
        const data = await sendApiRequest(`http://43.201.79.49/users/${userId}`, { method: 'GET' });

        document.querySelector('.user span').textContent = data.data.nickname;

    } catch (error) {
        console.error('Error fetching user info:', error);
    }
}

function addLogoutButton() {
    const bottomDiv = document.querySelector('.bottom .wrap_item'); 
    if (!bottomDiv) return;

    const logoutItem = document.createElement('div');
    logoutItem.classList.add('item');
    logoutItem.innerHTML = `
        <span>로그아웃</span>
        <img src="/public/img/common/arrow_right.gray.svg" alt="arrow_right">
    `;

    logoutItem.addEventListener('click', async function () {
        try {
            const response = await fetch("http://43.201.79.49/users/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + sessionStorage.getItem('access_token')
                },
                body: JSON.stringify({
                    user_id: sessionStorage.getItem('user_id')
                })
            });

            const data = await response.json();

            if (data.code === 200) {
                Swal.fire({
                    text: '로그아웃되었습니다.',
                    toast: true,
                    position: 'bottom',
                    showConfirmButton: false,
                    timer: 1000,
                }).then(function(){
                    location.reload();
                })

                logoutItem.remove();

                sessionStorage.removeItem('access_token');
                sessionStorage.removeItem('social_token');
                sessionStorage.removeItem('refresh_token');
                sessionStorage.removeItem('user_id');
                sessionStorage.removeItem('sns_platform');
            } else {
                console.error("로그아웃 실패: ", data.message);
            }
        } catch (error) {
            console.error("로그아웃 중 오류 발생: ", error);
        }
    });

    bottomDiv.appendChild(logoutItem);
}
