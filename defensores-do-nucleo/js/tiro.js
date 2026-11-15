class Tiro {
    constructor(torre, alvo) {
        this.x = torre.x;
        this.y = torre.y;
        this.alvo = alvo;
        this.velocidade = torre.dados.velTiro;
        this.dano = torre.dano;
        this.area = torre.dados.area;
        this.congela = torre.dados.congela;
        this.cor = torre.dados.cor;
        this.ativo = true;
    }

    atualizar() {
        if (this.alvo.morto || this.alvo.chegou) {
            this.ativo = false;
            return;
        }

        let d = distancia(this.x, this.y, this.alvo.x, this.alvo.y);
        if (d <= this.velocidade) {
            this.acertar();
        } else {
            let angulo = Math.atan2(this.alvo.y - this.y, this.alvo.x - this.x);
            this.x += Math.cos(angulo) * this.velocidade;
            this.y += Math.sin(angulo) * this.velocidade;
        }
    }

    acertar() {
        this.ativo = false;

        if (this.area > 0) {
            for (let i = 0; i < inimigos.length; i++) {
                let inimigo = inimigos[i];
                if (distancia(this.alvo.x, this.alvo.y, inimigo.x, inimigo.y) <= this.area) {
                    this.aplicar(inimigo);
                }
            }
        } else {
            this.aplicar(this.alvo);
        }
    }

    aplicar(inimigo) {
        inimigo.levarDano(this.dano);
        if (this.congela) {
            inimigo.tempoLento = 120;
        }
    }

    desenhar() {
        ctx.beginPath();
        ctx.fillStyle = this.cor;
        ctx.arc(this.x, this.y, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
}
