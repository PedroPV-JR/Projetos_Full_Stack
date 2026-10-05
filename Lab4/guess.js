var numeroSecreto = Math.floor(Math.random() * 100);

function verificar() {
    var chute = Number(document.getElementById("numero").value);

    if (chute > numeroSecreto) {
        document.getElementById("mensagem").innerHTML = "Errou! O número é menor.";
        document.getElementById("numero").style.setProperty("background-color", "red");
    } else if (chute < numeroSecreto) {
        document.getElementById("mensagem").innerHTML = "Errou! O número é maior.";
        document.getElementById("numero").style.setProperty("background-color", "red");
    } else {
        document.getElementById("mensagem").innerHTML = "Parabéns, você acertou!";
        document.getElementById("numero").style.setProperty("background-color", "lightgreen");
    }
}
