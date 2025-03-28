require("dotenv").config(); // Carrega variáveis de ambiente
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexão com o banco de dados (usando pool para melhor performance)
const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "login_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection((err) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err.message);
        process.exit(1); // Sai do processo caso a conexão falhe
    }
    console.log("Conectado ao banco de dados!");
});

// Rota para registrar um novo usuário
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Usuário e senha são obrigatórios" });
    }

    try {
        const hash = await bcrypt.hash(password, 10); // Criptografa a senha
        const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
        db.query(sql, [username, hash], (err) => {
            if (err) {
                console.error("Erro ao registrar usuário:", err.message);
                return res.status(500).json({ error: "Erro ao registrar usuário" });
            }
            res.json({ message: "Usuário registrado com sucesso!" });
        });
    } catch (error) {
        res.status(500).json({ error: "Erro ao processar o registro" });
    }
});

// Rota para login
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], async (err, results) => {
        if (err) {
            console.error("Erro ao realizar login:", err.message);
            return res.status(500).json({ error: "Erro no servidor" });
        }
        if (results.length === 0) {
            return res.status(401).json({ message: "Usuário não encontrado!" });
        }

        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password); // Compara senha criptografada

        if (passwordMatch) {
            res.json({ message: "Login bem-sucedido!" });
        } else {
            res.status(401).json({ message: "Credenciais inválidas!" });
        }
    });
});

// Rota para obter todos os usuários (sem exibir senhas)
app.get("/users", (req, res) => {
    const sql = "SELECT id, username FROM users";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Erro ao obter usuários:", err.message);
            return res.status(500).json({ error: "Erro ao buscar usuários" });
        }
        res.json(results);
    });
});

// AGENDAR VISITA

// Rota para criar agendamento
app.post("/agendar", (req, res) => {
    const { nome, email, data, horario, imovel } = req.body;

    if (!nome || !email || !data || !horario || !imovel) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    }

    const sql = "INSERT INTO agendamentos (nome, email, data, horario, imovel) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [nome, email, data, horario, imovel], (err) => {
        if (err) {
            console.error("Erro ao agendar visita:", err.message);
            return res.status(500).json({ error: "Erro ao agendar visita" });
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
            return res.status(500).json({ error: "Erro ao buscar agendamentos" });
        }
        res.json(results);
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
