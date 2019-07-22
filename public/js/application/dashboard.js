window.onload= init

function init() {
    loadStateFromDatabase()
}

function loadStateFromDatabase() {
    $.ajax({
        url: '/userState',
        type: 'post',
        data: {userID},
        success: function (data) {
            loadGUIState(data)
        }
    })
}

function loadGUIState(data) {
    for(var i= 0; i<data.length; i++) {
        var deviceID= data[i].device_id.replace(/:/g, "")
        var deviceName= data[i].device_name
        var pinValues= data[i].device_pin_values
        $(".device-row").append("<div class=\"col-md-12\"><div class=\"tile appliance-tile\"><div class=\"tile-title-w-btn\"><b>Device Name: "+deviceName+"</b><b>Device ID: "+deviceID+"</b><br><br><p><button class=\"btn btn-primary icon-btn btn-appliance-add\"><i class=\"fa fa-toggle-on\"></i>Switch On All</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button class=\"btn btn-secondary icon-btn btn-appliance-remove\"><i class=\"fa fa-toggle-off\"></i>Switch Off All</button></p></div><div class=\"row "+deviceID+"\"></div></div></div>")
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

}