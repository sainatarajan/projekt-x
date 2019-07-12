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
                swal("Action activated")
            else
                swal("Error in activating bulb")
        }
    })
    // console.log('Trying to getswitchvalue')
    // $.post({
    //     url: '/getswitchvalue',
    //     data: {name: username},
    //     success: function (data) {
    //         if(data === "0")
    //             swal(data)
    //         else
    //             swal("Error in activating bulb "+data)
    //     }
    // })
}