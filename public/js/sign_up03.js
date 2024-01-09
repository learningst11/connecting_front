document.addEventListener('DOMContentLoaded', function () {

  var loginMethod = sessionStorage.getItem('loginMethod');
  var phoneNumber = sessionStorage.getItem('phoneNumber');
  var terms = sessionStorage.getItem('terms');
  var sessionEmail = sessionStorage.getItem('email');

  if (!terms) {
    location.href = "/views/sign_up01.html"
  }

  if (loginMethod === 'social') {
    document.getElementById('id').value=sessionEmail;
    document.getElementById('id').setAttribute('readonly', true);
  }
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

  $('#btnSignUp').on('click', async function () {

    if (!await validateForm()) {
      return;
    }

    var email = $('#id').val();

    var signUpData = {
      email: email,
      terms: true
    };

    if (loginMethod === 'social') {
      var snsPlatform = sessionStorage.getItem('sns_platform');
      signUpData.snsPlatform = snsPlatform;
      document.getElementById('id').value = sessionEmail;
    }else if (loginMethod === 'standard') {
      var password = $('#password01').val();
      signUpData.password = password;
      signUpData.mobile = phoneNumber;
    }

    const url = loginMethod === 'social' ? `http://43.201.79.49/users?social=${snsPlatform}` : "http://43.201.79.49/users";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(signUpData)
      });

      const data = await response.json();

      if (data.code === 200) {

        alert('회원가입이 완료되었습니다.');
        sessionStorage.removeItem('phoneNumber');
        sessionStorage.removeItem('loginMethod');
        sessionStorage.removeItem('terms');
        window.location.href = '/views/sign_in.html';
      } else {
        Swal.fire({
          html: '회원가입에 실패하였습니다.'
        }).then(function (result) {
          sessionStorage.removeItem('phoneNumber');
          sessionStorage.removeItem('loginMethod');
          sessionStorage.removeItem('terms');
          window.location.href = '/views/sign_up01.html';
        });
      }
    } catch (error) {
      console.error('서버 오류:', error);
      Swal.fire({
        html: '서비스에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'
      });
    }
  });
});

async function validateForm() {

  var email = document.getElementById('id').value;
  var password = document.getElementById('password01').value;
  var confirmPassword = document.getElementById('password02').value;

  if (email === '' || password === '' || confirmPassword === '') {
    Swal.fire({
      html: '이메일 주소 및 비밀번호를<br> 다시 확인해주세요.'
    });
    return false;
  }

  function isValidEmail(email) {
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
  }

  if (!isValidEmail(email)) {
    Swal.fire({
      html: '유효하지 않은 이메일 주소입니다.'
    });
    return false;
  }

  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
  if (!passwordPattern.test(password)) {
    Swal.fire({
      html: '비밀번호는 영문, 숫자, 특수문자를 포함하여<br> 8~15자리여야 합니다.'
    });
    return false;
  }

  if (password !== confirmPassword) {
    Swal.fire({
      html: '비밀번호가 일치하지 않습니다.'
    });
    return false;
  }

  try {
    const isValid = await checkEmailDuplicate(email);
    if (!isValid) {
      Swal.fire({
        html: '이 이메일은 이미 사용 중입니다.'
      });
      return false;
    }
  } catch (error) {
    console.error('서버 오류:', error);
    Swal.fire({
      html: '이메일 확인 중 문제가 발생했습니다.'
    });
    return false;
  }

  return true;
}

async function checkEmailDuplicate(email) {
  const url = "http://43.201.79.49/users/email/" + encodeURIComponent(email);

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  };

  try {
    const response = await fetch(url, requestOptions);
    const data = await response.json();

    if (data.code === 200 && data.data.result === "ENABLE") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('서버 오류:', error);
    Swal.fire({
      html: '이메일 확인 중 문제가 발생했습니다.'
    });
    return false;
  }
}