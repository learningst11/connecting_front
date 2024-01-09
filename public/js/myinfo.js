window.addEventListener('DOMContentLoaded', function() {

    fetchAndRenderUserInfo();

    var changeButton = document.querySelector('.btn_change01');
    var nicknameInput = document.getElementById('nickname');

    changeButton.addEventListener('click', async function() {
        if (nicknameInput.hasAttribute('readonly')) {

            nicknameInput.removeAttribute('readonly');
            nicknameInput.focus();
            changeButton.textContent = '확인';

        } else {

            var newNickname = nicknameInput.value;
            try {
                await updateNickname(newNickname);
                alert('닉네임이 성공적으로 변경되었습니다.');
                nicknameInput.setAttribute('readonly', true);
                changeButton.textContent = '변경';
            } catch (error) {
                console.error('닉네임 변경 중 오류 발생:', error);
                alert('닉네임 변경 중 오류가 발생했습니다.');
            }
        }
    });

    document.querySelector('.btn_change02').addEventListener('click', function() {
        var phone = document.getElementById('phone').value; 
        
        if (phone) {
            sessionStorage.setItem('mobileNumber', phone); 
            sessionStorage.setItem('action', 'changemobile'); 
            location.href = "/views/verify_mobile.html"; 
        } else {
            alert('휴대폰 번호를 입력해주세요.'); 
        }
    });

    document.getElementById('phone').addEventListener('keyup', function() {
        var numericValue = this.value.replace(/[^0-9]/g, '');
        var formattedValue = numericValue.replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, "$1-$2-$3");
        formattedValue = formattedValue.replace("--", "-");
        this.value = formattedValue;
    });
});

async function updateNickname(newNickname) {
    const userId = sessionStorage.getItem('user_id');
    if (!userId) {
        console.error('User ID not found');
        return;
    }

    try {
        const data = await sendApiRequest(`http://43.201.79.49/users/${userId}/nickname`, {
            method: 'PATCH',
            body: JSON.stringify({ nickname: newNickname })
        });

        if (data.code !== 200) {
            throw new Error(data.message || 'Error updating nickname');
        }

        console.log('Nickname updated:', data);
    } catch (error) {
        console.error('Error updating nickname:', error);
    }
}


async function fetchAndRenderUserInfo() {
    const userId = sessionStorage.getItem('user_id');
    if (!userId) {
        console.error('User ID not found');
        return;
    }

    try {
        const data = await sendApiRequest(`http://43.201.79.49/users/${userId}`, { method: 'GET' });

        console.log('User Info:', data);
        document.querySelector('.middle p span').textContent = data.data.nickname;
        document.getElementById('nickname').value = data.data.nickname;

        if(sessionStorage.getItem('loginMethod' === 'social')){
            document.querySelector('.pg_myinfo main .bottom .wrap_label label:nth-of-type(2)').style.display = 'none';
        }else{
            document.getElementById('phone').value = data.data.mobile;
        }

        document.querySelector('input[placeholder="abc@naver.com"]').value = data.data.email;

    } catch (error) {
        console.error('Error fetching user info:', error);
    }
}
