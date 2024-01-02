document.addEventListener('DOMContentLoaded', function () {

    const action = sessionStorage.getItem('action');

    if (!action) {
        location.href = "/views/index.html";
    }

    var chkAll = document.getElementById('chkAll');
    window.addEventListener('pageshow', function () {
        if (chkAll.checked) {
            chkAll.checked = false;
        }
    });

    // chk
    var chkAll = document.getElementById('chkAll');
    var labelForChkAll = document.querySelector('label[for="chkAll"]');

    chkAll.addEventListener('change', function () {
        labelForChkAll.style.backgroundColor = chkAll.checked ? '#8B71E3' : '';
    });

    sessionStorage.removeItem('phoneNumber');
    sessionStorage.removeItem('signupMethod');
    sessionStorage.removeItem('terms');

    // phone
    if (action === 'changemobile') {
        var storedPhoneNumber = sessionStorage.getItem('phoneNumber');
        if (storedPhoneNumber) {
            document.getElementById('phone').value = storedPhoneNumber;
        }
    }
    document.getElementById('phone').addEventListener('keyup', function () {
        var numericValue = this.value.replace(/[^0-9]/g, '');
        var formattedValue = numericValue.replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, "$1-$2-$3");
        formattedValue = formattedValue.replace("--", "-");
        this.value = formattedValue;
    });


    // ask verification
    document.querySelector('.btn_ask').addEventListener('click', async function () {
        try {
            var phoneNumber = document.getElementById('phone').value.trim();
            var chkAll = document.getElementById('chkAll');
            var action = sessionStorage.getItem('action');
    
            if (phoneNumber === '') {
                throw new Error('휴대폰 번호를 입력해주세요.');
            }
    
            if (!chkAll.checked) {
                throw new Error('휴대폰 인증 이용약관에 동의해주세요.');
            }
    
            if (action === 'signup' || action === 'changemobile') {
                const checkResponse = await fetch(`http://43.201.79.49/users/mobile/${phoneNumber}`, {
                    method: 'GET'
                });
                const checkData = await checkResponse.json();
    
                if (checkData.code !== 200 || checkData.data.result !== "ENABLE") {
                    throw new Error('휴대폰 번호가 이미 사용 중입니다.');
                }
            }
    
            // 휴대폰 인증 요청
            const authResponse = await fetch('http://43.201.79.49/users/mobile/authenticate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ to: phoneNumber })
            });
            const authData = await authResponse.json();
    
            if (authData.code === 200) {
                alert('인증 코드가 전송되었습니다. 문자 메시지를 확인해주세요.');
                document.querySelector('label[title="인증 번호"]').classList.add('active');
            } else {
                throw new Error('인증 코드 전송에 실패했습니다.');
            }
        } catch (error) {
            console.error('에러 발생:', error.message);
            alert(error.message);
        }
    });
    

    document.querySelector('.btn_action').addEventListener('click', async function () {
        try {
            var phoneNumber = document.getElementById('phone').value.trim();
            var verificationCode = document.getElementById('numberInput').value.trim();

            if (verificationCode === '') {
                throw new Error('인증번호를 입력해주세요.');
            }

            const response = await fetch('http://43.201.79.49/users/mobile/verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ mobile: phoneNumber, code: verificationCode })
            });
            const data = await response.json();

            if (data.code === 200 && data.data === 'SUCCESS') {

                Swal.fire({
                    html: ' 휴대폰 인증이<br>완료되었습니다.'
                }).then(async function (result) {
                    if (result.isConfirmed) {

                        document.getElementById('phone').value = '';
                        document.getElementById('numberInput').value = '';

                        if (action === 'signup') {
                            window.location.href = '/views/sign_up02.html';
                            sessionStorage.setItem('phoneNumber', phoneNumber);
                            sessionStorage.setItem('signupMethod', 'standard');
                        } else if (action === 'findid') {
                            try {
                                const response = await fetch(`http://43.201.79.49/users/id/${phoneNumber}`, {
                                    method: 'GET'
                                });
                                const data = await response.json();
                        
                                if (data.code === 200) {
                                    sessionStorage.setItem('foundEmail', data.data.email);
                                    window.location.href = '/views/find_id_result.html';
                                } else {
                                    sessionStorage.removeItem('foundEmail');
                                    throw new Error(data.message || 'ID 찾기 실패');
                                }
                            } catch (error) {
                                console.error('에러 발생:', error.message);
                                alert(error.message);
                            }
                        } else if (action === 'findpw') {
                            window.location.href = '/views/find_pw_new.html';
                        } else if (action === 'changemobile') {
                            try {
                                const response = await fetch('http://43.201.79.49/users/mobile', {
                                    method: 'PATCH',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')
                                    },
                                    body: JSON.stringify({ mobile: phoneNumber })
                                });
                                const data = await response.json();

                                if (data.code === 200) {
                                    window.location.href = '/views/myinfo.html';
                                } else {
                                    throw new Error(data.message || '휴대폰 번호 변경 실패');
                                }
                            } catch (error) {
                                console.error('에러 발생:', error.message);
                                alert(error.message);
                            }
                        }


                    };
                });

            } else {
                throw new Error('인증번호가 올바르지 않습니다.');
            }
        } catch (error) {
            console.error('에러 발생:', error.message);
            alert(error.message);
        }
    });

});
