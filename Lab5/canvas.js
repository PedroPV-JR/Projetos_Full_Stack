let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

function desenhar_quadrado(x, y, largura, altura, cor) {
    ctx.beginPath();
    ctx.fillStyle = cor;
    ctx.fillRect(x, y, largura, altura);
    ctx.closePath();
}

function desenhar_linha(x1, y1, x2, y2, cor) {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = cor;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
}

function desenhar_arco(x, y, raio, inicio, fim, cor_fill, cor_stroke) {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = cor_stroke;
    ctx.arc(x, y, raio, inicio, fim);
    if (cor_fill != "") {
        ctx.fillStyle = cor_fill;
        ctx.fill();
    }
    ctx.stroke();
    ctx.closePath();
}

function escrever(texto, x, y, cor) {
    ctx.beginPath();
    ctx.fillStyle = cor;
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillText(texto, x, y);
    ctx.closePath();
}

desenhar_linha(0, 0, 150, 150, "blue");
desenhar_linha(300, 0, 150, 150, "red");
desenhar_linha(0, 150, 300, 150, "green");
desenhar_linha(150, 150, 150, 300, "green");

desenhar_quadrado(0, 0, 50, 50, "blue");
desenhar_quadrado(250, 0, 50, 50, "red");
desenhar_quadrado(0, 120, 30, 60, "cyan");
desenhar_quadrado(270, 135, 30, 30, "cyan");
desenhar_quadrado(110, 150, 40, 40, "red");
desenhar_quadrado(0, 240, 30, 60, "yellow");
desenhar_quadrado(0, 270, 60, 30, "yellow");
desenhar_quadrado(270, 240, 30, 60, "black");
desenhar_quadrado(240, 270, 60, 30, "black");

desenhar_arco(150, 150, 60, Math.PI, 2 * Math.PI, "", "green");
desenhar_arco(150, 150, 80, Math.PI, 2 * Math.PI, "", "green");
desenhar_arco(150, 115, 15, 0, 2 * Math.PI, "cyan", "blue");

desenhar_arco(70, 220, 15, 0, 2 * Math.PI, "yellow", "green");
desenhar_arco(220, 220, 15, 0, 2 * Math.PI, "yellow", "green");

desenhar_arco(150, 300, 80, Math.PI, 2 * Math.PI, "", "green");
desenhar_arco(150, 300, 60, 1.5 * Math.PI, 2 * Math.PI, "", "green");
desenhar_arco(150, 300, 40, Math.PI, 2 * Math.PI, "cyan", "green");

escrever("Canvas", 150, 50, "black");
