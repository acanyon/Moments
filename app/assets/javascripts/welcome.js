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
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})$/;
    return emailReg.test( email );
}

function validateZip(zipcode) {
    var zipReg = /^(\d{5})?$/;
    return zipReg.test( zipcode );
}
