$(function () {
    
    setTimeout(function () {
        $("#intro").fadeOut('slow');
        
        setTimeout(function () {
            $(".slider").fadeIn("slow");
            $(".btn_action").fadeIn("slow").css('position', 'absolute');
            
            $('.btn_action').text('다음');

            var slider = $('.slider').slick({
                dots: true,
                infinite: false,
                speed:200
            });

            $('.btn_action').click(function () {
                var currentSlide = slider.slick('slickCurrentSlide');
                
                if (currentSlide < slider.slick('getSlick').slideCount - 1) {
                    slider.slick('slickNext');
                }

                if (currentSlide === 0) {
                    $(this).text('시작하기');
                } 

                if ($(this).text() === '시작하기' && currentSlide === slider.slick('getSlick').slideCount - 1) {
                    window.location.href = '/views/home.html'; 
                }
            });

            slider.on('afterChange', function(event, slick, currentSlide) {
                if (currentSlide === slick.$slides.length - 1) {
                    $('.btn_action').text('시작하기');
                } else {
                    $('.btn_action').text('다음');
                }
            });

        }, 1000);

    }, 3000);
});
