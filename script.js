const canvas = document.getElementById('scratchCard');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let lastX = 0;
let lastY = 0;

const produtos = [
    {
        nome: 'images/fibra.png',
        peso: 50
    },
    {
        nome: 'images/folha-de-mesa.png',
        peso: 25
    },
    {
        nome: 'images/oleo-de-cuticula.png',
        peso: 15
    },
    {
        nome: 'images/esmalte-hqz.png',
        peso: 7
    },
    {
        nome: 'images/ph.png',
        peso: 3
    }
];

function sortearProduto() {
    const total = produtos.reduce((acc, produto) => acc + produto.peso, 0);
    let random = Math.random() * total;
    
    for (const produto of produtos) {
        if (random < produto.peso) {
            return produto.nome;
        }
        random -= produto.peso;
    }
    
    return produtos[0].nome;
}

function createScratchCard() {
    ctx.fillStyle = '#CCCCCC';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function draw(e) {
    if (!isDrawing) return;
    
    let x, y;
    
    if (e.type === 'mousemove') {
        x = e.offsetX;
        y = e.offsetY;
    } else if (e.type === 'touchmove') {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
    }
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 40;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    lastX = x;
    lastY = y;
    
    checkRevealPercentage();
}

function startDrawing(e) {
    isDrawing = true;
    
    if (e.type === 'mousedown') {
        lastX = e.offsetX;
        lastY = e.offsetY;
    } else if (e.type === 'touchstart') {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        lastX = e.touches[0].clientX - rect.left;
        lastY = e.touches[0].clientY - rect.top;
    }
}

function stopDrawing() {
    isDrawing = false;
}

function checkRevealPercentage() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;
    
    for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) {
            transparentPixels++;
        }
    }
    
    const totalPixels = canvas.width * canvas.height;
    const percentageRevealed = (transparentPixels / totalPixels) * 100;
    
    if (percentageRevealed > 50) {
        revealPrize();
    }
}

function revealPrize() {
    canvas.style.display = 'none';
    const prizeImage = document.getElementById('prizeImage');
    const prizeText = document.getElementById('prize-text');
    const winnerMessage = document.querySelector('.winner-message');
    
    const prizeName = prizeImage.src.split('/').pop().split('.')[0];
    prizeText.textContent = `Você ganhou ${formatPrizeName(prizeName)}!`;
    winnerMessage.style.display = 'block';
    
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

function formatPrizeName(name) {
    const nameMap = {
        'fibra': 'uma Fibra de Vidro',
        'folha-de-mesa': 'uma Folha de Mesa',
        'oleo-de-cuticula': 'um Óleo de Cutícula',
        'esmalte-hqz': 'um Esmalte HQZ',
        'ph': 'um Preparador pH'
    };
    
    return nameMap[name] || name;
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseleave', stopDrawing);

canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchcancel', stopDrawing);

// Inicialização
document.getElementById('prizeImage').src = sortearProduto();
createScratchCard(); 