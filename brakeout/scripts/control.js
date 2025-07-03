function getMousePos(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };
}

function getTouchPos(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
    };
}

canvas.addEventListener("mousemove", function (e) {
    const pos = getMousePos(canvas, e);
    mouseX = pos.x;
});

canvas.addEventListener("touchstart", function (e) {
    e.preventDefault();
    const pos = getTouchPos(canvas, e);
    mouseX = pos.x;
}, { passive: false });

canvas.addEventListener("touchmove", function (e) {
    e.preventDefault();
    const pos = getTouchPos(canvas, e);
    mouseX = pos.x;
}, { passive: false });

canvas.addEventListener("touchend", function (e) {
    e.preventDefault();
}, { passive: false });


document.addEventListener('touchstart', function(e) {
    if (e.target === canvas) {
        e.preventDefault();
    }
}, { passive: false });

document.addEventListener('touchend', function(e) {
    if (e.target === canvas) {
        e.preventDefault();
    }
}, { passive: false });

document.addEventListener('touchmove', function(e) {
    if (e.target === canvas) {
        e.preventDefault();
    }
}, { passive: false });


