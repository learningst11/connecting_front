//kakao 주소찾기 api

    // 1번째 주소 입력 input 클릭 시
    function findAddr() {
        var width = 500;
        var height = 500;
        new daum.Postcode({
            width: width,
            height: height,
            oncomplete: function (data) {

                var roadAddr = data.roadAddress; 
                var jibunAddr = data.jibunAddress;

                if (roadAddr !== '') {
                    document.getElementById("member_addr").value = roadAddr;
                } else if (jibunAddr !== '') {
                    document.getElementById("member_addr").value = jibunAddr;
                }
            }
        }).open({
            left: window.screenLeft + (window.screen.width / 2) - (width / 2),
            top: window.screenTop + (window.screen.height / 2) - (height / 2)
        });
    }
