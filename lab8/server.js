const express = require('express');
const path = require('path');

const app = express();
const PORTA = 80;

const usuarios = [];

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.redirect('/Projects.html');
});

app.get('/cadastra', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Cadastro.html'));
});

app.post('/cadastra', (req, res) => {
  const nome = (req.body.nome || '').trim();
  const email = (req.body.email || '').trim().toLowerCase();
  const senha = req.body.senha || '';

  if (!nome || !email || !senha) {
    return res.render('resposta', {
      sucesso: false,
      titulo: 'Cadastro não realizado',
      mensagem: 'Preencha todos os campos.',
      link: '/cadastra',
      textoLink: 'Voltar ao cadastro'
    });
  }

  if (usuarios.some(u => u.email === email)) {
    return res.render('resposta', {
      sucesso: false,
      titulo: 'Cadastro não realizado',
      mensagem: 'Já existe um usuário com esse e-mail.',
      link: '/cadastra',
      textoLink: 'Voltar ao cadastro'
    });
  }

  usuarios.push({ nome, email, senha });

  res.render('resposta', {
    sucesso: true,
    titulo: 'Cadastro realizado',
    mensagem: `Olá, ${nome}! Agora você já pode entrar.`,
    link: '/login',
    textoLink: 'Ir para o login'
  });
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Login.html'));
});

app.post('/login', (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const senha = req.body.senha || '';

  const usuario = usuarios.find(u => u.email === email && u.senha === senha);

  if (usuario) {
    res.render('resposta', {
      sucesso: true,
      titulo: 'Login realizado',
      mensagem: `Bem-vindo, ${usuario.nome}!`,
      link: '/Projects.html',
      textoLink: 'Ver projetos'
    });
  } else {
    res.render('resposta', {
      sucesso: false,
      titulo: 'Login não realizado',
      mensagem: 'E-mail ou senha incorretos.',
      link: '/login',
      textoLink: 'Tentar de novo'
    });
  }
});

app.listen(PORTA, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORTA}`);
});
