window.onload= init

function init() {
    setInterval(loadStateFromDatabase, 1500)
}

function loadStateFromDatabase() {
    $.ajax({
        url: '/userState',
        type: 'post',
        data: {userID},
        success: (data) => {
            loadGUIState(data)
        }
    })
}

function loadGUIState(data) {
    $(".main-div").remove()
    for(var i= 0; i<data.length; i++) {
        var deviceID= data[i].device_id.replace(/:/g, "")
        var deviceName= data[i].device_name
        var pinValues= data[i].device_pin_values
        $(".device-row").append("<div class=\"col-md-12 main-div\"><div class=\"tile appliance-tile\"><div class=\"tile-title-w-btn\"><b>Device Name: "+deviceName+"</b><b>Device ID: "+deviceID+"</b><br><br><p><button class=\"btn btn-primary icon-btn btn-device-on\"><i class=\"fa fa-toggle-on\"></i>Switch On All</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button class=\"btn btn-secondary icon-btn btn-device-off\"><i class=\"fa fa-toggle-off\"></i>Switch Off All</button></p></div><div class=\"row "+deviceID+"\"></div></div></div>")
        for(var j= 0; j<pinValues.length; j++) {
            if(pinValues[j] == "0")
                $("."+deviceID).append("<div class=\"col-md-3\"><b>Relay "+(j+1)+"</b><br><br><div class=\"toggle-flip\"><label><input type=\"checkbox\" class= \""+(deviceID + j)+"\"><span class=\"flip-indecator\" data-toggle-on=\"ON\"data-toggle-off=\"OFF\"></span></label></div></div></div>")
            else if(pinValues[j] == "1") {
                $("."+deviceID).append("<div class=\"col-md-3\"><b>Relay "+(j+1)+"</b><br><br><div class=\"toggle-flip\"><label><input type=\"checkbox\" class= \""+(deviceID + j)+"\"><span class=\"flip-indecator\" data-toggle-on=\"ON\"data-toggle-off=\"OFF\"></span></label></div></div></div>")
                $("."+deviceID+j).click()
            }
        }
    }
    addEventListeners(data)
}

function addEventListeners(data) {
    $('.btn-device-on').click(function() {
        var deviceID= $(this).parent().prev().prev().prev().text().slice(-12)
        changeDeviceState(userID, deviceID, "1111")
    })
    
    $('.btn-device-off').click(function () {
        var deviceID= $(this).parent().prev().prev().prev().text().slice(-12)
        changeDeviceState(userID, deviceID, "0000")
    })

    $('.flip-indecator').click(function () {
        var clas= $(this).prev().attr('class')
        var relayPin= clas.slice(-1)
        var deviceID= clas.slice(0, -1)
        var value= $(this).prev().prop("checked")? 0:1

        $.ajax({
            url: '/deviceState',
            type: 'post',
            data: {deviceID},
            success: (data) => {
                data= data.toString()
                data= data.split('')
                data[relayPin]= value
                data= data.join('')
                changeDeviceState(userID, deviceID, data)
            }
        })

    })
}

function changeDeviceState(userID, deviceID, values) {
    $.ajax({
        url: '/changeDeviceState',
        type: 'post',
        data: {userID, deviceID, values}
    })
}