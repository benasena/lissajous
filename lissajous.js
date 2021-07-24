$(document).ready(function () {
    
    // variables
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    var bx = 1; // horizontal nodes
    var by = 1; // vertical nodes
    
    var lines = false; // points if false
    var fill = false;  // only fills if lines is true
    
    var width = canvas.width;
    var height = canvas.height;
    var A = Math.min(width, height) / 2 - 50; // amplitude in pixels
    
    var delay = 10; // time between drawings
   
    var xrot = 1; // horizontal angular velocity factor
    var yrot = 1; // vertical angular velocity factor
    var period = 10; // points to draw
    var rotationConstant = 0.009; // multiply by xrot and yrot to get angle deltas
    var cx = 0; // horizontal angle delta
    var cy = 0; // vertical angle delta

    // functions
    function randomBool() {
        // probablilty 1/3
        return Math.floor(1.5 * Math.random());
    }
    function initBools() {
        fill = randomBool();
        lines = randomBool() | fill; // always true if fill;
        xrot = randomBool();
        yrot = randomBool() | !xrot; // rotates at least one way when shaken
    }
    function randomPeriod() {
        // logarithmmic between 1 and 1000, minimum 2 if line style
        period = Math.floor(Math.pow(10, (Math.random() * 3))) + lines;
        return period;
    }
    function drawCurve() {
        context.clearRect(0, 0, width, height); // clear canvas
        context.beginPath();
        for (i = 0; i <= period; i++) {
            var x = width / 2 + A * Math.cos(bx * i / period * 2 * Math.PI + cx);
            var y = height / 2 + A * Math.sin(by * i / period * 2 * Math.PI + cy);
            if (lines) context.lineTo(x, y);
            else context.rect(x, y, 1, 1); // 1px by 1px
        }
        context.closePath();
        if (fill) context.fill();
        context.stroke();
        cx += rotationConstant * xrot;
        cy += rotationConstant * yrot;
    }

    // main process
    context.strokeStyle = "white";
    context.fillStyle = "white";
    context.moveTo(width, height / 2);
    // repeat after delay (ms)
    setInterval(function () {
        drawCurve();
    }, delay);
    
    // listeners
    $("#shakeButton").click(function () {
        initBools();
        // randomize nodes
        bx = 1 + Math.floor(Math.random() * 6);
        by = 1 + Math.floor(Math.random() * 6);
        // get rid of degenerate cases
        by += bx == by;
        
        // randomize period and get rid of degenerate cases
        do {
            randomPeriod();
        } while (bx % period == 0 || by % period == 0);
    
        // update displayed values
        document.getElementById("bxfield").value = bx;
        document.getElementById("byfield").value = by;
        document.getElementById("pefield").value = period;
        document.getElementById("xrfield").value = xrot;
        document.getElementById("yrfield").value = yrot;
    });

    $("#styleButton").click(function () {
        // points -> lines -> fill -> points
        var fillTemp = (!fill && lines);
        lines = !(fill && lines);
        fill = fillTemp;
    });
    
    $("#bxfield").change(function () {
        bx = $(this).val();
    });
    $("#byfield").change(function () {
        by = $(this).val();
    });
    $("#pefield").change(function () {
        period = $(this).val();
    });
    $("#xrfield").change(function () {
        xrot = $(this).val();
    });
    $("#yrfield").change(function () {
        yrot = $(this).val();
    });
});
