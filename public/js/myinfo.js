window.addEventListener('DOMContentLoaded', function(){

    fetchUserInfo();
    
    fetchRecommendationUser();

    // document.querySelector('.btn_change01').addEventListener('click', function(){
                
    //     var nickname = document.getElementById('nickname');
    //     nickname.removeAttribute('readonly');
    //     nickname.focus();

    // });
    
    // document.querySelector('.btn_change02').addEventListener('click', function(){

    //     location.href = "/views/myinfo_change_mobile.html"
        
    // });

    // phone
    // document.getElementById('phone').addEventListener('keyup', function() {
    //     var numericValue = this.value.replace(/[^0-9]/g, '');
    //     var formattedValue = numericValue.replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, "$1-$2-$3");
    //     formattedValue = formattedValue.replace("--", "-");
    //     this.value = formattedValue;
    // });

});

// async function fetchUserInfo() {
//     const userId = 'test123@test123.com'

//     if (!userId) {
//         console.error('User ID not found');
//         return;
//     }

//     const accessToken = sessionStorage.getItem('access_token');
//     try {
//         const response = await fetch(`http://43.201.79.49/users/${userId}`, {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${accessToken}`
//             }
//         });

//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }

//         const data = await response.json();
//         console.log('User Info:', data);

//     } catch (error) {
//         console.error('Error fetching user info:', error);
//     }
// }

// async function fetchRecommendationUser(){
//     const accessToken = sessionStorage.getItem('access_token');
//     try {
//         const response = await fetch(`http://43.201.79.49/recommendation/md`, {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${accessToken}`
//             }
//         });

//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }

//         const data = await response.json();
//         console.log('User Info:', data);

//     } catch (error) {
//         console.error('Error fetching user info:', error);
//     }


// }
