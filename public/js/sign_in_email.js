document.addEventListener('DOMContentLoaded', function () {

    let accessToken = sessionStorage.getItem('access_token');

    if (accessToken) {
      location.href = '/views/home.html';
    }

    var togglePassword01 = document.querySelector('.toggle_pw01');
    togglePassword01.addEventListener('click', function () {
        var passwordInput01 = document.getElementById('password01');
        var type = passwordInput01.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput01.setAttribute('type', type);
        this.src = type === 'text' ? '/public/img/signup/eye_purple.svg' : '/public/img/signup/eye_gray.svg';
    });

});

function validateForm() {
    var email = document.getElementById('id').value;
    var password = document.getElementById('password01').value;

    if (email === '' || password === '') {
        Swal.fire({
            html: '이메일 주소 및 비밀번호를<br> 다시 확인해주세요.'
        });
        return false;
    }
    return true;
}

async function loginUser() {

    const email = document.getElementById('id').value;
    const password = document.getElementById('password01').value;

    try {
        const response = await fetch('http://43.201.79.49/users/authorize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();
        console.log(data);

        if (data.code === 200) {

            sessionStorage.setItem('access_token', data.data.access_token);
            sessionStorage.setItem('refresh_token', data.data.refresh_token);
            sessionStorage.setItem('user_id', data.data.userId);
            alert('로그인되었습니다.');

            if(sessionStorage.getItem('from') === 'mypage'){              
            location.href = '/views/mypage.html';
            return;
            }else if(sessionStorage.getItem('from') === 'list_like'){
            location.href = '/views/list_like.html';
            return;
            }

            location.href='/views/home.html';

            } else {
                console.error('Login failed:', data.message);
            }
        } catch (error) {
            Swal.fire({
                html: '이메일 주소 및 비밀번호를<br> 다시 확인해주세요.'
            }); 
        }

  }
