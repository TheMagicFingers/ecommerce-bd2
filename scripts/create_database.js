/**
 * Created by barrett on 8/28/14.
 */

var mysql = require('mysql');
var dbconfig = require('../config/database');
const faker = require('faker')

var connection = mysql.createConnection(dbconfig.connection);

connection.query('CREATE DATABASE ' + dbconfig.database);
//Tabela de Usuarios
connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.users_table + '` ( \
  `id_cliente` INT NOT NULL AUTO_INCREMENT,\
  `nome_user` VARCHAR(45) NOT NULL,\
  `email_user` VARCHAR(45) NOT NULL,\
  `senha_user` VARCHAR(255) NOT NULL,\
   PRIMARY KEY (`id_cliente`) \
    )' );
//Tabela de produtos
connection.query('\
    CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.produtos_table + '` ( \
      `id_produtos` INT NOT NULL AUTO_INCREMENT,\
      `descricao` VARCHAR(255) NOT NULL,\
      `preco_unit` DECIMAL(5,2) NOT NULL,\
      `qtd_est` INT NOT NULL,\
      `url_img` VARCHAR(255) NOT NULL,\
       PRIMARY KEY (`id_produtos`) \
    )' );
//Tabela de Notas Fiscais
connection.query('\
    CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.notas_table + '` ( \
      `id_notas` INT NOT NULL AUTO_INCREMENT,\
      `data_compra` DATE NOT NULL,\
      `preco_unit` DECIMAL(5,2) NOT NULL,\
      `qtd_est` INT NOT NULL,\
      `url_img` VARCHAR(255) NOT NULL,\
       PRIMARY KEY (`id_notas`) \
    )' );
//Tabela de Endereco
connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.endereco_table + '` ( \
  `id_cliente` INT NOT NULL,\
  `rua` varchar(45) NOT NULL,\
  `logradouro` varchar(45) NOT NULL,\
  `numero` INT NOT NULL,\
  `cidade` varchar(45) NOT NULL,\
  `bairro` varchar(45) NOT NULL,\
  `estado` varchar(45) NOT NULL,\
   PRIMARY KEY (`id_cliente`), \
   foreign key (`id_cliente`) references `clientes`(`id_cliente`)\
)' );
//Tabela de Itens Nota
connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.itens_nota_table + '` ( \
  `qtd` INT NOT NULL,\
  `id_produtos` INT NOT NULL,\
  `id_notas` INT NOT NULL,\
   foreign key (`id_produtos`) references `produtos`(`id_produtos`),\
   foreign key (`id_notas`) references `notas`(`id_notas`)\
)' );
//Views

//Functions

//Procedures
connection.query(' \
CREATE  PROCEDURE `insert_user`(in nome varchar(45),in senha varchar(255),in email varchar(45), in ruav varchar(45),in cidadev varchar(45), \
		in logradourov varchar(45), in numerov varchar(45), in bairrov varchar(45), in estadov varchar(45))\
BEGIN\
			declare id int;\
			insert into `clientes`(`nome_user`,`senha_user`,`email_user`) values (nome,senha,email); \
      select last_insert_id() into id;\
      select id;\
      insert into endereco(`id_cliente`,`rua`,`logradouro`,`numero`,`cidade`,`bairro`,`estado`) values (id,ruav,cidadev,logradourov,numerov,bairrov,estadov);\
END \
');
//Triggers

//Seed for DB
// for(let i = 0 ; i < 20 ; i++){    
//     // Insere 20 Usuarios - Senha padrão 123
//     connection.query(`insert into clientes(nome_user,email_user,senha_user) values (
//         ${faker.fake("'{{name.findName}}','{{internet.email}}','123'")}
//     )`,(err,result) => {
//         if (err) throw err
//         console.log("seeded 20 users!!!")
//     })
//     // Insere 20 produtos
//     connection.query(`insert into produtos(descricao,preco_unit,qtd_est,url_img) values (
//         ${faker.fake("'{{commerce.productName}}','{{commerce.price}}',42,'https://tudoela.com/wp-content/uploads/2016/08/beneficios-da-melancia-810x540.jpg'")}
//     )`,(err,result) => {
//         if (err) throw err
//         console.log("seeded 20 users!!!")
//     })
//     //Insere vinte notas
//     connection.query(`insert into produtos(descricao,preco_unit,qtd_est,url_img) values (
//         ${faker.fake("'{{commerce.productName}}','{{commerce.price}}',42,'https://tudoela.com/wp-content/uploads/2016/08/beneficios-da-melancia-810x540.jpg'")}
//     )`,(err,result) => {
//         if (err) throw err
//         console.log("seeded 20 users!!!")
//     })

// }

console.log('Success: Database Created!')

connection.end();
