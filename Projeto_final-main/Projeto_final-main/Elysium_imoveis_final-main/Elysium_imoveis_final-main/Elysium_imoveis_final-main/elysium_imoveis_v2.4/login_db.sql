create database login_db;

create table users (
	id int auto_increment primary key,
    username varchar(50) not null,
    password varchar(200) not null
);

insert into users (username, password) values ('admin', '123456');
insert into users (username, password) values ('Lara', '123456');

CREATE TABLE agendamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    data DATE NOT NULL,
    horario TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
select * from agendamentos; 