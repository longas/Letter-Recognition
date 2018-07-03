{
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const clearCanvas = document.getElementById('clear-canvas');
    const radius = 10;
    let painting = false;

    function paintBackground() {
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'white';
    }

    function putPoint(e) {
        if (!painting) return;

        context.lineTo(e.offsetX, e.offsetY);
        context.stroke();

        context.beginPath();
        context.arc(e.offsetX, e.offsetY, radius, 0, Math.PI * 2);
        context.fill();

        context.beginPath();
        context.moveTo(e.offsetX, e.offsetY);
    }

    function startStroke(e) {
        painting = true;
        putPoint(e);
    }

    function endStroke() {
        painting = false;
        context.beginPath();
    }

    canvas.width = 200;
    canvas.height = 200;
    context.lineWidth = radius * 2;
    context.strokeStyle = 'white';

    paintBackground();

    canvas.addEventListener('mousedown', startStroke);
    canvas.addEventListener('mousemove', putPoint);
    canvas.addEventListener('mouseup', endStroke);
    canvas.addEventListener('mouseleave', endStroke);

    clearCanvas.addEventListener('click', () => paintBackground());
}