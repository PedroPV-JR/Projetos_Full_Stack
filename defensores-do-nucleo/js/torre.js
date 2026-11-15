class Torre {
    constructor(tipo, coluna, linha) {
        this.tipo = tipo;
        this.dados = tiposTorre[tipo];
        this.imagem = imagens[tipo];
        this.coluna = coluna;
        this.linha = linha;
        this.x = coluna * TAMANHO + TAMANHO / 2;
        this.y = linha * TAMANHO + TAMANHO / 2;

        this.nivel = 1;
        this.gasto = this.dados.custo;
        this.espera = 0;
        this.angulo = -Math.PI / 2;
        this.calcularAtributos();
    }

    calcularAtributos() {
        let n = this.nivel - 1;
        this.dano = this.dados.dano * (1 + 0.5 * n);
        this.alcance = this.dados.alcance + 15 * n;
        this.recarga = Math.round(this.dados.recarga * (1 - 0.13 * n));
    }

    precoEvoluir() {
        return this.dados.custo * this.nivel;
    }

    precoVenda() {
        return Math.floor(this.gasto / 2);
    }

    evoluir() {
        this.gasto += this.precoEvoluir();
        this.nivel++;
        this.calcularAtributos();
    }

    procurarAlvo() {
        let alvo = null;
        for (let i = 0; i < inimigos.length; i++) {
            let inimigo = inimigos[i];
            let d = distancia(this.x, this.y, inimigo.x, inimigo.y);
            if (d <= this.alcance) {
                if (alvo == null || inimigo.andou > alvo.andou) {
                    alvo = inimigo;
                }
            }
        }
        return alvo;
    }

    atualizar() {
        if (this.espera > 0) {
            this.espera--;
        }

        let alvo = this.procurarAlvo();
        if (alvo == null) {
            return;
        }

        this.angulo = Math.atan2(alvo.y - this.y, alvo.x - this.x);

        if (this.espera == 0) {
            tiros.push(new Tiro(this, alvo));
            this.espera = this.recarga;
        }
    }

    desenhar(selecionada) {
        desenharGirado(this.imagem, this.x, this.y, 38, this.angulo);

        if (selecionada) {
            ctx.beginPath();
            ctx.strokeStyle = "#f2c230";
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x - 19, this.y - 19, 38, 38);
            ctx.closePath();
        }

        ctx.fillStyle = "#f2c230";
        ctx.font = "bold 11px Arial";
        ctx.textAlign = "left";
        ctx.fillText(this.nivel, this.x + 9, this.y + 16);
    }
}
