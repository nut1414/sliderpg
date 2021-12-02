var txt = "";
txt += "<p>innerWidth: " + window.innerWidth + "</p>";
txt += "<p>innerHeight: " + window.innerHeight + "</p>";
txt += "<p>outerWidth: " + window.outerWidth + "</p>";
txt += "<p>outerHeight: " + window.outerHeight + "</p>";
var canvas = document.getElementById("canvas");


canvas.addEventListener('touchstart', handleStart, false);
canvas.addEventListener("touchend", handleEnd, false);
canvas.addEventListener("touchcancel", handleCancel, false);
canvas.addEventListener("touchmove", handleMove, false);

window.onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

var ongoingTouches = [];
var speed1 = 0;
var speed2 = 0;

function init() {
    var ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.moveTo(0, 0);
    ctx.lineTo(1920, 0);
    ctx.stroke();
}

function handleStart(evt) {
    evt.preventDefault();
    console.log("touchstart.");
    var el = document.getElementById("canvas");
    var ctx = el.getContext("2d");
    var touches = evt.changedTouches;

    for (var i = 0; i < touches.length; i++) {
        console.log("touchstart:" + i + "...");
        ongoingTouches.push(copyTouch(touches[i]));
        //var color = colorForTouch(touches[i]);
        //ctx.beginPath();
        //ctx.arc(touches[i].pageX, touches[i].pageY, 4, 0, 2 * Math.PI, false); // a circle at the start
        //ctx.fillStyle = color;
        //ctx.fill();
        //console.log("touchstart:" + i + ".");
    }
}

function handleMove(evt) {
    evt.preventDefault();
    var el = document.getElementById("canvas");
    var ctx = el.getContext("2d");
    var touches = evt.changedTouches;

    for (var i = 0; i < touches.length; i++) {
        var idx = ongoingTouchIndexById(touches[i].identifier);
        if (idx >= 0) {
            //console.log("continuing touch " + idx);
            //ctx.beginPath();

            //console.log("ongoing: " + ongoingTouches[idx].pageX + ongoingTouches[idx].pageY);
            //ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
            //console.log("touches: " + touches[i].pageX + ", " + touches[i].pageY);
            //ctx.lineTo(touches[i].pageX, touches[i].pageY);
            //ctx.lineWidth = 4;
            //ctx.strokeStyle = color;
            //ctx.stroke();
            if (i === 0) {
                speed0 = Math.floor(100 * (touches[i].pageX - ongoingTouches[idx].pageX) / 20);
            }
            if (i === 1) {
                speed1 = Math.floor(100 * (touches[i].pageX - ongoingTouches[idx].pageX) / 20);
            }

            console.log("speed: " + speed);
            canvas.width = canvas.width;
            if (speed0 > 5) {
                ctx.font = '48px serif';
                ctx.fillText('right', 10, 50);
            } else if (speed0 < -5) {
                ctx.font = '48px serif';
                ctx.fillText('left', 10, 50);
            } else if (speed1 > 5) {
                ctx.font = '48px serif';
                ctx.fillText('right', 10, 100);
            } else if (speed1 < -5) {
                ctx.font = '48px serif';
                ctx.fillText('left', 10, 100);
            } else {
                ctx.font = '48px serif';

                //ctx.fillText('none', 10, 50);
            }

            ongoingTouches.splice(idx, 1, copyTouch(touches[i])); // swap in the new touch record
            console.log(".");
        } else {
            console.log("can't figure out which touch to continue");
        }
    }
}


function handleEnd(evt) {
    evt.preventDefault();
    console.log("touchend");
    var el = document.getElementById("canvas");
    var ctx = el.getContext("2d");
    var touches = evt.changedTouches;
    canvas.width = canvas.width;
    //ctx.clear(0, 0, el.width, el.length)
    for (var i = 0; i < touches.length; i++) {
        var color = colorForTouch(touches[i]);
        var idx = ongoingTouchIndexById(touches[i].identifier);

        if (idx >= 0) {
            ctx.lineWidth = 4;
            ctx.fillStyle = color;
            //ctx.beginPath();
            //ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
            //ctx.lineTo(touches[i].pageX, touches[i].pageY);
            //ctx.fillRect(touches[i].pageX - 4, touches[i].pageY - 4, 8, 8); // and a square at the end
            ongoingTouches.splice(idx, 1); // remove it; we're done
        } else {
            console.log("can't figure out which touch to end");
        }
    }
}

function handleCancel(evt) {
    evt.preventDefault();
    console.log("touchcancel.");
    var touches = evt.changedTouches;
    canvas.width = canvas.width;
    for (var i = 0; i < touches.length; i++) {
        var idx = ongoingTouchIndexById(touches[i].identifier);
        ongoingTouches.splice(idx, 1); // remove it; we're done
    }
}

function copyTouch({ identifier, pageX, pageY }) {
    return { identifier, pageX, pageY };
}

function ongoingTouchIndexById(idToFind) {
    for (var i = 0; i < ongoingTouches.length; i++) {
        var id = ongoingTouches[i].identifier;

        if (id == idToFind) {
            return i;
        }
    }
    return -1; // not found
}


function colorForTouch(touch) {
    var r = touch.identifier % 16;
    var g = Math.floor(touch.identifier / 3) % 16;
    var b = Math.floor(touch.identifier / 7) % 16;
    r = r.toString(16); // make it a hex digit
    g = g.toString(16); // make it a hex digit
    b = b.toString(16); // make it a hex digit
    var color = "#" + r + g + b;
    //console.log("color for touch with identifier " + touch.identifier + " = " + color);
    return color;
}


console.log(txt);
init();