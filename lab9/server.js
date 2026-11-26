var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');

var app = express();
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', './views');

var server = http.createServer(app);
server.listen(80);
console.log('Servidor rodando na porta 80');

const MongoClient = mongodb.MongoClient;
const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri, { useNewUrlParser: true });

var dbo = client.db('blog_bd');
var posts = dbo.collection('posts');

var usuarios = [];

function inserir_post(titulo, resumo, conteudo, callback) {
  var data = { db_titulo: titulo, db_resumo: resumo, db_conteudo: conteudo };
  posts.insertOne(data, function (err) {
    callback(err);
  });
}

function buscar_posts(callback) {
  posts.find({}).toArray(function (err, items) {
    callback(err, items);
  });
}

app.get('/', function (requisicao, resposta) {
  resposta.redirect('Projects.html');
});

app.get('/blog', function (requisicao, resposta) {
  buscar_posts(function (err, items) {
    if (err) {
      console.log(err);
      resposta.render('resposta', { status: 'Erro ao buscar os posts!' });
    } else {
      resposta.render('blog', { posts: items });
    }
  });
});

app.get('/cadastrar_post', function (requisicao, resposta) {
  resposta.redirect('cadastrar_post.html');
});

app.post('/cadastrar_post', function (requisicao, resposta) {
  var titulo = requisicao.body.titulo;
  var resumo = requisicao.body.resumo;
  var conteudo = requisicao.body.conteudo;

  inserir_post(titulo, resumo, conteudo, function (err) {
    if (err) {
      console.log(err);
      resposta.render('resposta', { status: 'Erro ao cadastrar o post!' });
    } else {
      resposta.redirect('/blog');
    }
  });
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
