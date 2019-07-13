window.onload= init

function init() {
    $('#btn-switch').click(activate)
}

function activate() {
    var username= $('#username').text()
    $.ajax({
        url: '/activate',
        type: 'post',
        data: {username},
        success: function (data) {
            if(data === "activated")
                console.log("Action activated")
            else
                console.log("Error in activating bulb")
        }
    })
}