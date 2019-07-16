window.onload= init

function init() {
    $('form').submit(formHandler)
}

function formHandler(e) {
    var email= $('#email').val()
    var password1= $('#password1').val()
    var password2= $('#password2').val()
    if(password1 === password2) {
        checkUserParameters(email, password1)
    } else {
        swal("Passwords don't match")
    }
    e.preventDefault()
}

function checkUserParameters(email, password) {
    $.ajax({
        url: '/register',
        type: 'post',
        data: {email, password},
        success: function (data) {
            if(data === "exists") {
                swal("User already registered")
            }
        }
    })
}