let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let img = new Image();
img.src = "imagem.png";

let figura = {
    x: 125,
    y: 125,
    l: 50,
    a: 50,
    desenha: function(ctx){
        ctx.beginPath();
        ctx.drawImage(img, this.x, this.y, this.l, this.a);
        ctx.closePath();
    }
}

function animacao(){
    ctx.clearRect(0, 0, 300, 300);
    figura.desenha(ctx);
    requestAnimationFrame(animacao);
}

animacao();

document.addEventListener("mousemove", function(evento){
    let rect = canvas.getBoundingClientRect();
    let x_mouse = evento.clientX - rect.left;
    let y_mouse = evento.clientY - rect.top;

    figura.x = x_mouse - figura.l / 2;
    figura.y = y_mouse - figura.a / 2;

    if (figura.x < 0) { figura.x = 0; }
    if (figura.y < 0) { figura.y = 0; }
    if (figura.x > canvas.width - figura.l) { figura.x = canvas.width - figura.l; }
    if (figura.y > canvas.height - figura.a) { figura.y = canvas.height - figura.a; }
})
