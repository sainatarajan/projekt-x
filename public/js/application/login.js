window.onload= init

function init() {
    $('form').submit(formHandler)
}

function formHandler(e) {
    var email= $('#email').val()
    var password= $('#password').val()

    checkUserParameters(email, password)
    e.preventDefault()
}

function checkUserParameters(email, password) {
    $.ajax({
        url: '/validateUser',
        type: 'post',
        data: {email, password},
        success: function (data) {
            if(data === "invalid") {
                swal("Invalid user.")
            }
            else {
                $('form').unbind('submit');
                $('form').submit()
            }
        }
    })
}