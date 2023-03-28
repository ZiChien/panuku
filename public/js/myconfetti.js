let bingoCanvas = document.getElementById('bingo')
let defaults = {
    spread: 360,
    ticks: 200,
    gravity: 0,
    decay: 0.94,
    startVelocity: 20,
    shapes: ['star'],
    colors: ['e3e400', 'f7c300', 'ffa000', 'ff7c09', 'ff5330']
};
function bingoShoot() {
    let myConfetti = confetti.create(bingoCanvas, {
        resize: true,
        useWorker: true
    });
    function shoot() {
        myConfetti({
            ...defaults,
            particleCount: 40,
            scalar: 1.2,
            shapes: ['star']
        });
        myConfetti({
            ...defaults,
            particleCount: 10,
            scalar: 0.75,
            shapes: ['circle']
        });
    }
    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
}

/////////////////////////////////////////////////


function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}



function playSnow() {
    let duration = 5 * 1000;
    let animationEnd = Date.now() + duration;
    let skew = 1;
    function frame() {
        let timeLeft = animationEnd - Date.now();
        let ticks = Math.max(200, 500 * (timeLeft / duration));
        skew = Math.max(0.8, skew - 0.001);
    
        confetti({
            particleCount: 1,
            startVelocity: 0,
            ticks: ticks,
            origin: {
                x: Math.random(),
                // since particles fall down, skew start toward the top
                y: (Math.random() * skew) - 0.2
            },
            colors: ['#ffffff'],
            shapes: ['circle'],
            gravity: randomInRange(0.4, 0.6),
            scalar: randomInRange(0.4, 1),
            drift: randomInRange(-0.4, 0.4)
        });
    
        if (timeLeft > 0) {
            requestAnimationFrame(frame);
        }
    };
    frame()
}