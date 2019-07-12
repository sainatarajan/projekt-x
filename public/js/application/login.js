window.onload= init

function init() {
    $('form').submit(formHandler)
}

function formHandler(e) {
    var username= $('#username').val()
    var password= $('#password').val()

    console.log(username)
    console.log(password)
    checkUserParameters(username, password)
    e.preventDefault()
}

function checkUserParameters(username, password) {
    $.ajax({
        url: '/validateUser',
        type: 'post',
        data: {username, password},
        success: function (data) {
            if(data === "invalid") {
                $('form').unbind('submit');
                $('form').submit()
            }
            else
                swal("Sign in attempt successful. User Validated.")
        }
    })
}