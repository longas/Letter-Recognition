{
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const clearCanvas = document.getElementById('clear-canvas');
    const predictedLetter = document.getElementById('predicted-letter');
    const top3Letter = document.getElementById('top3-letter');

    const msg1 = 'Draw an uppercase letter';
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    function setListeners(model) {
        canvas.addEventListener('mouseup', () => predict(model));
        // canvas.addEventListener('mouseleave', () => predict(model));
    }

    function resetText() {
        predictedLetter.innerText = msg1;
        top3Letter.innerText = '';
    }

    function generateTop3String(scores) {
        let finalString = '';
        for (let score of scores) {
            finalString += `<span>${score.letter}</span>: ${(score.value * 100).toFixed(3)}% `;
        }
        return finalString.trim();
    }

    function predict(model) {
        let canvasPixels = context.getImageData(0, 0, canvas.width, canvas.height);
        let canvasPixelsTensor = tf.fromPixels(canvasPixels, 1);
        canvasPixelsTensor = tf.image.resizeBilinear(canvasPixelsTensor, [28, 28]);
        canvasPixelsTensor = canvasPixelsTensor.toFloat().mul(tf.tensor1d([1 / 255])).expandDims(0);

        let results = model.predict(canvasPixelsTensor);

        results.data().then(data => {
            data = Array.from(data);

            let letterScores = data.map((elem, i) => {
                return { letter: letters[i], value: elem };
            });
            letterScores.sort((a, b) => b.value - a.value);
            let top3 = letterScores.slice(0, 3);

            predictedLetter.innerText = top3[0].letter;
            top3Letter.innerHTML = generateTop3String(top3);
        });
    }

    clearCanvas.addEventListener('click', resetText);

    tf.loadModel('model/model.json').then(setListeners);
}