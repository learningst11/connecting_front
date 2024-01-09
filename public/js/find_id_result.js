document.addEventListener('DOMContentLoaded', function () {
    var foundEmail = sessionStorage.getItem('foundEmail');
    var middleP = document.querySelector('.middle p');
    var resetPasswordButton = document.querySelector('.bottom button:first-of-type');
    var loginButton = document.querySelector('.bottom .btn_action');
    
    if (!foundEmail) {
        middleP.textContent = "아이디를 찾을 수 없습니다. 회원가입을 진행해주세요!";
        resetPasswordButton.style.display = 'none';
        loginButton.textContent = '회원가입';
        loginButton.setAttribute('onclick', "location.href='/views/sign_up01.html'");
    } else {
        document.querySelector('.id_found').textContent = foundEmail;
        resetPasswordButton.setAttribute('onclick', "location.href='/views/find_pw_new.html'");
    }
});