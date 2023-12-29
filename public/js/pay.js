
const queryParams = new URLSearchParams(window.location.search);
var expertId = queryParams.get("id");

document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('amount').textContent = '8,000 원';
    document.getElementById('quantity').value = 2;


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
    
    document.getElementById('option1').addEventListener('change', function () {
        if (this.checked) {
            updateAmount();
        }
    });
    
    document.getElementById('option2').addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('amount').textContent = '17,000원';
        }
    });
        
    document.querySelector('#couponUse').addEventListener('change', function () {

        var coupon = document.querySelector('.coupon');

        if (coupon.style.borderColor === 'rgb(197, 184, 241)') {
            coupon.style.borderColor = '';
        } else {
            coupon.style.borderColor = '#C5B8F1';
        }

        var img = coupon.querySelector('img');
        if (img) {
            if (img.src.includes('coupon_active.svg')) {
                img.src = '/public/img/common/coupon_free.svg';
            } else {
                img.src = '/public/img/common/coupon_active.svg';
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
                fetchExpertsDetailsScore(dateText);
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
                if (activeTimeSelected) {
                    activeTimeSelected.text(selectedTime);
                }
                $("#myModal").hide();
            });

            $(window).on("click", function (event) {
                if ($(event.target).is("#myModal")) {
                    $("#myModal").hide();
                }
            });
    });


    function updateAmount() {
        var quantity = parseInt(document.getElementById('quantity').value);
        var amount = 8000 + (quantity - 2) * 4000;
        document.getElementById('amount').textContent = amount.toLocaleString() + '원';
    }
    
    async function fetchExpertsDetailsScore(selectedDate) {

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
    
            kstDate.setMinutes(kstDate.getMinutes() + 30);
            let endHours = kstDate.getHours();
            let endAmPm = endHours >= 12 ? '오후' : '오전';
            endHours = endHours % 12;
            endHours = endHours || 12;
            let endMinutes = kstDate.getMinutes().toString().padStart(2, '0');
    
            let timeRangeStr = `${startAmPm} ${startHours}:${startMinutes} ~ ${endAmPm} ${endHours}:${endMinutes}`;
    
            $('.wrap_time_select').append(`<div class="time_select">${timeRangeStr}</div>`);
        });
    }
    





