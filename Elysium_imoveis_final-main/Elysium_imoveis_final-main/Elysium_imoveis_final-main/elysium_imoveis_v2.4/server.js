const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexão com o banco de dados
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "login_db",
});

db.connect((err) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err.message);
        throw err;
    }
    console.log("Conectado ao banco de dados!");
});

// Rota para criar um novo usuário
app.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Verificar se username ou password estão vazios
    if (!username || !password) {
        return res.status(400).json({ message: "Usuário e senha são obrigatórios" });
    }

    const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            console.error("Erro ao registrar usuário:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Usuário registrado com sucesso!" });
    });
});

// Rota para login
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
    db.query(sql, [username, password], (err, results) => {
        if (err) {
            console.error("Erro ao realizar login", err.message);
            return res.status(500).json({ error: err.message });
        }
        if (results.length > 0) {
            res.json({ message: "Login bem-sucedido!" }); // Login válido
        } else {
            res.status(401).json({ message: "Credenciais inválidas!" }); // Falha no login
        }
    });
});

// Rota para obter todos os usuários
app.get("/users", (req, res) => {
    const sql = "SELECT id, username FROM users";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Erro ao obter usuários:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(results); // Retorna os usuários encontrados
    });
});


// AGENDAR VISITA


// Rota para criar agendamento
app.post("/agendar", (req, res) => {
    const { nome, email, data, horario, imovel } = req.body; // Adicione o campo "imovel"

    if (!nome || !email || !data || !horario || !imovel) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    }

    const sql = "INSERT INTO agendamentos (nome, email, data, horario, imovel) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [nome, email, data, horario, imovel], (err, result) => {
        if (err) {
            console.error("Erro ao agendar visita:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Visita agendada com sucesso!" });
    });
});

// Rota para obter agendamentos
app.get("/agendamentos", (req, res) => {
    const sql = "SELECT * FROM agendamentos ORDER BY created_at DESC";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Erro ao buscar agendamentos:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
