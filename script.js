const produtos = [
    "Esmalte Vermelho Glamour",
    "Kit Manicure Profissional",
    "Base Fortalecedora",
    "Top Coat Ultra Brilho",
    "Removedor de Cutículas"
];

let isDrawing = false;
const canvas = document.getElementById('scratchCanvas');
const ctx = canvas.getContext('2d');
const productArea = document.getElementById('productArea');
const newCardButton = document.getElementById('newCard');

function criarCamadaRaspadinha() {
    // Define o tamanho do canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Cria gradiente
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#888888');
    gradient.addColorStop(0.5, '#AAAAAA');
    gradient.addColorStop(1, '#888888');

    // Preenche o fundo
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Adiciona textura
    for (let i = 0; i < canvas.width; i += 4) {
        for (let j = 0; j < canvas.height; j += 4) {
            if (Math.random() > 0.5) {
                ctx.fillStyle = '#777777';
                ctx.fillRect(i, j, 2, 2);
            }
        }
    }
}

function iniciarRaspadinha() {
    const produtoSorteado = produtos[Math.floor(Math.random() * produtos.length)];
    productArea.textContent = produtoSorteado;
    criarCamadaRaspadinha();
}

function getMousePos(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    
    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(e.offsetX, e.offsetY, 15, 0, Math.PI * 2);
    ctx.fill();
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
});

newCardButton.addEventListener('click', iniciarRaspadinha);

// Inicializa a primeira raspadinha
iniciarRaspadinha(); 