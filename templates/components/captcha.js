var reCAPTCHA_site_key = document.getElementById("captcha-script").getAttribute('data-reCAPTCHA-site-key');

grecaptcha.ready(function() {
    grecaptcha.execute(reCAPTCHA_site_key, {action: 'submit'}).then(function(token) {
        console.log('SUCCESSSSSSSSSSSSSSSS')
    });
});