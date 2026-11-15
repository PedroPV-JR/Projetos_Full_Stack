let estado = "menu";
let dinheiro = 130;
let vidas = 20;
let onda = 0;

let inimigos = [];
let torres = [];
let tiros = [];

let filaOnda = [];
let posicaoFila = 0;
let esperaInimigo = 0;

let torreEscolhida = null;
let torreSelecionada = null;
let mouseColuna = -1;
let mouseLinha = -1;
let aviso = "";
let tempoAviso = 0;

function iniciarJogo() {
    estado = "construcao";
    dinheiro = 130;
    vidas = 20;
    onda = 0;
    inimigos = [];
    torres = [];
    tiros = [];
    filaOnda = [];
    torreEscolhida = null;
    torreSelecionada = null;
    document.getElementById("btnIniciar").innerHTML = "Reiniciar jogo";
    mostrarAviso("Posicione suas torres e inicie a onda 1");
}

function emJogo() {
    return estado == "construcao" || estado == "onda";
}

function mostrarAviso(texto) {
    aviso = texto;
    tempoAviso = 120;
}

function montarOnda(numero) {
    let fila = [];
    let quantidade = 6 + numero * 2;

    for (let i = 0; i < quantidade; i++) {
        let tipo = "drone";
        if (numero >= 3 && i % 3 == 2) tipo = "corredor";
        if (numero >= 4 && i % 4 == 3) tipo = "blindado";
        if (numero >= 7 && i % 5 == 4) tipo = "blindado";
        fila.push(tipo);
    }

    if (numero == 5) fila.push("colosso");
    if (numero == 10) {
        fila.push("colosso");
        fila.push("colosso");
    }
    return fila;
}

function iniciarOnda() {
    if (estado != "construcao") return;
    onda++;
    filaOnda = montarOnda(onda);
    posicaoFila = 0;
    esperaInimigo = 30;
    estado = "onda";

    if (onda == 5 || onda == 10) {
        mostrarAviso("Onda " + onda + ": chefe a caminho!");
    } else {
        mostrarAviso("Onda " + onda);
    }
}

function escolherTorre(tipo) {
    if (!emJogo()) return;
    if (torreEscolhida == tipo) {
        torreEscolhida = null;
        return;
    }
    if (dinheiro < tiposTorre[tipo].custo) {
        mostrarAviso("Dinheiro insuficiente");
        return;
    }
    torreEscolhida = tipo;
    torreSelecionada = null;
}

function cancelar() {
    torreEscolhida = null;
    torreSelecionada = null;
}

function torreEm(c, l) {
    for (let i = 0; i < torres.length; i++) {
        if (torres[i].coluna == c && torres[i].linha == l) {
            return torres[i];
        }
    }
    return null;
}

function podeConstruir(c, l) {
    return dentroDoMapa(c, l) && !ehCaminho(c, l) && torreEm(c, l) == null;
}

function construir(c, l) {
    if (!podeConstruir(c, l)) {
        mostrarAviso("Não é possível construir aqui");
        return;
    }
    let custo = tiposTorre[torreEscolhida].custo;
    dinheiro -= custo;
    torres.push(new Torre(torreEscolhida, c, l));
    if (dinheiro < custo) {
        torreEscolhida = null;
    }
}

function evoluir() {
    if (torreSelecionada == null || !emJogo()) return;
    if (torreSelecionada.nivel >= NIVEL_MAXIMO) return;
    if (dinheiro < torreSelecionada.precoEvoluir()) {
        mostrarAviso("Dinheiro insuficiente");
        return;
    }
    dinheiro -= torreSelecionada.precoEvoluir();
    torreSelecionada.evoluir();
}

function vender() {
    if (torreSelecionada == null || !emJogo()) return;
    dinheiro += torreSelecionada.precoVenda();

    let novasTorres = [];
    for (let i = 0; i < torres.length; i++) {
        if (torres[i] != torreSelecionada) {
            novasTorres.push(torres[i]);
        }
    }
    torres = novasTorres;
    torreSelecionada = null;
}

