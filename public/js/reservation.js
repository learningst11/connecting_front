
const queryParams = new URLSearchParams(window.location.search);
const expertId = queryParams.get("id");
const userId = sessionStorage.getItem('user_id');

document.addEventListener('DOMContentLoaded', async function () {
    try {
        const reservationTypes = await fetchExpertsReservationType();
        setupReservationTypes(reservationTypes);
        updateAmount();
    } catch (error) {
        console.error('예약 타입을 불러오는데 실패했습니다:', error);
    }

    document.getElementById('plus-btn').addEventListener('click', function () {
        var quantityInput = document.getElementById('quantity');
        if (quantityInput.value < 8) {
            quantityInput.stepUp();
            updateAmount();
        }
    });

    document.getElementById('minus-btn').addEventListener('click', function () {
        var quantityInput = document.getElementById('quantity');
        if (quantityInput.value > 2) {
            quantityInput.stepDown();
            updateAmount();
        }
    });

    document.querySelectorAll('input[name="type"]').forEach(function (option) {
        option.addEventListener('change', function () {
            updateAmount();
        });
    });

    updateCouponUI(expertId, userId);

    $('#datepicker').datepicker({
        dateFormat: 'yy-mm-dd'
        , showOtherMonths: true
        , showMonthAfterYear: true
        , changeYear: true
        , changeMonth: true
        , showOn: "both"
        , buttonImage: "http://jqueryui.com/resources/demos/datepicker/images/calendar.gif"
        , buttonImageOnly: true
        , buttonText: "선택"
        , yearSuffix: "년"
        , monthNamesShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
        , monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
        , dayNamesMin: ['일', '월', '화', '수', '목', '금', '토']
        , dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
        , minDate: "-5Y"
        , maxDate: "+5y",
        onSelect: function (dateText, inst) {
            fetchSelectedDate(dateText);
        },
        prevText: "이전",
        nextText: "다음",
    });

    var activeTimeSelected;
    $(".time_selected").click(function () {
        $(".time_selected").removeClass("active");
        $(this).addClass("active");
        activeTimeSelected = $(this);
        $("#myModal").show();
    });

    $(document).on("click", ".time_select", function () {
        var selectedTime = $(this).text();
        var selectedTimeId = $(this).attr('data-time-id');

        if (activeTimeSelected) {
            activeTimeSelected.text(selectedTime);
            activeTimeSelected.attr('data-time-id', selectedTimeId);
        }
        $("#myModal").hide();
    });

    $(window).on("click", function (event) {
        if ($(event.target).is("#myModal")) {
            $("#myModal").hide();
        }
    });
});

async function fetchExpertsReservationType() {
    try {
        const url = `http://43.201.79.49/mds/reservation/type`;
        console.log(url);
        const response = await fetch(url, { method: "GET" });

        if (!response.ok) {
            throw new Error(`Network response was not ok (${response.status})`);
        }

        const result = await response.json();
        console.log(result.data);
        return result.data;
    } catch (error) {
        console.error("데이터 가져오기 오류:", error);
    }

}

function setupReservationTypes(types) {
    types.forEach(function (type) {
        var option;
        if (type.main_type === "1") {
            option = document.getElementById('option1');
            document.getElementById('quantity').value = 2;
            option.checked = true;
        } else if (type.main_type === "2") {
            option = document.getElementById('option2');
        }

        if (option) {
            option.dataset.amount = type.amount;
            option.dataset.mainType = type.main_type;
            option.dataset.subType = type.sub_type;
        }
    });
}

function updateAmount() {
    var selectedOption = document.querySelector('input[name="type"]:checked');
    var baseAmount = parseInt(selectedOption.dataset.amount);

    var quantityInput = document.getElementById('quantity');
    var plusBtn = document.getElementById('plus-btn');
    var minusBtn = document.getElementById('minus-btn');

    if (selectedOption.dataset.mainType === "1") {
        quantityInput.disabled = false;
        plusBtn.disabled = false;
        minusBtn.disabled = false;

        var quantity = parseInt(quantityInput.value);
        var amount = baseAmount * quantity;
    } else {
        quantityInput.disabled = true;
        plusBtn.disabled = true;
        minusBtn.disabled = true;

        var amount = baseAmount;
    }

    document.getElementById('amount').textContent = amount.toLocaleString() + ' 원';
}



async function updateCouponUI(expertId, userId) {
    await fetchCouponInfo(expertId, userId);

    const couponUseCheckbox = document.querySelector('#couponUse');
    if (couponUseCheckbox) {
        couponUseCheckbox.addEventListener('change', async function () {
            await fetchCouponInfo(expertId, userId);
        });
    }
}

async function fetchCouponInfo(expertId, userId) {
    try {
        const url = `http://43.201.79.49/mds/${expertId}/users/${userId}/coupons`;
        const response = await sendApiRequest(url, { method: 'GET' });

        if (response.code === 200 && response.data) {
            console.log(response.data);
            displayCoupon(response.data);
        } else {
            displayCoupon(null);
        }
    } catch (error) {
        console.error('쿠폰 정보 가져오기 오류:', error);
        displayCoupon(null);
    }
}

