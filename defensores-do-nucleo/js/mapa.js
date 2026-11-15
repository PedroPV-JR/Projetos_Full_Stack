let pontosCaminho = [];
for (let i = 0; i < caminho.length; i++) {
    pontosCaminho.push({
        x: caminho[i][0] * TAMANHO + TAMANHO / 2,
        y: caminho[i][1] * TAMANHO + TAMANHO / 2
    });
}

let celulasCaminho = [];
for (let i = 0; i < caminho.length - 1; i++) {
    let c = caminho[i][0];
    let l = caminho[i][1];
    let cFim = caminho[i + 1][0];
    let lFim = caminho[i + 1][1];

    celulasCaminho.push(c + "," + l);
    while (c != cFim || l != lFim) {
        if (c < cFim) c++;
        if (c > cFim) c--;
        if (l < lFim) l++;
        if (l > lFim) l--;
        celulasCaminho.push(c + "," + l);
    }
}

function ehCaminho(c, l) {
    return celulasCaminho.includes(c + "," + l);
}

function dentroDoMapa(c, l) {
    return c >= 0 && l >= 0 && c < COLUNAS && l < LINHAS;
}

function desenharMapa() {
    for (let l = 0; l < LINHAS; l++) {
        for (let c = 0; c < COLUNAS; c++) {
            if (ehCaminho(c, l)) {
                ctx.fillStyle = "#3b3f45";
            } else if ((c + l) % 2 == 0) {
                ctx.fillStyle = "#26313c";
            } else {
                ctx.fillStyle = "#29353f";
            }
            ctx.fillRect(c * TAMANHO, l * TAMANHO, TAMANHO, TAMANHO);
        }
    }

    let fim = pontosCaminho[pontosCaminho.length - 1];
    ctx.drawImage(imagens.nucleo, 750, fim.y - 30, 60, 60);
}
