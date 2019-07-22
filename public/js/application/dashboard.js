window.onload= init

function init() {
    loadStateFromDatabase()
    // $('#btn-add').click(activate)
}

function activate() {
    var dialog = bootbox.dialog({
        title: 'Add a device',
        message: "Device Name <input id= \"device-name\" type=\"text\"><br></br>Device ID &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id= \"device-id\" type=\"text\">",
        size: 'medium',
        buttons: {
            cancel: {
                label: "Cancel adding device!",
                className: 'btn-danger',
                callback: function(){
                    console.log('Custom cancel clicked');
                }
            },
            ok: {
                label: "Add Device!",
                className: 'btn-info',
                callback: function(){
                    var deviceName= $('#device-name').val()
                    var deviceID= $('#device-id').val()
                    var rowDiv= $(".device-row").append("<div class=\"col-md-6\"><div class=\"tile appliance-tile\"><div class=\"tile-title-w-btn\"><b>"+deviceName+"</b><b>"+deviceID+"</b><br><br><p><button class=\"btn btn-primary icon-btn btn-appliance-add\"><i class=\"fa fa-plus\"></i>Appliance</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button class=\"btn btn-secondary icon-btn btn-appliance-remove\"><i class=\"fa fa-minus\"></i>Remove Device</button></p></div><div class=\"row appliance-row\"></div></div></div>")
                    $('.btn-appliance-add').click(() => {
                        var dialog = bootbox.dialog({
                            title: 'Add an appliance',
                            message: "Appliance Name <input id= \"appliance-name\" type=\"text\"><br>",
                            size: 'medium',
                            buttons: {
                                cancel: {
                                    label: "Cancel adding device!",
                                    className: 'btn-danger',
                                    callback: function(){
                                        console.log('Custom cancel clicked');
                                    }
                                },
                                ok: {
                                    label: "Add Device!",
                                    className: 'btn-info',
                                    callback: function(){
                                        var appName= $('#appliance-name').val()
                                        var appDiv= $(".appliance-row").append("<div class=\"col-md-3\"><b>"+appName+"</b><br><br><div class=\"toggle-flip\"><label><input type=\"checkbox\"><span class=\"flip-indecator\" data-toggle-on=\"ON\"data-toggle-off=\"OFF\"></span></label></div></div></div>")
                                    }
                                }
                            }
                        });
                    })
                }
            }
        }
    });
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
        var userID= data[i].user_id
        var deviceID= data[i].device_id.replace(/:/g, "")
        var deviceName= data[i].device_name
        var pinValues= data[i].device_pin_values
        var rowDiv= $(".device-row").append("<div class=\"col-md-12\"><div class=\"tile appliance-tile\"><div class=\"tile-title-w-btn\"><b>Device Name: "+deviceName+"</b><b>Device ID: "+deviceID+"</b><br><br><p><button class=\"btn btn-primary icon-btn btn-appliance-add\"><i class=\"fa fa-plus\"></i>Appliance</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button class=\"btn btn-secondary icon-btn btn-appliance-remove\"><i class=\"fa fa-minus\"></i>Remove Device</button></p></div><div class=\"row "+deviceID+"\"></div></div></div>")
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