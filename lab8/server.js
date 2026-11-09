var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', './views');

var server = http.createServer(app);
server.listen(80);
console.log('Servidor rodando na porta 80');

var usuarios = [];

app.get('/', function (requisicao, resposta) {
  resposta.redirect('Projects.html');
});

app.get('/cadastra', function (requisicao, resposta) {
  resposta.redirect('Cadastro.html');
});

app.post('/cadastra', function (requisicao, resposta) {
  var nome = requisicao.body.nome;
  var login = requisicao.body.login;
  var senha = requisicao.body.senha;

  usuarios.push({ nome: nome, login: login, senha: senha });

  resposta.render('resposta', { status: 'Usuário ' + nome + ' cadastrado com sucesso!' });
});

app.get('/login', function (requisicao, resposta) {
  resposta.redirect('Login.html');
});

app.post('/login', function (requisicao, resposta) {
  var login = requisicao.body.login;
  var senha = requisicao.body.senha;
  var status = 'Login ou senha incorretos!';

  for (var i = 0; i < usuarios.length; i++) {
    if (usuarios[i].login == login && usuarios[i].senha == senha) {
      status = 'Login realizado com sucesso! Bem-vindo, ' + usuarios[i].nome + '!';
    }
  }

  resposta.render('resposta', { status });
});
