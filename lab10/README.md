# Lab 10 - Banco de dados - Update e Delete

Sistema de venda de carros com Node.js, Express, EJS e MongoDB, na porta 80.

## Como rodar

Com o MongoDB rodando na máquina:

```
npm install
npm start
```

## Coleções

- `Usuarios`: nome, login e senha
- `Carros`: marca, modelo, ano e quantidade disponível

## Rotas

- `/` abre a página de projetos
- `/carros` lista os carros disponíveis
- `/cadastrar_usuario` e `/logar_usuario` cadastro e login
- `/gerenciar` adiciona, atualiza, vende e remove carros
