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

var dbo = client.db('carros_bd');
var usuarios = dbo.collection('Usuarios');
var carros = dbo.collection('Carros');

var usuario_logado = '';

app.get('/', function (requisicao, resposta) {
  resposta.redirect('Projects.html');
});

app.get('/cadastrar_usuario', function (requisicao, resposta) {
  resposta.redirect('Cadastro.html');
});

app.post('/cadastrar_usuario', function (requisicao, resposta) {
  var data = { db_nome: requisicao.body.nome, db_login: requisicao.body.login, db_senha: requisicao.body.senha };

  usuarios.insertOne(data, function (err) {
    if (err) {
      console.log(err);
      resposta.render('resposta', { status: 'Erro ao cadastrar usuário!', link: '/cadastrar_usuario' });
    } else {
      resposta.render('resposta', { status: 'Usuário cadastrado com sucesso!', link: '/logar_usuario' });
    }
  });
});

app.get('/logar_usuario', function (requisicao, resposta) {
  resposta.redirect('Login.html');
});

app.post('/logar_usuario', function (requisicao, resposta) {
  var data = { db_login: requisicao.body.login, db_senha: requisicao.body.senha };

  usuarios.find(data).toArray(function (err, items) {
    if (err) {
      resposta.render('resposta', { status: 'Erro ao logar usuário!', link: '/logar_usuario' });
    } else if (items.length == 0) {
      resposta.render('resposta', { status: 'Usuário/senha não encontrado!', link: '/logar_usuario' });
    } else {
      usuario_logado = items[0].db_nome;
      resposta.redirect('/gerenciar');
    }
  });
});

app.get('/sair', function (requisicao, resposta) {
  usuario_logado = '';
  resposta.redirect('/carros');
});

app.get('/carros', function (requisicao, resposta) {
  carros.find({}).toArray(function (err, items) {
    if (err) {
      console.log(err);
      resposta.render('resposta', { status: 'Erro ao buscar os carros!', link: '/Projects.html' });
    } else {
      resposta.render('carros', { carros: items, usuario: usuario_logado });
    }
  });
});

app.get('/gerenciar', function (requisicao, resposta) {
  if (usuario_logado == '') {
    resposta.redirect('/logar_usuario');
    return;
  }

  carros.find({}).toArray(function (err, items) {
    if (err) {
      console.log(err);
      resposta.render('resposta', { status: 'Erro ao buscar os carros!', link: '/carros' });
    } else {
      resposta.render('gerenciar', { carros: items, usuario: usuario_logado });
    }
  });
});

app.post('/adicionar_carro', function (requisicao, resposta) {
  var data = {
    db_marca: requisicao.body.marca,
    db_modelo: requisicao.body.modelo,
    db_ano: Number(requisicao.body.ano),
    db_qtde: Number(requisicao.body.qtde)
  };

  carros.insertOne(data, function (err) {
    if (err) {
      console.log(err);
      resposta.render('resposta', { status: 'Erro ao adicionar carro!', link: '/gerenciar' });
    } else {
      resposta.redirect('/gerenciar');
    }
  });
});

app.post('/atualizar_carro', async function (requisicao, resposta) {
  var filtro = { _id: new mongodb.ObjectId(requisicao.body.id) };
  var newData = {
    $set: {
      db_marca: requisicao.body.marca,
      db_modelo: requisicao.body.modelo,
      db_ano: Number(requisicao.body.ano),
      db_qtde: Number(requisicao.body.qtde)
    }
  };

  try {
    const result = await carros.updateOne(filtro, newData);
    if (result.matchedCount == 0) {
      resposta.render('resposta', { status: 'Carro não encontrado!', link: '/gerenciar' });
    } else {
      resposta.redirect('/gerenciar');
    }
  } catch (err) {
    console.log(err);
    resposta.render('resposta', { status: 'Erro ao atualizar carro!', link: '/gerenciar' });
  }
});

app.post('/remover_carro', async function (requisicao, resposta) {
  var filtro = { _id: new mongodb.ObjectId(requisicao.body.id) };

  try {
    const result = await carros.deleteOne(filtro);
    if (result.deletedCount == 0) {
      resposta.render('resposta', { status: 'Carro não encontrado!', link: '/gerenciar' });
    } else {
      resposta.redirect('/gerenciar');
    }
  } catch (err) {
    console.log(err);
    resposta.render('resposta', { status: 'Erro ao remover carro!', link: '/gerenciar' });
  }
});

app.post('/vender_carro', async function (requisicao, resposta) {
  var filtro = { _id: new mongodb.ObjectId(requisicao.body.id), db_qtde: { $gt: 0 } };
  var newData = { $inc: { db_qtde: -1 } };
  var voltar = requisicao.body.voltar;

  try {
    const result = await carros.updateOne(filtro, newData);
    if (result.matchedCount == 0) {
      resposta.render('resposta', { status: 'Carro esgotado! Não há unidades disponíveis.', link: voltar });
    } else {
      resposta.redirect(voltar);
    }
  } catch (err) {
    console.log(err);
    resposta.render('resposta', { status: 'Erro ao vender carro!', link: voltar });
  }
});