function displayCoupon(couponData) {
    const wrapCoupon = document.querySelector('.wrap_coupon');
    wrapCoupon.innerHTML = '';

    if (couponData) {

        const startDate = new Date(couponData.startDate);
        const endDate = new Date(couponData.expiredDate);
        const today = new Date();

        const formatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const formattedStartDate = startDate.toLocaleDateString('ko-KR', formatOptions).replace(/\. /g, '.');
        const formattedEndDate = endDate.toLocaleDateString('ko-KR', formatOptions).replace(/\. /g, '.');

        const remainingDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

        const couponHTML = `
            <label>
                <input type="checkbox" id="couponUse"> 쿠폰 사용하기
            </label>
            <div class="coupon">
                <img src="/public/img/common/coupon_free.svg" alt="coupon">
                <div>
                    <p>${couponData.couponName}</p>
                    <p>D - ${remainingDays}</p>
                    <p><span>${remainingDays}일 남음</span> ${formattedStartDate} ~ ${formattedEndDate}</p>
                </div>
            </div>
            <p class="coupon_free">무료쿠폰을 신청하고 싶으시다면? <a>쿠폰신청하기</a></p>
        `;
        wrapCoupon.innerHTML = couponHTML;

        const couponUseCheckbox = wrapCoupon.querySelector('#couponUse');
        if (couponUseCheckbox) {
            couponUseCheckbox.addEventListener('change', function () {
                var coupon = wrapCoupon.querySelector('.coupon');

                if (coupon.style.borderColor === 'rgb(197, 184, 241)') {
                    coupon.style.borderColor = '';
                } else {
                    coupon.style.borderColor = '#C5B8F1';
                }

                var img = coupon.querySelector('img');
                if (img) {
                    if (img.src.includes('coupon_free.svg')) {
                        img.src = '/public/img/common/coupon_active.svg';
                    } else {
                        img.src = '/public/img/common/coupon_free.svg';
                    }
                }

                var span = coupon.querySelector('p:nth-of-type(3) span');
                if (span) {
                    if (span.style.color === 'rgb(139, 113, 227)') {
                        span.style.color = '';
                    } else {
                        span.style.color = '#8B71E3';
                    }
                }
            });
        }
    } else {
        wrapCoupon.innerHTML = '<p class="coupon_free">무료쿠폰을 신청하고 싶으시다면? <a>쿠폰신청하기</a></p>';
    }
}

async function fetchSelectedDate(selectedDate) {
    try {
        const url = `http://43.201.79.49/mds/${expertId}/date/${selectedDate}`;
        console.log(url);
        const response = await fetch(url, { method: "GET" });

        if (!response.ok) {
            throw new Error(`Network response was not ok (${response.status})`);
        }

        const result = await response.json();
        displayTimeSlots(result.data);
        console.log(result.data);
    } catch (error) {
        console.error("데이터 가져오기 오류:", error);
    }
}

function displayTimeSlots(data) {
    $('.wrap_time_select').empty();
    data.forEach(item => {
        let utcDate = new Date(item.date_time);
        let kstDate = new Date(utcDate.getTime() - (9 * 60 * 60000));

        let startHours = kstDate.getHours();
        let startAmPm = startHours >= 12 ? '오후' : '오전';
        startHours = startHours % 12;
        startHours = startHours || 12;
        let startMinutes = kstDate.getMinutes().toString().padStart(2, '0');

        kstDate.setMinutes(kstDate.getMinutes() + 60);
        let endHours = kstDate.getHours();
        let endAmPm = endHours >= 12 ? '오후' : '오전';
        endHours = endHours % 12;
        endHours = endHours || 12;
        let endMinutes = kstDate.getMinutes().toString().padStart(2, '0');

        let timeRangeStr = `${startAmPm} ${startHours}:${startMinutes} ~ ${endAmPm} ${endHours}:${endMinutes}`;

        $('.wrap_time_select').append(`<div class="time_select" data-time-id="${item.id}">${timeRangeStr}</div>`);
    });
}


document.addEventListener('DOMContentLoaded', async function () {

    document.querySelector('.wrap_bottom button').addEventListener('click', async function () {
        const mainType = document.querySelector('input[name="type"]:checked')?.dataset.mainType;
        const subType = document.querySelector('input[name="type"]:checked')?.dataset.subType;
        const messageCount = document.getElementById('quantity').value;
        const consultingTitle = document.querySelector('.bottom input[type="text"]').value;
        const consultingContent = document.querySelector('.bottom textarea').value;
        const dateTimeIds = collectDateTimeIds();

        if (!dateTimeIds.length) {
            alert('날짜와 시간을 선택해주세요.');
            return;
        }
        if (!consultingTitle.trim()) {
            alert('상담 제목을 입력해주세요.');
            return;
        }
        if (!consultingContent.trim()) {
            alert('상담 내용을 입력해주세요.');
            return;
        }

        const reservationData = {
            main_type: mainType,
            sub_type: subType,
            message_count: messageCount,
            date_time_id: dateTimeIds,
            consulting_title: consultingTitle,
            consulting_content: consultingContent
        };

        sessionStorage.setItem('reservationData', JSON.stringify(reservationData));

        window.location.href = '/views/pay.html';
    });


});

function collectDateTimeIds() {
    var selectedTimes = document.querySelectorAll('.time_selected.active');
    var dateTimeIds = Array.from(selectedTimes).map(function (timeElement) {
        return timeElement.getAttribute('data-time-id');
    });
    return dateTimeIds;
}







