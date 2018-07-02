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
      `id_cliente` INT NOT NULL,\
      `data_compra` DATE NOT NULL,\
       PRIMARY KEY (`id_notas`,`id_cliente`), \
       foreign key (`id_cliente`) references `clientes`(`id_cliente`)\
    )' );
//Tabela de Endereco
connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.endereco_table + '` ( \
  `id_cliente` INT NOT NULL,\
  `rua` varchar(45) NOT NULL,\
  `logradouro` varchar(45) NOT NULL,\
  `numero` varchar(45) NOT NULL,\
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
//  connection.query(`
//   CREATE VIEW ${dbconfig.database}.Gastos_Clientes AS \
//   SELECT c.nome, SUM(p.preco*t.qtde) AS total_gasto
//   FROM clientes c INNER JOIN notas n ON c.id_cliente = n.id_cliente 
//   INNER JOIN itens_nota t ON t.id_notas = n.id_notas
//   INNER JOIN produtos p ON p.id_produtos = t.id_produtos 
//   WHERE c.cliente_id = n.id_cliente 
// )`);
//Functions

//Procedures
//Insere usuario
connection.query(' \
CREATE  PROCEDURE `' + dbconfig.database + '`.`insert_user`(in nome varchar(45),in senha varchar(255),in email varchar(45), in ruav varchar(45),in cidadev varchar(45), \
		in logradourov varchar(45), in numerov varchar(45), in bairrov varchar(45), in estadov varchar(45))\
BEGIN\
			declare id int;\
			insert into `clientes`(`nome_user`,`senha_user`,`email_user`) values (nome,senha,email); \
      select last_insert_id() into id;\
      select id;\
      insert into endereco(`id_cliente`,`rua`,`logradouro`,`numero`,`cidade`,`bairro`,`estado`) values (id,ruav,logradourov,numerov,cidadev,bairrov,estadov);\
END \
');
//procedure fazer venda
connection.query(`

CREATE PROCEDURE ${dbconfig.database}.insert_nota(in id_clientev int,in id_produtosv int,in qtd_compra int)
BEGIN
		declare id int;
		insert into notas(id_cliente,data_compra) values (id_clientev,curdate());
		select last_insert_id() into id;
		select id;
    insert into itens_nota(qtd,id_produtos,id_notas) values (qtd_compra,id_produtosv,id);
END 
`);
//retorna todas as notas de um cliente
connection.query(`
CREATE procedure ${dbconfig.database}.notas(in id INT)
BEGIN
		SELECT  p.descricao, t.qtd, p.preco_unit
    	FROM clientes c INNER JOIN notas n ON n.id_cliente = c.id_cliente
    	INNER JOIN itens_nota t ON t.id_notas = n.id_notas
    	INNER JOIN produtos p ON p.id_produtos = t.id_produtos
        where c.id_cliente = id;
END
`)
//Triggers
// connection.query(`
//   DELIMITER $
//   CREATE TRIGGER ${dbconfig.database}.Trg_atualiza_estoque AFTER INSERT
//   ON itens_nota
//   FOR EACH ROW
//   BEGIN
//     UPDATE produtos
//         SET qtd_est = qtd_est - 1
//         WHERE new.id_produtos = produtos.id_produtos;
//   END $
//   DELIMITER ;
// `);

console.log('Success: Database Created!')

connection.end();
