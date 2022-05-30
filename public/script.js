var txt = ""
txt += "<p>innerWidth: " + window.innerWidth + "</p>"
txt += "<p>innerHeight: " + window.innerHeight + "</p>"
txt += "<p>outerWidth: " + window.outerWidth + "</p>"
txt += "<p>outerHeight: " + window.outerHeight + "</p>"
var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d")
var websocket = new WebSocket('ws://' + window.location.host + '/ws')

websocket.onopen = function () {
  canvas.addEventListener('touchstart', handleStart, false)
  canvas.addEventListener('touchend', handleEnd, false)
  canvas.addEventListener('touchcancel', handleCancel, false)
  canvas.addEventListener('touchmove', handleMove, false)
}

websocket.onclose = function () {
  canvas.removeEventListener('touchstart', handleStart)
  canvas.removeEventListener('touchend', handleEnd)
  canvas.removeEventListener('touchcancel', handleCancel)
  canvas.removeEventListener('touchmove', handleMove)
  ctx.font = '48px serif'
  ctx.fillText('connection lost, please reload the page.', 10 - 400 + window.innerWidth/2, window.innerHeight/2)
}

window.onresize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}

var ongoingTouches = []
var speed0 = 0
var speed1 = 0

function sendSpeed(spd0,spd1) {
  websocket.send(spd0+','+spd1)
}

function init() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}

function handleStart(evt) {
    evt.preventDefault()
    console.log("touchstart.")
    var touches = evt.changedTouches

    for (var i = 0; i < touches.length; i++) {
        ongoingTouches.push(copyTouch(touches[i]))
    }
}

function handleMove(evt) {
    evt.preventDefault()
    var touches = evt.changedTouches
    for (var i = 0; i < touches.length; i++) {
        var idx = ongoingTouchIndexById(touches[i].identifier)
        if (idx >= 0) {
            if (i === 0) {
                speed0 = Math.floor(100 * (touches[i].pageX - ongoingTouches[idx].pageX) / 20)
            }
            if (i === 1) {
                speed1 = Math.floor(100 * (touches[i].pageX - ongoingTouches[idx].pageX) / 20)
            }
            console.log("speed0: " + speed0)
            console.log("speed1: " + speed1)
            canvas.width = canvas.width
            ctx.font = '48px serif'
            ctx.fillText(speed0, 10, 50)
            ctx.fillText(speed1, 10, 150)
            
            ongoingTouches.splice(idx, 1, copyTouch(touches[i]))
        } else {
            console.log("can't figure out which touch to continue")
        }

    }
    sendSpeed(speed0,speed1)
}


function handleEnd(evt) {
    evt.preventDefault()
    console.log("touchend")
    var touches = evt.changedTouches
    canvas.width = canvas.width
    for (var i = 0; i < touches.length; i++) {
        var idx = ongoingTouchIndexById(touches[i].identifier)
        if (idx >= 0) {
            if (idx === 0) {
                speed0 = 0
            }
            if (idx === 1 || speed0 == 0) {
                speed1 = 0
            }
            ongoingTouches.splice(idx, 1) 
        } else {
            console.log("can't figure out which touch to end")
        }
    }
    sendSpeed(speed0,speed1)
}

function handleCancel(evt) {
    evt.preventDefault()
    console.log("touchcancel.")
    var touches = evt.changedTouches
    canvas.width = canvas.width
    for (var i = 0; i < touches.length; i++) {
        if (idx === 0) {
            speed0 = 0
        }
        if (idx === 1  || speed0 == 0) {
            speed1 = 0
        }
        var idx = ongoingTouchIndexById(touches[i].identifier)
        ongoingTouches.splice(idx, 1)
    }
    sendSpeed(speed0,speed1)
}

function copyTouch({ identifier, pageX, pageY }) {
    return { identifier, pageX, pageY }
}

function ongoingTouchIndexById(idToFind) {
    for (var i = 0; i < ongoingTouches.length; i++) {
        var id = ongoingTouches[i].identifier

        if (id == idToFind) {
            return i
        }
    }
    return -1 
}

init()