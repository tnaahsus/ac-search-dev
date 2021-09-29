const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

function switchTheme(e) {
    var body = document.getElementsByTagName('body')[0];
    var light = $('#light-mode')
    var dark = $('#dark-mode')

    if (e.target.checked) {
        body.setAttribute('data-theme', 'dark');
        light.removeAttr('hidden')
        dark.attr('hidden', true)
        console.log(light)
    }
    else {
        body.setAttribute('data-theme', 'light');
        light.attr('hidden', true)
        dark.removeAttr('hidden')

    }

}

toggleSwitch.addEventListener('change', switchTheme, false);

$(document).ready(function () {
    $('.nav-toggle').click(function () {
        var collapse_content_selector = $(this).attr('href');
        var toggle_switch = $(this);
        $(collapse_content_selector).toggle(function () {
            if ($(this).css('display') == 'none') {
                toggle_switch.html('Read More');
                $('#read-more-dots').removeAttr('hidden')
            } else {
                toggle_switch.html('Read Less');
                 $('#read-more-dots').attr('hidden', true)
            }
        });
    });

});
var vitex_icon = $("#vitex_address_icon")
var vitex_msg = $("#msg_vitex_check_handler")
var submit_button = $("#submit_claim_button")

$("#vitex_address").on("input", function() {
    var address = $(this).val().trim();
    if (address.length === 55) {
        submit_button.prop("disabled", true);
        vitex_icon.html(
            `Checking address... <span style="display: inline-block;
            width: 3rem;
            height: 3rem;
            vertical-align: text-center;
            border: .25em solid currentColor;
            border-right-color: transparent;
            border-radius: 50%;
            -webkit-animation: spinner-border .75s linear infinite;
            animation: spinner-border .75s linear infinite;width: 1rem;
            height: 1rem;
            border-width: .2em;"
            class="spinner-border spinner-border-sm ml-3" role="status" aria-hidden="true"></span>`
       );
    }

   $.ajax({
       url: '/vitex_details_handler',
       data: {'address': address},
       type: 'GET',
       success: function(response){
           console.log(response);
           submit_button.prop("disabled", false);
           vitex_icon.html(response.icon)
           vitex_msg.text(response.msg)
       },
       error: function(error){
           console.log(error);
       }
   });


});

$(document).ready(function() {
        $("[data-bs-toggle=popover]").popover();
        $("[data-bs-toggle=tooltip]").tooltip();
    });

<!--  jQuery Validation for telegram and vitex_address inputs  -->
    function submitForm() {
        if ($("#eiou_claim").validate({
            errorPlacement: function(error, element) {
                if (element.attr("name") == "telegram" ) {
                    error.appendTo("#error_msg_telegram")
                } else  {
                    error.appendTo("#error_msg_vitex_address")
                }
            },
            rules: {
                telegram: {
                    required: true
                },
                vitex_address: {
                    minlength: 55,
                    maxlength: 56
                }
            }})) {
                $("#eiou_claim").submit()
                }
    }
    function copyToClipboard(element) {
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val($(element).text().trim()).select();
        document.execCommand("copy");
        $temp.remove();
    }