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
    $("[data-bs-toggle=popover]").popover();
    $("[data-bs-toggle=tooltip]").tooltip();
    $('.nav-toggle').click(function () {
        let collapse_content_selector = $(this).attr('href');
        // console.log(collapse_content_selector)
        let toggle_switch = $(this);
        $(collapse_content_selector).toggle(function () {
            if ($(this).css('display') == 'none' || $(this).text() == "Read More") {
                $('#con').removeattr('hidden')
                toggle_switch.html('Read More');
            } else {
                toggle_switch.html('Read Less');
                $('#con').attr('hidden',true)
            }
        });

    });
    
});