canvas.addEventListener("mousemove", function (evento) {
    let rect = canvas.getBoundingClientRect();
    let x = (evento.clientX - rect.left) * canvas.width / rect.width;
    let y = (evento.clientY - rect.top) * canvas.height / rect.height;
    mouseColuna = Math.floor(x / TAMANHO);
    mouseLinha = Math.floor(y / TAMANHO);
});

canvas.addEventListener("mouseleave", function () {
    mouseColuna = -1;
    mouseLinha = -1;
});

canvas.addEventListener("click", function () {
    if (!emJogo()) return;

    let torre = torreEm(mouseColuna, mouseLinha);
    if (torre != null) {
        torreEscolhida = null;
        torreSelecionada = torre;
    } else if (torreEscolhida != null) {
        construir(mouseColuna, mouseLinha);
    } else {
        torreSelecionada = null;
    }
});

document.addEventListener("keydown", function (evento) {
    if (estado == "menu") return;
    let tecla = evento.key.toLowerCase();

    if (tecla == "1") escolherTorre("metralhadora");
    if (tecla == "2") escolherTorre("canhao");
    if (tecla == "3") escolherTorre("gelo");
    if (tecla == "4") escolherTorre("atirador");
    if (tecla == "u") evoluir();
    if (tecla == "v") vender();
    if (tecla == "escape") cancelar();
    if (tecla == " ") {
        evento.preventDefault();
        document.activeElement.blur();
        iniciarOnda();
    }
});

function soltarInimigos() {
    if (posicaoFila >= filaOnda.length) return;

    esperaInimigo--;
    if (esperaInimigo <= 0) {
        let tipo = filaOnda[posicaoFila];
        inimigos.push(new Inimigo(tipo, onda));
        posicaoFila++;

        if (tipo == "corredor") esperaInimigo = 27;
        else if (tipo == "colosso") esperaInimigo = 120;
        else esperaInimigo = 50;
    }
}

function atualizar() {
    soltarInimigos();

    for (let i = 0; i < inimigos.length; i++) inimigos[i].atualizar();
    for (let i = 0; i < torres.length; i++) torres[i].atualizar();
    for (let i = 0; i < tiros.length; i++) tiros[i].atualizar();

    let tirosAtivos = [];
    for (let i = 0; i < tiros.length; i++) {
        if (tiros[i].ativo) tirosAtivos.push(tiros[i]);
    }
    tiros = tirosAtivos;

    let inimigosVivos = [];
    for (let i = 0; i < inimigos.length; i++) {
        let inimigo = inimigos[i];
        if (inimigo.morto) {
            dinheiro += inimigo.recompensa;
        } else if (inimigo.chegou) {
            vidas -= inimigo.dano;
        } else {
            inimigosVivos.push(inimigo);
        }
    }
    inimigos = inimigosVivos;

    if (vidas <= 0) {
        vidas = 0;
        estado = "derrota";
        cancelar();
    } else if (estado == "onda" && posicaoFila >= filaOnda.length && inimigos.length == 0) {
        let bonus = 10 + onda * 2;
        dinheiro += bonus;
        if (onda == TOTAL_ONDAS) {
            estado = "vitoria";
            cancelar();
        } else {
            estado = "construcao";
            mostrarAviso("Onda " + onda + " concluída! Bônus de $" + bonus);
        }
    }
}

function desenharAlcance(x, y, raio, cor) {
    ctx.beginPath();
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = cor;
    ctx.arc(x, y, raio, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = cor;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.closePath();
}

function desenharPrevia() {
    let x = mouseColuna * TAMANHO + TAMANHO / 2;
    let y = mouseLinha * TAMANHO + TAMANHO / 2;
    let cor = "#ff6b6b";
    if (podeConstruir(mouseColuna, mouseLinha)) cor = "#7bd88f";

    desenharAlcance(x, y, tiposTorre[torreEscolhida].alcance, cor);
    ctx.globalAlpha = 0.6;
    desenharGirado(imagens[torreEscolhida], x, y, 38, -Math.PI / 2);
    ctx.globalAlpha = 1;
}

function desenharAviso() {
    if (tempoAviso <= 0) return;
    tempoAviso--;

    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 12, canvas.width, 34);
    ctx.fillStyle = "white";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";
    ctx.fillText(aviso, canvas.width / 2, 35);
}

