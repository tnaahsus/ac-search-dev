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

