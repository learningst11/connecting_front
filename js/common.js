$(window).on("load", function () {
    $("body").addClass("loaded");
  });

//mobile height
let vh = 0;
window.addEventListener("DOMContentLoaded", function (event) {


  vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);

  let page = $('#input_page').val();
  
  if($('.fnb').length > 0){
      $('.fnb').load('./include/fnb.html', function(){
          if(page != ''){
              $(`.fnb a[data-value="${page}"]`).addClass('active')
          }
      })
  }

});


