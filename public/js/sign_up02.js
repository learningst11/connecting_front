document.addEventListener('DOMContentLoaded', function () {
  
    var action = sessionStorage.getItem('action');

    if(!action){
        location.href="/views/sign_up01.html"
    }

    var chkAll = document.getElementById('chkAll');

    var labelForChkAll = document.querySelector('label[for="chkAll"]');

    var updateCheckboxes = function (checked) {
      var checkboxes = document.querySelectorAll('.wrap_label .label input[type="checkbox"]');
      checkboxes.forEach(function (checkbox) {
        checkbox.checked = checked;
      });
      labelForChkAll.style.backgroundColor = checked ? '#8B71E3' : '';
    };

    chkAll.addEventListener('change', function () {
      updateCheckboxes(chkAll.checked);
    });

    var otherCheckboxes = document.querySelectorAll('.wrap_label .label input[type="checkbox"]:not(#chkAll)');

    otherCheckboxes.forEach(function (checkbox) {
      checkbox.addEventListener('change', function () {
        var allChecked = Array.from(otherCheckboxes).every(c => c.checked);
        chkAll.checked = allChecked;
        labelForChkAll.style.backgroundColor = allChecked ? '#8B71E3' : '';
      });
    });

    function areRequiredCheckboxesChecked() {
      var requiredCheckboxes = document.querySelectorAll('.wrap_label .label:not(:first-child):not(:last-child) input[type="checkbox"]');
      return Array.from(requiredCheckboxes).every(checkbox => checkbox.checked);
    }

    document.getElementById('btnNext').addEventListener('click', function() {
      if (areRequiredCheckboxesChecked()) {
          sessionStorage.setItem('terms', true);
          window.location.href = '/views/sign_up03.html'; 
      } else {
          Swal.fire({
              text: '모든 필수 항목을 체크해주세요.',
          });
      }
  });;

});