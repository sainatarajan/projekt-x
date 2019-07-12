window.onload= init

function init() {
    $('#btn-submit').click(formHandler)
}

function formHandler(e) {
    e.preventDefault()
    var username= $('#username').val()
    var password= $('#password').val()

    console.log(username)
    console.log(password)
    checkUserParameters(username, password)
}

function checkUserParameters(username, password) {
    $.ajax({
        url: '/validateUser',
        type: 'post',
        data: {username, password},
        success: function (data) {
            if(data === "invalid")
                $('#response').text("Sign in attempt failed. Invalid User.")
            else
                $('#response').text("Sign in attempt successful. User Validated.")
        }
    })
}