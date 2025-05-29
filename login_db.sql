create database login_db;

create table users (
	id int auto_increment primary key,
    username varchar(50) not null,
    password varchar(200) not null
);

insert into users (username, password) values ('admin', '');
insert into users (username, password) values ('usuario', '');

const bcrypt = require('bcrypt');
const mysql = require('mysql'); // ou o módulo que você estiver usando para conectar ao MySQL

/* Configuração da conexão com o banco de dados*/
const db = mysql.createConnection({
    host: 'localhost',
    user: 'seu_usuario',
    password: 'sua_senha',
    database: 'login_db'
});

/*Função para inserir usuários*/
async function insertUsers() {
    const users = [
        { username: 'admin', password: 'admin123' },
        { username: 'usuario', password: 'usuario123' }
    ];

    for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.password, 10); // Criptografa a senha
        const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
        
        db.query(sql, [user.username, hashedPassword], (err, results) => {
            if (err) {
                console.error('Erro ao inserir usuário:', err);
            } else {
                console.log(`Usuário ${user.username} inserido com sucesso!`);
            }
        });
    }
}

/*Conectar ao banco de dados e inserir usuários*/
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados.');
    insertUsers();
});


CREATE TABLE agendamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    data DATE NOT NULL,
    horario TIME NOT NULL,
    imovel VARCHAR(225) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
select * from agendamentos; 