function desenharTela(titulo, subtitulo) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "bold 44px Arial";
    ctx.fillText(titulo, canvas.width / 2, canvas.height / 2 - 8);
    ctx.font = "18px Arial";
    ctx.fillText(subtitulo, canvas.width / 2, canvas.height / 2 + 30);
}

function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    desenharMapa();

    if (torreSelecionada != null) {
        desenharAlcance(torreSelecionada.x, torreSelecionada.y, torreSelecionada.alcance, "#f2c230");
    }
    for (let i = 0; i < torres.length; i++) {
        torres[i].desenhar(torres[i] == torreSelecionada);
    }
    if (emJogo() && torreEscolhida != null && dentroDoMapa(mouseColuna, mouseLinha)) {
        desenharPrevia();
    }
    for (let i = 0; i < inimigos.length; i++) inimigos[i].desenhar();
    for (let i = 0; i < tiros.length; i++) tiros[i].desenhar();

    desenharAviso();

    if (estado == "menu") desenharTela("Defensores do Núcleo", "Clique em \"Iniciar jogo\" para começar");
    if (estado == "derrota") desenharTela("Fim de jogo", "Você chegou até a onda " + onda + ". Clique em \"Reiniciar jogo\".");
    if (estado == "vitoria") desenharTela("Vitória!", "Você venceu as 10 ondas com " + vidas + " vidas.");
}

function atualizarPainel() {
    document.getElementById("dinheiro").innerHTML = "$" + dinheiro;
    document.getElementById("vidas").innerHTML = vidas;
    document.getElementById("onda").innerHTML = onda + "/" + TOTAL_ONDAS;

    let btnOnda = document.getElementById("btnOnda");
    btnOnda.disabled = estado != "construcao";
    if (estado == "construcao") btnOnda.innerHTML = "Iniciar onda " + (onda + 1);
    else btnOnda.innerHTML = "Iniciar onda";

    let tipos = ["metralhadora", "canhao", "gelo", "atirador"];
    for (let i = 0; i < tipos.length; i++) {
        let botao = document.getElementById(tipos[i]);
        botao.disabled = !emJogo();
        if (torreEscolhida == tipos[i]) botao.className = "btn-torre ativo";
        else botao.className = "btn-torre";
    }

    if (torreSelecionada == null) {
        document.getElementById("infoVazio").style.display = "block";
        document.getElementById("infoTorre").style.display = "none";
    } else {
        let t = torreSelecionada;
        document.getElementById("infoVazio").style.display = "none";
        document.getElementById("infoTorre").style.display = "block";
        document.getElementById("infoNome").innerHTML = t.dados.nome;
        document.getElementById("infoNivel").innerHTML = t.nivel + "/" + NIVEL_MAXIMO;
        document.getElementById("infoDano").innerHTML = t.dano.toFixed(1);
        document.getElementById("infoAlcance").innerHTML = t.alcance + " px";

        let btnEvoluir = document.getElementById("btnEvoluir");
        if (t.nivel < NIVEL_MAXIMO) btnEvoluir.innerHTML = "Evoluir ($" + t.precoEvoluir() + ")";
        else btnEvoluir.innerHTML = "Nível máximo";
        btnEvoluir.disabled = t.nivel >= NIVEL_MAXIMO || dinheiro < t.precoEvoluir();
        document.getElementById("btnVender").innerHTML = "Vender ($" + t.precoVenda() + ")";
    }
}

function animacao() {
    if (emJogo()) {
        atualizar();
    }
    desenhar();
    atualizarPainel();
    requestAnimationFrame(animacao);
}

animacao();
