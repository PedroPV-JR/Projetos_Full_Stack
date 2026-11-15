let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const TAMANHO = 40;
const COLUNAS = 20;
const LINHAS = 12;
const TOTAL_ONDAS = 10;
const NIVEL_MAXIMO = 3;

function carregarImagem(arquivo) {
    let img = new Image();
    img.src = "img/" + arquivo;
    return img;
}

let imagens = {
    nucleo: carregarImagem("nucleo.png"),
    metralhadora: carregarImagem("metralhadora.png"),
    canhao: carregarImagem("canhao.png"),
    gelo: carregarImagem("gelo.png"),
    atirador: carregarImagem("atirador.png"),
    drone: carregarImagem("drone.png"),
    corredor: carregarImagem("corredor.png"),
    blindado: carregarImagem("blindado.png"),
    colosso: carregarImagem("colosso.png")
};

let caminho = [
    [-1, 2], [4, 2], [4, 8], [9, 8], [9, 3],
    [14, 3], [14, 9], [18, 9], [18, 5], [20, 5]
];

let tiposTorre = {
    metralhadora: { nome: "Metralhadora", custo: 50, dano: 7, alcance: 110, recarga: 15, velTiro: 9, area: 0, congela: false, cor: "#e3ffe8" },
    canhao: { nome: "Canhão", custo: 100, dano: 32, alcance: 130, recarga: 75, velTiro: 5, area: 60, congela: false, cor: "#ffd29a" },
    gelo: { nome: "Torre de Gelo", custo: 75, dano: 4, alcance: 100, recarga: 40, velTiro: 6, area: 40, congela: true, cor: "#d4f4ff" },
    atirador: { nome: "Atirador", custo: 125, dano: 70, alcance: 200, recarga: 100, velTiro: 14, area: 0, congela: false, cor: "#ff8a80" }
};

let tiposInimigo = {
    drone: { vida: 40, velocidade: 1, recompensa: 4, dano: 1, tamanho: 30 },
    corredor: { vida: 24, velocidade: 1.9, recompensa: 5, dano: 1, tamanho: 26 },
    blindado: { vida: 160, velocidade: 0.6, recompensa: 10, dano: 2, tamanho: 34 },
    colosso: { vida: 800, velocidade: 0.5, recompensa: 50, dano: 5, tamanho: 44 }
};

function distancia(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

function desenharGirado(imagem, x, y, tamanho, angulo) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angulo);
    ctx.drawImage(imagem, -tamanho / 2, -tamanho / 2, tamanho, tamanho);
    ctx.restore();
}
