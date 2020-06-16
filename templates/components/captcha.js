var reCAPTCHA_site_key = document.getElementById("captcha-script").getAttribute('data-reCAPTCHA-site-key');

grecaptcha.ready(function() {
    grecaptcha.execute(reCAPTCHA_site_key, {action: 'submit'}).then(function(token) {
        fetch(`api/carpooling-url/${token}`)
            .then(function(response) {
                return response.text();
            })
            .then(function(carpooling_url) {
                document.getElementById("carpooling").setAttribute('href', carpooling_url);
            });
    });
});
