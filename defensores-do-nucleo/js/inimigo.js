class Inimigo {
    constructor(tipo, onda) {
        let dados = tiposInimigo[tipo];
        this.imagem = imagens[tipo];
        this.tamanho = dados.tamanho;
        this.velocidade = dados.velocidade;
        this.recompensa = dados.recompensa;
        this.dano = dados.dano;

        this.vidaMax = Math.round(dados.vida * (1 + (onda - 1) * 0.4));
        this.vida = this.vidaMax;

        this.x = pontosCaminho[0].x;
        this.y = pontosCaminho[0].y;
        this.proximoPonto = 1;
        this.angulo = 0;
        this.andou = 0;
        this.tempoLento = 0;

        this.morto = false;
        this.chegou = false;
    }

    atualizar() {
        let velocidade = this.velocidade;
        if (this.tempoLento > 0) {
            velocidade = velocidade / 2;
            this.tempoLento--;
        }

        let alvo = pontosCaminho[this.proximoPonto];
        let d = distancia(this.x, this.y, alvo.x, alvo.y);
        this.angulo = Math.atan2(alvo.y - this.y, alvo.x - this.x);

        if (d <= velocidade) {
            this.x = alvo.x;
            this.y = alvo.y;
            this.proximoPonto++;
            if (this.proximoPonto >= pontosCaminho.length) {
                this.chegou = true;
            }
        } else {
            this.x += Math.cos(this.angulo) * velocidade;
            this.y += Math.sin(this.angulo) * velocidade;
        }
        this.andou += velocidade;
    }

    levarDano(valor) {
        this.vida -= valor;
        if (this.vida <= 0) {
            this.morto = true;
        }
    }

    desenhar() {
        desenharGirado(this.imagem, this.x, this.y, this.tamanho, this.angulo);

        if (this.tempoLento > 0) {
            ctx.beginPath();
            ctx.strokeStyle = "#6fd3ff";
            ctx.lineWidth = 2;
            ctx.arc(this.x, this.y, this.tamanho / 2 + 2, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.closePath();
        }

        let barraX = this.x - this.tamanho / 2;
        let barraY = this.y - this.tamanho / 2 - 8;
        ctx.fillStyle = "black";
        ctx.fillRect(barraX, barraY, this.tamanho, 4);
        ctx.fillStyle = "#7bd88f";
        ctx.fillRect(barraX, barraY, this.tamanho * this.vida / this.vidaMax, 4);
    }
}
