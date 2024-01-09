// 결제 방식 선택
let selectedPaymentMethod;
const reservationData = JSON.parse(sessionStorage.getItem('reservationData'));
document.addEventListener('DOMContentLoaded', async function () {

    document.querySelectorAll('.wrap_item .item').forEach(function (item) {
        item.addEventListener('click', function () {
            // 이전에 선택된 결제 방식의 테두리 해제
            document.querySelectorAll('.wrap_item .item').forEach(function (otherItem) {
                otherItem.classList.remove('selected');
                otherItem.style.border = 'none';
            });
    
            // 새로운 결제 방식 선택 및 테두리 추가
            item.classList.add('selected');
            item.style.border = '2px solid #6E4DDC'; 
    
            selectedPaymentMethod = item.classList.contains('kakaopay') ? 'kakaopay' : 'tosspayments';
        });
    });
    

    document.querySelector('.btn_action').addEventListener('click', async function () {
        if (!selectedPaymentMethod) {
            alert('결제 방식을 선택해주세요.');
            return;
        }

        processPayment(selectedPaymentMethod, reservationData);

    
    });

});

async function processPayment(method, reservationData) {
    if (method === 'kakaopay') {
        return await processKakaoPay(reservationData);
    }

    return false;
}

async function processKakaoPay(reservationData) {
    var IMP = window.IMP;
    IMP.init("imp23788233");

    var today = new Date();   
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds(); 
    var milliseconds = today.getMilliseconds();
    var makeMerchantUid = hours +  minutes + seconds + milliseconds;

    IMP.request_pay({
        pg: 'kakaopay',
        pay_method: "card",
        merchant_uid: "IMP"+makeMerchantUid,
        name: "당근 10kg",
        amount: 1004,
        buyer_email: "Iamport@chai.finance",
        buyer_name: "포트원 기술지원팀",
        buyer_tel: "010-1234-5678",
        buyer_addr: "서울특별시 강남구 삼성동",
        buyer_postcode: "123-456",
        m_redirect_url:"/views/pay.html",
    }, function (rsp) {
        if (rsp.success) {
            // 결제 성공 시 로직
            // 서버에 결제 성공 정보를 전송할 수도 있습니다.
            console.log(rsp);
        } else {
            // 결제 실패 시 로직
            console.log(rsp);
        }
    });
}