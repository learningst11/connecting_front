document.addEventListener('DOMContentLoaded', function () {

    var email = sessionStorage.getItem('foundEmail');
    if(!email){
        location.href='/views/home.html'
    }


  document.getElementById('btnConfirm').addEventListener('click', async function () {
    if (validateForm()) {
      var newPassword = document.getElementById('password01').value;

      try {
        const response = await fetch('http://43.201.79.49/users/password', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            password: newPassword
          })
        });
        const data = await response.json();

        if (data.code === 200 && data.data === 'SUCCESS') {
          Swal.fire({
            html: '비밀번호가 변경되었습니다.'
          }).then(function () {
            sessionStorage.removeItem('foundEmail');
            window.location.href = '/views/sign_in_email.html';
          });
        } else {
          throw new Error(data.message || '비밀번호 변경 실패');
        }
      } catch (error) {
        console.error('에러 발생:', error.message);
        alert(error.message);
      }
    }
  });

  var togglePassword01 = document.querySelector('.toggle_pw01');
  togglePassword01.addEventListener('click', function () {
    var passwordInput01 = document.getElementById('password01');
    var type = passwordInput01.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput01.setAttribute('type', type);
    this.src = type === 'text' ? '/public/img/signup/eye_purple.svg' : '/public/img/signup/eye_gray.svg';
  });

  var togglePassword02 = document.querySelector('.toggle_pw02');
  togglePassword02.addEventListener('click', function () {
    var passwordInput02 = document.getElementById('password02');
    var type = passwordInput02.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput02.setAttribute('type', type);
    this.src = type === 'text' ? '/public/img/signup/eye_purple.svg' : '/public/img/signup/eye_gray.svg';

  });


});

function validateForm() {
    var password = document.getElementById('password01').value;
    var confirmPassword = document.getElementById('password02').value;

    if (password === '' || confirmPassword === '') {
      Swal.fire({
        html: '모든 필드를 채워주세요.'
      });
      return false;
    }
    if (password !== confirmPassword) {
      Swal.fire({
        html: '비밀번호가 일치하지 않습니다.'
      });
      return false;
    }

    return true;
  }
