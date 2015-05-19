$(function () {
    var $body = $('body');

    /** Control initiation **/
    $body.addClass('ready');
    $body.find('form .email_input').focus();

    $(window).on('scroll', function (event) {
        var $header = $($body.find('.panel.header'));
        if ($body.scrollTop() > 200) {
            $header.addClass('sticky');
        } else {
            $header.removeClass('sticky');
        }
    });


    /** Carousel functions **/
    var $hero_panels = $body.find('.hero_panels');
    var CAROUSEL_TIMEOUT = 4000; // ms
    var child_index = 0;
    function set_carousel_timeout (time) {
        window.setTimeout(function () {
            $hero_panels.addClass('animate');
            child_index = child_index + 1;
            // var panel_width = $($hero_panels.children()[0]).width();
            var new_left = -1 * $($hero_panels.children()[child_index]).position().left;
            $hero_panels.css('left', new_left + 'px');
            // should reset panels ?
            if (child_index + 1 >= $hero_panels.children().length) {
                window.setTimeout(function () {
                    $hero_panels.removeClass('animate');
                    var last_panel = $hero_panels.children().length - 1;
                    var $last_panel = $hero_panels.children().last();
                    _.each($hero_panels.children(), function (panel, i) {
                        var $panel = $(panel);
                        if (i !== last_panel) {
                            $panel.remove();
                            $last_panel.after($panel);
                            $last_panel = $panel;
                        }
                    });
                    $hero_panels.css('left', 0);
                    child_index = 0;
                    set_carousel_timeout(CAROUSEL_TIMEOUT/2);
                }, CAROUSEL_TIMEOUT/2);
            } else {
                set_carousel_timeout();
            }
        }, time || CAROUSEL_TIMEOUT);
    }
    set_carousel_timeout();

    /** Email form functions **/

    // validate form
    $('form input').on('blur', function (event) {
        var $target = $(event.currentTarget);
        var is_valid = false;
        if ($target.hasClass('email_input')) {
            is_valid = validateEmail($target.val()) || $target.val() === '';
        } else if ($target.hasClass('zip_input')) {
            is_valid = validateZip($target.val());
        }
        if (is_valid) {
            $target.removeClass('invalid');
        } else {
            $target.addClass('invalid');
        }
    });

    // disable/enable form submit button
    $('form input').on('keyup', function (event) {
        var $target = $(event.currentTarget);
        var $form = $($target.closest('form')[0]);
        var formValid = validateEmail($form.find('.email_input').val());
        formValid = formValid && validateZip($form.find('.zip_input').val());
        if (formValid) {
            $form.find('button').attr('disabled', null);
        } else {
            $form.find('button').attr('disabled', 'disabled');
        }
    });
});


function validateEmail(email) {
    var emailReg = /^([\w-\.+]+@([\w-]+\.)+[\w-]{2,4})$/;
    return emailReg.test( email );
}

function validateZip(zipcode) {
    var zipReg = /^(\d{5})?$/;
    return zipReg.test( zipcode );
}
